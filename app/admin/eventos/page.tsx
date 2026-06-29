'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

const VAZIO = { title: '', event_date: '', period: 'todos', public_message: '', assistant_message: '', block_reservations: false, show_public_notice: true, active: true };

export default function EventosPage() {
  const supabase = supabaseBrowser();
  const [rid, setRid] = useState<string | null>(null);
  const [eventos, setEventos] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ ...VAZIO });
  const [msg, setMsg] = useState('');

  const carregar = useCallback(async () => {
    const { data: r } = await supabase.from('restaurants').select('id').limit(1).maybeSingle();
    setRid(r?.id || null);
    if (!r) return;
    const { data } = await supabase.from('special_events').select('*').eq('restaurant_id', r.id).order('event_date', { ascending: true });
    setEventos(data || []);
  }, [supabase]);

  useEffect(() => { carregar(); }, [carregar]);
  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 3000); }

  async function adicionar() {
    if (!rid || !form.title) return flash('Informe o nome do evento.');
    await supabase.from('special_events').insert({ restaurant_id: rid, ...form, event_date: form.event_date || null });
    setForm({ ...VAZIO });
    flash('Evento salvo.');
    carregar();
  }
  async function alternar(id: string, campo: string, valor: boolean) {
    await supabase.from('special_events').update({ [campo]: valor }).eq('id', id);
    carregar();
  }
  async function remover(id: string) {
    await supabase.from('special_events').delete().eq('id', id);
    carregar();
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">Eventos especiais</h1>
      <p className="adm-sub">Datas com regra diferente (ex.: show, feriado, festa).</p>
      {msg && <div className="adm-msg ok">{msg}</div>}

      <div className="adm-card">
        <h2>Novo evento</h2>
        <div className="adm-grid">
          <div><label className="adm-label">Nome</label><input className="adm-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="adm-label">Data</label><input className="adm-input" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
          <div><label className="adm-label">Período</label>
            <select className="adm-select" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
              <option value="todos">Todos</option><option value="almoco">Almoço</option><option value="noite">Noite</option>
            </select>
          </div>
        </div>
        <label className="adm-label">Mensagem pública (aviso no site)</label>
        <textarea className="adm-textarea" value={form.public_message} onChange={(e) => setForm({ ...form, public_message: e.target.value })} />
        <label className="adm-label">Mensagem da Lorena (o que ela fala sobre o evento)</label>
        <textarea className="adm-textarea" value={form.assistant_message} onChange={(e) => setForm({ ...form, assistant_message: e.target.value })} />
        <div className="adm-row">
          <label><input type="checkbox" checked={form.show_public_notice} onChange={(e) => setForm({ ...form, show_public_notice: e.target.checked })} /> Mostrar aviso no site</label>
          <label><input type="checkbox" checked={form.block_reservations} onChange={(e) => setForm({ ...form, block_reservations: e.target.checked })} /> Bloquear reservas neste dia</label>
        </div>
        <div style={{ marginTop: 14 }}><button className="adm-btn gold" onClick={adicionar}>Adicionar evento</button></div>
      </div>

      <div className="adm-card">
        <h2>Eventos cadastrados</h2>
        {eventos.length === 0 ? <p className="adm-sub">Nenhum evento.</p> : (
          <table className="adm-table">
            <thead><tr><th>Data</th><th>Nome</th><th>Aviso</th><th>Bloqueia</th><th>Ativo</th><th></th></tr></thead>
            <tbody>
              {eventos.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.event_date ? ev.event_date.split('-').reverse().join('/') : '—'}</td>
                  <td>{ev.title}</td>
                  <td><input type="checkbox" checked={!!ev.show_public_notice} onChange={(e) => alternar(ev.id, 'show_public_notice', e.target.checked)} /></td>
                  <td><input type="checkbox" checked={!!ev.block_reservations} onChange={(e) => alternar(ev.id, 'block_reservations', e.target.checked)} /></td>
                  <td><input type="checkbox" checked={!!ev.active} onChange={(e) => alternar(ev.id, 'active', e.target.checked)} /></td>
                  <td><button className="adm-btn sm" onClick={() => remover(ev.id)}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
