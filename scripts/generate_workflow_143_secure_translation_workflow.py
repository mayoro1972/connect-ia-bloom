import json
from pathlib import Path


OUTPUT = Path(
    "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom/docs/transferai-admin/"
    "143_n8n_Traduction_Officielle_Internationale_PII_Revamp_06juillet2026.json"
)


def node(
    node_id,
    name,
    node_type,
    position,
    parameters,
    type_version=2,
    extra=None,
):
    data = {
        "id": node_id,
        "name": name,
        "type": node_type,
        "typeVersion": type_version,
        "position": position,
        "parameters": parameters,
    }
    if extra:
        data.update(extra)
    return data


def build_workflow():
    nodes = [
        node(
            "tr-sec-001",
            "Webhook - Traduction securisee",
            "n8n-nodes-base.webhook",
            [180, 320],
            {
                "httpMethod": "POST",
                "path": "traduction-officielle-securisee",
                "responseMode": "onReceived",
                "options": {},
            },
            extra={"webhookId": "traduction-officielle-securisee"},
        ),
        node(
            "tr-sec-002",
            "Extraire demande et politique",
            "n8n-nodes-base.code",
            [420, 320],
            {
                "jsCode": """const body = $input.first().json.body || $input.first().json;
const sourceCode = String(body.langue_source || body.source_language || 'fr').trim().slice(0, 2).toUpperCase();
const targetCode = String(body.langue_cible || body.target_language || 'en').trim().slice(0, 2).toUpperCase();
const langMap = { FR: 'francais', EN: 'anglais', ES: 'espagnol', AR: 'arabe', PT: 'portugais' };
const typeDocument = String(body.type_document || body.document_type || 'Document officiel').trim();
const sensitivityTriggers = ['visa', 'passeport', 'passport', 'titre de sejour', 'acte', 'naissance', 'diplomatique', 'note verbale', 'accord', 'contrat', 'identite', 'identity'];
const typeLower = typeDocument.toLowerCase();
const sensitivity = sensitivityTriggers.some((item) => typeLower.includes(item)) ? 'elevee' : 'standard';

return [{
  json: {
    texte_original: String(body.texte || body.content || body.document_text || '').trim(),
    langue_source: sourceCode,
    langue_cible: targetCode,
    nom_source: langMap[sourceCode] || sourceCode,
    nom_cible: langMap[targetCode] || targetCode,
    type_document: typeDocument,
    demandeur: String(body.demandeur || body.requester_name || '').trim(),
    organisation: String(body.organisation || body.organization || '').trim(),
    reference_dossier: String(body.reference_dossier || body.case_reference || '').trim(),
    email_retour: String(body.email_retour || body.return_email || '').trim(),
    email_validateur: String(body.email_validateur || body.validator_email || ($env.INTERNAL_REVIEW_EMAIL || '')).trim(),
    contexte_mission: String(body.contexte_mission || body.mission_context || 'Traduction internationale').trim(),
    traduction_id: 'TRD-SEC-' + Date.now(),
    sensibilite: sensitivity,
    gouvernance: {
      llm_policy: 'deny-by-default',
      mode_protection: 'pseudonymisation_locale',
      validation_humaine_recommandee: sensitivity === 'elevee',
      conservation_mapping: 'memoire_execution_uniquement'
    }
  }
}];""",
            },
        ),
        node(
            "tr-sec-003",
            "Detecter PII",
            "n8n-nodes-base.code",
            [680, 320],
            {
                "jsCode": """const src = $input.first().json;
const texte = src.texte_original || '';
const pii = [];

function add(type, value) {
  const clean = String(value || '').trim();
  if (!clean) return;
  if (pii.some((item) => item.type === type && item.valeur.toLowerCase() === clean.toLowerCase())) return;
  pii.push({ type, valeur: clean });
}

add('PERSON', src.demandeur);
add('ORG', src.organisation);
add('REF', src.reference_dossier);
add('EMAIL', src.email_retour);

const regexMap = [
  ['EMAIL', /\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b/gi],
  ['PHONE', /\\+?\\d[\\d\\s().-]{7,}\\d/g],
  ['PASSPORT', /\\b[A-Z]{1,3}\\d{5,9}\\b/g],
  ['DATE', /\\b\\d{1,2}[\\/.-]\\d{1,2}[\\/.-]\\d{2,4}\\b/g],
  ['REF', /\\b(?:REF|DOSSIER|CASE|VISA|FILE)[-_ :]*[A-Z0-9-]{3,}\\b/gi],
  ['URL', /https?:\\/\\/[^\\s]+/gi]
];

for (const [type, regex] of regexMap) {
  const matches = texte.match(regex) || [];
  for (const match of matches) add(type, match);
}

return [{
  json: {
    ...src,
    pii_detectes: pii,
    nb_pii_detectes: pii.length
  }
}];""",
            },
        ),
        node(
            "tr-sec-004",
            "Pseudonymiser localement",
            "n8n-nodes-base.code",
            [940, 320],
            {
                "jsCode": """const src = $input.first().json;
const counters = { PERSON: 1, ORG: 1, EMAIL: 1, PHONE: 1, PASSPORT: 1, DATE: 1, REF: 1, URL: 1 };
const table = {};

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

function tokenFor(type, raw) {
  const clean = String(raw || '').trim();
  if (!clean) return null;
  const existing = Object.entries(table).find(([, value]) => value.toLowerCase() === clean.toLowerCase());
  if (existing) return existing[0];
  const key = `${type}_${String(counters[type]++).padStart(3, '0')}`;
  table[key] = clean;
  return key;
}

let text = String(src.texte_original || '');

for (const item of src.pii_detectes || []) {
  const token = tokenFor(item.type, item.valeur);
  if (!token) continue;
  text = text.replace(new RegExp(escapeRegex(item.valeur), 'gi'), token);
}

const llmAllowedPayload = {
  llm_policy: 'deny-by-default',
  traduction_id: src.traduction_id,
  type_document: src.type_document,
  contexte_mission: src.contexte_mission,
  sensibilite: src.sensibilite,
  langue_source: src.nom_source,
  langue_cible: src.nom_cible,
  texte_pseudonymise: text,
  pii_stats: {
    count: Object.keys(table).length,
    categories: Array.from(new Set(Object.keys(table).map((key) => key.split('_')[0])))
  },
  blocked_fields: ['demandeur', 'organisation', 'email_retour', 'reference_dossier', 'texte_original']
};

return [{
  json: {
    ...src,
    texte_pseudonymise: text,
    table_reidentification: table,
    llm_allowed_payload: llmAllowedPayload
  }
}];""",
            },
        ),
        node(
            "tr-sec-005",
            "OpenAI - Traduction pseudonymisee",
            "n8n-nodes-base.httpRequest",
            [1220, 320],
            {
                "method": "POST",
                "url": "https://api.openai.com/v1/responses",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {
                            "name": "Authorization",
                            "value": "={{ 'Bearer ' + ($env.OPENAI_API_KEY || 'OPENAI_API_KEY_MISSING') }}",
                        },
                        {"name": "Content-Type", "value": "application/json"},
                    ]
                },
                "sendBody": True,
                "contentType": "raw",
                "rawContentType": "application/json",
                "body": """={{ JSON.stringify({
  model: 'gpt-4.1',
  store: false,
  input: [
    {
      role: 'system',
      content: [
        {
          type: 'input_text',
          text: 'Tu es un traducteur expert en documents officiels, administratifs, diplomatiques et migratoires. Tu ne recois qu un texte pseudonymise. Traduis avec precision, sans inventer, sans resumer, sans omettre et sans reformuler les jetons PERSON_001, ORG_001, EMAIL_001, REF_001, PASSPORT_001, DATE_001. Rends uniquement la traduction.'
        }
      ]
    },
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: `Type document: ${$json.type_document}\\nContexte: ${$json.contexte_mission}\\nLangue source: ${$json.nom_source}\\nLangue cible: ${$json.nom_cible}\\n\\nTexte pseudonymise:\\n${$json.texte_pseudonymise}`
        }
      ]
    }
  ]
}) }}""",
                "options": {"response": {"response": {"neverError": True}}},
            },
            type_version=4.2,
        ),
        node(
            "tr-sec-006",
            "Parser traduction",
            "n8n-nodes-base.code",
            [1480, 320],
            {
                "jsCode": """const response = $input.first().json;
let text = '';
for (const item of response.output || []) {
  if (item.type !== 'message') continue;
  for (const content of item.content || []) {
    if (content.type === 'output_text' && content.text) {
      text = content.text;
      break;
    }
  }
  if (text) break;
}
if (!text && response.output_text) text = response.output_text;

return [{
  json: {
    ...$('Pseudonymiser localement').first().json,
    traduction_pseudonymisee: String(text || '').trim()
  }
}];""",
            },
        ),
        node(
            "tr-sec-007",
            "OpenAI - Relecture qualite pseudonymisee",
            "n8n-nodes-base.httpRequest",
            [1740, 320],
            {
                "method": "POST",
                "url": "https://api.openai.com/v1/responses",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {
                            "name": "Authorization",
                            "value": "={{ 'Bearer ' + ($env.OPENAI_API_KEY || 'OPENAI_API_KEY_MISSING') }}",
                        },
                        {"name": "Content-Type", "value": "application/json"},
                    ]
                },
                "sendBody": True,
                "contentType": "raw",
                "rawContentType": "application/json",
                "body": """={{ JSON.stringify({
  model: 'gpt-4.1',
  store: false,
  input: [
    {
      role: 'system',
      content: [
        {
          type: 'input_text',
          text: 'Tu es un relecteur expert en traduction officielle. Evalue la qualite de la traduction pseudonymisee. Retourne uniquement un JSON strict avec les cles: score_qualite, validation, note_globale, risques, corrections_suggerees.'
        }
      ]
    },
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: `Type document: ${$json.type_document}\\nOriginal pseudonymise:\\n${$json.texte_pseudonymise}\\n\\nTraduction pseudonymisee:\\n${$json.traduction_pseudonymisee}`
        }
      ]
    }
  ],
  text: {
    format: {
      type: 'json_schema',
      name: 'translation_quality_review',
      strict: true,
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['score_qualite', 'validation', 'note_globale', 'risques', 'corrections_suggerees'],
        properties: {
          score_qualite: { type: 'number' },
          validation: { type: 'boolean' },
          note_globale: { type: 'string' },
          risques: { type: 'array', items: { type: 'string' } },
          corrections_suggerees: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['segment', 'correction', 'raison'],
              properties: {
                segment: { type: 'string' },
                correction: { type: 'string' },
                raison: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}) }}""",
                "options": {"response": {"response": {"neverError": True}}},
            },
            type_version=4.2,
        ),
        node(
            "tr-sec-008",
            "Parser relecture",
            "n8n-nodes-base.code",
            [2000, 320],
            {
                "jsCode": """const response = $input.first().json;
let raw = '';
for (const item of response.output || []) {
  if (item.type !== 'message') continue;
  for (const content of item.content || []) {
    if (content.type === 'output_text' && content.text) {
      raw = content.text;
      break;
    }
  }
  if (raw) break;
}
if (!raw && response.output_text) raw = response.output_text;

let parsed = {};
try {
  parsed = JSON.parse(raw || '{}');
} catch (error) {
  parsed = {
    score_qualite: 0,
    validation: false,
    note_globale: 'Impossible de parser la relecture',
    risques: ['Parser JSON echec'],
    corrections_suggerees: []
  };
}

return [{
  json: {
    ...$('Parser traduction').first().json,
    revue_qualite: parsed
  }
}];""",
            },
        ),
        node(
            "tr-sec-009",
            "Reidentifier et assembler",
            "n8n-nodes-base.code",
            [2280, 320],
            {
                "jsCode": """const src = $input.first().json;
const review = src.revue_qualite || {};
let traduction = String(src.traduction_pseudonymisee || '');
const table = src.table_reidentification || {};

for (const [token, value] of Object.entries(table)) {
  traduction = traduction.replaceAll(token, value);
}

const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
const reviewRequired = Boolean(src.sensibilite === 'elevee' || !review.validation || Number(review.score_qualite || 0) < 96);
const status = reviewRequired ? 'pending_validation' : 'ready_to_send';

const correctionsHtml = (Array.isArray(review.corrections_suggerees) ? review.corrections_suggerees : [])
  .slice(0, 8)
  .map((item) => `<li><strong>${item.segment || 'Segment'}</strong> : ${item.correction || ''} <em>(${item.raison || ''})</em></li>`)
  .join('') || '<li>Aucune correction majeure suggeree.</li>';

const html = `
<div style="font-family:Arial,sans-serif;max-width:960px;margin:0 auto;padding:32px;color:#1f2937">
  <div style="background:#10263F;color:white;padding:20px 24px;border-radius:8px 8px 0 0">
    <h2 style="margin:0 0 8px 0">Traduction internationale securisee - ${src.type_document}</h2>
    <p style="margin:4px 0;opacity:0.88">Reference ${src.traduction_id} - ${date}</p>
    <p style="margin:4px 0;opacity:0.88">PII proteges localement : ${Object.keys(table).length} - Score qualite : ${review.score_qualite || 'N/A'}/100</p>
  </div>
  <div style="border:1px solid #d7dee7;border-top:none;padding:18px 24px;background:#f8fafc">
    <strong>Gouvernance :</strong> Les donnees personnelles ont ete pseudonymisees avant appel au modele. La reidentification a ete effectuee localement dans le workflow n8n.
  </div>
  <table style="width:100%;border-collapse:collapse">
    <tr>
      <td style="width:50%;vertical-align:top;padding:22px;border:1px solid #d7dee7;background:#f8fafc">
        <h3 style="margin-top:0;color:#10263F">${src.nom_source.toUpperCase()}</h3>
        <div style="line-height:1.75;white-space:pre-wrap">${src.texte_original}</div>
      </td>
      <td style="width:50%;vertical-align:top;padding:22px;border:1px solid #d7dee7">
        <h3 style="margin-top:0;color:#10263F">${src.nom_cible.toUpperCase()}</h3>
        <div style="line-height:1.75;white-space:pre-wrap">${traduction}</div>
      </td>
    </tr>
  </table>
  <div style="margin-top:18px;padding:18px;border:1px solid #d7dee7;border-radius:8px;background:#ffffff">
    <h3 style="margin-top:0;color:#10263F">Note de relecture</h3>
    <p style="margin:0 0 8px 0">${review.note_globale || 'Aucune note disponible.'}</p>
    <ul>${correctionsHtml}</ul>
    <p style="font-size:12px;color:#6b7280;margin-bottom:0">Validation humaine ${reviewRequired ? 'requise avant diffusion externe' : 'recommandee selon votre politique interne'}.</p>
  </div>
</div>`;

return [{
  json: {
    ...src,
    texte_traduit: traduction,
    document_html: html,
    review_required: reviewRequired,
    delivery_status: status,
    pii_protected_count: Object.keys(table).length
  }
}];""",
            },
        ),
        node(
            "tr-sec-010",
            "Validation requise ?",
            "n8n-nodes-base.if",
            [2540, 320],
            {
                "conditions": {
                    "options": {"caseSensitive": False},
                    "conditions": [
                        {
                            "leftValue": "={{ $json.review_required }}",
                            "rightValue": True,
                            "operator": {"type": "boolean", "operation": "equals"},
                        }
                    ],
                },
                "options": {},
            },
            type_version=2,
        ),
        node(
            "tr-sec-011",
            "Envoyer au validateur",
            "n8n-nodes-base.httpRequest",
            [2800, 220],
            {
                "method": "POST",
                "url": "https://api.resend.com/emails",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {
                            "name": "Authorization",
                            "value": "={{ 'Bearer ' + ($env.RESEND_API_KEY || 'RESEND_API_KEY_MISSING') }}",
                        },
                        {"name": "Content-Type", "value": "application/json"},
                    ]
                },
                "sendBody": True,
                "contentType": "json",
                "body": """={{
  {
    "from": $env.OUTREACH_FROM_EMAIL || "TransferAI <contact@transferai.ci>",
    "to": [ $json.email_validateur || $env.INTERNAL_REVIEW_EMAIL || "ops@transferai.ci" ],
    "subject": "[VALIDATION REQUISE] " + $json.type_document + " - " + $json.nom_source + " vers " + $json.nom_cible + " - " + $json.traduction_id,
    "html": $json.document_html
  }
}}""",
                "options": {"response": {"response": {"neverError": True}}},
            },
            type_version=4.2,
        ),
        node(
            "tr-sec-012",
            "Envoyer au client",
            "n8n-nodes-base.httpRequest",
            [2800, 420],
            {
                "method": "POST",
                "url": "https://api.resend.com/emails",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {
                            "name": "Authorization",
                            "value": "={{ 'Bearer ' + ($env.RESEND_API_KEY || 'RESEND_API_KEY_MISSING') }}",
                        },
                        {"name": "Content-Type", "value": "application/json"},
                    ]
                },
                "sendBody": True,
                "contentType": "json",
                "body": """={{
  {
    "from": $env.OUTREACH_FROM_EMAIL || "TransferAI <contact@transferai.ci>",
    "to": [ $json.email_retour ],
    "subject": "[TRADUCTION SECURISEE] " + $json.type_document + " - " + $json.nom_source + " vers " + $json.nom_cible + " - " + $json.traduction_id,
    "html": $json.document_html
  }
}}""",
                "options": {"response": {"response": {"neverError": True}}},
            },
            type_version=4.2,
        ),
        node(
            "tr-sec-013",
            "Purger mapping sensible",
            "n8n-nodes-base.code",
            [3060, 320],
            {
                "jsCode": """const src = $input.first().json;
return [{
  json: {
    traduction_id: src.traduction_id,
    delivery_status: src.delivery_status,
    review_required: src.review_required,
    purge_effectuee: true,
    purge_timestamp: new Date().toISOString(),
    pii_protected_count: src.pii_protected_count,
    score_qualite: src.revue_qualite?.score_qualite || null
  }
}];""",
            },
        ),
    ]

    connections = {
        "Webhook - Traduction securisee": {
            "main": [[{"node": "Extraire demande et politique", "type": "main", "index": 0}]]
        },
        "Extraire demande et politique": {
            "main": [[{"node": "Detecter PII", "type": "main", "index": 0}]]
        },
        "Detecter PII": {
            "main": [[{"node": "Pseudonymiser localement", "type": "main", "index": 0}]]
        },
        "Pseudonymiser localement": {
            "main": [[{"node": "OpenAI - Traduction pseudonymisee", "type": "main", "index": 0}]]
        },
        "OpenAI - Traduction pseudonymisee": {
            "main": [[{"node": "Parser traduction", "type": "main", "index": 0}]]
        },
        "Parser traduction": {
            "main": [[{"node": "OpenAI - Relecture qualite pseudonymisee", "type": "main", "index": 0}]]
        },
        "OpenAI - Relecture qualite pseudonymisee": {
            "main": [[{"node": "Parser relecture", "type": "main", "index": 0}]]
        },
        "Parser relecture": {
            "main": [[{"node": "Reidentifier et assembler", "type": "main", "index": 0}]]
        },
        "Reidentifier et assembler": {
            "main": [[{"node": "Validation requise ?", "type": "main", "index": 0}]]
        },
        "Validation requise ?": {
            "main": [
                [{"node": "Envoyer au validateur", "type": "main", "index": 0}],
                [{"node": "Envoyer au client", "type": "main", "index": 0}],
            ]
        },
        "Envoyer au validateur": {
            "main": [[{"node": "Purger mapping sensible", "type": "main", "index": 0}]]
        },
        "Envoyer au client": {
            "main": [[{"node": "Purger mapping sensible", "type": "main", "index": 0}]]
        },
    }

    return {
        "name": "Traduction_Officielle_Internationale_PII_Revamp",
        "nodes": nodes,
        "pinData": {},
        "connections": connections,
        "active": False,
        "settings": {"executionOrder": "v1"},
        "meta": {
            "description": (
                "Workflow exportable n8n - traduction officielle internationale "
                "avec detection PII, pseudonymisation locale, traduction "
                "pseudonymisee, reidentification locale et validation humaine "
                "pour documents sensibles."
            )
        },
        "tags": [],
    }


def main():
    workflow = build_workflow()
    OUTPUT.write_text(json.dumps(workflow, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
