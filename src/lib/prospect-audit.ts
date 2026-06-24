import type { AuditDomainMessage } from "@/data/audit-offer-content";

export type AuditLanguage = "fr" | "en";
export type AuditValidationScenario = "private_company" | "institution" | "low_maturity";
export type AuditAdaptiveQuestion = {
  field: "current_workflow_snapshot" | "target_outcome" | "governance_watchpoints" | "existing_tooling";
  eyebrow: string;
  title: string;
  prompt: string;
  placeholder: string;
};

export type TransferAIServiceKey =
  | "advisory"
  | "automation"
  | "training"
  | "watch"
  | "certification";

export type TransferAIServiceProfile = {
  key: TransferAIServiceKey;
  title: string;
  shortTitle: string;
  description: string;
  outcome: string;
  nextStep: string;
  href: string;
};

export type TransferAIServiceRecommendation = {
  primary: TransferAIServiceProfile;
  secondary: TransferAIServiceProfile | null;
  confidenceLabel: string;
  rationale: string[];
  nextStepTitle: string;
  nextStepDescription: string;
};

export type TransferAIServiceRecommendationSnapshot = {
  primary: {
    key: TransferAIServiceKey;
    title: string;
    shortTitle: string;
    description: string;
    outcome: string;
    nextStep: string;
    href: string;
  };
  secondary: {
    key: TransferAIServiceKey;
    title: string;
    shortTitle: string;
    description: string;
    outcome: string;
    nextStep: string;
    href: string;
  } | null;
  confidenceLabel: string;
  rationale: string[];
  nextStepTitle: string;
  nextStepDescription: string;
};

export type AuditContextPayload = {
  packId?: string | null;
  sectorLabel?: string | null;
  sectorDomainKey?: string | null;
  domainMessageKey?: string | null;
  organizationName?: string | null;
  organizationType?: string | null;
  prospectContext?: string | null;
  suggestedQuickWins?: string[];
  suggestedUseCases?: string[];
  suggestedConstraints?: string[];
  maturityLevel?: string | null;
  validationScenario?: AuditValidationScenario | null;
  recommendedOffer?: string | null;
  recommendedUseCase?: string | null;
  scopingHorizon?: string | null;
  engagementFormat?: string[];
  budgetRange?: string | null;
};

const text = (language: AuditLanguage, fr: string, en: string) => (language === "en" ? en : fr);

const trimText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const readStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => trimText(item)).filter(Boolean)
    : [];

const normalizeText = (value: unknown) =>
  trimText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const maturityOptions = (language: AuditLanguage) => [
  { value: "decouverte", label: text(language, "Découverte - premières réflexions", "Discovery - first reflections") },
  { value: "experimentation", label: text(language, "Expérimentations en cours", "Experiments underway") },
  { value: "premiers-cas", label: text(language, "Premiers cas d'usage en production", "First live use cases") },
  { value: "echelle", label: text(language, "Déploiement à l'échelle", "Scaled deployment") },
];

const uniqueList = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = trimText(value);
    if (!trimmed) continue;
    const key = normalizeText(trimmed);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
};

const localizeList = (language: AuditLanguage, values: Array<{ fr: string; en: string }>) =>
  values.map((item) => text(language, item.fr, item.en));

export const inferAuditScenario = (context: AuditContextPayload): AuditValidationScenario => {
  if (context.validationScenario) {
    return context.validationScenario;
  }

  const orgType = normalizeText(context.organizationType);
  if (orgType.includes("institution") || orgType.includes("public")) {
    return "institution";
  }

  if (normalizeText(context.maturityLevel).includes("decouverte")) {
    return "low_maturity";
  }

  return "private_company";
};

