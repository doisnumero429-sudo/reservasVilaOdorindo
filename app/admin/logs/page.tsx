'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

function normaliza(s: string) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

export default function LogsPage() {
  const supabase = supabaseBrowser();
  const [aba, setAba] = useState<'email' | 'ia' | 'auditoria'>('email');
  const [linhas, setLinhas] = useState<any[]>([]);
  const [met, setMet] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const tabela = aba === 'email' ? 'email_logs' : aba === 'ia' ? 'ai_logs' : 'audit_logs';
      const { data } = await supabase.from(tabela).select('*').order('created_at', { ascending: false }).limit(100);
      setLinhas(data || []);
    })();
  }, [aba, supabase]);

  // métricas do chat (últimos registros da IA)
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('ai_logs').select('cascade_step,fallback_used,feedback,user_message,created_at').order('created_at', { ascending: false }).limit(1000);
      const logs = data || [];
      const total = logs.length;
      const porEtapa: Record<string, number> = {};
      const contagem: Record<string, number> = {};
      let up = 0, down = 0, semHumano = 0;
      const naoSoube: string[] = [];
      logs.forEach((l: any) => {
        porEtapa[l.cascade_step] = (porEtapa[l.cascade_step] || 0) + 1;
        if (l.feedback === 'up') up++;
        if (l.feedback === 'down') down++;
        if (!['fallback', 'ratelimited'].includes(l.cascade_step)) semHumano++;
        else if (l.cascade_step === 'fallback' && l.user_message) naoSoube.push(l.user_message);
        const k = normaliza(l.user_message);
        if (k.length >= 3) contagem[k] = (contagem[k] || 0) + 1;
      });
      const top = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 8);
      setMet({ total, porEtapa, up, down, semHumano, taxa: total ? Math.round((semHumano / total) * 100) : 0, top, naoSoube: naoSoube.slice(0, 8) });
    })();
  }, [supabase]);

  return (
    <AdminShell>
      <h1 className="adm-h1">Logs e Métricas</h1>
      <p className="adm-sub">Desempenho da Lorena, histórico de e-mails, conversas e alterações.</p>

      {met && (
        <>
          <div className="adm-stat" style={{ marginBottom: 16 }}>
            <div className="box"><b>{met.total}</b><span>Conversas (recentes)</span></div>
            <div className="box"><b>{met.taxa}%</b><span>Resolvido sem humano</span></div>
            <div className="box"><b>{(met.porEtapa.cache || 0) + (met.porEtapa.faq || 0)}</b><span>Respostas sem custo (cache/FAQ)</span></div>
            <div className="box"><b>👍 {met.up} · 👎 {met.down}</b><span>Feedback</span></div>
          </div>
          <div className="adm-grid">
            <div className="adm-card">
              <h2>Perguntas mais comuns</h2>
              {met.top.length === 0 ? <p className="adm-sub">Sem dados ainda.</p> : (
                <ul className="adm-sub" style={{ lineHeight: 1.8 }}>
                  {met.top.map(([q, n]: any) => <li key={q}>{q} <b>({n})</b></li>)}
                </ul>
              )}
            </div>
            <div className="adm-card">
              <h2>Onde a Lorena não soube</h2>
              {met.naoSoube.length === 0 ? <p className="adm-sub">Nenhuma — ótimo sinal! 🎉</p> : (
                <ul className="adm-sub" style={{ lineHeight: 1.8 }}>
                  {met.naoSoube.map((q: string, i: number) => <li key={i}>{q}</li>)}
                </ul>
              )}
              <p className="adm-sub" style={{ marginTop: 8 }}>Dica: cadastre essas perguntas na <b>Base de conhecimento</b> (tela IA).</p>
            </div>
          </div>
        </>
      )}
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
