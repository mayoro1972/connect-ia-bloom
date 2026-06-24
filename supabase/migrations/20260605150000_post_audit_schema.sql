-- =============================================================
-- Post-Audit Expert Routing — schema extensions
-- Safe alignment for existing TransferAI schema
-- Supports: 74_n8n_Post_Audit_Expert_Routing_V2
-- =============================================================

alter table public.form_responses
  add column if not exists pack_id text references public.ai_prospecting_packs(pack_id) on delete set null,
  add column if not exists context_snapshot jsonb not null default '{}'::jsonb;

create index if not exists idx_form_responses_pack_id
  on public.form_responses (pack_id);

create index if not exists idx_form_responses_is_completed
  on public.form_responses (is_completed, submitted_at desc);

alter table public.form_invitations
  add column if not exists pack_id text references public.ai_prospecting_packs(pack_id) on delete set null,
  add column if not exists response_email text,
  add column if not exists response_cc text,
  add column if not exists access_context jsonb not null default '{}'::jsonb;

create index if not exists idx_form_invitations_pack_id
  on public.form_invitations (pack_id);

create table if not exists public.post_audit_follow_ups (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null unique references public.ai_prospecting_packs(pack_id) on delete cascade,
  prospect_id text references public.prospect_targets(prospect_id) on delete set null,
  organization_name text,
  target_email text,
  sector_guess text,
  maturity_level text,
  recommended_offer text,
  primary_service text,
  secondary_service text,
  priority_use_cases jsonb not null default '[]'::jsonb,
  quick_wins_declared jsonb not null default '[]'::jsonb,
  constraints_declared jsonb not null default '[]'::jsonb,
  assigned_expert_email text,
  internal_email_to text,
  workflow_status text not null default 'ready_for_expert'
    check (workflow_status in ('ready_for_expert', 'brief_sent', 'meeting_prepared', 'meeting_booked', 'closed')),
  response_submitted_at timestamptz,
  next_action_at timestamptz,
  booking_link text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_post_audit_follow_ups_prospect_id
  on public.post_audit_follow_ups (prospect_id);

create index if not exists idx_post_audit_follow_ups_workflow_status
  on public.post_audit_follow_ups (workflow_status);

create index if not exists idx_post_audit_follow_ups_next_action_at
  on public.post_audit_follow_ups (next_action_at);

create index if not exists idx_post_audit_follow_ups_assigned_expert_email
  on public.post_audit_follow_ups (assigned_expert_email, response_submitted_at desc);

drop trigger if exists set_post_audit_follow_ups_updated_at on public.post_audit_follow_ups;

create trigger set_post_audit_follow_ups_updated_at
before update on public.post_audit_follow_ups
for each row
execute function public.set_updated_at();

alter table public.post_audit_follow_ups enable row level security;

revoke all on table public.post_audit_follow_ups from anon, authenticated;
grant all on table public.post_audit_follow_ups to service_role;

drop policy if exists "Service role full access on post_audit_follow_ups"
  on public.post_audit_follow_ups;

create policy "Service role full access on post_audit_follow_ups"
on public.post_audit_follow_ups
for all
to service_role
using (true)
with check (true);
