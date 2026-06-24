# Guide Administrateur - Connexion du Pack Prospect aux Interfaces Email CRM

Date : 11 juin 2026

## 1. Objet du document

Ce guide explique comment connecter le `pack prospect` genere par le `Workflow V3 principal` a une interface d'envoi admin compatible avec :

- `Zoho Mail`
- `Gmail`
- `Outlook / Microsoft 365`
- et, plus tard, tout autre fournisseur email sortant

Le pack prospect est le bloc commercial complet cree avant envoi au prospect. Il contient deja :

- le `courrier prospect`
- le `deck de presentation`
- le `mini-catalogue cible`
- et, plus tard, tout autre document joint

L'objectif n'est pas de faire envoyer les emails directement depuis le CRM, mais de mettre en place une `interface de validation et d'envoi` qui :

1. lit les prospects depuis le CRM ou Supabase
2. lit les packs depuis Supabase
3. permet une validation humaine avant envoi
4. appelle `n8n` pour executer l'envoi via le fournisseur email choisi

---

## 2. Principe d'architecture

Le modele recommande est le suivant :

```text
CRM / Base prospects
  -> alimente prospect_targets

Workflow V3 principal (n8n)
  -> genere le pack prospect
  -> stocke le pack dans ai_prospecting_packs

Interface Admin de validation
  -> affiche le courrier
  -> affiche le deck et le mini-catalogue
  -> permet Approuver / Rejeter / Regenerer / Envoyer

n8n backend
  -> execute l'action demandee
  -> envoie via Zoho, Gmail, Outlook ou autre
  -> journalise l'envoi dans outreach_attempts

Supabase
  -> reste la source de verite pour les statuts
```

En pratique :

- `le front admin` sert a piloter
- `Supabase` sert a stocker et relire
- `n8n` sert a agir
- `le fournisseur email` sert a expédier

---

## 3. Tables et objets deja utilises

Le dispositif repose deja sur les tables suivantes :

### 3.1 `prospect_targets`

Role :

- source canonique des prospects a traiter
- point d'entree CRM operationnel

Champs utiles minimaux :

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `booking_link_45min`
- `commercial_priority_default`
- `status`
- `paused`
- `do_not_contact`
- `last_pack_id`

### 3.2 `ai_prospecting_packs`

Role :

- stocker le pack genere par le workflow V3

Champs utiles minimaux :

- `pack_id`
- `prospect_id`
- `organization_name`
- `decision_maker_name`
- `target_email`
- `status`
- `payload`
- `approved_at`
- `rejected_at`
- `sent_at`
- `resend_message_id`
- `reviewer_email`
- `error_reason`

### 3.3 `outreach_attempts`

Role :

- journaliser tout envoi reel

Champs utiles minimaux :

- `prospect_id`
- `pack_id`
- `organization_name`
- `target_email`
- `channel`
- `message_variant`
- `sent_at`
- `delivery_status`
- `response_status`
- `follow_up_due_at`

---

## 4. Ce que doit contenir le pack avant connexion a Zoho, Gmail ou Outlook

Avant tout branchement fournisseur, le pack doit etre complet et envoyable.

Le pack doit comporter :

- `pack_id`
- `target_email`
- `executive_letter` ou `executive_letter_html`
- `catalogue_artifact`
- `deck_artifact`
- `mail_attachments` ou une logique de reconstruction des pieces jointes
- `audit_form_url`
- `booking_link_45min`

Le controle fonctionnel minimum est :

- `attachments_count >= 2`
- presence du `PDF` du mini-catalogue
- presence du `PPTX` du deck
- `can_send = true`

Ces verifications doivent etre faites dans `n8n` avant l'envoi.

---

## 5. Les 3 etapes de creation de l'interface

## Etape 1 - Creer la couche de connexion fournisseur email

### Objectif

Construire une couche technique unique qui permet a l'interface admin d'envoyer un pack via :

- `Zoho`
- `Gmail`
- `Outlook`

Cette couche ne doit pas dependre du fournisseur choisi par l'admin.

### Ce qu'il faut creer

