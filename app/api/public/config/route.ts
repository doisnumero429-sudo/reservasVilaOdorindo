import { NextResponse } from 'next/server';
import { supabaseAdmin, getRestaurant } from '@/lib/supabase';

export const runtime = 'nodejs';

/**
 * GET /api/public/config
 * Configurações PÚBLICAS usadas pelo site (ex.: link do cardápio/delivery Goomer).
 * Não expõe nada sensível.
 */
export async function GET() {
  try {
    const db = supabaseAdmin();
    const restaurant = await getRestaurant();
    const { data: settings } = await db
      .from('restaurant_settings')
      .select('key,value')
      .eq('restaurant_id', restaurant.id)
      .in('key', ['delivery_url']);
    const map: Record<string, any> = {};
    (settings || []).forEach((s) => { map[s.key] = s.value; });

    return NextResponse.json({
      delivery_url: map.delivery_url || null,
      whatsapp_number: restaurant.whatsapp_number || null,
      instagram_url: restaurant.instagram_url || null,
    });
  } catch {
    return NextResponse.json({ delivery_url: null });
  }
}
