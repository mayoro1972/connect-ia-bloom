# Workflow n8n nœud par nœud à implémenter

## 1. Objectif

Ce document décrit le workflow **n8n** recommandé pour TransferAI Africa afin de :

- recevoir les messages depuis WhatsApp et Chatwoot
- qualifier automatiquement les prospects avec OpenAI
- comprendre les besoins métier
- orienter vers la bonne offre ou la bonne page
- proposer une démo si le lead est sérieux
- créer une note interne exploitable
- envoyer une réponse courte et professionnelle
- pousser les données vers le back-office ou un CRM

Le workflow est pensé pour fonctionner avec :

- **Twilio WhatsApp**
- **Chatwoot**
- **OpenAI**
- **Calendly**
- **Supabase**
- **Resend**

## 2. Cas d'usage prioritaires

- nouveau message WhatsApp entrant
- nouveau message provenant du chat du site via Chatwoot
- réponse à un email entrant
- demande B2B à qualifier
- demande de formation
- demande d'audit IA
- demande d'automatisation
- demande de partenariat
- demande d'emploi ou de mise en relation
- proposition de démo

## 3. Vue d'ensemble de l'architecture

### Canaux d'entrée

- WhatsApp
- Chat du site
- email entrant

### Moteur IA

- OpenAI pour :
  - qualification
  - scoring
  - routage
  - rédaction de réponse
  - résumé CRM
  - note interne

### Orchestration

- n8n comme contrôleur principal

### Sorties possibles

- réponse WhatsApp
- réponse Chatwoot
- réponse email
- proposition de démo via Calendly
- handoff humain
- mise à jour base / CRM / back-office

## 4. Variables normalisées recommandées

Le workflow doit standardiser ces champs très tôt :

- `channel`
- `contact_name`
- `company_name`
- `sector`
- `need_type`
- `intent`
- `lead_seriousness`
- `message_text`
- `conversation_history`
- `phone`
- `email`
- `should_offer_demo`
- `needs_human_handoff`
- `recommended_route`
- `calendly_link`
- `summary`
- `internal_note`

## 5. Workflow principal WhatsApp

### Nœud 1 : Trigger webhook Twilio WhatsApp

**Type n8n**
- `Webhook`

**Rôle**
- recevoir le message entrant de Twilio

**Entrées attendues**
- `Body`
- `From`
- `To`
- `ProfileName`
- `MessageSid`
- `WaId`
- `NumMedia`

**Sortie voulue**
- payload brut Twilio

### Nœud 2 : Normalisation du message entrant

**Type n8n**
- `Function` ou `Code`

**Rôle**
- transformer le payload Twilio en structure interne propre

**À produire**

```json
{
  "channel": "whatsapp",
  "contact_name": "Marius Ayoro",
  "phone": "whatsapp:+447595715838",
  "message_text": "Bonjour TransferAI...",
  "message_sid": "SMxxxx",
  "conversation_history": "",
  "calendly_link": "https://calendly.com/..."
}
```

### Nœud 3 : Récupération de l'historique conversationnel

**Type n8n**
- `Supabase`

**Rôle**
- récupérer les derniers messages liés au même numéro

**Table suggérée**
- `whatsapp_inbound_messages`

**Filtre**
- `from_number = phone`

**But**
- éviter de reposer les mêmes questions
- enrichir le contexte OpenAI

### Nœud 4 : Construction du contexte IA

**Type n8n**
- `Set`

**Rôle**
- préparer les variables à injecter dans OpenAI

**Contenu**
- message courant
- historique compact
- base de connaissance utile
- lien Calendly
- routes principales du site

### Nœud 5 : Qualification JSON via OpenAI

**Type n8n**
- `OpenAI Chat`

**Prompt**
- utiliser le prompt de qualification JSON du pack `11_Prompt_Pack_n8n_Chatwoot.md`

**Rôle**
- extraire :
  - entreprise
  - secteur
  - besoin
  - intention
  - niveau de sérieux
  - informations manquantes

**Sortie attendue**

