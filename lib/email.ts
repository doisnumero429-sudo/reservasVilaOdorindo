import { Resend } from 'resend';
import nodemailer from 'nodemailer';
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

function smtpConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

/**
 * Envia um e-mail e grava em email_logs.
 * Dois modos (escolhido automaticamente):
 *  - SMTP (ex.: Gmail com senha de app): envia do SEU e-mail para QUALQUER destinatário,
 *    de graça e sem domínio. Usado quando SMTP_HOST/SMTP_USER/SMTP_PASS estão definidos.
 *  - Resend: usado quando há RESEND_API_KEY (exige domínio verificado para outros destinatários).
 */
export async function sendEmail(args: SendArgs) {
  const db = supabaseAdmin();
  const fromName = args.fromName || process.env.EMAIL_FROM_NAME || 'Villa Grill';
  // No SMTP/Gmail o remetente precisa ser a própria conta autenticada.
  const fromEmail =
    args.fromEmail ||
    (smtpConfigured() ? process.env.SMTP_USER! : process.env.EMAIL_FROM || 'onboarding@resend.dev');
  const from = `${fromName} <${fromEmail}>`;

  if (!args.to || args.to.length === 0) {
    return { ok: false, skipped: true, reason: 'Nenhum e-mail destinatário cadastrado.' };
  }

  const log = (status: string, extra: Record<string, any> = {}) =>
    db.from('email_logs').insert({
      restaurant_id: args.restaurantId,
      type: args.type,
      recipients: args.to,
      subject: args.subject,
      status,
      ...extra,
    });

  try {
    // ---- Modo SMTP (Gmail e afins) ----
    if (smtpConfigured()) {
      const port = Number(process.env.SMTP_PORT || 465);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465, // 465 = SSL; 587 = STARTTLS
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      const info = await transporter.sendMail({
        from,
        to: args.to.join(', '),
        subject: args.subject,
        html: args.html,
        text: args.text,
      });
      await log('enviado', { provider_message_id: info.messageId });
      return { ok: true, id: info.messageId };
    }

    // ---- Modo Resend ----
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from,
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      });
      if (error) throw new Error(error.message || 'Falha no envio.');
      await log('enviado', { provider_message_id: data?.id });
      return { ok: true, id: data?.id };
    }

    await log('erro', { error_message: 'Nenhum provedor de e-mail configurado (defina SMTP_* ou RESEND_API_KEY).' });
    return { ok: false, reason: 'Nenhum provedor de e-mail configurado.' };
  } catch (err: any) {
    await log('erro', { error_message: String(err?.message || err) });
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
