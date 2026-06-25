-- ============================================================
-- CRM Prospecting — Tables manquantes à créer dans Supabase
-- À exécuter dans Supabase → SQL Editor
-- Date : 2026-06-24
-- ============================================================

-- TABLE 1 : outreach_attempts
-- Alimentée par V3 à chaque envoi d'email initial
-- ============================================================
CREATE TABLE IF NOT EXISTS outreach_attempts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id         uuid REFERENCES prospect_targets(id) ON DELETE SET NULL,
  pack_id             text,
  organization_name   text,
  target_email        text,
  channel             text DEFAULT 'email',
  message_variant     text,
  sent_at             timestamptz DEFAULT now(),
  delivery_status     text DEFAULT 'submitted',  -- submitted | delivered | bounced | failed
  response_status     text DEFAULT 'pending',     -- pending | replied | booked | unsubscribed
  follow_up_due_at    timestamptz,
  stop_reason         text,
  resend_message_id   text,
  created_at          timestamptz DEFAULT now()
);

-- Index pour requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_outreach_attempts_prospect_id ON outreach_attempts(prospect_id);
CREATE INDEX IF NOT EXISTS idx_outreach_attempts_sent_at ON outreach_attempts(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_outreach_attempts_response_status ON outreach_attempts(response_status);

-- RLS
ALTER TABLE outreach_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON outreach_attempts
  FOR ALL USING (auth.role() = 'service_role');


-- TABLE 2 : prospecting_batch_runs
-- Créée par V4 au début de chaque batch, mise à jour à la fin
-- ============================================================
CREATE TABLE IF NOT EXISTS prospecting_batch_runs (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_label               text,
  source_backend          text DEFAULT 'supabase',
  source_snapshot         jsonb,
  batch_fetch_limit       integer DEFAULT 25,
  daily_send_limit        integer DEFAULT 5,
  max_attempts_per_prospect integer DEFAULT 3,
  min_confidence_score    numeric DEFAULT 0.45,
  status                  text DEFAULT 'started',  -- started | completed | failed
  started_at              timestamptz DEFAULT now(),
  completed_at            timestamptz,
  total_processed         integer DEFAULT 0,
  total_sent              integer DEFAULT 0,
  total_skipped           integer DEFAULT 0,
  error_message           text,
  created_at              timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_batch_runs_status ON prospecting_batch_runs(status);
CREATE INDEX IF NOT EXISTS idx_batch_runs_started_at ON prospecting_batch_runs(started_at DESC);

ALTER TABLE prospecting_batch_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON prospecting_batch_runs
  FOR ALL USING (auth.role() = 'service_role');


-- TABLE 3 : prospecting_batch_run_items
-- Un enregistrement par prospect traité dans un batch V4
-- ============================================================
CREATE TABLE IF NOT EXISTS prospecting_batch_run_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_run_id        uuid REFERENCES prospecting_batch_runs(id) ON DELETE CASCADE,
  prospect_id         uuid REFERENCES prospect_targets(id) ON DELETE SET NULL,
  pack_id             text,
  organization_name   text,
  website             text,
  process_decision    text DEFAULT 'process_now',    -- process_now | skip_quota | skip_max_attempts | skip_no_email
  batch_status        text DEFAULT 'dispatched_to_v3', -- dispatched_to_v3 | dispatched_to_follow_up | skipped
  batch_stop_reason   text,
  workflow_route      text DEFAULT 'initial_pack_v3', -- initial_pack_v3 | follow_up_v1
  created_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_batch_items_batch_run_id ON prospecting_batch_run_items(batch_run_id);
CREATE INDEX IF NOT EXISTS idx_batch_items_prospect_id ON prospecting_batch_run_items(prospect_id);

ALTER TABLE prospecting_batch_run_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON prospecting_batch_run_items
  FOR ALL USING (auth.role() = 'service_role');


-- TABLE 4 : zoho_inbound_messages (pour Priorité 4 — intégration Zoho back-office)
-- ============================================================
CREATE TABLE IF NOT EXISTS zoho_inbound_messages (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zoho_message_id     text UNIQUE,
  from_email          text,
  from_name           text,
  subject             text,
  body_text           text,
  body_html           text,
  received_at         timestamptz,
  category            text,  -- formation | service_ia | partenariat | autre
  prospect_id         uuid REFERENCES prospect_targets(id) ON DELETE SET NULL,
  outreach_attempt_id uuid REFERENCES outreach_attempts(id) ON DELETE SET NULL,
  is_reply            boolean DEFAULT false,
  processed           boolean DEFAULT false,
  created_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_zoho_inbound_from_email ON zoho_inbound_messages(from_email);
CREATE INDEX IF NOT EXISTS idx_zoho_inbound_category ON zoho_inbound_messages(category);
CREATE INDEX IF NOT EXISTS idx_zoho_inbound_received_at ON zoho_inbound_messages(received_at DESC);

ALTER TABLE zoho_inbound_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON zoho_inbound_messages
  FOR ALL USING (auth.role() = 'service_role');
