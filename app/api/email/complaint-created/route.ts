import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getRestaurant } from '@/lib/supabase';
import { sendComplaintEmail } from '@/lib/notifications';

export const runtime = 'nodejs';

/** POST /api/email/complaint-created { id }  — (re)envia o aviso de uma reclamação. */
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: 'Informe o id da reclamação.' }, { status: 400 });
    const db = supabaseAdmin();
    const restaurant = await getRestaurant();
    const { data: complaint, error } = await db.from('complaints').select('*').eq('id', id).single();
    if (error || !complaint) return NextResponse.json({ ok: false, error: 'Reclamação não encontrada.' }, { status: 404 });
    const res = await sendComplaintEmail(restaurant.id, complaint);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
