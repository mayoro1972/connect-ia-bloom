# FAQ Site, Assistant IA et Support

## 1. FAQ publique

### Qu'est-ce que TransferAI Africa ?

TransferAI Africa est une plateforme dédiée à la formation, aux contenus, au conseil et aux solutions IA, avec un ancrage fort en Côte d'Ivoire et une vocation africaine.

### À qui s'adresse le site ?

Le site s'adresse aux professionnels, entreprises, institutions, responsables formation, dirigeants et équipes métiers qui veulent intégrer l'IA avec méthode et impact concret.

### Comment trouver la bonne formation ?

Le plus simple est de commencer par le catalogue, les parcours ou la certification selon votre objectif, votre métier et votre niveau.

### Quelle est la différence entre Catalogue, Parcours et Certification ?

- le catalogue présente l'offre de formation
- les parcours aident à choisir une trajectoire adaptée
- la certification propose un programme structuré avec spécialisation métier

### La certification est-elle destinée à un seul métier ?

Non. Elle repose sur un socle commun puis une spécialisation par domaine ou famille de métiers.

### Combien de domaines sont couverts ?

Le site couvre actuellement 13 domaines d'expertise autour de l'IA appliquée.

### Puis-je consulter des contenus avant de m'inscrire ?

Oui. Le blog, la veille, les guides, les études de cas et la newsletter servent justement à vous donner une vision concrète avant toute décision.

### Le site propose-t-il des contenus pour les entreprises ?

Oui. La page Entreprises présente l'accompagnement, l'audit IA, le conseil, les solutions IA et des contenus utiles pour les décideurs.

### Peut-on demander un audit IA ?

Oui. Une offre d'audit IA est intégrée à la partie Entreprises / Services.

### Le site propose-t-il un espace partenaires ?

Oui. La page Partenaires présente les organisations déjà visibles dans l'écosystème TransferAI Africa et permet aussi de soumettre une demande de référencement ou de partenariat.

### La newsletter est-elle générale ou ciblée ?

Elle est ciblée par domaine. L'abonné choisit les domaines qui l'intéressent.

### Quels types d'informations la newsletter peut-elle contenir ?

Veille utile, signal clé, conseil pratique, outil à connaître, prompt métier, lien vers des ressources et prochaines étapes concrètes.

### Est-ce que l'anglais est disponible partout ?

Non. La logique du site est FR d'abord. L'anglais est réservé aux contenus stratégiques.

### Le site est-il centré uniquement sur la Côte d'Ivoire ?

Le cœur éditorial est Côte d'Ivoire d'abord, avec extension Afrique de l'Ouest puis Afrique selon les sujets.

### Les outils présentés sur le site sont-ils purement théoriques ?

Non. La matrice outils a été pensée pour refléter des usages concrets en entreprise et en formation.

### Comment entrer en contact ?

Le visiteur peut passer par la page Contact, la page Entreprises, les CTA du site ou les formulaires dédiés.

## 2. FAQ blog et contenus

### À quoi sert le blog ?

Le blog sert à informer, crédibiliser, attirer du trafic qualifié et convertir vers les formations, missions et offres entreprise.

### Pourquoi voit-on un badge de type sur les cartes ?

Le badge aide le visiteur à comprendre rapidement s'il s'agit d'une veille, d'un guide, d'une étude de cas ou d'un contenu expertise.

### Pourquoi le mot "Veille" n'apparaît plus dans tous les titres ?

Parce qu'il est déjà porté par le badge. Retirer la répétition rend les titres plus lisibles et plus premium.

### Comment sont classés les contenus ?

Par domaine et par format.

### Peut-on ouvrir un article individuellement ?

Oui. Chaque contenu du blog dispose d'une page article dédiée.

### Le blog peut-il être alimenté automatiquement ?

Oui, partiellement. Le pipeline peut détecter des signaux, proposer des brouillons et préparer du contenu, mais la validation humaine reste recommandée.

## 3. FAQ newsletter

### Comment s'abonner ?

Le visiteur saisit son email et choisit un ou plusieurs domaines.

### Que reçoit un abonné ?

Il reçoit prioritairement les contenus correspondant aux domaines qu'il a choisis.

### L'envoi est-il automatique ?

Le système est conçu pour fonctionner automatiquement chaque semaine, avec une étape de validation humaine recommandée avant envoi réel.

### Faut-il remplir la newsletter manuellement chaque semaine ?

Pas forcément. Le brouillon peut être généré automatiquement. En revanche, il est conseillé de le relire, envoyer un test puis l'approuver.

### Sur quelle base la newsletter est-elle construite ?

