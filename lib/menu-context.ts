import { SupabaseClient } from '@supabase/supabase-js';

function norm(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Busca inteligente no cardápio: em vez de enviar os 383 itens à IA,
 * retorna a lista de categorias + os itens mais relevantes à pergunta do cliente.
 * Mais barato, mais rápido e respostas melhores.
 */
export async function buildMenuContext(
  db: SupabaseClient,
  restaurantId: string,
  userMessage: string
): Promise<string> {
  const [{ data: cats }, { data: items }] = await Promise.all([
    db.from('menu_categories').select('id,name').eq('restaurant_id', restaurantId).eq('active', true).order('sort_order'),
    db
      .from('menu_items')
      .select('name,variation,price,category_id,available,active,description,tags,allergens')
      .eq('restaurant_id', restaurantId)
      .eq('active', true),
  ]);

  const categorias = cats || [];
  const catName = new Map(categorias.map((c: any) => [c.id, c.name]));
  const todos = items || [];

  const fmt = (i: any) => {
    const preco = i.price != null ? `R$ ${Number(i.price).toFixed(2)}` : 'consultar';
    const disp = i.available === false ? ' (indisponível)' : '';
    const variacao = i.variation ? ` (${i.variation})` : '';
    const desc = i.description ? ` — ${i.description}` : '';
    return `- ${i.name}${variacao} | ${preco} | ${catName.get(i.category_id) || ''}${disp}${desc}`;
  };

  const q = norm(userMessage);
  const tokens = q.split(/\s+/).filter((w) => w.length > 2);

  // pontua cada item pela quantidade de palavras da pergunta que aparecem nele
  const scored = todos
    .map((i: any) => {
      const hay = norm(
        [i.name, i.variation, catName.get(i.category_id), i.description, (i.tags || []).join(' '), (i.allergens || []).join(' ')].join(' ')
      );
      let score = 0;
      for (const t of tokens) if (hay.includes(t)) score++;
      return { i, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map((x) => x.i);

  const listaCategorias = categorias.map((c: any) => c.name).join(', ');

  if (scored.length === 0) {
    // pergunta genérica: manda só as categorias (a IA pergunta o que a pessoa quer)
    return `CATEGORIAS DO CARDÁPIO: ${listaCategorias}\n\n(Se o cliente perguntar sobre uma categoria ou prato específico, peça o nome para eu trazer os detalhes.)`;
  }

  return `CATEGORIAS DO CARDÁPIO: ${listaCategorias}\n\nITENS RELEVANTES PARA ESTA PERGUNTA:\n${scored.map(fmt).join('\n')}`;
}
