# Guide copier-coller - blocs de code exacts pour n8n V1

Ce document regroupe les blocs exacts à copier dans les nœuds `Code` du workflow **V1 multi-prospects**.

Workflow source :

- [42_n8n_Prospection_Modele_Elton_V1.json](./42_n8n_Prospection_Modele_Elton_V1.json)

## Nœud `Build Source URLs`

Type :

- `Code`

Nom :

- `Build Source URLs`

```javascript
const base = String($json.website || '').trim().replace(/\/$/, '');
const customPaths = String($json.custom_page_paths_csv || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const defaultPaths = [
  '/',
  '/a-propos/',
  '/about/',
  '/services/',
  '/solutions/',
  '/expertise/',
  '/produits-et-services/',
  '/products/',
  '/contact/',
  '/carrieres/',
  '/careers/',
  '/blog/'
];

function normalizePath(path) {
  if (!path) return '/';
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

const selectedPaths = [...new Set([...customPaths, ...defaultPaths].map(normalizePath))].slice(0, 5);
const sourcePages = selectedPaths.map((path, index) => {
  const isAbsolute = /^https?:\/\//i.test(path);
  const normalizedPath = isAbsolute ? path : path.replace(/^\/+/, '/');
  const url = isAbsolute ? path : `${base}${normalizedPath === '/' ? '' : normalizedPath}`;
  return {
    key: `page_${index + 1}`,
    path: isAbsolute ? null : normalizedPath,
    label: isAbsolute ? `public_source_${index + 1}` : normalizedPath,
    url,
  };
});

const output = { ...$json, source_pages: sourcePages };
sourcePages.forEach((page, index) => {
  output[`page_${index + 1}_url`] = page.url;
  output[`page_${index + 1}_label`] = page.label;
});

return [{ json: output }];
```

## Nœud `Normalize Public Signals`

Type :

- `Code`

Nom :

- `Normalize Public Signals`

```javascript
const target = $('Build Source URLs').first().json;
const configuredPages = Array.isArray(target.source_pages) ? target.source_pages : [];
const pages = [
  { meta: configuredPages[0] || { key: 'page_1', label: '/' }, raw: $('Fetch Public Page 1').first().json },
  { meta: configuredPages[1] || { key: 'page_2', label: '/a-propos/' }, raw: $('Fetch Public Page 2').first().json },
  { meta: configuredPages[2] || { key: 'page_3', label: '/services/' }, raw: $('Fetch Public Page 3').first().json },
  { meta: configuredPages[3] || { key: 'page_4', label: '/solutions/' }, raw: $('Fetch Public Page 4').first().json },
  { meta: configuredPages[4] || { key: 'page_5', label: '/contact/' }, raw: $('Fetch Public Page 5').first().json }
];

function toText(raw) {
  const html = raw?.body || raw?.data || raw || '';
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const pageTexts = pages
  .map((page) => ({
    key: page.meta.key,
    label: page.meta.label,
    text: toText(page.raw).slice(0, 12000)
  }))
  .filter((page) => page.text);

const combinedPublicText = pageTexts.map((page) => `[${page.key.toUpperCase()} - ${page.label}]\n${page.text}`).join('\n\n');
const normalizedText = combinedPublicText.toLowerCase();

const clueTaxonomy = {
  support_it_intelligent: ['support', 'helpdesk', 'incident', 'ticket', 'sla', 'maintenance'],
  service_client_multicanal: ['service client', 'relation client', 'support client', 'contact', 'crm'],
  machine_contenu_marketing: ['marketing', 'communication', 'campagne', 'contenu', 'réseaux sociaux', 'reseaux sociaux'],
  workflow_administratif: ['procédure', 'procedure', 'validation', 'reporting', 'back-office', 'administratif'],
  assistant_direction_documentaire: ['direction', 'rapport', 'compte rendu', 'documentation', 'pilotage'],
  reporting_financier_assiste: ['finance', 'facturation', 'comptabilité', 'comptabilite', 'recouvrement', 'paiement'],
  recrutement_onboarding_augmente: ['recrutement', 'talent', 'carrière', 'carriere', 'onboarding', 'rh'],
  telemedecine_triage_orientation: ['santé', 'sante', 'patient', 'clinique', 'hôpital', 'hopital', 'télémédecine', 'telemedecine'],
  banque_kyc_reporting: ['banque', 'kyc', 'conformité', 'conformite', 'compliance', 'risque'],
  operations_terrain_coordination: ['terrain', 'flotte', 'logistique', 'livraison', 'intervention', 'opérations', 'operations']
};

const roiClues = Object.entries(clueTaxonomy)
  .filter(([, keywords]) => keywords.some((keyword) => normalizedText.includes(keyword.toLowerCase())))
  .map(([key]) => key);

return [{
  json: {
    ...target,
    page_texts: pageTexts,
    public_text: combinedPublicText.slice(0, 45000),
    roi_clues: roiClues.length ? roiClues : [
      'workflow_administratif',
      'service_client_multicanal',
      'assistant_direction_documentaire'
    ]
  }
}];
```

