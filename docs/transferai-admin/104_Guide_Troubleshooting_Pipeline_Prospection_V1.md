# Guide de dépannage — Pipeline de prospection automatisé TransferAI V1

**Version :** 1.0  
**Date :** 24 juin 2026  
**Auteur :** TransferAI  

---

## Comment utiliser ce guide

Ce guide vous aide à diagnostiquer et résoudre les problèmes du pipeline de prospection automatisé TransferAI.

**Pour trouver votre problème rapidement :**
- Aucun email n'est envoyé après soumission d'un formulaire → section 1
- Les relances (mail 2 / mail 3) ne partent pas → section 2
- Un rendez-vous Calendly n'est pas détecté → section 3
- Le rapport quotidien ne s'envoie pas → section 4
- Un email bounce ne stoppe pas la séquence → section 5
- Un prospect est dans un mauvais statut → section 6
- Problèmes généraux n8n → section 7

---

## 1. Aucun email n'est envoyé après soumission du formulaire

### Symptôme
Le prospect remplit le formulaire mais ne reçoit aucun email. Vous ne recevez pas non plus d'alerte admin.

### Causes possibles et solutions

**1.1 Google Apps Script désactivé ou en erreur**

Vérification :
1. Ouvrez le formulaire concerné dans Google Drive
2. Cliquez sur les trois points → **Script editor**
3. Allez dans **Exécutions** (menu de gauche)
4. Cherchez la dernière exécution de `onFormSubmit`

Si l'exécution est en erreur (fond rouge) :
- Relisez le message d'erreur
- Vérifiez que l'URL du webhook dans le script correspond bien à : `https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-social-leads`
- Vérifiez que le déclencheur `onFormSubmit` est toujours actif (menu **Déclencheurs**)

**1.2 Workflow 93 inactif dans n8n**

Vérification :
1. Connectez-vous à n8n : `https://n8n-pxlk.srv1480638.hstgr.cloud`
2. Ouvrez le workflow **93 — Google Forms Social Lead Sequence V2**
3. Vérifiez que le bouton **Active** est bien vert en haut à droite

Si le workflow est inactif, cliquez sur le bouton pour l'activer.

**1.3 Erreur dans l'exécution du workflow 93**

Vérification :
1. Dans n8n, ouvrez le workflow 93
2. Cliquez sur **Executions** (menu de gauche)
3. Cherchez la dernière exécution et regardez si elle est en erreur (rouge)
4. Cliquez dessus pour voir quel nœud a échoué

Erreurs fréquentes :

| Nœud en erreur | Cause probable | Solution |
|---------------|----------------|----------|
| `Send Social Sequence Email` | Quota ou API Resend down | Vérifier le tableau de bord Resend |
| `Upsert Prospect` | Supabase down ou clé API expirée | Vérifier Supabase |
| `Send Admin Alert` | Même cause que Resend ci-dessus | Idem |

**1.4 Le prospect existe déjà avec `paused = true`**

Vérification dans Supabase :
```sql
SELECT email, status, paused, stop_reason
FROM prospect_targets
WHERE email = 'email_du_prospect@exemple.com';
```

Si `paused = true`, le système a volontairement bloqué la séquence. Pour reprendre :
```sql
UPDATE prospect_targets
SET paused = false, next_action_at = NOW()
WHERE email = 'email_du_prospect@exemple.com';
```

---

## 2. Les relances (mail 2 / mail 3) ne partent pas

### Symptôme
Le mail 1 a été envoyé, mais les relances à J+4 et J+7 ne se déclenchent pas.

### Causes possibles et solutions

**2.1 `next_action_at` non calculé**

Vérification dans Supabase :
```sql
SELECT email, sequence_step, next_action_at, social_email_1_sent_at
FROM prospect_targets
WHERE status = 'meeting_invited'
LIMIT 20;
```

Si `next_action_at` est `null` alors que le mail 1 a été envoyé, c'est que le nœud `Build Social Send Result` a un problème. Vérifiez les exécutions du workflow 93 et cherchez une erreur dans ce nœud.

**2.2 `next_action_at` est dans le futur**

Ce n'est pas un bug — c'est le fonctionnement normal. Le mail 2 est envoyé exactement à la date calculée (J+4). Vérifiez la colonne `next_action_at` pour vous assurer que la date est correcte.

**2.3 Le cron horaire du workflow 93 est arrêté**

