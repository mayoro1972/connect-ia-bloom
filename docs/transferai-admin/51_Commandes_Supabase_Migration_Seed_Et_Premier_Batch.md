# Commandes Supabase - migration, seed et premier batch

Ce document donne les commandes exactes pour :

- pousser la migration Supabase
- charger le seed de test
- vérifier le résultat
- préparer le premier batch V4

Fichiers concernés :

- [Migration SQL](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/migrations/20260522160000_create_ai_multi_prospecting_pipeline.sql)
- [Migration RLS](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/migrations/20260522173000_secure_ai_multi_prospecting_pipeline_rls.sql)
- [Seed SQL de test](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/seeds/20260522170000_seed_ai_multi_prospecting_test_targets.sql)
- [Workflow V4 batch](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/47_n8n_Prospection_Multi_Prospect_V4_Batch.json)

## 1. Se placer à la racine du projet

```bash
cd /Users/marius_ayoro/Documents/GitHub/connect-ia-bloom
```

## 2. Vérifier que Supabase CLI est disponible

```bash
supabase --help
```

## 3. Se connecter à Supabase

```bash
supabase login
```

## 4. Lier le projet local au projet distant

Le `project_id` trouvé dans `supabase/config.toml` est :

- `wlhznciwuofueffyoflo`

Commande :

```bash
supabase link --project-ref wlhznciwuofueffyoflo
```

## 5. Pousser la migration de schéma

```bash
supabase db push
```

Cette commande poussera à la fois :

- la migration de schéma
- la migration RLS

## 6. Charger le seed de test sur la base liée

```bash
supabase db query --linked --file supabase/seeds/20260522170000_seed_ai_multi_prospecting_test_targets.sql
```

## 7. Vérifier que les prospects ont bien été chargés

```bash
supabase db query --linked "select prospect_id, organization_name, status, paused, do_not_contact, outreach_attempt_count, last_response_status, last_sequence_result from public.prospect_targets order by prospect_id;"
```

## 8. Vérifier le nombre de prospects par statut

```bash
supabase db query --linked "select status, count(*) from public.prospect_targets group by 1 order by 1;"
```

## 9. Vérifier la vue prête pour batch

```bash
supabase db query --linked "select prospect_id, organization_name, status, paused, do_not_contact, stop_reason from public.prospect_targets_ready_for_batch order by prospect_id;"
```

## 10. Vérifier que les tables batch existent

```bash
supabase db query --linked "select table_name from information_schema.tables where table_schema = 'public' and table_name in ('prospect_targets','ai_prospecting_packs','outreach_attempts','prospecting_batch_runs','prospecting_batch_run_items') order by table_name;"
```

## 11. Préparer le premier batch V4

La V4 lit la table `prospect_targets` avec :

- `status in ('ready', 'active')`
- `paused = false`
- tri par `next_action_at asc, updated_at asc`

Pour un premier test propre, je recommande :

- `source_backend = supabase`
- `batch_fetch_limit = 15`
- `daily_send_limit = 3`
- `max_attempts_per_prospect = 3`
- `min_confidence_score = 0.45`

## 12. Importer les workflows dans n8n

À importer :

- [V3](/Users/marius_ayoro/Downloads/44_n8n_Prospection_Modele_Elton_V3_Approval_AutoSend.json)
- [V4](/Users/marius_ayoro/Downloads/47_n8n_Prospection_Multi_Prospect_V4_Batch.json)

## 13. Variables n8n minimales à configurer

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `OUTREACH_FROM_EMAIL`
- `INTERNAL_REVIEW_EMAIL`
- `BOOKING_LINK_45MIN`
- `N8N_BASE_URL`
- `N8N_CHILD_WORKFLOW_ID_V3`

## 14. Premier lancement de batch

Dans n8n :

1. ouvrir le workflow `TransferAI Prospecting Multi-Prospect V4 Batch Orchestrator`
2. cliquer sur `Manual Trigger`
3. laisser :
   - `source_backend = supabase`
   - `batch_fetch_limit = 15`
   - `daily_send_limit = 3`
4. exécuter le workflow

## 15. Vérifier le batch après exécution

### Historique des runs batch

```bash
supabase db query --linked "select id, run_label, source_backend, processed_count, skipped_count, status, started_at, completed_at from public.prospecting_batch_runs order by started_at desc limit 10;"
```

### Détail prospect par prospect

```bash
supabase db query --linked "select batch_run_id, prospect_id, process_decision, batch_status, batch_stop_reason, created_at from public.prospecting_batch_run_items order by created_at desc limit 30;"
```

### Packs générés

```bash
supabase db query --linked "select pack_id, prospect_id, organization_name, status, created_at from public.ai_prospecting_packs order by created_at desc limit 20;"
```

### Tentatives d’envoi

```bash
supabase db query --linked "select prospect_id, pack_id, organization_name, target_email, channel, message_variant, sent_at, delivery_status, response_status from public.outreach_attempts order by sent_at desc limit 20;"
```

## 16. Nettoyer le seed de test si besoin

```bash
supabase db query --linked "delete from public.prospecting_batch_run_items where prospect_id like 'seed-%'; delete from public.prospecting_batch_runs where run_label like 'weekday-morning-run' or run_label like 'seed-%'; delete from public.outreach_attempts where prospect_id like 'seed-%'; delete from public.ai_prospecting_packs where prospect_id like 'seed-%'; delete from public.do_not_contact where prospect_id like 'seed-%'; delete from public.prospect_targets where prospect_id like 'seed-%';"
```

## 17. Recommandation de démarrage

Pour le tout premier test :

- garder `daily_send_limit = 3`
- vérifier les packs générés avant d’augmenter le volume
- contrôler les `batch_stop_reason`
- n’augmenter le quota qu’après validation des niches les plus prometteuses
