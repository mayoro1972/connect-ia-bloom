# Contrat Technique Backend Final - Prospection Packs

Date : 11 juin 2026

## 1. Objet du document

Ce document definit le `contrat technique backend final` pour le module `Prospection Packs`.

Il est concu pour etre :

- presque pret a implementer dans `n8n`
- presque pret a brancher dans le futur `back-office React`
- compatible avec `Supabase`
- compatible avec le `Workflow V3 principal`
- compatible avec les futurs fournisseurs email : `Zoho`, `Gmail`, `Outlook`

Le principe directeur est simple :

- `le front lit Supabase`
- `le front appelle des endpoints backend pour agir`
- `n8n execute`
- `Supabase memorise`

---

## 2. Architecture cible

```text
BackOffice React
  -> GET lecture via Supabase
  -> POST actions vers Backend Admin

Backend Admin
  -> verifie auth + payload
  -> appelle webhook n8n adapte
  -> retourne un JSON propre au front

n8n
  -> genere / regenere / approuve / rejette / envoie
  -> met a jour Supabase

Supabase
  -> stocke prospects, packs, envois, statuts
```

---

## 3. Regles globales du contrat

## 3.1 Prefixe API recommande

Prefixe recommande :

- `/api/admin/prospecting`

## 3.2 Format de reponse standard

Toutes les reponses backend doivent suivre cette structure :

```json
{
  "ok": true,
  "action": "generate_pack",
  "status": "accepted",
  "message": "Generation lancee.",
  "data": {},
  "meta": {
    "request_id": "req_01JABCXYZ",
    "timestamp": "2026-06-11T10:15:00.000Z"
  }
}
```

En cas d'erreur :

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
    "request_id": "req_01JABCXYZ",
    "timestamp": "2026-06-11T10:15:00.000Z"
  }
}
```

## 3.3 Authentification

Toutes les routes `POST` admin doivent exiger :

- `Authorization: Bearer <ADMIN_TOKEN>`

Optionnel mais recommande :

- `X-Request-Id`
- `X-Actor-Email`

## 3.4 Idempotence

Pour les actions sensibles, il est recommande d'ajouter :

- `Idempotency-Key`

Actions concernees :

- `generate`
- `regenerate`
- `approve`
- `send`

## 3.5 Source de lecture

Le frontend doit lire directement :

- `prospect_targets`
- `ai_prospecting_packs`
- `outreach_attempts`

via Supabase.

Le backend ci-dessous couvre surtout les `actions`.

---

## 4. Etats et codes metier

## 4.1 Etats packs

Valeurs attendues de `ai_prospecting_packs.status` :

- `pending_approval`
- `approved`
- `rejected`
- `sent`
- `approval_error`
- `expired`
- `cancelled`

## 4.2 Etats prospects

Valeurs attendues de `prospect_targets.status` :

- `ready`
- `active`
- `paused`
- `closed`
- `archived`

## 4.3 Codes erreur backend recommandes

- `UNAUTHORIZED`
- `INVALID_PAYLOAD`
- `PROSPECT_NOT_FOUND`
- `PACK_NOT_FOUND`
- `PACK_ALREADY_SENT`
- `PACK_NOT_SENDABLE`
- `PACK_NOT_APPROVABLE`
- `PROVIDER_NOT_CONFIGURED`
- `PROVIDER_TEST_FAILED`
- `WORKFLOW_EXECUTION_FAILED`
- `SUPABASE_WRITE_FAILED`
- `UNSUPPORTED_ACTION`

---

## 5. Endpoints obligatoires

## 5.1 POST `/api/admin/prospecting/packs/generate`

### Role

Lancer la generation d'un nouveau pack a partir d'un prospect.

### Usage front

Bouton :

- `Generer pack`

### Request body

```json
{
  "prospect_id": "fipme-001",
  "triggered_by": "marius@transferai.ci",
  "source": "backoffice",
  "force": false,
  "provider_key": "zoho-primary"
}
```

### Champs

- `prospect_id` : requis
- `triggered_by` : requis
- `source` : requis, valeur recommandee `backoffice`
- `force` : optionnel
- `provider_key` : optionnel, permet de preselectionner le fournisseur d'envoi futur

### Validation backend

- verifier que `prospect_id` existe dans `prospect_targets`
- verifier que le prospect n'est pas `do_not_contact`
- verifier que `target_email` n'est pas vide si l'envoi email est attendu

### Action n8n attendue

Appel du `Workflow V3 principal` via `Execute Workflow Trigger`

### Reponse `202 Accepted`

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
  },
  "meta": {
    "request_id": "req_generate_001",
    "timestamp": "2026-06-11T10:15:00.000Z"
  }
}
```