Le cron du workflow 93 se déclenche toutes les heures pour vérifier s'il y a des relances à envoyer. Si le workflow était inactif pendant une période, des relances peuvent avoir été manquées.

Solution : Réactivez le workflow 93. Les relances dont `next_action_at` est dépassé seront envoyées lors de la prochaine exécution du cron.

**2.4 `allow_third_email = false`**

Le mail 3 n'est envoyé que si le prospect a autorisé un troisième contact. Vérifiez dans Supabase :
```sql
SELECT email, allow_third_email, sequence_step
FROM prospect_targets
WHERE email = 'email@exemple.com';
```

Si `allow_third_email = false`, c'est un comportement normal : la séquence s'arrête après le mail 2.

---

## 3. Un rendez-vous Calendly n'est pas détecté

### Symptôme
Un prospect a réservé un rendez-vous via Calendly, mais son statut est toujours `followup_pending` et des relances continuent de partir.

### Causes possibles et solutions

**3.1 Workflow 94 inactif**

Vérification :
1. Ouvrez le workflow **94 — Calendly Meeting Booked Webhook V1** dans n8n
2. Vérifiez que le bouton **Active** est vert

**3.2 Le webhook Calendly n'est plus enregistré**

Le webhook Calendly peut expirer ou être supprimé si le Personal Access Token est révoqué ou expiré.

Vérification via l'API Calendly :
```bash
curl -H "Authorization: Bearer VOTRE_TOKEN" \
  https://api.calendly.com/webhook_subscriptions
```

Si la liste est vide, il faut réenregistrer le webhook :
```bash
curl -X POST https://api.calendly.com/webhook_subscriptions \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/calendly-meeting-booked",
    "events": ["invitee.created"],
    "organization": "https://api.calendly.com/organizations/b3a48c73-c446-4cf6-bce1-add43b81d9d7",
    "scope": "organization"
  }'
```

**3.3 L'email du prospect Calendly ne correspond pas à Supabase**

Le workflow 94 recherche le prospect par son email Calendly. Si le prospect a utilisé une adresse différente (adresse pro vs personnelle), la correspondance échoue.

Vérification dans n8n (exécutions du workflow 94) :
1. Ouvrez la dernière exécution
2. Cliquez sur le nœud `Find Prospect By Email`
3. Vérifiez si l'email retourné est bien dans Supabase

Solution manuelle dans Supabase :
```sql
UPDATE prospect_targets
SET status = 'meeting_booked',
    paused = true,
    meeting_booked_at = NOW()
WHERE email = 'email_connu_du_prospect@exemple.com';
```

---

## 4. Le rapport quotidien ne s'envoie pas

### Symptôme
Vous ne recevez pas le rapport quotidien à `contact@transferai.ci` le matin à 7h00.

### Causes possibles et solutions

**4.1 Workflow 95 inactif**

Vérification :
1. Ouvrez le workflow **95 — Daily Monitoring Report V1** dans n8n
2. Vérifiez que le bouton **Active** est vert

**4.2 Problème de fuseau horaire**

Le cron est configuré pour `0 7 * * 1-6`. Si le serveur n8n est en UTC et que vous êtes en Afrique de l'Ouest (GMT+0), le rapport devrait arriver à 7h00 GMT. Vérifiez le fuseau horaire dans **Settings → n8n** dans n8n.

**4.3 Erreur dans le nœud d'envoi Resend**

Vérification :
1. Ouvrez les exécutions du workflow 95
2. Vérifiez si le nœud `Send Daily Report Email` est en erreur
3. Lisez le message d'erreur

Si l'erreur est `401 Unauthorized`, la clé API Resend est invalide ou a expiré.

---

## 5. Un email bounce ne stoppe pas la séquence

### Symptôme
Un email est rejeté (bounce), mais des relances continuent d'être envoyées au même prospect.

### Causes possibles et solutions

**5.1 Workflow 96 inactif**

Vérification :
1. Ouvrez le workflow **96 — Resend Email Events Webhook V1** dans n8n
2. Vérifiez que le bouton **Active** est vert

**5.2 Webhook Resend non configuré**

Vérification dans le tableau de bord Resend :
1. Allez sur `resend.com` → **Webhooks**
2. Vérifiez qu'un webhook est configuré avec l'URL : `https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/resend-email-events`
3. Vérifiez que les événements `email.bounced` et `email.complained` sont cochés

