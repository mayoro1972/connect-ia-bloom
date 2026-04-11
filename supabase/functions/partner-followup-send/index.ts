import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const MAIL_FROM = Deno.env.get("MAIL_FROM") ?? "TransferAI Africa <contact@transferai.ci>";
const adminToken = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";

const requireAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token") ?? "";
  return adminToken.length > 0 && token === adminToken;
};

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : fallback);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const paragraphize = (value: string) =>
  value
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p style="margin:0 0 12px;color:#344054;">${escapeHtml(line)}</p>`)
    .join("");

const sendEmail = async (to: string, subject: string, html: string) => {
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
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend request failed with ${response.status}`);
  }

  const data = await response.json().catch(() => ({}));
  return typeof data?.id === "string" ? data.id : null;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!requireAdmin(request)) {
    return json(401, { error: "Unauthorized." });
  }

  let body: { review_id?: string; test_email?: string; dry_run?: boolean } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const reviewId = asString(body.review_id);
  const testEmail = asString(body.test_email);
  const dryRun = body.dry_run === true;

  if (!reviewId) {
    return json(400, { error: "Missing review_id." });
  }

  try {
    const { data: review, error: reviewError } = await editorialClient
      .from("partner_listing_reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (reviewError || !review) {
      throw reviewError ?? new Error("Partner review not found.");
    }

    const recipient = testEmail || review.prospect_email;
    const subject = review.response_email_subject || "Suite à votre demande de référencement sur TransferAI Africa";
    const bodyFr = review.response_email_body_fr || "";

    if (!recipient || !bodyFr.trim()) {
      throw new Error("Missing recipient or response_email_body_fr.");
    }

    const html = `
      <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
        <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e4e7ec;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
          <h1 style="margin:0 0 24px;font-size:34px;line-height:1.15;color:#101828;">${escapeHtml(subject)}</h1>
          ${paragraphize(bodyFr)}
        </div>
      </div>
    `;

    const jobPayload = {
      partner_listing_review_id: reviewId,
      job_type: "partner_followup",
      job_status: dryRun ? "cancelled" : "running",
      provider: "resend",
      scheduled_for: new Date().toISOString(),
      payload: {
        recipient,
        mode: testEmail ? "test" : "live",
      },
    };

    const { data: job, error: jobError } = await editorialClient
      .from("partner_followup_jobs")
      .insert(jobPayload)
      .select("*")
      .single();

    if (jobError || !job) {
      throw jobError ?? new Error("Unable to create followup job.");
    }

    if (dryRun) {
      return json(200, { data: { review_id: reviewId, recipient, sent: false } });
    }

    const providerMessageId = await sendEmail(recipient, subject, html);

    await editorialClient
      .from("partner_followup_jobs")
      .update({
        job_status: "sent",
        sent_at: new Date().toISOString(),
        provider_message_id: providerMessageId,
        attempt_count: 1,
      })
      .eq("id", job.id);

    await editorialClient
      .from("partner_listing_reviews")
      .update({
        review_status: "sent",
        response_sent_at: new Date().toISOString(),
      })
      .eq("id", reviewId);

    const { data: refreshedReview, error: refreshedError } = await editorialClient
      .from("partner_listing_reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (refreshedError || !refreshedReview) {
      throw refreshedError ?? new Error("Partner review refresh failed.");
    }

    return json(200, {
      data: {
        review: refreshedReview,
        recipient,
        provider_message_id: providerMessageId,
      },
    });
  } catch (error) {
    return json(400, {
      error: error instanceof Error ? error.message : "partner_followup_send_failed",
    });
  }
});
