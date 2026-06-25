create table if not exists public.whatsapp_followup_sequences (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  from_number text not null,
  profile_name text,
  trigger_message_id uuid references public.whatsapp_inbound_messages(id) on delete set null,
  trigger_message_sid text not null unique,
  latest_inbound_message_sid text not null,
  latest_inbound_at timestamptz not null default now(),
  first_auto_reply_sent_at timestamptz,
  second_followup_due_at timestamptz,
  second_followup_sent_at timestamptz,
  closed_at timestamptz,
  booking_link text,
  status text not null default 'pending_second_followup',
  opt_out boolean not null default false,
  last_error text,
  meta jsonb not null default '{}'::jsonb,
  constraint whatsapp_followup_sequences_status_check
    check (
      status in (
        'pending_second_followup',
        'second_followup_sent',
        'prospect_replied',
        'opted_out',
        'closed',
        'error'
      )
    )
);

create index if not exists whatsapp_followup_sequences_from_number_idx
  on public.whatsapp_followup_sequences (from_number, created_at desc);

create index if not exists whatsapp_followup_sequences_status_idx
  on public.whatsapp_followup_sequences (status, second_followup_due_at asc);

create index if not exists whatsapp_followup_sequences_due_idx
  on public.whatsapp_followup_sequences (second_followup_due_at asc)
  where status = 'pending_second_followup' and opt_out = false;

alter table public.whatsapp_followup_sequences enable row level security;

drop policy if exists "Service role full access on whatsapp_followup_sequences"
  on public.whatsapp_followup_sequences;

create policy "Service role full access on whatsapp_followup_sequences"
on public.whatsapp_followup_sequences
for all
to service_role
using (true)
with check (true);

drop trigger if exists set_whatsapp_followup_sequences_updated_at on public.whatsapp_followup_sequences;

create trigger set_whatsapp_followup_sequences_updated_at
before update on public.whatsapp_followup_sequences
for each row
execute function public.set_updated_at();
