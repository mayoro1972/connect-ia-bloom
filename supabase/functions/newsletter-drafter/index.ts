import {
  callAnthropicText,
  callLovableAIJson,
  callOpenAIJson,
  corsHeaders,
  editorialClient,
  json,
} from "../_shared/editorial.ts";
import { renderNewsletterHtml } from "../_shared/newsletter.ts";

const adminToken = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";

const requireAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token") ?? "";
  return adminToken.length > 0 && token === adminToken;
};

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : fallback);
const asNullableString = (value: unknown) => {
  const normalized = asString(value);
  return normalized.length > 0 ? normalized : null;
};
const normalizeDomains = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const getDraftingSystemPrompt = (language: "fr" | "en") =>
  language === "en"
    ? `You write TransferAI Africa's premium weekly AI newsletter in English, with a Côte d'Ivoire and Africa-first business angle.

Each edition MUST include:
- 1 editorial section based on the week's global AI watch, with a clear reading of the impact for Africa and specifically Côte d'Ivoire
- 3 useful AI tools (practical, accessible, business-ready)
- 3 actionable prompts (ready to copy, adapted to African business use cases)
- 1 African use case (company/sector on the continent using AI well)
- 1 important AI update of the week (launch, model, feature)
- 1 opportunity to watch (freelance mission, AI role, call for projects, funding)
- If editorial instructions are provided in generation_notes, follow them first.
- For founder rotations, keep the founder editorial block visible and sober without diluting the business message.

Output format: strict JSON with ONLY these keys:
- title (string): editorial title
- subject (string): compelling email subject under 70 chars
- preheader (string): preview text under 110 chars
- intro (string): 2-3 sentence intro
- highlightTitle (string): title of the African use case
- highlightSummary (string): 3-5 sentence summary of the African use case
- highlightUrl (string|null): source URL if available
- tipTitle (string): title of the important AI update
- tipBody (string): 3-5 sentence explanation of the update
- toolName (string): names of the 3 tools separated by " · "
- toolCategory (string): categories such as "Productivity · Analysis · Creation"
- toolSummary (string): one markdown bullet line per tool with business use
- promptTitle (string): title for the 3 prompts section
- promptBody (string): the 3 prompts in full, numbered 1./ 2./ 3./
- ctaLabel (string): CTA button label
- ctaUrl (string): CTA URL (always https://www.transferai.ci/...)
- bodyMarkdown (string): markdown that MUST start with a section titled "## Editorial" and then include the opportunity, sector watch and closing sections

Rules:
- Premium English, expert business tone, concrete and actionable
- Always orient the edition toward business transformation, training, and AI adoption
- Prioritize Côte d'Ivoire, West Africa, and African examples
- Do not invent figures; cite sources when used
- No markdown in short fields (title, subject, intro, etc.)`
    : `Tu rédiges la newsletter hebdomadaire IA premium de TransferAI Africa, en français, avec un angle Côte d'Ivoire et Afrique.

Chaque édition DOIT contenir :
- 1 éditorial fondé sur la veille IA de la semaine dans le monde, avec une lecture claire de l'impact pour l'Afrique et spécifiquement la Côte d'Ivoire
- 3 outils IA utiles (concrets, accessibles, métier)
- 3 prompts actionnables (prêts à copier-coller, métier africain)
- 1 cas d'usage africain (entreprise/secteur sur le continent qui a réussi avec l'IA)
- 1 nouveauté IA importante de la semaine (lancement, modèle, fonctionnalité)
- 1 opportunité à surveiller (mission freelance, job IA, appel à projet, financement)
- Si des consignes éditoriales sont fournies dans generation_notes, les respecter en priorité.
- Pour les rotations du fondateur, garder le bloc éditorial visible et sobre, sans diluer le message business.

Format de sortie : JSON strict avec UNIQUEMENT ces clés :
- title (string) : titre éditorial de l'édition
- subject (string) : objet email accrocheur < 70 car
- preheader (string) : aperçu < 110 car
- intro (string) : 2-3 phrases d'introduction
- highlightTitle (string) : titre du cas d'usage africain
- highlightSummary (string) : résumé du cas d'usage africain (3-5 phrases)
- highlightUrl (string|null) : URL source si disponible
- tipTitle (string) : titre de la nouveauté IA importante
- tipBody (string) : description de la nouveauté (3-5 phrases)
- toolName (string) : nom des 3 outils séparés par " · "
- toolCategory (string) : catégories ("Productivité · Analyse · Création" par ex)
- toolSummary (string) : pour CHAQUE outil, 1 ligne d'usage métier (markdown avec puces)
- promptTitle (string) : "3 prompts actionnables cette semaine"
- promptBody (string) : les 3 prompts en clair, numérotés 1./ 2./ 3./
- ctaLabel (string) : libellé bouton CTA
- ctaUrl (string) : URL CTA (toujours https://www.transferai.ci/...)
- bodyMarkdown (string) : markdown qui DOIT commencer par une section "## Editorial" puis inclure l'opportunité, la veille sectorielle et les sections de clôture

Règles :
- Français premium, ton expert business, concret et activable
- Toujours orienter vers transformation business, formation, adoption IA
- Privilégier exemples Côte d'Ivoire, Afrique de l'Ouest, francophone
- Ne pas inventer de chiffres, citer source quand utilisé
- Pas de markdown dans les champs courts (title, subject, intro, etc.)`;

