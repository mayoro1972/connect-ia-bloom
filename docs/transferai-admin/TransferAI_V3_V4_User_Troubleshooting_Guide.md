# TransferAI Prospecting — Guide Troubleshooting
## Pipeline V3 · V4 · V6 — Résolution des problèmes
**Version 2.1 — Mis à jour le 30 juin 2026**
*Sessions du 8 juin, 28 juin, 29 juin et 30 juin 2026*

---

## Table des matières

1. [Architecture du pipeline](#1-architecture-du-pipeline)
2. [Problèmes V3 — Génération du pack](#2-problèmes-v3)
3. [Problèmes V4 — Batch orchestrateur](#3-problèmes-v4)
4. [Problèmes V6 — Post-audit routing](#4-problèmes-v6)
5. [Problèmes Supabase](#5-problèmes-supabase)
6. [Checklist de vérification](#6-checklist)
7. [Requêtes SQL utiles](#7-requêtes-sql)
8. [Historique des corrections](#8-historique)

---

## 1. Architecture du pipeline

```
V4 (Batch, 8h lun-ven)
  └→ V3 × 5 prospects/jour
        └→ GPT + PDF + PPTX + Email validation (4 boutons)
              └→ Approbation admin
                    └→ Email prospect

V6 (toutes les 30 min)
  └→ form_responses WHERE processed=false AND completion>=80%
        └→ ai_prospecting_packs (via pack_id)
              └→ Fiche pré-RDV + Email [PRIORITÉ HAUTE]
```

### Tables clés

| Table | Rôle |
|---|---|
| `prospect_targets` | Prospects à contacter — source V4 |
| `ai_prospecting_packs` | Packs générés — source V6 |
| `form_responses` | Formulaires soumis — déclencheur V6 |
| `outreach_attempts` | Log des envois — quota V4 |
| `form_invitations` | Invitations formulaire |

---

## 2. Problèmes V3

---

### 2.1 Tous les emails générés pour la même organisation

#### Symptôme
10 emails de validation reçus pour Orange Côte d'Ivoire, aucun pour les autres prospects.

#### Cause
Le nœud `Set Target` avait des valeurs **hardcodées** (nom, email, site web d'Orange) au lieu de lire depuis `$json`.

#### Solution
Dans le nœud `Set Target`, changer **chaque champ** de valeur fixe vers expression :

```
organization_name : {{ $json.organization_name || 'Orange Côte d\'Ivoire' }}
website           : {{ $json.website || 'https://www.orange.ci' }}
target_email      : {{ $json.target_email || 'marius.ayoro70@gmail.com' }}
niche_status      : {{ $json.niche_status || 'telecom_africa' }}
source_backend    : {{ $json.source_backend || 'manual' }}
```
*(la valeur après `||` est le fallback uniquement — ne jamais laisser les champs en valeur fixe)*

#### Vérification
Dans l'output du nœud `Set Target`, `organization_name` doit correspondre au prospect traité, pas toujours au même.

---

### 2.2 `pack_id` vide dans la lettre executive

#### Symptôme
L'email de validation contient :
```
https://www.transferai.ci/questionnaire-audit?pack_id=
```
Le lien Calendly dans la lettre contient aussi `pack_id=` vide.

#### Cause
GPT génère la lettre executive **avant** que `pack_id` existe. La lettre intègre un `pack_id` vide qui est ensuite stocké tel quel.

#### Solution
Dans le nœud `Assemble Prospect Pack`, après la ligne `var executiveLetterHtml = executiveLetter.replace(/\n/g, '<br>');`, ajouter :

```javascript
// Injecte le pack_id réel dans tous les liens de la lettre
executiveLetterHtml = executiveLetterHtml
  .replace(/pack_id=/g, 'pack_id=' + encodeURIComponent(packId))
  .replace(/pack_id%3D/g, 'pack_id%3D' + encodeURIComponent(packId));
executiveLetter = executiveLetter
  .replace(/pack_id=/g, 'pack_id=' + encodeURIComponent(packId));
```

#### Vérification
Dans l'email de validation, le lien `questionnaire-audit` doit contenir `?pack_id=pack-XXXXXXXXXX-XXXXXXXX`.

---

### 2.3 PDF/PPTX affichent "Non disponible" dans l'email de validation

#### Symptôme
L'email de validation (4 boutons) affiche :
```
Mini-catalogue PDF : Non disponible
Deck PPTX : Non disponible
Deck PDF : Non disponible
```

#### Cause
Le nœud `Build Approval Email` cherchait les URLs dans `payload.catalogue_pdf_url` et `payload.deck_pdf_url` (champs plats) alors que la structure réelle est `payload.catalogue_artifact.pdf_url` et `payload.deck_artifact.pdf_url` (objets imbriqués).

#### Solution
Dans le nœud `Build Approval Email`, corriger les déclarations de variables :

```javascript
var pack = JSON.parse(JSON.stringify($('Store Pack In Supabase').first().json));
var payload = pack.payload || {};

var pdfUrl = (payload.catalogue_artifact && payload.catalogue_artifact.pdf_url)
  || (pack.catalogue_artifact && pack.catalogue_artifact.pdf_url)
  || payload.catalogue_pdf_url
  || pack.catalogue_pdf_url
  || '';

var deckPdfUrl = (payload.deck_artifact && payload.deck_artifact.pdf_url)
  || (pack.deck_artifact && pack.deck_artifact.pdf_url)
  || payload.deck_pdf_url
  || pack.deck_pdf_url
  || '';

var deckPptxUrl = (payload.deck_artifact && payload.deck_artifact.pptx_url)
  || (pack.deck_artifact && pack.deck_artifact.pptx_url)
  || payload.deck_pptx_url
  || pack.deck_pptx_url
  || '';
```

#### Vérification
L'email de validation doit afficher 3 liens cliquables (PDF catalogue, PPTX deck, PDF deck).

---

### 2.4 10 emails envoyés au lieu de 5

#### Symptôme
Le quota est de 5 emails/jour mais 10 ont été envoyés.

#### Causes possibles
1. **Clic double sur "Execute"** — V4 lancé deux fois manuellement
2. **`outreach_attempts` vide** — le quota check retourne 0 envois alors que des emails ont déjà été envoyés

#### Solutions
1. Ne cliquer Execute qu'une seule fois et attendre la fin de l'exécution
2. Après chaque approbation, V3 doit écrire dans `outreach_attempts` :

```javascript
// À ajouter dans le flow d'approbation V3 après envoi
{
  prospect_id: packData.prospect_id,
  pack_id: packData.pack_id,
  organization_name: packData.organization_name,
  sent_at: new Date().toISOString(),
  delivery_status: 'sent',
  workflow_version: 'v3'
}
```

#### Vérification
```sql
SELECT COUNT(*) FROM outreach_attempts WHERE sent_at >= CURRENT_DATE;
```
Ce chiffre doit correspondre au nombre d'approbations du jour.

---

### 2.5 Lien questionnaire cassé `?pack_id=` vide dans l'email prospect

#### Symptôme
L'email envoyé au prospect contient :
```
https://www.transferai.ci/questionnaire-audit?pack_id=
```

#### Cause
Voir 2.2 — le `pack_id` n'était pas injecté dans la lettre après génération GPT.

#### Solution triple
- **Fix 1 (Assemble Prospect Pack)** : injecter `pack_id` dès la génération (voir 2.2)
- **Fix 2 (Build Send Context)** : réparer par regex avant envoi
- **Fix 3 (Send External Prospect Email)** : utiliser `ctx.external_email_html` directement

---

### 2.6 Erreur syntaxe dans Send External Prospect Email

#### Symptôme
n8n affiche `[invalid syntax]` dans le panneau JSON Body.

#### Cause
Utilisation de `\\'` au lieu de `\'` pour échapper une apostrophe.

#### Solution
Remplacer `d\\'audit` par `d\'audit` dans le JSON Body.

---

### 2.7 Formulaire révision — PDF/PPTX affichent "non disponible"

#### Symptôme
Le formulaire de révision affiche :
```
📄 Mini-catalogue PDF : ✗ non disponible
📊 Deck PDF : ✗ non disponible
```
Pourtant les liens fonctionnent dans l'email de validation.

#### Cause
Le nœud `Code in JavaScript1` (builder du formulaire HTML) cherchait les URLs dans des champs plats (`payload.catalogue_pdf_url`) alors que la structure réelle du pack est imbriquée (`payload.catalogue_artifact.pdf_url`).

#### Solution — appliquée le 30 juin 2026 ✅
Le nœud lit maintenant les deux structures en cascade :
```javascript
const pdfUrl = (payload.catalogue_artifact && payload.catalogue_artifact.pdf_url)
  || (pack.catalogue_artifact && pack.catalogue_artifact.pdf_url)
  || payload.catalogue_pdf_url   // fallback ancien format
  || pack.catalogue_pdf_url
  || '';

const deckPdfUrl = (payload.deck_artifact && payload.deck_artifact.pdf_url)
  || (pack.deck_artifact && pack.deck_artifact.pdf_url)
  || payload.deck_pdf_url
  || pack.deck_pdf_url
  || '';
```

#### Vérification
Ouvrir le lien "Réviser" → les badges **✓ disponible** (fond vert) doivent apparaître à côté des liens PDF.

---

### 2.8 Formulaire révision — lettre affiche du HTML brut au lieu du texte rendu

#### Symptôme
La section "Modifier la lettre executive" affiche le contenu HTML brut avec des balises visibles :
```
Cher Directeur,<br><br>Dans un secteur aussi dynamique...
```
Au lieu de la lettre mise en forme.

#### Cause
La textarea échappait les `<` et `>` pour afficher le HTML source — comportement correct pour l'édition, mais l'utilisateur voulait voir le rendu.

#### Solution — appliquée le 30 juin 2026 ✅
Le formulaire de révision dispose maintenant de **deux onglets** :

| Onglet | Usage |
|---|---|
| **👁 Prévisualisation** (défaut) | Lettre rendue comme dans l'email, avec mise en forme complète |
| **✏️ Modifier le HTML** | Textarea avec le code HTML brut pour édition technique |

La prévisualisation se met à jour **en temps réel** pendant la saisie dans le textarea.

#### Comportement attendu
1. Ouverture du formulaire → onglet Prévisualisation actif → lettre rendue visible
2. Clic sur "Modifier le HTML" → textarea avec le HTML brut
3. Modification du texte → clic sur "Prévisualisation" → aperçu mis à jour instantanément
4. Clic "Soumettre" → nouvel email de validation envoyé avec le HTML modifié

---

### 2.10 Webhook de révision ne répond pas

#### Symptôme
Clic sur "Réviser" → page blanche ou erreur 404.

#### Cause
Le webhook `revision-prospect-pack-v3` n'est pas configuré avec "Respond: Using Respond to Webhook Node".

#### Solution
Dans le nœud Webhook `revision-prospect-pack-v3` :
- Method : GET
- Response Mode : **Using Respond to Webhook Node**
- Connecter à → `Fetch Pack For Revision` → `Build Revision Form` → `Return Revision Form`

Dans le nœud `Return Revision Form` (Respond to Webhook) :
- Response Body : `{{ $json.html_form }}`
- Response Headers : `Content-Type: text/html`

---

## 3. Problèmes V4

---

### 3.1 V4 ne traite qu'un seul niche/secteur

#### Symptôme
V4 ne lance V3 que pour les prospects du secteur `assistant_direction_documentaire`.

#### Cause
La variable `active_niche_list_csv` dans V4 est réglée sur une seule valeur.

#### Solution
Dans V4 → nœud `Set Batch Config`, modifier `active_niche_list_csv` :

```javascript
// Remplacer
active_niche_list_csv: 'assistant_direction_documentaire'

// Par (tous les niches)
active_niche_list_csv: 'service_client_multicanal,reporting_data_analytics,formation_montee_competences,automatisation_processus_rh,logistique_supply_chain,telecommunications,it_transformation_digitale,finance_comptabilite'
```

Ou pour accepter tous les prospects sans filtre par niche :
```javascript
active_niche_list_csv: ''  // vide = pas de filtre
```

---

### 3.2 V4 ne trouve pas V3 (workflowId incorrect)

#### Symptôme
V4 échoue avec : `Workflow not found` ou `Cannot execute workflow`.

#### Solution
1. Ouvrir V3 dans n8n → copier l'ID depuis l'URL : `https://n8n-pxlk.srv1480638.hstgr.cloud/workflow/`**rQyOh7As2gQoCgvK**
2. Dans V4 → nœud `Execute Prospect Workflow V3` → `workflowId` → saisir l'ID exact

---

### 3.3 Quota atteint immédiatement (0 prospects traités)

#### Symptôme
V4 s'arrête dès le début avec "Quota journalier atteint" alors qu'aucun email n'a été envoyé.

#### Cause
`outreach_attempts` contient des lignes avec `sent_at` datées d'aujourd'hui depuis un test ou une exécution précédente.

#### Solution
```sql
-- Vérifier les envois du jour
SELECT * FROM outreach_attempts WHERE sent_at >= CURRENT_DATE;

-- Si ce sont des tests à supprimer :
DELETE FROM outreach_attempts WHERE sent_at >= CURRENT_DATE AND prospect_id LIKE 'test-%';
```

---

## 4. Problèmes V6

---

### 4.1 V6 toujours sur le chemin "Build No-Op Result" (ne traite rien)

#### Symptôme
Toutes les exécutions V6 terminent en "Succeeded in < 2s" via `Build No-Op Result`. Aucune fiche pré-RDV générée.

#### Cause 1 — Conditions `If Candidate Response Found` vides (bug session 29 juin)

Le nœud `If Candidate Response Found` avait des conditions complètement vides (`value1` et `value2` blancs) → toujours `false` → toujours `No-Op`.

**Fix :**
- value1 : `{{ $json.no_candidate_found }}`
- Opération : `is equal to`
- value2 : `false`

#### Cause 2 — `form_responses.pack_id` NULL

V6 ne peut pas relier le formulaire au pack si `pack_id` est NULL.

**Fix temporaire (SQL) :**
```sql
UPDATE form_responses
SET pack_id = 'pack-XXXXXXXXXX-XXXXXXXXX'
WHERE user_email = 'email@prospect.ci'
  AND pack_id IS NULL
ORDER BY submitted_at DESC
LIMIT 1;
```

**Fix permanent :** corriger le frontend React (transferai.ci) pour sauvegarder `pack_id` lors de la soumission.

#### Cause 3 — `form_responses.processed = true`

La ligne a déjà été traitée par une exécution précédente de V6.

```sql
SELECT id, user_email, pack_id, processed, submitted_at
FROM form_responses
ORDER BY submitted_at DESC LIMIT 5;
```
Si `processed = true` → remettre à `false` pour re-tester :
```sql
UPDATE form_responses SET processed = false WHERE id = 'xxx';
```

#### Cause 4 — `completion_percentage < 80`

V6 ignore les formulaires complétés à moins de 80%.

```sql
SELECT user_email, completion_percentage, is_completed FROM form_responses ORDER BY submitted_at DESC LIMIT 5;
```

---

### 4.2 V6 échoue sur `Get Prospect Target Row`

#### Symptôme
V6 passe `If Candidate Response Found` mais échoue plus loin avec "No rows returned" sur la requête `prospect_targets`.

#### Cause
Le prospect n'existe pas dans `prospect_targets`. V6 essaie de joindre `prospect_targets` via `target_email` ou `pack_id`.

#### Solution
Insérer le prospect manuellement dans `prospect_targets` :

```sql
INSERT INTO prospect_targets (
  prospect_id, organization_name, target_email, website,
  country, status, delivery_status, last_pack_id,
  outreach_attempt_count, do_not_contact, paused
) VALUES (
  'manual-prospect-001',
  'Nom Organisation',
  'email@organisation.ci',
  'https://www.organisation.ci',
  'Côte d''Ivoire',
  'active', 'sent', 'pack-XXXXXXXXXX-XXXXXXXXX',
  1, false, false
)
ON CONFLICT (prospect_id) DO UPDATE SET
  delivery_status = 'sent',
  last_pack_id = 'pack-XXXXXXXXXX-XXXXXXXXX';
```

**Note :** `Extract Prospect Target Row` a un fallback sur `Extract Pack Row` — si le prospect n'est pas dans `prospect_targets`, V6 utilise les données du pack. Mais certains nœuds en aval peuvent nécessiter des champs de `prospect_targets`.

---

### 4.3 V6 génère une fiche pré-RDV avec mauvais secteur

#### Symptôme
La fiche indique "Secteur à confirmer" ou un secteur incorrect.

#### Cause
Les données de `form_responses.form_data` n'ont pas été correctement extraites, ou le champ `sector_context` est vide.

#### Vérification
```sql
SELECT form_data, sector_context FROM form_responses
WHERE user_email = 'email@prospect.ci'
ORDER BY submitted_at DESC LIMIT 1;
```

---

## 5. Problèmes Supabase

---

### 5.1 Erreur "column does not exist"

#### Symptôme
```
Failed to run sql query: ERROR: 42703: column "prospect_email" does not exist
```

#### Cause
La colonne s'appelle différemment dans la table réelle. La table `form_responses` utilise `user_email`, pas `prospect_email`.

#### Solution
Toujours vérifier les noms réels des colonnes :
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'form_responses'
ORDER BY ordinal_position;
```

#### Colonnes réelles de `form_responses`
```
id, user_name, user_email, user_position, user_entity,
submitted_at, last_updated_at, is_completed, completion_percentage,
form_data, notes, session_id, invitation_token, email_sent_at,
contact_request_id, pack_id, sector_context, context_snapshot, processed
```

---

### 5.2 Erreur Store Pack In Supabase — colonne inexistante

#### Symptôme
```
Could not find the 'organization_type' column of 'ai_prospecting_packs'
```

#### Solution
Retirer `organization_type` et `sector_guess` du JSON Body. Ces colonnes n'existent pas dans `ai_prospecting_packs` — stocker ces données dans `payload` (JSONB).

**JSON Body correct :**
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

---

### 5.3 Colonne `processed` manquante dans `form_responses`

#### Symptôme
V6 échoue avec "column processed does not exist".

#### Solution
```sql
ALTER TABLE form_responses
  ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT false;
```

---

### 5.4 Colonne `delivery_status` manquante dans `prospect_targets`

#### Symptôme
INSERT dans `prospect_targets` échoue avec "column delivery_status does not exist".

#### Solution
```sql
ALTER TABLE prospect_targets
  ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS last_pack_id TEXT;
```

---

### 5.5 Doublons dans `prospect_targets`

#### Symptôme
2 emails de validation reçus pour la même organisation, avec des `pack_id` différents.

#### Détection
```sql
SELECT organization_name, COUNT(*) as nb
FROM prospect_targets
WHERE status = 'ready' AND paused = false
GROUP BY organization_name
HAVING COUNT(*) > 1;
```

#### Suppression (garde le plus récent)
```sql
DELETE FROM prospect_targets
WHERE prospect_id IN (
  SELECT prospect_id FROM (
    SELECT prospect_id,
           ROW_NUMBER() OVER (
             PARTITION BY organization_name
             ORDER BY created_at DESC
           ) AS rn
    FROM prospect_targets
    WHERE organization_name ILIKE '%NomOrganisation%'
  ) ranked WHERE rn > 1
);
```

---

## 6. Checklist de vérification

### Avant chaque run V4

- [ ] Aucun doublon dans `prospect_targets` (requête 5.5)
- [ ] Prospects cibles : `status='ready'`, `paused=false`, `delivery_status='pending'`
- [ ] Clé API OpenAI valide dans les nœuds n8n
- [ ] Clé API Resend valide
- [ ] `active_niche_list_csv` dans V4 couvre les bons niches
- [ ] Vérifier quota : `SELECT COUNT(*) FROM outreach_attempts WHERE sent_at >= CURRENT_DATE;`

### Après réception email de validation V3

- [ ] 4 boutons présents : Approuver, Réviser, Régénérer, Rejeter
- [ ] Liens PDF mini-catalogue, PPTX deck, PDF deck visibles et accessibles
- [ ] Lien Calendly fonctionnel dans la lettre
- [ ] Lien formulaire d'audit avec `pack_id` complet (pas vide)

### Après approbation et envoi prospect

- [ ] Email prospect reçu avec 2 pièces jointes (PDF + PPTX)
- [ ] Lien formulaire dans l'email avec `pack_id` complet
- [ ] `delivery_status = 'sent'` dans Supabase pour ce prospect

### Après soumission formulaire (test V6)

- [ ] `form_responses.pack_id` renseigné (manuellement si frontend pas encore corrigé)
- [ ] `form_responses.processed = false`
- [ ] Attendre < 30 min → Email [PRIORITÉ HAUTE] reçu
- [ ] Fiche pré-RDV reçue avec organisation, secteur, maturité IA

---

## 7. Requêtes SQL utiles

```sql
-- Prospects envoyés
SELECT organization_name, delivery_status, last_pack_id, updated_at
FROM prospect_targets WHERE delivery_status = 'sent'
ORDER BY updated_at DESC;

-- Formulaires récents
SELECT user_email, pack_id, completion_percentage, processed, submitted_at
FROM form_responses ORDER BY submitted_at DESC LIMIT 10;

-- Formulaires à traiter par V6 (non encore traités)
SELECT user_email, pack_id, completion_percentage, submitted_at
FROM form_responses
WHERE completion_percentage >= 80 AND processed = false
ORDER BY submitted_at ASC;

-- Packs générés récemment
SELECT pack_id, organization_name, status, created_at
FROM ai_prospecting_packs ORDER BY created_at DESC LIMIT 10;

-- Quota envois du jour
SELECT COUNT(*) as envois FROM outreach_attempts WHERE sent_at >= CURRENT_DATE;

-- Colonnes d'une table (diagnostic)
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'form_responses' ORDER BY ordinal_position;

-- Remettre un formulaire à traiter (re-test V6)
UPDATE form_responses SET processed = false WHERE id = 'xxx';

-- Vérifier prospect_targets pour un prospect
SELECT prospect_id, organization_name, delivery_status, last_pack_id, status
FROM prospect_targets WHERE organization_name ILIKE '%Orange%';
```

---

## 8. Historique des corrections

### Session du 8 juin 2026

| # | Nœud | Changement |
|---|---|---|
| 1 | `Send External Prospect Email` | JSON Body — IIFE utilisant `ctx.executive_letter_html` |
| 2 | `Build Send Context` | Reconstruction `pack_id` multi-source + `audit_form_url` canonique |
| 3 | `Build Send Context` | Regex réparation liens cassés dans `rawLetterHtml` |
| 4 | `Build Send Context` | Ajout `executive_letter_html: rawLetterHtml` dans le return |
| 5 | `Assemble Prospect Pack` | Regex réparation lien audit dès la génération |
| 6 | `Store Pack In Supabase` | Suppression colonnes inexistantes `organization_type`, `sector_guess` |
| 7 | `prospect_targets` | Suppression doublons |

### Session du 28 juin 2026

| # | Composant | Changement |
|---|---|---|
| 1 | VPS | Installation LibreOffice 24.2.7.2 pour conversion PPTX → PDF |
| 2 | Supabase | `ALTER TABLE form_responses ADD COLUMN processed BOOLEAN DEFAULT false` |
| 3 | Supabase | `ALTER TABLE prospect_targets ADD COLUMN delivery_status, last_pack_id` |
| 4 | V3 — `Build Approval Email` | Ajout boutons Réviser et Régénérer (4 boutons total) |
| 5 | V3 — `Build Approval Email` | Correction chemins `catalogue_artifact.pdf_url` / `deck_artifact.pdf_url` |
| 6 | V3 | Nouveau webhook GET `revision-prospect-pack-v3` + formulaire HTML révision |
| 7 | V3 | Nouveau webhook POST `submit-revision-pack-v3` |
| 8 | V3 | Nouveau webhook GET `regenerate-prospect-pack-v3` |
| 9 | V3 — `Assemble Prospect Pack` | Injection `pack_id` dans lettre executive par regex |

### Session du 29 juin 2026

| # | Composant | Changement |
|---|---|---|
| 1 | V3 — `Set Target` | Tous les champs convertis de valeurs fixes vers expressions `$json` |
| 2 | V4 | Activé (toggle ON) — schedule lundi-vendredi 8h00 |
| 3 | V6 | Activé (toggle ON) — schedule toutes les 30 min |
| 4 | Post-Audit V2 | Désactivé (évite conflit V6) |
| 5 | V6 — `If Candidate Response Found` | Conditions vides corrigées → `no_candidate_found` is equal to `false` |
| 6 | `prospect_targets` | Insertion manuelle Orange CI pour test V6 |
| 7 | `form_responses` | Mise à jour manuelle `pack_id` pour la ligne de test |
| 8 | Pipeline complet | **Validation end-to-end réussie** — V3 → V6 → emails reçus le 29/06 à 22:45 |
| 9 | Workflows n8n | Export V3 (67 nœuds), V4 (27), V6 (37) vers GitHub via API n8n |

### Session du 30 juin 2026

| # | Composant | Changement |
|---|---|---|
| 1 | V3 — `Code in JavaScript1` | **Fix URLs PDF/PPTX** : lecture depuis `catalogue_artifact.pdf_url` et `deck_artifact.pdf_url` (structure imbriquée) avec fallback sur anciens champs plats |
| 2 | V3 — `Code in JavaScript1` | **Lettre executive** : ajout onglet Prévisualisation (rendu HTML) + onglet Modifier le HTML (textarea) avec mise à jour en temps réel |
| 3 | V3 — `Code in JavaScript1` | Badges ✓ vert / ✗ rouge sur les liens documents dans le formulaire de révision |
| 4 | V3 — `Code in JavaScript1` | Avertissement orange si PDF manquant au moment de l'upload |
| 5 | GitHub | Export mis à jour : `113_n8n_Prospecting_V3_...json` re-poussé avec corrections |

---

*Document mis à jour le 30 juin 2026 — TransferAI NettelecomCI*
