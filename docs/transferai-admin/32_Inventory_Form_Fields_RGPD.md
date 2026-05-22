# Inventaire des donnees prospects / clients - Data Governance & conformite RGPD

Date d'analyse: 2026-05-22

## Objectif

Ce document recense, a partir du code du site web et des schemas de stockage Supabase, l'ensemble des donnees prospects / clients effectivement collectees, stockees ou derivees afin de:

- identifier les donnees personnelles et les donnees potentiellement sensibles;
- definir les donnees a exclure des LLM;
- cadrer les mesures de chiffrement, de controle d'acces et de minimisation.

## Portee

Analyse realisee sur le depot local `connect-ia-bloom`.

Sources principales:

- `src/pages/Contact.tsx`
- `src/pages/ProspectRequestPage.tsx`
- `src/pages/Inscription.tsx`
- `src/pages/WebinarRegistration.tsx`
- `src/pages/WebinarSeatRequest.tsx`
- `src/components/BlogNewsletterSignup.tsx`
- `src/pages/LeadFormsPreview.tsx`
- `src/components/CatalogueDownloadModal.tsx`
- `supabase/functions/newsletter-subscribe/index.ts`
- `supabase/functions/save-form-response/index.ts`
- `supabase/migrations/20260404223000_create_lead_submission_tables.sql`
- `supabase/migrations/20260405133000_secure_public_data_flows.sql`
- `supabase/migrations/20260411163000_create_partner_listing_pipeline.sql`
- `supabase/migrations/20260417170000_secure_audit_prospect_portal.sql`
- `supabase/migrations/20260417173000_add_prospect_type_to_contact_requests.sql`
- `supabase/migrations/20260419150436_8f66b427-529f-4a2b-9b66-9a7c6774cd57.sql`
- `supabase/migrations/20260419185451_b9e9a3fe-7688-4685-954c-1ea005a128fe.sql`
- `supabase/migrations/20260427110000_enable_webinar_registration_flow.sql`
- `public/formulaire-audit-ia/assets/index-E2-00_3j.js`

Note: ce document se base sur le code et les schemas. Il ne valide pas le contenu reel de la base de production.

## Regles de classification retenues

- `PII directe`: nom, email, telephone, ville, pays, entreprise, fonction, identifiants de connexion.
- `Confidentiel metier`: texte libre, priorites, irritants, processus, usages, contraintes techniques, outils, systemes, budgets, horizon de projet.
- `Secret / authentification`: mot de passe, hash, token d'invitation, session id, identifiant de reponse.
- `Meta technique`: statut, date de suivi, source_page, language, champs de routage email.

## Regle LLM par defaut

Par defaut, les champs suivants doivent etre exclus de tout prompt LLM:

- tous les identifiants directs;
- tous les secrets et jetons;
- tous les champs texte libres;
- tous les champs de gouvernance, securite, conformite, infrastructure ou systemes internes;
- tout contenu exportable du formulaire d'audit;
- tout champ de routage email interne.

Ne peuvent etre envoyes aux LLM que des donnees:

- minimisées;
- pseudonymisées;
- agregees;
- non reversibles vers une personne ou une organisation precise.

## Inventaire par point de collecte

### 1. Contact / devis / catalogue / renseignement / brief solution IA

Route: `/contact`

Stockage principal: `contact_requests`

Champs saisis:

- `name`
- `email`
- `phone`
- `company`
- `formations`
- `sector`
- `city`
- `participants`
- `message`
- `privacyAccepted`
- `botField`
- `aiMaturity`
- `useCases[]`
- `scopingHorizon`
- `engagementFormat[]`
- `budgetRange`
- `solutionTypes[]`
- `processFrequency`
- `existingTools[]`
- `dataAvailability[]`
- `hasTechReferent`

Colonnes stockees ou derivees:

- `full_name`
- `email`
- `phone`
- `company`
- `sector`
- `city`
- `participants`
- `requested_formations`
- `message`
- `source_page`
- `language`
- `request_intent`
- `requested_domain`
- `privacy_consent`
- `ai_maturity`
- `use_cases`
- `scoping_horizon`
- `engagement_format`
- `budget_range`

