import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

export const editorialClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

export const normalizeText = (value: string) =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

export const parseRssItems = (xml: string) => {
  const matches = Array.from(xml.matchAll(/<item\b[\s\S]*?<\/item>/gi));

  return matches.map((match, index) => {
    const block = match[0];
    const title = normalizeText(block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const url = normalizeText(block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? "");
    const summary = normalizeText(
      block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ??
      block.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i)?.[1] ??
      "",
    );
    const publishedAt = normalizeText(
      block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ??
      block.match(/<dc:date>([\s\S]*?)<\/dc:date>/i)?.[1] ??
      "",
    );
    const externalId = normalizeText(
      block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1] ?? `${url || title}-${index}`,
    );

    return {
      externalId,
      title,
      url,
      rawSummary: summary,
      rawText: summary,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
    };
  }).filter((item) => item.title && item.url);
};

const blockedHtmlTitles = new Set([
  "contact",
  "sitemap",
  "legal notice",
  "recruitment",
  "read more",
  "lire plus",
  "voir plus",
  "see more",
  "download",
  "telecharger",
]);

const cleanHtmlAnchorText = (value: string) =>
  normalizeText(
    value
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<img[^>]*>/gi, " ")
      .replace(/<span[^>]*class="[^"]*visually-hidden[^"]*"[^>]*>[\s\S]*?<\/span>/gi, " "),
  );

const looksLikeArticleLink = (title: string, href: string) => {
  const normalizedTitle = normalizeText(title).toLowerCase();
  const normalizedHref = href.toLowerCase();

  if (!normalizedTitle || blockedHtmlTitles.has(normalizedTitle)) {
    return false;
  }

  if (normalizedTitle.length < 18 || normalizedTitle.length > 240) {
    return false;
  }

  if (
    normalizedHref.startsWith("mailto:") ||
    normalizedHref.startsWith("tel:") ||
    normalizedHref.startsWith("javascript:") ||
    normalizedHref.includes("#")
  ) {
    return false;
  }

  if (
    normalizedHref.includes("/actualites") ||
    normalizedHref.includes("/communique") ||
    normalizedHref.includes("/publications") ||
    normalizedHref.includes("/decisions") ||
    normalizedHref.includes("/appels-offres") ||
    normalizedHref.includes("/content/") ||
    normalizedHref.includes("/newsletters/")
  ) {
    return true;
  }

  return /\b(ia|intelligence artificielle|conformite|compliance|regulation|banque|bank|donnees|privacy)\b/i.test(normalizedTitle);
};

export const parseHtmlItems = (html: string, pageUrl: string) => {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");

  const matches = Array.from(withoutNoise.matchAll(/<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi));
  const seen = new Set<string>();

  return matches
    .map((match, index) => {
      const href = normalizeText(match[2]);
      const title = cleanHtmlAnchorText(match[3]);

      if (!looksLikeArticleLink(title, href)) {
        return null;
      }

      let absoluteUrl = href;
      try {
        absoluteUrl = new URL(href, pageUrl).toString();
      } catch {
        return null;
      }

      if (seen.has(absoluteUrl)) {
        return null;
      }
      seen.add(absoluteUrl);

      const context = withoutNoise.slice(Math.max(0, (match.index ?? 0) - 240), Math.min(withoutNoise.length, (match.index ?? 0) + 900));
      const rawSummary = normalizeText(
        context
          .replace(match[0], " ")
          .slice(0, 420),
      );

      const dateMatch =
        context.match(/\b(\d{4}-\d{2}-\d{2})\b/) ??
        context.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);

      let publishedAt: string | null = null;
      if (dateMatch?.[1]) {
        const parsed = new Date(dateMatch[1]);
        if (!Number.isNaN(parsed.getTime())) {
          publishedAt = parsed.toISOString();
        }
      }

      return {
        externalId: `${absoluteUrl}-${index}`,
        title,
        url: absoluteUrl,
        rawSummary: rawSummary || title,
        rawText: rawSummary || title,
        publishedAt,
      };
    })
    .filter((item): item is { externalId: string; title: string; url: string; rawSummary: string; rawText: string; publishedAt: string | null } => item !== null);
};

