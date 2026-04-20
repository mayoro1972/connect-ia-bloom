-- 1) Add external_id + dedup index on content_signals
ALTER TABLE public.content_signals
  ADD COLUMN IF NOT EXISTS external_id text;

CREATE UNIQUE INDEX IF NOT EXISTS content_signals_feed_url_unique
  ON public.content_signals (feed_id, signal_url)
  WHERE signal_url IS NOT NULL;

-- 2) Seed the three vendor feeds (idempotent via URL match)
INSERT INTO public.content_feeds (name, url, feed_type, language, publisher, domain_focus, region_focus, country_focus, trust_score, is_active, notes)
SELECT 'OpenAI News', 'https://openai.com/news/rss.xml', 'rss', 'en', 'OpenAI', 'IT & Transformation Digitale', 'Global', NULL, 95, true, 'Annonces officielles OpenAI (ChatGPT, GPT, API).'
WHERE NOT EXISTS (SELECT 1 FROM public.content_feeds WHERE url = 'https://openai.com/news/rss.xml');

INSERT INTO public.content_feeds (name, url, feed_type, language, publisher, domain_focus, region_focus, country_focus, trust_score, is_active, notes)
SELECT 'Anthropic News', 'https://www.anthropic.com/news/rss.xml', 'rss', 'en', 'Anthropic', 'IT & Transformation Digitale', 'Global', NULL, 95, true, 'Annonces officielles Anthropic (Claude).'
WHERE NOT EXISTS (SELECT 1 FROM public.content_feeds WHERE url = 'https://www.anthropic.com/news/rss.xml');

INSERT INTO public.content_feeds (name, url, feed_type, language, publisher, domain_focus, region_focus, country_focus, trust_score, is_active, notes)
SELECT 'Google AI / Research Blog', 'https://research.google/blog/rss/', 'rss', 'en', 'Google', 'IT & Transformation Digitale', 'Global', NULL, 92, true, 'Annonces Google Research / Gemini / DeepMind.'
WHERE NOT EXISTS (SELECT 1 FROM public.content_feeds WHERE url = 'https://research.google/blog/rss/');