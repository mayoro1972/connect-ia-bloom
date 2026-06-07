# TransferAI Post-Audit Expert Routing V6 MVP
## Guide de Configuration — Étape par Étape

---

## Vue d'ensemble

Le workflow V6 MVP est un pipeline d'automatisation n8n qui se déclenche automatiquement lorsqu'un prospect soumet son formulaire d'audit IA avec un taux de complétion ≥ 80 %. Il effectue les actions suivantes dans l'ordre :

1. Récupère les données du pack, de l'invitation et de la réponse formulaire depuis Supabase
2. Calcule le routage vers l'expert approprié
3. Génère un brief interne pré-RDV via OpenAI
4. Envoie le brief par email via Resend
5. Met à jour le statut CRM dans Supabase
6. Synchronise les données dans Google Sheets Dashboard
7. Envoie une notification email à l'expert si priorité haute

---

## Prérequis

Avant de commencer, prépare les éléments suivants :

| Élément | Où le trouver |
|---------|--------------|
| URL Supabase | `https://supabase.com/dashboard/project/<project_id>/settings/api` |
| Supabase Service Role Key | Même page, section "service_role" |
| OpenAI API Key | `https://platform.openai.com/api-keys` |
| Resend API Key | `https://resend.com/api-keys` |
| Google Sheets Spreadsheet ID | Dans l'URL du Sheet : `.../spreadsheets/d/<ID>/edit` |
| n8n instance URL | URL de ton instance n8n (ex: `https://n8n-pxlk.srv1480638.hstgr.cloud`) |

---

## Étape 1 — Importer le workflow dans n8n

### 1.1 Accéder à n8n
1. Ouvre ton instance n8n dans le navigateur
2. Dans le menu gauche, clique sur **Workflows**
3. Clique sur **+ Add Workflow** → **Import from file**

### 1.2 Importer le fichier JSON
1. Sélectionne le fichier `75_n8n_Post_Audit_Expert_Routing_V6_MVP_Exportable.json`
2. Clique **Import**
3. Le workflow s'ouvre dans l'éditeur avec 26 noeuds

---

## Étape 2 — Remplacer les placeholders Supabase

Le workflow contient 8 noeuds qui font appel à Supabase. Chacun contient deux placeholders à remplacer.

### Liste des noeuds Supabase

| Noeud | Type | Action |
|-------|------|--------|
| Get Pack Row | HTTP GET | Récupère le pack depuis `ai_prospecting_packs` |
| Get Invitation Row | HTTP GET | Récupère l'invitation depuis `form_invitations` |
| Get Latest Form Response | HTTP GET | Récupère la réponse depuis `form_responses` |
| Get Prospect Target Row | HTTP GET | Récupère la cible depuis `prospect_targets` |
| Upsert Follow-Up Tracking | HTTP PATCH | Met à jour `post_audit_follow_ups` |
| Update Pack Status | HTTP PATCH | Met à jour `ai_prospecting_packs` |
| Update Prospect Target | HTTP PATCH | Met à jour `prospect_targets` |
| Update Invitation Status | HTTP PATCH | Met à jour `form_invitations` |

### 2.1 Pour chaque noeud Supabase

1. Double-clique sur le noeud
2. Dans le champ **URL**, remplace `VOTRE-URL.supabase.co` par ton URL réelle :
   ```
   https://wlhznciwuofueffyoflo.supabase.co
   ```
3. Dans les **Headers**, remplace les deux occurrences de `VOTRE-SERVICE-ROLE-KEY` :
   - Header `apikey` → colle ta Service Role Key
   - Header `Authorization` → `Bearer <ta-service-role-key>`
4. Clique **Save**

### 2.2 Format des headers Supabase

