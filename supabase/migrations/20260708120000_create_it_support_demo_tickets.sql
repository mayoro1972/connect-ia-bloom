-- Table dédiée à la démo live "Support IT Intelligent" (page /demo/support-it-intelligent).
-- Sert de journal des tickets soumis pendant une démo + du workflow n8n déclenché en temps réel
-- (webhook synchrone -> classification IA -> réponse auto ou escalade). Volontairement séparée
-- des autres pipelines (voir memory project-transferai-workflows) car c'est un outil de démo
-- commerciale, pas un vrai canal support production.

CREATE TABLE IF NOT EXISTS public.it_support_demo_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  urgency text NOT NULL DEFAULT 'medium',
  channel text NOT NULL DEFAULT 'web',
  status text NOT NULL DEFAULT 'pending',
  ai_category text,
  ai_confidence numeric,
  ai_response text,
  escalated_to text,
  sla_target_minutes integer,
  n8n_execution_ms integer,
  error_message text,
  source_page text NOT NULL DEFAULT 'demo_support_it'
);

CREATE INDEX IF NOT EXISTS idx_it_support_demo_tickets_status
  ON public.it_support_demo_tickets (status);

CREATE INDEX IF NOT EXISTS idx_it_support_demo_tickets_created_at
  ON public.it_support_demo_tickets (created_at DESC);

ALTER TABLE public.it_support_demo_tickets ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'it_support_demo_tickets'
      AND policyname = 'Service role full access on it_support_demo_tickets'
  ) THEN
    CREATE POLICY "Service role full access on it_support_demo_tickets"
      ON public.it_support_demo_tickets
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_it_support_demo_tickets_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_it_support_demo_tickets_updated_at ON public.it_support_demo_tickets;

CREATE TRIGGER touch_it_support_demo_tickets_updated_at
  BEFORE UPDATE ON public.it_support_demo_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_it_support_demo_tickets_updated_at();
