# Guide d’installation V3

## Nœud par nœud

**Workflow :** TransferAI Prospecting V3 CRM Enhanced [FINAL]  
**Fichier de référence :** `docs/transferai-admin/62_n8n_Prospection_V3_CRM_final.json`  
**Version consolidée :** 2 juin 2026  
**État réel du workflow :** 50 nœuds  
**Référentiel utilisé :** workflow V3 final, renderers Supabase, guides utilisateur et troubleshooting, revue des branches locales et des répertoires Claude / OpenAI présents sur la machine.

## 1. Ce qui a changé depuis l’ancienne version du guide

- Le workflow n’est plus à 44 nœuds mais à **50 nœuds**.
- Le pipeline V3 inclut maintenant une vraie chaîne de rendu catalogue :
  - `Build Catalogue Render Payload`
  - `Render Catalogue Artifact`
  - `Merge Catalogue Artifact`
- Le pipeline V3 inclut maintenant une vraie chaîne de rendu deck PPTX :
  - `Build Deck Render Payload`
  - `Render Deck Artifact`
  - `Merge Deck Artifact`
- `Build Send Context` accepte désormais des pièces jointes avec `content` **ou** `path`.
- Le flux cible impose désormais **2 pièces jointes finales** :
  - 1 catalogue PDF
  - 1 deck PPTX
- Le fallback `Deck_Brief_[Prospect].json` ne fait plus partie du flux d’envoi cible.
- Les nœuds OpenAI du workflow versionné doivent s’appuyer sur `OPENAI_API_KEY` via variable d’environnement, et non sur une clé en dur.
- Le deck premium dynamique et le mini-catalogue s’appuient maintenant sur les fonctions Supabase `deck-renderer` et `catalogue-renderer`.

## 2. Prérequis d’installation

- Une instance n8n accessible et opérationnelle
- Le workflow JSON V3 final
- Un projet Supabase opérationnel
- Le bucket public `prospecting-artifacts`
- Les tables Supabase minimales :
  - `ai_prospecting_packs`
  - `outreach_attempts`
  - `prospect_targets`
- Les fonctions Supabase déployées :
  - `catalogue-renderer`
  - `deck-renderer`
- Un compte Resend opérationnel

## 3. Variables et secrets recommandés

### Variables n8n à définir

- `OPENAI_API_KEY`
- `CONTENT_ADMIN_TOKEN`
- `OUTREACH_FROM_EMAIL`
- `INTERNAL_REVIEW_EMAIL`

### Secrets à externaliser avant production

Le workflow de référence contient encore des tokens et clés directement dans certains nœuds REST Supabase et Resend. Avant production, il est recommandé de remplacer ces valeurs par des variables d’environnement ou des credentials n8n.

À externaliser en priorité :

- `apikey` Supabase dans les nœuds REST
- `Authorization: Bearer ...` Supabase dans les nœuds REST
- `Authorization: Bearer ...` Resend dans les nœuds email

## 4. Architecture actuelle

### Phases actuelles

1. Déclencheurs  
2. Initialisation  
3. Scraping web  
4. Normalisation et protection LLM  
5. Analyse IA  
6. Génération de contenu  
7. Assemblage et rendu d’artefacts  
8. Stockage et validation interne  
9. Approbation webhook  
10. Préparation d’envoi prospect  
11. Post-envoi, logs et statuts  
12. Rejet et erreurs

### Chaîne principale actuelle

`Assemble Prospect Pack -> Build Catalogue Render Payload -> Render Catalogue Artifact -> Merge Catalogue Artifact -> Build Deck Render Payload -> Render Deck Artifact -> Merge Deck Artifact -> Store Pack In Supabase -> Build Approval Email -> Send Internal Approval Email`

### Chaîne d’approbation et d’envoi

`Approval Webhook -> Parse Approval Query -> Get Pack From Supabase -> Extract Pack Payload -> If Approved -> Build Send Context -> If Ready To Send -> Mark Pack Approved -> Send External Prospect Email -> Parse Send Result -> Mark Pack Sent`

## 5. Règles critiques à connaître

- `Render Catalogue Artifact` et `Render Deck Artifact` utilisent :
  - `Authentication = None`
  - header `x-admin-token`
