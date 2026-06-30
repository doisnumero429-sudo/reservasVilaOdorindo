'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

const STATUS: Record<string, string> = {
  novo: 'Novo', em_analise: 'Em análise', aguardando_cliente: 'Aguardando cliente',
  respondido: 'Respondido', resolvido: 'Resolvido', arquivado: 'Arquivado',
};
const PRIO: Record<string, string> = { alta: 'tag cancelled', média: 'tag pending', baixa: 'tag' };

function waLink(phone: string, msg?: string) {
  let d = (phone || '').replace(/\D/g, '');
  if (d && !d.startsWith('55')) d = '55' + d;
  return `https://wa.me/${d}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
}

export default function FeedbackPage() {
  const supabase = supabaseBrowser();
  const [lista, setLista] = useState<any[]>([]);
  const [anexos, setAnexos] = useState<Record<string, any[]>>({});
  const [aberta, setAberta] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [busca, setBusca] = useState('');

  const carregar = useCallback(async () => {
    const { data } = await supabase.from('customer_feedback').select('*').order('created_at', { ascending: false }).limit(300);
    setLista(data || []);
  }, [supabase]);
  useEffect(() => { carregar(); }, [carregar]);

  async function abrir(id: string) {
    if (aberta === id) { setAberta(null); return; }
    setAberta(id);
    if (!anexos[id]) {
      const { data } = await supabase.from('customer_feedback_attachments').select('*').eq('feedback_id', id);
      setAnexos((a) => ({ ...a, [id]: data || [] }));
    }
  }
  async function mudarStatus(id: string, status: string) {
    await supabase.from('customer_feedback').update({ status }).eq('id', id);
    carregar();
  }

  const filtradas = lista.filter((r) => {
    if (filtro && r.status !== filtro) return false;
    if (busca) { const t = `${r.nome_cliente} ${r.whatsapp_cliente} ${r.protocolo} ${r.categoria}`.toLowerCase(); if (!t.includes(busca.toLowerCase())) return false; }
    return true;
  });

  const msgAdmin = (r: any) => `Olá, ${r.nome_cliente || ''}. Aqui é do Villa Grill 1, unidade Odorindo Perenha. Recebemos sua manifestação de protocolo ${r.protocolo} e estamos entrando em contato para entender melhor e dar atenção ao seu relato.`;

  return (
    <AdminShell>
      <h1 className="adm-h1">Reclamações e Sugestões</h1>
      <p className="adm-sub">Manifestações recebidas pelo Bento (Villa Grill 1 — Odorindo Perenha).</p>

      <div className="adm-card">
        <div className="adm-row">
          <input className="adm-input" style={{ maxWidth: 280 }} placeholder="Buscar por nome, protocolo, WhatsApp" value={busca} onChange={(e) => setBusca(e.target.value)} />
          <select className="adm-select" style={{ maxWidth: 200 }} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="">Todos os status</option>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="adm-btn sm" onClick={carregar}>Atualizar</button>
        </div>
      </div>

      <div className="adm-card">
        {filtradas.length === 0 ? <p className="adm-sub">Nenhuma manifestação ainda.</p> : (
          <table className="adm-table">
            <thead><tr><th>Protocolo</th><th>Data</th><th>Cliente</th><th>Tipo/Categoria</th><th>Prioridade</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtradas.map((r) => (
                <Fragment key={r.id}>
                  <tr>
                    <td>{r.protocolo}</td>
                    <td>{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>{r.nome_cliente || '—'}<br /><a href={waLink(r.whatsapp_cliente)} target="_blank" rel="noreferrer">{r.whatsapp_cliente}</a></td>
                    <td>{r.tipo_manifestacao}<br /><span className="adm-sub">{r.categoria}</span></td>
                    <td><span className={PRIO[r.prioridade] || 'tag'}>{r.prioridade}</span></td>
                    <td>
                      <select className="adm-select" style={{ maxWidth: 160 }} value={r.status} onChange={(e) => mudarStatus(r.id, e.target.value)}>
                        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td><button className="adm-btn sm" onClick={() => abrir(r.id)}>{aberta === r.id ? 'Fechar' : 'Detalhes'}</button></td>
                  </tr>
                  {aberta === r.id && (
                    <tr><td colSpan={7} style={{ background: '#0b0907' }}>
                      <div className="adm-grid">
                        <div>
                          <p className="adm-sub" style={{ whiteSpace: 'pre-wrap' }}>{r.relato_organizado || r.relato_original}</p>
                          <div className="adm-row" style={{ marginTop: 8 }}>
                            <a className="adm-btn sm gold" href={waLink(r.whatsapp_cliente, msgAdmin(r))} target="_blank" rel="noreferrer">Chamar no WhatsApp</a>
                            <button className="adm-btn sm" onClick={() => { navigator.clipboard?.writeText(msgAdmin(r)); }}>Copiar mensagem</button>
                          </div>
                        </div>
                        <div>
                          <label className="adm-label">Informações</label>
                          <p className="adm-sub" style={{ lineHeight: 1.7 }}>
                            {r.data_ocorrido && <>Data: {r.data_ocorrido}<br /></>}
                            {(r.horario_ocorrido || r.periodo) && <>Horário/período: {r.horario_ocorrido || r.periodo}<br /></>}
                            {r.canal && <>Canal: {r.canal}<br /></>}
                            {(r.mesa_numero || r.mesa_referencia) && <>Mesa/Local: {r.mesa_numero ? 'mesa ' + r.mesa_numero : r.mesa_referencia}<br /></>}
                            {r.valor_cobrado && <>Valor cobrado: {r.valor_cobrado}<br /></>}
                            {r.valor_esperado && <>Valor esperado: {r.valor_esperado}<br /></>}
                            {r.forma_pagamento && <>Pagamento: {r.forma_pagamento}<br /></>}
                            {r.expectativa_cliente && <>Expectativa: {r.expectativa_cliente}<br /></>}
                          </p>
                          {(anexos[r.id] || []).length > 0 && (
                            <>
                              <label className="adm-label">Imagens</label>
                              <div className="adm-row">
                                {(anexos[r.id] || []).map((a) => (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <a key={a.id} href={a.file_url} target="_blank" rel="noreferrer"><img src={a.file_url} alt="anexo" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} /></a>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td></tr>
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
