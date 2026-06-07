# TransferAI Post-Audit Expert Routing V6 MVP
## Guide de Troubleshooting — Problèmes rencontrés et résolutions

---

## Introduction

Ce guide documente chaque problème rencontré lors de la configuration et des tests du workflow V6, la cause racine identifiée, et la solution appliquée. La section Supabase détaille chaque requête SQL exécutée et son sens métier.

---

## Problème 1 — Méthode GET au lieu de POST dans Postman

**Symptôme :** La requête de test retourne une erreur 404 ou "Method not allowed".

**Cause :** Le webhook n8n n'accepte que les requêtes POST. Postman était configuré en GET par défaut.

**Fix :** Changer la méthode de la requête de GET à POST dans Postman/Hoppscotch.

---

## Problème 2 — URL mal formée dans Hoppscotch (`https://POST https://...`)

**Symptôme :** L'URL affichée dans la barre est `https://POST https://n8n-pxlk...`. Hoppscotch retourne une "Extension error / Failed running request on extension".

**Cause :** Le texte "POST" a été collé dans le champ URL au lieu d'être sélectionné dans le dropdown méthode. L'Interceptor Hoppscotch bloquait aussi les requêtes.

**Fix :**
1. Sélectionner tout le contenu de la barre URL (Ctrl+A) et le remplacer par l'URL seule sans "POST"
2. Dans la popup Interceptor, sélectionner "Browser"
3. Vérifier que le dropdown méthode à gauche de l'URL affiche bien "POST"

---

## Problème 3 — Workflow retourne No-Op malgré force_rerun

**Symptôme :** Le workflow s'exécute mais retourne `{"status": "no_op"}` même avec `"force_rerun": true` dans le body.

**Cause :** Le noeud "If Already Post-Audit Processed" utilisait un format de condition importé depuis le JSON (typeVersion 2) incompatible avec la lecture dynamique des conditions en n8n. La condition n'était pas évaluée correctement — elle routait toujours vers True (déjà traité) même quand `already_processed = false`.

**Fix :** Dans n8n, ouvrir le noeud "If Already Post-Audit Processed" :
1. Supprimer la condition existante
2. Recréer manuellement une condition : Type = Boolean, Value = `={{$json.already_processed}}`, Operation = "is true"
3. Sauvegarder

---

## Problème 4 — Clé API Supabase invalide (placeholder non remplacé)

**Symptôme :** Le noeud "Get Prospect Target Row" retourne `{"message": "Invalid API key"}`.

**Cause :** Le placeholder `VOTRE-SERVICE-ROLE-KEY` n'avait pas été remplacé par la vraie Service Role Key Supabase dans les headers du noeud HTTP Request.

**Fix :** Ouvrir chaque noeud Supabase et remplacer `VOTRE-SERVICE-ROLE-KEY` dans les deux headers (`apikey` et `Authorization: Bearer`).

---

## Problème 5 — Erreur "Cannot read properties of undefined (reading 'data')" sur Upsert Follow-Up

**Symptôme :** Le noeud "Upsert Follow-Up Tracking" échoue avec une erreur JavaScript sur `.data`.

**Cause :** Le noeud HTTP Request était configuré pour parser la réponse en JSON. Or Supabase retourne un statut HTTP 204 No Content pour les opérations PATCH/POST réussies — il n'y a aucun body JSON à parser. n8n échouait en tentant de lire `response.data` sur un body vide.

**Fix :** Dans le noeud "Upsert Follow-Up Tracking" → Settings → Options → Response Format : changer de **JSON** à **Text**.

---

## Problème 6 — OAuth Google Sheets expiré ou invalide

**Symptôme :** Le noeud "Sync to Google Sheets Dashboard" échoue avec une erreur OAuth : "The token has been expired or revoked".

**Cause :** La credential Google Sheets OAuth2 dans n8n n'était pas connectée ou le token avait expiré.

