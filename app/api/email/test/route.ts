import { NextRequest, NextResponse } from 'next/server';
import { getRestaurant } from '@/lib/supabase';
import { sendEmail, brandedEmail } from '@/lib/email';

export const runtime = 'nodejs';

/** POST /api/email/test  { to: string[] }  — envia um e-mail de teste. */
export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json();
    const list: string[] = Array.isArray(to) ? to : String(to || '').split(/[,\n;]/).map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) {
      return NextResponse.json({ ok: false, error: 'Informe ao menos um e-mail.' }, { status: 400 });
    }
    const restaurant = await getRestaurant();
    const res = await sendEmail({
      restaurantId: restaurant.id,
      type: 'test',
      to: list,
      subject: 'Teste de e-mail — Villa Grill',
      html: brandedEmail('E-mail de teste', '<p>Se você recebeu esta mensagem, o envio de e-mails está funcionando. ✅</p>'),
      text: 'Teste de e-mail do sistema Villa Grill. Funcionou!',
    });
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
