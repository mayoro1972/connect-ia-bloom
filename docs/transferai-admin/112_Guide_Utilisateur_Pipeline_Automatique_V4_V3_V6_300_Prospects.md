# Guide Utilisateur — Pipeline Automatique V4 → V3 → V6
## 300 sociétés · 5 envois/jour · Zéro intervention humaine
**TransferAI Africa — Mis à jour le 29 juin 2026**

> **Statut au 29 juin 2026 :** Pipeline V3 opérationnel et testé. V4 et V6 prêts à être activés après import des 300 sociétés.

---

## 1. Vue d'ensemble

Ce guide décrit le pipeline de prospection **entièrement automatique**, du chargement des 300 sociétés jusqu'au déclenchement de V6 après soumission du formulaire d'audit.

### Ce que fait le pipeline une fois activé

```
Chaque matin à 8h00 (lundi → vendredi) — V4
─────────────────────────────────────────────
V4 Batch
  → lit prospect_targets WHERE status IN ('ready','active')
  → filtre les éligibles (quota 5/jour, attempts < 3, séquence non close)
  → appelle V3 pour chaque prospect retenu

Pour chaque prospect éligible — V3
  → scrape les pages publiques du site web (5 pages max)
  → GPT génère la lettre executive personnalisée
  → génère le mini-catalogue PDF premium (ReportLab — couverture bleue)
  → génère le deck de présentation PPTX (9 slides)
  → upload PDF + PPTX dans Supabase Storage (bucket prospect-decks)
  → envoie email Resend (lettre + 2 pièces jointes)
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
| Mini-catalogue formations ciblées | PDF natif premium | `mini_catalogue_cli.py` + ReportLab |
| Deck de présentation TransferAI | PPTX (9 slides) | `deck_generator_cli.py` + python-pptx |

---

## 2. État des corrections au 29 juin 2026

### 2.1 Corrections appliquées ✅

| Correction | Description | Statut |
|---|---|---|
| Set Target : champs `=website` corrigés | Suppression du préfixe `=` sur tous les noms de champs | ✅ Fait |
| Build Source URLs : lit depuis Set Target | `$('Set Target').first().json` au lieu de `$input.first()` | ✅ Fait |
| Upsert Prospect In CRM | Nœud ajouté entre Set Target et Build Source URLs | ✅ Fait |
| Connexion Set Target → Upsert → Build Source URLs | Chaîne corrigée dans le workflow | ✅ Fait |
| Assemble Prospect Pack : regex `\n` | Saut de ligne littéral remplacé par `\n` dans le replace | ✅ Fait |
| Assemble Prospect Pack : `$env` supprimés | `audit_form_base_url` hardcodé, `$env` inaccessible via UI | ✅ Fait |
| Generate Executive Letter : `$env` supprimés | URL audit + query suffix hardcodés | ✅ Fait |
| Send Internal Approval Email : `$env` supprimés | From/To hardcodés (`onboarding@resend.dev`, `marius.ayoro70@gmail.com`) | ✅ Fait |
| Fetch Public Page 1/2 : On Error → Continue | Empêche le blocage si une page est inaccessible | ✅ Fait |
| `commercial_priority_tier` dans Supabase | Colonne ajoutée via ALTER TABLE | ✅ Fait |
| `delivery_status`, `sent_at`, `prospect_language`, `source_label`, `last_pack_id` | Colonnes ajoutées dans `prospect_targets` | ✅ Fait |
| `form_invitations.invitee_email` | DROP NOT NULL — accepte les prospects sans email connu | ✅ Fait |
| Scripts VPS déployés | `generate_mini_catalogue_pdf.py` premium + deck sur `/opt/transferai/scripts/` | ✅ Fait |
| Bucket `prospect-decks` nettoyé | 104 anciens fichiers supprimés | ✅ Fait |
| Workflow FINAL-MERGED | Fusion V20-FIXED + FINAL-20 → `TransferAI_V3_FINAL_MERGED.json` | ✅ Fait |

### 2.2 Actions restantes avant activation automatique 🔴

| Action | Où | Priorité |
|---|---|---|
| Importer `TransferAI_V3_FINAL_MERGED.json` dans n8n | n8n → Import Workflow | 🔴 Urgent |
| Renseigner l'ID réel de V3 dans V4 | V4 → `Execute Prospect Workflow V3` → workflowId | 🔴 Urgent |
| Importer les 300 sociétés dans `prospect_targets` | Supabase → CSV ou SQL | 🔴 Avant activation |
| Activer V4 (toggle ON) | n8n → V4 → Activate | 🔴 Dernier geste |
| Activer V6 (schedule 30 min) | n8n → V6 → Activate | 🔴 Dernier geste |
| Désactiver Post-Audit V2 | n8n → Post-Audit V2 → Deactivate | ⚠️ Évite conflit V6 |
| Désactiver Chatwoot V5.5 | n8n → V5.5 → Deactivate | ⚠️ Évite conflit V5.5.2 |

---

## 3. Import du workflow consolidé dans n8n

Le fichier `TransferAI_V3_FINAL_MERGED.json` (dans `docs/transferai-admin/`) est la version finale qui intègre toutes les corrections ci-dessus.

### Comment importer

1. Dans n8n → menu **Workflows** → bouton **⋮** → **Import from file**
2. Sélectionner `TransferAI_V3_FINAL_MERGED.json`
3. Sauvegarder
4. Aller dans le nœud `Call OpenAI Pre-Audit` → renseigner la vraie clé OpenAI (les clés ont été redactées dans le fichier JSON pour la sécurité)
5. Faire de même pour tous les nœuds HTTP Request qui appellent OpenAI

> **Important :** Les clés API (`OPENAI_API_KEY_REDACTED`) doivent être remplacées par les vraies valeurs dans les nœuds correspondants après import.

---

## 4. Quand se déclenchent V4 et V6 ?

### V4 — Déclenchement automatique

```
Schedule : 0 8 * * 1-5
= Chaque lundi, mardi, mercredi, jeudi et vendredi à 8h00 (heure VPS)
```

**Première exécution automatique :** le prochain lundi matin à 8h00 après activation.

**Ce qui se passe à 8h00 :**
1. V4 lit jusqu'à 25 prospects dans `prospect_targets` (status=ready, paused=false)
2. Applique les filtres (attempts < 3, email présent, do_not_contact=false)
3. Retient les 5 premiers éligibles
4. Appelle V3 pour chacun (exécution séquentielle)
5. Écrit le log dans `outreach_attempts`

**Durée estimée :** 5 à 10 minutes pour 5 prospects (scraping + GPT + génération PDF/PPTX + email)

**Pour tester sans attendre lundi :**
- Aller dans V4 → cliquer **Execute** manuellement → V4 sélectionne et envoie les 5 prospects du jour

**Pour changer l'heure :**
- V4 → nœud `Daily Schedule Trigger` → modifier le cron
- Exemple 9h : `0 9 * * 1-5`
- Exemple incluant samedi : `0 8 * * 1-6`

---

### V6 — Déclenchement automatique

```
Schedule : */30 * * * *
= Toutes les 30 minutes, 24h/24, 7j/7
```

**Condition de déclenchement réel :**
V6 tourne toutes les 30 min mais n'agit que si la requête retourne des résultats :

```sql
SELECT fr.*, pt.organization_name, pt.target_email, pt.commercial_priority_tier
FROM form_responses fr
JOIN prospect_targets pt ON pt.pack_id = fr.pack_id
WHERE fr.completion_percentage >= 80
  AND fr.processed = false
  AND pt.delivery_status = 'sent'
