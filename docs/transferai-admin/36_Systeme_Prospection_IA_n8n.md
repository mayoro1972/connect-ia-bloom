# Système de prospection IA automatisée avec n8n

Date : 2026-05-22

## Objet

Ce document définit le système de prospection automatisée que TransferAI Africa peut mettre en place avec **n8n**, un **assistant IA**, une **base CRM évolutive**, une **couche d'enrichissement public** et une **logique d'adaptation commerciale**.

L'objectif n'est pas de produire du volume pour le volume.

L'objectif est de bâtir une machine de prospection :

- ciblée ;
- utile ;
- défendable commercialement ;
- traçable ;
- encadrée du point de vue conformité ;
- et capable de produire des prises de contact de qualité à partir d'une lecture métier réelle.

## 1. Ce que nous voulons obtenir

Le système doit permettre à TransferAI Africa de :

- constituer une **base CRM initiale d'au moins 100 structures et contacts** ;
- faire croître cette base dans le temps à partir de sources publiques et de recherches régulières ;
- identifier les structures, institutions ou personnes ayant un intérêt potentiel pour l'IA ;
- enrichir les fiches avec des signaux utiles : secteur, taille, enjeux visibles, signaux de transformation, besoins probables ;
- analyser les **forces, faiblesses, opportunités et points d'entrée commerciaux** ;
- proposer automatiquement une **offre adaptée à la structure** ;
- préparer un **pré-audit gratuit en arrière-plan** à partir des données publiques disponibles ;
- produire un **premier message de contact** adapté au canal ;
- adapter automatiquement :
  - le courrier ;
  - le mini-catalogue ;
  - le support PowerPoint ;
  - et le cas d'usage à présenter en rendez-vous ;
- limiter le volume à une cadence raisonnable, par exemple **3 à 5 courriers qualifiés par cycle**, puis arrêter si les signaux ne justifient pas la suite.

## 2. Ce que le système ne doit pas devenir

Le système ne doit pas devenir :

- un robot de spam massif ;
- un aspirateur incontrôlé de données personnelles ;
- un outil de scraping agressif sans discernement ;
- un moteur qui envoie automatiquement sur WhatsApp ou sur les réseaux sociaux sans base légitime ;
- un système qui invente les besoins des prospects sans preuve ou sans hypothèse explicitement formulée.

## 3. Vision cible

Le bon système est un **copilote de prospection intelligente**.

Il travaille en 6 temps :

1. **collecter**
2. **structurer**
3. **analyser**
4. **proposer**
5. **rédiger**
6. **décider d'envoyer ou non**

Autrement dit, l'assistant IA ne doit pas seulement écrire des messages.

Il doit d'abord :

- comprendre la structure ;
- identifier une niche ou une porte d'entrée ;
- proposer la bonne offre ;
- et seulement ensuite générer le contact commercial.

## 4. Attentes métier

### 4.1 Attentes sur la CRM

La CRM doit pouvoir accueillir au départ :

- au moins **100 structures** ;
- des sociétés privées ;
- des institutions publiques ;
- des organisations internationales ;
- des ONG ou associations ;
- des dirigeants ou personnes physiques ;
- des prospects individuels pertinents ;
- puis s'enrichir progressivement.

La CRM doit ensuite croître sans remise à plat.

Elle doit être pensée dès le départ pour :

- absorber des données supplémentaires ;
- historiser les contacts ;
- stocker les analyses IA ;
- stocker les tentatives de contact ;
- stocker les réactions, réponses, silences et désabonnements ;
- et garder une mémoire commerciale propre.

### 4.2 Attentes sur l'intelligence commerciale

Le système doit être capable d'inférer, à partir de données publiques :

- les sujets probables d'intérêt pour la structure ;
- les enjeux métier visibles ;
- les priorités possibles ;
- les points de douleur probables ;
- le bon angle commercial ;
- le bon niveau de langage ;
- et le bon cas d'usage à proposer.

### 4.3 Attentes sur l'automatisation

Le système doit être capable de :

- tourner chaque jour ou chaque semaine ;
- récupérer de nouveaux signaux ;
- enrichir les fiches déjà existantes ;
- proposer des prospects prioritaires ;
- préparer des messages de contact ;
- envoyer seulement si les conditions de qualité sont réunies ;
- s'arrêter si le prospect n'est pas suffisamment qualifié ;
- et limiter le nombre de messages pour éviter le bruit commercial.

