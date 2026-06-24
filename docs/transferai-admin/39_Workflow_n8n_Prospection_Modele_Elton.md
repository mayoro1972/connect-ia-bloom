# Workflow n8n - Prospection ciblée multi-prospects

Date : 2026-05-22

## 1. Objet

Ce document décrit le workflow **n8n** recommandé pour une prospection commerciale **multi-prospects**.

Le nom du fichier reste historique, mais le workflow doit maintenant être compris comme un moteur de prospection réutilisable pour **100 entreprises ou plus**, et non comme un flux réservé à Elton CI.

Il s'appuie sur une logique très précise :

- analyser des informations publiques ;
- produire un **pré-audit IA** ;
- identifier des **problèmes probables** ;
- recommander des **solutions adaptées** ;
- formuler une **hypothèse de ROI ou de gains attendus** ;
- mettre en avant une **porte d'entrée claire** ;
- proposer un **audit gratuit** ;
- proposer un **rendez-vous gratuit de 45 minutes** ;
- puis préparer un **pack commercial sur mesure** avant tout envoi.

Ce workflow ne doit pas produire un courrier générique.

Il doit produire un **courrier ciblé**, un **mini-catalogue ciblé**, un **deck ciblé** et une **forme d'audit ciblée** en prélude à une visite ou à un appel de 45 minutes.

Il doit aussi produire un message commercial plus convaincant pour un décideur non technique :

- d'abord le **résultat attendu** ;
- ensuite les **problèmes probables** ;
- puis la **méthode** ;
- enfin le **rendez-vous de 45 minutes** comme appel à l'action principal.

## 2. Logique métier à respecter

Le workflow repose sur 4 piliers.

## 2.0 Priorités commerciales à intégrer dans le workflow

Le workflow ne doit pas choisir un cas d'usage au hasard.

Il doit prioriser les cas les plus vendables, les plus démontrables et les plus transverses.

### Priorité 1 - À pousser immédiatement

- `support_it_intelligent`
- `service_client_multicanal`
- `machine_contenu_marketing`
- `workflow_administratif`
- `assistant_direction_documentaire`

### Priorité 2 - À pousser en deuxième vague

- `reporting_financier_assiste`
- `recrutement_onboarding_augmente`
- `commentaire_donnees_reporting`
- `contenus_pedagogiques_personnalises`
- `telemedecine_triage_orientation`

### Priorité 3 - Opportuniste

- `veille_reglementaire_synthese`
- `briefings_direction_decision`
- `veille_briefing_multilingue`

Le workflow doit produire explicitement :

- un `commercial_priority_tier`
- un `best_selling_use_case`
- une `offer_sequence`

## 2.1 Pré-audit à partir d'informations publiques

Le système doit être capable de lire :

- le site officiel ;
- les pages services ;
- les pages offres professionnelles ;
- les actualités ;
- les pages carrières ;
- les signaux métiers visibles ;
- et, si nécessaire, d'autres sources publiques défendables.

À partir de là, l'assistant doit produire :

- un résumé de la structure ;
- les activités visibles ;
- les enjeux probables ;
- la maturité apparente ;
- les zones possibles de friction.

## 2.2 Diagnostic des problèmes probables

Le système doit ensuite formuler des **hypothèses de problèmes**.

Exemples :

- lourdeur de suivi commercial ;
- faible exploitation des données ;
- coordination difficile entre terrain, back-office et direction ;
- reporting lent ou fragmenté ;
- relances clients peu fluides ;
- montée en compétences insuffisamment structurée ;
- circulation inégale de l'information utile.

Quand cela est pertinent, le workflow doit aussi être capable de reconnaître des motifs déjà très vendeurs :

- saturation du support interne ou IT ;
- lenteur de traitement des demandes client ;
- production marketing trop lente ;
- dispersion documentaire et administrative ;
- lourdeur de préparation des dossiers de direction ;
- temps de reporting trop long ;
- faible standardisation des workflows.

Ces problèmes doivent toujours être exprimés comme :

- des **hypothèses à valider** ;
- jamais comme des affirmations certaines.

## 2.3 Proposition de solutions adaptées

Le système doit lier les problèmes probables à des solutions TransferAI :

- audit et cadrage ;
- accompagnement ;
- formation ;
- automatisation ciblée ;
- copilotes métiers ;
- gouvernance et protection des données ;
- cas d'usage sur mesure.

## 2.4 Offre d'entrée claire

Le workflow doit toujours faire ressortir cette séquence :

1. **audit gratuit**
2. **rendez-vous gratuit de 45 minutes**
3. **note de recommandations**
4. **offre de service ou de formation ciblée**

## 2.5 Message commercial obligatoire

