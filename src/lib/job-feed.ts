export type JobOpportunity = {
  id: string;
  slug: string;
  title: string;
  summaryFr: string;
  summaryEn: string;
  marketKey: "cote-divoire" | "africa" | "international";
  sourceName: string;
  sourceUrl: string | null;
  applyUrl: string | null;
  locationFr: string;
  locationEn: string;
  workMode: "remote" | "hybrid" | "onsite";
  opportunityType: "job" | "freelance" | "mission" | "internship";
  compensationLabel: string | null;
  publishedAt: string;
  isFeatured: boolean;
  isNewManual: boolean;
};

export const jobFeedFallback: JobOpportunity[] = [];

export const sortJobFeed = (items: JobOpportunity[]) =>
  [...items].sort((left, right) => {
    const featuredDelta = Number(right.isFeatured) - Number(left.isFeatured);

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });

