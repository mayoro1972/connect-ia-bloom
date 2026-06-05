import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
};

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const client = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  if (req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    const packId = body.pack_id;
    const answers = body.answers;

    if (!packId) return json({ error: "pack_id manquant" }, 400);

    const { error } = await client
      .from("ai_prospecting_packs")
      .update({ status: "questionnaire_submitted", questionnaire_answers: answers })
      .eq("pack_id", packId);

    if (error) return json({ error: error.message }, 500);
    return json({ success: true });
  }

  if (req.method === "GET") {
    const url = new URL(req.url);
    const packId = url.searchParams.get("pack_id");

    if (!packId) return json({ error: "pack_id manquant" }, 400);

    const { data, error } = await client
      .from("ai_prospecting_packs")
      .select("pack_id, organization_name, target_email, status, payload")
      .eq("pack_id", packId)
      .neq("status", "rejected")
      .maybeSingle();

    if (error) return json({ error: error.message }, 500);
    if (!data) return json({ error: "Formulaire introuvable." }, 404);
    return json({ pack: data });
  }

  return new Response("Method not allowed", { status: 405, headers: cors });
});
