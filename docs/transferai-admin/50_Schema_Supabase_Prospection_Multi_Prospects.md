# Schéma Supabase - prospection multi-prospects

Ce document décrit le schéma Supabase recommandé pour brancher directement :

- le workflow V3 de prospection avec validation puis envoi
- le workflow V4 batch quotidien

Migration créée :

- [20260522160000_create_ai_multi_prospecting_pipeline.sql](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/migrations/20260522160000_create_ai_multi_prospecting_pipeline.sql)

## Tables créées

### 1. `prospect_targets`

Table canonique des prospects.

Elle sert à :

- stocker la liste des organisations ciblées
- porter l’état courant du prospect
- alimenter la V4 batch
- mémoriser les statuts d’arrêt et le nombre de tentatives

Champs clés :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `commercial_priority_default`
- `research_scope`
- `status`
- `paused`
- `do_not_contact`
- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `niche_status`
- `next_action_at`
- `last_pack_id`

### 2. `ai_prospecting_packs`

Table des packs générés par V2 et V3.

Elle sert à :

- stocker le courrier
- stocker le catalogue
- stocker la forme d’audit
- stocker le brief de deck
- suivre l’état de validation et d’envoi

Champs clés :

- `pack_id`
- `prospect_id`
- `organization_name`
- `target_email`
- `status`
- `payload`
- `llm_redaction_summary`
- `approved_at`
- `rejected_at`
- `sent_at`

### 3. `outreach_attempts`

Journal des prises de contact.

Elle sert à :

- calculer le quota quotidien de la V4
- historiser les e-mails envoyés
- suivre les réponses ou l’absence de réponse
- faire remonter automatiquement certains statuts vers `prospect_targets`

Champs clés :

- `prospect_id`
- `pack_id`
- `organization_name`
- `target_email`
- `channel`
- `message_variant`
- `sent_at`
- `delivery_status`
- `response_status`
- `follow_up_due_at`
- `stop_reason`

### 4. `do_not_contact`

Table de blocage durable.

Elle sert à :

- empêcher les relances futures
- garder une traçabilité des oppositions

### 5. `prospecting_batch_runs`

Table d’historique des runs V4.

Elle sert à :

- suivre les batchs quotidiens
- conserver les paramètres utilisés
- suivre les volumes traités et ignorés

### 6. `prospecting_batch_run_items`

Détail par prospect dans chaque batch.

Elle sert à :

- comprendre pourquoi un prospect a été traité ou ignoré
- faire des audits de campagne
- alimenter les tableaux de bord commerciaux

## Triggers inclus

### `sync_prospect_from_outreach_attempt`

À chaque insertion dans `outreach_attempts`, le trigger :

- incrémente `outreach_attempt_count`
- met à jour `last_outreach_at`
- recopie `last_response_status`
- ferme le prospect si la réponse est `not_interested` ou `unsubscribed`

### `sync_prospect_last_pack`

À chaque insertion dans `ai_prospecting_packs`, le trigger :

- renseigne `last_pack_id` sur le prospect concerné

## Vue incluse

### `prospect_targets_ready_for_batch`

Vue pratique pour la V4.

Elle ne retient que les prospects :

- `ready` ou `active`
- non `paused`
- non `do_not_contact`
- sans `stop_reason`

## Sécurité

Toutes les tables sont créées avec `RLS` activé.

Dans cette version, aucune policy large n’est ouverte. L’idée est de privilégier :

- accès via `service_role`
- accès via Edge Functions
- accès via back-office sécurisé

Cela est cohérent avec la protection des données prospects et avec la logique de non-exposition des données sensibles.

## Alignement avec les workflows

### V3

Le workflow V3 écrit dans :

- `ai_prospecting_packs`
- `outreach_attempts`

### V4

Le workflow V4 lit et utilise :

- `prospect_targets`
- `outreach_attempts`

Et, dans la version actuelle, il peut aussi écrire dans :

- `prospecting_batch_runs`
- `prospecting_batch_run_items`

## Recommandation pratique

Pour une mise en route sérieuse :

1. pousser d’abord la migration SQL
2. charger 20 à 50 prospects dans `prospect_targets`
3. tester V3 sur un prospect
4. tester V4 avec un quota limité à `3` ou `5`
5. analyser les sorties avant montée en charge
