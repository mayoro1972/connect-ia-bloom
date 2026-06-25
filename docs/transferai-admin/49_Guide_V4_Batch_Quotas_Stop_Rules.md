# V4 Batch - Quotas d'envoi et règles d'arrêt

Ce document décrit la logique commerciale et opérationnelle de la **V4 batch**.

Fichier concerné :

- [47_n8n_Prospection_Multi_Prospect_V4_Batch.json](./47_n8n_Prospection_Multi_Prospect_V4_Batch.json)

## Rôle de la V4

La V4 ne remplace pas le workflow prospect.

Son rôle est de :

- charger une liste de prospects
- décider qui peut être traité aujourd’hui
- bloquer ce qui ne doit pas partir
- router les prospects éligibles vers le bon sous-workflow
- produire un résumé de batch

## Variables d’environnement recommandées

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`
- `AIRTABLE_READY_VIEW`
- `GOOGLE_SHEETS_CSV_URL`
- `BOOKING_LINK_45MIN`
- `N8N_CHILD_WORKFLOW_ID_V3`
- `N8N_CHILD_WORKFLOW_ID_FOLLOW_UP`

Le `N8N_CHILD_WORKFLOW_ID_V3` doit maintenant idéalement pointer vers la version enrichie du workflow prospect, c’est-à-dire la variante qui génère aussi le mini-catalogue et le deck avant stockage / envoi.

## Paramètres batch recommandés

Dans `Set Batch Config` :

- `source_backend`
- `batch_fetch_limit`
- `daily_send_limit`
- `max_attempts_per_prospect`
- `min_confidence_score`
- `batch_run_label`
- `child_workflow_label_v3`

### Valeurs de départ recommandées

- `source_backend = supabase`
- `batch_fetch_limit = 25`
- `daily_send_limit = 5`
- `max_attempts_per_prospect = 3`
- `min_confidence_score = 0.45`
- `child_workflow_label_v3 = TransferAI Prospecting V3 CRM Enhanced [FINAL]-11`

## Règles d'arrêt implémentées

La V4 doit arrêter un prospect avant exécution si :

- `organization_name` est absent
- `website` est absent
- `target_email` est absent
- `do_not_contact = true`
- `paused = true`
- `stop_reason` est déjà renseigné
- `outreach_attempt_count >= max_attempts_per_prospect`
- `last_response_status` indique une séquence déjà close
- `last_sequence_result = no_niche`
- `next_action_at` est dans le futur
- `confidence_score < min_confidence_score` quand ce score existe sur le prospect
- le quota quotidien est déjà atteint

## Statuts de réponse considérés comme séquence close

La V4 traite comme “séquence close” :

- `interested`
- `meeting_booked`
- `not_interested`
- `unsubscribed`

## Logique de quota quotidien

La V4 :

1. lit les envois du jour dans `outreach_attempts`
2. calcule `sent_today`
3. calcule `remaining_capacity = daily_send_limit - sent_today`
4. ne laisse passer que les premiers prospects jusqu’à épuisement de la capacité

## Conséquence métier

Si `daily_send_limit = 5` et que 2 e-mails ont déjà été envoyés aujourd’hui, la V4 ne doit pousser que 3 nouveaux prospects au workflow V3.

## Règle commerciale recommandée

Pour une campagne B2B ciblée, je recommande :

- 3 à 5 prises de contact qualifiées par jour
- jamais de volume massif sans revue des réponses
- arrêt de la séquence si la niche est jugée faible
- arrêt après 3 tentatives sans signal positif

## Articulation avec les sous-workflows

La V4 ne pousse que les prospects marqués :

- `process_decision = process_now`

Puis elle choisit automatiquement :

- `initial_pack_v3` pour un premier contact
- `follow_up_v1` pour une relance sur prospect déjà contacté

Le V3 se charge ensuite de :

- scrapper
- protéger les données avant LLM
- produire le pack prospect
- générer le mini-catalogue rendu
- générer le deck rendu
- lancer la validation
- envoyer après approbation

Le workflow de follow-up se charge de :

- récupérer le dernier pack
- générer un email de relance personnalisé
- envoyer la relance
- journaliser `outreach_attempts`
- mettre à jour `prospect_targets`

## Sorties de la V4

La V4 produit en fin de run :

- `processed_count`
- `skipped_count`
- `rendered_catalogues_count`
- `rendered_decks_count`
- `rendered_attachments_total`
- `render_error_count`
- `skip_reasons`
- `child_workflow_id_v3`
- `child_workflow_label_v3`
- `generated_at`

Et, dans la version actuelle, elle peut aussi journaliser :

- une ligne dans `prospecting_batch_runs`
- une ligne par prospect dans `prospecting_batch_run_items`

## Recommandation d’exploitation

Pour un démarrage sérieux :

1. activer la V4 en `Supabase` comme backend principal
2. garder le quota à `3` ou `5` envois / jour
3. revoir les taux de réponse chaque semaine
4. n’augmenter le volume qu’après validation des niches les plus réactives