Tous les actifs générés doivent respecter 5 règles.

### 1. Parler d'abord du résultat client

Le titre et l'ouverture doivent répondre à :

- qu'est-ce que le client peut gagner ;
- quel problème concret peut être réduit ;
- quel résultat peut être atteint dans les premières semaines.

### 2. Ajouter une hypothèse de ROI ou de gains attendus

Le workflow doit produire :

- une hypothèse de temps gagné ;
- une hypothèse de simplification opérationnelle ;
- une hypothèse de réduction de friction ;
- ou une hypothèse d'amélioration du service.

Ces éléments doivent être présentés comme :

- des **estimations à valider** ;
- ou des **benchmarks de départ** ;
- jamais comme des promesses absolues sans validation.

### 3. Rendre le parcours d'intégration concret

Chaque prospect pack doit expliquer au moins :

- ce que le client reçoit à `J+0` ;
- ce qu'il reçoit à `J+15` ;
- ce qui se passe à `J+45` ;
- ce qui est suivi à `J+90`.

### 4. Utiliser une variante sectorielle

Le workflow doit prévoir au minimum trois variantes de cas d'usage et d'exemples :

- `banque_finance`
- `distribution_retail`
- `institution_publique`

Le cas Elton relevait plutôt d'une logique :

- `distribution_b2b_operations`

### 5. Garder un seul appel à l'action principal

Le workflow ne doit pas multiplier les appels à l'action.

L'appel principal recommandé est :

## **Planifier un audit stratégique gratuit suivi d'un échange de 45 minutes**

## 3. Sorties obligatoires pour chaque prospect qualifié

Pour chaque structure retenue, le workflow doit produire un **prospect pack** avec au minimum :

- une fiche CRM propre ;
- un pré-audit public ;
- une liste de problèmes probables ;
- une liste de solutions adaptées ;
- un `commercial_priority_tier` ;
- un `best_selling_use_case` ;
- une `offer_sequence` ;
- une hypothèse de ROI ou de gains attendus ;
- une niche ou porte d'entrée ;
- un courrier au décideur ;
- un e-mail plus court ;
- une version courte éventuelle pour message d'introduction ;
- un mini-catalogue ciblé ;
- un deck de présentation ciblé ;
- une forme d'audit à envoyer avant l'appel ou avant la visite ;
- un cas d'usage à présenter pendant le rendez-vous ;
- une feuille de route `J+0 / J+15 / J+45 / J+90` ;
- un appel à l'action principal unique ;
- une recommandation finale :
  - `envoyer`
  - `attendre`
  - `enrichir`
  - `abandonner`

## 4. Entrées du workflow

Le workflow peut démarrer de deux façons.

## 4.1 Déclenchement manuel

Cas idéal quand TransferAI cible une entreprise donnée.

Entrées minimales :

- nom de l'organisation ;
- URL du site principal ;
- pays ;
- type d'organisation ;
- secteur supposé ;
- nom du décideur si disponible.

## 4.2 Déclenchement semi-automatique

Cas où la structure est découverte par veille.

Entrées minimales :

- URL publique détectée ;
- nom probable de la structure ;
- source de détection ;
- score minimal de pertinence.

## 5. Workflow nœud par nœud

## Nœud 1 - Trigger

**Type n8n**

- `Manual Trigger`
- ou `Cron`
- ou `Webhook`

**Rôle**

- lancer l'analyse d'une structure cible.

## Nœud 2 - Set Target

**Type n8n**

- `Set`

**Rôle**

- définir la cible ;
- préciser les URLs publiques prioritaires ;
- préciser le décideur si connu ;
- fixer le pays, le secteur et le type d'organisation.

**Variables recommandées**

- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `campaign_id`

## Nœud 3 - Public Site Crawl

**Type n8n**

- `HTTP Request`
- éventuellement `HTML Extract`

**Rôle**

- récupérer les pages publiques utiles.

**Pages prioritaires**

- page d'accueil ;
- page à propos ;
- services ;
- offres professionnelles ;
- actualités ;
- carrières ;
- contact ;
- partenaires ;
- pages métier visibles.

## Nœud 4 - Clean and Structure Public Signals

**Type n8n**

- `Code`

**Rôle**

- nettoyer le contenu ;
- extraire les signaux métiers ;
- limiter le bruit ;
- préparer un contexte exploitable par l'assistant IA.

**À produire**

- `visible_activities`
- `visible_services`
- `public_signals`
- `growth_signals`
- `transformation_signals`
- `client_relation_signals`
- `roi_clues`

## Nœud 5 - Optional External Public Enrichment

**Type n8n**

- `HTTP Request`
- `Code`

**Rôle**

