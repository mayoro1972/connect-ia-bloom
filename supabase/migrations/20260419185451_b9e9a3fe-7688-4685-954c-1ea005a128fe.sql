-- 1. Add scoping fields to contact_requests
ALTER TABLE public.contact_requests
  ADD COLUMN IF NOT EXISTS ai_maturity text,
  ADD COLUMN IF NOT EXISTS use_cases text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS scoping_horizon text,
  ADD COLUMN IF NOT EXISTS engagement_format text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS budget_range text;

-- 2. Update RPC to accept new optional fields (kept backward-compatible by overloading)
CREATE OR REPLACE FUNCTION public.submit_contact_request(
  full_name_input text,
  email_input text,
  phone_input text,
  company_input text,
  sector_input text,
  city_input text,
  participants_input text,
  requested_formations_input text,
  message_input text,
  source_page_input text,
  language_input text,
  request_intent_input text,
  requested_domain_input text,
  privacy_consent_input boolean,
  honeypot_input text,
  ai_maturity_input text DEFAULT NULL,
  use_cases_input text[] DEFAULT NULL,
  scoping_horizon_input text DEFAULT NULL,
  engagement_format_input text[] DEFAULT NULL,
  budget_range_input text DEFAULT NULL
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  INSERT INTO public.contact_requests (
    full_name, email, phone, company, sector, city, participants,
    requested_formations, requested_domain, message, source_page,
    language, request_intent, privacy_consent,
    ai_maturity, use_cases, scoping_horizon, engagement_format, budget_range
  ) VALUES (
    trim(full_name_input), lower(trim(email_input)), phone_input, company_input,
    sector_input, city_input, participants_input, requested_formations_input,
    requested_domain_input, message_input, source_page_input,
    coalesce(language_input, 'fr'), coalesce(request_intent_input, 'contact-devis'),
    privacy_consent_input,
    ai_maturity_input,
    coalesce(use_cases_input, '{}'::text[]),
    scoping_horizon_input,
    coalesce(engagement_format_input, '{}'::text[]),
    budget_range_input
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$function$;