# Pack Administration TransferAI Africa

Ce dossier regroupe la documentation de référence du site TransferAI Africa.

Il a 4 objectifs :
- donner à l'administrateur No1 une vue complète du site
- permettre à d'autres administrateurs de prendre le relais rapidement
- servir de base de connaissance pour un assistant IA interne ou un chatbot public
- conserver une mémoire claire du projet, de son architecture et de ses évolutions

## Contenu du pack

1. [Guide Administrateur No1](./01_Guide_Administrateur_No1.md)
2. [Base de Connaissance du Site](./02_Base_Connaissance_Site.md)
3. [FAQ Site, Back-office et Support](./03_FAQ_Site_Assistant_IA.md)
4. [Plan de Déploiement et d'Exploitation](./04_Plan_Deploiement_Exploitation.md)
5. [Roadmap Historique du Projet](./05_Roadmap_Historique_Projet.md)
6. [Base de Connaissance Chatbot JSON](./06_knowledge_base_chatbot.json)
7. [Export Word Friendly HTML](./07_Export_Word_TransferAI_Admin_Pack.html)
8. [Note Direction / Partage Externe](./08_Note_Direction_Partage_Externe.md)
9. [Export Word Friendly Direction / Externe](./09_Export_Word_Direction_Externe.html)

## Ordre de lecture recommandé

Pour l'administrateur principal :
- commencer par le guide administrateur
- lire ensuite le plan de déploiement et la roadmap
- garder la FAQ sous la main pour les cas fréquents

Pour les autres administrateurs :
- commencer par le guide administrateur
- relire la base de connaissance du site
- utiliser la FAQ comme socle de réponses standardisées

Pour la future IA assistant / chatbot :
- utiliser en priorité la base de connaissance du site
- charger ensuite la FAQ
- utiliser enfin le fichier JSON comme format structuré de départ

## Périmètre actuel du site

Le site couvre aujourd'hui les briques suivantes :
- vitrine institutionnelle
- hub éducation
- catalogue de formation
- pages parcours
- certification sectorielle
- page entreprises / services
- blog / ressources dynamiques
- matrice des outils IA par domaine
- formulaire de contact et formulaires de leads
- audit IA
- back-office contenus / brouillons IA / newsletter / emplois
- back-office partenaires et revue de référencement
- pipeline éditorial Supabase
- pipeline newsletter avec abonnement, génération, test et envoi
- pipeline partenaires avec recommandation IA, validation et réponse email
- logique de salutation automatique des emails selon l'heure d'envoi

## Dernière mise à jour importante du pack

Cette version du pack inclut désormais les évolutions suivantes réalisées le 11 avril 2026 :
- simplification éditoriale de plusieurs pages denses : accueil, à propos, catalogue, parcours, certification, education hub, blog, entreprises et partenaires
- mise en avant plus claire de l'audit IA gratuit dans les parcours B2B
- consolidation du blog dynamique avec filtres, pages article, SEO par domaine et newsletter ciblée
- mise en place du pipeline partenaire : formulaire public, revue en back-office, recommandation IA, email de suivi
- fiabilisation des emails transactionnels et ajout d'une salutation horaire `Bonjour` / `Bonsoir` côté Côte d'Ivoire
- confirmation que le modèle d'exploitation reste : `FR d'abord`, validation humaine avant diffusion large

## Architecture résumée

Front :
- React + Vite + TypeScript
- déploiement via GitHub puis Cloudflare

Backend :
- Supabase pour la base de données, l'auth technique, les edge functions et les automatisations

Email :
- Resend pour les emails transactionnels et newsletters

## Logique éditoriale de référence

- FR d'abord
- EN ensuite uniquement pour les contenus stratégiques
- Côte d'Ivoire d'abord
- Afrique de l'Ouest ensuite
- angle concret, métier, actionnable

## Export vers Word

Le fichier [07_Export_Word_TransferAI_Admin_Pack.html](./07_Export_Word_TransferAI_Admin_Pack.html) peut être :
- ouvert directement dans Microsoft Word
- enregistré au format `.docx`
- partagé aux autres administrateurs
- imprimé en PDF

Le fichier [09_Export_Word_Direction_Externe.html](./09_Export_Word_Direction_Externe.html) a été pensé pour :
- la direction
- les partenaires
- les administrateurs secondaires
- les présentations synthétiques de l'avancement du site

## Recommandation de gouvernance

Ce pack doit devenir un document vivant.

À mettre à jour :
- après chaque évolution majeure du site
- après chaque ajout d'edge function ou de secret critique
- après chaque changement de workflow admin
- après chaque nouvelle offre, rubrique ou domaine stratégique

## Nomenclature des livrables Word

Les fichiers source conservent une numérotation simple dans ce dossier pour rester faciles à maintenir.

Les fichiers livrables Word du dossier `word/` suivent désormais une nomenclature plus corporate :
- `TransferAI_Africa_Admin_...`
- `TransferAI_Africa_Executive_...`
- suffixe optionnel de date pour les versions partageables
