import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";

type SubscriptionBody = {
  email?: string;
  language?: string;
  subscribed_domains?: string[];
  source_page?: string | null;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const normalizeDomains = (domains: string[] | undefined) =>
  Array.from(
    new Set(
      (domains ?? [])
        .map((domain) => domain?.trim())
        .filter((domain): domain is string => Boolean(domain))
        .slice(0, 8),
    ),
  );

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

    return json(200, {
      data: {
        email,
        subscribed_domains: mergedDomains,
        status: "active",
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

  return json(200, {
    data: {
      email,
      subscribed_domains: mergedDomains,
      status: "active",
    },
  });
});
