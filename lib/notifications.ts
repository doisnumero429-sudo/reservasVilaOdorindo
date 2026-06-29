import { supabaseAdmin } from './supabase';
import { sendEmail, brandedEmail } from './email';

function brDate(iso?: string) {
  if (!iso) return 'Sem data';
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

async function emailSettings(restaurantId: string) {
  const db = supabaseAdmin();
  const { data } = await db
    .from('email_settings')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .maybeSingle();
  return data;
}

async function sectorName(restaurantId: string, sectorId: string | null) {
  if (!sectorId) return '—';
  const db = supabaseAdmin();
  const { data } = await db.from('sectors').select('public_name').eq('id', sectorId).maybeSingle();
  return data?.public_name || '—';
}

/** Aviso de NOVA RESERVA para os e-mails cadastrados. */
export async function sendReservationEmail(restaurantId: string, r: any) {
  const settings = await emailSettings(restaurantId);
  if (!settings || settings.reservation_email_enabled === false) return { ok: false, skipped: true };
  const to: string[] = settings.reservation_recipients || [];
  const setor = await sectorName(restaurantId, r.sector_id);

  const subject = `Nova pré-reserva recebida — ${r.customer_name}`;
  const rows = [
    ['Cliente', r.customer_name],
    ['WhatsApp', r.customer_whatsapp],
    ['Data', `${brDate(r.reservation_date)} às ${r.reservation_time || ''}`],
    ['Período', r.period === 'almoco' ? 'Almoço' : 'Noite'],
    ['Pessoas', String(r.people_count)],
    ['Setor desejado', setor],
    ['Observação', r.customer_notes || 'Nenhuma'],
    ['Status', 'Pendente de confirmação'],
  ];
  const html = brandedEmail(
    'Tem reserva nova para você',
    `<table style="width:100%;border-collapse:collapse;color:#F4EDE3;font-size:15px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px;border-bottom:1px solid rgba(217,164,65,.25)"><b>${k}</b></td>
             <td style="padding:8px;border-bottom:1px solid rgba(217,164,65,.25)">${v}</td></tr>`
        )
        .join('')}
    </table>
    <p style="margin-top:16px;color:#C9BCA8">Acesse o painel administrador para confirmar, cancelar ou definir mesas.</p>`
  );
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  return sendEmail({
    restaurantId,
    type: 'reservation',
    to,
    subject,
    html,
    text,
    fromEmail: settings.from_email || undefined,
    fromName: settings.from_name || undefined,
  });
}

/** Aviso de RECLAMAÇÃO para os e-mails cadastrados. */
export async function sendComplaintEmail(restaurantId: string, c: any) {
  const settings = await emailSettings(restaurantId);
  if (!settings || settings.complaint_email_enabled === false) return { ok: false, skipped: true };
  const to: string[] = settings.complaint_recipients || [];

  const subject = 'Reclamação precisa de atenção';
  const html = brandedEmail(
    'Um cliente registrou um relato',
    `<p><b>Cliente:</b> ${c.customer_name || 'Não informado'}</p>
     <p><b>WhatsApp:</b> ${c.customer_whatsapp || 'Não informado'}</p>
     <p><b>Relato:</b></p>
     <p style="background:#0B0907;border:1px solid rgba(217,164,65,.25);border-radius:10px;padding:12px;color:#F4EDE3">${c.message}</p>`
  );
  return sendEmail({
    restaurantId,
    type: 'complaint',
    to,
    subject,
    html,
    text: `Reclamação de ${c.customer_name || ''} (${c.customer_whatsapp || ''}): ${c.message}`,
    fromEmail: settings.from_email || undefined,
    fromName: settings.from_name || undefined,
  });
}

/** Relatório diário das reservas de hoje. */
export async function sendDailyReport(restaurantId: string) {
  const db = supabaseAdmin();
  const settings = await emailSettings(restaurantId);
  if (!settings || settings.daily_report_enabled === false) return { ok: false, skipped: true };
  const to: string[] = settings.daily_report_recipients || [];

  // "hoje" no fuso configurado
  const tz = settings.timezone || 'America/Sao_Paulo';
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const { data: reservas } = await db
    .from('reservations')
    .select('*, sectors(public_name)')
    .eq('restaurant_id', restaurantId)
    .eq('reservation_date', today)
    .order('reservation_time', { ascending: true });

  const list = reservas || [];
  const statusLabel: Record<string, string> = {
    pending: 'Pendente',
    checking: 'Em verificação',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    no_response: 'Não respondeu',
    waitlist: 'Lista de espera',
  };
  const subject = `Reservas de hoje — ${brDate(today)}`;
  const body =
    list.length === 0
      ? `<p>Nenhuma reserva registrada para hoje.</p>`
      : `<table style="width:100%;border-collapse:collapse;color:#F4EDE3;font-size:14px">
          <tr><th align="left">Hora</th><th align="left">Cliente</th><th align="left">Pessoas</th><th align="left">Setor</th><th align="left">Status</th></tr>
          ${list
            .map(
              (r: any) =>
                `<tr>
                  <td style="padding:6px;border-bottom:1px solid rgba(217,164,65,.2)">${r.reservation_time || ''}</td>
                  <td style="padding:6px;border-bottom:1px solid rgba(217,164,65,.2)">${r.customer_name}</td>
                  <td style="padding:6px;border-bottom:1px solid rgba(217,164,65,.2)">${r.people_count}</td>
                  <td style="padding:6px;border-bottom:1px solid rgba(217,164,65,.2)">${r.sectors?.public_name || '—'}</td>
                  <td style="padding:6px;border-bottom:1px solid rgba(217,164,65,.2)">${statusLabel[r.status] || r.status}</td>
                </tr>`
            )
            .join('')}
        </table>`;
  const html = brandedEmail(`Reservas de hoje — ${brDate(today)}`, `<p>Total: <b>${list.length}</b></p>${body}`);

  return sendEmail({
    restaurantId,
    type: 'daily_report',
    to,
    subject,
    html,
    text: `Reservas de hoje (${brDate(today)}): ${list.length}`,
    fromEmail: settings.from_email || undefined,
    fromName: settings.from_name || undefined,
  });
}
