import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    const trackView = async () => {
      try {
        await supabase.from("page_views").insert({
          page_path: location.pathname,
        });
      } catch (error) {
        // Silently fail - don't break the app for analytics
        console.error("Failed to track page view:", error);
      }
    };

    trackView();
  }, [location.pathname]);
};
