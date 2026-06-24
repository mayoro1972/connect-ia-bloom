alter table public.prospect_targets
add column if not exists admin_alert_sent_at timestamptz,
add column if not exists social_email_1_sent_at timestamptz,
add column if not exists social_email_2_sent_at timestamptz,
add column if not exists social_email_3_sent_at timestamptz;
