# Session 01 juillet 2026 — Pipeline Formation complet & Agent IA V10.1

## Workflows créés et déployés

### Email 2+3 Séquence Validation Humaine (n8n ID: uvaRGbCUebRVkyc4)
- **Rôle** : Outbound — envoi programme PDF J+1, relance urgente J+4
- **Déclencheur** : Schedule 9h quotidien
- **Email 2** : programme PDF en pièce jointe + corps personnalisé → validation Marius avant envoi
- **Email 3** : relance urgente "places limitées" → validation Marius avant envoi
- **Webhooks** : `formation-email2-approve`, `formation-email3-approve`
- **Fix appliqué** : suppression filtre `niche_status` + correction colonne date Email 3 (`updated_at`)

### V10.1 Agent IA Support KB Complet (n8n ID: JkCqjRvZruXC1SUa)
- **Rôle** : Inbound — répond automatiquement aux emails entrants formation + tous services
- **Base de connaissance** : identité TransferAI, formation juillet-août 2026, audit IA, accompagnement, solutions LLM, FAQ, processus post-inscription
- **Tarifs dégressifs** : 1 à 10+ personnes
- **Escalade** : négociation prix, contrats, réclamations → alerte Marius
- **Remplace** : V10 original (WBhLUarZPXocFU2j) — désactivé
- **Connexion** : Zoho Reply Intelligence V1 → webhook `transferai-agent-formation-suivi` (déjà câblé)

## Tests validés
- ✅ Test batch V3 → execution #9687 — lettre formation générée + email validation reçu (Resend 9b74ceaf)
- ✅ Test Email 2 + PDF pièce jointe — envoyé à marius.ayoro70@gmail.com (Resend e2f887a6)
- ✅ Email 2+3 filtres corrigés — tous secteurs formation couverts
- ✅ V10.1 activé — V10 original désactivé — pas de conflit webhook

## État production au 01/07/2026 — Workflows actifs
| ID | Nom | Rôle |
|---|---|---|
| rt3PXnUnnOPB2ioJ | V9 Google Forms Webhook | Capture inscriptions formulaire |
| uvaRGbCUebRVkyc4 | Email 2+3 Séquence | Programme PDF + relance validés |
| SEf9Qhy5XoQQuUPe | Batch Scheduler 30/jour | Cold emails formation 9h quotidien |
| a36akMTSfar1gRHQ | Zoho Reply Intelligence V1 | Lecture emails entrants 15min |
| JkCqjRvZruXC1SUa | V10.1 Agent KB Complet | Réponse IA automatique tous services |
| rQyOh7As2gQoCgvK | V3 FINAL-MERGED | Génération packs + lettres formation |
| artMSEypvgBIDR58 | V4 Batch Orchestrator | Orchestration quotidienne prospects |
| 7FHFh0s2Hd0enJ4n | V6 Post-Audit Expert Routing | Routing expert post-formulaire audit |
| 8nvZg1PDZbrb7INd | V8 Enrichissement | Enrichissement quotidien base CI |
| bj3LCWDBsKIpMayF | V3 Follow-Up Sequence | Relances J+1/J+3/J+7 |
| CQXEKhMUV8JFrMjp | Calendly Webhook | Mise à jour CRM à chaque RDV |
| cZ0skpfrDn7jATw1 | Chatwoot V5.5.2 | Chat web → réponse IA |
