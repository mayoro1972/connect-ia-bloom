import { slugifySiteValue } from "@/lib/site-links";

export const blogSectorSlugMap: Record<string, string> = {
  "IT & Transformation Digitale": "it-transformation-digitale",
  "Finance & Fintech": "finance-fintech",
  "Agriculture & AgroTech IA": "agriculture-agrotech",
  "Éducation & EdTech IA": "education-edtech",
  "Santé & IA médicale": "sante-ia-medicale",
  "Logistique & Supply Chain": "logistique-supply-chain",
  "Énergie & Transition énergétique": "energie-transition-energetique",
  "RH & Gestion des talents": "rh-gestion-talents",
  "Marketing & Communication IA": "marketing-communication-ia",
  "Droit & LegalTech IA": "droit-legaltech-ia",
  "Immobilier & Smart City": "immobilier-smart-city",
  "Tourisme & Hospitalité": "tourisme-hospitalite",
  "Médias & Création de contenu": "medias-creation-contenu",
};

export const preferredBlogSectorOrder = Object.keys(blogSectorSlugMap);

export const resolveBlogSectorLabel = (
  sector: string | null | undefined,
  translate: (key: string) => string,
) => {
  if (!sector) {
    return null;
  }

  const translated = translate(`catalogue.domains.${sector}`);
  return translated !== `catalogue.domains.${sector}` ? translated : sector;
};

export const sortBlogSectors = (sectors: string[]) =>
  [...sectors].sort((left, right) => {
    const leftIndex = preferredBlogSectorOrder.indexOf(left);
    const rightIndex = preferredBlogSectorOrder.indexOf(right);

    if (leftIndex === -1 && rightIndex === -1) {
      return left.localeCompare(right);
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });

export const getBlogSectorSlug = (sector: string) =>
  blogSectorSlugMap[sector] ?? slugifySiteValue(sector);

export const getAvailableBlogSectors = (sectors: Array<string | null>) =>
  sortBlogSectors(
    Array.from(
      new Map(
        sectors
          .filter((sector): sector is string => Boolean(sector))
          .map((sector) => [getBlogSectorSlug(sector), sector]),
      ).values(),
    ),
  );

export const resolveBlogSectorFromSlug = (items: Array<{ sectorKey: string | null }>, slug?: string | null) => {
  if (!slug) {
    return null;
  }

  const sectors = getAvailableBlogSectors(items.map((item) => item.sectorKey));
  return sectors.find((sector) => getBlogSectorSlug(sector) === slug) ?? null;
};