Classification:

- `PII directe`: `full_name`, `email`, `phone`, `company`, `city`
- `Confidentiel metier`: `message`, `requested_formations`, `requested_domain`, `ai_maturity`, `use_cases`, `scoping_horizon`, `engagement_format`, `budget_range`, `solutionTypes`, `existingTools`, `dataAvailability`, `hasTechReferent`
- `A exclure des LLM`: tous les champs ci-dessus sauf eventuellement des tags agregees et anonymises

### 2. Demande d'audit gratuit

Route: `/demande-audit-gratuit`

Stockage principal: `contact_requests`

Champs saisis:

- `fullName`
- `email`
- `phone`
- `profession`
- `country`
- `sector`
- `city`
- `message`
- `password`
- `confirmPassword`
- `wantsExpertAppointment`
- `privacyAccepted`
- `botField`

Colonnes stockees ou derivees:

- `full_name`
- `email`
- `phone`
- `company` (alimente depuis `profession`)
- `profession`
- `country`
- `city`
- `sector`
- `message`
- `request_intent = demande-audit`
- `requested_domain = Audit IA gratuit`
- `privacy_consent`
- `wants_expert_appointment`
- `prospect_username`
- `prospect_password_hash`
- `prospect_portal_status`
- `audit_followup_status`
- `audit_followup_scheduled_at`
- `audit_followup_sent_at`
- `audit_followup_error`
- `prospect_type`
- selon migrations du portail: `audit_invite_token`, `audit_invite_expires_at`, `last_portal_login_at`

Classification:

- `PII directe`: `full_name`, `email`, `phone`, `profession`, `country`, `city`, `sector`
- `Secret / authentification`: `password`, `confirmPassword`, `prospect_username`, `prospect_password_hash`, `audit_invite_token`
- `Confidentiel metier`: `message`, demande d'echange expert
- `A exclure des LLM`: tous les champs sauf statistiques agregees

### 3. Inscription formation

Route: `/inscription`

Stockage principal: `registration_requests`

Champs saisis:

- `firstName`
- `lastName`
- `email`
- `phone`
- `company`
- `position`
- `formation`
- `participants`
- `message`
- `privacyAccepted`
- `botField`

Colonnes stockees:

- `first_name`
- `last_name`
- `email`
- `phone`
- `company`
- `position`
- `formation_id`
- `formation_title`
- `participants`
- `message`
- `source_page`
- `language`
- `privacy_consent`

Classification:

- `PII directe`: `first_name`, `last_name`, `email`, `phone`, `company`, `position`
- `Confidentiel metier`: `formation_title`, `message`, `participants`
- `A exclure des LLM`: tous les champs individuels

### 4. Webinaire gratuit

Route: `/webinars/register`

Stockage principal: `webinar_registrations`

Champs saisis:

- `full_name`
- `email`
- `phone`
- `country`
- `city`
- `organization`
- `position`
- `sector`
- `sector_other`
- `domain_key`
- `domain_other`
- `formation_id`
- `formation_other`
- `participants`
- `language`
- `motivation`
- `privacy_consent`
- `honeypot`

Colonnes stockees ou derivees:

- `full_name`
- `email`
- `phone`
- `country`
- `city`
- `organization`
- `position`
- `sector`
- `sector_other`
- `domain_key`
- `domain_other`
- `formation_id`
- `formation_title`
- `formation_other`
- `participants`
- `language`
- `motivation`
- `source_page`
- `privacy_consent`
- `scheduled_date`
- `status`
- `admin_notes`
- `date_confirmed_at`
- `reminder_sent_at`

Classification:

- `PII directe`: `full_name`, `email`, `phone`, `country`, `city`, `organization`, `position`
- `Confidentiel metier`: `motivation`, `sector`, `domain_key`, `formation_title`
- `A exclure des LLM`: texte libre et identifiants directs

### 5. Demande de place a un webinaire premium

Route: `/webinars/seat-request`

Stockage principal: `webinar_registrations`

Champs saisis:

- identiques au webinaire gratuit

Particularite:

- `motivation` est enrichi avec un marqueur de contexte `DEMANDE DE PLACE - WEBINAIRE PAYANT`

