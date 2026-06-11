# Implementation - Audit dynamique + orientation TransferAI dans n8n

Ce guide s'applique au workflow joint :

- `/Users/marius_ayoro/Downloads/TransferAI Prospecting V3 CRM Enhanced [FINAL]-12.json`

Objectif :

1. rendre le lien du formulaire d'audit dynamique par `pack_id`
2. faire apparaitre ce lien dynamique dans l'Executive Letter
3. stocker le pack complet dans Supabase
4. récupérer après soumission du formulaire l'orientation de service calculée
5. générer automatiquement une fiche pré-RDV interne
6. refléter cette orientation dans n8n

## Prérequis

- Le frontend du formulaire est déjà prêt dans le repo :
  - `src/pages/ProspectAuditFormPage.tsx`
  - `src/lib/prospect-audit.ts`
- Les fonctions Supabase sont déjà prêtes :
  - `supabase/functions/resolve-invitation/index.ts`
  - `supabase/functions/save-form-response/index.ts`
- La structure de contexte dynamique est déjà prête :
  - `supabase/functions/_shared/prospect-audit-context.ts`

## 1. Déploiement technique avant n8n

À faire dans cet ordre :

1. `supabase db push`
2. `supabase functions deploy resolve-invitation`
3. `supabase functions deploy save-form-response`
4. déployer le frontend qui sert `questionnaire-audit`
5. définir l'URL publique utilisée par les workflows :
   - `https://audit.transferai.ci/questionnaire-audit`

## 2. Nœuds à modifier dans le workflow prospecting existant

Les nœuds à modifier dans le fichier joint sont :

1. `Generate Executive Letter`
2. `Assemble Prospect Pack`
3. `Store Pack In Supabase`
4. `Build Approval Email`
5. `Extract Pack Payload`
6. `Build Send Context`

Les nœuds à ajouter pour la phase post-audit sont :

1. `Audit Submitted Webhook`
2. `Get Pack Row`
3. `Get Latest Form Response`
4. `Build Post-Audit Orientation Context`
5. `Generate Internal Pre-RDV Brief`
6. `Store Internal Brief` ou `Send Internal Brief Email`

## 3. Modification du nœud `Assemble Prospect Pack`

Ce nœud doit maintenant créer explicitement le lien dynamique du formulaire et le stocker dans le pack.

Ajoutez les variables suivantes dans le `Code` node :

```js
var auditBaseUrl = 'https://audit.transferai.ci/questionnaire-audit';
var auditFormUrl = auditBaseUrl + '?pack_id=' + encodeURIComponent(packId);
```

Puis ajoutez dans l'objet `json` retourné :

```js
audit_form_url: auditFormUrl,
booking_link_30min: ctx.booking_link_30min || 'https://calendly.com/contact-transferai/30min',
```

Ajoutez aussi ces champs de confort si vous voulez enrichir la revue interne plus tôt :

```js
recommended_primary_service: ctx.recommended_offer || null,
recommended_secondary_service: (ctx.offer_sequence && ctx.offer_sequence[1]) || null,
```

Le retour final doit au minimum contenir :

```js
{
  pack_id,
  generated_at,
  audit_form_url,
  executive_letter,
  executive_letter_html,
  tailored_catalogue,
  tailored_audit_form,
  deck_brief
}
```

## 4. Modification du nœud `Generate Executive Letter`

Dans le prompt système actuel, le lien du formulaire est encore hardcodé :

- `https://audit.transferai.ci/`

Il faut le remplacer par une instruction qui oblige le modèle à utiliser le lien dynamique du pack.

### Changement recommandé dans le prompt

Remplacez la partie :

```text
Ajoute qu un Formulaire d audit pre-RDV doit etre complete en ligne via ce lien : https://audit.transferai.ci/
```

par :

```text
Ajoute qu un Formulaire d audit pre-RDV doit etre complete en ligne via ce lien dynamique : {{AUDIT_FORM_URL}}.
Ce formulaire est IMPORTANT car il permet a nos experts de preparer un audit sur mesure avant la rencontre et de maximiser les 30 minutes de rendez-vous.
```

### Puis injectez le lien dynamique

Dans le `user prompt`, ajoutez :

```js
audit_form_url: $json.audit_form_url || null,
```

Ensuite, dans `Assemble Prospect Pack`, gardez l'hydratation finale ou ajoutez simplement :

```js
executiveLetter = executiveLetter.replace(/\{\{AUDIT_FORM_URL\}\}/g, ctx.audit_form_url || '');
```

