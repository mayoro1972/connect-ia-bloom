export type ResourceCategoryKey = "expertise-ai" | "guides" | "case-studies" | "veille";

export type ResourceSource = {
  label: string;
  url: string;
  publisher?: string | null;
  publishedAt?: string | null;
};

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

export type ResourcePost = ResourceFeedItem & {
  contentFr: string | null;
  contentEn: string | null;
  sources: ResourceSource[];
  seoTitleFr: string | null;
  seoTitleEn: string | null;
  seoDescriptionFr: string | null;
  seoDescriptionEn: string | null;
  coverImageUrl: string | null;
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

const buildFallbackContent = (item: ResourceFeedItem, language: "fr" | "en") => {
  if (language === "en") {
    return [
      item.excerptEn,
      `Why this matters now`,
      `TransferAI Africa curates this article to help professionals and organizations understand how AI changes ${item.sectorKey ?? "their sector"} in Côte d'Ivoire and across Africa.`,
      `What to do next`,
      `Use this resource as a starting point, then explore the related training paths, certification options, and consulting support available on the platform.`,
    ].join("\n\n");
  }

  return [
    item.excerptFr,
    `Pourquoi ce sujet compte maintenant`,
    `TransferAI Africa publie cette ressource pour aider les professionnels et les organisations à comprendre comment l'IA transforme ${item.sectorKey ?? "leur secteur"} en Côte d'Ivoire et en Afrique.`,
    `Quelle est la prochaine étape`,
    `Utilisez cet article comme point d'entrée, puis explorez les formations, la certification et les services liés à ce domaine sur la plateforme.`,
  ].join("\n\n");
};

export const resourcePostFallback: ResourcePost[] = resourceFeedFallback.map((item) => ({
  ...item,
  contentFr: buildFallbackContent(item, "fr"),
  contentEn: buildFallbackContent(item, "en"),
  sources:
    item.sourceUrl && item.sourceName
      ? [
          {
            label: item.sourceName,
            url: item.sourceUrl,
            publisher: item.sourceName,
          },
        ]
      : [],
  seoTitleFr: null,
  seoTitleEn: null,
  seoDescriptionFr: null,
  seoDescriptionEn: null,
  coverImageUrl: null,
}));

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

export const getFallbackResourcePostBySlug = (slug?: string | null) =>
  resourcePostFallback.find((item) => item.slug === slug) ?? null;
