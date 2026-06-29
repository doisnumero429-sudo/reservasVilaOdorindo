import EmConstrucao from '../EmConstrucao';
export default function Page() {
  return (
    <EmConstrucao
      titulo="Personalização"
      descricao="Imagens e textos do site (tabela assets + restaurant_settings)."
      itens={['Logo principal e de impressão', 'QR Code', 'Fundo, avatar da Lorena, mapa', 'Fotos do cardápio e banners']}
    />
  );
}
