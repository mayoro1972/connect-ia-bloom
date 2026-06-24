# TransferAI Prospecting — Guide Utilisateur & Troubleshooting

**Configuration V4 · Rectification V3 · Résolution des problèmes**  
Version 1.0 — Juin 2026  
Préparé par : TransferAI NettelecomCI

---

## Table des matières

1. [Architecture générale du système](#1-architecture-générale)
2. [Configuration V4 — Workflow Batch](#2-configuration-v4)
3. [Configuration V3 — Workflow Prospect Individuel](#3-configuration-v3)
4. [Troubleshooting Guide Détaillé](#4-troubleshooting)
5. [Checklist de vérification](#5-checklist)
6. [Référence rapide — Codes des nœuds corrigés](#6-référence-rapide)
7. [Historique des corrections — Session du 8 juin 2026](#7-historique)

---

## 1. Architecture générale

### 1.1 Vue d'ensemble

Le système de prospection TransferAI est composé de deux workflows n8n imbriqués :

| Workflow | Rôle |
|----------|------|
| **V4 (Batch)** | Orchestre l'envoi en masse. Récupère les prospects depuis Supabase et appelle V3 pour chaque prospect. |
| **V3 (Prospect individuel)** | Génère la lettre commerciale, le catalogue PDF, le deck PPTX, stocke le pack dans Supabase, envoie l'email d'approbation, attend l'approbation, puis envoie l'email prospect. |

### 1.2 Flux de données complet

```
1. V4 Batch       → récupère les prospects depuis prospect_targets (status=ready)
2. V4             → appelle V3 via Execute Prospect Workflow V3
3. V3 OpenAI      → génère lettre, catalogue, audit form, deck
4. V3 Assemble    → construit pack_id et audit_form_url
5. V3 Store       → stocke dans ai_prospecting_packs (status=pending_approval)
6. V3 Email       → envoie email interne d'approbation (onboarding@resend.dev)
7. Approbateur    → clique "Approuver et envoyer"
8. V3 Webhook     → Approval Webhook → Parse Approval Query
9. V3             → Get Pack From Supabase → Extract Pack Payload
10. V3            → Build Send Context → Send External Prospect Email
```

### 1.3 Tables Supabase utilisées

| Table | Rôle |
|-------|------|
| `prospect_targets` | Liste des prospects à contacter |
| `ai_prospecting_packs` | Packs générés et stockés |
| `prospect_targets_ready_for_batch` | Vue filtrée des prospects prêts (status=ready, paused=false) |
| `prospecting_batch_runs` | Suivi des exécutions batch |
| `prospecting_batch_run_items` | Détail par prospect par run |
| `form_invitations` | Invitations au questionnaire d'audit |

---

## 2. Configuration V4

### 2.1 Prérequis

Avant de configurer V4, vérifier que :
- Le workflow V3 est actif dans n8n (pas en pause)
- Les prospects sont insérés dans `prospect_targets` avec `status='ready'`
- Les clés API sont configurées : OpenAI, Resend, Supabase Service Role Key
- Les fonctions Edge Supabase sont déployées : `catalogue-renderer`, `deck-renderer`

### 2.2 Nœuds clés de V4

#### SET BATCH CONFIG
- Définit le nombre de prospects par batch
- Paramètre principal : `max_per_day` (défaut : 5)

#### FETCH PROSPECTS FROM SUPABASE
- URL : `https://<project>.supabase.co/rest/v1/prospect_targets_ready_for_batch`
- Méthode : GET
- Headers requis : `apikey` + `Authorization: Bearer <service_role_key>`

#### EXECUTE PROSPECT WORKFLOW V3
- Appelle le workflow V3 pour chaque prospect
- Passe les données du prospect en paramètre input

#### MARK DISPATCHED TO V3
- Met à jour le statut du prospect à `dispatched`
- Évite les doublons lors du prochain batch

### 2.3 Configuration des headers Supabase

À appliquer sur **tous les nœuds HTTP Request qui appellent Supabase** :

```
apikey          : <SUPABASE_ANON_KEY ou SERVICE_ROLE_KEY>
Authorization   : Bearer <SUPABASE_SERVICE_ROLE_KEY>
Content-Type    : application/json
Prefer          : return=representation  (uniquement pour INSERT/UPDATE)
```

### 2.4 Colonnes requises dans `prospect_targets`

| Colonne | Type | Valeurs |
|---------|------|---------|
| `prospect_id` | text PRIMARY KEY | ex: `ci-orange-001` |
| `organization_name` | text | Nom de l'organisation |
| `target_email` | text | Email du décideur |
| `decision_maker_name` | text | Nom du décideur |
| `website` | text | Site web |
| `country` | text | Pays |
| `status` | text | `ready` \| `active` \| `dispatched` \| `paused` |
| `paused` | boolean | `true` pour exclure du batch |
| `do_not_contact` | boolean | `true` pour exclure définitivement |

### 2.5 Gestion des prospects de test

#### Créer un prospect de test
```sql
INSERT INTO prospect_targets (
  prospect_id, organization_name, target_email,
  decision_maker_name, website, country,
  status, paused, do_not_contact
) VALUES (
  'test-prospect-001',
  'Entreprise Test TransferAI',
  'votre-email@gmail.com',
  'Décideur Test',
  'https://www.test-entreprise.ci',
  'Cote d''Ivoire',
  'ready', false, false
);
```

#### Mettre en pause après test (recommandé — évite les doublons)
```sql
UPDATE prospect_targets
SET status = 'paused', paused = true
WHERE prospect_id = 'test-prospect-001';
```

#### Relancer pour un nouveau test
```sql
UPDATE prospect_targets
SET status = 'ready', paused = false
WHERE prospect_id = 'test-prospect-001';
```

---

## 3. Configuration V3

### 3.1 Nœuds critiques et leur rôle

#### ASSEMBLE PROSPECT PACK
**Rôle :** Génère le `pack_id`, construit `audit_form_url`, corrige les liens cassés dans la lettre.

> **IMPORTANT :** Ce nœud s'exécute APRÈS `Generate Executive Letter`. La lettre peut contenir un lien audit cassé (`?pack_id=` vide) car elle est générée avant que `pack_id` existe. Le fix corrige ce lien dans le même nœud via regex.

Points clés du code :
- `pack_id` généré : `ctx.pack_id || ('pack-' + Date.now() + '-' + Math.random().toString(36).slice(2,10))`
- `audit_form_url` construite : `auditBaseUrl + '?pack_id=' + encodeURIComponent(packId)`
- Correction du lien dans la lettre (après génération de `auditFormUrl`) :
```javascript
var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/g;
executiveLetterHtml = executiveLetterHtml.replace(brokenAuditPattern, auditFormUrl);
executiveLetter = executiveLetter.replace(brokenAuditPattern, auditFormUrl);
```

---

#### STORE PACK IN SUPABASE
**Rôle :** Stocke le pack dans `ai_prospecting_packs`.

- **URL :** `POST https://<project>.supabase.co/rest/v1/ai_prospecting_packs?on_conflict=pack_id`
- **Body JSON correct :**

```javascript
{{JSON.stringify({
  pack_id: $json.pack_id,
  prospect_id: $json.prospect_id || null,
  organization_name: $json.organization_name || null,
  target_email: $json.target_email || null,
  status: 'pending_approval',
  payload: $json,
  llm_redaction_summary: $json.llm_redaction_summary || null
})}}
```

> **ATTENTION :** Ne jamais ajouter `organization_type` ni `sector_guess` — ces colonnes **n'existent pas** dans la table `ai_prospecting_packs`. Toutes les données enrichies sont accessibles via la colonne `payload` (JSONB).

---

#### BUILD SEND CONTEXT
**Rôle :** Prépare le contexte d'envoi, répare les liens audit cassés, valide les pièces jointes.

Points clés :
- Extraction `pack_id` depuis plusieurs sources (fallback chain)
- Reconstruction `audit_form_url` canonique depuis `pack_id`
- Réparation de `rawLetterHtml` par regex avant utilisation
- **Override de `executive_letter_html`** dans le return — crucial pour que `Send External Prospect Email` lise la version réparée

Return du nœud (fin du code) :
```javascript
return [{
  json: {
    ...src,
    pack_id: packId,
    audit_form_url: auditFormUrl,
    attachments: attachments,
    attachments_count: attachments.length,
    can_send: canSend,
    send_failure_reason: reason,
    external_email_html: externalEmailHtml,
    executive_letter_html: rawLetterHtml  // CRUCIAL : écrase la version cassée de Supabase
  }
}];
```

Conditions de `canSend = true` :
- `target_email` non vide
- `executive_letter` non vide
- Au minimum 2 pièces jointes (1 PDF + 1 PPTX)
- `pack_id` non vide

---

#### SEND EXTERNAL PROSPECT EMAIL
**Rôle :** Envoie l'email au prospect via Resend API.

- **URL :** `POST https://api.resend.com/emails`
- **Body JSON correct :**

```javascript
={{ (() => {
  const ctx = $('Build Send Context').first().json || {};
  const targetEmail = ctx.target_email || '';
  const bookingLink = ctx.booking_link_45min || 'https://calendly.com/contact-transferai/30min';
  return JSON.stringify({
    from: 'TransferAI <contact@transferai.ci>',
    to: [targetEmail],
    subject: "Proposition d'audit gratuit, d'accompagnement et de formation",
    html: ctx.external_email_html || '',
    attachments: ctx.attachments || []
  });
})() }}
```

> Utiliser `ctx.external_email_html` directement — ce champ est déjà assemblé et réparé par `Build Send Context`. Ne pas reconstruire le HTML depuis `ctx.executive_letter_html`.

---

#### PARSE APPROVAL QUERY
**Rôle :** Extrait `pack_id` et `decision` depuis l'URL du webhook d'approbation.

```javascript
const raw = $input.first().json;
const q = (raw.query && raw.query.pack_id) ? raw.query : raw;
const isApproved = q.decision === 'approved' || q.approved === 'true' || q.approved === true;
return [{ json: {
  approved:          isApproved,
  decision:          isApproved ? 'approved' : 'rejected',
  prospect_id:       q.prospect_id        || '',
  pack_id:           q.pack_id            || '',
  organization_name: q.organization_name  || '',
  target_email:      q.target_email       || ''
} }];
```

---

## 4. Troubleshooting

---

### 4.1 Lien questionnaire cassé (`?pack_id=` vide) dans l'email prospect

#### Symptôme
L'email prospect contient :
```
https://www.transferai.ci/questionnaire-audit?pack_id=
```
La page questionnaire affiche : **"Aucun identifiant de pack fourni dans l'URL (paramètre pack_id manquant)"**

#### Cause racine

`Generate Executive Letter` s'exécute **AVANT** qu'`Assemble Prospect Pack` génère le `pack_id`. Le prompt OpenAI reçoit `audit_form_url` avec `pack_id` vide (`$json.pack_id = ''`). L'IA intègre ce lien cassé dans la lettre. Ce texte est ensuite stocké dans Supabase (`payload.executive_letter_html`). Lors de l'approbation, le lien cassé ressort dans l'email prospect.

#### Solution (3 nœuds à corriger)

**Fix 1 — Assemble Prospect Pack**

Après la ligne `var executiveLetterHtml = executiveLetter.replace(/\n/g, '<br>');`, ajouter :

```javascript
// Remplace le lien audit cassé (pack_id vide) par l'URL correcte
var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/g;
executiveLetterHtml = executiveLetterHtml.replace(brokenAuditPattern, auditFormUrl);
executiveLetter = executiveLetter.replace(brokenAuditPattern, auditFormUrl);
```

**Fix 2 — Build Send Context**

Remplacer la construction de `externalEmailHtml` :

```javascript
var rawLetterHtml = String(
  src.executive_letter_html || String(src.executive_letter || '').replace(/\n/g, '<br>')
);

// Répare le lien audit cassé dans la lettre
if (auditFormUrl) {
  var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/g;
  rawLetterHtml = rawLetterHtml.replace(brokenAuditPattern, auditFormUrl);
}

var externalEmailHtml = rawLetterHtml + auditBlock;
```

Et dans le `return`, ajouter la ligne :
```javascript
executive_letter_html: rawLetterHtml
```

**Fix 3 — Send External Prospect Email**

Remplacer le JSON Body par la version simplifiée utilisant `ctx.external_email_html` directement (voir Section 3.1).

#### Pourquoi les 3 fixes sont nécessaires

| Fix | Protège |
|-----|---------|
| Fix 1 (Assemble Prospect Pack) | Les nouveaux packs — corrige le lien dès la génération avant stockage Supabase |
| Fix 2 (Build Send Context) | Les anciens packs déjà stockés avec lien cassé — répare à l'envoi |
| Fix 3 (Send External Prospect Email) | Évite toute reconstruction intermédiaire qui pourrait réintroduire le lien cassé |

#### Vérification
Dans l'email reçu, le lien doit contenir : `?pack_id=pack-XXXXXXXXXX-XXXXXXXX`  
La page questionnaire doit s'ouvrir sans erreur.

---

### 4.2 Erreur de syntaxe dans Send External Prospect Email

#### Symptôme
n8n affiche `[invalid syntax]` dans le panneau de droite du nœud JSON Body.

#### Cause
Utilisation de `\\'` au lieu de `\'` pour échapper une apostrophe dans une chaîne JavaScript.

#### Solution
Remplacer `d\\'audit` par `d\'audit` dans le JSON Body.

#### Règle
Dans une chaîne JavaScript entre apostrophes simples `'...'` :
- Correct : `\'` (un seul backslash)
- Incorrect : `\\'` (interprété comme backslash + fin de chaîne)

---

### 4.3 Deux pack_ids différents entre email approbation et email prospect

#### Symptôme
- Email d'approbation montre `pack_id=pack-AAAA`
- Email prospect montre `pack_id=pack-BBBB` (différent)

#### Cause
Le workflow traite le même prospect **deux fois** car il apparaît en doublon dans `prospect_targets`. Deux packs sont générés en parallèle avec des IDs différents.

#### Solution

**Étape 1 — Identifier les doublons :**
```sql
SELECT prospect_id, organization_name, target_email, status, created_at
FROM prospect_targets
WHERE organization_name ILIKE '%NomOrganisation%'
ORDER BY created_at DESC;
```

**Étape 2 — Supprimer le doublon (garde le plus récent) :**
```sql
DELETE FROM prospect_targets
WHERE prospect_id IN (
  SELECT prospect_id
  FROM (
    SELECT prospect_id,
           ROW_NUMBER() OVER (
             PARTITION BY organization_name
             ORDER BY created_at DESC
           ) AS rn
    FROM prospect_targets
    WHERE organization_name ILIKE '%NomOrganisation%'
  ) ranked
  WHERE rn > 1
);
```

#### Prévention
Utiliser un `prospect_id` unique basé sur le nom de l'organisation. Pour les tests, utiliser `status='paused'` plutôt que créer un nouveau prospect à chaque fois.

---

### 4.4 Erreur Store Pack In Supabase — colonne inexistante

#### Symptôme
```
Bad request - please check your parameters
Could not find the 'organization_type' column of 'ai_prospecting_packs' in the schema cache
```
ou
```
Could not find the 'sector_guess' column of 'ai_prospecting_packs' in the schema cache
```

#### Cause
Le JSON Body de `Store Pack In Supabase` référence des colonnes qui **n'existent pas** dans la table `ai_prospecting_packs`.

#### Colonnes valides dans `ai_prospecting_packs`
```
pack_id, prospect_id, organization_name, target_email,
status, payload, llm_redaction_summary
```

#### Solution — JSON Body correct
```javascript
{{JSON.stringify({
  pack_id: $json.pack_id,
  prospect_id: $json.prospect_id || null,
  organization_name: $json.organization_name || null,
  target_email: $json.target_email || null,
  status: 'pending_approval',
  payload: $json,
  llm_redaction_summary: $json.llm_redaction_summary || null
})}}
```

> Toutes les données enrichies (`sector_guess`, `organization_type`, etc.) sont stockées dans la colonne `payload` de type JSONB et restent accessibles.

---

### 4.5 Page questionnaire affiche "questionnaire non disponible"

#### Symptôme
La page `https://www.transferai.ci/questionnaire-audit?pack_id=pack-XXX` charge mais affiche :
> *"Le questionnaire personnalisé pour [Organisation] n'est pas encore disponible. Revenez dans quelques instants ou contactez notre équipe."*

Badges affichés : **SECTEUR A CONFIRMER**, **ORGANISATION A QUALIFIER**

#### Cause
Les champs `sector_guess` et `organization_type` ont les valeurs par défaut SQL (`'secteur à confirmer'`, `'organisation à qualifier'`) car le nœud `Store Pack In Supabase` essayait d'écrire dans des colonnes inexistantes — l'erreur 400 bloquait le stockage du pack.

#### Solution
Appliquer le fix 4.4 (retirer `organization_type` et `sector_guess` du JSON Body). Une fois le pack correctement stocké avec les données dans `payload`, la fonction Edge `resolve-invitation` lit `payload.sector_guess` et `payload.organization_type` via `buildAuditAccessContextFromPack`.

Pour les packs déjà stockés avec ce problème : relancer le workflow complet pour générer un nouveau pack.

---

### 4.6 Plusieurs emails d'approbation pour le même prospect

#### Symptôme
2 emails `onboarding@resend.dev` reçus au même moment pour la même organisation, avec des `pack_id` différents.

#### Cause
Le prospect apparaît plusieurs fois dans `prospect_targets` (doublon par `organization_name` mais `prospect_id` différent). Le batch V4 génère un pack pour chaque ligne.

#### Solution
Voir section 4.3.

#### Requête de détection préventive
Exécuter avant chaque run :
```sql
SELECT organization_name, COUNT(*) as nb
FROM prospect_targets
WHERE status = 'ready' AND paused = false
GROUP BY organization_name
HAVING COUNT(*) > 1;
```
Si cette requête retourne des lignes → doublons à traiter avant de lancer le batch.

---

### 4.7 `canSend = false` — email non envoyé

#### Symptôme
Le workflow s'exécute sans erreur visible mais l'email prospect n'est pas envoyé.  
Dans l'output de `Build Send Context` :
```
can_send: false
send_failure_reason: "Email cible, courrier, pack_id ou artefacts requis manquants. Attendus: 1 catalogue PDF et 1 deck PPTX."
```

#### Cause
Une ou plusieurs conditions manquantes :

| Condition | Vérification |
|-----------|-------------|
| `target_email` | Doit être un email valide non vide |
| `executive_letter` | Doit contenir du texte |
| Pièces jointes | Au minimum 2 : 1 fichier `.pdf` + 1 fichier `.pptx` |
| `pack_id` | Doit être non vide |

#### Solution
1. Vérifier l'output de `Build Send Context` — identifier quelle condition échoue
2. Si pièces jointes manquantes : vérifier que `render Catalogue Artifact` a retourné `pdf_url` et que `Render Deck Artifact` a retourné `pptx_url`
3. Si `pack_id` vide : vérifier `Assemble Prospect Pack` — `ctx.pack_id` ou génération automatique

---

### 4.8 `Parse Approval Query` retourne `pack_id` vide

#### Symptôme
Output de `Parse Approval Query` :
```json
{ "pack_id": "", "decision": "approved" }
```
`Get Pack From Supabase` retourne un pack différent de celui approuvé.

#### Cause
Le lien "Approuver et envoyer" dans l'email d'approbation ne contient pas `pack_id` dans les query parameters de l'URL webhook.

#### Vérification
Clic droit sur le lien "Approuver et envoyer" → "Copier l'adresse du lien".  
L'URL doit contenir : `?pack_id=pack-XXXX&decision=approved`

#### Solution
Vérifier le nœud `Build Approval Email` : le lien d'approbation doit être construit avec `pack_id` dans les paramètres de l'URL webhook.

---

## 5. Checklist de vérification

### 5.1 Avant chaque run V4

- [ ] Aucun doublon dans `prospect_targets` (requête section 4.6)
- [ ] Les prospects cibles ont `status='ready'` et `paused=false`
- [ ] Clé API OpenAI valide
- [ ] Clé API Resend valide
- [ ] Clé Service Role Supabase configurée dans les nœuds HTTP
- [ ] Workflow V3 actif dans n8n (pas en pause)
- [ ] Fonctions Edge Supabase déployées (`catalogue-renderer`, `deck-renderer`)

### 5.2 Après chaque run — vérification bout en bout

- [ ] Email d'approbation reçu avec lien formulaire complet (`pack_id` présent)
- [ ] Cliquer "Approuver et envoyer" sur le bon email
- [ ] Email prospect reçu avec lien questionnaire complet
- [ ] Cliquer le lien questionnaire → page s'ouvre sans erreur
- [ ] Page affiche le bon `PACK_ID` et le nom de l'organisation
- [ ] Vérifier pièces jointes : 1 PDF catalogue + 1 PPTX deck présents

### 5.3 Après un test — nettoyage

```sql
-- Remettre le prospect test en pause
UPDATE prospect_targets
SET status = 'paused', paused = true
WHERE prospect_id = 'test-prospect-001';

-- Vérifier qu'aucun pack pending_approval ne reste ouvert
SELECT pack_id, organization_name, status, created_at
FROM ai_prospecting_packs
WHERE status = 'pending_approval'
ORDER BY created_at DESC;
```

---

## 6. Référence rapide — Codes des nœuds corrigés

### 6.1 Store Pack In Supabase — JSON Body

```javascript
={{JSON.stringify({
  pack_id: $json.pack_id,
  prospect_id: $json.prospect_id || null,
  organization_name: $json.organization_name || null,
  target_email: $json.target_email || null,
  status: 'pending_approval',
  payload: $json,
  llm_redaction_summary: $json.llm_redaction_summary || null
})}}
```

---

### 6.2 Send External Prospect Email — JSON Body

```javascript
={{ (() => {
  const ctx = $('Build Send Context').first().json || {};
  const targetEmail = ctx.target_email || '';
  const bookingLink = ctx.booking_link_45min || 'https://calendly.com/contact-transferai/30min';
  return JSON.stringify({
    from: 'TransferAI <contact@transferai.ci>',
    to: [targetEmail],
    subject: "Proposition d'audit gratuit, d'accompagnement et de formation",
    html: ctx.external_email_html || '',
    attachments: ctx.attachments || []
  });
})() }}
```

---

### 6.3 Build Send Context — JavaScript Code (complet)

```javascript
var src = JSON.parse(JSON.stringify($('Extract Pack Payload').first().json));

function safeFileStem(value) {
  return String(value || 'Prospect')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeAttachment(att) {
  if (!att || !att.filename) return null;
  var normalized = { filename: String(att.filename) };
  if (att.content) normalized.content = String(att.content);
  if (att.path) normalized.path = String(att.path);
  if (!normalized.content && !normalized.path) return null;
  return normalized;
}

function dedupeAttachments(list) {
  var seen = {};
  var deduped = [];
  for (var i = 0; i < list.length; i++) {
    var att = list[i];
    var key = [att.filename || '', att.path || '', att.content || ''].join('|');
    if (seen[key]) continue;
    seen[key] = true;
    deduped.push(att);
  }
  return deduped;
}

function extractPackIdFromUrl(url) {
  var value = String(url || '');
  var match = value.match(/[?&]pack_id=([^&#]+)/i);
  return match ? decodeURIComponent(match[1]) : '';
}

var org = safeFileStem(src.organization_name || 'Prospect');
var attachments = [];
var payload = src.payload || {};

var providedAttachments = Array.isArray(payload.mail_attachments)
  ? payload.mail_attachments.map(normalizeAttachment).filter(Boolean)
  : [];

if (providedAttachments.length > 0) {
  attachments = providedAttachments;
} else {
  var rebuilt = [];
  if (payload.catalogue_artifact && payload.catalogue_artifact.pdf_url) {
    rebuilt.push({
      filename: String(payload.catalogue_artifact.filename_pdf || ('Mini_Catalogue_TransferAI_' + org + '.pdf')),
      path: String(payload.catalogue_artifact.pdf_url)
    });
  }
  if (payload.deck_artifact && payload.deck_artifact.pptx_url) {
    rebuilt.push({
      filename: String(payload.deck_artifact.filename_pptx || ('Deck_TransferAI_' + org + '.pptx')),
      path: String(payload.deck_artifact.pptx_url)
    });
  }
  attachments = rebuilt.map(normalizeAttachment).filter(Boolean);
}

attachments = dedupeAttachments(attachments);

var hasPdf  = attachments.some(function(att) { return /\.pdf$/i.test(String(att.filename || '')); });
var hasPptx = attachments.some(function(att) { return /\.pptx$/i.test(String(att.filename || '')); });

var packId =
  src.pack_id ||
  payload.pack_id ||
  extractPackIdFromUrl(src.audit_form_url) ||
  extractPackIdFromUrl(payload.audit_form_url) ||
  '';

var auditFormUrl = packId
  ? 'https://www.transferai.ci/questionnaire-audit?pack_id=' + encodeURIComponent(packId)
  : '';

var canSend = Boolean(
  src.target_email &&
  src.executive_letter &&
  src.executive_letter.trim().length > 0 &&
  attachments.length >= 2 &&
  hasPdf &&
  hasPptx &&
  packId
);

var reason = canSend
  ? null
  : 'Email cible, courrier, pack_id ou artefacts requis manquants. Attendus: 1 catalogue PDF et 1 deck PPTX.';

var auditBlock = auditFormUrl
  ? "<br><br><p><strong>Formulaire d'audit pre-RDV :</strong> <a href=\"" + auditFormUrl + "\">" + auditFormUrl + "</a></p><p>Merci de le remplir avant le rendez-vous afin que nos experts preparent un audit sur mesure.</p>"
  : "";

var rawLetterHtml = String(
  src.executive_letter_html || String(src.executive_letter || '').replace(/\n/g, '<br>')
);

// Répare le lien audit cassé dans la lettre si auditFormUrl est disponible
if (auditFormUrl) {
  var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/g;
  rawLetterHtml = rawLetterHtml.replace(brokenAuditPattern, auditFormUrl);
}

var externalEmailHtml = rawLetterHtml + auditBlock;

return [{
  json: {
    ...src,
    pack_id: packId,
    audit_form_url: auditFormUrl,
    attachments: attachments,
    attachments_count: attachments.length,
    can_send: canSend,
    send_failure_reason: reason,
    external_email_html: externalEmailHtml,
    executive_letter_html: rawLetterHtml   // CRUCIAL : écrase la version cassée de Supabase
  }
}];
```

---

### 6.4 Requêtes SQL utiles

```sql
-- Voir tous les prospects actifs
SELECT prospect_id, organization_name, target_email, status, paused
FROM prospect_targets
WHERE paused = false
ORDER BY created_at DESC;

-- Détecter les doublons avant un run
SELECT organization_name, COUNT(*) as nb
FROM prospect_targets
WHERE status = 'ready' AND paused = false
GROUP BY organization_name
HAVING COUNT(*) > 1;

-- Voir les derniers packs générés
SELECT pack_id, organization_name, status, created_at
FROM ai_prospecting_packs
ORDER BY created_at DESC
LIMIT 20;

-- Remettre un prospect en ready
UPDATE prospect_targets
SET status = 'ready', paused = false
WHERE prospect_id = 'test-prospect-001';

-- Mettre en pause un prospect
UPDATE prospect_targets
SET status = 'paused', paused = true
WHERE prospect_id = 'test-prospect-001';

-- Supprimer un doublon (garder le plus récent)
DELETE FROM prospect_targets
WHERE prospect_id IN (
  SELECT prospect_id FROM (
    SELECT prospect_id,
           ROW_NUMBER() OVER (PARTITION BY organization_name ORDER BY created_at DESC) AS rn
    FROM prospect_targets
    WHERE organization_name ILIKE '%NomOrganisation%'
  ) ranked WHERE rn > 1
);
```

---

## 7. Historique des corrections — Session du 8 juin 2026

**Problème initial :** lien questionnaire cassé `?pack_id=` vide dans l'email prospect.

| # | Nœud modifié | Changement |
|---|--------------|-----------|
| 1 | `Send External Prospect Email` | JSON Body remplacé par version IIFE utilisant `ctx.executive_letter_html` |
| 2 | `Build Send Context` | Ajout reconstruction `pack_id` depuis plusieurs sources + `audit_form_url` canonique + validation pièces jointes |
| 3 | `Build Send Context` | Ajout regex de réparation des liens cassés dans `rawLetterHtml` |
| 4 | `Build Send Context` | Ajout `executive_letter_html: rawLetterHtml` dans le return pour écraser la version cassée de Supabase |
| 5 | `Send External Prospect Email` | Simplification pour utiliser `ctx.external_email_html` directement |
| 6 | `Assemble Prospect Pack` | Ajout réparation du lien dans la lettre dès la génération (fix préventif) |
| 7 | `Store Pack In Supabase` | Suppression des colonnes inexistantes `organization_type` et `sector_guess` |
| 8 | `prospect_targets` (Supabase) | Suppression du doublon `manual-prospect-001` |

**Résultat final :** email prospect avec lien correct + page questionnaire accessible + workflow sans erreur Supabase.

---

*Document généré le 8 juin 2026 — TransferAI NettelecomCI*
