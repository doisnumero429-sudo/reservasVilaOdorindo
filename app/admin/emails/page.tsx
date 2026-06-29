'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Settings = {
  id?: string;
  from_email: string;
  from_name: string;
  provider: string;
  reservation_recipients: string[];
  complaint_recipients: string[];
  daily_report_recipients: string[];
  reservation_email_enabled: boolean;
  complaint_email_enabled: boolean;
  daily_report_enabled: boolean;
  daily_report_time: string;
  timezone: string;
};

const VAZIO: Settings = {
  from_email: '',
  from_name: 'Villa Grill',
  provider: 'resend',
  reservation_recipients: [],
  complaint_recipients: [],
  daily_report_recipients: [],
  reservation_email_enabled: true,
  complaint_email_enabled: true,
  daily_report_enabled: true,
  daily_report_time: '10:00',
  timezone: 'America/Sao_Paulo',
};

function Lista({
  titulo,
  campo,
  emails,
  onAdd,
  onRemove,
  enabled,
  onToggle,
  onTest,
}: any) {
  const [novo, setNovo] = useState('');
  return (
    <div className="adm-card">
      <h2>{titulo}</h2>
      <div className="adm-row">
        <input
          className="adm-input"
          style={{ maxWidth: 320 }}
          placeholder="email@exemplo.com"
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
        />
        <button
          className="adm-btn"
          onClick={() => {
            if (novo.trim()) {
              onAdd(campo, novo.trim());
              setNovo('');
            }
          }}
        >
          Adicionar
        </button>
      </div>
      <div className="adm-pill-list">
        {emails.length === 0 && <span className="adm-sub">Nenhum e-mail cadastrado.</span>}
        {emails.map((e: string) => (
          <span className="adm-pill" key={e}>
            {e}
            <button onClick={() => onRemove(campo, e)} title="Remover">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="adm-row">
        <label>
          <input type="checkbox" checked={enabled} onChange={onToggle} /> Aviso ativado
        </label>
        <button className="adm-btn sm" onClick={() => onTest(emails)}>
          Enviar teste
        </button>
      </div>
    </div>
  );
}

export default function EmailsPage() {
  const supabase = supabaseBrowser();
  const [s, setS] = useState<Settings>(VAZIO);
  const [msg, setMsg] = useState('');
  const [rid, setRid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: rest } = await supabase.from('restaurants').select('id').limit(1).maybeSingle();
      setRid(rest?.id || null);
      const { data } = await supabase.from('email_settings').select('*').maybeSingle();
      if (data) setS({ ...VAZIO, ...data });
    })();
  }, [supabase]);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(''), 3500);
  }

  async function persist(next: Settings) {
    setS(next);
    if (!rid) return;
    const { id, ...rest } = next;
    await supabase.from('email_settings').upsert({ restaurant_id: rid, ...rest }, { onConflict: 'restaurant_id' });
  }

  const onAdd = (campo: keyof Settings, email: string) => {
    const lista = (s[campo] as string[]) || [];
    if (lista.includes(email)) return;
    persist({ ...s, [campo]: [...lista, email] });
  };
  const onRemove = (campo: keyof Settings, email: string) => {
    persist({ ...s, [campo]: (s[campo] as string[]).filter((e) => e !== email) });
  };

  async function teste(emails: string[]) {
    if (!emails.length) return flash('Cadastre um e-mail antes de testar.');
    const r = await fetch('/api/email/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: emails }),
    }).then((r) => r.json());
    flash(r.ok ? 'E-mail de teste enviado!' : 'Falha: ' + (r.reason || r.error));
  }

  async function relatorioTeste() {
    const r = await fetch('/api/email/daily-report', { method: 'POST' }).then((r) => r.json());
    flash(r.ok ? 'Relatório de hoje enviado!' : 'Falha: ' + (r.reason || r.error || 'verifique destinatários'));
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">E-mails e Alertas</h1>
      <p className="adm-sub">Cadastre os e-mails que já existem (seu Gmail, gerente, recepção). Eles recebem os avisos.</p>
      {msg && <div className="adm-msg ok">{msg}</div>}

      <Lista
        titulo="1. Novas reservas"
        campo="reservation_recipients"
        emails={s.reservation_recipients}
        onAdd={onAdd}
        onRemove={onRemove}
        enabled={s.reservation_email_enabled}
        onToggle={() => persist({ ...s, reservation_email_enabled: !s.reservation_email_enabled })}
        onTest={teste}
      />

      <Lista
        titulo="2. Reclamações"
        campo="complaint_recipients"
        emails={s.complaint_recipients}
        onAdd={onAdd}
        onRemove={onRemove}
        enabled={s.complaint_email_enabled}
        onToggle={() => persist({ ...s, complaint_email_enabled: !s.complaint_email_enabled })}
        onTest={teste}
      />

      <div className="adm-card">
        <h2>3. Relatório diário</h2>
        <Lista
          titulo=""
          campo="daily_report_recipients"
          emails={s.daily_report_recipients}
          onAdd={onAdd}
          onRemove={onRemove}
          enabled={s.daily_report_enabled}
          onToggle={() => persist({ ...s, daily_report_enabled: !s.daily_report_enabled })}
          onTest={teste}
        />
        <div className="adm-row">
          <div>
            <label className="adm-label">Horário (fuso America/Sao_Paulo)</label>
            <input
              className="adm-input"
              style={{ maxWidth: 120 }}
              value={s.daily_report_time}
              onChange={(e) => persist({ ...s, daily_report_time: e.target.value })}
            />
          </div>
          <button className="adm-btn sm" onClick={relatorioTeste} style={{ alignSelf: 'flex-end' }}>
            Enviar relatório de teste
          </button>
        </div>
        <p className="adm-sub" style={{ marginTop: 8 }}>
          O envio automático roda todo dia às 10:00 (configurado no Vercel Cron).
        </p>
      </div>

      <div className="adm-card">
        <h2>4. Remetente técnico</h2>
        <p className="adm-sub">
          Estes dados são usados apenas para o sistema conseguir enviar os e-mails. Os avisos chegam nos e-mails cadastrados acima.
        </p>
        <div className="adm-grid">
          <div>
            <label className="adm-label">E-mail remetente</label>
            <input
              className="adm-input"
              value={s.from_email}
              onChange={(e) => persist({ ...s, from_email: e.target.value })}
              placeholder="onboarding@resend.dev"
            />
          </div>
          <div>
            <label className="adm-label">Nome do remetente</label>
            <input className="adm-input" value={s.from_name} onChange={(e) => persist({ ...s, from_name: e.target.value })} />
          </div>
        </div>
        <p className="adm-sub" style={{ marginTop: 8 }}>Provedor: Resend (configurado por variável de ambiente).</p>
      </div>
    </AdminShell>
  );
}
