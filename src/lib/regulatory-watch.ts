import type { ResourceFeedItem } from "@/lib/resource-feed";

export type RegulatoryJurisdiction = "cote-divoire" | "uemoa-bceao" | "afrique" | "international";
export type RegulatoryImpactLevel = "high" | "medium" | "monitor";

const normalize = (value: string | null | undefined) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const keywordGroups = {
  core: [
    "reglement",
    "reglementaire",
    "regulatory",
    "compliance",
    "conformite",
    "governance",
    "governance ia",
    "privacy",
    "data protection",
    "protection des donnees",
    "directive",
    "law",
    "legal",
    "juridique",
    "policy",
  ],
  banking: [
    "banque",
    "bank",
    "banking",
    "finance",
    "fintech",
    "bceao",
    "uemoa",
    "umoa",
    "kyc",
    "aml",
    "fraud",
    "risque",
    "risk",
    "audit",
  ],
};

const buildHaystack = (item: ResourceFeedItem) =>
  normalize(
    [
      item.titleFr,
      item.titleEn,
      item.excerptFr,
      item.excerptEn,
      item.sectorKey,
      item.sourceName,
      ...item.tags,
    ].join(" "),
  );

const hasAnyKeyword = (haystack: string, keywords: string[]) =>
  keywords.some((keyword) => haystack.includes(normalize(keyword)));

const findTagValue = (tags: string[], prefix: string) => {
  const match = tags.find((tag) => normalize(tag).startsWith(`${prefix}:`));
  if (!match) {
    return null;
  }

  return normalize(match).slice(prefix.length + 1);
};

export const isRegulatoryWatchCandidate = (item: ResourceFeedItem) => {
  if (item.categoryKey !== "veille") {
    return false;
  }

  const haystack = buildHaystack(item);
  const sectorMatch =
    item.sectorKey === "Finance & Fintech" ||
    item.sectorKey === "Droit & LegalTech IA";

  return sectorMatch || (hasAnyKeyword(haystack, keywordGroups.core) && hasAnyKeyword(haystack, keywordGroups.banking));
};

export const resolveRegulatoryJurisdiction = (item: ResourceFeedItem): RegulatoryJurisdiction => {
  const taggedJurisdiction = findTagValue(item.tags, "jurisdiction");
  if (
    taggedJurisdiction === "cote-divoire" ||
    taggedJurisdiction === "uemoa-bceao" ||
    taggedJurisdiction === "afrique" ||
    taggedJurisdiction === "international"
  ) {
    return taggedJurisdiction;
  }

  const haystack = buildHaystack(item);

  if (
    haystack.includes("bceao") ||
    haystack.includes("uemoa") ||
    haystack.includes("umoa") ||
    haystack.includes("union economique")
  ) {
    return "uemoa-bceao";
  }

  if (
    haystack.includes("cote d'ivoire") ||
    haystack.includes("cote-divoire") ||
    haystack.includes("ivory coast") ||
    haystack.includes("abidjan") ||
    haystack.includes("artci")
  ) {
    return "cote-divoire";
  }

  if (
    haystack.includes("afrique") ||
    haystack.includes("africa") ||
    haystack.includes("cedeao") ||
    haystack.includes("ecowas")
  ) {
    return "afrique";
  }

  return "international";
};

export const resolveRegulatoryImpactLevel = (item: ResourceFeedItem): RegulatoryImpactLevel => {
  const taggedImpact = findTagValue(item.tags, "impact");
  if (taggedImpact === "high" || taggedImpact === "medium" || taggedImpact === "monitor") {
    return taggedImpact;
  }

  const haystack = buildHaystack(item);

  if (
    hasAnyKeyword(haystack, [
      "obligation",
      "mandatory",
      "sanction",
      "licence",
      "authorization",
      "compliance",
      "conformite",
      "gouvernance",
      "governance",
      "bceao",
      "privacy",
      "risk",
      "risque",
    ])
  ) {
    return "high";
  }

  if (
    hasAnyKeyword(haystack, [
      "framework",
      "cadre",
      "guideline",
      "recommandation",
      "consultation",
      "pilot",
      "reporting",
      "supervision",
    ])
  ) {
    return "medium";
  }

  return "monitor";
};

export const regulatoryWatchSearchText = (item: ResourceFeedItem) => buildHaystack(item);
