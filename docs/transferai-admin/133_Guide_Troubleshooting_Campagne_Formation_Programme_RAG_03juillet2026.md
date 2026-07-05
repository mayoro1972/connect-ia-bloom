# Guide de dépannage — Campagne Formation IA (Programme, PDF joint, RAG)

**Version :** 1.0
**Date :** 3 juillet 2026
**Contexte :** complète [104_Guide_Troubleshooting_Pipeline_Prospection_V1.md](./104_Guide_Troubleshooting_Pipeline_Prospection_V1.md) — ce guide couvre spécifiquement la campagne Formation IA (workflows V9 `rt3PXnUnnOPB2ioJ` et Email2/3 `uvaRGbCUebRVkyc4`), le document Programme et la base RAG associée.

---

## Comment utiliser ce guide

- Un prospect signale que le PDF reçu affiche de mauvaises dates/le mauvais lieu → section 1
- Upload d'un fichier dans un bucket Supabase Storage refusé (`403`) → section 2
- Conversion docx → PDF impossible en local → section 3
- Un PDF généré avec docx-js a des pages presque vides → section 4
- Besoin de tester V9 ou Email2/3 sans attendre le Schedule Trigger quotidien → section 5
- L'accroche générée par IA (RAG) ne reflète pas tous les différenciateurs à jour → section 6
- Clés API visibles en clair dans le code des nœuds n8n → section 7

---

## 1. Le PDF joint à l'Email 2 affiche des informations obsolètes

### Symptôme
Un prospect reçoit l'Email 2 (programme détaillé) et le PDF en pièce jointe affiche encore d'anciennes dates de session ou un ancien lieu, alors que le corps de l'email est correct.

### Cause
Le contenu formation existe en **4 endroits indépendants, sans source unique** :
1. Le HTML généré par les nœuds n8n (`Email B2B`, `Email Individuel`, `Build/Rebuild Email2/3 Content`)
2. Le document Programme (docx) — actuellement [130_Programme_Formation_IA_au_Bureau_REVAMP_2026-07-03.docx](./130_Programme_Formation_IA_au_Bureau_REVAMP_2026-07-03.docx)
3. Le PDF réellement joint à l'Email 2, servi statiquement depuis Supabase Storage (`prospecting-artifacts/formation/programme_formation_ia_2026.pdf`), référencé par une **URL codée en dur** dans le nœud `Send Email2 To Prospect` du workflow `uvaRGbCUebRVkyc4`
4. La table RAG `documents` (voir section 6)

Une correction dans l'une de ces sources ne se propage jamais automatiquement aux trois autres.

### Vérification
```bash
curl -s "https://wlhznciwuofueffyoflo.supabase.co/storage/v1/object/public/prospecting-artifacts/formation/programme_formation_ia_2026.pdf" -o /tmp/check.pdf
pdftotext /tmp/check.pdf - | grep -E "juillet|août|Riviera|Cocody"
```

