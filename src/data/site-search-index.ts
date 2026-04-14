import type { Language } from "@/i18n/LanguageContext";
import { formations } from "@/data/formations";
import { domainPreviews } from "@/lib/catalogue-preview";
import { resourceFeedFallback } from "@/lib/resource-feed";
import { buildContactPath, directLinks } from "@/lib/site-links";

export type SearchEntryKind = "action" | "page" | "catalogue" | "formation" | "resource";

export type SearchEntry = {
  id: string;
  kind: SearchEntryKind;
  title: string;
  description: string;
  href: string;
  keywords: string[];
  priority: number;
};

const pageEntries = {
  fr: [
    {
      id: "page-home",
      kind: "page" as const,
      title: "Accueil",
      description: "Vue d'ensemble rapide de TransferAI Africa.",
      href: "/",
      keywords: ["home", "accueil", "transferai", "ia afrique"],
      priority: 100,
    },
    {
      id: "page-education",
      kind: "page" as const,
      title: "Éducation",
      description: "Choisir le bon format, le bon parcours ou la bonne certification.",
      href: "/education",
      keywords: ["education", "formation", "apprendre", "parcours", "certification"],
      priority: 94,
    },
    {
      id: "page-catalogue",
      kind: "page" as const,
      title: "Catalogue",
      description: "Explorer toutes les formations par domaine, niveau et format.",
      href: "/catalogue",
      keywords: ["catalogue", "formations", "cours", "domaines"],
      priority: 96,
    },
    {
      id: "page-paths",
      kind: "page" as const,
      title: "Parcours",
      description: "Trouver un chemin de progression adapté à votre profil.",
      href: "/parcours",
      keywords: ["parcours", "orientation", "progression", "profil"],
      priority: 90,
    },
    {
      id: "page-certification",
      kind: "page" as const,
      title: "Certification",
      description: "Découvrir la certification IA professionnelle par domaine.",
      href: "/certification",
      keywords: ["certification", "certificat", "professionnelle", "signature"],
      priority: 92,
    },
    {
      id: "page-enterprises",
      kind: "page" as const,
      title: "Entreprises",
      description: "Voir les services, audits et accompagnements pour les organisations.",
      href: "/entreprises",
      keywords: ["entreprises", "services", "accompagnement", "conseil", "audit"],
      priority: 95,
    },
    {
      id: "page-audit",
      kind: "page" as const,
      title: "Audit IA gratuit",
      description: "Identifier vos priorités IA avant d'investir.",
      href: "/audit-ia-gratuit",
      keywords: ["audit", "audit ia", "gratuit", "priorites ia"],
      priority: 98,
    },
    {
      id: "page-blog",
      kind: "page" as const,
      title: "Blog & veille",
      description: "Retrouver les analyses, guides et signaux IA utiles.",
      href: "/blog",
      keywords: ["blog", "veille", "guides", "ressources", "articles"],
      priority: 84,
    },
    {
      id: "page-tools",
      kind: "page" as const,
      title: "Outils IA",
      description: "Voir les outils recommandés par domaine et par usage.",
      href: "/outils-ia",
      keywords: ["outils ia", "tools", "workflow", "n8n", "make", "copilot"],
      priority: 82,
    },
    {
      id: "page-partners",
      kind: "page" as const,
      title: "Partenaires",
      description: "Référencement, visibilité et partenariats stratégiques.",
      href: "/partenaires",
      keywords: ["partenaires", "partenariat", "referencement", "visibilite"],
      priority: 80,
    },
    {
      id: "page-contact",
      kind: "page" as const,
      title: "Contact",
      description: "Parler à un expert IA, demander un catalogue ou une orientation.",
      href: "/contact",
      keywords: ["contact", "expert ia", "orientation", "demande"],
      priority: 88,
    },
    {
      id: "page-about",
      kind: "page" as const,
      title: "À propos",
      description: "Comprendre la vision, l'équipe et le positionnement du site.",
      href: "/a-propos",
      keywords: ["a propos", "equipe", "vision", "transferai africa"],
      priority: 72,
    },
    {
      id: "page-sitemap",
      kind: "page" as const,
      title: "Plan du site",
      description: "Accéder rapidement à toutes les grandes rubriques.",
      href: "/plan-du-site",
      keywords: ["plan du site", "navigation", "rubriques", "pages"],
      priority: 60,
    },
  ],
  en: [
    {
      id: "page-home",
      kind: "page" as const,
      title: "Home",
      description: "Quick overview of TransferAI Africa.",
      href: "/",
      keywords: ["home", "transferai", "africa", "ai"],
      priority: 100,
    },
    {
      id: "page-education",
      kind: "page" as const,
      title: "Education",
      description: "Choose the right format, path, or certification.",
      href: "/education",
      keywords: ["education", "training", "learning", "path", "certification"],
      priority: 94,
    },
    {
      id: "page-catalogue",
      kind: "page" as const,
      title: "Catalogue",
      description: "Explore all training options by domain, level, and format.",
      href: "/catalogue",
      keywords: ["catalogue", "training", "courses", "domains"],
      priority: 96,
    },
    {
      id: "page-paths",
      kind: "page" as const,
      title: "Paths",
      description: "Find the right progression path for your profile.",
      href: "/parcours",
      keywords: ["paths", "guidance", "progression", "profile"],
      priority: 90,
    },
    {
      id: "page-certification",
      kind: "page" as const,
      title: "Certification",
      description: "Discover the professional AI certification by domain.",
      href: "/certification",
      keywords: ["certification", "certificate", "professional", "signature"],
      priority: 92,
    },
    {
      id: "page-enterprises",
      kind: "page" as const,
      title: "Business services",
      description: "Review audits, advisory and enterprise services.",
      href: "/entreprises",
      keywords: ["business", "services", "advisory", "audit", "enterprise"],
      priority: 95,
    },
    {
      id: "page-audit",
      kind: "page" as const,
      title: "Free AI audit",
      description: "Clarify your AI priorities before investing.",
      href: "/audit-ia-gratuit",
      keywords: ["audit", "free ai audit", "priorities", "assessment"],
      priority: 98,
    },
    {
      id: "page-blog",
      kind: "page" as const,
      title: "Blog & insights",
      description: "Access AI analysis, guides and watch content.",
      href: "/blog",
      keywords: ["blog", "insights", "guides", "resources", "articles"],
      priority: 84,
    },
    {
      id: "page-tools",
      kind: "page" as const,
      title: "AI tools",
      description: "See recommended tools by domain and use case.",
      href: "/outils-ia",
      keywords: ["ai tools", "workflow", "n8n", "make", "copilot"],
      priority: 82,
    },
    {
      id: "page-partners",
      kind: "page" as const,
      title: "Partners",
      description: "Listing, visibility and strategic partnership options.",
      href: "/partenaires",
      keywords: ["partners", "partnership", "listing", "visibility"],
      priority: 80,
    },
    {
      id: "page-contact",
      kind: "page" as const,
      title: "Contact",
      description: "Speak with an AI expert, request a catalogue, or ask for guidance.",
      href: "/contact",
      keywords: ["contact", "ai expert", "guidance", "request"],
      priority: 88,
    },
    {
      id: "page-about",
      kind: "page" as const,
      title: "About",
      description: "Understand the vision, team and positioning of the site.",
      href: "/a-propos",
      keywords: ["about", "team", "vision", "transferai africa"],
      priority: 72,
    },
    {
      id: "page-sitemap",
      kind: "page" as const,
      title: "Sitemap",
      description: "Open all major sections quickly.",
      href: "/sitemap",
      keywords: ["sitemap", "navigation", "sections", "pages"],
      priority: 60,
    },
  ],
};

