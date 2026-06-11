# Guide Utilisateur - Workflow Prospection V3 CRM + Audit Dynamique

## 1. Objet du document

Ce guide est la référence opérationnelle du workflow :

- [73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json)

Il explique, en français standard, ce que fait chaque nœud, comment le configurer, ce qui a évolué depuis les premières versions, et dans quel ordre exécuter le projet.

Ce guide couvre :

1. l’historique fonctionnel V1 à aujourd’hui
2. l’architecture générale
3. les prérequis
4. le rôle et la configuration de chaque nœud
5. les changements récents autour du formulaire d’audit dynamique
6. l’ordre d’exécution recommandé

---

## 2. Historique utile du projet

### V1

La V1 permettait surtout de :

- qualifier un prospect
- générer des contenus commerciaux
- envoyer une proposition simple

Limites de la V1 :

- pas de stockage structuré complet dans Supabase
- pas de parcours d’approbation robuste
- pas de lien d’audit dynamique par prospect

### V2

La V2 a ajouté :

- la persistance en base
- l’approbation avant envoi
- un meilleur contrôle commercial

Limites de la V2 :

- le formulaire d’audit restait générique
- le lien du formulaire n’était pas individualisé

### V3 CRM Enhanced

La V3 actuelle ajoute :

- une logique CRM plus cohérente
- la génération d’un `pack_id`
- la construction d’un `audit_form_url`
- un pack prospect complet stocké dans Supabase
- un parcours d’approbation avant envoi
- une base prête pour le formulaire d’audit dynamique

### Version actuelle enrichie audit dynamique

Les évolutions récentes portent sur :

- le remplacement du lien générique du formulaire par un lien dynamique
- la préparation du nouveau formulaire premium côté frontend
- la remontée d’une recommandation de service TransferAI après soumission
- le déclenchement automatique du workflow post-audit

### Position actuelle du projet

À date :

- la `V3` est considérée comme terminée pour la phase **avant audit**
- le formulaire d’audit dynamique est branché de bout en bout
- le post-audit est désormais pris en charge par le workflow :
  [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)

---

## 3. Vue d’ensemble du workflow

Le workflow complet comporte quatre grandes phases :

1. qualification et lecture du prospect
2. génération des contenus du pack
3. stockage et validation interne
4. approbation puis envoi au prospect

Le formulaire d’audit dynamique intervient ensuite comme couche complémentaire :

1. le prospect clique sur un lien d’audit personnalisé
2. il remplit le formulaire
3. Supabase enregistre les réponses
4. une recommandation de service TransferAI est calculée
5. `save-form-response` déclenche automatiquement le webhook post-audit quand la complétion atteint `80%` ou plus
6. le workflow post-audit produit la fiche pré-RDV et alimente la table de suivi

---

## 4. Pré-requis de configuration

Avant d’utiliser le workflow, les éléments suivants doivent être prêts.

### 4.1 Services nécessaires

- n8n
- Supabase
- OpenAI
- Resend
- frontend du site `audit.transferai.ci`

### 4.2 Variables d’environnement clés

Pour la chaîne complète V3 + post-audit, les variables suivantes doivent être prêtes :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `N8N_POST_AUDIT_WEBHOOK_URL`
- `POST_AUDIT_INTERNAL_EMAIL`
- `BOOKING_LINK_45MIN`

Variables optionnelles utiles :

- `POST_AUDIT_ROUTING_MAP_JSON`
- `POST_AUDIT_SLACK_WEBHOOK_URL`
- `POST_AUDIT_N8N_WEBHOOK_BEARER_TOKEN`
- `POST_AUDIT_NEXT_ACTION_DELAY_DAYS`

### 4.3 Variables métier minimales attendues

Le workflow manipule au minimum :

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

### 4.4 Recommandation de sécurité

Ne laissez pas en production les secrets en clair dans les nœuds :

- OpenAI API key
- Supabase service role key
- Resend API key

Ils doivent être placés dans :

- les Credentials n8n
- ou les variables d’environnement

---

## 5. Ordre d’exploitation recommandé

L’ordre recommandé est le suivant :

1. préparer ou recevoir les données prospect
2. lancer la génération du pack
3. stocker le pack en base
4. valider le pack en interne
5. approuver ou rejeter
6. envoyer au prospect si approuvé
7. attendre la soumission du formulaire d’audit
8. traiter ensuite le post-audit

---

## 6. Guide nœud par nœud

## 6.1 Déclencheurs

### `Manual Trigger`

**Rôle**

- lancer le workflow à la main

**Quand l’utiliser**

- test manuel
- démonstration
- recette fonctionnelle

### `Execute Workflow Trigger`

**Rôle**

- permettre un appel par un autre workflow n8n

