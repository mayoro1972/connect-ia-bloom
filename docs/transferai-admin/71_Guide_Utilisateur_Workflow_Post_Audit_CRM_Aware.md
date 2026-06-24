# Guide Utilisateur - Workflow Post-Audit CRM-Aware

Référence de workflow actuellement utilisée :

- [74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json](/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/74_n8n_Post_Audit_Expert_Routing_V2_Exportable.json)

## 1. Objet du document

Ce document est la référence opérationnelle du workflow post-audit CRM-aware de TransferAI.

Il explique :

- pourquoi ce nouveau workflow existe par rapport à la V3
- ce que fait la V3
- ce que fait le workflow post-audit CRM-aware
- comment le workflow est structuré
- ce que fait chaque nœud
- comment le tester en mode manuel
- ce qui change entre la recette et la production

Ce guide complète le dispositif de prospection existant. Il ne remplace pas le guide V3 principal. Il décrit la couche qui prend le relais après le remplissage du formulaire d’audit.

---

## 2. Pourquoi un nouveau workflow après la V3

### 2.1 Ce que fait la V3

La V3 de prospection CRM Enhanced sert à :

- qualifier un prospect
- lire son site web et son contexte public
- générer un pack commercial personnalisé
- produire une Executive Letter
- produire un mini-catalogue et un brief de présentation
- stocker ce pack dans Supabase
- faire passer le pack par un circuit d’approbation
- envoyer au prospect un email contenant le lien du formulaire d’audit dynamique

En résumé, la V3 gère toute la partie **avant audit** :

1. on prépare l’approche commerciale
2. on envoie le pack prospect
3. on donne au prospect un lien d’audit personnalisé

### 2.2 Limite naturelle de la V3

La V3 ne suffit pas à elle seule pour exploiter la valeur du formulaire d’audit.

Une fois l’email envoyé au prospect, il reste à faire :

- récupérer ses réponses
- relier ces réponses au bon `pack_id`
- relire l’état CRM du prospect
- déterminer l’orientation TransferAI la plus pertinente
- produire une fiche pré-RDV interne pour l’équipe commerciale et l’équipe audit
- mettre à jour le CRM après l’audit

### 2.3 Ce que fait le workflow post-audit CRM-aware

Le nouveau workflow post-audit CRM-aware sert à :

- reprendre la main après la soumission du formulaire
- relire les données déjà générées par la V3
- vérifier si une réponse formulaire existe ou non
- fusionner pack, réponse formulaire et état CRM
- produire une fiche interne de préparation au rendez-vous
- mettre à jour `prospect_targets`
- envoyer cette fiche en interne

En résumé :

- **V3** = envoi vers le prospect
- **Post-audit CRM-aware** = exploitation interne après audit

### 2.4 État actuel du déploiement

Dans la version actuellement déployée :

- `save-form-response` déclenche automatiquement le webhook n8n quand `completionPercentage >= 80`
- la migration `20260605150000_post_audit_schema.sql` ajoute les colonnes et tables nécessaires
- le workflow `74` peut produire la fiche pré-RDV, mettre à jour le CRM et remplir `post_audit_follow_ups`

---

## 3. Vision d’ensemble du workflow post-audit

Le workflow post-audit se lit comme une chaîne de 4 blocs :

1. entrée du workflow
2. lecture des données sources
3. fusion et interprétation métier
4. sortie interne et mise à jour CRM

### 3.1 Entrée

Le workflow peut démarrer de deux manières :

- manuellement pour les tests
- automatiquement via webhook en production

### 3.2 Lecture des données

Le workflow relit trois sources :

- `ai_prospecting_packs`
- `form_responses`
- `prospect_targets`

### 3.3 Fusion métier

Le workflow construit ensuite un contexte consolidé :

- identité du prospect
- statut CRM
- contenu du pack
- réponses du formulaire
- orientation de service TransferAI

### 3.4 Sortie

Le workflow produit ensuite :

- une fiche interne pré-RDV
- une mise à jour CRM
- un email interne
- un résultat final consolidé

---

## 4. Prérequis

Avant d’utiliser ce workflow, les éléments suivants doivent être prêts.

### 4.1 Côté données

Les tables suivantes doivent être disponibles côté Supabase :

- `ai_prospecting_packs`
- `form_responses`
- `form_invitations`
- `prospect_targets`

### 4.2 Migration de base requise

Le schéma doit inclure les colonnes liées à l’audit dynamique, notamment :

- `form_responses.pack_id`
- `form_responses.context_snapshot`
- `form_invitations.pack_id`
- `form_invitations.response_email`
- `form_invitations.response_cc`
- `form_invitations.access_context`
- `post_audit_follow_ups`

