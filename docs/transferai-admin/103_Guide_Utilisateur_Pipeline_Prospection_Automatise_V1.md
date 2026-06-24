# Guide utilisateur — Pipeline de prospection automatisé TransferAI V1

**Version :** 1.0  
**Date :** 24 juin 2026  
**Auteur :** TransferAI  

---

## Comment utiliser ce guide

Ce guide est destiné à toute personne qui administre ou utilise le pipeline de prospection automatisé de TransferAI. Il couvre l'ensemble du fonctionnement, de la réception d'un prospect jusqu'à la prise de rendez-vous.

**Pour trouver rapidement ce dont vous avez besoin :**
- Vous voulez comprendre comment fonctionne le système → lisez la section 1
- Vous voulez savoir ce qui se passe quand un formulaire est rempli → section 2
- Vous voulez suivre l'état d'un prospect → section 3
- Vous voulez comprendre les statuts CRM → section 4
- Vous voulez savoir ce que font les workflows n8n → section 5
- Vous recevez un rapport quotidien et ne savez pas quoi faire → section 6

---

## 1. Vue d'ensemble du système

Le pipeline de prospection TransferAI est un système entièrement automatisé qui permet de :

1. **Recevoir des prospects** via Google Forms
2. **Les enregistrer** automatiquement dans la base de données Supabase
3. **Envoyer un premier email** dès la soumission du formulaire
4. **Relancer automatiquement** avec un deuxième puis un troisième email si le prospect ne répond pas
5. **Détecter les rendez-vous pris** via Calendly et stopper la séquence automatiquement
6. **Recevoir un rapport quotidien** par email avec l'état de tous les prospects

### Les outils utilisés

| Outil | Rôle |
|-------|------|
| **Google Forms** | Formulaire de capture des prospects |
| **Google Apps Script** | Pont entre Google Forms et n8n |
| **n8n** | Orchestration de tous les workflows automatisés |
| **Supabase** | Base de données des prospects (table `prospect_targets`) |
| **Resend** | Envoi des emails |
| **Calendly** | Prise de rendez-vous |

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
- Le nom, l'email, le téléphone, la fonction
- La température du lead (`hot`, `warm`, `cool`)
- L'autorisation d'envoyer trois emails (`allow_third_email`)

**4. Le prospect est créé ou mis à jour dans Supabase**

Si le prospect existe déjà (même email), sa fiche est mise à jour sans doublon.

**5. Le premier email est envoyé immédiatement**

L'email contient :
- Un message personnalisé selon le type de formulaire
- Le lien de rendez-vous Calendly : `https://calendly.com/contact-transferai/30min`

**6. Une alerte admin est envoyée à `contact@transferai.ci`**

L'alerte indique le nom, l'email, la priorité et les besoins du prospect.

---

## 3. Suivi de la séquence email

### Calendrier des envois

| Email | Déclencheur | Délai |
|-------|-------------|-------|
| **Mail 1** | Dès la soumission du formulaire | Immédiat |
| **Mail 2** | Si pas de réponse | J+4 après mail 1 |
| **Mail 3** | Si pas de réponse et `allow_third_email = true` | J+7 après mail 2 |

### Conditions d'arrêt automatique

La séquence s'arrête automatiquement dans les cas suivants :

- ✅ Le prospect réserve un rendez-vous sur Calendly → statut `meeting_booked`
- ✅ L'email est rejeté (bounce) → statut `closed_no_reply`, `stop_reason = email_bounced`
- ✅ Le prospect marque l'email comme spam → statut `closed_no_reply`, `stop_reason = email_complained`
- ✅ Les trois emails ont été envoyés sans réponse → statut `closed_no_reply`

### Vérification dans Supabase

Pour voir l'état d'un prospect, consultez la table `prospect_targets` dans Supabase avec les colonnes suivantes :

| Colonne | Ce qu'elle indique |
|---------|-------------------|
| `status` | Statut actuel du prospect |
| `social_email_1_sent_at` | Date d'envoi du mail 1 |
| `social_email_2_sent_at` | Date d'envoi du mail 2 |
| `social_email_3_sent_at` | Date d'envoi du mail 3 |
| `next_action_at` | Quand le prochain email sera envoyé |
| `meeting_booked_at` | Date de réservation du rendez-vous |
| `paused` | `true` si la séquence est suspendue |

---

## 4. Nomenclature des statuts CRM

| Statut | Signification |
|--------|--------------|
| `active` | Prospect actif, séquence en cours |
| `meeting_invited` | Mail 1 envoyé avec lien de rendez-vous |
| `followup_pending` | Mail 2 envoyé, en attente de réponse |
| `replied` | Le prospect a répondu — réponse auto envoyée |
| `human_handoff_required` | Réponse du prospect nécessite intervention humaine |
| `meeting_booked` | Rendez-vous réservé via Calendly |
| `closed_no_reply` | Séquence terminée sans réponse |
| `closed_won` | Prospect converti (à mettre manuellement) |
| `closed_lost` | Prospect perdu (à mettre manuellement) |

