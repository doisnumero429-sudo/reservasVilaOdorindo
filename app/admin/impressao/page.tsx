import EmConstrucao from '../EmConstrucao';
export default function Page() {
  return (
    <EmConstrucao
      titulo="Impressão"
      descricao="Modelo de impressão 80mm configurável (tabela print_templates)."
      itens={['Mostrar logo (preto sólido ou original) e tamanho', 'QR Code e textos', 'Campos visíveis: setor, observação, funcionário, telefone, endereço, mesas', 'Tamanho do nome e das mesas', 'Impressão de teste']}
    />
  );
}
