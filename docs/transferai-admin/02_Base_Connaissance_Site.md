# Base de Connaissance du Site

## 1. Présentation générale

### Nom

TransferAI Africa

### Positionnement

TransferAI Africa est une plateforme de formation, contenus, conseil et solutions IA conçue pour les professionnels, entreprises et institutions qui veulent intégrer l'intelligence artificielle avec méthode, impact concret et ancrage Afrique, en particulier Côte d'Ivoire.

### Promesse

Aider les organisations et les professionnels à :
- comprendre l'IA de façon concrète
- choisir les bons outils
- monter en compétences
- structurer des usages métiers
- transformer la veille en action

### Priorité éditoriale

- FR d'abord
- EN ensuite pour les contenus stratégiques
- angle Côte d'Ivoire
- ouverture Afrique de l'Ouest puis Afrique

## 2. Publics cibles

### Publics principaux

- professionnels en poste
- dirigeants
- équipes métiers
- responsables formation
- entreprises
- institutions
- apprenants orientés employabilité

### Intentions principales des visiteurs

- comprendre l'offre TransferAI
- trouver une formation
- demander un devis ou un accompagnement entreprise
- consulter des contenus IA fiables
- s'abonner à la newsletter
- se repérer dans les domaines couverts

## 3. Piliers de l'offre

### Education

Ce pilier couvre :
- hub éducation
- catalogue de formation
- parcours guidés
- certification
- séminaires et webinars

### Entreprises

Ce pilier couvre :
- accompagnement entreprise
- conseil et adoption IA
- audit IA
- automatisation et solutions IA
- contenus utiles orientés décideurs

### Ressources

Ce pilier couvre :
- blog
- veille IA
- guides
- études de cas
- contenus expertise et IA
- newsletter par domaine

### Outils IA

Ce pilier couvre :
- matrice des outils par domaine
- formats de formation recommandés
- usages métier
- logique copilote / workflow / low-code / no-code / recherche

## 4. Pages principales et rôle de chaque page

### Pages coeur du site

- `/` : page d'accueil, vision globale, orientation, preuve et CTA
- `/education` : porte d'entrée formation
- `/catalogue` : vue large de l'offre de formation
- `/catalogue/:id` : détail d'une formation
- `/parcours` : trajectoires guidées selon profil
- `/certification` : certification sectorielle avec objectifs et programme
- `/outils-ia` : matrice des outils IA par domaine
- `/entreprises` : offre entreprise et services
- `/services` : alias de la page entreprises
- `/blog` : hub ressources et veille
- `/blog/domaine/:domainSlug` : page SEO ciblée par domaine
- `/blog/:slug` : page article individuelle
- `/contact` : formulaires et demandes
- `/back-office` : administration

### Pages secondaires

- `/seminaires`
- `/webinars`
- `/a-propos`
- `/partenaires`
- `/evenements`
- `/prise-rdv`
- pages preview et hubs catalogues

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

## 6. Certification sectorielle

### Logique

La certification n'est pas générique. Elle repose sur :
- un socle commun de méthode IA
- une adaptation par domaine
- une logique métier et livrables
- une évaluation continue simple

### Ce que la page certification doit transmettre

- qui est concerné
- pourquoi la version concerne le secteur
- objectifs de la certification
- résultats attendus
- programme sur 5 jours
- modalités d'évaluation
- CTA clair

### Positionnement pédagogique

La certification doit être perçue comme :
- professionnelle
- concrète
- utile en entreprise
- orientée métier
- premium mais accessible

## 7. Blog et pipeline éditorial

### Rôle du blog

Le blog n'est pas un simple espace d'articles. Il sert à :
- crédibiliser TransferAI
- nourrir le SEO
- convertir les visiteurs vers les formations et l'offre entreprise
- démontrer une lecture IA ancrée Côte d'Ivoire / Afrique

### Formats actuels

- Veille
- Guides
- Études de cas
- Expertise & IA

### Principes éditoriaux

- badge de type visible
- domaine visible
- titre allégé
- résumé orienté utilité
- article individuel propre
- CTA lisible

### Pipeline IA

Le flux éditorial s'appuie sur :
- sources suivies
- signaux détectés
- classification
- brouillons IA
- revue humaine
- publication

## 8. Newsletter

### Finalité

La newsletter sert à :
- fidéliser l'audience
- prolonger la valeur du blog
- créer un rendez-vous hebdomadaire
- nourrir la relation avant formation ou mission

### Structure officielle

Une édition newsletter contient :
- un titre
- un objet email
- un préheader
- une introduction
- un signal clé
- un conseil pratique
- un outil à connaître
- un prompt de la semaine
- un bloc éditorial
- un CTA

### Ciblage

L'abonnement se fait par domaine.

Le système peut :
- filtrer par domaines choisis
- préparer une édition FR
- envoyer un test
- envoyer la campagne si approuvée

## 9. Matrice des outils IA

### Rôle de la page outils

Cette page sert à :
- montrer les outils réellement utilisés
- structurer le discours commercial B2B
- appuyer les formations par domaine
- préparer des offres sectorielles

### Catégories d'outils

- copilote
- workflow
- low-code
- no-code
- recherche
- builder

### Outils structurants

Le noyau de crédibilité actuel repose notamment sur :
- ChatGPT Business
- Claude for Enterprise
- Gemini for Google Workspace
- Microsoft 365 Copilot
- n8n
- Make
- Zapier
- Power Automate
- Airtable
- Notion AI
- Softr
- Bubble
- Glide
- Perplexity
- NotebookLM

## 10. Back-office

### Rôle

Le back-office est le poste de pilotage interne du site.

### Ce qu'il permet

- publier et modifier les ressources
- publier et modifier les emplois
- suivre les analytics
- piloter les flux éditoriaux IA
- piloter la newsletter

### Dépendance critique

Le back-office dépend du token administrateur.

Sans token valide :
- les données ne se chargent pas
- les actions d'admin ne fonctionnent pas

## 11. Base technique

### Front

- React
- TypeScript
- Vite
- React Router
- TanStack Query

### Backend

- Supabase base de données
- Supabase Edge Functions
- Supabase Cron / scheduler

### Email

- Resend

### Déploiement

- GitHub
- Cloudflare pour le front

## 12. Principes pour le futur assistant IA / chatbot

### Ce qu'il doit savoir faire

- expliquer TransferAI clairement
- orienter vers la bonne page
- distinguer formation, certification, entreprise, blog et outils
- répondre sans inventer
- respecter FR d'abord

### Ce qu'il ne doit pas faire

- inventer des prix
- inventer des dates de session
- inventer des partenaires
- promettre un accès humain immédiat si cela n'est pas confirmé

### Style de réponse recommandé

- professionnel
- clair
- concret
- orienté solution
- jamais agressif commercialement

## 13. Mots-clés de gouvernance

À retenir pour tout futur assistant et toute documentation :
- FR d'abord
- Côte d'Ivoire d'abord
- métier avant gadget
- utilité avant volume
- validation humaine avant diffusion large
