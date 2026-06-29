import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';

type SendArgs = {
  restaurantId: string;
  type: string; // 'reservation' | 'complaint' | 'daily_report' | 'test'
  to: string[];
  subject: string;
  html: string;
  text?: string;
  fromEmail?: string;
  fromName?: string;
};

/**
 * Envia um e-mail pelo Resend e grava em email_logs.
 * O Resend é apenas o "carteiro": os avisos chegam nos e-mails cadastrados.
 */
export async function sendEmail(args: SendArgs) {
  const db = supabaseAdmin();
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = args.fromEmail || process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const fromName = args.fromName || process.env.EMAIL_FROM_NAME || 'Villa Grill';
  const from = `${fromName} <${fromEmail}>`;

  if (!args.to || args.to.length === 0) {
    return { ok: false, skipped: true, reason: 'Nenhum e-mail destinatário cadastrado.' };
  }

  if (!apiKey) {
    await db.from('email_logs').insert({
      restaurant_id: args.restaurantId,
      type: args.type,
      recipients: args.to,
      subject: args.subject,
      status: 'erro',
      error_message: 'RESEND_API_KEY não configurada.',
    });
    return { ok: false, reason: 'RESEND_API_KEY não configurada.' };
  }

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
    });
    if (error) throw new Error(error.message || 'Falha no envio.');

    await db.from('email_logs').insert({
      restaurant_id: args.restaurantId,
      type: args.type,
      recipients: args.to,
      subject: args.subject,
      status: 'enviado',
      provider_message_id: data?.id,
    });
    return { ok: true, id: data?.id };
  } catch (err: any) {
    await db.from('email_logs').insert({
      restaurant_id: args.restaurantId,
      type: args.type,
      recipients: args.to,
      subject: args.subject,
      status: 'erro',
      error_message: String(err?.message || err),
    });
    return { ok: false, reason: String(err?.message || err) };
  }
}

/** HTML simples no tema escuro/dourado, coerente com a marca. */
export function brandedEmail(title: string, bodyHtml: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#0B0907;color:#F4EDE3;padding:22px">
    <div style="max-width:560px;margin:auto;border:1px solid #D9A441;border-radius:18px;padding:22px;background:#151210">
      <h1 style="margin:0 0 14px;color:#F0CE84;font-size:22px">${title}</h1>
      ${bodyHtml}
    </div>
  </div>`;
}
