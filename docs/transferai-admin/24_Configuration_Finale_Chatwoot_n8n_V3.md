# Configuration Finale Chatwoot + n8n V3

## Statut

La version V3 du workflow `Chatwoot -> n8n -> OpenAI -> Chatwoot` est validee en bout-en-bout.

Validation observee :

- le webhook Chatwoot V3 recoit bien les messages entrants
- le noeud `Code` filtre correctement les faux evenements
- l'appel OpenAI renvoie une vraie reponse contextualisee
- le noeud HTTP poste bien la reponse dans Chatwoot
- les executions recentes sont en `Succeeded`
- la reponse IA est visible dans une vraie conversation Chatwoot

## Workflow actif recommande

Nom recommande pour le workflow actif :

`ACTIVE - TransferAI Chatwoot Auto Reply V3 (OpenAI)`

## Workflow filet de securite

Nom recommande pour le workflow de secours :

`ACTIVE - TransferAI Chatwoot Auto Reply V2 (Fallback statique)`

Recommandation :

- garder la V2 active pendant 24 a 48 heures apres bascule V3
- laisser la V1 archivee et desactivee
- ne desactiver la V2 qu'apres stabilisation observee de la V3

## Workflows a archiver

Noms recommandes :

- `ARCHIVE - TransferAI - Chatwoot V1`
- `ARCHIVE - TransferAI Chatwoot Auto Reply V1 Import Strict`

## Webhook production V3

URL webhook production a conserver dans Chatwoot :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v3
```

Path n8n :

```text
chatwoot-inbound-v3
```

## Architecture finale V3

Le workflow V3 repose sur 4 noeuds logiques :

1. `Chatwoot Webhook`
2. `Filter + Build reply` (`Code`)
3. `OpenAI Chat Completions`
4. `Send reply to Chatwoot`

Selon les variantes de test, certains sous-flux peuvent etre decoupes en 5 ou 6 noeuds, mais la logique stable reste celle-ci :

- recevoir
- filtrer
- construire le prompt
- interroger OpenAI
- renvoyer la reponse dans Chatwoot

## Noeud 1 - Chatwoot Webhook

Configuration validee :

- `HTTP Method` : `POST`
- `Path` : `chatwoot-inbound-v3`
- `Authentication` : `None`
- `Respond` : `Immediately`

## Noeud 2 - Filter + Build reply

Type :

- noeud `Code`

Objectif :

- filtrer les evenements inutiles
- ignorer les messages sortants pour eviter les boucles
- exiger une `conversation.id`
- exiger un texte non vide
- construire `conversation_id`, `incoming_text` et le contenu pour OpenAI

Debut de code robuste :

```javascript
const item = $input.first()?.json ?? {};
const body = item.body ?? item;
```

Regles metier retenues :

- ne traiter que `message_created`
- ne traiter que les messages entrants
- ne pas repasser sur les messages du bot
- ne pas continuer si le texte est vide

## Noeud 3 - OpenAI Chat Completions

Type :

- noeud `HTTP Request`

Configuration cible retenue :

- `Method` : `POST`
- URL : `https://api.openai.com/v1/chat/completions`
- `Authentication` : `None`
- header `Authorization` saisi directement dans le noeud
- format reponse : `JSON`

## Regle de stabilite OpenAI

Dans cette instance n8n, l'acces a `$env` peut etre refuse dans certains noeuds HTTP.

Regle retenue pour la V3 :

- ne pas dependre des variables d'environnement dans les noeuds critiques si elles sont bloquees
- preferer un header direct temporaire pendant la phase de stabilisation
- regenerer la cle OpenAI si elle a ete exposee meme partiellement

## Noeud 4 - Send reply to Chatwoot

Configuration validee :

- `Method` : `POST`
- `Authentication` : `None`
- `Send Headers` : active
- `Send Body` : active
- `Body Content Type` : `JSON`

URL stable retenue :

```text
https://app.chatwoot.com/api/v1/accounts/163278/conversations/{{$json.conversation_id}}/messages
```

Headers stables :

- `api_access_token` : token Chatwoot colle directement
- `Content-Type` : `application/json`

Body recommande :

```javascript
{{ JSON.stringify({ content: $json.reply_text, message_type: 'outgoing', private: false }) }}
```

## Ce qui a bloque avant la stabilisation V3

Les principaux blocages observes pendant la mise en place :

- URL invalide a cause d'un prefixe `=`
- acces refuse aux variables d'environnement dans le noeud HTTP
- confusion entre champ `Fixed` et champ `Expression`
- previsualisation trompeuse des valeurs dans l'UI n8n
- instabilite du noeud `If` sur les payloads Chatwoot
- besoin de conserver une V2 stable comme filet de securite

## Regles de stabilite a conserver

Pour ne pas recasser la V3 :

- ne pas reintroduire le noeud `If`
- conserver le noeud `Code` comme filtre principal
- ne pas utiliser `$env.CHATWOOT_ACCOUNT_ID` dans l'URL si l'instance le bloque
- ne pas utiliser `$env.CHATWOOT_API_TOKEN` ou `$env.OPENAI_API_KEY` si l'instance refuse ces variables dans les noeuds HTTP
- garder la V2 active tant que la V3 n'a pas stabilise 24 a 48 heures
- conserver le path V3 distinct du path V2

## Ce qui est accompli

Ce qui est maintenant accompli :

- assistant IA TransferAI repond dans Chatwoot
- reponse contextualisee par OpenAI
- qualification conversationnelle de base amorcee
- widget site et flux n8n relies proprement
- rollback V3 -> V2 possible en quelques secondes

## Ce qui reste a finaliser

Pour faire evoluer l'assistant IA au-dela de la V3, il reste a faire :

1. ajouter la memoire conversationnelle
2. eviter de reposer les memes questions deja repondues
3. qualifier les leads en JSON structure
4. ecrire les informations utiles dans Chatwoot
5. introduire la logique de handoff humain
6. poser des labels et attributs de supervision

## Prochaine etape recommandee

La prochaine etape recommande est :

`V4 - Memoire conversationnelle`

Cette V4 doit introduire :

- un fetch d'historique de conversation Chatwoot
- un prompt OpenAI alimente par les messages precedents
- une deduplication du message courant
- une meilleure continuit conversationnelle

## Check de regression rapide

Avant toute bascule future, verifier :

1. le webhook V3 recoit bien les messages
2. le noeud `Code` laisse passer un vrai message entrant
3. OpenAI renvoie une reponse non vide
4. la reponse est bien visible dans Chatwoot
5. la V2 reste disponible comme plan B
