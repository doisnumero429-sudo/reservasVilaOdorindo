import EmConstrucao from '../EmConstrucao';
export default function Page() {
  return (
    <EmConstrucao
      titulo="Configurações"
      descricao="Dados da unidade, regras de reserva e setores (restaurants, reservation_rules, sectors)."
      itens={['Nome, WhatsApp, telefone, endereço, mapa, Instagram, fuso', 'Almoço/noite, dias, horários, tolerância, mín/máx pessoas, grupo grande', 'Setores: criar, renomear, ativar, capacidade, ordem']}
    />
  );
}
