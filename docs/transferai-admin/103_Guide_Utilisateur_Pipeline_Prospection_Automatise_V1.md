# Guide utilisateur — Pipeline de prospection automatisé TransferAI V1

**Version :** 2.0  
**Date :** 24 juin 2026  
**Auteur :** TransferAI  

---

## Comment utiliser ce guide

Ce guide est destiné à toute personne qui administre ou utilise le pipeline de prospection automatisé de TransferAI. Il couvre l'ensemble du fonctionnement, de la réception d'un prospect jusqu'au suivi des réponses et à la prise de rendez-vous.

**Pour trouver rapidement ce dont vous avez besoin :**
- Vous voulez comprendre comment fonctionne le système → section 1
- Vous voulez savoir ce qui se passe quand un formulaire est rempli → section 2
- Vous voulez suivre la séquence email d'un prospect → section 3
- Vous voulez comprendre les statuts CRM → section 4
- Vous voulez savoir ce que font les workflows n8n → section 5
- Vous voulez comprendre comment les réponses des prospects sont traitées → section 6
- Vous recevez un rapport quotidien et ne savez pas quoi faire → section 7
- Vous souhaitez agir manuellement sur un prospect → section 8

---

## 1. Vue d'ensemble du système

Le pipeline de prospection TransferAI est un système entièrement automatisé qui permet de :

1. **Recevoir des prospects** via Google Forms
2. **Les enregistrer** automatiquement dans la base de données Supabase
3. **Envoyer un premier email** dès la soumission du formulaire
4. **Relancer automatiquement** avec un deuxième puis un troisième email si le prospect ne répond pas
5. **Détecter et analyser les réponses entrantes** via la boîte Zoho Mail, grâce à l'intelligence artificielle
6. **Détecter les rendez-vous pris** via Calendly et stopper la séquence automatiquement
7. **Recevoir un rapport quotidien** par email avec l'état de tous les prospects

### Les outils utilisés

| Outil | Rôle |
|-------|------|
| **Google Forms** | Formulaire de capture des prospects |
| **Google Apps Script** | Pont entre Google Forms et n8n |
| **n8n** | Orchestration de tous les workflows automatisés |
| **Supabase** | Base de données des prospects (table `prospect_targets`) |
| **Resend** | Envoi des emails de prospection |
| **Zoho Mail** | Boîte de réception `contact@transferai.ci` — surveillance des réponses entrantes |
| **OpenAI GPT-4o-mini** | Classification automatique de l'intention des réponses reçues |
| **Calendly** | Prise de rendez-vous en ligne |

### Schéma de fonctionnement global

```
Formulaire Google Forms
        ↓
   n8n Workflow 93
        ↓
  Supabase (CRM)  ←──────────────────────────────┐
        ↓                                         │
  Mail 1 immédiat                                 │
        ↓ (si pas de réponse à J+4)               │
  Mail 2 (relance)                                │
        ↓ (si pas de réponse à J+7)               │
  Mail 3 (dernière relance)                       │
        │                                         │
        │  Le prospect répond par email           │
        ↓                                         │
  Zoho Mail (IMAP)                                │
        ↓                                         │
  n8n Workflow 97 — Zoho Reply Intelligence       │
        ↓                                         │
  OpenAI classifie la réponse                     │
        ↓                        ↓                │
  Handoff humain          Réponse automatique     │
  → Admin notifié         → Email envoyé          │
  → Statut mis à jour ───────────────────────────-┘
```

---

## 2. Ce qui se passe quand un prospect remplit un formulaire

### Étape par étape

**1. Le prospect remplit le formulaire Google Forms**

Deux formulaires existent :
- Formulaire formation secrétaires / assistants de direction
- Formulaire services IA pour entreprises

**2. Google Apps Script envoie les données à n8n**

Dès la soumission, le script déclenche automatiquement un appel vers le webhook n8n :
```
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/google-forms-social-leads
```

**3. n8n normalise les données**

Le workflow identifie :
- Le type de formulaire (`assistant_training_interest` ou `enterprise_ai_interest`)
- Le nom, l'adresse email, le téléphone, la fonction
- La température du lead (`hot`, `warm`, `cool`)
- L'autorisation d'envoyer trois emails (`allow_third_email`)

**4. Le prospect est créé ou mis à jour dans Supabase**

Si le prospect existe déjà (même adresse email dans la colonne `target_email`), sa fiche est mise à jour sans créer de doublon.

**5. Le premier email est envoyé immédiatement**

L'email contient :
- Un message personnalisé selon le type de formulaire
- Le lien de rendez-vous Calendly : `https://calendly.com/contact-transferai/30min`

**6. Une alerte admin est envoyée à `contact@transferai.ci`**

L'alerte indique le nom, l'adresse email, la priorité et les besoins du prospect.

---

## 3. Suivi de la séquence email

### Calendrier des envois

| Email | Déclencheur | Délai |
|-------|-------------|-------|
| **Mail 1** | Dès la soumission du formulaire | Immédiat |
| **Mail 2** | Si aucune réponse reçue | J+4 après le mail 1 |
| **Mail 3** | Si aucune réponse reçue et `allow_third_email = true` | J+7 après le mail 2 |

### Conditions d'arrêt automatique de la séquence

La séquence s'arrête automatiquement dans les cas suivants :

- Le prospect réserve un rendez-vous sur Calendly → statut `meeting_booked`
- Le prospect répond et la réponse nécessite une intervention humaine → statut `human_handoff_required`
- Le prospect répond et une réponse automatique est envoyée → statut `replied`
- L'email est rejeté (bounce) → statut `closed_no_reply`, `stop_reason = email_bounced`
- Le prospect marque l'email comme spam → statut `closed_no_reply`, `stop_reason = email_complained`
- Les trois emails ont été envoyés sans réponse → statut `closed_no_reply`

**Important :** Les prospects dont le statut est `replied`, `human_handoff_required` ou `meeting_booked` sont automatiquement exclus des relances. Le workflow 93 ne leur enverra plus aucun email.

### Vérification dans Supabase

Pour consulter l'état d'un prospect, utilisez la table `prospect_targets` dans Supabase. Les colonnes principales sont :

| Colonne | Ce qu'elle indique |
|---------|-------------------|
| `target_email` | Adresse email du prospect (colonne de référence) |
| `status` | Statut actuel du prospect |
| `social_email_1_sent_at` | Date d'envoi du mail 1 |
| `social_email_2_sent_at` | Date d'envoi du mail 2 |
| `social_email_3_sent_at` | Date d'envoi du mail 3 |
| `next_action_at` | Date prévue du prochain envoi |
| `meeting_booked_at` | Date de réservation du rendez-vous |
| `paused` | `true` si la séquence est suspendue |
| `source_payload` | Données brutes du formulaire (contient `form_type`, etc.) |

---

## 4. Nomenclature des statuts CRM

| Statut | Signification | Séquence email |
|--------|--------------|----------------|
| `ready` | Prospect en attente de traitement | En attente |
| `active` | Prospect actif, séquence en cours | Active |
| `meeting_invited` | Mail 1 envoyé avec lien de rendez-vous | En cours |
| `followup_pending` | Mail 2 envoyé, en attente de réponse | En cours |
| `replied` | Le prospect a répondu — réponse automatique envoyée | **Stoppée** |
| `human_handoff_required` | Réponse reçue nécessitant une intervention humaine | **Stoppée** |
| `meeting_booked` | Rendez-vous réservé via Calendly | **Stoppée** |
| `closed_no_reply` | Séquence terminée sans réponse | **Stoppée** |
| `closed_won` | Prospect converti en client (action manuelle) | **Stoppée** |
| `closed_lost` | Prospect perdu (action manuelle) | **Stoppée** |

---

## 5. Les cinq workflows n8n

### Workflow 93 — Séquence Google Forms

**Fichier :** `93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json`

Ce workflow gère tout le cycle de prospection :
- Réception du formulaire Google Forms via webhook
- Création ou mise à jour du prospect dans Supabase
- Envoi du mail 1 immédiatement après soumission
- Envoi des mails 2 et 3 via un cron horaire (lundi au samedi)
- Mise à jour du statut CRM après chaque envoi

**Exclusion automatique des prospects inactifs :** Le workflow ne traite que les prospects dont le statut est `ready` ou `active`. Les statuts `replied`, `human_handoff_required` et `meeting_booked` sont automatiquement exclus de la file de relance.

**Déclencheurs :**
- Webhook : nouveau formulaire soumis
- Cron : toutes les heures, du lundi au samedi

---

### Workflow 94 — Calendly Rendez-vous

**Fichier :** `94_n8n_Calendly_Meeting_Booked_Webhook_V1.json`

