// Edge function: ai-vendor-feeds-sync
// Fetches official RSS feeds from OpenAI, Anthropic, Google AI Research,
// classifies each item, generates a short bilingual editorial card via Lovable AI,
// and auto-publishes them as resource_posts (category "veille").
// Falls back to Firecrawl scraping when an RSS feed is unreachable.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const adminToken = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";
const lovableApiKey = Deno.env.get("LOVABLE_API_KEY") ?? "";
const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY") ?? "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const VENDOR_FEED_URLS = [
  "https://openai.com/news/rss.xml",
  "https://www.anthropic.com/news/rss.xml",
  "https://research.google/blog/rss/",
];

type FeedRow = {
  id: string;
  name: string;
  url: string;
  publisher: string | null;
  trust_score: number;
  language: string;
  domain_focus: string | null;
};

type ParsedItem = {
  externalId: string;
  title: string;
  url: string;
  rawSummary: string;
  publishedAt: string | null;
};

const stripHtml = (value: string) =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);

const parseRss = (xml: string): ParsedItem[] => {
  const items: ParsedItem[] = [];

  // RSS 2.0 <item>
  const itemBlocks = Array.from(xml.matchAll(/<item\b[\s\S]*?<\/item>/gi));
  for (const [block] of itemBlocks.length ? itemBlocks.map((m) => [m[0]]) : []) {
    const title = stripHtml(block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const link = stripHtml(block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? "");
    const summary = stripHtml(
      block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ??
        block.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i)?.[1] ??
        "",
    );
    const pubDate = stripHtml(
      block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ??
        block.match(/<dc:date>([\s\S]*?)<\/dc:date>/i)?.[1] ??
        "",
    );
    const guid = stripHtml(block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1] ?? link);
    if (!title || !link) continue;
    items.push({
      externalId: guid || link,
      title,
      url: link,
      rawSummary: summary,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
    });
  }

  if (items.length > 0) return items;

  // Atom <entry>
  const entryBlocks = Array.from(xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi));
  for (const match of entryBlocks) {
    const block = match[0];
    const title = stripHtml(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const linkAttr = block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? "";
    const summary = stripHtml(
      block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ??
        block.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1] ??
        "",
    );
    const updated = stripHtml(
      block.match(/<updated>([\s\S]*?)<\/updated>/i)?.[1] ??
        block.match(/<published>([\s\S]*?)<\/published>/i)?.[1] ??
        "",
    );
    const id = stripHtml(block.match(/<id>([\s\S]*?)<\/id>/i)?.[1] ?? linkAttr);
    if (!title || !linkAttr) continue;
    items.push({
      externalId: id || linkAttr,
      title,
      url: linkAttr,
      rawSummary: summary,
      publishedAt: updated ? new Date(updated).toISOString() : null,
    });
  }

  return items;
};

// Firecrawl fallback: extract latest links from a vendor's news index page.
const firecrawlFallback = async (
  feed: FeedRow,
): Promise<ParsedItem[]> => {
  if (!firecrawlApiKey) return [];

  // Map RSS URL to a public news index URL.
  let indexUrl = feed.url;
  if (feed.url.includes("openai.com")) indexUrl = "https://openai.com/news/";
  else if (feed.url.includes("anthropic.com")) indexUrl = "https://www.anthropic.com/news";
  else if (feed.url.includes("research.google")) indexUrl = "https://research.google/blog/";

  try {
    const resp = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: indexUrl,
        formats: ["links", "markdown"],
        onlyMainContent: true,
      }),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    const links: string[] =
      data?.data?.links ?? data?.links ?? [];
    const host = new URL(indexUrl).host;
    const filtered = links
      .filter((link) => {
        try {
          const u = new URL(link);
          if (u.host !== host) return false;
          if (link === indexUrl) return false;
          return /\/news\/|\/blog\//i.test(u.pathname);
        } catch {
          return false;
        }
      })
      .slice(0, 10);

    return filtered.map((link) => ({
      externalId: link,
      title: stripHtml(link.split("/").filter(Boolean).pop() ?? "").replace(/-/g, " "),
      url: link,
      rawSummary: "",
      publishedAt: new Date().toISOString(),
    }));
  } catch {
    return [];
  }
};

