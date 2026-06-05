-- Allow anonymous / public read access to ai_prospecting_packs by pack_id
-- so the /questionnaire-audit frontend page can load the pack without authentication.
-- Write operations (INSERT, UPDATE) remain restricted to service_role only.

ALTER TABLE IF EXISTS public.ai_prospecting_packs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read by pack_id" ON public.ai_prospecting_packs;

CREATE POLICY "Public read by pack_id"
  ON public.ai_prospecting_packs
  FOR SELECT
  USING (true);