### 4.3 APIs externes

Le workflow utilise :

- Supabase REST
- OpenAI
- Resend

### 4.4 Secrets

En production, il faut utiliser :

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

Pendant la recette, il est possible de tester avec des valeurs en dur dans les nœuds.

---

## 5. Structure générale du workflow

Le workflow recommandé comporte les nœuds suivants :

1. `Manual Trigger`
2. `Audit Completed Webhook`
3. `Set Post-Audit Manual Input`
4. `Parse Post-Audit Webhook`
5. `Normalize Post-Audit Request`
6. `Get Pack Row`
7. `Extract Pack Row`
8. `Get Latest Form Response`
9. `Extract Latest Form Response`
10. `Get Prospect Target Row`
11. `Extract Prospect Target Row`
12. `Build Post-Audit CRM Context`
13. `Generate Internal Pre-RDV Brief`
14. `Update Prospect Target Post-Audit`
15. `Send Internal Brief Email`
16. `Build Post-Audit Result`

Le nœud `Build Post-Audit CRM Context` est le point de bifurcation principal :

- branche A vers `Generate Internal Pre-RDV Brief`
- branche B vers `Update Prospect Target Post-Audit`

Puis :

- `Generate Internal Pre-RDV Brief` alimente `Send Internal Brief Email`
- `Send Internal Brief Email` alimente `Build Post-Audit Result`

Dans la version `74` actuellement utilisée, cette structure de base est enrichie par des nœuds supplémentaires, notamment :

- `Reconciliation Schedule Trigger`
- `If Audit Completed`
- `Get Invitation Row`
- `Extract Invitation Row`
- `If Already Post-Audit Processed`
- `Build Expert Routing`
- `Patch Pack Post-Audit Status`
- `Upsert Follow-Up Tracking`
- `If Slack Alerts Enabled`
- `Send Slack Expert Alert`
- `Build No-Op Result`

---

## 6. Guide nœud par nœud

## 6.1 Déclencheurs

### `Manual Trigger`

**Rôle**

- lancer le workflow manuellement

**Quand l’utiliser**

- recette
- démonstration
- validation d’un `pack_id`

**Remarque**

Ce nœud est idéal au début du projet, tant que le déclenchement automatique n’est pas encore branché.

### `Audit Completed Webhook`

**Rôle**

- déclencher automatiquement le workflow après un événement externe

**Quand l’utiliser**

- en production
- après soumission réelle du formulaire

**Ce qu’il reçoit**

- `pack_id`
- éventuellement `internal_email_to`
- éventuellement `next_action_delay_days`

---

## 6.2 Préparation de la requête

### `Set Post-Audit Manual Input`

**Rôle**

- fournir des valeurs de test quand on ne passe pas par le webhook

**Champs typiques**

- `pack_id`
- `internal_email_to`
- `next_action_delay_days`

**Usage recette**

Exemple de valeurs directes :

```text
pack_id = pack-1780594185996-4eb2jg4w
internal_email_to = marius.ayoro70@gmail.com
next_action_delay_days = 1
```

**Remarque**

Ce nœud sert uniquement à la recette manuelle. En production, les valeurs viendront du webhook ou d’un autre workflow.

### `Parse Post-Audit Webhook`

**Rôle**

- lire le body ou la query du webhook
- normaliser les paramètres reçus

**Utilité**

Éviter les variations de format entre un appel manuel, un appel HTTP ou un déclenchement par un autre workflow.

### `Normalize Post-Audit Request`

**Rôle**

- uniformiser le format des champs d’entrée

**Ce que le nœud fixe**

- `pack_id` sous forme de chaîne propre
- `internal_email_to` sous forme d’email exploitable
- `next_action_delay_days` sous forme numérique
- `trigger_source`

**Pourquoi ce nœud est important**

Il permet à tous les nœuds suivants d’utiliser un format stable, quelle que soit la source d’entrée.

---

## 6.3 Lecture du pack V3

### `Get Pack Row`

**Type**

- `HTTP Request`

**Rôle**

- relire la ligne du pack dans `ai_prospecting_packs`

**Ce qu’il utilise**

- `pack_id`

**Ce qu’il retourne**

- le pack complet
- le `payload`
- les métadonnées de génération

**Point de vigilance**

La base distante doit être à jour. Si le schéma Supabase est incomplet, ce nœud peut fonctionner alors que la suite échoue plus loin.

### `Extract Pack Row`

**Type**

- `Code`

**Rôle**

- extraire les champs utiles du pack
- stabiliser la structure de sortie

**Sorties importantes**

