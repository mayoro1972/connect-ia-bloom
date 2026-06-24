# Workflow V1 n8n - Guide de reconstruction pas à pas

Ce document explique comment reconstruire dans n8n le workflow **V1 de prospection multi-prospects**.

Le nom du fichier JSON conserve une trace historique, mais la logique décrite ici est désormais pensée pour une **CRM de 100 prospects et plus**, avec personnalisation par cible.

Fichier source du workflow :

- [42_n8n_Prospection_Modele_Elton_V1.json](./42_n8n_Prospection_Modele_Elton_V1.json)

## Objectif

Reconstruire un workflow qui :

- scrape des pages publiques ciblées
- assainit les données avant tout appel au LLM
- produit un pré-audit commercial
- génère un courrier, un mini-catalogue, une forme d’audit et un brief de deck
- s’arrête en validation manuelle

## Pré-requis

Avant de commencer, définir dans n8n :

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `BOOKING_LINK_45MIN`

## Architecture générale

Le workflow suit 6 blocs :

1. initialisation de la cible
2. construction et collecte des sources publiques
3. normalisation et protection des données
4. analyse LLM
5. génération des livrables
6. assemblage final et revue manuelle

## Étape 1 - Créer le déclencheur

### Nœud 1

- Type : `Manual Trigger`
- Nom : `Manual Trigger`

Rôle :

- lancer le workflow à la demande

## Étape 2 - Définir la cible commerciale

### Nœud 2

- Type : `Set`
- Nom : `Set Target`

Configurer les champs suivants :

- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `booking_link_45min`
- `commercial_priority_default`

Exemple de valeurs :

- `prospect_id = manual-prospect-001`
- `organization_name = Organisation cible à qualifier`
- `website = https://www.example.org`
- `country = Côte d'Ivoire`
- `organization_type = organisation à qualifier`
- `sector_guess = secteur à confirmer`
- `decision_maker_name = Décideur à confirmer`
- `custom_page_paths_csv = `
- `booking_link_45min = {{$env.BOOKING_LINK_45MIN || 'https://calendly.com/your-link'}}`
- `commercial_priority_default = tier1`
- `research_scope = public_web_only`

Connexion :

- `Manual Trigger` -> `Set Target`

## Étape 3 - Construire les URLs à scraper

### Nœud 3

- Type : `Code`
- Nom : `Build Source URLs`

Coller une logique qui :

- prend `website`
- enlève le slash final si nécessaire
- fabrique les pages à explorer

Sorties à produire :

- `source_pages`
- `page_1_url`
- `page_2_url`
- `page_3_url`
- `page_4_url`
- `page_5_url`

Le nœud doit :

- prendre les chemins personnalisés si `custom_page_paths_csv` est renseigné
- sinon utiliser des chemins publics fréquents comme `/`, `/services/`, `/solutions/`, `/contact/`, `/blog/`, `/products/`, `/careers/`
- garder les pages de présentation non standard via `custom_page_paths_csv` si le site utilise un slug spécifique comme `/la-smb/`
- limiter la première passe à 5 pages pour garder un workflow stable et peu coûteux

Connexion :

- `Set Target` -> `Build Source URLs`

## Étape 4 - Créer les requêtes HTTP de collecte

Créer 5 nœuds `HTTP Request`.

### Nœud 4

- Nom : `Fetch Public Page 1`
- URL : `{{$('Build Source URLs').first().json.page_1_url}}`

### Nœud 5

- Nom : `Fetch Public Page 2`
- URL : `{{$('Build Source URLs').first().json.page_2_url}}`

### Nœud 6

- Nom : `Fetch Public Page 3`
- URL : `{{$('Build Source URLs').first().json.page_3_url}}`

### Nœud 7

- Nom : `Fetch Public Page 4`
- URL : `{{$('Build Source URLs').first().json.page_4_url}}`

### Nœud 8

- Nom : `Fetch Public Page 5`
- URL : `{{$('Build Source URLs').first().json.page_5_url}}`

Recommandations de configuration :

