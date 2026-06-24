# Blueprint n8n Controller Workflow - Prospection Packs

Date : 11 juin 2026

## 1. Objet

Ce document decrit le `workflow controller n8n` a construire pour piloter le module `Prospection Packs` depuis le futur back-office.

Ce controller a pour role de :

- recevoir les actions du back-office
- verifier l'authentification admin
- valider les payloads
- router chaque action vers la bonne branche
- reutiliser le `Workflow V3 principal`
- centraliser les retours JSON propres au frontend

Ce workflow controller ne remplace pas le `Workflow V3 principal`.  
Il sert de `couche d'orchestration admin`.

---

## 2. Position du controller dans l'architecture

```text
BackOffice React
  -> appelle Webhook Controller n8n

Controller Workflow n8n
  -> verifie token
  -> valide payload
  -> route par action
  -> appelle V3 ou une branche d'action directe

Workflow V3 principal
  -> genere pack
  -> stocke pack
  -> prepare validation
  -> envoie si demande

Supabase
  -> stocke prospects, packs, envois, statuts
```

---

## 3. Approche recommandee

Je recommande `1 workflow controller principal` avec :

- `1 webhook d'entree unique`
- `1 branche de routing`
- `5 branches metier principales`
- `2 branches utilitaires`

Cela donne une architecture plus simple a maintenir qu'un workflow par bouton.

### Nom recommande du workflow

- `TransferAI_Admin_Prospection_Controller_V1`

### Webhook principal recommande

- `POST /webhook/admin-prospect-pack-action`

---

## 4. Actions supportees par le controller

Le controller doit supporter ces actions :

- `generate_pack`
- `regenerate_pack`
- `approve_pack`
- `reject_pack`
- `send_pack`
- `test_provider`
- `list_providers`
- `health_check`

---

## 5. Structure du webhook d'entree

## 5.1 Methode

- `POST`

## 5.2 Payload entrant standard

```json
{
  "action": "generate_pack",
  "payload": {
    "prospect_id": "fipme-001",
    "triggered_by": "marius@transferai.ci",
    "source": "backoffice",
    "force": false
  }
}
```

## 5.3 Headers obligatoires

- `Content-Type: application/json`
- `Authorization: Bearer <ADMIN_TOKEN>`

Headers recommandes :

- `X-Request-Id`
- `X-Actor-Email`
- `Idempotency-Key`

---

## 6. Workflow global a creer

## 6.1 Nœuds principaux du controller

Ordre logique recommande :

1. `Admin Controller Webhook`
2. `Normalize Request`
3. `Validate Auth Header`
4. `If Auth Valid`
5. `Validate Action`
6. `Switch Action`
7. branche `generate_pack`
8. branche `regenerate_pack`
9. branche `approve_pack`
10. branche `reject_pack`
11. branche `send_pack`
12. branche `test_provider`
13. branche `list_providers`
14. branche `health_check`
15. `Respond Success`
16. `Respond Error`

---

## 7. Detail des nœuds du tronc commun

## 7.1 `Admin Controller Webhook`

Type :

- `Webhook`

Configuration :

- methode : `POST`
- path : `admin-prospect-pack-action`
- response mode : `using Respond to Webhook node`

Role :

- recevoir toutes les actions du back-office

---

## 7.2 `Normalize Request`

Type :

- `Code`

Role :

- normaliser le corps et les headers
- produire une structure unique

Sortie attendue :

```json
{
  "action": "generate_pack",
  "payload": { "...": "..." },
  "authorization": "Bearer ...",
  "request_id": "req_xxx",
  "actor_email": "marius@transferai.ci",
  "idempotency_key": "idem_xxx",
  "received_at": "2026-06-11T10:00:00.000Z"
}
```

Champs a produire :

- `action`
- `payload`
- `authorization`
- `request_id`
- `actor_email`
- `idempotency_key`
- `received_at`