## Nœud `Sanitize Prospect Data For LLM`

Type :

- `Code`

Nom :

- `Sanitize Prospect Data For LLM`

```javascript
const source = $json;
const orgName = (source.organization_name || '').trim();
const decisionMaker = (source.decision_maker_name || '').trim();
const website = (source.website || '').trim();
const domain = website.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let sanitizedText = String(source.public_text || '');

const genericPatterns = [
  [/https?:\/\/\S+/gi, '[URL_REDACTED]'],
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL_REDACTED]'],
  [/\+?\d[\d\s().-]{7,}\d/g, '[PHONE_REDACTED]']
];

for (const [pattern, replacement] of genericPatterns) {
  sanitizedText = sanitizedText.replace(pattern, replacement);
}

const sensitiveTokens = [
  { value: orgName, replacement: 'ORG_TARGET' },
  { value: decisionMaker, replacement: 'DECISION_MAKER_TARGET' },
  { value: domain, replacement: '[URL_REDACTED]' }
].filter((item) => item.value && item.value.length > 2);

for (const token of sensitiveTokens) {
  const pattern = new RegExp(escapeRegex(token.value), 'gi');
  sanitizedText = sanitizedText.replace(pattern, token.replacement);
}

const normalized = sanitizedText.toLowerCase();
const signalTaxonomy = {
  support_it_intelligent: ['support', 'helpdesk', 'incident', 'ticket', 'sla', 'maintenance'],
  service_client_multicanal: ['service client', 'relation client', 'support client', 'contact center', 'crm'],
  machine_contenu_marketing: ['marketing', 'communication', 'campagne', 'contenu', 'marque', 'réseaux sociaux', 'reseaux sociaux'],
  workflow_administratif: ['procédure', 'procedure', 'validation', 'reporting', 'back-office', 'administratif'],
  assistant_direction_documentaire: ['direction', 'pilotage', 'rapport', 'documentation', 'compte rendu'],
  reporting_financier_assiste: ['facturation', 'finance', 'comptabilité', 'comptabilite', 'paiement', 'recouvrement'],
  recrutement_onboarding_augmente: ['recrutement', 'carrière', 'carriere', 'rh', 'talent', 'onboarding'],
  commentaire_donnees_reporting: ['données', 'donnees', 'dashboard', 'analytics', 'indicateurs', 'tableau de bord'],
  telemedecine_triage_orientation: ['santé', 'sante', 'patient', 'clinique', 'hôpital', 'hopital', 'telemedecine'],
  banque_kyc_reporting: ['banque', 'kyc', 'compliance', 'conformité', 'conformite', 'risque'],
  operations_terrain_coordination: ['flotte', 'terrain', 'logistique', 'livraison', 'intervention', 'opérations', 'operations'],
  energie_industrie_services: ['énergie', 'energie', 'oil', 'gas', 'station', 'industrie', 'industriel'],
  formation_montee_en_competence: ['formation', 'certification', 'academy', 'apprentissage', 'compétence', 'competence']
};

const signalTags = Object.entries(signalTaxonomy)
  .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword.toLowerCase())))
  .map(([key]) => key);

const allowedFields = [
  'organization_type',
  'sector_guess',
  'country',
  'signal_tags',
  'roi_clues',
  'page_keys',
  'public_text_sanitized_excerpt'
];

const blockedFields = [
  'organization_name',
  'website',
  'decision_maker_name',
  'target_email',
  'page_texts',
  'public_text'
];

const sanitizedExcerpt = sanitizedText.slice(0, 12000);

const llmAllowedPayload = {
  llm_policy: 'deny-by-default',
  organization_ref: 'ORG_TARGET',
  decision_maker_ref: decisionMaker ? 'DECISION_MAKER_TARGET' : null,
  organization_type: source.organization_type || null,
  sector_guess: source.sector_guess || null,
  country: source.country || null,
  signal_tags: signalTags,
  roi_clues: Array.isArray(source.roi_clues) ? source.roi_clues : [],
  page_keys: Array.isArray(source.page_texts) ? source.page_texts.map((p) => p.key) : [],
  public_text_sanitized_excerpt: sanitizedExcerpt,
  allowed_fields: allowedFields,
  blocked_fields: blockedFields
};

const llmGenerationPayload = {
  ...llmAllowedPayload,
  organization_display: '{{ORGANIZATION_NAME}}',
  decision_maker_display: '{{DECISION_MAKER_NAME}}',
  website_display: '{{WEBSITE}}'
};

return [{
  json: {
    ...source,
    public_text_sanitized: sanitizedExcerpt,
    llm_allowed_payload: llmAllowedPayload,
    llm_generation_payload: llmGenerationPayload,
    llm_redaction_summary: {
      policy: 'deny-by-default',
      blocked_fields: blockedFields,
      allowed_fields: allowedFields,
      pseudonymized_identifiers: ['organization_name', 'decision_maker_name', 'website'],
      text_sent_to_llm: 'sanitized_public_text_excerpt_only'
    }
  }
}];
```

