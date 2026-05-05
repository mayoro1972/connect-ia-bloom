# Roadmap Historique du Projet

## 1. Vision générale

Le projet TransferAI Africa a évolué d’un site vitrine orienté formation vers une plateforme structurée combinant :

- formation
- certification
- offre entreprise
- contenus dynamiques
- outils IA par domaine
- back-office
- pipeline éditorial
- newsletter ciblée
- flux WhatsApp et notifications

## 2. Phases de construction

### Phase 1. Construction du socle front

Livrables :

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

- résoudre les problèmes de chargement et compatibilité navigateur

### Phase 3. Refonte de lisibilité et simplification UX

Objectif :

- rendre les pages plus claires
- alléger les parcours
- hiérarchiser l’information

### Phase 4. Naissance du blog dynamique

Livrables :

- blog dynamique
- filtres domaine + type
- pages article
- 13 contenus initiaux de veille

### Phase 5. Pipeline éditorial IA

Livrables :

- tables éditoriales
- sources suivies
- signaux détectés
- brouillons IA
- fonctions discovery / classifier / drafter

### Phase 6. Matrice des outils IA

Livrables :

- page outils IA
- matrice par domaine
- formats recommandés

### Phase 7. Refonte de la certification sectorielle

Livrables :

- spécialisation métier
- programme 5 jours
- évaluation continue simplifiée

### Phase 8. Newsletter par domaine

Livrables :

- inscription newsletter
- table abonnements
- confirmations email
- interface back-office newsletter

### Phase 9. Pipeline newsletter et automatisation hebdomadaire

Livrables :

- `newsletter_issues`
- `newsletter_delivery_logs`
- `newsletter-drafter`
- `newsletter-send`
- `newsletter-scheduler`

### Phase 10. Fiabilisation des flux admin

Livrables :

- fix des liens cassés
- fix audit
- validation de tests email réels

### Phase 11. Simplification éditoriale et fluidité UX

Résultats :

- simplification accueil
- simplification à propos
- simplification catalogue
- simplification parcours
- simplification certification
- meilleure mise en avant de l’audit IA gratuit

### Phase 12. Pipeline partenaires et relation email

Livrables :

- page partenaires clarifiée
- formulaire public
- back-office partenaires
- recommandation IA
- email de réponse

### Phase 13. Clarification de la page Contact

Livrables :

- `Parler à un expert IA`
- variantes par intention
- correction des liens profonds

### Phase 14. Distribution catalogue et emails transactionnels

Livrables :

- demandes catalogue plus actionnables
- accès direct au bon contenu
- emails plus cohérents

### Phase 15. Newsletter fondatrice, page média et flux emploi

Livrables :

- newsletter fondatrice envoyée
- page média simplifiée
- route `/parler-emploi-ia`
- CTA emploi corrigé
- liens replay corrigés

### Phase 16. Capsules vidéo et flux TikTok

Objectif :

- remplacer une logique statique par un flux piloté par backend

Livrables :

- table `social_video_posts`
- support admin `Capsules vidéo`
- page `CreateurContenuIA` alimentée par backend
- fallback brandé propre si embed non exploitable

### Phase 17. Pipeline WhatsApp et BackOffice WhatsApp V1

Objectif :

- transformer WhatsApp en vrai canal opérationnel administrable

Livrables :

- bouton WhatsApp orienté IA sur le site
- webhook `twilio-whatsapp-webhook`
- table `whatsapp_inbound_messages`
- validation Twilio -> Supabase
- module `BackOffice > WhatsApp`
- statuts
- catégories
- notes internes
- ouverture de réponse WhatsApp

### Phase 18. Notifications internes WhatsApp et observabilité

Objectif :

- rendre visible et traçable chaque nouveau message entrant

Livrables :

- notification email interne sur nouveau message WhatsApp
- double envoi vers `contact@transferai.ci` et `marius.ayoro70@gmail.com`
- table `whatsapp_email_notification_logs`
- validation bout-en-bout WhatsApp -> email

### Phase 19. Documentation BackOffice et gouvernance documentaire

Objectif :

- réaligner la documentation avec l’état réel du site et du backend

Livrables :

- guide administrateur renforcé
- base de connaissance site mise à jour
- FAQ alignée sur les workflows réels
- plan d’exploitation réaligné
- note direction mise à jour
- guide BackOffice en anglais
- exports Word régénérés

### Phase 20. Chatwoot website et préparation assistant IA

Objectif :

- préparer le chat web TransferAI et la future couche assistant IA orchestrée

Livrables :

- inbox website `TransferAI`
- labels et custom attributes Chatwoot
- canned responses et macros de qualification
- script widget Chatwoot intégré au site
- widget visible en local
- webhook `Chatwoot -> n8n` validé sur `chatwoot-inbound`
- blueprint n8n, checklist et mapping Chatwoot disponibles

## 3. Jalons visibles dans l’historique récent

Les jalons récents majeurs incluent notamment :

- structuration du blog et des pages article
- simplification éditoriale de plusieurs pages clés
- mise en avant renforcée de l’audit IA
- pipeline partenaires et emails de suivi
- industrialisation de la newsletter
- flux média / emploi / replay
- flux vidéo / TikTok piloté par backend
- pipeline WhatsApp complet
- BackOffice WhatsApp V1
- notifications email internes sur messages WhatsApp
- documentation et exports Word mis à jour

## 4. Lecture de maturité au 2 mai 2026

Le projet n’est plus un simple site institutionnel.

Il est devenu :

- une vitrine commerciale crédible
- une base éditoriale structurée
- un cockpit d’administration
- une base de connaissance exploitable
- un socle pour automatisations IA plus avancées
- une base concrète pour un assistant IA web + WhatsApp

## 5. Jalons Chatwoot + n8n observes au 5 mai 2026

### Phase 21. Stabilisation V2 Chatwoot + n8n

Objectif :

- sortir d'un cycle de debug instable
- obtenir une reponse automatique fiable sans boucle

Livrables :

- workflow `Chatwoot -> n8n -> reponse statique` stabilise
- path dedie `chatwoot-inbound-v2`
- remplacement du noeud `If` par un noeud `Code`
- URL HTTP Chatwoot corrigee
- boucle de reponse eliminee
- webhook public valide en production

### Phase 22. Validation V3 OpenAI

Objectif :

- remplacer la reponse statique par une vraie reponse IA contextualisee

Livrables :

- workflow V3 dedie sur `chatwoot-inbound-v3`
- appel OpenAI stable
- prompt systeme TransferAI exploitable
- fallback statique conserve
- message IA valide dans une conversation Chatwoot reelle
- V2 conservee comme filet de securite

### Phase 23. Cible V4 Memoire conversationnelle

Objectif :

- eviter que le bot repose les memes questions
- reutiliser l'historique Chatwoot comme memoire

Livrables cibles :

- webhook V4 dedie sur `chatwoot-inbound-v4`
- recuperation de l'historique de conversation Chatwoot
- injection de l'historique dans le prompt OpenAI
- deduplication du message courant
- meilleure continuite conversationnelle

## 6. Lecture de maturite au 5 mai 2026

Le projet n'est plus seulement une base pour un assistant IA.

Il est devenu :

- un systeme Chatwoot + n8n fonctionnel en production
- un socle stable avec fallback V2
- une V3 IA contextualisee validee
- une base prete pour une V4 avec memoire
- une architecture modulaire evolutive vers qualification, scoring et handoff humain
