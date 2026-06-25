# Guide utilisateur et troubleshooting - TransferAI Google Forms Social Lead Sequence

Workflow de référence : `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`  
Fichier workflow : `docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json`  
Guide de base utilisé : `docs/transferai-admin/92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md`  
Date de consolidation : `15 juin 2026`

## 1. Objet du document

Ce document a été rédigé pour servir de référence opérationnelle sur le workflow Google Forms social lead mis en place pour TransferAI. Il regroupe deux besoins concrets :

- un guide utilisateur pas à pas, nœud par nœud
- un guide de dépannage fondé sur les incidents réellement rencontrés pendant la construction, les tests et la stabilisation du workflow

L’objectif est simple : permettre à une personne non technique ou semi-technique de comprendre ce que fait chaque nœud, quelles variables doivent être renseignées, comment faire un test propre, comment vérifier le bon fonctionnement dans Supabase et Resend, et comment corriger rapidement les erreurs les plus probables.

## 2. Ce que fait le workflow

Le workflow gère automatiquement la chaîne suivante :

1. réception d’un lead issu d’un Google Forms
2. normalisation des réponses du formulaire
3. création ou mise à jour du prospect dans `prospect_targets`
4. préparation d’un contexte d’envoi immédiat pour le premier email
5. envoi du premier email via Resend
6. journalisation de l’envoi dans `outreach_attempts`
7. mise à jour du statut CRM du prospect
8. relances automatiques via un scheduler horaire pour l’email 2 puis l’email 3

Le workflow couvre deux familles de formulaires :

- `assistant_training_interest`
- `enterprise_ai_interest`

## 3. Vue d’ensemble de l’architecture

Le workflow est structuré en deux branches principales :

### 3.1 Branche nouvelle soumission Google Forms

Cette branche part du webhook `Google Forms Social Lead Webhook` puis passe par :

1. `Set Social Sequence Config`
2. `If New Lead Payload`
3. `Normalize Google Forms Lead`
4. `Prepare Social Prospect Record`
5. `Upsert Social Prospect Into CRM`
6. `Build Immediate Social Send Context`
7. `If Social Lead Ready To Send`
8. `Build Social Sequence Email`
9. `Send Social Sequence Email`
10. `Parse Social Send Result`
11. `If Social Email Sent`
12. `Log Social Outreach Attempt`
13. `Update Prospect After Social Send`
14. ou `Update Prospect Social Failure`

### 3.2 Branche relances automatiques

Cette branche part du scheduler `Hourly Social Follow-Up Schedule` puis passe par :

1. `Set Social Sequence Config`
2. `If New Lead Payload`
3. `Fetch Social Prospect Snapshot`
4. `Build Due Social Follow-Ups`
5. `If Social Lead Ready To Send`
6. `Build Social Sequence Email`
7. `Send Social Sequence Email`
8. `Parse Social Send Result`
9. `If Social Email Sent`
10. `Log Social Outreach Attempt`
11. `Update Prospect After Social Send`
12. ou `Update Prospect Social Failure`

## 4. Variables, secrets et valeurs de configuration

### 4.1 Secrets indispensables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

Dans la version importable stabilisée, la base Supabase est déjà inscrite en dur dans les URL HTTP. En revanche, la clé service role Supabase et la clé Resend doivent être remplacées proprement dans les nœuds HTTP.

### 4.2 Paramètres fonctionnels portés par `Set Social Sequence Config`

- `source_backend`
- `source_label_prefix`
- `booking_link_45min`
- `follow_up_delay_1_days`
- `follow_up_delay_2_days`
- `follow_up_fetch_limit`
- `default_country`

### 4.3 Valeurs par défaut actuellement utilisées

- `source_backend = manual`
- `source_label_prefix = google_forms_social`
- `booking_link_45min = https://calendly.com/contact-transferai/30min`
- `follow_up_delay_1_days = 4`
- `follow_up_delay_2_days = 7`
- `follow_up_fetch_limit = 1`
- `default_country = Côte d'Ivoire`

