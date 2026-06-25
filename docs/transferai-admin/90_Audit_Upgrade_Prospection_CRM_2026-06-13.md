# Audit et upgrade expert - Prospection CRM TransferAI

Date : 2026-06-13

## Objectif

Ce document résume :

- l’audit fonctionnel de l’existant `V3 / V4 / V5 / V6`
- les écarts identifiés
- les corrections réellement ajoutées dans les exports n8n
- la manière propre d’exploiter la nouvelle chaîne

## Verdict rapide

L’existant couvrait déjà bien :

- le `CRM`
- la `personnalisation IA` du premier email
- les `notifications internes`
- le `post-audit`

Les manques principaux étaient :

- absence de vraie `relance automatique` dédiée
- `scoring` peu opérationnalisé en amont
- risque d’envoi vers des `emails de test`
- journalisation `outreach_attempts` incomplète par rapport au schéma CRM
- quota V4 potentiellement faux, car le filtre regardait `delivery_status = submitted` alors que V3 n’écrivait pas ce champ

## Fichiers modifiés

- [66_n8n_Prospection_CRM_V4_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/66_n8n_Prospection_CRM_V4_Exportable.json)
- [67_n8n_Prospection_CRM_V5_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/67_n8n_Prospection_CRM_V5_Exportable.json)
- [73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json)

## Nouveau workflow ajouté

- [89_n8n_Prospection_CRM_Follow_Up_V1_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/89_n8n_Prospection_CRM_Follow_Up_V1_Exportable.json)

## Ce qui a été ajouté ou corrigé

### 1. V5 - ingestion CRM plus propre

La V5 sait maintenant :

- mieux normaliser des entrées issues de formulaires ou de payloads variés
- reconnaître plusieurs variantes de champs : entreprise, email, site web, décideur
- pré-scorrer les leads avec une logique métier simple via `commercial_priority_default`
- éviter de mettre en `ready` un lead sans `target_email`

Comportement ajouté :

- si `target_email` existe : `status = ready`
- si `target_email` manque : `status = draft`
- si lead très complet ou intention forte : `tier1`
- si lead exploitable mais moins qualifié : `tier2`
- si lead incomplet : `tier3`

Résultat :

- les leads “scrapés mais non envoyables” restent dans le CRM
- les leads “inbound ou prêts à envoyer” entrent proprement dans la file V4

### 2. V4 - orchestration initiale + relance

La V4 sait maintenant :

- filtrer les prospects sans `target_email`
- bloquer les prospects `not_due_yet`
- exploiter `min_confidence_score` quand le score existe
- trier la file par `next_action_at`, priorité commerciale et confiance
- choisir automatiquement entre :
  - `initial_pack_v3`
  - `follow_up_v1`

Le routage est désormais dynamique :

- si `last_sequence_result = sent_v3` ou `follow_up_sent_X` et `last_response_status = pending` :
  - envoi vers le workflow de relance
- sinon :
  - envoi vers le workflow V3 principal

### 3. V3 - fiabilisation de la production

La V3 a été sécurisée sur plusieurs points :

- suppression du fallback `target_email = marius.ayoro70@gmail.com`
- passage des emails internes vers des variables d’environnement
- passage des appels Resend vers `RESEND_API_KEY`
- alignement de `outreach_attempts` avec le schéma CRM

La V3 écrit maintenant un log d’outreach compatible avec le schéma attendu :

- `message_variant`
- `delivery_status = submitted`
- `response_status = pending`
- `follow_up_due_at`
- `organization_name`
- `target_email`
- `resend_message_id`

Conséquence importante :

- le quota journalier V4 redevient cohérent

### 4. Nouveau sous-workflow de relance

Le workflow [89_n8n_Prospection_CRM_Follow_Up_V1_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/89_n8n_Prospection_CRM_Follow_Up_V1_Exportable.json) ajoute enfin la brique manquante :

- récupération du dernier `pack` du prospect
- génération IA d’un email de relance court et crédible
- fallback texte si OpenAI ne répond pas
- envoi via Resend
- log dans `outreach_attempts`
- mise à jour de `prospect_targets`

Règle actuelle :

- `max_attempts_per_prospect = 3` par défaut
- cela donne :
  - 1 envoi initial
  - 2 relances maximum

Après la dernière relance :

- `stop_reason = max_follow_ups_scheduled`
- le prospect sort automatiquement de la boucle tant qu’un humain ne le réactive pas

## Ce qui reste inchangé

`V6` ne sert toujours pas à créer des prospects.

Son rôle reste :

- synchronisation `Google Sheets`
- notification expert
- dashboard post-audit

## Nouvelle chaîne recommandée

```text
Google Form / webhook / import lead
    -> V5 Growth Loop CRM
    -> prospect_targets
    -> V4 Batch Orchestrator
        -> V3 si premier contact
        -> V89 si relance
    -> questionnaire audit
    -> post-audit
    -> V6 dashboard
```

## Variables d’environnement à vérifier

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `BOOKING_LINK_45MIN`
- `N8N_CHILD_WORKFLOW_ID_V3`
- `N8N_CHILD_WORKFLOW_ID_V4`
- `N8N_CHILD_WORKFLOW_ID_FOLLOW_UP`
- `INTERNAL_REVIEW_EMAIL_TO`
- `INTERNAL_REVIEW_FROM_EMAIL`
- `OUTREACH_FROM_EMAIL`

## Ordre d’import recommandé dans n8n

1. importer ou mettre à jour `V3`
2. importer le nouveau workflow `89`
3. importer ou mettre à jour `V4`
4. importer ou mettre à jour `V5`
5. renseigner `N8N_CHILD_WORKFLOW_ID_FOLLOW_UP` dans l’environnement ou dans `Set Batch Config`

## Recommandation d’exploitation

Pour un démarrage propre :

1. garder `daily_send_limit` à `3` ou `5`
2. laisser `max_attempts_per_prospect = 3`
3. vérifier les statuts `draft`, `ready`, `active`, `paused`
4. revoir chaque semaine :
   - `skip_reasons`
   - `outreach_attempts`
   - les prospects bloqués sur `missing_target_email`
   - les prospects arrêtés sur `max_follow_ups_scheduled`

## Risques résiduels

- le scoring amont reste un `scoring métier pragmatique`, pas un scoring prédictif avancé
- la qualité des relances dépendra toujours de la qualité des données entrantes
- les exports historiques `60`, `62` et autres variantes n’ont pas été harmonisés ici ; la référence de travail doit rester `67`, `66`, `73` et `89`

## Conclusion

La chaîne couvre désormais proprement :

- `CRM`
- `priorisation`
- `premier contact personnalisé par IA`
- `validation interne`
- `relance automatique`
- `post-audit`
- `dashboard`

Autrement dit, vous avez maintenant une base beaucoup plus proche d’une vraie machine de prospection pilotable et non plus seulement d’un moteur d’envoi initial.
