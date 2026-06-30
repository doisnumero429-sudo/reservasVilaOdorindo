/**
 * feedbackEngine — motor de reclamações/sugestões do Bento (Villa Grill 1).
 *
 * 100% determinístico (regex/palavras-chave + máquina de estados). NÃO depende do LLM:
 * funciona barato e previsível. O LLM pode ser usado opcionalmente só para "lapidar" o
 * texto do resumo (não é necessário para o fluxo).
 *
 * Regras carregadas POR NICHO: classifica a categoria e aplica apenas o pacote daquela
 * categoria — não joga todos os cenários no contexto.
 */

export const UNIDADE = 'Villa Grill 1 - Odorindo Perenha';

export type FeedbackStage =
  | 'idle'
  | 'need_details'
  | 'need_name'
  | 'need_whatsapp'
  | 'offer_upload'
  | 'summary'
  | 'await_confirm'
  | 'await_choice'
  | 'done_bento'
  | 'done_whatsapp';

export type FeedbackSession = {
  active: boolean;
  stage: FeedbackStage;
  unit: string;
  customerName: string | null;
  customerWhatsapp: string | null;
  originalMessages: string[];
  latestUserMessage: string | null;
  type: 'reclamação' | 'sugestão' | 'feedback' | null;
  category: string | null;
  priority: 'baixa' | 'média' | 'alta' | null;
  occurredDate: string | null;
  occurredTime: string | null;
  period: string | null;
  channel: string | null;
  tableNumber: string | null;
  tableReference: string | null;
  paymentMethod: string | null;
  chargedAmount: string | null;
  expectedAmount: string | null;
  productOrDish: string | null;
  staffReference: string | null;
  customerExpectation: string | null;
  attachments: { kind: string; name?: string }[];
  uploadOffered: boolean;
  askedExpectation: boolean;
  summary: string | null;
  relatoOrganizado: string | null;
  whatsappMessage: string | null;
  protocol: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UiDirective = {
  upload?: { label: string; hint: string; kind: string; paymentWarning?: boolean };
  summaryText?: string;
  confirmButtons?: boolean; // [Está certo] [Quero corrigir algo]
  finalChoice?: boolean; // [Registrar pelo Bento] [Enviar pelo WhatsApp]
};

export type StepResult = { session: FeedbackSession; reply: string; ui: UiDirective };

export function norm(s: string) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/* ----------------------------- 1) Intenção ----------------------------- */
// Indicadores claros de reclamação/sugestão (negativos ou de sugestão).
// Não inclui palavras neutras (pix, delivery, cartão) para não disparar em perguntas comuns.
const TRIGGERS = [
  'quero reclamar', 'reclam', 'tenho uma reclamacao', 'sugest', 'sugiro', 'seria legal', 'poderia ter',
  'voces podiam', 'voces poderiam', 'colocar mais', 'fica a dica', 'feedback', 'aconteceu um problema',
  'tive um problema', 'deu problema', 'problema', 'relatar problema', 'fui mal atendido', 'mal atendido', 'atendimento ruim',
  'atendimento horrivel', 'mal educad', 'sem educacao', 'grosso', 'grosseiro', 'ninguem me atendeu',
  'ninguem atendeu', 'xingou', 'xingamento', 'discrimina', 'humilhou', 'comida fria', 'veio fria',
  'estava fria', 'comida salgada', 'salgad', 'sem gosto', 'sem sabor', 'carne dura', 'estava dura',
  'muito dura', 'meio dura', 'nao passou', 'veio errad', 'queimad', 'crua',
  'comida ruim', 'prato ruim', 'porcao pequena', 'muito pequena', 'bem pequena', 'sem tempero', 'mal passad',
  'cabelo', 'plastico', 'vidro', 'inseto', 'bicho', 'objeto estranho', 'coisa estranha', 'alimento estranho',
  'larva', 'mosca', 'estranho na comida', 'passando mal', 'passou mal', 'passei mal', 'me senti mal',
  'falta de ar', 'alerg', 'intoxica', 'vomit', 'enjoo', 'mal estar', 'mal-estar', 'reacao', 'veneno',
  'fez mal', 'dor de barriga', 'demor', 'atrasou', 'atraso', 'fiquei esperando', 'esperei', 'esperando',
  'nao chegou', 'muito tempo', 'pedido errado', 'veio errado', 'faltou', 'veio incompleto', 'incompleto',
  'item errado', 'nao era o que pedi', 'pedi sem', 'mandaram outra', 'chegou frio', 'vazou', 'motoboy foi',
  'entregador foi', 'cobrad', 'cobrou', 'cobraram', 'troco errado', 'troco veio errado', 'valor errado',
  'conta errada', 'duas vezes', 'duplicad', 'paguei duas', 'a mais', 'indevid', 'banheiro sujo', 'mesa suja',
  'suja', 'sujo', 'sujeira', 'musica alta', 'musica muito alta', 'muito alta', 'som muito alto', 'muito calor',
  'barulho', 'nao gostei', 'fiquei chateado', 'chateado', 'absurdo', 'horrivel', 'pessimo', 'muito ruim',
  'que ruim', 'decepcionad', 'insatisfeit', 'falar com o gerente', 'falar com gerente', 'falar com responsavel',
  'deixar uma observacao', 'quero falar com o responsavel',
];

export function detectFeedbackIntent(text: string): boolean {
  const q = norm(text);
  return TRIGGERS.some((t) => q.includes(t));
}

/* --------------------- 2) Categorias (pacotes por nicho) --------------------- */
type CatRule = {
  category: string;
  type: 'reclamação' | 'sugestão' | 'feedback';
  keywords: string[];
  highKeywords?: string[]; // sobem prioridade para alta
  basePriority: 'baixa' | 'média' | 'alta';
  expectation: string;
  upload?: { always?: boolean; kind: string; label: string; hint: string; payment?: boolean };
};

const RULES: CatRule[] = [
  {
    category: 'pagamento', type: 'reclamação', basePriority: 'média',
    keywords: ['cobrad', 'cobrar', 'cobrou', 'cobran', 'troco', 'maquininha', 'comprovante', 'extrato', ' pix', 'cartao', 'debito', 'credito', 'conta errada', 'valor errado', 'paguei', 'duplicad', 'taxa'],
    highKeywords: ['duas vezes', 'duplicad', 'a mais', 'indevida', 'cobrado duas', 'paguei duas'],
    expectation: 'Análise da gerência sobre a divergência de cobrança informada e contato pelo WhatsApp, se necessário.',
    upload: { kind: 'comprovante', label: '📎 Enviar comprovante', hint: 'Maquininha, Pix ou print do extrato', payment: true },
  },
  {
    category: 'alimento_improprio', type: 'reclamação', basePriority: 'alta',
    keywords: ['cabelo', 'plastico', 'vidro', 'pedra', 'inseto', 'bicho', 'objeto estranho', 'coisa estranha', 'alimento estranho', 'larva', 'mosca', 'estranho na comida'],
    expectation: 'Que a gerência analise a situação com prioridade e verifique o ocorrido.',
    upload: { always: true, kind: 'foto_comida', label: '📷 Enviar foto', hint: 'Ajuda a gerência a verificar o ocorrido' },
  },
  {
    category: 'saude', type: 'reclamação', basePriority: 'alta',
    keywords: ['passando mal', 'passou mal', 'falta de ar', 'alerg', 'intoxica', 'vomit', 'enjoo', 'mal-estar', 'mal estar', 'reacao', 'veneno', 'fez mal', 'dor de barriga', 'me senti mal'],
    expectation: 'Que a gerência analise a situação com prioridade e verifique o ocorrido.',
    upload: { kind: 'foto_comida', label: '📷 Enviar foto', hint: 'Imagem do prato, embalagem ou item relacionado' },
  },
  {
    category: 'qualidade_comida', type: 'reclamação', basePriority: 'média',
    keywords: ['comida fria', 'veio fria', 'fria', 'salgad', 'sem gosto', 'sem sabor', 'carne dura', 'estava dura', 'queimad', 'crua', 'prato ruim', 'tempero', 'pequena', 'comida ruim', 'mal passad', 'sem tempero'],
    expectation: 'Que a gerência analise a qualidade do preparo e avalie melhorias.',
    upload: { kind: 'foto_comida', label: '📷 Enviar foto', hint: 'Prato, embalagem ou item recebido' },
  },
  {
    category: 'pedido_errado', type: 'reclamação', basePriority: 'média',
    keywords: ['pedido errado', 'veio errado', 'faltou', 'outra coisa', 'nao era o que pedi', 'veio incompleto', 'incompleto', 'item errado', 'pedi sem', 'veio com', 'mandaram outra', 'troquei o pedido'],
    expectation: 'Que a gerência analise o ocorrido com o pedido e avalie melhorias.',
    upload: { kind: 'foto_comida', label: '📷 Enviar foto', hint: 'Item recebido ou embalagem' },
  },
  {
    category: 'delivery', type: 'reclamação', basePriority: 'média',
    keywords: ['entrega', 'delivery', 'motoboy', 'chegou frio', 'taxa de entrega', 'embalagem', 'vazou', 'entregador'],
    expectation: 'Que a gerência analise o ocorrido na entrega e avalie melhorias.',
    upload: { kind: 'foto_comida', label: '📷 Enviar foto', hint: 'Embalagem, item recebido ou print do pedido' },
  },
  {
    category: 'demora', type: 'reclamação', basePriority: 'média',
    keywords: ['demor', 'atrasou', 'atraso', 'fiquei esperando', 'esperei', 'esperando', 'nao chegou', 'uma hora', 'muito tempo'],
    expectation: 'Que a gerência analise a demora relatada e avalie melhorias.',
  },
  {
    category: 'atendimento', type: 'reclamação', basePriority: 'média',
    keywords: ['mal atendido', 'garcom', 'sem educacao', 'atendimento', 'grosso', 'grosseiro', 'mal educado', 'ninguem me atendeu', 'ninguem atendeu', 'gerente', 'responsavel', 'caixa', 'atendente'],
    highKeywords: ['xingou', 'xingamento', 'agrediu', 'ameaca', 'discrimina', 'racis', 'humilhou', 'preconceito'],
    expectation: 'Que a gerência analise a conduta relatada e avalie melhorias no atendimento.',
  },
  {
    category: 'ambiente', type: 'reclamação', basePriority: 'baixa',
    keywords: ['banheiro', 'mesa suja', 'suja', 'sujo', 'sujeira', 'musica', 'som alto', 'som muito alto', 'alta', 'calor', 'fila', 'evento', 'espaco kids', 'limpeza', 'barulho', 'quente'],
    expectation: 'Que a gerência analise o ponto relatado sobre o ambiente e avalie melhorias.',
    upload: { kind: 'foto_ambiente', label: '📷 Enviar foto do local', hint: 'Ajuda a gerência a entender o ocorrido' },
  },
  {
    category: 'sugestao', type: 'sugestão', basePriority: 'baixa',
    keywords: ['poderia ter', 'seria legal', 'voces podiam', 'voces poderiam', 'sugiro', 'sugest', 'colocar mais', 'ter opcao', 'seria bom ter', 'podiam', 'poderiam', 'fica a dica', 'recomendo que', 'melhorar', 'melhoria', 'minha sugestao'],
    expectation: 'Que a sugestão seja avaliada pela gerência.',
  },
];

function scoreBestCategory(text: string): { rule: CatRule; score: number } {
  const q = ' ' + norm(text) + ' ';
  let best: CatRule = RULES.find((r) => r.category === 'atendimento')!;
  let bestScore = 0;
  for (const r of RULES) {
    let score = 0;
    for (const k of r.keywords) if (q.includes(norm(k))) score += 2;
    for (const k of r.highKeywords || []) if (q.includes(norm(k))) score += 1;
    if (score > bestScore) { bestScore = score; best = r; }
  }
  return { rule: best, score: bestScore };
}

export function classifyCategory(text: string): CatRule {
  return scoreBestCategory(text).rule;
}

export function priorityFor(rule: CatRule, text: string): 'baixa' | 'média' | 'alta' {
  const q = norm(text);
  if (rule.basePriority === 'alta') return 'alta';
  const high = (rule.highKeywords || []).some((k) => q.includes(norm(k)));
  const exaltado = ['absurdo', 'palhacada', 'nunca mais', 'vergonha', 'processar', 'procon', 'revoltado', 'indignado'].some((k) => q.includes(k));
  if (high || exaltado) return 'alta';
  return rule.basePriority;
}

/* --------------------------- 4) Extração --------------------------- */
export function extract(session: FeedbackSession, text: string) {
  const q = norm(text);
  const set = (f: keyof FeedbackSession, v: any) => { if (v && !session[f]) (session as any)[f] = v; };

  // data
  if (/anteontem/.test(q)) set('occurredDate', 'anteontem');
  else if (/ontem/.test(q)) set('occurredDate', 'ontem');
  else if (/hoje|agora|faz pouco|ha pouco/.test(q)) set('occurredDate', 'hoje');
  else if (/semana passada/.test(q)) set('occurredDate', 'semana passada');
  const dataM = q.match(/dia\s+(\d{1,2})(?:\s*\/\s*(\d{1,2}))?/);
  if (dataM) set('occurredDate', `dia ${dataM[1]}${dataM[2] ? '/' + dataM[2] : ''}`);

  // período / horário
  if (/almoc/.test(q)) set('period', 'almoço');
  else if (/jantar|a noite|de noite|noite/.test(q)) set('period', 'noite');
  const horaM = q.match(/(\d{1,2})\s*(?:h|:\s*\d{2}|horas)/);
  if (horaM) set('occurredTime', horaM[0].replace(/\s+/g, ''));
  if (/meio-dia|meio dia/.test(q)) set('occurredTime', '12h');

  // canal
  if (/delivery|entrega|motoboy/.test(q)) set('channel', 'delivery');
  else if (/retirada|retirei|buscar/.test(q)) set('channel', 'retirada');
  else if (/salao|mesa|garcom|restaurante|presencial|ai no/.test(q)) set('channel', 'salão');
  else if (/whatsapp|zap/.test(q)) set('channel', 'whatsapp');

  // pagamento
  if (/cartao|credito|debito/.test(q)) set('paymentMethod', 'cartão');
  else if (/\bpix\b/.test(q)) set('paymentMethod', 'Pix');
  else if (/dinheiro|especie/.test(q)) set('paymentMethod', 'dinheiro');
  const valores = [...text.matchAll(/r\$\s?(\d{1,4}(?:[.,]\d{2})?)/gi)].map((m) => 'R$ ' + m[1]);
  if (valores.length >= 2) { set('chargedAmount', valores[0]); set('expectedAmount', valores[1]); }
  else if (valores.length === 1) set('chargedAmount', valores[0]);

  // mesa / referência
  const mesaM = q.match(/mesa\s+(\d{1,3})/);
  if (mesaM) set('tableNumber', mesaM[1]);
  const refs: [RegExp, string][] = [
    [/banheiro/, 'próximo aos banheiros'], [/palco/, 'perto do palco'], [/kids|brinquedo/, 'perto do espaço kids'],
    [/churrasqueira/, 'perto da churrasqueira'], [/pizzaria/, 'perto da pizzaria'], [/entrada/, 'perto da entrada'],
    [/caixa/, 'perto do caixa'], [/janela/, 'perto da janela'], [/calcada|area externa|do lado de fora/, 'área externa'],
    [/fundo/, 'fundo do salão'], [/cozinha/, 'perto da cozinha'], [/buffet/, 'perto do buffet'],
  ];
  for (const [re, label] of refs) if (re.test(q) && !session.tableNumber) { set('tableReference', label); break; }

  return session;
}

/* --------------------- WhatsApp do cliente (validação) --------------------- */
export function looksLikeWhatsapp(text: string): string | null {
  const d = (text || '').replace(/\D/g, '');
  if (d.length >= 10 && d.length <= 13) return d.startsWith('55') ? d : '55' + d;
  return null;
}

/* --------------------------- Helpers de nome --------------------------- */
function extractName(text: string): string | null {
  const t = (text || '').trim();
  const m = t.match(/(?:meu nome (?:e|é)|me chamo|sou o|sou a|aqui (?:e|é)(?: o| a)?)\s+([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?)/i);
  if (m) return cap(m[1]);
  // resposta curta só com o nome
  if (/^[A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]+){0,2}$/.test(t) && t.split(/\s+/).length <= 3) return cap(t);
  return null;
}
function cap(s: string) {
  return s.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* --------------------------- Resumo --------------------------- */
export function buildSummary(s: FeedbackSession): string {
  const linhas: string[] = [];
  const add = (label: string, v?: string | null) => { if (v) linhas.push(`${label}: ${v}`); };
  add('Nome', s.customerName);
  add('WhatsApp', s.customerWhatsapp ? formatWa(s.customerWhatsapp) : null);
  linhas.push(`Unidade: ${UNIDADE}`);
  add('Tipo', s.type ? s.type.charAt(0).toUpperCase() + s.type.slice(1) : null);
  add('Categoria', categoriaLabel(s.category));
  add('Data aproximada', s.occurredDate);
  add('Horário/período', s.occurredTime || s.period);
  add('Canal', s.channel);
  add('Mesa/Localização', s.tableNumber ? `mesa ${s.tableNumber}` : s.tableReference);
  add('Valor cobrado', s.chargedAmount);
  add('Valor esperado', s.expectedAmount);
  add('Forma de pagamento', s.paymentMethod);
  add('Prato/item', s.productOrDish);
  add('Prioridade', s.priority);
  if (s.attachments.length) linhas.push(`Imagens anexadas: ${s.attachments.length}`);
  const relato = (s.relatoOrganizado || s.originalMessages.join(' ')).trim();
  let out = linhas.join('\n');
  out += `\n\nRelato organizado:\n${relato}`;
  out += `\n\nO que você espera:\n${s.customerExpectation || 'Apenas registrar a ocorrência para conhecimento da gerência.'}`;
  return out;
}

export function categoriaLabel(c: string | null) {
  const map: Record<string, string> = {
    pagamento: 'Pagamento/Cobrança', atendimento: 'Atendimento', qualidade_comida: 'Qualidade da comida',
    alimento_improprio: 'Alimento impróprio', saude: 'Possível risco à saúde', demora: 'Demora',
    pedido_errado: 'Pedido errado', delivery: 'Delivery', ambiente: 'Ambiente/Limpeza', sugestao: 'Sugestão',
  };
  return c ? map[c] || c : null;
}

function formatWa(d: string) {
  const n = d.replace(/^55/, '');
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return d;
}

/* --------------------- Mensagem para WhatsApp (1ª pessoa) --------------------- */
export function buildWhatsappMessage(s: FeedbackSession): string {
  const nome = s.customerName || '';
  const tipo = s.type === 'sugestão' ? 'uma sugestão' : 'uma reclamação';
  const partes: string[] = [];
  partes.push(`Olá! Meu nome é ${nome}.`);
  partes.push(`Gostaria de registrar ${tipo} sobre o ${UNIDADE}.`);
  const relato = (s.relatoOrganizado || s.originalMessages.join(' ')).trim();
  if (relato) partes.push(relato);
  const ctx: string[] = [];
  if (s.occurredDate || s.period || s.occurredTime) ctx.push(`Isso foi ${[s.occurredDate, s.period, s.occurredTime].filter(Boolean).join(', ')}.`);
  if (s.channel) ctx.push(`Canal: ${s.channel}.`);
  if (s.tableNumber || s.tableReference) ctx.push(`Eu estava ${s.tableNumber ? 'na mesa ' + s.tableNumber : s.tableReference}.`);
  if (s.chargedAmount) ctx.push(`Valor cobrado: ${s.chargedAmount}${s.expectedAmount ? `, sendo que o correto seria ${s.expectedAmount}` : ''}.`);
  if (ctx.length) partes.push(ctx.join(' '));
  partes.push(s.customerExpectation || 'Gostaria que essa situação fosse analisada pela gerência.');
  partes.push('Obrigado.');
  return partes.join('\n\n');
}

/* =====================================================================
 *  Máquina de estados — avança UM passo da conversa.
 * ===================================================================== */
export function newSession(): FeedbackSession {
  const now = new Date().toISOString();
  return {
    active: true, stage: 'idle', unit: UNIDADE, customerName: null, customerWhatsapp: null,
    originalMessages: [], latestUserMessage: null, type: null, category: null, priority: null,
    occurredDate: null, occurredTime: null, period: null, channel: null, tableNumber: null,
    tableReference: null, paymentMethod: null, chargedAmount: null, expectedAmount: null,
    productOrDish: null, staffReference: null, customerExpectation: null, attachments: [],
    uploadOffered: false, askedExpectation: false, summary: null, relatoOrganizado: null, whatsappMessage: null,
    protocol: null, status: 'rascunho', createdAt: now, updatedAt: now,
  };
}

const ACOLHIDA = 'Poxa, sinto muito por isso. Quero entender direitinho para te ajudar da melhor forma.\n\nMe conta o que aconteceu, pode falar do seu jeito.';

export function stepFeedback(session: FeedbackSession | null, userMessage: string, opts: { uploadsEnabled?: boolean } = {}): StepResult {
  const uploadsEnabled = opts.uploadsEnabled !== false;
  let s = session && session.active ? session : newSession();
  s.latestUserMessage = userMessage;
  s.updatedAt = new Date().toISOString();
  const ui: UiDirective = {};

  // Primeira ativação
  if (s.stage === 'idle') {
    const rule = classifyCategory(userMessage);
    s.type = rule.type;
    s.category = rule.category;
    s.priority = priorityFor(rule, userMessage);
    const temRelato = userMessage.trim().split(/\s+/).length >= 5;
    if (temRelato) s.originalMessages.push(userMessage.trim());
    extract(s, userMessage);
    s.customerExpectation = rule.expectation;

    if (s.priority === 'alta' && s.category === 'saude') {
      s.stage = 'need_name';
      return { session: s, reply: 'Sinto muito mesmo por isso. Como é uma situação mais delicada, vou registrar como prioridade alta e encaminhar direto para análise da gerência.\n\nSe você estiver passando mal neste momento, procure atendimento imediatamente. Mesmo assim, vou organizar sua manifestação com atenção.\n\nMe passa seu nome, por favor?', ui };
    }
    if (!temRelato) { s.stage = 'need_details'; return { session: s, reply: ACOLHIDA, ui }; }
    s.stage = 'need_name';
    return { session: s, reply: 'Entendi, sinto muito por isso. Vou organizar essa situação para a gerência analisar com atenção.\n\nMe passa seu nome, por favor?', ui };
  }

  // Coletando o relato
  if (s.stage === 'need_details') {
    s.originalMessages.push(userMessage.trim());
    extract(s, userMessage);
    s.stage = 'need_name';
    return { session: s, reply: 'Obrigado por contar. Me passa seu nome, por favor?', ui };
  }

  // Nome
  if (s.stage === 'need_name') {
    const nome = extractName(userMessage);
    extract(s, userMessage);
    if (!nome) return { session: s, reply: 'Como posso te chamar? Me passa seu nome, por favor.', ui };
    s.customerName = nome;
    s.stage = 'need_whatsapp';
    return { session: s, reply: `Obrigado, ${nome.split(' ')[0]}. Agora me passa um WhatsApp para a gerência conseguir analisar e, se necessário, retornar.`, ui };
  }

  // WhatsApp
  if (s.stage === 'need_whatsapp') {
    const wa = looksLikeWhatsapp(userMessage);
    if (!wa) return { session: s, reply: 'Esse número parece estar incompleto. Pode me passar um WhatsApp válido, por favor? (com DDD)', ui };
    s.customerWhatsapp = wa;
    return offerUploadOrSummarize(s, uploadsEnabled);
  }

  // Ofereceu upload — cliente respondeu (pulou ou seguiu)
  if (s.stage === 'offer_upload') {
    extract(s, userMessage);
    return summarize(s);
  }

  // Confirmação do resumo — texto livre é tratado como correção e incorporado
  if (s.stage === 'await_confirm') {
    if (userMessage && userMessage.trim().length > 1) {
      s.originalMessages.push(userMessage.trim());
      extract(s, userMessage);
    }
    return summarize(s);
  }

  // fallback
  return summarize(s);
}

function offerUploadOrSummarize(s: FeedbackSession, uploadsEnabled = true): StepResult {
  const rule = RULES.find((r) => r.category === s.category);
  if (uploadsEnabled && rule?.upload && !s.uploadOffered) {
    s.uploadOffered = true;
    s.stage = 'offer_upload';
    const ui: UiDirective = { upload: { label: rule.upload.label, hint: rule.upload.hint, kind: rule.upload.kind, paymentWarning: !!rule.upload.payment } };
    let reply = 'Se você tiver uma imagem, pode anexar por aqui — ela vai junto da sua manifestação para ajudar a gerência. Se preferir, é só seguir sem anexar.';
    if (rule.upload.payment) reply += '\n\nSe for print do extrato, pode ocultar saldo, agência, conta e número de cartão. O importante é aparecer o valor, a data e a identificação da cobrança.';
    return { session: s, reply, ui };
  }
  return summarize(s);
}

function summarize(s: FeedbackSession): StepResult {
  // Reavalia a categoria com o RELATO COMPLETO (a 1ª mensagem pode ter sido vaga).
  const textoCompleto = s.originalMessages.join(' ');
  if (textoCompleto.trim().split(/\s+/).length >= 3) {
    const rule = classifyCategory(textoCompleto);
    if (rule) {
      s.category = rule.category;
      s.type = rule.type;
      s.priority = priorityFor(rule, textoCompleto);
      s.customerExpectation = rule.expectation;
    }
  }
  s.summary = buildSummary(s);
  s.whatsappMessage = buildWhatsappMessage(s);
  s.stage = 'await_confirm';
  const ui: UiDirective = { summaryText: s.summary, confirmButtons: true };
  return {
    session: s,
    reply: 'Organizei sua mensagem aqui para você conferir. Veja se está tudo certinho antes de escolher como prefere enviar.',
    ui,
  };
}

/** Cliente confirmou o resumo -> mostra a escolha final. */
export function confirmSummary(s: FeedbackSession): StepResult {
  s.stage = 'await_choice';
  return { session: s, reply: 'Como você prefere prosseguir?', ui: { finalChoice: true } };
}

/** Mensagem final ao registrar pelo Bento. */
export function bentoClosingMessage(protocolo: string): string {
  return `Pronto, sua mensagem foi registrada e encaminhada diretamente para análise da gerência.\n\nSeu protocolo é: ${protocolo}\n\nObrigado por avisar a gente. Esse tipo de retorno ajuda muito a melhorar nosso atendimento. Se necessário, o retorno será feito pelo WhatsApp informado.`;
}
