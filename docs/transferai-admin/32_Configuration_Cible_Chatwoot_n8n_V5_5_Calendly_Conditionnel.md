# 32. Configuration Cible Chatwoot n8n V5.5 Calendly Conditionnel

Statut : workflow V5.5 prepare pour import repo, sur la base de la V5 qualification validee. La V5 reste la reference active a conserver comme rollback tant que la V5.5 n'a pas ete observee en production sur 24 a 48 heures.

## Objectif

La V5.5 ajoute une couche de conversion demo plus stricte sur la V5 :

- conserver la reponse IA contextualisee
- conserver la memoire conversationnelle
- conserver la qualification structuree et les labels
- proposer un lien de demo / Calendly seulement si le lead est suffisamment mature
- ne jamais pousser un lien de rendez-vous si l'email de suivi n'est pas connu

Le but n'est pas de changer l'architecture V5, mais de durcir la logique commerciale pour eviter les propositions de demo prematurees.

## Principe de fonctionnement

La V5.5 garde la meme architecture generale que la V5 :

1. `Chatwoot Webhook V5.5`
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

La difference principale se situe dans le noeud `Build OpenAI reply payload` :

- il connait le lien Calendly
- il sait si l'email du prospect est deja connu
- il ne propose le lien que dans les cas pertinents

## Workflow cible

- Nom cible du workflow : `ACTIVE - TransferAI Chatwoot Auto Reply V5.5 (Calendly conditionnel)`
- Path webhook : `chatwoot-inbound-v5-5`
- URL production :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v5-5
```

## Regles metier V5.5

La proposition de demo / Calendly doit respecter simultanement les regles suivantes :

1. le prospect a un besoin concret ou a explicitement demande une demo
2. l'email de suivi est connu
3. le ton reste optionnel et non agressif
4. le bot ne remplace pas les etapes de qualification encore manquantes si le lead est trop incomplet

En pratique :

- si `sender_email` est vide, le bot demande l'email avant toute proposition de creneau
- si `sender_email` est connu et que le besoin est suffisamment serieux, le bot peut proposer une demo
- le lien doit etre injecte via une constante de workflow, jamais en dur dans une reponse libre non controlee

## Prerequis

La V5.5 suppose deja en place :

- `Pre Chat Form` actif dans Chatwoot
- `lead_email` et `lead_phone` disponibles comme `custom_attributes`
- labels V5 deja crees
- V5 stable et observee

## Secret / variable supplementaire

En plus des secrets V5, la V5.5 requiert une valeur fonctionnelle :

- `REPLACE_WITH_CALENDLY_URL`

Exemple attendu :

```text
https://calendly.com/transferai/demo
```

Cette valeur est stockee directement dans le noeud `Build OpenAI reply payload` tant qu'aucun mecanisme de secret dedie n'est introduit pour les liens de campagne.

## Difference technique par rapport a la V5

La V5.5 n'ajoute pas de nouveau noeud.

Elle modifie uniquement :

- le `path` du webhook
- le nom du workflow
- le `systemPrompt` du noeud `Build OpenAI reply payload`
- la constante `CALENDLY_URL`
- la temperature de reponse si necessaire pour garder un ton plus cadré

## Regles de prompt a respecter

Le prompt de reponse doit faire respecter ces contraintes :

- ne jamais proposer Calendly sans email connu
- ne jamais redemander un email deja connu
- proposer le lien seulement si la demande est serieuse ou explicite
- presenter la demo comme une option
- continuer a qualifier si le lead est incomplet

## Test cible avant production

Tester au minimum 3 cas :

### Cas 1. Lead incomplet sans email

Message :

```text
Bonjour, je dirige une PME et je veux automatiser certains process.
```

Attendu :

- le bot demande l'email ou une information manquante
- aucun lien Calendly n'est propose

### Cas 2. Lead complet sans demande de demo

Message :

```text
Bonjour, je dirige TransLog SA dans la logistique. Nous voulons automatiser le suivi de flotte.
```

Attendu :

- le bot qualifie et oriente
- il ne pousse pas forcement le lien si la maturite n'est pas encore assez claire

### Cas 3. Lead chaud avec demande explicite de demo

Message :

```text
Bonjour, je m'appelle Marius. Je dirige TransLog SA, une PME ivoirienne dans la logistique avec 30 employes. Nous voulons automatiser le suivi de flotte et nous voulons une demo cette semaine.
```

Attendu :

- reponse contextualisee
- lien Calendly present si email connu
- labels comme `automatisation`, `lead-chaud`, `demo-proposee` selon la qualification

## Migration de la V5 vers la V5.5

Quand les tests sont verts :

1. retirer tout pin / mock data du webhook V5.5
2. activer le workflow V5.5
3. dans Chatwoot, changer le webhook de :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v5
```

vers :

```text
https://n8n-pxlk.srv1480638.hstgr.cloud/webhook/chatwoot-inbound-v5-5
```

4. tester sur une conversation reelle
5. garder la V5 active comme rollback pendant 24 a 48 heures

## Rollback

En cas de souci :

- remettre le webhook Chatwoot sur `chatwoot-inbound-v5`
- laisser la V5.5 inactive le temps de corriger

## Suite apres V5.5

Apres stabilisation V5.5, la suite logique reste :

- **V6** : handoff humain conditionnel
- **V7** : logs et supervision
- **V8+** : multi-canal, RAG et enrichissement produit
