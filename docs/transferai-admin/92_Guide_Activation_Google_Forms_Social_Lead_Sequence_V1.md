# Guide d’activation - Google Forms Social Lead Sequence V1

## Ce que vous faites maintenant

1. Importer le workflow [91_n8n_Google_Forms_Social_Lead_Sequence_V1_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/91_n8n_Google_Forms_Social_Lead_Sequence_V1_Exportable.json) dans n8n.
2. Vérifier les variables d’environnement :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `OUTREACH_FROM_EMAIL`
   - `BOOKING_LINK_45MIN`
3. Brancher vos Google Forms vers le webhook `google-forms-social-leads`.
4. Faire un test avec un faux lead du formulaire `assistant_training_interest`.
5. Faire un test avec un faux lead du formulaire `enterprise_ai_interest`.
6. Vérifier dans Supabase :
   - table `prospect_targets`
   - table `outreach_attempts`
7. Activer ensuite le workflow.

## Rôle du workflow

Ce workflow gère :

- l’entrée des leads issus de Google Forms
- la normalisation des réponses
- le scoring léger `hot / warm / cool`
- la décision d’autoriser ou non le 3e email
- l’envoi immédiat du 1er email
- la relance automatique du 2e email
- la relance automatique du 3e email si autorisée
- la mise à jour CRM dans `prospect_targets`
- la journalisation des emails dans `outreach_attempts`

## Deux formulaires couverts

### 1. Formation secrétaires / assistants

Le workflow détecte ce formulaire comme :

- `form_type = assistant_training_interest`

Il adapte le contenu des emails selon :

- les tâches choisies
- le besoin principal
- l’intérêt pour participer au lancement

### 2. IA entreprise Côte d’Ivoire

Le workflow détecte ce formulaire comme :

- `form_type = enterprise_ai_interest`

Il adapte le contenu des emails selon :

- le niveau d’usage actuel de l’IA
- les domaines d’intérêt
- la perception du niveau de sécurité
- le souhait d’être recontacté

## Règles métier intégrées

- si le prospect a laissé un email et reste réengageable, le 1er email part immédiatement
- le 2e email part automatiquement après le délai configuré
- le 3e email ne part que si `allow_third_email = true`
- si le prospect exprime un non clair ou un “pas pour le moment”, la séquence s’arrête
- si l’envoi échoue, le prospect passe en `paused`

## Délai par défaut

- email 1 : immédiat
- email 2 : `J+4`
- email 3 : `J+7` après le 2e email

Ces délais sont pilotés par :

- `follow_up_delay_1_days`
- `follow_up_delay_2_days`

## Important sur Google Forms

Google Forms n’envoie pas nativement un POST direct vers n8n.

En pratique, vous avez 2 options propres :

1. connecter le formulaire à Google Sheets puis pousser la ligne vers n8n
2. utiliser un Google Apps Script sur soumission de formulaire pour appeler le webhook n8n

## Résultat attendu

Quand tout est branché correctement :

- un nouveau lead entre dans `prospect_targets`
- le 1er email est envoyé
- une ligne est créée dans `outreach_attempts`
- `next_action_at` est positionné pour la relance
- le scheduler prend ensuite le relais pour email 2 puis email 3
