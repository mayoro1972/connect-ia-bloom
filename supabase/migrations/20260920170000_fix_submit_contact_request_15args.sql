-- Corrige la signature à 15 arguments de submit_contact_request (20/09/2026).
--
-- Même défaut que la signature à 20 arguments réparée le même jour : participants_input
-- est déclaré text et inséré sans conversion dans contact_requests.participants, de type
-- integer. Cette signature est celle qu'appelle /preview/formulaires
-- (src/pages/LeadFormsPreview.tsx), qui était donc cassée de la même façon.
--
-- Les deux autres signatures relevées le 20/09 (15 args avec participants_input integer,
-- et 21 args pour /demande-audit-gratuit) ne portent pas ce défaut : elles déclarent
-- participants_input en integer.
--
-- Conversion conditionnelle, comme pour la 20 : le champ est une saisie libre, ce qui
-- n'est pas un nombre devient NULL plutôt que de faire échouer l'envoi.

CREATE OR REPLACE FUNCTION public.submit_contact_request(full_name_input text, email_input text, phone_input text, company_input text, sector_input text, city_input text, participants_input text, requested_formations_input text, message_input text, source_page_input text, language_input text, request_intent_input text, requested_domain_input text, privacy_consent_input boolean, honeypot_input text)
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
    language, request_intent, privacy_consent
  ) VALUES (
    trim(full_name_input), lower(trim(email_input)), phone_input, company_input,
    sector_input, city_input,
    CASE WHEN btrim(coalesce(participants_input, '')) ~ '^[0-9]+$'
         THEN btrim(participants_input)::integer
         ELSE NULL END,
    requested_formations_input,
    requested_domain_input, message_input, source_page_input,
    coalesce(language_input, 'fr'), coalesce(request_intent_input, 'contact-devis'),
    privacy_consent_input
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$function$
;
