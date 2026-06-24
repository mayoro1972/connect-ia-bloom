# Workflow V5 - Boucle de croissance CRM

## Fichier

- [60_n8n_Prospection_CRM_V5_Growth_Loop.json](./60_n8n_Prospection_CRM_V5_Growth_Loop.json)

## Objectif

La V5 a pour rôle de faire grandir la base CRM en continu.

Elle permet de :

- recevoir des leads publics scrappés
- les normaliser
- les injecter dans `prospect_targets`
- préparer le terrain pour la V4

## Ce que fait la V5

La V5 n’envoie pas elle-même les courriers de prospection.

Elle s’occupe de la couche amont :

1. ingestion des leads
2. normalisation
3. validation minimale
4. upsert dans le CRM
5. déclenchement optionnel de la V4
6. synthèse du run

## Déclencheurs

La V5 peut démarrer de trois façons :

- `Manual Trigger`
- `Daily CRM Growth Schedule`
- `Scraped Leads Webhook`

## Variables recommandées

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SCRAPED_PUBLIC_LEADS_CSV_URL`
- `N8N_CHILD_WORKFLOW_ID_V4`
- `N8N_CHILD_WORKFLOW_ID_V3`
- `BOOKING_LINK_45MIN`

## Nœuds principaux

### 1. `Set CRM Growth Config`

Définit :

- le backend CRM
- l’URL du flux scrappé
- l’option de dispatch vers la V4
- l’identifiant de la V3 enrichie à relayer vers la V4
- les paramètres batch à transmettre à la V4
- les valeurs par défaut métier

### 2. `If Direct Lead Payload`

Décide si la V5 reçoit :

- des leads directement via webhook
- ou un flux CSV à aller chercher

### 3. `Fetch Scraped Leads CSV`

Charge un export CSV de leads publics si aucun payload direct n’est fourni.

### 4. `Normalize Inbound Leads`

Transforme les leads entrants vers le format prospect canonique :

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

### 5. `Filter Valid Leads`

Ne laisse passer que les leads qui ont au minimum :

- `organization_name`
- `website`

### 6. `Prepare CRM Upserts`

Ajoute les champs CRM de pilotage :

- `status = ready`
- `paused = false`
- `do_not_contact = false`
- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `niche_status`
- `next_action_at`

### 7. `Upsert Prospects Into CRM`

Insère ou met à jour les leads dans :

- `prospect_targets`

La V5 fait donc apparaître le CRM ici de manière explicite.

### 8. `Build CRM Import Summary`

Construit un résumé du lot importé :

- nombre de leads importés
- ids importés
- option de dispatch
- `child_workflow_id_v4`
- `child_workflow_id_v3`
- `child_workflow_label_v3`
- `batch_fetch_limit`
- `daily_send_limit`
- `max_attempts_per_prospect`
- `min_confidence_score`
- `batch_run_label`

### 9. `If Dispatch To V4`

Si activé, la V5 déclenche la V4 à la fin.

### 10. `Execute V4 Batch Workflow`

Lance l’orchestrateur V4 après mise à jour du CRM.

La V5 lui transmet désormais aussi les paramètres utiles pour la suite :

- le workflow V3 enfant à appeler
- le label de cette V3 enrichie
- les quotas batch
- le lien de réservation

### 11. `Fetch CRM Ready Snapshot`

Compte les prospects actuellement prêts dans la file CRM.

### 12. `Fetch Today Outreach Snapshot`

Compte les tentatives d’envoi du jour.

### 13. `Build End Of Run Summary`

Produit :

- `imported_count`
- `crm_ready_count`
- `outreach_today_count`
- `dispatch_to_v4`
- `child_workflow_id_v4`
- `child_workflow_id_v3`
- `child_workflow_label_v3`
- `batch_fetch_limit`
- `daily_send_limit`
- `next_step`

## Où le CRM apparaît dans la V5

Le CRM apparaît à trois endroits clés :

1. dans la table cible `prospect_targets`
2. dans les champs CRM enrichis avant l’upsert
3. dans la lecture de l’état CRM en fin de run

Donc la V5 ne traite pas seulement des leads.
Elle construit un CRM exploitable.

## Logique d’échelle 100 sociétés

Pour atteindre 100 sociétés et plus :

1. le scraping quotidien remplit la V5
2. la V5 remplit `prospect_targets`
3. la V4 lit `prospect_targets`
4. la V3 traite les prospects retenus

Ainsi :

- le CRM grossit chaque jour
- le batch reste contrôlé
- la prospection reste limitée par quotas

## Recommandation d’exploitation

Pour démarrer proprement :

1. utiliser `Supabase` comme CRM maître
2. faire entrer tous les leads scrappés via V5
3. garder `V4` comme filtre de volume
4. garder `V3` comme moteur de prospection sortante

## Résumé simple

- `V5` fait entrer les sociétés dans le CRM
- `V4` choisit lesquelles traiter
- `V3` prépare et envoie l’approche commerciale
