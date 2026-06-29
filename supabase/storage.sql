-- =====================================================================
--  VILLA GRILL — STORAGE (depósito de imagens)
--  Rode DEPOIS de schema.sql, no SQL Editor do Supabase.
--  Cria o "balde" (bucket) onde ficam logo, QR, fundo, avatar, etc.
-- =====================================================================

-- 1. Cria o bucket público "assets" (as imagens precisam ser públicas para
--    aparecerem no site).
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = true;

-- 2. Permissões:
--    - Qualquer pessoa pode VER as imagens (necessário para o site exibir).
--    - Apenas usuários logados (administradores) podem enviar/trocar/excluir.

drop policy if exists "assets_public_read" on storage.objects;
create policy "assets_public_read" on storage.objects
  for select using (bucket_id = 'assets');

drop policy if exists "assets_admin_insert" on storage.objects;
create policy "assets_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'assets');

drop policy if exists "assets_admin_update" on storage.objects;
create policy "assets_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'assets');

drop policy if exists "assets_admin_delete" on storage.objects;
create policy "assets_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'assets');

-- Fim.
