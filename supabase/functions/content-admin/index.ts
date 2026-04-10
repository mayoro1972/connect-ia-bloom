import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const adminToken = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const requireAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token") ?? "";
  return adminToken.length > 0 && token === adminToken;
};

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : fallback);
const asNullableString = (value: unknown) => {
  const normalized = asString(value);
  return normalized.length > 0 ? normalized : null;
};
const asBoolean = (value: unknown) => value === true;
const asNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};
const asStringArray = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};
const asJson = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (typeof value === "object") {
    return value;
  }

  return null;
};

const mapResourcePayload = (payload: Record<string, unknown>) => ({
  slug: asString(payload.slug),
  category_key: asString(payload.category_key),
  sector_key: asNullableString(payload.sector_key),
  title_fr: asString(payload.title_fr),
  title_en: asString(payload.title_en),
  excerpt_fr: asString(payload.excerpt_fr),
  excerpt_en: asString(payload.excerpt_en),
  content_fr: asNullableString(payload.content_fr),
  content_en: asNullableString(payload.content_en),
  read_time_minutes: asNumber(payload.read_time_minutes),
  published_at: asString(payload.published_at) || new Date().toISOString(),
  source_name: asNullableString(payload.source_name),
  source_url: asNullableString(payload.source_url),
  sources_json: asJson(payload.sources_json),
  seo_title_fr: asNullableString(payload.seo_title_fr),
  seo_title_en: asNullableString(payload.seo_title_en),
  seo_description_fr: asNullableString(payload.seo_description_fr),
  seo_description_en: asNullableString(payload.seo_description_en),
  cover_image_url: asNullableString(payload.cover_image_url),
  tags: asStringArray(payload.tags),
  is_featured: asBoolean(payload.is_featured),
  is_new_manual: asBoolean(payload.is_new_manual),
  status: asString(payload.status, "draft"),
  origin_signal_id: asNullableString(payload.origin_signal_id),
  editorial_status: asString(payload.editorial_status, "draft"),
  review_notes: asNullableString(payload.review_notes),
  translated_from_post_id: asNullableString(payload.translated_from_post_id),
});

const mapJobPayload = (payload: Record<string, unknown>) => ({
  slug: asString(payload.slug),
  title: asString(payload.title),
  summary_fr: asString(payload.summary_fr),
  summary_en: asString(payload.summary_en),
  market_key: asString(payload.market_key),
  source_name: asString(payload.source_name),
  source_url: asNullableString(payload.source_url),
  apply_url: asNullableString(payload.apply_url),
  location_fr: asString(payload.location_fr),
  location_en: asString(payload.location_en),
  work_mode: asString(payload.work_mode, "remote"),
  opportunity_type: asString(payload.opportunity_type, "job"),
  compensation_label: asNullableString(payload.compensation_label),
  published_at: asString(payload.published_at) || new Date().toISOString(),
  is_featured: asBoolean(payload.is_featured),
  is_new_manual: asBoolean(payload.is_new_manual),
  status: asString(payload.status, "draft"),
});

const mapFeedPayload = (payload: Record<string, unknown>) => ({
  name: asString(payload.name),
  url: asString(payload.url),
  feed_type: asString(payload.feed_type, "rss"),
  publisher: asNullableString(payload.publisher),
  country_focus: asNullableString(payload.country_focus),
  region_focus: asNullableString(payload.region_focus),
  domain_focus: asNullableString(payload.domain_focus),
  language: asString(payload.language, "fr"),
  trust_score: asNumber(payload.trust_score) ?? 50,
  is_active: payload.is_active !== false,
  notes: asNullableString(payload.notes),
});

const mapNewsletterPayload = (payload: Record<string, unknown>) => ({
  issue_date: asString(payload.issue_date) || new Date().toISOString().slice(0, 10),
  language: asString(payload.language, "fr"),
  status: asString(payload.status, "draft"),
  title: asString(payload.title),
  subject: asString(payload.subject),
  preheader: asNullableString(payload.preheader),
  intro: asNullableString(payload.intro),
  target_domains: asStringArray(payload.target_domains),
  highlight_title: asNullableString(payload.highlight_title),
  highlight_summary: asNullableString(payload.highlight_summary),
  highlight_url: asNullableString(payload.highlight_url),
  tip_title: asNullableString(payload.tip_title),
  tip_body: asNullableString(payload.tip_body),
  tool_name: asNullableString(payload.tool_name),
  tool_category: asNullableString(payload.tool_category),
  tool_summary: asNullableString(payload.tool_summary),
  prompt_title: asNullableString(payload.prompt_title),
  prompt_body: asNullableString(payload.prompt_body),
  cta_label: asNullableString(payload.cta_label),
  cta_url: asNullableString(payload.cta_url),
  body_markdown: asNullableString(payload.body_markdown),
  body_html: asNullableString(payload.body_html),
  source_post_ids: asStringArray(payload.source_post_ids),
  generation_source: asString(payload.generation_source, "manual"),
  generation_notes: asNullableString(payload.generation_notes),
  scheduled_for: asNullableString(payload.scheduled_for),
  approved_at: asNullableString(payload.approved_at),
  sent_at: asNullableString(payload.sent_at),
  last_test_sent_at: asNullableString(payload.last_test_sent_at),
  recipient_count: asNumber(payload.recipient_count) ?? 0,
  send_count: asNumber(payload.send_count) ?? 0,
  meta: asJson(payload.meta),
});

