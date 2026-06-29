import AdminNav from './AdminNav';

/** Layout interno do admin: menu lateral + conteúdo. Usado por todas as telas (menos o login). */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-wrap">
      <AdminNav />
      <main className="adm-main">{children}</main>
    </div>
  );
}
