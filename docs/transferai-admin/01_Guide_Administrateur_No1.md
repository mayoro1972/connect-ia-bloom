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
- Partenaires
- Contact / formulaires
- Pages preview et hubs secondaires

### Back-office

Onglets actuels :
- Analytics
- Ressources
- Brouillons IA
- Newsletter IA
- Partenaires
- Emplois IA
- Mode d'emploi

### Backend Supabase

Tables et flux principaux :
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
- `partner-review-drafter`
- `partner-followup-send`

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
- vérifier les demandes catalogue et leur email automatique associé
- vérifier le blog, la page entreprises, la certification et le formulaire d'audit
- vérifier les nouvelles demandes partenaires si la rubrique est active
- vérifier les variantes importantes de la page contact selon les paramètres d'URL
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

### E. Gestion des partenaires

Dans `Partenaires` :
- sélectionner une demande réelle reçue depuis le formulaire public
- relire les informations société, secteur, besoin et calendrier
- générer la recommandation IA si nécessaire
- ajuster la formule recommandée
- relire le sujet et le corps de la réponse
- marquer `approved` quand la réponse est prête
- envoyer la réponse finale au prospect

Bonnes pratiques :
- ne pas envoyer une réponse si le corps email est vide
- vérifier que le secteur / activité est correctement renseigné
- conserver une approche sélective et crédible
- utiliser le back-office pour répondre, pas un email improvisé hors process

### F. Gestion des parcours contact

La page `Contact` n'est plus une page unique et générique. Elle sert désormais de conteneur pour plusieurs variantes de formulaires selon l'intention exprimée par le visiteur.

Les cas principaux à connaître sont :
- `Parler à un expert IA` : porte d'entrée commerciale standard pour une demande de formation, d'accompagnement ou d'orientation
- `demande-referencement` : variante dédiée au référencement partenaire
- `demande-renseignement + Partenariat stratégique` : variante dédiée aux discussions de partenariat institutionnel ou stratégique
- demande catalogue : parcours pensé pour recevoir un catalogue domaine
- inscription formation : demande plus directe liée à une formation ou une cohorte

Bon réflexe admin :
- vérifier les liens profonds après chaque déploiement front
- tester la version standard ET la version paramétrée par `intent`
- ne pas supposer qu'un lien `Contact` public affichera toujours le même formulaire

### G. Gestion des demandes catalogue

Le site gère désormais un parcours catalogue plus direct.

À retenir :
- une demande catalogue claire peut déclencher un email enrichi avec accès immédiat au catalogue demandé
- ce flux passe par `send-prospect-emails`
- l'objectif n'est pas de ralentir le prospect, mais de lui donner rapidement la bonne ressource puis une suite logique

Checklist admin :
- vérifier que le domaine demandé est bien compris
- vérifier que l'email de réponse pointe vers le bon catalogue
- vérifier que le CTA audit n'apparaît que s'il a du sens comme prochaine étape
- vérifier que le ton du message reste orienté formation et non rendez-vous générique

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

## 7.1. Logique email transactionnelle à retenir

Les emails automatiques du site suivent désormais une règle horaire simple basée sur la Côte d'Ivoire :
- avant `12:00` : utiliser `Bonjour`
- à partir de `12:00` : utiliser `Bonsoir`

Cette règle s'applique aux principaux flux automatisés :
- accusés de réception prospects
- confirmations newsletter
- réponses partenaires
- réponses catalogue
- confirmations d'inscription ou de demande formation

Important :
- pour les réponses partenaires, la salutation est réajustée au moment de l'envoi réel
- cela évite qu'un brouillon généré le matin parte encore avec `Bonjour` le soir

## 7.2. Qualité attendue des emails prospects

Les emails automatiques doivent maintenant respecter une logique de clarté par cas d'usage :
- une demande d'inscription ne doit pas afficher un lien de RDV ambigu si le besoin est déjà une candidature
- une demande de formation doit reformuler le besoin, résumer les éléments compris et annoncer la prochaine étape utile
- une demande catalogue doit proposer l'accès direct au bon catalogue sans détour inutile
- une demande partenaire doit distinguer clairement référencement, visibilité ou partenariat stratégique

Règle simple :
- ne pas injecter un CTA de rendez-vous dans un email si ce rendez-vous n'est pas la prochaine étape logique
- ne pas mélanger devis, audit, inscription et orientation dans un même accusé de réception

## 8. Secrets et accès critiques

## 9. Déploiement manuel utile à retenir

Quand une évolution touche la fonction `send-prospect-emails`, le point important est :
- se placer dans le dépôt racine `connect-ia-bloom`
- ne pas lancer la commande depuis `~` ou un autre dossier

Commande-type :

```bash
supabase functions deploy send-prospect-emails --project-ref wlhznciwuofueffyoflo
```

Si l'erreur mentionne `Entry path does not exist`, cela signifie généralement que la commande n'a pas été lancée depuis la racine du dépôt.

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

## 9. Déploiements

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

## 10. Gestion des incidents

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

### Si une réponse partenaire ne part pas

1. vérifier que le dossier sélectionné est réel
2. vérifier que `prospect_email` est bien renseigné
3. vérifier que `response_email_body_fr` n'est pas vide
4. vérifier `partner-followup-send`
5. vérifier `RESEND_API_KEY`
6. vérifier le token admin si l'action part du back-office

## 11. Checklist avant publication

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

### Avant envoi d'une réponse partenaire

- dossier partenaire réel chargé
- formule recommandée cohérente
- sujet email relu
- corps email relu
- salutation correcte
- statut `approved` si le workflow l'exige

## 12. Documentation à garder vivante

Ce guide doit être mis à jour :
- à chaque nouvelle rubrique du site
- à chaque nouveau flux automatisé
- à chaque changement de secret ou de procédure
- à chaque évolution importante du back-office

## 13. Derniers changements à retenir au 11 avril 2026

Les changements structurants les plus récents sont :
- simplification de pages denses pour améliorer la lisibilité et la conversion
- audit IA gratuit mieux mis en avant dans le parcours visiteur
- pipeline partenaire complet avec formulaire public, back-office, recommandation et email de suivi
- nouvelle discipline éditoriale sur le blog : badge de type visible, titres allégés, moins de répétitions
- logique `FR d'abord`, EN seulement pour les contenus et usages stratégiques
- fiabilisation des parcours `Contact` avec variantes publiques plus cohérentes
- amélioration des réponses automatiques pour les demandes de catalogue, de formation et d'inscription
