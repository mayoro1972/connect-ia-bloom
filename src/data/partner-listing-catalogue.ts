export type PartnerOffer = {
  offer_key: string;
  offer_family: "referencement" | "visibilite" | "premium";
  offer_name_fr: string;
  offer_name_en: string;
  duration_months: 3 | 6 | 12;
  price_fcfa: number;
  visibility_level: "standard" | "enhanced" | "premium";
  summary_fr: string;
  deliverables_fr: string[];
};

export type PartnerDecisionRule = {
  label: string;
  weight: number;
  description: string;
};

export type PartnerEmailTemplatePreview = {
  template_key: string;
  language: "fr" | "en";
  subject_template: string;
  body_template: string;
};

export type PartnerReviewPreview = {
  id: string;
  prospect_name: string;
  prospect_email: string;
  company: string;
  website: string | null;
  role: string | null;
  city: string | null;
  sector_activity: string | null;
  requested_visibility_type: string | null;
  requested_timeline: string | null;
  request_message: string | null;
  review_status: string;
  ai_score: number | null;
  ai_recommendation: string | null;
  recommended_offer_key: string | null;
  recommended_duration_months: number | null;
  recommended_price_fcfa: number | null;
  response_email_subject: string | null;
  response_email_body_fr: string | null;
  response_due_at: string | null;
  admin_notes: string | null;
};

export type PartnerReviewStatus =
  | "received"
  | "needs_info"
  | "scored"
  | "review"
  | "approved"
  | "scheduled"
  | "sent"
  | "rejected"
  | "archived";

export const partnerOffersCatalogue: PartnerOffer[] = [
  {
    offer_key: "referencement_3m",
    offer_family: "referencement",
    offer_name_fr: "Referencement",
    offer_name_en: "Listing",
    duration_months: 3,
    price_fcfa: 150000,
    visibility_level: "standard",
    summary_fr: "Présence simple et crédible pour apparaître dans l’écosystème TransferAI.",
    deliverables_fr: ["Logo", "Texte court", "Lien principal"],
  },
  {
    offer_key: "referencement_6m",
    offer_family: "referencement",
    offer_name_fr: "Referencement",
    offer_name_en: "Listing",
    duration_months: 6,
    price_fcfa: 250000,
    visibility_level: "standard",
    summary_fr: "Présence simple sur une durée plus longue pour installer la visibilité.",
    deliverables_fr: ["Logo", "Texte court", "Lien principal"],
  },
  {
    offer_key: "referencement_12m",
    offer_family: "referencement",
    offer_name_fr: "Referencement",
    offer_name_en: "Listing",
    duration_months: 12,
    price_fcfa: 420000,
    visibility_level: "standard",
    summary_fr: "Présence annuelle standard pour une visibilité continue.",
    deliverables_fr: ["Logo", "Texte court", "Lien principal"],
  },
  {
    offer_key: "visibilite_3m",
    offer_family: "visibilite",
    offer_name_fr: "Visibilite",
    offer_name_en: "Enhanced visibility",
    duration_months: 3,
    price_fcfa: 300000,
    visibility_level: "enhanced",
    summary_fr: "Présence renforcée avec fiche enrichie et hiérarchie visuelle supérieure.",
    deliverables_fr: ["Logo", "Fiche enrichie", "Angle sectoriel", "Meilleure visibilité"],
  },
  {
    offer_key: "visibilite_6m",
    offer_family: "visibilite",
    offer_name_fr: "Visibilite",
    offer_name_en: "Enhanced visibility",
    duration_months: 6,
    price_fcfa: 540000,
    visibility_level: "enhanced",
    summary_fr: "Présence renforcée sur une durée intermédiaire pour accélérer la reconnaissance.",
    deliverables_fr: ["Logo", "Fiche enrichie", "Angle sectoriel", "Meilleure visibilité"],
  },
  {
    offer_key: "visibilite_12m",
    offer_family: "visibilite",
    offer_name_fr: "Visibilite",
    offer_name_en: "Enhanced visibility",
    duration_months: 12,
    price_fcfa: 900000,
    visibility_level: "enhanced",
    summary_fr: "Présence renforcée annuelle pour structurer une relation visible et crédible.",
    deliverables_fr: ["Logo", "Fiche enrichie", "Angle sectoriel", "Meilleure visibilité"],
  },
  {
    offer_key: "premium_3m",
    offer_family: "premium",
    offer_name_fr: "Premium",
    offer_name_en: "Premium",
    duration_months: 3,
    price_fcfa: 600000,
    visibility_level: "premium",
    summary_fr: "Mise en avant forte avec dispositif éditorial plus visible.",
    deliverables_fr: ["Banniere", "Fiche enrichie", "Mise en avant", "Relai editorial"],
  },
  {
    offer_key: "premium_6m",
    offer_family: "premium",
    offer_name_fr: "Premium",
    offer_name_en: "Premium",
    duration_months: 6,
    price_fcfa: 1050000,
    visibility_level: "premium",
    summary_fr: "Package premium pour une présence plus marquante dans l’écosystème TransferAI.",
    deliverables_fr: ["Banniere", "Fiche enrichie", "Mise en avant", "Relai editorial"],
  },
  {
    offer_key: "premium_12m",
    offer_family: "premium",
    offer_name_fr: "Premium",
    offer_name_en: "Premium",
    duration_months: 12,
    price_fcfa: 1800000,
    visibility_level: "premium",
    summary_fr: "Présence premium annuelle avec continuité éditoriale et exposition forte.",
    deliverables_fr: ["Banniere", "Fiche enrichie", "Mise en avant", "Relai editorial"],
  },
];