### 4.4 Variables métier dérivées par le workflow

- `prospect_id`
- `decision_maker_name`
- `organization_name`
- `target_email`
- `phone`
- `function_label`
- `form_title`
- `form_type`
- `lead_temperature`
- `allow_third_email`
- `can_auto_sequence`
- `q3_needs`
- `assistant_q4_training_interest`
- `assistant_q5_main_need`
- `assistant_q6_launch_interest`
- `enterprise_q2_usage`
- `enterprise_q4_security`
- `enterprise_q5_visibility`
- `enterprise_q6_recontact_interest`
- `raw_answers`
- `sequence_step`
- `message_variant`
- `next_action_at_after`
- `is_final_step`
- `resend_id`
- `sent_at`
- `send_success`
- `send_api_response`
- `last_sequence_result`
- `last_response_status`
- `stop_reason`
- `niche_status`
- `next_action_at`

### 4.5 Remplacement concret des secrets dans les nœuds HTTP

Les nœuds suivants utilisent la clé service role Supabase :

- `Fetch Social Prospect Snapshot`
- `Upsert Social Prospect Into CRM`
- `Log Social Outreach Attempt`
- `Update Prospect After Social Send`
- `Update Prospect Social Failure`

Le nœud suivant utilise la clé Resend :

- `Send Social Sequence Email`

Les en-têtes attendus sont :

- `apikey: votre_cle_service_role_supabase`
- `Authorization: Bearer votre_cle_service_role_supabase`
- `Content-Type: application/json`
- `Prefer: return=representation` ou `resolution=merge-duplicates,return=representation` selon le nœud

Pour Resend :

- `Authorization: Bearer votre_cle_resend`
- `Content-Type: application/json`

## 5. Guide utilisateur pas à pas nœud par nœud

### 5.1 `Manual Trigger`

- Type : déclencheur manuel
- Rôle : lancer un test manuel depuis l’éditeur n8n
- Quand l’utiliser : pour tester la branche scheduler ou pour rejouer le workflow sans webhook
- Résultat attendu : aucune donnée métier en entrée, mais le workflow peut démarrer si la branche aval sait construire son contexte

### 5.2 `Hourly Social Follow-Up Schedule`

- Type : scheduler
- Rôle : chercher automatiquement les prospects en attente de relance
- Réglage clé : expression cron `0 * * * 1-6`
- Signification : exécution au début de chaque heure, du lundi au samedi
- Résultat attendu : le nœud passe la main à `Set Social Sequence Config`

### 5.3 `Google Forms Social Lead Webhook`

- Type : webhook POST
- Chemin : `google-forms-social-leads`
- Rôle : recevoir les nouvelles soumissions du formulaire
- Mode de réponse : immédiat
- Résultat attendu : le webhook reçoit un `body` contenant `form_title` et `answers`

### 5.4 `Set Social Sequence Config`

- Type : `Set`
- Rôle : injecter les paramètres de fonctionnement communs à tout le workflow
- Ce que vous devez vérifier :
- `booking_link_45min`
- `follow_up_delay_1_days`
- `follow_up_delay_2_days`
- `follow_up_fetch_limit`
- `default_country`
- Résultat attendu : un item enrichi avec les variables de configuration

### 5.5 `If New Lead Payload`

- Type : `If`
- Rôle : distinguer une nouvelle soumission Google Forms d’une simple exécution du scheduler
- Condition correcte :

```text
={{Boolean($json.body || $json.form_title || $json['Nom et prénom'] || $json.email || $json['Adresse e-mail'])}}
```

- Branche `true` : on traite un nouveau lead
- Branche `false` : on va chercher les relances dues dans Supabase

### 5.6 `Fetch Social Prospect Snapshot`

