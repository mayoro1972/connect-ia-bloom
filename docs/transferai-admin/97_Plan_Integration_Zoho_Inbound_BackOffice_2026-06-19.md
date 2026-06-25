# Plan d'integration Zoho inbound vers le back office

Date: 2026-06-19

## Objectif

Permettre a TransferAI Africa de recuperer automatiquement les emails entrants recus dans Zoho Mail, de les classer comme prospects formation ou service, puis de les exposer dans le back office au meme niveau que les demandes `contact_requests`, `registration_requests`, `webinar_registrations` et `partner_listing_reviews`.

## Constat repo

- Le depot contient une branche `Zoho First` pour l'envoi sortant via Zoho SMTP.
- Je n'ai pas trouve de synchronisation des emails entrants Zoho vers Supabase.
- Le projet a deja un precedent propre pour les messages entrants avec `whatsapp_inbound_messages` et `twilio-whatsapp-webhook`.

## Recommendation

Option recommandee: `Zoho Mail API + polling backend`

Pourquoi:
- le guide OAuth serveur de Zoho est compatible avec un backend Supabase ou n8n
- l'API Mail expose la lecture des comptes, la liste des emails, les headers et le contenu
- je n'ai pas trouve de mecanisme webhook ou push equivalent dans l'index officiel Zoho Mail API

Inference a partir de la doc officielle:
- l'index API Zoho Mail expose `Email Messages API`, `Accounts API`, `Folders API`, mais je n'y ai pas trouve d'entree `webhook` ou `push`
- la solution la plus robuste cote produit est donc un `poller` backend ou une redirection email vers une boite d'ingestion

## Sources officielles consultees

- Zoho Mail API index: https://www.zoho.com/mail/help/api/
- List Emails API: https://www.zoho.com/mail/help/api/get-emails-list.html
- Get Email Headers API: https://www.zoho.com/mail/help/api/get-email-header.html
- Get Email Content API: https://www.zoho.com/mail/help/api/get-email-content.html
- OAuth server-based apps: https://www.zoho.com/accounts/protocol/oauth/web-server-applications.html
- IMAP access: https://www.zoho.com/mail/help/imap-access.html
- Email forwarding API: https://www.zoho.com/mail/help/api/put-add-email-forwarding.html

## Architecture cible

1. Zoho OAuth
- enregistrer une application `server-based app`
- obtenir `client_id`, `client_secret`, `refresh_token`
- scopes minimaux:
  - `ZohoMail.messages.READ`
  - `ZohoMail.accounts.READ`
  - `ZohoMail.folders.READ`

2. Fonction backend `zoho-mail-sync`
- recupere un access token a partir du refresh token
- liste les comptes Zoho
- lit le dossier Inbox
- recupere les emails non encore ingeres
- lit les headers et le contenu
- normalise puis stocke dans Supabase

3. Table Supabase `zoho_inbound_messages`
- miroir du pattern `whatsapp_inbound_messages`
- stockage brut + colonnes normalisees

4. Classification
- detecter si le message parle de:
  - formation
  - devis
  - catalogue
  - audit
  - service / accompagnement
  - partenariat
- lier si possible a un prospect existant par email

5. Back office
- ajouter un nouvel onglet `Emails entrants`
- filtres:
  - non lus
  - a qualifier
  - formation
  - service
  - partenariat
  - traite

## Schema Supabase propose

```sql
create table if not exists public.zoho_inbound_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  received_at timestamptz,
  zoho_account_id text not null,
  zoho_folder_id text,
  zoho_message_id text not null unique,
  internet_message_id text,
  thread_id text,
  from_address text not null,
  from_name text,
  to_addresses text[] not null default '{}',
  cc_addresses text[] not null default '{}',
  subject text,
  summary text,
  content_html text,
  content_text text,
  has_attachment boolean not null default false,
  is_read boolean not null default false,
  matched_contact_request_id uuid references public.contact_requests(id) on delete set null,
  matched_registration_request_id uuid references public.registration_requests(id) on delete set null,
  matched_webinar_registration_id uuid references public.webinar_registrations(id) on delete set null,
  detected_intent text,
  detected_domain text,
  qualification_status text not null default 'new',
  internal_notes text,
  raw_headers jsonb not null default '{}'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb
);
```

