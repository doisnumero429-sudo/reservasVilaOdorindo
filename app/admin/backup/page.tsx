import EmConstrucao from '../EmConstrucao';
export default function Page() {
  return (
    <EmConstrucao
      titulo="Backup"
      descricao="Exportar e importar dados."
      itens={['Exportar reservas em CSV/JSON', 'Exportar configurações', 'Importar configurações', 'Restaurar padrão']}
    />
  );
}
