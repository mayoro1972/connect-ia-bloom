import { resolveAuditDomainAccess } from "./audit-domain-access.ts";

export type ProspectAuditRequestRow = {
  id: string;
  full_name: string;
  email: string;
  company?: string | null;
  profession?: string | null;
  sector?: string | null;
  message?: string | null;
  ai_maturity?: string | null;
  use_cases?: string[] | null;
  engagement_format?: string[] | null;
  scoping_horizon?: string | null;
  budget_range?: string | null;
};

export type ProspectAuditPackRow = {
  pack_id: string;
  organization_name?: string | null;
  organization_type?: string | null;
  target_email?: string | null;
  payload?: Record<string, unknown> | null;
};

export type AuditValidationScenario = "private_company" | "institution" | "low_maturity";

export type AuditAccessContext = {
  version: number;
  packId: string | null;
  contactRequestId: string | null;
  sectorLabel: string;
  sectorDomainKey: string;
  domainMessageKey: string;
  organizationName: string;
  organizationType: string;
  prospectContext: string;
  suggestedQuickWins: string[];
  suggestedUseCases: string[];
  suggestedConstraints: string[];
  maturityLevel: string;
  validationScenario: AuditValidationScenario;
  recommendedOffer: string | null;
  recommendedUseCase: string | null;
  scopingHorizon: string | null;
  engagementFormat: string[];
  budgetRange: string | null;
};

const slugToDomainMessageKey: Record<string, string> = {
  "assistanat-et-secretariat": "executive-support",
  "ressources-humaines": "human-resources",
  "marketing-et-communication": "marketing-communication",
  "finance-et-comptabilite": "finance-accounting",
  "juridique-et-conformite": "legal-compliance",
  "service-client": "customer-service",
  "data-analyse": "data-analytics",
  "administration-et-gestion": "administration-operations",
  "management-et-leadership": "management-leadership",
  "it-et-transformation-digitale": "it-digital-transformation",
  "formation-et-pedagogie": "learning-pedagogy",
  "sante-et-bien-etre": "health-wellbeing",
  "diplomatie-et-affaires-internationales": "diplomacy-international-affairs",
};

const trimText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeText = (value: unknown) =>
  trimText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const normalizeList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => trimText(item)).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
};

const uniqueList = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = trimText(value);
    if (!trimmed) continue;
    const key = normalizeText(trimmed);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
};

const asObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const inferOrganizationType = (request: ProspectAuditRequestRow | null, pack: ProspectAuditPackRow | null) => {
  const payload = asObject(pack?.payload);
  const explicitValue =
    trimText(pack?.organization_type) ||
    trimText(payload.organization_type) ||
    trimText(payload.organization_kind) ||
    trimText(payload.organization_category);

  const haystack = normalizeText([
    explicitValue,
    pack?.organization_name,
    request?.company,
    request?.sector,
    trimText(payload.public_sector_hint),
  ].join(" "));

  if (
    explicitValue.toLowerCase().includes("institution") ||
    explicitValue.toLowerCase().includes("public") ||
    /ministere|ministere|mairie|public|institution|universit|collectivit|agence|office|ong|etat/.test(haystack)
  ) {
    return "institution";
  }

  if (explicitValue) {
    return explicitValue;
  }

  return "entreprise-privee";
};

const inferMaturityLevel = (request: ProspectAuditRequestRow | null, pack: ProspectAuditPackRow | null) => {
  const payload = asObject(pack?.payload);
  const rawValue =
    trimText(request?.ai_maturity) ||
    trimText(payload.ai_maturity) ||
    trimText(payload.ai_maturity_guess) ||
    trimText(payload.maturity_level) ||
    trimText(payload.maturity_guess);
  const normalized = normalizeText(rawValue);

  if (/echelle|scale|deploy/.test(normalized)) return "echelle";
  if (/premier|production|use case|cas/.test(normalized)) return "premiers-cas";
  if (/experiment|pilot|test/.test(normalized)) return "experimentation";
  if (/decouverte|debut|begin|starter|novice/.test(normalized)) return "decouverte";

  const inferredUseCases = uniqueList([
    ...normalizeList(request?.use_cases),
    ...normalizeList(payload.recommended_use_case),
    ...normalizeList(payload.best_selling_use_case),
    ...normalizeList(payload.probable_needs),
  ]);

  return inferredUseCases.length > 0 ? "experimentation" : "decouverte";
};

const inferValidationScenario = (organizationType: string, maturityLevel: string) => {
  const normalizedOrgType = normalizeText(organizationType);

  if (normalizedOrgType.includes("institution") || normalizedOrgType.includes("public")) {
    return "institution" as const;
  }

  if (maturityLevel === "decouverte") {
    return "low_maturity" as const;
  }

  return "private_company" as const;
};

