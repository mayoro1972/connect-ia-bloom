alter table public.whatsapp_inbound_messages
  add column if not exists is_read boolean not null default false,
  add column if not exists status text not null default 'new',
  add column if not exists category text,
  add column if not exists internal_notes text,
  add column if not exists handled_at timestamptz,
  add column if not exists last_action_at timestamptz;

create index if not exists idx_whatsapp_inbound_messages_status
  on public.whatsapp_inbound_messages (status);

create index if not exists idx_whatsapp_inbound_messages_category
  on public.whatsapp_inbound_messages (category);

create index if not exists idx_whatsapp_inbound_messages_is_read
  on public.whatsapp_inbound_messages (is_read);
