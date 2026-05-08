# 30. Configuration Cible Chatwoot n8n V5 Qualification

Statut : workflow V5 importe, configure et valide fonctionnellement, avec logique de qualification structuree active et Option B de capture contact confirmee. V4 reste a conserver comme filet de securite tant que la V5 n'a pas ete observee en production sur 24 a 48 heures.

## Objectif

La V5 ajoute une qualification structuree au flux conversationnel Chatwoot + n8n :

- reponse IA contextualisee maintenue
- memoire conversationnelle maintenue
- deuxieme appel OpenAI dedie a la qualification JSON
- ecriture des `custom_attributes` dans Chatwoot
- application automatique de labels Chatwoot
- capture de contact renforcee via l'option B :
  - formulaire pre-chat Chatwoot recommande
  - collecte email / telephone par le bot si manquants avant proposition de demo

La V5 ne doit pas etre basculee a la legere. Le principe reste :

- V5 configuree et testee en isolation
- V4 reste disponible comme rollback rapide
- V3 reste la reference stable deja validee historiquement

## Validation observee au 8 mai 2026

Les validations suivantes ont ete confirmees sur la V5 :

- les 12 noeuds du workflow ont pu etre testes pas a pas
- la reponse IA est bien renvoyee dans Chatwoot
- les labels Chatwoot sont appliques avec les bons noms attendus
- les `custom_attributes` de qualification sont bien pousses
- les attributs `lead_email` et `lead_phone` sont pris en compte
- l'Option B est active :
  - le formulaire pre-chat collecte `fullName` et `email`
  - le workflow redemande l'email seulement s'il manque
  - le bot ne re-demande pas un email deja connu

## Garde-fous de production

- ne pas activer la V5 tant que les 12 noeuds n'ont pas ete testes un par un
- ne pas laisser de mock data / pin sur le webhook avant mise en production
- conserver la V4 active 24 a 48 heures apres bascule V5
- en cas de souci, remettre l'URL webhook Chatwoot de `chatwoot-inbound-v5` vers `chatwoot-inbound-v4`
- ne jamais versionner de vrais secrets dans le repo

## Workflow cible

- Nom cible du workflow : `ACTIVE - TransferAI Chatwoot Auto Reply V5 (Qualification)`
- Path webhook : `chatwoot-inbound-v5`
- URL production :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v5
```

## Architecture cible

Le workflow V5 est compose de 12 noeuds en ligne droite :

1. `Chatwoot Webhook V5`
2. `Filter Chatwoot event`
3. `Fetch conversation history`
4. `Build OpenAI reply payload`
5. `OpenAI Chat Completions (reply)`
6. `Format AI reply`
7. `Send reply to Chatwoot`
8. `Build qualification payload`
9. `OpenAI Qualification JSON`
10. `Parse qualification + Compute labels`
11. `Update Chatwoot custom_attributes`
12. `Apply Chatwoot labels`

## Prerequis Chatwoot

### Labels attendus

Les labels ci-dessous doivent exister dans Chatwoot avec une orthographe strictement identique :

- `formation`
- `audit-ia`
- `veille`
- `automatisation`
- `catalogue`
- `certification`
- `webinar`
- `partenariat`
- `emploi`
- `support`
- `lead-chaud`
- `infos-manquantes`
- `handoff-humain`
- `demo-proposee`

### Custom attributes attendus

Au minimum :

- `company_name`
- `sector`
- `need_type`
- `intent`
- `lead_seriousness`
- `internal_summary`
- `next_best_action`
- `is_b2b`
- `demo_proposed`
- `human_handoff`
- `lead_email`
- `lead_phone`

### Option B retenue pour la collecte de contact

Le projet retient la double strategie suivante :

1. **Pre Chat Form Chatwoot**
   - `Enable pre chat form` : active
   - `Full name` : obligatoire
   - `Email` : obligatoire
   - `Phone number` : optionnel

2. **Workflow V5**
   - le prompt de reponse sait si `sender_email` / `sender_phone` sont deja connus
   - si l'email n'est pas connu, le bot le demande avant de pousser vers une demo / Calendly
   - si l'email est deja connu, il ne le redemande pas
   - l'appel de qualification extrait aussi `email` et `phone`
   - ces informations sont poussees vers `lead_email` et `lead_phone`

## Secrets a configurer

La V5 requiert :

- **4 fois** le token Chatwoot
- **2 fois** la cle OpenAI prefixee par `Bearer `

Les valeurs de headers doivent etre en mode `Fixed`, pas en `Expression`.

## Runbook detaille noeud par noeud

### 1. Chatwoot Webhook V5

Configuration attendue :

- HTTP Method : `POST`
- Path : `chatwoot-inbound-v5`
- Respond : `Immediately`
- Authentication : `None`

Rien a modifier si le noeud est importe depuis le JSON repo.

### 2. Filter Chatwoot event

Type : `Code`

Configuration attendue :

- Mode : `Run Once for All Items`
- Language : `JavaScript`

Le code valide dans l'ordre :

- `event === 'message_created'`
- message entrant (`incoming` ou `0`)
- presence de `conversation.id`
- `content` non vide

La sortie transporte :

- `conversation_id`
- `incoming_text`
- `sender_name`
- `sender_email`
- `sender_phone`
- `fallback_reply`

### 3. Fetch conversation history

Type : `HTTP Request`

Configuration attendue :

- Method : `GET`
- URL :

```text
=https://app.chatwoot.com/api/v1/accounts/163278/conversations/{{$json.conversation_id}}/messages
```

- Authentication : `None`
- Send Headers : `ON`

Headers attendus :

1. `api_access_token`
   - valeur initiale : `REPLACE_WITH_CHATWOOT_API_TOKEN`
   - a remplacer par le vrai token Chatwoot

2. `Content-Type`
   - valeur : `application/json`

Important :

- le champ `URL` doit rester en mode expression / interpolation n8n
- le champ de token reste en `Fixed`

### 4. Build OpenAI reply payload

Type : `Code`

Configuration attendue :

- Mode : `Run Once for All Items`
- Language : `JavaScript`

Responsabilites :

- convertir l'historique Chatwoot en messages OpenAI
- dedupliquer le message courant
- injecter un contexte de contact connu :
  - nom
  - email
  - telephone
- appliquer la regle Option B :
  - ne pas proposer de creneau ni de lien de demo sans email
  - demander l'email si inconnu
  - ne jamais redemander un email deja connu

Parametre important :

- `MAX_HISTORY = 20`

### 5. OpenAI Chat Completions (reply)

Type : `HTTP Request`

Configuration attendue :

- Method : `POST`
- URL : `https://api.openai.com/v1/chat/completions`
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
   - valeur initiale : `Bearer REPLACE_WITH_OPENAI_API_KEY`
   - a remplacer par `Bearer sk-...`

