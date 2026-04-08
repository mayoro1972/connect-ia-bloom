export type ResourceCategoryKey = "expertise-ai" | "guides" | "case-studies" | "veille";

export type ResourceFeedItem = {
  id: string;
  slug: string;
  categoryKey: ResourceCategoryKey;
  sectorKey: string | null;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  readTimeMinutes: number | null;
  publishedAt: string;
  sourceName: string | null;
  sourceUrl: string | null;
  tags: string[];
  isFeatured: boolean;
  isNewManual: boolean;
};

export const RESOURCE_NEW_WINDOW_DAYS = 14;

export const resourceFeedFallback: ResourceFeedItem[] = [
  {
    id: "resource-assistant-africa",
    slug: "ia-assistants-direction-afrique",
    categoryKey: "expertise-ai",
    sectorKey: "Assistanat & Secrétariat",
    titleFr: "Comment l'IA révolutionne le métier d'assistant de direction en Afrique",
    titleEn: "How AI is transforming executive assistant roles across Africa",
    excerptFr: "Découvrez comment les outils d'IA transforment les tâches quotidiennes des assistants et secrétaires de direction.",
    excerptEn: "See how AI tools are reshaping the daily work of executive assistants and administrative professionals.",
    readTimeMinutes: 5,
    publishedAt: "2026-03-02T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["chatgpt", "productivite", "assistanat"],
    isFeatured: true,
    isNewManual: false,
  },
  {
    id: "resource-chatgpt-sme",
    slug: "chatgpt-entreprise-guide-pme-africaines",
    categoryKey: "guides",
    sectorKey: "Administration & Gestion",
    titleFr: "ChatGPT en entreprise : guide pratique pour les PME africaines",
    titleEn: "ChatGPT in business: a practical guide for African SMEs",
    excerptFr: "Un guide étape par étape pour intégrer ChatGPT dans vos processus d'entreprise, avec des cas d'usage concrets.",
    excerptEn: "A step-by-step guide to integrating ChatGPT into your business processes with concrete business use cases.",
    readTimeMinutes: 8,
    publishedAt: "2026-02-25T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["chatgpt", "pme", "processus"],
    isFeatured: true,
    isNewManual: false,
  },
  {
    id: "resource-recruitment-ci",
    slug: "recrutement-ia-drh-africains",
    categoryKey: "case-studies",
    sectorKey: "Ressources Humaines",
    titleFr: "Recrutement et IA : comment les DRH africains s'adaptent",
    titleEn: "Recruitment and AI: how African HR leaders are adapting",
    excerptFr: "Étude de cas sur l'utilisation de l'IA dans le recrutement au sein de grandes entreprises ivoiriennes.",
    excerptEn: "A case study on how major Ivorian companies are using AI in recruitment workflows.",
    readTimeMinutes: 6,
    publishedAt: "2026-02-18T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["rh", "recrutement", "cote-divoire"],
    isFeatured: false,
    isNewManual: false,
  },
  {
    id: "resource-roi-training",
    slug: "mesurer-roi-formation-ia-entreprise",
    categoryKey: "guides",
    sectorKey: "Management & Leadership",
    titleFr: "Mesurer le ROI de la formation IA en entreprise",
    titleEn: "Measuring the ROI of AI training in business",
    excerptFr: "Méthodologie et indicateurs clés pour évaluer l'impact de vos investissements en formation IA.",
    excerptEn: "Methodology and key indicators to assess the impact of your AI training investments.",
    readTimeMinutes: 7,
    publishedAt: "2026-02-10T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["roi", "formation", "management"],
    isFeatured: false,
    isNewManual: false,
  },
  {
    id: "resource-watch-africa",
    slug: "veille-ia-afrique-cote-divoire",
    categoryKey: "veille",
    sectorKey: "IT & Transformation Digitale",
    titleFr: "Veille IA Afrique : les signaux à suivre pour la Côte d'Ivoire",
    titleEn: "AI watch in Africa: signals worth tracking for Côte d'Ivoire",
    excerptFr: "Une veille éditoriale ciblée pour identifier les annonces, outils et usages IA qui peuvent avoir un impact concret sur les organisations ivoiriennes.",
    excerptEn: "A focused editorial watch to identify AI announcements, tools and use cases with concrete relevance for Ivorian organizations.",
    readTimeMinutes: 4,
    publishedAt: "2026-04-05T09:00:00.000Z",
    sourceName: "TransferAI Africa",
    sourceUrl: null,
    tags: ["veille", "afrique", "cote-divoire"],
    isFeatured: true,
    isNewManual: true,
  },
];

export const sortResourceFeed = (items: ResourceFeedItem[]) =>
  [...items].sort((left, right) => {
    const featuredDelta = Number(right.isFeatured) - Number(left.isFeatured);

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });

export const isResourceNew = (publishedAt: string, isNewManual = false) => {
  if (isNewManual) {
    return true;
  }

  const publishedTime = new Date(publishedAt).getTime();

  if (Number.isNaN(publishedTime)) {
    return false;
  }

  const now = Date.now();
  const diffInDays = (now - publishedTime) / (1000 * 60 * 60 * 24);

  return diffInDays >= 0 && diffInDays <= RESOURCE_NEW_WINDOW_DAYS;
};

