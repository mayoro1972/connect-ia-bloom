# Plan Concret de Dashboard Web Back Office Prospection

Date : 2026-06-08

## Objectif du document

Ce document décrit le plan concret d'un dashboard web "Back Office Prospection" permettant à une équipe commerciale ou experte de piloter en temps réel :

- les prospects entrants
- les prospects retenus par V4
- les packs en attente de validation
- les packs envoyés
- les réponses aux questionnaires
- les cas à reprendre par les experts

## Pourquoi ce dashboard est nécessaire

Aujourd'hui, l'information est répartie entre :

- `n8n`
- `Supabase`
- les emails
- `Google Sheets` via V6
- des composants du back-office web déjà existants

Cette architecture fonctionne, mais oblige les équipes à naviguer entre plusieurs outils.

Le dashboard proposé doit devenir la surface métier unique pour :

- le commercial
- l'expert
- le superviseur opérationnel

## Positionnement dans l'écosystème

Le dashboard ne remplace pas les workflows.

Il se branche au-dessus d'eux comme couche de supervision et d'action.

```text
V5 CRM -> V4 Batch -> V3 Approval/Send -> Post-Audit -> V6 Dashboard
                           |
                           -> Dashboard Web Back Office Prospection
```

## Utilisateurs cibles

## Profil 1 - Commercial

Le commercial veut :

- voir les prospects du jour
- comprendre qui a été envoyé
- voir qui n'a pas répondu
- lire les réponses pré-audit
- préparer les relances et rendez-vous

## Profil 2 - Expert

L'expert veut :

- voir les questionnaires reçus
- lire les briefs
- comprendre le contexte métier
- préparer les rendez-vous
- suivre les cas en attente

## Profil 3 - Ops / Admin

L'admin veut :

- voir les batchs V4
- voir les erreurs
- voir les envois V3
- voir les conflits de données
- corriger les statuts

## Architecture fonctionnelle du dashboard

Le dashboard doit être construit comme une application web avec plusieurs vues.

## Vue 1 - Accueil / Pilotage du jour

### Objectif

Donner la vision opérationnelle immédiate.

### Widgets

- nombre de prospects disponibles aujourd'hui
- nombre de prospects dispatchés par V4
- nombre de packs générés
- nombre de packs approuvés
- nombre de packs envoyés
- nombre de réponses questionnaire reçues
- nombre de cas à suivre par les experts

### Sources de données

- `prospect_targets`
- `prospecting_batch_runs`
- `prospecting_batch_run_items`
- `ai_prospecting_packs`
- `outreach_attempts`
- `form_responses`

## Vue 2 - File des prospects CRM

### Objectif

Permettre de lire la base active des prospects.

### Table principale

Colonnes proposées :

- organisation
- pays
- niche
- secteur
- statut
- pause
- do_not_contact
- nombre de tentatives
- dernier résultat
- prochaine action
- priorité commerciale
- source

### Filtres

- par niche
- par statut
- par pays
- par source
- par priorité
- par tentatives

### Actions

- mettre en pause
- réactiver
- marquer `do_not_contact`
- corriger la niche
- corriger la priorité

### Source de données

- `prospect_targets`

## Vue 3 - Batchs V4

### Objectif

Permettre de suivre les exécutions batch.

### Tableau batch

Colonnes proposées :

- `batch_run_label`
- niche active
- campagne active
- source backend
- limite quotidienne
- nombre traités
- nombre ignorés
- statut
- date de démarrage
- date de clôture

### Détail d'un batch

Pour chaque batch, afficher :

- prospect
- `process_decision`
- `batch_stop_reason`
- statut de dispatch
- `pack_id` éventuel

### Sources

- `prospecting_batch_runs`
- `prospecting_batch_run_items`

## Vue 4 - Packs à valider

### Objectif

Centraliser les packs générés mais non encore envoyés.

### Colonnes proposées

- organisation
- `pack_id`
- email cible
- niche
- date de génération
- statut d'approbation
- lien questionnaire
- présence des pièces jointes

### Actions

- ouvrir le pack
- ouvrir le mini-catalogue
- ouvrir le deck
- approuver
- rejeter
- demander une reprise

### Sources

- `ai_prospecting_packs`
- éventuellement journal d'approbation

### Bénéfice

Cette vue évite de dépendre uniquement des emails d'approbation.

## Vue 5 - Envois V3 / Outreach

### Objectif

Voir tous les envois réellement partis chez les prospects.

### Colonnes proposées

- organisation
- `pack_id`
- email cible
- date d'envoi
- résultat
- lien questionnaire
- lien Calendly

### Sources

- `outreach_attempts`
- `ai_prospecting_packs`

## Vue 6 - Réponses questionnaire / pré-audit

### Objectif

Donner au commercial et à l'expert une lecture directe des réponses reçues.

