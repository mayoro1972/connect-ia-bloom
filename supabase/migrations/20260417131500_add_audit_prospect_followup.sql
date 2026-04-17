alter table public.contact_requests
  add column if not exists wants_expert_appointment boolean not null default false,
  add column if not exists profession text,
  add column if not exists country text,
  add column if not exists audit_followup_status text,
  add column if not exists audit_followup_scheduled_at timestamp with time zone,
  add column if not exists audit_followup_sent_at timestamp with time zone,
  add column if not exists audit_followup_error text;

alter table public.contact_requests
  drop constraint if exists contact_requests_audit_followup_status_check;

alter table public.contact_requests
  add constraint contact_requests_audit_followup_status_check
  check (
    audit_followup_status is null
    or audit_followup_status in ('pending', 'sent', 'failed', 'cancelled')
  );

create index if not exists contact_requests_audit_followup_idx
  on public.contact_requests (request_intent, audit_followup_status, audit_followup_scheduled_at);

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
  country_input text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id uuid;
  normalized_intent text := coalesce(nullif(btrim(request_intent_input), ''), 'contact-devis');
  schedule_audit_followup boolean := normalized_intent = 'demande-audit';
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
    audit_followup_error
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
    null
  )
  returning id into inserted_id;

  return inserted_id;
end;
$$;