### Erreurs possibles

- `401 UNAUTHORIZED`
- `404 PROSPECT_NOT_FOUND`
- `409 WORKFLOW_EXECUTION_FAILED`
- `422 INVALID_PAYLOAD`

### Mapping n8n

- entree : `Execute Workflow Trigger`
- stockage : `Store Pack In Supabase`
- notification interne : `Build Approval Email`, `Send Internal Approval Email`

---

## 5.2 POST `/api/admin/prospecting/packs/regenerate`

### Role

Regenerer un pack existant apres correction ou changement de contexte.

### Usage front

Bouton :

- `Regenerer`

### Request body

```json
{
  "pack_id": "pack-abc123",
  "prospect_id": "fipme-001",
  "triggered_by": "marius@transferai.ci",
  "reason": "correction_editoriale",
  "force": true
}
```

### Champs

- `pack_id` : requis si connu
- `prospect_id` : recommande
- `triggered_by` : requis
- `reason` : requis
- `force` : optionnel

### Validation backend

- verifier que `pack_id` existe ou que `prospect_id` est resolvable
- refuser la regeneration si le pack est deja `sent`, sauf si `force = true`

### Action n8n attendue

- relancer V3 avec le prospect d'origine
- creer un nouveau `pack_id`
- mettre l'ancien pack en `cancelled` ou le laisser historise

### Reponse `202 Accepted`

```json
{
  "ok": true,
  "action": "regenerate_pack",
  "status": "accepted",
  "message": "Regeneration du pack lancee.",
  "data": {
    "pack_id": "pack-abc123",
    "prospect_id": "fipme-001",
    "poll_after_ms": 2500
  },
  "meta": {
    "request_id": "req_regenerate_001",
    "timestamp": "2026-06-11T10:16:00.000Z"
  }
}
```

### Erreurs possibles

- `404 PACK_NOT_FOUND`
- `409 PACK_ALREADY_SENT`
- `409 WORKFLOW_EXECUTION_FAILED`

### Mapping n8n

- reentree V3 sur le meme prospect
- nouveau passage par :
  - `Store Pack In Supabase`
  - `Build Approval Email`
  - `Send Internal Approval Email`

---

## 5.3 POST `/api/admin/prospecting/packs/approve`

### Role

Approuver un pack, avec deux modes :

- `approve_only`
- `approve_and_send`

### Usage front

Boutons :

- `Approuver`
- `Approuver et envoyer`

### Request body

```json
{
  "pack_id": "pack-abc123",
  "reviewer_email": "marius@transferai.ci",
  "mode": "approve_and_send",
  "notes": "contenu valide",
  "provider_key": "zoho-primary"
}
```

### Champs

- `pack_id` : requis
- `reviewer_email` : requis
- `mode` : requis, valeurs `approve_only` ou `approve_and_send`
- `notes` : optionnel
- `provider_key` : optionnel mais recommande

### Validation backend

- verifier que le pack existe
- verifier que le pack est en `pending_approval` ou `approval_error`
- verifier que le pack a un `target_email`
- si `mode = approve_and_send`, verifier que le pack est `can_send = true`

### Comportement backend

#### Si `mode = approve_only`

- le backend met le pack a `approved`
- il n'envoie pas encore

#### Si `mode = approve_and_send`

- le backend appelle la branche d'envoi `n8n`
- le pack devient `approved`, puis `sent` si succes

### Reponse `200 OK` en mode `approve_only`

```json
{
  "ok": true,
  "action": "approve_pack",
  "status": "approved",
  "message": "Pack approuve.",
  "data": {
    "pack_id": "pack-abc123",
    "reviewer_email": "marius@transferai.ci"
  },
  "meta": {
    "request_id": "req_approve_001",
    "timestamp": "2026-06-11T10:17:00.000Z"
  }
}
```

### Reponse `200 OK` en mode `approve_and_send`

```json
{
  "ok": true,
  "action": "approve_and_send_pack",
  "status": "sent",
  "message": "Pack approuve puis envoye.",
  "data": {
    "pack_id": "pack-abc123",
    "provider_key": "zoho-primary",
    "provider_message_id": "provider-msg-123"
  },
  "meta": {
    "request_id": "req_approve_send_001",
    "timestamp": "2026-06-11T10:18:00.000Z"
  }
}
```

### Erreurs possibles

- `404 PACK_NOT_FOUND`
- `409 PACK_NOT_APPROVABLE`
- `422 PACK_NOT_SENDABLE`
- `424 PROVIDER_NOT_CONFIGURED`

