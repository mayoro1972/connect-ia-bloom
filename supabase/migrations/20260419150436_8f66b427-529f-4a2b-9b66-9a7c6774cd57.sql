-- =============================================================
-- Lead capture: contact_requests
-- =============================================================
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  sector text,
  city text,
  country text,
  profession text,
  prospect_type text,
  participants text,
  requested_formations text,
  requested_domain text,
  message text,
  source_page text,
  language text NOT NULL DEFAULT 'fr',
  request_intent text NOT NULL DEFAULT 'contact-devis',
  privacy_consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'received',
  wants_expert_appointment boolean NOT NULL DEFAULT false,
  audit_followup_status text,
  audit_followup_scheduled_at timestamptz,
  audit_followup_sent_at timestamptz,
  audit_followup_error text,
  audit_invite_token text,
  audit_invite_expires_at timestamptz,
  prospect_username text,
  prospect_password_hash text,
  prospect_portal_status text,
  last_portal_login_at timestamptz
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Only the SECURITY DEFINER RPC can insert; backend (service role) reads/updates.
CREATE POLICY "Service role full access on contact_requests"
ON public.contact_requests FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- =============================================================
-- Lead capture: registration_requests
-- =============================================================
CREATE TABLE IF NOT EXISTS public.registration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  position text,
  formation_id text NOT NULL,
  formation_title text NOT NULL,
  participants integer NOT NULL DEFAULT 1,
  message text,
  source_page text,
  language text NOT NULL DEFAULT 'fr',
  privacy_consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'received'
);

ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on registration_requests"
ON public.registration_requests FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- =============================================================
-- Email delivery log
-- =============================================================
CREATE TABLE IF NOT EXISTS public.prospect_email_delivery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  request_id uuid,
  intent text,
  recipient_email text,
  recipient_type text,
  subject text,
  status text,
  provider_message_id text,
  error_message text,
  language text,
  sent_at timestamptz,
  meta jsonb
);

