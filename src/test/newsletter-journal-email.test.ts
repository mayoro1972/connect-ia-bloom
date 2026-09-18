import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderJournalEmail } from "../../scripts/newsletter-journal-email";
import { renderNewsletterHtml, type NewsletterIssueRecord } from "../../supabase/functions/_shared/newsletter";

const edition = path.resolve(__dirname, "../../docs/newsletter-premium/editions/2026-09-18");
const body = fs.readFileSync(path.join(edition, "newsletter-body.html"), "utf8");
const meta = JSON.parse(fs.readFileSync(path.join(edition, "meta.json"), "utf8"));

describe("renderJournalEmail", () => {
  const email = renderJournalEmail(body, meta);

  it("builds a complete, table-based email without the premium stylesheet", () => {
    expect(email).toMatch(/^<!doctype html>/i);
    expect(email).toContain('role="presentation"');
    expect(email).not.toContain("display:grid");
    expect(email).not.toContain("fonts.googleapis.com");
    expect(email.length).toBeLessThan(100_000);
  });

  it("keeps every section of the edition", () => {
    for (const text of [
      "77 cas d’usage.",
      "Ralentir la frontière, accélérer l’usage",
      "IMPACT IA 2026 : place aux cas d’usage",
      "Trois blocages, trois réponses",
      "De l’idée à la fiche pilote vérifiée",
      "À adapter à votre prochain projet",
      "Pas de cas d’usage sans inventaire des données",
      "Explorer les formations TransferAI",
      "Pour vérifier et approfondir",
      "contact@transferai.ci",
    ]) {
      expect(email).toContain(text);
    }
    expect(email).toContain("https://www.transferai.ci/assets/team-marius-");
    expect(email).toContain("Une fiche pilote d");
  });
});

describe("renderNewsletterHtml with a Journal issue", () => {
  it("sends the prebuilt Journal email as is, without the legacy wrapper", () => {
    const email = renderJournalEmail(body, meta);
    const issue = {
      id: "journal",
      issue_date: "2026-09-18",
      language: "fr",
      status: "draft",
      title: meta.title,
      subject: meta.subject,
      preheader: meta.preheader,
      intro: meta.intro,
      target_domains: [],
      highlight_title: null,
      highlight_summary: null,
      highlight_url: null,
      tip_title: null,
      tip_body: null,
      tool_name: meta.tool_name,
      tool_category: null,
      tool_summary: null,
      prompt_title: meta.prompt_title,
      prompt_body: null,
      cta_label: meta.cta_label,
      cta_url: meta.cta_url,
      body_markdown: null,
      body_html: email,
      meta: { journal: true, email_format: "journal-email-v1" },
    } satisfies NewsletterIssueRecord;

    const html = renderNewsletterHtml(issue);
    expect(html).toBe(email);
    expect(html).not.toContain("Newsletter IA hebdomadaire");
  });
});
