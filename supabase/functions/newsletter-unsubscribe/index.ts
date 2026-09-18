// Désabonnement de la newsletter.
// - POST ?e=…&t=… (corps « List-Unsubscribe=One-Click ») : désabonnement « un clic » des clients mail (RFC 8058).
// - POST JSON { e, t, step } : utilisé par la page /desabonnement du site ("inspect" puis "confirm").
import { corsHeaders, editorialClient, json } from "../_shared/editorial.ts";
import { verifyUnsubscribe } from "../_shared/unsubscribe.ts";

const unsubscribe = async (email: string) => {
  const { error } = await editorialClient
    .from("newsletter_subscriptions")
    .update({ status: "unsubscribed" })
    .eq("email", email);
  if (error) throw error;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  const url = new URL(request.url);
  const contentType = request.headers.get("content-type") ?? "";

  try {
    // Désabonnement « un clic » depuis l'en-tête List-Unsubscribe.
    if (url.searchParams.has("e") && !contentType.includes("application/json")) {
      const email = await verifyUnsubscribe(url.searchParams.get("e") ?? "", url.searchParams.get("t") ?? "");
      if (!email) return json(403, { error: "Lien de désabonnement invalide." });
      await unsubscribe(email);
      return json(200, { data: { unsubscribed: true } });
    }

    const body = (await request.json().catch(() => ({}))) as { e?: string; t?: string; step?: string };
    const email = await verifyUnsubscribe(body.e ?? "", body.t ?? "");
    if (!email) return json(403, { error: "Lien de désabonnement invalide." });

    if (body.step === "confirm") {
      await unsubscribe(email);
      return json(200, { data: { email, unsubscribed: true } });
    }

    // Aucune information sur l'existence de l'abonnement n'est révélée : seule l'adresse du lien est affichée.
    return json(200, { data: { email, unsubscribed: false } });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : "Désabonnement impossible." });
  }
});
