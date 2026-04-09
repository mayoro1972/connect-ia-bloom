import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      trackAnalyticsEvent("page_view", {
        page_path: location.pathname,
        page_title: document.title,
      });
    }, 0);

    const trackView = async () => {
      if (!isSupabaseConfigured) {
        return;
      }

      try {
        await supabase.rpc("track_page_view", {
          page_path_input: location.pathname,
        });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("Unable to track page view", error);
        }
      }
    };

    trackView();

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);
};
