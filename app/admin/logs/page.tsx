'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function LogsPage() {
  const supabase = supabaseBrowser();
  const [aba, setAba] = useState<'email' | 'ia' | 'auditoria'>('email');
  const [linhas, setLinhas] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const tabela = aba === 'email' ? 'email_logs' : aba === 'ia' ? 'ai_logs' : 'audit_logs';
      const { data } = await supabase.from(tabela).select('*').order('created_at', { ascending: false }).limit(100);
      setLinhas(data || []);
    })();
  }, [aba, supabase]);

  return (
    <AdminShell>
      <h1 className="adm-h1">Logs</h1>
      <p className="adm-sub">Histórico de e-mails, conversas da IA e alterações.</p>
      <div className="adm-card">
        <div className="adm-row" style={{ marginBottom: 12 }}>
          <button className={`adm-btn sm ${aba === 'email' ? 'gold' : ''}`} onClick={() => setAba('email')}>
            E-mails
          </button>
          <button className={`adm-btn sm ${aba === 'ia' ? 'gold' : ''}`} onClick={() => setAba('ia')}>
            IA (Lorena)
          </button>
          <button className={`adm-btn sm ${aba === 'auditoria' ? 'gold' : ''}`} onClick={() => setAba('auditoria')}>
            Auditoria
          </button>
        </div>
        {linhas.length === 0 ? (
          <p className="adm-sub">Sem registros ainda.</p>
        ) : (
          <table className="adm-table">
            <tbody>
              {linhas.map((l) => (
                <tr key={l.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(l.created_at).toLocaleString('pt-BR')}</td>
                  <td>
                    {aba === 'email' && `${l.type} → ${(l.recipients || []).join(', ')} [${l.status}] ${l.subject || ''}`}
                    {aba === 'ia' && `(${l.cascade_step}${l.selected_model ? ' · ' + l.selected_model : ''}) "${l.user_message}" → "${(l.assistant_message || '').slice(0, 80)}"`}
                    {aba === 'auditoria' && `${l.area || ''} · ${l.action || ''}`}
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