2. `Content-Type`
   - valeur : `application/json`

### 6. Format AI reply

Type : `Code`

Configuration attendue :

- Mode : `Run Once for All Items`
- Language : `JavaScript`

Sortie attendue :

- `reply_text`
- `used_fallback`
- `history_count`
- `raw_history_messages`

Si OpenAI ne renvoie rien, on retombe sur `fallback_reply`.

### 7. Send reply to Chatwoot

Type : `HTTP Request`

Configuration attendue :

- Method : `POST`
- URL :

```text
=https://app.chatwoot.com/api/v1/accounts/163278/conversations/{{$json.conversation_id}}/messages
```

- Authentication : `None`
- Send Headers : `ON`
- Send Body : `ON`
- Body Content Type : `JSON`
- JSON Body :

```text
={{ JSON.stringify({ content: $json.reply_text, message_type: 'outgoing', private: false }) }}
```

Headers attendus :

1. `api_access_token`
   - meme token Chatwoot que le noeud 3

2. `Content-Type`
   - valeur : `application/json`

### 8. Build qualification payload

Type : `Code`

Configuration attendue :

- Mode : `Run Once for All Items`
- Language : `JavaScript`

Responsabilites :

- reprendre l'historique conversationnel
- injecter les metadonnees connues via Chatwoot :
  - `sender_name`
  - `sender_email`
  - `sender_phone`
- demander a OpenAI un **JSON strict**

Champs obligatoires du JSON de qualification :

- `company_name`
- `sector`
- `need_type`
- `intent`
- `lead_seriousness`
- `is_b2b`
- `wants_demo`
- `needs_human_handoff`
- `contact_name`
- `email`
- `phone`
- `summary`
- `next_best_action`
- `missing_fields`

### 9. OpenAI Qualification JSON

Type : `HTTP Request`

Configuration attendue :

- Method : `POST`
- URL : `https://api.openai.com/v1/chat/completions`
- Authentication : `None`
- Send Headers : `ON`
- Send Body : `ON`
- Body Content Type : `JSON`
- JSON Body :

```text
={{ JSON.stringify($json.qualification_payload) }}
```

Headers attendus :

1. `Authorization`
   - meme cle OpenAI que le noeud 5

2. `Content-Type`
   - valeur : `application/json`

### 10. Parse qualification + Compute labels

Type : `Code`

Configuration attendue :

- Mode : `Run Once for All Items`
- Language : `JavaScript`