- Type : `HTTP Request`
- Rôle : charger dans Supabase les prospects actifs à relancer
- Table ciblée : `prospect_targets`
- Filtres clés :
- `status in (ready, active)`
- `paused = false`
- `do_not_contact = false`
- `stop_reason is null`
- `last_response_status = pending`
- Tri : `next_action_at`, puis `updated_at`
- Résultat attendu : une liste de prospects due pour relance

### 5.7 `Build Due Social Follow-Ups`

- Type : `Code`
- Rôle : sélectionner un prospect réellement dû et déterminer `sequence_step`
- Correctif important validé après tests :
- le nœud doit lire les entrées avec `$input.all()` en mode `Run Once for All Items`
- il ne faut pas se baser sur `$json` seul quand `Fetch Social Prospect Snapshot` renvoie plusieurs items
- Logique métier :
- si `last_sequence_result` est vide, alors `sequence_step = 1`
- si `last_sequence_result = social_email_1_sent`, alors `sequence_step = 2`
- si `last_sequence_result = social_email_2_sent` et `allow_third_email = true`, alors `sequence_step = 3`
- Résultat attendu : un seul item prêt à passer vers `If Social Lead Ready To Send`
- Vérification pratique :
- si ce nœud renvoie `0 item` alors aucun Email 2 ou Email 3 ne partira
- si ce nœud renvoie `1 item` avec `sequence_step = 2`, alors le workflow prépare Email 2
- si ce nœud renvoie `1 item` avec `sequence_step = 3`, alors le workflow prépare Email 3

### 5.8 `Normalize Google Forms Lead`

- Type : `Code`
- Rôle : convertir la charge utile brute du formulaire en structure métier propre
- Ce que fait le code :
- récupère `root` depuis `$json.body` ou `$json`
- récupère `answers`
- détecte le type de formulaire
- extrait nom, email, téléphone, fonction, entreprise
- prend en charge plusieurs variantes de libellés Google Forms avec ou sans accents
- prend en charge les différences d’apostrophes, d’espaces et de casse dans les questions
- déduit la température du lead
- déduit si le troisième email est autorisé
- construit `prospect_id`
- Résultat attendu :
- `prospect_id`
- `target_email`
- `form_type`
- `lead_temperature`
- `allow_third_email`
- `can_auto_sequence`
- `raw_answers`
- Correctif validé :
- la version finale ne doit contenir aucune adresse email de test en dur
- `target_email` doit être alimenté uniquement par l’email extrait du formulaire
- le mapping doit remonter le vrai `decision_maker_name` et le vrai `organization_name`

### 5.9 `Prepare Social Prospect Record`

- Type : `Code`
- Rôle : convertir le lead normalisé en ligne CRM prête pour `prospect_targets`
- Ce que le nœud prépare :
- `organization_type`
- `sector_guess`
- `commercial_priority_default`
- `source_payload`
- `status`
- `paused`
- `niche_status`
- `next_action_at`
- Résultat attendu : un objet complet compatible avec la table `prospect_targets`
- Correctif validé :
- toute constante de test du type `FORCED_TEST_EMAIL` doit être supprimée
- `target_email` doit rester `email || null`
- ce nœud ne doit plus contenir `marius.ayoro70@gmail.com` en dur dans la version de production

### 5.10 `Upsert Social Prospect Into CRM`

- Type : `HTTP Request`
- Méthode : `POST`
- Rôle : créer ou mettre à jour le prospect dans `prospect_targets`
- Point clé : `on_conflict=prospect_id`
- En-tête critique :
- `Prefer: resolution=merge-duplicates,return=representation`
- Résultat attendu : Supabase renvoie la ligne insérée ou mise à jour

### 5.11 `Build Immediate Social Send Context`

- Type : `Code`
- Rôle : préparer le contexte d’envoi immédiat du premier email
- Conditions de sortie :
- il faut un `target_email`
- le prospect ne doit pas être `paused`
- `stop_reason` ne doit pas être `low_recontact_intent`
- `source_payload.sequence_origin` doit être `google_forms_social`
- Résultat attendu :
- `sequence_step = 1` si aucun email n’a encore été envoyé
- `sequence_step = 2` si un premier email existe déjà

