# Modele Fiche Pre-RDV Audit Trilingue

Ce modele est concu pour etre genere apres soumission du formulaire d'audit, en s'appuyant sur le workflow `TransferAI Prospecting V3 CRM Enhanced [FINAL]` et sur les reponses enregistrees dans `form_responses`.

## 1. Champs du workflow a reutiliser

Champs issus du pack prospecting:

- `pack_id`
- `prospect_id`
- `organization_name`
- `decision_maker_name`
- `target_email`
- `website`
- `country`
- `organization_type`
- `sector_guess`
- `prospect_language`
- `organization_summary`
- `probable_strengths`
- `probable_weaknesses`
- `probable_needs`
- `entry_point_niche`
- `probable_problems`
- `probable_quick_wins`
- `recommended_offer`
- `offer_sequence`
- `recommended_training_bundle`
- `recommended_use_case`
- `best_selling_use_case`
- `commercial_priority_tier`
- `recommended_meeting_angle`
- `roi_hypothesis`
- `expected_time_savings`
- `expected_service_improvements`
- `expected_quick_wins`
- `delivery_timeline`
- `signal_tags`
- `sector_pitches`
- `booking_link_30min`
- `audit_form_url`

Champs attendus depuis `form_responses.form_data`:

- `c_nom`
- `c_email`
- `c_entite`
- `c_poste`
- `audit_sector`
- `maturity_level`
- `priority_window`
- `audit_success_metric`
- `prospect_context`
- `current_workflow_snapshot`
- `target_outcome`
- `governance_watchpoints`
- `existing_tooling`
- `selected_quick_wins`
- `selected_use_cases`
- `selected_constraints`
- `preferred_support`
- `transferai_recommendation`
- `transferai_recommendation_generated_at`

## 2. Regle de langue

Utiliser dans cet ordre:

1. `prospect_language` si la valeur est `fr`, `en` ou `es`
2. sinon `llm_allowed_payload.language` si disponible
3. sinon `fr`

## 3. Structure de sortie recommandee

La sortie recommandee pour l'equipe commerciale et l'equipe audit est un Markdown propre, lisible dans n8n, email interne, CRM ou document PDF.

Sections recommandees:

1. Identification
2. Lecture rapide
3. Contexte et diagnostic
4. Priorites exprimees dans le formulaire
5. Recommandation TransferAI
6. Preparation du rendez-vous
7. Prochaine action interne

## 4. Modele Francais