const domainRules = [
  {
    domain: "IT & Transformation Digitale",
    type: "veille",
    keywords: ["it", "digital transformation", "cloud", "cyber", "copilot", "agent", "ai infrastructure", "llm", "software"],
  },
  {
    domain: "Finance & Fintech",
    type: "veille",
    keywords: ["fintech", "bank", "banking", "mobile money", "payment", "bceao", "kyc", "aml", "fraud", "credit scoring"],
  },
  {
    domain: "Agriculture & AgroTech IA",
    type: "veille",
    keywords: ["agriculture", "agritech", "cocoa", "cacao", "yield", "crop", "farm", "eudr", "traceability"],
  },
  {
    domain: "Éducation & EdTech IA",
    type: "veille",
    keywords: ["education", "edtech", "learning", "school", "student", "skills", "tutor", "training"],
  },
  {
    domain: "Santé & IA médicale",
    type: "veille",
    keywords: ["health", "medical", "hospital", "diagnostic", "pharma", "epidemic", "mental health"],
  },
  {
    domain: "Logistique & Supply Chain",
    type: "veille",
    keywords: ["logistics", "supply chain", "port", "shipping", "delivery", "corridor", "warehouse", "customs"],
  },
  {
    domain: "Énergie & Transition énergétique",
    type: "veille",
    keywords: ["energy", "electricity", "solar", "grid", "battery", "renewable", "carbon"],
  },
  {
    domain: "RH & Gestion des talents",
    type: "veille",
    keywords: ["hr", "human resources", "talent", "recruitment", "workforce", "skills gap", "hiring"],
  },
  {
    domain: "Marketing & Communication IA",
    type: "veille",
    keywords: ["marketing", "communication", "content", "brand", "campaign", "advertising", "whatsapp business"],
  },
  {
    domain: "Droit & LegalTech IA",
    type: "veille",
    keywords: ["legal", "law", "regulation", "ohada", "privacy", "compliance", "contract"],
  },
  {
    domain: "Immobilier & Smart City",
    type: "veille",
    keywords: ["real estate", "property", "smart city", "urban", "housing", "mobility", "infrastructure"],
  },
  {
    domain: "Tourisme & Hospitalité",
    type: "veille",
    keywords: ["tourism", "hospitality", "hotel", "travel", "visitor", "destination", "concierge"],
  },
  {
    domain: "Médias & Création de contenu",
    type: "veille",
    keywords: ["media", "creator", "journalism", "video", "podcast", "misinformation", "content creator"],
  },
];

const detectCountry = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("côte d'ivoire") || lower.includes("cote d'ivoire") || lower.includes("ivory coast") || lower.includes("abidjan")) {
    return "Côte d'Ivoire";
  }
  if (lower.includes("afrique de l'ouest") || lower.includes("west africa") || lower.includes("uemoa") || lower.includes("cedeao")) {
    return "Afrique de l'Ouest";
  }
  if (lower.includes("africa") || lower.includes("afrique")) {
    return "Afrique";
  }
  return null;
};

export const heuristicClassifySignal = (signal: {
  title: string;
  rawText?: string | null;
  rawSummary?: string | null;
  domainHint?: string | null;
  trustScore?: number | null;
}) => {
  const haystack = `${signal.title} ${signal.rawSummary ?? ""} ${signal.rawText ?? ""} ${signal.domainHint ?? ""}`.toLowerCase();

  let selected = domainRules[0];
  let score = -1;

  for (const rule of domainRules) {
    const hits = rule.keywords.reduce((count, keyword) => count + (haystack.includes(keyword) ? 1 : 0), 0);
    if (hits > score) {
      selected = rule;
      score = hits;
    }
  }

  const countryDetected = detectCountry(haystack);
  const africaBoost = countryDetected === "Côte d'Ivoire" ? 20 : countryDetected === "Afrique de l'Ouest" ? 14 : countryDetected === "Afrique" ? 8 : 0;
  const credibilityScore = Math.max(35, Math.min(100, (signal.trustScore ?? 50) + (score > 0 ? 10 : 0)));
  const relevanceScore = Math.max(40, Math.min(100, 48 + score * 12 + africaBoost));
  const priorityScore = Math.max(40, Math.min(100, Math.round((credibilityScore + relevanceScore) / 2)));

  return {
    domain: signal.domainHint || selected.domain,
    contentType: selected.type,
    countryDetected,
    regionDetected: countryDetected === "Côte d'Ivoire" ? "Afrique de l'Ouest" : countryDetected,
    language: haystack.includes("the ") || haystack.includes(" and ") ? "en" : "fr",
    relevanceScore,
    credibilityScore,
    priorityScore,
    tags: Array.from(
      new Set([
        "veille",
        slugify(signal.domainHint || selected.domain),
        ...(countryDetected ? [slugify(countryDetected)] : []),
      ]),
    ),
  };
};

