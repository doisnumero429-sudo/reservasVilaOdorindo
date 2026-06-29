import AdminShell from './AdminShell';

/** Tela base de uma área do admin que será completada na próxima etapa. */
export default function EmConstrucao({ titulo, descricao, itens }: { titulo: string; descricao: string; itens: string[] }) {
  return (
    <AdminShell>
      <h1 className="adm-h1">{titulo}</h1>
      <p className="adm-sub">{descricao}</p>
      <div className="adm-card">
        <h2>O que esta tela vai controlar</h2>
        <ul className="adm-sub" style={{ lineHeight: 1.9 }}>
          {itens.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="adm-sub" style={{ marginTop: 10 }}>
          A estrutura de dados (tabela no Supabase) já existe. Os controles desta tela serão ligados na próxima etapa.
        </p>
      </div>
    </AdminShell>
  );
}
