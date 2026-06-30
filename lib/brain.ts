/**
 * "Cérebro do Bento" — conhecimento/regras em formato de DADOS (JSON), editável e versionado.
 * Exportável para o ChatGPT melhorar e reimportável, sem precisar de novo deploy.
 * NÃO contém preços/cardápio (esses vêm do banco, para nunca inventar).
 */

export type Brain = {
  schema_version: number;
  version: number;
  unit: string;
  persona: { name: string; tone: string; rules: string[] };
  feedback_triggers: string[];
  feedback_categories: {
    category: string;
    type: 'reclamação' | 'sugestão' | 'feedback';
    keywords: string[];
    high_keywords?: string[];
    priority: 'baixa' | 'média' | 'alta';
    expectation: string;
    questions?: string[];
  }[];
  synonyms: Record<string, string[]>;
  knowledge: { question: string; answer: string; keywords: string[] }[];
  policies: string[];
  system_prompt_extra: string;
  _notas_evolucao?: string[];
};

export const BRAIN_SCHEMA_VERSION = 1;

/** Cérebro inicial (espelha as regras atuais do Bento). Vira a 1ª exportação. */
export function defaultBrain(unit = 'Villa Grill 1 - Odorindo Perenha'): Brain {
  return {
    schema_version: BRAIN_SCHEMA_VERSION,
    version: 1,
    unit,
    persona: {
      name: 'Bento',
      tone: 'Atendente brasileiro simpático, caloroso e profissional. Mensagens claras, empáticas, sem prometer solução/desconto/ressarcimento e sem minimizar o cliente.',
      rules: [
        'Nunca inventar preço, prato, horário ou disponibilidade — usar só os dados do sistema.',
        'Nunca prometer solução, desconto, reembolso ou retorno imediato.',
        'Em situações de saúde (passar mal), tratar como prioridade alta e orientar buscar atendimento, sem dar conselho médico.',
        'Quando não souber, registrar como lacuna e/ou encaminhar à equipe — não chutar.',
        'Assuntos fora do restaurante: redirecionar com gentileza.',
      ],
    },
    feedback_triggers: [
      'quero reclamar', 'reclamação', 'sugestão', 'feedback', 'fui mal atendido', 'comida fria',
      'pedido errado', 'demorou', 'cobrado errado', 'cabelo na comida', 'passando mal',
    ],
    feedback_categories: [
      { category: 'pagamento', type: 'reclamação', priority: 'média', keywords: ['cobrado', 'troco', 'pix', 'cartão', 'maquininha', 'extrato', 'valor errado'], high_keywords: ['duas vezes', 'duplicada', 'a mais'], expectation: 'Análise da gerência sobre a divergência de cobrança informada.', questions: ['Foi no cartão, Pix ou dinheiro?', 'Você lembra o valor cobrado e o valor correto?'] },
      { category: 'atendimento', type: 'reclamação', priority: 'média', keywords: ['mal atendido', 'garçom', 'sem educação', 'grosseiro'], high_keywords: ['xingou', 'discriminação'], expectation: 'Que a gerência analise a conduta relatada e avalie melhorias no atendimento.', questions: ['Foi no salão, caixa ou delivery?', 'Você lembra o nome ou alguma característica da pessoa?'] },
      { category: 'qualidade_comida', type: 'reclamação', priority: 'média', keywords: ['comida fria', 'salgada', 'carne dura', 'queimada', 'porção pequena'], expectation: 'Que a gerência analise a qualidade do preparo e avalie melhorias.', questions: ['Qual prato ou item foi?'] },
      { category: 'alimento_improprio', type: 'reclamação', priority: 'alta', keywords: ['cabelo', 'plástico', 'inseto', 'objeto estranho'], expectation: 'Que a gerência analise a situação com prioridade e verifique o ocorrido.', questions: ['Qual foi o prato?', 'Você chegou a mostrar para alguém da equipe?'] },
      { category: 'saude', type: 'reclamação', priority: 'alta', keywords: ['passando mal', 'alergia', 'intoxicação', 'vômito'], expectation: 'Que a gerência analise a situação com prioridade e verifique o ocorrido.', questions: ['O que você consumiu?', 'Mais alguém passou mal?'] },
      { category: 'demora', type: 'reclamação', priority: 'média', keywords: ['demorou', 'atrasou', 'fiquei esperando'], expectation: 'Que a gerência analise a demora relatada e avalie melhorias.' },
      { category: 'pedido_errado', type: 'reclamação', priority: 'média', keywords: ['pedido errado', 'veio errado', 'faltou', 'pedi sem', 'veio com'], expectation: 'Que a gerência analise o ocorrido com o pedido e avalie melhorias.' },
      { category: 'delivery', type: 'reclamação', priority: 'média', keywords: ['delivery', 'motoboy', 'chegou frio', 'embalagem', 'vazou'], expectation: 'Que a gerência analise o ocorrido na entrega e avalie melhorias.' },
      { category: 'ambiente', type: 'reclamação', priority: 'baixa', keywords: ['banheiro sujo', 'mesa suja', 'música alta', 'calor'], expectation: 'Que a gerência analise o ponto relatado sobre o ambiente e avalie melhorias.' },
      { category: 'sugestao', type: 'sugestão', priority: 'baixa', keywords: ['sugiro', 'seria legal', 'poderia ter', 'melhorar'], expectation: 'Que a sugestão seja avaliada pela gerência.' },
    ],
    synonyms: { comida: ['rango', 'boia'], conta: ['nota', 'comanda'], garçom: ['garçonete', 'atendente'] },
    knowledge: [],
    policies: [
      'Reservas: o Bento não confirma reserva; envia o botão do formulário.',
      'Pedidos/compra: o Bento não vende; indica o cardápio online (Goomer).',
    ],
    system_prompt_extra: '',
    _notas_evolucao: [
      'Este arquivo é o "cérebro" do Bento. A cada rodada com o ChatGPT, ele deve CRESCER (mais categorias, palavras-chave, sinônimos, FAQ e nuances), nunca encolher.',
    ],
  };
}

