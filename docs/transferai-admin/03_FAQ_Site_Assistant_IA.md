# FAQ Site, Assistant IA et Support

## 1. FAQ publique

### Qu’est-ce que TransferAI Africa ?

TransferAI Africa est une plateforme de formation, contenus, conseil et solutions IA avec un ancrage fort en Côte d’Ivoire et une vocation africaine.

### À qui s’adresse le site ?

Aux professionnels, entreprises, institutions, responsables formation, dirigeants et équipes métier qui veulent intégrer l’IA avec méthode et impact concret.

### Comment trouver la bonne formation ?

Le plus simple est de commencer par le catalogue, les parcours ou la certification selon l’objectif, le métier et le niveau.

### Quelle est la différence entre Catalogue, Parcours et Certification ?

- le catalogue présente l’offre
- les parcours aident à choisir une trajectoire
- la certification propose un programme plus structuré et professionnalisant

### Peut-on demander un audit IA ?

Oui. L’audit IA gratuit fait partie des portes d’entrée B2B les plus importantes.

### Peut-on recevoir un catalogue par domaine ?

Oui. Une demande claire peut déclencher un email avec accès direct à la version web et au PDF du catalogue demandé.

### Le site propose-t-il un espace partenaires ?

Oui. La page `Partenaires` permet de consulter l’écosystème et de soumettre une demande de référencement ou de partenariat stratégique.

### Peut-on entrer en contact par WhatsApp ?

Oui. Le site propose un bouton WhatsApp avec un message prérempli orienté IA, formation et accompagnement.

### Quel est le message WhatsApp prérempli actuel ?

`Bonjour TransferAI, je souhaite échanger avec votre équipe au sujet de vos services, formations ou solutions IA.`

## 2. FAQ blog et contenus

### À quoi sert le blog ?

Le blog sert à informer, crédibiliser, attirer du trafic qualifié et convertir vers les formations, audits ou offres entreprise.

### Pourquoi voit-on un badge de type sur les cartes ?

Le badge aide le visiteur à comprendre rapidement s’il s’agit d’une veille, d’un guide, d’une étude de cas ou d’un contenu expertise.

### Pourquoi le mot “Veille” n’apparaît plus dans tous les titres ?

Parce qu’il est déjà porté par le badge. Cela rend les titres plus lisibles.

### Le blog peut-il être alimenté automatiquement ?

Oui, partiellement. Le pipeline peut détecter des signaux et proposer des brouillons, mais la validation humaine reste recommandée.

## 3. FAQ newsletter

### Comment s’abonner ?

Le visiteur saisit son email et choisit un ou plusieurs domaines.

### Que reçoit un abonné ?

Des contenus ciblés par domaine : veille utile, signal clé, conseil pratique, outil à connaître, prompt métier et ressources.

### L’envoi est-il automatique ?

Le système est conçu pour fonctionner automatiquement chaque semaine, mais avec validation humaine recommandée avant envoi réel.

### La newsletter part-elle automatiquement le lundi ?

Non. Le fonctionnement réel observé est centré sur une logique de génération et d’envoi du milieu à la fin de semaine.

### Pourquoi certains emails commencent par “Bonjour” et d’autres par “Bonsoir” ?

Parce que les emails automatiques prennent en compte l’heure d’envoi côté Côte d’Ivoire :

- avant midi : `Bonjour`
- après midi : `Bonsoir`

## 4. FAQ back-office

### Où gère-t-on les ressources ?

Dans `Back-office > Ressources`.

### Où gère-t-on les brouillons IA ?

Dans `Back-office > Brouillons IA`.

### Où gère-t-on la newsletter ?

Dans `Back-office > Newsletter IA`.

### Où gère-t-on les demandes partenaires ?

Dans `Back-office > Partenaires IA`.

### Où gère-t-on les opportunités emploi ?

Dans `Back-office > Emplois IA`.

### Où gère-t-on les capsules vidéo ?

Dans `Back-office > Capsules vidéo`.

### Où gère-t-on les messages WhatsApp ?

Dans `Back-office > WhatsApp`.

### Que permet le module WhatsApp ?

Il permet de :

- voir les messages entrants
- filtrer
- changer le statut
- changer la catégorie
- ajouter une note interne
- ouvrir une réponse WhatsApp manuelle

### Pourquoi le back-office demande-t-il un token ?

Parce qu’il déclenche des actions d’administration sur Supabase et les edge functions.

### Où trouver le token admin ?

Dans les secrets Supabase sous le nom `CONTENT_ADMIN_TOKEN`.

## 5. FAQ WhatsApp

### Comment fonctionne le flux WhatsApp ?

1. l’utilisateur clique sur le site
2. il envoie un message au numéro WhatsApp du site
3. Twilio reçoit
4. le webhook Supabase enregistre
5. le message apparaît dans `BackOffice > WhatsApp`
6. une notification email interne est envoyée

### Où voit-on les messages reçus ?

- dans Twilio Logs
- dans `whatsapp_inbound_messages`
- dans le BackOffice WhatsApp

### Où voit-on les emails de notification WhatsApp ?

Dans :

- la boîte `contact@transferai.ci`
- la boîte `marius.ayoro70@gmail.com`
- la table `whatsapp_email_notification_logs`

### Comment sait-on si l’email est parti ?

Vérifier :

- `whatsapp_email_notification_logs`
- les logs Resend

## 6. FAQ déploiement

### Comment se déploie le front ?

Le front suit le flux GitHub puis Cloudflare.

### Pourquoi un push GitHub peut-il ne pas suffire ?

Parce qu’il faut vérifier :

- que le correctif est bien sur `main`
- que le site public sert bien la nouvelle version

### Comment se déploie le backend ?

Via Supabase :

- migrations
- edge functions
- secrets si nécessaire

### Faut-il toujours déployer front et Supabase ensemble ?

Non. Seulement quand un changement front dépend d’une nouvelle table, d’une migration ou d’une edge function mise à jour.

## 7. FAQ assistant IA / chatbot

### Quelle doit être la priorité du chatbot ?

Orienter rapidement le visiteur vers la bonne page et répondre clairement sans inventer.

### Le chatbot peut-il répondre en anglais ?

Oui, mais seulement lorsque le contexte ou un contenu stratégique le justifie.

### Comment doit-il parler de la page Contact ?

Il doit privilégier une promesse simple :

- `Parler à un expert IA`

### Comment doit-il orienter un visiteur entreprise ?

- découverte : `Entreprises`
- cadrage : `Audit IA gratuit`
- besoin flou : `Parler à un expert IA`

## 8. FAQ incidents fréquents

### Le formulaire d’audit n’ouvre pas

Vérifier :

- la route front
- le lien du bouton
- la page cible réelle
- le déploiement Cloudflare

### Un lien `contact?intent=...` affiche un écran de secours

Vérifier :

- la page `Contact`
- les paramètres d’URL
- le build servi en production

### Une demande WhatsApp remonte mais aucun email n’est vu

Vérifier :

- `whatsapp_email_notification_logs`
- les logs Resend
- les dossiers Spam / Promotions / Tous les messages

### Le back-office charge mais les compteurs restent à zéro

Vérifier :

- le token admin
- les appels à `content-admin`
- les réponses réseau
- la configuration Supabase du front