## 5. Rôle de l'assistant IA

## **Nom fonctionnel recommandé : Assistant IA de Prospection et Qualification**

### 5.1 Son rôle principal

L'assistant IA n'est pas un simple rédacteur d'e-mails.

Son rôle est de :

- lire l'information publique disponible ;
- structurer une fiche prospect exploitable ;
- déduire les signaux d'intérêt pour l'IA ;
- proposer une niche ou un point d'entrée ;
- effectuer un pré-audit commercial à partir des données publiques ;
- recommander l'offre TransferAI la plus pertinente ;
- adapter le courrier, le catalogue et le PowerPoint ;
- préparer un cas d'usage crédible à présenter en rendez-vous ;
- et recommander l'action suivante : envoyer, attendre, enrichir ou abandonner.

### 5.2 Ce qu'il ne doit pas faire seul

L'assistant IA ne doit pas décider seul :

- d'envoyer un message à une personne physique sensible ;
- d'écrire à un canal privé sans base légitime ;
- d'utiliser une donnée douteuse ou non vérifiée ;
- d'envoyer plusieurs relances agressives ;
- de lancer une campagne massive sans validation humaine ;
- de conclure qu'une entreprise a un besoin sans le formuler comme hypothèse.

### 5.3 Son mode de fonctionnement idéal

L'assistant doit agir comme un **analyste commercial augmenté**.

Il doit produire :

- une lecture métier ;
- un résumé ;
- une hypothèse de besoin ;
- une offre recommandée ;
- un niveau de confiance ;
- une recommandation d'envoi ou de non-envoi.

## 6. Schéma fonctionnel du système

Le système peut être organisé en 7 blocs.

### Bloc 1 : Collecte publique

Sources autorisées de base :

- sites web officiels ;
- pages “à propos”, “services”, “carrières”, “actualités”, “partenaires” ;
- blogs d'entreprise ;
- communiqués de presse ;
- annuaires professionnels ;
- résultats de recherche web ;
- pages d'institutions ;
- pages de conférences, webinaires, appels à projets, appels d'offres ;
- publications publiques accessibles sans authentification.

Sources à traiter avec prudence :

- réseaux sociaux ;
- profils personnels ;
- canaux privés ;
- plateformes avec conditions d'utilisation restrictives ;
- données publiées sans structure ni contexte.

### Bloc 2 : Normalisation CRM

Chaque structure doit devenir une fiche CRM unifiée.

### Bloc 3 : Enrichissement

Le système enrichit la fiche avec :

- secteur ;
- pays ;
- site web ;
- type d'organisation ;
- taille apparente ;
- services visibles ;
- signaux de digitalisation ;
- signaux de croissance ;
- enjeux probables ;
- thèmes IA potentiellement pertinents ;
- niveau de priorité commerciale.

### Bloc 4 : Pré-audit automatisé

À partir des données publiques, l'assistant produit :

- un mini-diagnostic ;
- des hypothèses de forces ;
- des hypothèses de faiblesses ;
- des hypothèses d'opportunités ;
- une niche ou porte d'entrée ;
- l'offre TransferAI recommandée ;
- les formations pertinentes ;
- un cas d'usage à proposer.

### Bloc 5 : Génération des actifs commerciaux

Le système doit être capable de générer :

- un courrier ;
- un e-mail ;
- un message WhatsApp si autorisé ;
- un message LinkedIn ou réseau social si autorisé ;
- un mini-catalogue ciblé ;
- un PowerPoint adapté ;
- un cas d'usage résumable en rendez-vous.

### Bloc 6 : Décision d'envoi

Le système n'envoie pas par défaut.

Il vérifie :

- la qualité minimale de la fiche ;
- la cohérence de l'offre proposée ;
- le bon canal ;
- le respect des règles de prospection ;
- l'absence de doublon récent ;
- la pertinence du contact ;
- et le niveau de confiance de l'analyse.

### Bloc 7 : Suivi et arrêt

Le système doit pouvoir :

- suivre l'envoi ;
- enregistrer la réponse ;
- déclencher une relance si autorisée ;
- s'arrêter si aucun intérêt n'apparaît ;
- et basculer en statut “à abandonner” ou “à revoir plus tard”.

