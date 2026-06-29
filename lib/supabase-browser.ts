'use client';

import { createBrowserClient } from '@supabase/ssr';

/** Cliente Supabase para componentes do navegador (login e telas do admin). */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
