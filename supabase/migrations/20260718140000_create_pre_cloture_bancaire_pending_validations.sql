-- Table de relais pour les liens de validation humaine (email) du workflow
-- Demo_Pre_Cloture_Bancaire_Validation_Humaine_V2 (n8n, niveau 1/2).
-- Remplace l'ancien pattern qui encodait tout le payload en base64 dans la query
-- string du webhook (URL > 21 000 caractères -> HTTP 431 Request Header Fields
-- Too Large côté n8n). Désormais le webhook ne porte plus qu'un id court ; le
-- payload complet est stocké ici et relu par le workflow au clic sur le lien.

CREATE TABLE IF NOT EXISTS public.pre_cloture_bancaire_pending_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  level text NOT NULL,
  payload jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pre_cloture_bancaire_pending_validations_created_at
  ON public.pre_cloture_bancaire_pending_validations (created_at DESC);

ALTER TABLE public.pre_cloture_bancaire_pending_validations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'pre_cloture_bancaire_pending_validations'
      AND policyname = 'Service role full access on pre_cloture_bancaire_pending_validations'
  ) THEN
    CREATE POLICY "Service role full access on pre_cloture_bancaire_pending_validations"
      ON public.pre_cloture_bancaire_pending_validations
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;