const actionEntries = {
  fr: [
    {
      id: "action-audit",
      kind: "action" as const,
      title: "Réserver un audit IA gratuit",
      description: "Prendre le point le plus rapide pour cadrer un besoin entreprise.",
      href: directLinks.auditLanding,
      keywords: ["audit ia gratuit", "audit", "rdv", "diagnostic"],
      priority: 120,
    },
    {
      id: "action-expert",
      kind: "action" as const,
      title: "Parler à un expert IA",
      description: "Décrire un besoin et être orienté vers la bonne suite.",
      href: buildContactPath("contact-devis"),
      keywords: ["expert ia", "parler", "contact", "besoin"],
      priority: 116,
    },
    {
      id: "action-catalogue",
      kind: "action" as const,
      title: "Demander un catalogue",
      description: "Recevoir le bon catalogue domaine sans parcourir tout le site.",
      href: buildContactPath("demande-catalogue"),
      keywords: ["catalogue", "brochure", "telecharger", "domaines"],
      priority: 110,
    },
    {
      id: "action-apply",
      kind: "action" as const,
      title: "Déposer une candidature",
      description: "Finaliser une demande d'inscription à une formation.",
      href: "/inscription",
      keywords: ["inscription", "candidature", "formation"],
      priority: 108,
    },
    {
      id: "action-partner",
      kind: "action" as const,
      title: "Demander un référencement",
      description: "Soumettre une demande de présence partenaire.",
      href: buildContactPath("demande-referencement"),
      keywords: ["referencement", "partenaire", "visibilite", "listing"],
      priority: 102,
    },
    {
      id: "action-whatsapp",
      kind: "action" as const,
      title: "Écrire sur WhatsApp",
      description: "Ouvrir un contact direct pour une question rapide.",
      href: directLinks.whatsapp,
      keywords: ["whatsapp", "contact direct", "message rapide"],
      priority: 96,
    },
  ],
  en: [
    {
      id: "action-audit",
      kind: "action" as const,
      title: "Book a free AI audit",
      description: "Start with the fastest enterprise scoping conversation.",
      href: directLinks.auditLanding,
      keywords: ["audit", "free ai audit", "diagnostic", "meeting"],
      priority: 120,
    },
    {
      id: "action-expert",
      kind: "action" as const,
      title: "Speak with an AI expert",
      description: "Describe your need and get directed to the right next step.",
      href: buildContactPath("contact-devis"),
      keywords: ["ai expert", "contact", "need", "support"],
      priority: 116,
    },
    {
      id: "action-catalogue",
      kind: "action" as const,
      title: "Request a catalogue",
      description: "Receive the right domain catalogue without browsing deeply.",
      href: buildContactPath("demande-catalogue"),
      keywords: ["catalogue", "brochure", "download", "domains"],
      priority: 110,
    },
    {
      id: "action-apply",
      kind: "action" as const,
      title: "Apply now",
      description: "Submit a registration request for a training program.",
      href: "/inscription",
      keywords: ["apply", "registration", "training"],
      priority: 108,
    },
    {
      id: "action-partner",
      kind: "action" as const,
      title: "Request a listing",
      description: "Submit a partner visibility request.",
      href: buildContactPath("demande-referencement"),
      keywords: ["listing", "partner", "visibility", "referencing"],
      priority: 102,
    },
    {
      id: "action-whatsapp",
      kind: "action" as const,
      title: "Chat on WhatsApp",
      description: "Open a direct contact for a quick question.",
      href: directLinks.whatsapp,
      keywords: ["whatsapp", "contact", "quick message"],
      priority: 96,
    },
  ],
};