### Mapping n8n

- branche existante :
  - `Approval Webhook`
  - `Parse Approval Query`
  - `Get Pack From Supabase`
  - `Extract Pack Payload`
  - `Build Send Context`
  - `If Ready To Send`
  - `Mark Pack Approved`
  - `Send External Prospect Email`
  - `Mark Pack Sent`
  - `Log Outreach Attempt`
  - `Update Prospect Target Sent`

---

## 5.4 POST `/api/admin/prospecting/packs/reject`

### Role

Rejeter un pack et remettre le prospect dans un etat corrigeable.

### Usage front

Bouton :

- `Rejeter`

### Request body

```json
{
  "pack_id": "pack-abc123",
  "reviewer_email": "marius@transferai.ci",
  "reason": "deck_trop_sectoriel",
  "reset_prospect_to_ready": true
}
```

### Champs

- `pack_id` : requis
- `reviewer_email` : requis
- `reason` : requis
- `reset_prospect_to_ready` : optionnel, recommande `true`

### Validation backend

- verifier que le pack existe
- refuser le rejet si le pack est deja `sent`

### Action n8n attendue

- `Mark Pack Rejected`
- `Update Prospect Target Rejected`

### Reponse `200 OK`

```json
{
  "ok": true,
  "action": "reject_pack",
  "status": "rejected",
  "message": "Pack rejete.",
  "data": {
    "pack_id": "pack-abc123",
    "prospect_status": "ready"
  },
  "meta": {
    "request_id": "req_reject_001",
    "timestamp": "2026-06-11T10:19:00.000Z"
  }
}
```

### Erreurs possibles

- `404 PACK_NOT_FOUND`
- `409 PACK_ALREADY_SENT`

### Mapping n8n

- `Mark Pack Rejected`
- `Update Prospect Target Rejected`
- `Respond Rejected`

---

## 5.5 POST `/api/admin/prospecting/packs/send`

### Role

Envoyer un pack deja approuve, ou retenter un envoi apres correction.

### Usage front

Bouton :

- `Envoyer`

### Request body

```json
{
  "pack_id": "pack-abc123",
  "reviewer_email": "marius@transferai.ci",
  "provider_key": "zoho-primary",
  "force": false
}
```

### Champs

- `pack_id` : requis
- `reviewer_email` : requis
- `provider_key` : requis si plusieurs connecteurs existent
- `force` : optionnel

### Validation backend

- verifier que le pack existe
- verifier que le pack n'est pas deja `sent`, sauf si `force = true`
- verifier `can_send = true`
- verifier `attachments_count >= 2`

### Action n8n attendue

- charger le pack depuis Supabase
- reconstruire le contexte
- appeler le bon fournisseur email
- journaliser dans `outreach_attempts`

### Reponse `200 OK`

```json
{
  "ok": true,
  "action": "send_pack",
  "status": "sent",
  "message": "Email prospect envoye.",
  "data": {
    "pack_id": "pack-abc123",
    "provider_key": "zoho-primary",
    "provider_message_id": "provider-msg-123",
    "sent_at": "2026-06-11T10:20:00.000Z"
  },
  "meta": {
    "request_id": "req_send_001",
    "timestamp": "2026-06-11T10:20:01.000Z"
  }
}
```

### Erreurs possibles

- `404 PACK_NOT_FOUND`
- `409 PACK_ALREADY_SENT`
- `422 PACK_NOT_SENDABLE`
- `424 PROVIDER_NOT_CONFIGURED`
- `424 PROVIDER_TEST_FAILED`

### Mapping n8n

- `Get Pack From Supabase`
- `Extract Pack Payload`
- `Build Send Context`
- `If Ready To Send`
- `Send External Prospect Email`
- `Parse Send Result`
- `Mark Pack Sent`
- `Log Outreach Attempt`
- `Update Prospect Target Sent`

---

## 5.6 POST `/api/admin/prospecting/providers/test`

### Role

Verifier qu'un connecteur email est fonctionnel avant envoi reel.

### Usage front

Bouton :

- `Tester le connecteur`

### Request body

```json
{
  "provider_key": "zoho-primary",
  "test_to_email": "marius@transferai.ci",
  "triggered_by": "marius@transferai.ci"
}
```

### Validation backend

- verifier que le fournisseur existe
- verifier que le fournisseur est `is_active = true`

### Action n8n attendue

- route test fournisseur
- envoi d'un email simple sans pack

### Reponse `200 OK`