## 7. Structure CRM recommandée

La CRM doit être structurée autour de plusieurs entités.

## 7.1 Table `organizations`

Champs recommandés :

- `id`
- `organization_name`
- `organization_type`
- `sector`
- `subsector`
- `country`
- `city`
- `website`
- `main_public_url`
- `linkedin_company_url`
- `description_short`
- `visible_services`
- `estimated_size_bucket`
- `estimated_maturity_bucket`
- `public_signal_score`
- `ai_relevance_score`
- `priority_score`
- `status`
- `created_at`
- `updated_at`

## 7.2 Table `people`

Champs recommandés :

- `id`
- `organization_id`
- `full_name`
- `job_title`
- `role_category`
- `email`
- `phone`
- `linkedin_profile_url`
- `whatsapp_opt_in_status`
- `contact_source`
- `prospecting_legal_basis`
- `opt_out_status`
- `is_decision_maker`
- `confidence_level`
- `created_at`
- `updated_at`

## 7.3 Table `organization_research`

Champs recommandés :

- `id`
- `organization_id`
- `source_url`
- `source_type`
- `scraped_at`
- `source_title`
- `source_excerpt`
- `structured_signals_json`
- `signal_confidence`

## 7.4 Table `organization_analysis`

Champs recommandés :

- `id`
- `organization_id`
- `analysis_date`
- `summary`
- `probable_strengths`
- `probable_weaknesses`
- `probable_needs`
- `entry_point_niche`
- `recommended_offer`
- `recommended_training_bundle`
- `recommended_use_case`
- `recommended_channel`
- `send_recommendation`
- `confidence_score`
- `analyst_mode`

## 7.5 Table `outreach_assets`

Champs recommandés :

- `id`
- `organization_id`
- `asset_type`
- `asset_title`
- `asset_path`
- `version`
- `generated_at`

### Types d'actifs possibles

- `email_letter`
- `whatsapp_intro`
- `linkedin_message`
- `mini_catalogue`
- `pitch_deck`
- `use_case_note`

## 7.6 Table `outreach_attempts`

Champs recommandés :

- `id`
- `organization_id`
- `person_id`
- `channel`
- `message_variant`
- `sent_at`
- `delivery_status`
- `response_status`
- `response_date`
- `follow_up_due_at`
- `stop_reason`

## 7.7 Table `do_not_contact`

Champs recommandés :

- `id`
- `organization_id`
- `person_id`
- `channel`
- `reason`
- `recorded_at`

## 8. Canaux autorisés et garde-fous

## 8.1 E-mail

L'e-mail est le canal le plus réaliste pour démarrer.

Point de conformité important :

Selon la CNIL, la prospection commerciale par courriel n'obéit pas aux mêmes règles selon qu'il s'agit de **particuliers** ou de **professionnels**. La prospection B2B peut reposer sur l'intérêt légitime si elle est en lien avec la fonction de la personne et si un droit d'opposition clair est prévu. La prospection B2C exige en principe un consentement préalable.[Source](https://www.cnil.fr/la-prospection-commerciale-par-courrier-electronique)

### Règles recommandées

- privilégier le B2B ;
- cibler des adresses professionnelles ;
- ne pas écrire à des particuliers sans base claire ;
- toujours expliciter l'identité de l'émetteur ;
- inclure une possibilité claire d'opposition ;
- éviter les envois de masse non qualifiés.

## 8.2 WhatsApp

WhatsApp ne doit pas être utilisé comme canal de prospection froide par défaut.

### Règles recommandées

- n'utiliser WhatsApp que si le contact a déjà interagi, a donné son numéro dans un cadre professionnel ou a consenti ;
- garder WhatsApp pour des suites de relation, rappels ou échanges chauds ;
- ne pas utiliser ce canal comme équivalent d'un spam SMS.

## 8.3 Réseaux sociaux

Les réseaux sociaux doivent être utilisés avec prudence.

### Règles recommandées

- privilégier les informations publiques accessibles légalement ;
- éviter le scraping agressif ou contraire aux conditions d'utilisation ;
- privilégier l'usage d'API officielles ou la recherche manuelle assistée si nécessaire ;
- ne pas industrialiser l'envoi automatique massif de messages privés.

