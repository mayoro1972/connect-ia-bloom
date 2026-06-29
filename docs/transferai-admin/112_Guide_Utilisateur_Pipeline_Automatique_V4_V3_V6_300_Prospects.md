# Guide Utilisateur — Pipeline Automatique V4 → V3 → V6
## 300 sociétés · 5 envois/jour · Zéro intervention humaine
**TransferAI Africa — Mis à jour le 30 juin 2026**

> **Statut au 30 juin 2026 :** Pipeline V4 → V3 → V6 entièrement opérationnel et validé de bout en bout. V4 et V6 activés. Formulaire de révision amélioré : aperçu rendu de la lettre + liens PDF/PPTX corrigés.

---

## 1. Vue d'ensemble

Ce guide décrit le pipeline de prospection **entièrement automatique**, du chargement des prospects jusqu'au déclenchement de V6 après soumission du formulaire d'audit.

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
  → génère le deck de présentation PPTX (9 slides) + convertit en PDF via LibreOffice
  → upload PDF + PPTX dans Supabase Storage (bucket prospect-decks)
  → envoie email de validation interne (4 boutons : Approuver, Réviser, Régénérer, Rejeter)
  → attend décision de l'administrateur
  → si Approuvé : envoie email au prospect avec pièces jointes

Toutes les 30 min — V6
  → SELECT form_responses WHERE completion >= 80% AND processed = false
  → récupère les données du pack via ai_prospecting_packs
  → génère fiche pré-RDV + brief interne expert
  → envoie 2 emails : [PRIORITÉ HAUTE] notification + fiche complète
  → marque processed = true