### Solution
Régénérer le PDF à partir du docx Programme à jour ([130_...docx](./130_Programme_Formation_IA_au_Bureau_REVAMP_2026-07-03.docx)) et le republier au même chemin exact dans le bucket (voir section 2 pour la procédure d'upload). Toujours revérifier les 4 sources listées ci-dessus après tout changement de date, lieu ou tarif de la formation.

---

## 2. Upload dans un bucket Supabase Storage refusé avec `403 new row violates row-level security policy`

### Symptôme
```bash
curl -X POST "https://<projet>.supabase.co/storage/v1/object/<bucket>/<chemin>" \
  -H "apikey: <clé anon>" -H "Authorization: Bearer <clé anon>" --data-binary "@fichier"
# → {"statusCode":"403","error":"Unauthorized","message":"new row violates row-level security policy"}
```

### Cause
La clé `anon` (celle présente dans `.env` du repo, `VITE_SUPABASE_ANON_KEY`) n'a pas les droits d'écriture sur ce bucket — les policies RLS Storage exigent la clé `service_role`.

### Solution
1. Récupérer la clé `service_role` : Supabase Dashboard → Project Settings → API → "service_role" secret.
2. **Ne jamais coller cette clé dans un chat ou un prompt.** La stocker localement dans un fichier dédié, par exemple `~/.supabase_credentials` (même pattern que `~/.n8n_credentials`) :
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
   `chmod 600 ~/.supabase_credentials`
3. Utiliser cette clé, avec le header `x-upsert: true` pour remplacer un fichier existant :
   ```bash
   source ~/.supabase_credentials
   curl -X POST "https://wlhznciwuofueffyoflo.supabase.co/storage/v1/object/<bucket>/<chemin>" \
     -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     -H "Content-Type: application/pdf" -H "x-upsert: true" \
     --data-binary "@fichier.pdf"
   ```
4. **Supprimer le fichier de clé local immédiatement après usage** (`rm ~/.supabase_credentials`) — c'est une clé superutilisateur, elle ne doit pas rester sur la machine entre deux sessions.
5. Toujours faire une sauvegarde locale du fichier existant avant de l'écraser (`curl -o backup.pdf <url_publique>`).

---

## 3. Impossible de convertir un docx en PDF en local (`soffice not found`)

### Symptôme
```
FileNotFoundError: [Errno 2] No such file or directory: 'soffice'
```

### Cause
LibreOffice n'est pas installé sur la machine.

### Solution
```bash
brew install --cask libreoffice
```
Le binaire `soffice` est ensuite disponible dans `/opt/homebrew/bin/soffice`. Conversion :
```bash
soffice --headless --convert-to pdf mon_fichier.docx
```
Pour un aperçu visuel page par page :
```bash
pdftoppm -jpeg -r 110 mon_fichier.pdf page
ls page-*.jpg
```

---

## 4. Un PDF généré avec docx-js a des pages presque vides

### Symptôme
Le PDF converti depuis un docx généré par script (`docx` npm package) contient une ou plusieurs pages avec seulement une ligne de texte en haut, le reste blanc.

### Cause
Des sauts de page manuels (`new Paragraph({ children: [new PageBreak()] })`) insérés à des endroits fixes dans le script ne tiennent pas compte du contenu réel qui précède — si ce contenu déborde légèrement sur la page suivante avant le saut forcé, la page se retrouve quasiment vide.

### Solution
Retirer les sauts de page manuels et laisser LibreOffice/Word paginer naturellement le contenu. Ne garder un `PageBreak` explicite que si une section doit impérativement commencer en haut d'une page (ex. page de garde), jamais entre deux sections de longueur variable.

---

## 5. Tester V9 ou Email2/3 sans attendre le déclencheur planifié

### Contexte
- V9 (`rt3PXnUnnOPB2ioJ`) se déclenche par webhook (`google-forms-formation-juillet`) — testable à la demande.
- Email2/3 (`uvaRGbCUebRVkyc4`) se déclenche par `Schedule Trigger` quotidien à 08h00 UTC — pas d'endpoint API n8n pour lancer une exécution manuelle du schedule.

### Solution — méthode validée
1. **Créer un prospect de test via une vraie soumission V9**, en préfixant `Structure / Organisation` par un marqueur facile à nettoyer ensuite (`ZZZ-TEST-...`) :
   ```bash
   curl -X POST "https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-formation-juillet" \
     -H "Content-Type: application/json" -d '{
       "form_title": "Maîtrisez l'\''IA dans votre métier - Formation pratique Côte d'\''Ivoire · Juillet/Août 2026",
       "submitted_at": "2026-07-03T00:00:00Z",
       "answers": {
         "Nom et prénom": "Test ZZZ",
         "Structure / Organisation": "ZZZ-TEST-Exemple",
         "E-mail": "votre_adresse_de_test@example.com",
         "Secteur d'\''activité": "Banque",
         "Combien de personnes souhaitez-vous former ?": "3 personnes",
         "Êtes-vous prêt à vous inscrire ?": "Oui, prêt à m'\''inscrire"
       }
     }'
   ```
2. **Récupérer le `prospect_id`** généré, via l'API n8n (pas besoin d'accès Supabase direct) :
   ```bash
   curl -s "https://n8n-pxlk.srv1480638.hstgr.cloud/api/v1/executions?workflowId=rt3PXnUnnOPB2ioJ&limit=1" \
     -H "X-N8N-API-KEY: $N8N_API_KEY" | python3 -c "import json,sys; print(json.load(sys.stdin)['data'][0]['id'])"
   # puis, avec cet id d'exécution :
   curl -s "https://n8n-pxlk.srv1480638.hstgr.cloud/api/v1/executions/<id>?includeData=true" \
     -H "X-N8N-API-KEY: $N8N_API_KEY" \
     | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['data']['resultData']['runData']['Préparer Contexte Complet'][0]['data']['main'][0][0]['json']['prospect_id'])"
   ```
