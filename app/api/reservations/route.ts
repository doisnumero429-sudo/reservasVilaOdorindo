import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getRestaurant } from '@/lib/supabase';
import { sendReservationEmail } from '@/lib/notifications';

export const runtime = 'nodejs';

/**
 * POST /api/reservations
 * Recebe a pré-reserva do site público, valida regras/bloqueios,
 * cria no Supabase com status 'pending' (NUNCA confirma sozinho)
 * e dispara o e-mail de aviso. Aceita os nomes de campo do site atual.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nome = (body.nome || body.customer_name || '').trim();
    const whatsapp = (body.whatsapp || body.customer_whatsapp || '').trim();
    const pessoas = parseInt(body.pessoas || body.people_count || '0', 10);
    const data = body.data || body.reservation_date;
    const periodoRaw = body.periodo || body.period || 'almoco';
    const periodo = periodoRaw === 'noite' ? 'noite' : 'almoco';
    const horario = body.horario || body.reservation_time || '';
    const setorCode = body.setor || body.sector_code || '';
    const observacoes = body.observacoes || body.customer_notes || '';

    if (!nome || !whatsapp || !data || !pessoas) {
      return NextResponse.json(
        { ok: false, error: 'Preencha nome, WhatsApp, data e número de pessoas.' },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();
    const restaurant = await getRestaurant();

    // regras (min/max pessoas)
    const { data: rules } = await db
      .from('reservation_rules')
      .select('*')
      .eq('restaurant_id', restaurant.id)
      .maybeSingle();
    if (rules) {
      if (pessoas < rules.min_people || pessoas > rules.max_people) {
        return NextResponse.json(
          {
            ok: false,
            error: `Para esse número de pessoas, fale com a equipe pelo WhatsApp.`,
            largeGroup: pessoas >= (rules.large_group_threshold || 999),
            message: rules.large_group_message,
          },
          { status: 422 }
        );
      }
    }

    // setor -> id
    let sectorId: string | null = null;
    if (setorCode) {
      const { data: sector } = await db
        .from('sectors')
        .select('id')
        .eq('restaurant_id', restaurant.id)
        .eq('code', setorCode)
        .maybeSingle();
      sectorId = sector?.id ?? null;
    }

    // bloqueios
    const { data: blocks } = await db
      .from('reservation_blocks')
      .select('*')
      .eq('restaurant_id', restaurant.id)
      .eq('block_date', data);
    const blocked = (blocks || []).find(
      (b) =>
        (b.period === 'todos' || b.period === periodo) &&
        (!b.sector_id || b.sector_id === sectorId)
    );
    if (blocked) {
      return NextResponse.json(
        {
          ok: false,
          blocked: true,
          error:
            blocked.public_message ||
            'Nessa data e período não estamos recebendo reservas. Podemos te ajudar com outra data?',
        },
        { status: 409 }
      );
    }

    // cria a reserva (pendente)
    const { data: reservation, error } = await db
      .from('reservations')
      .insert({
        restaurant_id: restaurant.id,
        customer_name: nome,
        customer_whatsapp: whatsapp,
        people_count: pessoas,
        reservation_date: data,
        period: periodo,
        reservation_time: horario,
        sector_id: sectorId,
        customer_notes: observacoes,
        status: 'pending',
        source: 'site',
      })
      .select()
      .single();
    if (error) throw error;

    // histórico
    await db.from('reservation_history').insert({
      reservation_id: reservation.id,
      restaurant_id: restaurant.id,
      action: 'created',
      new_value: reservation,
    });

    // e-mail de aviso (não bloqueia a resposta ao cliente se falhar)
    sendReservationEmail(restaurant.id, reservation).catch(() => {});

    return NextResponse.json({ ok: true, id: reservation.id });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