**Quand l’utiliser**

- intégration CRM
- appels batch depuis un workflow parent

---

## 6.2 Préparation des données prospect

### `Set Target`

**Type**

- `Set`

**Rôle**

- normaliser les champs entrants du prospect
- fixer les valeurs minimales utilisées par les nœuds suivants

**Points de configuration importants**

- `website` doit être une vraie URL ou une chaîne vide
- ne jamais mettre `auto` dans `website`

**Valeur recommandée pour `website`**

```js
{{$json.website || ''}}
```

**Pourquoi ce nœud est critique**

Parce qu’il fixe les données de base qui serviront à :

- construire les URLs publiques
- appeler les modèles OpenAI
- générer la lettre
- stocker le pack

---

### `Build Source URLs`

**Type**

- `Code`

**Rôle**

- construire jusqu’à 5 URLs publiques à analyser
- partir du site web du prospect
- prioriser certaines pages : `/`, `/a-propos/`, `/services/`, etc.

**Entrées utilisées**

- `website`
- `custom_page_paths_csv`

**Sorties produites**

- `source_pages`
- `page_1_url`
- `page_2_url`
- `page_3_url`
- `page_4_url`
- `page_5_url`

**Point de vigilance**

Si `website` est vide, les nœuds `Fetch Public Page` échouent ensuite.

---

### `Fetch Public Page 1`
### `Fetch Public Page 2`
### `Fetch Public Page 3`
### `Fetch Public Page 4`
### `Fetch Public Page 5`

**Type**

- `HTTP Request`

**Rôle**

- récupérer le contenu HTML brut des pages publiques identifiées

**Configuration**

- `Method = GET`
- `Response format = text`
- `Never Error = true`

**Pourquoi il y en a cinq**

Le workflow lit plusieurs pages pour :

- comprendre l’activité du prospect
- capter les mots-clés métier
- enrichir la qualification

---

### `Normalize Public Signals`

**Type**

- `Code`

**Rôle**

- nettoyer les pages HTML
- transformer le HTML en texte lisible
- agréger les extraits utiles
- produire des indices métiers et ROI

**Sorties importantes**

- `page_texts`
- `public_text`
- `roi_clues`

---

### `Sanitize Prospect Data For LLM`

**Type**

- `Code`

**Rôle**

- préparer une version pseudonymisée et contrôlée des données
- limiter l’exposition d’informations sensibles avant appel OpenAI

**Sorties importantes**

- `llm_allowed_payload`
- `llm_generation_payload`
- `llm_redaction_summary`

---

## 6.3 Qualification et enrichissement IA

### `Call OpenAI Pre-Audit`

**Type**

- `HTTP Request`

**Rôle**

- générer une première lecture structurée du prospect
- proposer les hypothèses initiales d’analyse

**Sorties attendues**

- type d’organisation
- contexte métier
- besoins probables
- premiers angles d’audit

---

### `Call OpenAI Problems Solutions`

**Type**

- `HTTP Request`

**Rôle**

- relier les signaux publics à des problèmes probables
- faire émerger des quick wins et des cas d’usage crédibles

**Sorties attendues**

- `probable_problems`
- `probable_quick_wins`
- `recommended_use_case`
- `best_selling_use_case`

---

### `Call OpenAI ROI`

**Type**

- `HTTP Request`

**Rôle**

- produire des hypothèses prudentes de gains, de ROI, d’amélioration de service et de temps économisé

**Sorties attendues**

- `roi_hypothesis`
- `expected_time_savings`
- `expected_service_improvements`
- `expected_quick_wins`

---

### `Assemble Prospect Context`

**Type**

- `Code`

**Rôle**

- fusionner les données prospect, les signaux publics et les sorties OpenAI
- produire un contexte métier unique et propre

**Sorties importantes**

- `organization_summary`
- `entry_point_niche`
- `recommended_offer`
- `recommended_training_bundle`
- `commercial_priority_tier`
- `recommended_meeting_angle`
- `sector_pitches`

---

## 6.4 Génération des contenus du pack

### `Generate Executive Letter`

**Type**

- `HTTP Request`

**Rôle**

- produire le courrier exécutif principal

**Évolution récente**

Avant :

- le prompt utilisait un lien fixe vers `https://audit.transferai.ci/`

Maintenant :

- il utilise un token dynamique `{{AUDIT_FORM_URL}}`

**But**

- chaque prospect reçoit un lien d’audit individualisé

---

### `Generate Tailored Catalogue`

**Type**

- `HTTP Request`

**Rôle**

- produire un mini-catalogue ciblé par secteur et par besoin

**Contenu attendu**

- synthèse exécutive
- priorités métier
- cas d’usage
- formation
- gouvernance
- accompagnement

