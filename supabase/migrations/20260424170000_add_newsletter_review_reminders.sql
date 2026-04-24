select cron.unschedule('transferai-newsletter-review-reminder-noon')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-newsletter-review-reminder-noon'
);

select cron.unschedule('transferai-newsletter-review-reminder-evening')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-newsletter-review-reminder-evening'
);

select cron.schedule(
  'transferai-newsletter-review-reminder-noon',
  '0 12 * * 4',
  $$select public.invoke_transferai_newsletter_scheduler('review-reminder');$$
);

select cron.schedule(
  'transferai-newsletter-review-reminder-evening',
  '0 18 * * 4',
  $$select public.invoke_transferai_newsletter_scheduler('review-reminder');$$
);