- enrichir avec d'autres sources publiques si utile :
  - annuaires ;
  - publications publiques ;
  - communiqués ;
  - pages de conférences ;
  - profils entreprise publics.

**Règle**

- pas de collecte agressive ;
- pas de données sensibles ;
- pas de canal privé.

## Nœud 6 - Build Prospect Context

**Type n8n**

- `Code`

**Rôle**

- rassembler les signaux dans un seul objet.

**Payload recommandé**

```json
{
  "organization_name": "Organisation cible à qualifier",
  "website": "https://www.example.org",
  "sector_guess": "secteur à confirmer",
  "visible_services": [],
  "public_signals": [],
  "decision_maker_name": "Décideur à confirmer",
  "target_mode": "executive_outreach"
}
```

## Nœud 7 - AI Pre-Audit

**Type n8n**

- `AI Agent`
- ou `OpenAI Chat`

**Rôle**

- produire un pré-audit public à partir du contexte.

**Sortie attendue**

- `organization_summary`
- `probable_strengths`
- `probable_weaknesses`
- `probable_needs`
- `entry_point_niche`
- `confidence_score`

## Nœud 7 bis - AI ROI Hypothesis

**Type n8n**

- `AI Agent`

**Rôle**

- formuler une hypothèse de valeur pour un dirigeant.

**Sortie attendue**

- `roi_hypothesis`
- `expected_quick_wins`
- `expected_time_savings`
- `expected_service_improvements`

**Règle**

- exprimer les chiffres comme hypothèses, fourchettes ou benchmarks à valider.

## Nœud 8 - AI Problems and Opportunities

**Type n8n**

- `AI Agent`

**Rôle**

- transformer le pré-audit en hypothèses de problèmes probables et opportunités concrètes.

**Sortie attendue**

- `probable_problems`
- `probable_bottlenecks`
- `probable_quick_wins`
- `probable_high_value_areas`
- `best_selling_use_case`
- `commercial_priority_tier`

## Nœud 9 - AI Recommended Solutions

**Type n8n**

- `AI Agent`

**Rôle**

- relier les problèmes probables aux solutions TransferAI.

**Sortie attendue**

- `recommended_offer`
- `offer_sequence`
- `recommended_training_bundle`
- `recommended_use_case`
- `recommended_governance_angle`
- `recommended_meeting_angle`
- `sector_variant`

## Nœud 10 - Select Entry Offer

**Type n8n**

- `Code`
- ou `Switch`

**Rôle**

- forcer une porte d'entrée simple et claire.

**Ordre de priorité recommandé**

1. audit gratuit
2. rendez-vous gratuit de 45 minutes
3. note de recommandations
4. mini-pilote ou formation

## Nœud 11 - Generate Executive Letter

**Type n8n**

- `AI Agent`

**Rôle**

- rédiger le courrier final destiné au DG ou au décideur.

**Contraintes**

- ton sobre ;
- français standard et professionnel ;
- aucune affirmation non vérifiée ;
- mettre en avant le service derrière l'IA ;
- rappeler l'audit gratuit ;
- rappeler le rendez-vous gratuit de 45 minutes ;
- commencer par le résultat attendu pour le client ;
- proposer l'accompagnement dans les secteurs où TransferAI opère.

## Nœud 12 - Generate Tailored Mini-Catalogue

**Type n8n**

- `AI Agent`

**Rôle**

- produire un mini-catalogue adapté à la structure.

**Contenu attendu**

- objectifs ;
- pourquoi cette structure ;
- porte d'entrée ;
- 3 à 5 offres prioritaires ;
- formations prioritaires ;
- hypothèse de gains attendus ;
- proposition immédiate.

## Nœud 13 - Generate Tailored Deck Brief

**Type n8n**

- `AI Agent`
- ou `Set`

**Rôle**

- préparer le brief du deck ciblé.

**Le deck doit refléter**

- le secteur ;
- les enjeux visibles ;
- les problèmes probables ;
- les solutions adaptées ;
- l'hypothèse de ROI ;
- la porte d'entrée ;
- le cas d'usage ;
- l'offre de formation ;
- les jalons `J+0 / J+15 / J+45 / J+90` ;
- le message de confidentialité et de gouvernance si pertinent.

## Nœud 14 - Generate Tailored Audit Form

**Type n8n**

- `AI Agent`

**Rôle**

- produire une forme d'audit à envoyer avant l'appel ou avant la visite.

**Objectif**

- gagner du temps ;
- qualifier les priorités ;
- préparer un rendez-vous utile.

**La forme d'audit doit couvrir**

- enjeux métier ;
- irritants opérationnels ;
- outils actuels ;
- données disponibles ;
- attentes en matière de formation ;
- attentes en matière de confidentialité ;
- priorités à 3 mois ;
- cas d'usage souhaités.

