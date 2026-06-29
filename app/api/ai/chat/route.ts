import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getRestaurant } from '@/lib/supabase';
import { cascadeChat, ChatMessage } from '@/lib/openrouter';

export const runtime = 'nodejs';

/**
 * POST /api/ai/chat
 * Corpo: { messages: [{role,content}], session_id?: string }
 * A chave de IA fica SOMENTE no servidor (OpenRouter). O navegador nunca a vê.
 */
export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const incoming: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
      : body.message
        ? [{ role: 'user', content: String(body.message) }]
        : [];
    if (incoming.length === 0) {
      return NextResponse.json({ ok: false, error: 'Mensagem vazia.' }, { status: 400 });
    }
    const sessionId = body.session_id || null;
    const userMessage = incoming.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';

    const db = supabaseAdmin();
    const restaurant = await getRestaurant();

    const [{ data: ai }, { data: rules }, { data: sectors }, { data: cats }, { data: items }, { data: events }] =
      await Promise.all([
        db.from('ai_settings').select('*').eq('restaurant_id', restaurant.id).maybeSingle(),
        db.from('reservation_rules').select('*').eq('restaurant_id', restaurant.id).maybeSingle(),
        db.from('sectors').select('public_name,description,active').eq('restaurant_id', restaurant.id).eq('active', true),
        db.from('menu_categories').select('id,name').eq('restaurant_id', restaurant.id).eq('active', true),
        db.from('menu_items').select('name,variation,price,category_id,available,active').eq('restaurant_id', restaurant.id).eq('active', true),
        db.from('special_events').select('title,event_date,public_message,active').eq('restaurant_id', restaurant.id).eq('active', true),
      ]);

    // IA desligada -> devolve mensagem de transferência humana
    if (ai && ai.enabled === false) {
      return NextResponse.json({
        ok: true,
        reply: ai.human_transfer_message || 'No momento o atendimento automático está desligado. Fale com a gente pelo WhatsApp.',
        step: 'disabled',
      });
    }

    // Monta o índice do cardápio ativo
    const catName = new Map((cats || []).map((c: any) => [c.id, c.name]));
    const indice = (items || [])
      .map((i: any) => {
        const preco = i.price != null ? `R$ ${Number(i.price).toFixed(2)}` : 'consultar';
        const disp = i.available === false ? ' (indisponível)' : '';
        return `- ${i.name}${i.variation ? ' (' + i.variation + ')' : ''} | ${preco} | ${catName.get(i.category_id) || ''}${disp}`;
      })
      .join('\n');

    const setoresTxt = (sectors || []).map((s: any) => `- ${s.public_name}`).join('\n');
    const eventosTxt = (events || []).map((e: any) => `- ${e.title} (${e.event_date || 'data a confirmar'}): ${e.public_message || ''}`).join('\n');

    const systemPrompt =
      (ai?.system_prompt && ai.system_prompt.trim()) ||
      `Você é a Lorena, atendente virtual do ${restaurant.name}. Fala como atendente brasileira simpática, mensagens curtas estilo WhatsApp.
REGRAS: nunca invente preço, prato, horário ou disponibilidade; nunca confirme reserva sozinha; nunca prometa desconto. Use SOMENTE os dados abaixo. Quando não souber, diga que vai confirmar com a equipe.
Endereço: ${restaurant.address || ''} | WhatsApp: ${restaurant.whatsapp_number || ''} | Instagram: ${restaurant.instagram_handle || ''}`;

    const contexto = `DADOS DA CASA:
${restaurant.name}
Endereço: ${restaurant.address || ''}
Setores:
${setoresTxt || '—'}
${rules ? `Reservas — mín ${rules.min_people} / máx ${rules.max_people} pessoas. ${rules.awareness_text || ''}` : ''}
${eventosTxt ? 'Eventos:\n' + eventosTxt : ''}

CARDÁPIO (itens ativos):
${indice || '— cardápio não cadastrado —'}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: contexto },
      ...incoming.slice(-12),
    ];

    // modo 'local' não chama a OpenRouter
    if (ai?.mode === 'local') {
      const reply = ai.fallback_message || 'Posso te ajudar com cardápio, horários e reservas. O que você procura?';
      await logAi(db, restaurant.id, sessionId, userMessage, reply, null, 'local', 0, 0, Date.now() - start, true);
      return NextResponse.json({ ok: true, reply, step: 'local' });
    }

    const result = await cascadeChat(messages, ai || {});
    await logAi(
      db,
      restaurant.id,
      sessionId,
      userMessage,
      result.text || '',
      result.model,
      result.step,
      result.inputTokens || 0,
      result.outputTokens || 0,
      result.latencyMs,
      result.fallbackUsed
    );

    return NextResponse.json({ ok: true, reply: result.text, step: result.step, model: result.model });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

async function logAi(
  db: any,
  restaurantId: string,
  sessionId: string | null,
  userMessage: string,
  assistantMessage: string,
  model: string | null,
  step: string,
  inputTokens: number,
  outputTokens: number,
  latencyMs: number,
  fallbackUsed: boolean
) {
  try {
    await db.from('ai_logs').insert({
      restaurant_id: restaurantId,
      session_id: sessionId,
      user_message: userMessage,
      assistant_message: assistantMessage,
      selected_model: model,
      cascade_step: step,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      latency_ms: latencyMs,
      fallback_used: fallbackUsed,
    });
  } catch {
    // log é best-effort
  }
}