Une configuration fournisseur, par exemple `email_provider_configs`, ou un equivalent dans vos variables d'environnement / secrets.

### Entrants obligatoires de cette etape

- `provider_key`
- `provider_type`
- `transport_mode`
- `sender_name`
- `from_email`
- `reply_to_email`
- `auth_mode`
- `api_base_url` si mode API
- `smtp_host` si mode SMTP
- `smtp_port` si mode SMTP
- `oauth_client_id` si mode OAuth
- `oauth_client_secret_ref`
- `access_token_ref`
- `refresh_token_ref`
- `api_key_ref` si mode API key
- `default_bcc` optionnel
- `daily_send_limit`
- `per_minute_limit`
- `is_active`

### Valeurs attendues

#### Pour `provider_type`

- `zoho`
- `gmail`
- `outlook`
- `custom`

#### Pour `transport_mode`

- `api`
- `smtp`
- `oauth_api`

#### Pour `auth_mode`

- `api_key`
- `app_password`
- `oauth2`

### Rendu attendu de l'etape 1

La plateforme doit etre capable de dire :

- quel fournisseur est actif
- quel expediteur est utilise
- quel mode d'authentification est choisi
- si le fournisseur supporte les pieces jointes
- si un test d'envoi a ete valide

### Recommandation experte

Le plus propre est d'introduire un `provider adapter` dans `n8n`, avec une logique unique :

- le front demande `envoyer ce pack`
- `n8n` choisit le bon connecteur
- `n8n` transforme la requete en format Zoho, Gmail ou Outlook

Autrement dit :

- `le front ne connait pas le fournisseur`
- `n8n connait le fournisseur`

---

## Etape 2 - Creer l'interface admin de validation du pack

### Objectif

Permettre a l'administrateur de :

- voir le courrier prospect
- voir le deck
- voir le mini-catalogue
- verifier l'email cible
- approuver ou rejeter
- declencher l'envoi

### Ce que l'interface doit afficher

#### Bloc `Resume Prospect`

- organisation
- decideur
- secteur
- type d'organisation
- pays
- email cible
- priorite commerciale

#### Bloc `Courrier Pret a Partir`

- sujet
- corps du courrier
- version HTML ou texte formate

#### Bloc `Pieces Jointes`

- deck PPTX
- mini-catalogue PDF
- autres documents si ajoutes plus tard

#### Bloc `Diagnostic d'Envoi`

- `pack_id`
- `attachments_count`
- `can_send`
- presence du PDF
- presence du PPTX
- statut du pack
- motif d'erreur si bloquant

#### Bloc `Actions`

- `Generer pack`
- `Regenerer`
- `Approuver`
- `Rejeter`
- `Envoyer`

### Entrants obligatoires de cette etape

#### Entrants en lecture depuis `prospect_targets`

- `prospect_id`
- `organization_name`
- `decision_maker_name`
- `target_email`
- `sector_guess`
- `organization_type`
- `status`
- `last_pack_id`
- `next_action_at`

#### Entrants en lecture depuis `ai_prospecting_packs`

- `pack_id`
- `prospect_id`
- `organization_name`
- `target_email`
- `status`
- `payload`
- `approved_at`
- `rejected_at`
- `sent_at`
- `reviewer_email`
- `error_reason`

#### Entrants en lecture depuis `outreach_attempts`

- `pack_id`
- `prospect_id`
- `target_email`
- `sent_at`
- `delivery_status`
- `response_status`

### Rendu attendu de l'etape 2

L'admin doit pouvoir ouvrir une fiche pack et prendre une decision sans passer par `n8n` ni par Supabase en direct.

Le role du front est uniquement :

- afficher
- confirmer
- appeler l'action backend

---

## Etape 3 - Connecter l'interface au CRM et a n8n pour l'envoi reel

### Objectif

Faire le lien complet entre :

- le CRM
- les tables Supabase
- le workflow V3 principal
- le fournisseur email

### Flux metier recommande

