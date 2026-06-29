import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getRestaurant } from '@/lib/supabase';
import { cascadeChat, ChatMessage } from '@/lib/openrouter';
import { buildMenuContext } from '@/lib/menu-context';
import { createReservation } from '@/lib/reservations';

export const runtime = 'nodejs';

const BOOK_MARK = '[[RESERVAR]]';

function norm(s: string) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * POST /api/ai/chat  — Lorena (site).
 * Faz: busca inteligente no cardápio, consciência de bloqueios/eventos, RESERVA
 * POR CONVERSA, cache (economia) e proteção de limite. A chave fica só no servidor.
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
    if (incoming.length === 0) return NextResponse.json({ ok: false, error: 'Mensagem vazia.' }, { status: 400 });

    const sessionId = body.session_id || null;
    const userMessage = incoming.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';

    const db = supabaseAdmin();
    const restaurant = await getRestaurant();
    const tz = restaurant.timezone || 'America/Sao_Paulo';
    const hojeISO = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const diaSemana = new Intl.DateTimeFormat('pt-BR', { timeZone: tz, weekday: 'long' }).format(new Date());

    const [{ data: ai }, { data: rules }, { data: sectors }, { data: events }, { data: blocks }, { data: highlights }, { data: knowledge }, { data: precos }] = await Promise.all([
      db.from('ai_settings').select('*').eq('restaurant_id', restaurant.id).maybeSingle(),
      db.from('reservation_rules').select('*').eq('restaurant_id', restaurant.id).maybeSingle(),
      db.from('sectors').select('code,public_name,active,allow_reservation').eq('restaurant_id', restaurant.id).eq('active', true).order('sort_order'),
      db.from('special_events').select('title,event_date,public_message,block_reservations,active').eq('restaurant_id', restaurant.id).eq('active', true).gte('event_date', hojeISO),
      db.from('reservation_blocks').select('block_date,period,public_message').eq('restaurant_id', restaurant.id).gte('block_date', hojeISO).order('block_date'),
      db.from('menu_items').select('name,featured,image:assets(public_url)').eq('restaurant_id', restaurant.id).eq('active', true).or('featured.eq.true,image_asset_id.not.is.null'),
      db.from('ai_knowledge').select('id,question,answer,keywords,hits').eq('restaurant_id', restaurant.id).eq('active', true).order('sort_order'),
      db.from('menu_items').select('price').eq('restaurant_id', restaurant.id).eq('active', true).not('price', 'is', null),
    ]);

    // conjunto de preços REAIS (em centavos) para travar invenção de preço
    const precosValidos = new Set<number>();
    (precos || []).forEach((p: any) => { if (p.price != null) precosValidos.add(Math.round(Number(p.price) * 100)); });

    // destaques (mais pedidos) e mapa de fotos (nome -> URL real, para não inventar link)
    const photoMap = new Map<string, string>();
    (highlights || []).forEach((h: any) => { const u = h.image?.public_url; if (u) photoMap.set(norm(h.name), u); });
    const featuredTxt = (highlights || []).filter((h: any) => h.featured).map((h: any) => h.name).join(', ');
    const comFoto = (highlights || []).filter((h: any) => h.image?.public_url).map((h: any) => h.name).join(', ');

    const cfg = ai?.cascade_config || {};

    // IA desligada
    if (ai && ai.enabled === false) {
      return NextResponse.json({
        ok: true,
        reply: ai.human_transfer_message || 'No momento o atendimento automático está desligado. Fale com a gente pelo WhatsApp.',
        step: 'disabled',
      });
    }

    // ---- Etapa 0: cache (só em conversas curtas, p/ não servir resposta fora de contexto) ----
    const cacheEnabled = cfg.cache_enabled !== false;
    const questionKey = norm(userMessage);
    const podeCachear = cacheEnabled && incoming.length <= 2 && questionKey.length >= 4 && !questionKey.match(/reserv|mesa|nome|whats|telefone/);
    if (podeCachear) {
      const { data: hit } = await db
        .from('ai_cache')
        .select('id,answer,hits')
        .eq('restaurant_id', restaurant.id)
        .eq('question_key', questionKey)
        .maybeSingle();
      if (hit) {
        db.from('ai_cache').update({ hits: (hit.hits || 1) + 1, updated_at: new Date().toISOString() }).eq('id', hit.id).then(() => {});
        const logId = await logAi(db, restaurant.id, sessionId, userMessage, hit.answer, null, 'cache', 0, 0, Date.now() - start, false);
        return NextResponse.json({ ok: true, reply: hit.answer, step: 'cache', log_id: logId });
      }
    }

    // ---- Etapa 0.5: base de conhecimento (FAQ treinável pela casa) ----
    const qPad = ` ${questionKey} `;
    if (incoming.length <= 2 && knowledge && (knowledge as any[]).length) {
      const hit = (knowledge as any[]).find((k) => {
        const kws = (k.keywords || []).map((w: string) => norm(w)).filter(Boolean);
        if (!kws.length) return false;
        return kws.every((w: string) => qPad.includes(w));
      });
      if (hit) {
        db.from('ai_knowledge').update({ hits: (hit.hits || 0) + 1 }).eq('id', hit.id).then(() => {});
        const logId = await logAi(db, restaurant.id, sessionId, userMessage, hit.answer, null, 'faq', 0, 0, Date.now() - start, false);
        return NextResponse.json({ ok: true, reply: hit.answer, step: 'faq', log_id: logId });
      }
    }

    // ---- Proteção de limite (conta chamadas reais à IA) ----
    const inicioDia = `${hojeISO}T00:00:00`;
    const ha1min = new Date(Date.now() - 60_000).toISOString();
    const dailyLimit = Number(cfg.daily_call_limit) || 900;
    const minuteLimit = Number(cfg.per_minute_limit) || 18;
    const [{ count: hoje }, { count: minuto }] = await Promise.all([
      db.from('ai_logs').select('*', { count: 'exact', head: true }).eq('restaurant_id', restaurant.id).in('cascade_step', ['cheap', 'mid', 'strong', 'fallback']).gte('created_at', inicioDia),
      db.from('ai_logs').select('*', { count: 'exact', head: true }).eq('restaurant_id', restaurant.id).in('cascade_step', ['cheap', 'mid', 'strong', 'fallback']).gte('created_at', ha1min),
    ]);
    if ((hoje || 0) >= dailyLimit || (minuto || 0) >= minuteLimit) {
      const msg = ai?.fallback_message || 'Estou com muitas conversas agora 😅 me chama de novo em instantes, ou fale com a equipe pelo WhatsApp.';
      const logId = await logAi(db, restaurant.id, sessionId, userMessage, msg, null, 'ratelimited', 0, 0, Date.now() - start, true);
      return NextResponse.json({ ok: true, reply: msg, step: 'ratelimited', log_id: logId });
    }

    // ---- Contexto: disponibilidade + setores + cardápio relevante ----
    const setoresTxt = (sectors || []).map((s: any) => `- ${s.public_name} (código: ${s.code}${s.allow_reservation ? '' : ', NÃO aceita reserva'})`).join('\n');
    const bloqueiosTxt = (blocks || []).length
      ? (blocks || []).map((b: any) => `- ${b.block_date} (${b.period}): ${b.public_message || 'sem reservas'}`).join('\n')
      : 'Nenhuma data bloqueada.';
    const eventosTxt = (events || []).length
      ? (events || []).map((e: any) => `- ${e.event_date}: ${e.title}${e.block_reservations ? ' [BLOQUEIA RESERVAS]' : ''} — ${e.public_message || ''}`).join('\n')
      : 'Nenhum evento próximo.';
    const cardapioTxt = await buildMenuContext(db, restaurant.id, userMessage);
    const faqTxt = (knowledge && (knowledge as any[]).length)
      ? (knowledge as any[]).map((k) => `P: ${k.question}\nR: ${k.answer}`).join('\n\n')
      : '';

    const regrasTxt = rules
      ? `Reservas: ${rules.lunch_enabled ? 'almoço sim' : 'almoço não'}, ${rules.dinner_enabled ? 'noite sim' : 'noite não'}. De ${rules.min_people} a ${rules.max_people} pessoas. Grupos com ${rules.large_group_threshold}+ pessoas falam com a equipe. ${rules.awareness_text || ''}`
      : '';

    const baseInstrucoes =
      (ai?.system_prompt && ai.system_prompt.trim()) ||
      `Você é a Lorena, atendente virtual do ${restaurant.name}. Você conhece o cardápio a fundo e ADORA ajudar o cliente a escolher e comer bem.

COMO VOCÊ FALA:
- Calorosa, simpática e natural, como uma ótima atendente brasileira. Use emoji com leveza (🔥😋👏).
- Quando falar de um prato, DEMONSTRE conhecimento: descreva o prato com vontade, diga o que ACOMPANHA, a PORÇÃO (quantas pessoas serve) e o PREÇO. Faça dar água na boca.
- Pode escrever 1 a 2 parágrafos quando o assunto pedir — NÃO precisa ser curta demais. Riqueza e calor humano são bem-vindos.
- Foque no que a pessoa pediu, mas ofereça sugestões e acompanhamentos. Conduza a conversa, ajude a decidir.
- Destaque nomes de pratos e preços em **negrito**.

REGRAS DE OURO (NUNCA quebre):
- PREÇO: só diga um preço se ele estiver EXATAMENTE escrito no cardápio fornecido abaixo. Copie o número exato (ex.: R$ 59,00). É PROIBIDO estimar, arredondar, "achar" ou inventar preço. Se o preço do que perguntaram NÃO estiver na lista, diga: "esse valor eu confirmo certinho com a equipe 🙏" — NUNCA chute.
- Use SOMENTE os dados fornecidos (cardápio, regras, disponibilidade). NUNCA invente prato, ingrediente, o que acompanha ou porção.
- Se não tiver a informação, diga com naturalidade que confirma com a equipe — nunca invente.
- Não prometa desconto.`;

    const comportamento = `
SEU PAPEL: você DEMONSTRA e informa — você NÃO vende e NÃO tira pedidos nem faz delivery.
- Quando o cliente quiser PEDIR, COMPRAR ou pedir DELIVERY, oriente com simpatia e termine a mensagem com o token [BOTAO_DELIVERY] (cardápio online oficial). Nunca pressione a comprar.
- Você ajuda a pessoa a decidir tirando dúvidas (o que é o prato, o que acompanha, preço). A compra é sempre no cardápio online.
DESTAQUES / MAIS PEDIDOS: ${featuredTxt || '— (nenhum marcado)'}.
FOTOS: para um prato com foto disponível, você PODE mostrar a imagem incluindo numa linha própria exatamente assim: [[FOTO:Nome exato do prato]] (use só o nome; eu insiro a foto). Não invente URLs.
Pratos com foto disponível: ${comFoto || 'nenhum no momento'}.`;

    const protocoloReserva = `
VOCÊ PODE FAZER A RESERVA PELO CHAT. Para isso, colete naturalmente, um de cada vez:
1) nome, 2) WhatsApp (com DDD), 3) data, 4) período (almoço ou noite), 5) horário, 6) número de pessoas, 7) setor de preferência.
Regras:
- Hoje é ${hojeISO} (${diaSemana}). Converta "amanhã/sexta/fim de semana" para a data real (formato AAAA-MM-DD).
- NUNCA reserve em data bloqueada ou em evento que bloqueia reservas (veja DISPONIBILIDADE). Ofereça outra data.
- Respeite o mínimo/máximo de pessoas. Grupo grande: oriente falar com a equipe.
- A reserva fica PENDENTE (a equipe confirma depois pelo WhatsApp). Deixe isso claro.
- Confirme os dados com o cliente ANTES de finalizar.
Quando o cliente CONFIRMAR e você tiver TODOS os dados, escreva uma frase curta de confirmação e, na última linha, APENAS isto (nada depois):
${BOOK_MARK}{"nome":"...","whatsapp":"...","pessoas":N,"data":"AAAA-MM-DD","periodo":"almoco|noite","horario":"HH:MM","setor":"codigo_do_setor","observacoes":"..."}
Não mostre esse código se ainda faltar algum dado.`;

    const contexto = `DADOS DA CASA:
${restaurant.name} | Endereço: ${restaurant.address || ''} | WhatsApp: ${restaurant.whatsapp_number || ''} | Instagram: ${restaurant.instagram_handle || ''}
${regrasTxt}

SETORES:
${setoresTxt || '—'}

DISPONIBILIDADE (não reserve nessas datas/períodos):
Bloqueios:
${bloqueiosTxt}
Eventos:
${eventosTxt}
${faqTxt ? `\nBASE DE CONHECIMENTO DA CASA (use estas respostas oficiais quando couber):\n${faqTxt}\n` : ''}
${cardapioTxt}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: baseInstrucoes + '\n' + comportamento + '\n' + protocoloReserva },
      { role: 'system', content: contexto },
      ...incoming.slice(-12),
    ];

    // modo 'local' não chama a IA
    if (ai?.mode === 'local') {
      const reply = ai.fallback_message || 'Posso te ajudar com cardápio, horários e reservas. O que você procura?';
      const logId = await logAi(db, restaurant.id, sessionId, userMessage, reply, null, 'local', 0, 0, Date.now() - start, true);
      return NextResponse.json({ ok: true, reply, step: 'local', log_id: logId });
    }

    const result = await cascadeChat(messages, ai || {});
    let reply = result.text || '';
    let reservation: any = null;

    // ---- Detecta a reserva por conversa ----
    const mark = reply.indexOf(BOOK_MARK);
    if (mark >= 0) {
      const lead = reply.slice(0, mark).trim();
      const jsonRaw = reply.slice(mark + BOOK_MARK.length).trim();
      const m = jsonRaw.match(/\{[\s\S]*\}/);
      try {
        const dados = m ? JSON.parse(m[0]) : null;
        if (dados) {
          const res = await createReservation({
            restaurantId: restaurant.id,
            nome: dados.nome,
            whatsapp: dados.whatsapp,
            pessoas: Number(dados.pessoas),
            data: dados.data,
            periodo: dados.periodo === 'noite' ? 'noite' : 'almoco',
            horario: dados.horario,
            setorCode: dados.setor,
            observacoes: dados.observacoes,
            source: 'chat',
          });
          if (res.ok) {
            reservation = { id: res.reservation.id };
            reply = `${lead ? lead + '\n\n' : ''}✅ Prontinho! Sua pré-reserva foi registrada e está *pendente de confirmação*. A equipe vai te chamar no WhatsApp para confirmar. 🙏`;
          } else if (res.blocked) {
            reply = `${lead ? lead + '\n\n' : ''}Ah, nessa data não consigo reservar: ${res.message || res.error} Quer tentar outra data? 😊`;
          } else if (res.largeGroup) {
            reply = `${lead ? lead + '\n\n' : ''}Para esse número de pessoas, o melhor é falar direto com a equipe pra organizarmos tudo com carinho. ${res.message || ''} [BOTAO_WHATSAPP]`;
          } else {
            reply = `${lead ? lead + '\n\n' : ''}Não consegui finalizar: ${res.error}. Pode me confirmar os dados de novo?`;
          }
        } else {
          reply = lead || 'Pode me confirmar os dados da reserva, por favor?';
        }
      } catch {
        reply = lead || 'Pode me confirmar os dados da reserva, por favor?';
      }
    }

    // ---- Troca [[FOTO:nome]] pela imagem real do banco (sem alucinar URL) ----
    reply = reply
      .replace(/\[\[FOTO:([^\]]+)\]\]/g, (_m: string, nm: string) => {
        const u = photoMap.get(norm(nm));
        return u ? `[[IMG:${u}]]` : '';
      })
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // ---- TRAVA ANTI-PREÇO-INVENTADO ----
    // Se a Lorena citar um valor que NÃO existe no cardápio, é alucinação: avisamos.
    let precoInventado = false;
    if (precosValidos.size) {
      const matches = reply.match(/R\$\s?\d{1,4}(?:[.,]\d{2})?/g) || [];
      for (const mch of matches) {
        const n = Math.round(parseFloat(mch.replace(/[^\d.,]/g, '').replace('.', '').replace(',', '.')) * 100);
        // aceita também valores "inteiros" (ex.: R$ 59 == 5900)
        const nInt = Math.round(parseFloat(mch.replace(/[^\d.,]/g, '').replace(',', '.')) * 100);
        if (!precosValidos.has(n) && !precosValidos.has(nInt)) { precoInventado = true; break; }
      }
    }
    if (precoInventado) {
      reply += '\n\n_(Ah, sobre os valores: deixa eu confirmar certinho com a equipe pra não te passar informação errada, tá? 🙏)_';
    }

    // ---- Guarda no cache (respostas simples, sem reserva/botões) ----
    if (podeCachear && !reservation && !precoInventado && reply && !reply.includes('[BOTAO_') && !result.fallbackUsed) {
      db.from('ai_cache')
        .upsert({ restaurant_id: restaurant.id, question_key: questionKey, answer: reply }, { onConflict: 'restaurant_id,question_key' })
        .then(() => {});
    }

    const logId = await logAi(db, restaurant.id, sessionId, userMessage, reply, result.model, result.step, result.inputTokens || 0, result.outputTokens || 0, result.latencyMs, result.fallbackUsed);

    return NextResponse.json({ ok: true, reply, step: result.step, model: result.model, reservation, log_id: logId, cascadeError: result.error || null });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

async function logAi(
  db: any, restaurantId: string, sessionId: string | null, userMessage: string, assistantMessage: string,
  model: string | null, step: string, inputTokens: number, outputTokens: number, latencyMs: number, fallbackUsed: boolean
): Promise<string | null> {
  try {
    const { data } = await db.from('ai_logs').insert({
      restaurant_id: restaurantId, session_id: sessionId, user_message: userMessage, assistant_message: assistantMessage,
      selected_model: model, cascade_step: step, input_tokens: inputTokens, output_tokens: outputTokens,
      latency_ms: latencyMs, fallback_used: fallbackUsed,
    }).select('id').single();
    return data?.id || null;
  } catch { return null; }
}