---

## 7.3 `Validate Auth Header`

Type :

- `Code`

Role :

- verifier la presence du header `Authorization`
- comparer le token recu a une variable n8n

Variables attendues :

- `ADMIN_BACKOFFICE_TOKEN`

Sortie attendue :

```json
{
  "auth_ok": true,
  "action": "generate_pack",
  "payload": { "...": "..." }
}
```

---

## 7.4 `If Auth Valid`

Type :

- `If`

Condition :

- `auth_ok = true`

Branches :

- `true` -> suite normale
- `false` -> `Build Unauthorized Response`

---

## 7.5 `Build Unauthorized Response`

Type :

- `Set` ou `Code`

Sortie :

```json
{
  "ok": false,
  "action": "unknown",
  "status": "unauthorized",
  "message": "Token admin invalide.",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

Puis :

- `Respond Error`

---

## 7.6 `Validate Action`

Type :

- `Code`

Role :

- verifier que `action` appartient a la liste supportee

Liste supportee :

- `generate_pack`
- `regenerate_pack`
- `approve_pack`
- `reject_pack`
- `send_pack`
- `test_provider`
- `list_providers`
- `health_check`

Sortie :

- `action_valid = true|false`

---

## 7.7 `Switch Action`

Type :

- `Switch`

Valeur :

- `{{$json.action}}`

Routes :

- `generate_pack`
- `regenerate_pack`
- `approve_pack`
- `reject_pack`
- `send_pack`
- `test_provider`
- `list_providers`
- `health_check`
- `default -> unsupported_action`

---

## 8. Branche `generate_pack`

## 8.1 Objectif

Lancer la generation d'un nouveau pack depuis un `prospect_id`.

## 8.2 Nœuds exacts recommandes

1. `Validate Generate Payload`
2. `Get Prospect Target`
3. `If Prospect Exists`
4. `If Prospect Sendable`
5. `Call Workflow V3 Generate`
6. `Build Generate Response`
7. `Respond Success`

## 8.3 Detail des nœuds

### `Validate Generate Payload`

Verifier :

- `payload.prospect_id`
- `payload.triggered_by`
- `payload.source`

### `Get Prospect Target`

Type :

- `HTTP Request`

Role :

- lire `prospect_targets` via Supabase REST

Filtre :

- `prospect_id = payload.prospect_id`

### `If Prospect Exists`

Verifier :

- au moins 1 ligne trouvee

Sinon :

- `Build Prospect Not Found Response`

### `If Prospect Sendable`

Verifier :

- `do_not_contact = false`
- `paused = false` ou compatible avec `force`

### `Call Workflow V3 Generate`

Type :

- `Execute Workflow`

Workflow cible :

- `TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed`

Mode :

- appeler le `Execute Workflow Trigger` du V3

Payload transmis :

- tous les champs utiles du prospect
- `triggered_by`
- `source = backoffice`

### `Build Generate Response`

Retour recommande :

```json
{
  "ok": true,
  "action": "generate_pack",
  "status": "accepted",
  "message": "Generation du pack lancee.",
  "data": {
    "prospect_id": "fipme-001",
    "workflow_key": "prospecting-v3-pack-engine",
    "poll_after_ms": 2500
  }
}
```

---

## 9. Branche `regenerate_pack`

## 9.1 Objectif

Relancer V3 pour reconstruire un pack a partir du prospect source.

## 9.2 Nœuds exacts recommandes

1. `Validate Regenerate Payload`
2. `Get Existing Pack`
3. `If Pack Exists`
4. `If Regeneration Allowed`
5. `Resolve Prospect From Pack`
6. `Call Workflow V3 Regenerate`
7. `Build Regenerate Response`
8. `Respond Success`

## 9.3 Regles

Verifier :

- `payload.pack_id`
- `payload.triggered_by`
- `payload.reason`

Refuser si :

- `status = sent` et `force != true`

Appeler V3 avec :

- `prospect_id`
- contexte prospect relu depuis l'ancien pack ou depuis `prospect_targets`

---

## 10. Branche `approve_pack`

## 10.1 Objectif

Approuver un pack, soit sans envoi, soit avec envoi immediat.

## 10.2 Nœuds exacts recommandes

1. `Validate Approve Payload`
2. `Get Pack For Approval`
3. `If Pack Exists`
4. `Extract Approval Mode`
5. `If Mode Approve Only`
6. branche `approve_only`
7. branche `approve_and_send`

## 10.3 Branche `approve_only`

Nœuds :

1. `Mark Pack Approved Direct`
2. `Build Approve Only Response`
3. `Respond Success`

Mise a jour a faire :

- `ai_prospecting_packs.status = approved`
- `approved_at = now()`
- `reviewer_email = payload.reviewer_email`

## 10.4 Branche `approve_and_send`

Nœuds :

1. `Load Pack Payload For Send`
2. `Build Send Context`
3. `If Ready To Send`
4. `Route Provider`
5. `Send Via Provider`
6. `Parse Provider Send Result`
7. `Mark Pack Sent`
8. `Log Outreach Attempt`
9. `Update Prospect Target Sent`
10. `Build Approve Send Response`
11. `Respond Success`

En cas d'echec :

1. `Mark Pack Approval Error`
2. `Update Prospect Target Approval Error`
3. `Build Approval Error Response`
4. `Respond Error`

## 10.5 Reutilisation V3

Cette branche doit reutiliser la logique existante de V3 :

- `Get Pack From Supabase`
- `Extract Pack Payload`
- `Build Send Context`
- `If Ready To Send`
- `Mark Pack Approved`
- `Send External Prospect Email`
- `Parse Send Result`
- `Mark Pack Sent`
- `Log Outreach Attempt`
- `Update Prospect Target Sent`

---

## 11. Branche `reject_pack`

## 11.1 Objectif

Rejeter un pack et remettre le prospect en etat de correction.

## 11.2 Nœuds exacts recommandes

1. `Validate Reject Payload`
2. `Get Pack For Reject`
3. `If Pack Rejectable`
4. `Mark Pack Rejected`
5. `Update Prospect Target Rejected`
6. `Build Reject Response`
7. `Respond Success`

## 11.3 Regles

Verifier :

- `payload.pack_id`
- `payload.reviewer_email`
- `payload.reason`

Refuser si :

- pack deja `sent`

Mises a jour attendues :

### `ai_prospecting_packs`

- `status = rejected`
- `rejected_at = now()`
- `reviewer_email`
- `error_reason = reason`

### `prospect_targets`

- `status = ready`
- `last_sequence_result = rejected_internal_v3`
- `stop_reason = internal_review_rejected`
- `niche_status = needs_manual_revision`

---

## 12. Branche `send_pack`

## 12.1 Objectif

Envoyer un pack deja approuve ou retenter un envoi.

## 12.2 Nœuds exacts recommandes

1. `Validate Send Payload`
2. `Get Pack For Send`
3. `If Pack Exists`
4. `Build Send Context`
5. `If Ready To Send`
6. `Route Provider`
7. `Send Via Provider`
8. `Parse Provider Send Result`
9. `Mark Pack Sent`
10. `Log Outreach Attempt`
11. `Update Prospect Target Sent`
12. `Build Send Response`
13. `Respond Success`

En cas d'erreur :

1. `Mark Pack Approval Error`
2. `Update Prospect Target Approval Error`
3. `Build Send Error Response`
4. `Respond Error`

## 12.3 Regles

Verifier :

- `payload.pack_id`
- `payload.reviewer_email`
- `payload.provider_key`

Controles obligatoires :

- `target_email` present
- `executive_letter` present
- `attachments_count >= 2`
- `has_pdf = true`
- `has_pptx = true`
- `can_send = true`

---

## 13. Branche `test_provider`

## 13.1 Objectif

Verifier qu'un connecteur email fonctionne.

## 13.2 Nœuds exacts recommandes

1. `Validate Test Provider Payload`
2. `Get Provider Config`
3. `If Provider Active`
4. `Build Provider Test Message`
5. `Route Provider`
6. `Send Test Via Provider`
7. `Build Provider Test Response`
8. `Respond Success`

En cas d'erreur :

1. `Build Provider Test Error Response`
2. `Respond Error`

---

## 14. Branche `list_providers`

## 14.1 Objectif

Retourner les connecteurs email visibles par l'admin.

## 14.2 Nœuds exacts recommandes

1. `Get Provider Config List`
2. `Normalize Provider List`
3. `Build Provider List Response`
4. `Respond Success`

## 14.3 Sortie attendue

Liste minimale :

- `provider_key`
- `provider_type`
- `transport_mode`
- `from_email`
- `sender_name`
- `is_active`
- `supports_attachments`
- `daily_send_limit`

---

## 15. Branche `health_check`

## 15.1 Objectif

Donner au back-office un etat de sante simple.

## 15.2 Nœuds exacts recommandes

1. `Check Supabase Access`
2. `Check Provider Count`
3. `Check Controller Config`
4. `Build Health Response`
5. `Respond Success`

## 15.3 Sortie attendue

```json
{
  "ok": true,
  "action": "health_check",
  "status": "healthy",
  "message": "Backend prospection operationnel.",
  "data": {
    "supabase": "ok",
    "n8n": "ok",
    "providers_active": 2
  }
}
```

---

## 16. Bloc `Route Provider`

## 16.1 Objectif

Selectionner la branche d'envoi en fonction de `provider_key` ou `provider_type`.

## 16.2 Nœuds exacts recommandes

1. `Get Provider Config`
2. `If Provider Exists`
3. `Switch Provider Type`

Routes :

- `zoho`
- `gmail`
- `outlook`
- `custom`

---

## 17. Sous-branches fournisseur exactes

## 17.1 Branche `zoho`

Nœuds :

1. `Build Zoho Payload`
2. `Send Zoho Email`
3. `Parse Zoho Response`

## 17.2 Branche `gmail`

Nœuds :

1. `Build Gmail Payload`
2. `Send Gmail Email`
3. `Parse Gmail Response`

## 17.3 Branche `outlook`

Nœuds :

1. `Build Outlook Payload`
2. `Send Outlook Email`
3. `Parse Outlook Response`

## 17.4 Branche `custom`

Nœuds :

1. `Build Custom Provider Payload`
2. `Send Custom Provider Email`
3. `Parse Custom Provider Response`

### Regle de conception

Toutes ces branches doivent recevoir le meme objet d'entree :

```json
{
  "provider_key": "zoho-primary",
  "target_email": "prospect@example.com",
  "subject": "...",
  "html": "...",
  "attachments": []
}
```

Ainsi :

- le tronc commun reste identique
- seul l'adapter change

---

## 18. Bloc `Build Send Context`

## 18.1 Objectif

Preparer un objet unique avant envoi.

## 18.2 Sortie attendue

```json
{
  "pack_id": "pack-abc123",
  "prospect_id": "fipme-001",
  "organization_name": "FIPME",
  "target_email": "contact@example.com",
  "audit_form_url": "https://www.transferai.ci/questionnaire-audit?pack_id=pack-abc123",
  "attachments": [
    {
      "filename": "Mini_Catalogue_TransferAI_FIPME.pdf",
      "path": "https://..."
    },
    {
      "filename": "Deck_TransferAI_FIPME.pptx",
      "path": "https://..."
    }
  ],
  "attachments_count": 2,
  "has_pdf": true,
  "has_pptx": true,
  "can_send": true,
  "send_failure_reason": null,
  "external_email_html": "<p>...</p>"
}
```

## 18.3 Source

Reutiliser le plus possible le `Build Send Context` deja present dans V3.

---

## 19. Reponses JSON exactes a renvoyer

## 19.1 `Respond Success`

Type :

- `Respond to Webhook`

Status code recommande :

- `200` ou `202` selon le cas

Format :

```json
{
  "ok": true,
  "action": "send_pack",
  "status": "sent",
  "message": "Email prospect envoye.",
  "data": {
    "pack_id": "pack-abc123",
    "provider_key": "zoho-primary",
    "provider_message_id": "msg_001"
  },
  "meta": {
    "request_id": "req_send_001",
    "timestamp": "2026-06-11T10:30:00.000Z"
  }
}
```

## 19.2 `Respond Error`

Format :

```json
{
  "ok": false,
  "action": "send_pack",
  "status": "approval_error",
  "message": "Le pack n'est pas envoyable.",
  "error": {
    "code": "PACK_NOT_SENDABLE",
    "details": {
      "attachments_count": 1,
      "can_send": false
    }
  },
  "meta": {
    "request_id": "req_send_001",
    "timestamp": "2026-06-11T10:30:00.000Z"
  }
}
```

---

## 20. Variables et secrets a prevoir dans n8n

Variables metier :

- `ADMIN_BACKOFFICE_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BOOKING_LINK_45MIN`
- `OUTREACH_FROM_EMAIL`
- `INTERNAL_REVIEW_EMAIL`

Variables fournisseurs :

- `ZOHO_*`
- `GMAIL_*`
- `OUTLOOK_*`

Variables utilitaires :

- `N8N_BASE_URL`
- `AUDIT_FORM_BASE_URL`

---

## 21. Raccrochage exact avec le V3 existant

Le controller doit `reutiliser`, pas dupliquer, chaque fois que possible.

## Reutiliser directement

- `Execute Workflow Trigger`
- `Store Pack In Supabase`
- `Build Approval Email`
- `Send Internal Approval Email`
- `Get Pack From Supabase`
- `Extract Pack Payload`
- `Build Send Context`
- `Mark Pack Approved`
- `Send External Prospect Email`
- `Parse Send Result`
- `Mark Pack Sent`
- `Log Outreach Attempt`
- `Update Prospect Target Sent`
- `Mark Pack Rejected`
- `Update Prospect Target Rejected`
- `Mark Pack Approval Error`
- `Update Prospect Target Approval Error`

## Dupliquer seulement si necessaire

- normalisation auth
- routing actions
- test fournisseur
- listing fournisseurs
- health check

---

## 22. Ordre d'implementation recommande

## Phase 1

Creer :

1. `Admin Controller Webhook`
2. `Normalize Request`
3. `Validate Auth Header`
4. `Switch Action`
5. branche `health_check`
6. branche `list_providers`

## Phase 2

Creer :

1. branche `generate_pack`
2. branche `reject_pack`

## Phase 3

Creer :

1. branche `approve_pack`
2. branche `send_pack`
3. `Route Provider`
4. branche `test_provider`

## Phase 4

Ajouter :

1. `regenerate_pack`
2. idempotence
3. logs admin supplementaires
4. mecanisme d'audit d'action si besoin

---

## 23. Resultat attendu

Le workflow controller est correctement concu quand :

- le back-office peut appeler un seul endpoint n8n
- chaque bouton du front a une branche claire
- l'auth admin est verifiee
- les statuts Supabase sont mis a jour proprement
- le V3 reste le moteur de generation et d'envoi
- le fournisseur email est interchangeable

---

## 24. Recommandation finale

Ne construisez pas un workflow controller qui refait toute la logique du V3.

Construisez un workflow controller qui :

- recoit
- verifie
- route
- appelle
- repond

En une phrase :

- `V3 produit et envoie`
- `le controller admin pilote V3`
