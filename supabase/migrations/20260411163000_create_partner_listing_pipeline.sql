create table if not exists public.partner_offer_catalog (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  offer_key text not null unique,
  offer_family text not null,
  offer_name_fr text not null,
  offer_name_en text not null,
  duration_months integer not null,
  price_fcfa integer not null,
  visibility_level text not null default 'standard',
  summary_fr text,
  summary_en text,
  deliverables_fr jsonb not null default '[]'::jsonb,
  deliverables_en jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  constraint partner_offer_catalog_offer_family_check check (offer_family in ('referencement', 'visibilite', 'premium')),
  constraint partner_offer_catalog_duration_check check (duration_months in (3, 6, 12))
);

create index if not exists partner_offer_catalog_active_idx
  on public.partner_offer_catalog (is_active, sort_order asc, price_fcfa asc);

drop trigger if exists touch_partner_offer_catalog_updated_at on public.partner_offer_catalog;
create trigger touch_partner_offer_catalog_updated_at
before update on public.partner_offer_catalog
for each row
execute function public.touch_updated_at();

create table if not exists public.partner_email_templates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  template_key text not null,
  language text not null default 'fr',
  subject_template text not null,
  body_template text not null,
  is_active boolean not null default true,
  meta jsonb,
  constraint partner_email_templates_language_check check (language in ('fr', 'en')),
  constraint partner_email_templates_key_language_unique unique (template_key, language)
);

drop trigger if exists touch_partner_email_templates_updated_at on public.partner_email_templates;
create trigger touch_partner_email_templates_updated_at
before update on public.partner_email_templates
for each row
execute function public.touch_updated_at();

create table if not exists public.partner_listing_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contact_request_id uuid references public.contact_requests(id) on delete cascade,
  prospect_name text not null,
  prospect_email text not null,
  company text not null,
  website text,
  role text,
  city text,
  sector_activity text,
  requested_visibility_type text,
  requested_timeline text,
  request_message text,
  review_status text not null default 'received',
  ai_score integer,
  ai_recommendation text,
  ai_provider text,
  ai_reasoning jsonb,
  recommended_offer_key text references public.partner_offer_catalog(offer_key) on delete set null,
  recommended_duration_months integer,
  recommended_price_fcfa integer,
  recommended_deliverables jsonb,
  response_due_at timestamptz,
  response_sent_at timestamptz,
  response_email_subject text,
  response_email_body_fr text,
  response_email_body_en text,
  assigned_to text,
  admin_notes text,
  meta jsonb,
  constraint partner_listing_reviews_status_check check (review_status in ('received', 'needs_info', 'scored', 'review', 'approved', 'scheduled', 'sent', 'rejected', 'archived')),
  constraint partner_listing_reviews_ai_score_check check (ai_score is null or (ai_score >= 0 and ai_score <= 100))
);

create index if not exists partner_listing_reviews_status_idx
  on public.partner_listing_reviews (review_status, created_at desc);

create index if not exists partner_listing_reviews_due_idx
  on public.partner_listing_reviews (response_due_at asc nulls last, review_status);

create index if not exists partner_listing_reviews_email_idx
  on public.partner_listing_reviews (prospect_email, created_at desc);

drop trigger if exists touch_partner_listing_reviews_updated_at on public.partner_listing_reviews;
create trigger touch_partner_listing_reviews_updated_at
before update on public.partner_listing_reviews
for each row
execute function public.touch_updated_at();

create table if not exists public.partner_followup_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  partner_listing_review_id uuid not null references public.partner_listing_reviews(id) on delete cascade,
  job_type text not null default 'partner_followup',
  job_status text not null default 'queued',
  provider text not null default 'resend',
  scheduled_for timestamptz not null default now(),
  attempt_count integer not null default 0,
  sent_at timestamptz,
  provider_message_id text,
  last_error text,
  payload jsonb,
  constraint partner_followup_jobs_type_check check (job_type in ('partner_followup')),
  constraint partner_followup_jobs_status_check check (job_status in ('queued', 'running', 'sent', 'failed', 'cancelled'))
);

create index if not exists partner_followup_jobs_status_idx
  on public.partner_followup_jobs (job_status, scheduled_for asc, created_at desc);

drop trigger if exists touch_partner_followup_jobs_updated_at on public.partner_followup_jobs;
create trigger touch_partner_followup_jobs_updated_at
before update on public.partner_followup_jobs
for each row
execute function public.touch_updated_at();

alter table public.partner_offer_catalog enable row level security;
alter table public.partner_email_templates enable row level security;
alter table public.partner_listing_reviews enable row level security;
alter table public.partner_followup_jobs enable row level security;

revoke all on table public.partner_offer_catalog from anon, authenticated;
revoke all on table public.partner_email_templates from anon, authenticated;
revoke all on table public.partner_listing_reviews from anon, authenticated;
revoke all on table public.partner_followup_jobs from anon, authenticated;

