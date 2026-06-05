-- =============================================================
-- Post-Audit Expert Routing — schema extensions
-- Supports: 74_n8n_Post_Audit_Expert_Routing_V2
-- =============================================================

-- -------------------------------------------------------
-- 1. ai_prospecting_packs (create if not yet managed here)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_prospecting_packs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id     text        NOT NULL UNIQUE,
  prospect_id text,
  organization_name text,
  target_email      text,
  status            text        NOT NULL DEFAULT 'pending',
  payload           jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_prospecting_packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on ai_prospecting_packs"
  ON public.ai_prospecting_packs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- -------------------------------------------------------
-- 2. prospect_targets
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prospect_targets (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id             text        NOT NULL UNIQUE,
  status                  text        NOT NULL DEFAULT 'active',
  paused                  boolean     NOT NULL DEFAULT false,
  do_not_contact          boolean     NOT NULL DEFAULT false,
  outreach_attempt_count  integer     NOT NULL DEFAULT 0,
  last_response_status    text,
  last_sequence_result    text,
  stop_reason             text,
  niche_status            text,
  next_action_at          timestamptz,
  last_pack_id            text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.prospect_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on prospect_targets"
  ON public.prospect_targets FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_prospect_targets_prospect_id ON public.prospect_targets (prospect_id);
CREATE INDEX IF NOT EXISTS idx_prospect_targets_status ON public.prospect_targets (status);
CREATE INDEX IF NOT EXISTS idx_prospect_targets_next_action_at ON public.prospect_targets (next_action_at);

-- -------------------------------------------------------
-- 3. Extend form_responses with pack linkage
-- -------------------------------------------------------
ALTER TABLE public.form_responses
  ADD COLUMN IF NOT EXISTS pack_id          text,
  ADD COLUMN IF NOT EXISTS context_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_form_responses_pack_id ON public.form_responses (pack_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_is_completed ON public.form_responses (is_completed, submitted_at DESC);

-- -------------------------------------------------------
-- 4. Extend form_invitations with pack linkage + routing
-- -------------------------------------------------------
ALTER TABLE public.form_invitations
  ADD COLUMN IF NOT EXISTS pack_id        text,
  ADD COLUMN IF NOT EXISTS response_email text,
  ADD COLUMN IF NOT EXISTS response_cc    text,
  ADD COLUMN IF NOT EXISTS access_context jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_form_invitations_pack_id ON public.form_invitations (pack_id);

-- -------------------------------------------------------
-- 5. post_audit_follow_ups — suivi non-tech post-formulaire
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.post_audit_follow_ups (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id               text        NOT NULL UNIQUE,
  prospect_id           text,
  organization_name     text,
  target_email          text,
  sector_guess          text,
  maturity_level        text,
  recommended_offer     text,
  primary_service       text,
  secondary_service     text,
  priority_use_cases    jsonb       NOT NULL DEFAULT '[]'::jsonb,
  quick_wins_declared   jsonb       NOT NULL DEFAULT '[]'::jsonb,
  constraints_declared  jsonb       NOT NULL DEFAULT '[]'::jsonb,
  assigned_expert_email text,
  internal_email_to     text,
  workflow_status       text        NOT NULL DEFAULT 'ready_for_expert',
  response_submitted_at timestamptz,
  next_action_at        timestamptz,
  booking_link          text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.post_audit_follow_ups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on post_audit_follow_ups"
  ON public.post_audit_follow_ups FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_post_audit_follow_ups_prospect_id   ON public.post_audit_follow_ups (prospect_id);
CREATE INDEX IF NOT EXISTS idx_post_audit_follow_ups_workflow_status ON public.post_audit_follow_ups (workflow_status);
CREATE INDEX IF NOT EXISTS idx_post_audit_follow_ups_next_action_at ON public.post_audit_follow_ups (next_action_at);
