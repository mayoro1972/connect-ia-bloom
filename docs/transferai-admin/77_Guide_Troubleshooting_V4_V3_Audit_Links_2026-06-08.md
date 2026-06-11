# Guide de Troubleshooting V4 V3 Audit Links

Résolution des incidents rencontrés pendant la stabilisation des workflows `V4 Batch` et `V3 CRM Approval AutoSend`  
Version du 8 juin 2026

## Objectif

Ce document récapitule :

- les pannes rencontrées
- leurs symptômes
- la vraie cause
- la correction définitive

Il couvre :

- la V4 batch
- la V3 CRM
- les emails Resend
- les liens du questionnaire d'audit
- les faux doublons observés dans Gmail

## Résumé exécutif

Les problèmes ont été répartis en quatre familles :

1. erreurs de câblage n8n
2. erreurs de schéma Supabase
3. erreurs de mapping de champs
4. erreurs de génération et de réutilisation du lien `audit_form_url`

## 1. `If Supabase Source` partait sur la mauvaise branche

### Symptôme

- la branche `false` partait alors que `source_backend = supabase`

### Cause

`If Supabase Source` recevait l'output de `Fetch Today Outreach Count`, parfois vide, au lieu de lire directement `Set Batch Config`.

### Fix

Recâblage :

```text
Set Batch Config → If Supabase Source
```

et non :

```text
Fetch Today Outreach Count → If Supabase Source
```

## 2. `Fetch Today Outreach Count` stoppait le batch quand il n'y avait aucun envoi

### Symptôme

- absence d'item
- la suite du workflow ne recevait rien

### Cause

Le nœud ne renvoyait rien quand le résultat était vide.

### Fix

Activer :

```text
Always Output Data = ON
```

## 3. `Create Batch Run` échouait sur colonnes manquantes

### Symptômes

- `active_campaign_label` column not found
- `run_label` null

### Causes

- colonnes manquantes dans `prospecting_batch_runs`
- exécution du nœud seul sans input amont

### Fixes

- ajout des colonnes manquantes dans Supabase
- fallback dans le body
- test via `Execute previous nodes`

## 4. `Normalize Supabase Prospects` retournait 0 output

### Symptôme

- le nœud affichait `No output data returned`

### Cause

Le code lisait `$json` comme un tableau unique alors que le nœud recevait déjà plusieurs items séparés.

### Fix

Utiliser :

```js
const items = $input.all().map((item) => item.json);
```

au lieu de :

```js
const rows = $json || [];
```

## 5. L'ancien lien Calendly 45 min polluait encore les prospects

### Symptôme

- certains prospects sortaient avec `https://calendly.com/transferai/45min`

### Cause

la valeur stockée dans Supabase était encore ancienne

### Fix

Forcer dans `Normalize Supabase Prospects` :

```js
booking_link_45min: 'https://calendly.com/contact-transferai/30min'
```

## 6. `Build Eligible Prospect Queue` ne voyait pas les nœuds amont

### Symptôme

- `Node 'Fetch Today Outreach Count' hasn't been executed`

### Cause

Le nœud était testé isolément et le code dépendait de nœuds non exécutés.

### Fix

Ajout d'un helper robuste :

```js
function safeNode(name) {
  try {
    return $(name).first().json || {};
  } catch (e) {
    return {};
  }
}
```

## 7. `batch_run_id` restait vide dans les logs

### Symptômes

- `batch_run_id = null`
- `null value in column "batch_run_id"`

### Cause

Le contexte batch n'était pas injecté dans les items prospect.

### Fix

- `Create Batch Run → Edit Fields`
- `Edit Fields → Merge Prospects With Batch Run`
- merge configuré en :
  - `Mode = Combine`
  - `Combine By = All Possible Combinations`

## 8. `prospecting_batch_run_items` avait des colonnes manquantes

### Symptômes

- `active_campaign_label column not found`
- `niche_status column not found`

### Cause

Le schéma de la table ne reflétait pas encore les nouveaux champs loggués.

### Fix

Ajout des colonnes :

- `active_campaign_label`
- `niche_status`
- `batch_stop_reason`
- `process_decision`
- `batch_status`
- `organization_name`
- `website`
- `prospect_id`
- `pack_id`

## 9. `Finalize Batch Run` écrivait dans la mauvaise table

### Symptôme

- `Could not find the 'completed_at' column of 'prospecting_batch_run_items'`

### Cause

Le nœud pointait vers `prospecting_batch_run_items` au lieu de `prospecting_batch_runs`.

### Fix

URL correcte :

```text
{{ 'https://wlhznciwuofueffyoflo.supabase.co/rest/v1/prospecting_batch_runs?id=eq.' + encodeURIComponent($json.batch_run_id) }}
```

## 10. L'email interne final arrivait vide

### Symptôme

- `Organisation :` vide
- `Email cible :` vide
- `Lien formulaire :` vide

### Cause

Le nœud `Send Internal Sent Confirmation` lisait parfois des champs absents sur l'item courant.

### Fix

Réécriture du body pour prioriser :

