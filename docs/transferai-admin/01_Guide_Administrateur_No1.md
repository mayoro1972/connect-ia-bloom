# Guide Administrateur No1

## 1. Mission de l'administrateur principal

L'administrateur No1 est responsable de 6 piliers :

1. Gouvernance du contenu
2. Pilotage du back-office
3. Supervision technique légère du site
4. Contrôle des accès, tokens et secrets
5. Validation avant publication et déploiement
6. Transmission de la méthode aux autres administrateurs

Son rôle n'est pas seulement de publier. Il doit garantir que le site reste :
- cohérent
- lisible
- exploitable commercialement
- fiable techniquement
- documenté pour l'équipe

## 2. Ce que vous administrez concrètement

### Front office

Pages principales :
- Accueil
- A propos
- Education
- Catalogue
- Détail formation
- Parcours
- Certification
- Outils IA
- Entreprises / Services
- Blog
- Article blog
- Domaines blog
- Contact / formulaires
- Pages preview et hubs secondaires

### Back-office

Onglets actuels :
- Analytics
- Ressources
- Brouillons IA
- Newsletter IA
- Emplois IA
- Mode d'emploi

### Backend Supabase

Tables et flux principaux :
- `contact_requests`
- `registration_requests`
- `page_views`
- `resource_posts`
- `job_opportunities`
- `source_feeds`
- `source_signals`
- `editorial_jobs`
- `newsletter_subscriptions`
- `newsletter_issues`
- `newsletter_delivery_logs`

Edge Functions principales :
- `content-admin`
- `content-discovery`
- `content-classifier`
- `content-drafter`
- `newsletter-subscribe`
- `newsletter-drafter`
- `newsletter-send`
- `newsletter-scheduler`
- `send-prospect-emails`

## 3. Règles de fonctionnement

### Ligne éditoriale

- FR d'abord
- EN ensuite pour les contenus stratégiques
- Côte d'Ivoire d'abord, Afrique de l'Ouest ensuite
- contenu orienté usages métiers et valeur business
- éviter le jargon vide
- privilégier les formulations courtes, utiles et crédibles

### Discipline de publication

La bonne séquence est :
1. preview locale
2. validation
3. commit
4. push
5. déploiement front ou Supabase selon le cas
6. vérification post-déploiement

### Règle de prudence

Ne jamais :
- publier sans vérifier la page concernée
- pousser un changement front qui dépend d'une migration non déployée
- remplacer un secret sans savoir où il est utilisé
- annoncer une fonctionnalité non vérifiée

## 4. Routine d'exploitation recommandée

### Chaque jour ouvré

- vérifier les demandes de contact et d'inscription
- vérifier le blog, la page entreprises, la certification et le formulaire d'audit
- vérifier que le back-office charge bien
- vérifier qu'aucun message d'erreur critique n'est visible sur les pages commerciales

### Chaque semaine

- ouvrir `Back-office > Brouillons IA`
- relire les nouveaux brouillons utiles
- ouvrir `Back-office > Newsletter IA`
- vérifier l'édition de la semaine
- envoyer un test email
- approuver l'édition si elle est correcte
- vérifier les inscriptions newsletter récentes
- revoir les contenus blog les plus importants

### Chaque mois

- revoir les rubriques les plus consultées
- revoir les CTA et formulaires
- mettre à jour la FAQ si de nouvelles questions reviennent
- revoir les secrets et accès critiques
- ajuster la roadmap et les priorités business

## 5. Procédure d'utilisation du back-office

### A. Token administrateur

Le back-office exige un token administrateur.

À faire :
- coller le token dans le champ `Accès admin`
- cliquer sur `Enregistrer le token`
- vérifier que les compteurs et listes se chargent

Si le token ne fonctionne pas :
- vérifier qu'il s'agit bien du `CONTENT_ADMIN_TOKEN`
- vérifier qu'il n'y a pas d'espace au début ou à la fin
- vérifier que le secret Supabase n'a pas été remplacé récemment

### B. Gestion des ressources

Dans `Ressources` :
- créer un slug propre
- choisir le type de contenu
- choisir le domaine
- remplir les titres FR
- remplir les résumés
- remplir le contenu complet FR
- renseigner la source et la date
- publier ou garder en brouillon

