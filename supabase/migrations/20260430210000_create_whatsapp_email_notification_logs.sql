create table if not exists public.whatsapp_email_notification_logs (
  id uuid primary key default gen_random_uuid(),
  whatsapp_message_id uuid references public.whatsapp_inbound_messages(id) on delete set null,
  message_sid text not null,
  recipient_email text,
  notification_type text not null default 'internal_notification',
  provider text not null default 'resend',
  provider_message_id text,
  status text not null default 'queued',
  subject text,
  error_message text,
  meta jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint whatsapp_email_notification_logs_status_check
    check (status in ('queued', 'sent', 'failed', 'skipped')),
  constraint whatsapp_email_notification_logs_type_check
    check (notification_type in ('internal_notification'))
);

create index if not exists whatsapp_email_notification_logs_message_sid_idx
  on public.whatsapp_email_notification_logs (message_sid, created_at desc);

create index if not exists whatsapp_email_notification_logs_recipient_idx
  on public.whatsapp_email_notification_logs (recipient_email, created_at desc);

create index if not exists whatsapp_email_notification_logs_status_idx
  on public.whatsapp_email_notification_logs (status, created_at desc);

alter table public.whatsapp_email_notification_logs enable row level security;

drop policy if exists "Service role full access on whatsapp_email_notification_logs"
  on public.whatsapp_email_notification_logs;

create policy "Service role full access on whatsapp_email_notification_logs"
on public.whatsapp_email_notification_logs
for all
to service_role
using (true)
with check (true);
