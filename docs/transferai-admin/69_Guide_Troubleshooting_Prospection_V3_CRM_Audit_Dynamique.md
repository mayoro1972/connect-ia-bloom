# Guide de Troubleshooting - Prospection V3 CRM + Audit Dynamique

## 1. Objet

Ce document recense les problèmes les plus fréquents rencontrés pendant l’implémentation et l’exploitation du workflow :

- [73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/73_TransferAI_Prospecting_V3_CRM_Enhanced_FINAL_11_Local_Audit_Fixed.json)
- [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)

Il doit servir de guide rapide de diagnostic et de correction.

---

## 2. Principe général de diagnostic

Quand un nœud ne fonctionne pas, il faut toujours vérifier dans cet ordre :

1. le nœud amont a-t-il vraiment été exécuté
2. les champs attendus sont-ils présents
3. la structure JSON a-t-elle changé
4. le nœud est-il dans le bon parcours du workflow
5. le service externe appelé répond-il correctement

---

## 3. Problèmes fréquents et correctifs

## 3.1 `Fetch Public Page 1` retourne `Invalid URL`

### Symptôme

Le nœud affiche :

- `Invalid URL`
- `URL must start with "http" or "https"`

### Cause la plus probable

Le champ `website` est vide ou mal renseigné dans `Set Target`.

### Vérification

Dans `Set Target`, regardez la valeur de :

- `website`

### Correctif

Utiliser :

```js
{{$json.website || ''}}
```

Ne jamais utiliser :

- `auto`
- une valeur non-URL

### Point complémentaire

Si vous êtes en test manuel, vous pouvez temporairement utiliser une vraie URL.

---

## 3.2 `Build Source URLs` produit des URLs vides

### Symptôme

Les champs :

- `page_1_url`
- `page_2_url`
- etc.

sont vides.

### Cause

Le champ `website` n’est pas disponible à l’entrée.

### Correctif

Corriger d’abord :

- `Set Target`

Puis réexécuter :

- `Build Source URLs`

---

## 3.3 La lettre contient encore `{{AUDIT_FORM_URL}}`

### Symptôme

Dans l’email reçu, on voit :

- `{{AUDIT_FORM_URL}}`

au lieu du vrai lien.

### Cause

`Generate Executive Letter` a bien produit le token, mais `Assemble Prospect Pack` ne l’a pas remplacé.

### Correctif

Vérifier que `Assemble Prospect Pack` :

1. génère `pack_id`
2. construit `audit_form_url`
3. remplace `{{AUDIT_FORM_URL}}`

### Contrôle attendu

Dans la sortie de `Assemble Prospect Pack`, `executive_letter` doit déjà contenir :

- `https://audit.transferai.ci/questionnaire-audit?pack_id=...`

---

## 3.4 `Store Pack In Supabase` fonctionne mais le lien n’apparaît pas ensuite

### Symptôme

Le pack est stocké, mais les nœuds aval ne retrouvent pas le lien.

### Cause

Le `payload` stocké ne contient pas la bonne version de `audit_form_url`.

### Correctif

Vérifier que `Store Pack In Supabase` conserve bien :

```js
payload: $json
```

et que l’entrée du nœud contient déjà :

- `audit_form_url`

---

## 3.5 `Build Approval Email` ne montre pas le lien du formulaire

### Symptôme

Le résumé interne ne contient pas le lien d’audit.

### Cause

Le résumé HTML n’utilise pas `pack.payload.audit_form_url`.

### Correctif

Ajouter dans le résumé :

```js
'Lien formulaire: ' + escapeHtml(safe(pack.payload && pack.payload.audit_form_url, 'a confirmer'))
```

---

## 3.6 `Extract Pack Payload` n’affiche rien

### Symptôme

Le nœud montre :

- `No output data`

### Cause réelle

Le nœud n’est pas en panne.

Il attend des données venant de :

- `Approval Webhook`
- `Parse Approval Query`
- `Get Pack From Supabase`

### Ce qu’il faut comprendre

