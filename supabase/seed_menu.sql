-- =====================================================================
--  VILLA GRILL — CARDÁPIO (gerado a partir do site original)
--  Rode DEPOIS de schema.sql e seed.sql, no SQL Editor do Supabase.
--  Só insere se o cardápio ainda estiver vazio (pode rodar de novo sem duplicar).
-- =====================================================================
do $$
declare rid uuid; cid uuid;
begin
  select id into rid from public.restaurants where slug = 'villa-grill';
  if exists (select 1 from public.menu_items where restaurant_id = rid) then
    raise notice 'Cardápio já existe — nada a fazer.';
    return;
  end if;

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Sucos', 1, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Limão', 'Copo', 8, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Limão', 'Jarra', 17, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Abacaxi', 'Copo', 13, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Abacaxi', 'Jarra', 25, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Acerola', 'Copo', 13, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Acerola', 'Jarra', 25, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Caju', 'Copo', 13, null, 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Caju', 'Jarra', 25, null, 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Laranja', 'Copo', 13, null, 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Laranja', 'Jarra', 25, null, 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Morango', 'Copo', 13, null, 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Morango', 'Jarra', 25, null, 12, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Abacaxi com Hortelã', 'Copo', 13, null, 13, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Abacaxi com Hortelã', 'Jarra', 25, null, 14, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Acerola com Laranja', 'Copo', 13, null, 15, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Acerola com Laranja', 'Jarra', 25, null, 16, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maracujá', 'Copo', 13, null, 17, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maracujá', 'Jarra', 25, null, 18, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Sodas Italianas', 2, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tangerina', 'Padrão', 18, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maçã Verde', 'Padrão', 18, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Limão Siciliano', 'Padrão', 18, null, 3, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Não alcoólicos', 3, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Coca-Cola', 'KS', 6, 'Original ou Zero', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Coca-Cola', 'Lata', 8, 'Original ou Zero', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Coca-Cola', '600 ml', 13, 'Original ou Zero', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Fanta', 'KS', 6, 'Laranja Original, Laranja Zero ou Uva', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Fanta', 'Lata', 8, 'Laranja Original, Laranja Zero ou Uva', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Fanta', '600 ml', 13, 'Laranja Original, Laranja Zero ou Uva', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Sprite', 'KS', 6, 'Original ou Zero', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Sprite', 'Lata', 8, 'Original ou Zero', 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Sprite', '600 ml', 13, 'Original ou Zero', 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Guaraná Antárctica', 'Lata', 8, 'Original ou Zero', 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Guaraná Antárctica', '600 ml', 13, 'Original ou Zero', 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Schweppes Tônica', 'Lata', 8, 'Tônica ou Citrus', 12, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Água Tônica Antárctica', 'Lata', 8, 'Original ou Zero', 13, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Red Bull', 'Lata', 16, null, 14, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Água', '500 ml', 5, null, 15, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Água com gás', '500 ml', 7, null, 16, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'H2O', '500 ml', 10, 'Original ou Limoneto', 17, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Cervejas 600 ml', 4, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Corona', 'Garrafa 600 ml', 19, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Heineken', 'Garrafa 600 ml', 18, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Stella', 'Garrafa 600 ml', 16, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brahma', 'Garrafa 600 ml', 13, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Antarctica', 'Garrafa 600 ml', 13, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Skol', 'Garrafa 600 ml', 13, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Eisenbahn', 'Garrafa 600 ml', 12, null, 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Império', 'Garrafa 600 ml', 13, null, 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Original', 'Garrafa 600 ml', 14, null, 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Spaten', 'Garrafa 600 ml', 14, null, 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Amstel', 'Garrafa 600 ml', 13, null, 11, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Long Neck', 5, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Corona', 'Padrão', 15, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Corona Cero', 'Padrão', 15, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Stella Pure Gold', 'Padrão', 13, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Heineken', 'Padrão', 15, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Heineken Zero', 'Padrão', 15, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brahma Malzbier', 'Padrão', 14, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Budweiser', 'Padrão', 13, null, 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Budweiser Zero', 'Padrão', 13, null, 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Amstel Ultra', 'Padrão', 12, null, 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Império Ultra', 'Padrão', 12, null, 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Smirnoff Ice', 'Padrão', 12, null, 11, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Chopp', 6, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brahma', '340 ml', 12, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brahma', '500 ml', 16, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Heineken', '340 ml', 14, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Heineken', '500 ml', 18, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Vinho', '340 ml', 14, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Vinho', '500 ml', 18, null, 6, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Drinks Clássicos', 7, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mojito', 'Padrão', 29, 'Rum blanc, limão, xarope de açúcar, água com gás e hortelã.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Garibaldi', 'Padrão', 29, 'Campari e suco de laranja.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Sex On The Beach', 'Padrão', 29, 'Vodka, licor de pêssego, suco de laranja, suco de cranberry, gelo e fruta para decorar.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Moscow Mule', 'Padrão', 26, 'Vodka, xarope de gengibre, limão e espuma de gengibre.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Danoninho', 'Padrão', 29, 'Vodka, morango, leite condensado, grenadine e chantilly.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Piña Colada', 'Padrão', 29, 'Rum, leite de coco, leite condensado e abacaxi.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Aperol Spritz', 'Padrão', 33, 'Aperol, bitter de laranja, vinho espumante e água com gás.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Margarita', 'Padrão', 32, 'Tequila, suco de limão, licor fino de laranja e borda de sal.', 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Negroni', 'Padrão', 32, 'Gin, Campari, vermute rosso e casca de laranja.', 9, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Drinks com Gin', 8, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Gin & Tônica', 'Padrão', 30, 'Gin, limão e tônica.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Leblon Gin Tônica', 'Padrão', 35, 'Limão siciliano, pimenta rosa e hortelã.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Realeza Gin Tônica', 'Padrão', 35, 'Xarope de morango, gin, água tônica, morango e canela.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Gin Tropical', 'Padrão', 35, 'Gin, Red Bull tropical, maracujá, hortelã e limão siciliano em rodelas.', 4, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Drinks Não Alcoólicos', 9, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Moskow sem Mula', 'Padrão', 26, 'Limão-taiti, xarope de gengibre, água com gás e espuma cítrica de gengibre.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Batidinha', 'Padrão', 24, 'Morango, H2O e leite condensado.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'La Belle de Jour', 'Padrão', 22, 'Morangos macerados, H2O limão, xarope de curaçau blue e laranja.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Pink Lemonade', 'Padrão', 22, 'Limão-taiti, xarope de grenadine, água com gás, cereja e hortelã.', 4, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Caipirinhas', 10, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Limão', 'Cachaça', 20, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Abacaxi', 'Cachaça', 22, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maracujá', 'Cachaça', 22, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tangerina com Maracujá', 'Cachaça', 23, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maracujá com Manjericão', 'Cachaça', 23, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Morango', 'Cachaça', 22, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Seu Villa', 'Cachaça', 22, 'Limão, rúcula, açúcar, cachaça, gelo e borda de mel com sal.', 7, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Caipiroskas', 11, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Morango', 'Vodka', 25, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Limão', 'Vodka', 25, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Abacaxi', 'Vodka', 25, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maracujá', 'Vodka', 25, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tangerina com Maracujá', 'Vodka', 25, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maracujá com Manjericão', 'Vodka', 25, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Seu Villa', 'Vodka', 25, 'Limão, rúcula, açúcar, vodka, gelo e borda de mel com sal.', 7, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Batidas', 12, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Morango', 'Vinho', 22, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Morango', 'Vodka', 25, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Abacaxi', 'Vinho', 22, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Abacaxi', 'Vodka', 25, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maracujá', 'Vinho', 22, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maracujá', 'Vodka', 25, null, 6, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Vinhos', 13, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mioranza', 'Padrão', 45, 'Tinto suave', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Almadén', 'Padrão', 70, 'Sauvignon Demi-sec.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Miolo Seleção', 'Padrão', 70, 'Sauvignon Demi-sec.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Marcus James', 'Padrão', 80, 'Cabernet Sauvignon', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Santa Helena', 'Padrão', 80, 'Cabernet Sauvignon', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Casillero Del Diablo', 'Padrão', 110, 'Cabernet', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Periquita', 'Padrão', 130, 'Sauvignon Demi-sec.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cavicchioli', 'Padrão', 78, 'Lambrusco | Tinto frisante', 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'DV Catena', 'Padrão', 170, 'Sauvignon Malbec', 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Angelica Zapata', 'Padrão', 249, 'Cabernet Sauvignon', 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tinto Suave', 'Taça', 14, null, 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tinto Seco', 'Taça', 14, null, 12, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Whisky', 14, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Passaport Scotch', 'Dose', 18, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'White Horse', 'Dose', 22, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Johnny Walker | Red Label', 'Dose', 25, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Johnny Walker | Black Label', 'Dose', 29, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Chivas Regal', 'Dose', 35, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Jack Daniels', 'Dose', 35, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Jack Daniels | Honey', 'Dose', 35, null, 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Old Par', 'Dose', 32, null, 8, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Doses', 15, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Conhaque Presidente', 'Dose', 6, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cachaça São Francisco', 'Dose', 10, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cachaça Ipióca', 'Dose', 10, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cachaça Seleta', 'Dose', 12, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Conhaque Domecq', 'Dose', 10, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Campari', 'Dose', 18, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Vodka Smirnoff', 'Dose', 12, null, 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Amarula', 'Dose', 19, null, 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Licor 43', 'Dose', 19, null, 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Vodka Absolut', 'Dose', 18, null, 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tequila', 'Dose', 19, null, 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Gin Tanqueray', 'Dose', 25, null, 12, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Shots', 16, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Choppinho do Villa', 'Padrão', 26, 'Licor 43 e creme especial do Villa.', 1, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Saladas', 17, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Salada Villa Grill', 'Meia', 49, 'Carpaccio, mix de alface, rúcula, tomate, palmito, molho de alcaparras e parmesão ralado.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Salada Villa Grill', 'Inteira', 89, 'Carpaccio, mix de alface, rúcula, tomate, palmito, molho de alcaparras e parmesão ralado.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Salada Caeser', 'Padrão', 55, 'Mix de folhas, molho Caesar, frango em cubos, croutons e parmesão ralado.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Salada do Cheff', 'Padrão', 45, 'Alface, tomate, palmito, molho de alcaparra e parmesão ralado.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Salada Completa', 'Padrão', 85, 'Brócolis, couve-flor, cenoura, ovo cozido, milho, ervilha, presunto, muçarela, alface, tomate, palmito e cebola.', 5, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Entradas', 18, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Berinjela ao Forno', 'Padrão', 59, 'Berinjela, abobrinha, alho, azeite de oliva, tomate, manjericão, muçarela, parmesão e torradinha.', 1, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Individuais', 19, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim Casqueirado', 'Padrão', 59, 'Cupim casqueirado, mandioca, arroz branco e salada.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Salmão Grelhado', 'Padrão', 109, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Picanha Grelhada', 'Padrão', 89, 'Picanha grelhada, mandioca, arroz branco e salada.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon à Parmegiana', 'Padrão', 89, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Bife Ancho', 'Padrão', 69, null, 5, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Frios', 20, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Frios | 600 gramas', 'Padrão', 95, 'Salame, ovo de codorna, azeitona, muçarela, presunto, palmito e parmesão.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Provolone Misto | 250 gramas', 'Padrão', 59, 'Provolone, salame e azeitona.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mista | 200 gramas', 'Padrão', 42, 'Presunto e muçarela.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Salame com Azeitona | 100 gramas', 'Padrão', 39, 'Serve 2 a 3 pessoas.', 4, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Porções', 21, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Picanha Aperitivo', 'Padrão', 139, 'Acompanha mandioca cozida e molho batido.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon Acebolado Aperitivo', 'Padrão', 139, 'Acompanha mandioca cozida e molho batido.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Carne Seca Acebolada', 'Padrão', 89, 'Com pimentões, cebola e mandioca frita.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Porção do Villa', 'Padrão', 79, 'Batata frita, calabresa acebolada e peito de frango aperitivo acebolado. Acompanha molho tártaro.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Linguiça Picante com Mandioca Frita', 'Padrão', 52, 'Acompanha molho vermelho.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Provolone à Milanesa', 'Padrão', 59, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Calabresa Acebolada', 'Padrão', 49, null, 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Torresminho', 'Padrão', 49, null, 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Bolinho de Cupim', 'Padrão', 49, '8 unidades. Com recheio de muçarela ou provolone.', 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Bolinho de Cabotiã com Carne Seca', 'Padrão', 49, '8 unidades.', 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Bolinho de Mandioca com Linguiça Picante', 'Padrão', 44, '8 unidades.', 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mix de Bolinho', 'Padrão', 59, '9 unidades. Bolinhos de mandioca com linguiça picante, cabotiã com carne seca e cupim com muçarela.', 12, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Pastelzinho', 'Padrão', 48, '10 unidades. Sabores: queijo e presunto, queijo ou carne.', 13, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Lombinho ao Sal Preto', 'Padrão', 59, 'Acompanha molho shoyu.', 14, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Carpaccio', 'Padrão', 55, 'Carpaccio coberto com molho de alcaparras e parmesão ralado. Acompanha pão francês.', 15, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Canapé de Carpaccio', 'Padrão', 55, 'Torradinha de pão com carpaccio desfiado, no molho de alcaparras e coberto com parmesão ralado.', 16, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Sashimi de Tilápia', 'Padrão', 89, 'Acompanha pão francês fatiado.', 17, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frango à Passarinho Completo', 'Padrão', 89, 'Acompanha batata frita, bacon e alho frito.', 18, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frango à Passarinho Simples', 'Padrão', 79, 'Acompanha batata frita e molho tártaro.', 19, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frango Crocante', 'Padrão', 69, 'Sobrecoxa desossada, empanada e frita. Acompanha batata frita, molho tártaro e molho especial.', 20, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Isca de Frango', 'Padrão', 49, 'Acompanha molho tártaro.', 21, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tilápia St. Peter à Dorê com Batata Frita', 'Meia', 90, '600g de tilápia empanada e frita. Acompanha molho de alho.', 22, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tilápia St. Peter à Dorê com Batata Frita', 'Inteira', 110, '600g de tilápia empanada e frita. Acompanha molho de alho.', 23, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tilápia St. Peter à Dorê', 'Meia', 79, '600g de tilápia empanada e frita. Acompanha molho de alho.', 24, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tilápia St. Peter à Dorê', 'Inteira', 95, '600g de tilápia empanada e frita. Acompanha molho de alho.', 25, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Batata com Muçarela e Bacon', 'Meia', 36, null, 26, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Batata com Muçarela e Bacon', 'Inteira', 42, null, 27, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Batata com Cheddar e Bacon', 'Meia', 32, null, 28, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Batata com Cheddar e Bacon', 'Inteira', 39, null, 29, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Batata Frita', 'Meia', 25, null, 30, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Batata Frita', 'Inteira', 32, null, 31, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mandioca Cremosa', 'Meia', 43, null, 32, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mandioca Cremosa', 'Inteira', 52, null, 33, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Frango', 22, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango com Legumes na Manteiga', 'Meia', 109, 'Filé de frango chapeado com legumes na manteiga: brócolis, batata, cenoura, couve-flor, vagem, palmito e azeitona.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango com Legumes na Manteiga', 'Inteira', 129, 'Filé de frango chapeado com legumes na manteiga: brócolis, batata, cenoura, couve-flor, vagem, palmito e azeitona.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango do Cheff', 'Meia', 109, 'Filé de frango chapeado com molho mostarda, ervilha e bacon.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango do Cheff', 'Inteira', 129, 'Filé de frango chapeado com molho mostarda, ervilha e bacon.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango à Parmegiana', 'Meia', 119, 'Filé de frango empanado e frito, coberto com muçarela, molho vermelho, parmesão ralado, ervilha e palmito.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango à Parmegiana', 'Inteira', 139, 'Filé de frango empanado e frito, coberto com muçarela, molho vermelho, parmesão ralado, ervilha e palmito.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango ao Creme de Milho', 'Meia', 119, 'Filé de frango empanado e frito, coberto com muçarela e creme de milho.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango ao Creme de Milho', 'Inteira', 139, 'Filé de frango empanado e frito, coberto com muçarela e creme de milho.', 8, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Peixe', 23, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de St. Peter à Parmegiana', 'Meia', 129, 'Filé de tilápia empanado e frito coberto com muçarela, molho vermelho, palmito, ervilha e parmesão ralado.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de St. Peter à Parmegiana', 'Inteira', 149, 'Filé de tilápia empanado e frito coberto com muçarela, molho vermelho, palmito, ervilha e parmesão ralado.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Peixes', 'Meia', 120, 'Tilápia, porquinho, tilápia recheada com provolone e pirão.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Peixes', 'Inteira', 159, 'Tilápia, porquinho, tilápia recheada com provolone e pirão.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tilápia Completa', 'Meia', 109, 'Tilápia à milanesa, pêssego, banana à milanesa, milho e ervilha.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tilápia Completa', 'Inteira', 129, 'Tilápia à milanesa, pêssego, banana à milanesa, milho e ervilha.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tilápia à Jardineira', 'Inteira', 139, 'Tilápia chapeada com legumes no azeite, brócolis, batata, cenoura, couve-flor, vagem, palmito e azeitona.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tilápia ao Molho de Camarão', 'Inteira', 139, 'Filé de tilápia empanada e frita coberta com molho de camarão, creme de leite, alcaparras e champignon.', 8, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Filé Mignon', 24, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé à Portuguesa', 'Meia', 149, 'Filé mignon chapeado com legumes no azeite: batata, couve-flor, vagem, brócolis, cenoura, ervilha, palmito, azeitona, couve refogada e alho frito.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé à Portuguesa', 'Inteira', 189, 'Filé mignon chapeado com legumes no azeite: batata, couve-flor, vagem, brócolis, cenoura, ervilha, palmito, azeitona, couve refogada e alho frito.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé à Cubana (à Milanesa ou Chapeado)', 'Meia', 189, 'Filé mignon coberto com muçarela e presunto, banana à milanesa, pêssego, cereja, figo, milho, ervilha e panachê.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé à Cubana (à Milanesa ou Chapeado)', 'Inteira', 219, 'Filé mignon coberto com muçarela e presunto, banana à milanesa, pêssego, cereja, figo, milho, ervilha e panachê.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon Villa Grill', 'Meia', 129, 'Filé ao molho madeira com cebola caramelizada, milho, ervilha e batata frita.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon Villa Grill', 'Inteira', 159, 'Filé ao molho madeira com cebola caramelizada, milho, ervilha e batata frita.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Napolitano', 'Padrão', 189, 'Filé mignon empanado enrolado tipo rocambole, recheado com Catupiry e presunto, coberto com molho branco e uvas passas, batata palha, panachê e banana à milanesa.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon com Fonduta de Queijo', 'Padrão', 120, '400g de tiras de filé mignon cobertas com Catupiry, gorgonzola e parmesão gratinado.', 8, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Massas', 25, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Espaguete à Bolonhesa', 'Padrão', 59, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Espaguete ao Sugo', 'Padrão', 49, 'Molho de tomate artesanal e parmesão ralado.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Talharim do Chefe', 'Padrão', 69, 'Talharim na manteiga com alho-poró e tomate seco.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Fettuccine Alfredo', 'Padrão', 89, 'Fettuccine ao molho Alfredo com tiras de filé mignon.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Espaguete à Carbonara', 'Padrão', 89, 'Espaguetti, bacon, ovos e queijo parmesão ralado.', 5, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Risotos e Arroz', 26, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Parmesão com Ragu de Cupim', 'Padrão', 70, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon', 'Padrão', 90, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Camarão', 'Padrão', 90, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Arroz Tropical', 'Padrão', 140, 'Arroz cremoso com abacaxi, camarão e especiarias.', 4, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Caldos', 27, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Caldo de Mandioca com Cupim', 'Padrão', 39, 'Creme de mandioca com cupim desfiado. Acompanha torradas.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Caldo Verde', 'Padrão', 39, 'Creme de batata com couve e calabresa. Acompanha torradas.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Creme de Palmito', 'Padrão', 49, 'Acompanha torradas.', 3, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Pizzas — Entradas', 28, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Corniccioni Pomodori', 'Padrão', 23, 'Massa fina de pizza assada em forno à lenha com molho de tomate italiano e parmesão, cortada em pequenas fatias.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Corniccioni Pomodori | Alho e Óleo', 'Padrão', 23, 'Massa fina de pizza assada em forno à lenha com molho de tomate italiano, alho, óleo e parmesão, cortada em pequenas fatias.', 2, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Pizzas — Bordas', 29, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Catupiry', 'Adicional', 12, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Catupiry com Alho', 'Adicional', 12, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cheddar', 'Adicional', 12, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Muçarela', 'Adicional', 12, null, 4, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Pizzas Tradicionais', 30, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Muçarela', 'Média', 72, 'Molho de tomate italiano, muçarela e orégano.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Muçarela', 'Família', 89, 'Molho de tomate italiano, muçarela e orégano.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Marguerita', 'Média', 72, 'Molho de tomate italiano, muçarela, manjericão e orégano.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Marguerita', 'Família', 89, 'Molho de tomate italiano, muçarela, manjericão e orégano.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Quatro Queijos', 'Média', 82, 'Molho de tomate italiano, muçarela, gorgonzola, Catupiry, parmesão e orégano.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Quatro Queijos', 'Família', 96, 'Molho de tomate italiano, muçarela, gorgonzola, Catupiry, parmesão e orégano.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Napolitana', 'Média', 72, 'Molho de tomate italiano, alho fatiado, parmesão, manjericão e orégano.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Napolitana', 'Família', 89, 'Molho de tomate italiano, alho fatiado, parmesão, manjericão e orégano.', 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Baiana', 'Média', 72, 'Molho de tomate italiano, muçarela, calabresa moída, pimenta calabresa, cebola, orégano e azeitona.', 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Baiana', 'Família', 89, 'Molho de tomate italiano, muçarela, calabresa moída, pimenta calabresa, cebola, orégano e azeitona.', 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Portuguesa', 'Média', 79, 'Molho de tomate italiano, presunto, ovos, cebola, palmito, muçarela, ervilha, azeitona preta e orégano.', 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Portuguesa', 'Família', 94, 'Molho de tomate italiano, presunto, ovos, cebola, palmito, muçarela, ervilha, azeitona preta e orégano.', 12, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Calabresa', 'Média', 72, 'Molho de tomate italiano, calabresa, muçarela, cebola, azeitona preta e orégano.', 13, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Calabresa', 'Família', 89, 'Molho de tomate italiano, calabresa, muçarela, cebola, azeitona preta e orégano.', 14, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Rúcula', 'Média', 75, 'Molho de tomate italiano, muçarela, rúcula, tomate seco e orégano.', 15, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Rúcula', 'Família', 89, 'Molho de tomate italiano, muçarela, rúcula, tomate seco e orégano.', 16, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Três Queijos', 'Média', 79, 'Molho de tomate italiano, muçarela, Catupiry e parmesão.', 17, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Três Queijos', 'Família', 94, 'Molho de tomate italiano, muçarela, Catupiry e parmesão.', 18, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frango com Catupiry', 'Média', 79, 'Molho de tomate italiano, muçarela, frango desfiado, Catupiry e orégano.', 19, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frango com Catupiry', 'Família', 94, 'Molho de tomate italiano, muçarela, frango desfiado, Catupiry e orégano.', 20, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Atum', 'Média', 96, 'Molho de tomate italiano, atum, muçarela, cebola, azeitona preta e orégano.', 21, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Atum', 'Família', 109, 'Molho de tomate italiano, atum, muçarela, cebola, azeitona preta e orégano.', 22, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Catupiresa', 'Média', 86, 'Molho de tomate italiano, muçarela, calabresa e catupiry.', 23, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Catupiresa', 'Família', 96, 'Molho de tomate italiano, muçarela, calabresa e catupiry.', 24, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Pizzas Especiais', 31, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Genovesa', 'Média', 78, 'Molho de tomate italiano, muçarela, tomate em cubo, catupiry, bacon, parmesão e orégano.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Genovesa', 'Família', 92, 'Molho de tomate italiano, muçarela, tomate em cubo, catupiry, bacon, parmesão e orégano.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Palmito com Catupiry', 'Média', 86, 'Molho de tomate italiano, muçarela, palmito, Catupiry e orégano.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Palmito com Catupiry', 'Família', 96, 'Molho de tomate italiano, muçarela, palmito, Catupiry e orégano.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Canadense', 'Média', 79, 'Molho de tomate italiano, presunto, muçarela, bacon, catupiry, orégano e azeitona.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Canadense', 'Família', 89, 'Molho de tomate italiano, presunto, muçarela, bacon, catupiry, orégano e azeitona.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim ao Alho', 'Média', 98, 'Molho, mussarela, catupiry, cupim assado na brasa e alho frito.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim ao Alho', 'Família', 110, 'Molho, mussarela, catupiry, cupim assado na brasa e alho frito.', 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Rúcula', 'Média', 98, 'Molho, mussarela, cupim assado na brasa e rúcula.', 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Rúcula', 'Família', 110, 'Molho, mussarela, cupim assado na brasa e rúcula.', 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Picanha Especial', 'Média', 109, 'Mussarela, picanha assada na brasa e molho chimichurri fresco.', 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Picanha Especial', 'Família', 120, 'Mussarela, picanha assada na brasa e molho chimichurri fresco.', 12, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Speciale Alho Poró', 'Média', 98, 'Mussarela, alho-poró, presunto, cream cheese, parmesão e tomate cereja.', 13, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Speciale Alho Poró', 'Família', 110, 'Mussarela, alho-poró, presunto, cream cheese, parmesão e tomate cereja.', 14, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brócolis com Bacon', 'Média', 86, 'Molho de tomate, mussarela, brócolis e bacon.', 15, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brócolis com Bacon', 'Família', 96, 'Molho de tomate, mussarela, brócolis e bacon.', 16, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Camarão Especial', 'Média', 98, 'Molho, mussarela, cream cheese, camarão refogado com alho e ervas, raspas de limão siciliano.', 17, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Camarão Especial', 'Família', 110, 'Molho, mussarela, cream cheese, camarão refogado com alho e ervas, raspas de limão siciliano.', 18, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Lombo Canadense', 'Média', 78, 'Molho de tomate italiano, lombo canadense, muçarela, tomate cereja, Catupiry e orégano.', 19, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Lombo Canadense', 'Família', 89, 'Molho de tomate italiano, lombo canadense, muçarela, tomate cereja, Catupiry e orégano.', 20, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Especial do Cheff', 'Média', 92, 'Molho de tomate italiano, cheddar, champignon, palmito, muçarela, bacon, rúcula, brócolis e tomate seco.', 21, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Especial do Cheff', 'Família', 106, 'Molho de tomate italiano, cheddar, champignon, palmito, muçarela, bacon, rúcula, brócolis e tomate seco.', 22, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Caprese', 'Média', 89, 'Molho de tomate italiano, muçarela, tomate caqui, muçarela fresca de búfala, manjericão, pesto de azeitona preta e orégano.', 23, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Caprese', 'Família', 96, 'Molho de tomate italiano, muçarela, tomate caqui, muçarela fresca de búfala, manjericão, pesto de azeitona preta e orégano.', 24, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Costela ao Molho Barbecue', 'Média', 88, 'Molho, costela desfiada, cebola, cream cheese, molho barbecue, cebolinha, muçarela e orégano.', 25, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Costela ao Molho Barbecue', 'Família', 98, 'Molho, costela desfiada, cebola, cream cheese, molho barbecue, cebolinha, muçarela e orégano.', 26, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé ao Alho', 'Média', 98, 'Molho, muçarela, filé mignon, tomate cortado em cubos, cebola, catupiry, alho frito e orégano.', 27, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé ao Alho', 'Família', 106, 'Molho, muçarela, filé mignon, tomate cortado em cubos, cebola, catupiry, alho frito e orégano.', 28, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Strogonoff de Filé Mignon', 'Média', 98, 'Molho, muçarela, strogonoff de filé mignon, catupiry, batata palha e orégano.', 29, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Strogonoff de Filé Mignon', 'Família', 106, 'Molho, muçarela, strogonoff de filé mignon, catupiry, batata palha e orégano.', 30, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Strogonoff de Frango', 'Média', 79, 'Molho, muçarela, strogonoff de frango, catupiry, batata palha e orégano.', 31, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Strogonoff de Frango', 'Família', 89, 'Molho, muçarela, strogonoff de frango, catupiry, batata palha e orégano.', 32, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Pepperoni', 'Média', 79, 'Molho, muçarela, pepperoni, cream cheese, manjericão e orégano.', 33, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Pepperoni', 'Família', 89, 'Molho, muçarela, pepperoni, cream cheese, manjericão e orégano.', 34, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Palmito Especial', 'Média', 79, 'Molho, muçarela, palmito, catupiry, parmesão, pesto de manjericão e orégano.', 35, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Palmito Especial', 'Família', 89, 'Molho, muçarela, palmito, catupiry, parmesão, pesto de manjericão e orégano.', 36, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mexicana', 'Média', 79, 'Molho de tomate italiano, muçarela, cheddar, bacon, doritos, orégano e geleia de pimenta à parte.', 37, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mexicana', 'Família', 89, 'Molho de tomate italiano, muçarela, cheddar, bacon, doritos, orégano e geleia de pimenta à parte.', 38, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Pizzas Doces', 32, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Nutella', '6 pedaços', 69, 'Creme de avelã (Nutella) e M&M.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Nutella', '8 pedaços', 89, 'Creme de avelã (Nutella) e M&M.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brigadeiro', '6 pedaços', 45, 'Chocolate e granulado.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brigadeiro', '8 pedaços', 55, 'Chocolate e granulado.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Sensação', '6 pedaços', 59, 'Chocolate e morango.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Sensação', '8 pedaços', 69, 'Chocolate e morango.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Banana Nevada', '6 pedaços', 59, 'Muçarela, banana e chocolate branco.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Banana Nevada', '8 pedaços', 69, 'Muçarela, banana e chocolate branco.', 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Romeu e Julieta', '6 pedaços', 39, 'Muçarela e goiabada.', 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Romeu e Julieta', '8 pedaços', 49, 'Muçarela e goiabada.', 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brownie com Sorvete', '6 pedaços', 59, 'Chocolate, pedaço de brownie e sorvete de creme.', 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brownie com Sorvete', '8 pedaços', 69, 'Chocolate, pedaço de brownie e sorvete de creme.', 12, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frutas Vermelhas', '6 pedaços', 59, 'Muçarela, geleia de frutas vermelhas e chocolate branco.', 13, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frutas Vermelhas', '8 pedaços', 69, 'Muçarela, geleia de frutas vermelhas e chocolate branco.', 14, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Pizzas Kids', 33, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Muçarela', '4 pedaços', 49, 'Molho de tomate italiano, muçarela e orégano.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Bambina', '4 pedaços', 55, 'Molho de tomate italiano, muçarela, presunto e orégano.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brigadeiro', '4 pedaços', 45, 'Brigadeiro, chocolate e granulado.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Nutella com M&M', '4 pedaços', 55, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Calabresita', '4 pedaços', 58, 'Molho de tomate italiano, muçarela, calabresa e orégano.', 5, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Cupim Casqueirado', 34, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim Completo', 'Meia', 109, 'Assado lentamente por horas, chega à mesa com casquinha dourada, macio, suculento e cheio de sabor.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim Completo', 'Inteira', 129, 'Assado lentamente por horas, chega à mesa com casquinha dourada, macio, suculento e cheio de sabor.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim Simples', 'Meia', 92, 'Uma carne que desmancha na boca e deixa qualquer refeição inesquecível.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim Simples', 'Inteira', 119, 'Uma carne que desmancha na boca e deixa qualquer refeição inesquecível.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Fritas', 'Meia', 135, 'Cupim casqueirado, macio por dentro e dourado por fora, servido com batata frita crocante.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Fritas', 'Inteira', 149, 'Cupim casqueirado, macio por dentro e dourado por fora, servido com batata frita crocante.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Catupiry e Alho', 'Meia', 129, 'Cupim macio e suculento, coberto com Catupiry cremoso e alho dourado.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Catupiry e Alho', 'Inteira', 139, 'Cupim macio e suculento, coberto com Catupiry cremoso e alho dourado.', 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Frango Grelhado', 'Inteira', 130, 'Combinação perfeita de sabores para quem gosta de variedade e muito sabor.', 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Costela', 'Inteira', 167, 'Quando a maciez do cupim casqueirado encontra o sabor intenso da costela no bafo.', 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Fraldinha', 'Inteira', 145, 'Sabor marcante do cupim com a suculência da fraldinha.', 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Maminha Angus 1953', 'Inteira', 155, 'Cupim com Maminha: a dupla que rouba a cena.', 12, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Maminha Angus 1953, Catupiry e Alho', 'Inteira', 169, 'O encontro perfeito entre cupim e maminha, com Catupiry e alho dourado.', 13, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Contra-Filé', 'Inteira', 155, 'Cupim + contra-filé: potência máxima de sabor.', 14, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim com Picanha Fatiada', 'Inteira', 199, 'Dois gigantes do churrasco, assados lentamente na brasa.', 15, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Churrasqueira', 35, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Picanha Maturatta', 'Meia', 163, 'Capa de gordura no ponto, sal grosso e respeito.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Picanha Maturatta', 'Inteira', 219, 'Capa de gordura no ponto, sal grosso e respeito.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Bife Ancho na Brasa', 'Meia', 129, 'Corte com marmoreio evidente, a famosa gordura entremeada na carne.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Bife Ancho na Brasa', 'Inteira', 145, 'Corte com marmoreio evidente, a famosa gordura entremeada na carne.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maminha Angus 1953', 'Meia', 129, 'Corte popular bovino, de muito sabor e baixo teor de gordura.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maminha Angus 1953', 'Inteira', 159, 'Corte popular bovino, de muito sabor e baixo teor de gordura.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maminha Angus 1953 com Catupiry e Alho', 'Meia', 139, 'Maminha assada, coberta com alho e Catupiry.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Maminha Angus 1953 com Catupiry e Alho', 'Inteira', 169, 'Maminha assada, coberta com alho e Catupiry.', 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon com Catupiry na Brasa', 'Meia', 163, 'O corte mais macio do boi, selado na brasa com Catupiry derretido.', 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon com Catupiry na Brasa', 'Inteira', 219, 'O corte mais macio do boi, selado na brasa com Catupiry derretido.', 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Alcatra Maturatta', 'Meia', 110, 'A alcatra é uma carne muito macia e de pouca gordura.', 11, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Alcatra Maturatta', 'Inteira', 130, 'A alcatra é uma carne muito macia e de pouca gordura.', 12, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Contra-Filé na Brasa', 'Meia', 110, 'Contra-filé na brasa, carne nobre no ponto ideal.', 13, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Contra-Filé na Brasa', 'Inteira', 130, 'Contra-filé na brasa, carne nobre no ponto ideal.', 14, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Fraldinha na Brasa', 'Meia', 110, 'Preparada lentamente na brasa para garantir suculência e sabor.', 15, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Fraldinha na Brasa', 'Inteira', 130, 'Preparada lentamente na brasa para garantir suculência e sabor.', 16, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Costela no Bafo', 'Meia', 160, 'Assada por horas em fogo baixo, a carne se solta do osso e derrete na boca.', 17, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Costela no Bafo', 'Inteira', 180, 'Assada por horas em fogo baixo, a carne se solta do osso e derrete na boca.', 18, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Copa Lombo na Brasa', 'Meia', 69, 'Carne macia e suculenta, com sabor e crocância irresistíveis.', 19, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Copa Lombo na Brasa', 'Inteira', 79, 'Carne macia e suculenta, com sabor e crocância irresistíveis.', 20, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frango na Brasa', 'Meia', 79, 'Cortes de coxa e sobrecoxa desossados e assados na brasa.', 21, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frango na Brasa', 'Inteira', 89, 'Cortes de coxa e sobrecoxa desossados e assados na brasa.', 22, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Tábuas de Carnes', 36, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Carnes Mista', 'Meia', 149, 'Cupim, frango grelhado, copa lombo e linguiça cuiabana.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Carnes Mista', 'Inteira', 179, 'Cupim, frango grelhado, copa lombo e linguiça cuiabana.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Carnes Premium', 'Meia', 199, 'Picanha, bife ancho e cupim.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Carnes Premium', 'Inteira', 239, 'Picanha, bife ancho e cupim.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Carnes Gold', 'Meia', 249, 'Costela no bafo, cupim casqueirado, picanha, bife ancho e queijo coalho na brasa.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Tábua de Carnes Gold', 'Inteira', 279, 'Costela no bafo, cupim casqueirado, picanha, bife ancho e queijo coalho na brasa.', 6, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Aperitivos da Brasa', 37, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Linguiça Cuiabana Aperitivo', 'Padrão', 89, 'Excelente opção para petisco, muito suculenta e de sabor diferenciado.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Panceta na Brasa Aperitivo', 'Padrão', 70, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Queijo Coalho com mel', 'Padrão', 13, 'Unidade.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Cupim Aperitivo', 'Padrão', 39, '150g.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Pão de Alho', 'Padrão', 8, null, 5, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Lanches', 38, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'X-Cupim', 'Padrão', 39, 'Pão francês de 90g, cupim casqueirado, rúcula, tomate seco e queijo prato.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Frango Salada', 'Padrão', 35, 'Pão francês, filé de frango, muçarela, tomate e alface.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'X-Bacon', 'Padrão', 33, 'Hambúrguer artesanal, muçarela, presunto e bacon.', 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'X-Burger', 'Padrão', 25, 'Pão, hambúrguer artesanal e queijo.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'X-Salada', 'Padrão', 26, 'Pão, hambúrguer artesanal, queijo, presunto, alface e tomate.', 5, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Kids', 39, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé Mignon Grelhado', 'Padrão', 55, 'Acompanha arroz branco e batata frita.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Filé de Frango', 'Padrão', 39, 'Acompanha arroz branco e batata frita.', 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Espaguete à Bolonhesa', 'Padrão', 39, 'Espaguete ao molho vermelho e carne moída.', 3, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Guarnições', 40, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Arroz Branco', 'Padrão', 13, null, 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Molho Batido', 'Padrão', 4, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Arroz ao Alho', 'Padrão', 18, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Salada Simples', 'Padrão', 10, null, 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Molho de Alho', 'Padrão', 5, null, 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Arroz à Grega', 'Padrão', 18, null, 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Mandioca Cozida', 'Padrão', 11, null, 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Molho Tártaro', 'Padrão', 5, null, 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Arroz Biro Biro', 'Padrão', 23, null, 9, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Feijão', 'Padrão', 13, null, 10, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Arroz Cremoso de Palmito', 'Padrão', 26, null, 11, true, true);

  insert into public.menu_categories (restaurant_id, name, sort_order, active)
    values (rid, 'Sobremesas', 41, true) returning id into cid;
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Banana ao Forno', 'Padrão', 22, 'Banana assada no forno à lenha, coberta com calda de chocolate, farofa de castanha e sorvete.', 1, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Creme de Mamão Papaia com Cassis', 'Padrão', 22, null, 2, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Café Expresso', 'Padrão', 8, null, 3, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Grand Gateau', 'Padrão', 49, 'Bolinho de chocolate cremoso com sorvete de palito Magnum, morango e farofa de castanha.', 4, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Petit Gateau', 'Padrão', 26, 'Acompanha sorvete de creme.', 5, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Taça de Sorvete', 'Padrão', 15, '2 bolas: creme, chocolate, morango ou flocos.', 6, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Brownie na Chapa', 'Padrão', 39, 'Servido na chapa quente, com sorvete de Ninho e ganache de chocolate.', 7, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Pudim de Leite Condensado', 'Padrão', 14, null, 8, true, true);
  insert into public.menu_items (restaurant_id, category_id, name, variation, price, description, sort_order, active, available)
    values (rid, cid, 'Pudim de Leite Condensado com Sorvete', 'Padrão', 18, 'Acompanha 1 bola de sorvete de creme.', 9, true, true);

  raise notice 'Cardápio inserido com sucesso.';
end $$;
