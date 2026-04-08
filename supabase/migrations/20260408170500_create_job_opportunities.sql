create table if not exists public.job_opportunities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'draft',
  slug text not null unique,
  title text not null,
  summary_fr text not null,
  summary_en text not null,
  market_key text not null,
  source_name text not null,
  source_url text,
  apply_url text,
  location_fr text not null,
  location_en text not null,
  work_mode text not null default 'remote',
  opportunity_type text not null default 'job',
  compensation_label text,
  published_at timestamptz not null default now(),
  is_featured boolean not null default false,
  is_new_manual boolean not null default false,
  constraint job_opportunities_status_check check (status in ('draft', 'published', 'archived')),
  constraint job_opportunities_market_check check (market_key in ('cote-divoire', 'africa', 'international')),
  constraint job_opportunities_work_mode_check check (work_mode in ('remote', 'hybrid', 'onsite')),
  constraint job_opportunities_type_check check (opportunity_type in ('job', 'freelance', 'mission', 'internship'))
);

create index if not exists job_opportunities_status_published_at_idx
  on public.job_opportunities (status, published_at desc);

alter table public.job_opportunities enable row level security;

drop policy if exists "Published job opportunities are public" on public.job_opportunities;

create policy "Published job opportunities are public"
  on public.job_opportunities
  for select
  to anon, authenticated
  using (status = 'published');

revoke all on table public.job_opportunities from anon, authenticated;
grant select on table public.job_opportunities to anon, authenticated;

create or replace function public.set_job_opportunities_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_job_opportunities_updated_at on public.job_opportunities;

create trigger set_job_opportunities_updated_at
before update on public.job_opportunities
for each row
execute function public.set_job_opportunities_updated_at();

