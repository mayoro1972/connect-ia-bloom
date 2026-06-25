# Guide d'utilisation et de dépannage — Workflows de Prospection TransferAI

**Projet :** TransferAI Africa — Système CRM de prospection automatisée  
**Dernière mise à jour :** 25 juin 2026  
**Environnements :** n8n (orchestration), Supabase (base de données), Resend (emails), Netlify (frontend)

---

## Table des matières

1. [Vue d'ensemble de l'architecture](#1-vue-densemble)
2. [Workflow V3 — Envoi d'email individuel](#2-workflow-v3)
3. [Workflow V4 — Orchestrateur de batch](#3-workflow-v4)
4. [Workflow V5 — CRM Growth Loop](#4-workflow-v5)
5. [Formulaire d'audit — ProspectAuditFormPage](#5-formulaire-daudit)
6. [Tables Supabase impliquées](#6-tables-supabase)
7. [Guide de dépannage](#7-guide-de-dépannage)
8. [Checklist de vérification](#8-checklist-de-vérification)

---

## 1. Vue d'ensemble

### Schéma de fonctionnement global

```
[Google Sheet public CSV]
         ↓
   [V5 — CRM Growth Loop]
   Lit le CSV → normalise → insère dans prospect_targets → déclenche V4
         ↓
   [V4 — Batch Orchestrator]
   Récupère les prospects éligibles → crée les packs IA → déclenche V3 pour chacun
         ↓
   [V3 — Envoi email individuel]
   Génère l'email personnalisé → envoie via Resend → journalise dans outreach_attempts
         ↓
   [Prospect reçoit l'email]
   Clique sur le lien d'audit → accède au formulaire TransferAI
         ↓
   [Formulaire d'audit]
   Authentification → affichage du questionnaire personnalisé → soumission
```

### Rôle de chaque workflow

| Workflow | Rôle | Déclencheur |
|----------|------|-------------|
| V3 | Envoyer un email de prospection à un prospect individuel | Appelé par V4 (sous-workflow) |
| V4 | Orchestrer l'envoi en batch pour plusieurs prospects | Appelé par V5, ou manuellement |
| V5 | Lire une source CSV externe et alimenter V4 | Planifié quotidiennement ou manuellement |

---

## 2. Workflow V3 — Envoi d'email individuel

**Fichier :** `73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json`  
**Nom dans n8n :** TransferAI Prospecting V3 CRM Enhanced

### Objectif

Ce workflow envoie un email de prospection personnalisé à un seul prospect. Il est conçu pour être appelé en tant que sous-workflow par V4. Il peut aussi être déclenché manuellement pour des tests.

### Nœuds principaux et leur rôle

#### 1. `When Called by Another Workflow` (déclencheur)
- **Rôle :** Point d'entrée quand V4 appelle V3 pour un prospect.
- **Données attendues en entrée :**
  - `prospect_id` — identifiant du prospect dans `prospect_targets`
  - `pack_id` — identifiant du pack IA dans `ai_prospecting_packs`
  - `organization_name` — nom de l'organisation cible
  - `target_email` — adresse email du destinataire
  - `audit_form_base_url` — URL de base du formulaire d'audit
  - `booking_link_45min` — lien de prise de rendez-vous

#### 2. `Build Send Context`
- **Rôle :** Consolide et prépare toutes les données nécessaires à la génération de l'email (nom, secteur, lien d'audit, lien de RDV, etc.).
- **Point d'attention :** C'est le nœud de référence pour les données prospect. Tous les nœuds suivants lisent depuis `$('Build Send Context').first().json`.

#### 3. `Generate AI Email Content` (appel OpenAI / Claude)
- **Rôle :** Génère le contenu de l'email personnalisé en fonction du secteur, du nom de l'organisation et du contexte fourni.
- **Configuration :** Utilise le modèle IA configuré dans les credentials n8n.

#### 4. `Mark Pack Sent` (HTTP Request → Supabase PATCH)
- **Rôle :** Met à jour le statut du pack IA dans la table `ai_prospecting_packs` (champ `status` → `sent`).
- **Point d'attention :** Ce nœud retourne la réponse Supabase, pas les données prospect. Ne pas lire `$json` ici pour les informations du prospect.

#### 5. `Send External Prospect Email` (HTTP Request → Resend API)
- **Rôle :** Envoie l'email via l'API Resend.
- **Sortie :** `{ "id": "re_xxxxxxxxx" }` — l'ID Resend du message envoyé.
- **Configuration requise :** API Key Resend dans les credentials n8n.

#### 6. `Log Outreach Attempt` (HTTP Request → Supabase INSERT)
- **Rôle :** Journalise l'envoi dans la table `outreach_attempts`.
- **Configuration critique :** Le corps JSON doit lire les données depuis `$('Build Send Context').first().json`, pas depuis `$json` (qui serait la réponse Resend ou Supabase).

**Corps JSON correct :**
```json
={{JSON.stringify({
  prospect_id: $('Build Send Context').first().json.prospect_id || null,
  pack_id: $('Build Send Context').first().json.pack_id || null,
  organization_name: $('Build Send Context').first().json.organization_name || null,
  target_email: $('Build Send Context').first().json.target_email || null,
  channel: 'email',
  message_variant: 'executive_multi_prospect_model_v3',
  sent_at: new Date().toISOString(),
  delivery_status: 'submitted',
  response_status: 'pending',
  follow_up_due_at: new Date(Date.now() + 5 * 86400000).toISOString(),
  stop_reason: null,
  resend_message_id: $('Send External Prospect Email').first().json.id || null
})}}
```

### Données produites

- Un email envoyé au prospect via Resend
- Une ligne insérée dans `outreach_attempts` avec `organization_name`, `target_email`, `resend_message_id`
- Le pack IA marqué comme `sent` dans `ai_prospecting_packs`

---

## 3. Workflow V4 — Orchestrateur de batch

**Fichier :** `66_n8n_Prospection_CRM_V4_Exportable.json`  
**Nom dans n8n :** TransferAI Prospecting CRM V4

### Objectif

Ce workflow récupère tous les prospects éligibles depuis Supabase, génère un pack IA pour chacun, puis appelle V3 individuellement pour chaque prospect. Il journalise chaque exécution dans `prospecting_batch_runs`.

### Nœuds principaux et leur rôle

#### 1. `When Called by Another Workflow` / `Manual Trigger`
- **Rôle :** V4 peut être déclenché manuellement (tests) ou appelé par V5 (automatisation).
- **Données attendues depuis V5 :**
  - `batch_run_label` — étiquette de la session (ex. : `v5-crm-growth`)
  - `child_workflow_id_v3` — ID du workflow V3 dans n8n
  - `daily_send_limit` — nombre maximum d'emails à envoyer

#### 2. `Set Batch Config`
- **Rôle :** Définit la configuration globale du batch (limites, URLs, IDs des sous-workflows).
- **Champs critiques à configurer :**
  - `audit_form_base_url` → `https://www.transferai.ci/questionnaire-audit`
  - `child_workflow_id_v3` → ID du workflow V3 (format `artXXXXXXX`)
  - `booking_link_45min` → lien Calendly ou Cal.com

#### 3. `Fetch Eligible Prospects` (Supabase SELECT)
- **Rôle :** Récupère les prospects depuis `prospect_targets` avec le statut `pending` ou `new`.
- **Filtre :** Limite par `batch_fetch_limit` (par défaut 50).

#### 4. `Build Eligible Prospect Queue`
- **Rôle :** Transforme la liste des prospects en une file d'attente avec toutes les métadonnées nécessaires pour V3.
- **Sortie :** Array d'objets contenant `prospect_id`, `pack_id`, `organization_name`, `target_email`, `audit_form_base_url`, `booking_link_45min`, `child_workflow_id_v3`.

#### 5. `Create AI Pack` (Supabase INSERT)
- **Rôle :** Crée un enregistrement dans `ai_prospecting_packs` pour chaque prospect avant l'envoi.

#### 6. `Call V3 Per Prospect` (Execute Sub-Workflow)
- **Rôle :** Appelle le workflow V3 pour chaque prospect de la file.
- **Configuration :** Doit pointer vers l'ID correct du workflow V3.

#### 7. `Log Batch Run` (Supabase INSERT)
- **Rôle :** Crée une entrée dans `prospecting_batch_runs` avec les métadonnées du batch (label, date, nombre de prospects traités).

### Données produites

- Lignes dans `prospecting_batch_runs` (une par exécution de V4)
- Lignes dans `ai_prospecting_packs` (une par prospect)
- Appels à V3 pour chaque prospect éligible
- Emails envoyés via V3 → Resend

---

## 4. Workflow V5 — CRM Growth Loop

**Fichier :** `67_n8n_Prospection_CRM_V5_Exportable.json`  
**Nom dans n8n :** TransferAI Prospecting CRM V5 Growth Loop

### Objectif

Ce workflow lit automatiquement une source de prospects externe (Google Sheet publié en CSV), normalise les données, les insère dans Supabase, puis déclenche V4 pour les traiter.

### Source de données

Un Google Sheet public publié au format CSV. L'URL doit être au format :
```
https://docs.google.com/spreadsheets/d/e/XXXXXXXX/pub?gid=0&single=true&output=csv
```

**Colonnes attendues dans le Google Sheet :**

| Colonne | Description |
|---------|-------------|
| `organization_name` | Nom de l'organisation |
| `website` | Site web |
| `target_email` | Email de contact |
| `sector_guess` | Secteur d'activité |
| `organization_type` | Type (enterprise, ngo, startup, etc.) |
| `country` | Pays (code ISO, ex. : CI) |
| `decision_maker_name` | Nom du décideur |

### Nœuds principaux et leur rôle

#### 1. `Daily CRM Growth Schedule` (Cron)
- **Rôle :** Déclenche V5 automatiquement chaque jour à l'heure configurée.
- **Configuration :** Heure d'exécution (ex. : 08h00 UTC).

#### 2. `Manual Trigger`
- **Rôle :** Permet de déclencher V5 manuellement pour les tests.

#### 3. `Scraped Leads Webhook`
- **Rôle :** Point d'entrée alternatif — reçoit des prospects directement via webhook (ex. : depuis un outil de scraping externe).

#### 4. `If Direct Lead Payload`
- **Rôle :** Branchement conditionnel. Si le déclencheur est le webhook avec un payload direct, passe par la branche directe. Sinon, passe par la lecture du CSV.

#### 5. `Set CRM Growth Config`
- **Rôle :** Définit toute la configuration de V5.
- **Champs à configurer (19 valeurs) :**

| Champ | Valeur recommandée |
|-------|--------------------|
| `crm_backend` | `supabase` |
| `scraped_csv_url` | URL CSV du Google Sheet |
| `dispatch_to_v4` | `true` |
| `child_workflow_id_v4` | ID du workflow V4 (ex. : `artMSEypvgBIDR58`) |
| `child_workflow_id_v3` | ID du workflow V3 |
| `child_workflow_label_v3` | `TransferAI Prospecting V3` |
| `batch_fetch_limit` | `50` |
| `daily_send_limit` | `20` |
| `max_attempts_per_prospect` | `3` |
| `min_confidence_score` | `0.6` |
| `batch_run_label` | `v5-crm-growth` |
| `booking_link_45min` | Lien Calendly/Cal.com |
| `default_country` | `CI` |
| `default_organization_type` | `enterprise` |
| `default_sector_guess` | `general` |
| `default_priority` | `medium` |
| `default_research_scope` | `local` |
| `next_action_delay_days` | `5` |
| `ingest_label` | `google_sheet_v5` |

#### 6. `Fetch Scraped Leads CSV` (HTTP Request)
- **Rôle :** Télécharge le contenu CSV depuis le Google Sheet publié.
- **Configuration critique :**
  - **URL :** `={{$json.scraped_csv_url || 'https://docs.google.com/...'}}` (avec fallback codé en dur)
  - **Response Format :** `Text` (obligatoire — le CSV n'est pas du JSON)
  - **Put Output in Field :** `data`

#### 7. `Normalize Inbound Leads` (Code JavaScript)
- **Rôle :** Parse le texte CSV brut et le transforme en tableau d'objets structurés.
- **Point d'attention :** Doit traiter `$json.data` (texte CSV) et non `$json` directement.

#### 8. `Upsert Prospects into Supabase` (HTTP Request → Supabase)
- **Rôle :** Insère ou met à jour chaque prospect normalisé dans la table `prospect_targets`.
- **Méthode :** POST avec `on_conflict=target_email` pour éviter les doublons.

#### 9. `Trigger V4 Batch` (Execute Sub-Workflow)
- **Rôle :** Appelle le workflow V4 pour traiter les nouveaux prospects insérés.
- **Configuration :** Doit pointer vers l'ID correct du workflow V4.

### Données produites

- Prospects insérés ou mis à jour dans `prospect_targets`
- V4 déclenché → emails envoyés via V3 → Resend

---

## 5. Formulaire d'audit — ProspectAuditFormPage

**Fichier source :** `src/pages/ProspectAuditFormPage.tsx`  
**URL de production :** `https://www.transferai.ci/questionnaire-audit`

### Objectif

Permet à un prospect de compléter son questionnaire d'audit IA personnalisé après avoir reçu un email de prospection.

### Flux d'accès

1. Le prospect reçoit un email avec un lien contenant un token d'invitation : `?invite=TOKEN`
2. Le frontend appelle la fonction Edge Supabase `resolve-invitation` avec ce token
3. La fonction retourne le contexte d'audit (secteur, organisation, questions pré-remplies)
4. Le formulaire s'affiche avec les données personnalisées

### États du formulaire

| État | Condition | Affichage |
|------|-----------|-----------|
| Chargement | En attente de la réponse API | Spinner |
| Erreur | Token invalide ou expiré | Message d'erreur rouge |
| Pack en préparation | `invitation` présent mais `context.organizationName` vide | Bandeau ambré "Le pack d'audit est en cours de préparation" |
| Formulaire complet | Données disponibles | Questionnaire interactif |

### Edge Functions Supabase associées

- **`resolve-invitation`** : Vérifie le token d'invitation et retourne le contexte d'audit
- **`prospect-audit-access`** : Authentification par email/mot de passe pour le portail prospect

### Configuration requise

Variable d'environnement Supabase :
```
PUBLIC_AUDIT_FORM_URL=https://www.transferai.ci/questionnaire-audit
```

---

## 6. Tables Supabase impliquées

### `prospect_targets`
Stocke tous les prospects à contacter.

| Colonne | Description |
|---------|-------------|
| `id` | UUID unique |
| `organization_name` | Nom de l'organisation |
| `target_email` | Email de contact (clé d'unicité) |
| `status` | `new`, `pending`, `sent`, `replied`, `stopped` |
| `sector_guess` | Secteur estimé |
| `country` | Pays |

### `ai_prospecting_packs`
Un pack IA est créé pour chaque envoi prospect.

| Colonne | Description |
|---------|-------------|
| `pack_id` | UUID unique |
| `target_email` | Email du destinataire |
| `organization_name` | Nom de l'organisation |
| `status` | `pending`, `sent`, `opened` |
| `payload` | Données contextuelles JSON |

### `outreach_attempts`
Journal de tous les emails envoyés.

| Colonne | Description |
|---------|-------------|
| `id` | UUID unique |
| `prospect_id` | Référence vers `prospect_targets` |
| `pack_id` | Référence vers `ai_prospecting_packs` |
| `organization_name` | Nom de l'organisation |
| `target_email` | Email du destinataire |
| `resend_message_id` | ID retourné par Resend (`re_xxx`) |
| `delivery_status` | `submitted`, `delivered`, `bounced` |
| `response_status` | `pending`, `replied`, `unsubscribed` |

### `prospecting_batch_runs`
Journal de chaque exécution du batch V4.

| Colonne | Description |
|---------|-------------|
| `id` | UUID unique |
| `batch_run_label` | Étiquette de la session |
| `started_at` | Date/heure de début |
| `status` | `running`, `completed`, `failed` |

### `form_invitations`
Tokens d'accès au formulaire d'audit.

| Colonne | Description |
|---------|-------------|
| `invite_token` | Token unique (UUID sans tirets) |
| `invitee_email` | Email du prospect invité |
| `pack_id` | Pack IA associé |
| `expires_at` | Date d'expiration (7 jours) |
| `status` | `pending`, `completed`, `expired` |

---

## 7. Guide de dépannage

### Problème : "Le questionnaire personnalisé n'est pas encore disponible"

**Cause :** Le formulaire a reçu une invitation valide, mais `context.organizationName` est vide — le pack IA n'a pas encore de données d'organisation.

**Vérification :**
1. Aller dans Supabase → Table `ai_prospecting_packs`
2. Vérifier que `organization_name` n'est pas NULL pour le pack lié au token

**Solution :**
- Attendre que V4 complète la génération du pack
- Ou relancer V4 pour ce prospect

---

### Problème : `outreach_attempts` a des lignes avec `organization_name` NULL

**Cause :** Le nœud `Log Outreach Attempt` lisait `$json` (réponse Supabase du nœud précédent) au lieu des données du prospect.

**Solution :** Dans le nœud `Log Outreach Attempt` de V3, s'assurer que le corps JSON lit depuis `$('Build Send Context').first().json` et non `$json`.

---

### Problème : V5 — erreur "A 'json' property isn't an object [item 0]"

**Cause :** Le nœud `Fetch Scraped Leads CSV` retourne le CSV comme texte brut, mais le nœud `Normalize Inbound Leads` essaie de le lire comme un objet JSON.

**Solution :**
1. Dans `Fetch Scraped Leads CSV` : vérifier que **Response Format = Text**
2. Dans `Normalize Inbound Leads` : s'assurer que le code lit `$json.data` (le texte CSV) avant de le parser

---

### Problème : V5 — tous les champs de config sont `"undefined"`

**Cause :** Le nœud `Set CRM Growth Config` a des champs sans valeur (Value vide).

**Solution :** Ouvrir le nœud et remplir le champ **Value** de chaque entrée. Le rouge sur "Type" indique que la valeur est absente.

---

### Problème : URL du formulaire dans l'email pointe vers `localhost` ou `127.0.0.1`

**Cause :** La variable d'environnement `AUDIT_FORM_BASE_URL` n'est pas définie dans n8n, et la valeur fallback pointe vers le serveur local.

**Solution :**
1. Dans n8n → Settings → Environment Variables
2. Ajouter : `AUDIT_FORM_BASE_URL` = `https://www.transferai.ci/questionnaire-audit`
3. Ou hardcoder l'URL directement dans le nœud `Set Batch Config` de V4

---

### Problème : `prospecting_batch_runs` — erreur "column does not exist"

**Cause :** La requête SQL utilise un nom de colonne qui n'existe pas dans le schéma réel de la table.

**Solution :** Utiliser `SELECT *` dans la requête SQL au lieu de nommer les colonnes spécifiquement, ou vérifier le schéma dans Supabase → Table Editor.

---

### Problème : Le workflow V5 ne peut pas s'exécuter ("The workflow has issues")

**Cause :** Un ou plusieurs champs obligatoires dans un nœud sont vides ou invalides (indiqués en rouge).

**Solution :** Parcourir tous les nœuds signalés en erreur, compléter les champs manquants, puis sauvegarder avant d'exécuter.

---

### Problème : `{{$json.scraped_csv_url}}` dans le champ URL de `Fetch Scraped Leads CSV` retourne `undefined`

**Cause :** Quand V5 est déclenché par le `Manual Trigger`, ce dernier ne fournit pas de champ `scraped_csv_url`.

**Solution :** Utiliser une expression avec fallback dans le champ URL :
```
={{$json.scraped_csv_url || 'URL_HARDCODEE_ICI'}}
```

---

## 8. Checklist de vérification

### Avant chaque exécution en production

- [ ] V3 : Le nœud `Log Outreach Attempt` lit bien depuis `Build Send Context`
- [ ] V4 : `audit_form_base_url` pointe vers `https://www.transferai.ci/questionnaire-audit`
- [ ] V4 : `child_workflow_id_v3` contient l'ID correct du workflow V3
- [ ] V5 : `Set CRM Growth Config` a toutes les 19 valeurs remplies (aucun rouge)
- [ ] V5 : `Fetch Scraped Leads CSV` a Response Format = **Text**
- [ ] V5 : `child_workflow_id_v4` = `artMSEypvgBIDR58`
- [ ] Google Sheet : publié sur le web en format CSV et accessible publiquement
- [ ] Supabase : variable `PUBLIC_AUDIT_FORM_URL` configurée
- [ ] Resend : API Key valide dans les credentials n8n

### Après une exécution

- [ ] Vérifier `outreach_attempts` : `organization_name` et `target_email` non NULL
- [ ] Vérifier `prospecting_batch_runs` : nouvelle ligne avec statut `completed`
- [ ] Vérifier `ai_prospecting_packs` : statut `sent` pour les prospects traités
- [ ] Vérifier dans Resend : emails bien présents dans les logs d'envoi

---

*Document généré à partir du travail de configuration réalisé les 24 et 25 juin 2026.*