- `Store Pack In Supabase` doit recevoir la sortie de `Merge Deck Artifact`
- `Build Send Context` doit retourner :
  - `attachments_count = 2`
  - 1 fichier `.pdf`
  - 1 fichier `.pptx`
  - `can_send = true`
- Le deck premium dynamique doit rester dans une plage de **8 à 10 slides** selon la densité du contenu

## 6. Guide nœud par nœud

### Phase 1 — Déclencheurs

1. **Manual Trigger**  
   Type : `manualTrigger v1`  
   Rôle : déclenchement manuel depuis l’interface n8n.  
   Action : aucune configuration spécifique.

2. **Execute Workflow Trigger**  
   Type : `executeWorkflowTrigger v1`  
   Rôle : point d’entrée quand V4 ou un autre workflow appelle V3 automatiquement.  
   Action : aucune configuration spécifique.

### Phase 2 — Initialisation

3. **Set Target**  
   Type : `set v3.4`  
   Rôle : injecte les données prospect et applique les valeurs par défaut.  
   Points de vigilance :
   - `organization_name`
   - `website`
   - `country`
   - `organization_type`
   - `sector_guess`
   - `decision_maker_name`
   - `target_email`
   - `prospect_language`
   - `commercial_priority_default`
   - `booking_link_45min` pointe maintenant vers `https://calendly.com/contact-transferai/30min`

### Phase 3 — Scraping web

4. **Build Source URLs**  
   Type : `code v2`  
   Rôle : construit les URLs de scraping à partir du site prospect.
   Bon réflexe :
   - privilégier `/`, `/services/`, `/solutions/`, `/contact/` et `/blog/` par défaut
   - utiliser `custom_page_paths_csv` dès qu'un site a un slug spécifique comme `/la-smb/` au lieu de `/a-propos/`

5. **Fetch Public Page 1**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 1 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

6. **Fetch Public Page 2**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 2 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

7. **Fetch Public Page 3**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 3 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

8. **Fetch Public Page 4**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 4 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

9. **Fetch Public Page 5**  
   Type : `httpRequest v4.2`  
   Rôle : récupère la page 5 du site.
   Réglage recommandé :
   - `On Error -> Continue (regular output)`

10. **Normalize Public Signals**  
    Type : `code v2`  
    Rôle : agrège, nettoie et réduit le contenu textuel public.

### Phase 4 — Protection et analyse IA

11. **Sanitize Prospect Data For LLM**  
    Type : `code v2`  
    Rôle : pseudonymise et prépare les données pour les appels OpenAI.

12. **Call OpenAI Pre-Audit**  
    Type : `httpRequest v4.2`  
    Rôle : produit le pré-diagnostic prospect.  
    Changement clé :
    - l’autorisation OpenAI doit utiliser `{{$env.OPENAI_API_KEY}}`

13. **Call OpenAI Problems Solutions**  
    Type : `httpRequest v4.2`  
    Rôle : identifie les problèmes et solutions vendables.  
    Changement clé :
    - l’autorisation OpenAI doit utiliser `{{$env.OPENAI_API_KEY}}`

14. **Call OpenAI ROI**  
    Type : `httpRequest v4.2`  
    Rôle : estime hypothèses ROI, quick wins et timeline.  
    Changement clé :
    - l’autorisation OpenAI doit utiliser `{{$env.OPENAI_API_KEY}}`

15. **Assemble Prospect Context**  
    Type : `code v2`  
    Rôle : fusionne les sorties des 3 appels IA avec le contexte prospect.  
    Changement clé :
    - renforce les fallbacks métier pour `recommended_use_case`, `best_selling_use_case`, `commercial_priority_tier` et `recommended_offer`

### Phase 5 — Génération de contenu

16. **Generate Executive Letter**  
    Type : `httpRequest v4.2`  
    Rôle : génère le courrier prospect.  
    Changement clé :
    - français avec accents pour les prospects francophones

17. **Generate Tailored Catalogue**  
    Type : `httpRequest v4.2`  
    Rôle : génère le mini-catalogue personnalisé.  
    Changement clé :
    - prompts FR / EN / ES alignés avec accents pour FR et ES

18. **Generate Tailored Audit Form**  
    Type : `httpRequest v4.2`  
    Rôle : génère le formulaire d’audit pré-RDV.  
    Changement clé :
    - ton et langue harmonisés avec le reste du pack

