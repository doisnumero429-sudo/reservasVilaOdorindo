import { SupabaseClient } from '@supabase/supabase-js';

function norm(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Monta o contexto do cardápio para o Bento.
 * ESTRATÉGIA: envia o CARDÁPIO COMPLETO (todos os itens + preço), agrupado por categoria,
 * para ela NUNCA inventar nem omitir item. Além disso, destaca os DETALHES ricos
 * (descrição, acompanhamentos, porção) dos itens mais relevantes à pergunta.
 */
export async function buildMenuContext(
  db: SupabaseClient,
  restaurantId: string,
  userMessage: string
): Promise<string> {
  const [{ data: cats }, { data: items }] = await Promise.all([
    db.from('menu_categories').select('id,name,sort_order').eq('restaurant_id', restaurantId).eq('active', true).order('sort_order'),
    db
      .from('menu_items')
      .select('name,variation,price,category_id,available,active,featured,description,accompaniments,serving_note,tags,allergens,sort_order')
      .eq('restaurant_id', restaurantId)
      .eq('active', true),
  ]);

  const categorias = cats || [];
  const catName = new Map(categorias.map((c: any) => [c.id, c.name]));
  const todos = items || [];

  const preco = (i: any) => (i.price != null ? `R$ ${Number(i.price).toFixed(2)}` : 'consultar');
  const varStr = (i: any) => (i.variation ? ` (${i.variation})` : '');
  const disp = (i: any) => (i.available === false ? ' [indisponível]' : '');

  // ---- 1) CARDÁPIO COMPLETO, agrupado por categoria (linha curta: nome | preço) ----
  const porCategoria: string[] = [];
  for (const c of categorias) {
    const doCat = todos
      .filter((i: any) => i.category_id === c.id)
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
    if (!doCat.length) continue;
    porCategoria.push(`### ${c.name}`);
    for (const i of doCat) {
      porCategoria.push(`- ${i.name}${varStr(i)} — ${preco(i)}${disp(i)}`);
    }
  }
  const cardapioCompleto = porCategoria.join('\n');

  // ---- 2) DETALHES ricos dos itens relevantes à pergunta ----
  const q = norm(userMessage);
  const tokens = q.split(/\s+/).filter((w) => w.length > 2);
  const detalhe = (i: any) => {
    let linha = `- ${i.name}${varStr(i)} — ${preco(i)} (${catName.get(i.category_id) || ''})`;
    if (i.description) linha += `\n    Descrição: ${i.description}`;
    if (i.accompaniments && i.accompaniments.length) linha += `\n    Acompanha: ${i.accompaniments.join(', ')}`;
    if (i.serving_note) linha += `\n    Serve: ${i.serving_note}`;
    if (i.allergens && i.allergens.length) linha += `\n    Alérgenos: ${i.allergens.join(', ')}`;
    return linha;
  };

  let relevantes = todos
    .map((i: any) => {
      const hay = norm([i.name, i.variation, catName.get(i.category_id), i.description, (i.tags || []).join(' ')].join(' '));
      let score = 0;
      for (const t of tokens) if (hay.includes(t)) score++;
      return { i, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 25)
    .map((x) => x.i);

  // sem match específico: usa os destaques como "detalhes" para recomendar bem
  if (relevantes.length === 0) {
    relevantes = todos.filter((i: any) => i.featured).slice(0, 12);
  }

  const detalhes = relevantes.length
    ? `\n\nDETALHES (descrição, acompanhamentos e porção dos itens mais ligados à pergunta):\n${relevantes.map(detalhe).join('\n')}`
    : '';

  return `CARDÁPIO COMPLETO — estes são TODOS os itens e preços que existem. NÃO mencione nada que não esteja aqui, e NÃO altere os preços:
${cardapioCompleto}${detalhes}`;
}
