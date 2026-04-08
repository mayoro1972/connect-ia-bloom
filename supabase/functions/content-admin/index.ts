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
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
};

const mapResourcePayload = (payload: Record<string, unknown>) => ({
  slug: asString(payload.slug),
  category_key: asString(payload.category_key),
  sector_key: asNullableString(payload.sector_key),
  title_fr: asString(payload.title_fr),
  title_en: asString(payload.title_en),
  excerpt_fr: asString(payload.excerpt_fr),
  excerpt_en: asString(payload.excerpt_en),
  read_time_minutes: asNumber(payload.read_time_minutes),
  published_at: asString(payload.published_at) || new Date().toISOString(),
  source_name: asNullableString(payload.source_name),
  source_url: asNullableString(payload.source_url),
  tags: asStringArray(payload.tags),
  is_featured: asBoolean(payload.is_featured),
  is_new_manual: asBoolean(payload.is_new_manual),
  status: asString(payload.status, "draft"),
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

const listResources = async () =>
  supabase
    .from("resource_posts")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(20);

const createResource = async (payload: Record<string, unknown>) =>
  supabase.from("resource_posts").insert(mapResourcePayload(payload)).select("*").single();

const setResourceStatus = async (payload: Record<string, unknown>) =>
  supabase
    .from("resource_posts")
    .update({ status: asString(payload.status) })
    .eq("id", asString(payload.id))
    .select("*")
    .single();

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

  if (!result) {
    return json(400, { error: "Unsupported admin action." });
  }

  if (result.error) {
    return json(400, { error: result.error.message ?? "Admin action failed." });
  }

  return json(200, { data: result.data });
});

