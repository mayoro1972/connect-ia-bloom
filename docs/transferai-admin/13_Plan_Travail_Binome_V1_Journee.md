# Plan de travail heure par heure - binôme V1 Agent IA

## 1. Objectif

Ce document propose un plan de travail **heure par heure**, pensé pour **2 personnes**, afin de livrer **une V1 fonctionnelle aujourd'hui** de l'agent IA TransferAI.

La V1 doit être capable de :

- recevoir un message WhatsApp entrant
- répondre au nom de TransferAI
- poser les 3 questions de qualification obligatoires
- comprendre le besoin principal
- proposer une démo si le prospect est sérieux
- enregistrer les données utiles
- permettre un handoff humain

## 2. Répartition des rôles

### Personne A

Responsable de :

- prompts
- logique métier
- qualification
- ton de voix
- réponses types
- critères de sérieux du prospect
- cas de handoff humain

### Personne B

Responsable de :

- n8n
- Twilio
- Chatwoot
- OpenAI
- Supabase
- stockage
- tests techniques

## 3. Résultat attendu à la fin de la journée

À la fin de la journée, l'équipe doit avoir :

- une V1 fonctionnelle de qualification automatique
- un workflow n8n actif
- une logique de réponse courte et professionnelle
- une proposition de démo conditionnelle
- un stockage des leads
- un minimum de supervision et de logs

## 4. Plan heure par heure

## 9h00 - 9h30 : cadrage commun

### Participants

- Personne A
- Personne B

### Objectif

- aligner le périmètre exact de la V1
- éviter les ambiguïtés avant l'implémentation

### Décisions à prendre ensemble

- objectif exact du bot
- lien Calendly à utiliser
- définition du “prospect sérieux”
- services prioritaires à couvrir aujourd'hui
- ton de voix exact
- conditions d'escalade humaine

### Règles à figer

- toujours poser :
  1. nom de l'entreprise
  2. secteur d'activité
  3. besoin principal : formation, veille ou automatisation
- proposer une démo si le lead est sérieux
- rester court, professionnel et clair

### Livrable attendu

- mini fiche de cadrage commune
- lien Calendly validé
- logique métier V1 validée

## 9h30 - 10h30 : séparation des chantiers

### Personne A

Références à ouvrir :

- `11_Prompt_Pack_n8n_Chatwoot.md`
- `02_Base_Connaissance_Site.md`
- `03_FAQ_Site_Assistant_IA.md`

Tâches :

- finaliser le prompt système maître
- finaliser le prompt de qualification initiale
- finaliser le prompt de relance si informations manquantes
- finaliser le prompt ultra-court WhatsApp

### Personne B

Référence à ouvrir :

- `12_Workflow_n8n_Node_Par_Node.md`

Tâches :

- créer le workflow n8n principal
- poser la structure :
  - webhook Twilio
  - normalisation
  - OpenAI
  - IF / Switch
  - réponse
  - stockage

### Livrable attendu

- prompt maître prêt
- squelette n8n posé

## 10h30 - 11h30 : qualification structurée

### Personne A

Tâches :

- finaliser le prompt qualification JSON
- finaliser le prompt scoring lead
- finaliser le prompt de proposition de démo
- finaliser le prompt handoff humain
- finaliser le prompt note interne

### Personne B

Tâches :

- brancher le nœud OpenAI qualification
- brancher le nœud OpenAI scoring
- brancher le nœud OpenAI proposition de démo
- préparer les variables :
  - `company_name`
  - `sector`
  - `need_type`
  - `intent`
  - `lead_seriousness`
  - `should_offer_demo`

### Livrable attendu

- prompts structurés validés
- qualification OpenAI branchée dans n8n

## 11h30 - 12h15 : premier test technique

### Participants

- Personne A
- Personne B

### Tests à faire

- message WhatsApp simple
- message vague
- message orienté formation
- message orienté automatisation

### Vérifications

