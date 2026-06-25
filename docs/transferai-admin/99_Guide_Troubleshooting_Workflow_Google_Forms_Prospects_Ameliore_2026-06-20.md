# Guide de Troubleshooting - Workflow Google Forms Prospects Ameliore

Workflow de reference :

- `TransferAI Google Forms Social Lead Sequence V2 Clean Importable`
- Fichier : [93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json)

Date de mise a jour :

- `20 juin 2026`

## 1. Objet du guide

Ce guide sert a diagnostiquer et corriger les problemes les plus frequents du workflow Google Forms prospects ameliore.

Il est base sur les incidents reels rencontres pendant :

- le branchement Google Forms -> Google Sheets -> Apps Script
- les tests `webhook-test`
- le passage en production `webhook`
- la mise a jour CRM Supabase
- les envois d'emails prospect
- les alertes admin
- le scheduler de relance

## 2. Methode de diagnostic recommandee

Quand un test ne marche pas, verifier toujours dans cet ordre :

1. la soumission Google Form est-elle bien entree dans Google Sheets
2. le trigger Apps Script s'est-il bien lance
3. le workflow n8n est-il `Published`
4. l'execution est-elle visible dans `Executions`
5. quel est le premier noeud rouge
6. le probleme vient-il du JSON, d'une condition, d'une URL, d'un secret ou d'un service externe

## 3. Problemes frequents et correctifs

## 3.1 Rien n'apparait dans n8n apres avoir rempli le formulaire

### Symptome

- le formulaire est rempli
- la feuille Google Sheets recoit bien la ligne
- aucune execution recente n'apparait dans n8n

### Causes probables

- Apps Script pointe encore vers `webhook-test`
- le workflow n8n n'est pas `Published`
- le trigger `On form submit` n'est pas cree
- le script a ete lance avec `Run` au lieu d'une vraie soumission

### Correctif

Verifier dans Apps Script :

```javascript
WEBHOOK_URL: 'https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-social-leads'
```

Puis verifier :

- le trigger `On form submit`
- le statut `Published` du workflow

## 3.2 Apps Script affiche `Evenement de formulaire introuvable`

### Symptome

Dans `Execution log`, on voit :

- `Evenement de formulaire introuvable. Utilise un declencheur "On form submit".`

### Cause

La fonction `onFormSubmitToN8n(e)` a ete lancee manuellement avec le bouton `Run`.

### Correctif

Ne pas utiliser `Run`.

Il faut :

1. creer un trigger `On form submit`
2. remplir reellement le formulaire

## 3.3 Le webhook recoit le payload mais l'email part vers une mauvaise adresse

### Symptome

- le workflow s'execute
- mais l'email part vers une adresse de test ou une ancienne adresse

### Cause

Une adresse email est laissee en dur dans un noeud HTTP ou un noeud Code.

### Correctif

Verifier en priorite :

- `Prepare Social Prospect Record`
- `Send Social Sequence Email`
- `Send Admin Lead Alert`

Pour l'alerte admin, le noeud `Send Admin Lead Alert` doit utiliser :

```javascript
={{
({
  from: 'TransferAI <contact@transferai.ci>',
  to: 'contact@transferai.ci',
  subject: $json.admin_email_subject,
  html: $json.admin_email_html
})
}}
```

## 3.4 Les reponses comme `Oui, assez bien` sont cassees en plusieurs morceaux

### Symptome

Dans n8n, une reponse simple apparait comme une liste au lieu d'une chaine :

- `["Oui", "assez bien"]`

### Cause

Le script Apps Script essaye de splitter les valeurs contenant une virgule.

### Correctif

Utiliser la version simple et stable de `normalizeValue(rawValue)` :

```javascript
function normalizeValue(rawValue) {
  if (!Array.isArray(rawValue)) {
    return rawValue;
  }

  if (rawValue.length === 0) {
    return '';
  }

  if (rawValue.length === 1) {
    return String(rawValue[0] || '').trim();
  }

  return rawValue
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}
```

## 3.5 Le noeud `Set Social Sequence Config` affiche des triangles rouges

### Symptome

- des alertes rouges apparaissent dans le noeud
- certaines lignes de configuration sont invalides

### Cause

Une ou plusieurs lignes `Name / Type / Value` sont incomplètes ou dupliquees.

### Correctif

Ne conserver que les lignes utiles :

- `source_backend`
- `source_label_prefix`
- `booking_link_45min`
- `follow_up_delay_1_days`
- `follow_up_delay_2_days`
- `follow_up_fetch_limit`
- `default_country`

## 3.6 Le scheduler tourne mais rien ne part

### Symptome

- l'execution du scheduler existe
- aucun email 2 ou email 3 n'est envoye

### Causes probables

- aucun prospect n'est du pour relance
- `Build Due Social Follow-Ups` renvoie `0 item`
- `follow_up_fetch_limit` est trop faible
- `next_action_at` n'est pas encore arrive
- le prospect est `paused = true`

### Correctif

Verifier dans `prospect_targets` :

- `next_action_at`
- `paused`
- `last_sequence_result`
- `last_response_status`
- `stop_reason`

Verifier ensuite la sortie de :

- `Fetch Social Prospect Snapshot`
- `Build Due Social Follow-Ups`

## 3.7 L'execution de minuit est rouge alors que le formulaire fonctionne

### Symptome

- les nouvelles soumissions Google Forms marchent
- mais une execution planifiee vers `00:00:00` passe en erreur

### Cause probable

Le probleme n'est pas dans la branche Google Forms. Il est dans la branche de relance ou dans la branche failure.

### Correctif

Cliquer sur l'execution rouge puis identifier le premier noeud rouge.

Si le noeud en erreur est `Update Prospect Social Failure`, voir section 3.8.

## 3.8 `Update Prospect Social Failure` affiche `JSON parameter needs to be valid JSON`

### Symptome

Le noeud montre :

- `JSON parameter needs to be valid JSON`

### Cause

Le body JSON du noeud est mal forme.

### Correctif

Configurer le noeud ainsi :

- `Method = PATCH`
- `Body Content Type = JSON`
- `Specify Body = Using JSON`

URL recommandee :

```javascript
={{'https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospect_targets?prospect_id=eq.' + encodeURIComponent($json.prospect_id)}}
```

Body JSON recommande :

```javascript
={{
({
  paused: true,
  last_sequence_result: 'social_email_send_failed',
  last_response_status: 'failed',
  niche_status: 'social_sequence_needs_review',
  stop_reason: 'social_email_send_failed',
  next_action_at: null
})
}}
```

## 3.9 Le mail prospect est bien recu mais tu ne retrouves pas la bonne execution

### Symptome

- le prospect a recu l'email
- mais tu penses que n8n n'a rien traite

### Cause

Tu regardes souvent :

- une ancienne execution
- une execution de test
- ou une execution du scheduler au lieu de la vraie execution Google Forms

### Correctif

Dans `Executions` :

1. trier par plus recent
2. cliquer tout en haut
3. verifier le noeud `Google Forms Social Lead Webhook`
4. verifier le `body` dans le panneau du bas

## 3.10 L'alerte admin ne part pas

### Symptome

- le prospect recoit le mail 1
- mais aucun mail n'arrive a `contact@transferai.ci`

### Causes probables

- `If Admin Alert Eligible` renvoie `false`
- `Send Admin Lead Alert` envoie encore vers une autre adresse
- la branche admin n'est pas connectee depuis `Upsert Social Prospect Into CRM`

### Correctif

Verifier l'ordre suivant :

1. `Build Admin Lead Alert Context` retourne bien `should_notify_admin = true`
2. `If Admin Alert Eligible` passe sur la branche `true`
3. `Build Admin Lead Alert Email` produit :
   - `admin_email_subject`
   - `admin_email_html`
4. `Send Admin Lead Alert` envoie bien vers `contact@transferai.ci`

## 3.11 `If Admin Alert Eligible` ne se declenche pas

### Symptome

- le noeud ne laisse rien passer

### Cause

La condition booleenne est mal ecrite ou la valeur n'est pas interpretee comme un vrai boolean.

### Correctif

Utiliser une condition simple sur :

- `{{$json.should_notify_admin}}`

avec l'operateur :

- `is true`

## 3.12 Le noeud `Send Social Sequence Email` ne renvoie pas d'id

### Symptome

- pas de `id` Resend dans la sortie
- ou erreur HTTP

### Causes probables

- cle Resend absente ou invalide
- body JSON incorrect
- `target_email` vide

### Correctif

Verifier :

- header `Authorization: Bearer ...`
- `to: $json.target_email`
- `subject: $json.email_subject`
- `html: $json.email_html`

Le body recommande reste :

```javascript
={{
({
  from: 'TransferAI <contact@transferai.ci>',
  to: $json.target_email,
  subject: $json.email_subject,
  html: $json.email_html
})
}}
```

## 3.13 Le workflow utilise encore `webhook-test`

### Symptome

- les tests marchent quand `Listen for test event` est actif
- mais rien ne marche en usage reel

### Cause

Apps Script ou un outil externe pointe encore vers :

- `/webhook-test/google-forms-social-leads`

### Correctif

Basculer en production sur :

- `/webhook/google-forms-social-leads`

## 3.14 `Lost connection to the server` apparait dans n8n

### Symptome

- message UI `Lost connection to the server`
- certains panneaux ne se chargent plus

### Cause

Il s'agit le plus souvent d'un probleme d'interface n8n, pas du workflow lui-meme.

### Correctif

1. rafraichir la page
2. rouvrir l'execution
3. verifier si l'execution a quand meme ete creee dans `Executions`

## 3.15 Le scheduler n'envoie qu'un seul prospect a la fois

### Symptome

- plusieurs prospects attendent
- mais un seul repart par cycle

### Cause

Le parametre :

- `follow_up_fetch_limit = 1`

et la logique actuelle de `Build Due Social Follow-Ups` ne laissent passer qu'un item.

### Correctif

Si l'objectif est de traiter plus d'un prospect par heure, il faudra :

1. augmenter `follow_up_fetch_limit`
2. adapter `Build Due Social Follow-Ups` pour renvoyer plusieurs items

## 4. Checklist de verification rapide apres chaque changement

Apres toute modification, refaire ce mini-test :

1. verifier que le workflow est `Published`
2. remplir le Google Form avec une adresse de test
3. verifier la nouvelle execution dans n8n
4. verifier l'email prospect
5. verifier l'alerte admin sur `contact@transferai.ci`
6. verifier `prospect_targets`
7. verifier `outreach_attempts`

## 5. Quand escalader vers une correction structurelle

Une correction plus profonde est necessaire si :

- les relances email 2 / email 3 ne se declenchent jamais
- la sequence continue alors que le prospect a deja repondu
- il faut brancher Zoho inbound ou Chatwoot pour stop automatique
- il faut notifier plusieurs admins
- il faut gerer plusieurs formulaires supplementaires

## 6. Fichiers de reference utiles

- [98_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/98_Guide_Utilisateur_Workflow_Google_Forms_Prospects_Ameliore_2026-06-20.md)
- [92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/92_Guide_Activation_Google_Forms_Social_Lead_Sequence_V1.md)
- [97_Plan_Integration_Zoho_Inbound_BackOffice_2026-06-19.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/97_Plan_Integration_Zoho_Inbound_BackOffice_2026-06-19.md)
