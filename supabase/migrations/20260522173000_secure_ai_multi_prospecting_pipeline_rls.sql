revoke all on table public.prospect_targets from anon, authenticated;
revoke all on table public.ai_prospecting_packs from anon, authenticated;
revoke all on table public.outreach_attempts from anon, authenticated;
revoke all on table public.do_not_contact from anon, authenticated;
revoke all on table public.prospecting_batch_runs from anon, authenticated;
revoke all on table public.prospecting_batch_run_items from anon, authenticated;
revoke all on table public.prospect_targets_ready_for_batch from anon, authenticated;

grant all on table public.prospect_targets to service_role;
grant all on table public.ai_prospecting_packs to service_role;
grant all on table public.outreach_attempts to service_role;
grant all on table public.do_not_contact to service_role;
grant all on table public.prospecting_batch_runs to service_role;
grant all on table public.prospecting_batch_run_items to service_role;
grant select on table public.prospect_targets_ready_for_batch to service_role;

drop policy if exists "Service role full access on prospect_targets"
  on public.prospect_targets;
drop policy if exists "Service role full access on ai_prospecting_packs"
  on public.ai_prospecting_packs;
drop policy if exists "Service role full access on outreach_attempts"
  on public.outreach_attempts;
drop policy if exists "Service role full access on do_not_contact"
  on public.do_not_contact;
drop policy if exists "Service role full access on prospecting_batch_runs"
  on public.prospecting_batch_runs;
drop policy if exists "Service role full access on prospecting_batch_run_items"
  on public.prospecting_batch_run_items;

create policy "Service role full access on prospect_targets"
on public.prospect_targets
for all
to service_role
using (true)
with check (true);

create policy "Service role full access on ai_prospecting_packs"
on public.ai_prospecting_packs
for all
to service_role
using (true)
with check (true);

create policy "Service role full access on outreach_attempts"
on public.outreach_attempts
for all
to service_role
using (true)
with check (true);

create policy "Service role full access on do_not_contact"
on public.do_not_contact
for all
to service_role
using (true)
with check (true);

create policy "Service role full access on prospecting_batch_runs"
on public.prospecting_batch_runs
for all
to service_role
using (true)
with check (true);

create policy "Service role full access on prospecting_batch_run_items"
on public.prospecting_batch_run_items
for all
to service_role
using (true)
with check (true);
