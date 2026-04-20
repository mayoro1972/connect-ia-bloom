-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any previous schedules with same names (idempotent)
DO $$
BEGIN
  PERFORM cron.unschedule('transferai-content-discovery');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('transferai-content-classifier');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('transferai-content-drafter');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Schedule: discovery every 6 hours
SELECT cron.schedule(
  'transferai-content-discovery',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://hofctzuwrxnunodesimp.supabase.co/functions/v1/content-discovery',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZmN0enV3cnhudW5vZGVzaW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTYwMDQsImV4cCI6MjA4ODI5MjAwNH0.FybtKLtbr2OjmkWsnlqmC-ECivt3jaUc4JivCrlDGm0"}'::jsonb,
    body := jsonb_build_object('limit', 15, 'scheduled_at', now())
  );
  $$
);

-- Schedule: classifier every 2 hours
SELECT cron.schedule(
  'transferai-content-classifier',
  '15 */2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://hofctzuwrxnunodesimp.supabase.co/functions/v1/content-classifier',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZmN0enV3cnhudW5vZGVzaW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTYwMDQsImV4cCI6MjA4ODI5MjAwNH0.FybtKLtbr2OjmkWsnlqmC-ECivt3jaUc4JivCrlDGm0"}'::jsonb,
    body := jsonb_build_object('limit', 25, 'scheduled_at', now())
  );
  $$
);

-- Schedule: drafter daily at 07:00 UTC
SELECT cron.schedule(
  'transferai-content-drafter',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url := 'https://hofctzuwrxnunodesimp.supabase.co/functions/v1/content-drafter',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZmN0enV3cnhudW5vZGVzaW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTYwMDQsImV4cCI6MjA4ODI5MjAwNH0.FybtKLtbr2OjmkWsnlqmC-ECivt3jaUc4JivCrlDGm0"}'::jsonb,
    body := jsonb_build_object('limit', 8, 'auto_publish', true, 'scheduled_at', now())
  );
  $$
);