Contraintes conseillees:

```sql
create index if not exists idx_zoho_inbound_messages_created_at
  on public.zoho_inbound_messages (created_at desc);

create index if not exists idx_zoho_inbound_messages_from_address
  on public.zoho_inbound_messages (from_address);

create index if not exists idx_zoho_inbound_messages_qualification_status
  on public.zoho_inbound_messages (qualification_status, created_at desc);
```

Valeurs conseillees pour `qualification_status`:
- `new`
- `qualified`
- `needs_reply`
- `meeting_proposed`
- `meeting_booked`
- `closed`
- `ignored_test`

## Appels Zoho a utiliser

### 1. Lister les emails d'un dossier

Endpoint:
- `GET /api/accounts/{accountId}/messages/view`

Utilisation:
- Inbox
- `status=all` ou `status=unread`
- `limit` jusqu'a `200`

Champs utiles retournes par Zoho:
- `messageId`
- `threadId`
- `subject`
- `summary`
- `fromAddress`
- `receivedTime`
- `hasAttachment`

### 2. Lire les headers

Endpoint:
- `GET /api/accounts/{accountId}/folders/{folderId}/messages/{messageId}/header`

Utilisation:
- recuperer `Message-Id`
- consolider `From`, `To`, `Subject`
- eviter les doublons

### 3. Lire le contenu

Endpoint:
- `GET /api/accounts/{accountId}/folders/{folderId}/messages/{messageId}/content`

Utilisation:
- obtenir le corps HTML
- deriver une version texte pour qualification

## Alternative rapide si besoin immediat

Option plus simple mais moins propre:
- configurer dans Zoho un `email forwarding` vers une adresse technique d'ingestion
- cette boite technique alimente ensuite Supabase via un parser email ou via n8n

Quand choisir cette option:
- besoin de mise en route tres rapide
- equipe deja a l'aise avec n8n et email parsing

Quand ne pas la privilegier:
- si vous voulez garder les metadonnees Zoho propres
- si vous voulez suivre proprement `messageId`, thread et lecture directe Inbox

## Etapes d'implementation recommandees

### Phase 1
- creer la table `zoho_inbound_messages`
- creer la fonction Supabase `zoho-mail-sync`
- stocker les secrets Zoho dans Supabase secrets
- tester la synchronisation sur Inbox avec `limit=20`

### Phase 2
- ajouter la qualification automatique
- lier les emails aux demandes existantes par adresse email
- marquer les tests evidents

### Phase 3
- ajouter l'onglet back office
- ajouter boutons:
  - `Marquer comme traite`
  - `Proposer un RDV`
  - `Lier a un prospect existant`
  - `Ignorer`

## Mapping metier recommande

Si le contenu contient:
- `devis`, `prix`, `proforma`, `facture`
  - `detected_intent = contact-devis`
- `catalogue`, `brochure`, `programme`
  - `detected_intent = demande-catalogue`
- `former`, `formation`, `participants`, `session`
  - `detected_intent = demande-renseignement`
- `audit`, `diagnostic`, `automatiser`, `cas d'usage`
  - `detected_intent = demande-audit`
- `service client`, `assistant vocal`, `workflow`, `automatisation`
  - `detected_intent = service`

## Point de vigilance

- les exports n8n locaux contiennent encore des secrets sensibles; il faut les nettoyer avant generalisation
- ne pas reutiliser les secrets exposes dans des exports de travail
- privilegier les secrets Supabase et OAuth Zoho propres a la production

## Resultat attendu

Une fois en place:
- les emails entrants Zoho remontent dans le back office
- les prospects formation et service sont visibles en un seul endroit
- l'equipe peut repondre plus vite et proposer un rendez-vous sans tri manuel