type VendorEditorialCard = {
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  contentFr: string;
  contentEn: string;
  tags: string[];
};

const callLovableForCard = async (
  vendor: string,
  rawTitle: string,
  rawSummary: string,
  url: string,
): Promise<VendorEditorialCard | null> => {
  if (!lovableApiKey) return null;

  const systemPrompt =
    "Tu es l'éditeur de la veille IA de TransferAI Africa. Tu produis une carte éditoriale courte, factuelle, en français et en anglais, qui explique l'impact concret d'une annonce IA pour la Côte d'Ivoire et l'Afrique. Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans commentaire.";

  const userPrompt = `Annonce officielle de ${vendor} :
Titre source : ${rawTitle}
Résumé source : ${rawSummary || "(non fourni)"}
URL : ${url}

Renvoie EXACTEMENT cet objet JSON :
{
  "titleFr": "Titre court FR (max 90 car.)",
  "titleEn": "Short EN title (max 90 chars)",
  "excerptFr": "Résumé FR en 1-2 phrases (max 220 car.)",
  "excerptEn": "EN summary in 1-2 sentences (max 220 chars)",
  "contentFr": "3 paragraphes FR : (1) ce qui change, (2) impact pour l'Afrique / Côte d'Ivoire, (3) ce que les pros doivent regarder maintenant.",
  "contentEn": "Same 3-paragraph structure in EN.",
  "tags": ["3 à 5 tags en kebab-case"]
}`;

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error("Lovable AI error", resp.status, errText);
      return null;
    }
    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string") return null;
    const parsed = JSON.parse(text);
    if (
      typeof parsed?.titleFr === "string" &&
      typeof parsed?.titleEn === "string"
    ) {
      return {
        titleFr: String(parsed.titleFr).slice(0, 180),
        titleEn: String(parsed.titleEn).slice(0, 180),
        excerptFr: String(parsed.excerptFr ?? "").slice(0, 320),
        excerptEn: String(parsed.excerptEn ?? "").slice(0, 320),
        contentFr: String(parsed.contentFr ?? ""),
        contentEn: String(parsed.contentEn ?? ""),
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.filter((t: unknown) => typeof t === "string").slice(0, 6)
          : [],
      };
    }
    return null;
  } catch (err) {
    console.error("callLovableForCard exception", err);
    return null;
  }
};

const buildHeuristicCard = (
  vendor: string,
  rawTitle: string,
  rawSummary: string,
): VendorEditorialCard => {
  const summary = rawSummary?.slice(0, 220) || `Nouvelle annonce ${vendor} à suivre.`;
  return {
    titleFr: `${vendor} : ${rawTitle}`.slice(0, 180),
    titleEn: `${vendor}: ${rawTitle}`.slice(0, 180),
    excerptFr: summary,
    excerptEn: summary,
    contentFr: `Annonce officielle de ${vendor}.\n\n${rawSummary || rawTitle}\n\nÀ surveiller pour les organisations africaines qui utilisent ${vendor}.`,
    contentEn: `Official ${vendor} announcement.\n\n${rawSummary || rawTitle}\n\nWorth watching for African organizations using ${vendor}.`,
    tags: ["veille", slugify(vendor), "ia"],
  };
};

