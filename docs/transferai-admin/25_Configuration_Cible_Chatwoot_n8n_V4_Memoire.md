# Configuration Cible Chatwoot + n8n V4 Memoire

## Statut

La V4 est la prochaine cible d'evolution apres la validation de la V3 OpenAI.

Son objectif n'est pas de remplacer la V3 dans l'urgence, mais d'ajouter une memoire conversationnelle stable sans casser le filet de securite V2/V3.

## Objectif principal

Eviter que l'assistant IA redemande des informations deja fournies par le prospect.

La V4 doit permettre au bot :

- de relire les messages precedents de la conversation
- de reutiliser le contexte deja donne
- d'eviter les questions redondantes
- de paraitre plus intelligent et plus fluide

## Workflow actif cible

Nom recommande pour le workflow V4 quand il sera valide :

`ACTIVE - TransferAI Chatwoot Auto Reply V4 (Memoire)`

## Workflows filet de securite a conserver

Tant que la V4 n'est pas stabilisee, conserver :

- `ACTIVE - TransferAI Chatwoot Auto Reply V3 (OpenAI)`
- `ACTIVE - TransferAI Chatwoot Auto Reply V2 (Fallback statique)`

## Webhook production V4 cible

URL webhook production cible :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v4
```

Path n8n :

```text
chatwoot-inbound-v4
```

## Architecture cible V4

La V4 doit suivre cette architecture simple :

1. `Chatwoot Webhook V4`
2. `Filter Chatwoot event`
3. `Fetch conversation history`
4. `Build OpenAI payload with history`
5. `OpenAI Chat Completions`
6. `Format AI reply`
7. `Send reply to Chatwoot`

## Principe de memoire retenu

La source de memoire retenue doit etre Chatwoot lui-meme.

Au lieu de stocker l'historique dans une base annexe des le depart :

- on fait un `GET` sur les messages de la conversation courante
- on recupere un historique recent
- on le convertit au format attendu par OpenAI
- on laisse le modele repondre avec ce contexte

## Pourquoi cette approche est recommandee

Avantages :

- une seule source de verite
- pas de table supplementaire a maintenir au debut
- les agents humains et le bot lisent le meme historique
- passage naturel de V3 vers V4

## Points de stabilite a respecter

La V4 doit conserver les acquis des versions precedentes :

- webhook dedie et distinct
- filtre `Code` robuste
- fallback possible vers V3
- URL Chatwoot stable
- pas de dependance fragile a des `$env` bloques

## Risques principaux de la V4

Les risques a surveiller :

- historique trop long -> cout OpenAI augmente
- duplication du message courant dans le prompt
- latence plus forte qu'en V3
- reponse trop verbeuse si le contexte n'est pas borne

## Garde-fous recommandes

Pour limiter ces risques :

- ne charger que les N derniers messages pertinents
- dedupliquer le message courant
- plafonner `max_tokens`
- garder la V3 active comme rollback

## Benefice attendu

Exemple de gain attendu :

- V3 : "Bonjour, quel est le nom de votre entreprise ?"
- prospect : "TransLog SA"
- prospect suivant : "Nous faisons du transport"
- V3 peut encore reposer une question deja couverte

Avec la V4 :

- le bot sait deja que l'entreprise est `TransLog SA`
- il enchaine sur le besoin reel sans reposer le nom

## Ce qui viendra apres la V4

La V4 n'est pas la fin de la feuille de route.

Apres stabilisation V4 :

1. `V5` qualification structuree
2. `V5.5` proposition conditionnelle de demo
3. `V6` handoff humain
4. `V7` logs et supervision
5. `V8` multi-canal
6. `V9` RAG sur la base de connaissance
7. `V10` voix

## Recommandation de migration

Ne pas couper directement la V3.

Ordre recommande :

1. construire la V4 a cote de la V3
2. tester la V4 avec mock data puis en conversation reelle
3. basculer Chatwoot de `-v3` vers `-v4`
4. garder la V3 active 24 a 48 heures
5. n'archiver la V3 qu'apres stabilisation observee
