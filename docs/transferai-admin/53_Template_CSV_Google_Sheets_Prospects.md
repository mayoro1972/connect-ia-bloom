# Template CSV / Google Sheets - 100 prospects

Ce template est prêt à être :

- rempli directement en CSV
- importé dans Google Sheets
- ou chargé dans Airtable / Supabase après enrichissement

Fichier :

- [52_Template_CSV_Google_Sheets_100_Prospects.csv](./52_Template_CSV_Google_Sheets_100_Prospects.csv)

## Colonnes incluses

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
- `outreach_attempt_count`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `paused`
- `do_not_contact`
- `niche_status`
- `next_action_at`
- `notes_internal`

## Valeurs par défaut intégrées

Le template préremplit déjà :

- `prospect_id` de `prospect-001` à `prospect-100`
- `country = Côte d'Ivoire`
- `organization_type = organisation à qualifier`
- `sector_guess = secteur à confirmer`
- `decision_maker_name = Décideur à confirmer`
- `booking_link_45min = https://calendly.com/transferai/45min`
- `commercial_priority_default = tier1`
- `research_scope = public_web_only`
- `outreach_attempt_count = 0`
- `paused = false`
- `do_not_contact = false`
- `niche_status = candidate`

## Conseils de remplissage

- renseigner en priorité `organization_name`, `website` et `target_email`
- utiliser `custom_page_paths_csv` seulement si le site du prospect a des pages métier très spécifiques
- garder `paused = false` tant que le prospect est actif dans la campagne
- utiliser `do_not_contact = true` dès qu’une opposition est exprimée
- utiliser `stop_reason` seulement quand une règle métier impose un arrêt

## Import dans Google Sheets

1. créer une nouvelle feuille Google Sheets
2. choisir `Fichier` puis `Importer`
3. importer le CSV
4. conserver la première ligne comme en-têtes
5. vérifier l’encodage UTF-8 pour garder les accents

## Recommandation pratique

Pour une première campagne :

- remplir d’abord 20 à 30 lignes
- tester la V4 avec un quota réduit
- valider les résultats
- puis étendre progressivement jusqu’aux 100 prospects