export const resolveAuditScenarioProfile = (context: AuditContextPayload, language: AuditLanguage) => {
  const scenario = inferAuditScenario(context);

  if (scenario === "institution") {
    return {
      scenario,
      badge: text(language, "Profil institutionnel", "Institutional profile"),
      title: text(
        language,
        "Un cadrage orienté gouvernance, coordination et service public",
        "A framing focused on governance, coordination, and public-service delivery",
      ),
      lead: text(
        language,
        "Le questionnaire met l'accent sur la traçabilité, les validations internes, la coordination entre directions et l'utilité métier avant tout choix d'outil.",
        "This questionnaire emphasizes traceability, internal validation, cross-team coordination, and business value before any tooling choice.",
      ),
    };
  }

  if (scenario === "low_maturity") {
    return {
      scenario,
      badge: text(language, "Profil peu mature", "Early-stage profile"),
      title: text(
        language,
        "Un audit simple pour faire émerger les premiers quick wins",
        "A simple audit to surface the first quick wins",
      ),
      lead: text(
        language,
        "Le formulaire reste volontairement concret: on commence par le contexte, les gains rapides et les freins réels, sans exiger un niveau de maturité avancé.",
        "The form stays intentionally concrete: we start from context, quick wins, and real blockers without requiring advanced AI maturity.",
      ),
    };
  }

  return {
    scenario,
    badge: text(language, "Profil entreprise", "Private-company profile"),
    title: text(
      language,
      "Un cadrage orienté ROI, adoption et exécution rapide",
      "A framing focused on ROI, adoption, and fast execution",
    ),
    lead: text(
      language,
      "Le questionnaire est préparé pour prioriser les cas d'usage les plus crédibles, les contraintes d'intégration et la trajectoire 30 / 60 / 90 jours.",
      "This questionnaire is prepared to prioritize the most credible use cases, integration constraints, and the 30 / 60 / 90-day path.",
    ),
  };
};

export const buildAuditOptionGroups = (
  context: AuditContextPayload,
  domainMessage: AuditDomainMessage | null | undefined,
  language: AuditLanguage,
) => {
  const domainQuickWins = domainMessage?.businessBenefits
    ? localizeList(language, domainMessage.businessBenefits)
    : [];
  const domainUseCases = domainMessage?.auditFocus
    ? localizeList(language, domainMessage.auditFocus)
    : [];
  const scenarioConstraints =
    inferAuditScenario(context) === "institution"
      ? localizeList(language, [
          { fr: "Validation humaine obligatoire sur les livrables sensibles", en: "Human validation required for sensitive deliverables" },
          { fr: "Coordination entre directions ou départements", en: "Cross-department coordination" },
          { fr: "Contraintes de conformité, d'archivage ou de souveraineté", en: "Compliance, archiving, or sovereignty constraints" },
        ])
      : inferAuditScenario(context) === "low_maturity"
        ? localizeList(language, [
            { fr: "Temps limité pour former les équipes", en: "Limited time to train the teams" },
            { fr: "Peu de cas d'usage déjà testés", en: "Very few use cases tested so far" },
            { fr: "Besoin de commencer par des usages sobres", en: "Need to start with simple, low-risk use cases" },
          ])
        : localizeList(language, [
            { fr: "Intégration avec les outils existants", en: "Integration with existing tools" },
            { fr: "ROI visible en moins de 90 jours", en: "Visible ROI in under 90 days" },
            { fr: "Adoption terrain et disponibilité des équipes", en: "Operational adoption and team availability" },
          ]);

  return {
    quickWins: uniqueList([...(context.suggestedQuickWins ?? []), ...domainQuickWins]).slice(0, 8),
    useCases: uniqueList([...(context.suggestedUseCases ?? []), ...domainUseCases, context.recommendedUseCase]).slice(0, 8),
    constraints: uniqueList([...(context.suggestedConstraints ?? []), ...scenarioConstraints]).slice(0, 8),
  };
};

