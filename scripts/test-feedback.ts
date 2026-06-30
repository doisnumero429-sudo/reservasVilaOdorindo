/* Simulações do feedbackEngine do Bento. Roda com: npx tsx scripts/test-feedback.ts */
import {
  stepFeedback, confirmSummary, detectFeedbackIntent, buildWhatsappMessage, UNIDADE, FeedbackSession,
} from '../lib/feedback-engine';

type Scn = { id: number; problem: string; name?: string; whatsapp?: string; cat?: string; prio?: string };

const NAME = 'Evandro';
const WA = '(18) 99999-0000';

const S: Scn[] = [
  // PAGAMENTO
  { id: 1, problem: 'fui cobrado duas vezes no débito ontem', cat: 'pagamento', prio: 'alta' },
  { id: 2, problem: 'cobrança duplicada no crédito', cat: 'pagamento', prio: 'alta' },
  { id: 3, problem: 'fiz um pix e ainda cobraram no cartão', cat: 'pagamento', prio: 'média' },
  { id: 4, problem: 'o troco veio errado em dinheiro', cat: 'pagamento', prio: 'média' },
  { id: 5, problem: 'fui cobrado R$ 180 mas era R$ 120', cat: 'pagamento', prio: 'média' },
  { id: 6, problem: 'cobraram a mais na conta, valor errado', cat: 'pagamento', prio: 'alta' },
  { id: 7, problem: 'a maquininha não passou e depois apareceu no extrato', cat: 'pagamento', prio: 'média' },
  { id: 8, problem: 'me cobraram uma taxa que não deveria', cat: 'pagamento', prio: 'média' },
  // ATENDIMENTO
  { id: 9, problem: 'fui mal atendido pelo garçom no salão', cat: 'atendimento', prio: 'média' },
  { id: 10, problem: 'o caixa foi muito mal educado comigo', cat: 'atendimento', prio: 'média' },
  { id: 11, problem: 'ninguém me atendeu na mesa', cat: 'atendimento', prio: 'média' },
  { id: 12, problem: 'o garçom me xingou, foi um absurdo', cat: 'atendimento', prio: 'alta' },
  { id: 13, problem: 'quero falar com o gerente sobre o atendimento', cat: 'atendimento', prio: 'média' },
  { id: 14, problem: 'sofri discriminação no atendimento', cat: 'atendimento', prio: 'alta' },
  // QUALIDADE COMIDA
  { id: 15, problem: 'a comida veio fria no salão', cat: 'qualidade_comida', prio: 'média' },
  { id: 16, problem: 'o prato estava muito salgado no almoço', cat: 'qualidade_comida', prio: 'média' },
  { id: 17, problem: 'a carne estava dura', cat: 'qualidade_comida', prio: 'média' },
  { id: 18, problem: 'minha comida veio queimada', cat: 'qualidade_comida', prio: 'média' },
  { id: 19, problem: 'a porção estava muito pequena', cat: 'qualidade_comida', prio: 'média' },
  // ALIMENTO IMPRÓPRIO
  { id: 20, problem: 'tinha um cabelo na salada', cat: 'alimento_improprio', prio: 'alta' },
  { id: 21, problem: 'encontrei um plástico na comida', cat: 'alimento_improprio', prio: 'alta' },
  { id: 22, problem: 'tinha um inseto no prato', cat: 'alimento_improprio', prio: 'alta' },
  { id: 23, problem: 'achei uma coisa estranha na comida', cat: 'alimento_improprio', prio: 'alta' },
  // SAÚDE
  { id: 24, problem: 'estou passando mal depois de comer aí', cat: 'saude', prio: 'alta' },
  { id: 25, problem: 'tive uma reação alérgica', cat: 'saude', prio: 'alta' },
  { id: 26, problem: 'minha filha passou mal e vomitou', cat: 'saude', prio: 'alta' },
  { id: 27, problem: 'acho que a comida me fez mal', cat: 'saude', prio: 'alta' },
  { id: 28, problem: 'tô com intoxicação, foi a comida de vocês', cat: 'saude', prio: 'alta' },
  // DEMORA
  { id: 29, problem: 'o pedido demorou muito no salão', cat: 'demora', prio: 'média' },
  { id: 30, problem: 'esperei uma hora pela comida', cat: 'demora', prio: 'média' },
  { id: 31, problem: 'demorou demais pra fechar a conta, um absurdo', cat: 'demora', prio: 'alta' },
  // PEDIDO ERRADO
  { id: 32, problem: 'meu pedido veio errado', cat: 'pedido_errado', prio: 'média' },
  { id: 33, problem: 'faltou item no meu pedido', cat: 'pedido_errado', prio: 'média' },
  { id: 34, problem: 'pedi sem cebola e veio com cebola', cat: 'pedido_errado', prio: 'média' },
  // DELIVERY
  { id: 35, problem: 'meu delivery chegou frio', cat: 'delivery', prio: 'média' },
  { id: 36, problem: 'a embalagem vazou na entrega', cat: 'delivery', prio: 'média' },
  { id: 37, problem: 'o motoboy foi grosseiro', cat: 'delivery', prio: 'média' },
  { id: 38, problem: 'a taxa de entrega veio errada', cat: 'delivery', prio: 'média' },
  // AMBIENTE
  { id: 39, problem: 'o banheiro estava sujo', cat: 'ambiente', prio: 'baixa' },
  { id: 40, problem: 'a mesa estava suja', cat: 'ambiente', prio: 'baixa' },
  { id: 41, problem: 'a música estava muito alta', cat: 'ambiente', prio: 'baixa' },
  { id: 42, problem: 'estava muito calor lá dentro', cat: 'ambiente', prio: 'baixa' },
  // SUGESTÕES
  { id: 43, problem: 'sugiro que tenham opção vegetariana', cat: 'sugestao', prio: 'baixa' },
  { id: 44, problem: 'seria legal ter mais promoções', cat: 'sugestao', prio: 'baixa' },
  { id: 45, problem: 'vocês podiam colocar mais ventiladores', cat: 'sugestao', prio: 'baixa' },
  { id: 46, problem: 'minha sugestão é melhorar o tempero', cat: 'sugestao', prio: 'baixa' },
  { id: 47, problem: 'sugiro um novo prato no cardápio', cat: 'sugestao', prio: 'baixa' },
];

