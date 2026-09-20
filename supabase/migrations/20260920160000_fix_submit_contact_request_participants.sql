-- Fige le correctif appliqué à chaud en production le 20/09/2026.
--
-- Contexte : la signature à 20 arguments de submit_contact_request (celle appelée
-- par /contact) déclarait participants_input en text et l'insérait sans conversion
-- dans contact_requests.participants, de type integer. Résultat : HTTP 400 (42804)
-- sur chaque envoi, et AUCUNE demande de contact enregistrée du 30/05/2026 au
-- 20/09/2026 — 113 jours, de l'ordre de 200 à 300 demandes perdues, pendant que
-- le site affichait une confirmation aux visiteurs.
--
-- Origine : la migration 20260419150436 redéclare participants en text dans un
-- CREATE TABLE IF NOT EXISTS resté sans effet, la table existant déjà en INTEGER
-- depuis 20260404223000. Le code et la base ont divergé à partir de là.
--
-- Pourquoi cette migration existe : le correctif avait été appliqué directement
-- dans l'éditeur SQL. Sans lui donner sa place ici, un `supabase db push` depuis
-- l'une des copies locales recréerait la version cassée et remettrait le
-- formulaire en panne.
--
-- Le champ « Nombre de participants » est une saisie libre : un visiteur peut
-- écrire « 10 » comme « une dizaine ». La conversion est donc conditionnelle —
-- ce qui n'est pas un nombre devient NULL, et la demande passe quand même.
-- Une conversion sèche ferait perdre la demande, ce qu'on ne veut plus jamais.

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
  ai_maturity_input text DEFAULT NULL::text,
  use_cases_input text[] DEFAULT NULL::text[],
  scoping_horizon_input text DEFAULT NULL::text,
  engagement_format_input text[] DEFAULT NULL::text[],
  budget_range_input text DEFAULT NULL::text
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
    sector_input, city_input,
    CASE WHEN btrim(coalesce(participants_input, '')) ~ '^[0-9]+$'
         THEN btrim(participants_input)::integer
         ELSE NULL END,
    requested_formations_input,
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
