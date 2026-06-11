# Schéma d'Architecture Fonctionnelle - Versions V1 à V6

Date : 2026-06-08

## Objectif du document

Ce document explique, de manière opérationnelle, comment les différentes versions des workflows TransferAI Prospecting s'enchaînent, à quoi elles servent, quelles données elles manipulent et comment un commercial, un expert métier ou un administrateur doit les comprendre pour travailler efficacement.

## Lecture rapide

- `V1` : prototype manuel pour générer un pack prospect unitaire.
- `V2` : version single-prospect avec stockage Supabase et demande d'approbation interne.
- `V3` : version single-prospect avec approbation puis envoi automatique au prospect.
- `V4` : orchestrateur batch quotidien multi-prospects qui sélectionne les prospects à traiter et délègue à V3.
- `V5` : growth loop CRM qui alimente et enrichit la base de prospects.
- `Workflow Post-Audit` : workflow qui traite les réponses au questionnaire et prépare le suivi expert.
- `V6` : synchronisation Google Sheets / dashboard post-audit.

## Vision d'ensemble

Le système fonctionne comme une chaîne de valeur commerciale :

1. alimenter et nettoyer le CRM
2. choisir les prospects prioritaires du jour
3. générer un pack personnalisé
4. faire valider le pack
5. envoyer le pack au prospect
6. collecter la réponse questionnaire
7. préparer le suivi expert et le rendez-vous
8. afficher les données consolidées dans un dashboard métier

## Architecture fonctionnelle globale

```text
V5 Growth Loop CRM
    -> prospect_targets (CRM master)
    -> V4 Batch Orchestrator
    -> V3 Approval + Auto-Send
    -> ai_prospecting_packs / outreach_attempts
    -> Questionnaire Audit
    -> Workflow Post-Audit
    -> V6 Dashboard Google Sheets
```

## Les objets de données centraux

### `prospect_targets`

Table CRM maître.

Contient notamment :

- l'identité de l'organisation
- la niche commerciale
- le statut de traitement
- les pauses / opt-out
- le nombre de tentatives d'outreach
- les métadonnées de qualification et de priorité

### `ai_prospecting_packs`

Historique des packs générés.

Contient notamment :

- `pack_id`
- contenu du pack
- lettre exécutive
- artefacts joints
- `audit_form_url`
- payload stocké

### `outreach_attempts`

Historique des envois aux prospects.

Permet de savoir :

- qui a reçu quoi
- quand
- avec quel `pack_id`
- avec quel résultat

### `prospecting_batch_runs`

Journal de chaque batch V4.

Contient :

- le label de batch
- la niche active
- les quotas
- le nombre traité / ignoré
- le statut final du batch

### `prospecting_batch_run_items`

Détail prospect par prospect d'un batch V4.

Contient :

- `batch_run_id`
- `prospect_id`
- décision de traitement
- raison d'exclusion
- statut de dispatch

### `form_responses` et données post-audit

Ensemble des données de réponse au questionnaire, utilisées ensuite pour le suivi commercial et expert.

## Description version par version

## V1 - Prototype manuel

### Rôle

V1 est la première version, construite pour démontrer qu'un prospect peut recevoir un pack personnalisé.

### Caractéristiques

- traitement d'un seul prospect à la fois
- peu de persistance
- logique principalement manuelle

### Usage actuel

V1 n'est plus la version d'exploitation. Elle reste utile pour comprendre l'origine du système et pour certains tests unitaires.

## V2 - Single prospect avec approbation interne

### Rôle

V2 structure le flux single-prospect avec stockage en base et email interne d'approbation.

### Ce qu'elle ajoute

- stockage Supabase des packs
- génération d'un email interne d'approbation
- traçabilité plus propre

### Logique métier

1. créer le pack
2. stocker le pack
3. envoyer une demande d'approbation interne
4. attendre la décision

### Usage actuel

V2 est surtout utile comme base historique de compréhension. Dans l'exploitation actuelle, V3 l'a largement dépassée.

## V3 - Approval + Auto-Send

### Rôle

V3 est la version de production single-prospect qui gère :

- la génération du pack
- l'approbation
- l'envoi final au prospect
- les notifications internes

### Logique métier

1. récupérer le prospect
2. générer les artefacts
3. assembler le pack
4. stocker le pack dans Supabase
5. envoyer l'email d'approbation
6. traiter le clic d'approbation via webhook
7. envoyer le pack au prospect
8. journaliser l'outreach
9. notifier l'interne que le pack a été envoyé

### Tables touchées

- `ai_prospecting_packs`
- `outreach_attempts`

### Importance

V3 est le moteur d'exécution final. Quand V4 décide qu'un prospect doit partir aujourd'hui, c'est V3 qui fait réellement le travail d'envoi.

## V4 - Batch multi-prospects

### Rôle

V4 orchestre le traitement quotidien de plusieurs prospects.