### 5.12 `If Social Lead Ready To Send`

- Type : `If`
- Rôle : vérifier que le contexte d’envoi est exploitable
- Condition correcte :

```text
={{Boolean($json.prospect_id && $json.target_email && $json.sequence_step)}}
```

- Branche `true` : on construit l’email
- Branche `false` : rien ne part

### 5.13 `Build Social Sequence Email`

- Type : `Code`
- Rôle : produire le sujet, le texte, le HTML et la logique de suite
- Ce que le nœud décide :
- quel modèle utiliser selon `form_type`
- quel email utiliser selon `sequence_step`
- quelle variante enregistrer dans les logs
- si la séquence continue ou se termine
- `next_action_at_after`
- `is_final_step`
- Résultat attendu :
- `email_subject`
- `email_text`
- `email_html`
- `message_variant`
- `next_action_at_after`
- `is_final_step`

### 5.14 `Send Social Sequence Email`

- Type : `HTTP Request`
- URL : `https://api.resend.com/emails`
- Rôle : envoyer l’email via Resend
- En-têtes requis :
- `Authorization: Bearer votre_cle_resend`
- `Content-Type: application/json`
- Corps JSON correct :

```text
={{({ from: 'TransferAI <contact@transferai.ci>', to: $json.target_email, subject: $json.email_subject, html: $json.email_html })}}
```

- Point critique : `to` doit être une chaîne simple et non un tableau
- Point critique 2 : ne pas laisser d’adresse de test figée dans le corps JSON final
- Résultat attendu : Resend renvoie un `id`

### 5.15 `Parse Social Send Result`

- Type : `Code`
- Rôle : fusionner le résultat Resend avec le contexte métier de l’email
- Ce que le nœud ajoute :
- `resend_id`
- `sent_at`
- `send_success`
- `send_api_response`
- Résultat attendu : un item complet pour la décision `If Social Email Sent`

### 5.16 `If Social Email Sent`

- Type : `If`
- Rôle : séparer le succès de l’échec d’envoi
- Condition correcte :

```text
={{$json.send_success}}
```

- Branche `true` :
- `Log Social Outreach Attempt`
- `Update Prospect After Social Send`
- Branche `false` :
- `Update Prospect Social Failure`

### 5.17 `Log Social Outreach Attempt`

- Type : `HTTP Request`
- Table ciblée : `outreach_attempts`
- Rôle : journaliser l’envoi effectué
- Champs attendus :
- `prospect_id`
- `channel = email`
- `message_variant`
- `sent_at`
- `delivery_status = submitted`
- `response_status = pending`
- `follow_up_due_at`
- `metadata.resend_message_id`
- Résultat attendu : une ligne supplémentaire dans `outreach_attempts`

### 5.18 `Update Prospect After Social Send`

- Type : `HTTP Request`
- Table ciblée : `prospect_targets`
- Rôle : mettre à jour le CRM après succès
- Champs clés mis à jour :
- `status = active`
- `paused = false`
- `last_sequence_result = social_email_1_sent` ou `social_email_2_sent` ou `social_email_3_sent`
- `last_response_status = pending`
- `niche_status = social_sequence_active` ou `social_sequence_completed`
- `next_action_at`
- Résultat attendu : le prospect est prêt pour la suite de séquence

### 5.19 `Update Prospect Social Failure`

- Type : `HTTP Request`
- Table ciblée : `prospect_targets`
- Rôle : figer le prospect en cas d’échec d’envoi
- Champs clés mis à jour :
- `status = paused`
- `paused = true`
- `last_sequence_result = social_email_send_error`
- `stop_reason = social_send_failed`
- `niche_status = social_sequence_fix_required`
- Résultat attendu : le prospect ne repart pas tout seul avant correction

