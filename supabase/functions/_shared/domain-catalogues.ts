export type DomainCatalogueAsset = {
  domainKey: string;
  domainLabelFr: string;
  domainLabelEn: string;
  slug: string;
  htmlUrl: string;
  pdfUrl: string;
  docxUrl: string;
  pageUrl: string;
};

const SITE_URL = (Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.transferai.ci").replace(/\/$/, "");

const buildUrl = (path: string) => `${SITE_URL}${path}`;

export const domainCatalogueAssets: DomainCatalogueAsset[] = [
  {
    domainKey: "assistanat-et-secretariat",
    domainLabelFr: "Assistanat & Secrétariat",
    domainLabelEn: "Executive Assistance & Secretariat",
    slug: "assistanat-et-secretariat",
    htmlUrl: buildUrl("/catalogues-domaines-assets/assistanat-et-secretariat/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/assistanat-et-secretariat/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/assistanat-et-secretariat/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/assistanat-et-secretariat"),
  },
  {
    domainKey: "ressources-humaines",
    domainLabelFr: "Ressources Humaines",
    domainLabelEn: "Human Resources",
    slug: "ressources-humaines",
    htmlUrl: buildUrl("/catalogues-domaines-assets/ressources-humaines/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/ressources-humaines/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/ressources-humaines/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/ressources-humaines"),
  },
  {
    domainKey: "marketing-et-communication",
    domainLabelFr: "Marketing & Communication",
    domainLabelEn: "Marketing & Communication",
    slug: "marketing-et-communication",
    htmlUrl: buildUrl("/catalogues-domaines-assets/marketing-et-communication/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/marketing-et-communication/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/marketing-et-communication/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/marketing-et-communication"),
  },
  {
    domainKey: "finance-et-comptabilite",
    domainLabelFr: "Finance & Comptabilite",
    domainLabelEn: "Finance & Accounting",
    slug: "finance-et-comptabilite",
    htmlUrl: buildUrl("/catalogues-domaines-assets/finance-et-comptabilite/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/finance-et-comptabilite/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/finance-et-comptabilite/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/finance-et-comptabilite"),
  },
  {
    domainKey: "juridique-et-conformite",
    domainLabelFr: "Juridique & Conformite",
    domainLabelEn: "Legal & Compliance",
    slug: "juridique-et-conformite",
    htmlUrl: buildUrl("/catalogues-domaines-assets/juridique-et-conformite/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/juridique-et-conformite/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/juridique-et-conformite/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/juridique-et-conformite"),
  },
  {
    domainKey: "service-client",
    domainLabelFr: "Service Client",
    domainLabelEn: "Customer Service",
    slug: "service-client",
    htmlUrl: buildUrl("/catalogues-domaines-assets/service-client/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/service-client/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/service-client/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/service-client"),
  },
  {
    domainKey: "data-analyse",
    domainLabelFr: "Data & Analyse",
    domainLabelEn: "Data & Analytics",
    slug: "data-analyse",
    htmlUrl: buildUrl("/catalogues-domaines-assets/data-analyse/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/data-analyse/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/data-analyse/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/data-analyse"),
  },
  {
    domainKey: "administration-et-gestion",
    domainLabelFr: "Administration & Gestion",
    domainLabelEn: "Administration & Operations",
    slug: "administration-et-gestion",
    htmlUrl: buildUrl("/catalogues-domaines-assets/administration-et-gestion/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/administration-et-gestion/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/administration-et-gestion/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/administration-et-gestion"),
  },
  {
    domainKey: "management-et-leadership",
    domainLabelFr: "Management & Leadership",
    domainLabelEn: "Management & Leadership",
    slug: "management-et-leadership",
    htmlUrl: buildUrl("/catalogues-domaines-assets/management-et-leadership/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/management-et-leadership/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/management-et-leadership/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/management-et-leadership"),
  },
  {
    domainKey: "it-et-transformation-digitale",
    domainLabelFr: "IT & Transformation Digitale",
    domainLabelEn: "IT & Digital Transformation",
    slug: "it-et-transformation-digitale",
    htmlUrl: buildUrl("/catalogues-domaines-assets/it-et-transformation-digitale/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/it-et-transformation-digitale/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/it-et-transformation-digitale/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/it-et-transformation-digitale"),
  },
  {
    domainKey: "formation-et-pedagogie",
    domainLabelFr: "Formation & Pedagogie",
    domainLabelEn: "Learning & Instructional Design",
    slug: "formation-et-pedagogie",
    htmlUrl: buildUrl("/catalogues-domaines-assets/formation-et-pedagogie/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/formation-et-pedagogie/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/formation-et-pedagogie/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/formation-et-pedagogie"),
  },
  {
    domainKey: "sante-et-bien-etre",
    domainLabelFr: "Sante & Bien-etre",
    domainLabelEn: "Health & Workplace Well-being",
    slug: "sante-et-bien-etre",
    htmlUrl: buildUrl("/catalogues-domaines-assets/sante-et-bien-etre/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/sante-et-bien-etre/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/sante-et-bien-etre/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/sante-et-bien-etre"),
  },
  {
    domainKey: "diplomatie-et-affaires-internationales",
    domainLabelFr: "Diplomatie & Affaires Internationales",
    domainLabelEn: "Diplomacy & International Affairs",
    slug: "diplomatie-et-affaires-internationales",
    htmlUrl: buildUrl("/catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.html"),
    pdfUrl: buildUrl("/catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.pdf"),
    docxUrl: buildUrl("/catalogues-domaines-assets/diplomatie-et-affaires-internationales/catalogue.docx"),
    pageUrl: buildUrl("/catalogues-domaines/diplomatie-et-affaires-internationales"),
  },
];

const normalize = (value?: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const domainAliasMap: Record<string, string> = {
  "assistanat": "assistanat-et-secretariat",
  "secretariat": "assistanat-et-secretariat",
  "assistant-de-direction": "assistanat-et-secretariat",
  "executive-assistance": "assistanat-et-secretariat",
  "executive-support": "assistanat-et-secretariat",
  "rh": "ressources-humaines",
  "hr": "ressources-humaines",
  "ressource-humaine": "ressources-humaines",
  "ressources-humaines": "ressources-humaines",
  "human-resources": "ressources-humaines",
  "marketing": "marketing-et-communication",
  "communication": "marketing-et-communication",
  "marketing-communication": "marketing-et-communication",
  "finance": "finance-et-comptabilite",
  "comptabilite": "finance-et-comptabilite",
  "finance-comptabilite": "finance-et-comptabilite",
  "accounting": "finance-et-comptabilite",
  "legal": "juridique-et-conformite",
  "juridique": "juridique-et-conformite",
  "conformite": "juridique-et-conformite",
  "compliance": "juridique-et-conformite",
  "service-client": "service-client",
  "customer-service": "service-client",
  "support-client": "service-client",
  "data": "data-analyse",
  "analyse": "data-analyse",
  "data-analyse": "data-analyse",
  "analytics": "data-analyse",
  "administration": "administration-et-gestion",
  "gestion": "administration-et-gestion",
  "operations": "administration-et-gestion",
  "leadership": "management-et-leadership",
  "management": "management-et-leadership",
  "manager": "management-et-leadership",
  "it": "it-et-transformation-digitale",
  "info": "it-et-transformation-digitale",
  "informatique": "it-et-transformation-digitale",
  "transformation-digitale": "it-et-transformation-digitale",
  "digital-transformation": "it-et-transformation-digitale",
  "formation": "formation-et-pedagogie",
  "pedagogie": "formation-et-pedagogie",
  "learning": "formation-et-pedagogie",
  "instructional-design": "formation-et-pedagogie",
  "sante": "sante-et-bien-etre",
  "bien-etre": "sante-et-bien-etre",
  "health": "sante-et-bien-etre",
  "wellbeing": "sante-et-bien-etre",
  "diplomatie": "diplomatie-et-affaires-internationales",
  "affaires-internationales": "diplomatie-et-affaires-internationales",
  "international-affairs": "diplomatie-et-affaires-internationales",
  "diplomacy": "diplomatie-et-affaires-internationales",
};

const domainKeywordMap: Array<{ domainKey: string; keywords: string[] }> = [
  { domainKey: "assistanat-et-secretariat", keywords: ["assistanat", "secretariat", "assistant", "executive-support"] },
  { domainKey: "ressources-humaines", keywords: ["ressources-humaines", "ressource-humaine", "human-resources", "rh", "hr"] },
  { domainKey: "marketing-et-communication", keywords: ["marketing", "communication", "content", "brand"] },
  { domainKey: "finance-et-comptabilite", keywords: ["finance", "comptabilite", "accounting", "audit-financier"] },
  { domainKey: "juridique-et-conformite", keywords: ["juridique", "conformite", "legal", "compliance", "rgpd"] },
  { domainKey: "service-client", keywords: ["service-client", "support-client", "customer-service", "cx"] },
  { domainKey: "data-analyse", keywords: ["data", "analyse", "analytics", "dashboard", "bi"] },
  { domainKey: "administration-et-gestion", keywords: ["administration", "gestion", "operations", "operationnel"] },
  { domainKey: "management-et-leadership", keywords: ["management", "leadership", "manager", "dirigeant"] },
  { domainKey: "it-et-transformation-digitale", keywords: ["it", "info", "informatique", "transformation-digitale", "digital", "tech"] },
  { domainKey: "formation-et-pedagogie", keywords: ["formation", "pedagogie", "learning", "lms"] },
  { domainKey: "sante-et-bien-etre", keywords: ["sante", "bien-etre", "health", "wellbeing", "qvt"] },
  { domainKey: "diplomatie-et-affaires-internationales", keywords: ["diplomatie", "affaires-internationales", "diplomacy", "international"] },
];

const findByKey = (domainKey: string) =>
  domainCatalogueAssets.find((item) => item.domainKey === domainKey) ?? null;

export const resolveDomainCatalogueAsset = (...values: Array<string | null | undefined>) => {
  const normalizedCandidates = values
    .map((value) => normalize(value))
    .filter((value) => value.length > 0);

  if (!normalizedCandidates.length) {
    return null;
  }

  for (const normalized of normalizedCandidates) {
    const directMatch = domainCatalogueAssets.find((item) =>
      [item.domainKey, item.domainLabelFr, item.domainLabelEn, item.slug]
        .map((candidate) => normalize(candidate))
        .includes(normalized)
    );

    if (directMatch) {
      return directMatch;
    }

    const aliasMatch = domainAliasMap[normalized];

    if (aliasMatch) {
      return findByKey(aliasMatch);
    }
  }

  for (const normalized of normalizedCandidates) {
    for (const keywordEntry of domainKeywordMap) {
      if (keywordEntry.keywords.some((keyword) => normalized.includes(keyword))) {
        return findByKey(keywordEntry.domainKey);
      }
    }
  }

  return null;
};
