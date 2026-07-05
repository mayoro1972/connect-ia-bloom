ALTER TABLE public.webinar_registrations
  ADD COLUMN IF NOT EXISTS reminder_j2_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_j1_sent_at timestamptz;

COMMENT ON COLUMN public.webinar_registrations.reminder_j2_sent_at IS 'Horodatage envoi email de rappel J-2 (lien, date, heure du webinaire)';
COMMENT ON COLUMN public.webinar_registrations.reminder_j1_sent_at IS 'Horodatage envoi email de rappel J-1 (confirmation + programme PDF joint)';
