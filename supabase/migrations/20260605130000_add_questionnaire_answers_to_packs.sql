-- Add questionnaire_answers column to store prospect's form responses
ALTER TABLE public.ai_prospecting_packs
  ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB;
