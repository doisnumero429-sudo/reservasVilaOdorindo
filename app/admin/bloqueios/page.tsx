'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function BloqueiosPage() {
  const supabase = supabaseBrowser();
  const [rid, setRid] = useState<string | null>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ block_date: '', period: 'todos', sector_id: '', reason_internal: '', public_message: '' });
  const [msg, setMsg] = useState('');

  const carregar = useCallback(async () => {
    const { data: r } = await supabase.from('restaurants').select('id').limit(1).maybeSingle();
    setRid(r?.id || null);
    if (!r) return;
    const { data: sec } = await supabase.from('sectors').select('id,public_name').eq('restaurant_id', r.id).order('sort_order');
    setSectors(sec || []);
    const { data: bl } = await supabase.from('reservation_blocks').select('*, sectors(public_name)').eq('restaurant_id', r.id).order('block_date', { ascending: true });
    setBlocks(bl || []);
  }, [supabase]);

  useEffect(() => { carregar(); }, [carregar]);
  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 3000); }

  async function adicionar() {
    if (!rid || !form.block_date) return flash('Escolha uma data.');
    await supabase.from('reservation_blocks').insert({
      restaurant_id: rid,
      block_date: form.block_date,
      period: form.period,
      sector_id: form.sector_id || null,
      reason_internal: form.reason_internal || null,
      public_message: form.public_message || null,
      block_type: 'manual',
    });
    setForm({ block_date: '', period: 'todos', sector_id: '', reason_internal: '', public_message: '' });
    flash('Bloqueio salvo.');
    carregar();
  }
  async function remover(id: string) {
    await supabase.from('reservation_blocks').delete().eq('id', id);
    carregar();
  }

  const periodLabel: Record<string, string> = { todos: 'Todos', almoco: 'Almoço', noite: 'Noite' };

  return (
    <AdminShell>
      <h1 className="adm-h1">Bloqueios</h1>
      <p className="adm-sub">Impeça reservas em datas, períodos ou setores específicos.</p>
      {msg && <div className="adm-msg ok">{msg}</div>}

      <div className="adm-card">
        <h2>Novo bloqueio</h2>
        <div className="adm-grid">
          <div><label className="adm-label">Data</label><input className="adm-input" type="date" value={form.block_date} onChange={(e) => setForm({ ...form, block_date: e.target.value })} /></div>
          <div><label className="adm-label">Período</label>
            <select className="adm-select" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
              <option value="todos">Todos</option><option value="almoco">Almoço</option><option value="noite">Noite</option>
            </select>
          </div>
          <div><label className="adm-label">Setor (opcional)</label>
            <select className="adm-select" value={form.sector_id} onChange={(e) => setForm({ ...form, sector_id: e.target.value })}>
              <option value="">Todos os setores</option>
              {sectors.map((s) => <option key={s.id} value={s.id}>{s.public_name}</option>)}
            </select>
          </div>
        </div>
        <label className="adm-label">Motivo interno (só a equipe vê)</label>
        <input className="adm-input" value={form.reason_internal} onChange={(e) => setForm({ ...form, reason_internal: e.target.value })} />
        <label className="adm-label">Mensagem pública (o que o cliente vê ao tentar reservar)</label>
        <input className="adm-input" value={form.public_message} onChange={(e) => setForm({ ...form, public_message: e.target.value })} />
        <div style={{ marginTop: 14 }}><button className="adm-btn gold" onClick={adicionar}>Adicionar bloqueio</button></div>
      </div>

      <div className="adm-card">
        <h2>Bloqueios cadastrados</h2>
        {blocks.length === 0 ? <p className="adm-sub">Nenhum bloqueio.</p> : (
          <table className="adm-table">
            <thead><tr><th>Data</th><th>Período</th><th>Setor</th><th>Mensagem pública</th><th></th></tr></thead>
            <tbody>
              {blocks.map((b) => (
                <tr key={b.id}>
                  <td>{b.block_date.split('-').reverse().join('/')}</td>
                  <td>{periodLabel[b.period] || b.period}</td>
                  <td>{b.sectors?.public_name || 'Todos'}</td>
                  <td>{b.public_message || '—'}</td>
                  <td><button className="adm-btn sm" onClick={() => remover(b.id)}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
