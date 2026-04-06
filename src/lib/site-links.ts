export type ContactIntent = "demande-catalogue" | "demande-renseignement" | "contact-devis";
export type AppointmentSource = ContactIntent | "brochure";

export type SocialLink = {
  label: string;
  href: string;
  kind: "social" | "messaging" | "video";
};

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/transferai-africa", kind: "social" },
  { label: "Facebook", href: "https://www.facebook.com/transferai.africa", kind: "social" },
  { label: "Instagram", href: "https://www.instagram.com/transferai.africa", kind: "social" },
  { label: "YouTube", href: "https://www.youtube.com/@transferai-africa", kind: "video" },
  { label: "X", href: "https://x.com/transferai_afr", kind: "social" },
  { label: "TikTok", href: "https://www.tiktok.com/@transferai.africa", kind: "video" },
  { label: "Threads", href: "https://www.threads.net/@transferai.africa", kind: "social" },
  { label: "Telegram", href: "https://t.me/transferaiafrica", kind: "messaging" },
  { label: "WhatsApp", href: "https://wa.me/225071657733990", kind: "messaging" },
];

export const directLinks = {
  email: "mailto:contact@transferai.ci",
  phone: "tel:+225071657733990",
  whatsapp: "https://wa.me/225071657733990",
  appointment: "/prise-rdv",
  calendlyBooking: "https://calendly.com/marius-ayoro70/catalogue-discovery-call",
  map: "https://www.google.com/maps/search/?api=1&query=Nettelecomci%2C+Residence+de+la+Paix%2C+Riviera+3%2C+carrefour+Sainte+Famille%2C+Abidjan%2C+Cote+d%27Ivoire",
};

export const appointmentBookings: Record<AppointmentSource, string> = {
  "demande-catalogue": "https://calendly.com/marius-ayoro70/catalogue-discovery-call",
  "demande-renseignement": "https://calendly.com/marius-ayoro70/needs-qualification-call",
  "contact-devis": "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
  brochure: "https://calendly.com/marius-ayoro70/catalogue-discovery-call",
};

export const contactDetails = {
  email: "contact@transferai.ci",
  phoneDisplay: "+225 071657733990",
  phoneDigits: "+225071657733990",
  whatsappDisplay: "+225 071657733990",
  whatsappDigits: "225071657733990",
  addressShort: "Riviera 3, carrefour Sainte Famille, Abidjan, Cote d'Ivoire",
  addressFull: "Nettelecomci, Residence de la Paix, Riviera 3, carrefour Sainte Famille, Abidjan, Cote d'Ivoire",
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