ALTER TABLE public.prospect_email_delivery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on prospect_email_delivery_logs"
ON public.prospect_email_delivery_logs FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- =============================================================
-- RPC: submit_contact_request (callable by anon)
-- =============================================================
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
  honeypot_input text
)
RETURNS uuid
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

  INSERT INTO public.contact_requests (
    full_name, email, phone, company, sector, city, participants,
    requested_formations, requested_domain, message, source_page,
    language, request_intent, privacy_consent
  ) VALUES (
    trim(full_name_input), lower(trim(email_input)), phone_input, company_input,
    sector_input, city_input, participants_input, requested_formations_input,
    requested_domain_input, message_input, source_page_input,
    coalesce(language_input, 'fr'), coalesce(request_intent_input, 'contact-devis'),
    privacy_consent_input
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_contact_request(
  text,text,text,text,text,text,text,text,text,text,text,text,text,boolean,text
) TO anon, authenticated;

-- =============================================================
-- RPC: submit_registration_request
-- =============================================================
CREATE OR REPLACE FUNCTION public.submit_registration_request(
  first_name_input text,
  last_name_input text,
  email_input text,
  phone_input text,
  company_input text,
  position_input text,
  formation_id_input text,
  formation_title_input text,
  participants_input integer,
  message_input text,
  source_page_input text,
  language_input text,
  privacy_consent_input boolean,
  honeypot_input text
)
RETURNS uuid
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

  INSERT INTO public.registration_requests (
    first_name, last_name, email, phone, company, position,
    formation_id, formation_title, participants, message,
    source_page, language, privacy_consent
  ) VALUES (
    trim(first_name_input), trim(last_name_input), lower(trim(email_input)),
    phone_input, company_input, position_input,
    formation_id_input, formation_title_input,
    coalesce(participants_input, 1), message_input,
    source_page_input, coalesce(language_input, 'fr'), privacy_consent_input
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_registration_request(
  text,text,text,text,text,text,text,text,integer,text,text,text,boolean,text
) TO anon, authenticated;

-- =============================================================
-- RPC: track_page_view + get_public_page_view_stats
-- =============================================================
CREATE OR REPLACE FUNCTION public.track_page_view(page_path_input text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.page_views (page_path) VALUES (coalesce(page_path_input, '/'));
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_page_view(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_public_page_view_stats()
RETURNS TABLE (
  total_views bigint,
  views_today bigint,
  unique_visitors bigint,
  unique_today bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.page_views) AS total_views,
    (SELECT count(*) FROM public.page_views WHERE visited_at::date = current_date) AS views_today,
    (SELECT count(DISTINCT visitor_ip) FROM public.page_views WHERE visitor_ip IS NOT NULL) AS unique_visitors,
    (SELECT count(DISTINCT visitor_ip) FROM public.page_views
       WHERE visitor_ip IS NOT NULL AND visited_at::date = current_date) AS unique_today;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_page_view_stats() TO anon, authenticated;

-- =============================================================
-- Editorial: content_feeds + content_signals
-- =============================================================
CREATE TABLE IF NOT EXISTS public.content_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  url text NOT NULL,
  feed_type text NOT NULL DEFAULT 'rss',
  publisher text,
  country_focus text,
  region_focus text,
  domain_focus text,
  language text NOT NULL DEFAULT 'fr',
  trust_score integer NOT NULL DEFAULT 50,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  last_fetched_at timestamptz
);
ALTER TABLE public.content_feeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on content_feeds"
ON public.content_feeds FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.content_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  feed_id uuid REFERENCES public.content_feeds(id) ON DELETE SET NULL,
  signal_url text,
  title text,
  summary text,
  language text,
  detected_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new',
  classification jsonb,
  meta jsonb
);
ALTER TABLE public.content_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on content_signals"
ON public.content_signals FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================
-- Editorial: resource_posts (blog)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.resource_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  slug text NOT NULL UNIQUE,
  category_key text NOT NULL,
  sector_key text,
  title_fr text NOT NULL,
  title_en text NOT NULL,
  excerpt_fr text,
  excerpt_en text,
  content_fr text,
  content_en text,
  read_time_minutes integer,
  published_at timestamptz NOT NULL DEFAULT now(),
  source_name text,
  source_url text,
  sources_json jsonb,
  seo_title_fr text,
  seo_title_en text,
  seo_description_fr text,
  seo_description_en text,
  cover_image_url text,
  tags text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_new_manual boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  editorial_status text NOT NULL DEFAULT 'draft',
  origin_signal_id uuid REFERENCES public.content_signals(id) ON DELETE SET NULL,
  review_notes text,
  translated_from_post_id uuid
);
ALTER TABLE public.resource_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published resource posts"
ON public.resource_posts FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Service role full access on resource_posts"
ON public.resource_posts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================
-- Editorial: job_opportunities
-- =============================================================
CREATE TABLE IF NOT EXISTS public.job_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary_fr text NOT NULL,
  summary_en text NOT NULL,
  market_key text NOT NULL,
  source_name text NOT NULL,
  source_url text,
  apply_url text,
  location_fr text NOT NULL,
  location_en text NOT NULL,
  work_mode text NOT NULL DEFAULT 'remote',
  opportunity_type text NOT NULL DEFAULT 'job',
  compensation_label text,
  published_at timestamptz NOT NULL DEFAULT now(),
  is_featured boolean NOT NULL DEFAULT false,
  is_new_manual boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft'
);
ALTER TABLE public.job_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published job opportunities"
ON public.job_opportunities FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Service role full access on job_opportunities"
ON public.job_opportunities FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================
-- Newsletter
-- =============================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  email text NOT NULL UNIQUE,
  language text NOT NULL DEFAULT 'fr',
  source_page text,
  subscribed_domains text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active'
);
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on newsletter_subscriptions"
ON public.newsletter_subscriptions FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.newsletter_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  issue_date date NOT NULL DEFAULT current_date,
  language text NOT NULL DEFAULT 'fr',
  status text NOT NULL DEFAULT 'draft',
  title text NOT NULL,
  subject text NOT NULL,
  preheader text,
  intro text,
  target_domains text[] NOT NULL DEFAULT '{}',
  highlight_title text,
  highlight_summary text,
  highlight_url text,
  tip_title text,
  tip_body text,
  tool_name text,
  tool_category text,
  tool_summary text,
  prompt_title text,
  prompt_body text,
  cta_label text,
  cta_url text,
  body_markdown text,
  body_html text,
  source_post_ids text[] NOT NULL DEFAULT '{}',
  generation_source text NOT NULL DEFAULT 'manual',
  generation_notes text,
  scheduled_for timestamptz,
  approved_at timestamptz,
  sent_at timestamptz,
  last_test_sent_at timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  send_count integer NOT NULL DEFAULT 0,
  meta jsonb
);
ALTER TABLE public.newsletter_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on newsletter_issues"
ON public.newsletter_issues FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.newsletter_delivery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  issue_id uuid REFERENCES public.newsletter_issues(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.newsletter_subscriptions(id) ON DELETE SET NULL,
  recipient_email text,
  status text NOT NULL DEFAULT 'sent',
  provider_message_id text,
  language text,
  subscribed_domains text[],
  sent_at timestamptz,
  error_message text
);
ALTER TABLE public.newsletter_delivery_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on newsletter_delivery_logs"
ON public.newsletter_delivery_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================
-- Partner program
-- =============================================================
CREATE TABLE IF NOT EXISTS public.partner_offer_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  offer_key text NOT NULL UNIQUE,
  offer_family text NOT NULL,
  offer_name_fr text NOT NULL,
  offer_name_en text NOT NULL,
  duration_months integer NOT NULL,
  price_fcfa integer NOT NULL,
  visibility_level text NOT NULL DEFAULT 'standard',
  summary_fr text,
  summary_en text,
  deliverables_fr jsonb NOT NULL DEFAULT '[]'::jsonb,
  deliverables_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 100
);
ALTER TABLE public.partner_offer_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on partner_offer_catalog"
ON public.partner_offer_catalog FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.partner_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  template_key text NOT NULL,
  language text NOT NULL DEFAULT 'fr',
  subject_template text NOT NULL,
  body_template text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  meta jsonb,
  UNIQUE (template_key, language)
);
ALTER TABLE public.partner_email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on partner_email_templates"
ON public.partner_email_templates FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.partner_listing_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  prospect_name text NOT NULL,
  prospect_email text NOT NULL,
  company text NOT NULL,
  website text,
  role text,
  city text,
  sector_activity text,
  requested_visibility_type text,
  requested_timeline text,
  request_message text,
  review_status text NOT NULL DEFAULT 'received',
  ai_score numeric,
  ai_recommendation text,
  ai_provider text,
  ai_reasoning jsonb,
  recommended_offer_key text,
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
  meta jsonb
);
ALTER TABLE public.partner_listing_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on partner_listing_reviews"
ON public.partner_listing_reviews FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.partner_followup_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  partner_listing_review_id uuid REFERENCES public.partner_listing_reviews(id) ON DELETE CASCADE,
  job_status text NOT NULL DEFAULT 'pending',
  scheduled_for timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  provider text NOT NULL DEFAULT 'resend',
  provider_message_id text,
  attempt_count integer NOT NULL DEFAULT 0,
  last_error text,
  meta jsonb
);
ALTER TABLE public.partner_followup_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on partner_followup_jobs"
ON public.partner_followup_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================
-- Audit form
-- =============================================================
CREATE TABLE IF NOT EXISTS public.form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  user_name text,
  user_email text,
  user_position text,
  user_entity text,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_completed boolean NOT NULL DEFAULT false,
  completion_percentage integer NOT NULL DEFAULT 0,
  session_id text,
  invitation_token text
);
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on form_responses"
ON public.form_responses FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.form_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  invitee_name text,
  invitee_email text,
  invite_token text NOT NULL UNIQUE,
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  draft_form_data jsonb,
  response_id uuid REFERENCES public.form_responses(id) ON DELETE SET NULL
);
ALTER TABLE public.form_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on form_invitations"
ON public.form_invitations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================
-- Helpful indexes
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_contact_requests_intent ON public.contact_requests (request_intent, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_email ON public.contact_requests (email);
CREATE INDEX IF NOT EXISTS idx_resource_posts_status ON public.resource_posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_status ON public.job_opportunities (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON public.newsletter_subscriptions (email);
CREATE INDEX IF NOT EXISTS idx_partner_followup_jobs_status ON public.partner_followup_jobs (job_status, scheduled_for);