const listResources = async () =>
  supabase
    .from("resource_posts")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(20);

const createResource = async (payload: Record<string, unknown>) =>
  supabase.from("resource_posts").insert(mapResourcePayload(payload)).select("*").single();

const setResourceStatus = async (payload: Record<string, unknown>) => {
  const nextStatus = asString(payload.status);
  const nextEditorialStatus = asNullableString(payload.editorial_status);

  return supabase
    .from("resource_posts")
    .update({
      status: nextStatus,
      ...(nextEditorialStatus ? { editorial_status: nextEditorialStatus } : {}),
      review_notes: asNullableString(payload.review_notes),
    })
    .eq("id", asString(payload.id))
    .select("*")
    .single();
};

const listJobs = async () =>
  supabase
    .from("job_opportunities")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(20);

const createJob = async (payload: Record<string, unknown>) =>
  supabase.from("job_opportunities").insert(mapJobPayload(payload)).select("*").single();

const setJobStatus = async (payload: Record<string, unknown>) =>
  supabase
    .from("job_opportunities")
    .update({ status: asString(payload.status) })
    .eq("id", asString(payload.id))
    .select("*")
    .single();

const buildDateBuckets = (days: number) => {
  const buckets: string[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - offset);
    buckets.push(date.toISOString().slice(0, 10));
  }

  return buckets;
};

const sortByCountDesc = ([leftLabel, leftCount]: [string, number], [rightLabel, rightCount]: [string, number]) =>
  rightCount - leftCount || leftLabel.localeCompare(rightLabel);

