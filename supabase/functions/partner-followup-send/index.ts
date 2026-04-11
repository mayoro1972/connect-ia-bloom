import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";
import { getEmailGreeting, replaceLeadingGreeting } from "../_shared/email-greetings.ts";

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

const renderRichBody = (value: string) => {
  const lines = value.split(/\r?\n/).map((line) => line.trim());
  const blocks: string[] = [];
  let paragraphBuffer: string[] = [];
  let bulletBuffer: string[] = [];

  const flushParagraphs = () => {
    if (paragraphBuffer.length === 0) return;
    blocks.push(
      `<p style="margin:0 0 16px;color:#344054;font-size:16px;line-height:1.75;">${escapeHtml(paragraphBuffer.join(" "))}</p>`,
    );
    paragraphBuffer = [];
  };

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    blocks.push(
      `<ul style="margin:0 0 20px;padding-left:22px;color:#344054;">${bulletBuffer
        .map((item) => `<li style="margin:0 0 10px;line-height:1.7;">${escapeHtml(item)}</li>`)
        .join("")}</ul>`,
    );
    bulletBuffer = [];
  };

  for (const line of lines) {
    if (!line) {
      flushParagraphs();
      flushBullets();
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraphs();
      bulletBuffer.push(line.slice(2).trim());
      continue;
    }

    flushBullets();
    paragraphBuffer.push(line);
  }

  flushParagraphs();
  flushBullets();

  return blocks.join("");
};

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
    const subject = review.response_email_subject || "Votre demande de référencement a été étudiée | TransferAI Africa";
    const rawBodyFr = review.response_email_body_fr || "";

    if (!recipient || !rawBodyFr.trim()) {
      throw new Error("Missing recipient or response_email_body_fr.");
    }

    const bodyFr = replaceLeadingGreeting(
      rawBodyFr,
      getEmailGreeting("fr", review.prospect_name),
    );

    const html = `
      <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
        <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:22px;padding:36px;border:1px solid #e4e7ec;box-shadow:0 12px 32px rgba(15,23,42,0.06);">
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#f28c28;font-weight:700;">TransferAI Africa</p>
          <h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;color:#101828;font-weight:800;">${escapeHtml(subject)}</h1>
          <p style="margin:0 0 28px;color:#667085;font-size:14px;line-height:1.7;">Réponse éditoriale et proposition de présence partenaire</p>
          <div style="border-top:1px solid #eef2f6;padding-top:24px;">
            ${renderRichBody(bodyFr)}
          </div>
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
        response_email_body_fr: bodyFr,
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
