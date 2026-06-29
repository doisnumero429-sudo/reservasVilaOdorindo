-- =====================================================================
--  VILLA GRILL — Completa o cardápio com campos ricos (acompanha, porção, destaque)
--  Rode no SQL Editor DEPOIS de já ter rodado seed_menu.sql.
--  Atualiza os itens existentes (não duplica). Pode rodar de novo.
-- =====================================================================
do $$
declare rid uuid;
begin
  select id into rid from public.restaurants where slug = 'villa-grill';

  update public.menu_items mi set accompaniments = ARRAY['Legumes salteados','Arroz branco']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Individuais' and mi.name = 'Salmão Grelhado' and mi.variation is null;
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Individuais' and mi.name = 'Filé Mignon à Parmegiana' and mi.variation is null;
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Mandioca cozida','Salada']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Individuais' and mi.name = 'Bife Ancho' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frios' and mi.name = 'Tábua de Frios | 600 gramas' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frios' and mi.name = 'Provolone Misto | 250 gramas' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frios' and mi.name = 'Mista | 200 gramas' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frios' and mi.name = 'Salame com Azeitona | 100 gramas' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Picanha Aperitivo' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Filé Mignon Acebolado Aperitivo' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Carne Seca Acebolada' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Porção do Villa' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Linguiça Picante com Mandioca Frita' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Provolone à Milanesa' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Calabresa Acebolada' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Torresminho' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Bolinho de Cupim' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Bolinho de Cabotiã com Carne Seca' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Bolinho de Mandioca com Linguiça Picante' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Mix de Bolinho' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Pastelzinho' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Lombinho ao Sal Preto' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Carpaccio' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Canapé de Carpaccio' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Sashimi de Tilápia' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Frango à Passarinho Completo' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Frango à Passarinho Simples' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Frango Crocante' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Isca de Frango' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Tilápia St. Peter à Dorê com Batata Frita' and mi.variation = 'Meia';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Tilápia St. Peter à Dorê com Batata Frita' and mi.variation = 'Inteira';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Tilápia St. Peter à Dorê' and mi.variation = 'Meia';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Tilápia St. Peter à Dorê' and mi.variation = 'Inteira';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Batata com Muçarela e Bacon' and mi.variation = 'Meia';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Batata com Muçarela e Bacon' and mi.variation = 'Inteira';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Batata com Cheddar e Bacon' and mi.variation = 'Meia';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Batata com Cheddar e Bacon' and mi.variation = 'Inteira';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Batata Frita' and mi.variation = 'Meia';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Batata Frita' and mi.variation = 'Inteira';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Mandioca Cremosa' and mi.variation = 'Meia';
  update public.menu_items mi set serving_note = '2 a 3 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Porções' and mi.name = 'Mandioca Cremosa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz à grega']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frango' and mi.name = 'Filé de Frango com Legumes na Manteiga' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz à grega']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frango' and mi.name = 'Filé de Frango com Legumes na Manteiga' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz à grega','Batata à dorê']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frango' and mi.name = 'Filé de Frango do Cheff' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz à grega','Batata à dorê']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frango' and mi.name = 'Filé de Frango do Cheff' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frango' and mi.name = 'Filé de Frango à Parmegiana' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frango' and mi.name = 'Filé de Frango à Parmegiana' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frango' and mi.name = 'Filé de Frango ao Creme de Milho' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Frango' and mi.name = 'Filé de Frango ao Creme de Milho' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Peixe' and mi.name = 'Filé de St. Peter à Parmegiana' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Peixe' and mi.name = 'Filé de St. Peter à Parmegiana' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Peixe' and mi.name = 'Tábua de Peixes' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Peixe' and mi.name = 'Tábua de Peixes' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Peixe' and mi.name = 'Tilápia Completa' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco','Batata frita']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Peixe' and mi.name = 'Tilápia Completa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Peixe' and mi.name = 'Tilápia à Jardineira' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Batata sauté','Arroz branco']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Peixe' and mi.name = 'Tilápia ao Molho de Camarão' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Filé Mignon' and mi.name = 'Filé à Portuguesa' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Filé Mignon' and mi.name = 'Filé à Portuguesa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Batata frita']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Filé Mignon' and mi.name = 'Filé à Cubana (à Milanesa ou Chapeado)' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Batata frita']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Filé Mignon' and mi.name = 'Filé à Cubana (à Milanesa ou Chapeado)' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz com alho-poró e bacon']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Filé Mignon' and mi.name = 'Filé Mignon Villa Grill' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz com alho-poró e bacon']::text[], serving_note = 'meia serve 2; inteira serve 2 a 3'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Filé Mignon' and mi.name = 'Filé Mignon Villa Grill' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz branco']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Filé Mignon' and mi.name = 'Filé Napolitano' and mi.variation is null;
  update public.menu_items mi set accompaniments = ARRAY['Torradas']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Filé Mignon' and mi.name = 'Filé Mignon com Fonduta de Queijo' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Massas' and mi.name = 'Espaguete à Bolonhesa' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Massas' and mi.name = 'Espaguete ao Sugo' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Massas' and mi.name = 'Talharim do Chefe' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Massas' and mi.name = 'Fettuccine Alfredo' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Massas' and mi.name = 'Espaguete à Carbonara' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Risotos e Arroz' and mi.name = 'Parmesão com Ragu de Cupim' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Risotos e Arroz' and mi.name = 'Filé Mignon' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Risotos e Arroz' and mi.name = 'Camarão' and mi.variation is null;
  update public.menu_items mi set serving_note = '2 pessoas'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Risotos e Arroz' and mi.name = 'Arroz Tropical' and mi.variation is null;
  update public.menu_items mi set serving_note = 'individual'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Caldos' and mi.name = 'Caldo de Mandioca com Cupim' and mi.variation is null;
  update public.menu_items mi set serving_note = 'individual'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Caldos' and mi.name = 'Caldo Verde' and mi.variation is null;
  update public.menu_items mi set serving_note = 'individual'
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Caldos' and mi.name = 'Creme de Palmito' and mi.variation is null;
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[], featured = true
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim Completo' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[], featured = true
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim Completo' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[], featured = true
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim Simples' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[], featured = true
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim Simples' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Fritas' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Fritas' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Catupiry e Alho' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Catupiry e Alho' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Frango Grelhado' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Costela' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Fraldinha' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Maminha Angus 1953' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Maminha Angus 1953, Catupiry e Alho' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Contra-Filé' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Cupim Casqueirado' and mi.name = 'Cupim com Picanha Fatiada' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Picanha Maturatta' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Picanha Maturatta' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Bife Ancho na Brasa' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Bife Ancho na Brasa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Maminha Angus 1953' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Maminha Angus 1953' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Maminha Angus 1953 com Catupiry e Alho' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Maminha Angus 1953 com Catupiry e Alho' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Filé Mignon com Catupiry na Brasa' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Filé Mignon com Catupiry na Brasa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Alcatra Maturatta' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Alcatra Maturatta' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Contra-Filé na Brasa' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Contra-Filé na Brasa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Fraldinha na Brasa' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Fraldinha na Brasa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Costela no Bafo' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Costela no Bafo' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Copa Lombo na Brasa' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Copa Lombo na Brasa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Frango na Brasa' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Churrasqueira' and mi.name = 'Frango na Brasa' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Tábuas de Carnes' and mi.name = 'Tábua de Carnes Mista' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Tábuas de Carnes' and mi.name = 'Tábua de Carnes Mista' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Tábuas de Carnes' and mi.name = 'Tábua de Carnes Premium' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Tábuas de Carnes' and mi.name = 'Tábua de Carnes Premium' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Tábuas de Carnes' and mi.name = 'Tábua de Carnes Gold' and mi.variation = 'Meia';
  update public.menu_items mi set accompaniments = ARRAY['Arroz','Mandioca cozida','Salada','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Tábuas de Carnes' and mi.name = 'Tábua de Carnes Gold' and mi.variation = 'Inteira';
  update public.menu_items mi set accompaniments = ARRAY['Mandioca cozida','Molho batido','Vinagrete','Farofa']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Aperitivos da Brasa' and mi.name = 'Linguiça Cuiabana Aperitivo' and mi.variation is null;
  update public.menu_items mi set accompaniments = ARRAY['Mandioca cozida','Molho batido']::text[]
    from public.menu_categories mc
    where mi.category_id = mc.id and mc.restaurant_id = rid
      and mc.name = 'Aperitivos da Brasa' and mi.name = 'Panceta na Brasa Aperitivo' and mi.variation is null;

  -- deixa a Lorena mais 'falante' (respostas mais ricas)
  update public.ai_settings set max_tokens = 700
    where restaurant_id = rid and max_tokens < 700;

  raise notice 'Cardápio enriquecido com sucesso.';
end $$;