## 6. Connexions à respecter entre les nœuds

Les connexions critiques validées sont les suivantes :

1. `If New Lead Payload`
- `true` vers `Normalize Google Forms Lead`
- `false` vers `Fetch Social Prospect Snapshot`

2. `If Social Lead Ready To Send`
- `true` vers `Build Social Sequence Email`

3. `If Social Email Sent`
- `true` vers `Log Social Outreach Attempt`
- `true` vers `Update Prospect After Social Send`
- `false` vers `Update Prospect Social Failure`

Point très important : `Update Prospect After Social Send` ne doit pas dépendre de la sortie de `Log Social Outreach Attempt`. Les deux nœuds doivent partir en parallèle depuis la branche `true` de `If Social Email Sent`.

## 7. Procédure de test complète

### 7.1 Test de bout en bout du webhook

1. Ouvrir le nœud `Google Forms Social Lead Webhook`
2. Cliquer sur `Listen for test event`
3. Copier l’URL de test `webhook-test`
4. Depuis Hoppscotch ou un outil équivalent, envoyer un `POST` JSON
5. Vérifier que le webhook reçoit bien `form_title` et `answers`

Exemple de payload de test :

```text
{
  "body": {
    "form_title": "Formulaire IA Côte d'Ivoire",
    "answers": {
      "Nom et prénom": "Awa Koné",
      "Nom de l'entreprise": "Société Demo CI",
      "Fonction": "Responsable administrative",
      "Téléphone": "+2250700000000",
      "Adresse e-mail": "awa.kone@example.com",
      "Votre entreprise utilise-t-elle déjà l’intelligence artificielle, même de manière partielle ?": "Pas encore, mais nous y réfléchissons",
      "Dans quel domaine l’intelligence artificielle pourrait-elle être la plus utile à votre entreprise aujourd’hui ?": [
        "Gestion administrative",
        "Relation client"
      ],
      "Pensez-vous que votre entreprise est suffisamment en sécurité face à Internet et à l’intelligence artificielle ?": "Pas totalement",
      "Avez-vous déjà essayé de voir ce que l’on trouve sur votre entreprise, ou même sur vous-même, sur Internet avec les outils d’intelligence artificielle ?": "Pas encore, mais cela m’intéresse",
      "Souhaitez-vous être recontacté pour découvrir des usages concrets de l’intelligence artificielle adaptés à votre entreprise ?": "Oui"
    }
  }
}
```

### 7.2 Vérification n8n après le test

Vous devez voir passer en vert, dans le meilleur cas :

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

### 7.3 Vérification Supabase

Dans `prospect_targets`, vérifier :

- `last_sequence_result = social_email_1_sent`
- `niche_status = social_sequence_active`
- `next_action_at` est renseigné
- `paused = false`
- `status = active`

Dans `outreach_attempts`, vérifier :

- une nouvelle ligne a été créée
- `channel = email`
- `message_variant` est cohérent
- `sent_at` est renseigné
- `status` ou `delivery_status` reflète la soumission

### 7.4 Vérification Resend ou boîte email

Vérifier :

- que l’email apparaît bien dans le dashboard Resend
- que le destinataire réel reçoit bien l’email
- que le sujet correspond bien au modèle attendu

### 7.5 Validation spécifique Email 2

Dans `Supabase > public.prospect_targets`, sur la ligne du prospect de test :

- garder `target_email` sur une vraie boîte de test
- mettre `paused = false`
- mettre `status = active`
- mettre `last_sequence_result = social_email_1_sent`
- mettre `niche_status = social_sequence_active`
- mettre `last_response_status = pending`
- mettre `stop_reason = NULL`
- mettre `next_action_at` à une date passée

Ensuite :

1. lancer le workflow via `Manual Trigger` ou le scheduler
2. vérifier que `Build Due Social Follow-Ups` renvoie bien `sequence_step = 2`
3. vérifier que l’email 2 arrive dans la boîte de test
4. vérifier que `last_sequence_result` devient `social_email_2_sent`