- méthode `GET`
- activer `On Error -> Continue (regular output)` sur les 5 nœuds HTTP pour qu'une boucle de redirection sur une page ne bloque pas tout le workflow
- format de réponse texte ou HTML
- tolérance raisonnable aux erreurs si une page renvoie un contenu partiel

Chaînage :

- `Build Source URLs` -> `Fetch Public Page 1`
- `Fetch Public Page 1` -> `Fetch Public Page 2`
- `Fetch Public Page 2` -> `Fetch Public Page 3`
- `Fetch Public Page 3` -> `Fetch Public Page 4`
- `Fetch Public Page 4` -> `Fetch Public Page 5`

## Étape 5 - Normaliser les signaux publics

### Nœud 9

- Type : `Code`
- Nom : `Normalize Public Signals`

Ce nœud doit :

- relire les 5 pages publiques récupérées
- extraire leur contenu textuel utile
- rattacher une clé à chaque page
- consolider un grand texte public synthétique
- produire des signaux métier exploitables

Sorties à viser :

- `page_texts`
- `public_text`
- `roi_clues`
- métadonnées prospect conservées

Connexion :

- `Fetch Public Page 5` -> `Normalize Public Signals`

## Étape 6 - Ajouter la protection RGPD avant LLM

### Nœud 10

- Type : `Code`
- Nom : `Sanitize Prospect Data For LLM`

C’est l’étape critique du workflow.

Le code doit :

- retirer les URLs du texte
- retirer les e-mails
- retirer les numéros de téléphone
- pseudonymiser le nom de l’organisation en `ORG_TARGET`
- pseudonymiser le décideur en `DECISION_MAKER_TARGET`
- créer un extrait assaini du texte public
- produire une allowlist
- produire une blocked list

Sorties à créer :

- `public_text_sanitized`
- `llm_allowed_payload`
- `llm_generation_payload`
- `llm_redaction_summary`

Bonnes pratiques à respecter :

- politique `deny-by-default`
- ne jamais transmettre `organization_name`, `website`, `decision_maker_name` ni `public_text` brut au LLM
- limiter le texte envoyé à un extrait utile

Connexion :

- `Normalize Public Signals` -> `Sanitize Prospect Data For LLM`

## Étape 7 - Créer les 3 appels d’analyse OpenAI

Créer 3 nœuds `HTTP Request` vers :

- `https://api.openai.com/v1/chat/completions`

Configuration commune :

- méthode `POST`
- headers :
  - `Authorization = Bearer {{$env.OPENAI_API_KEY}}`
  - `Content-Type = application/json`
- modèle :
  - `{{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}`

### Nœud 11

- Nom : `Call OpenAI Pre-Audit`

Utiliser `llm_allowed_payload` dans le message utilisateur.

Sortie attendue :

- résumé prospect
- forces probables
- faiblesses probables
- besoins probables
- niche d’entrée
- score de confiance

### Nœud 12

- Nom : `Call OpenAI Problems Solutions`

Utiliser `llm_allowed_payload`.

Sortie attendue :

- problèmes probables
- quick wins
- offre recommandée
- séquence d’offre
- bundle de formation
- cas d’usage recommandé
- meilleur cas d’usage commercial
- niveau de priorité commerciale
- angle de rendez-vous

### Nœud 13

- Nom : `Call OpenAI ROI`

Utiliser `llm_allowed_payload`.

Sortie attendue :

- hypothèse de ROI
- gains de temps attendus
- améliorations de service attendues
- quick wins attendus
- chronologie de déploiement

Connexions :

- `Sanitize Prospect Data For LLM` -> `Call OpenAI Pre-Audit`
- `Sanitize Prospect Data For LLM` -> `Call OpenAI Problems Solutions`
- `Sanitize Prospect Data For LLM` -> `Call OpenAI ROI`

## Étape 8 - Consolider le contexte prospect

### Nœud 14

- Type : `Code`
- Nom : `Assemble Prospect Context`

Ce nœud doit :

- parser les 3 réponses OpenAI
- fusionner ces résultats avec les signaux publics normalisés
- produire un contexte unique pour la génération documentaire

Sorties utiles :

- `entry_point_niche`
- `recommended_offer`
- `offer_sequence`
- `best_selling_use_case`
- `commercial_priority_tier`
- `roi_hypothesis`

