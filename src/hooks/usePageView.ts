import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    const trackView = async () => {
      await supabase.rpc("track_page_view", {
        page_path_input: location.pathname,
      });
    };

    trackView();
  }, [location.pathname]);
};
