import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type PublicNewsletterIssue = Pick<
  Tables<"newsletter_issues">,
  | "id"
  | "issue_date"
  | "language"
  | "status"
  | "title"
  | "subject"
  | "preheader"
  | "intro"
  | "target_domains"
  | "highlight_title"
  | "highlight_summary"
  | "highlight_url"
  | "tip_title"
  | "tip_body"
  | "tool_name"
  | "tool_category"
  | "tool_summary"
  | "prompt_title"
  | "prompt_body"
  | "cta_label"
  | "cta_url"
  | "body_markdown"
  | "body_html"
  | "sent_at"
>;

const newsletterFallback: PublicNewsletterIssue[] = [];

export function useNewsletterIssues(language: "fr" | "en") {
  const [items, setItems] = useState<PublicNewsletterIssue[]>(newsletterFallback);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    let isCancelled = false;

    if (!isSupabaseConfigured) {
      setItems(newsletterFallback);
      setIsLoading(false);
      return;
    }

    const loadIssues = async () => {
      setIsLoading(true);

      const { data, error } = await (supabase as any)
        .from("newsletter_issues")
        .select(
          "id, issue_date, language, status, title, subject, preheader, intro, target_domains, highlight_title, highlight_summary, highlight_url, tip_title, tip_body, tool_name, tool_category, tool_summary, prompt_title, prompt_body, cta_label, cta_url, body_markdown, body_html, sent_at",
        )
        .eq("status", "sent")
        .eq("language", language)
        .order("issue_date", { ascending: false })
        .order("sent_at", { ascending: false })
        .limit(6);

      if (isCancelled) {
        return;
      }

      if (error || !data) {
        setItems(newsletterFallback);
        setIsLoading(false);
        return;
      }

      setItems(data as PublicNewsletterIssue[]);
      setIsLoading(false);
    };

    loadIssues();

    return () => {
      isCancelled = true;
    };
  }, [language]);

  return useMemo(
    () => ({
      items,
      featured: items[0] ?? null,
      isLoading,
      hasDynamicSource: isSupabaseConfigured,
    }),
    [items, isLoading],
  );
}