```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## Étape 3 — Configurer OpenAI

### 3.1 Noeud "Generate Internal Pre-RDV Brief"
1. Double-clique sur le noeud
2. Dans les Headers, remplace `VOTRE-OPENAI-API-KEY` par ta clé OpenAI :
   ```
   Authorization: Bearer sk-proj-...
   ```
3. Clique **Save**

---

## Étape 4 — Configurer Resend

### 4.1 Noeud "Send Internal Brief Email"
1. Double-clique sur le noeud
2. Remplace `VOTRE-RESEND-API-KEY` dans le header `Authorization`
3. Remplace `onboarding@resend.dev` par ton adresse d'expédition vérifiée dans Resend
4. Clique **Save**

### 4.2 Noeud "Send Expert Notification Email"
1. Même opération que 4.1

> **Important :** l'adresse `from` doit appartenir à un domaine vérifié dans Resend. En développement, `onboarding@resend.dev` fonctionne uniquement pour envoyer à l'email propriétaire du compte Resend.

---

## Étape 5 — Configurer Google Sheets

### 5.1 Créer les credentials OAuth2 dans n8n

1. Dans n8n, va dans **Settings → Credentials**
2. Clique **+ Add Credential** → cherche **Google Sheets OAuth2 API**
3. Entre tes identifiants OAuth2 :
   - **Client ID** : depuis Google Cloud Console → APIs & Services → Credentials
   - **Client Secret** : même page
4. Copie l'URI de redirection affiché par n8n (format : `https://<ton-n8n>/rest/oauth2-credential/callback`)
5. Dans Google Cloud Console, ajoute cet URI dans la liste des "Authorized redirect URIs" de ton OAuth Client
6. Clique **Sign in with Google** dans n8n → autorise l'accès
7. Nomme la credential (ex: `Google Sheets TransferAI`) et **Save**

### 5.2 Connecter le noeud "Sync to Google Sheets Dashboard"

1. Double-clique sur le noeud
2. Dans le champ **Credential**, sélectionne la credential créée à l'étape 5.1
3. Vérifie que le **Spreadsheet ID** est correct : `1qqIujbjHEnN3CeV-xMI6hIgsH4hdoIGyp271ozazMwg`
4. Vérifie que **Sheet Name** est `Dashboard`
5. Clique **Save**

### 5.3 Structure du Google Sheet Dashboard

Le sheet doit avoir ces colonnes en ligne 1 (en-têtes) dans cet ordre :

```
pack_id | organization_name | decision_maker_name | decision_maker_role |
target_email | country | sector | maturity_level | completion_pct |
primary_service | secondary_service | routing_priority | assigned_expert |
next_action_at | processed_at | trigger_source | resend_id | brief_summary
```

---

## Étape 6 — Configurer le noeud Webhook

### 6.1 Vérifier le path du webhook
1. Double-clique sur le noeud **"Audit Completed Webhook"**
2. Vérifie que le **Path** est : `transferai-post-audit-expert-routing-v6`
3. Vérifie que la **méthode** est `POST`
4. Note l'URL complète affichée : `https://<ton-n8n>/webhook/transferai-post-audit-expert-routing-v6`

### 6.2 Header de sécurité
Le webhook vérifie le header `x-transferai-secret`. La valeur attendue est définie dans le noeud **"Parse Post-Audit Webhook"**. Par défaut : `transferai-secret-2026`.

---

## Étape 7 — Mettre à jour le secret Supabase

L'Edge Function Supabase `save-form-response` envoie automatiquement les données à n8n quand un formulaire est complété. Elle utilise le secret `N8N_POST_AUDIT_WEBHOOK_URL`.

### 7.1 Mettre à jour le secret

1. Va sur `https://supabase.com/dashboard/project/<project_id>/settings/functions`
2. Trouve le secret `N8N_POST_AUDIT_WEBHOOK_URL`
3. Clique sur les 3 points → **Edit**
4. Entre la valeur :
   ```
   https://<ton-n8n>/webhook/transferai-post-audit-expert-routing-v6
   ```
5. Clique **Save**

---

## Étape 8 — Activer le workflow