const buildSuggestedConstraints = (
  payload: Record<string, unknown>,
  scenario: AuditValidationScenario,
) => {
  const payloadConstraints = uniqueList([
    ...normalizeList(payload.constraints),
    ...normalizeList(payload.delivery_constraints),
    ...normalizeList(payload.watchpoints),
    ...normalizeList(payload.probable_problems),
  ]);

  const scenarioDefaults =
    scenario === "institution"
      ? [
          "Validation humaine et arbitrage interdirectionnel",
          "Traçabilité des décisions et conformité",
          "Confidentialité des données et cadre de gouvernance",
        ]
      : scenario === "low_maturity"
        ? [
            "Besoin d'acculturation avant tout déploiement large",
            "Priorité à des usages simples et mesurables",
            "Temps limité des équipes pour apprendre de nouveaux outils",
          ]
        : [
            "ROI visible à court terme",
            "Intégration avec les outils déjà en place",
            "Adoption concrète par les équipes métier",
          ];

  return uniqueList([...payloadConstraints, ...scenarioDefaults]).slice(0, 6);
};

const buildAuditAccessContextInternal = (
  request: ProspectAuditRequestRow | null,
  pack: ProspectAuditPackRow | null,
): AuditAccessContext => {
  const payload = asObject(pack?.payload);
  const sectorCandidate =
    trimText(request?.sector) ||
    trimText(payload.sector_guess) ||
    trimText(payload.catalogue_domain_slug) ||
    trimText(payload.sector_variant) ||
    "Audit IA";
  const { domainKey, domainTitle } = resolveAuditDomainAccess(sectorCandidate);
  const organizationType = inferOrganizationType(request, pack);
  const maturityLevel = inferMaturityLevel(request, pack);
  const validationScenario = inferValidationScenario(organizationType, maturityLevel);
  const suggestedQuickWins = uniqueList([
    ...normalizeList(payload.probable_quick_wins),
    ...normalizeList(payload.expected_quick_wins),
    ...normalizeList(payload.roi_hypothesis),
  ]).slice(0, 6);
  const suggestedUseCases = uniqueList([
    ...normalizeList(payload.recommended_use_case),
    ...normalizeList(payload.best_selling_use_case),
    ...normalizeList(payload.probable_needs),
    ...normalizeList(request?.use_cases),
  ]).slice(0, 6);
  const suggestedConstraints = buildSuggestedConstraints(payload, validationScenario);
  const prospectContext =
    trimText(payload.organization_summary) ||
    trimText(payload.public_text_sanitized_excerpt) ||
    trimText(request?.message) ||
    `Audit préparé pour ${trimText(pack?.organization_name) || trimText(request?.company) || trimText(request?.full_name) || "ce prospect"}.`;

  return {
    version: 2,
    packId: trimText(pack?.pack_id) || null,
    contactRequestId: request?.id ?? null,
    sectorLabel: domainTitle,
    sectorDomainKey: domainKey,
    domainMessageKey: slugToDomainMessageKey[domainKey] ?? "management-leadership",
    organizationName: trimText(pack?.organization_name) || trimText(request?.company) || trimText(request?.full_name) || "Prospect",
    organizationType,
    prospectContext,
    suggestedQuickWins,
    suggestedUseCases,
    suggestedConstraints,
    maturityLevel,
    validationScenario,
    recommendedOffer: trimText(payload.recommended_offer) || null,
    recommendedUseCase: trimText(payload.recommended_use_case) || trimText(payload.best_selling_use_case) || null,
    scopingHorizon: trimText(request?.scoping_horizon) || trimText(payload.delivery_timeline_summary) || null,
    engagementFormat: uniqueList([
      ...normalizeList(request?.engagement_format),
      ...normalizeList(payload.recommended_training_bundle),
    ]).slice(0, 6),
    budgetRange: trimText(request?.budget_range) || null,
  };
};

export const buildAuditAccessContext = (
  request: ProspectAuditRequestRow,
  pack: ProspectAuditPackRow | null,
) => buildAuditAccessContextInternal(request, pack);

export const buildAuditAccessContextFromPack = (pack: ProspectAuditPackRow) =>
  buildAuditAccessContextInternal(null, pack);

const buildAuditDraftFormDataInternal = (
  request: ProspectAuditRequestRow | null,
  pack: ProspectAuditPackRow | null,
  context: AuditAccessContext,
) => ({
  c_nom: trimText(request?.full_name) || trimText(pack?.organization_name),
  c_email: trimText(request?.email) || trimText(pack?.target_email),
  c_entite: context.organizationName,
  c_poste: trimText(request?.profession),
  c_domaine: context.sectorDomainKey,
  pack_id: context.packId,
  audit_sector: context.sectorLabel,
  organization_type: context.organizationType,
  audit_validation_scenario: context.validationScenario,
  maturity_level: context.maturityLevel,
  prospect_context: context.prospectContext,
  suggested_quick_wins: context.suggestedQuickWins,
  suggested_use_cases: context.suggestedUseCases,
  suggested_constraints: context.suggestedConstraints,
  recommended_offer: context.recommendedOffer,
  recommended_use_case: context.recommendedUseCase,
  engagement_format: context.engagementFormat,
  scoping_horizon: context.scopingHorizon,
  budget_range: context.budgetRange,
});

export const buildAuditDraftFormData = (
  request: ProspectAuditRequestRow,
  context: AuditAccessContext,
) => buildAuditDraftFormDataInternal(request, null, context);

export const buildAuditDraftFormDataFromPack = (
  pack: ProspectAuditPackRow,
  context: AuditAccessContext,
) => buildAuditDraftFormDataInternal(null, pack, context);
