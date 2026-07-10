import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";
import { formatIssueDate } from "../_shared/newsletter.ts";

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

const requireAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token") ?? "";
  return CONTENT_ADMIN_TOKEN.length > 0 && token === CONTENT_ADMIN_TOKEN;
};

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

const formatIssueDateFr = (issueDate: string | null | undefined) => {
  if (!issueDate) return "date non définie";
  return formatIssueDate(issueDate);
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

const sendReminderEmail = async (subject: string, html: string, recipients = REVIEW_REMINDER_RECIPIENTS) => {
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
      to: recipients,
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

const supportedLanguages = ["fr", "en"] as const;

const runDraftWeekly = async (options: { autoPublish?: boolean } = {}) => {
  const issueDate = todayIsoDate();
  const targetDomains = await getTopSubscribedDomains();
  const results: Array<Record<string, unknown>> = [];

  for (const language of supportedLanguages) {
    const { data: existingIssue, error: existingIssueError } = await editorialClient
      .from("newsletter_issues")
      .select("id, title, status, language")
      .eq("issue_date", issueDate)
      .eq("language", language)
      .in("status", ["draft", "review", "approved", "scheduled", "sent"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingIssueError) {
      throw existingIssueError;
    }

    if (existingIssue) {
      results.push({
        language,
        skipped: true,
        reason: "issue_already_exists",
        issue: existingIssue,
      });
      continue;
    }

    const result = await invokeEdgeFunction("newsletter-drafter", {
      issue_date: issueDate,
      language,
      target_domains: targetDomains,
      auto_publish: options.autoPublish === true,
    });

    results.push({
      language,
      skipped: false,
      result,
    });
  }

  return {
    action: "draft-weekly",
    skipped: results.every((result) => result.skipped === true),
    autoPublish: options.autoPublish === true,
    targetDomains,
    results,
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

const runReviewReminder = async (options: { issueId?: string; testEmail?: string } = {}) => {
  let pendingIssuesQuery = editorialClient
    .from("newsletter_issues")
    .select("id, title, status, issue_date, created_at, updated_at")
    .in("language", [...supportedLanguages])
    .is("sent_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  if (options.issueId) {
    pendingIssuesQuery = pendingIssuesQuery.eq("id", options.issueId);
  } else {
    pendingIssuesQuery = pendingIssuesQuery.in("status", ["draft", "review"]);
  }

  const { data: pendingIssues, error } = await pendingIssuesQuery;

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
  const reviewUrl = `https://www.transferai.ci/back-office/newsletters?issue=${pendingIssue.id}&mode=email`;
  const subjectPrefix = options.testEmail ? "[TEST] " : "";
  const subject = `${subjectPrefix}[Newsletter] Validation requise avant vendredi — ${pendingIssue.title}`;
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
        ${options.testEmail ? `<p style="margin:0 0 14px;color:#475467;"><strong>Mode test :</strong> ce rappel vous a été renvoyé manuellement pour vérification du parcours de review.</p>` : ""}
        <p style="margin:0 0 14px;color:#475467;">Action attendue aujourd'hui : ouvrir cette newsletter, la modifier si besoin, ajouter de nouveaux éléments, enregistrer vos changements, envoyer un test si nécessaire, puis utiliser les actions <strong>Approuver</strong>, <strong>Régénérer</strong> ou <strong>Rejeter</strong> selon votre décision avant l'envoi automatique du vendredi.</p>
        <p style="margin:24px 0 0;">
          <a href="${reviewUrl}" style="display:inline-block;background:#f28c28;color:#ffffff;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700;">
            Ouvrir et éditer la newsletter
          </a>
        </p>
      </div>
    </div>
  `;

  await sendReminderEmail(subject, html, options.testEmail ? [options.testEmail] : REVIEW_REMINDER_RECIPIENTS);

  return {
    action: "review-reminder",
    skipped: false,
    issue: pendingIssue,
    recipients: options.testEmail ? [options.testEmail] : REVIEW_REMINDER_RECIPIENTS,
  };
};

const runSendApproved = async () => {
  const now = new Date().toISOString();

  const { data: dueIssues, error } = await editorialClient
    .from("newsletter_issues")
    .select("id, title, status, scheduled_for, issue_date, send_count, sent_at, language")
    .in("language", [...supportedLanguages])
    .in("status", ["approved", "scheduled"])
    .is("sent_at", null)
    .order("scheduled_for", { ascending: true, nullsFirst: false })
    .order("issue_date", { ascending: true })
    .order("language", { ascending: true })
    .limit(10);

  if (error) {
    throw error;
  }

  const readyIssues = (dueIssues ?? []).filter((issue) => {
    if (issue.send_count && issue.send_count > 0) {
      return false;
    }

    if (issue.scheduled_for) {
      return issue.scheduled_for <= now;
    }

    return issue.issue_date <= todayIsoDate();
  });

  if (readyIssues.length === 0) {
    return {
      action: "send-approved",
      skipped: true,
      reason: "no_due_issue",
    };
  }

  const sentIssues: Array<Record<string, unknown>> = [];

  for (const dueIssue of readyIssues) {
    const result = await invokeEdgeFunction("newsletter-send", {
      issue_id: dueIssue.id,
    });

    sentIssues.push({
      issue: dueIssue,
      result,
    });
  }

  return {
    action: "send-approved",
    skipped: false,
    sentIssues,
  };
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !CONTENT_ADMIN_TOKEN) {
    return json(500, { error: "Missing scheduler configuration." });
  }

  if (!requireScheduler(request) && !requireAdmin(request)) {
    return json(401, { error: "Unauthorized." });
  }

  let body: { action?: string; issue_id?: string; test_email?: string } = {};

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
      return json(200, {
        data: await runReviewReminder({
          issueId: body.issue_id,
          testEmail: body.test_email,
        }),
      });
    }

    return json(400, { error: "Unsupported action." });
  } catch (error) {
    return json(400, { error: error instanceof Error ? error.message : "newsletter_scheduler_failed" });
  }
});
