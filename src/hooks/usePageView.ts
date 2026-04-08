import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const trackView = async () => {
      await supabase.rpc("track_page_view", {
        page_path_input: location.pathname,
      });
    };

    trackView();
  }, [location.pathname]);
};