Classification:

- identique au webinaire gratuit
- `A exclure des LLM`: identique, avec attention supplementaire sur `motivation`

### 6. Newsletter

Point d'entree: `BlogNewsletterSignup`

Stockage principal: `newsletter_subscriptions`

Champs saisis:

- `email`
- `language`
- `subscribed_domains[]`
- `source_page`

Colonnes stockees:

- `email`
- `language`
- `source_page`
- `subscribed_domains`
- `status`

Classification:

- `PII directe`: `email`
- `Profilage marketing`: `subscribed_domains`, `language`, `source_page`
- `A exclure des LLM`: `email`; `subscribed_domains` uniquement en agrege

### 7. Demande de referencement partenaire

Routes: `LeadFormsPreview`, flux de type `demande-referencement`

Stockage principal: `partner_listing_reviews` et `contact_requests`

Champs saisis:

- `fullName`
- `email`
- `phone`
- `company`
- `website`
- `role`
- `country`
- `domain`
- `format`
- `timeline`
- `message`
- `privacyAccepted`
- `botField`

Colonnes stockees ou derivees dans `partner_listing_reviews`:

- `prospect_name`
- `prospect_email`
- `company`
- `website`
- `role`
- `city`
- `sector_activity`
- `requested_visibility_type`
- `requested_timeline`
- `request_message`
- `review_status`
- `response_due_at`
- champs IA / metier derives: `ai_score`, `ai_recommendation`, `ai_provider`, `ai_reasoning`, `recommended_offer_key`, `recommended_duration_months`, `recommended_price_fcfa`, `recommended_deliverables`, `response_email_subject`, `response_email_body_fr`, `response_email_body_en`, `assigned_to`, `admin_notes`, `meta`

Classification:

- `PII directe`: `prospect_name`, `prospect_email`, `phone`, `company`, `website`, `role`, `city`
- `Confidentiel metier`: `request_message`, `sector_activity`, `requested_visibility_type`, `requested_timeline`, champs d'evaluation IA
- `A exclure des LLM`: toute la fiche brute, surtout `request_message`, `ai_reasoning`, `admin_notes`

### 8. Formulaire d'audit IA multi-sectoriel

Route publique: `/formulaire-audit-ia/index.html`

Stockage principal: `form_responses`

Colonnes stockees:

- `user_name`
- `user_email`
- `user_position`
- `user_entity`
- `form_data` (JSON complet)
- `is_completed`
- `completion_percentage`
- `session_id`
- `invitation_token`

Sous-ensemble de `form_data` identifie dans le build livre:

- Identite et cadrage:
  - `c_nom`
  - `c_email`
  - `c_poste`
  - `c_entite`
  - `c_domaine`
  - `c_domaines_associes`
  - `eng1`
  - `eng2`
  - `eng3`
  - `eng4`

- Charge de travail:
  - `ch1_h` a `ch8_h`
  - `ch1_r` a `ch8_r`
  - `a_emails`
  - `a_reunions`
  - `a_rapports`
  - `a_sources`
  - `a_dossiers`
  - `a_missions`
  - `a_perdues`

- Ajustements et priorites:
  - `c_inexact`
  - `c_exclure`
  - `c_prio1`
  - `c_prio2`
  - `c_prio3`
  - `c_attentes`

- Maturite / early adopter:
  - `sc1`
  - `sc2`
  - `sc3`
  - `sc4`
  - `sc5`
  - `d_outils`
  - `d_usage`
  - `d_plus`
  - `d_moins`
  - `fmt1`
  - `fmt2`
  - `fmt3`
  - `fmt4`
  - `fmt5`
  - `d_format_autre`

- Inventaire libre et routines:
  - `f_matin`
  - `f_matinee`
  - `f_apm`
  - `f_soir`
  - `f_lundi`
  - `f_vendredi`
  - `f_mois`
  - `f_trim`
  - `f_annuel`
  - `f_deplac`
  - `g_doublons`
  - `g_nuit`

- Vision cible:
  - `h_une`
  - `h_pourquoi`
  - `h_vision`
  - `h_delegate`
  - `h_humain`
  - `h_awa`
  - `h_kpi`

