ALTER TABLE public.decideurs_formation_registrations
  ADD COLUMN IF NOT EXISTS ai_usage_level text,
  ADD COLUMN IF NOT EXISTS topics_of_interest text;

COMMENT ON COLUMN public.decideurs_formation_registrations.ai_usage_level IS 'Réponse à "Quel est votre niveau d''usage de l''IA dans votre organisation ?" (formulaire Google)';
COMMENT ON COLUMN public.decideurs_formation_registrations.topics_of_interest IS 'Réponse (choix multiples, valeurs séparées par virgule) à "Quels sujets vous intéressent le plus ?" (formulaire Google)';