## Nœud `Assemble Prospect Context`

Type :

- `Code`

Nom :

- `Assemble Prospect Context`

```javascript
const base = $('Normalize Public Signals').first().json;

function parseOpenAI(nodeName) {
  const raw = $(nodeName).first().json?.choices?.[0]?.message?.content || '{}';
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { parse_error: `${nodeName}: ${e.message}` };
  }
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const preAudit = parseOpenAI('Call OpenAI Pre-Audit');
const problems = parseOpenAI('Call OpenAI Problems Solutions');
const roi = parseOpenAI('Call OpenAI ROI');
const sectorVariant = problems.sector_variant || slugify(base.sector_guess) || 'multi_sector_operations';

return [{
  json: {
    ...base,
    ...preAudit,
    ...problems,
    ...roi,
    single_primary_cta: 'Planifier un audit stratégique gratuit suivi d\'un échange de 45 minutes',
    sector_variant: sectorVariant
  }
}];
```

## Nœud `Assemble Prospect Pack`

Type :

- `Code`

Nom :

- `Assemble Prospect Pack`

```javascript
function textFrom(nodeName) {
  return $(nodeName).first().json?.choices?.[0]?.message?.content || '';
}

function jsonFrom(nodeName) {
  const raw = textFrom(nodeName) || '{}';
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { parse_error: `${nodeName}: ${e.message}`, raw };
  }
}

function hydrateString(value, ctx) {
  return String(value)
    .replace(/\{\{ORGANIZATION_NAME\}\}/g, ctx.organization_name || '')
    .replace(/\{\{DECISION_MAKER_NAME\}\}/g, ctx.decision_maker_name || '')
    .replace(/\{\{WEBSITE\}\}/g, ctx.website || '');
}

function hydrateValue(value, ctx) {
  if (typeof value === 'string') return hydrateString(value, ctx);
  if (Array.isArray(value)) return value.map((item) => hydrateValue(item, ctx));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, inner] of Object.entries(value)) out[key] = hydrateValue(inner, ctx);
    return out;
  }
  return value;
}

const ctx = $('Assemble Prospect Context').first().json;
const executiveLetter = hydrateString(textFrom('Generate Executive Letter'), ctx);
const tailoredCatalogue = hydrateString(textFrom('Generate Tailored Catalogue'), ctx);
const tailoredAuditForm = hydrateString(textFrom('Generate Tailored Audit Form'), ctx);
const deckBrief = hydrateValue(jsonFrom('Generate Deck Brief'), ctx);
const requiresEmail = Object.prototype.hasOwnProperty.call(ctx, 'target_email');
const approvedForSend = Boolean(ctx.organization_name && ctx.entry_point_niche && ctx.recommended_offer && (!requiresEmail || ctx.target_email));
const packId = ctx.pack_id || `pack-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

return [{
  json: {
    ...ctx,
    pack_id: packId,
    executive_letter: executiveLetter,
    tailored_catalogue: tailoredCatalogue,
    tailored_audit_form: tailoredAuditForm,
    deck_brief: deckBrief,
    approved_for_send: approvedForSend,
    llm_redaction_summary: ctx.llm_redaction_summary,
    llm_allowed_payload: ctx.llm_allowed_payload,
    llm_generation_payload: ctx.llm_generation_payload
  }
}];
```

## Conseils de collage dans n8n

- créer d’abord le nœud `Code`
- lui donner exactement le bon nom
- remplacer entièrement le contenu par le bloc ci-dessus
- enregistrer le nœud avant de passer au suivant

## Ordre conseillé de test

1. `Build Source URLs`
2. `Normalize Public Signals`
3. `Sanitize Prospect Data For LLM`
4. `Assemble Prospect Context`
5. `Assemble Prospect Pack`