```

### Ce que reçoit chaque prospect

| Pièce jointe | Format | Générateur |
|---|---|---|
| Lettre executive personnalisée | Corps HTML de l'email | GPT + n8n |
| Mini-catalogue formations ciblées | PDF natif premium | `mini_catalogue_cli.py` + ReportLab |
| Deck de présentation TransferAI | PPTX (9 slides) + PDF | `deck_generator_cli.py` + LibreOffice |

### Ce que reçoit l'administrateur après soumission formulaire

| Email | Contenu |
|---|---|
| [PRIORITÉ HAUTE] Nouveau dossier post-audit | Organisation, contact, secteur, maturité IA, service recommandé, Pack ID |
| Fiche pré-RDV post-audit | Fiche complète : identification, synthèse exécutive, maturité IA, outils existants, contexte métier, recommandations |

---

## 2. État des corrections et activations au 29 juin 2026

### 2.1 Corrections appliquées ✅ (sessions 28-30 juin)

| Correction | Description | Statut |
|---|---|---|
| Set Target : tous champs en expressions | Suppression des valeurs hardcodées (Orange CI) — tous les champs lisent depuis `$json` | ✅ Fait |
| Build Approval Email : 4 boutons | Ajout boutons Réviser et Régénérer (en plus d'Approuver et Rejeter) | ✅ Fait |
| Build Approval Email : URLs PDF/PPTX | Correction chemin `catalogue_artifact.pdf_url` et `deck_artifact.pdf_url` | ✅ Fait |
| pack_id dans lettre executive | Post-traitement regex sur `executiveLetterHtml` pour injecter le `pack_id` réel | ✅ Fait |
| Webhook Révision (GET) | Nouveau webhook `revision-prospect-pack-v3` — affiche formulaire HTML de révision dans n8n | ✅ Fait |
| Webhook Régénérer (GET) | Nouveau webhook `regenerate-prospect-pack-v3` — relance V3 depuis Set Target | ✅ Fait |
| Webhook Soumission Révision (POST) | Nouveau webhook `submit-revision-pack-v3` — met à jour le pack puis renvoie email validation | ✅ Fait |
| LibreOffice installé sur VPS | Version 24.2.7.2 — permet conversion PPTX → PDF automatique | ✅ Fait |
| V6 : condition `If Candidate Response Found` | Conditions vides corrigées → `no_candidate_found` is equal to `false` | ✅ Fait |
| Supabase : colonnes `form_responses` | Ajout colonne `processed BOOLEAN DEFAULT false` | ✅ Fait |
| Supabase : colonnes `prospect_targets` | Ajout `delivery_status TEXT` et `last_pack_id TEXT` | ✅ Fait |
| V4 activé | Toggle ON dans n8n | ✅ Fait |
| V6 activé (schedule 30 min) | Toggle ON dans n8n | ✅ Fait |
| Post-Audit V2 désactivé | Évite conflit avec V6 | ✅ Fait |
| **Formulaire révision : URLs PDF/PPTX** | Lecture depuis `catalogue_artifact.pdf_url` / `deck_artifact.pdf_url` (structure imbriquée) | ✅ Fait (30 juin) |
| **Formulaire révision : lettre rendue** | Onglet Prévisualisation affiche la lettre rendue HTML + onglet Modifier le HTML pour édition | ✅ Fait (30 juin) |

### 2.2 Validations end-to-end ✅

| Test | Résultat |
|---|---|
| V3 exécuté manuellement | Email de validation reçu avec 4 boutons fonctionnels |
| Liens PDF/PPTX dans email validation | Visibles et accessibles (corrigé après session) |
| Lien Calendly dans lettre | Accessible |
| Formulaire d'audit soumis | Données stockées dans `form_responses` |
| V6 déclenché (22:45 le 29/06) | Succès en 17.6s — pipeline complet traversé |
| Email [PRIORITÉ HAUTE] reçu | Organisation, secteur, maturité IA, pack_id présents |
| Fiche pré-RDV reçue | Identification complète, synthèse exécutive, maturité IA, outils, contexte |

### 2.3 Actions restantes 🔴

| Action | Priorité |
|---|---|
| Fix frontend React (transferai.ci) : sauvegarder `pack_id` dans `form_responses` à la soumission | 🔴 Urgent |
| Fix quota `outreach_attempts` : V3 doit écrire après approbation pour que V4 compte correctement | 🔴 Important |
| Fix `active_niche_list_csv` dans V4 : élargir au-delà de `assistant_direction_documentaire` | ⚠️ À faire |
| Importer les prospects dans `prospect_targets` pour le batch automatique | ⚠️ Avant activation complète |

---

## 3. Workflow de validation interne (4 boutons)

Après génération du pack par V3, l'administrateur reçoit un email de validation avec 4 actions :

### Bouton 1 — Approuver ✅
- URL : `webhook/approve-prospect-pack-v3?pack_id=XXX&decision=approved`
- Action : récupère le pack, construit le contexte d'envoi, envoie l'email au prospect
- Résultat : pack passé à `status = 'approved'`, email prospect envoyé avec PDF + PPTX

### Bouton 2 — Réviser ✏️
- URL : `webhook/revision-prospect-pack-v3?pack_id=XXX`
- Action : affiche un formulaire HTML dans le navigateur avec :
  - **Section Documents actuels** : liens PDF mini-catalogue, PDF deck, PPTX deck avec badge ✓ vert (disponible) ou ✗ rouge (absent)
  - **Onglet Prévisualisation** (par défaut) : lettre executive **rendue** comme dans l'email, avec mise en forme
  - **Onglet Modifier le HTML** : textarea pour éditer le code HTML brut (mise à jour de la prévisualisation en temps réel)
  - **Upload PDF** : possibilité de remplacer le mini-catalogue ou le deck
- L'administrateur corrige les textes, clique "Soumettre les corrections → Nouvel email de validation"
- Résultat : pack mis à jour dans Supabase, nouvel email de validation envoyé

### Bouton 3 — Régénérer 🔄
- URL : `webhook/regenerate-prospect-pack-v3?pack_id=XXX`
- Action : récupère les données du prospect depuis le pack, relance V3 depuis le début
- Résultat : nouveau pack généré avec nouvelle lettre, nouveau catalogue, nouveau deck

### Bouton 4 — Rejeter ❌
- URL : `webhook/approve-prospect-pack-v3?pack_id=XXX&decision=rejected`
- Action : annule le pack
- Résultat : pack passé à `status = 'rejected'`, aucun email envoyé au prospect

---

## 4. Quand se déclenchent V4 et V6 ?

### V4 — Déclenchement automatique

```
Schedule : 0 8 * * 1-5
= Chaque lundi, mardi, mercredi, jeudi et vendredi à 8h00 (heure VPS)
```

**Ce qui se passe à 8h00 :**
1. V4 lit jusqu'à 25 prospects dans `prospect_targets` (status=ready, paused=false)
2. Applique les filtres (attempts < 3, email présent, do_not_contact=false)
3. Retient les 5 premiers éligibles
4. Appelle V3 pour chacun (exécution séquentielle)
5. Écrit le log dans `outreach_attempts`

**Durée estimée :** 5 à 10 minutes pour 5 prospects (scraping + GPT + génération PDF/PPTX + email)

**Pour tester sans attendre :**
- Aller dans V4 → cliquer **Execute** manuellement

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

V6 tourne toutes les 30 min mais n'agit que si un formulaire complété est détecté :

```sql
SELECT * FROM form_responses
WHERE completion_percentage >= 80
  AND processed = false
