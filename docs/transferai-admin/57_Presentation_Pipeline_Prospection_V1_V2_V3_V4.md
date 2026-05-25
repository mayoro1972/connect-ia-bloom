# Pipeline de Prospection IA TransferAI Africa
## Présentation complète — V1 → V2 → V3 → V4

**Projet :** TransferAI Africa — Système de prospection intelligente  
**Date :** 2026-05-23  
**Statut V1 :** Opérationnel et testé

---

## Vue d'ensemble du système

TransferAI Africa dispose d'un **pipeline de prospection IA automatisée** construit sur n8n et GPT-4.1-mini. L'objectif est de produire des prises de contact B2B de qualité, ciblées par secteur, sans spam, avec protection des données sensibles avant tout appel LLM.

Le système fonctionne en 4 versions progressives :

| Version | Nom | Statut | Capacité |
|---|---|---|---|
| **V1** | Prospect unique — Manuel | Opérationnel | 1 prospect à la fois, revue manuelle |
| **V2** | Prospect unique + Supabase + Email approbation | Prêt à configurer | 1 prospect, email d'approbation avant envoi |
| **V3** | Prospect unique + Envoi automatique après approbation | Prêt à configurer | 1 prospect, envoi automatique |
| **V4** | Batch quotidien multi-prospects | Prêt à configurer | 3 à 5 prospects/jour, entièrement automatisé |

---

## Ce que le système produit pour chaque prospect

Pour chaque entreprise analysée, le workflow génère un **pack commercial complet** :

- **Courrier exécutif** personnalisé (lettre de contact)
- **Mini-catalogue ciblé** selon le secteur détecté
- **Formulaire d'audit** adapté (à envoyer avant le RDV de 45 min)
- **Brief de deck** structuré (JSON prêt pour une présentation PowerPoint)
- **Analyse IA** : forces/faiblesses probables, niche d'entrée recommandée, ROI hypothétique, offre prioritaire

---

## PARTIE 1 — V1 : Prospect unique, exécution manuelle

### Cas d'usage

Le commercial identifie une entreprise cible, saisit ses informations dans le workflow, et reçoit en retour un pack complet prêt à être relu et envoyé.

---

### Architecture du workflow V1

```
Manual Trigger
    → Set Target (saisie prospect)
    → Build Source URLs (génère les 5 URLs à scraper)
    → Fetch Public Page 1 à 5 (scraping site web)
    → Normalize Public Signals (extraction texte + détection signaux)
    → Sanitize Prospect Data For LLM (pseudonymisation avant GPT)
    → Call OpenAI Pre-Audit (analyse organisation)
    → Call OpenAI Problems Solutions (problèmes + offres)
    → Call OpenAI ROI (hypothèses de gains)
    → Assemble Prospect Context (assemblage contexte complet)
    → Generate Executive Letter (rédaction courrier)
    → Generate Tailored Catalogue (catalogue personnalisé)
    → Generate Tailored Audit Form (formulaire d'audit)
    → Generate Deck Brief (brief PowerPoint)
    → Assemble Prospect Pack (pack final + hydratation noms réels)
    → Mark For Review (statut : prêt pour revue manuelle)
```

---

### Étapes détaillées — V1

#### Étape 1 — `Manual Trigger`
Point de départ manuel. Déclenche le workflow depuis le canvas n8n.

#### Étape 2 — `Set Target`
Nœud de saisie prospect. Contient les informations de l'entreprise cible.

Champs à renseigner :
- `website` — URL du site de l'entreprise (ex : `https://www.orange.ci`)
- `organization_name` — Nom de l'entreprise (ex : `Orange Côte d'Ivoire`)
- `organization_type` — Type d'organisation (ex : `Entreprise de télécommunications`)
- `sector_guess` — Secteur estimé (ex : `Télécommunications`)
- `country` — Pays (ex : `Côte d'Ivoire`)
- `decision_maker_name` — Nom ou titre du décideur (ex : `Directeur Général`)
- `prospect_id` — Identifiant unique (ex : `prospect-001`)
- `booking_link_45min` — Lien Calendly pour l'audit de 45 min
- `custom_page_paths_csv` — Pages spécifiques à scraper (optionnel)

#### Étape 3 — `Build Source URLs`
Génère les 5 URLs à scraper à partir du domaine. Par défaut scrape :
`/`, `/a-propos/`, `/services/`, `/solutions/`, `/contact/`