const processFeed = async (feed: FeedRow, perFeedLimit: number) => {
  const result = {
    feed: feed.name,
    fetched: 0,
    inserted_signals: 0,
    inserted_posts: 0,
    skipped: 0,
    used_fallback: false,
    error: null as string | null,
  };

  let items: ParsedItem[] = [];

  try {
    const resp = await fetch(feed.url, {
      headers: { "User-Agent": "TransferAI-Africa-Bot/1.0 (+https://transferai.africa)" },
    });
    if (resp.ok) {
      const xml = await resp.text();
      items = parseRss(xml);
    }
  } catch (err) {
    console.error(`RSS fetch failed for ${feed.name}`, err);
  }

  if (items.length === 0) {
    items = await firecrawlFallback(feed);
    result.used_fallback = items.length > 0;
  }

  items = items.slice(0, perFeedLimit);
  result.fetched = items.length;

  const vendor = feed.publisher ?? feed.name;

  for (const item of items) {
    // Dedup by feed + url
    const { data: existing } = await supabase
      .from("content_signals")
      .select("id")
      .eq("feed_id", feed.id)
      .eq("signal_url", item.url)
      .maybeSingle();

    if (existing?.id) {
      result.skipped += 1;
      continue;
    }

    const { data: signalRow, error: signalError } = await supabase
      .from("content_signals")
      .insert({
        feed_id: feed.id,
        external_id: item.externalId,
        signal_url: item.url,
        title: item.title,
        summary: item.rawSummary || null,
        language: feed.language,
        detected_at: new Date().toISOString(),
        status: "processed",
        meta: { publisher: vendor, published_at: item.publishedAt },
      })
      .select("id")
      .single();

    if (signalError) {
      console.error("signal insert error", signalError);
      continue;
    }

    result.inserted_signals += 1;

    // Generate editorial card (with heuristic fallback)
    const card =
      (await callLovableForCard(vendor, item.title, item.rawSummary, item.url)) ??
      buildHeuristicCard(vendor, item.title, item.rawSummary);

    const baseSlug = slugify(`${vendor}-${item.title}`) || `${slugify(vendor)}-${Date.now()}`;
    const slug = `${baseSlug}-${item.externalId.slice(-8).replace(/[^a-z0-9]/gi, "")}`.slice(0, 130);

    const { error: postError } = await supabase
      .from("resource_posts")
      .insert({
        slug,
        category_key: "veille",
        sector_key: "IT & Transformation Digitale",
        title_fr: card.titleFr,
        title_en: card.titleEn,
        excerpt_fr: card.excerptFr,
        excerpt_en: card.excerptEn,
        content_fr: card.contentFr,
        content_en: card.contentEn,
        read_time_minutes: 3,
        published_at: item.publishedAt ?? new Date().toISOString(),
        source_name: vendor,
        source_url: item.url,
        sources_json: [
          {
            label: vendor,
            url: item.url,
            publisher: vendor,
            published_at: item.publishedAt,
          },
        ],
        tags: card.tags,
        is_featured: false,
        is_new_manual: true,
        editorial_status: "published",
        status: "published",
        origin_signal_id: signalRow.id,
      });

    if (postError) {
      // Slug collision? Skip silently.
      console.error("resource_posts insert error", postError);
      continue;
    }

    result.inserted_posts += 1;
  }

  // Update last_fetched_at
  await supabase
    .from("content_feeds")
    .update({ last_fetched_at: new Date().toISOString() })
    .eq("id", feed.id);

  return result;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Allow either admin token (manual trigger) or Bearer service-role (cron)
  const adminHeader = req.headers.get("x-admin-token") ?? "";
  const authHeader = req.headers.get("authorization") ?? "";
  const isAdmin = adminToken.length > 0 && adminHeader === adminToken;
  const isCron = authHeader === `Bearer ${serviceRoleKey}` ||
    authHeader === `Bearer ${Deno.env.get("SUPABASE_ANON_KEY") ?? ""}`;
  if (!isAdmin && !isCron) {
    return json(401, { error: "unauthorized" });
  }

  let body: { per_feed_limit?: number } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const perFeedLimit = Math.max(1, Math.min(15, Number(body.per_feed_limit) || 6));

  const { data: feeds, error: feedsError } = await supabase
    .from("content_feeds")
    .select("id, name, url, publisher, trust_score, language, domain_focus")
    .in("url", VENDOR_FEED_URLS)
    .eq("is_active", true);

  if (feedsError) return json(500, { error: feedsError.message });
  if (!feeds || feeds.length === 0) {
    return json(200, { data: { results: [], message: "No vendor feeds active." } });
  }

  const results = [];
  for (const feed of feeds as FeedRow[]) {
    try {
      results.push(await processFeed(feed, perFeedLimit));
    } catch (err) {
      console.error(`processFeed error for ${feed.name}`, err);
      results.push({
        feed: feed.name,
        fetched: 0,
        inserted_signals: 0,
        inserted_posts: 0,
        skipped: 0,
        used_fallback: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return json(200, {
    data: {
      results,
      total_inserted_posts: results.reduce((sum, r) => sum + r.inserted_posts, 0),
      total_inserted_signals: results.reduce((sum, r) => sum + r.inserted_signals, 0),
    },
  });
});
