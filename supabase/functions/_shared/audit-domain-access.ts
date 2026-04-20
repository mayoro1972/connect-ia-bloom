export type AuditDomainMatch = {
  title: string;
  domainKey: string;
  keywords: string[];
};

const normalize = (value?: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const auditDomains: AuditDomainMatch[] = [
  { title: "Assistanat & Secrétariat", domainKey: "assistanat-et-secretariat", keywords: ["assistanat", "secretariat", "assistant", "office manager", "support executif"] },
  { title: "Ressources Humaines", domainKey: "ressources-humaines", keywords: ["ressources humaines", "rh", "drh", "recrutement", "people", "human resources"] },
  { title: "Marketing & Communication", domainKey: "marketing-et-communication", keywords: ["marketing", "communication", "contenu", "growth", "marcom"] },
  { title: "Finance & Comptabilité", domainKey: "finance-et-comptabilite", keywords: ["finance", "comptabilite", "comptable", "controle", "audit interne"] },
  { title: "Juridique & Conformité", domainKey: "juridique-et-conformite", keywords: ["juridique", "compliance", "conformite", "dpo", "risques", "legal"] },
  { title: "Service client & relation client", domainKey: "service-client", keywords: ["service client", "relation client", "support client", "cx", "centre de contact", "customer support"] },
  { title: "Données & Analyse", domainKey: "data-analyse", keywords: ["donnees", "data", "analyse", "analytique", "business intelligence", "dashboard", "bi"] },
  { title: "Administration & Gestion", domainKey: "administration-et-gestion", keywords: ["administration", "gestion", "coordination", "operations", "operatoire", "operational"] },
  { title: "Management & Leadership", domainKey: "management-et-leadership", keywords: ["management", "leadership", "direction generale", "manager", "transformation", "direction"] },
  { title: "Systèmes d'information & Transformation digitale", domainKey: "it-et-transformation-digitale", keywords: ["systemes d'information", "systeme d'information", "it", "informatique", "transformation digitale", "dsi", "integration", "digitale", "digital"] },
  { title: "Formation & Pédagogie", domainKey: "formation-et-pedagogie", keywords: ["formation", "pedagogie", "academie", "lms", "apprenant", "teaching", "education"] },
  { title: "Santé, social & bien-être", domainKey: "sante-et-bien-etre", keywords: ["sante", "social", "bien-etre", "hse", "qvt", "prevention", "wellness", "health"] },
  { title: "Diplomatie & Affaires Internationales", domainKey: "diplomatie-et-affaires-internationales", keywords: ["diplomatie", "affaires internationales", "affaires publiques", "institutions", "international"] },
];

export const resolveAuditDomainAccess = (sector?: string | null) => {
  const normalized = normalize(sector);
  const matched =
    auditDomains.find((domain) => domain.keywords.some((keyword) => normalized.includes(normalize(keyword)))) ??
    null;

  return {
    normalized,
    matched,
    domainKey: matched?.domainKey ?? "",
    domainTitle: matched?.title ?? "Audit IA",
  };
};
