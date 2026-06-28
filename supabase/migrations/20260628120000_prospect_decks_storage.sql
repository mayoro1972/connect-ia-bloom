-- Bucket Supabase Storage pour les decks prospects générés automatiquement
-- Accès public en lecture, écriture réservée au service_role (n8n)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'prospect-decks',
  'prospect-decks',
  true,
  20971520,  -- 20 MB max par fichier
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update set
  public            = excluded.public,
  file_size_limit   = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique sans authentification
create policy "prospect_decks_public_read"
  on storage.objects for select
  using (bucket_id = 'prospect-decks');

-- Écriture uniquement via service_role (n8n, scripts)
create policy "prospect_decks_service_write"
  on storage.objects for insert
  with check (
    bucket_id = 'prospect-decks'
    and auth.role() = 'service_role'
  );

create policy "prospect_decks_service_update"
  on storage.objects for update
  using (
    bucket_id = 'prospect-decks'
    and auth.role() = 'service_role'
  );
