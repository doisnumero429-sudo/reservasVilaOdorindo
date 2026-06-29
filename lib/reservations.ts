import { supabaseAdmin } from './supabase';
import { sendReservationEmail } from './notifications';

export type NovaReservaInput = {
  restaurantId: string;
  nome: string;
  whatsapp: string;
  pessoas: number;
  data: string; // YYYY-MM-DD
  periodo: 'almoco' | 'noite';
  horario?: string;
  setorCode?: string;
  observacoes?: string;
  source?: string;
};

export type NovaReservaResult = {
  ok: boolean;
  reservation?: any;
  error?: string;
  blocked?: boolean;
  largeGroup?: boolean;
  message?: string;
};

/**
 * Cria uma pré-reserva (status 'pending'), validando regras, bloqueios e setor,
 * registrando histórico e disparando o e-mail. Usada tanto pela rota pública
 * /api/reservations quanto pela Lorena (reserva por conversa).
 * NUNCA confirma automaticamente.
 */
export async function createReservation(input: NovaReservaInput): Promise<NovaReservaResult> {
  const db = supabaseAdmin();
  const nome = (input.nome || '').trim();
  const whatsapp = (input.whatsapp || '').trim();
  const pessoas = Number(input.pessoas) || 0;
  const data = input.data;
  const periodo = input.periodo === 'noite' ? 'noite' : 'almoco';

  if (!nome || !whatsapp || !data || !pessoas) {
    return { ok: false, error: 'Faltam dados: nome, WhatsApp, data e número de pessoas são obrigatórios.' };
  }

  // regras (min/max pessoas)
  const { data: rules } = await db
    .from('reservation_rules')
    .select('*')
    .eq('restaurant_id', input.restaurantId)
    .maybeSingle();
  if (rules) {
    if (pessoas >= (rules.large_group_threshold || 999)) {
      return { ok: false, largeGroup: true, message: rules.large_group_message || '', error: 'Grupo grande: falar com a equipe.' };
    }
    if (pessoas < rules.min_people || pessoas > rules.max_people) {
      return { ok: false, error: `O número de pessoas precisa estar entre ${rules.min_people} e ${rules.max_people}.` };
    }
  }

  // setor -> id
  let sectorId: string | null = null;
  if (input.setorCode) {
    const { data: sector } = await db
      .from('sectors')
      .select('id')
      .eq('restaurant_id', input.restaurantId)
      .eq('code', input.setorCode)
      .maybeSingle();
    sectorId = sector?.id ?? null;
  }

  // bloqueios
  const { data: blocks } = await db
    .from('reservation_blocks')
    .select('*')
    .eq('restaurant_id', input.restaurantId)
    .eq('block_date', data);
  const blocked = (blocks || []).find(
    (b) => (b.period === 'todos' || b.period === periodo) && (!b.sector_id || b.sector_id === sectorId)
  );
  if (blocked) {
    return {
      ok: false,
      blocked: true,
      message: blocked.public_message || '',
      error: blocked.public_message || 'Nessa data e período não estamos recebendo reservas.',
    };
  }

  // eventos que bloqueiam reservas
  const { data: events } = await db
    .from('special_events')
    .select('*')
    .eq('restaurant_id', input.restaurantId)
    .eq('event_date', data)
    .eq('active', true)
    .eq('block_reservations', true);
  if (events && events.length) {
    return {
      ok: false,
      blocked: true,
      message: events[0].public_message || '',
      error: events[0].public_message || 'Nessa data temos um evento especial e as reservas seguem outra regra.',
    };
  }

  const { data: reservation, error } = await db
    .from('reservations')
    .insert({
      restaurant_id: input.restaurantId,
      customer_name: nome,
      customer_whatsapp: whatsapp,
      people_count: pessoas,
      reservation_date: data,
      period: periodo,
      reservation_time: input.horario || '',
      sector_id: sectorId,
      customer_notes: input.observacoes || '',
      status: 'pending',
      source: input.source || 'site',
    })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };

  await db.from('reservation_history').insert({
    reservation_id: reservation.id,
    restaurant_id: input.restaurantId,
    action: 'created',
    new_value: reservation,
  });

  // e-mail (não bloqueia)
  sendReservationEmail(input.restaurantId, reservation).catch(() => {});

  return { ok: true, reservation };
}