/** Valida um cérebro importado. Retorna {ok, errors}. */
export function validateBrain(obj: any): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const isArr = (v: any) => Array.isArray(v);
  if (!obj || typeof obj !== 'object') return { ok: false, errors: ['Arquivo não é um JSON de objeto.'] };
  if (typeof obj.schema_version !== 'number') errors.push('Falta "schema_version" (número).');
  if (typeof obj.version !== 'number') errors.push('Falta "version" (número).');
  if (!obj.persona || typeof obj.persona !== 'object') errors.push('Falta "persona".');
  else {
    if (typeof obj.persona.name !== 'string') errors.push('persona.name inválido.');
    if (!isArr(obj.persona.rules)) errors.push('persona.rules deve ser uma lista.');
  }
  if (!isArr(obj.feedback_triggers)) errors.push('feedback_triggers deve ser uma lista.');
  if (!isArr(obj.feedback_categories)) errors.push('feedback_categories deve ser uma lista.');
  else {
    obj.feedback_categories.forEach((c: any, i: number) => {
      if (!c.category) errors.push(`Categoria #${i + 1} sem "category".`);
      if (!isArr(c.keywords)) errors.push(`Categoria "${c.category || i + 1}" sem lista de keywords.`);
      if (!c.expectation) errors.push(`Categoria "${c.category || i + 1}" sem "expectation".`);
    });
  }
  if (!isArr(obj.knowledge)) errors.push('knowledge deve ser uma lista.');
  else {
    obj.knowledge.forEach((k: any, i: number) => {
      if (!k.question || !k.answer) errors.push(`FAQ #${i + 1} precisa de "question" e "answer".`);
    });
  }
  if (obj.synonyms && typeof obj.synonyms !== 'object') errors.push('synonyms deve ser um objeto.');
  if (!isArr(obj.policies)) errors.push('policies deve ser uma lista.');
  return { ok: errors.length === 0, errors };
}

