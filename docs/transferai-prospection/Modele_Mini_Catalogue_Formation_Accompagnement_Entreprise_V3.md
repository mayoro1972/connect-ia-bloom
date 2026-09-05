# Modèle standard — mini-catalogue formation & accompagnement entreprise

## Finalité

Ce document sert de modèle pour le nœud `Generate Tailored Catalogue`.

L'objectif n'est pas de sortir un catalogue générique, mais un document commercial court, crédible et orienté décision, construit à partir du contexte prospect assemblé dans `Assemble Prospect Context`.

Le document doit se situer entre :

- une note d'orientation commerciale ;
- un mini-catalogue de formation ciblé ;
- une première proposition d'accompagnement.

## Contrat de données attendu depuis le workflow

Le mini-catalogue doit être régénérable à partir des informations déjà structurées dans :

- `Sanitize Prospect Data For LLM`
- `Assemble Prospect Context`

Les champs utiles à exploiter sont en priorité :

- `organization_type`
- `sector_guess`
- `country`
- `signal_tags`
- `roi_clues`
- `organization_summary`
- `probable_strengths`
- `probable_weaknesses`
- `probable_needs`
- `entry_point_niche`
- `confidence_score`
- `probable_problems`
- `probable_quick_wins`
- `recommended_offer`
- `offer_sequence`
- `recommended_training_bundle`
- `recommended_use_case`
- `best_selling_use_case`
- `commercial_priority_tier`
- `recommended_meeting_angle`
- `roi_hypothesis`
- `expected_time_savings`
- `expected_service_improvements`
- `expected_quick_wins`
- `delivery_timeline`

Le document final doit rester commercialement exploitable, mais toujours présenter ces éléments comme :

- priorités probables ;
- hypothèses prudentes ;
- benchmarks à confirmer ;
- séquence recommandée.

## Positionnement à conserver

Le bon message n'est pas :

- nous avons beaucoup de formations ;
- nous pouvons tout faire ;
- voici un catalogue complet.

Le bon message est :

- nous avons compris quelques priorités probables ;
- nous proposons une porte d'entrée simple ;
- nous recommandons seulement les formations et l'accompagnement utiles ;
- nous préparons un premier terrain d'exécution crédible.

## Structure standard recommandée

Le mini-catalogue doit idéalement suivre cette structure.

### 1. Titre

Exemple :

`Proposition ciblée de formation et d'accompagnement IA pour {{ORGANIZATION_NAME}}`

### 2. Synthèse executive

2 à 4 lignes maximum.

Doit expliquer :

- le résultat recherché ;
- la logique de service derrière l'IA ;
- l'articulation entre audit, formation, accompagnement et mise en œuvre ;
- la différence entre une simple formation ponctuelle et un accompagnement TransferAI sur 90 jours.

### 3. Lecture du contexte du prospect

Bloc court, en langage de direction.

Doit reformuler :

- la nature de l'organisation ;
- les flux visibles ou tensions probables ;
- les fonctions qui semblent les plus concernées ;
- pourquoi le sujet mérite d'être traité maintenant.

### 4. Priorités métier et irritants visibles

3 à 5 irritants ou tensions métier.

Exemples :

- demandes répétitives mal traitées entre plusieurs canaux ;
- temps élevé de préparation du reporting ;
- procédures dispersées entre équipes ;
- difficulté à transformer la formation en gestes métier durables ;
- pilotage insuffisamment commenté pour la direction.

### 5. Cas d'usage et quick wins recommandés

3 à 4 cas d'usage maximum.

Pour chacun :

- un titre clair ;
- un `Avant` ;
- un `Après` ;
- les KPI ou signaux de preuve à suivre.

### 6. Objectifs visés

3 à 5 objectifs concrets.

Exemples :

- mieux piloter l'information utile ;
- fluidifier les processus critiques ;
- renforcer la qualité de service ;
- faire monter les équipes en compétences sur des usages réels ;
- sécuriser les usages IA avec des règles de confidentialité et de gouvernance.

### 7. Pourquoi cette approche est pertinente

Court bloc expliquant :

- pourquoi le besoin est crédible maintenant ;
- pourquoi un catalogue trop large serait contre-productif ;
- pourquoi la bonne réponse est une sélection resserrée et contextualisée.

