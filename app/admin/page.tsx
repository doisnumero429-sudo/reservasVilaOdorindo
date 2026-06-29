'use client';

import { useEffect, useState } from 'react';
import AdminShell from './AdminShell';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function DashboardPage() {
  const [stats, setStats] = useState({ pendentes: 0, hoje: 0, reclamacoes: 0 });
  const [nome, setNome] = useState('');

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: admin } = await supabase
        .from('admin_users')
        .select('name')
        .eq('auth_user_id', user?.id)
        .maybeSingle();
      setNome(admin?.name || user?.email || '');

      const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
      const [{ count: pend }, { count: dia }, { count: recl }] = await Promise.all([
        supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('reservation_date', hoje),
        supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'nova'),
      ]);
      setStats({ pendentes: pend || 0, hoje: dia || 0, reclamacoes: recl || 0 });
    })();
  }, []);

  return (
    <AdminShell>
      <h1 className="adm-h1">Painel</h1>
      <p className="adm-sub">Bem-vindo{nome ? ', ' + nome : ''}. Central de reservas do Villa Grill.</p>
      <div className="adm-stat">
        <div className="box">
          <b>{stats.pendentes}</b>
          <span>Reservas pendentes</span>
        </div>
        <div className="box">
          <b>{stats.hoje}</b>
          <span>Reservas de hoje</span>
        </div>
        <div className="box">
          <b>{stats.reclamacoes}</b>
          <span>Reclamações novas</span>
        </div>
      </div>
      <div className="adm-card" style={{ marginTop: 18 }}>
        <h2>Atalhos</h2>
        <div className="adm-row">
          <a className="adm-btn" href="/admin/reservas">Ver reservas</a>
          <a className="adm-btn" href="/admin/emails">E-mails e Alertas</a>
          <a className="adm-btn" href="/admin/ia">Configurar Lorena</a>
        </div>
      </div>
    </AdminShell>
  );
}