**Fix :**
1. Dans n8n → Settings → Credentials → trouver ou créer "Google Sheets OAuth2 API"
2. Entrer le Client ID et Client Secret du projet Google Cloud
3. Copier l'URI de redirection affiché par n8n
4. Dans Google Cloud Console → APIs & Services → Credentials → OAuth Client → ajouter l'URI
5. Cliquer "Sign in with Google" dans n8n → autoriser l'accès dans la popup navigateur

---

## Problème 7 — Popup "Sign in with Google" ne s'ouvre pas

**Symptôme :** Clic sur "Sign in with Google" dans n8n → rien ne se passe, aucune popup.

**Cause :** Le navigateur bloque les popups pour le domaine n8n (protection anti-popup par défaut).

**Fix :** Dans la barre d'adresse du navigateur, cliquer sur l'icône popup bloquée → "Toujours autoriser les popups pour ce site" → réessayer.

---

## Problème 8 — Création d'un OAuth Client échoue dans Google Cloud ("The attempted action failed")

**Symptôme :** En tentant de créer un nouvel OAuth Client ID dans Google Auth Platform, un message d'erreur générique apparaît.

**Cause :** Deux raisons combinées :
1. La nouvelle interface Google Auth Platform impose une vérification de domaine pour les redirections vers des domaines non-Google (comme `hstgr.cloud`)
2. L'application OAuth était en mode "Testing" sans testeurs déclarés

**Fix :** Utiliser un OAuth Client existant dans le projet (le client `n8n-gmail` du projet AWA Watch Gmail Alerts était déjà configuré). Ajouter l'URI de redirection n8n à ce client existant au lieu d'en créer un nouveau.

---

## Problème 9 — `google_sheets_synced: false` dans la réponse finale

**Symptôme :** La réponse V6 indique `"google_sheets_synced": false` mais les données sont bien présentes dans le Google Sheet.

**Cause :** Faux négatif. Le noeud "Build V6 Summary" cherche `sheetsSync.updatedRows` pour déterminer si la sync a réussi. Or le noeud Google Sheets retourne un nom de champ différent selon la version de l'API. Les données sont bien écrites mais le flag de confirmation n'est pas lu correctement.

**Fix :** Comportement accepté en l'état (non bloquant). Les données sont bien dans le sheet. Le fix définitif nécessiterait d'inspecter le nom exact du champ retourné par le noeud Google Sheets v4 et d'adapter le code du noeud "Build V6 Summary".

---

## Problème 10 — 500 Internal Server Error : "No item to return was found"

**Symptôme :** Hoppscotch retourne HTTP 500 avec `{"code": 0, "message": "No item to return was found"}`.

**Cause :** Un noeud dans le workflow ne reçoit aucune donnée en entrée (tableau vide) et le noeud suivant tente de lire `items[0]` qui n'existe pas. Cela arrive quand une requête Supabase ne trouve aucune ligne correspondante.

**Fix :** Identifier le noeud en erreur via n8n → Executions → cliquer sur l'exécution rouge → voir quel noeud affiche "No output data returned". Puis créer la donnée manquante dans Supabase (voir section SQL ci-dessous).

---

## Problème 11 — `primary_service: null` dans la réponse

**Symptôme :** La réponse V6 contient `"primary_service": null` pour les vrais packs de production.

**Cause :** Le champ `primary_service` est extrait depuis `ctx.transferai_recommendation.primary.title` ou `ctx.recommended_offer`. Les vrais packs n'ont ni `transferai_recommendation` dans `form_data`, ni `recommended_offer` dans `payload`. Le service n'est donc pas dérivé automatiquement.

**Fix en deux noeuds :**

**Noeud "Build Expert Routing"** — ajout d'un mapping secteur → service :
```javascript
const sectorToService = {
  'telecom': 'Automatisation des processus',
  'finance': 'Automatisation des processus',
  'banque': 'Automatisation des processus',
  'industrie': 'Optimisation opérationnelle IA',
  'sante': 'IA appliquée au secteur santé',
  'education': 'Transformation digitale IA',
  'commerce': 'IA Commerce & CRM',
  'logistique': 'Optimisation opérationnelle IA',
  'technologie': 'Automatisation des processus',
  'default': 'Audit IA TransferAI'
};
const derivedService = payload.recommended_offer || sectorToService[sectorKey] || sectorToService['default'];
```

