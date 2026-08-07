-- Table dédiée à la démo live "Simulateur de phishing" (page /demo/simulateur-phishing).
-- Journalise chaque déclenchement du workflow n8n Simulateur_Phishing_Sensibilisation_V1.
-- Le simulateur n'est déclenchable que sur l'adresse email saisie par le visiteur lui-même
-- (jamais une liste de tiers) : aucune donnée de destinataire externe n'est collectée ici,
-- même logique de sécurité que courrier_pii_demo_submissions.

CREATE TABLE IF NOT EXISTS public.phishing_sim_demo_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  visitor_name text,
  template text,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  n8n_response text,
  source_page text NOT NULL DEFAULT 'demo_simulateur_phishing'
);

CREATE INDEX IF NOT EXISTS idx_phishing_sim_demo_submissions_status
  ON public.phishing_sim_demo_submissions (status);

CREATE INDEX IF NOT EXISTS idx_phishing_sim_demo_submissions_created_at
  ON public.phishing_sim_demo_submissions (created_at DESC);

ALTER TABLE public.phishing_sim_demo_submissions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'phishing_sim_demo_submissions'
      AND policyname = 'Service role full access on phishing_sim_demo_submissions'
  ) THEN
    CREATE POLICY "Service role full access on phishing_sim_demo_submissions"
      ON public.phishing_sim_demo_submissions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;
