import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getRestaurant } from '@/lib/supabase';
import { sendReservationEmail } from '@/lib/notifications';

export const runtime = 'nodejs';

/** POST /api/email/reservation-created { id }  — (re)envia o aviso de uma reserva. */
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: 'Informe o id da reserva.' }, { status: 400 });
    const db = supabaseAdmin();
    const restaurant = await getRestaurant();
    const { data: reservation, error } = await db.from('reservations').select('*').eq('id', id).single();
    if (error || !reservation) return NextResponse.json({ ok: false, error: 'Reserva não encontrada.' }, { status: 404 });
    const res = await sendReservationEmail(restaurant.id, reservation);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