**Noeud "Build Post-Audit CRM Context"** — ajout de `routing.routing_service_lane` comme fallback :
```javascript
// Avant
recommended_offer: pickFirst(payload.recommended_offer, recommendation && recommendation.primary && recommendation.primary.title),

// Après
recommended_offer: pickFirst(payload.recommended_offer, recommendation && recommendation.primary && recommendation.primary.title, routing.routing_service_lane),
```

---

---

# Section Supabase — Requêtes SQL et leur sens

---

## SQL 1 — Trouver un pack_id réel avec audit complété

```sql
SELECT 
  p.pack_id,
  p.organization_name,
  p.prospect_id,
  r.id as response_id,
  r.completion_percentage,
  r.is_completed,
  r.submitted_at
FROM ai_prospecting_packs p
INNER JOIN form_responses r ON r.pack_id = p.pack_id
WHERE r.completion_percentage >= 80
  AND p.pack_id != 'test-e2e-pack-001'
ORDER BY r.submitted_at DESC
LIMIT 5;
```

**Sens :** Recherche les packs de prospection (`ai_prospecting_packs`) qui ont au moins une réponse de formulaire (`form_responses`) avec un taux de complétion ≥ 80 %. La jointure `INNER JOIN` sur `pack_id` garantit que seuls les packs ayant une réponse sont retournés. Le filtre exclut le pack de test E2E. Le tri `DESC` par date de soumission ramène les plus récents en premier.

