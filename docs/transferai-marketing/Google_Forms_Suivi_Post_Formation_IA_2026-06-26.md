# Google Forms - Suivi post-formation IA

Date : 26 juin 2026

## Objectif du formulaire

Ce formulaire a pour but de faire un suivi simple, utile et professionnel après une formation en intelligence artificielle animée par TransferAI.

Il permet de savoir :

- si la formation a déjà été mise en pratique
- quels usages ont réellement été testés
- quels résultats ou premiers gains ont été observés
- quels blocages restent à lever
- si un accompagnement complémentaire est souhaité

L'objectif est double :

- mieux accompagner les personnes formées après la session
- améliorer les prochaines formations grâce aux retours terrain

Le formulaire doit rester :

- court
- clair
- orienté terrain
- non technique
- lisible sur téléphone
- facile à remplir en moins de 3 minutes

## Réglages recommandés dans Google Forms

- Activer une seule page si possible
- Rendre obligatoires les questions de suivi essentielles ainsi que le nom et l'adresse e-mail
- Laisser les champs de commentaire libre facultatifs
- Ne pas demander de connexion Google obligatoire
- Activer un message de confirmation chaleureux et professionnel
- Garder un design simple, rassurant et propre
- Pré-remplir si possible le nom, l'e-mail et la formation suivie via le lien envoyé par le workflow

## Adaptation recommandée pour l'envoi automatique depuis le workflow

Pour faciliter l'envoi automatique à toutes les personnes formées et le traitement correct des réponses :

- utiliser un titre visible simple et stable
- transmettre côté Apps Script ou webhook un `form_title` exact de type `Suivi formation IA`
- garder un formulaire court pour maximiser le taux de réponse
- demander au minimum le nom, l'e-mail et la formation ou session suivie pour rattacher proprement la réponse
- éviter de demander des informations déjà connues si elles ne sont pas utiles au suivi

## Titre technique recommandé pour le workflow

`Suivi formation IA`

## Titre du formulaire

**Suivi formation IA - TransferAI**

## Introduction recommandée

Bonjour,

Merci encore d'avoir participé à une formation IA avec TransferAI.

Ce court formulaire de suivi nous permet de mieux comprendre ce qui a déjà été mis en pratique, les premiers résultats observés, les difficultés éventuelles et les besoins d'accompagnement complémentaires.

Notre objectif n'est pas seulement de transmettre un contenu, mais aussi de vous aider à transformer la formation en usage concret, utile et durable dans votre travail.

Merci de prendre 2 à 3 minutes pour répondre à ce formulaire.

## Version plus courte de l'introduction

Bonjour,

Merci d'avoir participé à une formation IA avec TransferAI.

Ce court formulaire nous permet de savoir ce que vous avez déjà mis en pratique, ce qui fonctionne, ce qui reste difficile et comment mieux vous accompagner après la formation.

Merci pour votre retour.

## Question 1

**Quelle formation, atelier ou session IA avez-vous suivi(e) avec TransferAI ?**

Type : `Réponse courte`  
Obligatoire : `Oui`

Exemples :

- Formation IA secrétariat
- Atelier IA marketing
- Session intra-entreprise RH
- Formation IA tous métiers

## Question 2

**Avez-vous déjà commencé à utiliser dans votre travail certains outils, méthodes ou usages vus pendant la formation ?**

Type : `Choix multiple`  
Obligatoire : `Oui`

Réponses :

- Oui, régulièrement
- Oui, quelques fois
- Pas encore, mais je compte commencer
- Pas encore

## Question 3

**Dans quel cadre utilisez-vous aujourd'hui le plus l'IA ?**

Type : `Cases à cocher`  
Obligatoire : `Oui`

Réponses :

- Rédaction de messages, e-mails ou documents
- Recherche d'informations
- Organisation du travail ou gain de temps
- Création de contenus ou présentations
- Analyse ou synthèse d'informations
- Automatisation de tâches répétitives
- Relation client ou communication
- Je n'ai pas encore commencé
- Autre

## Question 4

**Depuis la formation, quel premier bénéfice avez-vous le plus ressenti ?**

Type : `Choix multiple`  
Obligatoire : `Oui`

Réponses :

- Je gagne du temps
- Je travaille plus facilement
- Mes documents ou messages sont meilleurs
- J'ai plus d'idées ou plus de clarté
- Je comprends mieux comment utiliser l'IA
- Je n'ai pas encore observé de résultat concret

## Question 5

**Quel est aujourd'hui votre principal blocage pour mieux utiliser l'IA dans votre travail ?**

Type : `Choix multiple`  
Obligatoire : `Oui`

Réponses :

- Je manque encore de pratique
- Je ne sais pas toujours quoi demander à l'outil
- Je manque de temps pour m'exercer
- J'ai peur de me tromper
- Je me pose des questions sur la confidentialité et les données
- Je n'ai pas encore trouvé les bons cas d'usage pour mon métier
- Je n'ai pas de blocage particulier

## Question 6

**Sur la question des données sensibles, des documents internes, des clients ou des informations d'affaires, vous sentez-vous aujourd'hui suffisamment à l'aise pour utiliser l'IA avec prudence ?**

Type : `Choix multiple`  
Obligatoire : `Oui`

Réponses :

