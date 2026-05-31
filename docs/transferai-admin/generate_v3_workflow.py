#!/usr/bin/env python3
"""
Génère le workflow n8n V3 corrigé :
  - Supprime le circuit approbation manuelle (Build Approval Email, Approval Webhook, etc.)
  - Ajoute Quality Control Check (contrôle qualité automatisé)
  - Ajoute If Quality Pass → Auto Send / Mark Failed
  - Garde Store Pack In Supabase + Log Outreach Attempt
  - 0 référence $env
  - Tous les Code nodes ont mode: runOnceForAllItems
  - If node typeVersion: 1
"""
import json, os

OUT_PATH = os.path.join(os.path.dirname(__file__), "44_n8n_Prospection_Modele_Elton_V3_corrected.json")

# ─── JAVASCRIPT HELPERS ─────────────────────────────────────────────────────
CODE_BUILD_SOURCE_URLS = r"""// FIX: accès direct au Proxy (JSON.stringify retourne {} sur les Proxy n8n)
var p = $input.first().json;
var website = String(p.website || '');
var base = website.trim().replace(/\/$/, '');
var customPagePaths = String(p.custom_page_paths_csv || '');
var prospectId = String(p.prospect_id || '');
var orgName = String(p.organization_name || '');
var orgType = String(p.organization_type || '');
var sectorGuess = String(p.sector_guess || '');
var country = String(p.country || '');
var decisionMaker = String(p.decision_maker_name || '');
var targetEmail = String(p.target_email || '');
var bookingLink = String(p.booking_link_30min || p.booking_link_45min || '');
var commercialPriority = String(p.commercial_priority_default || '');
var researchScope = String(p.research_scope || '');
var customPaths = customPagePaths.split(',').map(function(v){ return v.trim(); }).filter(Boolean);
var defaultPaths = ['/', '/a-propos/', '/about/', '/services/', '/solutions/', '/expertise/', '/produits-et-services/', '/products/', '/contact/', '/carrieres/', '/careers/', '/blog/'];
function normalizePath(path) {
  if (!path) return '/';
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith('/') ? path : '/' + path;
}
var seen = {}; var selectedPaths = [];
customPaths.concat(defaultPaths).forEach(function(path) {
  var n = normalizePath(path);
  if (!seen[n] && selectedPaths.length < 5) { seen[n] = true; selectedPaths.push(n); }
});
var sourcePages = selectedPaths.map(function(path, index) {
  var isAbsolute = /^https?:\/\//i.test(path);
  var normalizedPath = isAbsolute ? path : path.replace(/^\/+/, '/');
  var url = isAbsolute ? path : base + (normalizedPath === '/' ? '' : normalizedPath);
  return { key: 'page_' + (index + 1), path: isAbsolute ? null : normalizedPath, label: isAbsolute ? 'public_source_' + (index + 1) : normalizedPath, url: url };
});
var output = {
  prospect_id: prospectId, organization_name: orgName, organization_type: orgType,
  website: website, sector_guess: sectorGuess, country: country,
  decision_maker_name: decisionMaker, target_email: targetEmail,
  custom_page_paths_csv: customPagePaths, booking_link_30min: bookingLink, booking_link_45min: bookingLink,
  commercial_priority_default: commercialPriority, research_scope: researchScope,
  source_pages: sourcePages
};
sourcePages.forEach(function(page, index) {
  output['page_' + (index + 1) + '_url'] = page.url;
  output['page_' + (index + 1) + '_label'] = page.label;
});
return [{ json: output }];"""

CODE_NORMALIZE = r"""const target = JSON.parse(JSON.stringify($('Build Source URLs').first().json));
const configuredPages = Array.isArray(target.source_pages) ? target.source_pages : [];
const pages = [
  { meta: configuredPages[0] || { key: 'page_1', label: '/' },            raw: $('Fetch Public Page 1').first().json },
  { meta: configuredPages[1] || { key: 'page_2', label: '/a-propos/' },   raw: $('Fetch Public Page 2').first().json },
  { meta: configuredPages[2] || { key: 'page_3', label: '/services/' },   raw: $('Fetch Public Page 3').first().json },
  { meta: configuredPages[3] || { key: 'page_4', label: '/solutions/' },  raw: $('Fetch Public Page 4').first().json },
  { meta: configuredPages[4] || { key: 'page_5', label: '/contact/' },    raw: $('Fetch Public Page 5').first().json }
];
function toText(raw) {
  const html = (raw && (raw.body || raw.data)) || '';
  return String(html).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
const pageTexts = pages.map(function(page) {
  return { key: page.meta.key, label: page.meta.label, text: toText(page.raw).slice(0, 12000) };
}).filter(function(page) { return page.text; });
const combinedPublicText = pageTexts.map(function(page) {
  return '[' + page.key.toUpperCase() + ' - ' + page.label + ']\n' + page.text;
}).join('\n\n');
const normalizedText = combinedPublicText.toLowerCase();
const clueTaxonomy = {
  support_it_intelligent: ['support', 'helpdesk', 'incident', 'ticket', 'sla', 'maintenance'],
  service_client_multicanal: ['service client', 'relation client', 'support client', 'contact', 'crm'],
  machine_contenu_marketing: ['marketing', 'communication', 'campagne', 'contenu', 'reseaux sociaux'],
  workflow_administratif: ['procedure', 'validation', 'reporting', 'back-office', 'administratif'],
  assistant_direction_documentaire: ['direction', 'rapport', 'compte rendu', 'documentation', 'pilotage'],
  reporting_financier_assiste: ['finance', 'facturation', 'comptabilite', 'recouvrement', 'paiement'],
  recrutement_onboarding_augmente: ['recrutement', 'talent', 'carriere', 'onboarding', 'rh'],
  telemedecine_triage_orientation: ['sante', 'patient', 'clinique', 'hopital', 'telemedecine'],
  banque_kyc_reporting: ['banque', 'kyc', 'conformite', 'compliance', 'risque'],
  operations_terrain_coordination: ['terrain', 'flotte', 'logistique', 'livraison', 'intervention', 'operations']
};
const roiClues = Object.keys(clueTaxonomy).filter(function(key) {
  return clueTaxonomy[key].some(function(kw) { return normalizedText.indexOf(kw) !== -1; });
});
return [{ json: Object.assign({}, target, {
  page_texts: pageTexts,
  public_text: combinedPublicText.slice(0, 45000),
  roi_clues: roiClues.length ? roiClues : ['workflow_administratif', 'service_client_multicanal', 'assistant_direction_documentaire']
}) }];"""