```json
{
  "ok": true,
  "action": "test_provider",
  "status": "success",
  "message": "Connecteur email valide.",
  "data": {
    "provider_key": "zoho-primary",
    "provider_message_id": "provider-test-001"
  },
  "meta": {
    "request_id": "req_provider_test_001",
    "timestamp": "2026-06-11T10:21:00.000Z"
  }
}
```

### Erreurs possibles

- `404 PROVIDER_NOT_CONFIGURED`
- `424 PROVIDER_TEST_FAILED`

---

## 5.7 GET `/api/admin/prospecting/providers`

### Role

Retourner la liste des fournisseurs disponibles pour l'interface admin.

### Usage front

Affichage :

- selecteur de fournisseur
- statut de disponibilite

### Reponse `200 OK`

```json
{
  "ok": true,
  "action": "list_providers",
  "status": "success",
  "message": "Fournisseurs charges.",
  "data": {
    "providers": [
      {
        "provider_key": "zoho-primary",
        "provider_type": "zoho",
        "transport_mode": "smtp",
        "from_email": "contact@transferai.ci",
        "sender_name": "TransferAI",
        "is_active": true,
        "supports_attachments": true,
        "daily_send_limit": 200
      }
    ]
  },
  "meta": {
    "request_id": "req_provider_list_001",
    "timestamp": "2026-06-11T10:22:00.000Z"
  }
}
```

---

## 5.8 GET `/api/admin/prospecting/health`

### Role

Donner au back-office un etat simple de sante du dispositif.

