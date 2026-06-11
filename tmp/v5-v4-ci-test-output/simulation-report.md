# Rapport de test V5 → V4

Date du test : 2026-06-04T22:36:10.664Z

## Hypothèse de test

- Test local à blanc basé sur les règles exactes des nœuds V5 et V4.
- Aucun appel réel à n8n, OpenAI, Resend ou Supabase n'a été effectué.
- Quota journalier simulé : 2
- Limite de batch simulée : 10

## Lot fourni

- Ligue Ivoirienne des Secrétaires | assistanat et secrétariat | site manquant
- Orange Côte d'Ivoire | télécommunications et relation client | https://www.orange.ci
- MTN Côte d'Ivoire | télécommunications et service client | https://www.mtn.ci

## Résultat V5

- Leads reçus : 3
- Leads valides pour upsert CRM : 2
- Leads rejetés avant CRM : 1

### Leads rejetés avant CRM
- Ligue Ivoirienne des Secrétaires : website manquant ou profil minimal incomplet

## Résultat V4

- Prospects dispatchés vers V3 : 2
- Prospects bloqués / différés : 0

### Dispatchés vers V3
- Orange Côte d'Ivoire | https://www.orange.ci | tier tier1 | batch_status=dispatched_to_v3
- MTN Côte d'Ivoire | https://www.mtn.ci | tier tier1 | batch_status=dispatched_to_v3

## Lecture métier

- La Ligue Ivoirienne des Secrétaires permet de tester le contrôle qualité amont si le site n'est pas encore confirmé.
- Orange Côte d'Ivoire et MTN Côte d'Ivoire représentent deux cas pertinents pour le terrain service client / relation client multicanal.
- Si tu veux un test 100% dispatché vers V3, il faudra compléter un site web vérifié pour la Ligue Ivoirienne des Secrétaires.