Elle doit aussi récupérer les éléments utiles à l'estimation de valeur :

- volumes traités ;
- délais actuels ;
- points de saturation ;
- coût perçu des tâches répétitives ;
- objectifs de performance.

## Nœud 15 - Generate Meeting Use Case

**Type n8n**

- `AI Agent`

**Rôle**

- produire un cas d'usage court et crédible à montrer pendant le rendez-vous.

**Exemples**

- copilote de suivi commercial ;
- aide à la relance et à la synthèse portefeuille ;
- assistant de reporting ;
- assistant de procédures ;
- copilote de formation interne.

Cas de référence à privilégier selon le contexte :

- support IT intelligent pour DSI, PMO, transformation ;
- service client multicanal pour front office, SAV, banques, télécoms ;
- machine à contenu marketing pour marketing, communication, vente ;
- workflow administratif pour opérations, administration, secrétariats généraux ;
- assistant documentaire de direction pour CODIR, DG, assistanats ;
- télémédecine triage et orientation pour cliniques, CHU, Ordre des Médecins ;
- support KYC, conformité et reporting pour banques et associations professionnelles.

## Nœud 15 bis - Build Delivery Timeline

**Type n8n**

- `Code`
- ou `AI Agent`

**Rôle**

- préparer la feuille de route courte à afficher dans le courrier, le deck ou la note.

**Format recommandé**

- `J+0` : audit et cartographie
- `J+15` : conception et pilote
- `J+45` : déploiement et formation
- `J+90` : suivi, optimisation et revue ROI

## Nœud 16 - Compliance and Quality Gate

**Type n8n**

- `IF`
- `Code`

**Rôle**

- empêcher les envois faibles ou risqués.

**Conditions minimales**

- structure clairement identifiée ;
- besoin probable défendable ;
- décideur ou contact professionnel cohérent ;
- courrier cohérent ;
- mini-catalogue cohérent ;
- deck cohérent ;
- forme d'audit prête ;
- pas de blocage conformité ;
- pas de doublon récent.

## Nœud 17 - Human Review

**Type n8n**

- `Manual`
- ou `Webhook` d'approbation

**Rôle**

- valider le pack final avant envoi.

**À revoir humainement**

- grands comptes ;
- institutions publiques ;
- organisations internationales ;
- messages au DG ;
- messages stratégiques à forte portée réputationnelle.

## Nœud 18 - Send Email

**Type n8n**

- `Email`
- ou `HTTP Request` vers l'outil d'envoi

**Rôle**

- envoyer le courrier ou e-mail principal.

**Pièces jointes recommandées**

- mini-catalogue ;
- éventuellement deck ;
- éventuellement note courte d'audit ;
- pas de surcharge inutile au premier envoi.

## Nœud 19 - Log Outreach

**Type n8n**

- `Supabase`

**Rôle**

- journaliser :
  - date d'envoi ;
  - canal ;
  - destinataire ;
  - version du courrier ;
  - catalogue joint ;
  - deck joint ;
  - statut d'envoi.

## Nœud 20 - Follow-Up and Stop Rules

**Type n8n**

- `Wait`
- `IF`
- `Supabase`

**Rôle**

- suivre la réaction ;
- préparer une relance si justifiée ;
- arrêter sinon.

**Règles**

- pas plus d'une relance sans signal ;
- arrêt si opposition ;
- arrêt si aucune réaction après la séquence prévue ;
- arrêt si la niche apparaît trop faible après revue.

## 6. Séquence commerciale recommandée

Le workflow doit respecter la séquence suivante :

1. **lecture publique**
2. **pré-audit**
3. **problèmes probables**
4. **hypothèse de ROI**
5. **solutions recommandées**
6. **porte d'entrée**
7. **courrier DG**
8. **mini-catalogue ciblé**
9. **deck ciblé**
10. **forme d'audit**
11. **appel gratuit de 45 minutes**

## 7. Règle de personnalisation

Le workflow ne doit jamais envoyer un pack standard.

Pour chaque prospect, il faut personnaliser :

- le courrier ;
- le mini-catalogue ;
- le deck ;
- la forme d'audit ;
- le cas d'usage.

Cette personnalisation doit être faite :

- en fonction du secteur ;
- en fonction des signaux visibles ;
- en fonction des problèmes probables ;
- en fonction du niveau du destinataire ;
- et en fonction de la porte d'entrée retenue.

## 8. Position finale

Le workflow multi-prospects doit devenir la référence du système :

- analyse publique sérieuse ;
- hypothèses métier crédibles ;
- offre d'entrée claire ;
- service avant technologie ;
- formation intégrée ;
- et support commercial entièrement taillé sur mesure.
