-- Table dédiée à la démo live "Pré-Clôture Bancaire avec Validation Humaine"
-- (page /demo/pre-cloture-bancaire). Sert de journal des revues soumises pendant une démo +
-- du workflow n8n déclenché (webhook asynchrone -> anonymisation -> synthèse IA ->
-- dé-anonymisation -> email de validation humaine). Le webhook n8n répond immédiatement
-- ("Workflow was started") sans attendre l'issue de la validation humaine : cette table ne
-- journalise donc que la soumission initiale, pas la décision finale (qui se joue par email).
-- Volontairement séparée des autres pipelines (voir memory project-transferai-workflows) car
-- c'est un outil de démo commerciale, pas un vrai canal de clôture comptable en production.

CREATE TABLE IF NOT EXISTS public.pre_cloture_bancaire_demo_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  entity text NOT NULL,
  report_period text NOT NULL,
  currency text NOT NULL DEFAULT 'FCFA',
  manager_email text NOT NULL,
  recipients jsonb NOT NULL DEFAULT '[]'::jsonb,
  absolute_variation_threshold numeric,
  relative_variation_threshold numeric,
  rows_count integer NOT NULL DEFAULT 0,
  rows_payload jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  n8n_response text,
  source_page text NOT NULL DEFAULT 'demo_pre_cloture_bancaire'
);

CREATE INDEX IF NOT EXISTS idx_pre_cloture_bancaire_demo_submissions_status
  ON public.pre_cloture_bancaire_demo_submissions (status);

CREATE INDEX IF NOT EXISTS idx_pre_cloture_bancaire_demo_submissions_created_at
  ON public.pre_cloture_bancaire_demo_submissions (created_at DESC);

ALTER TABLE public.pre_cloture_bancaire_demo_submissions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'pre_cloture_bancaire_demo_submissions'
      AND policyname = 'Service role full access on pre_cloture_bancaire_demo_submissions'
  ) THEN
    CREATE POLICY "Service role full access on pre_cloture_bancaire_demo_submissions"
      ON public.pre_cloture_bancaire_demo_submissions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;
