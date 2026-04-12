# Intégration technique · Audit IA Gratuit

## Objectif

Connecter la page Audit IA, le one-pager entreprise, les emails sectoriels et une future automatisation dans le site et le back-office.

## Source de vérité locale

- Référentiel principal : `src/data/audit-offer-content.ts`
- Page publique : `src/pages/AuditIA.tsx`
- Route publique : `/audit-ia-gratuit`
- Exports documentaires : `docs/transferai-audit/`

## Base de données recommandée dans Supabase

### 1. `audit_domain_templates`
- `id` uuid primary key
- `domain_key` text unique
- `domain_label_fr` text
- `domain_label_en` text
- `audience_fr` text
- `audience_en` text
- `email_subject_fr` text
- `email_subject_en` text
- `email_preheader_fr` text
- `email_preheader_en` text
- `body_intro_fr` text
- `body_intro_en` text
- `body_diagnostic_fr` text
- `body_diagnostic_en` text
- `body_benefits_lead_fr` text
- `body_benefits_lead_en` text
- `body_benefits_fr` jsonb
- `body_benefits_en` jsonb
- `body_close_fr` text
- `body_close_en` text
- `cta_fr` text
- `cta_en` text
- `updated_at` timestamptz

### 2. `audit_enterprise_leads`
- `id` uuid primary key
- `created_at` timestamptz
- `full_name` text
- `email` text
- `phone` text
- `company` text
- `role` text
- `country` text
- `domain_key` text
- `sector_context` text
- `audit_need` text
- `status` text default 'received'
- `assigned_to` text null
- `notes` text null

### 3. `audit_email_runs`
- `id` uuid primary key
- `lead_id` uuid references `audit_enterprise_leads(id)`
- `domain_key` text
- `template_id` uuid references `audit_domain_templates(id)`
- `language` text default 'fr'
- `delivery_type` text
- `status` text
- `sent_at` timestamptz null
- `error_message` text null

## Edge functions recommandées

### 1. `audit-email-preview`
But :
- prendre `lead_id` et `domain_key`
- injecter le template domaine
- produire un sujet, préheader et corps final personnalisés

### 2. `audit-email-send`
But :
- envoyer le mail réel au prospect
- journaliser l'envoi dans `audit_email_runs`

### 3. `audit-weekly-followup`
But :
- relancer automatiquement les leads audit non traités ou non convertis
- utiliser un modèle plus court orienté reprise de contact

## Back-office recommandé

Ajouter un onglet `Audit IA` avec :
- demandes reçues
- messages par domaine
- aperçu email
- envoi test
- envoi réel
- historique des relances

## Automatisation recommandée

### Niveau 1
- humain valide
- système envoie

### Niveau 2
- IA prépare un brouillon sectoriel
- humain ajuste
- système envoie

### Niveau 3
- planification hebdomadaire
- relances automatiques sur domaines prioritaires
- journal des performances d'ouverture et de clics

## Logique de conversion recommandée

1. page publique `/audit-ia-gratuit`
2. formulaire audit
3. accusé de réception
4. email sectoriel adapté
5. proposition de rendez-vous ou cadrage
6. orientation vers formation, certification ou accompagnement