## 5. Modification du nœud `Store Pack In Supabase`

Ce nœud stocke déjà `payload: $json`, ce qui est bien.

Conservez cela, mais ajoutez des colonnes de confort si vous voulez simplifier les requêtes futures :

```js
audit_form_url: $json.audit_form_url || null,
recommended_offer: $json.recommended_offer || null,
recommended_use_case: $json.recommended_use_case || null,
commercial_priority_tier: $json.commercial_priority_tier || null,
```

Le `jsonBody` recommandé devient :

```js
={{JSON.stringify({
  pack_id: $json.pack_id,
  prospect_id: $json.prospect_id || null,
  organization_name: $json.organization_name || null,
  target_email: $json.target_email || null,
  status: 'pending_approval',
  audit_form_url: $json.audit_form_url || null,
  recommended_offer: $json.recommended_offer || null,
  recommended_use_case: $json.recommended_use_case || null,
  commercial_priority_tier: $json.commercial_priority_tier || null,
  payload: $json,
  llm_redaction_summary: $json.llm_redaction_summary || null
})}}
```

## 6. Modification du nœud `Build Approval Email`

La validation interne doit déjà montrer le futur lien dynamique envoyé au prospect.

Ajoutez dans le résumé :

```js
'Lien formulaire: ' + escapeHtml(safe(pack.payload && pack.payload.audit_form_url, 'a confirmer')),
```

Ajoutez aussi une pré-orientation commerciale si utile :

```js
'Offre recommandee: ' + escapeHtml(safe(pack.payload && pack.payload.recommended_offer, 'a confirmer')),
'Use case recommande: ' + escapeHtml(safe(pack.payload && pack.payload.recommended_use_case, 'a confirmer')),
```

## 7. Modification du nœud `Extract Pack Payload`

Faites remonter explicitement le lien audit dans le contexte aval :

```js
audit_form_url: payload.audit_form_url || row.audit_form_url || '',
recommended_offer: payload.recommended_offer || row.recommended_offer || '',
recommended_use_case: payload.recommended_use_case || row.recommended_use_case || '',
commercial_priority_tier: payload.commercial_priority_tier || row.commercial_priority_tier || '',
```

## 8. Modification du nœud `Build Send Context`

Ce nœud doit transporter `audit_form_url` jusqu'à l'email prospect final, même si l'Executive Letter est déjà générée.

Ajoutez simplement :

```js
audit_form_url: payload.audit_form_url || src.audit_form_url || '',
```

## 9. Contrôle important sur l'email final prospect

Le nœud `Send External Prospect Email` n'a pas besoin de changer si le lien dynamique est déjà injecté dans `executive_letter_html`.

Mais il faut vérifier que :

1. l'Executive Letter contient bien le lien packé
2. l'email HTML envoyé est bien `executive_letter_html`

Le résultat attendu dans le courrier est :

```text
Formulaire d audit pre-RDV a completer via ce lien :
https://audit.transferai.ci/questionnaire-audit?pack_id=pack-...
```

## 10. Nouveau workflow post-audit à créer

Le workflow prospecting existant s'arrête à l'envoi du pack. La restitution post-audit doit être gérée dans un second workflow.

### Nouveau nœud 1 - `Audit Submitted Webhook`

Type :

- `Webhook`

Usage :

- appelé après la soumission réelle du formulaire
- entrée minimale :
  - `pack_id`
  - éventuellement `response_id`

Si vous préférez un déclenchement planifié, vous pouvez aussi partir d'un `Cron` + requête Supabase.

### Nouveau nœud 2 - `Get Pack Row`

Type :

- `HTTP Request`

URL :

```text
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/ai_prospecting_packs?pack_id=eq.{{$json.pack_id}}&select=*
```

Méthode :

- `GET`

Headers :

- `apikey`
- `Authorization`

### Nouveau nœud 3 - `Get Latest Form Response`

Type :

- `HTTP Request`

URL recommandée :

```text
https://wlhznciwuofueffyoflo.supabase.co/rest/v1/form_responses?pack_id=eq.{{$json.pack_id}}&select=*&order=submitted_at.desc.nullslast,updated_at.desc.nullslast&limit=1
```

Méthode :

- `GET`

Headers :

- `apikey`
- `Authorization`

### Nouveau nœud 4 - `Build Post-Audit Orientation Context`

Type :

- `Code`

Code :

