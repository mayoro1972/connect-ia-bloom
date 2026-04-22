create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

create or replace function public.invoke_transferai_audit_followups()
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
    raise exception 'Missing Vault secret(s) for audit followup scheduler.';
  end if;

  select net.http_post(
    url := project_url || '/functions/v1/process-prospect-followups',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', anon_key,
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object('scheduled_at', now())
  ) into request_id;

  return request_id;
end;
$$;

select cron.unschedule('transferai-audit-followups')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-audit-followups'
);

select cron.schedule(
  'transferai-audit-followups',
  '*/5 * * * *',
  $$select public.invoke_transferai_audit_followups();$$
);
