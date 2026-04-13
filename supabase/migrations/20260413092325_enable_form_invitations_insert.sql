grant insert on table public.form_invitations to anon, authenticated;

drop policy if exists "Anyone can insert form invitations" on public.form_invitations;

create policy "Anyone can insert form invitations"
  on public.form_invitations
  for insert
  to anon, authenticated
  with check (true);
