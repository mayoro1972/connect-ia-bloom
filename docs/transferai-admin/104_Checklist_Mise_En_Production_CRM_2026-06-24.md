# Checklist mise en production — Chaîne CRM Prospecting
**Date :** 2026-06-24  
**Objectif :** Premier test end-to-end V5 → V4 → V3 avec 1 prospect réel

---

## PRIORITÉ 1 — Débloquer la chaîne CRM

### Étape 1 — Créer les tables Supabase manquantes
> Supabase → SQL Editor → coller et exécuter `103_SQL_Tables_Manquantes_CRM_Prospecting.sql`

- [ ] Table `outreach_attempts` créée
- [ ] Table `prospecting_batch_runs` créée  
- [ ] Table `prospecting_batch_run_items` créée
- [ ] Table `zoho_inbound_messages` créée (pour Priorité 4)

---

### Étape 2 — Importer V89 (Follow-Up) dans n8n
> n8n → Workflows → **Import from file**  
> Fichier : `89_n8n_Prospection_CRM_Follow_Up_V1_Exportable.json`

- [ ] Workflow importé
- [ ] ID noté : `N8N_CHILD_WORKFLOW_ID_FOLLOW_UP = ___________`
- [ ] Credentials branchées dans chaque nœud HTTP (Supabase + Resend)

---

### Étape 3 — Importer V3 (Premier contact) dans n8n
> n8n → Workflows → **Import from file**  
> Fichier : `73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json`

- [ ] Workflow importé
- [ ] ID noté : `N8N_CHILD_WORKFLOW_ID_V3 = ___________`
- [ ] Credentials branchées

---

### Étape 4 — Configurer les variables d'environnement n8n

> n8n self-hosted : éditer le fichier `.env` ou passer par Settings → Environment Variables

```
RESEND_API_KEY=re_xxxx
OPENAI_API_KEY=sk-xxxx
SUPABASE_URL=https://wlhznciwuofueffyoflo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaHpuY2l3dW9mdWVmZnlvZmxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg4NDAwOSwiZXhwIjoyMDkwNDYwMDA5fQ.sr3Mez8zvmRbVGJ5yH7atEVcAqSZwuMsPwekj8oWxp4
BOOKING_LINK_45MIN=https://calendly.com/xxxx
N8N_CHILD_WORKFLOW_ID_V3=<valeur de l'étape 3>
N8N_CHILD_WORKFLOW_ID_FOLLOW_UP=<valeur de l'étape 2>
```

- [ ] RESEND_API_KEY renseignée
- [ ] OPENAI_API_KEY renseignée
- [ ] SUPABASE_URL renseignée (déjà hardcodée dans V3, idéalement en variable)
- [ ] SUPABASE_SERVICE_ROLE_KEY renseignée
- [ ] BOOKING_LINK_45MIN renseignée
- [ ] N8N_CHILD_WORKFLOW_ID_V3 renseignée
- [ ] N8N_CHILD_WORKFLOW_ID_FOLLOW_UP renseignée

---

### Étape 5 — Vérifier V4 (Orchestrateur) dans n8n
> V4 = `66_n8n_Prospection_CRM_V4_Exportable.json`  
> Ce workflow doit déjà être importé (il était listé comme ✅ créé — vérifier qu'il est bien présent)

- [ ] V4 visible dans n8n
- [ ] Nœud "Execute Prospect Workflow V3" → les deux IDs sont bien résolus via les variables d'env
- [ ] Cron déclencher configuré (ex: tous les jours à 9h00)

---

### Étape 6 — Test end-to-end avec 1 prospect réel

1. Vérifier qu'un prospect existe dans `prospect_targets` avec :
   - `target_email` renseigné
   - `outreach_attempt_count = 0`
   - `confidence_score >= 0.45`
   - `status = 'active'` ou équivalent

2. Déclencher V4 manuellement (bouton "Execute" dans n8n)

- [ ] V4 démarre → `prospecting_batch_runs` reçoit 1 ligne avec `status = 'started'`
- [ ] V4 récupère le prospect → `prospecting_batch_run_items` reçoit 1 ligne
- [ ] V3 est appelé → email généré par OpenAI
- [ ] Email envoyé via Resend → `outreach_attempts` reçoit 1 ligne avec `delivery_status = 'submitted'`
- [ ] `prospect_targets.outreach_attempt_count` incrémenté à 1
- [ ] `prospecting_batch_runs.status` passé à `'completed'`
- [ ] Email reçu dans la boîte du prospect de test ✅

---

## PRIORITÉ 2 — Alimentation CRM (V5)

- [ ] Définir la source de leads : URL CSV publique ou webhook scraping
  - Variable à renseigner : `SCRAPED_PUBLIC_LEADS_CSV_URL`
- [ ] Renseigner `N8N_CHILD_WORKFLOW_ID_V4` dans V5
- [ ] Configurer le cron journalier V5 dans n8n (ex: 8h00, avant V4 à 9h00)

---

## PRIORITÉ 3 — Connexion Google Forms ↔ CRM

- [ ] Modifier le Google Apps Script du workflow 93 pour, en plus de l'email Resend actuel,
  appeler un webhook V5 ou insérer directement dans `prospect_targets` avec le bon scoring
- [ ] Tester : soumettre un formulaire → prospect visible dans Supabase → V4 le traite au prochain batch

---

## PRIORITÉ 4 — Dashboard et suivi

- [ ] Créer le Google Sheets de destination pour V6
  - Onglets suggérés : `prospects`, `outreach_attempts`, `batch_runs`
  - Renseigner l'ID dans V6
- [ ] Activer le cron V6 (ex: 10h00 quotidien)
- [ ] Créer l'onglet "Emails entrants" dans le back-office (Zoho inbound)
  - Basé sur la table `zoho_inbound_messages` créée à l'étape 1

---

## À archiver

- [ ] V1 (`42_n8n_Prospection_Modele_Elton_V1.json`) → déplacer vers `_archives/`
- [ ] V2 (`43_n8n_Prospection_Modele_Elton_V2_Supabase_Approval_Email.json`) → déplacer vers `_archives/`