- `Build Send Context`
- puis `payload`

## 11. Le lien du questionnaire était cassé dans l'email prospect

### Symptôme

Dans le mail prospect, le lien apparaissait comme :

```text
https://www.transferai.ci/questionnaire-audit?pack_id=
```

### Cause réelle

Le contenu de la lettre générée par l'IA pouvait intégrer un lien questionnaire cassé avant que le vrai `pack_id` existe.

### Effet

Même si un autre bloc plus bas contenait le bon lien, l'utilisateur pouvait cliquer le premier lien cassé.

## 12. Le site disait `pack_id manquant`

### Symptôme

La page affichait :

```text
Aucun identifiant de pack fourni dans l'URL
```

### Cause

Le frontend recevait une URL sans `pack_id`, car le mail pointait vers un ancien lien cassé.

### Important

Ce n'était pas d'abord un bug frontend. Le frontend réagissait correctement à une URL incomplète.

## 13. Fix définitif du lien questionnaire

### Nœud 1 : `Assemble Prospect Pack`

Après calcul du vrai `auditFormUrl`, réparer la lettre :

```js
var executiveLetterHtml = String(executiveLetter || '').replace(/\n/g, '<br>');

var brokenAuditPattern = /https?:\/\/[^\s"'<>]*questionnaire-audit[^\s"'<>]*/gi;

if (auditFormUrl) {
  executiveLetterHtml = executiveLetterHtml.replace(brokenAuditPattern, auditFormUrl);
  executiveLetter = String(executiveLetter || '').replace(brokenAuditPattern, auditFormUrl);
}
```

### Nœud 2 : `Build Send Context`

Reconstruire l'URL canonique depuis `pack_id` et réparer le HTML avant envoi :

- extraction robuste de `pack_id`
- reconstruction de :
```text
https://www.transferai.ci/questionnaire-audit?pack_id=...
```
- remplacement regex de tout ancien lien cassé
- suppression des blocs formulaire dupliqués
- génération finale de `external_email_html`

### Nœud 3 : `Send External Prospect Email`

Le nœud doit utiliser en priorité :

```js
ctx.external_email_html
```

et non le vieux `executive_letter_html` si celui-ci n'a pas été réparé.

## 14. Pourquoi le problème semblait persister

### Cause

Gmail regroupait plusieurs anciens emails dans le même thread.

### Effet

Tu regardais parfois :

- un ancien email d'approbation
- un ancien email prospect
- un ancien `pack_id`

alors que le nouveau workflow générait déjà un lien correct.

### Conclusion

Le fix était bon, mais les anciens mails restaient inchangés.

## 15. Doublons observés : vrai doublon ou faux doublon ?

### Symptôme

Deux emails d'approbation reçus pour `Orange Côte d'Ivoire` avec deux `pack_id` différents.

### Vérification base

Contrôle de `prospect_targets` :

- pas de doublon exact trouvé sur :
  - `organization_name`
  - `target_email`
  - `website`

### Vraie explication

Il s'agissait de plusieurs packs historiques dans `ai_prospecting_packs`, pas d'un doublon CRM certain à supprimer.

### Recommandation

Ne pas supprimer de ligne prospect sans confirmation explicite.  
Si besoin de nettoyage, supprimer uniquement les **anciens packs de test**.

## 16. `Send External Prospect Email` avait une erreur de syntaxe

### Symptôme

- `invalid syntax` dans l'éditeur d'expression

### Cause

Mauvais échappement :

```js
d\\'audit
```

au lieu de :

```js
d\'audit
```

### Fix

Utiliser un apostrophe correctement échappé dans la chaîne JavaScript.

## 17. `can_send` passait à `false`

### Causes possibles

- `target_email` vide
- `executive_letter` vide
- moins de 2 pièces jointes
- PDF absent
- PPTX absent
- `pack_id` absent

### Règle validée

```js
var canSend = Boolean(
  src.target_email &&
  src.executive_letter &&
  src.executive_letter.trim().length > 0 &&
  attachments.length >= 2 &&
  hasPdf &&
  hasPptx &&
  packId
);
```

## 18. État final validé

### V4

- lecture Supabase
- normalisation
- contexte batch injecté
- quota journalier
- dispatch V3
- logs
- résumé
- finalisation

### V3

- pack généré
- email d'approbation correct
- email prospect avec lien corrigé
- email interne de confirmation correct

## 19. Procédure de retest propre

Toujours retester avec :

1. un **nouveau pack**
2. un **nouvel email d'approbation**
3. un **nouvel email prospect**
4. un **nouveau `pack_id`**

Ne jamais valider le fix en cliquant sur un ancien email du thread Gmail.

## 20. Conclusion opérationnelle

Le système est maintenant stabilisé sur :

- V4 batch Supabase
- V3 CRM approval autosend
- génération et injection du `pack_id`
- correction du lien questionnaire

Le point restant n'est plus un bug workflow.  
Le prochain chantier éventuel est la remise en place contrôlée des sources Airtable et Google Sheets avec un merge de sources complet dans V4.
