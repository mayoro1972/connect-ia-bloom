import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import {
  getFallbackResourcePostBySlug,
  type ResourcePost,
  type ResourceSource,
} from "@/lib/resource-feed";

type ResourcePostRow = Tables<"resource_posts">;

const isObjectRecord = (value: Json): value is Record<string, Json> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseSources = (value: Json | null): ResourceSource[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObjectRecord)
    .map((item) => {
      const label = typeof item.label === "string" ? item.label.trim() : "";
      const url = typeof item.url === "string" ? item.url.trim() : "";
      const publisher = typeof item.publisher === "string" ? item.publisher.trim() : null;
      const publishedAt = typeof item.published_at === "string" ? item.published_at.trim() : null;

      if (!label || !url) {
        return null;
      }

      return {
        label,
        url,
        publisher,
        publishedAt,
      };
    })
    .filter((item): item is ResourceSource => Boolean(item));
};

const mapResourceRow = (row: ResourcePostRow): ResourcePost => ({
  id: row.id,
  slug: row.slug,
  categoryKey: row.category_key as ResourcePost["categoryKey"],
  sectorKey: row.sector_key,
  titleFr: row.title_fr,
  titleEn: row.title_en,
  excerptFr: row.excerpt_fr,
  excerptEn: row.excerpt_en,
  contentFr: row.content_fr,
  contentEn: row.content_en,
  readTimeMinutes: row.read_time_minutes,
  publishedAt: row.published_at,
  sourceName: row.source_name,
  sourceUrl: row.source_url,
  tags: row.tags ?? [],
  isFeatured: row.is_featured,
  isNewManual: row.is_new_manual,
  sources: parseSources(row.sources_json),
  seoTitleFr: row.seo_title_fr,
  seoTitleEn: row.seo_title_en,
  seoDescriptionFr: row.seo_description_fr,
  seoDescriptionEn: row.seo_description_en,
  coverImageUrl: row.cover_image_url,
});

export function useResourcePost(slug?: string) {
  const fallbackPost = getFallbackResourcePostBySlug(slug);
  const [item, setItem] = useState<ResourcePost | null>(fallbackPost);
  const [isLoading, setIsLoading] = useState(Boolean(slug) && isSupabaseConfigured);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (!slug) {
      setItem(null);
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setItem(fallbackPost);
      setNotFound(!fallbackPost);
      setIsLoading(false);
      return;
    }

    const loadResource = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("resource_posts")
        .select("*")
        .eq("status", "published")
        .eq("slug", slug)
        .maybeSingle();

      if (isCancelled) {
        return;
      }

      if (error || !data) {
        setItem(fallbackPost);
        setNotFound(!fallbackPost);
        setIsLoading(false);
        return;
      }

      setItem(mapResourceRow(data));
      setNotFound(false);
      setIsLoading(false);
    };

    loadResource();

    return () => {
      isCancelled = true;
    };
  }, [fallbackPost, slug]);

  return useMemo(
    () => ({
      item,
      isLoading,
      notFound,
    }),
    [item, isLoading, notFound],
  );
}