1. Dans n8n, ouvre le workflow V6
2. En haut à droite, clique sur le toggle **Inactive** → il passe à **Active** (ou **Published**)
3. Le workflow est maintenant prêt à recevoir des webhooks

---

## Étape 9 — Tester le workflow

### 9.1 Trouver un pack_id de test

Lance cette requête dans le SQL Editor de Supabase :

```sql
SELECT 
  p.pack_id,
  p.organization_name,
  r.completion_percentage,
  r.submitted_at
FROM ai_prospecting_packs p
INNER JOIN form_responses r ON r.pack_id = p.pack_id
WHERE r.completion_percentage >= 80
ORDER BY r.submitted_at DESC
LIMIT 5;
```

### 9.2 Envoyer une requête de test

```bash
curl -X POST "https://<ton-n8n>/webhook/transferai-post-audit-expert-routing-v6" \
  -H "Content-Type: application/json" \
  -H "x-transferai-secret: transferai-secret-2026" \
  -d '{"pack_id": "<ton-pack-id>", "force_rerun": true}'
```

### 9.3 Réponse attendue (200 OK)

```json
{
  "version": "v6-mvp",
  "status": "complete",
  "pack_id": "pack-xxx",
  "organization_name": "Nom Organisation",
  "primary_service": "Automatisation des processus",
  "routing_priority": "normal",
  "assigned_expert_email": "contact@transferai.ci",
  "resend_brief_id": "xxx",
  "google_sheets_synced": false,
  "expert_notification_sent": false,
  "next_action_at": "2026-06-08T...",
  "processed_at": "2026-06-07T...",
  "trigger_source": "webhook",
  "v6_features": [
    "google_sheets_dashboard_sync",
    "priority_expert_notification",
    "v6_summary_node"
  ]
}
```

> **Note :** `google_sheets_synced: false` est un faux négatif connu — les données sont bien écrites dans Google Sheets. Le champ `updatedRows` retourné par le noeud Google Sheets ne correspond pas au nom attendu par le noeud Build V6 Summary.

---

## Étape 10 — Vérifier Google Sheets

Ouvre ton Dashboard Google Sheets et vérifie qu'une nouvelle ligne est apparue avec les données du pack testé.

---

## Paramètres avancés

### Modifier le délai avant next_action_at

Dans le noeud **"Build Expert Routing"**, le délai est défini par `next_action_delay_days`. Par défaut : 1 jour. Pour changer à 2 jours, envoie `"next_action_delay_days": 2` dans le body du webhook.

### Forcer le reroutage d'un pack déjà traité

Par défaut, un pack déjà traité retourne un statut `no_op`. Pour forcer le retraitement :

```json
{"pack_id": "pack-xxx", "force_rerun": true}
```

### Modifier les seuils de priorité haute

Dans **"Build Expert Routing"**, les règles de priorité sont :
- `completion_percentage >= 95` → high
- `ai_maturity` contient "avance" ou "advanced" → high
- `commercial_priority_tier === 'A'` → high

Pour déclencher une notification expert, `routing_priority` doit être `"high"`.

---

## Architecture du flux de production

```
Prospect soumet formulaire
        ↓
Edge Function save-form-response (Supabase)
  [completion_percentage >= 80]
        ↓
POST N8N_POST_AUDIT_WEBHOOK_URL
        ↓
Webhook Audit Completed (n8n V6)
        ↓
Parse → Normalize → Get Pack → Get Invitation → Get Form Response
        ↓
Get Prospect Target → Check Already Processed
        ↓ (si non traité)
Build Expert Routing → Build CRM Context
        ↓
Generate Brief (OpenAI) → Send Email (Resend)
        ↓
Upsert Follow-Up → Update Pack → Update Prospect → Update Invitation
        ↓
Build Post-Audit Result
        ↓
Sync Google Sheets ← → If Priority High → Send Expert Notification
        ↓
Build V6 Summary → Respond to Webhook
```
