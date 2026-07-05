# Session 03 juillet 2026 — Revamp Programme, remplacement PDF prod, re-test V9 + Email 2/3

## Contexte

Le docx `Programme_Formation_IA_Appliquee_Votre_Metier_Session_29_30_juillet_2026.docx` (source du PDF joint à l'Email 2) avait dérivé du contenu réellement utilisé dans les workflows n8n V9 et Email2/3 (voir [117](./117_n8n_Formation_Email2_Email3_Sequence_Validation_Humaine_01juillet2026.json), [127](./127_6_Cas_Usage_IA_Secteur_Par_Secteur_2026-07-03.docx)-[129](./129_Note_Interne_6_Cas_Usage_Commerciaux_2026-07-03.docx)) : il ne listait que 5 des 6 cas d'usage démontrables, n'avait pas la section différenciateurs, pas les livrables organisationnels, et ne mentionnait qu'une session sur les deux.

## Travail effectué

1. **Revamp du docx Programme** — fusion de 3 sources : l'ancien docx, `Positionnement_Differenciation_TransferAI_Premium.docx`, et le contenu réel codé en dur dans les nœuds n8n (`pickCasUsage()` de V9 et Email2/3). Résultat : [130_Programme_Formation_IA_au_Bureau_REVAMP_2026-07-03.docx](./130_Programme_Formation_IA_au_Bureau_REVAMP_2026-07-03.docx).
   - Ajout du 6ᵉ cas d'usage (Dossier crédit/KYC + veille BCEAO-UEMOA, secteur banque/finance/comptabilité).
   - Ajout de la section "Ce qui nous différencie" (6 items).
   - Ajout des 6 livrables organisationnels, en plus des 6 livrables individuels déjà présents.
   - Ajout de la Session 2 (10-11 août 2026) dans l'en-tête.
   - Restructuration de "Public concerné" en 3 blocs alignés sur la logique réelle de segmentation des emails (transversal / banque-finance-comptabilité / diplomatie-institutions).
   - Ajout d'un pied de page contact (WhatsApp, formulaire, Calendly formation) — volontairement sans le lien "Audit IA Gratuit", pour respecter la règle déjà codée dans le prompt du nœud `RAG - Générer Accroche...` (l'audit gratuit est un argumentaire distinct de la formation).
2. **Installation de LibreOffice** (`brew install --cask libreoffice`) sur la machine locale, absente jusque-là — nécessaire pour convertir le docx en PDF.
3. **Conversion et remplacement du PDF de production** — [131_Programme_Formation_IA_au_Bureau_REVAMP_2026-07-03.pdf](./131_Programme_Formation_IA_au_Bureau_REVAMP_2026-07-03.pdf) uploadé à la place de l'ancien fichier dans le bucket Supabase Storage `prospecting-artifacts/formation/programme_formation_ia_2026.pdf` (c'est ce fichier, référencé par une URL statique codée en dur dans le nœud `Send Email2 To Prospect`, qui est réellement joint à l'Email 2 envoyé aux prospects). Ancien PDF sauvegardé en local avant écrasement (7,3 Ko, dates "30-31 juillet" et lieu "Cocody" confirmés obsolètes). Nouveau PDF : 603 Ko, vérifié par re-téléchargement + `pdftotext` après upload.
4. **Re-test bout-en-bout V9 + Email2/3** sur les 3 branches sectorielles, avec des prospects de test préfixés `ZZZ-TEST-...-RETEST` (email cible : `marius.ayoro70@gmail.com`), pour confirmer l'absence de régression après le revamp :

| Secteur | V9 (exécution) | Cas d'usage détecté | Email2 | Email3 |
|---|---|---|---|---|
| Banque (B2B, 3 pers.) | 10787 success | Dossier crédit/KYC BCEAO-UEMOA | 10790 success | 10794 success |
| Diplomatie (Individuel) | 10788 success | Traduction bilingue | 10791 success | 10795 success |
| Générique (B2B, 4 pers.) | 10789 success | Courrier automatique | 10792 success | 10796 success |

Pipeline de statut confirmé de bout en bout : `formation_interest` → `email2_sent` → `email3_sent`. Les 9 emails ont été acceptés par Resend (id retourné à chaque envoi). Lignes de test nettoyées ensuite dans `prospect_targets` (voir [133](./133_Guide_Troubleshooting_Campagne_Formation_Programme_RAG_03juillet2026.md) section 5 pour la méthode).

## Constat additionnel (non corrigé dans cette session, documenté dans le guide troubleshooting)

La table Supabase `documents` (base RAG utilisée par le nœud `RAG - Générer Accroche...` des workflows V9/Email2/3, ainsi que par l'agent `V10.1 Agent IA Support KB`) contient des différenciateurs dupliqués sous deux formats de titre différents, et le filtre RAG (`/^Differenciateur — /`) ne peut en retrouver que 4 sur les 6 réellement utilisés côté emails/docx. Voir [133_Guide_Troubleshooting_Campagne_Formation_Programme_RAG_03juillet2026.md](./133_Guide_Troubleshooting_Campagne_Formation_Programme_RAG_03juillet2026.md), section 6.

## État des 4 sources de contenu formation après cette session

| Source | État au 03/07/2026 |
|---|---|
| Corps HTML des nœuds n8n (V9, Email2/3) | À jour (6 cas d'usage, 6 différenciateurs, dates/lieu corrects) |
| Docx Programme (`130_...docx`) | À jour, revampé cette session |
| PDF joint à l'Email 2 (bucket Supabase Storage) | À jour, remplacé cette session |
| Table RAG `documents` (accroche + agent V10.1) | **Partiellement obsolète** — voir guide troubleshooting section 6 |
