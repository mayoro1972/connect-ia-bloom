// Edge function: rank-monthly-domains
// Uses Lovable AI Gateway (Gemini) to pick the top 3 most in-demand domains
// for the current month among the 13 TransferAI Africa expertise areas.
// Stores results in monthly_domain_trends so the homepage can read them dynamically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DOMAINS = [
  { key: "assistanat", fr: "Assistanat & Secrétariat de Direction", en: "Executive Assistants & Secretaries" },
  { key: "rh", fr: "Ressources Humaines", en: "Human Resources" },
  { key: "marketing", fr: "Marketing & Communication", en: "Marketing & Communications" },
  { key: "finance", fr: "Finance & Comptabilité", en: "Finance & Accounting" },
  { key: "juridique", fr: "Juridique & Conformité", en: "Legal & Compliance" },
  { key: "service", fr: "Service Client & Relation Client", en: "Customer Service & Relations" },
  { key: "data", fr: "Data & Analyse de Données", en: "Data & Analytics" },
  { key: "admin", fr: "Administration & Gestion", en: "Administration & Management" },
  { key: "management", fr: "Management & Leadership", en: "Management & Leadership" },
  { key: "it", fr: "IT & Transformation Digitale", en: "IT & Digital Transformation" },
  { key: "formation", fr: "Formation & Pédagogie", en: "Training & Education" },
  { key: "sante", fr: "Santé & Bien-être au Travail", en: "Health & Workplace Wellness" },
  { key: "diplomatie", fr: "Diplomatie & Affaires Internationales", en: "Diplomacy & International Affairs" },
];

const MODEL = "google/gemini-2.5-pro";

const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function startOfMonth(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  return d.toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Supabase env not configured");

    let body: { month?: string; force?: boolean } = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const targetDate = body.month ? new Date(`${body.month}-01T00:00:00Z`) : new Date();
    const trendMonth = startOfMonth(targetDate);
    const monthLabelFr = `${FR_MONTHS[targetDate.getUTCMonth()]} ${targetDate.getUTCFullYear()}`;
    const monthLabelEn = targetDate.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Skip if already published unless forced
    if (!body.force) {
      const { data: existing } = await supabase
        .from("monthly_domain_trends")
        .select("id")
        .eq("trend_month", trendMonth)
        .limit(1);
      if (existing && existing.length > 0) {
        return new Response(
          JSON.stringify({ ok: true, skipped: true, message: "Trends already exist for this month", trend_month: trendMonth }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const systemPrompt = `Tu es un analyste senior spécialisé dans la transformation IA des organisations en Afrique francophone et anglophone, en Europe et auprès des organisations internationales (diplomatie, ONU, UE, banques de développement). Ta mission est d'identifier, parmi 13 domaines d'expertise TransferAI Africa, les 3 domaines les plus DEMANDÉS pour un mois précis, en t'appuyant sur les tendances marché récentes (offres d'emploi IA, annonces d'investissement, programmes de formation, lancements d'outils, signaux LinkedIn/presse spécialisée). Tu dois aussi identifier 3 secteurs d'activité où chaque domaine est particulièrement plébiscité.`;

    const userPrompt = `Mois cible : ${monthLabelFr} (${monthLabelEn}).

Voici les 13 domaines TransferAI Africa :
${DOMAINS.map((d, i) => `${i + 1}. [${d.key}] ${d.fr} / ${d.en}`).join("\n")}

Sélectionne les 3 domaines les plus demandés pour ce mois précis et, pour chacun :
- 3 secteurs d'activité concrets où il est très demandé (ex: banque, ONG humanitaires, ministères, télécoms, santé publique, énergie, agro-industrie, diplomatie multilatérale...).
- Une justification courte (1-2 phrases) en français ET en anglais expliquant pourquoi ce domaine est tendance ce mois-ci.
- Un libellé de badge court (ex: "Très demandé", "En forte hausse", "Stratégique", "Tendance ${monthLabelFr}").

Renvoie STRICTEMENT au format JSON via l'outil fourni. N'utilise QUE les clés de domaine listées ci-dessus.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "publish_monthly_trends",
          description: "Publish the top 3 most in-demand domains for the target month.",
          parameters: {
            type: "object",
            properties: {
              trends: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: {
                  type: "object",
                  properties: {
                    rank: { type: "integer", enum: [1, 2, 3] },
                    domain_key: { type: "string", enum: DOMAINS.map((d) => d.key) },
                    badge_label_fr: { type: "string" },
                    badge_label_en: { type: "string" },
                    target_sectors_fr: { type: "array", minItems: 2, maxItems: 4, items: { type: "string" } },
                    target_sectors_en: { type: "array", minItems: 2, maxItems: 4, items: { type: "string" } },
                    justification_fr: { type: "string" },
                    justification_en: { type: "string" },
                  },
                  required: [
                    "rank", "domain_key", "badge_label_fr", "badge_label_en",
                    "target_sectors_fr", "target_sectors_en", "justification_fr", "justification_en",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["trends"],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "publish_monthly_trends" } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "Lovable AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: "AI gateway error", detail: t }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return a tool call");
    }
    const parsed = JSON.parse(toolCall.function.arguments);
    const trends = parsed.trends as Array<{
      rank: number;
      domain_key: string;
      badge_label_fr: string;
      badge_label_en: string;
      target_sectors_fr: string[];
      target_sectors_en: string[];
      justification_fr: string;
      justification_en: string;
    }>;

    // Wipe any existing rows for this month if force, then insert
    if (body.force) {
      await supabase.from("monthly_domain_trends").delete().eq("trend_month", trendMonth);
    }

    const rows = trends.map((t) => ({
      trend_month: trendMonth,
      rank: t.rank,
      domain_key: t.domain_key,
      badge_label_fr: t.badge_label_fr,
      badge_label_en: t.badge_label_en,
      target_sectors_fr: t.target_sectors_fr,
      target_sectors_en: t.target_sectors_en,
      justification_fr: t.justification_fr,
      justification_en: t.justification_en,
      webinar_url: "/webinars",
      ai_provider: "lovable-ai",
      ai_model: MODEL,
      source_signals: { generated_at: new Date().toISOString() },
      status: "published",
    }));

    const { error: insertErr } = await supabase.from("monthly_domain_trends").insert(rows);
    if (insertErr) {
      console.error("Insert error:", insertErr);
      throw insertErr;
    }

    return new Response(
      JSON.stringify({ ok: true, trend_month: trendMonth, count: rows.length, trends: rows }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("rank-monthly-domains error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
