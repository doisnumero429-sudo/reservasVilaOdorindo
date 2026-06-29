import { supabaseAdmin } from './supabase';
import { sendComplaintEmail } from './notifications';

export type NovaReclamacaoInput = {
  restaurantId: string;
  nome?: string;
  whatsapp?: string;
  message: string;
  tipo?: 'reclamacao' | 'sugestao';
};

/**
 * Registra uma reclamação/sugestão (status 'nova'), guardando nome e WhatsApp do
 * cliente para a equipe entrar em contato, e dispara o e-mail de aviso.
 */
export async function createComplaint(input: NovaReclamacaoInput) {
  const db = supabaseAdmin();
  const message = (input.message || '').trim();
  if (!message) return { ok: false, error: 'Relato vazio.' };

  const label = input.tipo === 'sugestao' ? 'Sugestão' : 'Reclamação';
  const fullMsg = `[${label}] ${message}`;

  const { data: complaint, error } = await db
    .from('complaints')
    .insert({
      restaurant_id: input.restaurantId,
      customer_name: input.nome || null,
      customer_whatsapp: input.whatsapp || null,
      message: fullMsg,
      status: 'nova',
      email_status: 'preparado',
    })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };

  sendComplaintEmail(input.restaurantId, complaint)
    .then((r) => db.from('complaints').update({ email_status: r.ok ? 'enviado' : 'erro' }).eq('id', complaint.id))
    .catch(() => {});

  return { ok: true, complaint };
}
