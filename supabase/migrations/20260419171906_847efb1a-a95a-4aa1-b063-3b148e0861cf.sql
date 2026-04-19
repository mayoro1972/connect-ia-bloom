CREATE TABLE public.webinar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  city text,
  organization text,
  position text,
  sector text,
  sector_other text,
  domain_key text,
  domain_other text,
  formation_id text,
  formation_title text,
  formation_other text,
  participants integer NOT NULL DEFAULT 1,
  language text NOT NULL DEFAULT 'fr',
  motivation text,
  source_page text,
  privacy_consent boolean NOT NULL DEFAULT false,
  scheduled_date date NOT NULL DEFAULT (current_date + interval '14 days'),
  status text NOT NULL DEFAULT 'received',
  admin_notes text,
  date_confirmed_at timestamptz,
  reminder_sent_at timestamptz
);

CREATE INDEX idx_webinar_registrations_created_at ON public.webinar_registrations (created_at DESC);
CREATE INDEX idx_webinar_registrations_domain ON public.webinar_registrations (domain_key);
CREATE INDEX idx_webinar_registrations_status ON public.webinar_registrations (status);

ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on webinar_registrations"
  ON public.webinar_registrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER touch_webinar_registrations_updated_at
  BEFORE UPDATE ON public.webinar_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_monthly_domain_trends_updated_at();

CREATE OR REPLACE FUNCTION public.submit_webinar_registration(
  full_name_input text,
  email_input text,
  phone_input text,
  country_input text,
  city_input text,
  organization_input text,
  position_input text,
  sector_input text,
  sector_other_input text,
  domain_key_input text,
  domain_other_input text,
  formation_id_input text,
  formation_title_input text,
  formation_other_input text,
  participants_input integer,
  language_input text,
  motivation_input text,
  source_page_input text,
  privacy_consent_input boolean,
  honeypot_input text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF honeypot_input IS NOT NULL AND length(trim(honeypot_input)) > 0 THEN
    RAISE EXCEPTION 'invalid_submission';
  END IF;
  IF privacy_consent_input IS NOT TRUE THEN
    RAISE EXCEPTION 'privacy_consent_required';
  END IF;
  IF full_name_input IS NULL OR length(trim(full_name_input)) = 0
     OR email_input IS NULL OR length(trim(email_input)) = 0 THEN
    RAISE EXCEPTION 'missing_required_fields';
  END IF;

  INSERT INTO public.webinar_registrations (
    full_name, email, phone, country, city, organization, position,
    sector, sector_other, domain_key, domain_other,
    formation_id, formation_title, formation_other,
    participants, language, motivation, source_page, privacy_consent
  ) VALUES (
    trim(full_name_input), lower(trim(email_input)), phone_input,
    country_input, city_input, organization_input, position_input,
    sector_input, sector_other_input, domain_key_input, domain_other_input,
    formation_id_input, formation_title_input, formation_other_input,
    coalesce(participants_input, 1), coalesce(language_input, 'fr'),
    motivation_input, source_page_input, privacy_consent_input
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_webinar_registration(
  text,text,text,text,text,text,text,text,text,text,text,text,text,text,integer,text,text,text,boolean,text
) TO anon, authenticated;