```json
{
  "company_name": "ABC SARL",
  "sector": "logistique",
  "need_type": "automatisation",
  "intent": "automatisation",
  "lead_seriousness": "élevé",
  "is_b2b": true,
  "wants_demo": true,
  "needs_human_handoff": false,
  "missing_fields": []
}
```

### Nœud 6 : Validation JSON / fallback

**Type n8n**
- `IF` ou `Code`

**Rôle**
- vérifier que le JSON OpenAI est exploitable
- fallback si réponse mal formée

**Action si erreur**
- utiliser une réponse de reprise courte
- marquer la conversation à revoir

### Nœud 7 : Scoring du lead

**Type n8n**
- `OpenAI Chat`

**Prompt**
- prompt de scoring lead

**Rôle**
- calculer :
  - score
  - niveau de qualification
  - proposition de démo ou non
  - route recommandée

### Nœud 8 : Routage du service

**Type n8n**
- `OpenAI Chat`

**Prompt**
- prompt de routage par service

**Rôle**
- choisir la meilleure orientation :
  - formation
  - audit IA
  - automatisation
  - contenus
  - partenariat
  - emploi

### Nœud 9 : Génération du résumé CRM

**Type n8n**
- `OpenAI Chat`

**Prompt**
- prompt de résumé CRM

**Rôle**
- générer un résumé court et structuré pour exploitation commerciale

### Nœud 10 : Génération de la note interne

**Type n8n**
- `OpenAI Chat`

**Prompt**
- prompt de note interne BackOffice

**Rôle**
- fournir une note simple de suivi équipe

### Nœud 11 : Décision métier principale

**Type n8n**
- `Switch`

**Rôle**
- orienter le flux selon :
  - besoin incomplet
  - lead qualifié
  - lead très qualifié
  - handoff humain

**Branches recommandées**
- `missing_fields`
- `offer_demo`
- `answer_faq_or_route`
- `human_handoff`

### Nœud 12A : Réponse de qualification incomplète

**Type n8n**
- `OpenAI Chat`

**Prompt**
- prompt de relance si informations manquantes

**Rôle**
- demander uniquement les éléments manquants

### Nœud 12B : Réponse avec proposition de démo

**Type n8n**
- `OpenAI Chat`

**Prompt**
- prompt de proposition de démo

**Rôle**
- proposer Calendly au prospect qualifié

### Nœud 12C : Réponse simple orientée site

**Type n8n**
- `OpenAI Chat`

**Prompt**
- prompt FAQ / assistant site

**Rôle**
- répondre à la question
- orienter vers la bonne page
- reprendre la qualification si nécessaire

### Nœud 12D : Déclenchement handoff humain

**Type n8n**
- `Set` + `Supabase` ou `CRM`

**Rôle**
- marquer la conversation comme à traiter humainement
- notifier l'équipe si nécessaire

## 6. Persistance des données

### Nœud 13 : Upsert prospect / conversation

**Type n8n**
- `Supabase`

**But**
- enregistrer ou mettre à jour le prospect qualifié

**Champs conseillés**
- `contact_name`
- `company_name`
- `sector`
- `need_type`
- `intent`
- `lead_seriousness`
- `summary`
- `recommended_route`
- `should_offer_demo`
- `internal_note`

### Nœud 14 : Log d'automatisation

**Type n8n**
- `Supabase`

**But**
- tracer :
  - timestamp
  - canal
  - décision prise
  - prompt utilisé
  - réponse envoyée

## 7. Réponse sortante

### Nœud 15 : Envoi de la réponse WhatsApp

**Type n8n**
- `HTTP Request` vers Twilio
ou
- nœud Twilio

**Rôle**
- renvoyer la réponse finale au prospect

### Nœud 16 : Notification interne facultative

**Type n8n**
- `Resend`

**Rôle**
- notifier l'équipe si :
  - lead fort
  - demande partenariat
  - demande stratégique
  - handoff humain

## 8. Workflow Chatwoot

### Nœud 1 : Trigger Chatwoot