export const buildSiteSearchIndex = (language: Language): SearchEntry[] => {
  const isEnglish = language === "en";
  const pages = pageEntries[isEnglish ? "en" : "fr"];
  const actions = actionEntries[isEnglish ? "en" : "fr"];

  const formationEntries: SearchEntry[] = formations.map((formation) => ({
    id: `formation-${formation.id}`,
    kind: "formation",
    title: isEnglish ? formation.titleEn : formation.title,
    description: isEnglish
      ? `${formation.metier} · ${formation.level} · ${formation.format}`
      : `${formation.metier} · ${formation.level} · ${formation.format}`,
    href: `/catalogue/${formation.id}`,
    keywords: [
      formation.title,
      formation.titleEn,
      formation.metier,
      formation.level,
      formation.format,
      ...formation.tags,
    ],
    priority: 70,
  }));

  const catalogueEntries: SearchEntry[] = domainPreviews.map((preview) => ({
    id: `catalogue-${preview.slug}`,
    kind: "catalogue",
    title: isEnglish ? `${preview.domain} catalogue` : `Catalogue ${preview.domain}`,
    description: isEnglish ? preview.headline : preview.headline,
    href: `/catalogues-domaines/${preview.slug}`,
    keywords: [
      preview.domain,
      preview.headline,
      preview.summary,
      ...preview.audience,
      ...preview.requestFocus,
    ],
    priority: 82,
  }));

  const resourceEntries: SearchEntry[] = resourceFeedFallback.map((resource) => ({
    id: `resource-${resource.id}`,
    kind: "resource",
    title: isEnglish ? resource.titleEn : resource.titleFr,
    description: isEnglish ? resource.excerptEn : resource.excerptFr,
    href: `/blog/${resource.slug}`,
    keywords: [
      resource.titleFr,
      resource.titleEn,
      resource.excerptFr,
      resource.excerptEn,
      resource.sectorKey ?? "",
      ...resource.tags,
    ],
    priority: resource.isFeatured ? 78 : 66,
  }));

  return [...actions, ...pages, ...catalogueEntries, ...formationEntries, ...resourceEntries];
};
