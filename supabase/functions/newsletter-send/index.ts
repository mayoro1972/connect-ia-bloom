import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";
import { domainsIntersect, normalizeDomains, renderNewsletterHtml, type NewsletterIssueRecord } from "../_shared/newsletter.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const MAIL_FROM = Deno.env.get("MAIL_FROM") ?? "TransferAI Africa <newsletter@transferai.ci>";
const adminToken = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";

const requireAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token") ?? "";
  return adminToken.length > 0 && token === adminToken;
};

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : fallback);

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

  let body: { issue_id?: string; test_email?: string; dry_run?: boolean } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const issueId = asString(body.issue_id);
  const testEmail = asString(body.test_email);
  const dryRun = body.dry_run === true;

  if (!issueId) {
    return json(400, { error: "Missing issue_id." });
  }

  const { data: job } = await editorialClient
    .from("editorial_jobs")
    .insert({
      job_type: "newsletter_send",
      provider: "resend",
      model: null,
      input_payload: {
        issueId,
        testEmail: testEmail || null,
        dryRun,
      },
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  try {
    const { data: issue, error: issueError } = await editorialClient
      .from("newsletter_issues")
      .select("*")
      .eq("id", issueId)
      .single();

    if (issueError || !issue) {
      throw issueError ?? new Error("Newsletter issue not found.");
    }

    const issueRecord = issue as NewsletterIssueRecord & {
      body_html: string | null;
      source_post_ids: string[];
      send_count: number;
      recipient_count: number;
    };

    const html = issueRecord.body_html?.trim() || renderNewsletterHtml(issueRecord);

    if (testEmail) {
      if (!dryRun) {
        const providerMessageId = await sendEmail(testEmail, `[TEST] ${issueRecord.subject}`, html);

        await editorialClient.from("newsletter_delivery_logs").insert({
          newsletter_issue_id: issueRecord.id,
          recipient_email: testEmail,
          delivery_type: "test",
          status: "sent",
          provider: "resend",
          provider_message_id: providerMessageId,
          language: issueRecord.language,
          subscribed_domains: issueRecord.target_domains,
          sent_at: new Date().toISOString(),
        });

        await editorialClient
          .from("newsletter_issues")
          .update({
            last_test_sent_at: new Date().toISOString(),
          })
          .eq("id", issueRecord.id);
      }

      if (job?.id) {
        await editorialClient
          .from("editorial_jobs")
          .update({
            status: "done",
            output_payload: { sent: !dryRun, testEmail },
            finished_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }

      return json(200, { data: { mode: "test", email: testEmail, sent: !dryRun } });
    }

    const { data: subscriptions, error: subscriptionsError } = await editorialClient
      .from("newsletter_subscriptions")
      .select("email, language, subscribed_domains")
      .eq("status", "active");

    if (subscriptionsError) {
      throw subscriptionsError;
    }

    const recipients = (subscriptions ?? []).filter((subscription) => {
      if (subscription.language !== issueRecord.language) {
        return false;
      }

      const subscriberDomains = normalizeDomains(subscription.subscribed_domains);
      if (issueRecord.target_domains.length === 0) {
        return true;
      }

      return domainsIntersect(issueRecord.target_domains, subscriberDomains);
    });

    if (dryRun) {
      if (job?.id) {
        await editorialClient
          .from("editorial_jobs")
          .update({
            status: "done",
            output_payload: { recipients: recipients.length, sent: false },
            finished_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }

      return json(200, { data: { mode: "campaign", recipients: recipients.length, sent: false } });
    }

    await editorialClient
      .from("newsletter_issues")
      .update({ status: "sending" })
      .eq("id", issueRecord.id);

    let sentCount = 0;

    for (const recipient of recipients) {
      try {
        const providerMessageId = await sendEmail(recipient.email, issueRecord.subject, html);

        await editorialClient.from("newsletter_delivery_logs").insert({
          newsletter_issue_id: issueRecord.id,
          recipient_email: recipient.email,
          delivery_type: "campaign",
          status: "sent",
          provider: "resend",
          provider_message_id: providerMessageId,
          language: issueRecord.language,
          subscribed_domains: normalizeDomains(recipient.subscribed_domains),
          sent_at: new Date().toISOString(),
        });

        sentCount += 1;
      } catch (deliveryError) {
        await editorialClient.from("newsletter_delivery_logs").insert({
          newsletter_issue_id: issueRecord.id,
          recipient_email: recipient.email,
          delivery_type: "campaign",
          status: "failed",
          provider: "resend",
          language: issueRecord.language,
          subscribed_domains: normalizeDomains(recipient.subscribed_domains),
          error_message: deliveryError instanceof Error ? deliveryError.message : "newsletter_send_failed",
        });
      }
    }

    await editorialClient
      .from("newsletter_issues")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipient_count: sentCount,
        send_count: (issueRecord.send_count ?? 0) + 1,
      })
      .eq("id", issueRecord.id);

    if (job?.id) {
      await editorialClient
        .from("editorial_jobs")
        .update({
          status: "done",
          output_payload: { recipients: recipients.length, sent: sentCount },
          finished_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    return json(200, { data: { mode: "campaign", recipients: recipients.length, sent: sentCount } });
  } catch (error) {
    if (job?.id) {
      await editorialClient
        .from("editorial_jobs")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : "newsletter_send_failed",
          finished_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    return json(400, { error: error instanceof Error ? error.message : "newsletter_send_failed" });
  }
});
