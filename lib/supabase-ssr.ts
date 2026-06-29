import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Cliente Supabase para páginas/Server Components do ADMIN.
 * Usa os cookies de sessão (login do administrador).
 */
export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // chamado de um Server Component — ignorável quando há middleware.
          }
        },
      },
    }
  );
}

/** Retorna o usuário admin logado (ou null) com seu papel no restaurante. */
export async function getAdminUser() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('*, restaurants(*)')
    .eq('auth_user_id', user.id)
    .eq('active', true)
    .maybeSingle();

  if (!adminRow) return null;
  return { user, admin: adminRow };
}
