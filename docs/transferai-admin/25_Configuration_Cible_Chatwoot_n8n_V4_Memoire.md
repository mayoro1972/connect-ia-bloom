# 25. Configuration Cible Chatwoot n8n V4 Memoire

Statut : cible preparee, V3 active en production, V4 en preparation et non basculee.

## Objectif

La V4 ajoute une memoire conversationnelle au workflow Chatwoot afin d'eviter que l'assistant redemande des informations que le prospect a deja fournies. La source de verite de cette memoire est l'historique de conversation stocke dans Chatwoot lui-meme.

Cette V4 ne remplace pas encore la V3 en production. La V3 reste le workflow actif tant que la V4 n'a pas ete validee en test puis en observation de production.

## Garde-fou de production

- V3 reste active pendant toute la phase de preparation V4.
- V4 est configuree et testee en parallele.
- Le webhook Chatwoot ne doit etre bascule vers `chatwoot-inbound-v4` qu'apres validation complete.
- En cas de souci, le rollback consiste a remettre l'URL webhook Chatwoot vers `chatwoot-inbound-v3`.

## Workflow cible

- Nom cible du workflow : `ACTIVE - TransferAI Chatwoot Auto Reply V4 (Memoire)`
- Path webhook : `chatwoot-inbound-v4`
- URL production :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v4
```

## Architecture cible

Le workflow V4 est compose de 7 noeuds en ligne droite :

1. `Chatwoot Webhook`
2. `Filter Chatwoot event`
3. `Fetch conversation history`
4. `Build OpenAI payload with history`
5. `OpenAI Chat Completions`
6. `Format AI reply`
7. `Send reply to Chatwoot`

## Runbook detaille noeud par noeud

### 1. Chatwoot Webhook

Configuration attendue :

- HTTP Method : `POST`
- Path : `chatwoot-inbound-v4`
- Respond : `Immediately`
- Authentication : `None`

Rien a modifier si le noeud est importe depuis le JSON de reference.

## 2. Filter Chatwoot event

Type : `Code`

Configuration attendue :

- Mode : `Run Once for All Items`
- Language : `JavaScript`

Le code doit verifier, dans cet ordre :

- `event === 'message_created'`
- message entrant (`message_type === 'incoming'` ou `message_type === 0`)
- presence de `conversation.id`
- `content` non vide apres `trim()`

Il doit egalement transporter :

- `conversation_id`
- `incoming_text`
- `sender_name`
- `fallback_reply`

Le `fallback_reply` sert de filet de securite si OpenAI echoue plus loin.

### 3. Fetch conversation history

Type : `HTTP Request`

Configuration attendue :

- Method : `GET`
- URL :

```text
https://app.chatwoot.com/api/v1/accounts/163278/conversations/{{$json.conversation_id}}/messages
```

- Authentication : `None`
- Send Headers : `ON`

Point critique :

- le champ `URL` doit etre en mode `Expression`

Headers attendus :

1. `api_access_token`
   - valeur initiale dans le JSON : `REPLACE_WITH_CHATWOOT_API_TOKEN`
   - a remplacer par le vrai token Chatwoot
   - pas de prefixe `Bearer`

2. `Content-Type`
   - valeur : `application/json`

### 4. Build OpenAI payload with history

Type : `Code`

Configuration attendue :

- Mode : `Run Once for All Items`
- Language : `JavaScript`

Responsabilites du noeud :

- recuperer le contexte original depuis `$('Filter Chatwoot event').first()`
- recuperer l'historique renvoye par Chatwoot
- convertir l'historique au format OpenAI :
  - messages entrants -> `role: 'user'`
  - messages sortants -> `role: 'assistant'`
- dedupliquer le message courant si Chatwoot l'a deja enregistre dans l'historique
- construire `openai_payload`

Parametre important :

- `MAX_HISTORY = 20`

Ce plafond est volontaire :

- il limite les couts OpenAI
- il borne la latence
- il reste suffisant pour les conversations commerciales courtes

### 5. OpenAI Chat Completions

Type : `HTTP Request`

Configuration attendue :

- Method : `POST`
- URL :

```text
https://api.openai.com/v1/chat/completions
```

- Authentication : `None`
- Send Headers : `ON`
- Send Body : `ON`
- Body Content Type : `JSON`
- JSON Body :

```text
={{ JSON.stringify($json.openai_payload) }}
```

Headers attendus :

1. `Authorization`
   - valeur initiale dans le JSON : `Bearer REPLACE_WITH_OPENAI_API_KEY`
   - a remplacer par une vraie cle OpenAI
   - le mot `Bearer` doit etre conserve, suivi d'une espace

2. `Content-Type`
   - valeur : `application/json`

Bonne pratique :

- si une cle OpenAI a ete exposee dans des captures ou des essais, il faut la regenerer puis supprimer l'ancienne.

### 6. Format AI reply

Type : `Code`

Configuration attendue :

- Mode : `Run Once for All Items`
- Language : `JavaScript`

Responsabilites :

- lire `choices[0].message.content`
- construire `reply_text`
- basculer automatiquement sur `fallback_reply` si OpenAI n'a pas renvoye de contenu exploitable

Sortie attendue :

- `reply_text`
- `used_fallback`
- `history_count`
- `already_included`

### 7. Send reply to Chatwoot

Type : `HTTP Request`

Configuration attendue :

- Method : `POST`
- URL :

```text
https://app.chatwoot.com/api/v1/accounts/163278/conversations/{{$json.conversation_id}}/messages
```

- Authentication : `None`
- Send Body : `ON`
- Body Content Type : `JSON`
- JSON Body :

```text
={{ JSON.stringify({ content: $json.reply_text, message_type: 'outgoing', private: false }) }}
```

Point critique :

- le champ `URL` doit etre en mode `Expression`

Headers attendus :

1. `api_access_token`
   - valeur initiale dans le JSON : `REPLACE_WITH_CHATWOOT_API_TOKEN`
   - a remplacer par le meme token Chatwoot que dans `Fetch conversation history`

2. `Content-Type`
   - valeur : `application/json`

## Sauvegarde et activation

Une fois les trois secrets/configurations remplaces :

- sauvegarder le workflow
- le laisser `Inactive` pendant la phase de test
- ne l'activer qu'apres validation complete

## Test pas a pas avant production

### Etape 1. Mock data sur le webhook

Dans `Chatwoot Webhook` :

- utiliser `set mock data`
- coller le mock de travail deja utilise pour V3

### Etape 2. Executer les noeuds un par un

Ordre d'execution recommande :

1. `Filter Chatwoot event`
   - sortie attendue :

```json
{
  "conversation_id": 3,
  "incoming_text": "...",
  "sender_name": "...",
  "fallback_reply": "..."
}
```

2. `Fetch conversation history`
   - sortie attendue :
     - `200 OK`
     - liste de messages ou payload contenant l'historique
   - si `401` ou `403` :
     - verifier le token Chatwoot

3. `Build OpenAI payload with history`
   - sortie attendue :
     - `openai_payload`
     - `history_count`
     - `already_included`

4. `OpenAI Chat Completions`
   - sortie attendue :
     - `choices[0].message.content`
   - si erreur sur la cle :
     - verifier le header `Authorization`

5. `Format AI reply`
   - sortie attendue :
     - `reply_text`
     - `used_fallback: false`

6. `Send reply to Chatwoot`
   - sortie attendue :

```json
{
  "id": "...",
  "content": "...",
  "message_type": 1,
  "status": "sent"
}
```

Note importante :

- ce dernier test poste un vrai message dans la conversation cible

### Etape 3. Retirer les donnees mockees

Avant toute mise en production :

- `Unpin Data` ou suppression des mock data sur le webhook

Sinon, la V4 reutiliserait un faux payload au lieu des vrais evenements.

## Migration V3 vers V4

Quand tous les tests sont verts :

1. activer la V4 dans n8n
2. dans Chatwoot :
   - `Settings -> Integrations -> Webhooks`
   - remplacer l'URL `chatwoot-inbound-v3` par `chatwoot-inbound-v4`
3. effectuer un test reel avec au moins deux messages successifs

Exemple de validation attendue :

- message 1 :
  - `Bonjour, je suis chez TransLog SA`
- message 2 :
  - `Notre besoin est l'automatisation`

