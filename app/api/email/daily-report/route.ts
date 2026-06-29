import { NextRequest, NextResponse } from 'next/server';
import { getRestaurant } from '@/lib/supabase';
import { sendDailyReport } from '@/lib/notifications';

export const runtime = 'nodejs';

/** POST /api/email/daily-report — gera e envia o relatório de hoje (uso manual/admin). */
export async function POST(_req: NextRequest) {
  try {
    const restaurant = await getRestaurant();
    const res = await sendDailyReport(restaurant.id);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
