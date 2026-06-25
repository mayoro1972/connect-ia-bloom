# Guide Utilisateur - Workflow Google Forms Prospects Ameliore

Workflow de reference :

- `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`
- Fichier : [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)

Date de mise a jour :

- `20 juin 2026`

## 1. Objet du guide

Ce guide explique comment utiliser le workflow Google Forms prospects ameliore de TransferAI.

Il couvre :

- la reception d'un prospect depuis Google Forms
- l'envoi automatique du premier email au prospect
- la creation ou mise a jour du prospect dans le CRM
- la notification interne admin
- les relances automatiques email 2 puis email 3
- les verifications a faire dans n8n apres chaque test ou en production

Ce guide est pense pour une utilisation operationnelle, sans devoir relire le workflow n8n noeud par noeud a chaque fois.

## 2. Ce que fait le workflow

Le workflow gere la chaine suivante :

1. un prospect remplit un Google Form
2. Google Sheets recoit la reponse
3. Google Apps Script pousse la reponse vers n8n
4. n8n normalise les reponses
5. n8n cree ou met a jour le prospect dans `prospect_targets`
6. n8n envoie le premier email au prospect
7. n8n journalise l'envoi dans `outreach_attempts`
8. n8n envoie une alerte interne a `contact@transferai.ci`
9. n8n prepare la relance automatique
10. le scheduler reprend ensuite la main pour email 2 puis email 3

## 3. Formulaires couverts

Le workflow reconnait actuellement deux grands cas :

### 3.1 Formation secretaires / assistants

Le type detecte est :

- `assistant_training_interest`

Ce cas sert a traiter les prospects qui manifestent un interet pour la formation IA destinee au secretariat, a l'assistanat et aux assistants de direction.

### 3.2 IA entreprise

Le type detecte est :

- `enterprise_ai_interest`

Ce cas sert a traiter les prospects entreprise qui demandent des services, solutions ou usages IA pour leur structure.

## 4. Architecture fonctionnelle simple

Le workflow a deux branches principales.

### 4.1 Branche nouvelle soumission

Flux principal :

1. `Google Forms Social Lead Webhook`
2. `Set Social Sequence Config`
3. `If New Lead Payload`
4. `Normalize Google Forms Lead`
5. `Prepare Social Prospect Record`
6. `Upsert Social Prospect Into CRM`
7. `Build Immediate Social Send Context`
8. `If Social Lead Ready To Send`
9. `Build Social Sequence Email`
10. `Send Social Sequence Email`
11. `Parse Social Send Result`
12. `If Social Email Sent`
13. `Log Social Outreach Attempt`
14. `Update Prospect After Social Send`

Branche admin en parallele depuis `Upsert Social Prospect Into CRM` :

1. `Build Admin Lead Alert Context`
2. `If Admin Alert Eligible`
3. `Build Admin Lead Alert Email`
4. `Send Admin Lead Alert`

### 4.2 Branche relances automatiques

Flux principal :

1. `Hourly Social Follow-Up Schedule`
2. `Set Social Sequence Config`
3. `If New Lead Payload`
4. `Fetch Social Prospect Snapshot`
5. `Build Due Social Follow-Ups`
6. `If Social Lead Ready To Send`
7. `Build Social Sequence Email`
8. `Send Social Sequence Email`
9. `Parse Social Send Result`
10. `If Social Email Sent`
11. `Log Social Outreach Attempt`
12. `Update Prospect After Social Send`

## 5. Prerequis pour que le workflow fonctionne

Avant exploitation, il faut verifier les points suivants.

### 5.1 Cote Google Forms / Google Sheets

- le formulaire est bien relie a une feuille Google Sheets
- la feuille recoit bien chaque nouvelle reponse
- le script Apps Script est colle dans la feuille de reponses
- le declencheur `On form submit` est bien cree cote Apps Script

### 5.2 Cote Apps Script

Le script doit pointer vers l'URL de production n8n :

```javascript
WEBHOOK_URL: 'https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-social-leads'
```

Important :

- ne pas utiliser `webhook-test` en production
- ne pas lancer `onFormSubmitToN8n()` avec le bouton `Run`
- le script doit etre declenche par une vraie soumission du formulaire

### 5.3 Cote n8n

Le workflow doit etre :

- `Published`
- correctement configure avec les cles Supabase et Resend

### 5.4 Cote email admin

Le noeud `Send Admin Lead Alert` doit envoyer vers :

- `contact@transferai.ci`

## 6. Parametres de configuration a connaitre

Le noeud `Set Social Sequence Config` porte les principaux parametres.

Valeurs actuellement attendues :

- `source_backend = manual`
- `source_label_prefix = google_forms_social`
- `booking_link_45min = https://calendly.com/contact-transferai/30min`
- `follow_up_delay_1_days = 4`
- `follow_up_delay_2_days = 7`
- `follow_up_fetch_limit = 1`
- `default_country = Côte d'Ivoire`

Signification :

- `booking_link_45min` : lien de rendez-vous propose au prospect
- `follow_up_delay_1_days` : delai avant email 2
- `follow_up_delay_2_days` : delai avant email 3
- `follow_up_fetch_limit` : nombre de prospects relus a chaque cycle scheduler

## 7. Ce que fait chaque bloc metier

### 7.1 Normalisation du lead

Le noeud `Normalize Google Forms Lead` :

- lit le `body` du webhook
- extrait `answers`
- detecte le type de formulaire
- extrait nom, email, telephone, fonction, structure
- calcule `lead_temperature`
- decide si le troisieme email est autorise
- construit `prospect_id`

Sorties principales attendues :