ORDER BY submitted_at ASC
LIMIT 1
```

Puis V6 récupère les données du pack via `ai_prospecting_packs` (par `pack_id`) et la ligne prospect via `prospect_targets`.

**V6 se déclenche effectivement quand :**
1. Un prospect a reçu son pack et soumis le formulaire d'audit (≥ 80% complété)
2. `form_responses.pack_id` est renseigné (requis pour relier pack ↔ formulaire)
3. `form_responses.processed = false`
4. V6 passe dans les 30 minutes → génère et envoie la fiche pré-RDV

**Délai maximum entre soumission du formulaire et email expert : 30 minutes.**

**Point d'attention :** Le frontend React (transferai.ci) ne sauvegarde pas encore automatiquement `pack_id` dans `form_responses` à la soumission. En attendant le fix, mettre à jour manuellement :

```sql
UPDATE form_responses
SET pack_id = 'pack-XXXXXXXXXX-XXXXXXXXX'
WHERE user_email = 'email@prospect.ci'
  AND pack_id IS NULL
ORDER BY submitted_at DESC
LIMIT 1;
```

---

## 5. Prérequis infrastructure (état au 29 juin 2026)

### 5.1 Scripts VPS ✅ Déployés

```
/opt/transferai/scripts/
├── generate_mini_catalogue_pdf.py  ← layout premium ReportLab
├── mini_catalogue_cli.py           ← CLI upload Supabase
├── deck_generator_cli.py           ← deck 9 slides + conversion LibreOffice PDF
└── deck_template_transferai.py     ← template visuel
```

Dépendances installées :
- `reportlab 5.0.0`
- `python-pptx 1.0.2`
- `LibreOffice 24.2.7.2` (conversion PPTX → PDF)

### 5.2 Colonnes Supabase ✅ Ajoutées

```sql
-- Ajoutées le 29 juin 2026
ALTER TABLE form_responses
  ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT false;

ALTER TABLE prospect_targets
  ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS last_pack_id TEXT;

-- Ajoutées sessions précédentes
ALTER TABLE prospect_targets
  ADD COLUMN IF NOT EXISTS commercial_priority_tier TEXT DEFAULT 'tier2',
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS prospect_language TEXT DEFAULT 'fr',
  ADD COLUMN IF NOT EXISTS source_label TEXT;

ALTER TABLE form_invitations
  ALTER COLUMN invitee_email DROP NOT NULL;
```

### 5.3 Webhooks n8n actifs (V3)

| Webhook | Méthode | Path | Usage |
|---|---|---|---|
| Approval | GET | `approve-prospect-pack-v3` | Approuver ou Rejeter un pack |
| Revision | GET | `revision-prospect-pack-v3` | Afficher le formulaire de révision HTML |
| Submit Revision | POST | `submit-revision-pack-v3` | Soumettre les corrections |
| Regenerate | GET | `regenerate-prospect-pack-v3` | Relancer la génération du pack |

---

## 6. Renseigner l'ID de V3 dans V4

**Pourquoi :** V4 appelle V3 via `Execute Workflow`. Sans l'ID réel, V4 ne peut pas lancer V3.

**Comment trouver l'ID de V3 :**
1. Ouvrir le workflow V3 dans n8n
2. Regarder l'URL : `https://n8n-pxlk.srv1480638.hstgr.cloud/workflow/`**rQyOh7As2gQoCgvK**
3. Copier l'identifiant alphanumérique

**Où le mettre :**
- Dans V4 → nœud `Execute Prospect Workflow V3` → champ `workflowId` → expression `{{ 'rQyOh7As2gQoCgvK' }}`

---

## 7. Remplir la table `prospect_targets`

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
| `source_backend` | text | requis V4 | `supabase` |
| `custom_page_paths_csv` | text | recommandé | `/,/a-propos,/services` |

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
   'ready', 'pending', 'tier1', 'fr', 0, false, 'supabase', NOW());
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

## 9. Ce qui se passe après envoi et après formulaire

### Après envoi par V3

| Champ `prospect_targets` | Valeur après envoi |
|---|---|
| `delivery_status` | `sent` ← **clé pour V6** |
| `last_pack_id` | ID du pack envoyé |
| `outreach_attempt_count` | incrémenté de 1 |
| `next_action_at` | J+7 |

### Après soumission du formulaire par V6

| Champ | Valeur |
|---|---|
| `form_responses.processed` | `true` |
| Email [PRIORITÉ HAUTE] | Envoyé à l'administrateur |
| Fiche pré-RDV | Envoyée à l'administrateur + contact expert |

---

## 10. Suivi SQL

