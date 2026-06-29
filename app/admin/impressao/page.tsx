'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

const PADRAO: any = {
  show_logo: true, logo_solid_black: false, logo_original: true, logo_size: 120,
  show_qr: true, qr_own: true, welcome_text: 'Seja bem-vindo ao Villa Grill!',
  qr_caption: 'Siga @novovillagrill', footer: 'Obrigado pela preferência.',
  show_sector: true, show_notes: true, show_employee: true, show_phone: true,
  show_address: true, show_tables: true, name_size: 22, tables_size: 18, model: '80mm',
};

export default function ImpressaoPage() {
  const supabase = supabaseBrowser();
  const [rid, setRid] = useState<string | null>(null);
  const [tplId, setTplId] = useState<string | null>(null);
  const [cfg, setCfg] = useState<any>(PADRAO);
  const [rest, setRest] = useState<any>(null);
  const [msg, setMsg] = useState('');

  const carregar = useCallback(async () => {
    const { data: r } = await supabase.from('restaurants').select('*').limit(1).maybeSingle();
    setRest(r);
    setRid(r?.id || null);
    if (!r) return;
    const { data: tpl } = await supabase.from('print_templates').select('*').eq('restaurant_id', r.id).eq('active', true).maybeSingle();
    if (tpl) { setTplId(tpl.id); setCfg({ ...PADRAO, ...(tpl.config || {}) }); }
  }, [supabase]);

  useEffect(() => { carregar(); }, [carregar]);
  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 2500); }
  const set = (k: string, v: any) => setCfg({ ...cfg, [k]: v });

  async function salvar() {
    if (!rid) return;
    if (tplId) await supabase.from('print_templates').update({ config: cfg }).eq('id', tplId);
    else {
      const { data } = await supabase.from('print_templates').insert({ restaurant_id: rid, name: 'Padrão 80mm', active: true, config: cfg }).select().single();
      setTplId(data?.id || null);
    }
    flash('Modelo de impressão salvo.');
  }

  function imprimirTeste() {
    const ex = { nome: 'Maria Fernanda', data: '2026-06-29', horario: '20:00', pessoas: 4, setor: 'Setor do Palco', mesas: '12, 13', obs: 'Aniversário', func: 'Recepção' };
    const win = window.open('', '_blank', 'width=380,height=640');
    if (!win) return;
    const linha = (b: boolean, html: string) => (b ? html : '');
    win.document.write(`<html><head><title>Comanda</title><style>
      @page{size:80mm auto;margin:0}
      body{width:80mm;margin:0;padding:4mm;font-family:Arial,Helvetica,sans-serif;text-align:center;color:#000}
      .nome{font-size:${cfg.name_size}px;font-weight:bold;margin:6px 0}
      .mesas{font-size:${cfg.tables_size}px;font-weight:bold}
      hr{border:0;border-top:1px dashed #000;margin:8px 0}
      small{font-size:11px}
    </style></head><body>
      ${linha(cfg.show_logo, `<div style="font-weight:bold;font-size:${Math.round(cfg.logo_size/6)}px">${rest?.short_name || 'VILLA GRILL'}</div>`)}
      ${cfg.welcome_text ? `<small>${cfg.welcome_text}</small>` : ''}
      <hr>
      <div class="nome">${ex.nome}</div>
      <div>${ex.data.split('-').reverse().join('/')} às ${ex.horario} · ${ex.pessoas} pessoas</div>
      ${linha(cfg.show_sector, `<div>${ex.setor}</div>`)}
      ${linha(cfg.show_tables, `<div class="mesas">Mesas: ${ex.mesas}</div>`)}
      ${linha(cfg.show_notes, `<div><small>Obs.: ${ex.obs}</small></div>`)}
      ${linha(cfg.show_employee, `<div><small>Atendente: ${ex.func}</small></div>`)}
      <hr>
      ${linha(cfg.show_phone, `<small>${rest?.public_phone || ''}</small><br>`)}
      ${linha(cfg.show_address, `<small>${rest?.address || ''}</small>`)}
      ${cfg.show_qr ? `<div style="margin-top:8px">[ QR CODE ]<br><small>${cfg.qr_caption || ''}</small></div>` : ''}
      ${cfg.footer ? `<hr><small>${cfg.footer}</small>` : ''}
      <script>window.onload=()=>{window.print();}<\/script>
    </body></html>`);
    win.document.close();
  }

  const chk = (k: string, label: string) => (
    <label style={{ display: 'block', margin: '4px 0' }}>
      <input type="checkbox" checked={!!cfg[k]} onChange={(e) => set(k, e.target.checked)} /> {label}
    </label>
  );

  return (
    <AdminShell>
      <h1 className="adm-h1">Impressão</h1>
      <p className="adm-sub">Modelo de comanda 80mm. O mesmo formato de antes, agora configurável.</p>
      {msg && <div className="adm-msg ok">{msg}</div>}

      <div className="adm-card">
        <h2>Logo e QR Code</h2>
        {chk('show_logo', 'Mostrar logo')}
        {chk('logo_solid_black', 'Logo em preto sólido (melhor p/ impressora térmica)')}
        <label className="adm-label">Tamanho do logo</label>
        <input className="adm-input" style={{ maxWidth: 120 }} type="number" value={cfg.logo_size} onChange={(e) => set('logo_size', Number(e.target.value))} />
        {chk('show_qr', 'Mostrar QR Code')}
        <label className="adm-label">Texto abaixo do QR</label>
        <input className="adm-input" value={cfg.qr_caption || ''} onChange={(e) => set('qr_caption', e.target.value)} />
      </div>

      <div className="adm-card">
        <h2>Textos</h2>
        <label className="adm-label">Boas-vindas</label>
        <input className="adm-input" value={cfg.welcome_text || ''} onChange={(e) => set('welcome_text', e.target.value)} />
        <label className="adm-label">Rodapé</label>
        <input className="adm-input" value={cfg.footer || ''} onChange={(e) => set('footer', e.target.value)} />
      </div>

      <div className="adm-card">
        <h2>Campos visíveis</h2>
        <div className="adm-grid">
          <div>{chk('show_sector', 'Setor')}{chk('show_tables', 'Mesas')}{chk('show_notes', 'Observação')}</div>
          <div>{chk('show_employee', 'Funcionário')}{chk('show_phone', 'Telefone')}{chk('show_address', 'Endereço')}</div>
        </div>
        <div className="adm-grid">
          <div><label className="adm-label">Tamanho do nome</label><input className="adm-input" type="number" value={cfg.name_size} onChange={(e) => set('name_size', Number(e.target.value))} /></div>
          <div><label className="adm-label">Tamanho das mesas</label><input className="adm-input" type="number" value={cfg.tables_size} onChange={(e) => set('tables_size', Number(e.target.value))} /></div>
        </div>
      </div>

      <div className="adm-row">
        <button className="adm-btn gold" onClick={salvar}>Salvar modelo</button>
        <button className="adm-btn" onClick={imprimirTeste}>Impressão de teste</button>
      </div>
    </AdminShell>
  );
}
