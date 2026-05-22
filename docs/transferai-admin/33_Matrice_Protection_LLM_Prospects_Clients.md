# Matrice de protection LLM - donnees prospects / clients

Date d'analyse: 2026-05-22

Document lie a:

- [Inventaire des donnees prospects / clients - Data Governance & conformite RGPD](./32_Inventory_Form_Fields_RGPD.md)

## Objet

Cette matrice transforme l'inventaire des donnees prospects / clients en regles d'usage concretes pour les API LLM.

## Regle directrice

Mode de securite recommande: `deny-by-default`

Cela signifie:

- aucune donnee prospect / client ne part vers un LLM par defaut;
- seul un sous-ensemble explicitement autorise peut etre envoye;
- l'autorisation depend du type de donnee et du cas d'usage;
- tout champ libre ou identifiant direct est bloque tant qu'il n'a pas ete pseudonymise ou resume localement.

## Legende

- `BLOQUE`: ne jamais envoyer a un LLM externe.
- `PSEUDONYMISER`: transformation obligatoire avant tout envoi.
- `AGREGE UNIQUEMENT`: autorise seulement en statistiques ou tags non reversibles.
- `AUTORISE SOUS CONTROLE`: possible pour un cas d'usage precis avec minimisation stricte.

## Matrice

| Famille de donnees | Exemples | Statut LLM | Regle |
| --- | --- | --- | --- |
| Identifiants directs | nom, prenom, email, telephone, WhatsApp, `profile_name`, entreprise nominative | BLOQUE | Interdiction d'envoi brut aux LLM |
| Secrets et authentification | mot de passe, hash, token d'invitation, `session_id`, `response_id`, `provider_message_id` | BLOQUE | Stockage protege, jamais dans un prompt |
| Texte libre prospect / client | message, motivation, demande, notes, attentes, irritants, contraintes, reponses audit | BLOQUE | Redaction locale ou resume humain avant tout usage |
| Donnees d'audit metier | `form_data`, `i_conf`, `i_rgpd`, `i_sys`, `i_heberg`, `i_pol`, `h_*`, `g_*`, `d_*` | BLOQUE | Hors perimetre LLM par defaut |
| Preferences marketing | domaines newsletter, langue, type de demande | PSEUDONYMISER | Remplacer l'identite par un id technique |
| Donnees de qualification commerciale | secteur, besoin, budget, horizon, format d'accompagnement | PSEUDONYMISER | Autorise seulement si la personne et l'organisation sont masquées |
| Donnees de participation | nombre de participants, type de webinaire, formation cible | AGREGE UNIQUEMENT | Pas de fiche individuelle vers LLM |
| Logs de diffusion | `recipient_email`, statut, erreur, payload | BLOQUE | Autoriser seulement des compteurs agrégés |
| Messages WhatsApp entrants | `body`, `raw_payload`, `internal_notes` | BLOQUE | Pas d'envoi brut; resume local ou manuel uniquement |
| Meta de suivi non identifiante | statut global, compteurs, dates agrégées, volume par canal | AUTORISE SOUS CONTROLE | Si aucune re-identification n'est possible |

## Regles par table

### `contact_requests`

- Champs bloques: `full_name`, `email`, `phone`, `company`, `city`, `country`, `profession`, `message`
- Champs pseudonymisables: `sector`, `request_intent`, `requested_domain`, `ai_maturity`, `use_cases`, `scoping_horizon`, `engagement_format`, `budget_range`
- Condition d'usage: remplacer identite, organisation et texte libre par des tags normalises

### `registration_requests`

- Champs bloques: `first_name`, `last_name`, `email`, `phone`, `company`, `position`, `message`
- Champs pseudonymisables: `formation_title`, `participants`
- Usage autorise: seulement pour produire des tendances de demande par formation ou volume

### `webinar_registrations`

- Champs bloques: `full_name`, `email`, `phone`, `organization`, `city`, `country`, `motivation`, `admin_notes`
- Champs pseudonymisables: `sector`, `domain_key`, `formation_title`, `participants`, `status`
- Usage autorise: segmentation agrégée, pas d'analyse individuelle brute

