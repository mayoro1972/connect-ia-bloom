# Guide Utilisateur V4 Batch Node Par Node

Référence opérationnelle du workflow `TransferAI Prospecting Multi-Prospect V4 Batch Orchestrator`  
Version du 8 juin 2026

## Objectif

Le workflow V4 sert à :

- récupérer des prospects depuis une source CRM
- appliquer les règles de sélection et de quota
- appeler le workflow V3 pour chaque prospect retenu
- journaliser le batch dans Supabase

V4 n'écrit pas les contenus commerciaux du pack. Ce rôle reste porté par V3.

## Point important avant de rebrancher Airtable et Google Sheets

Rebrancher Airtable ou Google Sheets **ne modifie pas la logique interne de V3**.  
V3 continue à faire la même chose :

- générer le pack
- envoyer l'email d'approbation
- attendre l'approbation
- envoyer l'email prospect

En revanche, sur la V4 actuellement validée, le chemin final a été simplifié pour tester `Supabase` uniquement :

- `Normalize Supabase Prospects` alimente le merge final
- `Create Batch Run` + `Edit Fields` injectent le contexte batch

Donc :

- si tu rebranches Airtable et Google Sheets **sans rétablir un merge de sources propre**, tu peux casser la V4
- cela **n'affectera pas V3**, mais cela peut empêcher V4 d'alimenter V3 correctement

### Recommandation de prod

Pour la mise en production :

1. garder `source_backend = supabase` tant que la V4 nœud par nœud est stabilisée
2. réintroduire ensuite Airtable et Google Sheets avec une structure à deux merges :
3. `Merge Prospect Sources`
4. `Merge Prospects With Batch Run`

Architecture recommandée :

```text
Normalize Supabase Prospects ─┐
Normalize Airtable Prospects ─┼─> Merge Prospect Sources ─┐
Normalize Google Sheets Prospects ─┘                      │
                                                          ├─> Merge Prospects With Batch Run ─> Build Eligible Prospect Queue
Create Batch Run ─> Edit Fields ──────────────────────────┘
```

## Vue d'ensemble du flux V4

```text
Manual Trigger / Daily Schedule Trigger
→ Set Batch Config
→ Fetch Today Outreach Count
→ If Supabase Source / If Airtable Source / Google Sheets path
→ Normalize Source Prospects
→ Merge Prospects With Batch Run
→ Build Eligible Prospect Queue
→ If Prospect Eligible
→ Execute Prospect Workflow V3 / Mark Skipped In Batch
→ Log Processed Batch Item / Log Skipped Batch Item
→ Merge Batch Outcomes
→ Build Batch Summary
→ Finalize Batch Run
```

## Prérequis

### n8n

- workflow V3 accessible et actif
- workflow V4 importé
- compte Resend fonctionnel
- accès Supabase valide

### Supabase

Tables ou vues utilisées :

- `prospect_targets`
- `prospect_targets_ready_for_batch`
- `prospecting_batch_runs`
- `prospecting_batch_run_items`
- `ai_prospecting_packs`
- `outreach_attempts`

### Clés

À configurer dans les nœuds HTTP :

- `apikey`
- `Authorization: Bearer <service_role_key>`
- `Content-Type: application/json`

## Set Batch Config

### Rôle

Centralise tous les paramètres d'exécution.

### Champs recommandés

- `source_backend`
- `batch_fetch_limit`
- `daily_send_limit`
- `max_attempts_per_prospect`
- `min_confidence_score`
- `batch_run_label`
- `active_campaign_label`
- `active_niche_list_csv`
- `child_workflow_id_v3`
- `child_workflow_label_v3`
- `booking_link_45min`

### Valeurs de travail recommandées

```text
source_backend = supabase
batch_fetch_limit = 25
daily_send_limit = 5
max_attempts_per_prospect = 3
min_confidence_score = 0.45
batch_run_label = weekday-morning-run
active_campaign_label = S1-Assistanat-Administratif
active_niche_list_csv = assistant_direction_documentaire
child_workflow_id_v3 = PvralFMyr6MdWe8I
booking_link_45min = https://calendly.com/contact-transferai/30min
```

### Niche list utilisable

- `support_it_intelligent`
- `service_client_multicanal`
- `machine_contenu_marketing`
- `workflow_administratif`
- `assistant_direction_documentaire`
- `reporting_financier_assiste`
- `recrutement_onboarding_augmente`
- `telemedecine_triage_orientation`
- `banque_kyc_reporting`
- `operations_terrain_coordination`
- `commentaire_donnees_reporting`
- `energie_industrie_services`
- `formation_montee_en_competence`

## Fetch Today Outreach Count

