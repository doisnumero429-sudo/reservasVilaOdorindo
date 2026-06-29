import EmConstrucao from '../EmConstrucao';
export default function Page() {
  return (
    <EmConstrucao
      titulo="Cardápio"
      descricao="Categorias e itens (tabelas menu_categories e menu_items)."
      itens={['Categorias e itens', 'Preço, descrição, variação', 'Disponibilidade e destaque', 'Foto', 'Importar / exportar']}
    />
  );
}