- `row_id`
- `pack_id`
- `prospect_id`
- `organization_name`
- `target_email`
- `status`
- `payload`

**Pourquoi ce nœud est utile**

Le payload du pack est riche. Ce nœud évite de répéter partout les mêmes accès au JSON brut.

---

## 6.4 Lecture de la réponse formulaire

### `Get Latest Form Response`

**Type**

- `HTTP Request`

**Rôle**

- récupérer la dernière réponse formulaire associée au `pack_id`

**Comportement attendu**

- si une réponse existe, elle est retournée
- sinon le nœud peut ne rien renvoyer

**Réglage recommandé**

Activez `Always Output Data` pour continuer à tester le workflow même si aucun formulaire n’a encore été soumis.

**Point de vigilance**

Dans ce projet, la base historique utilise `last_updated_at` et non `updated_at`. L’ordre doit donc tenir compte de cette colonne.

### `Extract Latest Form Response`

**Type**

- `Code`

**Rôle**

- normaliser la lecture de la réponse formulaire
- créer un indicateur métier simple

**Sorties importantes**

- `form_response_id`
- `submitted_at`
- `last_updated_at`
- `invitation_token`
- `session_id`
- `completion_percentage`
- `is_completed`
- `form_data`
- `context_snapshot`
- `form_response_missing`

**Lecture métier**

- `form_response_missing = true` : aucune vraie réponse n’a été trouvée
- `form_response_missing = false` : il existe une soumission exploitable

---

## 6.5 Lecture de l’état CRM

### `Get Prospect Target Row`

**Type**

- `HTTP Request`

**Rôle**

- relire la ligne CRM dans `prospect_targets`

**Ce qu’il utilise**

- `prospect_id`

**Comportement attendu**

- si le prospect existe en CRM, le nœud retourne une ligne
- sinon il peut ne rien retourner

**Réglage recommandé**

Activez `Always Output Data` pour continuer la recette même si le prospect n’existe pas encore dans `prospect_targets`.

### `Extract Prospect Target Row`

**Type**

- `Code`

**Rôle**

- normaliser les informations CRM
- exposer un indicateur simple de présence CRM

**Sorties importantes**

- `crm_row_id`
- `crm_status`
- `crm_paused`
- `crm_do_not_contact`
- `crm_last_response_status`
- `crm_last_sequence_result`
- `crm_stop_reason`
- `crm_niche_status`
- `crm_next_action_at`
- `crm_last_pack_id`
- `crm_record_missing`

**Lecture métier**

- `crm_record_missing = true` : aucune ligne CRM n’a été retrouvée
- `crm_record_missing = false` : le prospect existe déjà dans le CRM

---

## 6.6 Fusion métier et orientation TransferAI

### `Build Post-Audit CRM Context`

**Type**

- `Code`

**Rôle**

- fusionner le pack, la réponse formulaire et l’état CRM
- produire le contexte métier final utilisé par la suite

**Ce que ce nœud rassemble**

- identité de l’organisation
- contact principal
- langue du prospect
- secteur et type d’organisation
- recommandations issues du pack
- éventuelle recommandation issue du formulaire
- état CRM avant mise à jour

**Sorties importantes**

- `organization_name`
- `decision_maker_name`
- `target_email`
- `prospect_language`
- `recommended_offer`
- `recommended_use_case`
- `audit_form_url`
- `transferai_recommendation`
- `crm_next_action_at_after`
- `post_audit_ready`

**Interprétation**

- `post_audit_ready = false` : le contexte existe, mais pas encore de vraie soumission confirmée
- `post_audit_ready = true` : le dossier est prêt pour un traitement post-audit complet

**Pourquoi ce nœud est central**

C’est le cerveau du workflow. Tous les nœuds suivants doivent s’appuyer sur lui plutôt que sur les réponses brutes précédentes.

---

## 6.7 Génération de la fiche interne

### `Generate Internal Pre-RDV Brief`

**Type**

- `HTTP Request` vers OpenAI

**Rôle**

- transformer le contexte consolidé en fiche lisible pour l’équipe interne

**Ce que la fiche doit contenir**

- identification
- synthèse rapide
- diagnostic métier
- priorités exprimées
- orientation TransferAI recommandée
- prochaine étape recommandée
- points à vérifier en rendez-vous

**Gestion des langues**

Ce nœud doit être aligné avec la logique V1, V2 et V3 :

- `fr` → français professionnel standard
- `en` → anglais professionnel standard
- `es` → espagnol professionnel standard

**Cas sans vraie soumission**

Si `post_audit_ready = false`, la fiche doit préciser qu’il s’agit d’une préparation préliminaire fondée sur le pack et le contexte disponible.

**Sortie principale**

