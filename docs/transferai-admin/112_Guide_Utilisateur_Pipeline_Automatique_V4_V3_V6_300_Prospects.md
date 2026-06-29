# Guide Utilisateur — Pipeline Automatique V4 → V3 → V6
## 300 sociétés · 5 envois/jour · Zéro intervention humaine
**TransferAI Africa — Session 28 juin 2026**

---

## 1. Vue d'ensemble

Ce guide décrit comment rendre le pipeline de prospection **entièrement automatique**, du chargement des 300 sociétés jusqu'au déclenchement de V6 après soumission du formulaire d'audit.

Il tient compte de l'audit technique réalisé le 28 juin 2026 qui a identifié **4 corrections bloquantes** dans les workflows existants.

### Ce que fait le pipeline une fois configuré

```
Chaque matin à 8h (lundi → vendredi)
─────────────────────────────────────
V4 Batch
  → lit prospect_targets WHERE status IN ('ready','active')
  → filtre les éligibles (quota 5/jour, attempts < 3, séquence non close)
  → appelle V3 pour chaque prospect retenu

Pour chaque prospect éligible — V3
  → scrape les pages publiques du site web
  → GPT génère la lettre executive personnalisée
  → génère le mini-catalogue PDF (ReportLab)
  → génère le deck de présentation (PPTX + PDF)
  → upload des fichiers dans Supabase Storage
  → envoie l'email Resend (3 pièces jointes)
  → PATCH prospect_targets : delivery_status = 'sent'

Toutes les 30 min — V6
  → SELECT form_responses WHERE completion >= 80% AND processed = false
  → JOIN prospect_targets WHERE delivery_status = 'sent'
  → génère fiche pré-RDV
  → envoie email expert + brief interne
  → marque processed = true
```

### Ce que reçoit chaque prospect

| Pièce jointe | Format | Générateur |
|---|---|---|
| Lettre executive personnalisée | Corps HTML de l'email | GPT + n8n |
| Mini-catalogue formations ciblées | PDF natif | `mini_catalogue_cli.py` |
| Deck de présentation TransferAI | PDF | `deck_generator_cli.py` |

---

## 2. Prérequis avant de commencer

### 2.1 Scripts déployés sur le VPS

```bash
# Sur le VPS n8n (SSH)
pip3 install python-pptx reportlab
mkdir -p /opt/transferai/scripts

# Copier les scripts depuis le repo
scp scripts/generate_mini_catalogue_pdf.py  user@vps:/opt/transferai/scripts/
scp scripts/mini_catalogue_cli.py           user@vps:/opt/transferai/scripts/
scp scripts/deck_generator_cli.py           user@vps:/opt/transferai/scripts/
scp scripts/deck_template_transferai.py     user@vps:/opt/transferai/scripts/

chmod +x /opt/transferai/scripts/*.py

# LibreOffice pour conversion PPTX → PDF
apt-get install -y libreoffice --no-install-recommends
```

### 2.2 Migration Supabase appliquée

Dans Supabase → SQL Editor, exécuter le contenu de :
```
supabase/migrations/20260628120000_prospect_decks_storage.sql
```
Cela crée le bucket `prospect-decks` avec les bonnes policies.

### 2.3 Variables d'environnement n8n configurées

Dans n8n → Settings → Environment Variables :

| Variable | Valeur |
|---|---|
| `SUPABASE_URL` | `https://wlhznciwuofueffyoflo.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (clé service_role Supabase) |
| `OPENAI_API_KEY` | `sk-...` |
| `RESEND_API_KEY` | `re_...` |
| `N8N_CHILD_WORKFLOW_ID_V3` | ID numérique de V3 dans n8n (voir §3.1) |
| `BOOKING_LINK_45MIN` | `https://calendly.com/contact-transferai/30min` |
| `AUDIT_FORM_BASE_URL` | `https://www.transferai.ci/questionnaire-audit` |

---

## 3. Corrections obligatoires dans n8n (4 actions — 30 min)

Ces corrections doivent être faites **une seule fois** avant le premier lancement automatique.

---

### 3.1 Correction 1 — Renseigner l'ID de V3 dans V4 🔴

**Pourquoi :** V4 appelle V3 via `Execute Workflow`. Sans l'ID réel, V4 ne peut pas lancer V3.

**Comment trouver l'ID de V3 :**
1. Ouvrir V3 dans n8n
2. Regarder l'URL : `https://n8n.transferai.ci/workflow/`**42** ← c'est le numéro
3. Copier ce numéro

