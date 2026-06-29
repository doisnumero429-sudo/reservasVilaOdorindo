import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente "admin" do Supabase (service_role).
 * USO EXCLUSIVO NO SERVIDOR. Ignora o RLS — nunca expor no navegador.
 */
export function supabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const DEFAULT_SLUG = process.env.DEFAULT_RESTAURANT_SLUG || 'villa-grill';

/** Busca o restaurante padrão (Villa Grill) com suas configurações principais. */
export async function getRestaurant(slug: string = DEFAULT_SLUG) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}
