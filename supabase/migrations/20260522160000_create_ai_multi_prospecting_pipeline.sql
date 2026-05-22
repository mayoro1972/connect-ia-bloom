create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.prospect_targets (
  id uuid primary key default gen_random_uuid(),
  prospect_id text not null unique,
  organization_name text not null,
  website text not null,
  country text not null default 'Côte d''Ivoire',
  organization_type text not null default 'organisation à qualifier',
  sector_guess text not null default 'secteur à confirmer',
  decision_maker_name text,
  target_email text,
  custom_page_paths_csv text not null default '',
  booking_link_45min text,
  commercial_priority_default text not null default 'tier1'
    check (commercial_priority_default in ('tier1', 'tier2', 'tier3')),
  research_scope text not null default 'public_web_only'
    check (research_scope in ('public_web_only', 'public_web_and_search', 'public_web_and_social')),
  source_backend text not null default 'supabase'
    check (source_backend in ('supabase', 'airtable', 'google_sheets', 'manual', 'import')),
  source_label text,
  raw_source_id text,
  source_payload jsonb not null default '{}'::jsonb,
  status text not null default 'ready'
    check (status in ('ready', 'active', 'paused', 'closed', 'archived')),
  paused boolean not null default false,
  do_not_contact boolean not null default false,
  outreach_attempt_count integer not null default 0
    check (outreach_attempt_count >= 0),
  last_response_status text,
  last_sequence_result text,
  stop_reason text,
  niche_status text,
  next_action_at timestamptz,
  last_outreach_at timestamptz,
  last_researched_at timestamptz,
  last_pack_id text,
  notes_internal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prospect_targets_status_idx
  on public.prospect_targets (status, paused, do_not_contact);

create index if not exists prospect_targets_next_action_idx
  on public.prospect_targets (next_action_at, updated_at);

create index if not exists prospect_targets_website_idx
  on public.prospect_targets (website);

create or replace trigger set_prospect_targets_updated_at
before update on public.prospect_targets
for each row
execute function public.set_updated_at();

create table if not exists public.ai_prospecting_packs (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null unique,
  prospect_id text references public.prospect_targets(prospect_id) on delete set null,
  organization_name text not null,
  decision_maker_name text,
  target_email text,
  website text,
  status text not null default 'pending_approval'
    check (status in ('pending_approval', 'approved', 'rejected', 'sent', 'approval_error', 'expired', 'cancelled')),
  payload jsonb not null default '{}'::jsonb,
  llm_redaction_summary jsonb,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  sent_at timestamptz,
  approval_error_at timestamptz,
  resend_message_id text,
  reviewer_email text,
  error_reason text,
  updated_at timestamptz not null default now()
);

create index if not exists ai_prospecting_packs_prospect_idx
  on public.ai_prospecting_packs (prospect_id, created_at desc);

create index if not exists ai_prospecting_packs_status_idx
  on public.ai_prospecting_packs (status, created_at desc);

create or replace trigger set_ai_prospecting_packs_updated_at
before update on public.ai_prospecting_packs
for each row
execute function public.set_updated_at();

create table if not exists public.outreach_attempts (
  id uuid primary key default gen_random_uuid(),
  prospect_id text references public.prospect_targets(prospect_id) on delete set null,
  pack_id text references public.ai_prospecting_packs(pack_id) on delete set null,
  organization_id uuid,
  person_id uuid,
  organization_name text,
  target_email text,
  channel text not null
    check (channel in ('email', 'whatsapp', 'linkedin', 'phone', 'web')),
  message_variant text,
  sent_at timestamptz not null default now(),
  delivery_status text not null default 'submitted'
    check (delivery_status in ('submitted', 'queued', 'delivered', 'bounced', 'failed')),
  response_status text not null default 'pending'
    check (response_status in ('pending', 'opened', 'replied', 'interested', 'meeting_booked', 'not_interested', 'unsubscribed', 'no_response')),
  response_date timestamptz,
  follow_up_due_at timestamptz,
  stop_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists outreach_attempts_sent_at_idx
  on public.outreach_attempts (sent_at desc);

create index if not exists outreach_attempts_prospect_idx
  on public.outreach_attempts (prospect_id, sent_at desc);

create index if not exists outreach_attempts_pack_idx
  on public.outreach_attempts (pack_id);

create table if not exists public.do_not_contact (
  id uuid primary key default gen_random_uuid(),
  prospect_id text references public.prospect_targets(prospect_id) on delete cascade,
  organization_id uuid,
  person_id uuid,
  channel text not null default 'email'
    check (channel in ('email', 'whatsapp', 'linkedin', 'phone', 'web', 'all')),
  reason text not null,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (prospect_id, channel)
);

create table if not exists public.prospecting_batch_runs (
  id uuid primary key default gen_random_uuid(),
  run_label text not null,
  source_backend text not null
    check (source_backend in ('supabase', 'airtable', 'google_sheets', 'manual', 'import')),
  source_snapshot jsonb not null default '{}'::jsonb,
  batch_fetch_limit integer not null default 25
    check (batch_fetch_limit > 0),
  daily_send_limit integer not null default 5
    check (daily_send_limit >= 0),
  max_attempts_per_prospect integer not null default 3
    check (max_attempts_per_prospect > 0),
  min_confidence_score numeric(4,2) not null default 0.45
    check (min_confidence_score >= 0 and min_confidence_score <= 1),
  processed_count integer not null default 0
    check (processed_count >= 0),
  skipped_count integer not null default 0
    check (skipped_count >= 0),
  status text not null default 'started'
    check (status in ('started', 'completed', 'failed', 'cancelled')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prospecting_batch_runs_started_at_idx
  on public.prospecting_batch_runs (started_at desc);

create or replace trigger set_prospecting_batch_runs_updated_at
before update on public.prospecting_batch_runs
for each row
execute function public.set_updated_at();

create table if not exists public.prospecting_batch_run_items (
  id uuid primary key default gen_random_uuid(),
  batch_run_id uuid not null references public.prospecting_batch_runs(id) on delete cascade,
  prospect_id text references public.prospect_targets(prospect_id) on delete set null,
  pack_id text references public.ai_prospecting_packs(pack_id) on delete set null,
  organization_name text,
  website text,
  process_decision text not null
    check (process_decision in ('process_now', 'skip')),
  batch_status text,
  batch_stop_reason text,
  created_at timestamptz not null default now()
);

create index if not exists prospecting_batch_run_items_batch_idx
  on public.prospecting_batch_run_items (batch_run_id, created_at);

create or replace function public.sync_prospect_from_outreach_attempt()
returns trigger
language plpgsql
as $$
begin
  if new.prospect_id is not null then
    update public.prospect_targets
    set
      outreach_attempt_count = coalesce(outreach_attempt_count, 0) + 1,
      last_outreach_at = coalesce(new.sent_at, now()),
      last_response_status = coalesce(new.response_status, last_response_status),
      stop_reason = case
        when new.response_status in ('not_interested', 'unsubscribed') then new.response_status
        else stop_reason
      end,
      status = case
        when new.response_status in ('not_interested', 'unsubscribed') then 'closed'
        when paused then status
        else 'active'
      end,
      updated_at = now()
    where prospect_id = new.prospect_id;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_prospect_from_outreach_attempt on public.outreach_attempts;

create trigger sync_prospect_from_outreach_attempt
after insert on public.outreach_attempts
for each row
execute function public.sync_prospect_from_outreach_attempt();

create or replace function public.sync_prospect_last_pack()
returns trigger
language plpgsql
as $$
begin
  if new.prospect_id is not null then
    update public.prospect_targets
    set
      last_pack_id = new.pack_id,
      updated_at = now()
    where prospect_id = new.prospect_id;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_prospect_last_pack on public.ai_prospecting_packs;

create trigger sync_prospect_last_pack
after insert on public.ai_prospecting_packs
for each row
execute function public.sync_prospect_last_pack();

create or replace view public.prospect_targets_ready_for_batch as
select
  p.*
from public.prospect_targets p
where p.status in ('ready', 'active')
  and p.paused = false
  and p.do_not_contact = false
  and (p.stop_reason is null or p.stop_reason = '');

alter table public.prospect_targets enable row level security;
alter table public.ai_prospecting_packs enable row level security;
alter table public.outreach_attempts enable row level security;
alter table public.do_not_contact enable row level security;
alter table public.prospecting_batch_runs enable row level security;
alter table public.prospecting_batch_run_items enable row level security;

comment on table public.prospect_targets is 'Source canonique des prospects à traiter par les workflows multi-prospects TransferAI.';
comment on table public.ai_prospecting_packs is 'Packs générés par les workflows V2 et V3 avant validation ou envoi.';
comment on table public.outreach_attempts is 'Journal des prises de contact sortantes utilisées aussi pour les quotas quotidiens.';
comment on table public.prospecting_batch_runs is 'Historique des runs quotidiens du workflow V4 batch.';
comment on table public.prospecting_batch_run_items is 'Détail prospect par prospect de chaque batch.';
