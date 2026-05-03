# Base de Connaissance du Site

## 1. Présentation générale

### Nom

TransferAI Africa

### Positionnement

TransferAI Africa est une plateforme de formation, contenus, conseil et solutions IA conçue pour les professionnels, entreprises et institutions qui veulent intégrer l’intelligence artificielle avec méthode, impact concret et ancrage Côte d’Ivoire / Afrique.

### Promesse

Aider les organisations et les professionnels à :

- comprendre l’IA de façon concrète
- choisir les bons outils
- monter en compétences
- structurer des usages métier
- transformer la veille en action

### Priorité éditoriale

- FR d’abord
- EN ensuite pour les contenus stratégiques
- Côte d’Ivoire d’abord
- extension Afrique de l’Ouest puis Afrique

## 2. Publics cibles

- professionnels en poste
- dirigeants
- responsables formation
- équipes métier
- entreprises
- institutions
- apprenants orientés employabilité

Intentions principales :

- comprendre l’offre TransferAI
- trouver une formation
- parler à un expert IA
- demander un accompagnement entreprise
- demander un catalogue secteur
- demander un audit IA
- consulter des contenus fiables
- s’abonner à la newsletter

## 3. Piliers de l’offre

### Education

- hub éducation
- catalogue
- parcours
- certification
- webinaires et formats live

### Entreprises

- audit IA
- accompagnement
- conseil et adoption
- automatisation et solutions

### Ressources

- blog
- veille
- guides
- études de cas
- newsletter

### Outils IA

- matrice des outils par domaine
- logique copilote / workflow / low-code / no-code / recherche

## 4. Pages principales

### Pages cœur

- `/` : accueil
- `/education` : hub formation
- `/catalogue` : catalogue principal
- `/catalogue/:id` : détail formation
- `/catalogues-domaines` : hub catalogues secteurs
- `/catalogues-domaines/:slug` : catalogue secteur
- `/parcours` : trajectoires guidées
- `/certification` : certification sectorielle
- `/outils-ia` : matrice outils IA
- `/entreprises` : offre entreprise
- `/services` : alias entreprise
- `/demande-audit-gratuit` et `/audit-ia-gratuit` : parcours audit IA
- `/blog` : hub ressources
- `/blog/domaine/:domainSlug` : ressources par domaine
- `/blog/:slug` : article individuel
- `/contact` : demandes structurées
- `/back-office` : administration

### Pages secondaires

- `/seminaires`
- `/webinars`
- `/evenements`
- `/partenaires`
- `/a-propos`
- `/parler-expert-ia`
- `/parler-emploi-ia`
- `/createur-contenu-ia`

## 5. Domaines couverts

Les 13 domaines actuellement couverts sont :

1. IT & Transformation Digitale
2. Finance & Fintech
3. Agriculture & AgroTech IA
4. Éducation & EdTech IA
5. Santé & IA médicale
6. Logistique & Supply Chain
7. Énergie & Transition énergétique
8. RH & Gestion des talents
9. Marketing & Communication IA
10. Droit & LegalTech IA
11. Immobilier & Smart City
12. Tourisme & Hospitalité
13. Médias & Création de contenu

## 6. Logique Contact et CTA

### Porte d’entrée publique principale

- `Parler à un expert IA`

### Message WhatsApp prérempli actuel

`Bonjour TransferAI, je souhaite échanger avec votre équipe au sujet de vos services, formations ou solutions IA.`

### Message d’aide sous le bouton WhatsApp

- FR : `Réponse rapide pour parler IA, formation et accompagnement.`

### Variantes de flux

Selon l’intention, le système peut ensuite orienter vers :

- audit IA
- catalogue
- formation
- partenariat / référencement
- emploi / mise en relation

## 6 bis. Chat web et assistant conversationnel

### Widget web

Le site intègre désormais un widget **Chatwoot Website**.

État au 2 mai 2026 :

- le script Chatwoot est intégré au front
- le widget est visible en local
- l’inbox website `TransferAI` reçoit les messages
- le webhook Chatwoot vers `n8n` est validé en réception

