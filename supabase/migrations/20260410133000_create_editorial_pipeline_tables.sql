create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.source_feeds (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  url text not null,
  feed_type text not null default 'rss',
  publisher text,
  country_focus text,
  region_focus text,
  domain_focus text,
  language text not null default 'fr',
  trust_score integer not null default 50,
  is_active boolean not null default true,
  notes text,
  constraint source_feeds_type_check check (feed_type in ('rss', 'site', 'api', 'institution', 'manual')),
  constraint source_feeds_trust_score_check check (trust_score >= 0 and trust_score <= 100)
);

create index if not exists source_feeds_active_idx
  on public.source_feeds (is_active, trust_score desc);

drop trigger if exists touch_source_feeds_updated_at on public.source_feeds;
create trigger touch_source_feeds_updated_at
before update on public.source_feeds
for each row
execute function public.touch_updated_at();

create table if not exists public.source_signals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source_feed_id uuid references public.source_feeds(id) on delete set null,
  external_id text,
  title text not null,
  url text not null,
  published_at timestamptz,
  raw_text text,
  raw_summary text,
  language text,
  country_detected text,
  region_detected text,
  domain_detected text,
  content_type_detected text,
  relevance_score integer,
  credibility_score integer,
  priority_score integer,
  status text not null default 'new',
  tags text[] not null default '{}',
  hash text,
  review_notes text,
  constraint source_signals_status_check check (status in ('new', 'scored', 'drafted', 'rejected', 'published', 'duplicate')),
  constraint source_signals_relevance_score_check check (relevance_score is null or (relevance_score >= 0 and relevance_score <= 100)),
  constraint source_signals_credibility_score_check check (credibility_score is null or (credibility_score >= 0 and credibility_score <= 100)),
  constraint source_signals_priority_score_check check (priority_score is null or (priority_score >= 0 and priority_score <= 100))
);

create unique index if not exists source_signals_url_key on public.source_signals(url);
create index if not exists source_signals_status_priority_idx
  on public.source_signals (status, priority_score desc nulls last, published_at desc nulls last);
create index if not exists source_signals_domain_status_idx
  on public.source_signals (domain_detected, status);

drop trigger if exists touch_source_signals_updated_at on public.source_signals;
create trigger touch_source_signals_updated_at
before update on public.source_signals
for each row
execute function public.touch_updated_at();

create table if not exists public.editorial_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source_signal_id uuid references public.source_signals(id) on delete cascade,
  resource_post_id uuid references public.resource_posts(id) on delete set null,
  job_type text not null,
  provider text not null,
  model text,
  input_payload jsonb,
  output_payload jsonb,
  status text not null default 'pending',
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  constraint editorial_jobs_type_check check (job_type in ('discover', 'classify', 'score', 'draft_fr', 'draft_en', 'seo', 'sources')),
  constraint editorial_jobs_status_check check (status in ('pending', 'running', 'done', 'failed'))
);

create index if not exists editorial_jobs_signal_idx
  on public.editorial_jobs (source_signal_id, status, created_at desc);
create index if not exists editorial_jobs_post_idx
  on public.editorial_jobs (resource_post_id, status, created_at desc);

drop trigger if exists touch_editorial_jobs_updated_at on public.editorial_jobs;
create trigger touch_editorial_jobs_updated_at
before update on public.editorial_jobs
for each row
execute function public.touch_updated_at();

create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  language text not null default 'fr',
  subscribed_domains text[] not null default '{}',
  status text not null default 'active',
  source_page text,
  constraint newsletter_subscriptions_status_check check (status in ('active', 'unsubscribed'))
);

create unique index if not exists newsletter_subscriptions_email_key
  on public.newsletter_subscriptions(email);

alter table public.resource_posts
  add column if not exists origin_signal_id uuid references public.source_signals(id) on delete set null,
  add column if not exists editorial_status text not null default 'draft',
  add column if not exists review_notes text,
  add column if not exists translated_from_post_id uuid references public.resource_posts(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'resource_posts_editorial_status_check'
  ) then
    alter table public.resource_posts
      add constraint resource_posts_editorial_status_check
      check (editorial_status in ('draft', 'review', 'approved', 'published', 'archived'));
  end if;
end $$;

create index if not exists resource_posts_editorial_status_idx
  on public.resource_posts (editorial_status, published_at desc);
create index if not exists resource_posts_origin_signal_idx
  on public.resource_posts (origin_signal_id);

alter table public.source_feeds enable row level security;
alter table public.source_signals enable row level security;
alter table public.editorial_jobs enable row level security;
alter table public.newsletter_subscriptions enable row level security;

revoke all on table public.source_feeds from anon, authenticated;
revoke all on table public.source_signals from anon, authenticated;
revoke all on table public.editorial_jobs from anon, authenticated;
revoke all on table public.newsletter_subscriptions from anon, authenticated;