```md
# Fiche pre-RDV audit IA

## Identification
- Pack ID : {{pack_id}}
- Prospect ID : {{prospect_id}}
- Nom du contact : {{c_nom | decision_maker_name | "A confirmer"}}
- Email : {{c_email | target_email | "A confirmer"}}
- Organisation : {{c_entite | organization_name | "A confirmer"}}
- Fonction : {{c_poste | "A confirmer"}}
- Pays : {{country | "A confirmer"}}
- Site web : {{website | "A confirmer"}}
- Date de soumission : {{submitted_at}}

## Lecture rapide
- Langue du prospect : {{prospect_language}}
- Secteur : {{audit_sector | sector_guess | "A confirmer"}}
- Type d'organisation : {{organization_type | "A confirmer"}}
- Niveau de maturite IA : {{maturity_level | "A confirmer"}}
- Horizon prioritaire : {{priority_window | "A confirmer"}}
- Signal de succes attendu : {{audit_success_metric | "A confirmer"}}
- Tier commercial : {{commercial_priority_tier | "A confirmer"}}

## Contexte et diagnostic
### Resume prospecting
{{organization_summary | "Resume non disponible"}}

### Contexte exprime par le prospect
{{prospect_context | "Contexte non renseigne"}}

### Workflow actuel a analyser
{{current_workflow_snapshot | "Workflow actuel non detaille"}}

### Resultat cible
{{target_outcome | "Resultat cible non precise"}}

### Outils existants
{{existing_tooling | "Outils existants non precises"}}

### Points de vigilance gouvernance
{{governance_watchpoints | "Aucun point specifique remonte"}}

## Priorites exprimees dans le formulaire
### Quick wins selectionnes
{{selected_quick_wins | probable_quick_wins | "A confirmer"}}

### Cas d'usage prioritaires
{{selected_use_cases | recommended_use_case | best_selling_use_case | "A confirmer"}}

### Contraintes majeures
{{selected_constraints | probable_needs | probable_problems | "A confirmer"}}

### Type d'accompagnement souhaite
{{preferred_support | recommended_offer | "A confirmer"}}

## Recommandation TransferAI
- Service principal recommande : {{transferai_recommendation.primary.title | recommended_offer | "A confirmer"}}
- Parcours complementaire : {{transferai_recommendation.secondary.title | "A confirmer"}}
- Niveau de confiance : {{transferai_recommendation.confidenceLabel | "A confirmer"}}
- Prochaine etape recommande : {{transferai_recommendation.nextStepDescription | recommended_meeting_angle | "A confirmer"}}
- Offre recommandee : {{recommended_offer | "A confirmer"}}
- Cas d'usage recommande : {{recommended_use_case | "A confirmer"}}
- Meilleur cas d'usage vendable : {{best_selling_use_case | "A confirmer"}}
- Angle de rendez-vous recommande : {{recommended_meeting_angle | "A confirmer"}}
- Porte d'entree recommandee : {{entry_point_niche | "A confirmer"}}
- Formations prioritaires : {{recommended_training_bundle | "A confirmer"}}

## Hypotheses de valeur
### ROI a valider
{{roi_hypothesis | "ROI non estime"}}

### Gains de temps attendus
{{expected_time_savings | "Non estimes"}}

### Ameliorations de service attendues
{{expected_service_improvements | "Non estimees"}}

### Gains rapides attendus
{{expected_quick_wins | "Non estimes"}}

### Delai indicatif
{{delivery_timeline | "A confirmer"}}

## Preparation du rendez-vous
- Lien de reservation : {{booking_link_30min}}
- Lien du formulaire : {{audit_form_url}}
- Questions a poser pendant l'appel :
  - Quel flux doit etre traite en premier pour produire un gain visible sous 30 a 60 jours ?
  - Quel niveau de risque ou de gouvernance doit etre respecte avant tout pilote ?
  - Quelle equipe doit etre impliquee des la premiere phase ?
  - Quel resultat concret permettrait de considerer le pilote comme reussi ?

## Prochaine action interne
- Statut de la fiche : Formulaire recu et exploitable pour pre-audit
- Action commerciale suggeree : preparer un brief oral sur {{recommended_use_case | "le cas d'usage prioritaire"}}
- Action consultant suggeree : preparer une synthese sectorielle basee sur {{signal_tags | sector_pitches | "les signaux detectes"}}
```

## 5. English Model