### 8. Porte d'entrée recommandée

Toujours garder une porte d'entrée simple.

Exemple :

- audit IA gratuit ;
- échange expert de 30 minutes ;
- note de priorités ;
- recommandation formation / accompagnement / pilote.

### 9. Parcours recommandé

4 étapes maximum :

1. cadrage
2. audit
3. formation ciblée
4. pilote ou accompagnement d'exécution

Le parcours doit idéalement expliciter la logique :

- `J+0` cadrage et audit
- `J+15` premier livrable ou premier cas d'usage encadré
- `J+45` formation + déploiement piloté
- `J+90` revue d'impact et décision d'extension

### 10. Formations prioritaires

Limiter la sortie à 4 à 8 formations maximum.

Les regrouper si utile en 3 ou 4 familles :

- direction et management ;
- finance et pilotage ;
- opérations et relation client ;
- transformation, conformité et gouvernance.

Pour chaque formation, faire apparaître :

- `Intitulé`
- `Public concerné`
- `Objectifs`
- `Prérequis`
- `Livrables`
- `Format / durée`
- `Pourquoi c'est utile pour ce prospect`

### 11. Livrables attendus

Le mini-catalogue doit comporter un bloc `Livrables attendus` commun au dispositif.

Exemples pertinents :

- note de priorités et séquence recommandée ;
- supports de formation contextualisés ;
- exercices reliés aux cas d'usage du prospect ;
- trames, prompts, checklists ou procédures réutilisables ;
- premiers livrables pilotés sur un cas d'usage ;
- feuille de route d'exécution sur 90 jours ;
- points de revue d'usage et d'adoption.

## Trame standard d'une fiche formation

### {{INTITULE_FORMATION}}

- `Public concerné` : direction, managers, équipes métier, fonctions support ou équipe transformation
- `Objectifs` :
  - comprendre les usages les plus utiles ;
  - gagner du temps sur une tâche réelle ;
  - produire un premier livrable exploitable ;
  - cadrer les règles d'usage si nécessaire
- `Prérequis` :
  - connaître le processus métier concerné ;
  - disposer d'exemples ou de documents de travail ;
  - aucun prérequis technique avancé sauf si explicitement nécessaire
- `Livrables` :
  - prompts ou trames réutilisables ;
  - checklists d'usage ;
  - premiers exemples appliqués au métier ;
  - mini-feuille de route ou plan d'action
- `Format / durée` :
  - reprendre la durée connue du catalogue quand elle existe ;
  - sinon écrire `à confirmer selon le périmètre`
- `Pourquoi c'est utile pour {{ORGANIZATION_NAME}}` :
  - relier explicitement la formation aux irritants, aux quick wins ou au cas d'usage recommandé

## Bloc accompagnement post-formation

Ce bloc est obligatoire car il différencie TransferAI d'une structure de formation classique.

Le message à intégrer :

- l'accompagnement ne s'arrête pas à la salle de formation ;
- les personnes et sociétés formées gardent un accès gratuit à la communauté TransferAI ;
- cette communauté permet de partager des cas d'entreprise réels, des problèmes rencontrés et des questions d'exécution ;
- les membres peuvent y recevoir de l'assistance, des conseils pratiques et des retours d'expérience utiles pour mieux réaliser leurs tâches ;
- cet accompagnement aide à transformer la formation en usage concret, puis en preuve d'impact ;
- TransferAI doit être présenté comme un partenaire de montée en usage sur 90 jours, pas seulement comme un organisme qui délivre une session puis disparaît.

## Bloc accompagnement 90 jours

Ce bloc doit apparaître soit comme sous-partie de l'accompagnement post-formation, soit comme encadré distinct.

Il doit expliquer clairement :

- qu'après la formation, TransferAI reste engagé sur une période de 90 jours ;
- que cette période sert à consolider les usages, répondre aux blocages et sécuriser l'adoption ;
- qu'elle peut comprendre, selon le contexte :
  - points de suivi,
  - permanence questions/réponses,
  - revue de cas réels,
  - ajustement des prompts, trames ou procédures,
  - lecture des premiers KPI,
  - arbitrage sur la suite entre pilote, extension ou réajustement.

