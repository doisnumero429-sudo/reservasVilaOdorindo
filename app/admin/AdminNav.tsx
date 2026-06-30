'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

const LINKS = [
  ['/admin', 'Painel'],
  ['/admin/reservas', 'Reservas'],
  ['/admin/feedback', 'Reclamações e Sugestões'],
  ['/admin/reclamacoes', 'Reclamações (antigas)'],
  ['/admin/bloqueios', 'Bloqueios'],
  ['/admin/eventos', 'Eventos'],
  ['/admin/cardapio', 'Cardápio'],
  ['/admin/emails', 'E-mails e Alertas'],
  ['/admin/ia', 'IA (Lorena)'],
  ['/admin/impressao', 'Impressão'],
  ['/admin/configuracoes', 'Configurações'],
  ['/admin/personalizacao', 'Personalização'],
  ['/admin/usuarios', 'Usuários'],
  ['/admin/logs', 'Logs'],
  ['/admin/backup', 'Backup'],
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await supabaseBrowser().auth.signOut();
    router.push('/admin/login');
  }

  return (
    <aside className="adm-side">
      <div className="adm-brand">
        Villa Grill
        <small>Administrador</small>
      </div>
      <nav className="adm-nav">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
            {label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: '14px 10px' }}>
        <button className="adm-btn sm" onClick={logout}>
          Sair
        </button>
      </div>
    </aside>
  );
}
