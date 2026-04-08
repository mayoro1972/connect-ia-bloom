export type ContactIntent = "demande-catalogue" | "demande-renseignement" | "contact-devis";
export type AppointmentSource = ContactIntent | "brochure";

export type SocialLink = {
  label: string;
  href: string;
  kind: "social" | "messaging" | "video";
};

const auditFormUrl =
  import.meta.env.VITE_AUDIT_FORM_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:4175/" : "/formulaire-audit-ia/");

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/transfert-ai-africa/", kind: "social" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61573275622415", kind: "social" },
  { label: "Instagram", href: "https://www.instagram.com/transferai.africa", kind: "social" },
  { label: "YouTube", href: "https://www.youtube.com/@transferai-africa", kind: "video" },
  { label: "X / Twitter", href: "https://x.com/transferai_afr", kind: "social" },
  { label: "TikTok", href: "https://www.tiktok.com/@transferai.africa", kind: "video" },
  { label: "Telegram", href: "https://t.me/transferaiafrica", kind: "messaging" },
  { label: "WhatsApp", href: "https://wa.me/225071657733990", kind: "messaging" },
];

export const directLinks = {
  email: "mailto:contact@transferai.ci?subject=Contact%20TransferAI%20Africa",
  phone: "tel:+225071657733990",
  whatsapp: "https://wa.me/225071657733990",
  appointment: "/prise-rdv",
  auditForm: auditFormUrl,
  calendlyBooking: "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  map: "https://www.google.com/maps/search/?api=1&query=Nettelecomci%2C+Residence+de+la+Paix%2C+Riviera+3%2C+carrefour+Sainte+Famille%2C+Abidjan%2C+Cote+d%27Ivoire",
};

export const appointmentBookings: Record<AppointmentSource, string> = {
  "contact-devis": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  "demande-catalogue": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  "demande-renseignement": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
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
  assistanat: "Assistanat & Secretariat",
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

export const slugifySiteValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " et ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

export const buildContactPath = (intent: ContactIntent, domain?: string) => {
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