export const buildAdaptiveAuditQuestions = (
  context: AuditContextPayload,
  domainMessage: AuditDomainMessage | null | undefined,
  language: AuditLanguage,
): AuditAdaptiveQuestion[] => {
  const audience = domainMessage ? text(language, domainMessage.audience.fr, domainMessage.audience.en) : text(language, "vos équipes métier", "your operational teams");
  const firstFocus = domainMessage?.auditFocus?.[0]
    ? text(language, domainMessage.auditFocus[0].fr, domainMessage.auditFocus[0].en)
    : text(language, "les opérations à plus forte friction", "the most friction-heavy operations");
  const secondFocus = domainMessage?.auditFocus?.[1]
    ? text(language, domainMessage.auditFocus[1].fr, domainMessage.auditFocus[1].en)
    : text(language, "les priorités métier du moment", "today's business priorities");
  const firstBenefit = domainMessage?.businessBenefits?.[0]
    ? text(language, domainMessage.businessBenefits[0].fr, domainMessage.businessBenefits[0].en)
    : text(language, "un gain rapide visible", "a visible quick win");
  const orgLabel = trimText(context.organizationName) || text(language, "votre organisation", "your organization");

  return [
    {
      field: "current_workflow_snapshot",
      eyebrow: text(language, "Section 1", "Section 1"),
      title: text(language, "Décrivez le flux métier à analyser en priorité", "Describe the workflow that should be audited first"),
      prompt: text(
        language,
        `Expliquez comment ${audience} traitent aujourd'hui ${firstFocus}. Dites-nous où le temps se perd, où la qualité baisse ou où les retards s'accumulent.`,
        `Explain how ${audience} currently handle ${firstFocus}. Tell us where time is lost, quality drops, or delays accumulate.`,
      ),
      placeholder: text(
        language,
        `Exemple : aujourd'hui, ${orgLabel} gère ce sujet avec e-mails, tableurs, validations manuelles et relances dispersées.`,
        `Example: today, ${orgLabel} handles this through emails, spreadsheets, manual validation, and scattered follow-ups.`,
      ),
    },
    {
      field: "target_outcome",
      eyebrow: text(language, "Section 2", "Section 2"),
      title: text(language, "Quel résultat concret attendez-vous après l'audit ?", "What concrete outcome do you expect after the audit?"),
      prompt: text(
        language,
        `Si l'audit est utile dans 30 à 90 jours, que devra-t-il débloquer sur ${secondFocus} ? L'objectif est-il ${firstBenefit}, une meilleure coordination, une meilleure visibilité ou autre chose ?`,
        `If this audit is useful within 30 to 90 days, what should it unlock around ${secondFocus}? Is the goal ${firstBenefit}, stronger coordination, better visibility, or something else?`,
      ),
      placeholder: text(
        language,
        "Exemple : réduire les délais, mieux suivre les demandes, produire des livrables plus fiables, ou lancer un premier pilote.",
        "Example: reduce delays, improve tracking, produce more reliable deliverables, or launch a first pilot.",
      ),
    },
    {
      field: "governance_watchpoints",
      eyebrow: text(language, "Section 3", "Section 3"),
      title: text(language, "Quels garde-fous devons-nous respecter ?", "Which guardrails must we respect?"),
      prompt: text(
        language,
        "Précisez les contraintes à respecter : validation humaine, confidentialité, qualité, conformité, image de marque, arbitrages hiérarchiques ou dépendances techniques.",
        "Specify the constraints we must respect: human validation, confidentiality, quality, compliance, brand risk, management approvals, or technical dependencies.",
      ),
      placeholder: text(
        language,
        "Exemple : aucune réponse externe sans validation, données sensibles à anonymiser, ou intégration obligatoire avec les outils en place.",
        "Example: no external output without approval, sensitive data must be anonymized, or integration with existing tools is mandatory.",
      ),
    },
    {
      field: "existing_tooling",
      eyebrow: text(language, "Section 4", "Section 4"),
      title: text(language, "Quels outils, équipes ou données sont déjà dans la boucle ?", "Which tools, teams, or data sources are already involved?"),
      prompt: text(
        language,
        "Listez les outils actuels, les équipes concernées et les données déjà disponibles. Cela nous aide à proposer une trajectoire réaliste plutôt qu'un audit théorique.",
        "List the current tools, teams involved, and available data. This helps us propose a realistic path instead of a purely theoretical audit.",
      ),
      placeholder: text(
        language,
        "Exemple : Microsoft 365, WhatsApp, ERP, CRM, équipe support, base documentaire interne, fichiers Excel, etc.",
        "Example: Microsoft 365, WhatsApp, ERP, CRM, support team, internal knowledge base, Excel files, etc.",
      ),
    },
  ];
};