---

## 5. Les cinq workflows n8n

### Workflow 93 — Séquence Google Forms

**Fichier :** `93_n8n_Google_Forms_Social_Lead_Sequence_V2_Clean_Importable.json`

Ce workflow gère tout le cycle de prospection :
- Réception du formulaire Google Forms
- Création du prospect dans Supabase
- Envoi du mail 1 immédiat
- Envoi des mails 2 et 3 via le cron horaire (lundi au samedi)
- Mise à jour du statut après chaque envoi

**Déclencheurs :**
- Webhook : nouveau formulaire soumis
- Cron : toutes les heures (lundi–samedi) pour les relances

### Workflow 94 — Calendly Rendez-vous

**Fichier :** `94_n8n_Calendly_Meeting_Booked_Webhook_V1.json`

Ce workflow détecte automatiquement chaque réservation de rendez-vous Calendly et :
- Identifie le prospect par son email
- Met son statut à `meeting_booked`
- Suspend sa séquence (`paused = true`)
- Envoie une alerte email à l'administrateur

### Workflow 95 — Rapport quotidien

**Fichier :** `95_n8n_Daily_Monitoring_Report_V1.json`

Ce workflow envoie chaque matin à 7h00 (lundi–samedi) un email à `contact@transferai.ci` contenant :
- Le nombre de nouveaux prospects des dernières 24h
- Le nombre d'emails envoyés par étape (mail 1 / mail 2 / mail 3)
- Le nombre de rendez-vous réservés
- Les prospects bloqués (mail 1 non envoyé malgré `next_action_at` dépassé)

### Workflow 96 — Resend Bounces

**Fichier :** `96_n8n_Resend_Email_Events_Webhook_V1.json`

Ce workflow reçoit les événements de Resend (bounce, complaint) et :
- Identifie le prospect concerné via les tags de l'email
- Suspend la séquence immédiatement
- Met le statut à `closed_no_reply` avec la raison appropriée

### Workflow 97 — Zoho Reply Intelligence

**Fichier :** `97_n8n_Zoho_Reply_Intelligence_V1.json`

Ce workflow surveille la boîte Zoho Mail (`contact@transferai.ci`) via IMAP et :
- Détecte chaque nouveau email entrant (filtre `UNSEEN`)
- Ignore les emails automatiques (no-reply, mailer-daemon, etc.)
- Identifie le prospect par son adresse email dans Supabase
- Classe la réponse avec OpenAI GPT-4o-mini (intention : `interested`, `not_interested`, `question`, `out_of_office`, `already_client`, `other`)
- **Si handoff humain requis** : notifie l'admin avec un résumé IA, met le prospect en pause avec statut `human_handoff_required`
- **Sinon** : envoie une réponse automatique personnalisée et met le statut à `replied`

**Déclencheur :** Polling IMAP toutes les minutes

---

## 6. Comprendre le rapport quotidien

Chaque matin, vous recevez un email avec le sujet :
- `✅ Rapport quotidien TransferAI — [date] | X leads · Y emails · Z RDV` si tout est nominal
- `⚠ Rapport quotidien TransferAI — [date] | X leads · Y emails · Z RDV` si des points nécessitent votre attention

### Ce que chaque section signifie

**Nouveaux leads (24h)**
Nombre de prospects qui ont rempli un formulaire hier. Si ce chiffre est à zéro plusieurs jours de suite, vérifiez que le Google Apps Script est actif.

**Emails envoyés (24h)**
Répartition des emails par étape. Si le total est à zéro mais qu'il y a des prospects actifs, vérifiez l'état du workflow 93.

**RDV réservés (24h)**
Nombre de rendez-vous pris via Calendly. Si un RDV apparaît ici, le prospect a déjà été automatiquement mis à `meeting_booked`.

**Leads bloqués**
Prospects dont le mail 1 n'a pas encore été envoyé malgré une date d'action dépassée. Ce cas indique généralement un problème d'envoi Resend ou un prospect mal qualifié.

---

## 7. Actions manuelles disponibles

Certaines actions ne sont pas automatisées et doivent être faites manuellement dans Supabase :

| Action | Comment faire |
|--------|--------------|
| Marquer un prospect comme gagné | Mettre `status = closed_won` dans Supabase |
| Marquer un prospect comme perdu | Mettre `status = closed_lost` dans Supabase |
| Reprendre la séquence d'un prospect | Mettre `paused = false` et `next_action_at = maintenant` |
| Bloquer un prospect définitivement | Mettre `do_not_contact = true` |
| Réinitialiser la séquence | Mettre `last_sequence_result = null` et les trois `social_email_X_sent_at = null` |