- `prospect_id`
- `decision_maker_name`
- `organization_name`
- `target_email`
- `phone`
- `function_label`
- `form_type`
- `lead_temperature`
- `allow_third_email`
- `can_auto_sequence`

### 7.2 Preparation CRM

Le noeud `Prepare Social Prospect Record` prepare la ligne compatible avec `prospect_targets`.

Il remplit notamment :

- `status`
- `paused`
- `niche_status`
- `stop_reason`
- `next_action_at`
- `source_payload`

### 7.3 Envoi du premier email

Le noeud `Build Immediate Social Send Context` construit le contexte d'envoi immediat.

Le noeud `Build Social Sequence Email` genere :

- le sujet
- le texte
- le HTML
- la variante du message
- la date de prochaine action

Le noeud `Send Social Sequence Email` envoie ensuite l'email via Resend.

### 7.4 Notification admin

Le noeud `Build Admin Lead Alert Context` prepare les informations utiles pour l'equipe interne :

- nom du prospect
- email
- telephone
- structure
- fonction
- priorite
- besoin principal
- taches citees
- lien de rendez-vous

Le noeud `Send Admin Lead Alert` envoie ensuite cette alerte a :

- `contact@transferai.ci`

### 7.5 Relances automatiques

Le scheduler `Hourly Social Follow-Up Schedule` tourne selon la cron du workflow.

Il lit les prospects a relancer puis :

- envoie email 2
- ou envoie email 3 si autorise
- met a jour `next_action_at`
- met a jour `last_sequence_result`

## 8. Procedure d'utilisation quotidienne

### 8.1 Verifier qu'une nouvelle soumission est bien passee

Dans n8n :

1. ouvrir `Executions`
2. regarder la derniere execution en haut de la liste
3. verifier que le statut est `Succeeded`
4. cliquer sur l'execution
5. verifier que `Google Forms Social Lead Webhook` a bien recu un `body`

### 8.2 Verifier l'email prospect

Dans l'execution :

1. cliquer sur `Send Social Sequence Email`
2. verifier qu'un `id` est renvoye en `OUTPUT`

Si un `id` est present, Resend a accepte l'envoi.

### 8.3 Verifier l'alerte admin

Dans l'execution :

1. cliquer sur `Send Admin Lead Alert`
2. verifier qu'un `id` est renvoye en `OUTPUT`

Ensuite verifier la boite :

- `contact@transferai.ci`

### 8.4 Verifier le CRM

Dans Supabase, verifier dans `prospect_targets` :

- `prospect_id`
- `target_email`
- `status`
- `paused`
- `last_sequence_result`
- `last_response_status`
- `niche_status`
- `next_action_at`

Dans `outreach_attempts`, verifier :

- `prospect_id`
- `channel = email`
- `message_variant`
- `delivery_status = submitted`
- `response_status = pending`

## 9. Procedure de test propre

### 9.1 Test formulaire reel

Le test le plus fiable est :

1. remplir le Google Form avec une vraie adresse de test
2. attendre 10 a 30 secondes
3. ouvrir `Executions` dans n8n
4. cliquer sur la nouvelle execution
5. verifier la branche email prospect
6. verifier la branche alerte admin

### 9.2 Ce qu'il ne faut pas faire

- ne pas lancer Apps Script avec `Run`
- ne pas tester la production avec `webhook-test`
- ne pas oublier de `Publish` le workflow n8n
- ne pas laisser une ancienne adresse email admin dans `Send Admin Lead Alert`

## 10. Lecture rapide des statuts

### 10.1 Cote prospect

- `status = active` : la sequence est en cours
- `paused = false` : le workflow peut continuer
- `last_response_status = pending` : pas encore de reponse du prospect
- `last_sequence_result = social_email_1_sent` : email 1 envoye
- `last_sequence_result = social_email_2_sent` : email 2 envoye
- `last_sequence_result = social_email_3_sent` : email 3 envoye

### 10.2 Cote sequence

- `niche_status = social_form_inbound` : lead recu
- `niche_status = social_sequence_active` : sequence en cours
- `niche_status = social_sequence_completed` : sequence terminee
- `niche_status = social_form_review_only` : pas d'automatisation autorisee

## 11. Cas d'usage concret

Exemple de scenario type :

1. une secretaire remplit le formulaire de formation
2. la reponse entre dans Google Sheets
3. Apps Script pousse le payload vers n8n
4. le prospect est cree dans `prospect_targets`
5. le premier email de remerciement / prise de contact est envoye
6. l'equipe TransferAI recoit une alerte interne sur `contact@transferai.ci`
7. si le prospect ne repond pas, le scheduler gere ensuite les relances

## 12. Limites actuelles a connaitre

- `follow_up_fetch_limit = 1` limite la prise en charge a un prospect a la fois par cycle scheduler
- le workflow n'integre pas encore l'arret automatique sur reponse email lue cote Zoho ou Chatwoot
- le traitement inbound humain reste a brancher dans un workflow dedie

## 13. Recommandations d'exploitation

- verifier les executions n8n chaque matin
- verifier particulierement les executions rouges du scheduler
- faire un test complet apres chaque modification d'un noeud HTTP ou Code
- conserver le lien Calendly a jour dans `Set Social Sequence Config`
- verifier regulierement que l'alerte admin part toujours vers `contact@transferai.ci`

## 14. Fichiers de reference utiles

- [92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md)
- [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)
- [97_Plan_Integration_Zoho_Inbound_BackOffice_2026-06-19.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/97_Plan_Integration_Zoho_Inbound_BackOffice_2026-06-19.md)