```md
# AI Audit Pre-Meeting Brief

## Identification
- Pack ID: {{pack_id}}
- Prospect ID: {{prospect_id}}
- Contact name: {{c_nom | decision_maker_name | "To be confirmed"}}
- Email: {{c_email | target_email | "To be confirmed"}}
- Organization: {{c_entite | organization_name | "To be confirmed"}}
- Role: {{c_poste | "To be confirmed"}}
- Country: {{country | "To be confirmed"}}
- Website: {{website | "To be confirmed"}}
- Submission date: {{submitted_at}}

## Quick Read
- Prospect language: {{prospect_language}}
- Sector: {{audit_sector | sector_guess | "To be confirmed"}}
- Organization type: {{organization_type | "To be confirmed"}}
- AI maturity level: {{maturity_level | "To be confirmed"}}
- Priority horizon: {{priority_window | "To be confirmed"}}
- Expected success signal: {{audit_success_metric | "To be confirmed"}}
- Commercial tier: {{commercial_priority_tier | "To be confirmed"}}

## Context and Diagnosis
### Prospecting summary
{{organization_summary | "No summary available"}}

### Prospect-stated context
{{prospect_context | "No context provided"}}

### Current workflow to assess
{{current_workflow_snapshot | "Current workflow not detailed"}}

### Target outcome
{{target_outcome | "Target outcome not specified"}}

### Existing tools
{{existing_tooling | "Existing tools not specified"}}

### Governance watchpoints
{{governance_watchpoints | "No specific governance concern provided"}}

## Priorities Expressed in the Form
### Selected quick wins
{{selected_quick_wins | probable_quick_wins | "To be confirmed"}}

### Priority use cases
{{selected_use_cases | recommended_use_case | best_selling_use_case | "To be confirmed"}}

### Main constraints
{{selected_constraints | probable_needs | probable_problems | "To be confirmed"}}

### Preferred support model
{{preferred_support | recommended_offer | "To be confirmed"}}

## TransferAI Recommendation
- Primary recommended service: {{transferai_recommendation.primary.title | recommended_offer | "To be confirmed"}}
- Complementary path: {{transferai_recommendation.secondary.title | "To be confirmed"}}
- Confidence level: {{transferai_recommendation.confidenceLabel | "To be confirmed"}}
- Recommended next step: {{transferai_recommendation.nextStepDescription | recommended_meeting_angle | "To be confirmed"}}
- Recommended offer: {{recommended_offer | "To be confirmed"}}
- Recommended use case: {{recommended_use_case | "To be confirmed"}}
- Best near-term sellable use case: {{best_selling_use_case | "To be confirmed"}}
- Recommended meeting angle: {{recommended_meeting_angle | "To be confirmed"}}
- Recommended entry point: {{entry_point_niche | "To be confirmed"}}
- Priority training bundle: {{recommended_training_bundle | "To be confirmed"}}

## Value Hypotheses
### ROI to validate
{{roi_hypothesis | "No ROI hypothesis available"}}

### Expected time savings
{{expected_time_savings | "Not estimated"}}

### Expected service improvements
{{expected_service_improvements | "Not estimated"}}

### Expected quick wins
{{expected_quick_wins | "Not estimated"}}

### Indicative delivery horizon
{{delivery_timeline | "To be confirmed"}}

## Meeting Preparation
- Booking link: {{booking_link_30min}}
- Audit form link: {{audit_form_url}}
- Questions to ask during the call:
  - Which workflow should be addressed first to generate visible value within 30 to 60 days?
  - What governance or risk constraints must be respected before any pilot begins?
  - Which team should be involved from phase one?
  - What concrete result would make the pilot successful in your view?

## Internal Next Step
- Brief status: Form received and ready for pre-audit review
- Suggested commercial action: prepare a spoken brief around {{recommended_use_case | "the top priority use case"}}
- Suggested consultant action: prepare a sector summary based on {{signal_tags | sector_pitches | "detected signals"}}
```

## 6. Modelo Espanol

