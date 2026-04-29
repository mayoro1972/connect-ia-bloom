create table if not exists public.social_video_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  platform text not null default 'tiktok' check (platform in ('tiktok', 'youtube', 'instagram', 'shorts')),
  slug text not null unique,
  title_fr text not null,
  title_en text not null,
  summary_fr text not null,
  summary_en text not null,
  video_url text not null,
  thumbnail_url text,
  cta_label_fr text,
  cta_label_en text,
  cta_url text,
  frequency_label_fr text not null default '5 capsules / semaine',
  frequency_label_en text not null default '5 clips / week',
  sort_order integer not null default 100,
  is_featured boolean not null default false,
  published_at timestamptz not null default now()
);

create index if not exists idx_social_video_posts_status_platform
  on public.social_video_posts (status, platform);

create index if not exists idx_social_video_posts_display
  on public.social_video_posts (platform, is_featured desc, sort_order asc, published_at desc);

drop trigger if exists touch_social_video_posts_updated_at on public.social_video_posts;
create trigger touch_social_video_posts_updated_at
before update on public.social_video_posts
for each row
execute function public.touch_updated_at();

alter table public.social_video_posts enable row level security;

drop policy if exists "Published social videos are public" on public.social_video_posts;
create policy "Published social videos are public"
on public.social_video_posts
for select
to anon, authenticated
using (status = 'published');

insert into public.social_video_posts (
  slug,
  platform,
  title_fr,
  title_en,
  summary_fr,
  summary_en,
  video_url,
  thumbnail_url,
  cta_label_fr,
  cta_label_en,
  cta_url,
  frequency_label_fr,
  frequency_label_en,
  sort_order,
  is_featured,
  status
)
values (
  'tiktok-lancement-transferai-webinaire-ia',
  'tiktok',
  'Lancement TransferAI Côte d''Ivoire & webinaire IA',
  'TransferAI Côte d''Ivoire launch & AI webinar',
  'Une capsule TikTok pour découvrir le lancement de TransferAI en Côte d''Ivoire et rejoindre le webinaire IA gratuit destiné aux professionnels, étudiants et entrepreneurs.',
  'A TikTok capsule introducing TransferAI Côte d''Ivoire and inviting professionals, students, and entrepreneurs to join the free AI webinar.',
  'https://www.tiktok.com/@transfer_ai_africa/video/7633069888805915912',
  null,
  'Voir la capsule',
  'Watch the clip',
  'https://www.tiktok.com/@transfer_ai_africa/video/7633069888805915912',
  '5 capsules / semaine',
  '5 clips / week',
  1,
  true,
  'published'
)
on conflict (slug) do update
set
  title_fr = excluded.title_fr,
  title_en = excluded.title_en,
  summary_fr = excluded.summary_fr,
  summary_en = excluded.summary_en,
  video_url = excluded.video_url,
  thumbnail_url = excluded.thumbnail_url,
  cta_label_fr = excluded.cta_label_fr,
  cta_label_en = excluded.cta_label_en,
  cta_url = excluded.cta_url,
  frequency_label_fr = excluded.frequency_label_fr,
  frequency_label_en = excluded.frequency_label_en,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  status = excluded.status,
  published_at = now();

insert into public.social_video_posts (
  slug,
  platform,
  title_fr,
  title_en,
  summary_fr,
  summary_en,
  video_url,
  thumbnail_url,
  cta_label_fr,
  cta_label_en,
  cta_url,
  frequency_label_fr,
  frequency_label_en,
  sort_order,
  is_featured,
  status
)
values (
  'tiktok-ia-pratique-10-usages',
  'tiktok',
  'IA pratique en Côte d''Ivoire : 10 usages concrets',
  'Practical AI in Côte d''Ivoire: 10 practical use cases',
  'Une capsule courte pour montrer comment l''IA peut aider à gagner du temps, mieux s''organiser et produire plus vite, avec renvoi direct vers les ressources TransferAI.',
  'A short TikTok clip showing how AI can help people save time, get organised, and produce faster, with a direct path back to TransferAI resources.',
  'https://www.tiktok.com/@transfer_ai_africa/video/7632859962066226450',
  null,
  'Voir la capsule',
  'Watch the clip',
  'https://www.tiktok.com/@transfer_ai_africa/video/7632859962066226450',
  '5 capsules / semaine',
  '5 clips / week',
  2,
  false,
  'published'
)
on conflict (slug) do update
set
  title_fr = excluded.title_fr,
  title_en = excluded.title_en,
  summary_fr = excluded.summary_fr,
  summary_en = excluded.summary_en,
  video_url = excluded.video_url,
  thumbnail_url = excluded.thumbnail_url,
  cta_label_fr = excluded.cta_label_fr,
  cta_label_en = excluded.cta_label_en,
  cta_url = excluded.cta_url,
  frequency_label_fr = excluded.frequency_label_fr,
  frequency_label_en = excluded.frequency_label_en,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  status = excluded.status,
  published_at = now();