### Rôle

Compter combien de prospects ont déjà été traités aujourd'hui pour appliquer le quota du jour.

### Réglage obligatoire

- `Always Output Data = ON`

### Pourquoi

Si aucun envoi n'a été fait aujourd'hui, le workflow doit quand même continuer avec `sent_today = 0`.

## If Supabase Source

### Rôle

Diriger l'exécution vers la bonne source.

### Condition

- `value1`
```text
{{ $json.source_backend }}
```
- opérateur
```text
is equal to
```
- `value2`
```text
supabase
```

### Câblage correct

Le nœud doit être alimenté depuis :

```text
Set Batch Config → If Supabase Source
```

Pas depuis `Fetch Today Outreach Count`.

## Fetch Prospects From Supabase

### Rôle

Lire les prospects prêts à traiter.

### Méthode

```text
GET
```

### URL recommandée

```text
{{ 'https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospect_targets?select=*&status=eq.ready&paused=eq.false&order=next_action_at.asc.nullslast,updated_at.asc&limit=' + $json.batch_fetch_limit }}
```

### Authentication

```text
None
```

### Headers

- `apikey = <SUPABASE_SERVICE_ROLE_KEY>`
- `Authorization = Bearer <SUPABASE_SERVICE_ROLE_KEY>`

### Réglage recommandé

- `Always Output Data = ON`

## Normalize Supabase Prospects

### Mode

```text
Run Once for All Items
```

### Code validé

```js
const items = $input.all().map((item) => item.json);

return items.map((row, index) => ({
  json: {
    prospect_id: row.prospect_id || row.id || `supabase-${index + 1}`,
    organization_name: row.organization_name || row.company_name || row.name || '',
    website: row.website || row.domain || '',
    country: row.country || "Côte d'Ivoire",
    organization_type: row.organization_type || row.account_type || 'organisation à qualifier',
    sector_guess: row.sector_guess || row.industry || 'secteur à confirmer',
    decision_maker_name: row.decision_maker_name || row.contact_name || 'Décideur à confirmer',
    target_email: row.target_email || row.email || '',
    custom_page_paths_csv: row.custom_page_paths_csv || '',
    booking_link_45min: 'https://calendly.com/contact-transferai/30min',
    commercial_priority_default: row.commercial_priority_default || 'tier1',
    research_scope: row.research_scope || 'public_web_only',
    source_backend: 'supabase',
    raw_source_id: row.id || null,
    outreach_attempt_count: Number(row.outreach_attempt_count || 0),
    last_response_status: row.last_response_status || '',
    last_sequence_result: row.last_sequence_result || '',
    stop_reason: row.stop_reason || '',
    paused: Boolean(row.paused),
    do_not_contact: Boolean(row.do_not_contact),
    niche_status: row.niche_status || '',
    next_action_at: row.next_action_at || null
  }
}));
```

## Fetch Prospects From Airtable

### Rôle

Source alternative si `source_backend = airtable`.

### Méthode

```text
GET
```

### URL recommandée

```text
{{ 'https://api.airtable.com/v0/' + ($json.airtable_base_id || 'COLLER_AIRTABLE_BASE_ID') + '/' + encodeURIComponent($json.airtable_table_name || 'prospect_targets') + '?maxRecords=' + ($json.batch_fetch_limit || '25') + '&view=' + encodeURIComponent($json.airtable_ready_view || 'Ready For Outreach') }}
```

### Header Authorization

```text
{{ 'Bearer ' + ($json.airtable_api_key || 'COLLER_VOTRE_AIRTABLE_PAT_ICI') }}
```

### Important

Dans l'environnement testé, éviter `$env.*` dans l'UI n8n. Préférer des valeurs injectées ou fixes.

## Normalize Airtable Prospects

### Rôle

Mapper les champs Airtable vers le format canonique prospect.

### Conseil

Utiliser la même structure de sortie que `Normalize Supabase Prospects`.

## Fetch Prospects From Google Sheets CSV

### Rôle

Source alternative légère pour des tests ou des campagnes rapides.

### Entrée

Une URL CSV publique ou publiée.

### Conseil

Utiliser un modèle de colonnes identique au format canonique :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `niche_status`

## Normalize Google Sheets Prospects

### Rôle

Transformer le CSV en items prospect canonique.

## Create Batch Run

### Rôle

Créer la ligne mère du batch dans Supabase.

### Méthode

```text
POST
```

### URL

```text
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_runs
```

### JSON body recommandé