Responsabilites :

- parser la reponse JSON OpenAI
- fallback sur une qualification par defaut si le JSON est invalide
- recuperer `contact_name` depuis `sender_name` si besoin
- recuperer `email` et `phone` depuis les metadonnees Chatwoot si besoin
- calculer les labels
- construire :
  - `custom_attributes_payload`
  - `labels_payload`

Mappings importants :

- `qualification.email` -> `lead_email`
- `qualification.phone` -> `lead_phone`
- `qualification.wants_demo === true` -> label `demo-proposee`
- `qualification.needs_human_handoff === true` -> label `handoff-humain`
- `qualification.lead_seriousness === eleve` -> label `lead-chaud`

### 11. Update Chatwoot custom_attributes

Type : `HTTP Request`

Configuration attendue :

- Method : `POST`
- URL :

```text
=https://app.chatwoot.com/api/v1/accounts/163278/conversations/{{$json.conversation_id}}/custom_attributes
```

- Authentication : `None`
- Send Headers : `ON`
- Send Body : `ON`
- Body Content Type : `JSON`
- JSON Body :

```text
={{ JSON.stringify($json.custom_attributes_payload) }}
```

Headers attendus :

1. `api_access_token`
   - meme token Chatwoot que les noeuds 3 et 7

2. `Content-Type`
   - valeur : `application/json`

### 12. Apply Chatwoot labels

Type : `HTTP Request`

Configuration attendue :

- Method : `POST`
- URL :

```text
=https://app.chatwoot.com/api/v1/accounts/163278/conversations/{{$('Parse qualification + Compute labels').first().json.conversation_id}}/labels
```

- Authentication : `None`
- Send Headers : `ON`
- Send Body : `ON`
- Body Content Type : `JSON`
- JSON Body :

```text
={{ JSON.stringify($('Parse qualification + Compute labels').first().json.labels_payload) }}
```

Headers attendus :

1. `api_access_token`
   - meme token Chatwoot que les autres noeuds HTTP Chatwoot

2. `Content-Type`
   - valeur : `application/json`

## Test pas a pas avant production

### Mock data

Utiliser le mock Chatwoot de travail deja valide :

- `set mock data` sur le webhook
- puis `Execute step` noeud par noeud

### Sorties attendues

1. `Filter Chatwoot event`
   - item non vide avec `conversation_id`, `incoming_text`, `sender_name`, `sender_email`, `sender_phone`

2. `Fetch conversation history`
   - tableau de messages Chatwoot reel ou mocke

3. `Build OpenAI reply payload`
   - `openai_payload` present

4. `OpenAI Chat Completions (reply)`
   - `choices[0].message.content` present

5. `Format AI reply`
   - `reply_text` present
   - `used_fallback: false` attendu en nominal

6. `Send reply to Chatwoot`
   - message sortant cree dans la conversation

7. `Build qualification payload`
   - `qualification_payload` present

8. `OpenAI Qualification JSON`
   - contenu JSON brut retourné par OpenAI

9. `Parse qualification + Compute labels`
   - `qualification_used_fallback: false`
   - labels attendus selon le cas
   - `custom_attributes_payload` contient `lead_email` et `lead_phone` si connus

10. `Update Chatwoot custom_attributes`
   - mise a jour acceptee par Chatwoot

11. `Apply Chatwoot labels`
   - labels appliques et reconnus

### Verification fonctionnelle dans Chatwoot

Dans la conversation de test, verifier :

1. la reponse IA apparait bien
2. les `custom_attributes` sont renseignes
3. les labels sont visibles
4. si l'email n'est pas connu, le bot le demande avant de pousser vers une demo
5. si l'email est deja connu, le bot ne le redemande pas

## Migration de la V4 vers la V5

Quand les tests sont verts :

1. retirer tout pin / mock data du webhook V5
2. activer le workflow V5
3. dans Chatwoot, changer le webhook de :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v4
```

vers :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v5
```

4. envoyer un vrai message de test
5. observer 24 a 48 heures
6. garder la V4 active en filet de securite tant que la V5 n'a pas prouve sa stabilite

## Rotation des secrets

Si un token Chatwoot ou une cle OpenAI a ete visible en clair dans des captures, tests ou documents intermediaires :

- regenerer le secret
- remplacer la valeur dans tous les noeuds concernes
- retester un message

## Prochaine etape apres V5

Apres stabilisation V5, la suite logique reste :

- **V5.5** : proposition conditionnelle de demo / Calendly
- **V6** : handoff humain automatique
- **V7** : logs et supervision
- **V8+** : multi-canal, RAG et enrichissement produit
