// Back-office: list/update/approve/publish/archive live format proposals
// Auth: x-admin-token header (réutilise le pattern existant du back-office)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const ADMIN_TOKEN = Deno.env.get("BACKOFFICE_ADMIN_TOKEN");

    if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Supabase env missing");

    // Vérification admin token (si configuré côté projet)
    if (ADMIN_TOKEN) {
      const provided = req.headers.get("x-admin-token");
      if (provided !== ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "list";

    if (req.method === "GET" || action === "list") {
      const status = url.searchParams.get("status");
      let q = supabase
        .from("live_format_proposals")
        .select("*")
        .order("cycle_start_date", { ascending: false })
        .order("format_type")
        .order("rank")
        .limit(200);
      if (status) q = q.eq("status", status);
      const { data, error } = await q;
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, items: data ?? [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { id, ...patch } = body;
    if (!id) throw new Error("id required");

    if (action === "publish") {
      patch.status = "published";
      patch.published_at = new Date().toISOString();
    } else if (action === "approve") {
      patch.status = "approved";
      patch.approved_at = new Date().toISOString();
    } else if (action === "archive") {
      patch.status = "archived";
    } else if (action === "reject") {
      patch.status = "rejected";
    }

    const { data, error } = await supabase
      .from("live_format_proposals")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, item: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("live-formats-admin error:", e);
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
