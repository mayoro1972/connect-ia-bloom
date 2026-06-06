# MANUEL DE TEST & TROUBLESHOOTING
## TransferAI — Post-Audit Expert Routing V2
### Tutoriel complet pour les experts du groupe

---

> **Version** : 1.0 — Juin 2026  
> **Basé sur** : Session de test réelle du 6 juin 2026  
> **Public cible** : Experts techniques TransferAI  
> **Prérequis** : Avoir lu le Manuel Expert TransferAI  

---

# TABLE DES MATIÈRES

1. [Résultat final du test E2E](#1-résultat-final-du-test-e2e)
2. [Ce qui a été validé](#2-ce-qui-a-été-validé)
3. [Plan de test étape par étape](#3-plan-de-test-étape-par-étape)
4. [Chronologie complète des erreurs rencontrées](#4-chronologie-complète-des-erreurs-rencontrées)
5. [Troubleshooting détaillé — fiche par fiche](#5-troubleshooting-détaillé--fiche-par-fiche)
6. [Vérifications SQL post-test](#6-vérifications-sql-post-test)
7. [Checklist de validation finale](#7-checklist-de-validation-finale)

---

# 1. RÉSULTAT FINAL DU TEST E2E

## ✅ TEST RÉUSSI — 6 juin 2026 à 19h08

Le test end-to-end complet du workflow **TransferAI Post-Audit Expert Routing V2** a été validé avec succès.

### Preuve de réussite

Réception de l'email dans **deux boîtes différentes** simultanément :

```
Objet : Fiche pre-RDV post-audit - Société Test IA
De    : TransferAI <contact@transferai.ci>
À     : marius.ayoro70@gmail.com
Date  : 6 juin 2026 à 19h08
```

**Contenu de l'email généré par l'IA :**

```markdown
# Fiche Pré-RDV Interne TransferAI

## Identification
- Organisation       : Société Test IA
- Décideur principal : Marius Ayoro, Directeur Digital
- Email              : marius.ayoro70@gmail.com
- Secteur            : Technologie
- Langue             : Français
- Priorité commerciale : A
- Date de soumission : 6 juin 2026

## Synthèse Exécutive
Société Test IA, secteur technologie, est au stade débutant en maturité IA.
Le décideur, Marius Ayoro, souhaite prioriser des cas d'usage liés
à l'automatisation RH et au reporting IA. Le principal enjeu identifié
est un budget limité. Un quick win identifié est un gain de temps sur
les rapports. L'orientation recommandée est vers l'offre
« Automatisation des processus » avec une priorité élevée.

## Maturité IA
- Niveau : Débutant
- Implication : Besoin d'accompagnement pour structurer les premiers projets IA.

## Cas d'usage prioritaires
- Automatisation RH
- Reporting IA

## Quick Wins
- Gain de temps sur les rapports

## Contraintes
- Budget limité

## Orientation TransferAI
- Service principal recommandé  : Automatisation des processus
- Parcours complémentaire       : Non spécifié
- Niveau de confiance           : Élevé (priorité commerciale A, routing priority high)
- Raisons de l'orientation      : Correspondance directe avec les cas d'usage
                                  prioritaires et maturité débutante
- Prochaine étape               : Préparer un RDV pour approfondir les besoins,
                                  valider les cas d'usage et proposer un plan
                                  d'accompagnement adapté au budget.
```

---

# 2. CE QUI A ÉTÉ VALIDÉ

## 2.1 Flux complet validé

### Phase 1 — Simulation de V3 (Génération de pack)

| Élément créé | Table | Valeur |
|--------------|-------|--------|
| Pack de prospection | `ai_prospecting_packs` | `pack_id = test-e2e-pack-001` |
| Invitation formulaire | `form_invitations` | `invite_token = test-token-e2e-001` |
| Prospect cible | `prospect_targets` | `prospect_id = test-e2e-prospect-001` |

### Phase 2 — Simulation de la soumission du formulaire

| Action | Résultat |
|--------|----------|
| Appel à l'Edge Function `save-form-response` | ✅ HTTP 200 — Succès |
| Sauvegarde de la `form_response` | ✅ `is_completed = true`, `completion_percentage = 90` |
| Déclenchement automatique du webhook V2 | ✅ Workflow lancé en moins d'une seconde |

### Phase 3 — Exécution du workflow V2

| Nœud | Action | Résultat |
|------|--------|----------|
| `Audit Completed Webhook` | Réception des données | ✅ |
| `Parse Post-Audit Webhook` | Extraction des champs | ✅ |
| `Normalize Post-Audit Request` | Normalisation des types | ✅ |
| `Get Pack Row` | Lecture du pack dans Supabase | ✅ |
| `Extract Pack Row` | Extraction des données du pack | ✅ |
| `Get Latest Form Response` | Lecture de la réponse formulaire | ✅ |
| `Extract Latest Form Response` | `audit_completed = true` | ✅ |
| `Get Invitation Row` | Lecture de l'invitation | ✅ |
| `Get Prospect Target Row` | Lecture du prospect | ✅ |
| `If Already Post-Audit Processed` | `already_processed = false` | ✅ → Chemin principal |
| `Build Expert Routing` | Calcul routing secteur technologie → priorité High | ✅ |
| `Build Post-Audit CRM Context` | Assemblage de tout le contexte CRM | ✅ |
| `Generate Internal Pre-RDV Brief` | Appel GPT-4.1-mini (13 574 tokens) | ✅ |
| `Update Prospect Target Post-Audit` | PATCH `prospect_targets` | ✅ |
| `Patch Pack Post-Audit Status` | PATCH `ai_prospecting_packs` | ✅ |
| `Upsert Follow-Up Tracking` | POST `post_audit_follow_ups` | ✅ |
| `Send Internal Brief Email` | Envoi via Resend API | ✅ ID email reçu |
| `If Slack Alerts Enabled` | Slack non configuré → False Branch | ✅ |
| `Build Post-Audit Result` | Résultat final assemblé | ✅ |

### Phase 4 — Résultats en base de données

| Table | Champ mis à jour | Valeur finale |
|-------|-----------------|---------------|
| `ai_prospecting_packs` | `status` | `post_audit_processed` |
| `prospect_targets` | `last_sequence_result` | `post_audit_ready` |
| `prospect_targets` | `niche_status` | `qualified_after_audit` |
| `prospect_targets` | `last_response_status` | `audit_completed` |
| `post_audit_follow_ups` | `workflow_status` | `ready_for_expert` |
| `post_audit_follow_ups` | `assigned_expert_email` | `contact@transferai.ci` |

### Phase 5 — Email reçu

- ✅ Email reçu dans Gmail (`marius.ayoro70@gmail.com`)
- ✅ Email reçu dans le client mail alternatif
- ✅ Contenu généré par GPT-4.1-mini en français professionnel
- ✅ Toutes les sections présentes (identification, synthèse, maturité, cas d'usage, quick wins, contraintes, orientation, prochaine étape)

---

# 3. PLAN DE TEST ÉTAPE PAR ÉTAPE

## 3.1 Prérequis — Ce qu'il faut vérifier avant de commencer

```
□ Accès à Supabase (supabase.com) avec les droits administrateur
□ Accès à n8n avec le workflow V2 importé
□ Le workflow V2 est ACTIVÉ (bouton vert "Active" ou "Publish")
□ Les secrets Supabase sont configurés :
    □ N8N_POST_AUDIT_WEBHOOK_URL = URL Production du webhook
    □ N8N_WEBHOOK_SECRET = votre clé secrète
    □ POST_AUDIT_INTERNAL_EMAIL = email de réception
□ La table post_audit_follow_ups existe dans Supabase
□ La RLS est désactivée sur post_audit_follow_ups
□ Les nœuds Supabase dans n8n ont les bons headers (apikey, Authorization)
□ Le nœud Send Internal Brief Email a la bonne clé Resend
□ Le nœud Generate Internal Pre-RDV Brief a la bonne clé OpenAI
```

## 3.2 ÉTAPE 1 — Initialisation des données de test dans Supabase

**Où** : Supabase → SQL Editor  
**Durée estimée** : 2 minutes  
**Résultat attendu** : `Success. No rows returned` pour chaque ligne

```sql
-- === NETTOYAGE ===
-- Supprime les données de test précédentes pour repartir proprement

DELETE FROM public.post_audit_follow_ups 
WHERE pack_id = 'test-e2e-pack-001';

DELETE FROM public.form_responses 
WHERE pack_id = 'test-e2e-pack-001';

DELETE FROM public.form_invitations 
WHERE pack_id = 'test-e2e-pack-001';

DELETE FROM public.ai_prospecting_packs 
WHERE pack_id = 'test-e2e-pack-001';

DELETE FROM public.prospect_targets 
WHERE prospect_id = 'test-e2e-prospect-001';
```

> ⚠️ Exécutez chaque DELETE séparément en cliquant sur **Run** après chaque commande.

```sql
-- === CRÉATION DU PROSPECT ===
INSERT INTO public.prospect_targets (prospect_id, status, outreach_attempt_count)
VALUES ('test-e2e-prospect-001', 'active', 1);
```

```sql
-- === CRÉATION DU PACK (simule V3) ===
INSERT INTO public.ai_prospecting_packs 
  (pack_id, prospect_id, organization_name, target_email, status, payload)
VALUES (
  'test-e2e-pack-001',
  'test-e2e-prospect-001',
  'Société Test IA',
  'VOTRE-EMAIL@exemple.com',     -- ← Remplacez par votre email
  'audit_sent',
  '{
    "organization_name": "Société Test IA",
    "prospect_id": "test-e2e-prospect-001",
    "target_email": "VOTRE-EMAIL@exemple.com",
    "prospect_language": "fr",
    "sector_guess": "technologie",
    "recommended_offer": "Automatisation des processus",
    "commercial_priority_tier": "A",
    "internal_email_to": "VOTRE-EMAIL@exemple.com"
  }'::jsonb
);
```

```sql
-- === CRÉATION DE L'INVITATION ===
-- ⚠️ Utilisez 'pending' et non 'sent' (valeur non autorisée)
INSERT INTO public.form_invitations 
  (invite_token, pack_id, invitee_email, status)
VALUES 
  ('test-token-e2e-001', 'test-e2e-pack-001', 'VOTRE-EMAIL@exemple.com', 'pending');
```

**Vérification après insertion :**
```sql
-- Confirmez que les 3 entrées ont bien été créées
SELECT 'pack' as type, pack_id as id FROM ai_prospecting_packs 
  WHERE pack_id = 'test-e2e-pack-001'
UNION ALL
SELECT 'invitation', invite_token FROM form_invitations 
  WHERE pack_id = 'test-e2e-pack-001'
UNION ALL
SELECT 'prospect', prospect_id FROM prospect_targets 
  WHERE prospect_id = 'test-e2e-prospect-001';

-- Résultat attendu : 3 lignes
```

## 3.3 ÉTAPE 2 — Préparation de n8n pour le test

**Où** : n8n → Workflow V2  
**Durée estimée** : 1 minute

1. Ouvrez le workflow **TransferAI Post-Audit Expert Routing V2**
2. Vérifiez que le workflow est **ACTIVÉ** (bouton vert en haut à droite)
3. Ouvrez le nœud **Audit Completed Webhook**
4. Notez la **Production URL** (sans `-test`) :
   ```
   https://[VOTRE-N8N]/webhook/transferai-post-audit-expert-routing-v2
   ```
5. **Ouvrez un deuxième onglet** de votre navigateur sur la même page n8n

## 3.4 ÉTAPE 3 — Déclenchement du webhook depuis n8n

**Où** : Deuxième onglet n8n — nœud HTTP Request de test  
**Durée estimée** : 3 minutes

Dans le deuxième onglet, configurez votre nœud **HTTP Request** de test :

| Paramètre | Valeur |
|-----------|--------|
| Method | `POST` |
| URL | Production URL du webhook (sans `-test`) |
| Header `Content-Type` | `application/json` |
| Header `x-transferai-secret` | Votre clé secrète |
| Body format | Using JSON |

**Corps JSON à envoyer :**
```json
{
  "pack_id": "test-e2e-pack-001",
  "response_id": "[ID obtenu après l'étape 1]",
  "completion_percentage": 90,
  "is_completed": true,
  "internal_email_to": "VOTRE-EMAIL@exemple.com",
  "next_action_delay_days": 1,
  "trigger_source": "save-form-response"
}
```

> 📌 **Comment obtenir le response_id ?**  
> Après l'étape 1, si vous avez appelé l'Edge Function `save-form-response`, l'ID est retourné dans la réponse :
> ```json
> {"success": true, "responseId": "3f95924a-5d75-...", ...}
> ```
> Sinon, cherchez-le dans Supabase :
> ```sql
> SELECT id FROM form_responses WHERE pack_id = 'test-e2e-pack-001';
> ```

Cliquez **Execute step**.

## 3.5 ÉTAPE 4 — Surveillance de l'exécution dans n8n

**Où** : n8n → Onglet Executions  
**Durée estimée** : 10 à 20 secondes (OpenAI prend du temps)

1. Allez dans l'onglet **Executions** du workflow
2. Attendez l'apparition d'une nouvelle exécution
3. ✅ **Succès** = durée entre 5 et 20 secondes
4. ❌ **No-Op** = durée inférieure à 3 secondes → voir section Troubleshooting

**Interprétation des durées d'exécution :**

| Durée | Interprétation |
|-------|----------------|
| < 2 secondes | No-Op — données non trouvées ou déjà traitées |
| 2 à 5 secondes | Chemin court — possible erreur avant OpenAI |
| 5 à 20 secondes | ✅ Chemin complet — OpenAI + email envoyé |
| > 30 secondes | Timeout OpenAI possible — vérifier les logs |

## 3.6 ÉTAPE 5 — Vérification des données en base

**Où** : Supabase → SQL Editor  
**Durée estimée** : 2 minutes

Exécutez chaque requête séparément :

```sql
-- Vérification 1 : Suivi post-audit créé
SELECT pack_id, organization_name, workflow_status, 
       assigned_expert_email, next_action_at
FROM post_audit_follow_ups 
WHERE pack_id = 'test-e2e-pack-001';
```
**Résultat attendu** : 1 ligne avec `workflow_status = 'ready_for_expert'`

```sql
-- Vérification 2 : Statut du pack mis à jour
SELECT pack_id, status 
FROM ai_prospecting_packs 
WHERE pack_id = 'test-e2e-pack-001';
```
**Résultat attendu** : `status = 'post_audit_processed'`

```sql
-- Vérification 3 : Prospect qualifié
SELECT prospect_id, last_sequence_result, niche_status, last_response_status
FROM prospect_targets 
WHERE prospect_id = 'test-e2e-prospect-001';
```
**Résultat attendu** : `last_sequence_result = 'post_audit_ready'`, `niche_status = 'qualified_after_audit'`

## 3.7 ÉTAPE 6 — Vérification de l'email reçu

**Où** : Votre boîte email  
**Durée estimée** : 1 minute

Ouvrez votre boîte email et cherchez :
- **Objet** : `Fiche pre-RDV post-audit - Société Test IA`
- **Expéditeur** : TransferAI
- **Contenu** : Fiche Pré-RDV structurée en markdown

✅ Si l'email est reçu → **Test réussi**  
❌ Si l'email n'est pas reçu → Vérifiez les logs Resend et la section Troubleshooting

---

# 4. CHRONOLOGIE COMPLÈTE DES ERREURS RENCONTRÉES

Cette section documente **dans l'ordre exact** toutes les erreurs rencontrées lors de la session de test réelle du 6 juin 2026, avec leur résolution.

---

## ERREUR #1 — `$env` non accessible dans les nœuds Code et Set

**Quand** : Lors de la configuration initiale des nœuds  
**Nœuds concernés** : `Set Post-Audit Manual Input`, `Normalize Post-Audit Request`, `Build Expert Routing`

**Message d'erreur** :
```
access to env vars denied
```

**Cause** :  
n8n en mode self-hosted ne permet pas l'accès aux variables d'environnement système (`$env.VARIABLE`) depuis les nœuds Code et Set. Cette restriction de sécurité existe pour éviter l'exposition de données sensibles.

**Solution appliquée** :  
Remplacement de toutes les références `$env.XXX` par les valeurs directes codées dans le nœud.

```javascript
// ❌ Avant — ne fonctionne pas
const email = $env.POST_AUDIT_INTERNAL_EMAIL;
const slackUrl = $env.POST_AUDIT_SLACK_WEBHOOK_URL;

// ✅ Après — fonctionne
const email = 'contact@transferai.ci';
const slackUrl = ''; // Slack non configuré
```

**Dans les nœuds Set**, remplacer :
```
={{$json.internal_email_to || $env.POST_AUDIT_INTERNAL_EMAIL || 'contact@transferai.ci'}}
```
Par :
```
={{$json.internal_email_to || 'contact@transferai.ci'}}
```

---

## ERREUR #2 — `Extract Pack Row` retourne `found: false`

**Quand** : Premier test du nœud `Extract Pack Row`  
**Symptôme** : Le champ `found` était toujours `false` même avec des données valides dans Supabase

**Cause** :  
Le code utilisait `Array.isArray($json)` pour détecter si les données étaient un tableau. En n8n, chaque item est passé séparément au nœud Code — `$json` n'est jamais un tableau directement.

**Code défaillant** :
```javascript
// ❌ Ne fonctionne pas en n8n
const rows = Array.isArray($json) ? $json : [];
const row = rows[0] || {};
```

**Solution appliquée** :
```javascript
// ✅ Fonctionne en n8n
const allItems = $input.all();
const rows = allItems.map(item => item.json).filter(Boolean);
const row = rows[0] || {};
```

**Nœuds corrigés avec ce pattern** :
- `Extract Pack Row`
- `Extract Latest Form Response`
- `Extract Invitation Row`
- `Extract Prospect Target Row`
- `Extract Next Completed Response`

---

## ERREUR #3 — `column form_responses.updated_at does not exist`

**Quand** : Test du nœud `Get Latest Form Response`  
**Message d'erreur** :
```
column form_responses.updated_at does not exist
```

**Cause** :  
La table `form_responses` utilise `last_updated_at` et non `updated_at`. L'URL du nœud contenait `order=submitted_at.desc.nullslast,updated_at.desc.nullslast`.

**Solution appliquée** :  
Retrait du paramètre de tri sur `updated_at` dans l'URL :
```
// ❌ Avant
/rest/v1/form_responses?...&order=submitted_at.desc.nullslast,updated_at.desc.nullslast

// ✅ Après
/rest/v1/form_responses?...&order=submitted_at.desc.nullslast
```

---

## ERREUR #4 — `audit_completed` retourne toujours `false`

**Quand** : Test du nœud `Extract Latest Form Response`  
**Symptôme** : Même avec une `form_response` ayant `is_completed = true` dans Supabase, le champ `audit_completed` valait `false`

**Cause** :  
Le nœud utilisait `Array.isArray($json)` (même problème que l'erreur #2) et ne récupérait pas correctement les données.

**Solution appliquée** :  
Même correction que l'erreur #2, avec `$input.all()`.

---

## ERREUR #5 — Nœuds `Get Invitation Row` et `Get Prospect Target Row` sans données de sortie

**Quand** : Test des nœuds de lecture Supabase  
**Symptôme** : "No output data" affiché — le nœud ne produisait aucune sortie

**Cause** :  
Aucune donnée correspondante dans Supabase lors des tests. La table `form_invitations` n'avait pas d'entrée avec le `pack_id` de test.

**Solution appliquée** :  
Activation de l'option **Always Output Data** dans l'onglet Settings de chaque nœud. Ainsi, même si Supabase renvoie `[]`, le nœud produit `[{}]` et le workflow continue.

---

## ERREUR #6 — `Cannot read properties of undefined (reading 'data')`

**Quand** : Test des nœuds PATCH Supabase  
**Nœuds concernés** : `Update Prospect Target Post-Audit`, `Patch Pack Post-Audit Status`

**Message d'erreur** :
```
TypeError: Cannot read properties of undefined (reading 'data')
```

**Cause** :  
Les requêtes PATCH vers Supabase retournent HTTP 204 (No Content) — le corps de la réponse est vide. n8n essayait de parser ce corps vide comme du JSON.

**Solution appliquée** :  
Changement du **Response Format** de `JSON` → `Text` dans les Options de chaque nœud PATCH.

```
Options → Response → Response Format → Text
```

---

## ERREUR #7 — URLs incorrectes sur les nœuds PATCH

**Quand** : Test des nœuds PATCH  
**Symptôme** : Les mises à jour ne s'appliquaient pas à la bonne table

**Cause** :  
Les nœuds `Update Prospect Target Post-Audit` et `Patch Pack Post-Audit Status` pointaient vers des tables incorrectes dans leurs URLs.

**Solution appliquée** :

| Nœud | URL incorrecte | URL correcte |
|------|----------------|--------------|
| `Update Prospect Target Post-Audit` | `/form_responses?...` | `/prospect_targets?prospect_id=eq.{id}` |
| `Patch Pack Post-Audit Status` | `/form_invitations?...` | `/ai_prospecting_packs?pack_id=eq.{id}` |

---

## ERREUR #8 — `Invalid character in header content ["apikey"]`

**Quand** : Test du nœud `Upsert Follow-Up Tracking`  
**Message d'erreur** :
```
Invalid character in header content ["apikey"]
```

**Cause** :  
Le nom ou la valeur du header `apikey` contenait des caractères invisibles introduits lors d'un copier-coller (espace insécable, retour à la ligne, etc.).

**Solution appliquée** :
1. Suppression complète du header `apikey`
2. Recréation manuelle en **tapant** (sans copier-coller) le nom `apikey`
3. Collage propre de la valeur de la clé service_role

---

## ERREUR #9 — Routing inversé sur `If Already Post-Audit Processed`

**Quand** : Test du flux de décision  
**Symptôme** : Le workflow allait vers `Build No-Op Result` même quand le prospect n'était pas encore traité

**Cause** :  
Les connexions des sorties du nœud `If Already Post-Audit Processed` étaient inversées :
- Output 0 (true = déjà traité) → devait aller vers `Build No-Op Result`
- Output 1 (false = pas encore traité) → devait aller vers `Build Expert Routing`

**Solution appliquée** :  
Vérification et correction des connexions dans le canvas n8n en s'assurant que :
- **True Branch** → `Build No-Op Result`
- **False Branch** → `Build Expert Routing`

---

## ERREUR #10 — `Could not find the table 'public.post_audit_follow_ups'`

**Quand** : Premier test du nœud `Upsert Follow-Up Tracking`  
**Message d'erreur** :
```
Could not find the table 'public.post_audit_follow_ups' in the schema cache
```

**Cause** :  
La table `post_audit_follow_ups` n'avait pas encore été créée dans Supabase. La migration SQL n'avait pas été exécutée.

**Solution appliquée** :  
Exécution du SQL de création dans le SQL Editor de Supabase :

```sql
CREATE TABLE IF NOT EXISTS public.post_audit_follow_ups (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id               text        NOT NULL UNIQUE,
  prospect_id           text,
  organization_name     text,
  target_email          text,
  sector_guess          text,
  maturity_level        text,
  recommended_offer     text,
  primary_service       text,
  secondary_service     text,
  priority_use_cases    jsonb       NOT NULL DEFAULT '[]'::jsonb,
  quick_wins_declared   jsonb       NOT NULL DEFAULT '[]'::jsonb,
  constraints_declared  jsonb       NOT NULL DEFAULT '[]'::jsonb,
  assigned_expert_email text,
  internal_email_to     text,
  workflow_status       text        NOT NULL DEFAULT 'ready_for_expert',
  response_submitted_at timestamptz,
  next_action_at        timestamptz,
  booking_link          text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
```

---

## ERREUR #11 — `new row violates row-level security policy for table post_audit_follow_ups`

**Quand** : Après création de la table, lors du premier upsert  
**Message d'erreur** :
```
code: "42501"
message: "new row violates row-level security policy for table \"post_audit_follow_ups\""
```

**Cause** :  
La table avait la RLS activée mais aucune politique ne permettait l'insertion via le rôle service_role.

**Solution appliquée** :  
Désactivation de la RLS sur cette table :
```sql
DROP POLICY IF EXISTS "Service role full access on post_audit_follow_ups" 
  ON public.post_audit_follow_ups;

ALTER TABLE public.post_audit_follow_ups DISABLE ROW LEVEL SECURITY;
```

---

## ERREUR #12 — `violates check constraint "valid_status"` sur `form_invitations`

**Quand** : Création des données de test  
**Message d'erreur** :
```
ERROR: 23514: new row for relation "form_invitations" 
violates check constraint "valid_status"
```

**Cause** :  
La valeur `'sent'` n'est pas autorisée pour le champ `status` de la table `form_invitations`. Seules `'pending'` et `'completed'` sont acceptées.

**Solution appliquée** :
```sql
-- ❌ Avant
INSERT INTO form_invitations (..., status) VALUES (..., 'sent');

-- ✅ Après
INSERT INTO form_invitations (..., status) VALUES (..., 'pending');
```

---

## ERREUR #13 — `pack_id` NULL dans `form_responses` après appel Edge Function

**Quand** : Test E2E complet — vérification Supabase  
**Symptôme** : La `form_response` créée par l'Edge Function avait `pack_id = NULL` même si `packId` avait été envoyé dans la requête

**Cause** :  
Le corps JSON envoyé dans le nœud HTTP Request n8n utilisait `Using Fields Below` au lieu de `Using JSON`. Le champ `packId` n'était pas correctement inclus dans la requête.

**Solution appliquée en deux temps** :

1. Correction immédiate : mise à jour manuelle de la `form_response` :
```sql
UPDATE public.form_responses
SET pack_id = 'test-e2e-pack-001'
WHERE id = '3f95924a-5d75-4328-a936-6910a7d0bec0';
```

2. Correction permanente : changement du nœud HTTP Request de `Using Fields Below` → `Using JSON` pour envoyer le corps correctement structuré.

---

## ERREUR #14 — Workflow toujours en No-Op (exécution < 3 secondes)

**Quand** : Plusieurs tentatives de déclenchement du workflow V2  
**Symptôme** : Toutes les exécutions duraient moins de 3 secondes et finissaient sur `Build No-Op Result`

**Causes identifiées successivement** :

1. **`form_response` sans `pack_id`** → Corrigé par mise à jour SQL manuelle
2. **Utilisation de la Test URL** au lieu de la Production URL → Changement d'URL dans le HTTP Request
3. **Mode test du webhook** (`executionMode: "test"`) → Le workflow ne s'exécutait qu'en mode écoute sans traiter

**Solution finale** :
- Utiliser la **Production URL** du webhook (sans `-test`)
- S'assurer que le workflow est **activé** (bouton vert)
- Envoyer la requête depuis un deuxième onglet du navigateur

---

## ERREUR #15 — `Forbidden - Authorization data is wrong!`

**Quand** : Envoi au webhook avec le header `x-transferai-secret`  
**Message d'erreur** :
```
Forbidden - perhaps check your credentials?
Authorization data is wrong!
```

**Cause** :  
La valeur du header `x-transferai-secret` ne correspondait pas à celle configurée dans le credential `Header Auth account 3` dans n8n. L'ancienne clé avait été oubliée.

**Solution appliquée** :
1. Mise à jour du credential `Header Auth account 3` dans n8n → Settings → Credentials avec une nouvelle clé : `transferai-secret-2026`
2. Mise à jour du secret `N8N_WEBHOOK_SECRET` dans Supabase avec la même valeur
3. Mise à jour du header `x-transferai-secret` dans le nœud HTTP Request de test

---

## ERREUR #16 — `Send Slack Expert Alert` : `Invalid URL`

**Quand** : Test du nœud Slack  
**Message d'erreur** :
```
Invalid URL: . URL must start with "http" or "https".
```

**Cause** :  
L'URL du nœud Slack utilisait `$env.POST_AUDIT_SLACK_WEBHOOK_URL` qui retourne une valeur vide (Slack non configuré).

**Solution appliquée** :  
Désactivation du nœud `Send Slack Expert Alert` (clic droit → Disable) car Slack n'est pas utilisé dans cette configuration.

> 💡 Si vous souhaitez activer Slack ultérieurement, configurez un webhook Slack et remplacez l'URL par la valeur fixe dans le nœud.

---

# 5. TROUBLESHOOTING DÉTAILLÉ — FICHE PAR FICHE

## 5.1 Tableau de diagnostic rapide

Utilisez ce tableau pour identifier rapidement votre problème :

| Symptôme observé | Section à consulter |
|------------------|---------------------|
| Exécution < 3 secondes → No-Op | [5.2 Diagnostic No-Op](#52-diagnostic-no-op) |
| Erreur `access to env vars denied` | [Erreur #1](#erreur-1--env-non-accessible) |
| Erreur `Cannot read properties of undefined` | [Erreur #6](#erreur-6--cannot-read-properties-of-undefined) |
| Erreur `Invalid character in header` | [Erreur #8](#erreur-8--invalid-character-in-header) |
| Erreur RLS / `violates row-level security` | [Erreur #11](#erreur-11--new-row-violates-row-level-security) |
| Table introuvable dans Supabase | [Erreur #10](#erreur-10--could-not-find-the-table) |
| `pack_id` NULL dans form_responses | [Erreur #13](#erreur-13--pack_id-null-dans-form_responses) |
| Forbidden sur le webhook | [Erreur #15](#erreur-15--forbidden---authorization-data-is-wrong) |
| Email non reçu | [5.3 Email non reçu](#53-email-non-reçu) |
| Données non mises à jour dans Supabase | [5.4 Données Supabase incorrectes](#54-données-supabase-incorrectes) |

## 5.2 Diagnostic No-Op

Quand le workflow se termine en moins de 3 secondes sur `Build No-Op Result`, suivez ce diagnostic en ordre :

**Étape A** — Vérifiez que le pack existe :
```sql
SELECT pack_id, status FROM ai_prospecting_packs 
WHERE pack_id = 'votre-pack-id';
-- Si 0 résultat → créez le pack (voir Étape 1 du plan de test)
```

**Étape B** — Vérifiez que la form_response existe avec is_completed = true :
```sql
SELECT id, pack_id, is_completed, completion_percentage 
FROM form_responses 
WHERE pack_id = 'votre-pack-id';
-- Si pack_id est NULL → exécutez l'UPDATE ci-dessous
-- Si is_completed est false → le formulaire n'était pas complété à >= 80%
```

Correction du pack_id NULL :
```sql
UPDATE form_responses 
SET pack_id = 'votre-pack-id' 
WHERE id = 'id-de-la-reponse';
```

**Étape C** — Vérifiez que le prospect n'est pas déjà traité :
```sql
SELECT prospect_id, last_sequence_result FROM prospect_targets 
WHERE prospect_id = 'votre-prospect-id';
-- Si last_sequence_result = 'post_audit_ready' ou 'post_audit_processed'
-- → Le prospect est déjà traité
-- → Remettez last_sequence_result à NULL pour retester
UPDATE prospect_targets 
SET last_sequence_result = NULL, niche_status = NULL 
WHERE prospect_id = 'votre-prospect-id';
```

**Étape D** — Vérifiez l'URL du webhook :
- La Test URL contient `-test` dans le chemin → utilisez la Production URL
- La Production URL : `https://[N8N]/webhook/transferai-post-audit-expert-routing-v2`

## 5.3 Email non reçu

Si le workflow a réussi (durée > 5 secondes) mais l'email n'est pas arrivé :

1. **Vérifiez les spams** dans votre boîte email
2. **Vérifiez les logs Resend** : connectez-vous sur resend.com → Logs
3. **Vérifiez le nœud `Send Internal Brief Email`** dans n8n :
   - La clé API Resend est-elle correcte ?
   - L'email `internal_email_to` est-il valide ?
4. **Vérifiez que le domaine d'envoi est vérifié** dans Resend

## 5.4 Données Supabase incorrectes

Si le workflow a réussi mais les tables ne sont pas mises à jour :

**Pour `prospect_targets`** :  
Vérifiez que le `prospect_id` dans le pack payload correspond bien à un prospect existant.

**Pour `ai_prospecting_packs`** :  
Vérifiez que le `pack_id` dans la requête correspond exactement au `pack_id` dans la table.

**Pour `post_audit_follow_ups`** :  
Vérifiez que la RLS est désactivée :
```sql
SELECT relrowsecurity FROM pg_class 
WHERE relname = 'post_audit_follow_ups';
-- Si 't' → RLS activée → exécutez :
ALTER TABLE public.post_audit_follow_ups DISABLE ROW LEVEL SECURITY;
```

---

# 6. VÉRIFICATIONS SQL POST-TEST

Après chaque test réussi, exécutez ces requêtes de vérification complète :

## 6.1 Vérification complète en une requête

```sql
-- Vue d'ensemble du test E2E
SELECT 
  'PACK' as type,
  pack_id as identifiant,
  status as valeur,
  CASE WHEN status = 'post_audit_processed' THEN '✅ OK' ELSE '❌ ÉCHEC' END as resultat
FROM ai_prospecting_packs WHERE pack_id = 'test-e2e-pack-001'

UNION ALL

SELECT 
  'PROSPECT',
  prospect_id,
  last_sequence_result,
  CASE WHEN last_sequence_result = 'post_audit_ready' THEN '✅ OK' ELSE '❌ ÉCHEC' END
FROM prospect_targets WHERE prospect_id = 'test-e2e-prospect-001'

UNION ALL

SELECT 
  'FOLLOW-UP',
  pack_id,
  workflow_status,
  CASE WHEN workflow_status = 'ready_for_expert' THEN '✅ OK' ELSE '❌ ÉCHEC' END
FROM post_audit_follow_ups WHERE pack_id = 'test-e2e-pack-001';
```

**Résultat attendu :**
```
type      | identifiant          | valeur                | resultat
----------+----------------------+-----------------------+---------
PACK      | test-e2e-pack-001   | post_audit_processed  | ✅ OK
PROSPECT  | test-e2e-prospect-001| post_audit_ready      | ✅ OK
FOLLOW-UP | test-e2e-pack-001   | ready_for_expert      | ✅ OK
```

## 6.2 Détail complet du follow-up créé

```sql
SELECT 
  pack_id,
  organization_name,
  target_email,
  sector_guess,
  maturity_level,
  recommended_offer,
  assigned_expert_email,
  internal_email_to,
  workflow_status,
  next_action_at,
  created_at
FROM post_audit_follow_ups 
WHERE pack_id = 'test-e2e-pack-001';
```

## 6.3 Vérification de la form_response

```sql
SELECT 
  id,
  pack_id,
  invitation_token,
  is_completed,
  completion_percentage,
  user_name,
  user_email,
  user_entity,
  submitted_at
FROM form_responses 
WHERE pack_id = 'test-e2e-pack-001';
```

---

# 7. CHECKLIST DE VALIDATION FINALE

Utilisez cette checklist après chaque déploiement ou mise à jour du workflow.

## 7.1 Checklist de configuration

```
SUPABASE
□ Table ai_prospecting_packs créée et accessible
□ Table prospect_targets créée et accessible
□ Table form_invitations créée et accessible
□ Table form_responses avec colonnes pack_id et context_snapshot
□ Table post_audit_follow_ups créée
□ RLS désactivée sur post_audit_follow_ups
□ Edge Function save-form-response déployée
□ Secret N8N_POST_AUDIT_WEBHOOK_URL configuré (Production URL)
□ Secret N8N_WEBHOOK_SECRET configuré
□ Secret POST_AUDIT_INTERNAL_EMAIL configuré

N8N
□ Workflow V2 importé
□ Workflow V2 ACTIVÉ (bouton vert)
□ Credential Header Auth configuré avec la bonne clé secrète
□ Tous les nœuds Supabase ont les headers apikey et Authorization
□ Response Format = Text sur tous les nœuds PATCH et POST upsert
□ Always Output Data = ON sur Get Invitation Row et Get Prospect Target Row
□ Send Slack Expert Alert est DÉSACTIVÉ (si Slack non configuré)
□ Nœud Generate Internal Pre-RDV Brief a la clé OpenAI
□ Nœud Send Internal Brief Email a la clé Resend
```

## 7.2 Checklist du test E2E

```
PRÉPARATION
□ Données de test nettoyées dans Supabase
□ Pack test-e2e-pack-001 créé
□ Invitation test-token-e2e-001 créée avec status = 'pending'
□ Prospect test-e2e-prospect-001 créé avec status = 'active'

EXÉCUTION
□ Webhook déclenché avec pack_id et response_id valides
□ Clé x-transferai-secret correcte dans le header
□ Production URL utilisée (sans -test)

VALIDATION
□ Exécution n8n > 5 secondes (signe que OpenAI a été appelé)
□ post_audit_follow_ups contient 1 ligne pour le pack test
□ ai_prospecting_packs.status = 'post_audit_processed'
□ prospect_targets.last_sequence_result = 'post_audit_ready'
□ Email reçu dans la boîte de l'expert interne
□ Email contient toutes les sections (identification, synthèse, maturité, cas d'usage, orientation)
```

---

*Document généré le 6 juin 2026 — basé sur la session de test réelle*  
*TransferAI Technical Team — contact@transferai.ci*
