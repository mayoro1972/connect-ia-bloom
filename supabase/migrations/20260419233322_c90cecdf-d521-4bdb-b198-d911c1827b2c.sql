-- Table pour les propositions de séminaires/webinaires générés par IA
CREATE TABLE public.live_format_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  format_type text NOT NULL CHECK (format_type IN ('seminar', 'webinar')),
  cycle_start_date date NOT NULL,
  rank smallint NOT NULL,
  
  -- Contenu bilingue
  title_fr text NOT NULL,
  title_en text NOT NULL,
  subtitle_fr text,
  subtitle_en text,
  description_fr text,
  description_en text,
  
  -- Ciblage
  target_sectors_fr text[] NOT NULL DEFAULT '{}',
  target_sectors_en text[] NOT NULL DEFAULT '{}',
  target_audience_fr text,
  target_audience_en text,
  domain_key text,
  
  -- Programme et bénéfices
  agenda_fr jsonb DEFAULT '[]'::jsonb,
  agenda_en jsonb DEFAULT '[]'::jsonb,
  key_benefits_fr text[] DEFAULT '{}',
  key_benefits_en text[] DEFAULT '{}',
  
  -- Logistique
  scheduled_date date,
  duration_minutes integer,
  format_label_fr text,
  format_label_en text,
  speaker_profile_fr text,
  speaker_profile_en text,
  
  -- Tendance source
  trend_signals jsonb DEFAULT '[]'::jsonb,
  trend_score numeric,
  trend_justification_fr text,
  trend_justification_en text,
  
  -- Workflow éditorial
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published', 'archived', 'rejected')),
  approved_at timestamptz,
  approved_by text,
  published_at timestamptz,
  rejection_reason text,
  admin_notes text,
  
  -- Métadonnées génération
  ai_provider text,
  ai_model text,
  generation_meta jsonb,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_live_format_proposals_status ON public.live_format_proposals(status, format_type, cycle_start_date DESC);
CREATE INDEX idx_live_format_proposals_published ON public.live_format_proposals(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_live_format_proposals_cycle ON public.live_format_proposals(cycle_start_date DESC, format_type, rank);

-- RLS
ALTER TABLE public.live_format_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published live format proposals"
ON public.live_format_proposals FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Service role full access on live_format_proposals"
ON public.live_format_proposals FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- Trigger updated_at
CREATE TRIGGER touch_live_format_proposals_updated_at
BEFORE UPDATE ON public.live_format_proposals
FOR EACH ROW
EXECUTE FUNCTION public.touch_monthly_domain_trends_updated_at();

-- Activer pg_cron et pg_net pour le cron bi-mensuel
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;