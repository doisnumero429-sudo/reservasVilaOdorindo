import './admin.css';

// O admin depende de sessão/dados em tempo real — não deve ser pré-gerado estaticamente.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Administrador — Villa Grill', robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
