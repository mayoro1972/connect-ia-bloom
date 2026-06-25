create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

create or replace function public.invoke_transferai_whatsapp_followup_scheduler()
returns bigint
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  project_url text;
  scheduler_token text;
  request_id bigint;
begin
  select decrypted_secret into project_url
  from vault.decrypted_secrets
  where name = 'transferai_project_url'
  order by created_at desc
  limit 1;

  select decrypted_secret into scheduler_token
  from vault.decrypted_secrets
  where name = 'transferai_whatsapp_scheduler_token'
  order by created_at desc
  limit 1;

  if project_url is null or scheduler_token is null then
    raise exception 'Missing Vault secret(s) for WhatsApp followup scheduler.';
  end if;

  select net.http_post(
    url := project_url || '/functions/v1/whatsapp-followup-scheduler',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-scheduler-token', scheduler_token
    ),
    body := jsonb_build_object('scheduled_at', now())
  ) into request_id;

  return request_id;
end;
$$;

select cron.unschedule('transferai-whatsapp-followup-scheduler')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-whatsapp-followup-scheduler'
);

select cron.schedule(
  'transferai-whatsapp-followup-scheduler',
  '*/15 * * * *',
  $$select public.invoke_transferai_whatsapp_followup_scheduler();$$
);