### Rôle attendu du chat web

Le chat web doit :

- accueillir
- qualifier
- comprendre le besoin
- orienter vers la bonne offre
- proposer une démo si le prospect est sérieux
- transférer à un humain si nécessaire

## 7. Blog et pipeline éditorial

### Rôle du blog

Le blog sert à :

- crédibiliser TransferAI
- nourrir le SEO
- convertir vers les formations et l’offre entreprise
- montrer une lecture IA ancrée Côte d’Ivoire / Afrique

### Formats actuels

- Veille
- Guides
- Études de cas
- Expertise & IA

### Pipeline IA

Le flux éditorial s’appuie sur :

- sources suivies
- signaux détectés
- classification
- brouillons IA
- revue humaine
- publication

## 8. Newsletter

### Finalité

- fidéliser l’audience
- prolonger la valeur du blog
- créer un rendez-vous hebdomadaire
- nourrir la relation avant formation ou mission

### Fonctionnement réel

- génération hebdomadaire programmée
- validation humaine recommandée
- envoi si l’édition est dans un statut compatible

### Règle horaire email

- `Bonjour` avant midi heure de Côte d’Ivoire
- `Bonsoir` à partir de midi

## 9. Page Média / Créateur de contenu

### Rôle

La page `CreateurContenuIA` sert à :

- présenter le positionnement contenu / social media IA
- mettre en avant des capsules courtes
- rediriger vers le compte TikTok / vidéos

### État réel

Le bloc TikTok n’est plus une simple capture statique :

- il lit un feed backend
- il peut afficher une vraie capsule publiée
- sinon il affiche une carte brandée propre

Tables et logique associées :

- `social_video_posts`
- BackOffice `Capsules vidéo`

## 10. WhatsApp et relation entrante

### Flux réel

1. clic site
2. ouverture WhatsApp
3. message envoyé au numéro du site
4. réception Twilio
5. enregistrement Supabase
6. affichage dans `BackOffice > WhatsApp`
7. notification email interne

### Tables liées

- `whatsapp_inbound_messages`
- `whatsapp_email_notification_logs`

### Outils liés

- Twilio
- Supabase
- Resend

## 11. BackOffice

### Rôle

Le back-office est le poste de pilotage interne du site.

### Onglets réels

- Analytics
- Prospects Audit
- Ressources
- Brouillons IA
- Partenaires IA
- Newsletter IA
- Capsules vidéo
- WhatsApp
- Emplois IA
- Webinaires
- Formats live IA
- Mode d'emploi

### Dépendance critique

Sans token administrateur valide :

- les données ne se chargent pas
- les actions d’administration échouent

## 12. Base technique

### Front

- React
- TypeScript
- Vite
- React Router
- TanStack Query

### Backend

- Supabase database
- Supabase Edge Functions
- Supabase cron / scheduler

### Email

- Resend

### Messagerie entrante

- Twilio WhatsApp

### Déploiement

- GitHub
- Cloudflare

## 13. Principes pour futur assistant IA / chatbot

### Ce qu’il doit savoir faire

- expliquer TransferAI clairement
- orienter vers la bonne page
- distinguer formation, certification, entreprise, blog, outils et WhatsApp
- répondre sans inventer
- respecter FR d’abord

### Ce qu’il ne doit pas faire

- inventer des prix
- inventer des dates
- inventer des partenaires
- inventer des fonctionnalités non validées

### Style recommandé

- professionnel
- clair
- concret
- orienté solution

## 14. Mise à jour de référence au 1er mai 2026

Les éléments suivants sont désormais vrais :

- plusieurs pages ont été simplifiées pour gagner en lisibilité
- l’audit IA gratuit est une porte d’entrée B2B prioritaire
- le pipeline partenaires est opérationnel
- le flux catalogue est plus direct
- le bloc TikTok / capsules vidéo est piloté par backend
- le flux WhatsApp est pleinement opérationnel
- le BackOffice WhatsApp V1 est en production
- les notifications email internes sur nouveau message WhatsApp sont actives
