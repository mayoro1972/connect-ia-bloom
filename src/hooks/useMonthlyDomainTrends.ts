import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MonthlyDomainTrend = {
  id: string;
  trend_month: string;
  rank: number;
  domain_key: string;
  badge_label_fr: string;
  badge_label_en: string;
  target_sectors_fr: string[];
  target_sectors_en: string[];
  justification_fr: string | null;
  justification_en: string | null;
  webinar_url: string | null;
};

/**
 * Fetches the most recent monthly ranking of the 3 most in-demand domains.
 * Returns null while loading; falls back to empty array if nothing published yet.
 */
export const useMonthlyDomainTrends = () => {
  const [trends, setTrends] = useState<MonthlyDomainTrend[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTrends = async () => {
      // Cast to any: the new monthly_domain_trends table is not yet in the generated types.
      const client = supabase as unknown as {
        from: (table: string) => {
          select: (cols: string) => {
            eq: (col: string, val: string) => {
              order: (col: string, opts: { ascending: boolean }) => {
                order: (col: string, opts: { ascending: boolean }) => {
                  limit: (n: number) => Promise<{ data: MonthlyDomainTrend[] | null; error: unknown }>;
                };
              };
            };
          };
        };
      };
      const { data, error } = await client
        .from("monthly_domain_trends")
        .select(
          "id, trend_month, rank, domain_key, badge_label_fr, badge_label_en, target_sectors_fr, target_sectors_en, justification_fr, justification_en, webinar_url",
        )
        .eq("status", "published")
        .order("trend_month", { ascending: false })
        .order("rank", { ascending: true })
        .limit(20);

      if (cancelled) return;
      if (error || !data || data.length === 0) {
        setTrends([]);
        return;
      }
      // Keep only the latest month
      const latestMonth = data[0].trend_month;
      setTrends(data.filter((row) => row.trend_month === latestMonth) as MonthlyDomainTrend[]);
    };
    fetchTrends();
    return () => {
      cancelled = true;
    };
  }, []);

  return trends;
};
