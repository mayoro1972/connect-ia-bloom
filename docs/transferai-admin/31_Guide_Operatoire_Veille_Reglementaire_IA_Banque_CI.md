# Guide opératoire

## Veille réglementaire IA

### Banque - Côte d'Ivoire

Ce guide explique comment alimenter la veille réglementaire IA en moins de 5 minutes par signal.

## Objectif

Transformer rapidement une nouvelle information réglementaire ou institutionnelle en:

- signal enregistré
- brouillon exploitable
- note publiée dans le feed de veille

## Quand utiliser ce process

Utilisez ce process dès qu'un nouveau contenu apparaît sur:

- BCEAO
- UEMOA
- ARTCI
- une autorité de protection des données
- une institution bancaire ou un régulateur utile
- une source sectorielle crédible sur IA, conformité, gouvernance ou données

## Accès

Ouvrir:

- `/back-office?tab=editorial` pour injecter et traiter les signaux
- `/back-office?tab=resources` pour publier ou enrichir une note
- `/veille-reglementaire-ia` pour vérifier le rendu public

## Process en 5 minutes

### 1. Repérer le signal

Dès qu'un texte utile est détecté, relever:

- le titre exact
- l'URL source
- la date
- un résumé court ou l'extrait important

Exemples:

- note BCEAO
- décision ARTCI
- annonce UEMOA
- publication sur données personnelles
- cadre de gouvernance IA

### 2. Injecter le signal

Dans `/back-office?tab=editorial`:

- aller à `Injecter un signal réglementaire`
- coller le `Titre du signal`
- coller l'`URL source`
- renseigner la `date/heure`
- coller un `Résumé ou extrait important`
- cliquer sur `Ajouter à la file`

Résultat attendu:

- le signal apparaît dans la file éditoriale

### 3. Lancer le pipeline

Toujours dans l'onglet `editorial`:

- cliquer sur `1. Lancer la collecte des sources`
- cliquer sur `2. Classer les nouveaux signaux`
- cliquer sur `3. Générer les brouillons FR`

Résultat attendu:

- le signal devient un brouillon FR relisible

### 4. Vérifier le brouillon

Dans `Brouillons IA à relire`:

- ouvrir la source d'origine
- vérifier le titre
- vérifier le résumé
- vérifier l'angle métier banque / conformité
- corriger si nécessaire

À contrôler en priorité:

- pas d'affirmation non sourcée
- pas de conclusion juridique trop forte
- pas de confusion entre Côte d'Ivoire, UEMOA et international

### 5. Publier la note

Dans `/back-office?tab=resources`:

- vérifier ou compléter le contenu
- ajouter les tags métier
- vérifier la source
- publier la ressource

Résultat attendu:

- la note apparaît dans `/veille-reglementaire-ia`

## Tags à utiliser

Toujours mettre:

- 1 tag `jurisdiction`
- 1 tag `authority`
- 1 ou 2 tags `theme`
- 1 tag `impact`

### Tags recommandés

- `jurisdiction:cote-divoire`
- `jurisdiction:uemoa-bceao`
- `jurisdiction:international`
- `authority:bceao`
- `authority:uemoa`
- `authority:artci`
- `theme:gouvernance-ia`
- `theme:donnees-personnelles`
- `theme:conformite-bancaire`
- `impact:high`

## Exemples rapides

### Cas 1 - Note BCEAO

Tags:

- `jurisdiction:uemoa-bceao`
- `authority:bceao`
- `theme:conformite-bancaire`
- `theme:gouvernance-ia`
- `impact:high`

### Cas 2 - Décision locale données personnelles

Tags:

- `jurisdiction:cote-divoire`
- `authority:artci`
- `theme:donnees-personnelles`
- `impact:high`

### Cas 3 - Référence internationale à surveiller

Tags:

- `jurisdiction:international`
- `theme:gouvernance-ia`
- `impact:monitor`

## Règle éditoriale

La note doit répondre à cette question:

Qu'est-ce que ce signal change concrètement pour une banque ou une fonction conformité en Côte d'Ivoire ?

Le texte final doit rester:

- factuel
- court
- utile
- orienté décision

## Checklist finale

Avant publication, vérifier:

- la source est officielle ou crédible
- le titre est clair
- le résumé est compréhensible
- les tags sont cohérents
- la juridiction est correcte
- l'impact est correctement estimé
- la note apporte une lecture métier

## Temps cible

Temps moyen recommandé par signal:

- 1 minute pour repérer et résumer
- 1 minute pour injecter
- 1 minute pour lancer le pipeline
- 1 à 2 minutes pour relire et publier

Objectif:

- moins de 5 minutes par signal standard

