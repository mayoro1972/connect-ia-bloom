create table if not exists public.whatsapp_inbound_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  message_sid text not null unique,
  account_sid text,
  from_number text not null,
  to_number text,
  profile_name text,
  body text,
  num_media integer not null default 0,
  message_status text,
  wa_id text,
  raw_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_whatsapp_inbound_messages_created_at
  on public.whatsapp_inbound_messages (created_at desc);

create index if not exists idx_whatsapp_inbound_messages_from_number
  on public.whatsapp_inbound_messages (from_number);

alter table public.whatsapp_inbound_messages enable row level security;

drop policy if exists "Only service role can read whatsapp inbound messages" on public.whatsapp_inbound_messages;
create policy "Only service role can read whatsapp inbound messages"
on public.whatsapp_inbound_messages
for select
to authenticated
using (false);
