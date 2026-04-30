# Guide Administrateur No1

## 1. Objet du guide

Ce guide décrit le fonctionnement réel du **BackOffice TransferAI Africa** tel qu’il existe aujourd’hui sur le site et dans le backend Supabase.

Il répond à 4 questions :

1. **Comment accéder au back-office et au backend**
2. **À quoi sert chaque rubrique**
3. **Quels rôles opérationnels couvrir**
4. **Comment exploiter la plateforme sans casser les flux déjà en production**

Ce document est destiné en priorité à l’**administrateur principal** et aux personnes amenées à gérer :
- les contenus
- les leads
- les partenaires
- la newsletter
- les webinaires
- les capsules vidéo
- les messages WhatsApp

---

## 2. Mission de l’administrateur No1

L’administrateur No1 n’est pas seulement “celui qui publie”.

Il garantit que la plateforme reste :
- cohérente éditorialement
- crédible commercialement
- claire pour les visiteurs
- fiable techniquement
- traçable côté back-office

Ses responsabilités principales sont :

1. gouvernance des contenus et des CTA
2. supervision du back-office public
3. suivi des leads et conversations entrantes
4. contrôle léger des déploiements et des accès
5. coordination avec les autres administrateurs métiers
6. documentation des procédures pour l’équipe

---

## 3. Accès au back-office et au backend

### 3.1. Accès back-office public

URL de production :

