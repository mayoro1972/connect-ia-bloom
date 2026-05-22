# Policies RLS - prospection multi-prospects

Ce document décrit le verrouillage RLS recommandé pour les nouvelles tables de prospection.

Migration créée :

- [20260522173000_secure_ai_multi_prospecting_pipeline_rls.sql](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/migrations/20260522173000_secure_ai_multi_prospecting_pipeline_rls.sql)

## Objectif

Avant mise en production, les données de prospection doivent être accessibles uniquement par les composants de confiance :

- workflows n8n
- Edge Functions
- traitements internes utilisant `service_role`

## Choix de sécurité retenu

La politique retenue est volontairement stricte :

- aucun accès `anon`
- aucun accès `authenticated` par défaut
- accès complet réservé à `service_role`

## Tables verrouillées

- `prospect_targets`
- `ai_prospecting_packs`
- `outreach_attempts`
- `do_not_contact`
- `prospecting_batch_runs`
- `prospecting_batch_run_items`
- vue `prospect_targets_ready_for_batch`

## Ce que fait la migration

1. `revoke all` sur les rôles `anon` et `authenticated`
2. `grant all` aux workflows internes via `service_role`
3. création de policies `Service role full access ...`

## Pourquoi ce choix est sain

Ces tables contiennent potentiellement :

- des coordonnées de prospects
- des statuts de réponse
- des packs commerciaux générés
- des logs d’envoi
- des informations d’opposition ou d’arrêt

Ce ne sont donc pas des tables qui doivent être exposées au front public.

## Point d’attention

Si, plus tard, tu veux un back-office connecté pour des utilisateurs internes humains, il faudra ajouter des policies ciblées pour :

- certains utilisateurs `authenticated`
- certains rôles applicatifs
- certains périmètres de lecture ou de mise à jour

Mais pour la mise en production initiale, ce verrouillage `service_role only` est la bonne base.