## 8.4 Site web / formulaire / landing page

Le site web peut servir de canal de conversion et de preuve :

- page dédiée ;
- audit gratuit ;
- prise de rendez-vous ;
- téléchargement du mini-catalogue ;
- dépôt de formulaire.

## 9. Politique de scraping recommandée

Le système doit reposer sur une politique simple :

## **collecter moins, qualifier mieux, tracer davantage**

### À privilégier

- sites officiels ;
- contenus clairement publics ;
- communiqués ;
- pages de services ;
- pages carrières ;
- annonces institutionnelles ;
- moteurs de recherche ;
- signaux structurés.

### À éviter

- collecte invasive de données personnelles ;
- collecte ou inférence de données sensibles non nécessaires ;
- stockage inutile de textes bruts massifs ;
- récupération de données privées ou non nécessaires ;
- collecte de numéros ou e-mails personnels non justifiés ;
- scraping en violation manifeste des conditions d'un service.

## 10. Rôle opérationnel de n8n

Les sources officielles de n8n décrivent l'**AI Agent node** comme un agent capable d'utiliser des outils et de choisir quoi faire selon la tâche. Cela correspond bien à notre besoin, mais seulement si l'agent reste encadré par des règles métier et de validation.[Source](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)

Dans ce système, **n8n** joue le rôle d'orchestrateur :

- déclenchement ;
- scraping ;
- enrichissement ;
- appel à l'assistant IA ;
- stockage CRM ;
- génération des actifs ;
- envoi conditionnel ;
- journalisation ;
- stop rules.

## 11. Workflow n8n recommandé

Le workflow peut être découpé en 10 sous-workflows.

## 11.1 Workflow A - Collecte quotidienne

Déclencheur :

- `Cron`

Étapes :

1. lancer la liste des sources à parcourir ;
2. appeler les outils de scraping autorisés ;
3. stocker les pages ou extraits utiles ;
4. dédupliquer ;
5. envoyer vers la normalisation.

## 11.2 Workflow B - Normalisation CRM

Déclencheur :

- `Webhook interne` ou `Execute Workflow`

Étapes :

1. identifier l'organisation ;
2. créer ou mettre à jour la fiche CRM ;
3. associer les personnes trouvées ;
4. scorer la qualité minimale de la donnée.

## 11.3 Workflow C - Enrichissement IA

Étapes :

1. envoyer les données publiques structurées à l'assistant ;
2. récupérer :
   - résumé ;
   - signaux ;
   - niche ;
   - point d'entrée ;
   - offre recommandée ;
   - cas d'usage ;
   - canal recommandé ;
3. stocker le résultat dans `organization_analysis`.

## 11.4 Workflow D - Pré-audit automatique

Étapes :

1. relire les signaux publics ;
2. générer un pré-audit “hypothèses à valider” ;
3. produire une synthèse direction ;
4. choisir le bon pack commercial.

## 11.5 Workflow E - Génération des actifs

Étapes :

1. choisir le template courrier ;
2. adapter le mini-catalogue ;
3. adapter le PowerPoint de présentation ;
4. produire un cas d'usage résumé ;
5. enregistrer les livrables.

## 11.6 Workflow F - Contrôle avant envoi

Conditions minimales d'envoi :

- organisation suffisamment qualifiée ;
- offre clairement reliée à un besoin probable ;
- canal valide ;
- pas de blocage conformité ;
- pas de doublon récent ;
- score de confiance suffisant ;
- pas de statut `do_not_contact`.

## 11.7 Workflow G - Envoi e-mail

Étapes :

1. sélectionner jusqu'à **3 à 5 courriers qualifiés** ;
2. injecter la version du message adaptée ;
3. journaliser l'envoi ;
4. marquer le prospect comme `contacted`.

## 11.8 Workflow H - Suivi des réactions

Étapes :

1. détecter ouverture, réponse ou rebond si possible ;
2. changer le statut CRM ;
3. préparer la relance ou l'arrêt.

## 11.9 Workflow I - Règles d'arrêt

Le système doit s'arrêter automatiquement si :

- le prospect est insuffisamment qualifié ;
- le point d'entrée reste trop faible ;
- le canal n'est pas approprié ;
- l'organisation a déjà été contactée récemment ;
- aucune réaction n'apparaît après le seuil défini ;
- le score baisse après enrichissement.