```

**V6 se déclenche effectivement quand :**
1. Un prospect a reçu son pack (`delivery_status = 'sent'`) ← écrit par V3 après envoi
2. Ce prospect remplit le formulaire d'audit à 80% ou plus
3. V6 passe dans les 30 minutes suivantes → détecte la soumission → génère et envoie la fiche pré-RDV

**Délai maximum entre soumission du formulaire et email expert : 30 minutes.**

---

## 5. Prérequis infrastructure (état au 29 juin)

### 5.1 Scripts VPS ✅ Déployés

```
/opt/transferai/scripts/
├── generate_mini_catalogue_pdf.py  ← layout premium ReportLab (Jun 29 13:22)
├── mini_catalogue_cli.py           ← CLI upload Supabase (Jun 29 13:22)
├── deck_generator_cli.py           ← deck 9 slides (Jun 29 13:22)
└── deck_template_transferai.py     ← template visuel (Jun 29 13:22)
```

Dépendances installées : `reportlab 5.0.0`, `python-pptx 1.0.2`

### 5.2 Colonnes Supabase ✅ Ajoutées

```sql
-- Colonnes ajoutées le 29 juin 2026
ALTER TABLE prospect_targets
  ADD COLUMN IF NOT EXISTS commercial_priority_tier TEXT DEFAULT 'tier2',
  ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS prospect_language TEXT DEFAULT 'fr',
  ADD COLUMN IF NOT EXISTS source_label TEXT,
  ADD COLUMN IF NOT EXISTS last_pack_id TEXT;