1. le CRM ou la base alimente `prospect_targets`
2. l'admin ouvre l'interface
3. l'admin clique `Generer pack`
4. `n8n` execute le workflow V3
5. le pack est stocke dans `ai_prospecting_packs`
6. l'admin ouvre le pack et le valide
7. l'admin clique `Approuver et envoyer`
8. `n8n` envoie via Zoho, Gmail ou Outlook
9. `outreach_attempts` est alimente
10. `prospect_targets` est mis a jour

### Entrants obligatoires de cette etape

#### Entrants CRM vers `prospect_targets`

- `prospect_id`
- `organization_name`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `decision_maker_name`
- `target_email`
- `custom_page_paths_csv`
- `booking_link_45min`
- `commercial_priority_default`
- `research_scope`
- `source_backend`
- `source_label`
- `raw_source_id`
- `niche_status`
- `last_response_status`
- `last_sequence_result`
- `prospect_language`

#### Entrants du front vers `n8n`

##### Bouton `Generer pack`

- `prospect_id`
- `triggered_by`
- `source = backoffice`
- `force`

##### Bouton `Regenerer`

- `pack_id`
- `prospect_id`
- `triggered_by`
- `reason`

##### Bouton `Approuver`

- `pack_id`
- `reviewer_email`
- `mode = approve_only`
- `notes`

##### Bouton `Approuver et envoyer`

- `pack_id`
- `reviewer_email`
- `mode = approve_and_send`
- `notes`

##### Bouton `Rejeter`

- `pack_id`
- `reviewer_email`
- `reason`
- `reset_prospect_to_ready`

##### Bouton `Envoyer`

- `pack_id`
- `reviewer_email`
- `force`

### Rendu attendu de l'etape 3

L'envoi doit fonctionner de la meme facon quel que soit le fournisseur :

- le front appelle `n8n`
- `n8n` verifie le pack
- `n8n` selectionne le connecteur email
- `n8n` envoie
- `n8n` met a jour Supabase
- le front recharge le statut

---

## 6. Webhooks `n8n` a creer pour cette interface

Je recommande les endpoints suivants.

### `POST /webhook/prospect-pack/generate`

Role :

- lancer V3 pour un prospect

Request :

```json
{
  "prospect_id": "fipme-001",
  "triggered_by": "marius@transferai.ci",
  "source": "backoffice",
  "force": false
}
```

Response minimale :

```json
{
  "ok": true,
  "action": "generate_pack",
  "status": "accepted",
  "prospect_id": "fipme-001",
  "message": "Generation lancee."
}
```

### `POST /webhook/prospect-pack/regenerate`

Role :

- reconstruire un pack existant

### `POST /webhook/prospect-pack/approve`

Role :

- approuver seulement
- ou approuver puis envoyer

### `POST /webhook/prospect-pack/reject`

Role :

- rejeter le pack
- remettre le prospect en correction

### `POST /webhook/prospect-pack/send`

Role :

- envoyer un pack valide

### `GET /webhook/approve-prospect-pack-v3`

Role :

- garder la compatibilite avec l'email interne d'approbation
- ne pas en faire l'interface admin principale

---

## 7. Mapping fournisseur email

L'interface admin doit rester identique. Seul le `provider adapter` change.

## 7.1 Zoho

Modes possibles :

- `SMTP`
- `API` si service transactionnel distinct utilise
- `OAuth` si integration geree en mode compte professionnel

Entrants minimum :

- `provider_type = zoho`
- `transport_mode`
- `from_email`
- `sender_name`
- `reply_to_email`
- `auth_mode`
- `secret_ref`

## 7.2 Gmail

Modes possibles :

- `SMTP`
- `OAuth2`
- `API Gmail`

Entrants minimum :

- `provider_type = gmail`
- `transport_mode`
- `from_email`
- `sender_name`
- `reply_to_email`
- `auth_mode`
- `secret_ref`

## 7.3 Outlook / Microsoft 365

Modes possibles :

- `SMTP`
- `OAuth2`
- `Graph API`

Entrants minimum :

- `provider_type = outlook`
- `transport_mode`
- `from_email`
- `sender_name`
- `reply_to_email`
- `auth_mode`
- `secret_ref`

### Regle importante

