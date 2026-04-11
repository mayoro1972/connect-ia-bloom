import { callOpenAIJson, corsHeaders, editorialClient, json } from "../_shared/editorial.ts";

const adminToken = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";

const requireAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token") ?? "";
  return adminToken.length > 0 && token === adminToken;
};

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : fallback);

const chooseOfferFamily = (review: {
  sector_activity?: string | null;
  requested_visibility_type?: string | null;
  request_message?: string | null;
  website?: string | null;
}) => {
  const visibility = asString(review.requested_visibility_type).toLowerCase();
  const sector = asString(review.sector_activity).toLowerCase();
  const message = asString(review.request_message).toLowerCase();

  if (
    visibility.includes("editoriale") ||
    visibility.includes("premium") ||
    message.includes("campagne") ||
    message.includes("bannière") ||
    message.includes("banniere")
  ) {
    return "premium";
  }

  if (
    visibility.includes("renforcee") ||
    visibility.includes("visibilite") ||
    sector.includes("ia") ||
    sector.includes("transformation digitale") ||
    sector.includes("innovation")
  ) {
    return "visibilite";
  }

  if (!review.website) {
    return "referencement";
  }

  return "visibilite";
};

const chooseDuration = (timeline: string | null | undefined) => {
  const value = asString(timeline).toLowerCase();

  if (value.includes("12") || value.includes("ann") || value.includes("année") || value.includes("an")) {
    return 12;
  }

  if (value.includes("trimestre") || value.includes("3 mois") || value.includes("court")) {
    return 3;
  }

  return 6;
};

const buildHeuristicDraft = (review: {
  prospect_name: string;
  sector_activity: string | null;
  requested_visibility_type: string | null;
  requested_timeline: string | null;
  website: string | null;
  request_message: string | null;
}) => {
  const family = chooseOfferFamily(review);
  const duration = chooseDuration(review.requested_timeline);
  const score =
    48 +
    (review.website ? 10 : 0) +
    (review.sector_activity ? 8 : 0) +
    (review.request_message ? 6 : 0) +
    (family === "premium" ? 14 : family === "visibilite" ? 8 : 0);

  return {
    score: Math.min(92, score),
    recommendationFamily: family,
    reasoning: [
      "Alignement plausible avec l'audience TransferAI Africa",
      review.website ? "Présence web exploitable pour une publication crédible" : "Présence web à renforcer avant exposition forte",
      family === "premium"
        ? "Le besoin exprimé suggère une exposition éditoriale plus forte"
        : family === "visibilite"
          ? "Le dossier mérite une présence enrichie"
          : "Le dossier correspond à une présence standard",
    ],
  };
};

const aiSystemPrompt = `You prepare professional partner-listing recommendations for TransferAI Africa.
Return strict JSON with these keys only:
- score
- recommendationFamily
- reasoning
- subject
- bodyFr

Rules:
- French first
- business tone, concise and premium
- recommendationFamily must be one of: referencement, visibilite, premium
- do not invent facts not present in the input
- bodyFr must be a complete email in French`;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!requireAdmin(request)) {
    return json(401, { error: "Unauthorized." });
  }

  let body: { review_id?: string; dry_run?: boolean } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const reviewId = asString(body.review_id);
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

    const { data: offers, error: offersError } = await editorialClient
      .from("partner_offer_catalog")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (offersError || !offers?.length) {
      throw offersError ?? new Error("Partner offers not found.");
    }

    const heuristic = buildHeuristicDraft(review);

    let aiDraft: {
      score?: number;
      recommendationFamily?: "referencement" | "visibilite" | "premium";
      reasoning?: string[];
      subject?: string;
      bodyFr?: string;
    } | null = null;

    aiDraft = await callOpenAIJson({
      systemPrompt: aiSystemPrompt,
      userPrompt: JSON.stringify({
        review,
        offers,
        heuristic,
        objective:
          "Recommend the most relevant partner listing package and draft the reply email in French.",
      }),
      model: "gpt-4.1-mini",
    }).catch(() => null);

    const family = aiDraft?.recommendationFamily || heuristic.recommendationFamily;
    const duration = chooseDuration(review.requested_timeline);
    const selectedOffer =
      offers.find((offer) => offer.offer_family === family && offer.duration_months === duration) ||
      offers.find((offer) => offer.offer_family === family) ||
      offers[0];

    const deliverables = Array.isArray(selectedOffer.deliverables_fr)
      ? selectedOffer.deliverables_fr
      : [];

    const bodyFr =
      aiDraft?.bodyFr ||
      `Bonjour ${review.prospect_name},\n\nMerci pour votre patience et pour l’intérêt porté à TransferAI Africa.\n\nAprès étude de votre dossier, nous confirmons que votre organisation présente un bon alignement avec notre audience et notre ligne éditoriale, notamment sur les sujets liés à ${review.sector_activity || "votre secteur d’activité"}.\n\nAu regard de votre profil, nous vous recommandons la formule suivante :\n\n${selectedOffer.offer_name_fr}\n${new Intl.NumberFormat("fr-FR").format(selectedOffer.price_fcfa)} FCFA pour ${selectedOffer.duration_months} mois\n\nCette formule comprend :\n${deliverables.map((item: string) => `- ${item}`).join("\n")}\n\nSi cette orientation vous convient, nous pouvons vous transmettre la proposition finale ainsi que la liste des éléments à fournir pour validation éditoriale puis publication.\n\nBien cordialement,\nL’équipe TransferAI Africa`;

    const payload = {
      ai_score: Number(aiDraft?.score ?? heuristic.score),
      ai_recommendation: family,
      ai_provider: aiDraft ? "openai" : "heuristic",
      ai_reasoning: aiDraft?.reasoning ?? heuristic.reasoning,
      recommended_offer_key: selectedOffer.offer_key,
      recommended_duration_months: selectedOffer.duration_months,
      recommended_price_fcfa: selectedOffer.price_fcfa,
      recommended_deliverables: deliverables,
      response_email_subject:
        aiDraft?.subject || "Suite à votre demande de référencement sur TransferAI Africa",
      response_email_body_fr: bodyFr,
      review_status: "review",
    };

    if (!dryRun) {
      const { error: updateError } = await editorialClient
        .from("partner_listing_reviews")
        .update(payload)
        .eq("id", reviewId);

      if (updateError) {
        throw updateError;
      }
    }

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
        used_provider: aiDraft ? "openai" : "heuristic",
      },
    });
  } catch (error) {
    return json(400, {
      error: error instanceof Error ? error.message : "partner_review_drafter_failed",
    });
  }
});
