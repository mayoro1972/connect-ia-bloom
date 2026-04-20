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

Cette version du pack inclut désormais les évolutions suivantes réalisées entre le 11 et le 20 avril 2026 :
- simplification éditoriale de plusieurs pages denses : accueil, à propos, catalogue, parcours, certification, education hub, blog, entreprises et partenaires
- mise en avant plus claire de l'audit IA gratuit dans les parcours B2B
- consolidation du blog dynamique avec filtres, pages article, SEO par domaine et newsletter ciblée
- mise en place du pipeline partenaire : formulaire public, revue en back-office, recommandation IA, email de suivi
- fiabilisation des emails transactionnels et ajout d'une salutation horaire `Bonjour` / `Bonsoir` côté Côte d'Ivoire
- clarification de la page `Contact` autour d'une seule logique publique plus lisible : `Parler à un expert IA`
- ajout de variantes de formulaires contact selon l'intention réelle : référencement partenaire, partenariat stratégique, demande de catalogue, demande d'information ou demande formation
- automatisation plus directe des demandes catalogue avec accès au bon catalogue et CTA cohérents vers la version web, le PDF et l'audit IA lorsque c'est pertinent
- harmonisation progressive des emails d'inscription, de formation, de catalogue et de partenariat pour éviter les liens de RDV ambigus
- correction d'un incident de rendu qui cassait certains liens profonds `contact?intent=...` en production
- amélioration des emails automatiques liés aux demandes d'inscription, de formation et de contact pour supprimer les liens de RDV ambigus lorsqu'ils ne sont pas pertinents
- validation du déploiement manuel de la fonction `send-prospect-emails` depuis le dépôt racine
- confirmation que le modèle d'exploitation reste : `FR d'abord`, validation humaine avant diffusion large

### Complément du 20 avril 2026

Les travaux du 20 avril ont ajouté ou clarifié :
- l'envoi réel de la newsletter fondatrice du lundi 20 avril 2026
- la mise à jour éditoriale complète de cette newsletter avec éditorial fondateur, photo, signature, accents corrigés et bloc `Prompt à copier immédiatement`
- l'ajout de 5 abonnés supplémentaires et la confirmation d'un total de 8 abonnés actifs au moment de l'envoi
- la vérification du scheduler newsletter : génération et envoi automatiques le vendredi, pas le lundi
- l'extension de l'automation `veille-ia-quotidienne` pour produire chaque semaine un package éditorial plus structuré
- la rotation planifiée de 3 prompts métier assistanat / secrétariat sur 3 semaines
- le nettoyage de la page `Media, veille & opportunités IA` avec suppression de blocs trop conceptuels
- la création d'un vrai flux `Parler emploi & mise en relation` via le formulaire dédié `/parler-emploi-ia`
- la correction du CTA emploi de la page média pour qu'il n'envoie plus vers la prise de RDV
- la correction des liens `Voir ce replay`, qui ne doivent plus pointer vers Contact mais vers une destination vidéo exploitable
- la mise en évidence d'un point de gouvernance important : `transferai.ci` ne reflète pas forcément un simple push GitHub sans publication du site principal

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
