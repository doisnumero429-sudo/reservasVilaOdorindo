const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type CascadeResult = {
  text: string | null;
  model: string | null;
  step: string;
  fallbackUsed: boolean;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs: number;
  error?: string;
};

async function callOpenRouter(
  model: string,
  messages: ChatMessage[],
  opts: { maxTokens: number; temperature: number; timeoutMs: number }
): Promise<{ text: string | null; inputTokens?: number; outputTokens?: number }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY não configurada.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
  try {
    const r = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'Villa Grill - Bento',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      }),
    });
    if (!r.ok) throw new Error(`OpenRouter HTTP ${r.status}`);
    const d = await r.json();
    const text = d.choices?.[0]?.message?.content?.trim() || null;
    return {
      text,
      inputTokens: d.usage?.prompt_tokens,
      outputTokens: d.usage?.completion_tokens,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Cascata de modelos via OpenRouter:
 *  Etapa 1: modelo barato  -> Etapa 2: intermediário -> Etapa 3: forte
 *  Etapa 4: fallback humano (mensagem configurada).
 * A "Etapa 0" (resposta local/cache) é resolvida ANTES, na rota /api/ai/chat.
 */
export async function cascadeChat(
  messages: ChatMessage[],
  aiSettings: any
): Promise<CascadeResult> {
  const start = Date.now();
  const cfg = aiSettings?.cascade_config || {};
  const maxTokens = aiSettings?.max_tokens || 400;
  const temperature = Number(aiSettings?.temperature ?? 0.6);
  const timeoutMs = cfg.timeout_ms || 12000;

  const steps: { name: string; model?: string }[] = [
    { name: 'cheap', model: cfg.cheap_model },
    { name: 'mid', model: cfg.mid_model },
    { name: 'strong', model: cfg.strong_model },
  ];

  let lastError = '';
  for (const s of steps) {
    if (!s.model) continue;
    try {
      const out = await callOpenRouter(s.model, messages, { maxTokens, temperature, timeoutMs });
      if (out.text) {
        return {
          text: out.text,
          model: s.model,
          step: s.name,
          fallbackUsed: false,
          inputTokens: out.inputTokens,
          outputTokens: out.outputTokens,
          latencyMs: Date.now() - start,
        };
      }
    } catch (err: any) {
      lastError = String(err?.message || err);
      // tenta o próximo modelo da cascata
    }
  }

  // Etapa 4: fallback humano
  return {
    text: aiSettings?.fallback_message || 'Vou confirmar com a equipe e já te retorno. 🙏',
    model: null,
    step: 'fallback',
    fallbackUsed: true,
    latencyMs: Date.now() - start,
    error: lastError || undefined,
  };
}
