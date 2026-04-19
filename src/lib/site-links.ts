export type ContactIntent =
  | "demande-catalogue"
  | "demande-renseignement"
  | "contact-devis"
  | "demande-referencement";
export type AppointmentSource = ContactIntent | "demande-audit" | "brochure";

export type SocialLink = {
  label: string;
  href: string;
  kind: "social" | "messaging" | "video";
};

const auditRequestUrl =
  import.meta.env.VITE_AUDIT_REQUEST_URL ||
  "/demande-audit-gratuit";

const auditQuestionnaireUrl =
  import.meta.env.VITE_AUDIT_FORM_URL ||
  "/formulaire-audit-ia/index.html";

export const publicSiteUrl =
  (import.meta.env.VITE_PUBLIC_SITE_URL || "https://www.transferai.ci").replace(/\/$/, "");

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/transfert-ai-africa/", kind: "social" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61573275622415", kind: "social" },
  { label: "Instagram", href: "https://www.instagram.com/transferai.africa", kind: "social" },
  { label: "YouTube", href: "https://www.youtube.com/@transferai-africa", kind: "video" },
  { label: "X / Twitter", href: "https://x.com/AfricaAi89298", kind: "social" },
  { label: "TikTok", href: "https://www.tiktok.com/@transfer_ai_africa", kind: "video" },
  { label: "Telegram", href: "https://t.me/transferaiafrica", kind: "messaging" },
  { label: "WhatsApp", href: "https://wa.me/225071657733990", kind: "messaging" },
];

export const directLinks = {
  email: "mailto:contact@transferai.ci?subject=Contact%20TransferAI%20Africa",
  phone: "tel:+225071657733990",
  whatsapp: "https://wa.me/225071657733990",
  auditLanding: "/audit-ia-gratuit",
  appointment: "/prise-rdv",
  auditForm: auditRequestUrl,
  auditQuestionnaire: auditQuestionnaireUrl,
  calendlyBooking: "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  map: "https://www.google.com/maps/search/?api=1&query=Nettelecomci%2C+Residence+de+la+Paix%2C+Riviera+3%2C+carrefour+Sainte+Famille%2C+Abidjan%2C+Cote+d%27Ivoire",
};

export const appointmentBookings: Record<AppointmentSource, string> = {
  "contact-devis": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  "demande-catalogue": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  "demande-renseignement": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  "demande-referencement": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  "demande-audit": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  brochure: "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
};

export const contactDetails = {
  email: "contact@transferai.ci",
  phoneDisplay: "+225 071657733990",
  phoneDigits: "+225071657733990",
  whatsappDisplay: "+225 071657733990",
  whatsappDigits: "225071657733990",
  addressShort: "Riviera 3, carrefour Sainte Famille, Abidjan, Côte\u00A0d'Ivoire",
  addressFull: "Nettelecomci, Residence de la Paix, Riviera 3, carrefour Sainte Famille, Abidjan, Côte\u00A0d'Ivoire",
  mapsLabel: "Voir sur Google Maps",
};

export const metierKeyToDomain: Record<string, string> = {
  assistanat: "Assistanat & Secrétariat",
  rh: "Ressources Humaines",
  marketing: "Marketing & Communication",
  finance: "Finance & Comptabilite",
  juridique: "Juridique & Conformite",
  service: "Service Client",
  data: "Data & Analyse",
  admin: "Administration & Gestion",
  management: "Management & Leadership",
  it: "IT & Transformation Digitale",
  formation: "Formation & Pedagogie",
  sante: "Sante & Bien-etre",
  diplomatie: "Diplomatie & Affaires Internationales",
};

export const metierKeyToCatalogueSlug: Record<string, string> = {
  assistanat: "assistanat-et-secretariat",
  rh: "ressources-humaines",
  marketing: "marketing-et-communication",
  finance: "finance-et-comptabilite",
  juridique: "juridique-et-conformite",
  service: "service-client",
  data: "data-analyse",
  admin: "administration-et-gestion",
  management: "management-et-leadership",
  it: "it-et-transformation-digitale",
  formation: "formation-et-pedagogie",
  sante: "sante-et-bien-etre",
  diplomatie: "diplomatie-et-affaires-internationales",
};

