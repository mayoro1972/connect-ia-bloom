import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";
import { getEmailGreeting } from "../_shared/email-greetings.ts";

type SubscriptionBody = {
  email?: string;
  language?: string;
  subscribed_domains?: string[];
  source_page?: string | null;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const MAIL_FROM = Deno.env.get("MAIL_FROM") ?? "TransferAI Africa <contact@transferai.ci>";
const MAIL_TO = Deno.env.get("MAIL_TO") ?? "contact@transferai.ci";

const normalizeDomains = (domains: string[] | undefined) =>
  Array.from(
    new Set(
      (domains ?? [])
        .map((domain) => domain?.trim())
        .filter((domain): domain is string => Boolean(domain))
        .slice(0, 8),
    ),
  );

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildNewsletterConfirmation = (email: string, domains: string[], language: "fr" | "en") => {
  const domainList = domains.join(", ");
  const greeting = getEmailGreeting(language);

  const pillarCardStyle =
    "padding:16px 18px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;margin:0 0 12px;";
  const pillarTitleStyle =
    "margin:0 0 6px;color:#9a3412;font-weight:700;font-size:14px;letter-spacing:0.02em;";
  const pillarBodyStyle = "margin:0;color:#475467;font-size:14px;line-height:1.5;";

  if (language === "en") {
    const pillars = [
      {
        title: "1. Weekly business newsletter",
        body: "A practical, domain-focused brief: trends, tools and AI use cases adapted to your role and sector.",
      },
      {
        title: "2. High-impact micro-content",
        body: "Short, actionable insights (prompts, tips, mini case studies) to apply AI immediately at work.",
      },
      {
        title: "3. AI Africa watch + jobs",
        body: "Curated signals on AI in Africa and a selection of opportunities (jobs, calls, programs) to act on.",
      },
    ];

    const pillarsHtml = pillars
      .map(
        (p) => `
            <div style="${pillarCardStyle}">
              <p style="${pillarTitleStyle}">${escapeHtml(p.title)}</p>
              <p style="${pillarBodyStyle}">${escapeHtml(p.body)}</p>
            </div>`,
      )
      .join("");

    return {
      subject: "Your TransferAI Africa subscription is confirmed",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
          <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#101828;">Subscription confirmed</h1>
            <p style="margin:0 0 14px;color:#101828;">${escapeHtml(greeting)}</p>
            <p style="margin:0 0 14px;color:#475467;">Your subscription to the TransferAI Africa newsletter is now active. You will receive our three editorial pillars:</p>
            ${pillarsHtml}
            <div style="padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;margin-top:18px;">
              <p style="margin:0 0 10px;color:#101828;font-weight:700;">Selected domains</p>
              <p style="margin:0;color:#475467;">${escapeHtml(domainList)}</p>
            </div>
            <p style="margin:24px 0 0;color:#475467;">If you need tailored support, reply to this email or write to ${escapeHtml(MAIL_TO)}.</p>
          </div>
        </div>
      `,
      text: [
        "TransferAI Africa",
        "",
        greeting,
        "",
        "Your subscription to the TransferAI Africa newsletter is now active. You will receive our three editorial pillars:",
        "",
        ...pillars.flatMap((p) => [p.title, p.body, ""]),
        `Selected domains: ${domainList}`,
        "",
        `Need tailored support? Reply to this email or write to ${MAIL_TO}.`,
        "",
        `Subscriber: ${email}`,
      ].join("\n"),
    };
  }

  const pillars = [
    {
      title: "1. Newsletter métier hebdomadaire",
      body: "Un brief pratique par domaine : tendances, outils et cas d'usage IA adaptés à votre rôle et à votre secteur.",
    },
    {
      title: "2. Micro-contenus à forte portée",
      body: "Des contenus courts et actionnables (prompts, astuces, mini études de cas) pour appliquer l'IA immédiatement au travail.",
    },
    {
      title: "3. Veille IA Afrique + emploi",
      body: "Une veille ciblée sur l'IA en Afrique et une sélection d'opportunités (offres d'emploi, appels, programmes) à activer.",
    },
  ];

  const pillarsHtml = pillars
    .map(
      (p) => `
          <div style="${pillarCardStyle}">
            <p style="${pillarTitleStyle}">${escapeHtml(p.title)}</p>
            <p style="${pillarBodyStyle}">${escapeHtml(p.body)}</p>
          </div>`,
    )
    .join("");

  return {
    subject: "Votre inscription TransferAI Africa est confirmée",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#101828;">Inscription confirmée</h1>
          <p style="margin:0 0 14px;color:#101828;">${escapeHtml(greeting)}</p>
          <p style="margin:0 0 14px;color:#475467;">Votre abonnement à la newsletter TransferAI Africa est maintenant actif. Vous recevrez nos trois piliers éditoriaux :</p>
          ${pillarsHtml}
          <div style="padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #eaecf0;margin-top:18px;">
            <p style="margin:0 0 10px;color:#101828;font-weight:700;">Domaines sélectionnés</p>
            <p style="margin:0;color:#475467;">${escapeHtml(domainList)}</p>
          </div>
          <p style="margin:24px 0 0;color:#475467;">Si vous souhaitez un accompagnement adapté à votre organisation, répondez à cet email ou écrivez à ${escapeHtml(MAIL_TO)}.</p>
        </div>
      </div>
    `,
    text: [
      "TransferAI Africa",
      "",
      greeting,
      "",
      "Votre abonnement à la newsletter TransferAI Africa est maintenant actif. Vous recevrez nos trois piliers éditoriaux :",
      "",
      ...pillars.flatMap((p) => [p.title, p.body, ""]),
      `Domaines sélectionnés : ${domainList}`,
      "",
      `Besoin d'un accompagnement ? Répondez à cet email ou écrivez à ${MAIL_TO}.`,
      "",
      `Abonné : ${email}`,
    ].join("\n"),
  };
};

const buildNewsletterInternalAlert = (email: string, domains: string[], language: "fr" | "en", sourcePage: string) => ({
  subject:
    language === "en"
      ? `[TransferAI] New newsletter subscription - ${email}`
      : `[TransferAI] Nouvelle inscription newsletter - ${email}`,
  html: `
    <div style="font-family:Arial,sans-serif;background:#f7f8fa;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e4e7ec;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#f28c28;">TransferAI Africa</p>
        <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#101828;">${escapeHtml(
          language === "en" ? "New newsletter subscription" : "Nouvelle inscription newsletter",
        )}</h1>
        <p style="margin:0 0 10px;color:#475467;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:0 0 10px;color:#475467;"><strong>${escapeHtml(language === "en" ? "Domains" : "Domaines")}:</strong> ${escapeHtml(domains.join(", "))}</p>
        <p style="margin:0;color:#475467;"><strong>Source:</strong> ${escapeHtml(sourcePage)}</p>
      </div>
    </div>
  `,
  text: [
    language === "en" ? "New newsletter subscription" : "Nouvelle inscription newsletter",
    `Email: ${email}`,
    `${language === "en" ? "Domains" : "Domaines"}: ${domains.join(", ")}`,
    `Source: ${sourcePage}`,
  ].join("\n"),
});

const sendEmail = async (to: string, message: { subject: string; html: string; text: string }) => {
  if (!RESEND_API_KEY) {
    throw new Error("email_provider_not_configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: MAIL_TO,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`email_send_failed:${response.status}:${errorText}`);
  }

  return response.json();
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: SubscriptionBody = {};

  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid_payload" });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const language = body.language === "en" ? "en" : "fr";
  const subscribedDomains = normalizeDomains(body.subscribed_domains);
  const sourcePage = body.source_page?.trim() || "/blog";

  if (!emailPattern.test(email)) {
    return json(400, { error: "invalid_email" });
  }

  if (subscribedDomains.length === 0) {
    return json(400, { error: "missing_domains" });
  }

  const { data: existing, error: existingError } = await editorialClient
    .from("newsletter_subscriptions")
    .select("id, subscribed_domains")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    return json(400, { error: existingError.message });
  }

  const mergedDomains = Array.from(
    new Set([...(existing?.subscribed_domains ?? []), ...subscribedDomains]),
  );

  if (existing?.id) {
    const { error } = await editorialClient
      .from("newsletter_subscriptions")
      .update({
        subscribed_domains: mergedDomains,
        language,
        source_page: sourcePage,
        status: "active",
      })
      .eq("id", existing.id);

    if (error) {
      return json(400, { error: error.message });
    }

    try {
      await Promise.all([
        sendEmail(email, buildNewsletterConfirmation(email, mergedDomains, language)),
        sendEmail(MAIL_TO, buildNewsletterInternalAlert(email, mergedDomains, language, sourcePage)),
      ]);
    } catch (error) {
      return json(500, {
        error: error instanceof Error ? error.message : "newsletter_email_failed",
      });
    }

    return json(200, {
      data: {
        email,
        subscribed_domains: mergedDomains,
        status: "active",
        confirmation_sent: true,
      },
    });
  }

  const { error } = await editorialClient.from("newsletter_subscriptions").insert({
    email,
    language,
    source_page: sourcePage,
    subscribed_domains: mergedDomains,
    status: "active",
  });

  if (error) {
    return json(400, { error: error.message });
  }

  try {
    await Promise.all([
      sendEmail(email, buildNewsletterConfirmation(email, mergedDomains, language)),
      sendEmail(MAIL_TO, buildNewsletterInternalAlert(email, mergedDomains, language, sourcePage)),
    ]);
  } catch (emailError) {
    return json(500, {
      error: emailError instanceof Error ? emailError.message : "newsletter_email_failed",
    });
  }

  return json(200, {
    data: {
      email,
      subscribed_domains: mergedDomains,
      status: "active",
      confirmation_sent: true,
    },
  });
});