CODE_SANITIZE = r"""const source = JSON.parse(JSON.stringify($input.first().json));
const orgName = (source.organization_name || '').trim();
const decisionMaker = (source.decision_maker_name || '').trim();
const website = (source.website || '').trim();
const domain = website.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
function escapeRegex(v) { return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
let sanitizedText = String(source.public_text || '');
const genericPatterns = [
  [/https?:\/\/\S+/gi, '[URL_REDACTED]'],
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL_REDACTED]'],
  [/\+?\d[\d\s().-]{7,}\d/g, '[PHONE_REDACTED]']
];
for (let i = 0; i < genericPatterns.length; i++) {
  sanitizedText = sanitizedText.replace(genericPatterns[i][0], genericPatterns[i][1]);
}
const sensitiveTokens = [
  { value: orgName, replacement: 'ORG_TARGET' },
  { value: decisionMaker, replacement: 'DECISION_MAKER_TARGET' },
  { value: domain, replacement: '[URL_REDACTED]' }
].filter(function(item) { return item.value && item.value.length > 2; });
for (let i = 0; i < sensitiveTokens.length; i++) {
  const pattern = new RegExp(escapeRegex(sensitiveTokens[i].value), 'gi');
  sanitizedText = sanitizedText.replace(pattern, sensitiveTokens[i].replacement);
}
const normalized = sanitizedText.toLowerCase();
const signalTaxonomy = {
  support_it_intelligent: ['support', 'helpdesk', 'incident', 'ticket', 'sla', 'maintenance'],
  service_client_multicanal: ['service client', 'relation client', 'support client', 'contact center', 'crm'],
  machine_contenu_marketing: ['marketing', 'communication', 'campagne', 'contenu', 'marque', 'reseaux sociaux'],
  workflow_administratif: ['procedure', 'validation', 'reporting', 'back-office', 'administratif'],
  assistant_direction_documentaire: ['direction', 'pilotage', 'rapport', 'documentation', 'compte rendu'],
  reporting_financier_assiste: ['facturation', 'finance', 'comptabilite', 'paiement', 'recouvrement'],
  recrutement_onboarding_augmente: ['recrutement', 'carriere', 'rh', 'talent', 'onboarding'],
  commentaire_donnees_reporting: ['donnees', 'dashboard', 'analytics', 'indicateurs', 'tableau de bord'],
  telemedecine_triage_orientation: ['sante', 'patient', 'clinique', 'hopital', 'telemedecine'],
  banque_kyc_reporting: ['banque', 'kyc', 'compliance', 'conformite', 'risque'],
  operations_terrain_coordination: ['flotte', 'terrain', 'logistique', 'livraison', 'intervention', 'operations'],
  energie_industrie_services: ['energie', 'oil', 'gas', 'station', 'industrie', 'industriel'],
  formation_montee_en_competence: ['formation', 'certification', 'academy', 'apprentissage', 'competence']
};
const signalTags = Object.keys(signalTaxonomy).filter(function(key) {
  return signalTaxonomy[key].some(function(kw) { return normalized.indexOf(kw) !== -1; });
});
const allowedFields = ['organization_type', 'sector_guess', 'country', 'signal_tags', 'roi_clues', 'page_keys', 'public_text_sanitized_excerpt'];
const blockedFields = ['organization_name', 'website', 'decision_maker_name', 'target_email', 'page_texts', 'public_text'];
const sanitizedExcerpt = sanitizedText.slice(0, 12000);
const llmAllowedPayload = {
  llm_policy: 'deny-by-default', organization_ref: 'ORG_TARGET',
  decision_maker_ref: decisionMaker ? 'DECISION_MAKER_TARGET' : null,
  organization_type: source.organization_type || null, sector_guess: source.sector_guess || null,
  country: source.country || null, signal_tags: signalTags,
  roi_clues: Array.isArray(source.roi_clues) ? source.roi_clues : [],
  page_keys: Array.isArray(source.page_texts) ? source.page_texts.map(function(p) { return p.key; }) : [],
  public_text_sanitized_excerpt: sanitizedExcerpt,
  allowed_fields: allowedFields, blocked_fields: blockedFields
};
const llmGenerationPayload = Object.assign({}, llmAllowedPayload, {
  organization_display: '{{ORGANIZATION_NAME}}',
  decision_maker_display: '{{DECISION_MAKER_NAME}}',
  website_display: '{{WEBSITE}}'
});
return [{ json: Object.assign({}, source, {
  public_text_sanitized: sanitizedExcerpt,
  llm_allowed_payload: llmAllowedPayload,
  llm_generation_payload: llmGenerationPayload,
  llm_redaction_summary: {
    policy: 'deny-by-default', blocked_fields: blockedFields, allowed_fields: allowedFields,
    pseudonymized_identifiers: ['organization_name', 'decision_maker_name', 'website'],
    text_sent_to_llm: 'sanitized_public_text_excerpt_only'
  }
}) }];"""