export const partnerDecisionRules: PartnerDecisionRule[] = [
  { label: "Alignement audience TransferAI", weight: 25, description: "Formation, IA, transformation digitale, innovation, outils métier ou utilité business claire pour notre audience." },
  { label: "Clarté du positionnement", weight: 15, description: "L’activité et la promesse de valeur sont-elles immédiatement compréhensibles ?" },
  { label: "Crédibilité de la structure", weight: 15, description: "Qualité du site, présence publique, identité de marque et cohérence des informations." },
  { label: "Valeur pour l’audience", weight: 20, description: "Le prospect apporte-t-il une vraie utilité au public TransferAI Africa ?" },
  { label: "Qualité des éléments fournis", weight: 10, description: "Logo, texte, liens, message de demande et précision du besoin." },
  { label: "Potentiel de visibilité ou de relai", weight: 15, description: "Capacité à créer un effet de levier, de relai ou de partenariat dans l’écosystème." },
];

export const partnerEmailTemplates: PartnerEmailTemplatePreview[] = [
  {
    template_key: "partner_needs_info",
    language: "fr",
    subject_template: "Compléments utiles pour votre demande de référencement | TransferAI Africa",
    body_template:
      "Bonjour {{prospect_name}},\n\nMerci pour votre demande et pour l’intérêt porté à TransferAI Africa.\n\nAprès une première lecture de votre dossier, nous aurions besoin de quelques éléments complémentaires afin d’évaluer le format de présence le plus pertinent pour votre organisation.\n\nMerci de nous transmettre si possible :\n- votre logo\n- une présentation courte de votre activité\n- votre site web ou vos liens principaux\n- l’objectif de visibilité recherché\n- les éléments que vous souhaitez voir publiés\n\nDès réception, notre équipe pourra finaliser l’étude de votre demande et revenir vers vous avec une proposition adaptée.\n\nBien cordialement,\nL’équipe TransferAI Africa",
  },
  {
    template_key: "partner_offer_recommendation",
    language: "fr",
    subject_template: "Votre demande de référencement a été étudiée | TransferAI Africa",
    body_template:
      "Bonjour {{prospect_name}},\n\nMerci pour votre patience et pour l’intérêt porté à TransferAI Africa.\n\nAprès étude de votre dossier, nous confirmons que votre organisation présente un bon alignement avec notre audience et notre ligne éditoriale, notamment sur les sujets liés à {{sector_activity}}.\n\nLa formule que nous vous recommandons est la suivante :\n\n{{offer_name_fr}}\n{{recommended_price_fcfa}} FCFA pour {{recommended_duration_months}} mois\n\nCette formule inclut :\n{{deliverables_bullets}}\n\nSi cette orientation vous convient, nous pourrons vous transmettre la proposition finale ainsi que la liste des éléments à fournir pour validation éditoriale puis publication.\n\nBien cordialement,\nL’équipe TransferAI Africa",
  },
];

export const partnerFamilyLabels: Record<PartnerOffer["offer_family"], string> = {
  referencement: "Référencement",
  visibilite: "Visibilité",
  premium: "Premium",
};