- Twilio reçoit
- n8n déclenche
- OpenAI répond
- réponse envoyée
- données structurées disponibles

### Livrable attendu

- premier aller-retour réel WhatsApp fonctionnel
- liste des bugs immédiats

## 12h15 - 13h00 : corrections ciblées

### Personne A

Tâches :

- corriger les formulations
- raccourcir les réponses trop longues
- ajuster les relances

### Personne B

Tâches :

- corriger les mappings
- fiabiliser le JSON
- ajouter les fallbacks si la réponse OpenAI est mal formée

### Livrable attendu

- V1 plus stable
- réponses plus propres

## 13h00 - 14h00 : pause

Recommandation :

- faire une vraie pause
- ne pas utiliser cette heure pour empiler des corrections mineures

## 14h00 - 15h00 : intégration métier utile

### Personne A

Tâches :

- valider la règle finale “proposer une démo si…”
- valider la règle finale “escalader à un humain si…”

#### Démo à proposer si

- entreprise identifiée
- secteur identifié
- besoin concret
- logique B2B ou besoin opérationnel
- intérêt réel pour accompagnement, audit ou automatisation

#### Escalade humaine si

- partenariat
- demande institutionnelle
- demande stratégique
- besoin complexe
- insatisfaction
- prospect très qualifié

### Personne B

Tâches :

- implémenter ces règles dans n8n avec :
  - `IF`
  - `Switch`
  - branche `offer_demo`
  - branche `human_handoff`
  - branche `ask_missing_info`

### Livrable attendu

- logique métier codée dans le workflow

## 15h00 - 16h00 : stockage et supervision

### Personne A

Tâches :

- définir le format résumé CRM
- définir le format note interne
- définir les statuts finaux utiles

### Personne B

Tâches :

- brancher le stockage :
  - Supabase ou CRM
  - log conversation
  - log décision
  - note interne
- vérifier la remontée en back-office si prévue

### Livrable attendu

- prospect enregistré
- note interne générée
- résumé exploitable stocké

## 16h00 - 17h00 : tests complets en conditions réelles

### Participants

- Personne A
- Personne B

### Scénarios à tester

1. prospect flou
2. prospect formation
3. prospect audit IA
4. prospect automatisation
5. prospect partenariat
6. prospect sérieux demandant une démo

### Vérifications

- bonne réponse
- bonne relance
- bonne qualification
- bonne décision démo ou non
- bon stockage
- bon handoff si nécessaire

### Livrable attendu

- tableau de tests validés / non validés

## 17h00 - 17h45 : finition

### Personne A

Tâches :

- relire toutes les réponses types
- harmoniser le ton TransferAI
- retirer ce qui sonne trop robotique

### Personne B

Tâches :

- nettoyer le workflow n8n
- nommer clairement les nœuds
- documenter les variables utiles
- préparer un export ou une sauvegarde du workflow

### Livrable attendu

- workflow propre
- prompts propres
- version démontrable

## 17h45 - 18h00 : clôture

### Participants

- Personne A
- Personne B

### Tâches

- test final unique
- décision de validation V1
- noter les points à faire demain

### Checklist finale

- WhatsApp reçoit et répond
- qualification fonctionne
- démo proposée au bon moment
- handoff humain possible
- lead enregistré
- note interne générée

## 5. Priorité absolue si le temps manque

Si la journée dérape, ne cherchez pas à tout faire.

Concentrez-vous uniquement sur :

1. WhatsApp entrant
2. 3 questions de qualification
3. scoring simple
4. proposition Calendly si lead sérieux
5. enregistrement du lead
6. handoff humain simple

## 6. Recommandation finale

Le vrai objectif n'est pas de sortir un bot parfait aujourd'hui.

Le vrai objectif est de sortir :

- une V1 fiable
- compréhensible
- testée
- utile
- améliorable demain

Cette approche est la meilleure pour préserver la vitesse d'exécution sans perdre la qualité.
