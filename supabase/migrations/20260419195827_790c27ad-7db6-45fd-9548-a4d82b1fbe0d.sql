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
  profession_input text,
  prospect_type_input text,
  country_input text,
  wants_expert_appointment_input boolean,
  prospect_username_input text,
  prospect_password_hash_input text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_email text;
  v_phone_clean text;
BEGIN
  -- Honeypot
  IF honeypot_input IS NOT NULL AND length(trim(honeypot_input)) > 0 THEN
    RAISE EXCEPTION 'invalid_submission';
  END IF;

  -- Privacy consent required
  IF privacy_consent_input IS NOT TRUE THEN
    RAISE EXCEPTION 'privacy_consent_required';
  END IF;

  -- Email validation
  v_email := lower(trim(email_input));
  IF v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  -- Phone validation (at least 8 digits if provided)
  v_phone_clean := regexp_replace(coalesce(phone_input, ''), '\D', '', 'g');
  IF length(v_phone_clean) > 0 AND length(v_phone_clean) < 8 THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;

  INSERT INTO public.contact_requests (
    full_name,
    email,
    phone,
    company,
    profession,
    prospect_type,
    sector,
    city,
    country,
    participants,
    requested_formations,
    message,
    source_page,
    language,
    request_intent,
    requested_domain,
    privacy_consent,
    wants_expert_appointment,
    prospect_username,
    prospect_password_hash,
    prospect_portal_status
  ) VALUES (
    trim(full_name_input),
    v_email,
    nullif(trim(coalesce(phone_input, '')), ''),
    nullif(trim(coalesce(company_input, '')), ''),
    nullif(trim(coalesce(profession_input, '')), ''),
    nullif(trim(coalesce(prospect_type_input, '')), ''),
    nullif(trim(coalesce(sector_input, '')), ''),
    nullif(trim(coalesce(city_input, '')), ''),
    nullif(trim(coalesce(country_input, '')), ''),
    nullif(trim(coalesce(participants_input, '')), ''),
    nullif(trim(coalesce(requested_formations_input, '')), ''),
    nullif(trim(coalesce(message_input, '')), ''),
    nullif(trim(coalesce(source_page_input, '')), ''),
    coalesce(nullif(trim(coalesce(language_input, '')), ''), 'fr'),
    coalesce(nullif(trim(coalesce(request_intent_input, '')), ''), 'demande-renseignement'),
    nullif(trim(coalesce(requested_domain_input, '')), ''),
    privacy_consent_input,
    coalesce(wants_expert_appointment_input, false),
    nullif(lower(trim(coalesce(prospect_username_input, ''))), ''),
    nullif(trim(coalesce(prospect_password_hash_input, '')), ''),
    CASE WHEN nullif(trim(coalesce(prospect_password_hash_input, '')), '') IS NOT NULL THEN 'pending' ELSE NULL END
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_contact_request(
  text, text, text, text, text, text, text, text, text, text, text, text, text, boolean, text, text, text, text, boolean, text, text
) TO anon, authenticated;