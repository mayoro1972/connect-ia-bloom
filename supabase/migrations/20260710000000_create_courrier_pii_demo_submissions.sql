-- Table dédiée à la démo live "Courrier confidentiel généré par IA" (page
-- /demo/courrier-automatique-pii). Journalise chaque déclenchement du vrai workflow n8n
-- Courrier_Automatique_v2_PII (anonymisation PII Guard -> GPT-4o -> validation manager par
-- email -> dé-anonymisation -> envoi final). Le scénario envoyé (Diplomatie) est fixe côté
-- serveur pour éviter toute injection de contenu arbitraire par un visiteur public ; seul le
-- déclenchement est journalisé ici, pas la décision finale (qui se joue par email, comme pour
-- pre_cloture_bancaire_demo_submissions).

CREATE TABLE IF NOT EXISTS public.courrier_pii_demo_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  visitor_name text,
  courrier_id text,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  n8n_response text,
  source_page text NOT NULL DEFAULT 'demo_courrier_automatique_pii'
);

CREATE INDEX IF NOT EXISTS idx_courrier_pii_demo_submissions_status
  ON public.courrier_pii_demo_submissions (status);

CREATE INDEX IF NOT EXISTS idx_courrier_pii_demo_submissions_created_at
  ON public.courrier_pii_demo_submissions (created_at DESC);

ALTER TABLE public.courrier_pii_demo_submissions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'courrier_pii_demo_submissions'
      AND policyname = 'Service role full access on courrier_pii_demo_submissions'
  ) THEN
    CREATE POLICY "Service role full access on courrier_pii_demo_submissions"
      ON public.courrier_pii_demo_submissions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;
