alter table public.contact_requests
  add column if not exists request_intent text not null default 'contact-devis',
  add column if not exists requested_domain text,
  add column if not exists privacy_consent boolean not null default false;

alter table public.registration_requests
  add column if not exists privacy_consent boolean not null default false;

revoke all on table public.contact_requests from anon, authenticated;
revoke all on table public.registration_requests from anon, authenticated;
revoke all on table public.page_views from anon, authenticated;

drop policy if exists "Anyone can insert contact requests" on public.contact_requests;
drop policy if exists "Anyone can insert registration requests" on public.registration_requests;
drop policy if exists "Anyone can insert page views" on public.page_views;
drop policy if exists "Anyone can read page view counts" on public.page_views;

drop view if exists public.page_view_stats;

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
  honeypot_input text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id uuid;
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

  if company_input is null or length(btrim(company_input)) < 2 then
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
    privacy_consent
  )
  values (
    btrim(full_name_input),
    lower(btrim(email_input)),
    btrim(phone_input),
    btrim(company_input),
    nullif(btrim(sector_input), ''),
    nullif(btrim(city_input), ''),
    participants_input,
    nullif(btrim(requested_formations_input), ''),
    nullif(btrim(message_input), ''),
    coalesce(nullif(btrim(source_page_input), ''), '/contact'),
    coalesce(nullif(btrim(language_input), ''), 'fr'),
    coalesce(nullif(btrim(request_intent_input), ''), 'contact-devis'),
    nullif(btrim(requested_domain_input), ''),
    true
  )
  returning id into inserted_id;

  return inserted_id;
end;
$$;

create or replace function public.submit_registration_request(
  first_name_input text,
  last_name_input text,
  email_input text,
  phone_input text,
  company_input text,
  position_input text default null,
  formation_id_input text default null,
  formation_title_input text default null,
  participants_input integer default 1,
  message_input text default null,
  source_page_input text default '/inscription',
  language_input text default 'fr',
  privacy_consent_input boolean default false,
  honeypot_input text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id uuid;
begin
  if honeypot_input is not null and btrim(honeypot_input) <> '' then
    raise exception 'spam_detected';
  end if;

  if privacy_consent_input is distinct from true then
    raise exception 'privacy_consent_required';
  end if;

  if first_name_input is null or length(btrim(first_name_input)) < 2 then
    raise exception 'invalid_first_name';
  end if;

  if last_name_input is null or length(btrim(last_name_input)) < 2 then
    raise exception 'invalid_last_name';
  end if;

  if email_input is null or position('@' in email_input) = 0 then
    raise exception 'invalid_email';
  end if;

  if phone_input is null or length(regexp_replace(phone_input, '\D', '', 'g')) < 8 then
    raise exception 'invalid_phone';
  end if;

  if company_input is null or length(btrim(company_input)) < 2 then
    raise exception 'invalid_company';
  end if;

  insert into public.registration_requests (
    first_name,
    last_name,
    email,
    phone,
    company,
    position,
    formation_id,
    formation_title,
    participants,
    message,
    source_page,
    language,
    privacy_consent
  )
  values (
    btrim(first_name_input),
    btrim(last_name_input),
    lower(btrim(email_input)),
    btrim(phone_input),
    btrim(company_input),
    nullif(btrim(position_input), ''),
    nullif(btrim(formation_id_input), ''),
    coalesce(nullif(btrim(formation_title_input), ''), 'Formation'),
    greatest(coalesce(participants_input, 1), 1),
    nullif(btrim(message_input), ''),
    coalesce(nullif(btrim(source_page_input), ''), '/inscription'),
    coalesce(nullif(btrim(language_input), ''), 'fr'),
    true
  )
  returning id into inserted_id;

  return inserted_id;
end;
$$;

create or replace function public.track_page_view(page_path_input text default '/')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if page_path_input is null or length(btrim(page_path_input)) = 0 then
    return;
  end if;

  insert into public.page_views (page_path)
  values (left(btrim(page_path_input), 200));
end;
$$;

create or replace function public.get_public_page_view_stats()
returns table (
  total_views bigint,
  views_today bigint
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)::bigint as total_views,
    count(*) filter (where visited_at > now() - interval '24 hours')::bigint as views_today
  from public.page_views;
$$;

grant execute on function public.submit_contact_request(text, text, text, text, text, text, integer, text, text, text, text, text, text, boolean, text) to anon, authenticated;
grant execute on function public.submit_registration_request(text, text, text, text, text, text, text, text, integer, text, text, text, boolean, text) to anon, authenticated;
grant execute on function public.track_page_view(text) to anon, authenticated;
grant execute on function public.get_public_page_view_stats() to anon, authenticated;
