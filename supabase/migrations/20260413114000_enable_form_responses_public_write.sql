grant select, insert, update on table public.form_responses to anon, authenticated;

drop policy if exists "Anyone can read form responses" on public.form_responses;
drop policy if exists "Anyone can insert form responses" on public.form_responses;
drop policy if exists "Anyone can update form responses" on public.form_responses;

create policy "Anyone can read form responses"
  on public.form_responses
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can insert form responses"
  on public.form_responses
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can update form responses"
  on public.form_responses
  for update
  to anon, authenticated
  using (true)
  with check (true);