/** Carrega o cérebro ativo (servidor). */
export async function getActiveBrain(db: any, restaurantId: string): Promise<Brain | null> {
  try {
    const { data } = await db
      .from('ai_brain')
      .select('data')
      .eq('restaurant_id', restaurantId)
      .eq('active', true)
      .maybeSingle();
    return (data?.data as Brain) || null;
  } catch {
    return null;
  }
}

/**
 * COMANDO DE TREINO EXAUSTIVO — vai junto da exportação. O cliente cola no ChatGPT.
 */
export const TRAINING_PROMPT = `# TREINO DO BENTO — atendente virtual do ${''}restaurante (unidade Villa Grill 1 - Odorindo Perenha)

Você é um ENGENHEIRO DE CONHECIMENTO especializado em restaurantes. Sua missão é EVOLUIR o "cérebro" do atendente virtual Bento, entregue no arquivo JSON abaixo (campo "cerebro_atual").

## REGRAS ABSOLUTAS (NUNCA quebre)
1. EXAUSTIVO E CUMULATIVO: você deve SEMPRE devolver o arquivo COMPLETO e MAIOR do que recebeu. É PROIBIDO encurtar, abreviar, resumir, remover itens, usar "..." ou "[mantido igual]". Reescreva tudo por extenso, somando o novo ao que já existia.
2. MESMO FORMATO: devolva um JSON VÁLIDO com EXATAMENTE o mesmo schema (mesmos campos). Incremente "version" em +1.
3. NUNCA mexa em preços, pratos ou cardápio — isso vem do sistema do restaurante, não daqui. Não crie campos de preço.
4. Mantenha a persona, o tom e as regras de ouro (não prometer desconto/solução, não minimizar, prioridade alta para saúde, etc.).
5. Português correto e natural do Brasil.

## O QUE VOCÊ DEVE FAZER, NESTA ORDEM
PASSO 1 — ENTREVISTA (faça ANTES de gerar qualquer arquivo): leia o cérebro atual e me faça PERGUNTAS, uma rodada por vez, para aprender sobre ESTE restaurante e cobrir lacunas. Pergunte sobre:
   - situações reais que acontecem nesta casa (e como a gerência prefere que sejam tratadas);
   - pontos fortes e fracos do restaurante;
   - políticas (estacionamento, pagamento, reservas, eventos, pet, kids, etc.);
   - perguntas que clientes fazem e que o Bento ainda não sabe responder bem (se eu te enviar a lista de lacunas, use-a).
   Espere minhas respostas. Se eu disser "não sei", siga para a próxima pergunta.

PASSO 2 — PESQUISA E NUANCES: com seu conhecimento sobre operação de restaurantes e padrões de relatos/reclamações de clientes (atendimento, cobrança, comida, delivery, ambiente, higiene, alérgenos, eventos, filas, etc.), ENRIQUEÇA o cérebro:
   - adicione NOVAS categorias de reclamação/sugestão que façam sentido e ainda não existam;
   - amplie palavras-chave, gírias e sinônimos regionais (ex.: "rango", "boia");
   - adicione/refine perguntas mínimas por categoria (sempre poucas e úteis);
   - adicione entradas de FAQ (knowledge) com respostas oficiais prováveis (marque entre colchetes o que eu preciso confirmar, ex.: "[CONFIRMAR: tem estacionamento?]");
   - adicione políticas e nuances de tom para situações delicadas.

PASSO 3 — ENTREGA: gere o JSON final completo (maior), e DEPOIS dele escreva, em texto normal:
   - "O QUE CRESCEU NESTA RODADA": lista do que você adicionou;
   - "O QUE AINDA QUERO MELHORAR NA PRÓXIMA RODADA": uma lista (porque sempre há mais a aprender) — assim, quando eu rodar de novo, você continua de onde parou e vai cada vez mais fundo.

## IMPORTANTE
- Coloque suas anotações de evolução também dentro do campo "_notas_evolucao" do JSON (acumulando, sem apagar as anteriores).
- O arquivo cresce a cada rodada. Quanto mais rodadas, mais detalhado e profissional o Bento fica.

Abaixo está o "cerebro_atual" para você evoluir:
`;
