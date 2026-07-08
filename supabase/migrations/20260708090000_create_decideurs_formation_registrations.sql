-- Table dédiée à l'offre "IA pour Décideurs" (1 jour, 29 juillet / 10 août 2026)
-- Volontairement séparée de prospect_targets (pipeline corps de métier) et de
-- webinar_registrations (webinaire gratuit) pour ne pas fragiliser ces deux
-- pipelines déjà en production — voir memory project-transferai-formation-campaign.

CREATE TABLE IF NOT EXISTS public.decideurs_formation_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  function_title text,
  organization text,
  sector text,
  sector_other text,
  session_date date NOT NULL,
  session_label text,
  source_page text NOT NULL DEFAULT 'google_form_decideurs_2026',
  status text NOT NULL DEFAULT 'received',
  admin_notes text,
  reminder_j2_sent_at timestamptz,
  reminder_j1_sent_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_decideurs_formation_registrations_session_date
  ON public.decideurs_formation_registrations (session_date);

CREATE INDEX IF NOT EXISTS idx_decideurs_formation_registrations_status
  ON public.decideurs_formation_registrations (status);

ALTER TABLE public.decideurs_formation_registrations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'decideurs_formation_registrations'
      AND policyname = 'Service role full access on decideurs_formation_registrations'
  ) THEN
    CREATE POLICY "Service role full access on decideurs_formation_registrations"
      ON public.decideurs_formation_registrations
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_decideurs_formation_registrations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_decideurs_formation_registrations_updated_at ON public.decideurs_formation_registrations;

CREATE TRIGGER touch_decideurs_formation_registrations_updated_at
  BEFORE UPDATE ON public.decideurs_formation_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_decideurs_formation_registrations_updated_at();