Si le webhook est absent, recréez-le avec ces paramètres.

**5.3 Les tags de l'email sont absents**

Le workflow 96 identifie le prospect grâce aux tags ajoutés lors de l'envoi. Si les tags `prospect_id`, `sequence_step` et `form_type` ne sont pas présents dans l'email, le workflow ne peut pas identifier le prospect.

Vérification : Ouvrez les exécutions du workflow 96 et regardez le nœud `Parse Resend Event`. Si `prospect_id` est vide, c'est que les tags manquent.

Solution : Vérifiez que le nœud `Send Social Sequence Email` du workflow 93 contient bien les tags dans son corps JSON.

---

## 6. Un prospect est dans un mauvais statut

### Symptôme
Le statut d'un prospect dans Supabase ne reflète pas la réalité.

### Corrections manuelles via Supabase

**Forcer le statut `meeting_booked` :**
```sql
UPDATE prospect_targets
SET status = 'meeting_booked',
    paused = true,
    meeting_booked_at = NOW()
WHERE email = 'email@exemple.com';
```

**Reprendre la séquence d'un prospect bloqué par erreur :**
```sql
UPDATE prospect_targets
SET paused = false,
    stop_reason = null,
    next_action_at = NOW() + INTERVAL '1 hour'
WHERE email = 'email@exemple.com';
```

**Réinitialiser complètement un prospect (recommencer la séquence) :**
```sql
UPDATE prospect_targets
SET status = 'active',
    paused = false,
    sequence_step = 0,
    last_sequence_result = null,
    social_email_1_sent_at = null,
    social_email_2_sent_at = null,
    social_email_3_sent_at = null,
    next_action_at = NOW()
WHERE email = 'email@exemple.com';
```

**Fermer définitivement un prospect :**
```sql
UPDATE prospect_targets
SET status = 'closed_lost',
    paused = true,
    stop_reason = 'manual_close',
    closed_at = NOW()
WHERE email = 'email@exemple.com';
```

---

## 7. Problèmes généraux n8n

### 7.1 Accès à n8n

- **URL :** `https://n8n-pxlk.srv1480638.hstgr.cloud`
- En cas de problème de connexion, vérifiez que le serveur est en ligne

### 7.2 Voir les logs d'une exécution

1. Ouvrez le workflow concerné
2. Cliquez sur **Executions** dans le menu de gauche
3. Cliquez sur une exécution pour voir le détail nœud par nœud
4. Les nœuds verts ont réussi, les rouges ont échoué
5. Cliquez sur un nœud rouge pour voir le message d'erreur

### 7.3 Tester manuellement un workflow

Pour tester le workflow 93 sans attendre un formulaire :
1. Ouvrez le workflow 93
2. Cliquez sur le nœud **Social Forms Webhook**
3. Cliquez sur **Listen for test event**
4. Simulez un envoi de formulaire depuis Google Forms (mode **Aperçu**)

### 7.4 Réimporter un workflow depuis un fichier JSON

Si vous devez restaurer un workflow :
1. Dans n8n, cliquez sur **+ New workflow** → **Import from file**
2. Choisissez le fichier JSON correspondant dans `docs/transferai-admin/`
3. Vérifiez que le workflow est bien configuré (credentials, etc.)
4. Activez-le avec le bouton **Active**

### 7.5 Fichiers JSON des workflows

| Fichier | Workflow |
|---------|----------|
| `93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json` | Séquence principale |
| `94_n8n_Calendly_Meeting_Booked_Webhook_V1.json` | Détection rendez-vous |
| `95_n8n_Daily_Monitoring_Report_V1.json` | Rapport quotidien |
| `96_n8n_Resend_Email_Events_Webhook_V1.json` | Gestion bounces |
| `97_n8n_Zoho_Reply_Intelligence_V1.json` | Détection et classification des réponses |

---

## Récapitulatif rapide des vérifications à faire en priorité

En cas de doute, voici les cinq vérifications à faire dans l'ordre :

1. **Les cinq workflows 93, 94, 95, 96, 97 sont-ils actifs dans n8n ?**
2. **Le Google Apps Script du formulaire est-il actif ?**
3. **Y a-t-il des erreurs dans les exécutions récentes de n8n ?**
4. **Le webhook Calendly est-il enregistré et actif ?**
5. **Le webhook Resend est-il configuré avec les bons événements ?**
