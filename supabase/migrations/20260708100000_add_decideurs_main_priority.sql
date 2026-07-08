ALTER TABLE public.decideurs_formation_registrations
  ADD COLUMN IF NOT EXISTS main_priority text;

COMMENT ON COLUMN public.decideurs_formation_registrations.main_priority IS 'Réponse à la question formulaire "Quel est votre principal enjeu IA ?" — pilote la personnalisation de l''accroche email (voir pickEnjeuTeaser dans le workflow n8n Décideurs)';
