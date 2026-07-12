-- Ajoute le scénario métier déclenché sur la démo /demo/courrier-automatique-pii.
-- La démo a été étendue le 12/07/2026 au-delà de la Diplomatie (RH, Finance, Marketing) :
-- chaque scénario reste un payload fixe côté serveur (voir courrier-automatique-pii-demo),
-- ce champ ne fait que journaliser lequel des 4 a été choisi par le visiteur.

ALTER TABLE public.courrier_pii_demo_submissions
  ADD COLUMN IF NOT EXISTS scenario text NOT NULL DEFAULT 'diplomatie';
