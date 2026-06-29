import EmConstrucao from '../EmConstrucao';
export default function Page() {
  return (
    <EmConstrucao
      titulo="Eventos especiais"
      descricao="Datas com regra diferente (tabela special_events)."
      itens={['Nome, data e período', 'Regra do evento', 'Mensagem pública e mensagem da Lorena', 'Banner', 'Bloquear reservas / mostrar aviso']}
    />
  );
}