const listAnalytics = async () => {
  const now = new Date();
  const daysAgo = (days: number) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - days);
    return date.toISOString();
  };

  const thirtyDaysAgo = daysAgo(29);
  const ninetyDaysAgo = daysAgo(89);

  const [
    pageViewsTotal,
    pageViewsRecent,
    contactRequestsTotal,
    contactRequestsRecent,
    registrationRequestsTotal,
    registrationRequestsRecent,
  ] = await Promise.all([
    supabase.from("page_views").select("id", { count: "exact", head: true }),
    supabase.from("page_views").select("page_path, visited_at").gte("visited_at", ninetyDaysAgo),
    supabase.from("contact_requests").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_requests")
      .select("created_at, request_intent, requested_domain, requested_formations")
      .gte("created_at", ninetyDaysAgo),
    supabase.from("registration_requests").select("id", { count: "exact", head: true }),
    supabase
      .from("registration_requests")
      .select("created_at, formation_title")
      .gte("created_at", ninetyDaysAgo),
  ]);

  const resultList = [
    pageViewsTotal,
    pageViewsRecent,
    contactRequestsTotal,
    contactRequestsRecent,
    registrationRequestsTotal,
    registrationRequestsRecent,
  ];

  const failingResult = resultList.find((result) => result.error);

  if (failingResult?.error) {
    return { data: null, error: failingResult.error };
  }

  const pageViews = pageViewsRecent.data ?? [];
  const contactRequests = contactRequestsRecent.data ?? [];
  const registrationRequests = registrationRequestsRecent.data ?? [];

  const trendDays = buildDateBuckets(7);
  const contactIntentCounts = new Map<string, number>();
  const domainCounts = new Map<string, number>();
  const pageCounts = new Map<string, number>();
  const formationCounts = new Map<string, number>();
  const pageViewsTrend = new Map<string, number>();
  const contactTrend = new Map<string, number>();
  const registrationTrend = new Map<string, number>();

  for (const day of trendDays) {
    pageViewsTrend.set(day, 0);
    contactTrend.set(day, 0);
    registrationTrend.set(day, 0);
  }

  for (const view of pageViews) {
    const day = view.visited_at?.slice(0, 10);
    const pagePath = asString(view.page_path, "/");

    pageCounts.set(pagePath, (pageCounts.get(pagePath) ?? 0) + 1);

    if (day && pageViewsTrend.has(day)) {
      pageViewsTrend.set(day, (pageViewsTrend.get(day) ?? 0) + 1);
    }
  }

  for (const lead of contactRequests) {
    const day = lead.created_at?.slice(0, 10);
    const intentLabel = asString(lead.request_intent, "contact-devis");
    const requestedDomain =
      asString(lead.requested_domain) ||
      asString(lead.requested_formations) ||
      "Non precise";

    contactIntentCounts.set(intentLabel, (contactIntentCounts.get(intentLabel) ?? 0) + 1);
    domainCounts.set(requestedDomain, (domainCounts.get(requestedDomain) ?? 0) + 1);

    if (day && contactTrend.has(day)) {
      contactTrend.set(day, (contactTrend.get(day) ?? 0) + 1);
    }
  }

  for (const registration of registrationRequests) {
    const day = registration.created_at?.slice(0, 10);
    const formationTitle = asString(registration.formation_title, "Formation");

    formationCounts.set(formationTitle, (formationCounts.get(formationTitle) ?? 0) + 1);

    if (day && registrationTrend.has(day)) {
      registrationTrend.set(day, (registrationTrend.get(day) ?? 0) + 1);
    }
  }

  return {
    data: {
      overview: {
        totalPageViews: pageViewsTotal.count ?? 0,
        pageViewsLast30Days: pageViews.filter((view) => view.visited_at && view.visited_at >= thirtyDaysAgo).length,
        totalContactRequests: contactRequestsTotal.count ?? 0,
        contactRequestsLast30Days: contactRequests.filter((lead) => lead.created_at && lead.created_at >= thirtyDaysAgo).length,
        totalRegistrationRequests: registrationRequestsTotal.count ?? 0,
        registrationRequestsLast30Days: registrationRequests.filter((lead) => lead.created_at && lead.created_at >= thirtyDaysAgo).length,
      },
      byIntent: Array.from(contactIntentCounts.entries()).sort(sortByCountDesc).map(([label, count]) => ({ label, count })),
      topDomains: Array.from(domainCounts.entries()).sort(sortByCountDesc).slice(0, 6).map(([label, count]) => ({ label, count })),
      topFormations: Array.from(formationCounts.entries()).sort(sortByCountDesc).slice(0, 6).map(([label, count]) => ({ label, count })),
      topPages: Array.from(pageCounts.entries())
        .filter(([label]) => !label.startsWith("/preview") && !label.startsWith("/back-office"))
        .sort(sortByCountDesc)
        .slice(0, 6)
        .map(([label, count]) => ({ label, count })),
      trend: trendDays.map((day) => ({
        day,
        pageViews: pageViewsTrend.get(day) ?? 0,
        contacts: contactTrend.get(day) ?? 0,
        registrations: registrationTrend.get(day) ?? 0,
      })),
    },
    error: null,
  };
};

