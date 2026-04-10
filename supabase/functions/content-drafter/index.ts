import {
  buildFallbackDraftFr,
  callAnthropicText,
  callOpenAIJson,
  corsHeaders,
  editorialClient,
  json,
  slugify,
} from "../_shared/editorial.ts";

const draftingSystemPrompt = `You draft French-first editorial watch articles for TransferAI Africa.
Return strict JSON with:
- titleFr
- excerptFr
- contentFr
- seoTitleFr
- seoDescriptionFr
- readTimeMinutes

Constraints:
- tone: premium, concrete, Africa-first, Côte d'Ivoire-aware
- avoid unsupported claims
- produce article-ready French copy
- keep English fields empty because FR is the primary language`;

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

  const limit = Math.max(1, Math.min(12, Number(body.limit) || 6));

  const { data: existingDrafts } = await editorialClient
    .from("resource_posts")
    .select("origin_signal_id")
    .not("origin_signal_id", "is", null);

  const existingOriginIds = new Set((existingDrafts ?? []).map((item) => item.origin_signal_id).filter(Boolean));

  let signalsQuery = editorialClient
    .from("source_signals")
    .select("id, title, url, published_at, raw_summary, raw_text, domain_detected, content_type_detected, tags, source_feed_id, source_feeds(name)")
    .eq("status", "scored")
    .order("priority_score", { ascending: false, nullsFirst: false })
    .limit(limit * 2);

  if (Array.isArray(body.signal_ids) && body.signal_ids.length > 0) {
    signalsQuery = signalsQuery.in("id", body.signal_ids);
  }

  const { data: candidateSignals, error } = await signalsQuery;

  if (error) {
    return json(400, { error: error.message });
  }

  const signals = (candidateSignals ?? []).filter((signal) => !existingOriginIds.has(signal.id)).slice(0, limit);
  const drafted: Array<Record<string, unknown>> = [];

  for (const signal of signals) {
    const { data: job } = await editorialClient
      .from("editorial_jobs")
      .insert({
        source_signal_id: signal.id,
        job_type: "draft_fr",
        provider: Deno.env.get("ANTHROPIC_API_KEY")
          ? "anthropic"
          : Deno.env.get("OPENAI_API_KEY")
            ? "openai"
            : "heuristic",
        model: Deno.env.get("ANTHROPIC_API_KEY")
          ? "claude-3-7-sonnet-latest"
          : Deno.env.get("OPENAI_API_KEY")
            ? "gpt-4.1-mini"
            : "heuristic-v1",
        input_payload: signal,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    try {
      const fallbackDraft = buildFallbackDraftFr({
        title: signal.title,
        domainDetected: signal.domain_detected || "IA appliquée",
        rawSummary: signal.raw_summary,
        rawText: signal.raw_text,
        url: signal.url,
        sourceName: signal.source_feeds?.name || "Source externe",
        publishedAt: signal.published_at,
      });

      let aiDraft:
        | {
            titleFr?: string;
            excerptFr?: string;
            contentFr?: string;
            seoTitleFr?: string;
            seoDescriptionFr?: string;
            readTimeMinutes?: number;
          }
        | null = null;

      if (Deno.env.get("ANTHROPIC_API_KEY")) {
        const anthropicText = await callAnthropicText({
          systemPrompt: draftingSystemPrompt,
          userPrompt: JSON.stringify({
            signal,
            fallbackDraft,
            editorialAngle: "FR-first, Côte d'Ivoire first, Africa next, business usefulness before hype",
          }),
        }).catch(() => null);

        if (anthropicText) {
          aiDraft = await callOpenAIJson({
            systemPrompt: "Convert this draft into strict JSON using the requested keys only.",
            userPrompt: anthropicText,
          }).catch(() => null);
        }
      } else if (Deno.env.get("OPENAI_API_KEY")) {
        aiDraft = await callOpenAIJson({
          systemPrompt: draftingSystemPrompt,
          userPrompt: JSON.stringify({
            signal,
            fallbackDraft,
            editorialAngle: "FR-first, Côte d'Ivoire first, Africa next, business usefulness before hype",
          }),
        }).catch(() => null);
      }

      const draft = {
        titleFr: typeof aiDraft?.titleFr === "string" && aiDraft.titleFr.trim() ? aiDraft.titleFr.trim() : fallbackDraft.titleFr,
        excerptFr: typeof aiDraft?.excerptFr === "string" && aiDraft.excerptFr.trim() ? aiDraft.excerptFr.trim() : fallbackDraft.excerptFr,
        contentFr: typeof aiDraft?.contentFr === "string" && aiDraft.contentFr.trim() ? aiDraft.contentFr.trim() : fallbackDraft.contentFr,
        seoTitleFr:
          typeof aiDraft?.seoTitleFr === "string" && aiDraft.seoTitleFr.trim()
            ? aiDraft.seoTitleFr.trim()
            : fallbackDraft.seoTitleFr,
        seoDescriptionFr:
          typeof aiDraft?.seoDescriptionFr === "string" && aiDraft.seoDescriptionFr.trim()
            ? aiDraft.seoDescriptionFr.trim()
            : fallbackDraft.seoDescriptionFr,
        readTimeMinutes:
          typeof aiDraft?.readTimeMinutes === "number" && Number.isFinite(aiDraft.readTimeMinutes)
            ? aiDraft.readTimeMinutes
            : fallbackDraft.readTimeMinutes,
      };

      const slugBase = slugify(signal.title) || slugify(signal.domain_detected || "veille-ia");
      const slug = `${slugBase}-${signal.id.slice(0, 8)}`;

      const { data: post, error: insertError } = await editorialClient
        .from("resource_posts")
        .insert({
          slug,
          category_key: signal.content_type_detected || "veille",
          sector_key: signal.domain_detected,
          title_fr: draft.titleFr,
          title_en: "",
          excerpt_fr: draft.excerptFr,
          excerpt_en: "",
          content_fr: draft.contentFr,
          content_en: null,
          read_time_minutes: draft.readTimeMinutes,
          published_at: signal.published_at || new Date().toISOString(),
          source_name: signal.source_feeds?.name || "TransferAI Africa · veille éditoriale multi-sources",
          source_url: signal.url,
          sources_json: fallbackDraft.sources,
          seo_title_fr: draft.seoTitleFr,
          seo_title_en: null,
          seo_description_fr: draft.seoDescriptionFr,
          seo_description_en: null,
          tags: signal.tags || [],
          is_featured: false,
          is_new_manual: true,
          status: "draft",
          editorial_status: "review",
          origin_signal_id: signal.id,
        })
        .select("id, slug, title_fr, editorial_status, status")
        .single();

      if (insertError) {
        throw insertError;
      }

      await editorialClient
        .from("source_signals")
        .update({ status: "drafted" })
        .eq("id", signal.id);

      if (job?.id) {
        await editorialClient
          .from("editorial_jobs")
          .update({
            status: "done",
            resource_post_id: post.id,
            output_payload: draft,
            finished_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }

      drafted.push({
        signalId: signal.id,
        post,
      });
    } catch (draftError) {
      if (job?.id) {
        await editorialClient
          .from("editorial_jobs")
          .update({
            status: "failed",
            error_message: draftError instanceof Error ? draftError.message : "Unknown drafting error",
            finished_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }
    }
  }

  return json(200, { data: { drafted: drafted.length, items: drafted } });
});
