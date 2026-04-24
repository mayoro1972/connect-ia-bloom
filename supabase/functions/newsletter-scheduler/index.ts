import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const CONTENT_ADMIN_TOKEN = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";
const NEWSLETTER_SCHEDULER_TOKEN = Deno.env.get("NEWSLETTER_SCHEDULER_TOKEN") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const MAIL_FROM = Deno.env.get("MAIL_FROM") ?? "TransferAI Africa <contact@transferai.ci>";
const REVIEW_REMINDER_RECIPIENTS = ["contact@transferai.ci", "marius.ayoro70@gmail.com"];

const requireScheduler = (request: Request) => {
  // Accept either the explicit scheduler token OR a valid service_role bearer (used by pg_cron)
  const token = request.headers.get("x-scheduler-token") ?? "";
  if (NEWSLETTER_SCHEDULER_TOKEN.length > 0 && token === NEWSLETTER_SCHEDULER_TOKEN) {
    return true;
  }
  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Bearer ") && SUPABASE_SERVICE_ROLE_KEY.length > 0) {
    return authHeader.slice(7) === SUPABASE_SERVICE_ROLE_KEY;
  }
  return false;
};

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

const formatIssueDateFr = (issueDate: string | null | undefined) => {
  if (!issueDate) return "date non définie";
  const date = new Date(`${issueDate}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? issueDate
    : date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
};

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

const sendReminderEmail = async (subject: string, html: string) => {
  if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: REVIEW_REMINDER_RECIPIENTS,
      subject,
      html,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data?.message === "string" ? data.message : `review_reminder_failed_${response.status}`);
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

const runDraftWeekly = async (options: { autoPublish?: boolean } = {}) => {
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
    auto_publish: options.autoPublish === true,
  });

  return {
    action: "draft-weekly",
    skipped: false,
    autoPublish: options.autoPublish === true,
    targetDomains,
    result,
  };
};

const runWeeklyAuto = async () => {
  const draftResult = await runDraftWeekly({ autoPublish: true });
  // Immediately try to send if a fresh approved issue exists
  const sendResult = await runSendApproved();
  return {
    action: "weekly-auto",
    draft: draftResult,
    send: sendResult,
  };
};

const runReviewReminder = async () => {
  const { data: pendingIssues, error } = await editorialClient
    .from("newsletter_issues")
    .select("id, title, status, issue_date, created_at, updated_at")
    .eq("language", "fr")
    .in("status", ["draft", "review"])
    .is("sent_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw error;
  }

  const pendingIssue = (pendingIssues ?? [])[0];

  if (!pendingIssue) {
    return {
      action: "review-reminder",
      skipped: true,
      reason: "no_pending_review_issue",
    };
  }

  const issueDateLabel = formatIssueDateFr(pendingIssue.issue_date);
  const reviewUrl = "https://www.transferai.ci/back-office";
  const subject = `[Newsletter] Validation requise avant vendredi — ${pendingIssue.title}`;
  const html = `
    <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#101828;">Rappel de validation newsletter</h1>
        <p style="margin:0 0 14px;color:#475467;">Une édition hebdomadaire attend encore une validation humaine avant l'envoi prévu vendredi.</p>
        <div style="padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;margin:18px 0;">
          <p style="margin:0 0 10px;color:#101828;"><strong>Titre :</strong> ${pendingIssue.title}</p>
          <p style="margin:0 0 10px;color:#101828;"><strong>Date d'édition :</strong> ${issueDateLabel}</p>
          <p style="margin:0;color:#101828;"><strong>Statut actuel :</strong> ${pendingIssue.status}</p>
        </div>
        <p style="margin:0 0 14px;color:#475467;">Action attendue aujourd'hui : relire le brouillon, envoyer un test si nécessaire, puis passer l'édition en <strong>approved</strong> ou <strong>scheduled</strong> pour autoriser l'envoi automatique du vendredi.</p>
        <p style="margin:24px 0 0;">
          <a href="${reviewUrl}" style="display:inline-block;background:#f28c28;color:#ffffff;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700;">
            Ouvrir le back-office
          </a>
        </p>
      </div>
    </div>
  `;

  await sendReminderEmail(subject, html);

  return {
    action: "review-reminder",
    skipped: false,
    issue: pendingIssue,
    recipients: REVIEW_REMINDER_RECIPIENTS,
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

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !CONTENT_ADMIN_TOKEN) {
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

    if (action === "weekly-auto") {
      return json(200, { data: await runWeeklyAuto() });
    }

    if (action === "review-reminder") {
      return json(200, { data: await runReviewReminder() });
    }

    return json(400, { error: "Unsupported action." });
  } catch (error) {
    return json(400, { error: error instanceof Error ? error.message : "newsletter_scheduler_failed" });
  }
});
