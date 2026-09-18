-- Le brouillon automatique du mercredi (newsletter-drafter, ancien format) est remplacé par
-- « TransferAI — Le Journal », rédigé chaque jeudi soir et validé par Marius AYORO depuis l'email [TEST].
-- L'envoi du vendredi (transferai-newsletter-send-weekly) est conservé : il n'expédie que les éditions approuvées.
select cron.unschedule('transferai-newsletter-draft-weekly')
where exists (
  select 1
  from cron.job
  where jobname = 'transferai-newsletter-draft-weekly'
);
