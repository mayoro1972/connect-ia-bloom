create or replace function public.submit_contact_request(
  full_name_input text,
  email_input text,
  phone_input text,
  company_input text,
  sector_input text default null,
  city_input text default null,
  participants_input integer default null,
  requested_formations_input text default null,
  message_input text default null,
  source_page_input text default '/contact',
  language_input text default 'fr',
  request_intent_input text default 'contact-devis',
  requested_domain_input text default null,
  privacy_consent_input boolean default false,
  honeypot_input text default null,
  wants_expert_appointment_input boolean default false,
  profession_input text default null,
  country_input text default null,
  prospect_username_input text default null,
  prospect_password_hash_input text default null,
  prospect_type_input text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id uuid;
  existing_request_id uuid;
  normalized_intent text := coalesce(nullif(btrim(request_intent_input), ''), 'contact-devis');
  schedule_audit_followup boolean := normalized_intent = 'demande-audit';
  normalized_username text := lower(nullif(btrim(prospect_username_input), ''));
  normalized_password_hash text := nullif(btrim(prospect_password_hash_input), '');
begin
  if honeypot_input is not null and btrim(honeypot_input) <> '' then
    raise exception 'spam_detected';
  end if;

  if privacy_consent_input is distinct from true then
    raise exception 'privacy_consent_required';
  end if;

  if full_name_input is null or length(btrim(full_name_input)) < 2 then
    raise exception 'invalid_full_name';
  end if;

  if email_input is null or position('@' in email_input) = 0 then
    raise exception 'invalid_email';
  end if;

  if phone_input is null or length(regexp_replace(phone_input, '\D', '', 'g')) < 8 then
    raise exception 'invalid_phone';
  end if;

  if normalized_intent <> 'demande-audit' and (company_input is null or length(btrim(company_input)) < 2) then
    raise exception 'invalid_company';
  end if;

  if schedule_audit_followup then
    if normalized_username is null or length(normalized_username) < 4 then
      raise exception 'invalid_prospect_username';
    end if;

    if normalized_password_hash is null or length(normalized_password_hash) < 32 then
      raise exception 'invalid_prospect_password';
    end if;

    select id
      into existing_request_id
    from public.contact_requests
    where request_intent = 'demande-audit'
      and lower(prospect_username) = normalized_username
    order by created_at desc
    limit 1;
  end if;

  if existing_request_id is not null then
    update public.contact_requests
    set
      full_name = btrim(full_name_input),
      email = lower(btrim(email_input)),
      phone = btrim(phone_input),
      company = coalesce(nullif(btrim(company_input), ''), nullif(btrim(profession_input), ''), btrim(full_name_input)),
      sector = nullif(btrim(sector_input), ''),
      city = nullif(btrim(city_input), ''),
      participants = participants_input,
      requested_formations = nullif(btrim(requested_formations_input), ''),
      message = nullif(btrim(message_input), ''),
      source_page = coalesce(nullif(btrim(source_page_input), ''), '/contact'),
      language = coalesce(nullif(btrim(language_input), ''), 'fr'),
      request_intent = normalized_intent,
      requested_domain = nullif(btrim(requested_domain_input), ''),
      privacy_consent = true,
      wants_expert_appointment = coalesce(wants_expert_appointment_input, false),
      profession = nullif(btrim(profession_input), ''),
      country = nullif(btrim(country_input), ''),
      audit_followup_status = 'pending',
      audit_followup_scheduled_at = now() + interval '30 minutes',
      audit_followup_sent_at = null,
      audit_followup_error = null,
      prospect_username = normalized_username,
      prospect_password_hash = normalized_password_hash,
      prospect_portal_status = 'active',
      prospect_type = nullif(btrim(prospect_type_input), '')
    where id = existing_request_id
    returning id into inserted_id;

    return inserted_id;
  end if;

  insert into public.contact_requests (
    full_name,
    email,
    phone,
    company,
    sector,
    city,
    participants,
    requested_formations,
    message,
    source_page,
    language,
    request_intent,
    requested_domain,
    privacy_consent,
    wants_expert_appointment,
    profession,
    country,
    audit_followup_status,
    audit_followup_scheduled_at,
    audit_followup_sent_at,
    audit_followup_error,
    prospect_username,
    prospect_password_hash,
    prospect_portal_status,
    prospect_type
  )
  values (
    btrim(full_name_input),
    lower(btrim(email_input)),
    btrim(phone_input),
    coalesce(nullif(btrim(company_input), ''), nullif(btrim(profession_input), ''), btrim(full_name_input)),
    nullif(btrim(sector_input), ''),
    nullif(btrim(city_input), ''),
    participants_input,
    nullif(btrim(requested_formations_input), ''),
    nullif(btrim(message_input), ''),
    coalesce(nullif(btrim(source_page_input), ''), '/contact'),
    coalesce(nullif(btrim(language_input), ''), 'fr'),
    normalized_intent,
    nullif(btrim(requested_domain_input), ''),
    true,
    coalesce(wants_expert_appointment_input, false),
    nullif(btrim(profession_input), ''),
    nullif(btrim(country_input), ''),
    case when schedule_audit_followup then 'pending' else null end,
    case when schedule_audit_followup then now() + interval '30 minutes' else null end,
    null,
    null,
    normalized_username,
    normalized_password_hash,
    case when schedule_audit_followup then 'active' else 'pending' end,
    nullif(btrim(prospect_type_input), '')
  )
  returning id into inserted_id;

  return inserted_id;
end;
$$;

grant execute on function public.submit_contact_request(
  text,
  text,
  text,
  text,
  text,
  text,
  integer,
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text,
  boolean,
  text,
  text,
  text,
  text,
  text
) to anon, authenticated;
