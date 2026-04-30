# Guide Administrateur No1

## 1. Objet du guide

Ce guide décrit le fonctionnement réel du **BackOffice TransferAI Africa** au 1er mai 2026.

Il répond à 4 questions :

1. comment accéder au back-office et au backend
2. à quoi sert chaque rubrique
3. quels rôles opérationnels doivent être couverts
4. comment exploiter la plateforme sans casser les flux déjà en production

---

## 2. Mission de l’administrateur No1

L’administrateur No1 ne se limite pas à publier.

Il garantit que la plateforme reste :

- cohérente éditorialement
- crédible commercialement
- exploitable opérationnellement
- fiable techniquement
- traçable côté back-office

Responsabilités principales :

1. gouvernance du contenu et des CTA
2. supervision du BackOffice
3. suivi des leads, messages entrants et demandes
4. contrôle léger des déploiements et accès
5. coordination avec les administrateurs métiers
6. documentation et transmission des procédures

---

## 3. Accès au BackOffice et au backend

### 3.1. BackOffice public

URL de production :

- [https://www.transferai.ci/back-office](https://www.transferai.ci/back-office)

Exemples de liens directs :

- [https://www.transferai.ci/back-office?tab=whatsapp](https://www.transferai.ci/back-office?tab=whatsapp)
- [https://www.transferai.ci/back-office?tab=newsletters](https://www.transferai.ci/back-office?tab=newsletters)
- [https://www.transferai.ci/back-office?tab=partners](https://www.transferai.ci/back-office?tab=partners)

### 3.2. BackOffice local

Usage :

- développement
- tests UI
- validation avant commit

Format :

- `http://127.0.0.1:<port>/back-office`

### 3.3. Token administrateur

Le back-office public repose sur le secret backend :

- `CONTENT_ADMIN_TOKEN`

Ce token est vérifié par :

- [`/Users/marius_ayoro/.codex/worktrees/4df6/connect-ia-bloom/supabase/functions/content-admin/index.ts`](/Users/marius_ayoro/.codex/worktrees/4df6/connect-ia-bloom/supabase/functions/content-admin/index.ts)

Règles :

- ne jamais diffuser le token en clair dans un canal non sécurisé
- le remplacer en cas de doute
- retester immédiatement le back-office après rotation

### 3.4. Accès Supabase

Supabase sert de backend principal.

Zones critiques à connaître :

- `Table Editor`
- `Edge Functions`
- `Secrets`
- `SQL Editor`

### 3.5. Accès Twilio

Twilio sert à :

- recevoir les messages WhatsApp
- journaliser les messages entrants
- appeler le webhook Supabase

Sender validé :

- `+2250716573990`

### 3.6. Accès Resend

Resend sert à :

- envoyer les emails transactionnels
- envoyer la newsletter
- envoyer les notifications internes sur messages WhatsApp

### 3.7. Accès Cloudflare / GitHub

GitHub :

- dépôt source
- source des commits et des branches

Cloudflare :

- diffusion du front public `transferai.ci`

Point clé :

- un commit GitHub ne suffit pas à lui seul si `main` n’est pas la version réellement servie

---

## 4. Rôles opérationnels

Le système n’a pas encore de séparation fine des rôles par utilisateur dans le BackOffice.  
Les rôles sont donc **opérationnels**.

### 4.1. Administrateur No1

Responsable de :

- accès au back-office
- supervision globale
- validation finale avant mise en production
- suivi des incidents

### 4.2. Responsable contenus

Responsable de :

- `Ressources`
- `Brouillons IA`
- `Capsules vidéo`

### 4.3. Responsable newsletter

Responsable de :

- `Newsletter IA`
- relecture
- test
- approbation
- suivi des rappels du jeudi

### 4.4. Responsable prospects / audit

Responsable de :

- `Prospects Audit`
- qualification des demandes
- suivi du portail prospect

### 4.5. Responsable partenaires

Responsable de :

- `Partenaires IA`
- revue des demandes
- recommandation de formule
- suivi des réponses

### 4.6. Responsable WhatsApp

Responsable de :

- `WhatsApp`
- lecture des messages entrants
- classement
- notes internes
- réponse manuelle via WhatsApp

### 4.7. Responsable webinaires / live

Responsable de :

- `Webinaires`
- `Formats live IA`

### 4.8. Responsable opportunités

Responsable de :

- `Emplois IA`
- publication et statut des opportunités

---

## 5. Rubriques du BackOffice

Onglets actuellement visibles :

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

Suivre :

- trafic
- pages vues
- tendances
- formulaires et inscriptions

### 5.2. Prospects Audit

Suivre :

- demandes audit IA
- qualification
- suivi prospect

### 5.3. Ressources

Gérer :

- articles
- résumés
- statuts
- domaines

### 5.4. Brouillons IA

Gérer :

- sources suivies
- signaux
- brouillons proposés
- publication ou archivage

### 5.5. Partenaires IA

Gérer :

- demandes de référencement
- partenariats stratégiques
- revue
- recommandation IA
- suivi de réponse

### 5.6. Newsletter IA

Gérer :

- éditions
- objet
- préheader
- éditorial
- prompt
- CTA
- tests
- statuts

### 5.7. Capsules vidéo

Gérer :

- flux vidéo court
- capsule mise en avant
- fallback éditorial

### 5.8. WhatsApp

Le module WhatsApp V1 permet :

- liste + filtres
- fiche détail
- changement de statut
- changement de catégorie
- note interne
- ouverture directe de la réponse WhatsApp

### 5.9. Emplois IA

Gérer :

- opportunités
- statuts
- visibilité

### 5.10. Webinaires

Gérer :

- webinaires
- statuts et mises à jour

### 5.11. Formats live IA

Gérer :

- formats live
- structuration de l’offre live

### 5.12. Mode d’emploi

Rôle :

- rappeler à l’équipe comment utiliser correctement le système

---

## 6. Tables importantes

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
- `webinar_registrations`

---

## 7. Edge functions importantes

- `content-admin`
- `content-discovery`
- `content-classifier`
- `content-drafter`
- `newsletter-subscribe`
- `newsletter-drafter`
- `newsletter-send`
- `newsletter-scheduler`
- `send-prospect-emails`
- `partner-review-drafter`
- `partner-followup-send`
- `twilio-whatsapp-webhook`

---

## 8. Workflows clés

### 8.1. WhatsApp

Chaîne complète :

1. visiteur clique le bouton WhatsApp du site
2. message envoyé vers `+2250716573990`
3. Twilio reçoit
4. Twilio appelle le webhook Supabase
5. le message est enregistré dans `whatsapp_inbound_messages`
6. les notifications internes sont envoyées
7. le message devient visible dans `BackOffice > WhatsApp`

### 8.2. Newsletter

Modèle réel :

- IA prépare
- humain valide
- système envoie

Cadence :

- mercredi : génération
- jeudi : rappel si nécessaire
- vendredi : envoi si édition approuvée

### 8.3. Partenaires

Flux :

1. demande publique
2. revue
3. recommandation
4. réponse

### 8.4. Capsules vidéo

Flux :

1. enregistrement ou mise à jour d’une capsule
2. lecture par le front
3. affichage d’une vidéo ou d’une carte fallback brandée

---

## 9. Routine d’exploitation

### Quotidienne

- vérifier les demandes contact / audit
- vérifier les messages WhatsApp
- vérifier que le back-office charge correctement
- vérifier qu’aucune page commerciale critique ne casse

### Hebdomadaire

- relire les brouillons IA
- vérifier l’édition newsletter
- envoyer un test
- vérifier les demandes partenaires
- vérifier la capsule vidéo mise en avant

### Mensuelle

- revoir les pages les plus vues
- revoir les CTA critiques
- revoir les accès et secrets
- mettre à jour la documentation

---

## 10. Incidents fréquents

### Si le BackOffice ne charge pas

Vérifier :

- token admin
- variables Supabase du front
- fonction `content-admin`

### Si WhatsApp ne remonte pas

Vérifier :

- logs Twilio
- invocations `twilio-whatsapp-webhook`
- table `whatsapp_inbound_messages`

### Si l’email WhatsApp n’est pas visible

Vérifier :

- `whatsapp_email_notification_logs`
- logs Resend
- Inbox / Spam / Promotions

### Si une page front semble ancienne

Vérifier :

- que le correctif est sur `main`
- que la prod sert bien la bonne version
- qu’un hard refresh a été fait

---

## 11. Règle finale

Le BackOffice doit être exploité comme un **poste de pilotage opérationnel**, pas comme un simple écran de publication.

Les règles les plus sûres restent :

- validation humaine sur les contenus sensibles
- responsabilité claire par rubrique
- contrôle post-déploiement réel
- journalisation des workflows critiques
