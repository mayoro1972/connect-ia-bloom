# Checklist ultra simple - installation du workflow V1 dans n8n

Ce document sert de checklist pratique pour installer le workflow **V1 multi-prospects** dans n8n sans se perdre.

Workflow source :

- [42_n8n_Prospection_Modele_Elton_V1.json](./42_n8n_Prospection_Modele_Elton_V1.json)

Guide détaillé déjà disponible :

- [46_Guide_Reconstruction_n8n_V1.md](./46_Guide_Reconstruction_n8n_V1.md)

## Avant l'installation

À préparer dans n8n :

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `BOOKING_LINK_45MIN`

## Checklist nœud par nœud

### Déclenchement

- [ ] Créer `Manual Trigger`
- [ ] Créer `Execute Workflow Trigger`

### Cible prospect

- [ ] Créer `Set Target`
- [ ] Ajouter `prospect_id`
- [ ] Ajouter `organization_name`
- [ ] Ajouter `website`
- [ ] Ajouter `country`
- [ ] Ajouter `organization_type`
- [ ] Ajouter `sector_guess`
- [ ] Ajouter `decision_maker_name`
- [ ] Ajouter `custom_page_paths_csv`
- [ ] Ajouter `booking_link_45min`
- [ ] Ajouter `commercial_priority_default`
- [ ] Ajouter `research_scope`

### Construction des sources

- [ ] Créer `Build Source URLs` de type `Code`
- [ ] Coller le bloc de code exact
- [ ] Vérifier que ce nœud produit `page_1_url` à `page_5_url`

### Scrapping

- [ ] Créer `Fetch Public Page 1`
- [ ] Créer `Fetch Public Page 2`
- [ ] Créer `Fetch Public Page 3`
- [ ] Créer `Fetch Public Page 4`
- [ ] Créer `Fetch Public Page 5`
- [ ] Configurer chaque nœud en `HTTP Request` avec méthode `GET`
- [ ] Vérifier les URLs dynamiques depuis `Build Source URLs`

### Normalisation et protection

- [ ] Créer `Normalize Public Signals` de type `Code`
- [ ] Coller le bloc de code exact
- [ ] Vérifier qu’il produit `page_texts`, `public_text`, `roi_clues`
- [ ] Créer `Sanitize Prospect Data For LLM` de type `Code`
- [ ] Coller le bloc de code exact
- [ ] Vérifier qu’il produit `llm_allowed_payload`
- [ ] Vérifier qu’il produit `llm_generation_payload`
- [ ] Vérifier qu’il produit `llm_redaction_summary`

### Analyse OpenAI

- [ ] Créer `Call OpenAI Pre-Audit`
- [ ] Créer `Call OpenAI Problems Solutions`
- [ ] Créer `Call OpenAI ROI`
- [ ] Configurer chaque nœud en `POST`
- [ ] URL `https://api.openai.com/v1/chat/completions`
- [ ] Header `Authorization: Bearer {{$env.OPENAI_API_KEY}}`
- [ ] Header `Content-Type: application/json`
- [ ] Utiliser `{{$env.OPENAI_MODEL || 'gpt-4.1-mini'}}`

### Consolidation

- [ ] Créer `Assemble Prospect Context` de type `Code`
- [ ] Coller le bloc de code exact
- [ ] Vérifier la présence de `entry_point_niche`
- [ ] Vérifier la présence de `recommended_offer`
- [ ] Vérifier la présence de `sector_variant`

### Génération des livrables

- [ ] Créer `Generate Executive Letter`
- [ ] Créer `Generate Tailored Catalogue`
- [ ] Créer `Generate Tailored Audit Form`
- [ ] Créer `Generate Deck Brief`
- [ ] Configurer ces 4 nœuds en `HTTP Request` OpenAI
- [ ] Vérifier que les prompts utilisent `llm_generation_payload`

### Assemblage final

- [ ] Créer `Assemble Prospect Pack` de type `Code`
- [ ] Coller le bloc de code exact
- [ ] Vérifier qu’il génère `pack_id`
- [ ] Vérifier qu’il réinjecte `organization_name`
- [ ] Vérifier qu’il produit `executive_letter`
- [ ] Vérifier qu’il produit `tailored_catalogue`
- [ ] Vérifier qu’il produit `tailored_audit_form`
- [ ] Vérifier qu’il produit `deck_brief`

### Revue manuelle

- [ ] Créer `Mark For Review`
- [ ] Ajouter `workflow_status = ready_for_manual_review`
- [ ] Ajouter `workflow_scope = multi_prospect`

## Checklist des connexions

- [ ] `Manual Trigger` -> `Set Target`
- [ ] `Execute Workflow Trigger` -> `Set Target`
- [ ] `Set Target` -> `Build Source URLs`
- [ ] `Build Source URLs` -> `Fetch Public Page 1`
- [ ] `Fetch Public Page 1` -> `Fetch Public Page 2`
- [ ] `Fetch Public Page 2` -> `Fetch Public Page 3`
- [ ] `Fetch Public Page 3` -> `Fetch Public Page 4`
- [ ] `Fetch Public Page 4` -> `Fetch Public Page 5`
- [ ] `Fetch Public Page 5` -> `Normalize Public Signals`
- [ ] `Normalize Public Signals` -> `Sanitize Prospect Data For LLM`
- [ ] `Sanitize Prospect Data For LLM` -> `Call OpenAI Pre-Audit`
- [ ] `Sanitize Prospect Data For LLM` -> `Call OpenAI Problems Solutions`
- [ ] `Sanitize Prospect Data For LLM` -> `Call OpenAI ROI`
- [ ] `Call OpenAI Pre-Audit` -> `Assemble Prospect Context`
- [ ] `Assemble Prospect Context` -> `Generate Executive Letter`
- [ ] `Assemble Prospect Context` -> `Generate Tailored Catalogue`
- [ ] `Assemble Prospect Context` -> `Generate Tailored Audit Form`
- [ ] `Assemble Prospect Context` -> `Generate Deck Brief`
- [ ] `Generate Executive Letter` -> `Assemble Prospect Pack`
- [ ] `Assemble Prospect Pack` -> `Mark For Review`

## Test minimum après installation

- [ ] Lancer avec un prospect test
- [ ] Vérifier les 5 pages publiques récupérées
- [ ] Vérifier la création de `llm_redaction_summary`
- [ ] Vérifier qu’aucun e-mail ou téléphone ne passe dans le payload LLM
- [ ] Vérifier que le courrier est généré
- [ ] Vérifier que le mini-catalogue est généré
- [ ] Vérifier que le workflow finit sur `ready_for_manual_review`