---

### `Generate Tailored Audit Form`

**Type**

- `HTTP Request`

**Rôle**

- générer une version texte / conceptuelle du formulaire d’audit ciblé

**Note**

Le vrai formulaire dynamique frontend va plus loin que ce texte.

---

### `Generate Deck Brief`

**Type**

- `HTTP Request`

**Rôle**

- générer le brief structuré du deck PowerPoint prospect

**Sortie**

- JSON propre avec objectifs, messages, cas d’usage, timeline et CTA

---

## 6.5 Construction du pack dynamique

### `Assemble Prospect Pack`

**Type**

- `Code`

**Rôle**

- construire le pack final
- générer le `pack_id`
- créer `audit_form_url`
- hydrater les tokens
- produire `executive_letter_html`

**Changement majeur**

Ce nœud remplace désormais :

- `{{ORGANIZATION_NAME}}`
- `{{DECISION_MAKER_NAME}}`
- `{{WEBSITE}}`
- `{{AUDIT_FORM_URL}}`

**Sorties critiques**

- `pack_id`
- `audit_form_url`
- `executive_letter`
- `executive_letter_html`
- `tailored_catalogue`
- `tailored_audit_form`
- `deck_brief`

---

## 6.6 Stockage et revue interne

### `Store Pack In Supabase`

**Type**

- `HTTP Request`

**Rôle**

- enregistrer le pack complet dans `ai_prospecting_packs`

**Configuration logique**

- `payload: $json` doit être conservé

**Pourquoi c’est important**

Parce que tout le flux d’approbation relit ensuite ce `payload`.

---

### `Build Approval Email`

**Type**

- `Code`

**Rôle**

- construire l’email de validation interne

**Ce qu’il affiche**

- organisation
- email cible
- cas d’usage
- offre recommandée
- tier commercial
- lien dynamique du formulaire
- pack id
- liens d’approbation et de rejet

---

### `Send Internal Approval Email`

**Type**

- `HTTP Request`

**Rôle**

- envoyer l’email de revue interne via Resend

---

## 6.7 Parcours d’approbation

### `Approval Webhook`

**Type**

- `Webhook`

**Rôle**

- recevoir la décision `approved` ou `rejected`

**Paramètres attendus**

- `pack_id`
- `decision`

---

### `Parse Approval Query`

**Type**

- `Code`

**Rôle**

- lire les query params du webhook
- normaliser la décision

---

### `Get Pack From Supabase`

**Type**

- `HTTP Request`

**Rôle**

- relire en base le pack correspondant au `pack_id`

---

### `Extract Pack Payload`

**Type**

- `Code`

**Rôle**

- réextraire les champs utiles du `payload`
- réinjecter le pack dans le flux d’envoi

**Champs importants remontés**

- `audit_form_url`
- `recommended_offer`
- `recommended_use_case`
- `commercial_priority_tier`
- `executive_letter_html`

**Point de compréhension**

Ce nœud ne retourne rien tant que le webhook d’approbation n’a pas été exécuté.

---

### `If Approved`

**Type**

- `If`

**Rôle**

- séparer le chemin :
  - approuvé
  - rejeté

---

## 6.8 Préparation de l’envoi externe

### `Build Send Context`

**Type**

- `Code`

**Rôle**

- reconstruire les pièces jointes
- valider le minimum d’envoi
- propager `audit_form_url`

**Ce que ce nœud vérifie**

- email cible présent
- lettre non vide
- exactement 2 pièces jointes
- 1 PDF
- 1 PPTX

**Sorties clés**

- `attachments`
- `attachments_count`
- `can_send`
- `send_failure_reason`

---

### `If Ready To Send`

**Type**

- `If`

**Rôle**

- envoyer seulement si le contexte est complet

---

### `Mark Pack Approved`

**Type**

- `HTTP Request`

**Rôle**

- marquer le pack comme approuvé avant l’envoi effectif

---

## 6.9 Envoi au prospect

### `Send External Prospect Email`

**Type**

- `HTTP Request`

**Rôle**

- envoyer au prospect :
  - la lettre exécutive
  - le mini-catalogue
  - le deck

**Point essentiel**

La lettre envoyée doit désormais contenir le vrai lien :

- `https://audit.transferai.ci/questionnaire-audit?pack_id=...`

---

### `Parse Send Result`

**Type**

- `Code`

**Rôle**

- relire la réponse Resend
- extraire l’identifiant du message
- horodater l’envoi

---

### `Mark Pack Sent`

**Type**

- `HTTP Request`

**Rôle**

- mettre à jour la ligne Supabase après envoi réussi

**Mise à jour attendue**

- `status = sent`
- `sent_at`
- `resend_message_id`