```sql
-- Prospects envoyés aujourd'hui
SELECT organization_name, target_email, delivery_status, last_pack_id
FROM prospect_targets
WHERE delivery_status = 'sent'
ORDER BY updated_at DESC;

-- Formulaires soumis (V6 en attente ou traité)
SELECT user_email, pack_id, completion_percentage, submitted_at, processed
FROM form_responses
WHERE completion_percentage >= 80
ORDER BY submitted_at DESC;

-- Formulaire sans pack_id (à corriger manuellement en attendant fix frontend)
SELECT id, user_email, submitted_at
FROM form_responses
WHERE pack_id IS NULL
ORDER BY submitted_at DESC;

-- Prospects restants à traiter
SELECT organization_name, commercial_priority_tier, outreach_attempt_count
FROM prospect_targets
WHERE status = 'ready'
  AND delivery_status = 'pending'
  AND do_not_contact = false
ORDER BY commercial_priority_tier ASC;

-- Quota du jour
SELECT COUNT(*) as envois_aujourd_hui
FROM outreach_attempts
WHERE sent_at >= CURRENT_DATE;
```

---

## 11. Checklist opérationnelle

### Infrastructure ✅ Fait

- [x] Scripts déployés sur VPS `/opt/transferai/scripts/`
- [x] `reportlab` + `python-pptx` + `LibreOffice 24.2.7.2` installés sur VPS
- [x] Colonnes Supabase ajoutées (`delivery_status`, `last_pack_id`, `processed`, etc.)
- [x] Bucket `prospect-decks` opérationnel (public read)
- [x] V4 activé (schedule lundi-vendredi 8h00)
- [x] V6 activé (schedule toutes les 30 min)
- [x] Post-Audit V2 désactivé (évite conflit V6)
- [x] V3 testé avec succès — email validation + 4 boutons + fiche pré-RDV

### Avant import des prospects 🔴

- [ ] **Fix frontend React** : sauvegarder `pack_id` dans `form_responses` à la soumission
- [ ] **Fix quota** : V3 doit écrire dans `outreach_attempts` après approbation
- [ ] **Fix `active_niche_list_csv`** dans V4 : élargir au-delà de `assistant_direction_documentaire`
- [ ] **Importer** les prospects dans `prospect_targets` (status=ready, delivery_status=pending)

### Test de validation complet

- [ ] V3 lancé manuellement → email validation reçu avec 4 boutons
- [ ] Vérifier PDF mini-catalogue et PPTX deck visibles dans l'email
- [ ] Cliquer "Approuver" → email envoyé au prospect avec pièces jointes
- [ ] Cliquer le lien formulaire d'audit → s'ouvre sans erreur
- [ ] Soumettre le formulaire → V6 déclenché dans les 30 min
- [ ] Email [PRIORITÉ HAUTE] + Fiche pré-RDV reçus

---

## 12. FAQ

**Q : Quand V4 se déclenchera-t-il pour la première fois ?**
R : Le prochain jour ouvré (lundi-vendredi) à 8h00. V4 est déjà activé.

**Q : Peut-on lancer V3 manuellement en parallèle du mode automatique ?**
R : Oui. Le nœud `Upsert Prospect In CRM` crée ou met à jour la ligne automatiquement. Les deux modes coexistent.

**Q : V6 peut-il traiter un prospect dont `pack_id` est NULL dans `form_responses` ?**
R : Non. V6 a besoin du `pack_id` dans `form_responses` pour relier le formulaire au pack. En attendant le fix frontend, faire la mise à jour SQL manuellement.

**Q : Que se passe-t-il si V3 échoue pour un prospect ?**
R : V4 logue l'erreur dans `Log Processed Batch Item`. Le prospect reste à `status = 'ready'` et sera retenté le lendemain (jusqu'à `max_attempts = 3`).

**Q : Un prospect peut-il recevoir deux fois le même email ?**
R : Non. V4 bloque tout prospect dont `outreach_attempt_count >= 3` ou `last_response_status` est `interested / meeting_booked / not_interested`. `next_action_at` est mis à J+7 après chaque envoi.

**Q : Que se passe-t-il si on clique "Réviser" ?**
R : Un formulaire HTML s'ouvre dans le navigateur avec les textes du pack éditables. Après correction et soumission, le pack est mis à jour dans Supabase et un nouvel email de validation est envoyé automatiquement.

**Q : Comment mettre un prospect en pause ?**
R : Dans Supabase → `prospect_targets` → mettre `paused = true`. V4 ignorera ce prospect jusqu'à remise à `false`.

**Q : Le deck est-il disponible en PDF pour l'envoi au prospect ?**
R : Oui. LibreOffice convertit automatiquement le PPTX en PDF sur le VPS. L'administrateur reçoit le lien PPTX (pour modifications) et le PDF est joint à l'email prospect.

---

*Document mis à jour le 29 juin 2026 — Sessions du 28 et 29 juin 2026*