**Type n8n**
- `Webhook`

**Rôle**
- recevoir un nouvel événement conversation Chatwoot

### Nœud 2 : Normalisation

**Rôle**
- convertir le payload Chatwoot en format standard

### Nœud 3 : Historique conversation

**Rôle**
- récupérer le contexte existant du contact

### Nœud 4 : Prompt système maître

**Rôle**
- produire une réponse visible courte et utile

### Nœud 5 : Qualification JSON

**Rôle**
- enrichir les attributs du contact

### Nœud 6 : Mise à jour attributs Chatwoot

**Attributs recommandés**
- `company_name`
- `sector`
- `need_type`
- `intent`
- `lead_score`
- `lead_seriousness`
- `demo_proposed`
- `human_handoff`

### Nœud 7 : Réponse Chatwoot

**Rôle**
- publier la réponse dans la conversation

### Nœud 8 : Escalade humaine

**Rôle**
- assigner la conversation à un agent si besoin

## 9. Workflow email entrant

### Nœud 1 : Trigger email inbound

**Rôle**
- recevoir l'email entrant

### Nœud 2 : Nettoyage du contenu

**Rôle**
- enlever signatures, bruit, historique excessif

### Nœud 3 : Qualification JSON

**Rôle**
- identifier entreprise, secteur, besoin, sérieux

### Nœud 4 : Réponse email

**Prompt**
- prompt de réponse email

### Nœud 5 : Proposition de démo si lead fort

**Rôle**
- insérer Calendly si opportun

### Nœud 6 : Enregistrement CRM / base

**Rôle**
- persister le résumé et les informations utiles

## 10. Conditions métiers recommandées

### Démo à proposer si

- entreprise identifiée
- secteur identifié
- besoin concret
- orientation B2B
- demande d'accompagnement, audit ou automatisation

### Handoff humain si

- partenariat important
- besoin institutionnel
- sujet stratégique
- insatisfaction
- demande complexe
- demande tarifaire sensible

### Réponse simple sans démo si

- demande informative
- besoin encore flou
- personne en phase découverte

## 11. Réponses types à injecter

### Qualification initiale

```text
Bonjour et merci pour votre message.

Pour bien vous orienter, pouvez-vous me préciser :
1. le nom de votre entreprise,
2. votre secteur d’activité,
3. votre besoin principal : formation, veille ou automatisation ?

Si votre besoin est déjà bien cadré, nous pourrons ensuite vous proposer une démo.
```

### Proposition de démo

```text
Merci pour ces précisions.

Votre besoin semble bien correspondre à un échange de démonstration avec notre équipe.
Vous pouvez réserver un créneau ici :
{{ $json.calendly_link }}

Nous pourrons y cadrer votre besoin et les options adaptées.
```

### Relance courte si information manquante

```text
Merci. Pour vous orienter au mieux, il me manque encore :
- le nom de votre entreprise
- votre secteur
- votre besoin principal : formation, veille ou automatisation
```

## 12. Ordre d'implémentation recommandé

Pour avancer vite et proprement :

### Phase 1

- WhatsApp inbound
- qualification JSON
- scoring
- réponse simple

### Phase 2

- proposition de démo
- résumé CRM
- note interne
- notification équipe

### Phase 3

- Chatwoot
- email entrant
- handoff humain avancé
- analytics de conversion

## 13. Livrables techniques minimum

Pour la première version exploitable :

- 1 workflow WhatsApp principal
- 1 workflow Chatwoot
- 1 workflow email entrant
- 1 table ou CRM de prospects
- 1 variable centrale `calendly_link`
- 1 pack de prompts validé

## 14. Recommandation finale

La meilleure voie pour TransferAI est :

- **Chatwoot** pour la couche conversationnelle
- **n8n** pour l'orchestration
- **OpenAI** pour la qualification et le scoring
- **Calendly** pour la conversion
- **Supabase** pour la mémoire opérationnelle

Ce workflow est volontairement conçu pour être :

- lisible
- modulaire
- pilotable
- simple à faire évoluer
