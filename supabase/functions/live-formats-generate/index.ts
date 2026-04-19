// Génère 2 séminaires + 3 webinaires bilingues à partir des signaux scrappés
// Utilise Lovable AI (Gemini) avec tool calling pour structure stricte
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-pro";

const PROPOSAL_SCHEMA = {
  type: "object",
  properties: {
    proposals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          format_type: { type: "string", enum: ["seminar", "webinar"] },
          title_fr: { type: "string" },
          title_en: { type: "string" },
          subtitle_fr: { type: "string" },
          subtitle_en: { type: "string" },
          description_fr: { type: "string" },
          description_en: { type: "string" },
          target_sectors_fr: { type: "array", items: { type: "string" } },
          target_sectors_en: { type: "array", items: { type: "string" } },
          target_audience_fr: { type: "string" },
          target_audience_en: { type: "string" },
          domain_key: { type: "string" },
          agenda_fr: { type: "array", items: { type: "string" } },
          agenda_en: { type: "array", items: { type: "string" } },
          key_benefits_fr: { type: "array", items: { type: "string" } },
          key_benefits_en: { type: "array", items: { type: "string" } },
          duration_minutes: { type: "number" },
          format_label_fr: { type: "string" },
          format_label_en: { type: "string" },
          speaker_profile_fr: { type: "string" },
          speaker_profile_en: { type: "string" },
          trend_justification_fr: { type: "string" },
          trend_justification_en: { type: "string" },
          trend_score: { type: "number" },
        },
        required: [
          "format_type",
          "title_fr",
          "title_en",
          "description_fr",
          "description_en",
          "target_sectors_fr",
          "target_sectors_en",
          "agenda_fr",
          "agenda_en",
          "key_benefits_fr",
          "key_benefits_en",
          "trend_justification_fr",
          "trend_justification_en",
        ],
      },
    },
  },
  required: ["proposals"],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error("Supabase env missing");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Récupérer les signaux des 30 derniers jours
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const { data: signals } = await supabase
      .from("content_signals")
      .select("title, summary, signal_url, meta")
      .eq("status", "live-format-trend")
      .gte("detected_at", since.toISOString())
      .order("detected_at", { ascending: false })
      .limit(60);

    const trendDigest = (signals ?? [])
      .map(
        (s, i) =>
          `${i + 1}. [${(s.meta as any)?.source_query ?? "?"}] ${s.title} — ${s.summary?.slice(0, 200) ?? ""}`,
      )
      .join("\n");

    const today = new Date();
    const cycleStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() < 15 ? 1 : 15);

    const systemPrompt = `Tu es un expert en ingénierie de formation IA pour les marchés africains francophones (Côte d'Ivoire, Sénégal, Cameroun, Bénin, Togo).
Tu conçois des séminaires (présentiel/hybride, 1-2 jours) et webinaires (1h30-2h, en ligne) ULTRA attractifs basés sur la demande RÉELLE détectée par scraping.
Cible: dirigeants, cadres, DRH, DSI, marketers, juristes, PME africaines.
Style: percutant, orienté ROI, bilingue FR/EN parfaitement traduit.`;

    const userPrompt = `Voici les ${signals?.length ?? 0} tendances scrappées en Côte d'Ivoire et Afrique de l'Ouest sur les 30 derniers jours:

${trendDigest}

Génère EXACTEMENT 5 propositions:
- 2 SÉMINAIRES (présentiel Abidjan, format 1-2 jours, 6-12h, profil dirigeant/expert)
- 3 WEBINAIRES (en ligne, 90-120 min, large audience cadres/managers)

Pour chaque proposition:
- Titre punchy bilingue (FR + EN)
- Sous-titre accrocheur
- Description 2-3 phrases (bénéfices concrets, ROI)
- 3-5 secteurs cibles précis (banque, assurance, télécoms, BTP, agroalim, distribution, secteur public, ONG, etc.)
- Profil audience clair
- domain_key parmi: ressources-humaines, finance-et-comptabilite, marketing-et-communication, juridique-et-conformite, it-et-transformation-digitale, management-et-leadership, data-analyse, service-client, formation-et-pedagogie, sante-et-bien-etre, administration-et-gestion, assistanat-et-secretariat, diplomatie-et-affaires-internationales
- Agenda: 4-6 modules concrets
- 3-5 bénéfices clés mesurables
- Profil intervenant
- Justification de la tendance (ancrée dans les signaux scrappés ci-dessus)
- trend_score 0-100

Privilégie les sujets où la demande est manifeste dans les signaux. Sois CONCRET, pas générique.`;

    const aiRes = await fetch(AI_GATEWAY, {
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
        tools: [
          {
            type: "function",
            function: {
              name: "submit_proposals",
              description: "Submit 5 live format proposals (2 seminars + 3 webinars)",
              parameters: PROPOSAL_SCHEMA,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_proposals" } },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      if (aiRes.status === 429) throw new Error("Rate limit IA, réessayez dans quelques minutes");
      if (aiRes.status === 402) throw new Error("Crédits IA épuisés — recharger l'espace de travail Lovable");
      throw new Error(`AI gateway error ${aiRes.status}: ${txt.slice(0, 300)}`);
    }

    const aiData = await aiRes.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");
    const args = JSON.parse(toolCall.function.arguments);
    const proposals = args.proposals as any[];

    if (!Array.isArray(proposals) || proposals.length === 0) {
      throw new Error("AI returned no proposals");
    }

    // Insérer en base avec status=draft
    const cycleStartISO = cycleStart.toISOString().slice(0, 10);
    let seminarRank = 1;
    let webinarRank = 1;
    const inserted: string[] = [];

    const sourceSignals = (signals ?? []).slice(0, 20).map((s) => ({
      title: s.title,
      url: s.signal_url,
    }));

    for (const p of proposals) {
      const isSeminar = p.format_type === "seminar";
      const rank = isSeminar ? seminarRank++ : webinarRank++;

      const { data, error } = await supabase
        .from("live_format_proposals")
        .insert({
          format_type: p.format_type,
          cycle_start_date: cycleStartISO,
          rank,
          title_fr: p.title_fr,
          title_en: p.title_en,
          subtitle_fr: p.subtitle_fr,
          subtitle_en: p.subtitle_en,
          description_fr: p.description_fr,
          description_en: p.description_en,
          target_sectors_fr: p.target_sectors_fr ?? [],
          target_sectors_en: p.target_sectors_en ?? [],
          target_audience_fr: p.target_audience_fr,
          target_audience_en: p.target_audience_en,
          domain_key: p.domain_key,
          agenda_fr: p.agenda_fr ?? [],
          agenda_en: p.agenda_en ?? [],
          key_benefits_fr: p.key_benefits_fr ?? [],
          key_benefits_en: p.key_benefits_en ?? [],
          duration_minutes: p.duration_minutes,
          format_label_fr: p.format_label_fr,
          format_label_en: p.format_label_en,
          speaker_profile_fr: p.speaker_profile_fr,
          speaker_profile_en: p.speaker_profile_en,
          trend_justification_fr: p.trend_justification_fr,
          trend_justification_en: p.trend_justification_en,
          trend_score: p.trend_score,
          trend_signals: sourceSignals,
          status: "draft",
          ai_provider: "lovable-ai",
          ai_model: MODEL,
          generation_meta: { signals_used: signals?.length ?? 0 },
        })
        .select("id")
        .single();

      if (!error && data) inserted.push(data.id);
      else if (error) console.error("Insert error:", error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        cycle_start: cycleStartISO,
        proposals_generated: proposals.length,
        proposals_stored: inserted.length,
        proposal_ids: inserted,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("live-formats-generate error:", e);
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