Bonnes pratiques :
- garder le badge de type mais éviter de répéter le mot dans le titre
- utiliser des résumés clairs, courts, concrets
- lier le contenu aux formations et à l'offre entreprise quand c'est pertinent

### C. Gestion des brouillons IA

Dans `Brouillons IA` :
- vérifier les sources suivies
- relire les signaux détectés
- relire les brouillons générés
- corriger si nécessaire
- approuver, publier ou archiver

### D. Gestion de la newsletter

Dans `Newsletter IA` :
- charger l'édition
- vérifier les domaines ciblés
- vérifier le titre
- vérifier l'objet email
- vérifier le préheader
- vérifier l'introduction
- vérifier le signal clé
- vérifier le conseil pratique
- vérifier l'outil à connaître
- vérifier le prompt de la semaine
- vérifier le bloc éditorial
- enregistrer
- envoyer un test
- approuver ou planifier

## 6. Workflow newsletter : ce qui est automatique et ce qui reste humain

### Ce qui est automatisé

Le système hebdomadaire est déjà préparé pour fonctionner avec Supabase :
- génération d'un brouillon hebdomadaire
- ciblage par domaines abonnés
- garde-fou d'envoi uniquement si l'édition est `approved` ou `scheduled`

Programmation actuelle :
- mercredi à 06:00 : génération du brouillon hebdomadaire
- vendredi à 08:30 : tentative d'envoi de l'édition validée

### Ce qui reste recommandé côté humain

Avant l'envoi réel, il faut idéalement :
- relire le contenu
- envoyer un email test
- corriger l'objet, le conseil, l'outil ou le prompt si besoin
- passer l'édition en `approved`

Conclusion :
- oui, le système peut tourner chaque semaine
- non, il n'est pas conseillé de laisser partir les emails sans validation au départ

## 7. Secrets et accès critiques

### Secrets principaux

- `CONTENT_ADMIN_TOKEN`
- `NEWSLETTER_SCHEDULER_TOKEN`
- `RESEND_API_KEY`
- `MAIL_FROM`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Règles de sécurité

- ne jamais publier un secret dans le front
- ne jamais envoyer un secret dans un message non sécurisé
- si un secret est perdu, le remplacer proprement
- documenter toute rotation de secret

### Rotation d'un secret

Quand un secret est remplacé :
- vérifier où il est utilisé
- remplacer la valeur dans Supabase ou dans l'environnement concerné
- retester immédiatement le workflow lié

## 8. Déploiements

### Front

Flux normal :
- développement local
- preview
- `npm run build`
- commit
- push sur `main`
- déploiement Cloudflare
- vérification sur le site public

### Backend Supabase

À faire si nécessaire :
- pousser les migrations SQL
- déployer les edge functions concernées
- vérifier les secrets
- tester les flux critiques après déploiement

## 9. Gestion des incidents

### Si une page front casse

1. identifier l'URL concernée
2. reproduire en local
3. vérifier le router et le composant
4. corriger
5. rebuild
6. push
7. vérifier Cloudflare

### Si le back-office ne charge pas

1. vérifier le token admin
2. vérifier les variables Supabase du front
3. vérifier la fonction `content-admin`
4. vérifier la réponse réseau

### Si la newsletter ne part pas

1. vérifier que l'édition existe
2. vérifier son statut
3. vérifier `Dernières diffusions`
4. vérifier la fonction `newsletter-send`
5. vérifier `RESEND_API_KEY`
6. vérifier le domaine email expéditeur

## 10. Checklist avant publication

### Avant toute mise en ligne front

- la page est lisible en desktop
- la page est lisible en mobile
- les CTA sont alignés
- les formulaires s'ouvrent
- le build passe
- le contenu est cohérent FR

### Avant publication d'une ressource

- titre propre
- domaine correct
- résumé utile
- source renseignée
- date correcte
- page article accessible

### Avant envoi newsletter

- édition chargée
- objet correct
- test email envoyé
- rendu email validé
- statut `approved` ou `scheduled`

## 11. Documentation à garder vivante

Ce guide doit être mis à jour :
- à chaque nouvelle rubrique du site
- à chaque nouveau flux automatisé
- à chaque changement de secret ou de procédure
- à chaque évolution importante du back-office
