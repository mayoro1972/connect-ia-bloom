# Guide de dépannage - Workflow Google Forms prospects TransferAI

Workflow de référence :

- `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`
- Fichier : [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)

Date de mise à jour :

- `23 juin 2026`

## 1. Objet du guide

Ce guide recense, dans l’ordre où ils ont été rencontrés puis résolus entre le `19/06/2026` et le `23/06/2026`, les principaux incidents techniques et fonctionnels liés au workflow Google Forms prospects de TransferAI.

Il sert à :

- diagnostiquer un problème plus vite ;
- retrouver la cause déjà rencontrée ;
- appliquer le correctif validé ;
- contrôler que le workflow est revenu à un état sain.

## 2. Méthode de diagnostic recommandée

Toujours vérifier dans cet ordre :

1. la réponse est-elle bien entrée dans Google Sheets ;
2. le projet Apps Script actif est-il le bon ;
3. le déclencheur Apps Script est-il bien `From spreadsheet - On form submit` ;
4. le workflow n8n est-il `Published` ;
5. une exécution apparaît-elle dans `Executions` ;
6. quel est le premier nœud en erreur ou le premier nœud qui ne transmet plus rien ;
7. le problème touche-t-il la branche prospect, la branche admin ou l’écriture Supabase.

## 3. Historique des problèmes rencontrés et correctifs validés

## 3.1 19/06/2026 - Aucune exécution visible dans n8n après soumission

### Symptôme

- le formulaire est soumis ;
- la ligne arrive bien dans Google Sheets ;
- aucune exécution n’apparaît dans n8n.

### Causes identifiées

- Apps Script pointait encore vers `webhook-test` ;
- le workflow n8n n’était pas `Published` ;
- le déclencheur Apps Script n’était pas correctement installé ;
- la fonction était testée avec `Run` au lieu d’une vraie soumission.

### Correctif retenu

Vérifier que le script utilise bien :

```javascript
WEBHOOK_URL: 'https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-social-leads'
```

Puis vérifier :

- `Published` dans n8n ;
- déclencheur `From spreadsheet - On form submit` ;
- vraie soumission Google Form.

## 3.2 19/06/2026 - Erreur `Événement de formulaire introuvable`

### Symptôme

Dans Apps Script :

- `Événement de formulaire introuvable. Utilise un déclencheur "On form submit".`

### Cause identifiée

La fonction `onFormSubmitToN8n(e)` était lancée manuellement avec `Run`.

### Correctif retenu

- ne jamais lancer cette fonction avec le bouton `Run` ;
- passer uniquement par une soumission réelle du formulaire.

## 3.3 19/06/2026 - Réponses texte coupées à cause des virgules

### Symptôme

Une réponse comme :

- `Oui, assez bien`

remontait parfois sous forme de liste.

### Cause identifiée

Une ancienne logique de normalisation Apps Script essayait de découper les valeurs contenant une virgule.

### Correctif retenu

Conserver une version simple de `normalizeValue(rawValue)` qui :

- garde les chaînes simples telles quelles ;
- ne découpe pas les réponses uniques contenant des virgules.

## 3.4 21/06/2026 - Le prospect reçoit le même email deux fois

### Symptôme

- un même prospect reçoit deux fois le premier email ;
- deux exécutions ou deux sources semblent agir en parallèle.

### Causes identifiées

Présence d’un ancien projet Apps Script :

- `TransferAI Google Forms Bridge - Form 2`

avec :

- un ancien déclencheur `From form - On form submit` ;
- une ancienne fonction `onFormSubmit(e)` ;
- un ancien `setupTrigger()`.

### Correctif retenu

- suppression du déclencheur historique ;
- neutralisation des anciennes fonctions ;
- conservation d’une seule source active :
  - projet `TransferAI Google Forms to n8n`
  - fonction `onFormSubmitToN8n`
  - déclencheur `From spreadsheet - On form submit`

### Vérification

Après correction :

- une seule ligne Google Sheets ;
- une seule exécution n8n ;
- un seul email prospect.

## 3.5 21/06/2026 - Mauvais lien de rendez-vous dans le mail

### Symptôme

Le lien inséré dans l’email n’était pas le bon.

### Correctif retenu

Le lien officiel retenu a été :

- `https://calendly.com/contact-transferai/30min`

### Point de contrôle

Vérifier ce lien dans :

- `Set Social Sequence Config`
- `Build Social Sequence Email`
- `Build Admin Lead Alert Context`

## 3.6 22/06/2026 - Le mail admin part au mauvais destinataire

### Symptôme

Confusion entre :

- l’email prospect reçu sur l’adresse de test ;
- et l’alerte admin attendue dans Zoho.

### Cause identifiée

Le mail prospect et le mail admin ont deux logiques différentes :

- prospect : `to = $json.target_email`
- admin : `to = contact@transferai.ci`

### Correctif retenu

Dans `Send Admin Lead Alert`, utiliser :

```javascript
={{
{
  from: 'TransferAI <contact@transferai.ci>',
  to: 'contact@transferai.ci',
  subject: $json.admin_email_subject,
  html: $json.admin_email_html
}
}}
```

### Vérification

- sujet `Merci pour votre intérêt...` = prospect ;
- sujet `[Nouveau prospect ...]` = admin.

## 3.7 22/06/2026 - Erreur `.first()` dans un nœud `Code`

### Symptôme

Dans `Build Admin Alert Send Result` :

- `Can't use .first() here`

### Cause identifiée

Le nœud était en mode :

- `Run Once for Each Item`

et la méthode `.first()` n’y était pas supportée.

### Correctif retenu

Remplacer les accès de type `.first()` par une récupération compatible avec le mode courant, par exemple via :

```javascript
$items('Nom du nœud')[0]?.json
```

## 3.8 22/06/2026 - Erreur `JSON parameter needs to be valid JSON`

### Symptôme

Dans un nœud HTTP `PATCH` :

- `JSON parameter needs to be valid JSON`

### Cause identifiée

Le body JSON était mal formé dans le champ `Using JSON`.

### Correctif retenu

Utiliser une expression unique propre, par exemple :

```javascript
={{
{
  "admin_alert_sent_at": $json.admin_alert_sent_at
}
}}
```

et, pour la branche prospect :

```javascript
={{
{
  "last_sequence_result": $json.expected_sequence_result || $json.last_sequence_result,
  "social_email_1_sent_at": $json.social_email_1_sent_at,
  "social_email_2_sent_at": $json.social_email_2_sent_at,
  "social_email_3_sent_at": $json.social_email_3_sent_at
}
}}
```

## 3.9 22/06/2026 - `admin_alert_sent_at` reste à `NULL`

### Symptôme

- le mail admin est bien reçu ;
- mais la colonne `admin_alert_sent_at` reste vide dans Supabase.

### Causes identifiées

- absence de la colonne dans Supabase au début ;
- ou récupération incomplète du contexte après l’envoi admin ;
- ou body `PATCH` incorrect.

### Correctif retenu

1. créer la colonne :

```sql
alter table public.prospect_targets
add column if not exists admin_alert_sent_at timestamptz;
```

2. construire `admin_alert_sent_at` dans `Build Admin Alert Send Result` ;
3. pousser cette valeur via `Update Prospect After Admin Alert`.

### Vérification

- `admin_alert_sent_at` doit être rempli après un envoi admin réussi ;
- l’alerte admin suivante doit être bloquée.

## 3.10 22/06/2026 - L’alerte admin repart une deuxième fois

### Symptôme

- un même prospect déclenche une seconde alerte admin.

### Cause identifiée

Il manquait une garde métier fondée sur la date déjà enregistrée.

### Correctif retenu

Utiliser :

- `Build Admin Alert Guard`
- `If Admin Alert Allowed`

en s’appuyant sur :

- `admin_alert_sent_at`

### Vérification

Quand `admin_alert_sent_at` est déjà rempli :

- `can_send_admin_alert = false`
- `If Admin Alert Allowed` passe en `False Branch`
- aucun nouvel email admin ne part.

## 3.11 22/06/2026 - `social_email_1_sent_at` reste à `NULL`

### Symptôme

- le mail prospect part bien ;
- mais `social_email_1_sent_at` reste vide en base.

### Cause identifiée

Le contexte de garde n’arrivait pas correctement jusqu’au nœud `Build Social Send Result`. Le nœud travaillait uniquement avec le retour Resend, sans récupérer `sent_at_field`.