### Ce qu'elle fait

- lit le CRM source
- applique les règles de niche active
- applique les quotas du jour
- choisit les prospects à traiter
- crée un `batch_run`
- délègue chaque prospect sélectionné à V3
- loggue les prospects ignorés
- produit un résumé de batch

### Logique métier

1. charger la configuration du batch
2. compter les outreach déjà envoyés aujourd'hui
3. créer le batch run
4. lire la source prospects
5. normaliser les données
6. enrichir avec le contexte batch
7. décider `process_now` ou `skip`
8. appeler V3 pour les prospects retenus
9. logguer le résultat
10. clôturer le batch

### Tables touchées

- `prospecting_batch_runs`
- `prospecting_batch_run_items`
- indirectement `ai_prospecting_packs` et `outreach_attempts` via V3

### Importance

V4 est l'orchestrateur du jour. C'est la couche qui transforme un CRM brut en travail commercial réellement exécutable.

## V5 - CRM Growth Loop

### Rôle

V5 nourrit et enrichit le CRM.

### Ce qu'elle fait

- ingère des leads
- normalise les formats
- enrichit les données
- upsert vers `prospect_targets`
- prépare un stock de prospects qualifiés pour V4

### Importance

Sans V5, V4 dépend d'une base CRM peu vivante. V5 est la couche de croissance qui fait entrer en continu de nouveaux prospects exploitables.

## Workflow Post-Audit

### Rôle

Ce workflow se déclenche après qu'un prospect remplit son questionnaire.

### Ce qu'il fait

- lit le `pack_id`
- récupère le pack et le contexte
- lit les réponses du formulaire
- prépare un brief interne pré-rendez-vous
- met à jour le CRM avec les informations recueillies
- route le cas vers les experts

### Importance

Cette couche transforme un simple envoi d'email en une vraie démarche commerciale consultative, avec intelligence métier derrière.

## V6 - Dashboard Google Sheets

### Rôle

V6 pousse les informations post-audit vers un dashboard plus lisible pour les équipes métier.

### Ce qu'elle fait

- synchronise les réponses
- consolide des informations de suivi
- peut alimenter des vues Google Sheets pour pilotage commercial ou expert

### Importance

V6 est aujourd'hui la couche dashboard métier la plus directement exploitable par des équipes non techniques.

## Interconnexion détaillée

## Chaîne de production commerciale

### Étape 1 - Enrichissement du stock de prospects

`V5 -> prospect_targets`

### Étape 2 - Priorisation quotidienne

`V4 -> lecture de prospect_targets -> sélection`

### Étape 3 - Production du pack

`V4 -> V3`

### Étape 4 - Validation interne

`V3 -> email d'approbation -> approval webhook`

### Étape 5 - Envoi au prospect

`V3 -> Send External Prospect Email`

### Étape 6 - Réponse du prospect

`Questionnaire audit -> Workflow Post-Audit`

### Étape 7 - Vue métier consolidée

`Workflow Post-Audit -> V6 Google Sheets Dashboard`

## Ce que voit un commercial

Un commercial exploite principalement :

- `prospect_targets` pour savoir qui est dans le pipeline
- `ai_prospecting_packs` pour vérifier quels packs existent
- `outreach_attempts` pour savoir ce qui a été envoyé
- les emails d'approbation pour valider les packs
- le dashboard V6 pour lire les retours questionnaire

## Ce que voit un expert

Un expert exploite principalement :

- le workflow post-audit
- les briefs pré-rendez-vous
- les réponses formulaire
- le dashboard V6

## Ce que voit un administrateur

Un administrateur suit surtout :

- `n8n` pour l'état d'exécution
- `Supabase` pour l'intégrité des données
- les logs batch V4
- les erreurs de routage post-audit

## Limites actuelles

Le système est puissant, mais il n'existe pas encore un cockpit web unique couvrant :

- sélection batch V4
- validation V3
- lecture des réponses questionnaire
- suivi des experts

Aujourd'hui, ces vues sont réparties entre :

- `n8n`
- `Supabase`
- `Google Sheets V6`
- certains écrans du back-office web

## Recommandation stratégique

La prochaine brique logique n'est pas un nouveau workflow. C'est un vrai cockpit web unifié "Back Office Prospection" qui centralise :

- les prospects à traiter
- les packs à valider
- les packs envoyés
- les batchs en cours
- les réponses au questionnaire
- les cas à reprendre par les experts

## Résumé exécutif

- `V1` a prouvé le concept
- `V2` a structuré la validation
- `V3` exécute réellement l'envoi
- `V4` orchestre les lots multi-prospects
- `V5` alimente le CRM
- `Post-Audit` traite les réponses
- `V6` donne une lecture dashboard métier

L'écosystème actuel est donc déjà exploitable, mais distribué sur plusieurs surfaces. Le prochain gain de productivité viendra d'un dashboard web unifié branché sur Supabase.
