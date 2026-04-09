alter table public.resource_posts
  add column if not exists content_fr text,
  add column if not exists content_en text,
  add column if not exists sources_json jsonb,
  add column if not exists seo_title_fr text,
  add column if not exists seo_title_en text,
  add column if not exists seo_description_fr text,
  add column if not exists seo_description_en text,
  add column if not exists cover_image_url text;

