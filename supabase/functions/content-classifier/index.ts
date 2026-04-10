import {
  callOpenAIJson,
  corsHeaders,
  editorialClient,
  heuristicClassifySignal,
  json,
} from "../_shared/editorial.ts";

const classificationSystemPrompt = `You classify AI-related editorial signals for TransferAI Africa.
Return strict JSON with these keys only:
- domain
- contentType
- countryDetected
- regionDetected
- language
- relevanceScore
- credibilityScore
- priorityScore
- tags

Rules:
- domain must be one of the 13 TransferAI domains
- contentType should usually be "veille"
- scores are integers between 0 and 100
- prioritize Côte d'Ivoire, West Africa, Africa and concrete business impact
- tags must be short lowercase strings`;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: { limit?: number; signal_ids?: string[] } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const limit = Math.max(1, Math.min(20, Number(body.limit) || 10));

  let signalsQuery = editorialClient
    .from("source_signals")
    .select("id, title, raw_text, raw_summary, status, source_feed_id, source_feeds(domain_focus, trust_score)")
    .eq("status", "new")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (Array.isArray(body.signal_ids) && body.signal_ids.length > 0) {
    signalsQuery = signalsQuery.in("id", body.signal_ids);
  }

  const { data: signals, error } = await signalsQuery;

  if (error) {
    return json(400, { error: error.message });
  }

  const processed: Array<Record<string, unknown>> = [];

  for (const signal of signals ?? []) {
    const { data: job } = await editorialClient
      .from("editorial_jobs")
      .insert({
        source_signal_id: signal.id,
        job_type: "classify",
        provider: Deno.env.get("OPENAI_API_KEY") ? "openai" : "heuristic",
        model: Deno.env.get("OPENAI_API_KEY") ? "gpt-4.1-mini" : "heuristic-v1",
        input_payload: signal,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    try {
      const heuristic = heuristicClassifySignal({
        title: signal.title,
        rawText: signal.raw_text,
        rawSummary: signal.raw_summary,
        domainHint: signal.source_feeds?.domain_focus ?? null,
        trustScore: signal.source_feeds?.trust_score ?? null,
      });

      const aiResult = await callOpenAIJson({
        systemPrompt: classificationSystemPrompt,
        userPrompt: JSON.stringify({
          title: signal.title,
          rawSummary: signal.raw_summary,
          rawText: signal.raw_text,
          domainHint: signal.source_feeds?.domain_focus ?? null,
          heuristic,
        }),
      }).catch(() => null);

      const classification = {
        domain: typeof aiResult?.domain === "string" ? aiResult.domain : heuristic.domain,
        contentType: typeof aiResult?.contentType === "string" ? aiResult.contentType : heuristic.contentType,
        countryDetected: typeof aiResult?.countryDetected === "string" ? aiResult.countryDetected : heuristic.countryDetected,
        regionDetected: typeof aiResult?.regionDetected === "string" ? aiResult.regionDetected : heuristic.regionDetected,
        language: typeof aiResult?.language === "string" ? aiResult.language : heuristic.language,
        relevanceScore: typeof aiResult?.relevanceScore === "number" ? aiResult.relevanceScore : heuristic.relevanceScore,
        credibilityScore: typeof aiResult?.credibilityScore === "number" ? aiResult.credibilityScore : heuristic.credibilityScore,
        priorityScore: typeof aiResult?.priorityScore === "number" ? aiResult.priorityScore : heuristic.priorityScore,
        tags: Array.isArray(aiResult?.tags) ? aiResult.tags : heuristic.tags,
      };

      const { error: updateError } = await editorialClient
        .from("source_signals")
        .update({
          domain_detected: classification.domain,
          content_type_detected: classification.contentType,
          country_detected: classification.countryDetected,
          region_detected: classification.regionDetected,
          language: classification.language,
          relevance_score: classification.relevanceScore,
          credibility_score: classification.credibilityScore,
          priority_score: classification.priorityScore,
          tags: classification.tags,
          status: "scored",
        })
        .eq("id", signal.id);

      if (updateError) {
        throw updateError;
      }

      if (job?.id) {
        await editorialClient
          .from("editorial_jobs")
          .update({
            status: "done",
            output_payload: classification,
            finished_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }

      processed.push({
        id: signal.id,
        title: signal.title,
        ...classification,
      });
    } catch (classificationError) {
      if (job?.id) {
        await editorialClient
          .from("editorial_jobs")
          .update({
            status: "failed",
            error_message: classificationError instanceof Error ? classificationError.message : "Unknown classification error",
            finished_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }
    }
  }

  return json(200, { data: { processed: processed.length, items: processed } });
});
