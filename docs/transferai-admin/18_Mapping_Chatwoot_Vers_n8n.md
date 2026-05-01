# Mapping exact Chatwoot vers n8n champ par champ

## 1. Objectif

Ce document décrit le mapping recommandé entre :

- les données entrantes **Chatwoot**
- les objets de travail **n8n**
- les enrichissements produits par **OpenAI**
- les mises à jour renvoyées vers **Chatwoot**

Le but est de permettre une implémentation propre, cohérente et reproductible.

## 2. Principe général

Le flux recommandé est :

1. Chatwoot reçoit une conversation
2. Chatwoot déclenche un webhook vers n8n
3. n8n normalise les données
4. n8n appelle OpenAI
5. n8n décide :
   - qualification
   - tags
   - handoff
   - démo
   - réponse
6. n8n renvoie les enrichissements vers Chatwoot

## 3. Champs entrants Chatwoot vers n8n

| Source Chatwoot | Champ n8n cible | Usage |
|---|---|---|
| `event` | `chatwoot_event` | identifier l'événement reçu |
| `conversation.id` | `conversation_id` | identifiant conversation |
| `message_type` | `message_type` | distinguer entrant / sortant |
| `content` | `message_text` | texte utilisateur à qualifier |
| `created_at` | `message_created_at` | horodatage |
| `conversation.contact_inbox.source_id` | `source_id` | identifiant source conversation |
| `conversation.status` | `conversation_status` | statut conversation |
| `conversation.assignee_id` | `assignee_id` | agent humain assigné |
| `contact.id` | `contact_id` | identifiant contact |
| `contact.name` | `contact_name` | nom contact |
| `contact.email` | `email` | email si disponible |
| `contact.phone_number` | `phone` | téléphone si disponible |
| `contact.identifier` | `external_identifier` | identifiant externe éventuel |
| `contact.custom_attributes.company_name` | `company_name` | entreprise déjà connue |
| `contact.custom_attributes.sector` | `sector` | secteur déjà connu |
| `conversation.custom_attributes.need_type` | `need_type` | besoin déjà connu |
| `conversation.custom_attributes.intent` | `intent` | intention déjà connue |
| `conversation.custom_attributes.lead_score` | `lead_score` | score existant |
| `conversation.custom_attributes.lead_seriousness` | `lead_seriousness` | sérieux existant |
| `conversation.custom_attributes.demo_proposed` | `demo_proposed` | éviter une double proposition |
| `conversation.custom_attributes.human_handoff` | `human_handoff` | éviter double escalade |
| `meta.sender.name` | `sender_name` | fallback nom |
| `inbox.name` | `inbox_name` | contexte inbox |

## 4. Objet normalisé recommandé dans n8n

Après normalisation, viser cette structure :

```json
{
  "channel": "chatwoot",
  "chatwoot_event": "",
  "conversation_id": "",
  "contact_id": "",
  "contact_name": "",
  "email": "",
  "phone": "",
  "message_text": "",
  "company_name": "",
  "sector": "",
  "need_type": "",
  "intent": "",
  "lead_score": null,
  "lead_seriousness": null,
  "demo_proposed": false,
  "human_handoff": false,
  "conversation_status": "",
  "assignee_id": null,
  "calendly_link": ""
}
```

## 5. Champs sortants n8n vers Chatwoot

| Résultat n8n | Destination Chatwoot | Action |
|---|---|---|
| `reply_text` | nouveau message conversation | réponse visible au prospect |
| `company_name` | `contact.custom_attributes.company_name` | mise à jour contact |
| `sector` | `contact.custom_attributes.sector` | mise à jour contact |
| `need_type` | `conversation.custom_attributes.need_type` | mise à jour conversation |
| `intent` | `conversation.custom_attributes.intent` | mise à jour conversation |
| `lead_score` | `conversation.custom_attributes.lead_score` | mise à jour conversation |
| `lead_seriousness` | `conversation.custom_attributes.lead_seriousness` | mise à jour conversation |
| `recommended_route` | `conversation.custom_attributes.recommended_route` | mise à jour conversation |
| `demo_proposed` | `conversation.custom_attributes.demo_proposed` | booléen |
| `human_handoff` | `conversation.custom_attributes.human_handoff` | booléen |
| `qualification_status` | `conversation.custom_attributes.qualification_status` | statut métier |
| `internal_summary` | `conversation.custom_attributes.internal_summary` | résumé interne |
| `next_best_action` | `conversation.custom_attributes.next_best_action` | prochaine action |
| `tags[]` | tags de conversation | classement conversation |
| `internal_note` | note privée conversation | usage équipe |
| `assign_to_human` | assignation conversation | handoff |
| `conversation_status` | statut conversation | open / pending / resolved |

## 6. Tags recommandés à pousser depuis n8n

| Condition | Tags à poser |
|---|---|
| `intent = formation` | `formation` |
| `intent = audit_ia` | `audit-ia` |
| `intent = automatisation` | `automatisation` |
| `intent = partenariat` | `partenariat` |
| `intent = emploi` | `emploi` |
| `lead_seriousness = élevé` | `lead-chaud` |
| `missing_fields` non vide | `infos-manquantes` |
| `should_offer_demo = true` | `demo-proposee` |
| `human_handoff = true` | `handoff-humain` |

## 7. Statuts conversation recommandés

| Cas | Statut Chatwoot recommandé |
|---|---|
| conversation en qualification | `open` |
| attente d'infos prospect | `pending` |
| handoff humain | `open` ou `pending` |
| demande traitée | `resolved` |

## 8. Ordre d'écriture recommandé

Quand n8n reçoit un message Chatwoot :

1. lire conversation
2. normaliser
3. qualifier avec OpenAI
4. scorer
5. décider `demo`, `handoff` ou `standard`
6. mettre à jour les attributs
7. poser les tags
8. ajouter la note privée
9. envoyer la réponse visible
10. assigner à un humain si nécessaire

## 9. Champs minimums à gérer pour une V1

### Contact

- `contact_name`
- `email`
- `phone`
- `company_name`
- `sector`

### Conversation

- `need_type`
- `intent`
- `lead_score`
- `lead_seriousness`
- `demo_proposed`
- `human_handoff`
- `qualification_status`
- `internal_summary`

## 10. Recommandation d'implémentation

La meilleure approche pour commencer est :

- Personne A remplit les règles métier et les réponses
- Personne B implémente ce mapping dans n8n
- les deux testent ensemble 3 scénarios :
  - prospect vague
  - prospect formation
  - prospect B2B sérieux demandant une démo

Ce mapping doit rester le socle de cohérence entre Chatwoot et n8n.