**Où le mettre :**
- Option A : n8n → Settings → Variables → `N8N_CHILD_WORKFLOW_ID_V3` = `42`
- Option B : dans V4 → nœud `Execute Prospect Workflow V3` → champ `workflowId` → remplacer `REPLACE_WITH_V3_WORKFLOW_ID` par `42`

---

### 3.2 Correction 2 — Ajouter `delivery_status = 'sent'` dans V3 🔴

**Pourquoi :** C'est le champ que V6 surveille pour savoir qu'un prospect a reçu son pack. Sans lui, V6 ne détecte rien.

**Nœud concerné dans V3 :** `Update Prospect Target Sent`

**Ouvrir le nœud et remplacer le corps JSON par :**

```json
{
  "status": "sent",
  "delivery_status": "sent",
  "sent_at": "={{new Date().toISOString()}}",
  "paused": false,
  "last_sequence_result": "sent_v3",
  "last_response_status": "pending",
  "niche_status": "outreach_started",
  "outreach_attempt_count": "={{($('Build Send Context').first().json.outreach_attempt_count || 0) + 1}}",
  "next_action_at": "={{new Date(Date.now() + 7*24*3600*1000).toISOString()}}",
  "last_pack_id": "={{$json.pack_id || null}}",
  "updated_at": "={{new Date().toISOString()}}"
}
```

**Vérifier aussi l'URL du PATCH :**
```
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospect_targets?prospect_id=eq.{{$json.prospect_id}}
```

---

### 3.3 Correction 3 — Ajouter un nœud Upsert au début de V3 🟠

**Pourquoi :** Que V3 soit lancé manuellement ou par V4, cette correction crée ou met à jour automatiquement la ligne dans `prospect_targets`. Sans cela, les prospects lancés manuellement ne sont jamais créés dans la base et V6 ne les voit pas.

**Où l'insérer :** juste après `Set Target`, avant `Build Source URLs`.

**Type de nœud :** HTTP Request

**Configuration :**
```
Nom     : Upsert Prospect In CRM
Method  : POST
URL     : ={{$env.SUPABASE_URL}}/rest/v1/prospect_targets
Headers :
  apikey        : ={{$env.SUPABASE_SERVICE_ROLE_KEY}}
  Authorization : Bearer ={{$env.SUPABASE_SERVICE_ROLE_KEY}}
  Content-Type  : application/json
  Prefer        : resolution=merge-duplicates

Body (JSON) :
{
  "prospect_id":              "={{$json.prospect_id}}",
  "organization_name":        "={{$json.organization_name}}",
  "target_email":             "={{$json.target_email}}",
  "website":                  "={{$json.website}}",
  "country":                  "={{$json.country}}",
  "sector_guess":             "={{$json.sector_guess}}",
  "niche_status":             "={{$json.niche_status}}",
  "decision_maker_name":      "={{$json.decision_maker_name}}",
  "organization_type":        "={{$json.organization_type}}",
  "commercial_priority_tier": "={{$json.commercial_priority_default || 'tier2'}}",
  "prospect_language":        "={{$json.prospect_language || 'fr'}}",
  "source_backend":           "={{$json.source_backend || 'manual'}}",
  "status":                   "ready",
  "delivery_status":          "pending",
  "outreach_attempt_count":   0,
  "do_not_contact":           false,
  "updated_at":               "={{new Date().toISOString()}}"
}

Options : neverError = true
```

---

### 3.4 Correction 4 — Aligner `commercial_priority_tier` dans V4 🟠

**Pourquoi :** V4 lit `commercial_priority_default` depuis la table mais la colonne s'appelle `commercial_priority_tier`. La valeur réelle du tier (tier1/tier2) ne passe pas à V3.

**Nœud concerné dans V4 :** `Normalize Supabase Prospects`

**Trouver cette ligne dans le code :**
```javascript
commercial_priority_default: row.commercial_priority_default || 'tier1',
```

**La remplacer par :**
```javascript
commercial_priority_default: row.commercial_priority_tier || row.commercial_priority_default || 'tier1',
niche_status: row.niche_status || '',
prospect_language: row.prospect_language || 'fr',
```

---

## 4. Remplir la table `prospect_targets` — les 300 sociétés

### 4.1 Structure de la table (colonnes requises)

