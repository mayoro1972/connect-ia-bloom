create or replace function public.invoke_transferai_daily_digest()
returns bigint
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  project_url text;
  anon_key text;
  request_id bigint;
begin
  select decrypted_secret into project_url
  from vault.decrypted_secrets
  where name = 'transferai_project_url'
  order by created_at desc
  limit 1;

  select decrypted_secret into anon_key
  from vault.decrypted_secrets
  where name = 'transferai_anon_key'
  order by created_at desc
  limit 1;

  if project_url is null or anon_key is null then
    raise exception 'Missing Vault secret(s) for TransferAI daily digest.';
  end if;

  select net.http_post(
    url := project_url || '/functions/v1/transferai-daily-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', anon_key,
      'Authorization', 'Bearer ' || anon_key
    ),
    body := '{}'::jsonb
  ) into request_id;

  return request_id;
end;
$$;

-- Remplace l'ancien cron hebdomadaire (lundi 7h) qui appelait webinar-admin-weekly-digest,
-- une fonction jamais déployée (créée le 05/07 mais absente de `supabase functions list`).
select cron.unschedule('transferai-webinar-weekly-digest')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-webinar-weekly-digest'
);

select cron.unschedule('transferai-daily-digest')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-daily-digest'
);

select cron.schedule(
  'transferai-daily-digest',
  '15 7 * * *',
  $$select public.invoke_transferai_daily_digest();$$
);
