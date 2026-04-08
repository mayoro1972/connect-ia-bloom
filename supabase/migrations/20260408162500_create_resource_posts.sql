create table if not exists public.resource_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'draft',
  slug text not null unique,
  category_key text not null,
  sector_key text,
  title_fr text not null,
  title_en text not null,
  excerpt_fr text not null,
  excerpt_en text not null,
  read_time_minutes integer,
  published_at timestamptz not null default now(),
  source_name text,
  source_url text,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_new_manual boolean not null default false,
  constraint resource_posts_status_check check (status in ('draft', 'published', 'archived')),
  constraint resource_posts_read_time_check check (read_time_minutes is null or read_time_minutes > 0)
);

create index if not exists resource_posts_status_published_at_idx
  on public.resource_posts (status, published_at desc);

alter table public.resource_posts enable row level security;

drop policy if exists "Published resource posts are public" on public.resource_posts;

create policy "Published resource posts are public"
  on public.resource_posts
  for select
  to anon, authenticated
  using (status = 'published');

revoke all on table public.resource_posts from anon, authenticated;
grant select on table public.resource_posts to anon, authenticated;

create or replace function public.set_resource_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_resource_posts_updated_at on public.resource_posts;

create trigger set_resource_posts_updated_at
before update on public.resource_posts
for each row
execute function public.set_resource_posts_updated_at();

