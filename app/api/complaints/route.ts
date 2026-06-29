import { NextRequest, NextResponse } from 'next/server';
import { getRestaurant } from '@/lib/supabase';
import { createComplaint } from '@/lib/complaints';

export const runtime = 'nodejs';

/** POST /api/complaints — registra uma reclamação/sugestão e avisa por e-mail. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = (body.message || body.relato || '').trim();
    if (!message) return NextResponse.json({ ok: false, error: 'Relato vazio.' }, { status: 400 });

    const restaurant = await getRestaurant();
    const res = await createComplaint({
      restaurantId: restaurant.id,
      nome: body.nome || body.customer_name,
      whatsapp: body.whatsapp || body.customer_whatsapp,
      message,
      tipo: body.tipo === 'sugestao' ? 'sugestao' : 'reclamacao',
    });
    if (!res.ok) return NextResponse.json(res, { status: 400 });
    return NextResponse.json({ ok: true, id: res.complaint.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