### `newsletter_subscriptions`

- Champs bloques: `email`
- Champs pseudonymisables: `subscribed_domains`, `language`, `source_page`
- Usage autorise: clustering de preferences seulement apres pseudonymisation

### `partner_listing_reviews`

- Champs bloques: `prospect_name`, `prospect_email`, `company`, `website`, `role`, `city`, `request_message`, `admin_notes`, `response_email_body_fr`, `response_email_body_en`
- Champs pseudonymisables: `sector_activity`, `requested_visibility_type`, `requested_timeline`, `ai_score`, `ai_recommendation`
- Usage autorise: recommandation d'offre seulement sur dossier pseudonymise

### `form_responses`

- Champs bloques: `user_name`, `user_email`, `user_position`, `user_entity`, `form_data`, `session_id`, `invitation_token`
- Usage autorise: aucun en l'etat
- Regle: l'analyse IA doit se faire sur un extract nettoye, approuve, et limite a des variables non identifiantes

### `form_invitations`

- Champs bloques: tous
- Usage autorise: aucun

### `prospect_email_delivery_logs`

- Champs bloques: tous les champs individuels
- Usage autorise: compteurs agrégés par statut, langue, type d'intent

### `newsletter_delivery_logs`

- Champs bloques: `recipient_email`, `provider_message_id`, `payload`, `error_message`
- Champs pseudonymisables: `subscribed_domains`, `language`, `status`
- Usage autorise: statistiques de performance anonymisées

### `catalogue_delivery_logs`

- Champs bloques: `recipient_email`, `delivery_context`, `error_message`
- Champs pseudonymisables: `domain_key`, `status`, `delivery_channel`
- Usage autorise: volumes agrégés par domaine

### `whatsapp_inbound_messages`

- Champs bloques: `from_number`, `to_number`, `profile_name`, `wa_id`, `body`, `raw_payload`, `internal_notes`, `message_sid`, `account_sid`
- Champs pseudonymisables: `category`, `status`, `num_media`
- Usage autorise: catégorisation interne sur extrait redige localement, pas sur message brut

### `whatsapp_email_notification_logs`

- Champs bloques: tous les champs individuels
- Usage autorise: seulement taux d'envoi ou d'echec agrégés

## Cas d'usage LLM autorises

- resumer des tendances agrégées par type de demande, sans identifiants
- proposer des catégories métier normalisées à partir de taxonomies internes, sans texte libre brut
- aider à concevoir une segmentation marketing à partir de compteurs anonymisés
- suggérer une priorisation de pipeline uniquement sur variables pseudonymisées

## Cas d'usage LLM interdits

- envoyer un message prospect brut à un LLM externe
- envoyer le JSON complet du formulaire d'audit
- envoyer des conversations WhatsApp brutes
- envoyer des emails destinataires ou journaux de diffusion détaillés
- envoyer des identifiants de portail prospect, tokens, hashes ou secrets
- générer une recommandation commerciale à partir d'un dossier nominatif complet sans pseudonymisation

## Mesures techniques recommandees avant toute integration LLM

- creer un module unique de `redaction / pseudonymisation` avant tout appel LLM
- definir une `allowlist` de champs par workflow LLM
- journaliser chaque champ transmis vers un LLM
- bloquer en CI ou en revue tout appel LLM qui consomme `form_data`, `message`, `body`, `raw_payload` ou un champ identifiant direct
- separer les usages `analytics agreges` et `copilot operationnel`
- activer une revue humaine pour tout usage qui touche aux donnees prospects / clients

## Decision operationnelle recommandee

- Niveau 1: blocage total des identifiants, secrets, texte libre et audit brut
- Niveau 2: pseudonymisation obligatoire des donnees de qualification
- Niveau 3: seuls les agrégats et tags non ré-identifiants peuvent etre exploités librement pour des usages LLM