#### Étapes 4 à 8 — `Fetch Public Page 1 à 5`
Scraping HTTP des pages publiques. Les erreurs 404 sont ignorées (`neverError: true`). Retourne le HTML brut.

#### Étape 9 — `Normalize Public Signals`
Nettoie le HTML (supprime scripts, styles, balises). Détecte automatiquement les signaux métier :

- Support IT, Service client, Marketing, Workflow administratif
- Finance, RH, Santé, Banque/KYC, Logistique, Énergie, Formation

#### Étape 10 — `Sanitize Prospect Data For LLM`
**Protection des données avant tout envoi à GPT.** Remplace :
- Le nom de l'entreprise → `ORG_TARGET`
- Le nom du décideur → `DECISION_MAKER_TARGET`
- URLs, emails, téléphones → `[REDACTED]`

Seul le texte pseudonymisé est envoyé à OpenAI.

#### Étapes 11 à 13 — Appels OpenAI (3 en parallèle)
- **Pre-Audit** : résumé organisation, forces/faiblesses, niche d'entrée, score de confiance
- **Problems Solutions** : problèmes probables, offre recommandée, cas d'usage, priorité commerciale
- **ROI** : hypothèses de gains, délais de livraison, quick wins

#### Étape 14 — `Assemble Prospect Context`
Fusionne les 3 réponses OpenAI avec les signaux scraping. Produit un contexte prospect complet.

#### Étapes 15 à 18 — Génération des actifs (4 en parallèle)
- **Executive Letter** : courrier professionnel en français
- **Tailored Catalogue** : mini-catalogue 8 sections
- **Tailored Audit Form** : questionnaire pré-RDV
- **Deck Brief** : JSON structuré pour présentation

Les tokens `{{ORGANIZATION_NAME}}`, `{{DECISION_MAKER_NAME}}`, `{{WEBSITE}}` dans les textes générés sont remplacés par les vraies valeurs à l'étape suivante.

#### Étape 19 — `Assemble Prospect Pack`
Assemble le pack final. Réinjecte les noms réels (hydratation). Génère un `pack_id` unique.

#### Étape 20 — `Mark For Review`
Ajoute les champs `workflow_status: ready_for_manual_review` et `workflow_scope: multi_prospect`. Le commercial peut alors lire le pack et décider d'envoyer ou non.

---

### Guide d'utilisation V1

#### Prérequis
- Instance n8n opérationnelle
- Clé API OpenAI active via variable d'environnement (`OPENAI_API_KEY`)
- Fichier : `42_n8n_Prospection_Modele_Elton_V1_corrected.json`

#### Procédure de premier import
1. Dans n8n, cliquer `...` en haut à droite → **Import from file...**
2. Sélectionner `42_n8n_Prospection_Modele_Elton_V1_corrected.json`
3. Si des nœuds doublés apparaissent : `Ctrl+A` → `Delete` → réimporter
4. Cliquer **Execute workflow**

#### Changer de prospect
1. Ouvrir le nœud **`Set Target`**
2. Modifier les champs :
   - `website` → URL du nouveau prospect
   - `organization_name` → Nom de l'entreprise
   - `sector_guess` → Secteur
   - `decision_maker_name` → Nom ou titre
3. Cliquer **Save** dans le panneau du nœud
4. Cliquer **Execute workflow** sur le canvas

#### Lire les résultats
1. Cliquer sur le nœud **`Mark For Review`** (dernier nœud)
2. Onglet **Output** → **JSON**
3. Champs à consulter :
   - `executive_letter` — le courrier à envoyer
   - `tailored_catalogue` — le catalogue personnalisé
   - `tailored_audit_form` — le formulaire d'audit
   - `deck_brief` — le brief pour le deck (JSON)
   - `entry_point_niche` — la porte d'entrée recommandée
   - `recommended_offer` — l'offre à proposer
   - `approved_for_send` — `true` si le pack est complet

#### Niches ciblées et exemples entreprises CI

| Niche | Entreprise exemple | Website |
|---|---|---|
| Service client multicanal | MTN Côte d'Ivoire | `https://www.mtn.ci` |
| Banque / KYC / Compliance | SGBCI | `https://www.sgbci.ci` |
| Banque / KYC / Compliance | Ecobank CI | `https://www.ecobank.com` |
| Énergie / Industrie | CIE | `https://www.cie.ci` |
| Énergie / Industrie | PETROCI | `https://www.petroci.ci` |
| Santé / Télémédecine | PISAM | `https://www.pisam.ci` |
| Workflow administratif | CNPS | `https://www.cnps.ci` |
| Formation / Compétences | ISM Abidjan | `https://www.ism.ci` |
| Opérations terrain | Bolloré Logistics | `https://www.bollore-logistics.com` |

