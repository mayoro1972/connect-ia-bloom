export type NewsletterIssueRecord = {
  id: string;
  issue_date: string;
  language: "fr" | "en";
  status: string;
  title: string;
  subject: string;
  preheader: string | null;
  intro: string | null;
  target_domains: string[];
  highlight_title: string | null;
  highlight_summary: string | null;
  highlight_url: string | null;
  tip_title: string | null;
  tip_body: string | null;
  tool_name: string | null;
  tool_category: string | null;
  tool_summary: string | null;
  prompt_title: string | null;
  prompt_body: string | null;
  cta_label: string | null;
  cta_url: string | null;
  body_markdown: string | null;
  body_html: string | null;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const paragraphize = (value: string) =>
  value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 14px;line-height:1.7;color:#475569;font-size:15px;">${escapeHtml(paragraph)}</p>`)
    .join("");

export const normalizeDomains = (domains: unknown) =>
  Array.isArray(domains)
    ? domains
        .filter((domain): domain is string => typeof domain === "string")
        .map((domain) => domain.trim())
        .filter(Boolean)
    : [];

export const domainsIntersect = (left: string[], right: string[]) => {
  if (left.length === 0 || right.length === 0) {
    return false;
  }

  const rightSet = new Set(right);
  return left.some((value) => rightSet.has(value));
};

export const renderNewsletterHtml = (issue: NewsletterIssueRecord) => {
  const domains = issue.target_domains.length > 0 ? issue.target_domains.join(" · ") : issue.language === "en" ? "All domains" : "Tous les domaines";
  const introBlock = issue.intro ? paragraphize(issue.intro) : "";
  const bodyBlock = issue.body_html?.trim() ? issue.body_html : issue.body_markdown ? paragraphize(issue.body_markdown) : "";
  const highlightBlock = issue.highlight_title || issue.highlight_summary
    ? `
      <div style="margin:28px 0;padding:22px;border:1px solid #fed7aa;border-radius:20px;background:#fff7ed;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#f97316;">${issue.language === "en" ? "Key signal" : "Signal clé"}</p>
        ${issue.highlight_title ? `<h2 style="margin:0 0 10px;font-size:22px;line-height:1.3;color:#0f172a;">${escapeHtml(issue.highlight_title)}</h2>` : ""}
        ${issue.highlight_summary ? `<div>${paragraphize(issue.highlight_summary)}</div>` : ""}
        ${issue.highlight_url ? `<a href="${issue.highlight_url}" style="display:inline-block;margin-top:8px;color:#f97316;font-weight:700;text-decoration:none;">${issue.language === "en" ? "Open the source" : "Ouvrir la source"} →</a>` : ""}
      </div>
    `
    : "";

  const tipBlock = issue.tip_title || issue.tip_body
    ? `
      <div style="margin:0 0 24px;padding:20px;border:1px solid #e2e8f0;border-radius:18px;background:#ffffff;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#f97316;">${issue.language === "en" ? "Practical tip" : "Conseil pratique"}</p>
        ${issue.tip_title ? `<h3 style="margin:0 0 8px;font-size:18px;color:#0f172a;">${escapeHtml(issue.tip_title)}</h3>` : ""}
        ${issue.tip_body ? paragraphize(issue.tip_body) : ""}
      </div>
    `
    : "";

  const toolBlock = issue.tool_name || issue.tool_summary
    ? `
      <div style="margin:0 0 24px;padding:20px;border:1px solid #e2e8f0;border-radius:18px;background:#ffffff;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#f97316;">${issue.language === "en" ? "Tool to know" : "Outil à connaître"}</p>
        ${issue.tool_name ? `<h3 style="margin:0 0 6px;font-size:18px;color:#0f172a;">${escapeHtml(issue.tool_name)}</h3>` : ""}
        ${issue.tool_category ? `<p style="margin:0 0 10px;font-size:13px;color:#64748b;">${escapeHtml(issue.tool_category)}</p>` : ""}
        ${issue.tool_summary ? paragraphize(issue.tool_summary) : ""}
      </div>
    `
    : "";

  const promptBlock = issue.prompt_title || issue.prompt_body
    ? `
      <div style="margin:0 0 24px;padding:20px;border:1px solid #fdedd5;border-radius:18px;background:#fffaf4;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#f97316;">${issue.language === "en" ? "Prompt of the week" : "Prompt de la semaine"}</p>
        ${issue.prompt_title ? `<h3 style="margin:0 0 8px;font-size:18px;color:#0f172a;">${escapeHtml(issue.prompt_title)}</h3>` : ""}
        ${issue.prompt_body ? `<pre style="margin:0;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.6;color:#334155;">${escapeHtml(issue.prompt_body)}</pre>` : ""}
      </div>
    `
    : "";

  const ctaBlock = issue.cta_label && issue.cta_url
    ? `
      <div style="margin:28px 0 0;">
        <a href="${issue.cta_url}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:linear-gradient(90deg,#f97316,#fb923c);color:#ffffff;font-weight:700;text-decoration:none;">
          ${escapeHtml(issue.cta_label)}
        </a>
      </div>
    `
    : "";

  return `
    <!doctype html>
    <html lang="${issue.language}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(issue.subject)}</title>
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Segoe UI,Arial,sans-serif;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          ${escapeHtml(issue.preheader ?? "")}
        </div>
        <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
          <div style="padding:36px;border-radius:28px;background:#ffffff;border:1px solid #e2e8f0;">
            <p style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#f97316;">
              TransferAI Africa · ${issue.language === "en" ? "Weekly AI newsletter" : "Newsletter IA hebdomadaire"}
            </p>
            <h1 style="margin:0 0 12px;font-size:34px;line-height:1.15;color:#0f172a;">${escapeHtml(issue.title)}</h1>
            <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#64748b;">
              ${escapeHtml(issue.issue_date)} · ${escapeHtml(domains)}
            </p>
            ${introBlock}
            ${highlightBlock}
            ${tipBlock}
            ${toolBlock}
            ${promptBlock}
            ${bodyBlock}
            ${ctaBlock}
          </div>
        </div>
      </body>
    </html>
  `;
};
