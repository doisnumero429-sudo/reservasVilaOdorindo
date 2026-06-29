import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

/** POST /api/ai/feedback { log_id, vote: 'up' | 'down' } — registra o 👍/👎 do cliente. */
export async function POST(req: NextRequest) {
  try {
    const { log_id, vote } = await req.json();
    if (!log_id || !['up', 'down'].includes(vote)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await supabaseAdmin().from('ai_logs').update({ feedback: vote }).eq('id', log_id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