### 7.6 Validation spécifique Email 3

Dans `Supabase > public.prospect_targets`, sur la ligne du prospect de test :

- garder `target_email` sur une vraie boîte de test
- mettre `paused = false`
- mettre `status = active`
- mettre `last_sequence_result = social_email_2_sent`
- mettre `niche_status = social_sequence_active`
- mettre `last_response_status = pending`
- mettre `stop_reason = NULL`
- mettre `next_action_at` à une date passée
- vérifier que `source_payload.allow_third_email = true`

Ensuite :

1. lancer le workflow via `Manual Trigger` ou le scheduler
2. vérifier que `Build Due Social Follow-Ups` renvoie bien `sequence_step = 3`
3. vérifier que l’email 3 arrive dans la boîte de test
4. vérifier que `last_sequence_result` devient `social_email_3_sent`

## 8. Mode test contrôlé avec une adresse réelle

Pendant les essais, nous avons utilisé un mode test temporaire pour forcer les emails vers une boîte réelle et éviter les faux destinataires du type `example.com`.

Adresse utilisée pour test réel :

- `marius.ayoro70@gmail.com`

Ce mode test peut être activé de deux façons :

### 8.1 Version rapide dans `Send Social Sequence Email`

Vous forcez temporairement le champ `to` :

```text
={{({ from: 'TransferAI <contact@transferai.ci>', to: 'marius.ayoro70@gmail.com', subject: $json.email_subject, html: $json.email_html })}}
```

### 8.2 Version plus forte dans les nœuds de préparation

Vous pouvez aussi forcer l’adresse dans :

- `Normalize Google Forms Lead`
- `Prepare Social Prospect Record`

Cette approche a été utile pendant les tests, mais elle ne doit pas rester en place en production.

Cette approche est utile si vous voulez que toute la chaîne soit cohérente, y compris dans `prospect_targets` et `outreach_attempts`.

## 9. Retour à la normale après validation

Une fois les tests terminés, il faut impérativement revenir à la logique normale :

- `target_email` doit venir du formulaire
- `to` dans `Send Social Sequence Email` doit redevenir `$json.target_email`
- les valeurs de test ne doivent pas rester en dur dans les nœuds de normalisation ou de préparation
- toute constante du type `FORCED_TEST_EMAIL` doit être supprimée
- `Prepare Social Prospect Record` doit utiliser `const email = cleanString(lead.target_email || '')`
- `Normalize Google Forms Lead` doit produire `target_email: email || null`

Le bon corps de requête final est :

```text
={{({ from: 'TransferAI <contact@transferai.ci>', to: $json.target_email, subject: $json.email_subject, html: $json.email_html })}}
```

Au moment du retour à la normale, vérifier en plus :

1. `Normalize Google Forms Lead` ne contient plus aucune adresse de test
2. `Prepare Social Prospect Record` ne contient plus `FORCED_TEST_EMAIL`
3. `Send Social Sequence Email` envoie bien vers `$json.target_email`
4. les anciens prospects de test créés avec `marius.ayoro70@gmail.com` sont identifiés comme données de test

## 10. Guide de troubleshooting

### 10.1 Symptôme : seul le webhook se coche et tout le reste ne part pas

- Cause probable : `If New Lead Payload` ne reconnaît pas la structure entrante
- Vérification : ouvrir `If New Lead Payload` et regarder si la branche `true` sort bien
- Correction : utiliser la condition stabilisée

```text
={{Boolean($json.body || $json.form_title || $json['Nom et prénom'] || $json.email || $json['Adresse e-mail'])}}
```

### 10.2 Symptôme : les exécutions durent seulement 4 à 5 ms

