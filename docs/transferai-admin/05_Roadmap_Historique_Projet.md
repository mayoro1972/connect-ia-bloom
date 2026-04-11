# Roadmap Historique du Projet

## 1. Vision générale

Le projet TransferAI Africa a évolué d'un site vitrine orienté formation vers une plateforme beaucoup plus structurée, combinant :
- formation
- certification
- offre entreprise
- contenus dynamiques
- outils IA par domaine
- back-office
- pipeline éditorial
- newsletter ciblée et automatisée

## 2. Phases de construction

### Phase 1. Construction du socle front

Objectif :
- mettre en place les pages principales du site

Livrables majeurs :
- accueil
- éducation
- catalogue
- détail formation
- parcours
- certification
- entreprises / services
- contact

### Phase 2. Stabilisation et compatibilité

Objectif :
- résoudre les problèmes de chargement et de compatibilité navigateur

Signaux observés dans l'historique git :
- diagnostics Safari
- ajustements Vite
- sécurisation du chargement dynamique

### Phase 3. Refonte de lisibilité et simplification UX

Objectif :
- rendre les pages plus claires
- alléger les parcours
- mieux hiérarchiser l'information

Résultats :
- simplification des navigations
- simplification de la page entreprises
- simplification de certaines pages certification et outils
- alignement des cartes et CTA

### Phase 4. Naissance du blog dynamique

Objectif :
- créer un vrai hub ressources

Étapes majeures :
- page blog dynamique
- filtres domaine + type
- pages article individuelles
- pages blog par domaine
- 13 contenus de veille couvrant les 13 domaines
- dates d'articles rendues dynamiques

### Phase 5. Construction du pipeline éditorial IA

Objectif :
- permettre à l'équipe de détecter, classer et rédiger des contenus avec assistance IA

Livrables :
- tables éditoriales
- sources suivies
- signaux détectés
- brouillons IA
- back-office dédié
- fonctions discovery / classifier / drafter

### Phase 6. Construction de la matrice outils IA

Objectif :
- structurer le discours formation et B2B autour des outils réellement utilisés

Livrables :
- page outils IA
- matrice par domaine
- formats de formation
- catalogue outils / usages / niveaux

### Phase 7. Refonte de la certification sectorielle

Objectif :
- sortir d'une certification trop générique

Livrables :
- objectifs par domaine
- programme 5 jours par domaine
- spécialisation sectorielle
- évaluation continue plus simple
- suppression de la logique de soutenance jury

### Phase 8. Newsletter par domaine

Objectif :
- fidéliser l'audience et prolonger la valeur du blog

Livrables :
- inscription newsletter par domaine sur le blog
- table abonnements
- confirmations email
- interface back-office newsletter
- structure éditoriale officielle

### Phase 9. Pipeline newsletter et automatisation hebdomadaire

Objectif :
- préparer un système quasi autonome mais pilotable

Livrables :
- table `newsletter_issues`
- table `newsletter_delivery_logs`
- fonction `newsletter-drafter`
- fonction `newsletter-send`
- fonction `newsletter-scheduler`
- cron hebdomadaire de génération
- cron hebdomadaire d'envoi
- garde-fou d'approbation humaine

### Phase 10. Correction et fiabilisation des flux admin

Objectif :
- rendre le back-office réellement exploitable

Livrables et corrections marquantes :
- fix du formulaire d'audit
- fix des liens cassés
- fix d'auth des edge functions admin pour la newsletter
- validation d'un test email réel

### Phase 11. Simplification éditoriale et fluidité UX

Objectif :
- réduire la surcharge d'information
- rendre les pages plus lisibles
- améliorer la compréhension dès la première lecture

Livrables et résultats :
- simplification de l'accueil
- simplification de la page à propos
- simplification du catalogue
- simplification des parcours
- simplification de la certification
- simplification de l'education hub
- simplification du blog et des pages entreprises
- meilleure mise en avant de l'audit IA gratuit

### Phase 12. Pipeline partenaires et relation email

Objectif :
- transformer la rubrique partenaires en vrai parcours administrable
- industrialiser la réponse aux demandes de référencement

Livrables :
- page partenaires clarifiée
- formulaire public de demande de référencement
- back-office partenaires
- grille officielle des formules partenaires
- recommandation IA de formule
- email automatique de réponse au prospect
- normalisation horaire des salutations `Bonjour / Bonsoir`

## 3. Jalons visibles dans l'historique git récent

Les jalons majeurs récents identifiés dans le dépôt :

- `48ae469` Build article pages for blog resources
- `99abf8c` Seed watch articles and add dynamic article dates
- `b10fd3a` Add blog domain and type filters
- `1e7407f` Build editorial pipeline and admin drafts workflow
- `2a8dcfd` Add SEO-ready blog domain pages
- `afda68c` Add domain newsletter signup for blog
- `891f6ae` Polish card alignment across blog and learning pages
- `3378901` Refine certification specialization content
- `8ba01cf` Simplify navigation and learning journeys
- `73b5240` Simplify certification tools and catalogue pages
- `0332c0d` Polish blog enterprise flows and fix audit form link
- `339c666` Simplify enterprise services page
- `c9bfbd4` Add newsletter confirmation emails
- `b74da84` Add weekly newsletter editorial pipeline
- `655499a` Automate weekly newsletter scheduling
- `8ac7720` Fix admin edge auth for newsletter actions
- `ab98d46` Refine blog and enterprise page messaging
- `15d3550` Externalize certification offer metadata
- `a6fa61f` Simplify catalogue page messaging
- `efd3a34` Simplify education hub messaging
- `001f682` Simplify parcours page messaging
- `086e06d` Simplify home page and add audit CTA
- `8daf826` Simplify about page messaging
- `23e63d1` Refine partners page structure and offers
- `39400fe` Refine partner listing flow and email follow-up
- `2d385f2` Add partner listing admin pipeline
- `d1c8428` Add time-based email greetings

## 4. Ce qui existe maintenant

Le site dispose maintenant de :
- un front structuré
- un blog éditorial cohérent
- des pages articles
- un back-office utilisable
- un pipeline éditorial IA
- une newsletter par domaine
- un envoi test réel validé
- une base de connaissance outils / certification / domaines
- un audit IA gratuit mieux visible dans le parcours B2B
- une page partenaires administrable
- une relation email plus professionnelle et plus cohérente

## 5. Ce qui reste logique pour la suite

Les prochains axes rationnels sont :
- industrialiser encore la génération éditoriale
- enrichir la base de connaissance du futur assistant IA
- améliorer la relation email au-delà de la seule veille
- renforcer les dashboards analytics utiles à l'admin
- préparer davantage de contenus stratégiques EN
- finaliser la simplification des pages les plus denses restantes, notamment services et contact

## 6. Lecture business de l'évolution

Le projet n'est plus simplement un site. Il est devenu :
- un outil de conversion
- un outil de crédibilité
- un outil d'animation éditoriale
- un socle de future relation automatisée avec prospects et abonnés
- une base exploitable pour un assistant IA TransferAI