19. **Generate Deck Brief**  
    Type : `httpRequest v4.2`  
    Rôle : génère le brief structuré du deck.  
    Changement clé :
    - prompts localisés, base du deck premium dynamique

### Phase 6 — Assemblage du pack et rendu catalogue

20. **Assemble Prospect Pack**  
    Type : `code v2`  
    Rôle : assemble tous les livrables intermédiaires dans un pack unique.

21. **Build Catalogue Render Payload**  
    Type : `code v2`  
    Rôle : construit le payload complet du `catalogue-renderer`.  
    Contient :
    - `pack_id`
    - `organization_name`
    - `decision_maker_name`
    - `website`
    - `sector_guess`
    - `organization_type`
    - `recommended_offer`
    - `recommended_use_case`
    - `best_selling_use_case`
    - `roi_hypothesis`
    - `delivery_timeline`
    - `recommended_training_bundle`
    - `tailored_catalogue_markdown`
    - `audit_form_url`
    - `calendly_url`
    - `storage`

22. **Render Catalogue Artifact**  
    Type : `httpRequest v4.2`  
    Rôle : appelle `catalogue-renderer`.  
    Configuration critique :
    - `POST`
    - `Authentication = None`
    - header `x-admin-token = {{$env.CONTENT_ADMIN_TOKEN}}`
    - header `Content-Type = application/json`
    - body `{{$json.catalogue_render_payload}}`

23. **Merge Catalogue Artifact**  
    Type : `code v2`  
    Rôle : fusionne le catalogue rendu dans le pack.  
    Changement clé :
    - lit maintenant l’entrée avec `$input.first().json`
    - normalise les attachments avec `content` ou `path`

### Phase 7 — Rendu deck premium

24. **Build Deck Render Payload**  
    Type : `code v2`  
    Rôle : construit le payload PPTX pour `deck-renderer`.  
    Contient :
    - `pack_id`
    - `organization_name`
    - `decision_maker_name`
    - `website`
    - `sector_guess`
    - `organization_type`
    - `recommended_offer`
    - `recommended_use_case`
    - `best_selling_use_case`
    - `roi_hypothesis`
    - `delivery_timeline`
    - `recommended_training_bundle`
    - `deck_brief`
    - `audit_form_url`
    - `calendly_url`
    - `storage`

25. **Render Deck Artifact**  
    Type : `httpRequest v4.2`  
    Rôle : appelle `deck-renderer` pour produire le `.pptx`.  
    Configuration critique :
    - `POST`
    - `Authentication = None`
    - header `x-admin-token = {{$env.CONTENT_ADMIN_TOKEN}}`
    - header `Content-Type = application/json`
    - body `{{$json.deck_render_payload}}`

26. **Merge Deck Artifact**  
    Type : `code v2`  
    Rôle : injecte le deck dans le pack et concatène les pièces jointes catalogue + deck.  
    Résultat attendu :
    - `attachments_count = 2`
    - 1 `.pdf`
    - 1 `.pptx`

### Phase 8 — Stockage et validation interne

27. **Store Pack In Supabase**  
    Type : `httpRequest v4.2`  
    Rôle : stocke le pack final enrichi dans `ai_prospecting_packs`.  
    Contenu minimal stocké :
    - `pack_id`
    - `prospect_id`
    - `organization_name`
    - `target_email`
    - `status = pending_approval`
    - `payload`
    - `llm_redaction_summary`

28. **Build Approval Email**  
    Type : `code v2`  
    Rôle : construit l’email interne d’approbation.  
    Changement clé :
    - affiche le décideur, le cas d’usage, le tier, `Pièces jointes préparées` et les noms de fichiers

29. **Send Internal Approval Email**  
    Type : `httpRequest v4.2`  
    Rôle : envoie l’email de validation interne via Resend.

### Phase 9 — Webhook d’approbation

30. **Approval Webhook**  
    Type : `webhook v2`  
    Rôle : reçoit les clics `approved` / `rejected`.

31. **Parse Approval Query**  
    Type : `code v2`  
    Rôle : normalise les paramètres webhook.

32. **Get Pack From Supabase**  
    Type : `httpRequest v4.2`  
    Rôle : recharge le pack stocké.

33. **Extract Pack Payload**  
    Type : `code v2`  
    Rôle : extrait le payload utile du pack pour l’envoi.

34. **If Approved**  
    Type : `if v1`  
    Rôle : sépare la branche approbation de la branche rejet.