- [https://www.transferai.ci/back-office](https://www.transferai.ci/back-office)

Des onglets précis peuvent être ouverts directement avec `?tab=...`, par exemple :

- [https://www.transferai.ci/back-office?tab=whatsapp](https://www.transferai.ci/back-office?tab=whatsapp)
- [https://www.transferai.ci/back-office?tab=newsletters](https://www.transferai.ci/back-office?tab=newsletters)
- [https://www.transferai.ci/back-office?tab=partners](https://www.transferai.ci/back-office?tab=partners)

### 3.2. Accès local pour l’équipe technique

Le back-office peut aussi être ouvert localement pendant les développements :

- `http://127.0.0.1:<port>/back-office`

Exemple utilisé pendant les validations récentes :

- `http://127.0.0.1:4182/back-office?tab=whatsapp`

### 3.3. Token administrateur

Le back-office public fonctionne avec un **token administrateur**.

Le token attendu côté backend est :

- `CONTENT_ADMIN_TOKEN`

Il est vérifié dans l’edge function :

- [`/Users/marius_ayoro/.codex/worktrees/4df6/connect-ia-bloom/supabase/functions/content-admin/index.ts`](/Users/marius_ayoro/.codex/worktrees/4df6/connect-ia-bloom/supabase/functions/content-admin/index.ts)

Bonnes pratiques :
- ne jamais partager ce token dans un email non sécurisé
- éviter les copier-coller dans des documents ouverts
- changer le token si un doute existe sur sa diffusion

### 3.4. Accès backend / base de données

Le backend principal est hébergé sur **Supabase**.

Accès :
- dashboard Supabase du projet
- `Table Editor`
- `Edge Functions`
- `Secrets`
- `SQL Editor`

Le backend est utilisé pour :
- stocker les demandes
- stocker les messages WhatsApp
- gérer les éditions newsletter
- gérer les partenaires
- gérer les flux vidéo
- exécuter les edge functions

### 3.5. Accès Twilio / WhatsApp

Twilio est utilisé pour :
- recevoir les messages WhatsApp
- déclencher le webhook entrant

Le sender WhatsApp actuellement validé est :
- `+2250716573990`

### 3.6. Accès Resend / Emails

Resend est utilisé pour :
- les notifications email admin
- les emails partenaires
- les emails catalogue / prospects
- la newsletter
- les notifications WhatsApp internes

### 3.7. Accès Cloudflare / site public

Cloudflare sert la version publique de :
- [https://www.transferai.ci](https://www.transferai.ci)

À retenir :
- un changement peut être commité sur GitHub sans être visible si `main` n’est pas à jour
- il faut toujours vérifier la version réellement servie

---

## 4. Vue d’ensemble des rôles opérationnels

Le système n’a pas encore une séparation technique de rôles par profil utilisateur dans le back-office.  
En pratique, les rôles sont **opérationnels**.

### 4.1. Administrateur No1

Responsable de :
- l’accès au back-office
- la supervision globale
- la validation finale avant publication
- le suivi des incidents
- les décisions de mise en production

### 4.2. Responsable contenus

Responsable de :
- `Ressources`
- `Brouillons IA`
- `Capsules vidéo`
- relecture des textes visibles

### 4.3. Responsable newsletter

Responsable de :
- `Newsletter IA`
- validation éditoriale
- envoi test
- approbation
- suivi des rappels du jeudi

### 4.4. Responsable prospects / audit

Responsable de :
- `Prospects Audit`
- qualification des demandes
- suivi du portail prospect
- relances

### 4.5. Responsable partenaires

Responsable de :
- `Partenaires IA`
- revue des demandes
- recommandation de formule
- suivi de réponse commerciale

### 4.6. Responsable WhatsApp / relation entrante

Responsable de :
- `WhatsApp`
- lecture des messages entrants
- qualification
- notes internes
- réponse manuelle sur WhatsApp

### 4.7. Responsable événements / webinaires

Responsable de :
- `Webinaires`
- `Formats live IA`
- inscriptions
- suivi des demandes liées aux lives

### 4.8. Responsable opportunités / mise en relation

Responsable de :
- `Emplois IA`
- opportunités
- flux “parler emploi”
- publication / statut

---

## 5. Rubriques du back-office et rôle de chacune

Les onglets actuellement visibles dans le back-office sont :

- `Analytics`
- `Prospects Audit`
- `Ressources`
- `Brouillons IA`
- `Partenaires IA`
- `Newsletter IA`
- `Capsules vidéo`
- `WhatsApp`
- `Emplois IA`
- `Webinaires`
- `Formats live IA`
- `Mode d'emploi`

### 5.1. Analytics

Objectif :
- suivre le trafic
- suivre les demandes
- suivre les inscriptions

Ce que l’admin y voit :
- vues globales
- vues récentes
- leads
- inscriptions
- top domaines
- top pages
- tendance 7 jours

Usage recommandé :
- vérifier chaque semaine les pages les plus consultées
- repérer les CTA qui performent
- repérer les demandes qui montent

### 5.2. Prospects Audit

Objectif :
- suivre les demandes liées à l’audit IA
- suivre l’activation du portail prospect
- suivre les relances

Ce qu’on y traite :
- total des demandes
- suivis en attente
- portails actifs

Rôle principal :
- **responsable prospects / audit**

### 5.3. Ressources

Objectif :
- publier les ressources éditoriales du site

Ce qu’on peut faire :
- créer un contenu
- définir le slug
- choisir la catégorie
- renseigner les titres FR / EN
- renseigner les extraits et contenus
- définir le statut

Statuts habituels :
- `published`
- `draft`
- `archived`

Rôle principal :
- **responsable contenus**

### 5.4. Brouillons IA

Objectif :
- piloter la veille, les signaux détectés et les brouillons issus des flux IA

Ce qu’on y traite :
- `source_feeds`
- `source_signals`
- `resource_posts` avec statut éditorial
- `editorial_jobs`

Ce qu’on y fait :
- vérifier les flux sources
- relire les signaux
- relire les brouillons
- changer les statuts

Rôle principal :
- **responsable contenus**

### 5.5. Partenaires IA

Objectif :
- traiter les demandes partenaires reçues depuis le site
- recommander une formule
- préparer la réponse

Ce qu’on y trouve :
- la grille officielle des formules
- les règles de décision IA
- les templates email
- les demandes en revue
- le journal d’envoi

Rôle principal :
- **responsable partenaires**

### 5.6. Newsletter IA

Objectif :
- créer, relire, tester, approuver et suivre les éditions newsletter

Ce qu’on y traite :
- les abonnements actifs
- les brouillons / éditions
- les envois récents
- les tests

Règle d’exploitation importante :
- génération hebdomadaire
- validation humaine obligatoire avant envoi final
- rappels automatiques le jeudi à `12:00` et `18:00`

Rôle principal :
- **responsable newsletter**

### 5.7. Capsules vidéo

Objectif :
- gérer les capsules vidéo publiées ou brouillons, notamment TikTok

Ce qu’on y fait :
- créer une capsule
- modifier titre / résumé / lien
- définir la capsule mise en avant
- alimenter le feed vidéo du site

Rôle principal :
- **responsable contenus**

### 5.8. WhatsApp

Objectif :
- suivre les messages entrants WhatsApp depuis le site
- les qualifier
- ajouter des notes
- répondre rapidement

Ce qu’on y voit :
- volume total
- non lus
- à traiter
- audit IA

Ce qu’on peut faire :
- filtrer
- ouvrir une fiche
- changer le statut
- changer la catégorie
- ajouter une note interne
- cliquer sur `Répondre sur WhatsApp`

Rôle principal :
- **responsable WhatsApp / relation entrante**

### 5.9. Emplois IA

Objectif :
- gérer les opportunités emploi / mission / stage

Ce qu’on peut faire :
- créer une opportunité
- définir le marché
- définir le type d’opportunité
- choisir le mode de travail
- publier ou garder en brouillon

Rôle principal :
- **responsable opportunités**

### 5.10. Webinaires

Objectif :
- centraliser les inscriptions et demandes liées aux webinaires

Rôle principal :
- **responsable événements**

### 5.11. Formats live IA

Objectif :
- piloter les séminaires et formats live

Rôle principal :
- **responsable événements**

### 5.12. Mode d’emploi

Objectif :
- servir de rappel de fonctionnement dans le back-office

Rôle principal :
- **Administrateur No1**

---

## 6. Comment accéder au backend selon le besoin

### 6.1. Pour gérer le site sans toucher à la base

Utiliser :
- le **BackOffice public**

Cas typiques :
- changer un statut
- traiter un message WhatsApp
- relire une newsletter
- publier un contenu

### 6.2. Pour vérifier les données brutes

Utiliser :
- **Supabase > Table Editor**

Tables fréquentes :
- `contact_requests`
- `registration_requests`
- `resource_posts`
- `job_opportunities`
- `newsletter_issues`
- `newsletter_delivery_logs`
- `partner_listing_reviews`
- `partner_followup_jobs`
- `social_video_posts`
- `whatsapp_inbound_messages`
- `whatsapp_email_notification_logs`

### 6.3. Pour vérifier les traitements automatiques

Utiliser :
- **Supabase > Edge Functions**

Functions principales :
- `content-admin`
- `twilio-whatsapp-webhook`
- `newsletter-drafter`
- `newsletter-send`
- `newsletter-scheduler`
- `partner-review-drafter`
- `partner-followup-send`
- `webinar-notify`
- `webinar-admin-weekly-digest`

### 6.4. Pour vérifier les messages WhatsApp reçus

Utiliser :
- **Twilio > Monitor > Logs > Messaging**
- puis **Supabase > `whatsapp_inbound_messages`**
- puis **BackOffice > WhatsApp**

### 6.5. Pour vérifier les emails déclenchés

Utiliser :
- **Resend > Logs**
- puis **Supabase**
  - `newsletter_delivery_logs`
  - `prospect_email_delivery_logs`
  - `whatsapp_email_notification_logs`

---

## 7. Flux clés à connaître

### 7.1. Flux WhatsApp

Flux réel :

1. le visiteur clique sur le bouton WhatsApp du site
2. le message est envoyé à `+2250716573990`
3. Twilio le reçoit
4. Twilio appelle `twilio-whatsapp-webhook`
5. le message est stocké dans `whatsapp_inbound_messages`
6. une notification email interne est envoyée
7. une ligne de log email est écrite dans `whatsapp_email_notification_logs`
8. le message devient visible dans `BackOffice > WhatsApp`

### 7.2. Flux newsletter

Flux réel :

1. génération du brouillon newsletter
2. statut `review`
3. rappels de validation le jeudi
4. validation humaine
5. envoi test
6. approbation / scheduled
7. envoi final

### 7.3. Flux partenaires

1. le prospect soumet son formulaire
2. la demande arrive en base
3. le back-office charge la demande
4. l’IA recommande une formule
5. l’administrateur relit
6. la réponse est approuvée
7. l’email est envoyé
8. le journal d’envoi est mis à jour

### 7.4. Flux capsules vidéo

1. une capsule TikTok / vidéo est ajoutée
2. la capsule est stockée
3. la capsule mise en avant est choisie
4. le site lit le feed dynamique

---

## 8. Procédure standard d’exploitation

### Chaque jour ouvré

- vérifier `WhatsApp`
- vérifier `Prospects Audit`
- vérifier `Partenaires IA`
- vérifier les erreurs visibles sur les pages commerciales
- vérifier si des campagnes ou réponses sont en attente

### Chaque semaine

- vérifier `Newsletter IA`
- envoyer un test si nécessaire
- valider ou reclasser l’édition
- vérifier `Capsules vidéo`
- vérifier `Brouillons IA`

### Chaque mois

- revoir les CTA principaux
- revoir les secrets et tokens
- revoir les logs email
- revoir les pages les plus consultées
- mettre à jour la documentation admin si un flux a changé

---

## 9. Gestion des incidents les plus fréquents

### 9.1. Le back-office ne charge pas

Vérifier :
- token admin correct
- présence de `CONTENT_ADMIN_TOKEN`
- présence des variables Supabase côté front si test local
- statut de la function `content-admin`

### 9.2. Un message WhatsApp n’apparaît pas

Vérifier dans l’ordre :
- Twilio logs
- `whatsapp_inbound_messages`
- `twilio-whatsapp-webhook`
- BackOffice `WhatsApp`

### 9.3. L’email WhatsApp n’arrive pas

Vérifier dans l’ordre :
- `whatsapp_email_notification_logs`
- logs Resend
- présence des deux destinataires
- Spam / Promotions / réception Zoho / Gmail

### 9.4. Une newsletter du vendredi ne part pas

Cause la plus probable :
- édition restée en `review`

Vérifier :
- `newsletter_issues.status`
- rappels de validation du jeudi
- `send-approved`

---

## 10. Règles de sécurité et de prudence

Ne jamais :
- modifier un secret sans savoir où il est utilisé
- publier un changement front dépendant d’une migration non déployée
- répondre à un prospect en dehors du process si le back-office a déjà la donnée
- exposer un token admin dans une capture d’écran

Toujours :
- valider en preview locale si le changement est visuel
- vérifier `main` avant d’annoncer qu’un correctif est en production
- vérifier les logs si un flux automatique semble “fonctionner mais pas visible”
- documenter les changements importants

---

## 11. Tables et fonctions essentielles à mémoriser

### Tables

- `contact_requests`
- `registration_requests`
- `form_responses`
- `page_views`
- `resource_posts`
- `job_opportunities`
- `source_feeds`
- `source_signals`
- `editorial_jobs`
- `newsletter_subscriptions`
- `newsletter_issues`
- `newsletter_delivery_logs`
- `partner_offer_catalog`
- `partner_email_templates`
- `partner_listing_reviews`
- `partner_followup_jobs`
- `social_video_posts`
- `whatsapp_inbound_messages`
- `whatsapp_email_notification_logs`

### Edge Functions

- `content-admin`
- `twilio-whatsapp-webhook`
- `newsletter-drafter`
- `newsletter-send`
- `newsletter-scheduler`
- `partner-review-drafter`
- `partner-followup-send`
- `webinar-notify`
- `webinar-admin-weekly-digest`

---

## 12. Résumé exécutif

Pour administrer correctement TransferAI aujourd’hui :

1. entrer par le **BackOffice public**
2. utiliser **Supabase** pour vérifier les données réelles
3. utiliser **Twilio** pour les messages WhatsApp
4. utiliser **Resend** pour les statuts d’emails
5. traiter chaque rubrique avec le bon rôle métier
6. ne jamais confondre **validation Git**, **déploiement backend** et **publication réellement visible**

Le BackOffice n’est pas un simple CMS.  
C’est un **poste de pilotage opérationnel** du site, des leads, des emails, des vidéos, des partenaires et des conversations entrantes.