export const buildPriorityWindowOptions = (language: AuditLanguage) => [
  text(language, "30 jours", "30 days"),
  text(language, "60 jours", "60 days"),
  text(language, "90 jours", "90 days"),
  text(language, "6 mois", "6 months"),
];

export const buildDeliveryPreferenceOptions = (
  context: AuditContextPayload,
  language: AuditLanguage,
) =>
  uniqueList([
    ...(context.engagementFormat ?? []),
    ...localizeList(language, [
      { fr: "Conseil & adoption IA", en: "AI advisory & adoption" },
      { fr: "Automatisation & solutions IA", en: "AI automation & solutions" },
      { fr: "Formation ciblée", en: "Targeted training" },
      { fr: "Veille & opportunités IA", en: "AI watch & opportunities" },
      { fr: "Certification métier IA", en: "AI role-based certification" },
    ]),
  ]).slice(0, 6);

export const buildTransferAIServiceProfiles = (
  language: AuditLanguage,
): Record<TransferAIServiceKey, TransferAIServiceProfile> => ({
  advisory: {
    key: "advisory",
    title: text(language, "Conseil & adoption IA", "AI advisory & adoption"),
    shortTitle: text(language, "Conseil IA", "AI advisory"),
    description: text(
      language,
      "Pour clarifier les priorités, structurer une feuille de route et sécuriser l'adoption avant tout déploiement.",
      "To clarify priorities, structure a roadmap, and secure adoption before deployment.",
    ),
    outcome: text(
      language,
      "Vous ressortez avec un cadrage, des priorités et une trajectoire 30 / 60 / 90 jours.",
      "You leave with a framing, priorities, and a 30 / 60 / 90-day trajectory.",
    ),
    nextStep: text(
      language,
      "Prévoir un atelier de cadrage pour arbitrer les cas d'usage, la gouvernance et la feuille de route.",
      "Schedule a framing workshop to arbitrate use cases, governance, and the roadmap.",
    ),
    href: "/consulting-ia",
  },
  automation: {
    key: "automation",
    title: text(language, "Automatisation & solutions IA", "AI automation & solutions"),
    shortTitle: text(language, "Automatisation IA", "AI automation"),
    description: text(
      language,
      "Pour transformer un flux métier concret en pilote, assistant ou workflow automatisé maintenable.",
      "To turn a concrete workflow into a maintainable pilot, assistant, or automated flow.",
    ),
    outcome: text(
      language,
      "Vous obtenez un premier terrain d'exécution avec un résultat visible et mesurable.",
      "You get a first execution field with a visible and measurable outcome.",
    ),
    nextStep: text(
      language,
      "Préparer une démonstration ou un pilote focalisé sur le workflow le plus répétitif ou le plus rentable.",
      "Prepare a demo or pilot focused on the most repetitive or highest-value workflow.",
    ),
    href: "/developpement-solutions-ia",
  },
  training: {
    key: "training",
    title: text(language, "Formation ciblée", "Targeted training"),
    shortTitle: text(language, "Formation", "Training"),
    description: text(
      language,
      "Pour faire monter les équipes en compétence, fluidifier l'adoption et rendre les usages réellement opérationnels.",
      "To upskill teams, improve adoption, and make AI usage truly operational.",
    ),
    outcome: text(
      language,
      "Les équipes gagnent en autonomie, en méthode et en capacité de mise en pratique.",
      "Teams gain autonomy, method, and practical execution capability.",
    ),
    nextStep: text(
      language,
      "Identifier les populations à former en priorité et définir un parcours court, appliqué et directement utile.",
      "Identify the teams to train first and define a short, practical, directly useful program.",
    ),
    href: "/catalogue",
  },
  watch: {
    key: "watch",
    title: text(language, "Veille & opportunités IA", "AI watch & opportunities"),
    shortTitle: text(language, "Veille IA", "AI watch"),
    description: text(
      language,
      "Pour suivre les signaux utiles, les usages à surveiller et les opportunités à activer sans se disperser.",
      "To track useful signals, relevant use cases, and opportunities without spreading attention too thin.",
    ),
    outcome: text(
      language,
      "Vous obtenez une meilleure lecture des évolutions IA pertinentes pour votre métier.",
      "You gain a clearer view of AI developments that matter for your business.",
    ),
    nextStep: text(
      language,
      "Mettre en place une veille ciblée par métier, par risque ou par opportunité afin d'éclairer les prochaines décisions.",
      "Set up a profession-specific, risk-aware, opportunity-driven watch to guide the next decisions.",
    ),
    href: "/createur-contenu-ia",
  },
  certification: {
    key: "certification",
    title: text(language, "Certification métier IA", "AI role-based certification"),
    shortTitle: text(language, "Certification", "Certification"),
    description: text(
      language,
      "Pour structurer une montée en compétences reconnue quand l'enjeu principal est la professionnalisation durable.",
      "To build a recognized capability path when the main challenge is long-term professionalization.",
    ),
    outcome: text(
      language,
      "Le prospect repart avec une trajectoire crédible de montée en compétence et de reconnaissance.",
      "The prospect leaves with a credible path for capability growth and recognition.",
    ),
    nextStep: text(
      language,
      "Qualifier les profils concernés, le niveau attendu et le domaine métier à certifier en premier.",
      "Qualify the target profiles, expected level, and business domain to certify first.",
    ),
    href: "/certification",
  },
});