### Phase 10 — Préparation et envoi prospect

35. **Build Send Context**  
    Type : `code v2`  
    Rôle : prépare le contexte final d’envoi.  
    Changement clé :
    - accepte `content` ou `path`
    - reconstruit depuis `catalogue_artifact` et `deck_artifact` si nécessaire
    - impose `attachments_count = 2`

36. **If Ready To Send**  
    Type : `if v1`  
    Rôle : autorise l’envoi uniquement si `can_send = true`.

37. **Mark Pack Approved**  
    Type : `httpRequest v4.2`  
    Rôle : marque le pack comme approuvé.

38. **Send External Prospect Email**  
    Type : `httpRequest v4.2`  
    Rôle : envoie l’email prospect via Resend avec les 2 pièces jointes.

39. **Parse Send Result**  
    Type : `code v2`  
    Rôle : extrait l’identifiant Resend et prépare `sent_at`.

40. **Mark Pack Sent**  
    Type : `httpRequest v4.2`  
    Rôle : met à jour le statut du pack à `sent`.

41. **Log Outreach Attempt**  
    Type : `httpRequest v4.2`  
    Rôle : journalise la tentative d’envoi dans `outreach_attempts`.

42. **Send Internal Sent Confirmation**  
    Type : `httpRequest v4.2`  
    Rôle : envoie une confirmation interne après expédition réussie.

### Phase 11 — Rejet et erreurs

43. **Mark Pack Approval Error**  
    Type : `httpRequest v4.2`  
    Rôle : passe le pack en `approval_error`.  
    Changement clé :
    - n’écrit plus `approval_error_at` si la colonne n’existe pas

44. **Mark Pack Rejected**  
    Type : `httpRequest v4.2`  
    Rôle : marque le pack comme rejeté.

45. **Update Prospect Target Sent**  
    Type : `httpRequest v4.2`  
    Rôle : met à jour `prospect_targets` après envoi réussi.

46. **Update Prospect Target Approval Error**  
    Type : `httpRequest v4.2`  
    Rôle : met à jour `prospect_targets` en cas d’erreur d’approbation.

47. **Update Prospect Target Rejected**  
    Type : `httpRequest v4.2`  
    Rôle : met à jour `prospect_targets` en cas de rejet.

48. **Respond to Webhook**  
    Type : `respondToWebhook v1.5`  
    Rôle : réponse texte simple après approbation.

49. **Respond Rejected**  
    Type : `respondToWebhook v1.5`  
    Rôle : réponse texte simple après rejet.

50. **Respond Approval Error**  
    Type : `respondToWebhook v1.5`  
    Rôle : réponse texte simple après erreur d’approbation.

## 7. Actions post-import recommandées

1. Vérifier que `OPENAI_API_KEY` est bien défini dans n8n.
2. Vérifier que `CONTENT_ADMIN_TOKEN` est bien défini dans n8n.
3. Vérifier que `OUTREACH_FROM_EMAIL` et `INTERNAL_REVIEW_EMAIL` sont bien définis.
4. Vérifier les clés Supabase et Resend encore intégrées en dur dans les nœuds HTTP, puis les remplacer par des variables ou credentials avant production.
5. Vérifier les URLs :
   - `catalogue-renderer`
   - `deck-renderer`
   - webhook d’approbation
6. Lancer un test complet et confirmer :
   - `Render Catalogue Artifact = success`
   - `Render Deck Artifact = success`
   - `Merge Deck Artifact -> attachments_count = 2`
   - `Build Send Context -> can_send = true`

## 8. Validation finale attendue

Le workflow V3 est correctement installé quand :

- le pack est généré sans erreur
- le catalogue PDF est généré
- le deck PPTX est généré
- les deux pièces jointes sont présentes
- l’email interne de validation affiche `Pièces jointes préparées : 2`
- l’approbation déclenche un envoi prospect réussi
- le pack est mis à jour à `sent`

## 9. Références liées

- `docs/transferai-admin/62_n8n_Prospection_V3_CRM_final.json`
- `supabase/functions/catalogue-renderer/index.ts`
- `supabase/functions/deck-renderer/index.ts`
- `outputs/manual-20260601-prospecting-guides/documents/user-guide/...`
- `outputs/manual-20260601-prospecting-guides/documents/troubleshooting-guide/...`