`Extract Pack Payload` fait partie du parcours d’approbation, pas du parcours de génération initiale.

### Correctif

Déclencher le chemin d’approbation :

1. récupérer `approve_url` dans `Build Approval Email`
2. ouvrir ce lien
3. laisser le webhook alimenter `Extract Pack Payload`

---

## 3.7 `Build Send Context` produit `can_send = false`

### Symptôme

Le nœud retourne :

- `can_send = false`

### Causes possibles

1. `target_email` manquant
2. lettre vide
3. pas assez de pièces jointes
4. pas de PDF
5. pas de PPTX

### Vérifications

Contrôler :

- `attachments_count`
- `attachments`
- `executive_letter`
- `target_email`

### Correctif

S’assurer que :

- `catalogue_artifact.pdf_url` existe
- `deck_artifact.pptx_url` existe
- le prospect a un email valide

---

## 3.8 L’email au prospect part sans les pièces jointes

### Symptôme

L’email est reçu mais sans PDF ou sans PPTX.

### Causes possibles

1. `mail_attachments` vide
2. les artefacts n’ont pas été fusionnés
3. les URLs des artefacts sont absentes

### Correctif

Vérifier dans :

- `Merge Catalogue Artifact`
- `Merge Deck Artifact`
- `Build Send Context`

que les pièces jointes sont bien reconstruites.

---

## 3.9 `Mark Pack Sent` n’actualise pas le statut

### Symptôme

Le message est envoyé, mais Supabase ne reflète pas `status = sent`.

### Causes possibles

1. `pack_id` absent
2. `resend_id` absent
3. l’URL Supabase du `PATCH` est mauvaise

### Correctif

Vérifier :

- `pack_id`
- `sent_at`
- `resend_id`

et l’URL :

```js
https://.../ai_prospecting_packs?pack_id=eq....
```

---

## 3.10 Le formulaire public en ligne ne ressemble pas au nouveau formulaire local

### Symptôme

Le domaine `audit.transferai.ci` montre encore une ancienne interface.

### Cause

Le site public pointe encore vers l’ancienne build.

### Correctif

Déployer la nouvelle build frontend du repo vers le domaine public.

### À retenir

- la version locale peut être en avance
- la production n’est pas mise à jour automatiquement

---

## 3.11 Le formulaire local montre une erreur `Missing invite token`

### Symptôme

Le formulaire charge le shell mais affiche :

- `Missing invite token`

### Cause

Le navigateur affiche un ancien bundle ou le `pack_id` n’existe pas en base.

### Correctif possible

1. utiliser le mode aperçu local
2. forcer un nouveau `_reload`
3. recharger complètement le navigateur

---

## 3.12 `website` affiché comme `auto`

### Symptôme

Dans `Set Target`, `website` renvoie :

- `auto`

### Pourquoi c’est un problème

`website` doit être une vraie URL, sinon toute la lecture des pages publiques échoue.

### Correctif

Utiliser :

```js
{{$json.website || ''}}
```

et jamais :

```js
{{$json.website || 'auto'}}
```

---

## 3.13 Le prospect reçoit l’ancienne URL générique du formulaire

### Symptôme

Le courrier contient encore :

- `https://audit.transferai.ci/`

### Cause

Le prompt de `Generate Executive Letter` n’a pas été mis à jour.

### Correctif

Le prompt doit utiliser :

- `{{AUDIT_FORM_URL}}`

et non une URL statique.

---

## 3.14 Le parcours d’approbation ne déclenche rien

### Symptôme

Le clic sur le lien d’approbation ne donne aucun effet visible.

### Vérifications

1. le workflow est-il activé
2. le webhook pointe-t-il vers la bonne URL
3. le `pack_id` existe-t-il en base
4. la décision envoyée est-elle bien `approved` ou `rejected`

### Correctif

Tester l’URL complète :

```text
.../webhook/approve-prospect-pack-v3?pack_id=...&decision=approved
```

---

## 3.15 Le formulaire est soumis mais aucune fiche pré-RDV n’est produite

### Symptôme

Le formulaire est bien soumis, mais :