Le front ne doit jamais coder en dur :

- le host SMTP
- la cle API
- les tokens OAuth
- les limites du fournisseur

Tout cela doit vivre dans la couche backend / secrets.

---

## 8. Ce que `n8n` doit verifier avant envoi

Avant l'appel au fournisseur email, `n8n` doit valider :

- `pack_id` present
- `prospect_id` present si applicable
- `target_email` present
- `executive_letter` ou `executive_letter_html` present
- `attachments_count >= 2`
- `PDF` present
- `PPTX` present
- `can_send = true`
- fournisseur actif disponible

Si un point manque :

- le pack passe en `approval_error`
- le prospect passe en `paused`
- l'interface doit afficher le motif

---

## 9. Mises a jour de statut attendues

## 9.1 Si envoi reussi

### `ai_prospecting_packs`

- `status = sent`
- `sent_at`
- `reviewer_email`
- `provider_message_id` ou equivalent

### `outreach_attempts`

- insertion d'une ligne avec :
  - `channel = email`
  - `delivery_status = submitted`
  - `response_status = pending`

### `prospect_targets`

- `status = active`
- `last_sequence_result = sent_v3`
- `last_response_status = pending`
- `niche_status = outreach_started`
- `next_action_at = +5 jours`

## 9.2 Si rejet

### `ai_prospecting_packs`

- `status = rejected`
- `rejected_at`
- `reviewer_email`

### `prospect_targets`

- `status = ready`
- `last_sequence_result = rejected_internal_v3`
- `niche_status = needs_manual_revision`

## 9.3 Si erreur d'approbation ou erreur d'envoi

### `ai_prospecting_packs`

- `status = approval_error`
- `error_reason`

### `prospect_targets`

- `status = paused`
- `paused = true`
- `last_sequence_result = approval_error_v3`
- `niche_status = internal_fix_required`

---

## 10. Checklist administrateur avant mise en production

### Cote interface

- [ ] Vue `Prospects` disponible
- [ ] Vue `Packs` disponible
- [ ] Vue `Detail pack` disponible
- [ ] Boutons `Generer`, `Regenerer`, `Approuver`, `Rejeter`, `Envoyer` disponibles

### Cote Supabase

- [ ] lecture `prospect_targets`
- [ ] lecture `ai_prospecting_packs`
- [ ] lecture `outreach_attempts`
- [ ] ecriture par `n8n` verifiee

### Cote n8n

- [ ] webhook `generate` cree
- [ ] webhook `regenerate` cree
- [ ] webhook `approve` cree
- [ ] webhook `reject` cree
- [ ] webhook `send` cree
- [ ] compatibilite avec `approve-prospect-pack-v3` conservee

### Cote fournisseur email

- [ ] expediteur valide
- [ ] authentification valide
- [ ] test avec pieces jointes valide
- [ ] test sur un prospect interne valide

---

## 11. Recommandation finale

La bonne architecture n'est pas :

- `CRM -> email direct`

La bonne architecture est :

- `CRM -> prospect_targets -> V3 -> ai_prospecting_packs -> interface admin -> n8n -> fournisseur email -> outreach_attempts`

Cette approche permet :

- un controle humain avant envoi
- la relecture du courrier
- la verification des pieces jointes
- le choix du fournisseur email
- une traçabilite propre
- une compatibilite durable avec Zoho, Gmail, Outlook et futurs connecteurs

---

## 12. Entrees consolidees a prevoir dans le projet

Pour finaliser la mise en oeuvre, les entrants suivants doivent etre disponibles.

### Entrants metier

- prospect issu du CRM
- email cible
- langue prospect
- secteur
- organisation
- decideur

### Entrants documents

- courrier prospect
- deck PPTX
- mini-catalogue PDF
- futurs documents additionnels

### Entrants techniques

- webhook URLs n8n
- token admin
- configuration fournisseur email
- secret refs
- regles d'envoi

### Entrants de suivi

- statut pack
- statut envoi
- statut reponse
- prochaine relance

Ce sont ces entrants qui doivent etre formalises dans l'interface, dans Supabase et dans `n8n`.
