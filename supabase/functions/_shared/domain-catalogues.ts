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
    domainLabelFr: "Assistanat & Secretariat",
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

export const resolveDomainCatalogueAsset = (domain?: string | null) => {
  const normalized = normalize(domain);

  if (!normalized) {
    return null;
  }

  return (
    domainCatalogueAssets.find((item) =>
      [item.domainKey, item.domainLabelFr, item.domainLabelEn, item.slug]
        .map((candidate) => normalize(candidate))
        .includes(normalized)
    ) ?? null
  );
};
