import { NextRequest, NextResponse } from 'next/server';
import { getRestaurant } from '@/lib/supabase';
import { createReservation } from '@/lib/reservations';

export const runtime = 'nodejs';

/**
 * POST /api/reservations
 * Recebe a pré-reserva do site público (aceita os nomes de campo do formulário atual),
 * valida regras/bloqueios/eventos, cria no Supabase com status 'pending' e dispara e-mail.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const restaurant = await getRestaurant();

    const result = await createReservation({
      restaurantId: restaurant.id,
      nome: body.nome || body.customer_name || '',
      whatsapp: body.whatsapp || body.customer_whatsapp || '',
      pessoas: parseInt(body.pessoas || body.people_count || '0', 10),
      data: body.data || body.reservation_date,
      periodo: (body.periodo || body.period) === 'noite' ? 'noite' : 'almoco',
      horario: body.horario || body.reservation_time || '',
      setorCode: body.setor || body.sector_code || '',
      observacoes: body.observacoes || body.customer_notes || '',
      source: 'site',
    });

    if (!result.ok) {
      const status = result.blocked ? 409 : result.largeGroup ? 422 : 400;
      return NextResponse.json(
        { ok: false, error: result.error, blocked: result.blocked, largeGroup: result.largeGroup, message: result.message },
        { status }
      );
    }
    return NextResponse.json({ ok: true, id: result.reservation.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