export const fallbackPartnerReview: PartnerReviewPreview = {
  id: "preview-partner-review",
  prospect_name: "Awa Traore",
  prospect_email: "awa.traore@africadigitalhub.com",
  company: "Africa Digital Hub",
  website: "https://africadigitalhub.com",
  role: "Responsable partenariats",
  city: "Abidjan, Côte d'Ivoire",
  sector_activity: "Conseil en transformation digitale et accompagnement IA",
  requested_visibility_type: "presence-renforcee",
  requested_timeline: "Publication souhaitée au prochain trimestre",
  request_message:
    "Bonjour, nous souhaitons étudier une présence de notre organisation sur votre page partenaires. Merci de nous indiquer les modalités possibles après revue de notre activité.",
  review_status: "review",
  ai_score: 72,
  ai_recommendation: "visibilite",
  recommended_offer_key: "visibilite_6m",
  recommended_duration_months: 6,
  recommended_price_fcfa: 540000,
  response_email_subject: "Votre demande de référencement a été étudiée | TransferAI Africa",
  response_email_body_fr:
    "Bonjour Awa Traore,\n\nMerci pour votre patience et pour l’intérêt porté à TransferAI Africa.\n\nAprès étude de votre dossier, nous confirmons que votre organisation présente un bon alignement avec notre audience et notre ligne éditoriale, notamment sur les sujets liés au conseil en transformation digitale et à l’accompagnement IA.\n\nLa formule que nous vous recommandons est la suivante :\n\nVisibilité\n540 000 FCFA pour 6 mois\n\nCette formule inclut :\n- une fiche enrichie\n- une meilleure visibilité dans la page partenaires\n- un angle de présentation plus structuré\n\nSi cette orientation vous convient, nous pourrons vous transmettre la proposition finale et les éléments attendus pour validation éditoriale puis publication.\n\nBien cordialement,\nL’équipe TransferAI Africa",
  response_due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  admin_notes: "Exemple local de preview avant connexion complète au pipeline Supabase.",
};

export const formatFcfa = (value: number | null | undefined) =>
  typeof value === "number"
    ? `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`
    : "À confirmer";

export const getOfferByKey = (offerKey: string | null | undefined) =>
  partnerOffersCatalogue.find((offer) => offer.offer_key === offerKey) ?? null;

export const choosePartnerOffer = (
  review: Pick<
    PartnerReviewPreview,
    "sector_activity" | "requested_visibility_type" | "requested_timeline" | "website" | "request_message"
  >,
) => {
  const visibilityNeed = (review.requested_visibility_type || "").toLowerCase();
  const sector = (review.sector_activity || "").toLowerCase();
  const timeline = (review.requested_timeline || "").toLowerCase();
  const message = (review.request_message || "").toLowerCase();

  let family: PartnerOffer["offer_family"] = "referencement";

  if (
    visibilityNeed.includes("editoriale") ||
    visibilityNeed.includes("premium") ||
    message.includes("campagne") ||
    message.includes("lancement") ||
    message.includes("banniere")
  ) {
    family = "premium";
  } else if (
    visibilityNeed.includes("renforcee") ||
    visibilityNeed.includes("visibilite") ||
    sector.includes("ia") ||
    sector.includes("transformation digitale") ||
    sector.includes("innovation")
  ) {
    family = "visibilite";
  }

  let duration: 3 | 6 | 12 = 6;

  if (
    timeline.includes("12") ||
    timeline.includes("ann") ||
    timeline.includes("année") ||
    timeline.includes("an")
  ) {
    duration = 12;
  } else if (
    timeline.includes("trimestre") ||
    timeline.includes("3 mois") ||
    timeline.includes("court")
  ) {
    duration = 3;
  }

  if (!review.website && family === "premium") {
    family = "visibilite";
  }

  return (
    partnerOffersCatalogue.find((offer) => offer.offer_family === family && offer.duration_months === duration) ??
    partnerOffersCatalogue.find((offer) => offer.offer_family === family) ??
    partnerOffersCatalogue[0]
  );
};

export const renderPartnerRecommendationEmail = (review: PartnerReviewPreview) => {
  const offer = getOfferByKey(review.recommended_offer_key) ?? choosePartnerOffer(review);
  const deliverablesBullets = offer.deliverables_fr.map((item) => `- ${item}`).join("\n");

  return `Bonjour ${review.prospect_name},\n\nMerci pour votre patience et pour l’intérêt porté à TransferAI Africa.\n\nAprès étude de votre dossier, nous confirmons que votre organisation présente un bon alignement avec notre audience et notre ligne éditoriale, notamment sur les sujets liés à ${review.sector_activity || "votre secteur d’activité"}.\n\nLa formule que nous vous recommandons est la suivante :\n\n${partnerFamilyLabels[offer.offer_family]}\n${formatFcfa(offer.price_fcfa)} pour ${offer.duration_months} mois\n\nCette formule inclut :\n${deliverablesBullets}\n\nSi cette orientation vous convient, nous pourrons vous transmettre la proposition finale ainsi que la liste des éléments à fournir pour validation éditoriale puis publication.\n\nBien cordialement,\nL’équipe TransferAI Africa`;
};