let pass = 0;
const fails: string[] = [];

function run(sc: Scn) {
  const name = sc.name || NAME;
  const wa = sc.whatsapp || WA;
  const errs: string[] = [];

  if (!detectFeedbackIntent(sc.problem)) errs.push('intenção não detectada');

  let s: FeedbackSession | null = null;
  let r = stepFeedback(s, sc.problem);
  s = r.session;
  let guard = 0;
  const provide: Record<string, string> = {
    need_details: sc.problem + ' (detalhes)',
    need_name: name,
    need_whatsapp: wa,
    offer_upload: 'pode seguir sem foto',
  };
  while (s.stage !== 'await_confirm' && guard++ < 14) {
    const input = provide[s.stage] ?? 'ok';
    r = stepFeedback(s, input);
    s = r.session;
  }
  if (s.stage !== 'await_confirm') errs.push('não chegou ao resumo');

  if (sc.cat && s.category !== sc.cat) errs.push(`categoria ${s.category} != ${sc.cat}`);
  if (sc.prio && s.priority !== sc.prio) errs.push(`prioridade ${s.priority} != ${sc.prio}`);
  if (!s.customerName) errs.push('nome não capturado');
  if (!s.customerWhatsapp) errs.push('whatsapp não capturado');

  const resumo = s.summary || '';
  for (const bad of ['null', 'undefined', 'não informado', 'N/A', 'desconhecido']) {
    if (resumo.toLowerCase().includes(bad.toLowerCase())) errs.push(`resumo contém "${bad}"`);
  }

  const waMsg = buildWhatsappMessage(s);
  if (!waMsg.includes(UNIDADE)) errs.push('whatsapp sem unidade');
  if (!waMsg.includes(name.split(' ')[0])) errs.push('whatsapp sem nome');

  // fluxo final
  const fc = confirmSummary(s);
  if (!fc.ui.finalChoice) errs.push('sem escolha final');

  if (errs.length) fails.push(`#${sc.id} (${sc.problem.slice(0, 40)}): ${errs.join('; ')}`);
  else pass++;
}

S.forEach(run);

// Cenários de fluxo extra
function fluxoExtra() {
  // cliente já conta tudo + nome + número já na 1ª (extração) e segue
  let r = stepFeedback(null, 'fui cobrado duas vezes ontem no jantar, mesa perto do banheiro, R$ 180 sendo que era R$ 120');
  let s = r.session;
  const okExtras = s.occurredDate === 'ontem' && s.period === 'noite' && s.tableReference === 'próximo aos banheiros' && s.chargedAmount === 'R$ 180' && s.expectedAmount === 'R$ 120';
  if (!okExtras) fails.push('#extra extração múltipla falhou: ' + JSON.stringify({ d: s.occurredDate, p: s.period, t: s.tableReference, c: s.chargedAmount, e: s.expectedAmount }));
  else pass++;
}
fluxoExtra();

const total = S.length + 1;
console.log('==================== RELATÓRIO DE SIMULAÇÕES ====================');
console.log(`Total simulado: ${total}`);
console.log(`Passaram: ${pass}`);
console.log(`Falharam: ${total - pass}`);
if (fails.length) {
  console.log('\nFalhas:');
  fails.forEach((f) => console.log('  - ' + f));
}
console.log('================================================================');
process.exit(fails.length ? 1 : 0);