ALTER TABLE form_invitations
  ALTER COLUMN invitee_email DROP NOT NULL;
```

### 5.3 Variables d'environnement n8n (à configurer si pas encore fait)

| Variable | Valeur |
|---|---|
| `SUPABASE_URL` | `https://wlhznciwuofueffyoflo.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (clé service_role Supabase) |
| `OPENAI_API_KEY` | `sk-...` |
| `RESEND_API_KEY` | `re_...` |
| `N8N_CHILD_WORKFLOW_ID_V3` | ID numérique de V3 dans n8n (voir §6) |

> **Note :** `AUDIT_FORM_BASE_URL` et `AUDIT_FORM_QUERY_SUFFIX` sont maintenant **hardcodés directement** dans les nœuds (plus besoin de variables d'environnement pour ces deux valeurs).

---

## 6. Correction 1 — Renseigner l'ID de V3 dans V4 🔴

**Pourquoi :** V4 appelle V3 via `Execute Workflow`. Sans l'ID réel, V4 ne peut pas lancer V3.

**Comment trouver l'ID de V3 :**
1. Ouvrir le workflow V3 importé dans n8n
2. Regarder l'URL : `https://n8n.transferai.ci/workflow/`**42** ← c'est le numéro
3. Copier ce numéro

**Où le mettre :**
- Dans V4 → nœud `Execute Prospect Workflow V3` → champ `workflowId` → remplacer `REPLACE_WITH_V3_WORKFLOW_ID` par le numéro réel

---

## 7. Remplir la table `prospect_targets` — les 300 sociétés

### 7.1 Colonnes requises

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
| `source_backend` | text | requis V4 | `supabase` |
| `next_action_at` | timestamp | optionnel | `NULL` = traité dès aujourd'hui |
| `booking_link_45min` | text | optionnel | `https://calendly.com/...` |

### 7.2 Valeurs `niche_status` reconnues

```
service_client_multicanal       → Copilote service client, scripts IA, base procédures
reporting_data_analytics        → Synthèse IA des KPI, analyse verbatims, dashboards
formation_montee_competences    → Parcours IA sur mesure, évaluation, base de connaissances
automatisation_processus_rh     → Copilote RH, onboarding, entretiens assistés
logistique_supply_chain         → Planification IA, pilotage opérationnel, procédures terrain
telecommunications              → Qualification appels, détection churn, base agents
it_transformation_digitale      → Reporting IT, doc technique, support N1
finance_comptabilite            → Clôtures, réconciliation, reporting mensuel
```

### 7.3 Import via SQL

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
   'ready', 'pending', 'tier1', 'fr', 0, false, 'supabase', NOW())
;
```

---

## 8. Sélection des 5 prospects par jour (logique V4)

```
1. Lire jusqu'à 25 lignes WHERE status IN ('ready','active')
   AND paused = false
   ORDER BY next_action_at ASC NULLS LAST, updated_at ASC

2. Filtres appliqués pour chaque ligne :
   ├── organization_name présent ?           → sinon : skip
   ├── website présent ?                     → sinon : skip
   ├── target_email présent ?                → sinon : skip
   ├── do_not_contact = false ?              → sinon : skip
   ├── outreach_attempt_count < 3 ?          → sinon : skip
   ├── last_response_status pas dans         → sinon : skip
   │   [interested, meeting_booked,
   │    not_interested, unsubscribed]
   └── quota journalier non atteint ?        → sinon : stop

3. Les 5 premiers éligibles → envoyés à V3
```

---

## 9. Ce qui se passe après l'envoi

| Champ `prospect_targets` | Valeur après envoi |
|---|---|
| `status` | `sent` |
| `delivery_status` | `sent` ← **clé pour V6** |
| `sent_at` | timestamp de l'envoi |
| `outreach_attempt_count` | incrémenté de 1 |
| `last_sequence_result` | `sent_v3` |
| `last_response_status` | `pending` |
| `next_action_at` | J+7 |

---

## 10. Suivi SQL

```sql
-- Prospects envoyés aujourd'hui
SELECT organization_name, target_email, sent_at, outreach_attempt_count
FROM prospect_targets
WHERE delivery_status = 'sent'
  AND sent_at >= CURRENT_DATE
