import { describe, expect, it } from "vitest";
import { renderNewsletterHtml, type NewsletterIssueRecord } from "../../supabase/functions/_shared/newsletter";

const sampleIssue: NewsletterIssueRecord = {
  id: "issue-1",
  issue_date: "2026-05-22",
  language: "fr",
  status: "review",
  title: "Newsletter IA TransferAI Africa · Souveraineté, productivité et actions concrètes",
  subject: "IA utile pour la Côte d'Ivoire et l'Afrique : le signal à suivre cette semaine",
  preheader: "Provenance, souveraineté des données, adoption métier et opportunités utiles.",
  intro:
    "Cette édition met en avant les signaux IA qui comptent vraiment pour les équipes en Côte d'Ivoire et en Afrique : ce qu'il faut vérifier, ce qu'il faut tester et ce qu'il faut documenter avant d'accélérer.",
  target_domains: [],
  highlight_title: "La provenance devient un avantage business",
  highlight_summary:
    "Les contenus générés par IA ne se jugent plus seulement sur leur qualité visible, mais aussi sur leur origine, leur traçabilité et leur capacité à être vérifiés.",
  highlight_url: "https://openai.com/index/advancing-content-provenance/",
  tip_title: "Standardiser avant d'automatiser",
  tip_body:
    "Avant de confier un processus à l'IA, standardisez d'abord le livrable cible, les règles de validation et le contrôle humain final.",
  tool_name: "ChatGPT · Claude · Gemini",
  tool_category: "Copilote métier",
  tool_summary:
    "- ChatGPT: structurer une note, un compte rendu ou un email plus vite.\n- Claude: affiner un document long, un brief ou une synthèse.\n- Gemini: travailler dans l'écosystème Google.",
  prompt_title: "Prompt prêt à copier",
  prompt_body:
    "Agis comme un responsable métier. À partir du sujet ci-dessous, produis un plan en 5 parties.",
  cta_label: "Découvrir les ressources TransferAI",
  cta_url: "https://www.transferai.ci/blog",
  body_markdown:
    "## Opportunité à saisir\n\n**UNICEF - Digital Platforms**\n- Mission pertinente pour un profil produit.\n- Angle utile pour l'Afrique.\n\n## Idées de contenus courts\n1. Carousel LinkedIn.\n2. Post newsletter.",
  body_html: "<div><p>Éditorial du fondateur</p></div>",
};

describe("renderNewsletterHtml", () => {
  it("keeps a rich editorial fragment without dropping the other newsletter sections", () => {
    const html = renderNewsletterHtml(sampleIssue);

    expect(html).toContain("Éditorial du fondateur");
    expect(html).toContain("Cette édition met en avant les signaux IA");
    expect(html).toContain("La provenance devient un avantage business");
    expect(html).toContain("ChatGPT · Claude · Gemini");
    expect(html).toContain("Prompt prêt à copier");
    expect(html).toContain("Découvrir les ressources TransferAI");
    expect(html).toContain("Opportunité à saisir");
    expect(html).toContain("Mission pertinente pour un profil produit.");
    expect(html).toContain("Carousel LinkedIn.");
  });
});