- aucun run n8n post-audit ne démarre
- aucune fiche pré-RDV n’est produite
- aucun email expert n’est envoyé

### Cause

Les causes les plus fréquentes sont :

1. `N8N_POST_AUDIT_WEBHOOK_URL` absent
2. le workflow `74` n’est pas importé ou pas actif
3. la soumission n’a pas atteint `completionPercentage >= 80`
4. `save-form-response` n’est pas déployé avec la bonne version

### Correctif

Vérifier dans cet ordre :

1. la variable `N8N_POST_AUDIT_WEBHOOK_URL`
2. l’activation du workflow `TransferAI Post-Audit Expert Routing V2`
3. la valeur `is_completed = true` dans `form_responses`
4. le déploiement effectif de `save-form-response`

---

## 3.16 `post_audit_follow_ups` reste vide

### Symptôme

Le workflow post-audit tourne, mais aucune ligne n’est créée dans :

- `post_audit_follow_ups`

### Cause

Les causes probables sont :

1. la migration `20260605150000_post_audit_schema.sql` n’est pas appliquée
2. le nœud `Upsert Follow-Up Tracking` écrit vers une table absente
3. `pack_id` est vide ou invalide

### Correctif

Vérifier :

1. l’existence de la table `post_audit_follow_ups`
2. la présence de `pack_id` dans `form_responses`
3. la présence de `pack_id` dans `ai_prospecting_packs`

---

## 3.17 Le webhook post-audit part plusieurs fois

### Symptôme

Plusieurs runs post-audit sont lancés pour le même prospect.

### Cause

Les causes possibles sont :

1. le formulaire est resoumis plusieurs fois
2. le workflow reconciliation est actif en plus du webhook
3. le contrôle d’idempotence métier n’est pas validé en recette

### Correctif

Contrôler :

1. `form_responses.is_completed`
2. `prospect_targets.last_sequence_result`
3. le comportement de `If Already Post-Audit Processed` dans le workflow `74`

---

## 3.18 Le workflow `74` est importé mais échoue immédiatement

### Symptôme

Le workflow n8n démarre, puis s’arrête sur un nœud HTTP ou sur l’email interne.

### Causes possibles

1. `SUPABASE_URL` absent dans n8n
2. `SUPABASE_SERVICE_ROLE_KEY` absent dans n8n
3. `OPENAI_API_KEY` absent
4. `RESEND_API_KEY` absent
5. `POST_AUDIT_INTERNAL_EMAIL` absent

### Correctif

Renseigner au minimum :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `POST_AUDIT_INTERNAL_EMAIL`
- `BOOKING_LINK_45MIN`

---

## 4. Procédure de test minimale complète

Pour tester proprement le workflow, suivre cet ordre :

1. vérifier `Set Target`
2. vérifier `Build Source URLs`
3. vérifier `Generate Executive Letter`
4. vérifier `Assemble Prospect Pack`
5. vérifier `Store Pack In Supabase`
6. vérifier `Build Approval Email`
7. ouvrir `approve_url`
8. vérifier `Extract Pack Payload`
9. vérifier `Build Send Context`
10. vérifier `Send External Prospect Email`
11. vérifier `Mark Pack Sent`
12. ouvrir le lien du formulaire avec le `pack_id`
13. soumettre une réponse partielle puis une réponse complète
14. vérifier `form_responses.pack_id` et `form_responses.context_snapshot`
15. vérifier le déclenchement du workflow `74`
16. vérifier `post_audit_follow_ups`
17. vérifier l’email expert

---

## 5. Références utiles

- [68_Guide_Utilisateur_Prospection_V3_CRM_Audit_Dynamique.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/68_Guide_Utilisateur_Prospection_V3_CRM_Audit_Dynamique.md)
- [implementation-audit-dynamique-workflow.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/implementation-audit-dynamique-workflow.md)
- [n8n-orientation-service-post-audit.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/n8n-orientation-service-post-audit.md)
- [71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/71_Guide_Utilisateur_Workflow_Post_Audit_CRM_Aware.md)
- [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)