ORDER BY sent_at DESC;

-- Formulaires soumis (V6 en attente ou traité)
SELECT pt.organization_name, fr.completion_percentage, fr.submitted_at, fr.processed
FROM form_responses fr
JOIN prospect_targets pt ON pt.pack_id = fr.pack_id
WHERE fr.completion_percentage >= 80
ORDER BY fr.submitted_at DESC;

-- Prospects restants à traiter
SELECT organization_name, commercial_priority_tier, outreach_attempt_count, next_action_at
FROM prospect_targets
WHERE status = 'ready'
  AND delivery_status = 'pending'
  AND do_not_contact = false
ORDER BY commercial_priority_tier ASC, next_action_at ASC NULLS FIRST;

-- Quota du jour
SELECT COUNT(*) as envois_aujourd_hui
FROM outreach_attempts
WHERE sent_at >= CURRENT_DATE;
```

---

## 11. Checklist finale avant activation

### Infrastructure ✅ Déjà fait
- [x] Scripts déployés sur VPS `/opt/transferai/scripts/` (Jun 29 13:22)
- [x] `reportlab` + `python-pptx` installés sur VPS
- [x] Colonnes `prospect_targets` ajoutées (commercial_priority_tier, delivery_status, etc.)
- [x] `form_invitations.invitee_email` DROP NOT NULL
- [x] Bucket `prospect-decks` nettoyé (104 anciens fichiers supprimés)
- [x] Workflow FINAL-MERGED créé et pushé sur GitHub

### À faire avant activation 🔴
- [ ] **Importer** `TransferAI_V3_FINAL_MERGED.json` dans n8n
- [ ] **Remplacer** `OPENAI_API_KEY_REDACTED` dans les nœuds OpenAI après import
- [ ] **Renseigner** l'ID réel de V3 dans V4 → `Execute Prospect Workflow V3`
- [ ] **Importer** les 300 sociétés dans `prospect_targets` (status=ready, delivery_status=pending)
- [ ] **Activer V4** (bouton Activate dans n8n)
- [ ] **Activer V6** (schedule 30 min)
- [ ] **Désactiver** Post-Audit V2 (conflit avec V6)
- [ ] **Désactiver** Chatwoot V5.5 (conflit avec V5.5.2)

### Test de validation
- [ ] Dry-run manuel V3 → email reçu avec 2 pièces jointes (PDF premium + PPTX)
- [ ] Vérifier `delivery_status = 'sent'` dans Supabase après envoi
- [ ] Ouvrir le lien formulaire d'audit → formulaire accessible sans erreur
- [ ] Soumettre le formulaire → V6 déclenché dans les 30 min

---

## 12. FAQ

**Q : Quand V4 se déclenchera-t-il pour la première fois ?**
R : Le prochain jour ouvré (lundi-vendredi) à 8h00 après avoir cliqué **Activate** dans n8n.

**Q : Peut-on lancer V3 manuellement en parallèle du mode automatique ?**
R : Oui. Le nœud `Upsert Prospect In CRM` crée ou met à jour la ligne automatiquement, que V3 soit lancé manuellement ou par V4. Les deux modes coexistent.

**Q : V6 peut-il traiter un prospect qui n'a pas été envoyé par V3 ?**
R : Non. V6 cherche `delivery_status = 'sent'` dans `prospect_targets`. Un prospect ajouté manuellement dans Supabase sans passer par V3 ne sera pas détecté par V6.

**Q : Que se passe-t-il si V3 échoue pour un prospect ?**
R : V4 logue l'erreur dans `Log Processed Batch Item`. Le prospect reste à `status = 'ready'` et sera retenté le lendemain (jusqu'à `max_attempts = 3`).

**Q : Un prospect peut-il recevoir deux fois le même email ?**
R : Non. V4 bloque tout prospect dont `outreach_attempt_count >= 3` ou `last_response_status` est `interested / meeting_booked / not_interested`. `next_action_at` est mis à J+7 après chaque envoi.

**Q : Que se passe-t-il si l'email rebondit ?**
R : Configurer un webhook Resend → n8n pour mettre `last_response_status = 'bounced'` et `do_not_contact = true` automatiquement.

**Q : Comment mettre un prospect en pause ?**
R : Dans Supabase → `prospect_targets` → mettre `paused = true` sur la ligne concernée. V4 ignorera ce prospect jusqu'à remise à `false`.