export const metierKeyToCertificationSlug: Record<string, string> = {
  assistanat: "executive-support",
  rh: "human-resources",
  marketing: "marketing-communication",
  finance: "finance-accounting",
  juridique: "legal-compliance",
  service: "customer-service",
  data: "data-analytics",
  admin: "administration-operations",
  management: "management-leadership",
  it: "it-digital-transformation",
  formation: "learning-pedagogy",
  sante: "health-wellbeing",
  diplomatie: "diplomacy-international-affairs",
};

export const metierKeyToToolSlug: Record<string, string> = {
  assistanat: "assistanat-secretariat",
  rh: "ressources-humaines",
  marketing: "marketing-communication",
  finance: "finance-comptabilite",
  juridique: "juridique-conformite",
  service: "service-client",
  data: "data-analyse",
  admin: "administration-gestion",
  management: "management-leadership",
  it: "it-transformation-digitale",
  formation: "formation-pedagogie",
  sante: "sante-bien-etre",
  diplomatie: "diplomatie-affaires-internationales",
};

export const resolveCatalogueSlugFromSector = (sectorKey?: string | null) => {
  if (!sectorKey) {
    return null;
  }

  const normalizedTarget = slugifySiteValue(sectorKey);
  const matchedEntry = Object.entries(metierKeyToDomain).find(([, value]) => slugifySiteValue(value) === normalizedTarget);

  if (matchedEntry) {
    return metierKeyToCatalogueSlug[matchedEntry[0]];
  }

  return null;
};

const resolveMetierKeyFromSector = (sectorKey?: string | null) => {
  if (!sectorKey) {
    return null;
  }

  const normalizedTarget = slugifySiteValue(sectorKey);
  const matchedEntry = Object.entries(metierKeyToDomain).find(([, value]) => slugifySiteValue(value) === normalizedTarget);

  return matchedEntry?.[0] ?? null;
};

export const resolveCertificationSlugFromSector = (sectorKey?: string | null) => {
  const metierKey = resolveMetierKeyFromSector(sectorKey);
  return metierKey ? metierKeyToCertificationSlug[metierKey] : null;
};

export const resolveToolSlugFromSector = (sectorKey?: string | null) => {
  const metierKey = resolveMetierKeyFromSector(sectorKey);
  return metierKey ? metierKeyToToolSlug[metierKey] : null;
};

export const slugifySiteValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " et ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

export const buildContactPath = (intent: ContactIntent, domain?: string) => {
  // Intents avec page dédiée (formulaire compact + URL propre)
  if (intent === "demande-catalogue") {
    const params = new URLSearchParams();
    if (domain) params.set("domain", domain);
    const qs = params.toString();
    return qs ? `/demande-catalogue?${qs}` : "/demande-catalogue";
  }
  if (intent === "demande-renseignement") {
    const params = new URLSearchParams();
    if (domain) params.set("domain", domain);
    const qs = params.toString();
    return qs ? `/parler-expert-ia?${qs}` : "/parler-expert-ia";
  }

  const params = new URLSearchParams({ intent });

  if (domain) {
    params.set("domain", domain);
  }

  return `/contact?${params.toString()}`;
};

export const buildAppointmentPath = (source: string, domain?: string) => {
  const params = new URLSearchParams({ source });

  if (domain) {
    params.set("domain", domain);
  }

  return `/prise-rdv?${params.toString()}`;
};

export const buildAbsoluteSiteUrl = (path: string) => {
  if (!path) {
    return publicSiteUrl;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${publicSiteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

export const buildAbsoluteAppointmentUrl = (source: string, domain?: string, extras?: Record<string, string | null | undefined>) => {
  if (source === "demande-audit") {
    return appointmentBookings["demande-audit"];
  }

  const params = new URLSearchParams({ source });

  if (domain) {
    params.set("domain", domain);
  }

  if (extras) {
    Object.entries(extras).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim()) {
        params.set(key, value);
      }
    });
  }

  return `${publicSiteUrl}/prise-rdv?${params.toString()}`;
};