- `choices[0].message.content`

Cette sortie sert ensuite au mail interne et au résultat final.

---

## 6.8 Mise à jour CRM

### `Update Prospect Target Post-Audit`

**Type**

- `HTTP Request`

**Rôle**

- mettre à jour `prospect_targets` après lecture du contexte post-audit

**Branchement recommandé**

Ce nœud doit partir directement de `Build Post-Audit CRM Context`, et non de `Generate Internal Pre-RDV Brief`.

**Pourquoi**

Il a besoin du contexte métier structuré :

- `prospect_id`
- `post_audit_ready`
- `crm_next_action_at_after`
- `pack_id`

**Valeurs typiquement mises à jour**

- `status`
- `paused`
- `last_response_status`
- `last_sequence_result`
- `stop_reason`
- `niche_status`
- `next_action_at`
- `last_pack_id`
- `updated_at`

**Logique métier recommandée**

- si `post_audit_ready = false`
  - statut intermédiaire d’attente de soumission
- si `post_audit_ready = true`
  - statut de qualification après audit

---

## 6.9 Envoi interne

### `Send Internal Brief Email`

**Type**

- `HTTP Request` vers Resend

**Rôle**

- envoyer la fiche pré-RDV en interne

**Source du contenu**

- `Generate Internal Pre-RDV Brief`

**Source du destinataire**

- `Build Post-Audit CRM Context`

**Point de vigilance Resend**

En environnement de test avec `onboarding@resend.dev` :

- Resend n’autorise que les envois vers l’adresse propriétaire du compte
- il faut donc utiliser l’email de test autorisé

En production :

- il faut vérifier un domaine Resend
- et utiliser une adresse `from` de ce domaine

**Résultat attendu**

- une réponse contenant un `id`

---

## 6.10 Résultat final consolidé

### `Build Post-Audit Result`

**Type**

- `Code`

**Rôle**

- consolider le résultat final du workflow

**Ce que ce nœud rassemble**

- contexte CRM consolidé
- contenu de la fiche
- résultat Resend

**Sorties importantes**

- `status`
- `pack_id`
- `prospect_id`
- `organization_name`
- `post_audit_ready`
- `primary_service`
- `secondary_service`
- `confidence_label`
- `recommended_use_case_final`
- `crm_next_action_at_after`
- `brief_markdown`
- `internal_email_to`
- `resend_response`

**Lecture métier**

Quand tout est en ordre, on attend :

- `status = post_audit_processed`
- une fiche pré-RDV générée
- un identifiant Resend si l’email a été envoyé

---

## 7. Ordre de test recommandé

Pour une recette propre, l’ordre recommandé est :

1. `Set Post-Audit Manual Input`
2. `Normalize Post-Audit Request`
3. `Get Pack Row`
4. `Extract Pack Row`
5. `Get Latest Form Response`
6. `Extract Latest Form Response`
7. `Get Prospect Target Row`
8. `Extract Prospect Target Row`
9. `Build Post-Audit CRM Context`
10. `Generate Internal Pre-RDV Brief`
11. `Update Prospect Target Post-Audit`
12. `Send Internal Brief Email`
13. `Build Post-Audit Result`

---

## 8. Interprétation des états pendant la recette

### Cas 1 : `post_audit_ready = false`

Cela signifie :

- le pack existe
- le workflow fonctionne
- mais aucune vraie soumission formulaire n’a encore été trouvée

Le workflow peut quand même produire :

- une fiche préliminaire
- une prochaine action
- une mise à jour CRM de pré-attente

### Cas 2 : `post_audit_ready = true`

Cela signifie :

- une vraie réponse formulaire a été retrouvée
- le workflow peut produire une fiche post-audit complète

---

## 9. Différence entre recette et production

### En recette

- on utilise souvent `Manual Trigger`
- on fixe `pack_id` à la main
- on tolère l’absence de réponse formulaire
- on utilise une adresse email de test

### En production

- on déclenche via `Audit Completed Webhook`
- le `pack_id` est transmis automatiquement
- le formulaire a réellement été soumis
- le domaine Resend est vérifié
- le CRM est réellement mis à jour

---

## 10. Résumé final

Le workflow post-audit CRM-aware n’est pas un doublon de la V3.

Il sert à transformer un simple formulaire d’audit en dispositif opérationnel interne :

- la V3 envoie le prospect vers l’audit
- le workflow post-audit lit ce qui revient
- il oriente l’équipe TransferAI
- il prépare le rendez-vous
- il remet à jour le CRM

Autrement dit :

- **V3** ouvre la relation et envoie le lien
- **Post-audit CRM-aware** transforme la réponse en décision interne exploitable
