create table if not exists public.newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  issue_date date not null default current_date,
  language text not null default 'fr',
  status text not null default 'draft',
  title text not null,
  subject text not null,
  preheader text,
  intro text,
  target_domains text[] not null default '{}',
  highlight_title text,
  highlight_summary text,
  highlight_url text,
  tip_title text,
  tip_body text,
  tool_name text,
  tool_category text,
  tool_summary text,
  prompt_title text,
  prompt_body text,
  cta_label text,
  cta_url text,
  body_markdown text,
  body_html text,
  source_post_ids uuid[] not null default '{}',
  generation_source text not null default 'manual',
  generation_notes text,
  scheduled_for timestamptz,
  approved_at timestamptz,
  sent_at timestamptz,
  last_test_sent_at timestamptz,
  recipient_count integer not null default 0,
  send_count integer not null default 0,
  meta jsonb,
  constraint newsletter_issues_language_check check (language in ('fr', 'en')),
  constraint newsletter_issues_status_check check (status in ('draft', 'review', 'approved', 'scheduled', 'sending', 'sent', 'archived')),
  constraint newsletter_issues_generation_source_check check (generation_source in ('manual', 'ai', 'hybrid'))
);

create index if not exists newsletter_issues_status_issue_date_idx
  on public.newsletter_issues (status, issue_date desc, created_at desc);

create index if not exists newsletter_issues_language_idx
  on public.newsletter_issues (language, issue_date desc);

drop trigger if exists touch_newsletter_issues_updated_at on public.newsletter_issues;
create trigger touch_newsletter_issues_updated_at
before update on public.newsletter_issues
for each row
execute function public.touch_updated_at();

create table if not exists public.newsletter_delivery_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  newsletter_issue_id uuid not null references public.newsletter_issues(id) on delete cascade,
  recipient_email text not null,
  delivery_type text not null default 'campaign',
  status text not null default 'queued',
  provider text not null default 'resend',
  provider_message_id text,
  language text not null default 'fr',
  subscribed_domains text[] not null default '{}',
  sent_at timestamptz,
  error_message text,
  payload jsonb,
  constraint newsletter_delivery_logs_delivery_type_check check (delivery_type in ('test', 'campaign')),
  constraint newsletter_delivery_logs_status_check check (status in ('queued', 'sent', 'failed', 'skipped')),
  constraint newsletter_delivery_logs_language_check check (language in ('fr', 'en'))
);

create index if not exists newsletter_delivery_logs_issue_idx
  on public.newsletter_delivery_logs (newsletter_issue_id, created_at desc);

create index if not exists newsletter_delivery_logs_recipient_idx
  on public.newsletter_delivery_logs (recipient_email, created_at desc);

alter table public.editorial_jobs drop constraint if exists editorial_jobs_type_check;
alter table public.editorial_jobs
  add constraint editorial_jobs_type_check
  check (job_type in (
    'discover',
    'classify',
    'score',
    'draft_fr',
    'draft_en',
    'seo',
    'sources',
    'newsletter_draft',
    'newsletter_send'
  ));

alter table public.newsletter_issues enable row level security;
alter table public.newsletter_delivery_logs enable row level security;

revoke all on table public.newsletter_issues from anon, authenticated;
revoke all on table public.newsletter_delivery_logs from anon, authenticated;
