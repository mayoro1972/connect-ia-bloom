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

const draftingSystemPrompt = `Tu rédiges la newsletter hebdomadaire IA premium de TransferAI Africa, en français, avec un angle Côte d'Ivoire et Afrique.

Chaque édition DOIT contenir :
- 3 outils IA utiles (concrets, accessibles, métier)
- 3 prompts actionnables (prêts à copier-coller, métier africain)
- 1 cas d'usage africain (entreprise/secteur sur le continent qui a réussi avec l'IA)
- 1 nouveauté IA importante de la semaine (lancement, modèle, fonctionnalité)
- 1 opportunité à surveiller (mission freelance, job IA, appel à projet, financement)

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
- bodyMarkdown (string) : section "Opportunité à surveiller" en markdown (mission, job, financement, IA Afrique)

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

const buildFallbackDraft = (issueDate: string, targetDomains: string[], posts: DraftPost[]) => {
  const primaryPost = posts[0];
  const secondaryPost = posts[1];
  const domainsLabel = targetDomains.length > 0 ? targetDomains.join(", ") : "vos métiers prioritaires";
  const intro = `Chaque semaine, TransferAI Africa synthétise pour vous les signaux, usages et actions IA les plus utiles pour ${domainsLabel}, avec un angle Côte d'Ivoire et Afrique.`;
  const bodyMarkdown = [
    "Dans cette édition :",
    primaryPost ? `- Le signal à retenir : ${primaryPost.title_fr}` : "- Le signal à retenir : un cas d'usage IA à fort impact business",
    secondaryPost ? `- Un deuxième angle utile : ${secondaryPost.title_fr}` : "- Un conseil pratique activable cette semaine",
    "- Un outil à connaître pour mieux travailler",
    "- Un prompt simple à adapter à votre métier",
    "",
    "Prochaine étape recommandée : choisissez un cas d'usage, testez-le sur un périmètre réduit, documentez le gain observé et préparez un plan d'adoption plus large.",
  ].join("\n");

  return {
    title: `Newsletter IA TransferAI Africa · ${issueDate}`,
    subject: `Les signaux IA à suivre cette semaine pour ${targetDomains[0] ?? "vos métiers"}`,
    preheader: "Une édition concise, utile et orientée usages concrets pour la Côte d'Ivoire et l'Afrique.",
    intro,
    highlightTitle: primaryPost?.title_fr ?? "Le signal clé de la semaine",
    highlightSummary:
      primaryPost?.excerpt_fr ??
      "Un signal métier qui mérite l'attention des équipes qui veulent intégrer l'IA avec méthode et impact concret.",
    highlightUrl: primaryPost?.source_url ?? null,
    tipTitle: "Le réflexe utile à appliquer",
    tipBody:
      "Ne déployez pas l'IA partout en même temps. Choisissez un seul irritant métier, définissez un livrable cible, un temps gagné attendu et une validation humaine claire.",
    toolName: "ChatGPT, Claude ou Gemini",
    toolCategory: "Copilote métier",
    toolSummary:
      "Utilisez-les d'abord pour cadrer, synthétiser, préparer des livrables et accélérer vos analyses. Le bon usage ne consiste pas à tout déléguer, mais à structurer un meilleur travail humain.",
    promptTitle: "Prompt prêt à adapter",
    promptBody:
      "Agis comme un responsable métier. Aide-moi à transformer ce sujet en note opérationnelle. Donne-moi : 1) les enjeux, 2) les risques, 3) les actions à lancer en 7 jours, 4) les indicateurs à suivre.",
    ctaLabel: "Découvrir les ressources TransferAI",
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
    issue_date?: string;
    language?: "fr" | "en";
    target_domains?: string[];
    source_post_ids?: string[];
    dry_run?: boolean;
  } = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const issueDate = asString(body.issue_date, new Date().toISOString().slice(0, 10));
  const language = body.language === "en" ? "en" : "fr";
  const targetDomains = normalizeDomains(body.target_domains);
  const sourcePostIds = normalizeDomains(body.source_post_ids);
  const dryRun = body.dry_run === true;

  const { data: job } = await editorialClient
    .from("editorial_jobs")
    .insert({
      job_type: "newsletter_draft",
      provider: Deno.env.get("ANTHROPIC_API_KEY")
        ? "anthropic"
        : Deno.env.get("OPENAI_API_KEY")
          ? "openai"
          : "heuristic",
      model: Deno.env.get("ANTHROPIC_API_KEY")
        ? "claude-3-7-sonnet-latest"
        : Deno.env.get("OPENAI_API_KEY")
          ? "gpt-4.1-mini"
          : "heuristic-v1",
      input_payload: {
        issueDate,
        language,
        targetDomains,
        sourcePostIds,
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
    const fallbackDraft = buildFallbackDraft(issueDate, targetDomains, selectedPosts);

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
      officialStructure: [
        "Signal clé",
        "Conseil pratique",
        "Outil à connaître",
        "Prompt de la semaine",
        "Prochaine étape",
      ],
    };

    if (Deno.env.get("ANTHROPIC_API_KEY")) {
      const anthropicText = await callAnthropicText({
        systemPrompt: draftingSystemPrompt,
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
        systemPrompt: draftingSystemPrompt,
        userPrompt: JSON.stringify(promptPayload),
      }).catch(() => null);
    }

    const issue = {
      issue_date: issueDate,
      language,
      status: "review",
      title: asString(aiDraft?.title, fallbackDraft.title),
      subject: asString(aiDraft?.subject, fallbackDraft.subject),
      preheader: asNullableString(aiDraft?.preheader) ?? fallbackDraft.preheader,
      intro: asNullableString(aiDraft?.intro) ?? fallbackDraft.intro,
      target_domains: targetDomains,
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
      generation_notes: targetDomains.length > 0
        ? `Edition préparée à partir des domaines : ${targetDomains.join(", ")}`
        : "Edition préparée à partir des contenus récents publiés.",
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

    const { data: createdIssue, error: issueError } = await editorialClient
      .from("newsletter_issues")
      .insert(issueWithHtml)
      .select("*")
      .single();

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

    return json(200, { data: { issue: createdIssue, created: true } });
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
