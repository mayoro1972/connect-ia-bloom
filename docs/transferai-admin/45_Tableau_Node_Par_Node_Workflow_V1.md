# Workflow V1 n8n - Tableau nœud par nœud

Ce document décrit le workflow **V1 de prospection multi-prospects** sous forme de tableau opérationnel.

Le nom du fichier JSON conserve une trace historique du travail initial, mais le workflow lui-même est maintenant conçu pour fonctionner sur **toute organisation cible** et non plus sur une seule entreprise.

Fichier source du workflow :

- [42_n8n_Prospection_Modele_Elton_V1.json](./42_n8n_Prospection_Modele_Elton_V1.json)

## Résumé

Le workflow V1 a pour objectif de :

- collecter des signaux publics sur une structure cible
- protéger les données sensibles avant toute exposition au LLM
- produire un pré-audit IA
- identifier des problèmes probables, une niche d’entrée et un angle commercial
- générer un courrier, un mini-catalogue, une forme d’audit et un brief de deck
- arrêter le processus en revue manuelle avant tout envoi

## Variables d’environnement

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `BOOKING_LINK_45MIN`

## Tableau des nœuds

| Étape | Nœud | Type n8n | Entrée principale | Sortie principale | Rôle |
| --- | --- | --- | --- | --- | --- |
| 1 | `Manual Trigger` | `manualTrigger` | aucune | déclenchement | Lance le workflow manuellement depuis n8n. |
| 2 | `Set Target` | `set` | aucune | métadonnées prospect | Définit la cible commerciale initiale : organisation, site web, pays, décideur, secteur supposé, lien de réservation, priorité commerciale. |
| 3 | `Build Source URLs` | `code` | `website` | URLs sources | Construit automatiquement les pages publiques à explorer à partir du domaine principal. |
| 4 | `Fetch Public Page 1` | `httpRequest` | `page_1_url` | contenu brut page 1 | Récupère la première page publique candidate. |
| 5 | `Fetch Public Page 2` | `httpRequest` | `page_2_url` | contenu brut page 2 | Récupère la deuxième page publique candidate. |
| 6 | `Fetch Public Page 3` | `httpRequest` | `page_3_url` | contenu brut page 3 | Récupère la troisième page publique candidate. |
| 7 | `Fetch Public Page 4` | `httpRequest` | `page_4_url` | contenu brut page 4 | Récupère la quatrième page publique candidate. |
| 8 | `Fetch Public Page 5` | `httpRequest` | `page_5_url` | contenu brut page 5 | Récupère la cinquième page publique candidate. |
| 9 | `Normalize Public Signals` | `code` | pages publiques brutes | `public_text`, `page_texts`, signaux normalisés | Consolide et structure les contenus publics en une base d’analyse exploitable. |
| 10 | `Sanitize Prospect Data For LLM` | `code` | signaux normalisés | `llm_allowed_payload`, `llm_generation_payload`, `llm_redaction_summary` | Applique la politique de protection des données avant LLM : redaction, pseudonymisation, allowlist et blocage des champs sensibles. |
| 11 | `Call OpenAI Pre-Audit` | `httpRequest` | `llm_allowed_payload` | JSON pré-audit | Produit un résumé prospect, des forces, faiblesses, besoins probables et une niche d’entrée. |
| 12 | `Call OpenAI Problems Solutions` | `httpRequest` | `llm_allowed_payload` | JSON commercial | Produit les problèmes probables, quick wins, offre recommandée, cas d’usage et priorité commerciale. |
| 13 | `Call OpenAI ROI` | `httpRequest` | `llm_allowed_payload` | JSON ROI | Produit une hypothèse de gains, d’amélioration de service et de chronologie de déploiement. |
| 14 | `Assemble Prospect Context` | `code` | sorties des 3 appels OpenAI + base normalisée | contexte prospect consolidé | Fusionne les analyses pour préparer les livrables. |
| 15 | `Generate Executive Letter` | `httpRequest` | `llm_generation_payload` | texte de courrier | Génère le courrier de premier contact en français standard et professionnel. |
| 16 | `Generate Tailored Catalogue` | `httpRequest` | `llm_generation_payload` | texte catalogue | Génère un mini-catalogue ciblé avec objectifs, porte d’entrée, offres et formations prioritaires. |
| 17 | `Generate Tailored Audit Form` | `httpRequest` | `llm_generation_payload` | texte de forme d’audit | Génère une forme d’audit courte à envoyer avant l’appel de 45 minutes. |
| 18 | `Generate Deck Brief` | `httpRequest` | `llm_generation_payload` | JSON de brief deck | Génère la structure du futur PowerPoint de présentation. |
| 19 | `Assemble Prospect Pack` | `code` | tous les livrables + contexte | pack prospect final | Réinjecte les vraies valeurs hors LLM, assemble le pack complet et calcule l’état d’aptitude à revue. |
| 20 | `Mark For Review` | `set` | pack prospect final | `workflow_status = ready_for_manual_review` | Marque le workflow comme prêt pour validation humaine. |

## Détail des entrées initiales

Le nœud `Set Target` contient actuellement les champs suivants :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `custom_page_paths_csv`
- `booking_link_45min`
- `commercial_priority_default`
- `research_scope`

## Détail des URLs construites

Le nœud `Build Source URLs` fabrique généralement :

- `source_pages`
- `page_1_url`
- `page_2_url`
- `page_3_url`
- `page_4_url`
- `page_5_url`

Il combine :

- une liste de chemins publics standards
- une éventuelle surcharge via `custom_page_paths_csv`

Cette logique permet au même workflow de s’adapter à des dizaines ou centaines de prospects sans réécriture manuelle.

## Détail du module de protection avant LLM

Le nœud `Sanitize Prospect Data For LLM` applique les règles suivantes :

- suppression des URLs brutes dans le texte exposé au modèle
- suppression des e-mails
- suppression des numéros de téléphone
- pseudonymisation du nom de l’organisation en `ORG_TARGET`
- pseudonymisation du décideur en `DECISION_MAKER_TARGET`
- exclusion du texte public brut complet
- exposition au LLM d’un extrait assaini et limité

### Champs autorisés au LLM

- `organization_type`
- `sector_guess`
- `country`
- `signal_tags`
- `roi_clues`
- `page_keys`
- `public_text_sanitized_excerpt`

### Champs bloqués avant LLM

- `organization_name`
- `website`
- `decision_maker_name`
- `target_email`
- `page_texts`
- `public_text`

## Sorties attendues des appels OpenAI

### 1. Pré-audit

- `organization_summary`
- `probable_strengths`
- `probable_weaknesses`
- `probable_needs`
- `entry_point_niche`
- `confidence_score`

### 2. Problèmes et solutions

- `probable_problems`
- `probable_quick_wins`
- `recommended_offer`
- `offer_sequence`
- `recommended_training_bundle`
- `recommended_use_case`
- `best_selling_use_case`
- `commercial_priority_tier`
- `recommended_meeting_angle`

### 3. ROI

- `roi_hypothesis`
- `expected_time_savings`
- `expected_service_improvements`
- `expected_quick_wins`
- `delivery_timeline`

### 4. Livrables de génération

- `executive_letter`
- `tailored_catalogue`
- `tailored_audit_form`
- `deck_brief`

## Sortie finale du workflow

Le workflow se termine avec un pack prêt à revue qui contient au minimum :

- le contexte prospect consolidé
- le courrier
- le mini-catalogue
- la forme d’audit
- le brief de deck
- le résumé de redaction LLM
- l’indicateur `approved_for_send`
- le statut `ready_for_manual_review`