const listEditorial = async () => {
  const [feedsResult, signalsResult, draftsResult, jobsResult] = await Promise.all([
    supabase
      .from("source_feeds")
      .select("*")
      .order("is_active", { ascending: false })
      .order("trust_score", { ascending: false })
      .limit(40),
    supabase
      .from("source_signals")
      .select("id, title, url, published_at, status, domain_detected, content_type_detected, priority_score, source_feed_id, review_notes, created_at")
      .order("priority_score", { ascending: false, nullsFirst: false })
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(60),
    supabase
      .from("resource_posts")
      .select("id, slug, title_fr, sector_key, editorial_status, status, published_at, origin_signal_id, review_notes")
      .in("editorial_status", ["draft", "review", "approved"])
      .order("published_at", { ascending: false })
      .limit(40),
    supabase
      .from("editorial_jobs")
      .select("id, job_type, provider, status, created_at, source_signal_id, resource_post_id, error_message")
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  const resultList = [feedsResult, signalsResult, draftsResult, jobsResult];
  const failingResult = resultList.find((result) => result.error);

  if (failingResult?.error) {
    return { data: null, error: failingResult.error };
  }

  return {
    data: {
      feeds: feedsResult.data ?? [],
      signals: signalsResult.data ?? [],
      drafts: draftsResult.data ?? [],
      jobs: jobsResult.data ?? [],
    },
    error: null,
  };
};

const createEditorialFeed = async (payload: Record<string, unknown>) =>
  supabase.from("source_feeds").insert(mapFeedPayload(payload)).select("*").single();

const setEditorialStatus = async (payload: Record<string, unknown>) => {
  const kind = asString(payload.kind);
  const id = asString(payload.id);
  const nextStatus = asString(payload.status);
  const reviewNotes = asNullableString(payload.review_notes);

  if (kind === "signal") {
    return supabase
      .from("source_signals")
      .update({
        status: nextStatus,
        review_notes: reviewNotes,
      })
      .eq("id", id)
      .select("*")
      .single();
  }

  if (kind === "draft") {
    const mappedPostStatus =
      nextStatus === "published"
        ? "published"
        : nextStatus === "archived"
          ? "archived"
          : "draft";

    const result = await supabase
      .from("resource_posts")
      .update({
        editorial_status: nextStatus,
        status: mappedPostStatus,
        review_notes: reviewNotes,
      })
      .eq("id", id)
      .select("*")
      .single();

    const originSignalId = asNullableString(payload.origin_signal_id);

    if (!result.error && originSignalId) {
      await supabase
        .from("source_signals")
        .update({
          status: nextStatus === "published" ? "published" : nextStatus === "archived" ? "rejected" : "drafted",
          review_notes: reviewNotes,
        })
        .eq("id", originSignalId);
    }

    return result;
  }

  return { data: null, error: { message: "Unsupported editorial status target." } };
};

const listNewsletters = async () => {
  const [issuesResult, subscriptionsResult, deliveriesResult] = await Promise.all([
    supabase
      .from("newsletter_issues")
      .select("*")
      .order("issue_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(24),
    supabase
      .from("newsletter_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("newsletter_delivery_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const resultList = [issuesResult, subscriptionsResult, deliveriesResult];
  const failingResult = resultList.find((result) => result.error);

  if (failingResult?.error) {
    return { data: null, error: failingResult.error };
  }

  const issues = issuesResult.data ?? [];
  const deliveries = deliveriesResult.data ?? [];

  return {
    data: {
      overview: {
        activeSubscriptions: subscriptionsResult.count ?? 0,
        totalIssues: issues.length,
        draftIssues: issues.filter((issue) => ["draft", "review", "approved", "scheduled"].includes(issue.status)).length,
        sentIssues: issues.filter((issue) => issue.status === "sent").length,
      },
      issues,
      deliveries,
    },
    error: null,
  };
};

const createNewsletter = async (payload: Record<string, unknown>) =>
  supabase
    .from("newsletter_issues")
    .insert(mapNewsletterPayload(payload))
    .select("*")
    .single();

const saveNewsletter = async (payload: Record<string, unknown>) =>
  supabase
    .from("newsletter_issues")
    .update(mapNewsletterPayload(payload))
    .eq("id", asString(payload.id))
    .select("*")
    .single();

const setNewsletterStatus = async (payload: Record<string, unknown>) => {
  const status = asString(payload.status, "draft");
  const now = new Date().toISOString();

  return supabase
    .from("newsletter_issues")
    .update({
      status,
      scheduled_for: asNullableString(payload.scheduled_for),
      approved_at: status === "approved" ? now : status === "draft" ? null : undefined,
    })
    .eq("id", asString(payload.id))
    .select("*")
    .single();
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!supabaseUrl || !serviceRoleKey || !adminToken) {
    return json(500, { error: "Missing Supabase or admin configuration." });
  }

  if (!requireAdmin(request)) {
    return json(401, { error: "Unauthorized." });
  }

  let body: { entity?: string; action?: string; payload?: Record<string, unknown> } = {};

  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const entity = body.entity;
  const action = body.action;
  const payload = body.payload ?? {};

  let result:
    | { data: unknown; error: { message?: string } | null }
    | null = null;

  if (entity === "resource" && action === "list") result = await listResources();
  if (entity === "resource" && action === "create") result = await createResource(payload);
  if (entity === "resource" && action === "set-status") result = await setResourceStatus(payload);
  if (entity === "job" && action === "list") result = await listJobs();
  if (entity === "job" && action === "create") result = await createJob(payload);
  if (entity === "job" && action === "set-status") result = await setJobStatus(payload);
  if (entity === "analytics" && action === "list") result = await listAnalytics();
  if (entity === "editorial" && action === "list") result = await listEditorial();
  if (entity === "editorial" && action === "create-feed") result = await createEditorialFeed(payload);
  if (entity === "editorial" && action === "set-status") result = await setEditorialStatus(payload);
  if (entity === "newsletter" && action === "list") result = await listNewsletters();
  if (entity === "newsletter" && action === "create") result = await createNewsletter(payload);
  if (entity === "newsletter" && action === "save") result = await saveNewsletter(payload);
  if (entity === "newsletter" && action === "set-status") result = await setNewsletterStatus(payload);

  if (!result) {
    return json(400, { error: "Unsupported admin action." });
  }

  if (result.error) {
    return json(400, { error: result.error.message ?? "Admin action failed." });
  }

  return json(200, { data: result.data });
});
