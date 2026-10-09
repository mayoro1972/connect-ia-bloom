-- Une newsletter envoyée ne peut plus être réarmée (incidents du 10/07/2026 et du 09/10/2026).
-- Toute sauvegarde (back-office, content-admin save, script, « Régénérer ») passait sent_at à null
-- et send_count à 0 ; l'édition redevenait éligible à l'envoi du vendredi.
-- Ce verrou protège tous les chemins à la fois, au niveau de la base.

create or replace function public.lock_sent_newsletter_issue()
returns trigger
language plpgsql
as $$
begin
  if old.sent_at is null and coalesce(old.send_count, 0) = 0 then
    return new;
  end if;

  -- Marqueurs d'envoi : on ne revient jamais en arrière.
  new.sent_at := coalesce(new.sent_at, old.sent_at);
  new.send_count := greatest(coalesce(new.send_count, 0), coalesce(old.send_count, 0));
  new.recipient_count := greatest(coalesce(new.recipient_count, 0), coalesce(old.recipient_count, 0));

  -- Statut : une édition envoyée reste envoyée (ou archivée). « sending » reste possible
  -- pour un renvoi volontaire (newsletter-send avec force_resend).
  if new.status not in ('sent', 'sending', 'archived') then
    new.status := old.status;
  end if;

  -- Contenu figé : ce qui est parti fait foi.
  new.subject := old.subject;
  new.body_html := old.body_html;
  new.issue_date := old.issue_date;

  return new;
end;
$$;

drop trigger if exists lock_sent_newsletter_issue on public.newsletter_issues;
create trigger lock_sent_newsletter_issue
  before update on public.newsletter_issues
  for each row execute function public.lock_sent_newsletter_issue();

-- Une seule édition active par date et par langue (évite deux éditions approuvées le même jour).
create unique index if not exists newsletter_issues_one_per_date_language
  on public.newsletter_issues (issue_date, language)
  where status <> 'archived';
