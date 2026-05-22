# Brancher les sources prospects - Google Sheets, Airtable, Supabase

Ce document explique comment alimenter les workflows de prospection TransferAI à partir de plusieurs sources de prospects.

Fichiers concernés :

- [42_n8n_Prospection_Modele_Elton_V1.json](./42_n8n_Prospection_Modele_Elton_V1.json)
- [43_n8n_Prospection_Modele_Elton_V2_Supabase_Approval_Email.json](./43_n8n_Prospection_Modele_Elton_V2_Supabase_Approval_Email.json)
- [44_n8n_Prospection_Modele_Elton_V3_Approval_AutoSend.json](./44_n8n_Prospection_Modele_Elton_V3_Approval_AutoSend.json)
- [47_n8n_Prospection_Multi_Prospect_V4_Batch.json](./47_n8n_Prospection_Multi_Prospect_V4_Batch.json)

## Objectif

Faire en sorte qu’un même moteur de prospection puisse :

- lire une file de prospects
- normaliser les fiches
- appliquer les règles de protection des données et les règles commerciales
- générer les actifs adaptés
- envoyer ou préparer les séquences selon le niveau du workflow

## Principe général

Le système repose sur un **format canonique prospect**.

Quelle que soit la source d’origine, chaque prospect doit être converti dans cette structure minimale :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `booking_link_45min`
- `commercial_priority_default`
- `research_scope`

Et si possible aussi :

- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `paused`
- `do_not_contact`
- `niche_status`
- `next_action_at`

## 1. Source Supabase

Supabase est la source la plus robuste pour passer à l’échelle.

### Pourquoi

- meilleure traçabilité
- historique des séquences
- gestion des statuts
- contrôle des quotas
- gouvernance plus claire des données

### Table recommandée

`prospect_targets`

### Colonnes minimales

- `id`
- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `research_scope`
- `commercial_priority_default`
- `status`
- `paused`
- `do_not_contact`
- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `niche_status`
- `next_action_at`
- `updated_at`

### Variables n8n à prévoir

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2. Source Airtable

Airtable est utile pour une équipe commerciale qui veut piloter rapidement des cibles sans passer d’abord par un vrai back-end.

### Cas d’usage idéal

- campagne pilote
- travail d’équipe léger
- enrichissement manuel rapide
- segmentation visuelle

### Colonnes minimales dans la table

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
- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `paused`
- `do_not_contact`
- `niche_status`
- `next_action_at`

### Variables n8n à prévoir

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`
- `AIRTABLE_READY_VIEW`

## 3. Source Google Sheets

Google Sheets est la source la plus simple pour démarrer vite ou tester un lot de prospects.

### Cas d’usage idéal

- première campagne
- sourcing manuel
- test rapide sur 20 à 100 prospects
- mise à jour simple par une équipe non technique

### Structure recommandée de feuille

Première ligne en en-têtes, avec au minimum :

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
- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `paused`
- `do_not_contact`
- `niche_status`
- `next_action_at`

### Variable n8n à prévoir

- `GOOGLE_SHEETS_CSV_URL`

## 4. Recommandation de montée en puissance

Je recommande cette trajectoire :

1. commencer avec `Google Sheets` pour le test initial
2. passer à `Airtable` si l’équipe veut gérer des campagnes visuelles
3. industrialiser ensuite avec `Supabase` pour la gouvernance, l’historique et l’automatisation

## 5. Bonnes pratiques de normalisation

Quel que soit le backend, le workflow doit :

- imposer un `prospect_id` stable
- vérifier que `organization_name` et `website` existent
- convertir les booléens `paused` et `do_not_contact`
- convertir les compteurs en nombres
- harmoniser les statuts de réponse
- limiter les chemins publics personnalisés via `custom_page_paths_csv`

## 6. Bonnes pratiques de protection des données

Même si la source contient plus d’informations, ne transmettre au workflow prospect que ce qui est nécessaire.

À respecter :

- ne pas exposer de notes internes sensibles au LLM
- ne pas exposer d’e-mails ou de téléphones au modèle
- garder les identifiants directs côté orchestration
- n’envoyer au LLM que les signaux publics assainis

## 7. Rôle de la V4 Batch

La V4 batch a précisément pour rôle de :

- lire la source choisie
- normaliser les fiches
- filtrer les prospects à ne pas traiter
- appliquer les quotas d’envoi du jour
- envoyer les prospects éligibles vers le workflow V3

Autrement dit :

- `V1` : pack prospect avec revue manuelle
- `V2` : pack prospect + validation e-mail
- `V3` : pack prospect + validation + envoi automatique
- `V4` : orchestrateur quotidien qui alimente `V3` à partir d’une source de prospects