```js
const packRow = $('Get Pack Row').first().json || {};
const formRow = $('Get Latest Form Response').first().json || {};

const payload = packRow.payload || {};
const formData = formRow.form_data || {};
const contextSnapshot = formRow.context_snapshot || {};

const recommendation =
  formData.transferai_recommendation ||
  contextSnapshot.transferai_recommendation ||
  null;

return [{
  json: {
    pack_id: formRow.pack_id || payload.pack_id || null,
    prospect_language: payload.prospect_language || 'fr',
    organization_name: formData.c_entite || payload.organization_name || null,
    decision_maker_name: formData.c_nom || payload.decision_maker_name || null,
    target_email: formData.c_email || payload.target_email || null,
    sector_guess: formData.audit_sector || payload.sector_guess || null,
    audit_form_url: payload.audit_form_url || null,
    recommended_offer: payload.recommended_offer || null,
    recommended_use_case: payload.recommended_use_case || null,
    best_selling_use_case: payload.best_selling_use_case || null,
    commercial_priority_tier: payload.commercial_priority_tier || null,
    transferai_recommendation: recommendation,
    submitted_at: formRow.submitted_at || null,
    form_data: formData,
    context_snapshot: contextSnapshot,
    pack_payload: payload
  }
}];
```

## 11. Forme exacte de la recommandation de service

Le formulaire sauvegarde désormais :

- `form_data.transferai_recommendation`
- ou en secours `context_snapshot.transferai_recommendation`

Structure attendue :

```json
{
  "primary": {
    "key": "automation",
    "title": "Automatisation & solutions IA",
    "shortTitle": "Automatisation IA",
    "description": "...",
    "outcome": "...",
    "nextStep": "...",
    "href": "/developpement-solutions-ia"
  },
  "secondary": {
    "key": "training",
    "title": "Formation ciblée",
    "shortTitle": "Formation",
    "description": "...",
    "outcome": "...",
    "nextStep": "...",
    "href": "/catalogue"
  },
  "confidenceLabel": "Orientation forte",
  "rationale": [
    "...",
    "..."
  ],
  "nextStepTitle": "Ce que nous recommanderions après l'audit",
  "nextStepDescription": "..."
}
```

## 12. Nouveau nœud 5 - `Generate Internal Pre-RDV Brief`

Type :

- `HTTP Request` vers OpenAI

But :

- produire la fiche interne trilingue en `fr`, `en` ou `es`

Base de prompt :

```text
Tu rediges une fiche pre-RDV interne TransferAI a partir du pack prospecting, des reponses du formulaire et de l'orientation de service calculee. Tu dois faire apparaitre clairement le service principal recommande, le parcours complementaire, le niveau de confiance, les raisons de cette orientation et la prochaine etape a preparer pour l'equipe commerciale et l'equipe audit.
```

Le modèle complet à utiliser est dans :

- `docs/transferai-admin/modele-fiche-pre-rdv-audit-trilingue.md`

## 13. Nouveau nœud 6 - restitution interne

Vous avez 3 options :

1. `Send Internal Brief Email`
   - envoi par Resend ou Gmail
2. `Store Internal Brief`
   - stockage dans Supabase
3. `Push CRM`
   - enregistrement dans votre CRM

Le plus simple pour commencer :

1. générer la fiche
2. l'envoyer par email interne
3. ensuite seulement la pousser dans le CRM

## 14. Ordre d'implémentation recommandé

1. déployer Supabase + frontend
2. modifier `Assemble Prospect Pack`
3. modifier `Generate Executive Letter`
4. modifier `Store Pack In Supabase`
5. modifier `Build Approval Email`
6. tester qu'un pack contient bien `audit_form_url`
7. envoyer un pack test
8. vérifier que la lettre contient bien le lien dynamique
9. créer le workflow post-audit
10. tester une vraie soumission du formulaire
11. vérifier l'arrivée de `transferai_recommendation`
12. générer la fiche pré-RDV interne

## 15. Recommandation d'expert

Si vous voulez aller vite avec moins de risque :

1. gardez votre workflow prospecting actuel pour la génération du pack
2. implémentez d'abord seulement le lien dynamique `audit_form_url`
3. validez le clic prospect -> formulaire -> soumission Supabase
4. ajoutez ensuite le second workflow post-audit

Cela évite de mélanger en une seule passe :

- génération du pack
- envoi du pack
- collecte du formulaire
- restitution interne

## 16. Point de vigilance critique

Le fichier joint contient des clés API et tokens hardcodés dans les nœuds :

- OpenAI
- Supabase service role
- Resend

Avant production, il faut impérativement les migrer dans :

- `Credentials` n8n
- ou variables d'environnement

Ne gardez pas ces secrets en clair dans la version finale du workflow.