La deuxieme reponse ne doit pas redemander le nom de l'entreprise si la memoire fonctionne correctement.

## Strategie de rollback

Pendant 24 a 48 heures apres la bascule :

- garder la V3 active dans n8n
- si V4 pose un souci :
  - remettre l'URL du webhook Chatwoot vers `chatwoot-inbound-v3`
  - ne pas tenter de corriger en urgence directement sur la prod

Une fois la V4 stable :

- renommer la V3 en :

```text
ARCHIVE - TransferAI Chatwoot Auto Reply V3 (filet memoire down)
```

- puis desactiver la V3

## Regles de stabilite

- ne pas modifier la V3 active pendant la phase de validation V4
- ne pas remettre `$env` dans les noeuds HTTP si l'instance n8n bloque l'acces aux variables d'environnement
- ne jamais committer de secrets reels dans le repo
- conserver des placeholders dans les JSON exportables
- tester d'abord avec mock data puis avec une vraie conversation
- garder `MAX_HISTORY = 20` tant qu'aucune raison metier ne justifie une hausse

## Benefices attendus de la V4

- l'assistant se souvient des informations deja donnees
- il evite de reposer les memes questions
- il enchaine mieux les tours de conversation
- l'experience utilisateur parait plus humaine et moins robotique

## Suite logique apres V4

La roadmap cible reste la suivante :

- V5 : qualification structuree, `custom_attributes`, labels Chatwoot
- V5.5 : proposition conditionnelle de demo / Calendly
- V6 : handoff humain automatique
- V7 : logs, supervision, observabilite

La V4 doit d'abord etre stable avant de passer a ces etapes.
