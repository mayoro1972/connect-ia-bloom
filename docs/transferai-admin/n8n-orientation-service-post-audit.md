# n8n - Orientation de Service Post-Audit

Ce bloc permet de refléter automatiquement dans n8n l'orientation de service calculée après soumission du formulaire d'audit.

## Objectif

À partir de :

- `ai_prospecting_packs.payload`
- `form_responses.form_data`
- `form_responses.context_snapshot`

produire un objet directement exploitable dans :

- la fiche pré-RDV interne
- un email interne
- un CRM
- un PDF de synthèse

## Source recommandée

Lire d'abord la dernière réponse du formulaire par `pack_id`, puis extraire :

- `form_data.transferai_recommendation`
- ou, si absent, `context_snapshot.transferai_recommendation`

## Code node n8n recommandé

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
    recommended_offer: payload.recommended_offer || null,
    recommended_use_case: payload.recommended_use_case || null,
    best_selling_use_case: payload.best_selling_use_case || null,
    commercial_priority_tier: payload.commercial_priority_tier || null,
    transferai_recommendation: recommendation,
    submitted_at: formRow.submitted_at || null,
    form_data: formData,
    pack_payload: payload
  }
}];
```

## Sortie cible attendue

```json
{
  "pack_id": "pack-20260603-demo-001",
  "prospect_language": "fr",
  "organization_name": "Entreprise Exemple",
  "transferai_recommendation": {
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
}
```

## Usage dans la fiche pré-RDV

Les champs à réinjecter en priorité sont :

- `transferai_recommendation.primary.title`
- `transferai_recommendation.secondary.title`
- `transferai_recommendation.confidenceLabel`
- `transferai_recommendation.nextStepDescription`
- `transferai_recommendation.rationale`

## Prompt LLM conseillé pour la fiche interne

```text
Tu rediges une fiche pre-RDV interne TransferAI a partir du pack prospecting, des reponses du formulaire et de l'orientation de service calculee. Tu dois faire apparaitre clairement le service principal recommande, le parcours complementaire, le niveau de confiance, les raisons de cette orientation et la prochaine etape a preparer pour l'equipe commerciale et l'equipe audit.
```

## Sequence n8n recommandée

1. `Get Pack Row`
2. `Get Latest Form Response`
3. `Build Post-Audit Orientation Context`
4. `Generate Internal Pre-RDV Brief`
5. `Store Brief / Send Internal Email / Push CRM`