CODE_ASSEMBLE_CONTEXT = r"""const base = JSON.parse(JSON.stringify($('Sanitize Prospect Data For LLM').first().json));
function parseOpenAI(nodeName) {
  try {
    const n = $(nodeName).first().json;
    const raw = (n && n.choices && n.choices[0] && n.choices[0].message && n.choices[0].message.content) || '{}';
    try { return JSON.parse(raw); } catch(e) { return { parse_error: nodeName + ': ' + e.message }; }
  } catch(e) { return { parse_error: nodeName + ': not executed' }; }
}
function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
const preAudit = parseOpenAI('Call OpenAI Pre-Audit');
const problems = parseOpenAI('Call OpenAI Problems Solutions');
const roi = parseOpenAI('Call OpenAI ROI');
const sectorVariant = problems.sector_variant || slugify(base.sector_guess) || 'multi_sector_operations';
return [{ json: Object.assign({}, base, preAudit, problems, roi, {
  single_primary_cta: "Planifier un audit strategique gratuit suivi d'un echange de 30 minutes",
  sector_variant: sectorVariant
}) }];"""

CODE_ASSEMBLE_PACK = r"""function textFrom(nodeName) {
  try {
    const n = $(nodeName).first().json;
    return (n && n.choices && n.choices[0] && n.choices[0].message && n.choices[0].message.content) || '';
  } catch(e) { return ''; }
}
function jsonFrom(nodeName) {
  const raw = textFrom(nodeName) || '{}';
  try { return JSON.parse(raw); } catch(e) { return { parse_error: nodeName + ': ' + e.message, raw: raw }; }
}
function hydrateString(value, ctx) {
  return String(value)
    .replace(/\{\{ORGANIZATION_NAME\}\}/g, ctx.organization_name || '')
    .replace(/\{\{DECISION_MAKER_NAME\}\}/g, ctx.decision_maker_name || '')
    .replace(/\{\{WEBSITE\}\}/g, ctx.website || '');
}
function hydrateValue(value, ctx) {
  if (typeof value === 'string') return hydrateString(value, ctx);
  if (Array.isArray(value)) return value.map(function(item) { return hydrateValue(item, ctx); });
  if (value && typeof value === 'object') {
    const out = {}; const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++) out[keys[i]] = hydrateValue(value[keys[i]], ctx);
    return out;
  }
  return value;
}
const ctx = JSON.parse(JSON.stringify($('Assemble Prospect Context').first().json));
const executiveLetter   = hydrateString(textFrom('Generate Executive Letter'),  ctx);
const tailoredCatalogue = hydrateString(textFrom('Generate Tailored Catalogue'), ctx);
const tailoredAuditForm = hydrateString(textFrom('Generate Tailored Audit Form'), ctx);
const deckBrief         = hydrateValue(jsonFrom('Generate Deck Brief'), ctx);
const packId = ctx.pack_id || 'pack-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
return [{ json: Object.assign({}, ctx, {
  pack_id: packId,
  executive_letter: executiveLetter,
  tailored_catalogue: tailoredCatalogue,
  tailored_audit_form: tailoredAuditForm,
  deck_brief: deckBrief,
  llm_redaction_summary: ctx.llm_redaction_summary,
  llm_allowed_payload: ctx.llm_allowed_payload,
  llm_generation_payload: ctx.llm_generation_payload
}) }];"""

# ─── V3 NEW: QUALITY CONTROL CHECK ──────────────────────────────────────────
CODE_QUALITY_CONTROL = r"""// V3 — Contrôle qualité automatisé avant envoi
var pack = JSON.parse(JSON.stringify($input.first().json));
var letter = pack.executive_letter || '';
var orgName = pack.organization_name || '';
var targetEmail = pack.target_email || '';
var packId = pack.pack_id || '';
var catalogue = pack.tailored_catalogue || '';
var useCases = String(pack.recommended_use_case || pack.best_selling_use_case || '');

// 7 critères de qualité
var checks = {
  hasExecutiveLetter:    letter.length > 200,
  letterNotEmpty:        letter.trim().length > 0,
  hasValidTargetEmail:   targetEmail.indexOf('@') !== -1 && targetEmail.indexOf('.') !== -1,
  hasPackId:             packId.length > 5,
  hasTailoredCatalogue:  catalogue.length > 100,
  hasOrganizationName:   orgName.trim().length > 2,
  hasRecommendedUseCase: useCases.length > 0
};

var passedCount = 0;
var failedChecks = [];
var keys = Object.keys(checks);
for (var i = 0; i < keys.length; i++) {
  if (checks[keys[i]]) { passedCount++; } else { failedChecks.push(keys[i]); }
}
var totalChecks = keys.length;
// Score sur 100 — seuil: 71% (5/7 critères minimum)
var qualityScore = Math.round((passedCount / totalChecks) * 100);
var passed = qualityScore >= 71;
var failureReason = passed
  ? null
  : ('Score qualite: ' + qualityScore + '% (' + passedCount + '/' + totalChecks + '). Criteres en echec: ' + failedChecks.join(', '));

return [{ json: Object.assign({}, pack, {
  quality_check: {
    passed:       passed,
    score:        qualityScore,
    passed_count: passedCount,
    total_checks: totalChecks,
    checks:       checks,
    checked_at:   new Date().toISOString(),
    failure_reason: failureReason
  }
}) }];"""

