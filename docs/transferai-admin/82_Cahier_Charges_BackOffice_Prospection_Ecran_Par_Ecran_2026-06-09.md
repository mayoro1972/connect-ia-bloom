# Cahier des Charges - Back Office Prospection TransferAI - Ecran par Ecran

Date : 2026-06-09

## Objectif du document

Ce cahier des charges est destiné à :

- Lovable
- un développeur frontend / full-stack
- un product owner
- un admin ops qui doit valider les besoins

Il décrit écran par écran le cockpit "Back Office Prospection" attendu pour industrialiser le pilotage du pipeline commercial TransferAI.

## Contexte produit

Le système actuel repose sur :

- V5 pour l'alimentation et l'enrichissement du CRM
- V4 pour la sélection batch quotidienne
- V3 pour la génération, l'approbation et l'envoi des packs
- le workflow Post-Audit pour la gestion des réponses
- V6 pour une partie du reporting métier

L'objectif est de rassembler les usages dans une application web unique branchée à Supabase.

## Utilisateurs cibles

### Commercial

Besoins :

- voir les prospects actifs
- savoir qui a été sélectionné par V4
- suivre les packs générés
- comprendre les réponses reçues
- relancer plus efficacement

### Expert

Besoins :

- lire les questionnaires reçus
- consulter le pack et le contexte associé
- préparer un rendez-vous ou une reprise
- suivre ses cas

### Admin / Ops

Besoins :

- surveiller les batchs
- voir les erreurs
- contrôler les quotas et la qualité des données
- diagnostiquer les blocages

## Ecran 1 - Vue d'ensemble

### But

Donner en une page la situation du jour.

### KPI à afficher

- prospects prêts à traiter
- prospects dispatchés aujourd'hui
- packs à valider
- packs envoyés aujourd'hui
- batchs V4 actifs
- réponses questionnaire non traitées
- cas experts ouverts

### Blocs complémentaires

- prospects prioritaires
- packs en attente d'approbation
- batchs récents
- réponses audit récentes
- alertes / erreurs du jour

### Actions

- ouvrir la file prospects
- ouvrir les packs à valider
- ouvrir le détail d'un batch
- ouvrir un cas expert

## Ecran 2 - Prospects

### Source

Table `prospect_targets`

### Table principale

Colonnes minimales :

- organization_name
- target_email
- country
- niche_status
- sector_guess
- commercial_priority_default
- paused
- do_not_contact
- outreach_attempt_count
- last_response_status
- next_action_at
- source_backend

### Filtres

- niche
- pays
- paused / actif
- do not contact
- priorité
- backend source
- statut réponse

### Actions

- voir fiche prospect
- pause / reprise
- do not contact
- voir historique d'envoi
- voir packs liés
- voir réponses audit

### Fiche prospect

Sections :

- identité
- coordonnées
- contexte métier
- historique outreach
- packs associés
- réponses audit
- notes internes

## Ecran 3 - Packs

### Source

Table `ai_prospecting_packs`

### Objectif

Visualiser les packs générés et leur cycle de vie.

### Colonnes minimales

- pack_id
- organization_name
- target_email
- status
- created_at
- approved_at
- sent_at
- audit_form_url
- recommended_offer
- recommended_use_case

### Filtres

- statut
- date
- organisation
- email

### Actions

- voir détail pack
- copier lien audit
- ouvrir questionnaire
- lire lettre exécutive
- voir payload brut
- voir pièces jointes

### Détail pack

Sections :

- résumé prospect
- statut approbation
- lien audit
- lettre exécutive
- recommandations
- artefacts
- payload JSON repliable

## Ecran 4 - Batchs V4

### Sources

- `prospecting_batch_runs`
- `prospecting_batch_run_items`

### Vue liste

Colonnes :

- run_label
- source_backend
- active_campaign_label
- active_niche_list_csv
- batch_fetch_limit
- daily_send_limit
- processed_count
- skipped_count
- status
- started_at
- completed_at

### Actions

- ouvrir batch
- voir dispatchés
- voir skips
- voir raisons de skip
- voir les prospects liés

### Ecran détail batch

Onglets :

1. Résumé
2. Dispatchés
3. Skips
4. Erreurs

### Résumé

- quotas
- niche active
- campagne active
- durée
- volumétrie

### Dispatchés

Liste des prospects avec :

- organization_name
- prospect_id
- batch_status
- pack_id si disponible

### Skips

Liste des prospects avec :

- organization_name
- batch_stop_reason
- niche_status
- process_decision

## Ecran 5 - Réponses audit

### Source

Table ou vue des réponses post-audit

### Colonnes minimales

- submitted_at
- organization_name
- pack_id
- completion_status
- assigned_expert
- summary

### Filtres

- date
- statut
- expert assigné
- organisation

### Actions

- ouvrir réponse
- voir le prospect
- voir le pack
- assigner expert
- marquer traité

### Détail réponse

Sections :

- résumé
- réponses brutes
- contexte prospect
- contexte pack
- recommandation de reprise

## Ecran 6 - Cas experts

### Objectif

Offrir un pipeline interne de traitement expert.

### Vue

Kanban ou table segmentée

Statuts :

- nouveau
- à analyser
- en cours
- en attente
- terminé

### Données minimales

- case_id
- organization_name
- assigned_expert
- priority
- next_action
- due_date
- status

### Actions

- assigner
- changer statut
- ajouter note
- ouvrir la réponse audit
- ouvrir le prospect
- ouvrir le pack

## Ecran 7 - Activité / Logs

### Objectif

Avoir une timeline opérationnelle.

### Sources possibles

- `outreach_attempts`
- `prospecting_batch_runs`
- `prospecting_batch_run_items`
- logs d'approbation
- événements de réponses audit

### Blocs

- derniers batchs
- derniers envois
- dernières validations
- derniers rejets
- dernières réponses
- erreurs récentes

## Ecran 8 - Administration

### Objectif

Configurer et diagnostiquer.

### Blocs

- configuration campagnes actives
- niches actives
- quotas journaliers
- mapping de statuts
- contrôle des rôles
- vue debug JSON
- état des connexions Supabase

### Actions

- modifier une campagne
- ajuster un quota
- voir les dernières erreurs
- inspecter un payload

## Règles d'UX

### Navigation

- sidebar stable
- topbar avec recherche
- navigation rapide entre objets liés

### Tables

- filtres visibles
- tri
- pagination
- export CSV si possible

### Détails

- drawer ou panneau latéral
- information dense mais claire

### Etats UI

- loading
- vide
- erreur
- succès

## Règles de sécurité

- accès protégé via Supabase Auth
- rôle admin : accès complet
- rôle commercial : prospects, packs, batchs, réponses
- rôle expert : réponses, cas, contexte prospect

## Données et relations à respecter

- un prospect peut avoir plusieurs packs
- un pack peut avoir plusieurs tentatives d'outreach
- un batch a plusieurs batch items
- une réponse audit doit pointer au minimum vers un pack

## Roadmap de réalisation recommandée

### Phase 1

- Vue d'ensemble
- Prospects
- Packs
- Batchs V4

### Phase 2

- Réponses audit
- Cas experts
- Activité

### Phase 3

- Administration avancée
- Rôles fins
- exports
- alertes temps réel

## Critères de réussite

Le cockpit est réussi si :

- un commercial peut savoir en moins de 5 minutes qui traiter
- un expert peut lire un cas complet sans changer d'outil
- un admin peut comprendre un batch V4 sans ouvrir n8n
- les liens entre prospect, pack, batch et réponse sont fluides
- l'équipe gagne réellement du temps opérationnel
