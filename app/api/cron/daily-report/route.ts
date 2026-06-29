import { NextRequest, NextResponse } from 'next/server';
import { getRestaurant } from '@/lib/supabase';
import { sendDailyReport } from '@/lib/notifications';

export const runtime = 'nodejs';

/**
 * GET /api/cron/daily-report
 * Chamado automaticamente pelo Vercel Cron (ver vercel.json).
 * Agendado para 13:00 UTC = 10:00 America/Sao_Paulo.
 * Protegido por CRON_SECRET (header Authorization: Bearer <CRON_SECRET>),
 * que o Vercel envia automaticamente.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401 });
  }
  try {
    const restaurant = await getRestaurant();
    const res = await sendDailyReport(restaurant.id);
    return NextResponse.json({ ran: true, ...res });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
