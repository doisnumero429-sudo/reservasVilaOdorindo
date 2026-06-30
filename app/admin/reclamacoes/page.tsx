'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

const STATUS: Record<string, string> = { nova: 'Nova', em_analise: 'Em análise', resolvida: 'Resolvida' };

export default function ReclamacoesPage() {
  const supabase = supabaseBrowser();
  const [lista, setLista] = useState<any[]>([]);

  const carregar = useCallback(async () => {
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false }).limit(200);
    setLista(data || []);
  }, [supabase]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function mudar(id: string, status: string) {
    const patch: any = { status };
    if (status === 'resolvida') patch.resolved_at = new Date().toISOString();
    await supabase.from('complaints').update(patch).eq('id', id);
    carregar();
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">Reclamações</h1>
      <p className="adm-sub">Relatos que o Bento acolheu. A equipe é avisada por e-mail.</p>
      <div className="adm-card">
        {lista.length === 0 ? (
          <p className="adm-sub">Nenhuma reclamação registrada.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Relato</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    {r.customer_name || '—'}
                    <br />
                    {r.customer_whatsapp || ''}
                  </td>
                  <td style={{ maxWidth: 360 }}>{r.message}</td>
                  <td>
                    <span className="tag">{STATUS[r.status] || r.status}</span>
                  </td>
                  <td>
                    <div className="adm-row" style={{ gap: 6 }}>
                      <button className="adm-btn sm" onClick={() => mudar(r.id, 'em_analise')}>
                        Em análise
                      </button>
                      <button className="adm-btn sm gold" onClick={() => mudar(r.id, 'resolvida')}>
                        Resolvida
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