insert into public.partner_offer_catalog (
  offer_key,
  offer_family,
  offer_name_fr,
  offer_name_en,
  duration_months,
  price_fcfa,
  visibility_level,
  summary_fr,
  summary_en,
  deliverables_fr,
  deliverables_en,
  sort_order
)
values
  (
    'referencement_3m',
    'referencement',
    'Référencement',
    'Listing',
    3,
    150000,
    'standard',
    'Présence simple, crédible et immédiatement publiable.',
    'Simple, credible presence ready to publish.',
    '["Logo","Texte court de présentation","Lien principal"]'::jsonb,
    '["Logo","Short profile text","Primary link"]'::jsonb,
    10
  ),
  (
    'referencement_6m',
    'referencement',
    'Référencement',
    'Listing',
    6,
    250000,
    'standard',
    'Présence simple avec durée plus longue pour installer la visibilité.',
    'Simple presence with longer duration to build visibility.',
    '["Logo","Texte court de présentation","Lien principal"]'::jsonb,
    '["Logo","Short profile text","Primary link"]'::jsonb,
    11
  ),
  (
    'referencement_12m',
    'referencement',
    'Référencement',
    'Listing',
    12,
    420000,
    'standard',
    'Présence annuelle standard pour ancrer durablement votre organisation.',
    'Annual standard presence for long-term visibility.',
    '["Logo","Texte court de présentation","Lien principal"]'::jsonb,
    '["Logo","Short profile text","Primary link"]'::jsonb,
    12
  ),
  (
    'visibilite_3m',
    'visibilite',
    'Visibilité',
    'Enhanced visibility',
    3,
    300000,
    'enhanced',
    'Présence renforcée avec fiche enrichie et meilleure exposition.',
    'Enhanced presence with richer profile and stronger placement.',
    '["Logo","Fiche enrichie","Angle sectoriel","Meilleure visibilité"]'::jsonb,
    '["Logo","Enhanced profile","Sector angle","Improved visibility"]'::jsonb,
    20
  ),
  (
    'visibilite_6m',
    'visibilite',
    'Visibilité',
    'Enhanced visibility',
    6,
    540000,
    'enhanced',
    'Présence renforcée sur une durée intermédiaire pour accélérer la reconnaissance.',
    'Enhanced presence for medium-term visibility growth.',
    '["Logo","Fiche enrichie","Angle sectoriel","Meilleure visibilité"]'::jsonb,
    '["Logo","Enhanced profile","Sector angle","Improved visibility"]'::jsonb,
    21
  ),
  (
    'visibilite_12m',
    'visibilite',
    'Visibilité',
    'Enhanced visibility',
    12,
    900000,
    'enhanced',
    'Présence renforcée annuelle pour structurer une relation visible et crédible.',
    'Annual enhanced presence for durable, credible visibility.',
    '["Logo","Fiche enrichie","Angle sectoriel","Meilleure visibilité"]'::jsonb,
    '["Logo","Enhanced profile","Sector angle","Improved visibility"]'::jsonb,
    22
  ),
  (
    'premium_3m',
    'premium',
    'Premium',
    'Premium',
    3,
    600000,
    'premium',
    'Mise en avant forte avec dispositif éditorial plus visible.',
    'Strong visibility with a more editorial package.',
    '["Bannière","Fiche enrichie","Mise en avant","Relai éditorial"]'::jsonb,
    '["Banner","Enhanced profile","Highlighted placement","Editorial relay"]'::jsonb,
    30
  ),
  (
    'premium_6m',
    'premium',
    'Premium',
    'Premium',
    6,
    1050000,
    'premium',
    'Mise en avant premium pour une présence plus marquante dans l’écosystème TransferAI.',
    'Premium package for a stronger presence inside the TransferAI ecosystem.',
    '["Bannière","Fiche enrichie","Mise en avant","Relai éditorial"]'::jsonb,
    '["Banner","Enhanced profile","Highlighted placement","Editorial relay"]'::jsonb,
    31
  ),
  (
    'premium_12m',
    'premium',
    'Premium',
    'Premium',
    12,
    1800000,
    'premium',
    'Présence premium annuelle avec exposition forte et continuité éditoriale.',
    'Annual premium visibility with strong exposure and editorial continuity.',
    '["Bannière","Fiche enrichie","Mise en avant","Relai éditorial"]'::jsonb,
    '["Banner","Enhanced profile","Highlighted placement","Editorial relay"]'::jsonb,
    32
  )