Ce workflow détecte automatiquement chaque réservation de rendez-vous Calendly et :
- Identifie le prospect par son adresse email
- Met son statut à `meeting_booked`
- Suspend sa séquence (`paused = true`)
- Envoie une alerte email à l'administrateur

**Déclencheur :** Webhook Calendly (événement `invitee.created`)

---

### Workflow 95 — Rapport quotidien

**Fichier :** `95_n8n_Daily_Monitoring_Report_V1.json`

Ce workflow envoie chaque matin à 7h00 (lundi–samedi) un email à `contact@transferai.ci` contenant :
- Le nombre de nouveaux prospects des dernières 24 heures
- Le nombre d'emails envoyés par étape (mail 1 / mail 2 / mail 3)
- Le nombre de rendez-vous réservés
- Les prospects bloqués (mail 1 non envoyé malgré une date d'action dépassée)

**Déclencheur :** Cron `0 7 * * 1-6`

---

### Workflow 96 — Gestion des bounces Resend

**Fichier :** `96_n8n_Resend_Email_Events_Webhook_V1.json`

Ce workflow reçoit les événements de la plateforme Resend (bounce, complaint) et :
- Identifie le prospect concerné via les tags inclus dans l'email
- Suspend la séquence immédiatement
- Met le statut à `closed_no_reply` avec la raison appropriée (`email_bounced` ou `email_complained`)

**Déclencheur :** Webhook Resend

---

### Workflow 97 — Zoho Reply Intelligence

**Fichier :** `97_n8n_Zoho_Reply_Intelligence_V1.json`

Ce workflow surveille en continu la boîte de réception Zoho Mail (`contact@transferai.ci`) via IMAP et traite automatiquement toutes les réponses entrantes des prospects.

**Connexion Zoho Mail :** Le workflow utilise une connexion IMAP avec un mot de passe d'application Zoho (App Password), distinct du mot de passe principal. Serveur : `imap.zoho.eu`, port 993, SSL activé.

**Déroulement du traitement :**

1. **Détection** — Polling IMAP toutes les minutes sur la boîte `contact@transferai.ci`, filtre `UNSEEN` (emails non lus uniquement)
2. **Filtrage** — Les emails automatiques sont ignorés : no-reply, noreply, mailer-daemon, ainsi que les adresses internes TransferAI
3. **Identification** — Le prospect est recherché dans Supabase par son adresse email (`target_email`)
4. **Si l'adresse est inconnue** — Le traitement s'arrête (email ignoré)
5. **Classification IA** — OpenAI GPT-4o-mini analyse le texte de la réponse et détermine l'intention parmi : `interested`, `not_interested`, `question`, `out_of_office`, `already_client`, `other`
6. **Décision de handoff** — Si l'intention est `interested`, `question` ou `already_client`, un handoff humain est déclenché ; sinon une réponse automatique est envoyée

**En cas de handoff humain :**
- L'administrateur reçoit un email de notification à `contact@transferai.ci` avec le nom du prospect, son organisation, son message original et la réponse suggérée par l'IA
- Le prospect est mis en pause dans Supabase (`paused = true`)
- Le statut est mis à `human_handoff_required`

**En cas de réponse automatique :**
- Un email de réponse généré par l'IA est envoyé directement au prospect
- Le statut est mis à `replied`
- Le prospect est mis en pause pour ne plus recevoir de relances

**Déclencheur :** Polling IMAP toutes les minutes

---

## 6. Traitement des réponses entrantes — Guide pas à pas

### Ce qui se passe quand un prospect répond

Lorsqu'un prospect répond à l'un de vos emails de prospection, voici le déroulement complet :

**Étape 1 — Détection**
Le workflow 97 détecte l'email entrant dans la boîte `contact@transferai.ci` dans la minute qui suit la réception.

**Étape 2 — Identification du prospect**
Le système recherche l'adresse email de l'expéditeur dans la table `prospect_targets` de Supabase. Si l'adresse n'est pas reconnue, l'email est ignoré.

**Important :** Le système identifie le prospect par l'adresse email enregistrée dans le CRM, indépendamment du nom affiché dans l'email. Si un prospect répond depuis une adresse différente de celle enregistrée, il ne sera pas identifié.

**Étape 3 — Analyse de l'intention**
L'IA analyse le contenu de la réponse et lui attribue une intention :

| Intention | Description | Action déclenchée |
|-----------|-------------|-------------------|
| `interested` | Le prospect est intéressé et souhaite en savoir plus | Handoff humain |
| `question` | Le prospect pose une question précise | Handoff humain |
| `already_client` | Le prospect est déjà client | Handoff humain |
| `not_interested` | Le prospect décline | Réponse automatique |
| `out_of_office` | Message d'absence | Réponse automatique |
| `other` | Réponse non classifiable | Réponse automatique |

**Étape 4 — Action**

Si handoff humain : vous recevez un email de notification à `contact@transferai.ci` avec :
- Le nom et l'organisation du prospect
- Le message original reçu
- Une réponse suggérée par l'IA, prête à envoyer ou à adapter

Si réponse automatique : le prospect reçoit une réponse personnalisée générée par l'IA, adaptée à son intention.

**Étape 5 — Mise à jour du CRM**
Le statut du prospect est mis à jour dans Supabase et la séquence de relances est stoppée.

### Ce que vous devez faire après une notification de handoff

1. Lisez l'email de notification reçu à `contact@transferai.ci`
2. Consultez la réponse suggérée par l'IA
3. Adaptez-la à votre convenance et répondez directement au prospect depuis votre boîte Zoho Mail
4. Une fois le prospect traité, mettez à jour son statut manuellement dans Supabase si nécessaire (par exemple `closed_won` si une vente est conclue)

---

## 7. Comprendre le rapport quotidien

Chaque matin, vous recevez un email avec le sujet :
- `✅ Rapport quotidien TransferAI — [date] | X leads · Y emails · Z RDV` si tout est nominal
- `⚠ Rapport quotidien TransferAI — [date] | X leads · Y emails · Z RDV` si des points nécessitent votre attention

### Ce que chaque section signifie

**Nouveaux leads (24h)**  
Nombre de prospects qui ont rempli un formulaire la veille. Si ce chiffre est à zéro plusieurs jours de suite, vérifiez que le Google Apps Script est actif.

**Emails envoyés (24h)**  
Répartition des emails par étape. Si le total est à zéro mais qu'il y a des prospects actifs, vérifiez l'état du workflow 93.

**RDV réservés (24h)**  
Nombre de rendez-vous pris via Calendly. Si un rendez-vous apparaît ici, le prospect a déjà été automatiquement mis à `meeting_booked`.

**Leads bloqués**  
Prospects dont le mail 1 n'a pas encore été envoyé malgré une date d'action dépassée. Ce cas indique généralement un problème d'envoi Resend ou un prospect mal qualifié.

---

## 8. Actions manuelles disponibles

Certaines actions ne sont pas automatisées et doivent être réalisées manuellement dans Supabase.

**Important :** La colonne email dans Supabase s'appelle `target_email` (et non `email`).

### Actions courantes

| Action | Requête SQL à exécuter dans Supabase |
|--------|--------------------------------------|
| Marquer un prospect comme gagné | `UPDATE prospect_targets SET status = 'closed_won', paused = true WHERE target_email = 'email@exemple.com';` |
| Marquer un prospect comme perdu | `UPDATE prospect_targets SET status = 'closed_lost', paused = true WHERE target_email = 'email@exemple.com';` |
| Reprendre la séquence d'un prospect | `UPDATE prospect_targets SET paused = false, next_action_at = NOW() WHERE target_email = 'email@exemple.com';` |
| Bloquer un prospect définitivement | `UPDATE prospect_targets SET do_not_contact = true, paused = true WHERE target_email = 'email@exemple.com';` |
| Réinitialiser la séquence complète | Voir ci-dessous |

### Réinitialiser complètement un prospect

```sql
UPDATE prospect_targets
SET status         = 'active',
    paused         = false,
    sequence_step  = 0,
    last_sequence_result    = null,
    social_email_1_sent_at  = null,
    social_email_2_sent_at  = null,
    social_email_3_sent_at  = null,
    next_action_at = NOW()
WHERE target_email = 'email@exemple.com';
```

### Forcer manuellement un statut de handoff résolu

Après avoir traité un prospect en statut `human_handoff_required` :

```sql
UPDATE prospect_targets
SET status = 'closed_won',
    paused = true
WHERE target_email = 'email@exemple.com';
```

### Reprendre la séquence après une réponse automatique

Si un prospect avait reçu une réponse automatique (`replied`) et souhaite continuer la conversation :

```sql
UPDATE prospect_targets
SET status         = 'active',
    paused         = false,
    next_action_at = NOW() + INTERVAL '1 day'
WHERE target_email = 'email@exemple.com';
```