### Correctif retenu

Dans `Build Social Send Result`, récupérer explicitement le contexte du nœud :

- `Build Social Sent Guard`

et recalculer les timestamps à partir de cette source.

### Vérification

Après correction :

- `social_email_1_sent_at` doit être rempli ;
- le prospect ne doit plus recevoir deux fois le mail 1.

## 3.12 22/06/2026 - Le prospect ne reçoit pas d’email alors que l’admin reçoit une alerte

### Symptôme

- le mail admin arrive ;
- pas de mail prospect.

### Causes possibles identifiées

- `paused = true`
- `status = paused`
- `If Social Lead Ready To Send` ou `If Social Send Allowed` bloque la branche.

### Correctif retenu

Vérifier les champs du prospect :

- `status`
- `paused`
- `do_not_contact`
- `social_email_1_sent_at`

Puis contrôler le résultat des nœuds :

- `If Social Lead Ready To Send`
- `Build Social Sent Guard`
- `If Social Send Allowed`

## 3.13 23/06/2026 - Confusion entre le mail admin et le mail prospect

### Symptôme

L’utilisateur pense que le mail admin n’arrive pas parce qu’il voit un mail sur `marius.ayoro70@gmail.com`.

### Cause identifiée

Le mail visible dans Gmail est le mail prospect de test, pas l’alerte admin.

### Correctif retenu

Retenir cette règle :

- `Merci pour votre intérêt...` = mail prospect ;
- `[Nouveau prospect ...]` = mail admin.

Et contrôler séparément :

- Gmail du prospect ;
- Zoho `contact@transferai.ci`.

## 4. Check-list de diagnostic rapide

## 4.1 Si rien n’arrive dans n8n

Vérifier :

1. Google Sheets reçoit-il la ligne ;
2. Apps Script pointe-t-il vers `webhook` et non `webhook-test` ;
3. le déclencheur Apps Script est-il actif ;
4. le workflow n8n est-il `Published`.

## 4.2 Si le prospect ne reçoit pas d’email

Vérifier :

1. `If Social Lead Ready To Send`
2. `Build Social Sent Guard`
3. `If Social Send Allowed`
4. `Send Social Sequence Email`
5. `social_email_1_sent_at`

## 4.3 Si l’admin ne reçoit pas d’alerte

Vérifier :

1. `If Admin Alert Eligible`
2. `Build Admin Alert Guard`
3. `If Admin Alert Allowed`
4. `Send Admin Lead Alert`
5. `admin_alert_sent_at`

## 4.4 Si un doublon apparaît

Vérifier :

1. qu’il n’existe qu’un seul projet Apps Script actif ;
2. qu’il n’existe qu’un seul déclencheur utile ;
3. `admin_alert_sent_at`
4. `social_email_1_sent_at`
5. `social_email_2_sent_at`
6. `social_email_3_sent_at`

## 5. Nœuds les plus sensibles

Les nœuds à contrôler en priorité sont :

- `Google Forms Social Lead Webhook`
- `Normalize Google Forms Lead`
- `Prepare Social Prospect Record`
- `Upsert Social Prospect Into CRM`
- `Build Social Sequence Email`
- `Build Social Sent Guard`
- `Send Social Sequence Email`
- `Build Social Send Result`
- `Update Prospect After Social Send`
- `Build Admin Alert Guard`
- `Send Admin Lead Alert`
- `Build Admin Alert Send Result`
- `Update Prospect After Admin Alert`

## 6. État de stabilité au 23/06/2026

Le système est désormais stabilisé sur les points suivants :

- entrée Google Forms vers n8n ;
- création CRM ;
- premier email prospect ;
- alerte admin ;
- blocage des doublons admin ;
- base technique de blocage des doublons prospect ;
- distinction claire entre circuit prospect et circuit admin.

## 7. Prochaine zone à surveiller

La prochaine vigilance opérationnelle porte sur :

1. la validation complète des dates `social_email_1_sent_at`, `social_email_2_sent_at`, `social_email_3_sent_at` ;
2. l’ajout propre des relances `mail 2` et `mail 3` ;
3. la vérification du comportement du scheduler une fois les étapes 2 et 3 activées.
