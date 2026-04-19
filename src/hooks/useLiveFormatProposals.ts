import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LiveFormatProposal = {
  id: string;
  format_type: "seminar" | "webinar";
  cycle_start_date: string;
  rank: number;
  title_fr: string;
  title_en: string;
  subtitle_fr: string | null;
  subtitle_en: string | null;
  description_fr: string | null;
  description_en: string | null;
  target_sectors_fr: string[];
  target_sectors_en: string[];
  target_audience_fr: string | null;
  target_audience_en: string | null;
  domain_key: string | null;
  agenda_fr: string[] | null;
  agenda_en: string[] | null;
  key_benefits_fr: string[] | null;
  key_benefits_en: string[] | null;
  scheduled_date: string | null;
  duration_minutes: number | null;
  format_label_fr: string | null;
  format_label_en: string | null;
  speaker_profile_fr: string | null;
  speaker_profile_en: string | null;
  trend_justification_fr: string | null;
  trend_justification_en: string | null;
  trend_score: number | null;
  status: string;
  published_at: string | null;
};

export const useLiveFormatProposals = () => {
  const [seminars, setSeminars] = useState<LiveFormatProposal[]>([]);
  const [webinars, setWebinars] = useState<LiveFormatProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        // Cast en `any` car la table est nouvelle et types.ts est auto-généré
        const sb = supabase as any;
        const { data, error } = await sb
          .from("live_format_proposals")
          .select("*")
          .eq("status", "published")
          .order("cycle_start_date", { ascending: false })
          .order("format_type", { ascending: true })
          .order("rank", { ascending: true })
          .limit(50);

        if (error) throw error;
        if (cancelled) return;

        const items = (data ?? []) as LiveFormatProposal[];
        const latestCycle = items[0]?.cycle_start_date;
        const current = latestCycle
          ? items.filter((i) => i.cycle_start_date === latestCycle)
          : items;

        setSeminars(current.filter((i) => i.format_type === "seminar"));
        setWebinars(current.filter((i) => i.format_type === "webinar"));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { seminars, webinars, loading, error };
};