```text
{{ JSON.stringify({
  run_label: $json.batch_run_label || 'weekday-morning-run',
  source_backend: $json.source_backend || 'supabase',
  source_snapshot: $json,
  batch_fetch_limit: Number($json.batch_fetch_limit || 25),
  daily_send_limit: Number($json.daily_send_limit || 5),
  max_attempts_per_prospect: Number($json.max_attempts_per_prospect || 3),
  min_confidence_score: Number($json.min_confidence_score || 0.45),
  active_niche_list_csv: $json.active_niche_list_csv || '',
  active_campaign_label: $json.active_campaign_label || '',
  status: 'started',
  started_at: new Date().toISOString()
}) }}
```

## Edit Fields

### Rôle

Préparer un mini contexte batch propre à injecter dans les prospects.

### Champs à sortir

- `batch_run_id = {{ $json.id }}`
- `batch_run_label = {{ $json.run_label }}`
- `active_campaign_label = {{ $json.active_campaign_label || '' }}`
- `active_niche_list_csv = {{ $json.active_niche_list_csv || '' }}`

### Réglage

- `Manual Mapping`
- `Include Other Input Fields = OFF`

## Merge Prospects With Batch Run

### Rôle

Fusionner chaque prospect avec le contexte batch.

### Pour le test Supabase validé

- `Input 1 = Normalize Supabase Prospects`
- `Input 2 = Edit Fields`

### Configuration validée

- `Mode = Combine`
- `Combine By = All Possible Combinations`

### Résultat attendu

Chaque prospect doit porter :

- `batch_run_id`
- `batch_run_label`
- `active_campaign_label`
- `active_niche_list_csv`

## Build Eligible Prospect Queue

### Rôle

Filtrer les prospects selon :

- niche active
- do-not-contact
- pause
- statut de réponse
- nombre de tentatives
- quota quotidien

### Code validé

```js
function safeNode(name) {
  try {
    return $(name).first().json || {};
  } catch (e) {
    return {};
  }
}

const items = $input.all().map((item) => item.json);
const config = safeNode('Set Batch Config');

const todayOutreach = safeNode('Fetch Today Outreach Count');
const sentToday = Array.isArray(todayOutreach) ? todayOutreach.length : 0;

const dailyLimit = Number(config.daily_send_limit || 5);
const maxAttempts = Number(config.max_attempts_per_prospect || 3);
const remainingCapacity = Math.max(dailyLimit - sentToday, 0);
const activeNiches = String(config.active_niche_list_csv || '')
  .split(',')
  .map((n) => n.trim())
  .filter(Boolean);

let scheduled = 0;
const outputs = [];

for (const prospect of items) {
  let processDecision = 'skip';
  let stopReason = '';

  const prospectNiche = String(prospect.niche_status || '').trim();
  const nicheMatch = activeNiches.length === 0 || activeNiches.includes(prospectNiche);

  if (!nicheMatch) {
    stopReason = 'inactive_niche';
  } else if (!prospect.organization_name || !prospect.website) {
    stopReason = 'missing_minimum_profile';
  } else if (prospect.do_not_contact) {
    stopReason = 'do_not_contact';
  } else if (prospect.paused) {
    stopReason = 'prospect_paused';
  } else if (String(prospect.stop_reason || '').trim()) {
    stopReason = prospect.stop_reason;
  } else if (Number(prospect.outreach_attempt_count || 0) >= maxAttempts) {
    stopReason = 'max_attempts_reached';
  } else if (
    ['interested', 'meeting_booked', 'not_interested', 'unsubscribed']
      .includes(String(prospect.last_response_status || '').toLowerCase())
  ) {
    stopReason = 'sequence_already_closed';
  } else if (String(prospect.last_sequence_result || '').toLowerCase() === 'no_niche') {
    stopReason = 'niche_not_relevant';
  } else if (scheduled >= remainingCapacity) {
    stopReason = 'daily_quota_reached';
  } else {
    processDecision = 'process_now';
    scheduled += 1;
  }

  outputs.push({
    json: {
      ...prospect,
      batch_run_id: prospect.batch_run_id || null,
      batch_run_label: prospect.batch_run_label || config.batch_run_label || 'weekday-morning-run',
      active_campaign_label: prospect.active_campaign_label || config.active_campaign_label || null,
      active_niche_list_csv: prospect.active_niche_list_csv || config.active_niche_list_csv || '',
      daily_send_limit: dailyLimit,
      sent_today: sentToday,
      remaining_capacity: remainingCapacity,
      process_decision: processDecision,
      batch_stop_reason: stopReason || null
    }
  });
}

return outputs;
```

## If Prospect Eligible

### Condition

- `value1`
```text
{{ $json.process_decision }}
```
- opérateur
```text
is equal to
```
- `value2`
```text
process_now
```

### Résultat attendu en test

