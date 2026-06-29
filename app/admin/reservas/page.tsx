'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Reserva = {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_whatsapp: string;
  people_count: number;
  reservation_date: string;
  period: string;
  reservation_time: string;
  status: string;
  assigned_tables: string | null;
  internal_notes: string | null;
  customer_notes: string | null;
  sectors?: { public_name: string } | null;
};

const STATUS: Record<string, string> = {
  pending: 'Pendente',
  checking: 'Em verificação',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  no_response: 'Não respondeu',
  waitlist: 'Lista de espera',
};

function waLink(phone: string) {
  let d = (phone || '').replace(/\D/g, '');
  if (d && !d.startsWith('55')) d = '55' + d;
  return `https://wa.me/${d}`;
}

export default function ReservasPage() {
  const supabase = supabaseBrowser();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [aberta, setAberta] = useState<string | null>(null);
  const [historico, setHistorico] = useState<any[]>([]);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const { data } = await supabase
      .from('reservations')
      .select('*, sectors(public_name)')
      .order('reservation_date', { ascending: false })
      .order('reservation_time', { ascending: true })
      .limit(300);
    setReservas((data as Reserva[]) || []);
    setCarregando(false);
  }, [supabase]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function registrarHistorico(r: Reserva, action: string, oldV: any, newV: any) {
    await supabase.from('reservation_history').insert({
      reservation_id: r.id,
      restaurant_id: r.restaurant_id,
      action,
      old_value: oldV,
      new_value: newV,
    });
  }

  async function mudarStatus(r: Reserva, status: string) {
    const patch: any = { status, updated_at: new Date().toISOString() };
    if (status === 'confirmed') patch.confirmed_at = new Date().toISOString();
    if (status === 'cancelled') patch.cancelled_at = new Date().toISOString();
    await supabase.from('reservations').update(patch).eq('id', r.id);
    await registrarHistorico(r, 'status', { status: r.status }, { status });
    if (aberta === r.id) abrirHistorico(r.id);
    carregar();
  }

  async function salvarCampo(r: Reserva, campo: string, valor: string) {
    const antes = (r as any)[campo] || '';
    if (antes === valor) return;
    await supabase.from('reservations').update({ [campo]: valor }).eq('id', r.id);
    await registrarHistorico(r, campo, { [campo]: antes }, { [campo]: valor });
  }

  async function abrirHistorico(id: string) {
    if (aberta === id) {
      setAberta(null);
      return;
    }
    setAberta(id);
    const { data } = await supabase
      .from('reservation_history')
      .select('*')
      .eq('reservation_id', id)
      .order('created_at', { ascending: false });
    setHistorico(data || []);
  }

  async function reenviarEmail(id: string) {
    await fetch('/api/email/reservation-created', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  }

  const filtradas = reservas.filter((r) => {
    if (filtro && r.status !== filtro) return false;
    if (busca) {
      const t = (r.customer_name + ' ' + r.customer_whatsapp).toLowerCase();
      if (!t.includes(busca.toLowerCase())) return false;
    }
    return true;
  });

  function descreveHistorico(h: any) {
    if (h.action === 'status') return `Status: ${STATUS[h.old_value?.status] || h.old_value?.status || '—'} → ${STATUS[h.new_value?.status] || h.new_value?.status}`;
    if (h.action === 'created') return 'Pré-reserva criada pelo site';
    if (h.action === 'assigned_tables') return `Mesas: "${h.old_value?.assigned_tables || ''}" → "${h.new_value?.assigned_tables || ''}"`;
    if (h.action === 'internal_notes') return 'Observação interna atualizada';
    return h.action;
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">Reservas</h1>
      <p className="adm-sub">Confirme, cancele, defina mesas, veja o histórico e fale com o cliente.</p>

      <div className="adm-card">
        <div className="adm-row">
          <input
            className="adm-input"
            style={{ maxWidth: 280 }}
            placeholder="Buscar por nome ou WhatsApp"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select className="adm-select" style={{ maxWidth: 200 }} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="">Todos os status</option>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button className="adm-btn sm" onClick={carregar}>
            Atualizar
          </button>
        </div>
      </div>

      <div className="adm-card">
        {carregando ? (
          <p className="adm-sub">Carregando...</p>
        ) : filtradas.length === 0 ? (
          <p className="adm-sub">Nenhuma reserva encontrada.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Cliente</th>
                <th>Pessoas</th>
                <th>Setor</th>
                <th>Mesas</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((r) => (
                <Fragment key={r.id}>
                  <tr>
                    <td>
                      {r.reservation_date.split('-').reverse().join('/')}
                      <br />
                      {r.reservation_time} · {r.period === 'almoco' ? 'Almoço' : 'Noite'}
                    </td>
                    <td>
                      {r.customer_name}
                      <br />
                      <a href={waLink(r.customer_whatsapp)} target="_blank" rel="noreferrer">
                        {r.customer_whatsapp}
                      </a>
                      {r.customer_notes && <div className="adm-sub" style={{ margin: '4px 0 0' }}>“{r.customer_notes}”</div>}
                    </td>
                    <td>{r.people_count}</td>
                    <td>{r.sectors?.public_name || '—'}</td>
                    <td>
                      <input
                        className="adm-input"
                        style={{ maxWidth: 90, padding: '5px 8px' }}
                        defaultValue={r.assigned_tables || ''}
                        placeholder="ex: 12,13"
                        onBlur={(e) => salvarCampo(r, 'assigned_tables', e.target.value)}
                      />
                    </td>
                    <td>
                      <span className={`tag ${r.status === 'confirmed' ? 'confirmed' : r.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                        {STATUS[r.status] || r.status}
                      </span>
                    </td>
                    <td>
                      <div className="adm-row" style={{ gap: 6 }}>
                        <button className="adm-btn sm gold" onClick={() => mudarStatus(r, 'confirmed')}>
                          Confirmar
                        </button>
                        <button className="adm-btn sm" onClick={() => mudarStatus(r, 'cancelled')}>
                          Cancelar
                        </button>
                        <button className="adm-btn sm" onClick={() => mudarStatus(r, 'no_response')}>
                          Não respondeu
                        </button>
                        <button className="adm-btn sm" onClick={() => mudarStatus(r, 'waitlist')}>
                          Lista de espera
                        </button>
                        <button className="adm-btn sm" onClick={() => abrirHistorico(r.id)}>
                          {aberta === r.id ? 'Fechar' : 'Detalhes'}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {aberta === r.id && (
                    <tr>
                      <td colSpan={7} style={{ background: '#0b0907' }}>
                        <div className="adm-grid">
                          <div>
                            <label className="adm-label">Observação interna (só a equipe vê)</label>
                            <textarea
                              className="adm-textarea"
                              defaultValue={r.internal_notes || ''}
                              onBlur={(e) => salvarCampo(r, 'internal_notes', e.target.value)}
                            />
                            <div className="adm-row">
                              <button className="adm-btn sm" onClick={() => reenviarEmail(r.id)}>Reenviar e-mail</button>
                            </div>
                          </div>
                          <div>
                            <label className="adm-label">Histórico</label>
                            {historico.length === 0 ? (
                              <p className="adm-sub">Sem registros.</p>
                            ) : (
                              <ul className="adm-sub" style={{ lineHeight: 1.8, paddingLeft: 16 }}>
                                {historico.map((h) => (
                                  <li key={h.id}>
                                    {new Date(h.created_at).toLocaleString('pt-BR')} — {descreveHistorico(h)}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