### Colonnes proposées

- organisation
- `pack_id`
- date de soumission
- niveau de maturité
- besoin principal
- urgence
- contraintes mentionnées
- contact de référence
- score / priorité expert

### Actions

- ouvrir la réponse complète
- ouvrir le brief expert
- assigner à un expert
- marquer "RDV planifié"
- marquer "à relancer"

### Sources

- `form_responses`
- sorties du workflow post-audit

## Vue 7 - Pipeline expert

### Objectif

Permettre à l'équipe experte de savoir quoi reprendre.

### Colonnes proposées

- organisation
- expert assigné
- statut du cas
- date réponse questionnaire
- date RDV
- next step
- note interne

### Sources

- workflow post-audit
- CRM enrichi
- éventuellement Google Sheets V6

## Vue 8 - Erreurs / supervision

### Objectif

Donner à l'admin une vue immédiate des anomalies.

### Panneaux proposés

- échecs V4 du jour
- échecs V3 du jour
- packs sans `pack_id`
- packs sans pièces jointes
- questionnaires non chargeables
- batchs incomplets

### Sources

- logs n8n
- tables Supabase

## Modèle de navigation recommandé

Le menu principal du dashboard pourrait être :

- `Accueil`
- `CRM Prospects`
- `Batchs V4`
- `Packs à valider`
- `Envois`
- `Réponses Audit`
- `Pipeline Expert`
- `Supervision`

## Actions temps réel à intégrer

Pour que le dashboard soit réellement utile, il doit permettre des actions, pas seulement de la lecture.

### Actions commerciales

- relancer un prospect
- changer le statut
- corriger l'email cible
- changer la niche
- repasser un prospect en file active

### Actions approbation

- approuver un pack
- rejeter un pack
- marquer besoin de reprise

### Actions expertes

- assigner un dossier
- programmer une relance
- marquer rendez-vous préparé

### Actions admin

- relancer un batch
- réinitialiser un prospect bloqué
- corriger un `pack_id`

## Tables et requêtes à brancher

## Tables cœur

- `prospect_targets`
- `prospecting_batch_runs`
- `prospecting_batch_run_items`
- `ai_prospecting_packs`
- `outreach_attempts`
- `form_responses`

## Requêtes clés

### Prospects du jour

Filtre sur :

- `status = ready`
- `paused = false`
- niche active éventuelle

### Packs à valider

Filtre sur :

- packs créés
- non envoyés
- approbation en attente

### Envois du jour

Filtre sur :

- `outreach_attempts.created_at = today`

### Réponses questionnaire

Filtre sur :

- réponses récentes
- réponses non encore assignées

## Éléments UI recommandés

## Cartes KPI

- sobres
- pilotage temps réel
- vues jour / semaine

## Tables filtrables

- recherche plein texte
- filtres niche / statut / expert
- tri par date et priorité

## Panneau détail latéral

Au clic sur un prospect, ouvrir un panneau avec :

- fiche CRM
- dernier pack
- dernier envoi
- dernier questionnaire

## Timeline d'activité

Pour chaque prospect, afficher :

- entrée CRM
- pack généré
- pack approuvé
- email envoyé
- questionnaire rempli
- expert assigné

## Ce qui existe déjà dans le front

Il existe déjà une route back-office dans l'application web :

- `/back-office`

et une page :

- `src/pages/BackOffice.tsx`

Ce dashboard proposé doit idéalement être construit comme une extension cohérente de ce back-office, plutôt que comme une application séparée.

## Roadmap de construction recommandée

## Phase 1 - Lecture seule

Construire d'abord :

- Accueil
- CRM Prospects
- Batchs V4
- Envois
- Réponses Audit

## Phase 2 - Actions métier

Ajouter :

- pause / reprise prospect
- correction niche
- marquage expert
- filtres enrichis

## Phase 3 - Approvals web

Ajouter :

- vue `Packs à valider`
- bouton approuver / rejeter depuis dashboard

## Phase 4 - Supervision complète

Ajouter :

- erreurs
- conflits de données
- reprise admin

## Recommandation finale

Le dashboard Back Office Prospection doit devenir le cockpit unique des équipes commerciales et expertes.

Le bon principe est :

- `Supabase` comme source de vérité
- `n8n` comme moteur d'orchestration
- `Back Office` comme surface métier
- `V6` comme vue complémentaire Google Sheets tant que le cockpit web n'est pas complet

## Résumé exécutif

Le dashboard cible doit permettre, dans une seule application web :

- lire les prospects entrants
- suivre les batchs V4
- valider les packs
- voir les envois prospect
- lire les réponses questionnaire
- préparer les experts
- superviser les erreurs

Une fois ce cockpit en place, les équipes n'auront plus besoin de naviguer en permanence entre emails, Supabase, n8n et Google Sheets pour piloter le flux commercial.