| Colonne | Type | Obligatoire | Exemple |
|---|---|---|---|
| `organization_name` | text | ✅ | `Orange Côte d'Ivoire` |
| `target_email` | text | ✅ | `direction@orange.ci` |
| `website` | text | ✅ | `https://www.orange.ci` |
| `country` | text | ✅ | `Côte d'Ivoire` |
| `sector_guess` | text | ✅ | `Télécommunications` |
| `niche_status` | text | ✅ | `service_client_multicanal` |
| `decision_maker_name` | text | ✅ | `M. Directeur Général` |
| `status` | text | ✅ | `ready` |
| `commercial_priority_tier` | text | ✅ | `tier1` |
| `prospect_language` | text | ✅ | `fr` |
| `outreach_attempt_count` | int | ✅ | `0` |
| `do_not_contact` | bool | ✅ | `false` |
| `delivery_status` | text | ✅ | `pending` |
| `organization_type` | text | recommandé | `Entreprise` |
| `custom_page_paths_csv` | text | recommandé | `/,/a-propos,/services` |
| `next_action_at` | timestamp | optionnel | `NULL` = traité dès aujourd'hui |
| `source_backend` | text | requis V4 | `supabase` |
| `booking_link_45min` | text | optionnel | `https://calendly.com/...` |
| `research_scope` | text | optionnel | `full` |

### 4.2 Valeurs `niche_status` reconnues par le deck et le catalogue

```
service_client_multicanal       → Copilote service client, scripts IA, base procédures
reporting_data_analytics        → Synthèse IA des KPI, analyse verbatims, dashboards
formation_montee_competences    → Parcours IA sur mesure, évaluation, base de connaissances
automatisation_processus_rh     → Copilote RH, onboarding, entretiens assistés
logistique_supply_chain         → Planification IA, pilotage opérationnel, procédures terrain
```

### 4.3 Valeurs `commercial_priority_tier`

```
tier1  → Lead très qualifié, email valide, intention forte → V6 routing HIGH
tier2  → Lead exploitable → V6 routing MEDIUM
tier3  → Incomplet → reste en draft, non traité par V4
```

### 4.4 Import des 300 sociétés

**Option A — CSV via Supabase Table Editor**
1. Préparer un fichier CSV avec les colonnes ci-dessus
2. Supabase → Table Editor → `prospect_targets` → Import CSV
3. Vérifier que toutes les lignes ont `status = 'ready'` et `delivery_status = 'pending'`

**Option B — Script SQL direct**
```sql
INSERT INTO prospect_targets (
  organization_name, target_email, website, country,
  sector_guess, niche_status, decision_maker_name,
  status, delivery_status, commercial_priority_tier,
  prospect_language, outreach_attempt_count, do_not_contact,
  source_backend, updated_at
) VALUES
  ('Société 1', 'email@societe1.ci', 'https://societe1.ci', 'Côte d''Ivoire',
   'Banque', 'reporting_data_analytics', 'M. DG',
   'ready', 'pending', 'tier1', 'fr', 0, false, 'supabase', NOW()),
  ('Société 2', ...),
  ...
;
```

**Option C — Import depuis Google Sheets**
V4 supporte nativement Google Sheets via `source_backend = 'google_sheets'`. Il suffit de configurer `GOOGLE_SHEETS_CSV_URL` dans les variables d'environnement et de changer `source_backend` dans `Set Batch Config`.

---

## 5. Activer V4 — Schedule automatique

### 5.1 Vérifier la configuration du Schedule

Dans V4 → nœud `Daily Schedule Trigger` :
```
Cron actuel : 0 8 * * 1-5
= Chaque lundi au vendredi à 8h00 (heure du VPS)
```

Pour changer l'heure (ex : 9h) :
```
0 9 * * 1-5
```

Pour inclure le samedi :
```
0 8 * * 1-6
```

### 5.2 Vérifier `Set Batch Config`

Dans V4 → nœud `Set Batch Config` → valeurs recommandées :

| Paramètre | Valeur | Rôle |
|---|---|---|
| `source_backend` | `supabase` | Source des prospects |
| `batch_fetch_limit` | `25` | Max lignes lues par batch |
| `daily_send_limit` | `5` | Max envois par jour |
| `max_attempts_per_prospect` | `3` | Arrêt après 3 tentatives |
| `min_confidence_score` | `0.45` | Filtre qualité |

### 5.3 Activer le workflow V4