export const buildFallbackDraftFr = (signal: {
  title: string;
  domainDetected: string;
  rawSummary?: string | null;
  rawText?: string | null;
  url: string;
  sourceName?: string | null;
  publishedAt?: string | null;
}) => {
  const currentDateToken = "{{CURRENT_DATE}}";
  const title = `Veille ${signal.domainDetected} : ${signal.title}`;
  const excerpt =
    signal.rawSummary?.slice(0, 240) ||
    `Une veille éditoriale TransferAI Africa pour décrypter un signal utile au domaine ${signal.domainDetected} en Côte d'Ivoire et en Afrique.`;
  const body = [
    `${title}`,
    ``,
    `Veille éditoriale TransferAI Africa — ${currentDateToken}`,
    ``,
    `Pourquoi ce signal compte maintenant`,
    `${excerpt}`,
    ``,
    `Ce que cela change pour la Côte d'Ivoire et l'Afrique`,
    `Ce sujet mérite l'attention des professionnels, entreprises et institutions qui veulent comprendre comment l'IA transforme le domaine ${signal.domainDetected} dans un contexte africain concret.`,
    ``,
    `Ce que les décideurs doivent regarder`,
    `1. La maturité réelle du cas d'usage`,
    `2. Les compétences à développer en interne`,
    `3. Les impacts business, réglementaires et opérationnels`,
    ``,
    `Lecture source`,
    `${signal.rawText || signal.rawSummary || "Le signal source sera enrichi pendant la revue éditoriale avant publication finale."}`,
    ``,
    `Positionnement TransferAI Africa`,
    `Ce signal peut nourrir une veille métier, un guide pratique ou un cas d'usage directement relié aux parcours de formation et d'accompagnement TransferAI Africa.`,
  ].join("\n");

  return {
    titleFr: title,
    excerptFr: excerpt,
    contentFr: body,
    sources: [
      {
        label: signal.sourceName || "Source externe",
        url: signal.url,
        publisher: signal.sourceName || "Source externe",
        published_at: signal.publishedAt,
      },
    ],
    seoTitleFr: `${title} | TransferAI Africa`,
    seoDescriptionFr: excerpt,
    readTimeMinutes: Math.max(4, Math.min(8, Math.ceil((body.split(/\s+/).length || 250) / 180))),
  };
};

const parseJsonFromText = (value: string) => {
  const fenced = value.match(/```json\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? value;
  return JSON.parse(candidate);
};

export const callOpenAIJson = async (payload: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}) => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: payload.model || "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: payload.systemPrompt },
        { role: "user", content: payload.userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("OpenAI returned an empty response.");
  }

  return parseJsonFromText(text);
};

export const callLovableAIJson = async (payload: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}) => {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: payload.model || "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: payload.systemPrompt },
        { role: "user", content: payload.userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Lovable AI request failed with ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Lovable AI returned an empty response.");
  }

  return parseJsonFromText(text);
};

export const callAnthropicText = async (payload: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}) => {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: payload.model || "claude-3-7-sonnet-latest",
      max_tokens: 1800,
      temperature: 0.3,
      system: payload.systemPrompt,
      messages: [{ role: "user", content: payload.userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed with ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.find((entry: { type?: string }) => entry.type === "text")?.text;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Anthropic returned an empty response.");
  }

  return text;
};