const normalizeListBlob = (...values: unknown[]) =>
  values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .join(" ");

const includesOneOf = (haystack: string, needles: string[]) =>
  needles.some((needle) => haystack.includes(needle));

export const buildTransferAIServiceRecommendation = (
  context: AuditContextPayload,
  formData: Record<string, unknown>,
  language: AuditLanguage,
): TransferAIServiceRecommendation => {
  const profiles = buildTransferAIServiceProfiles(language);
  const scores: Record<TransferAIServiceKey, number> = {
    advisory: 0,
    automation: 0,
    training: 0,
    watch: 0,
    certification: 0,
  };

  const rationaleFlags = {
    lowMaturity: normalizeText(formData.maturity_level || context.maturityLevel).includes("decouverte"),
    strongGovernance:
      trimText(formData.governance_watchpoints).length > 0 ||
      readStringArray(formData.selected_constraints).length > 0,
    repetitiveWorkflow:
      trimText(formData.current_workflow_snapshot).length > 0 ||
      readStringArray(formData.selected_quick_wins).length > 0,
    adoptionNeed:
      trimText(formData.target_outcome).length > 0 ||
      readStringArray(formData.preferred_support).length > 0,
    watchNeed: false,
    certificationNeed: false,
  };

  const supportBlob = normalizeListBlob(formData.preferred_support, context.engagementFormat, context.recommendedOffer);
  const quickWinsBlob = normalizeListBlob(formData.selected_quick_wins, context.suggestedQuickWins);
  const useCasesBlob = normalizeListBlob(formData.selected_use_cases, context.suggestedUseCases, context.recommendedUseCase);
  const constraintsBlob = normalizeListBlob(formData.selected_constraints, context.suggestedConstraints);
  const textBlob = normalizeListBlob(
    formData.prospect_context,
    formData.current_workflow_snapshot,
    formData.target_outcome,
    formData.governance_watchpoints,
    formData.existing_tooling,
    formData.audit_success_metric,
    context.prospectContext,
    context.recommendedOffer,
    context.recommendedUseCase,
    context.organizationType,
  );

  if (rationaleFlags.lowMaturity) {
    scores.advisory += 3;
    scores.training += 2;
  }

  if (inferAuditScenario(context) === "institution") {
    scores.advisory += 3;
    scores.training += 1;
  }

  if (rationaleFlags.strongGovernance || includesOneOf(constraintsBlob, ["gouvernance", "conformite", "conformite", "confidential", "confidentialite", "validation", "sovereignty", "souverainete"])) {
    scores.advisory += 3;
  }

  if (
    includesOneOf(useCasesBlob + " " + quickWinsBlob + " " + textBlob, [
      "workflow",
      "automatisation",
      "automation",
      "assistant",
      "copilote",
      "support",
      "reporting",
      "processus",
      "integration",
      "chatbot",
      "contenu",
      "content",
    ])
  ) {
    scores.automation += 3;
  }

  if (trimText(formData.existing_tooling).length > 0) {
    scores.automation += 1;
  }

  if (
    includesOneOf(textBlob, [
      "former",
      "formation",
      "upskill",
      "skills",
      "competence",
      "compétence",
      "equipe",
      "team",
      "adoption",
      "onboarding",
      "montée en compétence",
    ])
  ) {
    scores.training += 3;
  }

  if (
    includesOneOf(textBlob + " " + supportBlob, [
      "veille",
      "watch",
      "trend",
      "tendance",
      "newsletter",
      "reglementaire",
      "regulatory",
      "opportunit",
      "opportunity",
      "news",
      "market signal",
    ])
  ) {
    scores.watch += 4;
    rationaleFlags.watchNeed = true;
  }

  if (
    includesOneOf(textBlob + " " + supportBlob, [
      "certification",
      "certifie",
      "certified",
      "credential",
      "attestation",
      "recognition",
      "reconnaissance",
    ])
  ) {
    scores.certification += 4;
    rationaleFlags.certificationNeed = true;
  }

  if (includesOneOf(supportBlob, ["conseil", "advisory", "audit", "governance", "gouvernance", "roadmap"])) {
    scores.advisory += 4;
  }
  if (includesOneOf(supportBlob, ["automatisation", "automation", "solution", "prototype", "pilot", "pilote"])) {
    scores.automation += 4;
  }
  if (includesOneOf(supportBlob, ["formation", "training"])) {
    scores.training += 4;
  }
  if (includesOneOf(supportBlob, ["veille", "watch"])) {
    scores.watch += 4;
  }
  if (includesOneOf(supportBlob, ["certification"])) {
    scores.certification += 4;
  }

  if (includesOneOf(textBlob, ["priorite", "priorité", "roadmap", "feuille de route", "pilotage", "governance", "gouvernance"])) {
    scores.advisory += 2;
  }
  if (includesOneOf(textBlob, ["gagner du temps", "reduce", "reduire", "accelerer", "accélérer", "faster", "productivite", "productivity"])) {
    scores.automation += 2;
  }

  const ranked = (Object.entries(scores) as Array<[TransferAIServiceKey, number]>)
    .sort((left, right) => right[1] - left[1]);
  const [primaryKey, primaryScore] = ranked[0];
  const secondaryKey = ranked[1]?.[1] > 0 ? ranked[1][0] : null;

  const confidenceGap = primaryScore - (ranked[1]?.[1] ?? 0);
  const confidenceLabel =
    primaryScore >= 6 && confidenceGap >= 2
      ? text(language, "Orientation forte", "Strong fit")
      : primaryScore >= 4
        ? text(language, "Orientation probable", "Likely fit")
        : text(language, "Point de départ recommandé", "Recommended starting point");

  const rationale =
    primaryKey === "automation"
      ? [
          text(language, "Vous décrivez un flux métier concret avec des gains rapides et une attente de résultat visible.", "You describe a concrete workflow with quick wins and a visible outcome expectation."),
          text(language, "L'automatisation semble être le meilleur levier pour transformer l'audit en pilote opérationnel.", "Automation seems to be the best lever to turn the audit into an operational pilot."),
        ]
      : primaryKey === "training"
        ? [
            text(language, "Les réponses montrent un besoin fort d'adoption, de montée en compétence ou d'alignement des équipes.", "The answers show a strong need for adoption, capability building, or team alignment."),
            text(language, "Une formation ciblée permettrait de sécuriser l'usage avant un déploiement plus large.", "Targeted training would secure usage before broader deployment."),
          ]
        : primaryKey === "watch"
          ? [
              text(language, "Le besoin semble orienté vers la veille, la compréhension du marché et la lecture des signaux utiles.", "The need appears centered on watch, market understanding, and useful signals."),
              text(language, "Une veille structurée aiderait à décider plus juste avant de lancer un chantier plus lourd.", "A structured watch would support better decisions before launching a heavier initiative."),
            ]
          : primaryKey === "certification"
            ? [
                text(language, "Le besoin semble lié à une professionnalisation durable et à une reconnaissance formelle des compétences.", "The need seems linked to long-term professionalization and formal skill recognition."),
                text(language, "Une trajectoire de certification donnerait un cadre lisible à la montée en compétence.", "A certification path would give a clear frame to capability growth."),
              ]
            : [
                text(language, "Les réponses montrent un besoin de cadrage, de priorisation et de gouvernance avant toute décision d'investissement.", "The answers show a need for framing, prioritization, and governance before investment decisions."),
                text(language, "Le conseil & adoption IA semble être la meilleure première marche pour structurer la suite.", "AI advisory & adoption seems to be the best first step to structure what comes next."),
              ];

  const nextStepTitle = text(language, "Ce que nous recommanderions après l'audit", "What we would recommend after the audit");
  const nextStepDescription =
    secondaryKey
      ? text(
          language,
          `${profiles[primaryKey].nextStep} En complément, ${profiles[secondaryKey].shortTitle.toLowerCase()} pourrait renforcer l'impact de cette trajectoire.`,
          `${profiles[primaryKey].nextStep} In parallel, ${profiles[secondaryKey].shortTitle.toLowerCase()} could reinforce the impact of this trajectory.`,
        )
      : profiles[primaryKey].nextStep;

  return {
    primary: profiles[primaryKey],
    secondary: secondaryKey ? profiles[secondaryKey] : null,
    confidenceLabel,
    rationale,
    nextStepTitle,
    nextStepDescription,
  };
};

