import { supabaseAdmin } from './supabase';
import { sendEmail, brandedEmail } from './email';
import { FeedbackSession, categoriaLabel, UNIDADE } from './feedback-engine';

/**
 * Registra a manifestação pelo Bento: gera protocolo, salva em customer_feedback,
 * salva anexos e alerta a gerência (reusa o e-mail). Retorna o protocolo.
 */
export async function registerFeedback(restaurantId: string, s: FeedbackSession, origem: 'bento' | 'whatsapp') {
  const db = supabaseAdmin();

  // protocolo VG-AAAA-NNNNNN
  let protocolo: string | null = null;
  try {
    const { data } = await db.rpc('next_feedback_protocol', { p_restaurant_id: restaurantId });
    protocolo = data as string;
  } catch {
    protocolo = `VG-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  }

  const relatoOriginal = s.originalMessages.join(' ').trim();
  const { data: row, error } = await db
    .from('customer_feedback')
    .insert({
      restaurant_id: restaurantId,
      protocolo,
      unidade: UNIDADE,
      tipo_manifestacao: s.type,
      nome_cliente: s.customerName,
      whatsapp_cliente: s.customerWhatsapp,
      relato_original: relatoOriginal,
      relato_organizado: s.summary,
      categoria: s.category,
      prioridade: s.priority,
      data_ocorrido: s.occurredDate,
      horario_ocorrido: s.occurredTime,
      periodo: s.period,
      canal: s.channel,
      mesa_numero: s.tableNumber,
      mesa_referencia: s.tableReference,
      valor_cobrado: s.chargedAmount,
      valor_esperado: s.expectedAmount,
      forma_pagamento: s.paymentMethod,
      prato_item: s.productOrDish,
      expectativa_cliente: s.customerExpectation,
      status: 'novo',
      origem_envio: origem,
    })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };

  // anexos (se já houver URLs no estado)
  if (s.attachments && s.attachments.length) {
    await db.from('customer_feedback_attachments').insert(
      s.attachments.map((a: any) => ({
        feedback_id: row.id,
        file_url: a.url || null,
        file_name: a.name || null,
        file_type: a.type || null,
        attachment_kind: a.kind || 'outro',
      }))
    );
  }

  // alerta à gerência (mesmos destinatários das reclamações)
  const { data: settings } = await db
    .from('email_settings')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .maybeSingle();
  if (settings && settings.complaint_email_enabled !== false) {
    const to: string[] = settings.complaint_recipients || [];
    const prioAlta = s.priority === 'alta';
    const rows: [string, string | null][] = [
      ['Protocolo', protocolo],
      ['Prioridade', s.priority],
      ['Tipo', s.type],
      ['Categoria', categoriaLabel(s.category)],
      ['Cliente', s.customerName],
      ['WhatsApp', s.customerWhatsapp],
      ['Data', s.occurredDate],
      ['Horário/período', s.occurredTime || s.period],
      ['Canal', s.channel],
      ['Mesa/Localização', s.tableNumber ? `mesa ${s.tableNumber}` : s.tableReference],
    ];
    const html = brandedEmail(
      `${prioAlta ? '⚠️ PRIORIDADE ALTA — ' : ''}Nova manifestação — ${protocolo}`,
      `<table style="width:100%;border-collapse:collapse;color:#F4EDE3;font-size:14px">
        ${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px;border-bottom:1px solid rgba(217,164,65,.2)"><b>${k}</b></td><td style="padding:6px;border-bottom:1px solid rgba(217,164,65,.2)">${v}</td></tr>`).join('')}
      </table>
      <p style="margin-top:14px;color:#F0CE84"><b>Relato organizado:</b></p>
      <p style="white-space:pre-wrap">${(s.summary || relatoOriginal).replace(/</g, '&lt;')}</p>
      <p style="margin-top:10px;color:#C9BCA8">Ação recomendada: analisar e, se necessário, retornar ao cliente pelo WhatsApp informado.</p>`
    );
    await sendEmail({
      restaurantId,
      type: 'complaint',
      to,
      subject: `${prioAlta ? 'ATENÇÃO: PRIORIDADE ALTA — ' : ''}Nova reclamação/sugestão — ${protocolo}`,
      html,
      text: `Protocolo ${protocolo} · ${s.priority} · ${s.type} · ${s.customerName} (${s.customerWhatsapp})\n\n${s.summary}`,
    });
  }

  await db.from('customer_feedback').update({ enviado_gerencia: true }).eq('id', row.id);
  return { ok: true, protocolo, id: row.id };
}