Dans n8n → V4 → bouton **Activate** en haut à droite.
V4 tournera automatiquement selon le schedule sans aucune intervention.

---

## 6. Comment fonctionne la sélection des 5 prospects par jour

Chaque matin, V4 applique ces règles **dans l'ordre** pour sélectionner les 5 prospects du jour :

```
1. Lire les 25 premières lignes WHERE status IN ('ready','active')
   AND paused = false
   ORDER BY next_action_at ASC NULLS LAST, updated_at ASC

2. Pour chaque ligne, vérifier :
   ├── organization_name présent ?           → sinon : skip (missing_minimum_profile)
   ├── website présent ?                     → sinon : skip
   ├── target_email présent ?                → sinon : skip
   ├── do_not_contact = false ?              → sinon : skip
   ├── paused = false ?                      → sinon : skip
   ├── outreach_attempt_count < 3 ?          → sinon : skip (max_attempts_reached)
   ├── last_response_status pas dans         → sinon : skip (sequence_already_closed)
   │   [interested, meeting_booked,
   │    not_interested, unsubscribed]
   ├── last_sequence_result ≠ 'no_niche' ?   → sinon : skip
   └── quota journalier non atteint ?        → sinon : skip (daily_quota_reached)

3. Les 5 premiers qui passent tous les filtres → envoyés à V3
```

---

## 7. Ce qui se passe après l'envoi

### 7.1 Mise à jour dans Supabase

Après chaque envoi réussi, V3 met à jour la ligne dans `prospect_targets` :

| Champ | Valeur après envoi |
|---|---|
| `status` | `sent` |
| `delivery_status` | `sent` ← **clé pour V6** |
| `sent_at` | timestamp de l'envoi |
| `outreach_attempt_count` | incrémenté de 1 |
| `last_sequence_result` | `sent_v3` |
| `last_response_status` | `pending` |
| `niche_status` | `outreach_started` |
| `next_action_at` | J+7 (relance potentielle) |

### 7.2 Déclenchement de V6

V6 tourne toutes les 30 min et fait cette requête :

```sql
SELECT fr.*, pt.organization_name, pt.target_email, pt.commercial_priority_tier
FROM form_responses fr
JOIN prospect_targets pt ON pt.pack_id = fr.pack_id
WHERE fr.completion_percentage >= 80
  AND fr.processed = false
  AND pt.delivery_status = 'sent'
```

Dès qu'un prospect remplit le formulaire à 80% ou plus, V6 :
1. Calcule la priorité de routing (HIGH / MEDIUM / NORMAL)
2. Génère la fiche pré-RDV
3. Envoie l'email à l'expert interne
4. Envoie le brief de préparation
5. Marque `form_responses.processed = true`

**Délai maximum** : 30 minutes entre la soumission du formulaire et la réception de l'email expert.

---

## 8. Mode manuel — comment ça fonctionne avec les corrections

Grâce au nœud **Upsert Prospect In CRM** (correction 3.3), le mode manuel fonctionne exactement comme le mode automatique :

1. Ouvrir V3 dans n8n
2. Modifier les valeurs dans `Set Target` si besoin (nom, email, secteur, etc.)
3. Cliquer **Execute**
4. V3 crée ou met à jour la ligne dans `prospect_targets` automatiquement
5. Génère et envoie le pack (lettre + catalogue + deck)
6. Écrit `delivery_status = 'sent'`
7. V6 détecte la soumission dans les 30 min suivantes

**Aucune intervention dans Supabase nécessaire.**

---

## 9. Suivre les envois et le statut des prospects

### Dans Supabase — vue rapide

```sql
-- Prospects envoyés aujourd'hui
SELECT organization_name, target_email, sent_at, outreach_attempt_count
FROM prospect_targets
WHERE delivery_status = 'sent'
  AND sent_at >= CURRENT_DATE
ORDER BY sent_at DESC;

-- Prospects qui ont soumis le formulaire
SELECT pt.organization_name, fr.completion_percentage, fr.submitted_at, fr.processed
FROM form_responses fr
JOIN prospect_targets pt ON pt.pack_id = fr.pack_id
WHERE fr.completion_percentage >= 80
ORDER BY fr.submitted_at DESC;

-- Prospects restants à traiter (en attente)
SELECT organization_name, commercial_priority_tier, outreach_attempt_count, next_action_at
FROM prospect_targets
WHERE status = 'ready'
  AND delivery_status = 'pending'
  AND do_not_contact = false
ORDER BY commercial_priority_tier ASC, next_action_at ASC NULLS FIRST;

-- Quota du jour (combien d'envois déjà partis)
SELECT COUNT(*) as envois_aujourd_hui
FROM outreach_attempts
WHERE sent_at >= CURRENT_DATE;
```