type DraftPost = {
  id: string;
  slug: string;
  title_fr: string;
  excerpt_fr: string;
  content_fr: string | null;
  sector_key: string | null;
  source_url: string | null;
  published_at: string;
};

const buildFallbackDraft = (issueDate: string, language: "fr" | "en", targetDomains: string[], posts: DraftPost[]) => {
  const primaryPost = posts[0];
  const secondaryPost = posts[1];
  const domainsLabel = targetDomains.length > 0
    ? targetDomains.join(", ")
    : language === "en"
      ? "your priority business functions"
      : "vos métiers prioritaires";
  const intro = language === "en"
    ? `Each week, TransferAI Africa curates the AI signals, use cases and actions that matter most for ${domainsLabel}, with a Côte d'Ivoire and Africa-first lens.`
    : `Chaque semaine, TransferAI Africa synthétise pour vous les signaux, usages et actions IA les plus utiles pour ${domainsLabel}, avec un angle Côte d'Ivoire et Afrique.`;
  const bodyMarkdown = [
    "## Editorial",
    language === "en"
      ? "Global AI momentum is increasingly shifting from raw model performance to trust, governance and day-to-day integration. For Africa, and especially Côte d'Ivoire, the opportunity is no longer just to observe this transition, but to structure practical adoption around local skills, secure data practices and business-ready workflows."
      : "La dynamique mondiale de l'IA se déplace de plus en plus de la performance brute des modèles vers la confiance, la gouvernance et l'intégration au travail quotidien. Pour l'Afrique, et plus particulièrement pour la Côte d'Ivoire, l'enjeu n'est plus seulement d'observer cette transition, mais de structurer une adoption concrète autour des talents locaux, de la sécurité des données et de workflows réellement utiles aux métiers.",
    "",
    language === "en" ? "## In this edition" : "## Dans cette édition",
    primaryPost
      ? language === "en"
        ? `- Key signal: ${primaryPost.title_fr}`
        : `- Le signal à retenir : ${primaryPost.title_fr}`
      : language === "en"
        ? "- Key signal: a high-impact AI business use case"
        : "- Le signal à retenir : un cas d'usage IA à fort impact business",
    secondaryPost
      ? language === "en"
        ? `- A second angle to watch: ${secondaryPost.title_fr}`
        : `- Un deuxième angle utile : ${secondaryPost.title_fr}`
      : language === "en"
        ? "- A practical move to launch this week"
        : "- Un conseil pratique activable cette semaine",
    language === "en" ? "- A tool worth knowing" : "- Un outil à connaître pour mieux travailler",
    language === "en" ? "- A simple prompt to adapt to your work" : "- Un prompt simple à adapter à votre métier",
    "",
    language === "en"
      ? "Recommended next step: pick one use case, test it on a limited scope, document the gain observed and prepare a wider adoption plan."
      : "Prochaine étape recommandée : choisissez un cas d'usage, testez-le sur un périmètre réduit, documentez le gain observé et préparez un plan d'adoption plus large.",
  ].join("\n");

  return {
    title: language === "en" ? `TransferAI Africa AI Newsletter · ${issueDate}` : `Newsletter IA TransferAI Africa · ${issueDate}`,
    subject: language === "en"
      ? `The AI signals to watch this week for ${targetDomains[0] ?? "your teams"}`
      : `Les signaux IA à suivre cette semaine pour ${targetDomains[0] ?? "vos métiers"}`,
    preheader: language === "en"
      ? "A concise, useful edition focused on practical AI uses for Côte d'Ivoire and Africa."
      : "Une édition concise, utile et orientée usages concrets pour la Côte d'Ivoire et l'Afrique.",
    intro,
    highlightTitle: primaryPost?.title_fr ?? (language === "en" ? "This week's key signal" : "Le signal clé de la semaine"),
    highlightSummary:
      primaryPost?.excerpt_fr ??
      (language === "en"
        ? "A business signal worth watching for teams that want to integrate AI with method and measurable impact."
        : "Un signal métier qui mérite l'attention des équipes qui veulent intégrer l'IA avec méthode et impact concret."),
    highlightUrl: primaryPost?.source_url ?? null,
    tipTitle: language === "en" ? "The practical reflex to adopt" : "Le réflexe utile à appliquer",
    tipBody:
      language === "en"
        ? "Do not deploy AI everywhere at once. Choose one business pain point, define the target deliverable, the expected time gain and a clear human validation step."
        : "Ne déployez pas l'IA partout en même temps. Choisissez un seul irritant métier, définissez un livrable cible, un temps gagné attendu et une validation humaine claire.",
    toolName: language === "en" ? "ChatGPT, Claude or Gemini" : "ChatGPT, Claude ou Gemini",
    toolCategory: language === "en" ? "Business copilot" : "Copilote métier",
    toolSummary:
      language === "en"
        ? "Use them first to frame a task, synthesize information, prepare deliverables and accelerate analysis. The best use is not to delegate everything, but to structure better human work."
        : "Utilisez-les d'abord pour cadrer, synthétiser, préparer des livrables et accélérer vos analyses. Le bon usage ne consiste pas à tout déléguer, mais à structurer un meilleur travail humain.",
    promptTitle: language === "en" ? "Prompt ready to adapt" : "Prompt prêt à adapter",
    promptBody:
      language === "en"
        ? "Act as a business lead. Help me turn this topic into an operational note. Give me: 1) the stakes, 2) the risks, 3) the actions to launch in the next 7 days, 4) the indicators to track."
        : "Agis comme un responsable métier. Aide-moi à transformer ce sujet en note opérationnelle. Donne-moi : 1) les enjeux, 2) les risques, 3) les actions à lancer en 7 jours, 4) les indicateurs à suivre.",
    ctaLabel: language === "en" ? "Explore TransferAI resources" : "Découvrir les ressources TransferAI",
    ctaUrl: "https://www.transferai.ci/blog",
    bodyMarkdown,
  };
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!requireAdmin(request)) {
    return json(401, { error: "Unauthorized." });
  }

  let body: {
    issue_id?: string;
    issue_date?: string;
    language?: "fr" | "en";
    target_domains?: string[];
    source_post_ids?: string[];
    generation_notes?: string;
    dry_run?: boolean;
    auto_publish?: boolean;
  } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const issueDate = asString(body.issue_date, new Date().toISOString().slice(0, 10));
  const issueId = asString(body.issue_id);
  const language = body.language === "en" ? "en" : "fr";
  const targetDomains = normalizeDomains(body.target_domains);
  const sourcePostIds = normalizeDomains(body.source_post_ids);
  const generationNotes = asNullableString(body.generation_notes);
  const dryRun = body.dry_run === true;
  const autoPublish = body.auto_publish === true;

  const provider = Deno.env.get("ANTHROPIC_API_KEY")
    ? "anthropic"
    : Deno.env.get("OPENAI_API_KEY")
      ? "openai"
      : Deno.env.get("LOVABLE_API_KEY")
        ? "lovable-ai"
        : "heuristic";

  const model = provider === "anthropic"
    ? "claude-3-7-sonnet-latest"
    : provider === "openai"
      ? "gpt-4.1-mini"
      : provider === "lovable-ai"
        ? "google/gemini-2.5-flash"
        : "heuristic-v1";

  const { data: job } = await editorialClient
    .from("editorial_jobs")
    .insert({
      job_type: "newsletter_draft",
      provider,
      model,
      input_payload: {
        issueDate,
        language,
        targetDomains,
        sourcePostIds,
        generationNotes,
      },
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  try {
    let postsQuery = editorialClient
      .from("resource_posts")
      .select("id, slug, title_fr, excerpt_fr, content_fr, sector_key, source_url, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6);

    if (sourcePostIds.length > 0) {
      postsQuery = postsQuery.in("id", sourcePostIds);
    } else if (targetDomains.length > 0) {
      postsQuery = postsQuery.in("sector_key", targetDomains);
    }

    const { data: posts, error: postsError } = await postsQuery;

    if (postsError) {
      throw postsError;
    }

    const selectedPosts = (posts ?? []) as DraftPost[];
    const fallbackDraft = buildFallbackDraft(issueDate, language, targetDomains, selectedPosts);

    let aiDraft:
      | {
          title?: string;
          subject?: string;
          preheader?: string;
          intro?: string;
          highlightTitle?: string;
          highlightSummary?: string;
          highlightUrl?: string;
          tipTitle?: string;
          tipBody?: string;
          toolName?: string;
          toolCategory?: string;
          toolSummary?: string;
          promptTitle?: string;
          promptBody?: string;
          ctaLabel?: string;
          ctaUrl?: string;
          bodyMarkdown?: string;
        }
      | null = null;

    const promptPayload = {
      issueDate,
      language,
      targetDomains,
      selectedPosts,
      fallbackDraft,
      generationNotes,
      officialStructure: [
        ...(language === "en"
          ? [
            "Editorial",
            "Key signal",
            "Practical tip",
            "Tool to know",
            "Prompt of the week",
            "Next step",
          ]
          : [
            "Editorial",
            "Signal clé",
            "Conseil pratique",
            "Outil à connaître",
            "Prompt de la semaine",
            "Prochaine étape",
          ]),
      ],
    };

    if (Deno.env.get("ANTHROPIC_API_KEY")) {
      const anthropicText = await callAnthropicText({
        systemPrompt: getDraftingSystemPrompt(language),
        userPrompt: JSON.stringify(promptPayload),
      }).catch(() => null);

      if (anthropicText) {
        aiDraft = await callOpenAIJson({
          systemPrompt: "Convert this newsletter draft into strict JSON using the requested keys only.",
          userPrompt: anthropicText,
        }).catch(() => null);
      }
    } else if (Deno.env.get("OPENAI_API_KEY")) {
      aiDraft = await callOpenAIJson({
        systemPrompt: getDraftingSystemPrompt(language),
        userPrompt: JSON.stringify(promptPayload),
      }).catch(() => null);
    } else if (Deno.env.get("LOVABLE_API_KEY")) {
      aiDraft = await callLovableAIJson({
        systemPrompt: getDraftingSystemPrompt(language),
        userPrompt: JSON.stringify(promptPayload),
      }).catch((error) => {
        console.error("Lovable AI draft failed:", error);
        return null;
      });
    }

    const finalStatus = autoPublish ? "approved" : "review";
    const nowIso = new Date().toISOString();

    const issue = {
      issue_date: issueDate,
      language,
      status: finalStatus,
      scheduled_for: autoPublish ? nowIso : null,
      approved_at: autoPublish ? nowIso : null,
      title: asString(aiDraft?.title, fallbackDraft.title),
      subject: asString(aiDraft?.subject, fallbackDraft.subject),
      preheader: asNullableString(aiDraft?.preheader) ?? fallbackDraft.preheader,
      intro: asNullableString(aiDraft?.intro) ?? fallbackDraft.intro,
      target_domains: targetDomains,
      generation_notes: generationNotes,
      highlight_title: asNullableString(aiDraft?.highlightTitle) ?? fallbackDraft.highlightTitle,
      highlight_summary: asNullableString(aiDraft?.highlightSummary) ?? fallbackDraft.highlightSummary,
      highlight_url: asNullableString(aiDraft?.highlightUrl) ?? fallbackDraft.highlightUrl,
      tip_title: asNullableString(aiDraft?.tipTitle) ?? fallbackDraft.tipTitle,
      tip_body: asNullableString(aiDraft?.tipBody) ?? fallbackDraft.tipBody,
      tool_name: asNullableString(aiDraft?.toolName) ?? fallbackDraft.toolName,
      tool_category: asNullableString(aiDraft?.toolCategory) ?? fallbackDraft.toolCategory,
      tool_summary: asNullableString(aiDraft?.toolSummary) ?? fallbackDraft.toolSummary,
      prompt_title: asNullableString(aiDraft?.promptTitle) ?? fallbackDraft.promptTitle,
      prompt_body: asNullableString(aiDraft?.promptBody) ?? fallbackDraft.promptBody,
      cta_label: asNullableString(aiDraft?.ctaLabel) ?? fallbackDraft.ctaLabel,
      cta_url: asNullableString(aiDraft?.ctaUrl) ?? fallbackDraft.ctaUrl,
      body_markdown: asNullableString(aiDraft?.bodyMarkdown) ?? fallbackDraft.bodyMarkdown,
      body_html: null,
      source_post_ids: selectedPosts.map((post) => post.id),
      generation_source: aiDraft ? "ai" : "hybrid",
      generation_notes: [
        generationNotes,
        targetDomains.length > 0
          ? `Edition préparée à partir des domaines : ${targetDomains.join(", ")}`
          : "Edition préparée à partir des contenus récents publiés.",
      ].filter(Boolean).join(" | "),
    };

    const issueWithHtml = {
      ...issue,
      body_html: renderNewsletterHtml({
        id: "preview",
        issue_date: issue.issue_date,
        language,
        status: issue.status,
        title: issue.title,
        subject: issue.subject,
        preheader: issue.preheader,
        intro: issue.intro,
        target_domains: issue.target_domains,
        highlight_title: issue.highlight_title,
        highlight_summary: issue.highlight_summary,
        highlight_url: issue.highlight_url,
        tip_title: issue.tip_title,
        tip_body: issue.tip_body,
        tool_name: issue.tool_name,
        tool_category: issue.tool_category,
        tool_summary: issue.tool_summary,
        prompt_title: issue.prompt_title,
        prompt_body: issue.prompt_body,
        cta_label: issue.cta_label,
        cta_url: issue.cta_url,
        body_markdown: issue.body_markdown,
        body_html: null,
      }),
    };

    if (dryRun) {
      if (job?.id) {
        await editorialClient
          .from("editorial_jobs")
          .update({
            status: "done",
            output_payload: issueWithHtml,
            finished_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }

      return json(200, { data: { issue: issueWithHtml, created: false } });
    }

    const persistedIssueQuery = issueId
      ? editorialClient
        .from("newsletter_issues")
        .update(issueWithHtml)
        .eq("id", issueId)
        .select("*")
        .single()
      : editorialClient
        .from("newsletter_issues")
        .insert(issueWithHtml)
        .select("*")
        .single();

    const { data: createdIssue, error: issueError } = await persistedIssueQuery;

    if (issueError) {
      throw issueError;
    }

    if (job?.id) {
      await editorialClient
        .from("editorial_jobs")
        .update({
          status: "done",
          output_payload: createdIssue,
          finished_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    return json(200, { data: { issue: createdIssue, created: !issueId } });
  } catch (error) {
    if (job?.id) {
      await editorialClient
        .from("editorial_jobs")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : "newsletter_draft_failed",
          finished_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    return json(400, { error: error instanceof Error ? error.message : "newsletter_draft_failed" });
  }
});