#### Limites de la V1
- Un seul prospect à la fois
- Aucun envoi automatique — copier-coller manuel du courrier
- Aucun stockage des résultats (pas de base de données)
- Aucun historique des prospects déjà contactés

---

## PARTIE 2 — V2 : Stockage Supabase + Email d'approbation interne

### Ce que la V2 ajoute à la V1

| Fonctionnalité | V1 | V2 |
|---|---|---|
| Génération du pack | Oui | Oui |
| Stockage Supabase | Non | **Oui** |
| Email d'approbation interne | Non | **Oui** |
| Envoi email au prospect | Non | **Oui (après approbation)** |
| Journal des contacts | Non | **Oui** |

### Architecture V2

```
[V1 complet jusqu'à Assemble Prospect Pack]
    → Store Pack In Supabase (sauvegarde dans ai_prospecting_packs)
    → Build Approval Email (construit l'email d'approbation)
    → Send Internal Approval Email (envoi à l'équipe TransferAI)

[Sur clic du lien dans l'email d'approbation]
    → Approval Webhook (reçoit la décision)
    → Parse Approval Query (lit la décision)
    → Get Pack From Supabase (récupère le pack)
    → Extract Pack Payload (décode le contenu)
    → If Approved ?
        → OUI → Mark Pack Approved → Send External Prospect Email → Log Outreach Attempt → Approval Success Response
        → NON → Mark Pack Rejected → Rejection Response
```

### Étapes supplémentaires V2

#### `Store Pack In Supabase`
Sauvegarde le pack complet dans la table `ai_prospecting_packs` de Supabase. Statut initial : `pending_approval`.

Champs stockés : `pack_id`, `prospect_id`, `organization_name`, `target_email`, `payload` (pack complet), `llm_redaction_summary`.

#### `Build Approval Email`
Construit un email HTML avec :
- Résumé du prospect analysé
- Extrait du courrier généré
- Deux boutons : **Approuver** / **Rejeter**
- Les boutons pointent vers l'URL du webhook n8n avec `pack_id` et `decision`

#### `Send Internal Approval Email`
Envoie l'email à l'adresse interne TransferAI via SMTP ou SendGrid.

#### `Approval Webhook`
URL publique n8n qui reçoit les clics sur les boutons Approuver/Rejeter. Doit être accessible depuis internet.

#### `If Approved`
Branche selon la décision reçue.

#### `Send External Prospect Email`
Si approuvé : envoie le courrier exécutif hydraté à `target_email` du prospect.

#### `Log Outreach Attempt`
Enregistre dans `outreach_attempts` : `prospect_id`, `pack_id`, `sent_at`, `channel: email`.

---

### Guide d'utilisation V2