3. **Appeler directement les webhooks d'approbation manager** — un point d'entrée de production légitime, identique à un clic réel dans l'email d'approbation admin :
   ```bash
   curl "https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/formation-email2-approve?decision=approve&prospect_id=<prospect_id>&email=2"
   curl "https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/formation-email3-approve?decision=approve&prospect_id=<prospect_id>&email=3"
   ```
4. **Vérifier le succès** via l'API executions (`status: success`) et le contenu réel envoyé (`includeData=true`, nœuds `Rebuild Email2/3 Body`).
5. **Nettoyer** les lignes de test dans `prospect_targets` (nécessite la clé `service_role`, voir section 2, ou faire la suppression manuellement dans Supabase Studio) :
   ```sql
   delete from prospect_targets where organization_name ilike '%ZZZ-TEST%';
   ```

Le garde-fou d'approbation humaine entre le fetch planifié et l'envoi réel signifie qu'il n'y a **aucun risque d'envoi automatique incontrôlé** en laissant le `Schedule Trigger` actif pendant qu'on teste par ce biais.

---

## 6. L'accroche RAG ne reflète pas tous les différenciateurs à jour

### Symptôme
L'accroche générée par IA en tête d'email (nœuds `RAG - Générer Accroche...`) semble tourner en boucle sur les mêmes 3-4 différenciateurs, sans jamais mentionner le "diagnostic sur mesure" ou la "migration cloud", pourtant présents dans le docx Programme et listés dans les emails.

### Cause — confirmée le 03/07/2026
Le nœud RAG interroge la table Supabase `documents` via `match_documents`, puis filtre les résultats avec :
```js
const pool = docs.filter(m => /^Differenciateur — /.test(m.titre)).slice(0, 3);
```
Cette regex n'accepte que les titres au format exact `Differenciateur — <texte>` (tiret cadratin, sans numéro). Or la table contient **deux générations de contenu différenciateur** sous deux formats de titre différents :

| Titre en base | Correspond au filtre RAG ? |
|---|---|
| `Differenciateur 1 — Presence internationale, ancrage local` | ❌ Non (numéro avant le tiret) |
| `Differenciateur 2 — Audit gratuit avant toute formation` | ❌ Non |
| `Differenciateur 3 — Cadrage et accompagnement 90 jours` | ❌ Non |
| `Differenciateur 4 — Ordinateurs fournis, travaux pratiques reels` | ❌ Non |
| `Differenciateur 5 — Aide a l'automatisation reelle` | ❌ Non |
| `Differenciateur 6 — Migration cloud sur demande` | ❌ Non |
| `Differenciateur 7 — Veille IA continue et conformite` | ❌ Non |
| `Differenciateur — Aide a l'automatisation reelle` | ✅ Oui |
| `Differenciateur — Cadrage et accompagnement 90 jours` | ✅ Oui |
| `Differenciateur — Ordinateurs fournis, travaux pratiques reels` | ✅ Oui |
| `Differenciateur — Veille IA continue, confidentialite et gouvernance` | ✅ Oui |