export const buildTransferAIRecommendationSnapshot = (
  recommendation: TransferAIServiceRecommendation,
): TransferAIServiceRecommendationSnapshot => ({
  primary: {
    key: recommendation.primary.key,
    title: recommendation.primary.title,
    shortTitle: recommendation.primary.shortTitle,
    description: recommendation.primary.description,
    outcome: recommendation.primary.outcome,
    nextStep: recommendation.primary.nextStep,
    href: recommendation.primary.href,
  },
  secondary: recommendation.secondary
    ? {
        key: recommendation.secondary.key,
        title: recommendation.secondary.title,
        shortTitle: recommendation.secondary.shortTitle,
        description: recommendation.secondary.description,
        outcome: recommendation.secondary.outcome,
        nextStep: recommendation.secondary.nextStep,
        href: recommendation.secondary.href,
      }
    : null,
  confidenceLabel: recommendation.confidenceLabel,
  rationale: [...recommendation.rationale],
  nextStepTitle: recommendation.nextStepTitle,
  nextStepDescription: recommendation.nextStepDescription,
});

export const computeAuditCompletion = (formData: Record<string, unknown>) => {
  const answered = [
    trimText(formData.c_nom),
    trimText(formData.c_email),
    trimText(formData.c_entite),
    trimText(formData.audit_sector),
    trimText(formData.prospect_context),
    trimText(formData.maturity_level),
    trimText(formData.current_workflow_snapshot),
    trimText(formData.target_outcome),
    trimText(formData.governance_watchpoints),
    trimText(formData.existing_tooling),
    trimText(formData.priority_window),
    Array.isArray(formData.selected_quick_wins) && formData.selected_quick_wins.length > 0 ? "yes" : "",
    Array.isArray(formData.selected_use_cases) && formData.selected_use_cases.length > 0 ? "yes" : "",
    Array.isArray(formData.selected_constraints) && formData.selected_constraints.length > 0 ? "yes" : "",
    Array.isArray(formData.preferred_support) && formData.preferred_support.length > 0 ? "yes" : "",
  ].filter(Boolean).length;

  return Math.round((answered / 15) * 100);
};