#### Prérequis supplémentaires
- Compte **Supabase** avec les tables créées (voir `50_Schema_Supabase_Prospection_Multi_Prospects.md`)
- Compte email SMTP ou **SendGrid** pour l'envoi
- URL n8n accessible depuis internet (pour le webhook d'approbation)

#### Configuration des credentials n8n
1. Dans n8n → **Settings** → **Credentials**
2. Créer : `Supabase API` — renseigner URL et service role key
3. Créer : `SMTP` ou `SendGrid` — renseigner les identifiants email
4. Ouvrir chaque nœud HTTP qui appelle Supabase → mettre à jour l'URL et la clé

#### Procédure d'utilisation V2
1. Importer `43_n8n_Prospection_Modele_Elton_V2_Supabase_Approval_Email.json`
2. Configurer `Set Target` avec les données du prospect + `target_email`
3. Cliquer **Execute workflow**
4. Recevoir l'email d'approbation interne
5. Cliquer **Approuver** → le courrier est envoyé automatiquement au prospect
6. Cliquer **Rejeter** → le pack est marqué rejeté, rien n'est envoyé

#### Ajouter le champ `target_email`
Dans le nœud `Set Target`, ajouter un champ :
- Nom : `target_email`
- Valeur : adresse email du décideur (ex : `dg@orange.ci`)

---

## PARTIE 3 — V3 : Envoi automatique avec contrôle qualité

### Ce que la V3 ajoute à la V2

| Fonctionnalité | V2 | V3 |
|---|---|---|
| Email d'approbation | Oui | Oui |
| Vérification pré-envoi | Non | **Oui** |
| Confirmation d'envoi interne | Non | **Oui** |
| Gestion des erreurs d'approbation | Non | **Oui** |
| Prêt pour être appelé par V4 | Partiel | **Oui (Execute Workflow Trigger)** |

### Architecture V3 (ajouts vs V2)

```
[Après If Approved]
    → Build Send Context (vérifie que le pack est complet)
    → If Ready To Send ?
        → OUI → Mark Pack Approved → Send External Prospect Email
                → Parse Send Result → Mark Pack Sent
                → Log Outreach Attempt → Send Internal Sent Confirmation
        → NON → Mark Pack Approval Error → Approval Error Response
```

### Étapes supplémentaires V3

#### `Build Send Context`
Vérifie avant envoi :
- `target_email` est renseigné
- `executive_letter` n'est pas vide
- `organization_name` est présent
- `approved_for_send` est `true`

#### `If Ready To Send`
Bloque l'envoi si une condition manque. Évite les envois incomplets.

#### `Parse Send Result`
Analyse le résultat de l'envoi email (succès, rebond, erreur SMTP).

#### `Mark Pack Sent`
Met à jour le statut du pack dans Supabase : `sent`. Enregistre `sent_at`.

#### `Send Internal Sent Confirmation`
Envoie un email de confirmation à l'équipe TransferAI avec le résumé de l'envoi.

#### `Mark Pack Approval Error`
Si le pack était incomplet au moment de l'approbation, marque le statut `approval_error` dans Supabase.

---

### Guide d'utilisation V3

#### Prérequis
Même que V2.

#### Différence d'utilisation vs V2
La V3 est conçue pour être **appelée par la V4**. Elle s'exécute via le nœud `Execute Workflow Trigger` (pas seulement le `Manual Trigger`).

#### Procédure
1. Importer `44_n8n_Prospection_Modele_Elton_V3_Approval_AutoSend.json`
2. Activer le workflow (bouton toggle en haut)
3. Noter l'ID du workflow V3 (visible dans l'URL n8n)
4. Ce workflow est prêt à recevoir des prospects de la V4

#### Test manuel V3
1. Ouvrir le workflow V3
2. Modifier `Set Target` avec les données d'un prospect
3. Cliquer **Execute workflow** depuis le `Manual Trigger`
4. Suivre le flux jusqu'à réception de l'email d'approbation
5. Approuver → vérifier la confirmation d'envoi

---

## PARTIE 4 — V4 : Batch quotidien multi-prospects

### Ce que la V4 apporte

La V4 est le **chef d'orchestre** du pipeline. Elle ne génère pas de packs — elle gère la file d'attente des prospects, applique les règles métier, et envoie les prospects éligibles vers la V3.

| Fonctionnalité | V3 | V4 |
|---|---|---|
| Un prospect à la fois | Oui | Non — **file complète** |
| Déclenchement automatique | Non | **Oui — planifié quotidiennement** |
| Quotas journaliers | Non | **Oui — 3 à 5 par jour** |
| Règles d'arrêt | Non | **Oui — do_not_contact, paused, stop_reason** |
| Sources multiples | Non | **Google Sheets, Airtable, Supabase** |
| Rapport de batch | Non | **Oui** |

### Architecture V4

```
Daily Schedule Trigger (ou Manual Trigger)
    → Set Batch Config (paramètres du batch)
    → Fetch Today Outreach Count (compte les envois du jour)
    → Create Batch Run (crée un enregistrement du run)
    → If Supabase Source ?
        → Fetch Prospects From Supabase → Normalize Supabase Prospects
    → If Airtable Source ?
        → Fetch Prospects From Airtable → Normalize Airtable Prospects
    → Fetch Prospects From Google Sheets CSV → Normalize Google Sheets Prospects
    → Build Eligible Prospect Queue (applique les règles d'arrêt)
    → For each prospect :
        → If Prospect Eligible ?
            → OUI → Execute Prospect Workflow V3 → Mark Dispatched To V3
            → NON → Mark Skipped In Batch
    → Merge Batch Outcomes
    → Build Batch Summary
    → Log Processed Batch Item / Log Skipped Batch Item
    → Finalize Batch Run
```

### Paramètres batch recommandés

Dans le nœud `Set Batch Config` :

| Paramètre | Valeur recommandée | Description |
|---|---|---|
| `source_backend` | `supabase` | Source de prospects |
| `batch_fetch_limit` | `25` | Prospects à charger par run |
| `daily_send_limit` | `5` | Maximum d'envois par jour |
| `max_attempts_per_prospect` | `3` | Tentatives max avant arrêt |
| `min_confidence_score` | `0.45` | Score IA minimum pour envoi |