- Cause probable : le workflow ne fait pas vraiment le parcours complet
- Cause fréquente : seul le trigger a été touché, ou la branche `If` n’a rien laissé passer
- Correction :
- refaire un vrai test avec un payload complet
- vérifier que plusieurs nœuds passent en vert
- considérer qu’une exécution réaliste dure plutôt quelques centaines de millisecondes à quelques secondes

### 10.3 Symptôme : `The requested webhook "google-forms-social-leads" is not registered`

- Cause probable : utilisation de l’URL de test sans avoir cliqué sur `Listen for test event`
- Correction :
- pour l’URL `webhook-test`, cliquer sur `Listen for test event`
- pour l’URL de production, publier le workflow

### 10.4 Symptôme : `Network Error` dans Hoppscotch

- Cause probable : le body n’est pas réellement envoyé ou l’intercepteur réseau choisi dans Hoppscotch ne convient pas
- Correction :
- choisir `application/json`
- coller un vrai body JSON complet
- renvoyer la requête

### 10.5 Symptôme : `A 'json' property isn't an object [item 0]`

- Cause probable : le nœud `Code` renvoie un format incompatible
- Cas typique :
- retour d’un tableau brut en mode `Run once for each item`
- retour d’un objet sans clé `json`
- Correction :
- en `Run once for each item`, retourner `return { json: {...} }`
- en `Run once for all items`, retourner `return [{ json: {...} }]`

### 10.6 Symptôme : `access to env vars denied`

- Cause probable : n8n n’autorise pas l’accès à `$env` depuis l’interface sur ce contexte
- Correction :
- remplacer l’expression `$env` par une valeur explicite dans le nœud
- ou passer par des credentials n8n
- ou finaliser la gestion côté serveur au lieu de dépendre de la prévisualisation UI

### 10.7 Symptôme : `JSON parameter needs to be valid JSON`

- Cause probable : le corps JSON du nœud HTTP a reçu un objet mal formé, ou une expression avec une syntaxe invalide
- Correction :
- utiliser une expression simple et propre
- éviter les crochets ou accolades en trop
- si besoin, passer par `JSON.stringify(...)`

### 10.8 Symptôme : Resend renvoie `The 'to' field must be a string` ou `Missing 'to' field`

- Cause probable : le champ `to` a été envoyé sous forme de tableau ou n’a pas été rempli
- Mauvaise version :

```text
to: [$json.target_email]
```

- Bonne version :

```text
to: $json.target_email
```

### 10.9 Symptôme : `Cannot read properties of undefined (reading 'data')`

- Cause probable : un nœud aval suppose un format de réponse qui n’existe pas
- Cas rencontré : lecture de `response.data.id` alors que la réponse réelle était déjà au niveau racine
- Correction :
- sécuriser avec une double lecture

```text
const resendId = response.id || (response.data && response.data.id) || null;
```

### 10.10 Symptôme : `Build Due Social Follow-Ups` ne renvoie rien alors que le prospect existe et que `next_action_at` est passé

- Cause probable : le nœud lit mal les données d’entrée en mode `Run Once for All Items`
- Cas rencontré : `Fetch Social Prospect Snapshot` renvoie plusieurs items, mais le code lit seulement `$json`
- Correction :
- utiliser `const inputItems = $input.all()`
- aplatir les lignes avant la boucle métier
- vérifier ensuite que le nœud renvoie un item avec `sequence_step = 2` ou `sequence_step = 3`

### 10.11 Symptôme : `Invalid character in header content ["apikey"]`

- Cause probable : la clé collée dans le header contient un retour à la ligne ou un caractère parasite
- Correction :
- recoller la clé sur une seule ligne
- vérifier qu’il n’y a aucun espace ou saut de ligne caché

### 10.12 Symptôme : `If Social Email Sent` passe en `true` mais les nœuds suivants ne sont pas cohérents

- Cause probable : mauvaise connexion entre les branches
- Correction :
- la branche `true` doit partir vers `Log Social Outreach Attempt`
- la branche `true` doit partir aussi vers `Update Prospect After Social Send`
- la branche `false` doit partir vers `Update Prospect Social Failure`
- ne pas chaîner `Update Prospect After Social Send` derrière `Log Social Outreach Attempt`

