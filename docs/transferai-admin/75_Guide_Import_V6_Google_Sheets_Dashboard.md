# V6 MVP - Guide d'import et de configuration

## Fichier exportable
- `docs/transferai-admin/75_n8n_Post_Audit_V6_Google_Sheets_Dashboard_Exportable.json`

## Ce que contient l'export
Cet export est une version du workflow post-audit V2 deja enrichie avec V6 :
- `Build V6 Dashboard Row`
- `Sync Google Sheets Dashboard`
- `If Expert Notification Enabled`
- `Send Expert Notification`
- `Build V6 Summary`

## Pre-requis
1. Creer un Google Sheet nomme `TransferAI - Audit Responses Dashboard`
2. Creer un onglet `responses_dashboard`
3. Ajouter en ligne 1 les colonnes suivantes :

```text
response_id | pack_id | submitted_at | organization_name | decision_maker_name | target_email | sector_guess | maturity_level | recommended_offer | completion_percentage | assigned_expert_email | workflow_status | next_action_at | booking_link | follow_up_status | commercial_notes
```

4. Creer le credential n8n : `Google Sheets TransferAI`
5. Verifier que `RESEND_API_KEY` est disponible dans l'environnement n8n

## Placeholders a remplacer apres import
### Nœud `Sync Google Sheets Dashboard`
- `documentId.value` : remplacer `REPLACE_WITH_GOOGLE_SHEET_ID` par l'ID du fichier Google Sheet
- attacher le credential Google Sheets OAuth2 approprie

### Nœud `Send Expert Notification`
- remplacer `REPLACE_WITH_GOOGLE_SHEET_ID` dans le lien Google Sheets du corps email
- verifier que l'expediteur `TransferAI <contact@transferai.ci>` est valide dans Resend

## Comportement
- V6 se declenche apres `Build Post-Audit Result`
- une ligne est ajoutee ou mise a jour dans Google Sheets a partir de `response_id`
- si `completion_percentage >= 80`, un email est envoye a l'expert assigne
- la sortie finale est `Build V6 Summary`

## Verification apres import
1. Importer le workflow JSON dans n8n
2. Ouvrir `Sync Google Sheets Dashboard`
3. Selectionner le credential Google Sheets
4. Verifier l'ID du document et le nom d'onglet
5. Ouvrir `Send Expert Notification`
6. Remplacer l'ID du Google Sheet dans le lien de l'email
7. Lancer un test post-audit reel ou manuel
8. Verifier :
   - la ligne apparait dans `responses_dashboard`
   - l'email expert part si completion >= 80
   - `Build V6 Summary` renvoie `status = v6_sync_completed`
