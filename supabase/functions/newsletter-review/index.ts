// Validation d'une newsletter depuis les boutons de l'email [TEST].
// Appelée par la page /newsletter-validation du site : "inspect" affiche l'état,
// "confirm" applique l'action. Autorisation = lien signé (voir _shared/review-links.ts).
import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";
import { type ReviewAction, verifyReviewSignature } from "../_shared/review-links.ts";

const REVIEWABLE_STATUSES = ["draft", "review"];

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  let body: { issue?: string; action?: string; exp?: string | number; sig?: string; step?: string } = {};
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const issueId = typeof body.issue === "string" ? body.issue : "";
  const action = body.action === "approve" || body.action === "reject" ? (body.action as ReviewAction) : null;
  const exp = Number(body.exp);
  const sig = typeof body.sig === "string" ? body.sig : "";
  const step = body.step === "confirm" ? "confirm" : "inspect";

  if (!issueId || !action || !sig) {
    return json(400, { error: "Lien de validation incomplet." });
  }

  const verdict = await verifyReviewSignature(issueId, action, exp, sig);
  if (verdict === "expired") return json(410, { error: "Ce lien de validation a expiré. Utilisez le back-office." });
  if (verdict !== "ok") return json(403, { error: "Lien de validation invalide." });

  const { data: issue, error } = await editorialClient
    .from("newsletter_issues")
    .select("id, title, subject, status, issue_date, scheduled_for, approved_at, sent_at, meta")
    .eq("id", issueId)
    .maybeSingle();

  if (error) return json(500, { error: error.message });
  if (!issue) return json(404, { error: "Newsletter introuvable." });

  const summary = {
    id: issue.id,
    title: issue.title,
    subject: issue.subject,
    status: issue.status,
    issue_date: issue.issue_date,
    scheduled_for: issue.scheduled_for,
  };

  if (step === "inspect") {
    return json(200, { data: { issue: summary, action, actionable: REVIEWABLE_STATUSES.includes(issue.status) } });
  }

  if (!REVIEWABLE_STATUSES.includes(issue.status)) {
    return json(409, { error: `Cette newsletter est déjà au statut « ${issue.status} » : aucune modification.`, data: { issue: summary } });
  }

  const now = new Date().toISOString();
  const meta = (issue.meta && typeof issue.meta === "object" ? issue.meta : {}) as Record<string, unknown>;
  const reviewLog = Array.isArray(meta.review_log) ? meta.review_log : [];

  const { data: updated, error: updateError } = await editorialClient
    .from("newsletter_issues")
    .update({
      status: action === "approve" ? "approved" : "archived",
      approved_at: action === "approve" ? now : null,
      meta: { ...meta, review_log: [...reviewLog, { action, at: now, via: "email-test-link" }] },
    })
    .eq("id", issueId)
    .in("status", REVIEWABLE_STATUSES)
    .select("id, title, subject, status, issue_date, scheduled_for")
    .maybeSingle();

  if (updateError) return json(500, { error: updateError.message });
  if (!updated) return json(409, { error: "Le statut a changé entre-temps : aucune modification." });

  return json(200, { data: { issue: updated, action, done: true } });
});