- Contraintes et conformite:
  - `i_conf`
  - `i_rgpd`
  - `i_heberg`
  - `i_appro`
  - `i_sys`
  - `i_cal`
  - `i_pol`
  - `i_autres`

- Champs dynamiques:
  - `tb-<domainKey>-<groupIndex>_f<taskIndex>`
  - `tb-<domainKey>-<groupIndex>_t<taskIndex>`
  - `tb-<domainKey>-<groupIndex>_c<taskIndex>`
  - `lib_d<N>`
  - `lib_f<N>`
  - `lib_t<N>`
  - `lib_a<N>`
  - `irr<N>_desc`
  - `irr<N>_t`
  - `irr<N>_s`
  - `libreRowCount`
  - `lib_rowcount`

- Champs de routage / export internes presents dans `form_data`:
  - `email_dest`
  - `email_cc`
  - `email_msg`

Classification:

- `PII directe`: `c_nom`, `c_email`, `c_poste`, `c_entite`
- `Confidentiel metier eleve`: presque tous les champs `a_*`, `c_*`, `d_*`, `f_*`, `g_*`, `h_*`, `i_*`, `tb-*`, `lib_*`, `irr*`
- `Secret / authentification`: `session_id`, `invitation_token`, `response_id` si reutilise dans le flux
- `A exclure des LLM`: le JSON `form_data` complet par defaut

Observation critique:

- le formulaire d'audit collecte des textes libres pouvant contenir des donnees sensibles au sens operationnel, voire des categories particulieres RGPD selon les reponses des utilisateurs;
- `i_conf`, `i_rgpd`, `i_heberg`, `i_sys`, `i_pol` et `email_*` doivent etre traites comme hautement sensibles;
- le stockage en `jsonb` augmente le risque d'exfiltration non maitrisee si le filtrage LLM est permissif.

### 9. Invitations d'audit

Stockage principal: `form_invitations`

Champs stockes:

- `invitee_name`
- `invitee_email`
- `invite_token`
- `expires_at`
- `status`
- `draft_form_data`
- `response_id`

Classification:

- `PII directe`: `invitee_name`, `invitee_email`
- `Secret / authentification`: `invite_token`
- `Confidentiel metier`: `draft_form_data`
- `A exclure des LLM`: tous les champs

### 10. Modal de telechargement catalogue

Composant: `CatalogueDownloadModal`

Champs saisis:

- `name`
- `email`
- `company`

Observation:

- dans le code actuel, ces champs declenchent un `toast` local mais ne sont pas persistes cote backend;
- le composant doit etre surveille si une persistence est ajoutee plus tard.

### 11. Logs d'emails prospects / clients

Stockage principal: `prospect_email_delivery_logs`

Champs stockes:

- `request_id` ou `contact_request_id` selon migration / fonction
- `intent`
- `recipient_email`
- `recipient_type`
- `subject`
- `status`
- `provider_message_id`
- `error_message`
- `language`
- `sent_at`
- `meta`

Classification:

- `PII directe`: `recipient_email`
- `Confidentiel metier`: `subject`, `error_message`, `meta`, `intent`
- `A exclure des LLM`: tous les champs

### 12. Logs de diffusion newsletter

Stockage principal: `newsletter_delivery_logs`

Champs stockes:

- `newsletter_issue_id`
- `recipient_email`
- `delivery_type`
- `status`
- `provider`
- `provider_message_id`
- `language`
- `subscribed_domains`
- `sent_at`
- `error_message`
- `payload`

Classification:

- `PII directe`: `recipient_email`
- `Profilage marketing`: `subscribed_domains`, `language`
- `Confidentiel technique`: `provider_message_id`, `payload`, `error_message`
- `A exclure des LLM`: tous les champs individuels

### 13. Logs de livraison catalogue

Stockage principal: `catalogue_delivery_logs`

Champs stockes:

- `contact_request_id`
- `domain_key`
- `recipient_email`
- `delivery_channel`
- `asset_id`
- `status`
- `delivery_context`
- `error_message`
- `sent_at`

Classification:

- `PII directe`: `recipient_email`
- `Confidentiel metier`: `domain_key`, `delivery_context`
- `Confidentiel technique`: `error_message`
- `A exclure des LLM`: tous les champs individuels

### 14. Messages entrants WhatsApp

Stockage principal: `whatsapp_inbound_messages`

Champs stockes:

- `message_sid`
- `account_sid`
- `from_number`
- `to_number`
- `profile_name`
- `body`
- `num_media`
- `message_status`
- `wa_id`
- `raw_payload`
- `is_read`
- `status`
- `category`
- `internal_notes`
- `handled_at`
- `last_action_at`

Classification:

- `PII directe`: `from_number`, `to_number`, `profile_name`, `wa_id`
- `Confidentiel metier`: `body`, `internal_notes`, `category`
- `Secret / technique`: `message_sid`, `account_sid`, `raw_payload`
- `A exclure des LLM`: `body`, `raw_payload`, `internal_notes` et tout identifiant

### 15. Logs de notification email depuis WhatsApp

Stockage principal: `whatsapp_email_notification_logs`

Champs stockes:

- `whatsapp_message_id`
- `message_sid`
- `recipient_email`
- `notification_type`
- `provider`
- `provider_message_id`
- `status`
- `subject`
- `error_message`
- `meta`
- `sent_at`

Classification:

- `PII directe`: `recipient_email`
- `Confidentiel metier`: `subject`, `meta`
- `Secret / technique`: `message_sid`, `provider_message_id`
- `A exclure des LLM`: tous les champs

### 16. Jobs de relance partenaire

Stockage principal: `partner_followup_jobs`

Champs stockes:

- `partner_listing_review_id`
- `job_status`
- `scheduled_for`
- `sent_at`
- `provider`
- `provider_message_id`
- `attempt_count`
- `last_error`
- `meta`

Classification:

- `Meta operationnelle`: `job_status`, `scheduled_for`, `sent_at`, `attempt_count`
- `Confidentiel technique`: `provider_message_id`, `last_error`, `meta`
- `A exclure des LLM`: `meta` et tout champ rattachable a un prospect si joint avec d'autres tables

## Donnees les plus critiques a sortir du perimetre LLM

Liste prioritaire:

- `full_name`, `first_name`, `last_name`, `email`, `phone`, `company`, `organization`, `position`, `profession`, `city`, `country`
- `prospect_username`, `prospect_password_hash`, `audit_invite_token`, `invite_token`, `session_id`, `response_id`
- `message`, `motivation`, `request_message`, `admin_notes`, `ai_reasoning`, `response_email_body_fr`, `response_email_body_en`
- tout `form_responses.form_data`
- `i_conf`, `i_rgpd`, `i_heberg`, `i_sys`, `i_pol`, `i_appro`
- `recipient_email` dans tous les logs de diffusion / livraison
- `from_number`, `to_number`, `profile_name`, `body`, `raw_payload`, `internal_notes` des flux WhatsApp
- `email_dest`, `email_cc`, `email_msg`

## Actions prioritaires recommandees

- Creer une politique explicite `LLM_ALLOWED_FIELDS` par formulaire et interdire tout le reste par defaut.
- Sortir `form_responses.form_data` du perimetre LLM, sauf extraction prealable vers un schema pseudonymise et approuve.
- Chiffrer au repos ou au minimum par champ les secrets et les donnees de portail prospect.
- Mettre sous acces restreint les tables `contact_requests`, `form_responses`, `form_invitations`, `partner_listing_reviews`, `webinar_registrations`, `newsletter_subscriptions`.
- Ajouter une regle de purge / retention pour `form_responses`, `form_invitations`, `prospect_email_delivery_logs`, `newsletter_delivery_logs`.
- Ajouter un controle de redaction avant tout appel LLM sur les champs texte libres.
- Documenter une base PIA specifique pour le formulaire d'audit, car il concentre donnees metier, gouvernance et signaux potentiellement sensibles.

## Limites

- aucun dump de production n'a ete inspecte;
- la structure dynamique de la section B du formulaire d'audit depend du domaine choisi et cree des cles additionnelles a l'execution;
- les textes libres peuvent contenir des donnees sensibles non prevues par le schema.
