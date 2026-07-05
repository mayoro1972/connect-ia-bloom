# Analyse coût token IA & modèle de facturation — CR_Reunion_Automatique_V3 / PII_Guard_Anonymisation

**Date :** 2026-07-05
**Usage :** document interne — NE PAS déposer dans les 8 dossiers Drive surveillés par le RAG customer-facing (`Ingestion_Documents_Drive_Recursif`), car il contient des coûts réels et des taux de marge non publics. Voir mémoire `project_transferai_rag_ingestion.md` (§ absence de filtrage par confidentialité).

## 1. Profil de coût des deux workflows

- **PII_Guard_Anonymisation** : 100% regex/JS local (nœuds `pii-003`/`pii-004`), aucun appel API externe. Coût IA variable = **0 $**. Argument de vente (conformité PII) sans surcoût technique.
- **CR_Reunion_Automatique_V3_Validation** : deux appels facturés à l'usage — Whisper (`whisper-1`) pour la transcription, GPT-4o pour la génération du compte rendu structuré (+ régénération optionnelle via webhook `cr-regenerer`).

## 2. Tarifs OpenAI (vérifiés juillet 2026)

- Whisper-1 : $0,006 / minute
- GPT-4o : $2,50 / 1M tokens input · $10,00 / 1M tokens output

## 3. Coût réel — réunion type de 60 minutes

| Poste | Détail | Coût |
|---|---|---|
| Whisper | 60 min × $0,006 | $0,36 |
| GPT-4o input | ~13 000 tokens (transcript FR + prompt système) | $0,033 |
| GPT-4o output | ~800 tokens (JSON structuré) | $0,008 |
| Resend (2 emails) | négligeable (< 3000/mois gratuit) | ~0 |
| **Total / réunion (1h)** | | **≈ $0,40 (≈ 240 FCFA)** |

Taux tout compris : ≈ $0,007/minute (Whisper = ~90% du coût, GPT-4o = ~10%). Une régénération ajoute ~$0,04.

Taux de change utilisé : ≈ 600 FCFA / $1 (indicatif, à revérifier avant contractualisation).

## 4. Modèle de facturation recommandé

Coût API dérisoire face à la valeur perçue (temps assistant/secrétaire économisé) → **value-based pricing**, pas de facturation token à la transparence vis-à-vis du client.

### Grille à paliers (interne — ne pas diffuser telle quelle)

| Palier | Volume | Prix suggéré | Coût interne max | Marge brute |
|---|---|---|---|---|
| Starter | 15 CR/mois (≤1h) | 35 000 FCFA/mois (~58 $) | ~3 600 FCFA | ~90% |
| Business | 60 CR/mois | 120 000 FCFA/mois (~200 $) | ~14 400 FCFA | ~88% |
| Enterprise | Illimité + PII Guard + SLA/support dédié | à partir de 300 000 FCFA/mois, sur devis | variable | forte marge |

Alternative pay-per-use (client faible volume) : 2 500–4 000 FCFA / CR validé (≈10-15× le coût réel).

**PII Guard** : coût marginal nul → module de conformité inclus en Business/Enterprise, ou add-on payant (+15 000 FCFA/mois) — pure marge. Les patterns détectés (CNI, PASSEPORT, RÉF_DIPLOMATIQUE) suggèrent un ciblage institutionnel/diplomatique où l'argument compliance justifie un prix premium.

### À prévoir dans le prix final

- Coûts fixes à amortir : VPS Hostinger n8n, service de découpage audio, maintenance/support
- Marge de sécurité pour réunions > 60 min et usage de la régénération
- Validation des hypothèses après 1-2 mois d'usage live (dashboard OpenAI + logs n8n) avant de verrouiller un contrat

## 5. Point de sécurité relevé pendant l'analyse

Le nœud `n-email-valid` / `n-send-final` du workflow `CR_Reunion_Automatique_V3` contient une clé API Resend **en clair** dans le JSON (`Bearer re_9CWoT2CU_...`) au lieu d'utiliser le credential store n8n comme pour OpenAI/Google Drive. À révoquer et régénérer côté Resend, puis migrer en credential n8n avant tout partage externe de ce fichier workflow.