---

### `Log Outreach Attempt`

**Type**

- `HTTP Request`

**Rôle**

- tracer l’envoi dans la table d’historique des tentatives

---

### `Send Internal Sent Confirmation`

**Type**

- `HTTP Request`

**Rôle**

- envoyer une confirmation interne que le pack a bien été envoyé

---

## 6.10 Gestion des erreurs et des cas alternatifs

### `Mark Pack Approval Error`

**Rôle**

- marquer un pack en erreur si le chemin d’approbation échoue

### `Mark Pack Rejected`

**Rôle**

- marquer le pack comme rejeté

### `Update Prospect Target Sent`

**Rôle**

- refléter l’état “envoyé” dans la table CRM du prospect

### `Update Prospect Target Approval Error`

**Rôle**

- refléter l’erreur d’approbation dans la cible CRM

### `Update Prospect Target Rejected`

**Rôle**

- refléter le rejet dans la cible CRM

### `Respond to Webhook`
### `Respond Rejected`
### `Respond Approval Error`

**Rôle**

- renvoyer une réponse HTTP lisible à l’appelant du webhook

---

## 6.11 Génération des artefacts

### `Resolve Domain Catalogue`

**Rôle**

- choisir la variante catalogue la plus cohérente avec le domaine et le contexte

### `Build Catalogue Render Payload`

**Rôle**

- préparer toutes les données d’entrée du moteur de rendu catalogue

**Point important**

Ce nœud transporte aussi :

- `audit_form_url`
- `calendly_url`

### `render Catalogue Artifact`

**Rôle**

- appeler le service de rendu du mini-catalogue

### `Merge Catalogue Artifact`

**Rôle**

- réinjecter l’artefact catalogue dans le pack

### `Build Deck Render Payload`

**Rôle**

- préparer les données du deck PowerPoint

### `Render Deck Artifact`

**Rôle**

- appeler le moteur de rendu du deck

### `Merge Deck Artifact`

**Rôle**

- réinjecter l’artefact deck dans le pack

---

## 7. Ce qui a été configuré récemment

Les changements récemment opérés sont les suivants :

1. correction du champ `website` dans `Set Target`
2. vérification de `Build Source URLs`
3. mise à jour de `Generate Executive Letter`
4. mise à jour de `Assemble Prospect Pack`
5. validation de `Store Pack In Supabase`
6. validation de `Build Approval Email`
7. préparation de `Extract Pack Payload`
8. préparation de `Build Send Context`
9. préparation de `Send External Prospect Email`
10. préparation de `Mark Pack Sent`
11. ajout du schéma post-audit via `20260605150000_post_audit_schema.sql`
12. mise à jour de `save-form-response` pour persister `pack_id` et `context_snapshot`
13. déclenchement automatique du webhook n8n post-audit quand `completionPercentage >= 80`
14. création de la table de suivi `post_audit_follow_ups`

---

## 8. Lien avec le nouveau formulaire d’audit

Le nouveau formulaire premium du repo est préparé dans :

- [src/pages/ProspectAuditFormPage.tsx](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/pages/ProspectAuditFormPage.tsx)
- [src/lib/prospect-audit.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/src/lib/prospect-audit.ts)

La logique Supabase liée au formulaire est préparée dans :

- [supabase/functions/resolve-invitation/index.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/functions/resolve-invitation/index.ts)
- [supabase/functions/save-form-response/index.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/functions/save-form-response/index.ts)
- [supabase/functions/_shared/prospect-audit-context.ts](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/supabase/functions/_shared/prospect-audit-context.ts)

Aujourd’hui :

- le workflow email sait déjà envoyer un lien dynamique
- le frontend d’audit utilise la chaîne `resolve-invitation` + `save-form-response`
- le workflow post-audit peut être déclenché automatiquement
- la table `post_audit_follow_ups` permet le suivi non-tech
- le domaine public et la chaîne post-audit peuvent être testés de bout en bout

---

## 9. Étapes recommandées après ce guide

Le build principal étant en place, les prochaines étapes recommandées sont :

1. tester le flux complet `V3 -> formulaire -> post-audit`
2. valider la création de `post_audit_follow_ups`
3. valider l’email expert et, si activé, l’alerte Slack
4. vérifier l’idempotence en cas de resoumission
5. monitorer les premiers cas réels en production

---

## 10. Références utiles

- [implementation-audit-dynamique-workflow.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/implementation-audit-dynamique-workflow.md)
- [modele-fiche-pre-rdv-audit-trilingue.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/modele-fiche-pre-rdv-audit-trilingue.md)
- [n8n-orientation-service-post-audit.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/n8n-orientation-service-post-audit.md)
- [71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md)
- [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)
