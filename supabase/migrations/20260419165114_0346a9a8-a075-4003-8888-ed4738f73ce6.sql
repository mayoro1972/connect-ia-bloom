-- Enable extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Monthly domain trends table
CREATE TABLE public.monthly_domain_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trend_month DATE NOT NULL, -- first day of the month (e.g. 2026-10-01)
  rank SMALLINT NOT NULL CHECK (rank BETWEEN 1 AND 10),
  domain_key TEXT NOT NULL,
  badge_label_fr TEXT NOT NULL DEFAULT 'Très demandé',
  badge_label_en TEXT NOT NULL DEFAULT 'High demand',
  target_sectors_fr TEXT[] NOT NULL DEFAULT '{}',
  target_sectors_en TEXT[] NOT NULL DEFAULT '{}',
  justification_fr TEXT,
  justification_en TEXT,
  webinar_url TEXT,
  ai_provider TEXT,
  ai_model TEXT,
  source_signals JSONB,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trend_month, rank),
  UNIQUE (trend_month, domain_key)
);

CREATE INDEX idx_monthly_domain_trends_month ON public.monthly_domain_trends (trend_month DESC, rank ASC);

ALTER TABLE public.monthly_domain_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published monthly domain trends"
  ON public.monthly_domain_trends
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Service role full access on monthly_domain_trends"
  ON public.monthly_domain_trends
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Reuse existing updated_at trigger pattern
CREATE OR REPLACE FUNCTION public.touch_monthly_domain_trends_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_monthly_domain_trends_updated_at
BEFORE UPDATE ON public.monthly_domain_trends
FOR EACH ROW
EXECUTE FUNCTION public.touch_monthly_domain_trends_updated_at();