### Dans n8n — logs

Chaque exécution de V4 produit un résumé dans `Log Processed Batch Item` et `Finalize Batch Run`. Vérifier dans n8n → Executions pour voir :
- Combien de prospects ont été traités
- Lesquels ont été skippés et pourquoi
- Si V3 a été appelé correctement pour chacun

---

## 10. Checklist avant le premier lancement automatique

### Scripts et infrastructure
- [ ] `pip3 install python-pptx reportlab` sur le VPS
- [ ] Scripts copiés dans `/opt/transferai/scripts/`
- [ ] `libreoffice --headless` disponible sur le VPS
- [ ] Migration Supabase `20260628120000_prospect_decks_storage.sql` appliquée
- [ ] Bucket `prospect-decks` visible dans Supabase Storage

### Variables d'environnement n8n
- [ ] `SUPABASE_URL` configurée
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée
- [ ] `N8N_CHILD_WORKFLOW_ID_V3` = ID réel de V3
- [ ] `BOOKING_LINK_45MIN` configurée
- [ ] `AUDIT_FORM_BASE_URL` = `https://www.transferai.ci/questionnaire-audit`

### Corrections dans n8n
- [ ] **V4** : `Execute Prospect Workflow V3` → ID réel de V3 renseigné
- [ ] **V3** : `Update Prospect Target Sent` → `delivery_status = 'sent'` ajouté
- [ ] **V3** : nœud `Upsert Prospect In CRM` ajouté après `Set Target`
- [ ] **V4** : `Normalize Supabase Prospects` → `commercial_priority_tier` aligné

### Données
- [ ] 300 sociétés importées dans `prospect_targets` avec `status = 'ready'`
- [ ] Toutes les lignes ont `delivery_status = 'pending'`
- [ ] `niche_status` renseigné pour chaque ligne (parmi les 5 valeurs reconnues)
- [ ] `commercial_priority_tier` = `tier1` ou `tier2` pour chaque ligne

### Activation
- [ ] V4 activé (bouton Activate dans n8n)
- [ ] V6 activé (schedule 30 min actif)
- [ ] Post-Audit V2 **désactivé** (conflit avec V6)
- [ ] Chatwoot V5.5 **désactivé** (conflit avec V5.5.2)

### Test final
- [ ] Dry-run manuel de V3 avec un prospect test → email reçu avec 3 PJ
- [ ] Vérifier dans Supabase que `delivery_status = 'sent'` est écrit
- [ ] Vérifier dans n8n Executions que V4 s'est bien déclenché à 8h

---

## 11. Questions fréquentes

**Q : Un prospect peut-il recevoir deux fois le même email ?**
R : Non. V4 bloque tout prospect dont `outreach_attempt_count >= 3` ou dont `last_response_status` est `interested / meeting_booked / not_interested`. De plus, `next_action_at` est mis à J+7 après chaque envoi.

**Q : Que se passe-t-il si l'email rebondit (bounce) ?**
R : Resend renvoie un événement webhook. Configurer un webhook Resend → n8n pour mettre à jour `last_response_status = 'bounced'` et `do_not_contact = true` automatiquement.

**Q : Peut-on mettre un prospect en pause ?**
R : Oui. Dans Supabase, mettre `paused = true` sur la ligne. V4 le détecte et le skippa avec `stop_reason = 'prospect_paused'`.

**Q : Comment relancer un prospect après 7 jours sans réponse ?**
R : V4 détecte automatiquement les prospects dont `next_action_at <= NOW()` et `outreach_attempt_count < 3`. La relance est automatique si le prospect est encore en `status = 'active'` et `delivery_status = 'sent'`.

**Q : Comment exclure définitivement une société ?**
R : Mettre `do_not_contact = true` dans Supabase. V4 les skippera avec `stop_reason = 'do_not_contact'` pour toutes les exécutions futures.

**Q : Peut-on encore lancer V3 manuellement après ces corrections ?**
R : Oui, complètement. Le nœud Upsert (correction 3.3) crée automatiquement la ligne dans Supabase que V3 soit lancé manuellement ou par V4. Les deux modes coexistent sans conflit.
