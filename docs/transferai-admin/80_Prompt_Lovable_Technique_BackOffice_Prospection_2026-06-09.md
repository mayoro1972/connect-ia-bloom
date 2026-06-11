# Prompt Lovable Technique - Back Office Prospection TransferAI

Date : 2026-06-09

## Objectif

Ce document fournit un prompt Lovable très technique pour générer un vrai cockpit web unifié "Back Office Prospection" connecté à Supabase, aligné avec l'architecture V3 / V4 / V5 / Post-Audit / V6 déjà en place.

Le prompt est conçu pour :

- créer une application métier exploitable
- se connecter directement à Supabase
- structurer les vues autour des tables existantes
- préparer une base de code maintenable
- permettre une reprise propre par un développeur

## Prompt Lovable technique prêt à copier-coller

```text
Construis une application web full-stack appelée “Back Office Prospection TransferAI”, connectée à Supabase, destinée à une équipe commerciale, une équipe experte et une équipe ops/admin.

OBJECTIF
Créer un cockpit opérationnel unifié qui centralise :
1. les prospects à traiter
2. les packs à valider
3. les packs envoyés
4. les batchs V4 en cours et historiques
5. les réponses au questionnaire d’audit
6. les cas à reprendre par les experts
7. l’activité et les alertes opérationnelles

STACK
- Frontend moderne, design back-office premium
- Connexion native à Supabase
- Auth Supabase
- RLS-ready
- Architecture modulaire, typed, maintenable
- Prévoir une intégration future avec n8n sans dépendre de n8n pour l’affichage
- Application desktop-first

ROLE MODEL
Prévoir des rôles :
- admin
- commercial
- expert

CAPACITES ATTENDUES
- lecture en temps réel ou quasi temps réel des données Supabase
- filtres puissants
- tableaux métier
- fiches détail
- actions rapides
- activité récente
- alertes de blocage

BASE DE DONNEES SUPABASE - TABLES A CONNECTER

1. prospect_targets
Usage : CRM actif des prospects à traiter
Colonnes importantes :
- id
- prospect_id
- organization_name
- website
- country
- organization_type
- sector_guess
- decision_maker_name
- target_email
- custom_page_paths_csv
- booking_link_45min
- commercial_priority_default
- research_scope
- source_backend
- raw_source_id
- outreach_attempt_count
- last_response_status
- last_sequence_result
- stop_reason
- paused
- do_not_contact
- niche_status
- next_action_at
- created_at
- updated_at

2. ai_prospecting_packs
Usage : packs générés / approbation / audit form
Colonnes importantes :
- id
- pack_id
- prospect_id
- organization_name
- target_email
- audit_form_url
- recommended_offer
- recommended_use_case
- executive_letter
- executive_letter_html
- payload
- status
- created_at
- approved_at
- sent_at

3. outreach_attempts
Usage : historique des emails envoyés / relances / statuts outreach
Colonnes importantes :
- id
- prospect_id
- pack_id
- organization_name
- target_email
- sent_at
- delivery_status
- response_status
- sequence_result
- notes

4. prospecting_batch_runs
Usage : suivi des batchs V4
Colonnes importantes :
- id
- run_label
- source_backend
- source_snapshot
- batch_fetch_limit
- daily_send_limit
- max_attempts_per_prospect
- min_confidence_score
- active_niche_list_csv
- active_campaign_label
- processed_count
- skipped_count
- status
- started_at
- completed_at
- failure_reason
- created_at
- updated_at

5. prospecting_batch_run_items
Usage : détail des items d’un batch V4
Colonnes importantes :
- id
- batch_run_id
- prospect_id
- pack_id
- organization_name
- website
- process_decision
- batch_status
- batch_stop_reason
- active_campaign_label
- niche_status
- created_at

6. tables de reponses questionnaire / post-audit
Si les noms exacts diffèrent, construire une couche d’adaptation simple.
Champs fonctionnels attendus :
- response_id
- pack_id
- prospect_id
- organization_name
- submitted_at
- completion_status
- summary
- raw_payload
- assigned_expert
- expert_status

RELATIONS LOGIQUES A PREVOIR DANS L'UI
- un prospect_targets.prospect_id peut avoir plusieurs ai_prospecting_packs.prospect_id
- un ai_prospecting_packs.pack_id peut avoir plusieurs outreach_attempts.pack_id
- un prospecting_batch_runs.id peut avoir plusieurs prospecting_batch_run_items.batch_run_id
- un prospecting_batch_run_items.prospect_id renvoie vers prospect_targets.prospect_id
- les réponses audit se rattachent au minimum à pack_id, idéalement aussi à prospect_id

NAVIGATION
Créer un layout application avec sidebar + topbar.
Menus :
1. Vue d’ensemble
2. Prospects
3. Packs
4. Batchs V4
5. Réponses audit
6. Cas experts
7. Activité / logs
8. Administration

VUE D’ENSEMBLE
Widgets KPI :
- prospects prêts
- packs à valider
- packs envoyés aujourd’hui
- batchs actifs
- réponses audit non traitées
- cas experts ouverts

Ajouter :
- tableau prospects prioritaires
- tableau packs en attente d’approbation
- derniers batchs
- dernières réponses audit
- alertes blocantes

VUE PROSPECTS
Brancher sur prospect_targets.
Fonctionnalités :
- recherche plein texte
- filtres : niche_status, country, paused, do_not_contact, last_response_status, source_backend, commercial_priority_default
- tri : next_action_at, organization_name, updated_at
- fiche prospect détaillée
- historique des packs
- historique outreach
- action pause / reprise
- action do not contact
- action ouvrir les réponses audit si disponibles

VUE PACKS
Brancher sur ai_prospecting_packs.
Fonctionnalités :
- filtre par statut
- filtre par date
- recherche par organization_name, pack_id, target_email
- drawer de détail
- affichage de la lettre
- affichage du payload technique en JSON repliable
- bouton ouvrir audit_form_url
- bouton copier lien
- bouton voir pièces jointes si disponibles

VUE BATCHS V4
Brancher sur prospecting_batch_runs et prospecting_batch_run_items.
Fonctionnalités :
- liste des batch runs
- détail d’un batch
- onglet résumé
- onglet dispatchés
- onglet skips
- agrégation des skip reasons
- filtre par run_label, active_campaign_label, status

VUE REPONSES AUDIT
Vue orientée exploitation métier.
Fonctionnalités :
- liste des réponses reçues
- filtres date / statut / expert assigné
- détail complet de la réponse
- lien vers prospect
- lien vers pack
- action assigner expert
- action marquer traité

VUE CAS EXPERTS
Créer un pipeline interne :
- nouveau
- à analyser
- en cours
- en attente
- terminé

Chaque cas doit afficher :
- organisation
- expert assigné
- priorité
- prochaine action
- date d’échéance
- notes internes

VUE ACTIVITE / LOGS
Consolider :
- derniers envois
- derniers batchs
- dernières approbations
- derniers rejets
- derniers questionnaires reçus

VUE ADMINISTRATION
Prévoir :
- configuration de campagnes
- visualisation des niches actives
- contrôle des quotas journaliers
- vue de debug JSON
- gestion rôles utilisateurs
- état des connexions Supabase

AUTH
- login Supabase
- accès protégé
- filtrer les actions selon les rôles

DESIGN
Je veux un design de back-office B2B :
- élégant
- très lisible
- cartes nettes
- tableaux denses mais clairs
- badges de statut
- couleurs sobres
- excellente hiérarchie visuelle
- pas de style landing page

TECHNIQUE
- séparer composants, hooks, services, types
- créer des composants réutilisables :
  - data table
  - filter bar
  - stat card
  - detail drawer
  - status badge
  - activity list
- prévoir pagination / lazy loading
- prévoir états loading / error / empty
- types clairs pour les tables

LIVRABLE
Je veux une vraie base applicative exploitable, pas une simple démo :
- pages réelles
- navigation réelle
- vraies requêtes Supabase
- structure maintenable
- écrans prêts à itérer dans GitHub

PHASE 1 PRIORITAIRE
Commencer par connecter réellement :
1. Vue d’ensemble
2. Prospects
3. Packs
4. Batchs V4

PHASE 2
Préparer ensuite :
5. Réponses audit
6. Cas experts
7. Activité
8. Administration
```

## Instructions complémentaires à envoyer juste après à Lovable

```text
Commence par générer la structure complète du back-office puis branche en priorité les vues :
- Vue d’ensemble
- Prospects
- Packs
- Batchs V4

Fais des composants réutilisables pour tableaux, badges, KPI et drawers.
Prépare les vues Réponses audit et Cas experts avec des interfaces déjà présentes, même si certaines tables doivent encore être confirmées.
```

## Recommandation d'utilisation

Le plus efficace est de travailler en trois passes :

1. génération du squelette complet du back-office
2. connexion réelle des tables Supabase principales
3. finition UX / rôles / admin / activité

## Ce qu'il faudra vérifier après génération

- que les tables Supabase utilisées correspondent bien aux vrais noms
- que les relations prospect / pack / batch sont bien lisibles dans l'UI
- que les statuts sont cohérents avec les workflows n8n
- que l'app protège bien les écrans via Auth
- que les gros tableaux restent rapides
