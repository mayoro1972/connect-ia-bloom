import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const CONTENT_ADMIN_TOKEN = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";
const NEWSLETTER_SCHEDULER_TOKEN = Deno.env.get("NEWSLETTER_SCHEDULER_TOKEN") ?? "";

const requireScheduler = (request: Request) => {
  const token = request.headers.get("x-scheduler-token") ?? "";
  return NEWSLETTER_SCHEDULER_TOKEN.length > 0 && token === NEWSLETTER_SCHEDULER_TOKEN;
};

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

const invokeEdgeFunction = async (functionName: string, payload: Record<string, unknown>) => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "x-admin-token": CONTENT_ADMIN_TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : `${functionName}_failed`);
  }

  return data;
};

const getTopSubscribedDomains = async () => {
  const { data, error } = await editorialClient
    .from("newsletter_subscriptions")
    .select("subscribed_domains")
    .eq("status", "active");

  if (error) {
    throw error;
  }

  const counts = new Map<string, number>();

  for (const row of data ?? []) {
    for (const domain of row.subscribed_domains ?? []) {
      counts.set(domain, (counts.get(domain) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 4)
    .map(([domain]) => domain);
};

const runDraftWeekly = async () => {
  const issueDate = todayIsoDate();

  const { data: existingIssue, error: existingIssueError } = await editorialClient
    .from("newsletter_issues")
    .select("id, title, status")
    .eq("issue_date", issueDate)
    .eq("language", "fr")
    .in("status", ["draft", "review", "approved", "scheduled", "sent"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingIssueError) {
    throw existingIssueError;
  }

  if (existingIssue) {
    return {
      action: "draft-weekly",
      skipped: true,
      reason: "issue_already_exists",
      issue: existingIssue,
    };
  }

  const targetDomains = await getTopSubscribedDomains();
  const result = await invokeEdgeFunction("newsletter-drafter", {
    issue_date: issueDate,
    language: "fr",
    target_domains: targetDomains,
  });

  return {
    action: "draft-weekly",
    skipped: false,
    targetDomains,
    result,
  };
};

const runSendApproved = async () => {
  const now = new Date().toISOString();

  const { data: dueIssues, error } = await editorialClient
    .from("newsletter_issues")
    .select("id, title, status, scheduled_for, issue_date, send_count, sent_at")
    .eq("language", "fr")
    .in("status", ["approved", "scheduled"])
    .is("sent_at", null)
    .order("scheduled_for", { ascending: true, nullsFirst: false })
    .order("issue_date", { ascending: true })
    .limit(5);

  if (error) {
    throw error;
  }

  const dueIssue = (dueIssues ?? []).find((issue) => {
    if (issue.send_count && issue.send_count > 0) {
      return false;
    }

    if (issue.scheduled_for) {
      return issue.scheduled_for <= now;
    }

    return issue.issue_date <= todayIsoDate();
  });

  if (!dueIssue) {
    return {
      action: "send-approved",
      skipped: true,
      reason: "no_due_issue",
    };
  }

  const result = await invokeEdgeFunction("newsletter-send", {
    issue_id: dueIssue.id,
  });

  return {
    action: "send-approved",
    skipped: false,
    issue: dueIssue,
    result,
  };
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !CONTENT_ADMIN_TOKEN || !NEWSLETTER_SCHEDULER_TOKEN) {
    return json(500, { error: "Missing scheduler configuration." });
  }

  if (!requireScheduler(request)) {
    return json(401, { error: "Unauthorized." });
  }

  let body: { action?: string } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const action = body.action ?? "draft-weekly";

  try {
    if (action === "draft-weekly") {
      return json(200, { data: await runDraftWeekly() });
    }

    if (action === "send-approved") {
      return json(200, { data: await runSendApproved() });
    }

    return json(400, { error: "Unsupported action." });
  } catch (error) {
    return json(400, { error: error instanceof Error ? error.message : "newsletter_scheduler_failed" });
  }
});