### Reponse `200 OK`

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
  },
  "meta": {
    "request_id": "req_health_001",
    "timestamp": "2026-06-11T10:23:00.000Z"
  }
}
```

---

## 6. Routes de lecture optionnelles

Si vous ne voulez pas que le front lise Supabase directement, vous pouvez exposer plus tard :

- `GET /api/admin/prospecting/prospects`
- `GET /api/admin/prospecting/packs`
- `GET /api/admin/prospecting/packs/{pack_id}`
- `GET /api/admin/prospecting/outreach-attempts`

Mais ce n'est pas obligatoire dans la premiere version.

La recommandation reste :

- lecture via Supabase
- actions via backend admin

---

## 7. Schema minimal des payloads frontend

## 7.1 Type `GeneratePackRequest`

```ts
type GeneratePackRequest = {
  prospect_id: string;
  triggered_by: string;
  source: "backoffice";
  force?: boolean;
  provider_key?: string;
};
```

## 7.2 Type `RegeneratePackRequest`

```ts
type RegeneratePackRequest = {
  pack_id: string;
  prospect_id?: string;
  triggered_by: string;
  reason: string;
  force?: boolean;
};
```

## 7.3 Type `ApprovePackRequest`

```ts
type ApprovePackRequest = {
  pack_id: string;
  reviewer_email: string;
  mode: "approve_only" | "approve_and_send";
  notes?: string;
  provider_key?: string;
};
```

## 7.4 Type `RejectPackRequest`

```ts
type RejectPackRequest = {
  pack_id: string;
  reviewer_email: string;
  reason: string;
  reset_prospect_to_ready?: boolean;
};
```

## 7.5 Type `SendPackRequest`

```ts
type SendPackRequest = {
  pack_id: string;
  reviewer_email: string;
  provider_key: string;
  force?: boolean;
};
```

---

## 8. Schema minimal de reponse frontend

```ts
type AdminActionResponse<T = Record<string, unknown>> = {
  ok: boolean;
  action: string;
  status: string;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: Record<string, unknown>;
  };
  meta: {
    request_id: string;
    timestamp: string;
  };
};
```

---

## 9. Contrat `n8n` interne recommande

Le backend admin peut appeler soit :

- un `workflow controller unique`
- soit plusieurs webhooks dedies

## 9.1 Option recommandee : un controller unique

Webhook interne n8n :

- `POST /webhook/admin-prospect-pack-action`

Payload :

```json
{
  "action": "generate_pack",
  "payload": {
    "prospect_id": "fipme-001",
    "triggered_by": "marius@transferai.ci"
  }
}
```

Actions supportees :

- `generate_pack`
- `regenerate_pack`
- `approve_pack`
- `reject_pack`
- `send_pack`
- `test_provider`

## 9.2 Option alternative : un webhook par action

- `POST /webhook/prospect-pack/generate`
- `POST /webhook/prospect-pack/regenerate`
- `POST /webhook/prospect-pack/approve`
- `POST /webhook/prospect-pack/reject`
- `POST /webhook/prospect-pack/send`
- `POST /webhook/prospecting/provider/test`

Cette option est plus lisible pour le back-office.

---

## 10. Mapping exact vers le Workflow V3 principal

## 10.1 `generate_pack`

Utilise :

- `Execute Workflow Trigger`
- `Set Target`
- `Build Source URLs`
- `Assemble Prospect Context`
- generation LLM
- rendu catalogue
- rendu deck
- `Store Pack In Supabase`
- `Build Approval Email`
- `Send Internal Approval Email`

## 10.2 `approve_pack`

Utilise :

- `Approval Webhook`
- `Parse Approval Query`
- `Get Pack From Supabase`
- `Extract Pack Payload`
- `Mark Pack Approved`

## 10.3 `approve_and_send` / `send_pack`

Utilise :

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

## 10.4 `reject_pack`

Utilise :

- `Mark Pack Rejected`
- `Update Prospect Target Rejected`

## 10.5 `approval_error`

Utilise :

- `Mark Pack Approval Error`
- `Update Prospect Target Approval Error`

---

## 11. Regles de mise a jour Supabase

## 11.1 Apres envoi reussi

### `ai_prospecting_packs`

Mettre a jour :

- `status = sent`
- `sent_at`
- `reviewer_email`
- `resend_message_id` ou futur `provider_message_id`

### `outreach_attempts`

Inserer :

- `prospect_id`
- `pack_id`
- `target_email`
- `organization_name`
- `channel = email`
- `message_variant = executive_multi_prospect_model_v3`
- `sent_at`
- `delivery_status = submitted`
- `response_status = pending`

### `prospect_targets`

Mettre a jour :

- `status = active`
- `last_sequence_result = sent_v3`
- `last_response_status = pending`
- `stop_reason = null`
- `niche_status = outreach_started`
- `next_action_at = +5 jours`

## 11.2 Apres rejet

### `ai_prospecting_packs`

- `status = rejected`
- `rejected_at`
- `reviewer_email`

### `prospect_targets`

- `status = ready`
- `last_sequence_result = rejected_internal_v3`
- `stop_reason = internal_review_rejected`
- `niche_status = needs_manual_revision`

## 11.3 Apres erreur d'approbation ou d'envoi

### `ai_prospecting_packs`

- `status = approval_error`
- `error_reason`

### `prospect_targets`

- `status = paused`
- `paused = true`
- `last_sequence_result = approval_error_v3`
- `stop_reason = send_failure_reason`
- `niche_status = internal_fix_required`

---

## 12. Contrat fournisseur email

Pour rendre la couche d'envoi independante du fournisseur, le backend doit normaliser les entrees suivantes :

```json
{
  "provider_key": "zoho-primary",
  "from": {
    "email": "contact@transferai.ci",
    "name": "TransferAI"
  },
  "reply_to": "contact@transferai.ci",
  "to": ["prospect@example.com"],
  "subject": "Proposition d'audit gratuit, d'accompagnement et de formation",
  "html": "<p>...</p>",
  "attachments": [
    {
      "filename": "Mini_Catalogue_TransferAI.pdf",
      "path": "https://..."
    },
    {
      "filename": "Deck_TransferAI.pptx",
      "path": "https://..."
    }
  ]
}
```

Ensuite :

- le `Zoho adapter` traduit cela pour Zoho
- le `Gmail adapter` traduit cela pour Gmail
- le `Outlook adapter` traduit cela pour Outlook

Le front n'a jamais besoin de connaitre la difference.

---

## 13. Ordre d'implementation recommande

## Phase 1

Implementer :

- `GET /providers`
- `POST /providers/test`
- `POST /packs/generate`

## Phase 2

Implementer :

- `POST /packs/approve`
- `POST /packs/reject`
- `POST /packs/send`

## Phase 3

Implementer :

- `POST /packs/regenerate`
- `GET /health`
- idempotence
- selection fournisseur multi-connecteurs

---

## 14. Definition de pret a implementer

Ce contrat est considere pret a implementer si :

- les endpoints ci-dessus sont retenus sans ambiguity
- le front connait les payloads exacts
- `n8n` connait les actions exactes
- Supabase connait les statuts exacts
- la couche fournisseur email est abstraite

---

## 15. Recommandation finale

La mise en oeuvre la plus propre est :

1. `BackOffice React` pour la validation humaine
2. `Supabase` pour l'etat et l'historique
3. `Backend Admin` pour exposer les endpoints
4. `n8n` pour executer les actions
5. `Zoho / Gmail / Outlook` comme simples moteurs d'expedition

Ce decoupage vous permettra de changer de fournisseur email sans casser le workflow prospecting, ni l'interface admin.
