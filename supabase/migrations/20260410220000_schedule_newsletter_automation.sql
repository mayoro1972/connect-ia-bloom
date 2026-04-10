create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

create or replace function public.invoke_transferai_newsletter_scheduler(action_name text)
returns bigint
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  project_url text;
  anon_key text;
  scheduler_token text;
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

  select decrypted_secret into scheduler_token
  from vault.decrypted_secrets
  where name = 'transferai_newsletter_scheduler_token'
  order by created_at desc
  limit 1;

  if project_url is null or anon_key is null or scheduler_token is null then
    raise exception 'Missing Vault secret(s) for newsletter scheduler.';
  end if;

  select net.http_post(
    url := project_url || '/functions/v1/newsletter-scheduler',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', anon_key,
      'Authorization', 'Bearer ' || anon_key,
      'x-scheduler-token', scheduler_token
    ),
    body := jsonb_build_object('action', action_name)
  ) into request_id;

  return request_id;
end;
$$;

select cron.unschedule('transferai-newsletter-draft-weekly')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-newsletter-draft-weekly'
);

select cron.unschedule('transferai-newsletter-send-weekly')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-newsletter-send-weekly'
);

select cron.schedule(
  'transferai-newsletter-draft-weekly',
  '0 6 * * 3',
  $$select public.invoke_transferai_newsletter_scheduler('draft-weekly');$$
);

select cron.schedule(
  'transferai-newsletter-send-weekly',
  '30 8 * * 5',
  $$select public.invoke_transferai_newsletter_scheduler('send-approved');$$
);
