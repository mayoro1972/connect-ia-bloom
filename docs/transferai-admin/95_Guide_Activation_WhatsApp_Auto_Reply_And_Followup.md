# Guide d'activation - WhatsApp auto-reply + relance RDV

Date : 18 juin 2026

## Objectif

Mettre en place un flux simple et exploitable tout de suite :

1. un prospect envoie un message WhatsApp
2. le système répond immédiatement avec un premier message de prise de contact
3. si le prospect ne répond pas encore, le système envoie automatiquement un second message avec proposition de rendez-vous

## Faut-il encore un workflow n8n ?

Non, pas pour cette version minimale.

Cette implémentation repose directement sur :

- `Twilio WhatsApp`
- `Supabase Edge Functions`
- `Supabase Cron`

Tu pourras ajouter `n8n` plus tard si tu veux :

- qualifier automatiquement le prospect avec IA
- router vers un humain selon le besoin
- enrichir le CRM
- pousser une logique de séquence plus avancée

Mais pour :

- `message 1` immédiat
- `message 2` de relance RDV

`n8n` n'est pas obligatoire.

## Fichiers concernés

- `supabase/functions/twilio-whatsapp-webhook/index.ts`
- `supabase/functions/whatsapp-followup-scheduler/index.ts`
- `supabase/functions/_shared/whatsapp-followups.ts`
- `supabase/migrations/20260618110000_create_whatsapp_followup_sequences.sql`
- `supabase/migrations/20260618111000_schedule_whatsapp_followup_scheduler.sql`

## Ce que fait désormais le système

### Premier message

Dès qu'un nouveau message entrant WhatsApp est reçu :

- il est stocké dans `whatsapp_inbound_messages`
- une notification interne email continue à partir
- une séquence de suivi est créée dans `whatsapp_followup_sequences`
- une réponse immédiate est renvoyée au prospect

### Deuxième message

Un scheduler tourne toutes les `15 minutes`.

Il vérifie les séquences en attente :

- si le prospect a déjà réécrit, la relance est annulée
- si le prospect n'a pas encore répondu et que le délai est écoulé, le second message est envoyé

## Messages par défaut

### Message 1

```text
Bonjour, merci pour votre message et votre intérêt pour TransferAI. Nous avons bien reçu votre demande. Pouvez-vous nous préciser en une phrase votre besoin principal afin que nous vous orientions rapidement ?
```

### Message 2

```text
Bonjour, je me permets de vous relancer. Si vous le souhaitez, vous pouvez déjà réserver un créneau d’échange avec notre équipe ici : https://calendly.com/marius-ayoro70/devis-quote-preparation-call. Si vous préférez, répondez simplement à ce message avec votre besoin principal.
```

## Variables d'environnement à renseigner

### Déjà nécessaires côté Twilio

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

### Nouvelles variables recommandées

- `WHATSAPP_BOOKING_LINK`
- `WHATSAPP_FOLLOWUP_DELAY_HOURS`
- `WHATSAPP_AUTO_REPLY_FIRST`
- `WHATSAPP_AUTO_REPLY_SECOND`
- `WHATSAPP_SCHEDULER_TOKEN`

## Valeurs recommandées

### `WHATSAPP_BOOKING_LINK`

```text
https://calendly.com/marius-ayoro70/devis-quote-preparation-call
```

### `WHATSAPP_FOLLOWUP_DELAY_HOURS`

Valeur conseillée :

```text
20
```

Pourquoi `20` :

- cela reste dans la fenêtre opérationnelle WhatsApp de 24h après le message entrant
- cela évite une relance trop agressive

Si tu veux une relance beaucoup plus rapide, tu peux mettre par exemple :

- `2`
- `4`
- `6`

mais il faut rester `< 24`.

### `WHATSAPP_AUTO_REPLY_FIRST`

Exemple :

```text
Bonjour{{PROFILE_SUFFIX}}, merci pour votre message et votre intérêt pour TransferAI. Nous avons bien reçu votre demande. Pouvez-vous nous préciser en une phrase votre besoin principal afin que nous vous orientions rapidement ?
```

### `WHATSAPP_AUTO_REPLY_SECOND`

Exemple :

```text
Bonjour{{PROFILE_SUFFIX}}, je me permets de vous relancer. Si vous le souhaitez, vous pouvez déjà réserver un créneau d’échange avec notre équipe ici : {{BOOKING_LINK}}. Si vous préférez, répondez simplement à ce message avec votre besoin principal.
```

Tokens disponibles :

- `{{PROFILE_SUFFIX}}`
- `{{PROFILE_NAME}}`
- `{{BOOKING_LINK}}`

## Secret Vault à prévoir pour le scheduler

Le cron SQL attend un secret Vault nommé :

```text
transferai_whatsapp_scheduler_token
```

Il doit correspondre à :

```text
WHATSAPP_SCHEDULER_TOKEN
```

Le cron réutilise aussi :

```text
transferai_project_url
```

## Comment activer concrètement

### 1. Déployer les migrations

Appliquer :

- `20260618110000_create_whatsapp_followup_sequences.sql`
- `20260618111000_schedule_whatsapp_followup_scheduler.sql`

### 2. Déployer les Edge Functions

Déployer :

- `twilio-whatsapp-webhook`
- `whatsapp-followup-scheduler`

### 3. Renseigner les variables côté Supabase

Au minimum :

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `WHATSAPP_SCHEDULER_TOKEN`
- `WHATSAPP_BOOKING_LINK`
- `WHATSAPP_FOLLOWUP_DELAY_HOURS`

### 4. Renseigner le secret Vault du cron

Créer ou mettre à jour :

- `transferai_whatsapp_scheduler_token`

### 5. Tester le flux

Test simple :

1. envoyer un message WhatsApp depuis un vrai numéro
2. vérifier l'apparition dans `whatsapp_inbound_messages`
3. vérifier la création dans `whatsapp_followup_sequences`
4. vérifier la réponse immédiate
5. ne pas répondre
6. attendre le délai configuré
7. vérifier l'envoi de la relance RDV

### 6. Vérifier le comportement si le prospect répond avant la relance

1. envoyer un premier message
2. recevoir le message automatique
3. répondre avant l'échéance
4. vérifier que la séquence passe en `prospect_replied`
5. vérifier qu'aucun second message n'est envoyé

## États de séquence

La table `whatsapp_followup_sequences` peut contenir :

- `pending_second_followup`
- `second_followup_sent`
- `prospect_replied`
- `opted_out`
- `closed`
- `error`

## Recommandation d'exploitation

La version la plus simple à lancer maintenant est :

1. `message 1` sans lien RDV
2. `message 2` avec lien Calendly

Ensuite seulement, si le flux marche bien, tu peux ajouter :

1. qualification IA
2. création automatique de lead CRM
3. routage humain
4. séquence `message 3`
5. adaptation du message selon le type de besoin

## Décision concrète recommandée

Pour lancer maintenant :

- ne pas attendre un workflow `n8n`
- garder `Zoho` pour l'interne et l'email
- utiliser `Twilio + Supabase` pour les deux premiers messages WhatsApp

Cela te donne le chemin le plus court entre :

- message entrant prospect
- premier accusé de réception
- deuxième relance de prise de rendez-vous

sans rajouter une couche technique de plus.
