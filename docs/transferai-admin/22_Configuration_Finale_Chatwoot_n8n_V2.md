# Configuration Finale Chatwoot + n8n V2

## Statut

La version V2 du workflow `Chatwoot -> n8n -> reponse automatique` est validee.

Validation observee :

- le widget Chatwoot apparait sur le site public
- le webhook Chatwoot declenche bien n8n
- le noeud de filtrage/code laisse passer les vrais messages texte entrants
- le noeud HTTP renvoie bien la reponse dans la conversation Chatwoot
- la boucle de reponse infinie n'est plus presente

## Workflow actif recommande

Nom recommande pour le workflow actif :

`ACTIVE - TransferAI Chatwoot Auto Reply V2`

## Workflows a archiver

Noms recommandes pour les anciens workflows :

- `ARCHIVE - TransferAI - Chatwoot V1`
- `ARCHIVE - TransferAI Chatwoot Auto Reply V1 Import Strict`

Recommandation :

- laisser les workflows archives desactives
- ne garder publie que le workflow V2 actif

## Webhook production V2

URL webhook production a conserver dans Chatwoot :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v2
```

Path n8n :

```text
chatwoot-inbound-v2
```

## Architecture finale V2

Le workflow V2 repose sur 3 noeuds :

1. `Chatwoot Webhook`
2. `Filter + Build reply`
3. `Send reply to Chatwoot`

## Noeud 1 - Chatwoot Webhook

Configuration validee :

- `HTTP Method` : `POST`
- `Path` : `chatwoot-inbound-v2`
- `Authentication` : `None`
- `Respond` : `Immediately`

## Noeud 2 - Filter + Build reply

Type :

- noeud `Code`

Objectif :

- filtrer les evenements inutiles
- ignorer les messages sortants pour eviter les boucles
- ignorer les messages vides
- construire `conversation_id`, `incoming_text` et `reply_text`

Logique validee :

- ne traiter que `message_created`
- ne traiter que les messages entrants
- exiger une `conversation.id`
- exiger un texte non vide

Debut de code robuste :

```javascript
const item = $input.first()?.json ?? {};
const body = item.body ?? item;
```

Sortie attendue :

```json
{
  "conversation_id": 3,
  "incoming_text": "message utilisateur",
  "reply_text": "Bonjour et merci pour votre message. Pour bien vous orienter, pouvez-vous me preciser le nom de votre entreprise, votre secteur d'activite et votre besoin principal ?"
}
```

## Noeud 3 - Send reply to Chatwoot

Configuration validee :

- `Method` : `POST`
- `Authentication` : `None`
- `Send Headers` : active
- `Send Body` : active
- `Body Content Type` : `JSON`

URL validee :

```text
https://app.chatwoot.com/api/v1/accounts/163278/conversations/{{$json.conversation_id}}/messages
```

Headers valides :

- `api_access_token` : token Chatwoot colle directement
- `Content-Type` : `application/json`

Body utilise :

```javascript
{{ JSON.stringify({ content: $json.reply_text, message_type: 'outgoing', private: false }) }}
```

## Message automatique V2

Message actuellement envoye :

```text
Bonjour et merci pour votre message. Pour bien vous orienter, pouvez-vous me preciser le nom de votre entreprise, votre secteur d'activite et votre besoin principal ?
```

## Points qui ont bloque avant V2

Les principaux blocages observes pendant la mise en place :

- blocage du widget sur le site public a cause de la CSP
- confusion entre webhook test et webhook production
- instabilite du noeud `If`
- boucle de reponse sur les messages sortants
- champ URL n8n invalide a cause du prefixe `=`
- acces refuse aux variables d'environnement dans le noeud HTTP

## Regles de stabilite a conserver

Pour ne pas recasser la V2 :

- ne pas remettre le noeud `If` a la place du noeud `Code`
- ne pas remettre `$env.CHATWOOT_ACCOUNT_ID` dans le champ URL de ce noeud HTTP
- ne pas remettre `$env.CHATWOOT_API_TOKEN` dans ce workflow si l'instance n8n le bloque
- garder le path V2 distinct de la V1
- garder la V1 desactivee

## Ce qui est accompli

Ce qui est maintenant accompli :

- widget Chatwoot visible sur le site public
- webhook public Chatwoot operationnel
- workflow V2 n8n stable
- message utilisateur recu dans n8n
- reponse automatique renvoyee dans Chatwoot
- absence de boucle infinie

## Ce qui reste a finaliser

Pour avoir un vrai assistant IA operationnel, il reste a faire :

1. remplacer la reponse statique par un appel OpenAI
2. brancher les prompts operationnels V1 deja documentes
3. qualifier le lead automatiquement
4. ajouter la logique de handoff humain / demo / relance
5. ajouter labels, attributs et note interne Chatwoot
6. prevoir une couche de logs et de supervision

## Prochaine etape recommandee

La prochaine etape recommande est :

`V3 - Auto Reply IA`

Cette V3 doit introduire :

- un noeud OpenAI ou equivalent
- un prompt systeme TransferAI
- une sortie texte courte et exploitable
- puis, dans un second temps, une qualification plus riche

## Check de regression rapide

Avant toute modification future, verifier :

1. la bulle Chatwoot apparait sur le site
2. un message libre utilisateur cree une execution n8n
3. le noeud `Filter + Build reply` s'execute
4. le noeud `Send reply to Chatwoot` s'execute
5. une seule reponse automatique est envoyee