on conflict (offer_key) do update set
  offer_family = excluded.offer_family,
  offer_name_fr = excluded.offer_name_fr,
  offer_name_en = excluded.offer_name_en,
  duration_months = excluded.duration_months,
  price_fcfa = excluded.price_fcfa,
  visibility_level = excluded.visibility_level,
  summary_fr = excluded.summary_fr,
  summary_en = excluded.summary_en,
  deliverables_fr = excluded.deliverables_fr,
  deliverables_en = excluded.deliverables_en,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.partner_email_templates (
  template_key,
  language,
  subject_template,
  body_template,
  is_active
)
values
  (
    'partner_needs_info',
    'fr',
    'Suite à votre demande de référencement sur TransferAI Africa',
    'Bonjour {{prospect_name}},\n\nMerci pour votre demande et pour l’intérêt porté à TransferAI Africa.\n\nAprès une première lecture de votre dossier, nous aurions besoin de quelques éléments complémentaires afin d’évaluer la forme de présence la plus pertinente pour votre organisation.\n\nMerci de nous transmettre si possible :\n- votre logo\n- une courte présentation de votre activité\n- votre site web ou vos liens principaux\n- l’objectif de visibilité recherché\n- les éléments que vous souhaitez voir publiés\n\nDès réception, notre équipe pourra finaliser l’étude de votre demande et revenir vers vous avec une proposition adaptée.\n\nBien cordialement,\nL’équipe TransferAI Africa',
    true
  ),
  (
    'partner_needs_info',
    'en',
    'Follow-up on your listing request on TransferAI Africa',
    'Hello {{prospect_name}},\n\nThank you for your request and for your interest in TransferAI Africa.\n\nAfter a first review of your file, we would need a few additional elements to assess the most relevant visibility format for your organization.\n\nPlease share if possible:\n- your logo\n- a short presentation of your activity\n- your website or key links\n- your visibility objective\n- the elements you would like us to publish\n\nOnce received, our team will finalize the review and come back to you with a tailored proposal.\n\nBest regards,\nTransferAI Africa team',
    true
  ),
  (
    'partner_offer_recommendation',
    'fr',
    'Suite à votre demande de référencement sur TransferAI Africa',
    'Bonjour {{prospect_name}},\n\nMerci pour votre patience et pour l’intérêt porté à TransferAI Africa.\n\nAprès étude de votre dossier, nous confirmons que votre organisation présente un bon alignement avec notre audience et notre ligne éditoriale, notamment sur les sujets liés à {{sector_activity}}.\n\nAu regard de votre profil, nous vous recommandons la formule suivante :\n\n{{offer_name_fr}}\n{{recommended_price_fcfa}} FCFA pour {{recommended_duration_months}} mois\n\nCette formule comprend :\n{{deliverables_bullets}}\n\nSi cette orientation vous convient, nous pouvons vous transmettre la proposition finale ainsi que la liste des éléments à fournir pour validation éditoriale puis publication.\n\nBien cordialement,\nL’équipe TransferAI Africa',
    true
  ),
  (
    'partner_offer_recommendation',
    'en',
    'Follow-up on your visibility request on TransferAI Africa',
    'Hello {{prospect_name}},\n\nThank you for your patience and for your interest in TransferAI Africa.\n\nAfter reviewing your file, we confirm that your organization shows a strong fit with our audience and editorial direction, especially around {{sector_activity}}.\n\nBased on your profile, we recommend the following offer:\n\n{{offer_name_en}}\n{{recommended_price_fcfa}} FCFA for {{recommended_duration_months}} months\n\nThis offer includes:\n{{deliverables_bullets}}\n\nIf this direction works for you, we can share the final proposal and the list of elements required for editorial validation and publication.\n\nBest regards,\nTransferAI Africa team',
    true
  )
on conflict (template_key, language) do update set
  subject_template = excluded.subject_template,
  body_template = excluded.body_template,
  is_active = excluded.is_active,
  updated_at = now();

create or replace function public.submit_partner_listing_request(
  full_name_input text,
  email_input text,
  phone_input text,
  company_input text,
  website_input text default null,
  role_input text default null,
  city_input text default null,
  sector_activity_input text default null,
  requested_visibility_type_input text default null,
  timeline_input text default null,
  message_input text default null,
  source_page_input text default '/contact',
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
  contact_id uuid;
  review_id uuid;
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
    nullif(btrim(role_input), ''),
    nullif(btrim(city_input), ''),
    null,
    nullif(btrim(sector_activity_input), ''),
    nullif(btrim(message_input), ''),
    coalesce(nullif(btrim(source_page_input), ''), '/contact'),
    coalesce(nullif(btrim(language_input), ''), 'fr'),
    'demande-referencement',
    nullif(btrim(sector_activity_input), ''),
    true
  )
  returning id into contact_id;

  insert into public.partner_listing_reviews (
    contact_request_id,
    prospect_name,
    prospect_email,
    company,
    website,
    role,
    city,
    sector_activity,
    requested_visibility_type,
    requested_timeline,
    request_message,
    review_status,
    response_due_at
  )
  values (
    contact_id,
    btrim(full_name_input),
    lower(btrim(email_input)),
    btrim(company_input),
    nullif(btrim(website_input), ''),
    nullif(btrim(role_input), ''),
    nullif(btrim(city_input), ''),
    nullif(btrim(sector_activity_input), ''),
    nullif(btrim(requested_visibility_type_input), ''),
    nullif(btrim(timeline_input), ''),
    nullif(btrim(message_input), ''),
    'received',
    now() + interval '7 days'
  )
  returning id into review_id;

  return review_id;
end;
$$;

grant execute on function public.submit_partner_listing_request(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text
) to anon, authenticated;