```md
# Ficha previa a la reunion de auditoria IA

## Identificacion
- Pack ID: {{pack_id}}
- Prospect ID: {{prospect_id}}
- Nombre del contacto: {{c_nom | decision_maker_name | "Por confirmar"}}
- Correo electronico: {{c_email | target_email | "Por confirmar"}}
- Organizacion: {{c_entite | organization_name | "Por confirmar"}}
- Cargo: {{c_poste | "Por confirmar"}}
- Pais: {{country | "Por confirmar"}}
- Sitio web: {{website | "Por confirmar"}}
- Fecha de envio: {{submitted_at}}

## Lectura rapida
- Idioma del prospecto: {{prospect_language}}
- Sector: {{audit_sector | sector_guess | "Por confirmar"}}
- Tipo de organizacion: {{organization_type | "Por confirmar"}}
- Nivel de madurez IA: {{maturity_level | "Por confirmar"}}
- Horizonte prioritario: {{priority_window | "Por confirmar"}}
- Indicador de exito esperado: {{audit_success_metric | "Por confirmar"}}
- Nivel comercial: {{commercial_priority_tier | "Por confirmar"}}

## Contexto y diagnostico
### Resumen de prospeccion
{{organization_summary | "Resumen no disponible"}}

### Contexto expresado por el prospecto
{{prospect_context | "Contexto no indicado"}}

### Flujo actual a evaluar
{{current_workflow_snapshot | "Flujo actual no detallado"}}

### Resultado objetivo
{{target_outcome | "Resultado objetivo no especificado"}}

### Herramientas existentes
{{existing_tooling | "Herramientas no especificadas"}}

### Puntos de vigilancia de gobernanza
{{governance_watchpoints | "No se indicaron alertas especificas"}}

## Prioridades expresadas en el formulario
### Quick wins seleccionados
{{selected_quick_wins | probable_quick_wins | "Por confirmar"}}

### Casos de uso prioritarios
{{selected_use_cases | recommended_use_case | best_selling_use_case | "Por confirmar"}}

### Restricciones principales
{{selected_constraints | probable_needs | probable_problems | "Por confirmar"}}

### Tipo de acompanamiento deseado
{{preferred_support | recommended_offer | "Por confirmar"}}

## Recomendacion TransferAI
- Servicio principal recomendado: {{transferai_recommendation.primary.title | recommended_offer | "Por confirmar"}}
- Ruta complementaria: {{transferai_recommendation.secondary.title | "Por confirmar"}}
- Nivel de confianza: {{transferai_recommendation.confidenceLabel | "Por confirmar"}}
- Proximo paso recomendado: {{transferai_recommendation.nextStepDescription | recommended_meeting_angle | "Por confirmar"}}
- Oferta recomendada: {{recommended_offer | "Por confirmar"}}
- Caso de uso recomendado: {{recommended_use_case | "Por confirmar"}}
- Mejor caso de uso vendible a corto plazo: {{best_selling_use_case | "Por confirmar"}}
- Enfoque recomendado para la reunion: {{recommended_meeting_angle | "Por confirmar"}}
- Punto de entrada recomendado: {{entry_point_niche | "Por confirmar"}}
- Formaciones prioritarias: {{recommended_training_bundle | "Por confirmar"}}

## Hipotesis de valor
### ROI por validar
{{roi_hypothesis | "Sin estimacion de ROI"}}

### Ahorro de tiempo esperado
{{expected_time_savings | "No estimado"}}

### Mejoras de servicio esperadas
{{expected_service_improvements | "No estimadas"}}

### Quick wins esperados
{{expected_quick_wins | "No estimados"}}

### Horizonte estimado de entrega
{{delivery_timeline | "Por confirmar"}}

## Preparacion de la reunion
- Enlace de reserva: {{booking_link_30min}}
- Enlace del formulario: {{audit_form_url}}
- Preguntas para la llamada:
  - Que flujo deberia abordarse primero para generar valor visible en 30 a 60 dias?
  - Que restricciones de riesgo o gobernanza deben respetarse antes de lanzar un piloto?
  - Que equipo debe participar desde la primera fase?
  - Que resultado concreto permitiria considerar exitoso el piloto?

## Proxima accion interna
- Estado de la ficha: formulario recibido y util para la pre-auditoria
- Accion comercial sugerida: preparar un brief oral sobre {{recommended_use_case | "el caso de uso prioritario"}}
- Accion consultiva sugerida: preparar una sintesis sectorial basada en {{signal_tags | sector_pitches | "las senales detectadas"}}
```

## 7. Prompt recommande pour generation LLM

System prompt:

```text
Tu rediges une fiche pre-RDV audit IA pour l'equipe TransferAI. Tu dois produire un Markdown propre, concis, actionnable, dans une seule langue: francais, anglais ou espagnol selon prospect_language. Tu t'appuies uniquement sur les donnees du pack prospecting et les reponses du formulaire. Tu n'inventes ni chiffres, ni contraintes, ni promesses. Quand une donnee manque, tu indiques "A confirmer", "To be confirmed" ou "Por confirmar" selon la langue.
```

User payload recommande:

```json
{
  "pack_id": "...",
  "prospect_language": "fr",
  "pack_payload": { "...": "..." },
  "form_response": { "...": "..." },
  "transferai_recommendation": { "...": "..." },
  "submitted_at": "..."
}
```

## 8. Recommandation d'integration n8n

Ordre recommande:

1. recuperer `ai_prospecting_packs.payload` par `pack_id`
2. recuperer la derniere ligne `form_responses` liee au meme `pack_id`
3. fusionner `payload` + `form_data`
4. extraire `form_data.transferai_recommendation` si disponible
5. choisir la langue selon `prospect_language`
6. generer la fiche pre-RDV dans la langue cible
7. stocker la fiche en Markdown, HTML ou PDF selon le canal interne choisi
