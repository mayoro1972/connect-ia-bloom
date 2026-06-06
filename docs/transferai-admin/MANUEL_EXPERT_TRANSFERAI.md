# MANUEL EXPERT TRANSFERAI
## Guide complet d'installation, configuration et exploitation
### À l'usage des 14 employés de l'équipe TransferAI

---

> **Version** : 1.0 — Juin 2026  
> **Auteur** : Équipe Technique TransferAI  
> **Niveau requis** : Aucune connaissance préalable en base de données ou en automatisation  

---

# TABLE DES MATIÈRES

1. [Architecture générale du système](#1-architecture-générale-du-système)
2. [Guide de configuration Supabase](#2-guide-de-configuration-supabase)
3. [Guide de configuration n8n](#3-guide-de-configuration-n8n)
4. [Guide du test end-to-end (E2E)](#4-guide-du-test-end-to-end-e2e)
5. [Guide de dépannage (Troubleshooting)](#5-guide-de-dépannage-troubleshooting)
6. [Référence des workflows — V1 à V5](#6-référence-des-workflows--v1-à-v5)
7. [Glossaire](#7-glossaire)

---

# 1. ARCHITECTURE GÉNÉRALE DU SYSTÈME

## 1.1 Vue d'ensemble

Le système TransferAI est composé de **5 workflows automatisés** qui fonctionnent ensemble pour gérer le cycle complet d'un prospect, depuis la prospection initiale jusqu'au suivi post-audit.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE TRANSFERAI                       │
│                                                                  │
│  V4 & V5 ──► V3 ──────────────────────────────────────────────► │
│  (CRM &      (Génération    Prospect reçoit lien formulaire      │
│  Batch)       de packs)                                          │
│                                │                                 │
│                                ▼                                 │
│                    Prospect remplit le formulaire                │
│                                │                                 │
│                                ▼                                 │
│                   Edge Function (save-form-response)             │
│                   Sauvegarde les réponses + déclenche            │
│                                │                                 │
│                                ▼                                 │
│                      V2 — Post-Audit Expert Routing              │
│                      Génère la fiche Pré-RDV IA                  │
│                      Envoie l'email interne                      │
│                      Met à jour la base de données               │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 Les composants techniques

| Composant | Rôle | Accès |
|-----------|------|-------|
| **Supabase** | Base de données + Edge Functions | supabase.com |
| **n8n** | Automatisation des workflows | Votre serveur n8n |
| **OpenAI** | Génération des fiches Pré-RDV | API externe |
| **Resend** | Envoi des emails | API externe |

---

# 2. GUIDE DE CONFIGURATION SUPABASE

## 2.1 Qu'est-ce que Supabase ?

Supabase est une **base de données en ligne** (dans le nuage). Imaginez-le comme un tableau Excel très puissant accessible depuis Internet, où toutes les informations sur vos prospects, formulaires et packs de prospection sont stockées de manière sécurisée.

### Les sections importantes de Supabase

Quand vous vous connectez sur **supabase.com**, vous verrez dans le menu de gauche :

- 🗄️ **Table Editor** — Pour voir vos données comme un tableau
- 💻 **SQL Editor** — Pour exécuter des commandes sur la base de données
- ⚡ **Edge Functions** — Les fonctions automatiques (comme save-form-response)
- 🔑 **Settings → API** — Pour trouver vos clés d'accès

## 2.2 Comprendre le SQL Editor

### Qu'est-ce que le SQL ?

SQL (prononcé "S-Q-L" ou "sequel") est le **langage de commande** pour parler à une base de données. C'est comme donner des ordres en français structuré à votre base de données.

### Les 4 commandes de base

| Commande | Ce qu'elle fait | Exemple en français |
|----------|-----------------|---------------------|
| `SELECT` | Lire des données | "Montre-moi les données" |
| `INSERT` | Ajouter des données | "Ajoute cette ligne" |
| `UPDATE` | Modifier des données | "Change cette valeur" |
| `DELETE` | Supprimer des données | "Efface cette ligne" |

### Comment utiliser le SQL Editor

1. Dans Supabase, cliquez sur **SQL Editor** dans le menu de gauche
2. Une zone de texte blanche apparaît — c'est là que vous tapez vos commandes
3. Cliquez sur le bouton **Run** (en haut à droite, bouton vert) pour exécuter
4. Les résultats s'affichent en bas dans la section **Results**

### Le bouton RUN — très important !

```
┌─────────────────────────────────────────────┐
│  SQL Editor                          [Run ►] │  ← Cliquez ici
├─────────────────────────────────────────────┤
│  SELECT * FROM prospect_targets;            │
│                                             │
├─────────────────────────────────────────────┤
│  Results                                    │
│  prospect_id | status | ...                 │
│  test-001    | active | ...                 │
└─────────────────────────────────────────────┘
```

> ⚠️ **Important** : Quand vous exécutez plusieurs requêtes SELECT à la suite, Supabase n'affiche que le résultat de la **dernière** requête. Exécutez-les une par une.

## 2.3 Les tables de la base de données TransferAI

### Qu'est-ce qu'une table ?

Une table est comme un **onglet dans Excel**. Chaque table contient un type d'information précis.

### Les 5 tables principales

#### Table 1 : `ai_prospecting_packs`
Contient tous les **packs de prospection** créés pour chaque prospect.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique automatique |
| `pack_id` | Texte | Identifiant du pack (ex: "pack-123-abc") |
| `prospect_id` | Texte | Identifiant du prospect |
| `organization_name` | Texte | Nom de l'organisation |
| `target_email` | Texte | Email du prospect |
| `status` | Texte | État du pack (pending, audit_sent, post_audit_processed) |
| `payload` | JSON | Toutes les données détaillées du pack |
| `created_at` | Date | Date de création |

#### Table 2 : `prospect_targets`
Contient tous les **prospects** et leur état dans le processus.

| Colonne | Type | Description |
|---------|------|-------------|
| `prospect_id` | Texte | Identifiant unique du prospect |
| `status` | Texte | État (active, paused, stopped) |
| `last_sequence_result` | Texte | Dernier résultat (post_audit_ready, etc.) |
| `niche_status` | Texte | Qualification (qualified_after_audit, etc.) |
| `next_action_at` | Date | Prochaine action planifiée |

#### Table 3 : `form_invitations`
Contient les **invitations** envoyées aux prospects pour remplir le formulaire.

| Colonne | Type | Description |
|---------|------|-------------|
| `invite_token` | Texte | Code unique de l'invitation |
| `pack_id` | Texte | Lien vers le pack correspondant |
| `invitee_email` | Texte | Email du prospect invité |
| `status` | Texte | État (pending, completed) |

#### Table 4 : `form_responses`
Contient les **réponses aux formulaires** remplis par les prospects.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique de la réponse |
| `pack_id` | Texte | Lien vers le pack |
| `invitation_token` | Texte | Lien vers l'invitation |
| `is_completed` | Vrai/Faux | Le formulaire est-il complet ? |
| `completion_percentage` | Nombre | Pourcentage de complétion (0-100) |
| `form_data` | JSON | Toutes les réponses du formulaire |

#### Table 5 : `post_audit_follow_ups`
Contient le **suivi post-audit** de chaque prospect traité.

| Colonne | Type | Description |
|---------|------|-------------|
| `pack_id` | Texte | Lien vers le pack |
| `organization_name` | Texte | Nom de l'organisation |
| `workflow_status` | Texte | État du suivi (ready_for_expert) |
| `assigned_expert_email` | Texte | Email de l'expert assigné |
| `next_action_at` | Date | Prochaine action |

## 2.4 Les requêtes SQL utilisées dans le projet

### Requête 1 — Créer les tables (Migration)

Ces commandes créent les tables si elles n'existent pas encore. Elles ont été exécutées une seule fois lors de l'installation.

```sql
-- Cette commande crée la table post_audit_follow_ups
-- "IF NOT EXISTS" signifie : "seulement si elle n'existe pas déjà"
-- Cela évite une erreur si on l'exécute deux fois

CREATE TABLE IF NOT EXISTS public.post_audit_follow_ups (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id               text        NOT NULL UNIQUE,
  -- ... autres colonnes
);
```

**Explication ligne par ligne :**
- `CREATE TABLE IF NOT EXISTS` → Crée la table seulement si elle n'existe pas
- `public.post_audit_follow_ups` → Nom complet de la table (schéma.nom)
- `uuid PRIMARY KEY DEFAULT gen_random_uuid()` → L'identifiant unique est généré automatiquement
- `text NOT NULL` → Champ texte obligatoire (ne peut pas être vide)
- `UNIQUE` → La valeur doit être unique dans toute la table

### Requête 2 — Insérer des données de test

```sql
-- INSERT INTO = "Ajoute une ligne dans la table"
-- Les valeurs entre parenthèses correspondent aux colonnes

INSERT INTO public.ai_prospecting_packs 
  (pack_id, prospect_id, organization_name, target_email, status, payload)
VALUES (
  'test-e2e-pack-001',          -- valeur pour pack_id
  'test-e2e-prospect-001',      -- valeur pour prospect_id
  'Société Test IA',            -- valeur pour organization_name
  'contact@exemple.com',        -- valeur pour target_email
  'audit_sent',                 -- valeur pour status
  '{}'::jsonb                   -- valeur pour payload (JSON vide)
);
```

**Qu'est-ce que `::jsonb` ?**  
C'est une indication à Supabase que la valeur `'{}'` est du format JSON. Le `::` signifie "convertir en type".

### Requête 3 — Lire des données

```sql
-- SELECT * = "Montre-moi toutes les colonnes"
-- FROM = "de la table"
-- WHERE = "où la condition suivante est vraie"

SELECT * FROM form_responses 
WHERE pack_id = 'test-e2e-pack-001'
ORDER BY submitted_at DESC;  -- Trie du plus récent au plus ancien
```

**Opérateurs de comparaison courants :**

| Opérateur | Signification | Exemple |
|-----------|---------------|---------|
| `=` | Égal à | `status = 'active'` |
| `!=` | Différent de | `status != 'paused'` |
| `>` | Supérieur à | `completion_percentage > 80` |
| `IS NULL` | Est vide | `pack_id IS NULL` |
| `IS NOT NULL` | N'est pas vide | `pack_id IS NOT NULL` |

### Requête 4 — Modifier des données

```sql
-- UPDATE = "Modifie des lignes existantes"
-- SET = "change ces valeurs"
-- WHERE = "seulement sur les lignes où..."
-- ⚠️ Sans WHERE, TOUTES les lignes seraient modifiées !

UPDATE public.form_responses
SET pack_id = 'test-e2e-pack-001'
WHERE id = '3f95924a-5d75-4328-a936-6910a7d0bec0';
```

> ⚠️ **Attention** : Toujours mettre une clause `WHERE` dans un UPDATE pour ne pas modifier toutes les lignes de la table.

### Requête 5 — Supprimer des données

```sql
-- DELETE FROM = "Supprime des lignes"
-- WHERE = "seulement celles où..."
-- ⚠️ Sans WHERE, TOUTES les lignes seraient supprimées !

DELETE FROM public.post_audit_follow_ups 
WHERE pack_id = 'test-e2e-pack-001';
```

### Requête 6 — Désactiver la sécurité RLS

```sql
-- RLS = Row Level Security = Sécurité au niveau des lignes
-- Certaines tables ont des règles qui bloquent l'accès
-- Cette commande désactive ces règles pour une table

ALTER TABLE public.post_audit_follow_ups DISABLE ROW LEVEL SECURITY;
```

**Qu'est-ce que la RLS (Row Level Security) ?**  
C'est un système de sécurité de Supabase qui contrôle qui peut voir ou modifier chaque ligne d'une table. Par défaut, les tables ont la RLS activée et bloquent tout accès non autorisé. Pour les tables utilisées uniquement par le système (via la clé service_role), on peut la désactiver.

## 2.5 Les clés d'accès Supabase

### Où les trouver ?

Dans Supabase → **Settings** → **API**

### Les deux clés importantes

| Clé | Nom | Usage | Niveau d'accès |
|-----|-----|-------|----------------|
| `anon public` | Clé publique | Utilisée côté client (formulaire web) | Limité |
| `service_role` | Clé secrète | Utilisée par n8n et les Edge Functions | Total |

> 🔐 **Ne partagez JAMAIS la clé `service_role`** en dehors de n8n et des Edge Functions. Elle donne un accès complet à toute la base de données.

## 2.6 Les Edge Functions

### Qu'est-ce qu'une Edge Function ?

Une Edge Function est un **petit programme** qui s'exécute automatiquement dans Supabase quand il reçoit une requête. Dans notre cas, `save-form-response` est appelée quand un prospect soumet le formulaire.

### Comment voir les logs d'une Edge Function

1. Supabase → **Edge Functions**
2. Cliquez sur **save-form-response**
3. Onglet **Logs** → vous verrez toutes les exécutions avec leur statut (200 = succès, 400/500 = erreur)

### Les secrets (variables d'environnement)

Les Edge Functions utilisent des **secrets** pour stocker les informations sensibles (clés API, URLs).

Pour les configurer :
1. Supabase → **Edge Functions** → **Secrets**
2. Cliquez sur **Add new secret**

| Secret | Valeur | Description |
|--------|--------|-------------|
| `N8N_POST_AUDIT_WEBHOOK_URL` | URL du webhook n8n | Déclencheur du workflow V2 |
| `N8N_WEBHOOK_SECRET` | Votre clé secrète | Sécurise l'appel au webhook |
| `POST_AUDIT_INTERNAL_EMAIL` | contact@transferai.ci | Email de l'équipe interne |

---

# 3. GUIDE DE CONFIGURATION N8N

## 3.1 Qu'est-ce que n8n ?

n8n est un **outil d'automatisation**. Imaginez-le comme un chef d'orchestre qui coordonne automatiquement toutes les actions quand un prospect remplit un formulaire : il lit les données, génère un document avec l'IA, envoie un email, et met à jour la base de données — tout ça sans intervention humaine.

## 3.2 Les concepts de base de n8n

### Le Workflow (Flux de travail)

Un workflow est une **séquence d'étapes automatiques**, représentées visuellement par des boîtes connectées entre elles par des flèches.

```
[Webhook] ──► [Lire données] ──► [IA] ──► [Envoyer email] ──► [Résultat]
```

### Les Nœuds (Nodes)

Chaque boîte dans le workflow est un **nœud**. Il existe plusieurs types :

| Type de nœud | Icône | Description |
|--------------|-------|-------------|
| **Webhook** | 🌐 | Reçoit des données depuis Internet |
| **HTTP Request** | 🌐 | Envoie des données vers un service externe |
| **Code** | `{}` | Exécute du code JavaScript |
| **If** | ⇔ | Prend une décision (si... alors...) |
| **Set** | ✏️ | Définit des valeurs |

### Les Credentials (Identifiants)

Les credentials sont les **clés d'accès** stockées de manière sécurisée dans n8n pour accéder aux services externes (Supabase, OpenAI, Resend).

## 3.3 Configuration des Credentials

### Accéder aux Credentials

n8n → **Settings** (icône engrenage) → **Credentials**

### Credential 1 — Header Auth (pour le webhook)

Ce credential sécurise le webhook V2 pour que seul le système autorisé puisse le déclencher.

1. Cliquez **Add Credential**
2. Cherchez **Header Auth**
3. Configurez :
   - **Name** : `x-transferai-secret`
   - **Value** : votre clé secrète (ex: `transferai-secret-2026`)
4. Cliquez **Save**

> ⚠️ Cette valeur doit être **identique** au secret `N8N_WEBHOOK_SECRET` dans Supabase.

## 3.4 Configuration du workflow V2

### Étape 1 — Importer le workflow

1. Dans n8n, cliquez sur **+** (nouveau workflow) ou **Import**
2. Sélectionnez le fichier `74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json`
3. Le workflow apparaît sur le canvas

### Étape 2 — Configurer les nœuds Supabase

Chaque nœud qui communique avec Supabase doit avoir ces headers :

| Header | Valeur |
|--------|--------|
| `apikey` | Votre clé `service_role` Supabase |
| `Authorization` | `Bearer ` + votre clé `service_role` |
| `Content-Type` | `application/json` |

**Comment trouver l'URL Supabase de vos tables :**
```
https://[VOTRE-ID-PROJET].supabase.co/rest/v1/[NOM-DE-LA-TABLE]
```
Exemple : `https://wlhznciwuofueffyoflo.supabase.co/rest/v1/form_responses`

### Étape 3 — Configurer les nœuds critiques

#### Nœud `Audit Completed Webhook`
- **Path** : `transferai-post-audit-expert-routing-v2`
- **Authentication** : Header Auth → sélectionnez votre credential
- **Respond** : When Last Node Finishes

#### Nœud `Generate Internal Pre-RDV Brief`
- **URL** : `https://api.openai.com/v1/chat/completions`
- **Header Authorization** : `Bearer [VOTRE-CLÉ-OPENAI]`

#### Nœud `Send Internal Brief Email`
- **URL** : `https://api.resend.com/emails`
- **Header Authorization** : `Bearer [VOTRE-CLÉ-RESEND]`

### Étape 4 — Activer le workflow

1. Cliquez sur le bouton **Publish** (ou **Active**) en haut à droite
2. Le bouton devient vert → le workflow est actif
3. Copiez la **Production URL** du webhook pour la mettre dans les secrets Supabase

### Étape 5 — Configurer le secret Supabase

Dans Supabase → Edge Functions → Secrets :
- `N8N_POST_AUDIT_WEBHOOK_URL` = Production URL du webhook (sans `-test`)

Exemple :
```
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/transferai-post-audit-expert-routing-v2
```

## 3.5 Les paramètres importants des nœuds HTTP Request

### Response Format — Très important !

| Méthode HTTP | Response Format | Pourquoi |
|--------------|-----------------|---------|
| GET (lecture) | JSON | Supabase renvoie des données JSON |
| PATCH (modification) | **Text** | Supabase renvoie 204 vide — pas de JSON |
| POST upsert | **Text** | Supabase renvoie 201 vide — pas de JSON |

> ⚠️ Si vous mettez JSON sur un PATCH, n8n génère l'erreur `Cannot read properties of undefined (reading 'data')`.

### Never Error — Option de sécurité

Quand **Never Error** est activé sur un nœud, le workflow continue même si ce nœud échoue. Utile pour les nœuds optionnels (Slack, par exemple).

### Always Output Data

Quand **Always Output Data** est activé, le nœud produit toujours une sortie même si Supabase renvoie un tableau vide `[]`. Utile pour les nœuds qui peuvent ne rien trouver.

---

# 4. GUIDE DU TEST END-TO-END (E2E)

## 4.1 Qu'est-ce qu'un test E2E ?

Un test **End-to-End** (de bout en bout) simule le parcours complet d'un prospect depuis la création du pack jusqu'à la réception de l'email de la fiche Pré-RDV. C'est la validation finale que tout fonctionne ensemble.

## 4.2 Prérequis avant le test

- [ ] Workflow V2 importé dans n8n
- [ ] Workflow V2 **activé** (bouton vert)
- [ ] Secrets Supabase configurés (N8N_POST_AUDIT_WEBHOOK_URL, N8N_WEBHOOK_SECRET)
- [ ] Clés Supabase configurées dans les nœuds n8n
- [ ] Table `post_audit_follow_ups` créée dans Supabase

## 4.3 Étapes du test

### ÉTAPE 1 — Nettoyer et créer les données de test

Dans Supabase → SQL Editor, exécutez ce SQL :

```sql
-- Nettoyage des données de test précédentes
DELETE FROM public.post_audit_follow_ups WHERE pack_id = 'test-e2e-pack-001';
DELETE FROM public.form_responses WHERE pack_id = 'test-e2e-pack-001';
DELETE FROM public.form_invitations WHERE pack_id = 'test-e2e-pack-001';
DELETE FROM public.ai_prospecting_packs WHERE pack_id = 'test-e2e-pack-001';
DELETE FROM public.prospect_targets WHERE prospect_id = 'test-e2e-prospect-001';

-- Création du prospect
INSERT INTO public.prospect_targets (prospect_id, status, outreach_attempt_count)
VALUES ('test-e2e-prospect-001', 'active', 1);

-- Création du pack (simule V3)
INSERT INTO public.ai_prospecting_packs 
  (pack_id, prospect_id, organization_name, target_email, status, payload)
VALUES (
  'test-e2e-pack-001',
  'test-e2e-prospect-001',
  'Société Test IA',
  'votre-email@exemple.com',
  'audit_sent',
  '{
    "organization_name": "Société Test IA",
    "prospect_id": "test-e2e-prospect-001",
    "target_email": "votre-email@exemple.com",
    "prospect_language": "fr",
    "sector_guess": "technologie",
    "recommended_offer": "Automatisation des processus",
    "commercial_priority_tier": "A",
    "internal_email_to": "votre-email@exemple.com"
  }'::jsonb
);

-- Création de l'invitation
INSERT INTO public.form_invitations 
  (invite_token, pack_id, invitee_email, status)
VALUES 
  ('test-token-e2e-001', 'test-e2e-pack-001', 'votre-email@exemple.com', 'pending');
```

Cliquez **Run** → Vous devez voir `Success. No rows returned` pour chaque DELETE et un message de succès pour les INSERT.

### ÉTAPE 2 — Préparer n8n pour le test

1. Dans n8n, ouvrez le workflow V2
2. Cliquez sur le nœud **Audit Completed Webhook**
3. Cliquez **Listen for test event** (le nœud attend une requête)
4. **Ouvrez un deuxième onglet** de votre navigateur sur le même workflow

### ÉTAPE 3 — Déclencher le webhook depuis le 2ème onglet

Dans le deuxième onglet, trouvez votre nœud **HTTP Request** de test et configurez-le :

- **Method** : POST
- **URL** : `https://[VOTRE-N8N]/webhook-test/transferai-post-audit-expert-routing-v2`
- **Headers** :
  - `Content-Type` : `application/json`
  - `x-transferai-secret` : votre clé secrète
- **Body (JSON)** :
```json
{
  "pack_id": "test-e2e-pack-001",
  "response_id": "[ID de la form_response créée à l'étape 1]",
  "completion_percentage": 90,
  "is_completed": true,
  "internal_email_to": "votre-email@exemple.com",
  "next_action_delay_days": 1,
  "trigger_source": "save-form-response"
}
```

Cliquez **Execute step**.

### ÉTAPE 4 — Surveiller l'exécution

Dans le 1er onglet, le webhook reçoit les données. Le workflow s'exécute automatiquement. Allez dans **Executions** pour voir l'avancement.

Une exécution réussie dure entre **5 et 15 secondes** (à cause de l'appel à OpenAI).

### ÉTAPE 5 — Vérifier les résultats dans Supabase

```sql
-- Vérification 1 : le suivi post-audit a été créé
SELECT pack_id, organization_name, workflow_status, assigned_expert_email, next_action_at
FROM post_audit_follow_ups 
WHERE pack_id = 'test-e2e-pack-001';

-- Résultat attendu :
-- pack_id             | organization_name | workflow_status  | assigned_expert_email
-- test-e2e-pack-001   | Société Test IA   | ready_for_expert | contact@transferai.ci
```

```sql
-- Vérification 2 : le statut du pack a été mis à jour
SELECT pack_id, status 
FROM ai_prospecting_packs 
WHERE pack_id = 'test-e2e-pack-001';

-- Résultat attendu :
-- pack_id           | status
-- test-e2e-pack-001 | post_audit_processed
```

```sql
-- Vérification 3 : le prospect a été qualifié
SELECT prospect_id, last_sequence_result, niche_status
FROM prospect_targets 
WHERE prospect_id = 'test-e2e-prospect-001';

-- Résultat attendu :
-- prospect_id            | last_sequence_result | niche_status
-- test-e2e-prospect-001  | post_audit_ready     | qualified_after_audit
```

### ÉTAPE 6 — Vérifier l'email reçu

Ouvrez votre boîte email. Vous devez recevoir un email avec l'objet :
**"Fiche pre-RDV post-audit - Société Test IA"**

L'email contient la fiche Pré-RDV générée par l'IA avec :
- Identification du prospect
- Synthèse exécutive
- Maturité IA
- Cas d'usage prioritaires
- Quick Wins
- Contraintes
- Orientation TransferAI
- Prochaine étape

---

# 5. GUIDE DE DÉPANNAGE (TROUBLESHOOTING)

## 5.1 Erreurs dans n8n

### Erreur : `Cannot read properties of undefined (reading 'data')`

**Symptôme** : Apparaît sur les nœuds PATCH ou POST vers Supabase.

**Cause** : Le format de réponse est configuré sur JSON alors que Supabase renvoie une réponse vide.

**Solution** :
1. Ouvrez le nœud en erreur
2. Faites défiler jusqu'à **Options**
3. Changez **Response Format** de `JSON` → `Text`
4. Réexécutez le nœud

---

### Erreur : `Invalid character in header content ["apikey"]`

**Symptôme** : Apparaît sur les nœuds HTTP Request qui appellent Supabase.

**Cause** : Le nom ou la valeur du header contient des caractères invisibles (copier-coller depuis un PDF ou une page web).

**Solution** :
1. Supprimez le header `apikey` en cliquant sur la croix
2. Cliquez **Add Header**
3. Tapez manuellement (sans copier-coller) : `apikey`
4. Collez la valeur de votre clé service_role
5. Réexécutez

---

### Erreur : `access to env vars denied`

**Symptôme** : Apparaît dans les nœuds Code ou Set qui utilisent `$env.VARIABLE`.

**Cause** : n8n en mode self-hosted ne permet pas l'accès aux variables d'environnement depuis les nœuds Code et Set (seulement depuis les nœuds HTTP Request via des expressions).

**Solution** : Remplacez `$env.VARIABLE_NAME` par la valeur directement codée.

Exemple :
```javascript
// ❌ Ne fonctionne pas
const email = $env.POST_AUDIT_INTERNAL_EMAIL;

// ✅ Fonctionne
const email = 'contact@transferai.ci';
```

---

### Erreur : `Array.isArray($json)` retourne toujours false

**Symptôme** : Un nœud Code qui vérifie si les données sont un tableau ne fonctionne pas correctement.

**Cause** : n8n passe chaque élément du tableau séparément, pas le tableau entier.

**Solution** : Utilisez le pattern `$input.all()` :
```javascript
// ❌ Ne fonctionne pas en n8n
if (Array.isArray($json)) {
  const rows = $json;
}

// ✅ Fonctionne en n8n
const allItems = $input.all();
const rows = allItems.map(item => item.json).filter(Boolean);
const row = rows[0] || {};
```

---

### Erreur : `Invalid URL: URL must start with "http" or "https"`

**Symptôme** : Apparaît sur le nœud `Send Slack Expert Alert`.

**Cause** : La variable `$env.POST_AUDIT_SLACK_WEBHOOK_URL` est vide car Slack n'est pas configuré.

**Solution** : Désactivez le nœud si vous n'utilisez pas Slack.
1. Clic droit sur le nœud `Send Slack Expert Alert`
2. Sélectionnez **Disable**

---

### Le workflow prend moins de 2 secondes et retourne No-Op

**Symptôme** : L'exécution réussit en moins de 2 secondes et arrive sur `Build No-Op Result`.

**Cause** : Les données requises n'ont pas été trouvées dans la base de données. Le workflow prend un raccourci.

**Diagnostics à faire dans l'ordre :**

1. Vérifiez que le `pack_id` existe dans `ai_prospecting_packs` :
```sql
SELECT * FROM ai_prospecting_packs WHERE pack_id = 'votre-pack-id';
```

2. Vérifiez que la `form_response` existe avec `is_completed = true` :
```sql
SELECT id, pack_id, is_completed, completion_percentage 
FROM form_responses 
WHERE pack_id = 'votre-pack-id';
```

3. Si `pack_id` est NULL dans `form_responses`, corrigez-le :
```sql
UPDATE form_responses 
SET pack_id = 'votre-pack-id' 
WHERE id = 'id-de-la-reponse';
```

---

### Erreur : `Forbidden - Authorization data is wrong!`

**Symptôme** : Sur un HTTP Request qui appelle le webhook n8n.

**Cause** : La valeur du header `x-transferai-secret` ne correspond pas à celle configurée dans le credential `Header Auth`.

**Solution** :
1. Dans n8n → Settings → Credentials → Header Auth account 3
2. Notez la valeur exacte
3. Dans votre HTTP Request de test, utilisez exactement cette valeur

---

## 5.2 Erreurs dans Supabase

### Erreur SQL : `violates check constraint "valid_status"`

**Symptôme** : Apparaît lors d'un INSERT dans `form_invitations`.

**Cause** : La valeur du champ `status` n'est pas autorisée par la table.

**Solution** : Utilisez uniquement les valeurs autorisées :
- Pour `form_invitations.status` : `'pending'` ou `'completed'`

```sql
-- ❌ Ne fonctionne pas
INSERT INTO form_invitations (..., status) VALUES (..., 'sent');

-- ✅ Fonctionne
INSERT INTO form_invitations (..., status) VALUES (..., 'pending');
```

---

### Erreur SQL : `new row violates row-level security policy`

**Symptôme** : Apparaît lors d'un INSERT ou UPDATE.

**Cause** : La table a la RLS activée et la politique de sécurité bloque l'accès.

**Solution** : Désactivez la RLS sur cette table :
```sql
ALTER TABLE public.nom_de_la_table DISABLE ROW LEVEL SECURITY;
```

Ou créez une politique permissive pour le rôle service_role :
```sql
CREATE POLICY "allow_service_role" ON public.nom_de_la_table
  AS PERMISSIVE FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

---

### Erreur SQL : `Could not find the table in the schema cache`

**Symptôme** : Apparaît dans n8n quand il essaie d'accéder à une table.

**Cause** : La table n'a pas encore été créée dans Supabase.

**Solution** : Exécutez le script de migration SQL complet dans le SQL Editor.

---

### Erreur SQL : `column does not exist`

**Symptôme** : Apparaît lors d'une requête avec un ORDER BY ou SELECT sur une colonne.

**Cause** : Le nom de la colonne utilisé dans la requête ne correspond pas au nom réel dans la table.

**Solution** : Vérifiez le nom exact de la colonne :
```sql
-- Vérifier les colonnes d'une table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'form_responses';
```

---

### Le SQL Editor n'affiche qu'un seul résultat sur plusieurs SELECT

**Symptôme** : Vous exécutez 3 SELECT mais ne voyez que le dernier résultat.

**Cause** : C'est le comportement normal du SQL Editor de Supabase.

**Solution** : Exécutez chaque SELECT séparément en cliquant sur **Run** après chaque requête.

---

## 5.3 Problèmes liés à l'Edge Function

### L'Edge Function renvoie `Missing session or invitation token`

**Symptôme** : Code 400 dans les logs de l'Edge Function.

**Cause** : La requête envoyée à l'Edge Function ne contient ni `sessionId` ni `inviteToken`.

**Solution** : Assurez-vous que votre requête contient l'un de ces champs :
```json
{
  "inviteToken": "votre-token",
  "packId": "votre-pack-id",
  ...
}
```

---

### L'Edge Function ne déclenche pas le webhook n8n

**Symptôme** : La form_response est créée mais aucune exécution n8n n'apparaît.

**Causes possibles** :
1. `N8N_POST_AUDIT_WEBHOOK_URL` n'est pas configuré dans les secrets Supabase
2. L'URL pointe vers la Test URL (webhook-test) au lieu de la Production URL
3. Le workflow n8n n'est pas activé (bouton non vert)
4. Le `completionPercentage` envoyé est inférieur à 80

**Vérification** : L'Edge Function ne déclenche le webhook que si `completionPercentage >= 80`.

---

# 6. RÉFÉRENCE DES WORKFLOWS — V1 À V5

## 6.1 Vue d'ensemble des workflows

| Workflow | Nom | Rôle | Statut |
|----------|-----|------|--------|
| **V1** | Intake & Qualification | Reçoit et qualifie les premières demandes | À construire |
| **V2** | Post-Audit Expert Routing | Traite les formulaires complétés et génère les fiches Pré-RDV | ✅ **Terminé** |
| **V3** | Pack Generation | Génère les packs de prospection pour chaque prospect | À construire |
| **V4** | Batch Orchestration | Orchestre les campagnes de prospection en masse | À construire |
| **V5** | CRM Management | Gère l'état des prospects dans le CRM | À construire |

## 6.2 Workflow V2 — Post-Audit Expert Routing (TERMINÉ)

**Fichier** : `docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json`

**Déclencheurs** :
- Webhook (depuis l'Edge Function `save-form-response`)
- Manuel (via le nœud Manual Trigger)
- Planifié (toutes les 30 minutes via Reconciliation Schedule)

**Flux des nœuds** :

```
[Audit Completed Webhook]
        │
        ▼
[Parse Post-Audit Webhook] → Extrait pack_id, response_id, completion_percentage
        │
        ▼
[Normalize Post-Audit Request] → Normalise les types de données
        │
        ▼
[If Pack Id Provided] ──► OUI ──► [Get Pack Row] → Cherche le pack dans Supabase
        │                                │
        │ NON                            ▼
        ▼                        [Extract Pack Row] → Extrait les données du pack
[Fetch Recent Completed]                 │
[Responses]                             ▼
        │                        [If Pack Found]
        ▼                              │ OUI
[Extract Next Completed]               ▼
[Response]                      [Get Latest Form Response]
        │                              │
        ▼                             ▼
[If Candidate Response Found]   [Extract Latest Form Response]
                                       │
                                       ▼
                                [If Audit Completed] ──► NON ──► [Build No-Op Result]
                                       │ OUI
                                       ▼
                                [Get Invitation Row]
                                       │
                                       ▼
                                [Get Prospect Target Row]
                                       │
                                       ▼
                                [If Already Processed] ──► OUI ──► [Build No-Op Result]
                                       │ NON
                                       ▼
                                [Build Expert Routing] → Calcule l'expert et la priorité
                                       │
                                       ▼
                                [Build Post-Audit CRM Context] → Prépare toutes les données
                                       │
                                       ▼
                                [Generate Internal Pre-RDV Brief] → Appel OpenAI GPT-4.1-mini
                                       │
                                       ▼
                                [Update Prospect Target Post-Audit] → PATCH Supabase
                                       │
                                       ▼
                                [Patch Pack Post-Audit Status] → PATCH Supabase
                                       │
                                       ▼
                                [Upsert Follow-Up Tracking] → POST Supabase (upsert)
                                       │
                                       ▼
                                [Send Internal Brief Email] → POST Resend API
                                       │
                                       ▼
                                [If Slack Alerts Enabled]
                                       │
                                       ▼
                                [Build Post-Audit Result] → Résultat final
```

**Variables d'environnement requises dans Supabase** :

| Secret | Description |
|--------|-------------|
| `N8N_POST_AUDIT_WEBHOOK_URL` | URL Production du webhook n8n |
| `N8N_WEBHOOK_SECRET` | Clé secrète partagée avec n8n |
| `POST_AUDIT_INTERNAL_EMAIL` | Email de réception interne |

**Valeurs codées directement dans les nœuds** :

| Nœud | Valeur codée | Remplacez par |
|------|--------------|---------------|
| `Build Expert Routing` | `'contact@transferai.ci'` | Votre email interne |
| `Normalize Post-Audit Request` | `'contact@transferai.ci'` | Votre email interne |
| `Send Internal Brief Email` | Clé Resend | Votre clé Resend |
| `Generate Internal Pre-RDV Brief` | Clé OpenAI | Votre clé OpenAI |
| Tous les nœuds Supabase | URL + clé service_role | Vos identifiants Supabase |

## 6.3 Workflow V3 — Pack Generation (À CONSTRUIRE)

**Rôle** : Génère automatiquement des packs de prospection à partir d'une liste de prospects.

**Ce qu'il doit faire** :
1. Lire une liste de prospects (depuis un fichier, un CRM, ou Supabase)
2. Pour chaque prospect, générer un pack personnalisé avec l'IA
3. Créer le pack dans `ai_prospecting_packs`
4. Créer une invitation dans `form_invitations`
5. Envoyer le lien du formulaire au prospect par email

**Tables utilisées** :
- `ai_prospecting_packs` (écriture)
- `form_invitations` (écriture)
- `prospect_targets` (lecture/écriture)

## 6.4 Workflow V4 — Batch Orchestration (À CONSTRUIRE)

**Rôle** : Orchestre les campagnes de prospection en masse, en gérant les envois par lots pour éviter le spam et respecter les limites des APIs.

**Ce qu'il doit faire** :
1. Planifier les envois selon un calendrier
2. Respecter les limites de taux des APIs d'email
3. Gérer les relances automatiques
4. Mettre à jour les statuts dans `prospect_targets`

## 6.5 Workflow V5 — CRM Management (À CONSTRUIRE)

**Rôle** : Gère l'état global du CRM, les mises à jour de statut, et les rapports.

**Ce qu'il doit faire** :
1. Synchroniser les statuts des prospects
2. Générer des rapports d'activité
3. Gérer les prospects à ne pas contacter (do_not_contact)
4. Nettoyer les données obsolètes

---

# 7. GLOSSAIRE

| Terme | Définition |
|-------|------------|
| **API** | Interface de programmation — permet à deux logiciels de communiquer entre eux |
| **UUID** | Identifiant unique universel — une chaîne de caractères qui identifie de manière unique un élément (ex: `3f95924a-5d75-4328-a936-6910a7d0bec0`) |
| **JSON** | Format de données structurées utilisé pour échanger des informations entre systèmes |
| **Webhook** | Un point d'entrée URL qui déclenche automatiquement une action quand il reçoit des données |
| **RLS** | Row Level Security — système de sécurité de Supabase qui contrôle l'accès aux données ligne par ligne |
| **Edge Function** | Un programme qui s'exécute automatiquement dans Supabase à la réception d'une requête |
| **Upsert** | Opération qui insère une nouvelle ligne si elle n'existe pas, ou la met à jour si elle existe déjà |
| **Service Role Key** | Clé d'accès administrative à Supabase — donne un accès total à la base de données |
| **Anon Key** | Clé d'accès publique à Supabase — accès limité selon les politiques RLS |
| **Payload** | Les données envoyées dans une requête ou stockées dans un champ JSON |
| **Pack** | Un dossier de prospection contenant toutes les informations sur un prospect |
| **Completion Percentage** | Pourcentage de complétion du formulaire (le workflow s'active à partir de 80%) |
| **No-Op** | No Operation — le workflow n'a rien fait car les conditions n'étaient pas remplies |
| **PATCH** | Méthode HTTP pour mettre à jour partiellement une ressource existante |
| **POST** | Méthode HTTP pour créer une nouvelle ressource |
| **GET** | Méthode HTTP pour lire des données sans les modifier |
| **Header** | En-tête d'une requête HTTP — contient des métadonnées comme les clés d'authentification |

---

*Document généré le 6 juin 2026 — TransferAI Technical Team*  
*Pour toute question, contactez l'équipe technique à contact@transferai.ci*