## 11.10 Workflow J - Revue humaine

Le système doit réserver une validation humaine pour :

- les grands comptes ;
- les institutions publiques ;
- les organisations internationales ;
- les personnes physiques sensibles ;
- les messages qui partent sur des canaux non standards ;
- les messages à enjeu réputationnel élevé.

## 12. Règles de cadence

Tu as formulé un besoin important : envoyer **au moins 3 à 5 courriers**, mais pouvoir arrêter si la niche ne réagit pas.

La bonne logique est la suivante :

- **max 5 envois qualifiés par cycle** ;
- **min 3 envois** seulement si la qualité est suffisante ;
- arrêt automatique si le score de niche est faible ;
- arrêt automatique après une première série sans signal positif ;
- pas plus de **1 relance** sans réaction ;
- si aucune réponse après le seuil défini, passage en `pause` ou `abandon`.

## 13. Stop rules recommandées

### Arrêt avant envoi

- score CRM incomplet ;
- secteur mal identifié ;
- point d'entrée trop faible ;
- pas de personne de contact défendable ;
- pas de canal professionnel légitime.

### Arrêt après envoi

- rebond ;
- opposition explicite ;
- absence totale de signal après la séquence prévue ;
- besoin jugé hors périmètre ;
- risque de réputation ou de conformité.

## 14. Ce que l'assistant doit produire pour chaque prospect

Pour chaque structure, l'assistant doit générer un “prospect pack” contenant :

- une fiche CRM structurée ;
- un résumé exécutif ;
- une hypothèse de besoin ;
- la niche ou porte d'entrée ;
- un pré-audit ;
- le courrier ou e-mail ;
- un message court si nécessaire ;
- un mini-catalogue ciblé ;
- un deck de présentation adapté ;
- un cas d'usage recommandé pour le rendez-vous ;
- une recommandation d'action :
  - `envoyer`
  - `attendre`
  - `enrichir`
  - `abandonner`

## 15. Cas d'usage Elton comme modèle

Le travail fait sur Elton CI est un bon exemple de ce que le système doit savoir faire :

- lire le site public ;
- repérer les services visibles ;
- détecter les signaux autour des comptes clients, de la flotte, de la carte carburant, du service auto et de la relation client ;
- identifier une niche crédible ;
- proposer une offre adaptée ;
- rédiger un courrier professionnel ;
- générer un mini-catalogue ciblé ;
- adapter un PowerPoint ;
- et préparer un cas d'usage à présenter en rendez-vous.

Autrement dit, Elton devient ici un **modèle de comportement attendu** pour l'assistant IA.

## 16. Recommandation de mise en œuvre

Je recommande de construire ce système en 3 phases.

## Phase 1 - Fondations

- base CRM ;
- schéma de données ;
- workflow collecte + enrichissement ;
- assistant IA de qualification ;
- génération du courrier ;
- stop rules minimales.

## Phase 2 - Personnalisation commerciale

- mini-catalogue ciblé ;
- adaptation automatique du deck ;
- génération du cas d'usage ;
- scoring de qualité commerciale ;
- suivi des réactions.

## Phase 3 - Industrialisation contrôlée

- croissance de la base ;
- tableaux de bord CRM ;
- segmentation plus fine ;
- gestion multi-canaux encadrée ;
- règles d'apprentissage et d'amélioration.

## 17. Position finale

Le système à construire n'est pas un simple “robot d'envoi”.

C'est un **assistant IA de prospection, de qualification et de préparation commerciale**, orchestré par **n8n**, alimenté par une **CRM évolutive**, et encadré par des **règles de conformité, de qualité et d'arrêt**.

La bonne promesse à retenir est la suivante :

## **Nous automatisons la recherche, la qualification et la préparation commerciale, mais nous gardons des garde-fous sur la conformité, la qualité du ciblage et la décision d'envoi.**

## Sources

- n8n Docs - AI Agent node : https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/
- n8n Docs - What’s an agent in AI? : https://docs.n8n.io/advanced-ai/examples/understand-agents/
- n8n Docs - Create and run workflows : https://docs.n8n.io/workflows/create/
- CNIL - La prospection commerciale par courrier électronique : https://www.cnil.fr/la-prospection-commerciale-par-courrier-electronique