Connexion :

- `Call OpenAI Pre-Audit` -> `Assemble Prospect Context`

Le code peut relire les autres nœuds OpenAI avec `$('Node Name').first().json`.

## Étape 9 - Générer les 4 livrables

Créer 4 nœuds `HTTP Request` OpenAI supplémentaires.

Ils utilisent tous :

- le modèle OpenAI
- les headers API
- `llm_generation_payload`

### Nœud 15

- Nom : `Generate Executive Letter`

Objectif :

- produire un courrier professionnel en français standard avec accents
- mettre en avant l’audit gratuit
- proposer un rendez-vous gratuit de 45 minutes
- insister sur le service derrière l’IA

### Nœud 16

- Nom : `Generate Tailored Catalogue`

Objectif :

- produire un mini-catalogue ciblé

Sections attendues :

- message central
- objectifs
- pourquoi cette approche peut intéresser la structure
- notre porte d’entrée
- offres prioritaires
- formations prioritaires
- hypothèse de gains attendus
- proposition immédiate

### Nœud 17

- Nom : `Generate Tailored Audit Form`

Objectif :

- produire une forme d’audit pré-appel adaptée au secteur

Champs attendus :

- priorités métier
- irritants
- outils actuels
- données
- attentes de formation
- confidentialité
- objectifs à 3 mois
- volumes
- délais
- objectifs de performance

### Nœud 18

- Nom : `Generate Deck Brief`

Objectif :

- produire un JSON pour la future présentation

Champs attendus :

- `slide_objective`
- `key_messages`
- `sector_pain_points`
- `recommended_case_study`
- `training_focus`
- `roi_hypothesis`
- `delivery_timeline`
- `sector_variant`
- `single_primary_cta`

Connexion :

- `Assemble Prospect Context` -> les 4 nœuds de génération

## Étape 10 - Assembler le pack prospect

### Nœud 19

- Type : `Code`
- Nom : `Assemble Prospect Pack`

Ce nœud doit :

- récupérer les sorties des 4 livrables
- parser le JSON du deck brief
- réinjecter localement les vraies valeurs dans les placeholders
- calculer `approved_for_send`
- inclure le résumé de redaction LLM

Les placeholders à hydrater localement sont par exemple :

- `{{ORGANIZATION_NAME}}`
- `{{DECISION_MAKER_NAME}}`
- `{{WEBSITE}}`

Sortie finale à produire :

- `executive_letter`
- `tailored_catalogue`
- `tailored_audit_form`
- `deck_brief`
- `llm_redaction_summary`
- `approved_for_send`

Connexion :

- `Generate Executive Letter` -> `Assemble Prospect Pack`

Le code peut relire les autres nœuds génératifs directement.

## Étape 11 - Mettre le pack en revue manuelle

### Nœud 20

- Type : `Set`
- Nom : `Mark For Review`

Ajouter :

- `workflow_status = ready_for_manual_review`

Connexion :

- `Assemble Prospect Pack` -> `Mark For Review`

## Résultat final attendu

Une fois exécuté, le workflow V1 doit fournir un pack prospect prêt à validation humaine comprenant :

- l’angle commercial
- la niche d’entrée
- les problèmes probables
- le courrier
- le mini-catalogue
- la forme d’audit
- le brief de présentation
- le résumé de protection LLM

## Ordre logique de test

Pour valider le workflow dans n8n, tester dans cet ordre :

1. `Set Target`
2. `Build Source URLs`
3. les 5 requêtes HTTP
4. `Normalize Public Signals`
5. `Sanitize Prospect Data For LLM`
6. les 3 appels d’analyse OpenAI
7. `Assemble Prospect Context`
8. les 4 livrables
9. `Assemble Prospect Pack`
10. `Mark For Review`

## Conseil d’exploitation

Pour un usage réel, garder le V1 comme workflow de production documentaire assistée, avec :

- une revue humaine avant contact
- une vérification des hypothèses avant envoi
- une adaptation finale du message selon la relation existante avec le prospect
- une alimentation depuis une CRM, une feuille ou Supabase pour enchaîner plusieurs prospects sans dupliquer le workflow
