import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  const url = new URL(req.url);
  const packId = url.searchParams.get("pack_id");

  if (!packId) {
    return new Response(
      JSON.stringify({ error: "pack_id manquant" }),
      { status: 400, headers: { ...cors, "content-type": "application/json" } }
    );
  }

  const client = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { data, error } = await client
    .from("ai_prospecting_packs")
    .select("pack_id, organization_name, target_email, status, payload")
    .eq("pack_id", packId)
    .neq("status", "rejected")
    .maybeSingle();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...cors, "content-type": "application/json" } }
    );
  }

  if (!data) {
    return new Response(
      JSON.stringify({ error: "Formulaire introuvable." }),
      { status: 404, headers: { ...cors, "content-type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ pack: data }),
    { status: 200, headers: { ...cors, "content-type": "application/json" } }
  );
});