**Résultat concret :** seuls 4 différenciateurs sur les 6 réellement utilisés côté emails/docx Programme (🎯 Diagnostic sur mesure, 🗺 Trajectoire 90 jours, ⚙ Cas d'usage réel automatisé, 🔒 Gouvernance intégrée, 🏅 Accompagnement continu, 🌐 Infrastructure prête à l'usage) sont accessibles au générateur d'accroche. **"Diagnostic sur mesure" et "Infrastructure prête à l'usage / migration cloud" ne peuvent jamais être cités dans l'accroche**, car leur seule version en base porte un titre numéroté que la regex exclut.

Constat additionnel : le document `Sessions, lieu, tarif et modalites — Juillet/Aout 2026` (id 13 dans `documents`) indique un lieu générique "Abidjan, Côte d'Ivoire" sans préciser "Riviera 3, carrefour Sainte Famille" — ce document n'est pas filtré par la regex ci-dessus (il n'est utilisé que par l'agent `V10.1 Agent IA Support KB Complet`, qui fait une recherche sémantique sur toute la table sans filtre de titre), mais reste une source potentielle de réponse imprécise sur le lieu si un prospect interroge l'agent IA support par email.

### Vérification
```bash
curl -s "https://wlhznciwuofueffyoflo.supabase.co/rest/v1/documents?select=id,titre&order=titre.asc" \
  -H "apikey: <clé anon>" -H "Authorization: Bearer <clé anon>"
```
La clé `anon` a les droits de lecture **et d'écriture** sur cette table (contrairement au bucket Storage — pas de RLS restrictive ici), donc aucune clé `service_role` n'est nécessaire pour la corriger.

### Solution — appliquée le 03/07/2026
1. Ajout de 2 nouveaux documents titrés exactement `Differenciateur — Diagnostic sur mesure, pas un contenu generique` (id 35) et `Differenciateur — Infrastructure prete a l'usage, pas un frein technique` (id 36), avec embedding généré via l'API OpenAI `text-embedding-3-small` (la même que le nœud RAG utilise) — **une ligne insérée sans embedding n'est jamais retrouvée par `match_documents`**, donc l'embedding doit toujours être calculé et fourni à l'insertion, pas laissé `null`.
2. Contenu du document `Sessions, lieu, tarif et modalites — Juillet/Aout 2026` (id 13) mis à jour pour préciser "Riviera 3, carrefour Sainte Famille" au lieu du seul "Abidjan, Côte d'Ivoire", embedding régénéré après modification.
3. Vérification par simulation exacte de la logique du nœud RAG (embedding de la requête `Differenciateurs de la formation IA TransferAI ... pour un prospect du secteur <X>` + `rpc/match_documents` + filtre `/^Differenciateur — /` + tri par score) sur 3 secteurs (Banque, Diplomatie, Textile) : les 2 nouveaux documents apparaissent bien dans le pool retenu (`Diagnostic sur mesure` en tête de classement, `Infrastructure prête à l'usage` autour de la 14ᵉ position sur les 20 meilleurs résultats).
4. Non fait, laissé pour une session dédiée : nettoyer ou renommer les 7 titres numérotés `Differenciateur 1-7 — ...`, qui restent des doublons obsolètes ou du contenu orphelin jamais retrouvé par ce filtre — à confirmer d'abord qu'ils ne servent pas de source volontairement plus large à l'agent V10.1 (qui fait une recherche sémantique sans filtre de titre) avant toute suppression.

### Bug connexe découvert pendant la vérification : `match_count: 20` codé en dur peut exclure un différenciateur légitime

La table `documents` contient 32 lignes au total (formation + audit + autres contextes RAG du site), pas seulement des différenciateurs formation. Le nœud RAG récupère les 20 meilleurs résultats de similarité **avant** d'appliquer le filtre de titre `/^Differenciateur — /`. Si un différenciateur légitime a un score de similarité plus faible que d'autres documents non-formation pour une requête donnée, il peut se retrouver hors de cette fenêtre de 20 et donc jamais atteindre le filtre.

**Constaté le 03/07/2026 :** `Differenciateur — Veille IA continue, confidentialite et gouvernance` (id 19) se classe 24ᵉ sur 32 pour la requête sectorielle "Banque" — hors des 20 meilleurs résultats, donc absent du pool malgré un titre conforme. Ce n'est pas causé par l'ajout des 2 nouveaux documents (id 19 était déjà hors fenêtre avant leur ajout) — c'est un problème préexistant.

### Correction appliquée le 03/07/2026 (même session)

`match_count: 20` remplacé par `match_count: 50` dans les 3 nœuds concernés (`RAG - Générer Accroche Sectorielle` dans V9, `RAG - Générer Accroche Formation Email2` et `RAG - Générer Accroche Formation Email3` dans Email2/3), via l'API n8n (GET workflow → patch ciblé du `jsCode` de chaque nœud → PUT avec uniquement `{name, nodes, connections, settings}` — jamais d'écrasement aveugle du reste du workflow).

50 couvre confortablement les 32 documents actuels de la table avec de la marge pour la croissance future. Ce n'est pas une solution définitive (un filtre par titre côté RPC, avant le classement par similarité, serait plus robuste à long terme — nécessiterait de modifier la fonction Postgres `match_documents` elle-même, hors de portée sans accès direct à la base), mais élimine le risque à court/moyen terme.

**Vérifié :**
1. Simulation de la logique du nœud (embedding requête secteur Banque → `match_documents` avec `match_count: 50` → filtre titre) : les **6 différenciateurs** apparaissent désormais dans le pool, y compris celui sur la gouvernance.
2. Test réel en production : nouvelle soumission V9 (secteur Banque, exécution `10812`, `success`) — l'accroche générée par GPT mentionne explicitement "diagnostic sur mesure" (un des 2 différenciateurs ajoutés cette session), confirmant que la correction fonctionne de bout en bout avec un vrai appel OpenAI, pas seulement en simulation.

---

## 7. Clés API visibles en clair dans le code des nœuds n8n

### Symptôme
En inspectant le JSON exporté d'un workflow (`GET /api/v1/workflows/<id>`), une clé API OpenAI, un JWT Supabase `anon`, ou une clé Resend apparaissent en clair dans le champ `jsCode` ou `jsonBody` d'un nœud.

### Cause connue
Plusieurs nœuds (`RAG - Générer Accroche...` dans V9 et Email2/3, `Send Email2/3 To Prospect`) ont ces secrets codés en dur dans le code JavaScript ou le corps JSON du nœud, au lieu de passer par le store de credentials n8n. N'importe qui avec un accès en lecture au workflow (éditeur n8n ou API) peut les voir.

### Statut — migration appliquée le 03/07/2026 (même session), avec un problème rencontré et corrigé

