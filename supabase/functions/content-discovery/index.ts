import { corsHeaders, editorialClient, json, parseRssItems } from "../_shared/editorial.ts";

type ManualSignal = {
  title: string;
  url: string;
  published_at?: string | null;
  raw_summary?: string | null;
  raw_text?: string | null;
  source_feed_id?: string | null;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: {
    limit?: number;
    feed_ids?: string[];
    dry_run?: boolean;
    manual_signals?: ManualSignal[];
  } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const limit = Math.max(1, Math.min(20, Number(body.limit) || 10));
  const dryRun = body.dry_run === true;
  const manualSignals = Array.isArray(body.manual_signals) ? body.manual_signals : [];

  if (manualSignals.length > 0) {
    const payload = manualSignals
      .filter((signal) => signal.title && signal.url)
      .map((signal) => ({
        source_feed_id: signal.source_feed_id ?? null,
        title: signal.title.trim(),
        url: signal.url.trim(),
        published_at: signal.published_at ?? null,
        raw_summary: signal.raw_summary?.trim() ?? null,
        raw_text: signal.raw_text?.trim() ?? null,
        status: "new",
      }));

    if (dryRun) {
      return json(200, { data: { inserted: 0, discovered: payload.length, signals: payload } });
    }

    const { data, error } = await editorialClient
      .from("source_signals")
      .upsert(payload, { onConflict: "url" })
      .select("id, title, url, status");

    if (error) {
      return json(400, { error: error.message });
    }

    return json(200, { data: { inserted: data?.length ?? 0, discovered: payload.length, signals: data ?? [] } });
  }

  let feedsQuery = editorialClient
    .from("source_feeds")
    .select("*")
    .eq("is_active", true)
    .order("trust_score", { ascending: false })
    .limit(limit);

  if (Array.isArray(body.feed_ids) && body.feed_ids.length > 0) {
    feedsQuery = feedsQuery.in("id", body.feed_ids);
  }

  const { data: feeds, error: feedsError } = await feedsQuery;

  if (feedsError) {
    return json(400, { error: feedsError.message });
  }

  const discoveredSignals: Record<string, unknown>[] = [];

  for (const feed of feeds ?? []) {
    if (feed.feed_type === "manual") {
      continue;
    }

    try {
      const response = await fetch(feed.url);
      if (!response.ok) {
        continue;
      }

      const xml = await response.text();
      const items = parseRssItems(xml).slice(0, limit);

      for (const item of items) {
        discoveredSignals.push({
          source_feed_id: feed.id,
          external_id: item.externalId,
          title: item.title,
          url: item.url,
          published_at: item.publishedAt,
          raw_summary: item.rawSummary,
          raw_text: item.rawText,
          status: "new",
        });
      }
    } catch {
      continue;
    }
  }

  if (dryRun) {
    return json(200, {
      data: {
        inserted: 0,
        discovered: discoveredSignals.length,
        signals: discoveredSignals.slice(0, 20),
      },
    });
  }

  if (discoveredSignals.length === 0) {
    return json(200, { data: { inserted: 0, discovered: 0, signals: [] } });
  }

  const { data, error } = await editorialClient
    .from("source_signals")
    .upsert(discoveredSignals, { onConflict: "url" })
    .select("id, title, url, status");

  if (error) {
    return json(400, { error: error.message });
  }

  return json(200, {
    data: {
      inserted: data?.length ?? 0,
      discovered: discoveredSignals.length,
      signals: data ?? [],
    },
  });
});
