import EmConstrucao from '../EmConstrucao';
export default function Page() {
  return (
    <EmConstrucao
      titulo="Bloqueios"
      descricao="Bloquear data, período ou setor (tabela reservation_blocks)."
      itens={['Criar bloqueio por data', 'Por período (almoço/noite/todos)', 'Por setor', 'Mensagem pública e motivo interno']}
    />
  );
}
