// Scrape les tendances business/IA en Côte d'Ivoire et Afrique de l'Ouest via Firecrawl
// Cible: actualités sectorielles, signaux de demande de formation/IA
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

// Sources prioritaires Côte d'Ivoire / Afrique de l'Ouest
const SCRAPE_QUERIES = [
  "tendances intelligence artificielle entreprises Côte d'Ivoire 2026",
  "transformation digitale secteur bancaire Afrique de l'Ouest",
  "formation IA cadres dirigeants Abidjan",
  "automatisation processus métiers Côte d'Ivoire",
  "data analyse PME Afrique francophone tendances",
  "cybersécurité entreprises Côte d'Ivoire enjeux",
  "marketing digital IA Afrique de l'Ouest 2026",
  "ressources humaines digitalisation Côte d'Ivoire",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY missing");
    if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Supabase env missing");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const allSignals: Array<{
      title: string;
      url: string;
      description: string;
      query: string;
    }> = [];

    for (const query of SCRAPE_QUERIES) {
      try {
        const res = await fetch(`${FIRECRAWL_V2}/search`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            limit: 5,
            lang: "fr",
            country: "ci",
            tbs: "qdr:m", // dernier mois
          }),
        });

        if (!res.ok) {
          console.error(`Firecrawl search failed for "${query}":`, res.status);
          continue;
        }

        const data = await res.json();
        const results = data?.data?.web ?? data?.data ?? [];
        for (const r of results) {
          if (r?.url && r?.title) {
            allSignals.push({
              title: r.title,
              url: r.url,
              description: r.description || r.snippet || "",
              query,
            });
          }
        }
      } catch (e) {
        console.error(`Error scraping query "${query}":`, e);
      }

      // Délai entre requêtes
      await new Promise((r) => setTimeout(r, 500));
    }

    // Stocker les signaux bruts dans content_signals
    const inserted: string[] = [];
    for (const sig of allSignals) {
      const { data, error } = await supabase
        .from("content_signals")
        .insert({
          title: sig.title,
          summary: sig.description,
          signal_url: sig.url,
          status: "live-format-trend",
          language: "fr",
          meta: { source_query: sig.query, source: "firecrawl-search" },
        })
        .select("id")
        .single();
      if (!error && data) inserted.push(data.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        signals_collected: allSignals.length,
        signals_stored: inserted.length,
        signal_ids: inserted,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("live-formats-scrape error:", e);
    return new Response(
      JSON.stringify({
        success: false,
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
