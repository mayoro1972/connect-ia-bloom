import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { resourceFeedFallback, sortResourceFeed, type ResourceFeedItem } from "@/lib/resource-feed";
import type { Tables } from "@/integrations/supabase/types";

type ResourcePostRow = Tables<"resource_posts">;

const mapResourceRow = (row: ResourcePostRow): ResourceFeedItem => ({
  id: row.id,
  slug: row.slug,
  categoryKey: row.category_key as ResourceFeedItem["categoryKey"],
  sectorKey: row.sector_key,
  titleFr: row.title_fr,
  titleEn: row.title_en,
  excerptFr: row.excerpt_fr,
  excerptEn: row.excerpt_en,
  readTimeMinutes: row.read_time_minutes,
  publishedAt: row.published_at,
  sourceName: row.source_name,
  sourceUrl: row.source_url,
  tags: row.tags ?? [],
  isFeatured: row.is_featured,
  isNewManual: row.is_new_manual,
});

const mergeWithFallbackResources = (dynamicItems: ResourceFeedItem[]) => {
  const seenSlugs = new Set(dynamicItems.map((item) => item.slug));
  const missingFallbackItems = resourceFeedFallback.filter((item) => !seenSlugs.has(item.slug));

  return sortResourceFeed([...dynamicItems, ...missingFallbackItems]);
};

export function useResourceFeed() {
  const [items, setItems] = useState<ResourceFeedItem[]>(sortResourceFeed(resourceFeedFallback));
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    let isCancelled = false;

    if (!isSupabaseConfigured) {
      setItems(sortResourceFeed(resourceFeedFallback));
      setIsLoading(false);
      return;
    }

    const loadResources = async () => {
      setIsLoading(true);

      const { data, error } = await (supabase as any)
        .from("resource_posts")
        .select(
          "id, slug, category_key, sector_key, title_fr, title_en, excerpt_fr, excerpt_en, read_time_minutes, published_at, source_name, source_url, tags, is_featured, is_new_manual",
        )
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false });

      if (isCancelled) {
        return;
      }

      if (error || !data || data.length === 0) {
        setItems(sortResourceFeed(resourceFeedFallback));
        setIsLoading(false);
        return;
      }

      setItems(mergeWithFallbackResources(data.map(mapResourceRow)));
      setIsLoading(false);
    };

    loadResources();

    return () => {
      isCancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      items,
      isLoading,
      hasDynamicSource: isSupabaseConfigured,
    }),
    [items, isLoading],
  );
}
