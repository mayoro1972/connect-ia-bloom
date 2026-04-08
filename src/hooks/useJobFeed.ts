import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { jobFeedFallback, sortJobFeed, type JobOpportunity } from "@/lib/job-feed";
import type { Tables } from "@/integrations/supabase/types";

type JobOpportunityRow = Tables<"job_opportunities">;

const mapJobRow = (row: JobOpportunityRow): JobOpportunity => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  summaryFr: row.summary_fr,
  summaryEn: row.summary_en,
  marketKey: row.market_key as JobOpportunity["marketKey"],
  sourceName: row.source_name,
  sourceUrl: row.source_url,
  applyUrl: row.apply_url,
  locationFr: row.location_fr,
  locationEn: row.location_en,
  workMode: row.work_mode as JobOpportunity["workMode"],
  opportunityType: row.opportunity_type as JobOpportunity["opportunityType"],
  compensationLabel: row.compensation_label,
  publishedAt: row.published_at,
  isFeatured: row.is_featured,
  isNewManual: row.is_new_manual,
});

export function useJobFeed() {
  const [items, setItems] = useState<JobOpportunity[]>(sortJobFeed(jobFeedFallback));
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    let isCancelled = false;

    if (!isSupabaseConfigured) {
      setItems(sortJobFeed(jobFeedFallback));
      setIsLoading(false);
      return;
    }

    const loadJobs = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("job_opportunities")
        .select(
          "id, slug, title, summary_fr, summary_en, market_key, source_name, source_url, apply_url, location_fr, location_en, work_mode, opportunity_type, compensation_label, published_at, is_featured, is_new_manual",
        )
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false });

      if (isCancelled) {
        return;
      }

      if (error || !data) {
        setItems(sortJobFeed(jobFeedFallback));
        setIsLoading(false);
        return;
      }

      setItems(sortJobFeed(data.map(mapJobRow)));
      setIsLoading(false);
    };

    loadJobs();

    return () => {
      isCancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      items,
      isLoading,
      stats: {
        total: items.length,
        coteDIvoire: items.filter((item) => item.marketKey === "cote-divoire").length,
        africa: items.filter((item) => item.marketKey === "africa").length,
        international: items.filter((item) => item.marketKey === "international").length,
      },
    }),
    [items, isLoading],
  );
}