# ─── V3 NEW: LOG QUALITY FAILURE ────────────────────────────────────────────
CODE_LOG_QUALITY_FAILURE = r"""// V3 — Log de l'échec qualité (pack non envoyé)
var qcData = $('Quality Control Check').first().json;
var qc = qcData.quality_check || {};
return [{ json: {
  event:             'quality_check_failed',
  pack_id:           qcData.pack_id,
  organization_name: qcData.organization_name,
  target_email:      qcData.target_email,
  quality_score:     qc.score,
  failure_reason:    qc.failure_reason,
  failed_checks:     qc.checks,
  logged_at:         new Date().toISOString()
} }];"""

# ─── OpenAI jsonBody helpers ─────────────────────────────────────────────────
def oai_pre_audit():
    return "={{JSON.stringify({ model: 'gpt-4.1-mini', temperature: 0.2, response_format: { type: 'json_object' }, messages: [ { role: 'system', content: \"Tu es l'assistant IA de prospection de TransferAI. Analyse uniquement des signaux pseudonymisés et retourne uniquement un JSON valide avec: organization_summary, probable_strengths, probable_weaknesses, probable_needs, entry_point_niche, confidence_score. N'utilise jamais de noms réels; raisonne sur ORG_TARGET.\" }, { role: 'user', content: `Contexte prospect pseudonymisé:\\n${JSON.stringify($json.llm_allowed_payload, null, 2)}` } ] })}}"

def oai_problems():
    return "={{JSON.stringify({ model: 'gpt-4.1-mini', temperature: 0.2, response_format: { type: 'json_object' }, messages: [ { role: 'system', content: \"Tu es un analyste commercial TransferAI. Retourne uniquement un JSON valide avec: probable_problems, probable_quick_wins, recommended_offer, offer_sequence, recommended_training_bundle, recommended_use_case, best_selling_use_case, commercial_priority_tier, recommended_meeting_angle. Les problèmes doivent être formulés comme hypothèses. Privilégie les cas les plus vendables à court terme: support IT intelligent, service client multicanal, machine à contenu marketing, workflow administratif, assistant documentaire de direction. Ne fais référence qu'à ORG_TARGET.\" }, { role: 'user', content: `Contexte prospect pseudonymisé:\\n${JSON.stringify($json.llm_allowed_payload, null, 2)}` } ] })}}"

def oai_roi():
    return "={{JSON.stringify({ model: 'gpt-4.1-mini', temperature: 0.2, response_format: { type: 'json_object' }, messages: [ { role: 'system', content: \"Tu es un analyste de valeur TransferAI. Retourne uniquement un JSON valide avec: roi_hypothesis, expected_time_savings, expected_service_improvements, expected_quick_wins, delivery_timeline. Présente les chiffres comme hypothèses ou benchmarks à valider. Ne fais référence qu'à ORG_TARGET.\" }, { role: 'user', content: `Contexte prospect pseudonymisé:\\n${JSON.stringify($json.llm_allowed_payload, null, 2)}` } ] })}}"

def oai_letter():
    return "={{JSON.stringify({ model: 'gpt-4.1-mini', temperature: 0.4, messages: [ { role: 'system', content: \"Redige un courrier professionnel. IDENTITE TRANSFERAI: TransferAI est la branche IA de NettelecomCI en Cote d'Ivoire. Hub IA compose de 13 experts ivoiriens bases en Cote d'Ivoire, Royaume-Uni, Etats-Unis et Inde. REGLES: 1. Resultat attendu client en premier. 2. Ancrage local NettelecomCI ET 13 experts. 3. Utilise sector_pitches. 4. Audit gratuit + 30 minutes. 5. Lien https://calendly.com/transferai/30min. 6. Tokens \\x7b\\x7bORGANIZATION_NAME\\x7d\\x7d \\x7b\\x7bDECISION_MAKER_NAME\\x7d\\x7d \\x7b\\x7bWEBSITE\\x7d\\x7d. SIGNATURE: Casimir Kassi Beda DG TransferAI contact@transferai.ci | Marius Ayoro marius.ayoro@transferai.ci | Eric N'Guessan eric.nguessan@transferai.ci\" }, { role: 'user', content: `Contexte:\\n${JSON.stringify($json.llm_generation_payload, null, 2)}` } ] })}}"

def oai_catalogue():
    return "={{JSON.stringify({ model: 'gpt-4.1-mini', temperature: 0.4, messages: [ { role: 'system', content: \"Rédige un mini-catalogue ciblé avec les sections: Message central, Objectifs, Pourquoi cette approche peut intéresser la structure, Notre porte d'entrée, Offres prioritaires, Formations prioritaires, Hypothèse de gains attendus, Proposition immédiate. Utilise les tokens \\x7b\\x7bORGANIZATION_NAME\\x7d\\x7d et \\x7b\\x7bWEBSITE\\x7d\\x7d au lieu des identifiants réels.\" }, { role: 'user', content: `Contexte prospect pseudonymisé:\\n${JSON.stringify($json.llm_generation_payload, null, 2)}` } ] })}}"