Le bon message comparatif est :

- une structure de formation classique transmet un contenu ;
- TransferAI forme, puis accompagne l'usage, la mise en pratique, la gouvernance et la montée en impact.

## Bloc confiance et gouvernance

Quand le contexte l'exige, rappeler :

- confidentialité ;
- gouvernance ;
- revue humaine ;
- cadre d'usage ;
- progression par pilote avant extension.

## Bloc proposition immédiate

Toujours finir avec un CTA unique, simple et crédible :

- échange expert de 30 minutes ;
- audit gratuit ;
- orientation ciblée vers formation, accompagnement ou pilote.

## Structure automatisée recommandée pour `Generate Tailored Catalogue`

Le prompt du nœud doit idéalement produire les sections suivantes dans cet ordre :

1. `Titre`
2. `Synthèse executive`
3. `Lecture du contexte du prospect`
4. `Priorités métier et irritants visibles`
5. `Cas d'usage et quick wins recommandés`
6. `Porte d'entrée recommandée`
7. `Parcours recommandé`
8. `Formations prioritaires`
9. `Livrables attendus`
10. `Gouvernance, confidentialité et conduite du changement`
11. `Accompagnement post-formation`
12. `Accompagnement 90 jours`
13. `Proposition immédiate`

## Bloc co-signature obligatoire

Tout document lié :

- à la formation ;
- au mini-catalogue ;
- à l'accompagnement ;
- ou à la mise en œuvre post-formation,

doit comporter en clôture un simple bloc de signatures non numéroté.

Il doit reprendre exactement :

- `Soulemane Konate` — Directeur IA & Innovation
- `Medard Sery` — Consultant expert · Data engineering, cloud & plateformes IA

Ce bloc ne doit pas apparaître comme un chapitre supplémentaire du catalogue.

Le bon message à préserver :

- les volets formation et accompagnement ne sont pas de simples sessions ;
- ils sont portés et relus par une expertise métier et plateforme ;
- la présence de Medard Sery renforce la crédibilité des volets data engineering, cloud et plateformes IA.

## Bloc documentaire standard

Le document automatisé doit intégrer un cadre de marque stable à chaque génération.

### Logo de référence

Le logo de référence à utiliser est :

- `TransferAi Africa × Nettelecom`

### Pied de page standard

Le pied de page standard à reprendre sans le modifier est :

`TransferAI | Hub IA de Nettelecom CI | contact@transferai.ci | www.transferai.ci | WhatsApp +225 07 16 57 39 90 | Riviera 3, carrefour Sainte Famille, Abidjan`

### Usage recommandé

Le bon standard automatisé est :

- logo co-brandé en en-tête ;
- titre du mini-catalogue juste sous l'en-tête ;
- pied de page constant sur toutes les pages ;
- bloc de signatures simple en fin de document ;
- cohérence complète avec le courrier exécutif et le deck.

## Référence ELTON à réutiliser

La structure ELTON la plus utile à reprendre est :

- promesse claire ;
- contexte et pertinence ;
- objectifs concrets ;
- porte d'entrée par audit ;
- 4 briques d'offre ;
- 8 formations maximum ;
- cas d'usage visibles ;
- séquence d'exécution ;
- cadre de confiance ;
- prochaine étape.

## Sélection de formations type inspirée du cas ELTON

Les huit formations ci-dessous constituent une bonne base de référence quand le prospect a des enjeux de direction, pilotage, opérations, relation client et conformité :

1. `IA pour Dirigeants : Vision et Stratégie`
2. `Prise de Décision Stratégique avec l'IA`
3. `Reporting Financier Automatisé`
4. `Comptabilité Automatisée avec l'IA`
5. `Gestion de Flotte et Logistique IA`
6. `CRM Intelligent et IA`
7. `Optimisation des Processus Métier avec l'IA`
8. `RGPD et Protection des Données avec l'IA`

Cette liste ne doit pas être recopiée automatiquement.

Elle doit servir de bibliothèque de référence quand elle est cohérente avec :

- les irritants identifiés ;
- le besoin probable ;
- les populations à former ;
- la logique d'exécution recommandée.