**Résultat obtenu :** `pack-1780677550069-w60vkflf` (Orange Côte d'Ivoire, completion 90 %, soumis le 2026-06-05).

---

## SQL 2 — Inspecter les colonnes de `prospect_targets`

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'prospect_targets'
ORDER BY ordinal_position;
```

**Sens :** Interroge le catalogue système PostgreSQL (`information_schema.columns`) pour lister toutes les colonnes de la table `prospect_targets` avec leur type de données. Utilisé pour comprendre la structure réelle de la table avant d'écrire une requête d'insertion — évite l'erreur "column does not exist".

**Découverte clé :** La table `prospect_targets` n'a pas de colonne `pack_id`. Elle utilise `prospect_id` comme identifiant principal et `last_pack_id` pour référencer le dernier pack traité. Le workflow était correct — il filtrait déjà par `prospect_id`.

---

## SQL 3 — Vérifier l'existence d'une ligne prospect_targets pour le pack

```sql
SELECT id, prospect_id, status, organization_name, decision_maker_name, target_email
FROM prospect_targets
WHERE prospect_id = 'manual-prospect-001'
   OR last_pack_id = 'pack-1780677550069-w60vkflf';
```

**Sens :** Cherche dans `prospect_targets` une ligne associée soit au `prospect_id` du pack (relation directe), soit au `last_pack_id` (lien par le dernier pack traité). Deux conditions avec `OR` pour couvrir les deux cas de lien possibles.

**Résultat :** 0 ligne retournée — aucune cible de prospection n'existait pour ce pack. Le workflow n8n échouait sur "No item to return" à l'étape "Extract Prospect Target Row" car Supabase retournait `[]`.

---

## SQL 4 — Trouver un pack qui a à la fois une form_response ET une prospect_target

```sql
SELECT 
  p.pack_id,
  p.organization_name,
  p.prospect_id,
  r.completion_percentage,
  pt.id as target_id,
  pt.decision_maker_name,
  pt.target_email
FROM ai_prospecting_packs p
INNER JOIN form_responses r ON r.pack_id = p.pack_id
INNER JOIN prospect_targets pt ON pt.prospect_id = p.prospect_id
WHERE r.completion_percentage >= 80
ORDER BY r.submitted_at DESC
LIMIT 5;
```

**Sens :** Triple jointure pour trouver les packs qui ont simultanément (1) une réponse formulaire complétée ≥ 80 % et (2) une ligne existante dans `prospect_targets`. Les deux `INNER JOIN` imposent que toutes les tables aient une ligne correspondante — si l'une manque, le pack n'apparaît pas dans les résultats.

**Résultat :** Seul `test-e2e-pack-001` apparaissait, avec `decision_maker_name` et `target_email` à NULL. Le pack Orange CI n'avait pas de ligne `prospect_targets` → nécessité de la créer manuellement.

---

## SQL 5 — Inspecter les colonnes de `form_responses`

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'form_responses'
ORDER BY ordinal_position;
```

**Sens :** Même logique que SQL 2 — interroge le catalogue système pour connaître la structure exacte de `form_responses`. Utilisé après l'erreur "column r.respondent_name does not exist" lors d'une tentative d'INSERT.

**Découverte clé :** Les colonnes sont `user_name`, `user_email`, `user_position`, `user_entity` — pas `respondent_name`/`respondent_email`. Les noms de colonnes diffèrent des conventions utilisées dans le workflow (qui lit `c_nom`, `c_email` depuis `form_data` JSONB, pas les colonnes directes).

---

## SQL 6 — Créer une ligne dans `prospect_targets` pour Orange CI

```sql
INSERT INTO prospect_targets (
  prospect_id,
  organization_name,
  decision_maker_name,
  target_email,
  country,
  status,
  last_pack_id
) VALUES (
  'manual-prospect-001',
  'Orange Côte d''Ivoire',
  'Marius Ayoro',
  'marius.ayoro70@gmail.com',
  'CI',
  'post_audit',
  'pack-1780677550069-w60vkflf'
)
ON CONFLICT (prospect_id) DO UPDATE SET
  last_pack_id = EXCLUDED.last_pack_id,
  status = EXCLUDED.status;
```

**Sens :** Crée une nouvelle ligne dans `prospect_targets` représentant la cible de prospection Orange Côte d'Ivoire. La clause `ON CONFLICT (prospect_id) DO UPDATE` est un "upsert" — si une ligne avec ce `prospect_id` existe déjà, elle est mise à jour au lieu de générer une erreur de clé dupliquée. `EXCLUDED` fait référence aux valeurs qui auraient été insérées. Note : `d''Ivoire` — les apostrophes dans les chaînes SQL doivent être doublées.

**Résultat :** Ligne créée. Le workflow peut maintenant récupérer la cible prospect pour ce pack.

---

## SQL 7 — Inspecter les colonnes de `form_invitations`

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'form_invitations'
ORDER BY ordinal_position;
```

**Sens :** Même logique que SQL 2 et SQL 5 — analyse la structure réelle de la table avant insertion. Exécuté après l'erreur "column prospect_id of relation form_invitations does not exist".

**Découverte clé :** La table `form_invitations` n'a pas de colonne `prospect_id`. Elle a : `id`, `invitee_name`, `invitee_email`, `invite_token`, `sent_at`, `expires_at`, `status`, `created_by`, `response_id`, `response_email`, `response_cc`, `draft_form_data`, `email_sent_at`, `contact_request_id`, `pack_id`, `sector_context`, `access_context`.

---

## SQL 8 — Créer une ligne dans `form_invitations` pour Orange CI

```sql
INSERT INTO form_invitations (
  pack_id,
  invitee_name,
  invitee_email,
  status,
  invite_token
) VALUES (
  'pack-1780677550069-w60vkflf',
  'Marius Ayoro',
  'marius.ayoro70@gmail.com',
  'completed',
  'token-orange-ci-test'
)
ON CONFLICT DO NOTHING;
```

**Sens :** Crée une invitation de formulaire pour le pack Orange CI. Le champ `status = 'completed'` indique que le prospect a bien soumis son formulaire. `invite_token` est un identifiant unique de l'invitation (en production, ce token est généré automatiquement lors de l'envoi de l'invitation). `ON CONFLICT DO NOTHING` évite l'erreur si une invitation existe déjà — dans ce cas l'INSERT est simplement ignoré.

**Pourquoi c'était nécessaire :** Le noeud "Get Invitation Row" dans le workflow cherche une invitation par `pack_id`. Sans invitation, Supabase retournait `[]`, le noeud "Extract Invitation Row" ne trouvait rien, et le workflow s'arrêtait avec "No item to return was found".

---

## SQL 9 — Vérifier le contenu de `form_data` pour le pack

```sql
SELECT form_data
FROM form_responses
WHERE pack_id = 'pack-1780677550069-w60vkflf'
ORDER BY submitted_at DESC
LIMIT 1;
```

**Sens :** Récupère la colonne JSONB `form_data` de la réponse formulaire la plus récente pour ce pack. `ORDER BY submitted_at DESC LIMIT 1` garantit qu'on lit la dernière soumission en cas de soumissions multiples. Utilisé pour inspecter la structure exacte du JSON contenant les réponses du prospect.

**Résultat :**
```json
{
  "c_nom": "Marius Ayoro",
  "c_email": "marius.ayoro70@gmail.com",
  "c_entite": "Orange Côte d'Ivoire",
  "ai_maturity": "débutant",
  "audit_sector": "telecom"
}
```

**Insight clé :** Le formulaire utilise des clés préfixées `c_` pour les champs de contact (`c_nom`, `c_email`, `c_entite`, `c_poste`). Le champ `audit_sector` contient le secteur mais il n'y a pas de champ `primary_service` — ce qui expliquait le `primary_service: null` dans la réponse V6.

---

## SQL 10 — Lister les clés du JSONB form_data

```sql
SELECT jsonb_object_keys(form_data) as cles
FROM form_responses
WHERE pack_id = 'pack-1780677550069-w60vkflf'
ORDER BY submitted_at DESC
LIMIT 1;
```

**Sens :** La fonction PostgreSQL `jsonb_object_keys()` extrait toutes les clés de premier niveau d'un objet JSONB et les retourne comme des lignes distinctes. Utilisé pour avoir une vue exhaustive de toutes les clés disponibles dans `form_data` sans avoir à parser visuellement un JSON potentiellement long.

**Résultat :** Les clés identifiées étaient `c_nom`, `c_email`, `c_entite`, `ai_maturity`, `audit_sector` — confirmant l'absence de `primary_service` ou d'un équivalent direct.

---

## Tableau de synthèse — Données créées manuellement pour le test

| Table | Donnée créée | Raison |
|-------|-------------|--------|
| `prospect_targets` | Ligne pour `manual-prospect-001` / Orange CI | Noeud "Get Prospect Target Row" retournait tableau vide |
| `form_invitations` | Ligne pour `pack-1780677550069-w60vkflf` | Noeud "Get Invitation Row" retournait tableau vide |

> **Important :** Ces données ont été créées manuellement pour le test. En production, elles sont créées automatiquement par le système de prospection TransferAI lors de l'envoi de l'invitation formulaire et de la création du pack.

---

## Checklist de diagnostic rapide

Quand le workflow retourne une erreur 500 "No item to return was found" :

1. **Aller dans n8n → Executions** → cliquer sur l'exécution en erreur
2. **Identifier le noeud** qui affiche "No output data returned"
3. **Selon le noeud :**

| Noeud en erreur | Cause probable | SQL de vérification |
|-----------------|---------------|---------------------|
| Extract Pack Row | `pack_id` n'existe pas dans `ai_prospecting_packs` | `SELECT * FROM ai_prospecting_packs WHERE pack_id = 'xxx'` |
| Extract Invitation Row | Pas d'invitation pour ce `pack_id` | `SELECT * FROM form_invitations WHERE pack_id = 'xxx'` |
| Extract Latest Form Response | Pas de réponse avec `completion_percentage >= 80` | `SELECT * FROM form_responses WHERE pack_id = 'xxx'` |
| Extract Prospect Target Row | Pas de cible pour ce `prospect_id` | `SELECT * FROM prospect_targets WHERE prospect_id = 'xxx'` |
