'use client';

import { useState } from 'react';
import AdminShell from '../AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

function baixar(nome: string, conteudo: string, tipo: string) {
  const blob = new Blob([conteudo], { type: tipo });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  a.click();
  URL.revokeObjectURL(a.href);
}

function paraCSV(linhas: any[]): string {
  if (!linhas.length) return '';
  const cols = Object.keys(linhas[0]);
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.join(','), ...linhas.map((l) => cols.map((c) => esc(l[c])).join(','))].join('\n');
}

export default function BackupPage() {
  const supabase = supabaseBrowser();
  const [msg, setMsg] = useState('');
  const hoje = new Date().toISOString().slice(0, 10);
  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 3000); }

  async function exportarReservasJSON() {
    const { data } = await supabase.from('reservations').select('*').order('reservation_date', { ascending: false });
    baixar(`reservas-${hoje}.json`, JSON.stringify(data || [], null, 2), 'application/json');
    flash('Reservas exportadas (JSON).');
  }
  async function exportarReservasCSV() {
    const { data } = await supabase.from('reservations').select('*').order('reservation_date', { ascending: false });
    baixar(`reservas-${hoje}.csv`, paraCSV(data || []), 'text/csv');
    flash('Reservas exportadas (CSV).');
  }
  async function exportarReclamacoesCSV() {
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    baixar(`reclamacoes-${hoje}.csv`, paraCSV(data || []), 'text/csv');
    flash('Reclamações exportadas (CSV).');
  }
  async function exportarConfiguracoes() {
    const [rest, rules, sectors, email, ai, prints, settings, templates] = await Promise.all([
      supabase.from('restaurants').select('*'),
      supabase.from('reservation_rules').select('*'),
      supabase.from('sectors').select('*'),
      supabase.from('email_settings').select('*'),
      supabase.from('ai_settings').select('*'),
      supabase.from('print_templates').select('*'),
      supabase.from('restaurant_settings').select('*'),
      supabase.from('message_templates').select('*'),
    ]);
    const dump = {
      exportado_em: new Date().toISOString(),
      restaurants: rest.data, reservation_rules: rules.data, sectors: sectors.data,
      email_settings: email.data, ai_settings: ai.data, print_templates: prints.data,
      restaurant_settings: settings.data, message_templates: templates.data,
    };
    baixar(`configuracoes-villa-grill-${hoje}.json`, JSON.stringify(dump, null, 2), 'application/json');
    flash('Configurações exportadas (JSON).');
  }

  return (
    <AdminShell>
      <h1 className="adm-h1">Backup</h1>
      <p className="adm-sub">Baixe cópias dos seus dados. Guarde em local seguro.</p>
      {msg && <div className="adm-msg ok">{msg}</div>}

      <div className="adm-card">
        <h2>Reservas</h2>
        <div className="adm-row">
          <button className="adm-btn" onClick={exportarReservasCSV}>Exportar CSV (planilha)</button>
          <button className="adm-btn" onClick={exportarReservasJSON}>Exportar JSON</button>
        </div>
      </div>

      <div className="adm-card">
        <h2>Reclamações</h2>
        <button className="adm-btn" onClick={exportarReclamacoesCSV}>Exportar CSV</button>
      </div>

      <div className="adm-card">
        <h2>Configurações</h2>
        <p className="adm-sub">Inclui unidade, regras, setores, e-mails, IA, impressão e mensagens.</p>
        <button className="adm-btn gold" onClick={exportarConfiguracoes}>Exportar todas as configurações (JSON)</button>
      </div>

      <div className="adm-card">
        <h2>Restaurar padrão</h2>
        <p className="adm-sub">
          Para restaurar o padrão de fábrica, rode novamente os arquivos <b>seed.sql</b> e
          <b> seed_menu.sql</b> no Supabase (eles não apagam o que já existe; recriam o que falta).
        </p>
      </div>
    </AdminShell>
  );
}