Elle peut s'appuyer sur :
- les contenus blog publiés
- les signaux éditoriaux suivis
- les domaines abonnés
- les choix éditoriaux validés dans le back-office

### Pourquoi un test email peut échouer ?

Ca peut venir :
- d'un token admin invalide
- d'une edge function non alignée
- d'un problème de clé Resend
- d'un problème de domaine expéditeur

### Pourquoi certains emails commencent par "Bonjour" et d'autres par "Bonsoir" ?

Parce que les courriers automatiques prennent maintenant en compte l'heure d'envoi côté Côte d'Ivoire :
- avant midi : `Bonjour`
- après midi : `Bonsoir`

### Pourquoi un email a été envoyé en test mais pas en campagne ?

Parce qu'un test n'est pas une diffusion complète. L'édition doit ensuite être approuvée ou planifiée pour passer en campagne.

## 4. FAQ back-office

### Où gère-t-on les ressources ?

Dans `Back-office > Ressources`.

### Où gère-t-on les brouillons IA ?

Dans `Back-office > Brouillons IA`.

### Où gère-t-on la newsletter ?

Dans `Back-office > Newsletter IA`.

### Où gère-t-on les demandes partenaires ?

Dans `Back-office > Partenaires`.

### Pourquoi le back-office demande un token ?

Parce qu'il déclenche des actions d'administration sur Supabase et sur les edge functions.

### Où trouver le token admin ?

Il ne se trouve pas dans le code public. Il doit être récupéré ou remplacé dans les secrets Supabase sous le nom `CONTENT_ADMIN_TOKEN`.

### Que signifie le message "Invalid Token or Protected Header formatting" ?

Cela signifie généralement que le header d'auth n'est pas correct côté front ou qu'un mauvais token a été utilisé.

### Faut-il changer tout le projet si on remplace le `CONTENT_ADMIN_TOKEN` ?

Non, pas si le projet lit déjà le secret par son nom. Il suffit surtout :
- de remplacer la valeur dans Supabase
- d'utiliser la nouvelle valeur dans le back-office

## 5. FAQ déploiement

### Comment se déploie le front ?

Le front suit le flux GitHub puis Cloudflare.

### Comment se déploie le backend ?

Le backend se déploie via Supabase :
- migrations
- edge functions
- secrets si nécessaire

### Faut-il toujours déployer le front et Supabase ensemble ?

Non. Seulement quand une évolution front dépend d'une évolution base de données ou edge functions.

### Que vérifier après un push ?

- la page concernée
- le back-office si touché
- les formulaires critiques
- les emails si un flux email a été modifié

## 6. FAQ assistant IA / chatbot

### Quelle doit être la priorité du chatbot ?

Orienter rapidement le visiteur vers la bonne page et répondre clairement sans inventer.

### Que doit répondre le chatbot si une date de session n'est pas confirmée ?

Il doit rester prudent et proposer une prise de contact ou une demande d'information au lieu d'inventer.

### Le chatbot peut-il répondre en anglais ?

Oui, mais seulement lorsque le contexte ou le contenu stratégique le justifie.

### Le chatbot doit-il pousser les visiteurs vers une seule offre ?

Non. Il doit d'abord comprendre l'intention du visiteur puis orienter vers la page pertinente.

## 7. FAQ incidents fréquents

### Le formulaire d'audit n'ouvre pas

Vérifier :
- la route front
- le lien utilisé par le bouton
- la page cible réelle
- le déploiement Cloudflare si le fix a déjà été poussé

### Une demande partenaire existe mais aucune réponse ne part

Vérifier :
- qu'un dossier réel est bien sélectionné
- que l'email du prospect est présent
- que le corps de réponse a été généré ou rédigé
- que la fonction `partner-followup-send` est bien déployée
- que la clé Resend est correcte

### Le blog charge mal ou certaines cartes débordent

Vérifier :
- le composant de carte
- les hauteurs minimales
- les lignes clamp
- les libellés trop longs des domaines

### Le back-office charge mais les compteurs restent à zéro

Vérifier :
- le token admin
- les appels à `content-admin`
- les réponses réseau
- l'environnement Supabase

### Une newsletter est marquée envoyée mais rien n'arrive

Vérifier :
- les logs de diffusion
- la clé Resend
- l'adresse expéditrice
- les spams et promotions

### Le brouillon hebdomadaire ne se crée pas

Vérifier :
- la fonction `newsletter-scheduler`
- le secret `NEWSLETTER_SCHEDULER_TOKEN`
- les cron jobs
- l'existence ou non d'une édition déjà créée pour la même date