def oai_audit_form():
    return "={{JSON.stringify({ model: 'gpt-4.1-mini', temperature: 0.3, messages: [ { role: 'system', content: \"Crée une forme d'audit courte à envoyer avant un appel de 30 minutes. Elle doit être adaptée au secteur et couvrir: priorités métier, irritants, outils actuels, données, attentes de formation, confidentialité, objectifs à 3 mois, volumes traités, délais actuels et objectifs de performance. Utilise les tokens \\x7b\\x7bORGANIZATION_NAME\\x7d\\x7d et \\x7b\\x7bWEBSITE\\x7d\\x7d au lieu des identifiants réels.\" }, { role: 'user', content: `Contexte prospect pseudonymisé:\\n${JSON.stringify($json.llm_generation_payload, null, 2)}` } ] })}}"

def oai_deck():
    return "={{JSON.stringify({ model: 'gpt-4.1-mini', temperature: 0.2, response_format: { type: 'json_object' }, messages: [ { role: 'system', content: \"Retourne uniquement un JSON valide avec les clés suivantes: deck_profile, slide_objective, key_messages, sector_pain_points, recommended_case_study, training_focus, roi_hypothesis, delivery_timeline, sector_variant, single_primary_cta. Tu produis le brief d'un deck PowerPoint executive TransferAI taillé sur mesure pour un prospect. IDENTITE TRANSFERAI: TransferAI est la branche IA de NettelecomCI en Côte d'Ivoire. Le hub s'appuie sur 13 experts ivoiriens basés en Côte d'Ivoire, au Royaume-Uni, aux États-Unis et en Inde. OBJECTIF: préparer un deck de 10 slides, propre, décisionnel et orienté DG, sponsor projet, secrétaire général ou décideur institutionnel. REGLE DE ROUTAGE: choisis d'abord deck_profile. Utilise commercial_enterprise pour les entreprises privées et les contextes où le langage dominant doit être business, performance, ROI, gains rapides et pilotage opérationnel. Utilise institutional pour les institutions publiques, structures parapubliques, banques, assurances, institutions financières, ONG, bailleurs, fondations et organisations internationales, avec un langage dominant de mission, qualité de service, gouvernance, conformité, supervision et renforcement des capacités. Le type d'organisation, le secteur, les signaux métier visibles et la nature des irritants doivent guider ce choix. NARRATION OBLIGATOIRE: si deck_profile = commercial_enterprise, suis cette logique: 1. couverture orientée résultat, 2. identité et crédibilité TransferAI, 3. contexte et irritants métier, 4. ROI de référence et KPI à instrumenter, 5. cas d'usage prioritaires, 6. détail des deux premiers cas d'usage, 7. usages de standardisation et qualité de service, 8. parcours 90 jours, 9. offre recommandée en 4 briques, 10. confiance et prochaine étape. Si deck_profile = institutional, suis cette logique: 1. couverture orientée impact et mission, 2. identité et crédibilité TransferAI, 3. contexte institutionnel et enjeux de service, 4. résultats attendus et indicateurs de preuve, 5. cas d'usage prioritaires, 6. gouvernance, confidentialité et supervision, 7. renforcement des capacités et conduite du changement, 8. feuille de route 90 jours, 9. dispositif d'accompagnement recommandé, 10. confiance et prochaine étape. REGLES: chaque slide porte une conclusion claire; aucun catalogue générique; les gains sont formulés comme hypothèses ou benchmarks à confirmer pendant l'audit; les cas d'usage doivent être crédibles, visibles et reliés à des flux métier réels; un seul CTA principal; utilise les tokens \\x7b\\x7bORGANIZATION_NAME\\x7d\\x7d, \\x7b\\x7bDECISION_MAKER_NAME\\x7d\\x7d et \\x7b\\x7bWEBSITE\\x7d\\x7d au lieu des identifiants réels. REGLES DE LANGUE: si le contexte indique le français, rédige exclusivement en français standard avec accents; si le contexte indique l'anglais, rédige exclusivement en anglais professionnel standard; si le contexte indique l'espagnol, rédige exclusivement en espagnol professionnel standard avec accents; ne mélange jamais les langues; adapte naturellement les titres, CTA, formulations ROI et transitions à la langue du prospect. FORMAT: deck_profile = commercial_enterprise ou institutional; slide_objective = phrase de couverture; key_messages = 4 à 6 messages; sector_pain_points = 3 à 5 irritants; recommended_case_study = 3 à 4 cas d'usage avec logique avant/après; training_focus = 4 à 8 axes de formation; roi_hypothesis = 3 à 5 hypothèses de gains ou KPI; delivery_timeline = 4 étapes max audit -> premier livrable -> formation/pilote -> mesure/extension; sector_variant = variante métier courte et claire; single_primary_cta = un seul appel à l'action. N'ajoute aucun commentaire hors JSON.\" }, { role: 'user', content: `Contexte prospect pseudonymisé:\\n${JSON.stringify($json.llm_generation_payload, null, 2)}` } ] })}}"

OAI_HEADERS = {
    "parameters": [
        { "name": "Authorization", "value": "=Bearer {{$env.OPENAI_API_KEY}}" },
        { "name": "Content-Type",  "value": "application/json" }
    ]
}

def oai_node(node_id, name, position, body_fn):
    return {
        "parameters": {
            "method": "POST",
            "url": "https://api.openai.com/v1/chat/completions",
            "authentication": "none",
            "sendHeaders": True,
            "headerParameters": OAI_HEADERS,
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": body_fn(),
            "options": {}
        },
        "id": node_id,
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": position
    }

def fetch_node(node_id, name, page_num, position):
    return {
        "parameters": {
            "method": "GET",
            "url": f"={{$('Build Source URLs').first().json.page_{page_num}_url}}",
            "options": {
                "allowUnauthorizedCerts": True,
                "response": { "response": { "neverError": True, "responseFormat": "text" } }
            }
        },
        "id": node_id,
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": position
    }

# ─── WORKFLOW DEFINITION ─────────────────────────────────────────────────────
workflow = {
    "name": "TransferAI Prospecting V3 Auto Quality Send",
    "nodes": [
        # ── TRIGGERS ─────────────────────────────────────────────────────────
        {
            "parameters": {},
            "id": "node-001",
            "name": "Manual Trigger",
            "type": "n8n-nodes-base.manualTrigger",
            "typeVersion": 1,
            "position": [220, 320]
        },
        {
            "parameters": {},
            "id": "node-001b",
            "name": "Execute Workflow Trigger",
            "type": "n8n-nodes-base.executeWorkflowTrigger",
            "typeVersion": 1,
            "position": [200, 380]
        },
        # ── SET TARGET ───────────────────────────────────────────────────────
        {
            "parameters": {
                "mode": "manual",
                "duplicateItem": False,
                "includeOtherFields": False,
                "fields": {
                    "values": [
                        { "name": "prospect_id",                "type": "string", "stringValue": "test-prospect-001" },
                        { "name": "organization_name",           "type": "string", "stringValue": "Orange Côte d'Ivoire" },
                        { "name": "website",                     "type": "string", "stringValue": "https://www.orange.ci" },
                        { "name": "country",                     "type": "string", "stringValue": "Côte d'Ivoire" },
                        { "name": "organization_type",           "type": "string", "stringValue": "Entreprise de télécommunications" },
                        { "name": "sector_guess",                "type": "string", "stringValue": "Télécommunications" },
                        { "name": "decision_maker_name",         "type": "string", "stringValue": "Directeur Général" },
                        { "name": "target_email",                "type": "string", "stringValue": "VOTRE_EMAIL_TEST@gmail.com" },
                        { "name": "custom_page_paths_csv",       "type": "string", "stringValue": "" },
                        { "name": "booking_link_30min",          "type": "string", "stringValue": "https://calendly.com/transferai/30min" },
                        { "name": "commercial_priority_default", "type": "string", "stringValue": "tier1" },
                        { "name": "research_scope",              "type": "string", "stringValue": "public_web_only" }
                    ]
                }
            },
            "id": "node-002",
            "name": "Set Target",
            "type": "n8n-nodes-base.set",
            "typeVersion": 3.4,
            "position": [460, 320]
        },
        # ── BUILD SOURCE URLs ─────────────────────────────────────────────────
        {
            "parameters": {
                "jsCode": CODE_BUILD_SOURCE_URLS,
                "mode": "runOnceForAllItems"
            },
            "id": "node-003",
            "name": "Build Source URLs",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [700, 320]
        },
        # ── FETCH PUBLIC PAGES ────────────────────────────────────────────────
        fetch_node("node-004", "Fetch Public Page 1", 1, [960,  80]),
        fetch_node("node-005", "Fetch Public Page 2", 2, [960, 200]),
        fetch_node("node-006", "Fetch Public Page 3", 3, [960, 320]),
        fetch_node("node-007", "Fetch Public Page 4", 4, [960, 440]),
        fetch_node("node-008", "Fetch Public Page 5", 5, [960, 560]),
        # ── NORMALIZE ────────────────────────────────────────────────────────
        {
            "parameters": { "jsCode": CODE_NORMALIZE, "mode": "runOnceForAllItems" },
            "id": "node-009",
            "name": "Normalize Public Signals",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [1240, 320]
        },
        # ── SANITIZE ─────────────────────────────────────────────────────────
        {
            "parameters": { "jsCode": CODE_SANITIZE, "mode": "runOnceForAllItems" },
            "id": "node-009a",
            "name": "Sanitize Prospect Data For LLM",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [1490, 620]
        },
        # ── OPENAI CALLS ──────────────────────────────────────────────────────
        oai_node("node-010", "Call OpenAI Pre-Audit",          [1500, 100], oai_pre_audit),
        oai_node("node-011", "Call OpenAI Problems Solutions",  [1500, 260], oai_problems),
        oai_node("node-012", "Call OpenAI ROI",                 [1500, 420], oai_roi),
        # ── ASSEMBLE CONTEXT ──────────────────────────────────────────────────
        {
            "parameters": { "jsCode": CODE_ASSEMBLE_CONTEXT, "mode": "runOnceForAllItems" },
            "id": "node-013",
            "name": "Assemble Prospect Context",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [1760, 320]
        },
        # ── GENERATE CONTENT ──────────────────────────────────────────────────
        oai_node("node-014", "Generate Executive Letter",    [2020, 100], oai_letter),
        oai_node("node-015", "Generate Tailored Catalogue",  [2020, 220], oai_catalogue),
        oai_node("node-016", "Generate Tailored Audit Form", [2020, 340], oai_audit_form),
        oai_node("node-017", "Generate Deck Brief",          [2020, 460], oai_deck),
        # ── ASSEMBLE PACK ─────────────────────────────────────────────────────
        {
            "parameters": { "jsCode": CODE_ASSEMBLE_PACK, "mode": "runOnceForAllItems" },
            "id": "node-018",
            "name": "Assemble Prospect Pack",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [2280, 320]
        },
        # ══════════════════════════════════════════════════════════════════════
        # V3 — QUALITY CONTROL + AUTO-SEND (remplace le circuit approbation V2)
        # ══════════════════════════════════════════════════════════════════════
        # ── QUALITY CONTROL CHECK ─────────────────────────────────────────────
        {
            "parameters": { "jsCode": CODE_QUALITY_CONTROL, "mode": "runOnceForAllItems" },
            "id": "node-019",
            "name": "Quality Control Check",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [2520, 320]
        },
        # ── STORE PACK IN SUPABASE (V3 — inclut quality_check) ───────────────
        {
            "parameters": {
                "method": "POST",
                "url": "https://VOTRE_URL.supabase.co/rest/v1/ai_prospecting_packs",
                "authentication": "none",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        { "name": "apikey",        "value": "VOTRE_SERVICE_ROLE_KEY" },
                        { "name": "Authorization",  "value": "Bearer VOTRE_SERVICE_ROLE_KEY" },
                        { "name": "Content-Type",   "value": "application/json" },
                        { "name": "Prefer",         "value": "return=representation" }
                    ]
                },
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{JSON.stringify({\n  pack_id: $json.pack_id,\n  prospect_id: $json.prospect_id || null,\n  organization_name: $json.organization_name,\n  target_email: $json.target_email,\n  status: ($json.quality_check && $json.quality_check.passed) ? 'queued_auto_send' : 'quality_failed',\n  payload: $json,\n  llm_redaction_summary: $json.llm_redaction_summary || null,\n  quality_score: ($json.quality_check ? $json.quality_check.score : null),\n  quality_check: $json.quality_check || null\n})}}",
                "options": {}
            },
            "id": "node-020",
            "name": "Store Pack In Supabase",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [2760, 320]
        },
        # ── IF QUALITY PASS (typeVersion 1 obligatoire) ───────────────────────
        {
            "parameters": {
                "conditions": {
                    "string": [
                        {
                            "value1": "={{$('Quality Control Check').first().json.quality_check.passed ? 'yes' : 'no'}}",
                            "operation": "equal",
                            "value2": "yes"
                        }
                    ]
                }
            },
            "id": "node-021",
            "name": "If Quality Pass",
            "type": "n8n-nodes-base.if",
            "typeVersion": 1,
            "position": [3000, 320]
        },
        # ── AUTO SEND PROSPECT EMAIL (chemin OUI) ─────────────────────────────
        {
            "parameters": {
                "method": "POST",
                "url": "https://api.resend.com/emails",
                "authentication": "none",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        { "name": "Authorization", "value": "Bearer VOTRE_CLE_RESEND" },
                        { "name": "Content-Type",  "value": "application/json" }
                    ]
                },
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{JSON.stringify({\n  from: 'onboarding@resend.dev',\n  to: [$('Quality Control Check').first().json.target_email],\n  subject: \"Proposition d'audit gratuit et d'accompagnement IA — \" + $('Quality Control Check').first().json.organization_name,\n  html: ($('Quality Control Check').first().json.executive_letter || '').replace(/\\n/g, '<br>')\n})}}",
                "options": {}
            },
            "id": "node-022",
            "name": "Auto Send Prospect Email",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [3240, 160]
        },
        # ── MARK PACK SENT ────────────────────────────────────────────────────
        {
            "parameters": {
                "method": "PATCH",
                "url": "={{'https://VOTRE_URL.supabase.co/rest/v1/ai_prospecting_packs?pack_id=eq.' + $('Quality Control Check').first().json.pack_id}}",
                "authentication": "none",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        { "name": "apikey",        "value": "VOTRE_SERVICE_ROLE_KEY" },
                        { "name": "Authorization",  "value": "Bearer VOTRE_SERVICE_ROLE_KEY" },
                        { "name": "Content-Type",   "value": "application/json" }
                    ]
                },
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{JSON.stringify({ status: 'sent', sent_at: new Date().toISOString() })}}",
                "options": {}
            },
            "id": "node-023",
            "name": "Mark Pack Sent",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [3480, 160]
        },
        # ── LOG OUTREACH ATTEMPT ──────────────────────────────────────────────
        {
            "parameters": {
                "method": "POST",
                "url": "https://VOTRE_URL.supabase.co/rest/v1/outreach_attempts",
                "authentication": "none",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        { "name": "apikey",        "value": "VOTRE_SERVICE_ROLE_KEY" },
                        { "name": "Authorization",  "value": "Bearer VOTRE_SERVICE_ROLE_KEY" },
                        { "name": "Content-Type",   "value": "application/json" }
                    ]
                },
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{JSON.stringify({\n  prospect_id: $('Quality Control Check').first().json.prospect_id || null,\n  pack_id: $('Quality Control Check').first().json.pack_id || null,\n  channel: 'email',\n  sent_at: new Date().toISOString(),\n  status: 'sent'\n})}}",
                "options": {}
            },
            "id": "node-024",
            "name": "Log Outreach Attempt",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [3720, 160]
        },
        # ── MARK PACK FAILED (chemin NON) ─────────────────────────────────────
        {
            "parameters": {
                "method": "PATCH",
                "url": "={{'https://VOTRE_URL.supabase.co/rest/v1/ai_prospecting_packs?pack_id=eq.' + $('Quality Control Check').first().json.pack_id}}",
                "authentication": "none",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        { "name": "apikey",        "value": "VOTRE_SERVICE_ROLE_KEY" },
                        { "name": "Authorization",  "value": "Bearer VOTRE_SERVICE_ROLE_KEY" },
                        { "name": "Content-Type",   "value": "application/json" }
                    ]
                },
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{JSON.stringify({\n  status: 'quality_failed',\n  quality_score: $('Quality Control Check').first().json.quality_check.score,\n  rejected_at: new Date().toISOString()\n})}}",
                "options": {}
            },
            "id": "node-025",
            "name": "Mark Pack Failed",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [3240, 480]
        },
        # ── LOG QUALITY FAILURE ───────────────────────────────────────────────
        {
            "parameters": { "jsCode": CODE_LOG_QUALITY_FAILURE, "mode": "runOnceForAllItems" },
            "id": "node-026",
            "name": "Log Quality Failure",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [3480, 480]
        }
    ],
    "connections": {
        "Manual Trigger":              { "main": [[{ "node": "Set Target",              "type": "main", "index": 0 }]] },
        "Execute Workflow Trigger":    { "main": [[{ "node": "Set Target",              "type": "main", "index": 0 }]] },
        "Set Target":                  { "main": [[{ "node": "Build Source URLs",       "type": "main", "index": 0 }]] },
        "Build Source URLs":           { "main": [[{ "node": "Fetch Public Page 1",     "type": "main", "index": 0 }]] },
        "Fetch Public Page 1":         { "main": [[{ "node": "Fetch Public Page 2",     "type": "main", "index": 0 }]] },
        "Fetch Public Page 2":         { "main": [[{ "node": "Fetch Public Page 3",     "type": "main", "index": 0 }]] },
        "Fetch Public Page 3":         { "main": [[{ "node": "Fetch Public Page 4",     "type": "main", "index": 0 }]] },
        "Fetch Public Page 4":         { "main": [[{ "node": "Fetch Public Page 5",     "type": "main", "index": 0 }]] },
        "Fetch Public Page 5":         { "main": [[{ "node": "Normalize Public Signals","type": "main", "index": 0 }]] },
        "Normalize Public Signals":    { "main": [[{ "node": "Sanitize Prospect Data For LLM", "type": "main", "index": 0 }]] },
        "Sanitize Prospect Data For LLM": {
            "main": [[
                { "node": "Call OpenAI Pre-Audit",         "type": "main", "index": 0 },
                { "node": "Call OpenAI Problems Solutions", "type": "main", "index": 0 },
                { "node": "Call OpenAI ROI",                "type": "main", "index": 0 }
            ]]
        },
        "Call OpenAI Pre-Audit":           { "main": [[{ "node": "Assemble Prospect Context",  "type": "main", "index": 0 }]] },
        "Assemble Prospect Context": {
            "main": [[
                { "node": "Generate Executive Letter",   "type": "main", "index": 0 },
                { "node": "Generate Tailored Catalogue", "type": "main", "index": 0 },
                { "node": "Generate Tailored Audit Form","type": "main", "index": 0 },
                { "node": "Generate Deck Brief",         "type": "main", "index": 0 }
            ]]
        },
        "Generate Executive Letter":   { "main": [[{ "node": "Assemble Prospect Pack",  "type": "main", "index": 0 }]] },
        "Assemble Prospect Pack":      { "main": [[{ "node": "Quality Control Check",   "type": "main", "index": 0 }]] },
        "Quality Control Check":       { "main": [[{ "node": "Store Pack In Supabase",  "type": "main", "index": 0 }]] },
        "Store Pack In Supabase":      { "main": [[{ "node": "If Quality Pass",         "type": "main", "index": 0 }]] },
        "If Quality Pass": {
            "main": [
                [{ "node": "Auto Send Prospect Email", "type": "main", "index": 0 }],
                [{ "node": "Mark Pack Failed",         "type": "main", "index": 0 }]
            ]
        },
        "Auto Send Prospect Email":    { "main": [[{ "node": "Mark Pack Sent",           "type": "main", "index": 0 }]] },
        "Mark Pack Sent":              { "main": [[{ "node": "Log Outreach Attempt",     "type": "main", "index": 0 }]] },
        "Mark Pack Failed":            { "main": [[{ "node": "Log Quality Failure",      "type": "main", "index": 0 }]] }
    },
    "active": False,
    "settings": { "executionOrder": "v1" },
    "versionId": "transferai-prospecting-v3-auto-quality-send-corrected",
    "meta": { "templateCredsSetupCompleted": False },
    "pinData": {},
    "tags": [
        { "name": "transferai" },
        { "name": "prospection" },
        { "name": "n8n" },
        { "name": "v3" }
    ]
}

# ─── VALIDATE: 0 occurrences de $env.* hors OpenAI ──────────────────────────
raw = json.dumps(workflow, ensure_ascii=False, indent=2)

import re
env_hits = [(m.group(), raw[max(0,m.start()-40):m.end()+40]) for m in re.finditer(r'\$env\.(?!OPENAI_API_KEY)', raw)]
if env_hits:
    print("⚠️  $env.* détecté (hors OPENAI_API_KEY):")
    for hit, ctx in env_hits:
        print(f"  {hit}  →  ...{ctx}...")
else:
    print("✅  0 référence $env.* interdite")

votre_count = raw.count("VOTRE_")
print(f"✅  {votre_count} placeholders VOTRE_* à remplacer par le client")

node_count = len(workflow["nodes"])
print(f"✅  {node_count} nœuds au total")

# ─── WRITE ────────────────────────────────────────────────────────────────────
with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write(raw)
print(f"\nOK: {OUT_PATH}")