Avec `daily_send_limit = 1` :

- branche `true = 1 item`
- branche `false = le reste`

## Execute Prospect Workflow V3

### Rôle

Déclencher V3 pour le prospect retenu.

### Réglage conseillé

- `Wait for sub-workflow completion = OFF` si tu veux un dispatch rapide

### Paramètre clé

Le bon `workflow_id` V3 doit être injecté depuis `Set Batch Config`.

## Mark Dispatched To V3

### Rôle

Marquer dans l'item courant que le prospect a été dispatché vers V3.

### Conseil

Conserver :

- `batch_run_id`
- `prospect_id`
- `organization_name`
- `website`

## Mark Skipped In Batch

### Rôle

Préparer les items non retenus pour le logging batch.

## Log Processed Batch Item

### Table cible

```text
prospecting_batch_run_items
```

### URL

```text
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_run_items
```

### JSON body recommandé

```text
{{ JSON.stringify({
  batch_run_id: $json.batch_run_id || null,
  prospect_id: $json.prospect_id || null,
  pack_id: $json.pack_id || null,
  organization_name: $json.organization_name || null,
  website: $json.website || null,
  process_decision: $json.process_decision || 'process_now',
  batch_status: $json.batch_status || 'dispatched_to_v3',
  batch_stop_reason: $json.batch_stop_reason || null,
  active_campaign_label: $json.active_campaign_label || null,
  niche_status: $json.niche_status || null
}) }}
```

## Log Skipped Batch Item

### URL

```text
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_run_items
```

### JSON body recommandé

```text
{{ JSON.stringify({
  batch_run_id: $json.batch_run_id || null,
  prospect_id: $json.prospect_id || null,
  pack_id: $json.pack_id || null,
  organization_name: $json.organization_name || null,
  website: $json.website || null,
  process_decision: $json.process_decision || 'skip',
  batch_status: $json.batch_status || 'skipped_in_batch',
  batch_stop_reason: $json.batch_stop_reason || null,
  active_campaign_label: $json.active_campaign_label || null,
  niche_status: $json.niche_status || null
}) }}
```

## Merge Batch Outcomes

### Rôle

Réunir :

- le prospect envoyé
- les prospects skip

pour produire le résumé final.

### Réglage validé

- `Mode = append`

## Build Batch Summary

### Rôle

Calculer :

- `processed_count`
- `skipped_count`
- `skip_reasons`
- `batch_run_id`

### Sortie attendue

Un seul item avec le résumé agrégé.

## Finalize Batch Run

### Rôle

Clore la ligne du batch parent.

### Table correcte

```text
prospecting_batch_runs
```

### Méthode

```text
PATCH
```

### URL correcte

```text
{{ 'https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_runs?id=eq.' + encodeURIComponent($json.batch_run_id) }}
```

### JSON Body correct

```text
{{ JSON.stringify({
  processed_count: $json.processed_count,
  skipped_count: $json.skipped_count,
  status: 'completed',
  completed_at: new Date().toISOString(),
  failure_reason: null
}) }}
```

### Important

Ne jamais pointer ce nœud vers :

```text
prospecting_batch_run_items
```

## Configuration Supabase minimale

### `prospecting_batch_runs`

Colonnes nécessaires :

- `id`
- `run_label`
- `source_backend`
- `source_snapshot`
- `batch_fetch_limit`
- `daily_send_limit`
- `max_attempts_per_prospect`
- `min_confidence_score`
- `active_niche_list_csv`
- `active_campaign_label`
- `status`
- `started_at`
- `completed_at`
- `processed_count`
- `skipped_count`
- `failure_reason`
- `created_at`

### `prospecting_batch_run_items`

Colonnes nécessaires :

- `id`
- `batch_run_id`
- `prospect_id`
- `pack_id`
- `organization_name`
- `website`
- `process_decision`
- `batch_status`
- `batch_stop_reason`
- `active_campaign_label`
- `niche_status`
- `created_at`

## Checklist de passage en prod

1. conserver `source_backend = supabase`
2. remettre la vraie niche cible
3. valider un dernier run manuel à `daily_send_limit = 1`
4. passer à `daily_send_limit = 5`
5. publier V4
6. surveiller :
7. `prospecting_batch_runs`
8. `prospecting_batch_run_items`
9. V3 déclenché avec le bon prospect

## Conclusion

La V4 validée dans cette session est stable sur le chemin :

- Supabase
- 1 merge batch context
- quotas quotidiens
- dispatch vers V3
- logging batch
- finalisation batch

Pour rebrancher Airtable et Google Sheets, faire d'abord un merge de sources propre avant de remettre le workflow en multi-source complet.
