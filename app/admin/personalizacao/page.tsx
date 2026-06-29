'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

const SLOTS: { type: string; label: string; hint: string }[] = [
  { type: 'logo_principal', label: 'Logo principal', hint: 'Usado no topo do site.' },
  { type: 'logo_impressao', label: 'Logo de impressão', hint: 'Versão para a comanda 80mm (preto sólido funciona melhor).' },
  { type: 'qr_code', label: 'QR Code', hint: 'Aponta para o Instagram/WhatsApp.' },
  { type: 'fundo', label: 'Fundo', hint: 'Imagem de fundo do site.' },
  { type: 'avatar_lorena', label: 'Avatar da Lorena', hint: 'Foto da atendente no chat.' },
  { type: 'mapa', label: 'Mapa dos setores', hint: 'Mapa usado na tela de reserva.' },
];

export default function PersonalizacaoPage() {
  const supabase = supabaseBrowser();
  const [rid, setRid] = useState<string | null>(null);
  const [assets, setAssets] = useState<Record<string, any>>({});
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const [subindo, setSubindo] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    const { data: r } = await supabase.from('restaurants').select('id').limit(1).maybeSingle();
    setRid(r?.id || null);
    if (!r) return;
    const { data } = await supabase.from('assets').select('*').eq('restaurant_id', r.id);
    const map: Record<string, any> = {};
    (data || []).forEach((a) => { map[a.type] = a; });
    setAssets(map);
  }, [supabase]);

  useEffect(() => { carregar(); }, [carregar]);
  function flash(t: string, ok = true) { setMsg({ t, ok }); setTimeout(() => setMsg(null), 4000); }

  async function enviar(type: string, file: File) {
    if (!rid) return;
    setSubindo(type);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `${rid}/${type}-${Date.now()}.${ext}`;
      const up = await supabase.storage.from('assets').upload(path, file, { upsert: true });
      if (up.error) throw up.error;
      const { data: pub } = supabase.storage.from('assets').getPublicUrl(path);
      const url = pub.publicUrl;

      const existente = assets[type];
      if (existente) {
        await supabase.from('assets').update({ public_url: url, storage_path: path, name: file.name }).eq('id', existente.id);
        // remove o arquivo antigo do storage (best-effort)
        if (existente.storage_path && existente.storage_path !== path) {
          supabase.storage.from('assets').remove([existente.storage_path]).catch(() => {});
        }
      } else {
        await supabase.from('assets').insert({ restaurant_id: rid, type, name: file.name, storage_path: path, public_url: url });
      }
      flash('Imagem enviada!');
      carregar();
    } catch (err: any) {
      flash('Erro ao enviar: ' + (err?.message || err), false);
    } finally {
      setSubindo(null);
    }
  }

  async function remover(type: string) {
    const a = assets[type];
    if (!a) return;
    if (a.storage_path) await supabase.storage.from('assets').remove([a.storage_path]).catch(() => {});
    await supabase.from('assets').delete().eq('id', a.id);
    flash('Imagem removida.');
    carregar();
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">Personalização</h1>
      <p className="adm-sub">Troque as imagens do site sem mexer no código. (Rode antes o supabase/storage.sql.)</p>
      {msg && <div className={`adm-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.t}</div>}

      <div className="adm-grid">
        {SLOTS.map((s) => {
          const a = assets[s.type];
          return (
            <div className="adm-card" key={s.type}>
              <h2>{s.label}</h2>
              <p className="adm-sub" style={{ marginTop: -4 }}>{s.hint}</p>
              {a?.public_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.public_url} alt={s.label} style={{ maxWidth: '100%', maxHeight: 140, borderRadius: 10, border: '1px solid var(--linha)', background: '#fff' }} />
              ) : (
                <p className="adm-sub">Nenhuma imagem enviada (usando a do site).</p>
              )}
              <div className="adm-row" style={{ marginTop: 10 }}>
                <label className="adm-btn sm gold" style={{ cursor: 'pointer' }}>
                  {subindo === s.type ? 'Enviando...' : 'Enviar imagem'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) enviar(s.type, f); e.target.value = ''; }}
                  />
                </label>
                {a && <button className="adm-btn sm" onClick={() => remover(s.type)}>Remover</button>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="adm-card">
        <p className="adm-sub">
          As imagens enviadas ficam guardadas no Supabase e disponíveis publicamente pela URL.
          Para aplicá-las em pontos específicos do site (ex.: trocar a logo do topo), me avise
          qual ponto — a ligação de cada imagem ao seu lugar no site é o passo seguinte.
        </p>
      </div>
    </AdminShell>
  );
}
