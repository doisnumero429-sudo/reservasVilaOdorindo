import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getRestaurant } from '@/lib/supabase';
import { sendComplaintEmail } from '@/lib/notifications';

export const runtime = 'nodejs';

/** POST /api/complaints — registra uma reclamação (vinda do chat) e avisa por e-mail. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = (body.message || body.relato || '').trim();
    if (!message) {
      return NextResponse.json({ ok: false, error: 'Relato vazio.' }, { status: 400 });
    }
    const db = supabaseAdmin();
    const restaurant = await getRestaurant();

    const { data: complaint, error } = await db
      .from('complaints')
      .insert({
        restaurant_id: restaurant.id,
        customer_name: body.nome || body.customer_name || null,
        customer_whatsapp: body.whatsapp || body.customer_whatsapp || null,
        message,
        status: 'nova',
        email_status: 'preparado',
      })
      .select()
      .single();
    if (error) throw error;

    sendComplaintEmail(restaurant.id, complaint)
      .then((r) =>
        db.from('complaints').update({ email_status: r.ok ? 'enviado' : 'erro' }).eq('id', complaint.id)
      )
      .catch(() => {});

    return NextResponse.json({ ok: true, id: complaint.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
