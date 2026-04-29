import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { socialLinks } from "@/lib/site-links";

export type SocialVideoItem = {
  id: string;
  platform: "tiktok" | "youtube" | "instagram" | "shorts";
  slug: string;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  ctaLabelFr: string;
  ctaLabelEn: string;
  ctaUrl: string | null;
  frequencyLabelFr: string;
  frequencyLabelEn: string;
  sortOrder: number;
  isFeatured: boolean;
  publishedAt: string;
};

type SocialVideoRow = {
  id: string;
  platform: string;
  slug: string;
  title_fr: string;
  title_en: string;
  summary_fr: string;
  summary_en: string;
  video_url: string;
  thumbnail_url: string | null;
  cta_label_fr: string | null;
  cta_label_en: string | null;
  cta_url: string | null;
  frequency_label_fr: string;
  frequency_label_en: string;
  sort_order: number;
  is_featured: boolean;
  published_at: string;
};

const tiktokProfileUrl =
  socialLinks.find((link) => link.label === "TikTok")?.href ?? "https://www.tiktok.com/@transfer_ai_africa";

const videoFallback: SocialVideoItem[] = [
  {
    id: "fallback-tiktok-featured",
    platform: "tiktok",
    slug: "tiktok-lancement-transferai-webinaire-ia",
    titleFr: "Lancement TransferAI Côte d'Ivoire & webinaire IA",
    titleEn: "TransferAI Côte d'Ivoire launch & AI webinar",
    summaryFr:
      "Une capsule TikTok pour découvrir le lancement de TransferAI en Côte d'Ivoire et rejoindre le webinaire IA gratuit destiné aux professionnels, étudiants et entrepreneurs.",
    summaryEn:
      "A TikTok capsule introducing TransferAI Côte d'Ivoire and inviting professionals, students, and entrepreneurs to join the free AI webinar.",
    videoUrl: "https://www.tiktok.com/@transfer_ai_africa/video/7633069888805915912",
    thumbnailUrl: null,
    ctaLabelFr: "Voir la capsule",
    ctaLabelEn: "Watch the clip",
    ctaUrl: "https://www.tiktok.com/@transfer_ai_africa/video/7633069888805915912",
    frequencyLabelFr: "5 capsules / semaine",
    frequencyLabelEn: "5 clips / week",
    sortOrder: 1,
    isFeatured: true,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-tiktok-ia-pratique",
    platform: "tiktok",
    slug: "tiktok-ia-pratique-10-usages",
    titleFr: "IA pratique en Côte d'Ivoire : 10 usages concrets",
    titleEn: "Practical AI in Côte d'Ivoire: 10 practical use cases",
    summaryFr:
      "Une capsule courte pour montrer comment l'IA peut aider à gagner du temps, mieux s'organiser et produire plus vite, avec renvoi direct vers les ressources TransferAI.",
    summaryEn:
      "A short TikTok clip showing how AI can help people save time, get organised, and produce faster, with a direct path back to TransferAI resources.",
    videoUrl: "https://www.tiktok.com/@transfer_ai_africa/video/7632859962066226450",
    thumbnailUrl: null,
    ctaLabelFr: "Voir la capsule",
    ctaLabelEn: "Watch the clip",
    ctaUrl: "https://www.tiktok.com/@transfer_ai_africa/video/7632859962066226450",
    frequencyLabelFr: "5 capsules / semaine",
    frequencyLabelEn: "5 clips / week",
    sortOrder: 2,
    isFeatured: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

const normalizePlatform = (platform: string): SocialVideoItem["platform"] => {
  if (platform === "youtube" || platform === "instagram" || platform === "shorts") {
    return platform;
  }
  return "tiktok";
};

const mapVideoRow = (row: SocialVideoRow): SocialVideoItem => ({
  id: row.id,
  platform: normalizePlatform(row.platform),
  slug: row.slug,
  titleFr: row.title_fr,
  titleEn: row.title_en,
  summaryFr: row.summary_fr,
  summaryEn: row.summary_en,
  videoUrl: row.video_url,
  thumbnailUrl: row.thumbnail_url,
  ctaLabelFr: row.cta_label_fr || "Voir la capsule",
  ctaLabelEn: row.cta_label_en || "Watch the clip",
  ctaUrl: row.cta_url,
  frequencyLabelFr: row.frequency_label_fr,
  frequencyLabelEn: row.frequency_label_en,
  sortOrder: row.sort_order,
  isFeatured: row.is_featured,
  publishedAt: row.published_at,
});

const sortVideos = (items: SocialVideoItem[]) =>
  [...items].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return Number(b.isFeatured) - Number(a.isFeatured);
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

export function useSocialVideoFeed(platform: SocialVideoItem["platform"] = "tiktok") {
  const [items, setItems] = useState<SocialVideoItem[]>(sortVideos(videoFallback.filter((item) => item.platform === platform)));
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    let isCancelled = false;

    if (!isSupabaseConfigured) {
      setItems(sortVideos(videoFallback.filter((item) => item.platform === platform)));
      setIsLoading(false);
      return;
    }

    const loadVideos = async () => {
      setIsLoading(true);

      const { data, error } = await (supabase as any)
        .from("social_video_posts")
        .select(
          "id, platform, slug, title_fr, title_en, summary_fr, summary_en, video_url, thumbnail_url, cta_label_fr, cta_label_en, cta_url, frequency_label_fr, frequency_label_en, sort_order, is_featured, published_at",
        )
        .eq("status", "published")
        .eq("platform", platform)
        .order("is_featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false });

      if (isCancelled) return;

      if (error || !data || data.length === 0) {
        setItems(sortVideos(videoFallback.filter((item) => item.platform === platform)));
        setIsLoading(false);
        return;
      }

      setItems(sortVideos((data as SocialVideoRow[]).map(mapVideoRow)));
      setIsLoading(false);
    };

    loadVideos();

    return () => {
      isCancelled = true;
    };
  }, [platform]);

  return useMemo(
    () => ({
      items,
      featured: items[0] ?? null,
      isLoading,
    }),
    [items, isLoading],
  );
}