**19 nœuds sur 22 identifiés migrés avec succès** vers des credentials n8n natives, sur les 3 workflows concernés (V9, Email2/3, `Ingestion_Documents_Drive_Recursif`) :
- 5 credentials créées : 2× `openAiApi` (une pour les accroches RAG formation, une pour l'ingestion Drive — 2 clés OpenAI différentes étaient utilisées), 2× `supabaseApi` (une `anon`, une `service_role`), 1× `httpHeaderAuth` (Resend).
- Nœuds HTTP Request "classiques" (`authentication: predefinedCredentialType` ou `genericCredentialType`) : migration directe, sans risque particulier — c'est le même mécanisme déjà utilisé par le nœud Google Drive de ce workflow.

**Problème rencontré : les 3 nœuds Code (`RAG - Générer Accroche...`) ne supportent pas `this.getCredentials()`**

Ces 3 nœuds appellent OpenAI et Supabase via `this.helpers.httpRequest()` directement dans du code JavaScript (pas des nœuds HTTP Request natifs), donc la migration "propre" nécessite d'accéder à une credential depuis le code via `await this.getCredentials('openAiApi')`. Testé en conditions réelles (soumission V9 réelle) : **`this.getCredentials is not a function`** — cette instance n8n exécute les nœuds Code via un **task runner externe** (`@n8n/task-runner`, visible dans la stack trace), dont le contexte sandboxé n'expose pas cette méthode, contrairement à l'ancien moteur d'exécution VM intégré où elle fonctionne. **Production cassée immédiatement** (toutes les soumissions V9 échouaient à l'étape `RAG - Générer Accroche Sectorielle`) — détecté et corrigé en moins de 2 minutes par rollback des 3 nœuds Code à leur code original (secrets en clair, comme avant), en gardant les 19 autres nœuds migrés. Re-testé avec succès juste après.

**Second problème trouvé pendant le rollback : mauvaise assignation credential `anon` vs `service_role` sur la table `prospect_targets`**

Les 10 nœuds Supabase de V9/Email2/3 qui interrogent `prospect_targets` (`Chercher Prospect Existant`, `Upsert Prospect Supabase`, `Fetch Leads J+1/J+4`, `Mark Email2/3 Pending`, `Fetch Lead For Email2/3`, `Update Email2/3 Sent`) avaient tous été migrés par erreur vers la credential `anon` (les en-têtes `apikey`/`Authorization` originaux commencent tous par le même préfixe JWT `eyJhbGciOiJIUzI1NiIs...`, identique pour n'importe quel rôle — impossible de distinguer `anon` de `service_role` sans décoder le payload JWT de chaque nœud individuellement, ce qui n'avait pas été fait avant la migration en masse).

**Symptôme :** `permission denied for table prospect_targets` sur `Fetch Lead For Email2/3` — mais pas sur `Chercher Prospect Existant` ni `Upsert Prospect Supabase` (comportement RLS inconsistant selon la requête exacte, cause profonde non investiguée davantage vu le contexte de production critique).

**Solution appliquée :** les 10 nœuds ciblant `prospect_targets` basculés vers la credential `service_role` (par opposition à la table `documents`, qui elle accepte bien `anon`). Re-testé avec succès (Email2 + Email3 tous deux confirmés `success`, message d'approbation correct).

**Vérification finale :** re-scan des 3 workflows — plus aucun secret en clair, sauf dans les 3 nœuds Code (limitation technique documentée ci-dessus, pas une négligence).

### Ce qui reste à faire (nécessite une approche différente)

Les 3 nœuds Code gardent leurs secrets en clair (2 clés OpenAI dupliquées, la clé anon Supabase). Options pour une future session :
1. Remplacer chaque nœud Code RAG par un vrai nœud HTTP Request (2 appels : embeddings OpenAI, puis RPC Supabase) suivi d'un nœud Code plus petit pour la logique de filtrage/formatage — les nœuds HTTP Request supportent nativement les credentials, contournant la limitation du task runner.
2. Vérifier si une version plus récente de n8n (ou une configuration différente du task runner) réactive `this.getCredentials()` dans les nœuds Code.
3. À défaut, au minimum : révoquer et régénérer ces 2 clés OpenAI + la clé anon Supabase par précaution, puisqu'elles restent visibles en clair.

---

## Récapitulatif rapide

1. **4 sources de contenu formation à garder synchronisées** : nœuds n8n, docx Programme, PDF Storage, table RAG `documents`.
2. **Storage bucket** = clé `service_role` requise (RLS stricte) ; **table `documents`** = clé `anon` suffit (RLS permissive, à noter pour de futures corrections rapides).
3. Toujours nettoyer les fichiers de clés locaux (`~/.supabase_credentials`) après usage.
4. Pour tester Email2/3 sans attendre le Schedule Trigger : webhook d'approbation manager + prospect `ZZZ-TEST-...`.
5. Le filtre RAG `/^Differenciateur — /` est strict sur le format du titre — toute nouvelle entrée différenciateur doit respecter ce format exact pour être retrouvée, **et avoir un embedding généré** au moment de l'insertion (jamais `null`).
6. La table `documents` contient plus de contenu que la seule campagne formation (32 lignes au 03/07/2026) — le `match_count` du nœud RAG (`20` avant correction, `50` depuis le 03/07/2026) peut exclure un différenciateur légitime du classement avant même que le filtre de titre s'applique ; vérifier le rang réel via une simulation (section 6) si un différenciateur semble ne jamais apparaître dans les accroches envoyées, et augmenter `match_count` si la table continue de grossir.