### 10.13 Symptôme : l’email n’arrive pas dans Gmail mais on le voit dans Resend

- Cause probable : le destinataire est un faux email comme `awa.kone@example.com`
- Cause probable 2 : le dashboard Resend montre `Delivery Delayed`
- Correction :
- tester avec une vraie boîte comme `marius.ayoro70@gmail.com`
- vérifier l’adresse de destination dans `Send Social Sequence Email`
- vérifier le dashboard Resend sur la bonne ligne d’envoi

### 10.14 Symptôme : aucune nouvelle exécution visible dans l’onglet `Executions`

- Cause probable : le workflow testé n’est pas celui de l’éditeur courant
- Cause probable 2 : l’exécution de test a été faite hors écoute
- Correction :
- activer `Auto refresh`
- refaire le test après `Listen for test event`
- vérifier si le workflow a bien été publié

### 10.15 Symptôme : le workflow ne se déroule pas tout seul, mais seulement quand vous exécutez les nœuds manuellement

- Cause probable : le test a été fait nœud par nœud au lieu d’un lancement global
- Cause probable 2 : le trigger test a été lancé sans que le workflow soit réellement en écoute
- Correction :
- partir du webhook ou du scheduler
- lancer un vrai test de bout en bout
- ne pas utiliser `Execute step` comme validation finale du workflow complet

### 10.16 Symptôme : les emails partent bien, mais le contenu affiche `Prospect à confirmer` ou `Entreprise à confirmer`

- Cause probable : le mapping du nœud `Normalize Google Forms Lead` ne récupère pas correctement les libellés exacts du formulaire
- Correction :
- utiliser la version finale robuste du nœud `Normalize Google Forms Lead`
- vérifier dans sa sortie la présence de `decision_maker_name`, `organization_name` et `target_email`
- refaire un test webhook avec un payload réel du formulaire

## 11. Checklist d’exploitation

Avant mise en production, vérifier :

1. le workflow est publié
2. les clés Supabase et Resend sont propres
3. les URL Supabase pointent bien vers le bon projet
4. `If New Lead Payload` laisse passer un vrai payload
5. `If Social Lead Ready To Send` laisse passer un contexte avec email
6. `Send Social Sequence Email` utilise `to: $json.target_email`
7. `If Social Email Sent` est branché correctement
8. `prospect_targets` se met à jour
9. `outreach_attempts` reçoit une ligne
10. l’email est reçu dans une vraie boîte
11. `Build Due Social Follow-Ups` lit bien les entrées avec `$input.all()`
12. `Normalize Google Forms Lead` et `Prepare Social Prospect Record` ne contiennent plus de logique de test figée

## 12. Résultat attendu après stabilisation

Quand tout est correctement configuré :

- un lead Google Forms entre dans `prospect_targets`
- l’email 1 part immédiatement
- `outreach_attempts` reçoit un log d’envoi
- `last_sequence_result` devient `social_email_1_sent`
- `niche_status` devient `social_sequence_active`
- `next_action_at` est renseigné
- le scheduler peut ensuite envoyer l’email 2 puis l’email 3 selon les règles
- les tests validés montrent que la séquence complète Email 1, Email 2 et Email 3 fonctionne

## 13. Recommandation finale d’exploitation

Pour exploiter ce workflow proprement, il est recommandé de travailler en trois temps :

1. validation technique avec une adresse réelle de test
2. retour à la logique normale avec l’email provenant du formulaire
3. validation du mapping final nom, entreprise et email dans `Normalize Google Forms Lead`
4. mise en production avec publication du workflow et surveillance quotidienne de `prospect_targets`, `outreach_attempts` et Resend

Ce document doit être conservé comme référence de support interne tant que la V2 Clean Importable reste votre version opérationnelle.
