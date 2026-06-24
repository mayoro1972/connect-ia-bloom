# Guide Step-by-Step — Workflow V2
## Supabase + Email d'approbation interne + Envoi prospect

**Fichier workflow :** `43_n8n_Prospection_Modele_Elton_V2_Supabase_Approval_Email.json`  
**Prérequis :** V1 fonctionnel ✅

---

## Ce que la V2 fait en plus de la V1

```
[V1 : génération du pack]
         ↓
Store Pack In Supabase       ← sauvegarde le pack dans la BDD
         ↓
Build Approval Email         ← construit l'email avec liens Approuver/Rejeter
         ↓
Send Internal Approval Email ← envoie cet email à l'équipe TransferAI

[Sur clic du lien dans l'email]
         ↓
Approval Webhook             ← reçoit la décision (approuvé ou rejeté)
         ↓
Get Pack From Supabase       ← récupère le pack complet
         ↓
If Approved ?
   OUI → Mark Pack Approved → Send External Prospect Email → Log Outreach Attempt
   NON → Mark Pack Rejected
```

---

## ÉTAPE 0 — Prérequis à créer AVANT de toucher n8n

### 0.1 Créer un compte Supabase

1. Aller sur [https://supabase.com](https://supabase.com) → **Start your project**
2. Créer un projet (nom : `transferai-prospection`, région : la plus proche)
3. Noter les informations suivantes (Settings → API) :
   - **Project URL** → ex : `https://xxxxxxxxxxxx.supabase.co`
   - **service_role (secret)** → ex : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 0.2 Créer les tables Supabase

Dans Supabase → **SQL Editor** → coller et exécuter le SQL suivant :

```sql
-- Table des packs générés
CREATE TABLE IF NOT EXISTS ai_prospecting_packs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id text UNIQUE NOT NULL,
  prospect_id text,
  organization_name text,
  target_email text,
  status text DEFAULT 'pending_approval',
  payload jsonb,
  llm_redaction_summary jsonb,
  approved_at timestamptz,
  rejected_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Table des tentatives de contact
CREATE TABLE IF NOT EXISTS outreach_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id text,
  pack_id text,
  channel text DEFAULT 'email',
  sent_at timestamptz DEFAULT now(),
  status text DEFAULT 'sent'
);
```

Cliquer **Run** → vérifier que les deux tables apparaissent dans **Table Editor**.

### 0.3 Créer un compte Resend (envoi d'emails)

1. Aller sur [https://resend.com](https://resend.com) → **Sign up** (gratuit)
2. Dans **API Keys** → **Create API Key** → noter la clé : `re_xxxxxxxxxxxx`
3. Dans **Domains** → ajouter votre domaine email OU utiliser le domaine de test Resend
   - Pour les tests : utiliser `onboarding@resend.dev` comme adresse d'envoi
   - Pour la production : ajouter `transferai.africa` et vérifier le domaine

### 0.4 Avoir votre URL n8n publique

L'email d'approbation contient des liens qui pointent vers votre n8n. Ces liens doivent être **accessibles depuis internet**.

- Si n8n est hébergé (ex : `https://n8n-pxlk.srv1480638.hstgr.cloud`) → utiliser cette URL
- Si n8n est en local → utiliser **ngrok** pour exposer un tunnel public

Votre URL n8n (visible dans le navigateur) : **noter cette URL maintenant**

---

## ÉTAPE 1 — Générer le JSON V2 corrigé

Avant d'importer dans n8n, il faut appliquer les mêmes corrections que V1 (Proxy, $env, spreads) sur la V2. Ouvrir un terminal et exécuter :

> **Note :** La valeur de votre clé API OpenAI est déjà connue :  
> `{{$env.OPENAI_API_KEY}}` via variable d'environnement, comme pour la V1

Remplacer dans le script ci-dessous les 5 valeurs marquées `← MODIFIER` :

```python
# Exécuter dans Terminal :
# python3 /chemin/vers/ce/script.py
```

Les corrections sont appliquées automatiquement par le fichier  
`43_n8n_Prospection_Modele_Elton_V2_corrected.json` (généré après la section ÉTAPE 1).

---

## ÉTAPE 2 — Importer le workflow V2 dans n8n

1. Dans n8n, ouvrir un **nouveau workflow** (icône `+` en haut à gauche)
2. Cliquer `...` → **Import from file...**
3. Sélectionner `43_n8n_Prospection_Modele_Elton_V2_corrected.json`
4. Vérifier que les nœuds sont présents (34 nœuds au total)

---

## ÉTAPE 3 — Configurer nœud par nœud

### Nœuds identiques à V1 (mêmes corrections déjà appliquées)

Les nœuds suivants fonctionnent exactement comme en V1. Pas d'action requise si vous utilisez le fichier corrigé :

| Nœud | Action |
|---|---|
| Manual Trigger | ✅ Rien à faire |
| Execute Workflow Trigger | ✅ Rien à faire |
| Set Target | ✅ Valeurs hardcodées (changer le prospect ici) |
| Build Source URLs | ✅ Code corrigé |
| Fetch Public Page 1 à 5 | ✅ neverError activé |
| Normalize Public Signals | ✅ Code corrigé |
| Sanitize Prospect Data For LLM | ✅ Code corrigé |
| Call OpenAI Pre-Audit / Problems Solutions / ROI | ✅ Clé API hardcodée |
| Assemble Prospect Context | ✅ Code corrigé |
| Generate Executive Letter / Catalogue / Audit Form / Deck Brief | ✅ Clé hardcodée + placeholders échappés |
| Assemble Prospect Pack | ✅ Code corrigé |

---

### Nœud 21 — `Store Pack In Supabase`

**Rôle :** Enregistre le pack dans la table `ai_prospecting_packs`.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Store Pack In Supabase`
2. Onglet **Parameters** → section **URL**
3. Remplacer l'URL par :
   ```
   https://VOTRE_URL_SUPABASE.supabase.co/rest/v1/ai_prospecting_packs
   ```
   *(remplacer `VOTRE_URL_SUPABASE` par votre Project URL)*

4. Section **Headers** → modifier les deux headers :
   - `apikey` → valeur : `VOTRE_SERVICE_ROLE_KEY`
   - `Authorization` → valeur : `Bearer VOTRE_SERVICE_ROLE_KEY`

5. Vérifier que `Method = POST` et `Prefer: return=representation` est présent

**Aucune modification du Body** — il est déjà correct.

---

### Nœud 22 — `Build Approval Email`

**Rôle :** Construit l'email HTML avec les boutons Approuver/Rejeter.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Build Approval Email`
2. Localiser dans le code la ligne :
   ```javascript
   const baseUrl = $env.N8N_BASE_URL || 'https://your-n8n.example.com';
   ```
3. Remplacer par votre URL n8n réelle, ex :
   ```javascript
   const baseUrl = 'https://n8n-pxlk.srv1480638.hstgr.cloud';
   ```
4. Sauvegarder

**Les liens générés seront :**
```
https://VOTRE_N8N/webhook/approve-prospect-pack?pack_id=XXX&decision=approved
https://VOTRE_N8N/webhook/approve-prospect-pack?pack_id=XXX&decision=rejected
```

---

### Nœud 23 — `Send Internal Approval Email`

**Rôle :** Envoie l'email d'approbation à l'équipe TransferAI.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Send Internal Approval Email`
2. Section **Headers** → modifier :
   - `Authorization` → valeur : `Bearer re_VOTRE_CLE_RESEND`

3. Section **Body** → localiser et remplacer dans le JSON :
   - `from` : remplacer par votre email Resend vérifié (ex : `prospection@transferai.africa`)
   - `to` : remplacer par votre email interne (ex : `marius@transferai.africa`)
   ```
   from: "prospection@transferai.africa"
   to: ["marius@transferai.africa"]
   ```

**Pour les tests :** utiliser `onboarding@resend.dev` en `from` et votre propre email en `to`.

---

### Nœud 24 — `Approval Webhook`

**Rôle :** Reçoit le clic sur Approuver ou Rejeter depuis l'email.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Approval Webhook`
2. Le chemin est déjà configuré : `/approve-prospect-pack`
3. **Activer le workflow** (toggle en haut) pour que le webhook devienne actif
4. L'URL complète du webhook sera :
   ```
   https://VOTRE_N8N/webhook/approve-prospect-pack
   ```
5. Vérifier que `HTTP Method = GET` et `Response Mode = Last Node`

> ⚠️ **Important :** Le webhook ne fonctionne que si le workflow est **activé** (toggle bleu en haut). En test, utiliser **Execute workflow** depuis le canvas pour déclencher la partie génération, puis activer le workflow pour que le webhook réponde aux clics email.

---

### Nœud 26 — `Get Pack From Supabase`

**Rôle :** Récupère le pack depuis Supabase quand le webhook reçoit une décision.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Get Pack From Supabase`
2. Section **URL** → remplacer `$env.SUPABASE_URL` par votre URL :
   ```
   https://VOTRE_URL.supabase.co/rest/v1/ai_prospecting_packs?select=*&pack_id=eq.{{pack_id}}
   ```
3. Section **Headers** :
   - `apikey` → `VOTRE_SERVICE_ROLE_KEY`
   - `Authorization` → `Bearer VOTRE_SERVICE_ROLE_KEY`

---

### Nœuds 29 — `Mark Pack Approved` et 33 — `Mark Pack Rejected`

**Rôle :** Met à jour le statut du pack dans Supabase.

**Configurer les deux nœuds de la même façon :**

1. Section **URL** → remplacer `$env.SUPABASE_URL` :
   ```
   https://VOTRE_URL.supabase.co/rest/v1/ai_prospecting_packs?pack_id=eq.{{pack_id}}
   ```
2. Section **Headers** :
   - `apikey` → `VOTRE_SERVICE_ROLE_KEY`
   - `Authorization` → `Bearer VOTRE_SERVICE_ROLE_KEY`
3. Vérifier `Method = PATCH`

---

### Nœud 30 — `Send External Prospect Email`

**Rôle :** Envoie le courrier exécutif au prospect si approuvé.

**Ce qu'il faut configurer :**

1. Cliquer sur le nœud `Send External Prospect Email`
2. Section **Headers** :
   - `Authorization` → `Bearer re_VOTRE_CLE_RESEND`
3. Section **Body** → remplacer `from` :
   ```
   "from": "prospection@transferai.africa"
   ```
   *(doit être un domaine vérifié dans Resend)*

> Le champ `to` utilise `$json.target_email` — il prend automatiquement l'email saisi dans `Set Target`. Pas de modification nécessaire.

---

### Nœud 31 — `Log Outreach Attempt`

**Rôle :** Journalise l'envoi dans `outreach_attempts`.

**Ce qu'il faut configurer :**

1. Section **URL** → remplacer `$env.SUPABASE_URL` :
   ```
   https://VOTRE_URL.supabase.co/rest/v1/outreach_attempts
   ```
2. Section **Headers** :
   - `apikey` → `VOTRE_SERVICE_ROLE_KEY`
   - `Authorization` → `Bearer VOTRE_SERVICE_ROLE_KEY`

---

## ÉTAPE 4 — Ajouter `target_email` dans Set Target

Le nœud `Set Target` doit avoir un champ `target_email` avec l'email du décideur.

1. Ouvrir `Set Target`
2. Vérifier que le champ `target_email` existe et contient une vraie adresse :
   ```
   target_email = contact@orange.ci
   ```
3. Pour les tests → utiliser **votre propre email** pour recevoir le courrier test

---

## ÉTAPE 5 — Activer le workflow

1. Dans n8n, cliquer le **toggle** en haut à droite du canvas
2. Le workflow doit passer en bleu (**Active**)
3. Cela active le `Approval Webhook` pour qu'il réponde aux clics email

---

## ÉTAPE 6 — Tester le workflow V2

### Test complet

1. Modifier `Set Target` avec un prospect test :
   - `website = https://www.mtn.ci`
   - `organization_name = MTN Côte d'Ivoire`
   - `target_email = VOTRE_PROPRE_EMAIL` (pour recevoir le courrier test)
2. Cliquer **Execute workflow** (depuis le Manual Trigger)
3. Attendre la fin de l'exécution (environ 30 secondes)
4. **Vérifier votre boîte email** → vous devriez recevoir l'email d'approbation interne
5. Cliquer **Approuver l'envoi** dans l'email
6. Vérifier votre boîte email → le courrier prospect doit arriver
7. Dans Supabase → Table Editor → `ai_prospecting_packs` → vérifier le statut `sent`

### Vérifications dans Supabase

| Table | Ce qu'on doit voir après test |
|---|---|
| `ai_prospecting_packs` | 1 ligne avec `status = sent` et `sent_at` renseigné |
| `outreach_attempts` | 1 ligne avec `channel = email` et `sent_at` |

---

## Récapitulatif des informations à collecter

Avant de commencer, préparer ce tableau :

| Information | Valeur | Où la trouver |
|---|---|---|
| Supabase Project URL | `https://xxxx.supabase.co` | Supabase → Settings → API |
| Supabase service_role key | `eyJhbGci...` | Supabase → Settings → API |
| Resend API Key | `re_xxxxxxxx` | Resend → API Keys |
| Email d'envoi vérifié | `prospection@transferai.africa` | Resend → Domains |
| Email interne approbation | `marius@transferai.africa` | Votre email |
| URL n8n publique | `https://n8n-pxlk.srv...` | Barre d'adresse n8n |
| Clé API OpenAI | `{{$env.OPENAI_API_KEY}}` | Déjà utilisée en V1 via variable d'environnement |

---

## Ordre de configuration recommandé

```
1. Créer Supabase + exécuter le SQL des tables
2. Créer compte Resend + noter la clé API
3. Générer le JSON V2 corrigé
4. Importer dans n8n
5. Configurer Store Pack In Supabase (URL + clés)
6. Configurer Build Approval Email (URL n8n)
7. Configurer Send Internal Approval Email (Resend + emails)
8. Configurer Get Pack / Mark Approved / Mark Rejected (URL Supabase)
9. Configurer Send External Prospect Email (Resend)
10. Configurer Log Outreach Attempt (URL Supabase)
11. Ajouter target_email dans Set Target
12. Activer le workflow
13. Tester de bout en bout
```