### Règles d'arrêt automatiques

Un prospect est **bloqué** si :
- `do_not_contact = true` — opposition exprimée
- `paused = true` — mis en pause manuellement
- `stop_reason` est renseigné — règle d'arrêt déjà déclenchée
- `outreach_attempt_count >= 3` — trop de tentatives
- `last_response_status = interested / meeting_booked / not_interested / unsubscribed`
- Quota journalier atteint

### Sources de prospects supportées

#### Google Sheets (démarrage rapide)
1. Copier le template `52_Template_CSV_Google_Sheets_100_Prospects.csv` dans Google Sheets
2. Remplir les colonnes : `organization_name`, `website`, `target_email`
3. Publier le Sheet en CSV public
4. Coller l'URL CSV dans `Set Batch Config` → `google_sheets_csv_url`

#### Airtable
1. Créer une base avec les colonnes du format canonique prospect
2. Créer une vue `ready` filtrée sur `paused = false` et `do_not_contact = false`
3. Renseigner `airtable_api_key`, `airtable_base_id`, `airtable_table_name`, `airtable_ready_view`

#### Supabase (recommandé pour la production)
1. Appliquer la migration SQL `20260522160000_create_ai_multi_prospecting_pipeline.sql`
2. Insérer les prospects dans la table `prospect_targets`
3. Renseigner `supabase_url` et `supabase_service_role_key`

---

### Guide d'utilisation V4

#### Prérequis
- V3 importée, activée, et son ID noté
- Source de prospects configurée (Google Sheets, Airtable ou Supabase)
- Tables Supabase créées pour le journal des runs

#### Configuration
1. Importer `47_n8n_Prospection_Multi_Prospect_V4_Batch.json`
2. Dans `Set Batch Config` → renseigner :
   - `source_backend` : `google_sheets`, `airtable` ou `supabase`
   - `daily_send_limit` : `5` (recommandé)
   - `N8N_CHILD_WORKFLOW_ID_V3` : ID du workflow V3
3. Configurer le `Daily Schedule Trigger` : heure d'exécution quotidienne (ex : 08h00)
4. Activer le workflow

#### Remplir la liste de prospects
Utiliser le template `53_Template_CSV_Google_Sheets_Prospects.md` pour créer la liste. Colonnes minimales à remplir :
- `prospect_id`, `organization_name`, `website`, `target_email`

#### Suivi des résultats
- Dans Supabase → table `ai_prospecting_packs` : tous les packs générés
- Dans Supabase → table `outreach_attempts` : tous les envois journalisés
- Dans n8n → onglet **Executions** : historique de chaque run V4

---

## Récapitulatif des fichiers du projet

| Fichier | Description |
|---|---|
| `42_n8n_Prospection_Modele_Elton_V1_corrected.json` | Workflow V1 opérationnel |
| `43_n8n_Prospection_Modele_Elton_V2_Supabase_Approval_Email.json` | Workflow V2 |
| `44_n8n_Prospection_Modele_Elton_V3_Approval_AutoSend.json` | Workflow V3 |
| `47_n8n_Prospection_Multi_Prospect_V4_Batch.json` | Workflow V4 Batch |
| `50_Schema_Supabase_Prospection_Multi_Prospects.md` | Schéma base Supabase |
| `51_Commandes_Supabase_Migration_Seed_Et_Premier_Batch.md` | Migration SQL Supabase |
| `52_Template_CSV_Google_Sheets_100_Prospects.csv` | Template liste prospects |
| `53_Template_CSV_Google_Sheets_Prospects.md` | Guide remplissage CSV |
| `48_Brancher_Sources_Prospects_GoogleSheets_Airtable_Supabase.md` | Guide connexion sources |
| `49_Guide_V4_Batch_Quotas_Stop_Rules.md` | Règles batch V4 |

---

## Ordre de déploiement recommandé

```
[FAIT] V1 — Tester avec 5 à 10 entreprises CI manuellement
          ↓
[NEXT] V2 — Configurer Supabase + SMTP, tester email d'approbation
          ↓
        V3 — Activer l'envoi automatique post-approbation
          ↓
        V4 — Brancher Google Sheets avec 50 prospects, planifier à 08h00
          ↓
        Suivi — Lire les résultats dans Supabase, ajuster les quotas
```

---

*Document généré le 2026-05-23 — TransferAI Africa*