- Oui, je me sens à l'aise et bien sensibilisé(e)
- Assez, mais j'ai encore besoin de repères clairs
- Pas vraiment, j'ai besoin d'être mieux guidé(e)
- Non, ce sujet reste une vraie préoccupation pour moi

## Question 7

**Comment évalueriez-vous globalement l'utilité de cette formation pour votre travail ou votre activité ?**

Type : `Choix multiple`  
Obligatoire : `Oui`

Réponses :

- Très utile
- Plutôt utile
- Moyennement utile
- Peu utile pour le moment

## Question 8

**Souhaitez-vous un accompagnement complémentaire après la formation ?**

Type : `Choix multiple`  
Obligatoire : `Oui`

Réponses :

- Oui, pour aller plus loin
- Oui, pour débloquer des points pratiques
- Peut-être
- Non, pas pour le moment

## Question 9

**Quel type de suite vous serait le plus utile ?**

Type : `Choix multiple`  
Obligatoire : `Oui`

Réponses :

- Une session de suivi courte
- Des cas pratiques adaptés à mon métier
- Un rappel sur les bonnes pratiques et les prompts
- Un accompagnement sur la sécurité des données
- Une formation de niveau supérieur
- Des supports simples à revoir tranquillement

## Question 10

**Si vous le souhaitez, décrivez en une phrase ce que la formation vous a déjà apporté ou ce qui vous manque encore**

Type : `Paragraphe`  
Obligatoire : `Non`

## Question 11

**Nom et prénom**

Type : `Réponse courte`  
Obligatoire : `Oui`

## Question 12

**Adresse e-mail**

Type : `Réponse courte`  
Obligatoire : `Oui`

## Question 13

**Fonction / métier**

Type : `Réponse courte`  
Obligatoire : `Non`

## Question 14

**Entreprise / structure**

Type : `Réponse courte`  
Obligatoire : `Non`

## Message de confirmation après envoi

**Merci pour votre retour. Votre réponse a bien été enregistrée. Elle nous aidera à mieux vous accompagner après la formation et à améliorer les prochaines sessions TransferAI.**

## Version ultra-courte à copier directement dans Google Forms

### Titre

Suivi formation IA - TransferAI

### Description

Bonjour,

Merci d'avoir participé à une formation IA avec TransferAI.

Ce court formulaire nous permet de savoir ce que vous avez déjà mis en pratique, ce qui fonctionne, ce qui reste difficile et comment mieux vous accompagner après la formation.

Merci pour votre retour.

### Questions

1. Quelle formation, atelier ou session IA avez-vous suivi(e) avec TransferAI ?

2. Avez-vous déjà commencé à utiliser dans votre travail certains outils, méthodes ou usages vus pendant la formation ?

- Oui, régulièrement
- Oui, quelques fois
- Pas encore, mais je compte commencer
- Pas encore

3. Dans quel cadre utilisez-vous aujourd'hui le plus l'IA ?

- Rédaction de messages, e-mails ou documents
- Recherche d'informations
- Organisation du travail ou gain de temps
- Création de contenus ou présentations
- Analyse ou synthèse d'informations
- Automatisation de tâches répétitives
- Relation client ou communication
- Je n'ai pas encore commencé
- Autre

4. Depuis la formation, quel premier bénéfice avez-vous le plus ressenti ?

- Je gagne du temps
- Je travaille plus facilement
- Mes documents ou messages sont meilleurs
- J'ai plus d'idées ou plus de clarté
- Je comprends mieux comment utiliser l'IA
- Je n'ai pas encore observé de résultat concret

5. Quel est aujourd'hui votre principal blocage pour mieux utiliser l'IA dans votre travail ?

- Je manque encore de pratique
- Je ne sais pas toujours quoi demander à l'outil
- Je manque de temps pour m'exercer
- J'ai peur de me tromper
- Je me pose des questions sur la confidentialité et les données
- Je n'ai pas encore trouvé les bons cas d'usage pour mon métier
- Je n'ai pas de blocage particulier

6. Sur la question des données sensibles, des documents internes, des clients ou des informations d'affaires, vous sentez-vous aujourd'hui suffisamment à l'aise pour utiliser l'IA avec prudence ?

- Oui, je me sens à l'aise et bien sensibilisé(e)
- Assez, mais j'ai encore besoin de repères clairs
- Pas vraiment, j'ai besoin d'être mieux guidé(e)
- Non, ce sujet reste une vraie préoccupation pour moi

7. Comment évalueriez-vous globalement l'utilité de cette formation pour votre travail ou votre activité ?

- Très utile
- Plutôt utile
- Moyennement utile
- Peu utile pour le moment

8. Souhaitez-vous un accompagnement complémentaire après la formation ?

- Oui, pour aller plus loin
- Oui, pour débloquer des points pratiques
- Peut-être
- Non, pas pour le moment

9. Quel type de suite vous serait le plus utile ?

- Une session de suivi courte
- Des cas pratiques adaptés à mon métier
- Un rappel sur les bonnes pratiques et les prompts
- Un accompagnement sur la sécurité des données
- Une formation de niveau supérieur
- Des supports simples à revoir tranquillement

10. Si vous le souhaitez, décrivez en une phrase ce que la formation vous a déjà apporté ou ce qui vous manque encore

### Coordonnées

- Nom et prénom
- Adresse e-mail
- Fonction / métier
- Entreprise / structure
