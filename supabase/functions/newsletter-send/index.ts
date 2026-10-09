import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";
import { domainsIntersect, normalizeDomains, renderNewsletterHtml, type NewsletterIssueRecord } from "../_shared/newsletter.ts";
import { renderReviewBanner } from "../_shared/review-links.ts";
import { unsubscribeHeaders, unsubscribePageUrl, withUnsubscribeLink } from "../_shared/unsubscribe.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const MAIL_FROM = Deno.env.get("MAIL_FROM") ?? "TransferAI Africa <newsletter@transferai.ci>";
const adminToken = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";

const requireAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token") ?? "";
  return adminToken.length > 0 && token === adminToken;
};

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : fallback);

class DuplicateSendError extends Error {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Resend accepte par défaut environ 2 requêtes par seconde : on espace les envois de campagne.
const CAMPAIGN_SEND_INTERVAL_MS = 600;

const sendEmail = async (to: string, subject: string, html: string, headers?: Record<string, string>, attempt = 1): Promise<string | null> => {
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
      ...(headers ? { headers } : {}),
    }),
  });

  if (response.status === 429 && attempt < 3) {
    // Limite de débit Resend : on patiente puis on réessaie.
    await sleep(1500 * attempt);
    return sendEmail(to, subject, html, headers, attempt + 1);
  }

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

  let body: { issue_id?: string; test_email?: string; dry_run?: boolean; force_resend?: boolean; resume?: boolean } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const issueId = asString(body.issue_id);
  const testEmail = asString(body.test_email);
  const dryRun = body.dry_run === true;
  const forceResend = body.force_resend === true;
  const resume = body.resume === true;

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
      sent_at: string | null;
    };

    const html = renderNewsletterHtml(issueRecord);

    if (testEmail) {
      if (!dryRun) {
        // Boutons Approuver / Modifier / Rejeter, uniquement dans les emails de test.
        const reviewBanner = await renderReviewBanner(issueRecord.id, issueRecord.title);
        const testHtml = /<body[^>]*>/i.test(html) ? html.replace(/<body[^>]*>/i, (tag) => `${tag}${reviewBanner}`) : `${reviewBanner}${html}`;
        const providerMessageId = await sendEmail(
          testEmail,
          `[TEST] ${issueRecord.subject}`,
          withUnsubscribeLink(testHtml, await unsubscribePageUrl(testEmail)),
          await unsubscribeHeaders(testEmail),
        );

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
      .select("email, subscribed_domains")
      .eq("status", "active");

    if (subscriptionsError) {
      throw subscriptionsError;
    }

    const recipients = (subscriptions ?? []).filter((subscription) => {
      const subscriberDomains = normalizeDomains(subscription.subscribed_domains);
      if (issueRecord.target_domains.length === 0) {
        return true;
      }

      return domainsIntersect(issueRecord.target_domains, subscriberDomains);
    });

    // Garde-fous anti-doublon (incidents du 10/07/2026, jusqu'à 8 envois par abonné, et du 09/10/2026) :
    // une édition ne part qu'une fois, un abonné ne la reçoit qu'une fois, et un objet déjà
    // envoyé ne repart pas sous une autre édition. force_resend contourne ces contrôles,
    // resume reprend un envoi interrompu (statut "sending") sans renvoyer aux destinataires déjà servis.
    if (!forceResend) {
      if (issueRecord.sent_at || issueRecord.status === "sent" || (issueRecord.send_count ?? 0) > 0) {
        throw new DuplicateSendError("already_sent");
      }

      if (issueRecord.status === "sending" && !resume) {
        throw new DuplicateSendError("send_in_progress");
      }

      const { data: sameSubject } = await editorialClient
        .from("newsletter_issues")
        .select("id, issue_date")
        .neq("id", issueRecord.id)
        .ilike("subject", issueRecord.subject.replace(/[\\%_]/g, (character) => `\\${character}`))
        .not("sent_at", "is", null)
        .limit(1);

      if ((sameSubject ?? []).length > 0) {
        throw new DuplicateSendError(`subject_already_sent_on_${sameSubject![0].issue_date}`);
      }
    }

    const { data: alreadySentLogs } = await editorialClient
      .from("newsletter_delivery_logs")
      .select("recipient_email")
      .eq("newsletter_issue_id", issueRecord.id)
      .eq("delivery_type", "campaign")
      .eq("status", "sent");

    const alreadyServed = new Set((alreadySentLogs ?? []).map((log) => log.recipient_email.trim().toLowerCase()));
    const uniqueRecipients = recipients.filter((recipient) => {
      const email = recipient.email.trim().toLowerCase();
      if (alreadyServed.has(email)) return false;
      alreadyServed.add(email);
      return true;
    });

    if (dryRun) {
      if (job?.id) {
        await editorialClient
          .from("editorial_jobs")
          .update({
            status: "done",
            output_payload: { recipients: uniqueRecipients.length, sent: false },
            finished_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }

      return json(200, { data: { mode: "campaign", recipients: uniqueRecipients.length, sent: false } });
    }

    // Verrou atomique : un seul appel peut faire passer l'édition en "sending".
    let claim = editorialClient
      .from("newsletter_issues")
      .update({ status: "sending" })
      .eq("id", issueRecord.id);
    if (!forceResend) {
      claim = claim.is("sent_at", null);
      claim = resume ? claim.eq("status", "sending") : claim.neq("status", "sending");
    }
    const { data: claimed, error: claimError } = await claim.select("id");

    if (claimError) {
      throw claimError;
    }

    if ((claimed ?? []).length === 0) {
      throw new DuplicateSendError("send_already_claimed");
    }

    let sentCount = 0;

    for (const [index, recipient] of uniqueRecipients.entries()) {
      if (index > 0) await sleep(CAMPAIGN_SEND_INTERVAL_MS);
      try {
        // Lien de désabonnement personnel + en-têtes « un clic » (RFC 8058).
        const providerMessageId = await sendEmail(
          recipient.email,
          issueRecord.subject,
          withUnsubscribeLink(html, await unsubscribePageUrl(recipient.email)),
          await unsubscribeHeaders(recipient.email),
        );

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
          output_payload: { recipients: uniqueRecipients.length, sent: sentCount },
          finished_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    return json(200, { data: { mode: "campaign", recipients: uniqueRecipients.length, sent: sentCount } });
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

    return json(error instanceof DuplicateSendError ? 409 : 400, { error: error instanceof Error ? error.message : "newsletter_send_failed" });
  }
});
