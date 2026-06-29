import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/supabase-ssr';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

/**
 * POST /api/admin/users  { email, password, name, role }
 * Cria um novo administrador. Só quem está logado como owner/manager pode.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminUser();
    if (!session) return NextResponse.json({ ok: false, error: 'Não autenticado.' }, { status: 401 });
    if (!['owner', 'manager'].includes(session.admin.role)) {
      return NextResponse.json({ ok: false, error: 'Apenas owner/manager podem criar usuários.' }, { status: 403 });
    }

    const { email, password, name, role } = await req.json();
    if (!email || !password) return NextResponse.json({ ok: false, error: 'Informe e-mail e senha.' }, { status: 400 });
    if (String(password).length < 6) return NextResponse.json({ ok: false, error: 'Senha muito curta (mín. 6).' }, { status: 400 });

    const db = supabaseAdmin();
    const { data: created, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

    const { error: insErr } = await db.from('admin_users').insert({
      auth_user_id: created.user.id,
      restaurant_id: session.admin.restaurant_id,
      name: name || email,
      role: ['owner', 'manager', 'reception', 'viewer'].includes(role) ? role : 'reception',
      active: true,
    });
    if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
