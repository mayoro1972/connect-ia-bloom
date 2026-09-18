// Version email de « TransferAI — Le Journal ».
// La page premium (grilles CSS, <style>, polices web) n'est pas lisible dans Gmail ou Outlook :
// on reconstruit la même édition en tableaux, une colonne de 600 px, styles en ligne.
// Entrée : newsletter-body.html d'une édition (structure et classes du gabarit premium).
import { JSDOM } from "jsdom";

const C = {
  page: "#e7e7df",
  paper: "#faf8f2",
  ink: "#192b27",
  muted: "#626962",
  line: "#d6d8ca",
  orange: "#b85227",
  green: "#173d32",
  tint: "#edeedf",
  sand: "#deb78c",
  cream: "#f9f5e9",
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Arial,Helvetica,sans-serif";
// Remplacé à l'envoi par le lien personnel de chaque destinataire (supabase/functions/_shared/unsubscribe.ts).
const UNSUBSCRIBE_PLACEHOLDER = "%%UNSUBSCRIBE_URL%%";

const kickerStyle = (color = C.orange) =>
  `margin:0 0 10px;font-family:${SANS};font-size:11px;line-height:1.5;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${color};`;
const textStyle = `margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.ink};`;
const captionStyle = `margin:0 0 14px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted};`;
const h2Style = (size = 26, color = C.ink) =>
  `margin:0 0 14px;font-family:${SERIF};font-size:${size}px;line-height:1.2;font-weight:normal;color:${color};`;
const h3Style = `margin:20px 0 8px;font-family:${SANS};font-size:16px;line-height:1.4;font-weight:bold;color:${C.ink};`;

type Row = string;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Contenu en ligne d'un élément : liens, gras et italique reçoivent des styles en ligne. */
const inline = (element: Element, linkColor = C.orange) => {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll("a").forEach((link) => {
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("style", `color:${linkColor};text-decoration:underline;`);
  });
  clone.querySelectorAll("strong").forEach((node) => node.setAttribute("style", "font-weight:bold;"));
  clone.querySelectorAll("em").forEach((node) => node.setAttribute("style", `font-style:italic;color:${C.orange};`));
  clone.querySelectorAll("sup").forEach((node) => node.setAttribute("style", "font-size:70%;line-height:0;"));
  return clone.innerHTML.trim();
};

const rule = (color = C.line, weight = 1) =>
  `<tr><td class="px" style="padding:0 32px;"><div style="border-top:${weight}px solid ${color};font-size:0;line-height:0;">&nbsp;</div></td></tr>`;

const section = (content: string, padding = "28px 32px") => `<tr><td class="px" style="padding:${padding};">${content}</td></tr>`;

const box = (content: string, background: string, border = "") =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 16px;"><tr><td style="padding:18px 20px;background:${background};${border}">${content}</td></tr></table>`;

/** Rendu générique des blocs du gabarit (p, h2, h3, ol, kicker, légende). */
const block = (element: Element, options: { onDark?: boolean } = {}): string => {
  const cls = element.classList;
  const tag = element.tagName.toLowerCase();
  const color = options.onDark ? C.cream : C.ink;
  const link = options.onDark ? C.sand : C.orange;

  if (cls.contains("ta-kicker")) return `<p style="${kickerStyle(options.onDark ? C.sand : C.orange)}">${inline(element, link)}</p>`;
  if (cls.contains("ta-caption")) return `<p style="${captionStyle}">${inline(element, link)}</p>`;
  if (cls.contains("ta-rule")) {
    return box([...element.children].map((child) => `<p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.7;color:${C.ink};">${inline(child)}</p>`).join(""), C.tint, `border-left:3px solid ${C.orange};`);
  }
  if (cls.contains("ta-prompt")) {
    return box([...element.children].map((child) => `<p style="margin:0;font-family:${SERIF};font-size:15px;line-height:1.8;color:${C.ink};">${inline(child)}</p>`).join(""), "#ffffff", `border:1px solid ${C.line};`);
  }
  if (cls.contains("ta-action")) {
    const href = element.getAttribute("href") ?? "https://www.transferai.ci";
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;"><tr><td bgcolor="${C.orange}" style="background:${C.orange};"><a href="${href}" style="display:inline-block;padding:14px 22px;font-family:${SANS};font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">${escapeHtml(element.textContent?.trim() ?? "")}</a></td></tr></table>`;
  }
  if (tag === "h1") return `<h1 style="margin:0 0 16px;font-family:${SERIF};font-size:40px;line-height:1.05;font-weight:normal;color:${C.ink};">${inline(element)}</h1>`;
  if (tag === "h2") return `<h2 style="${h2Style(26, color)}">${inline(element, link)}</h2>`;
  if (tag === "h3") return `<h3 style="${h3Style}">${inline(element)}</h3>`;
  if (tag === "p") {
    const style = cls.contains("ta-intro") ? `margin:0;font-family:${SANS};font-size:17px;line-height:1.65;color:${C.ink};` : textStyle.replace(C.ink, color);
    return `<p style="${style}">${inline(element, link)}</p>`;
  }
  if (tag === "ol") {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 12px;">${[...element.querySelectorAll(":scope > li")]
      .map((item, index) => `<tr><td valign="top" width="34" style="padding:12px 0 0;border-top:1px solid ${C.line};font-family:${SERIF};font-size:22px;line-height:1;color:${C.green};">${index + 1}</td><td valign="top" style="padding:12px 0 10px;border-top:1px solid ${C.line};font-family:${SANS};font-size:14px;line-height:1.7;color:${C.ink};">${inline(item)}</td></tr>`)
      .join("")}</table>`;
  }
  if (tag === "div" || tag === "section" || tag === "aside" || tag === "header") {
    return [...element.children].map((child) => block(child, options)).join("");
  }
  return "";
};

const renderHeader = (header: Element) => {
  const line = [...header.querySelectorAll(".edition-line > *")].map((node) => escapeHtml(node.textContent?.trim() ?? ""));
  const caption = [...header.querySelectorAll(".masthead-caption span")].map((node) => escapeHtml(node.textContent?.trim() ?? ""));
  const small = `font-family:${SANS};font-size:10px;line-height:1.5;letter-spacing:1.5px;text-transform:uppercase;`;
  return section(`
    <p style="margin:0 0 12px;padding-bottom:10px;border-bottom:1px solid ${C.ink};${small}color:${C.muted};">${line.join(" &nbsp;·&nbsp; ")}</p>
    <p style="margin:0 0 12px;font-family:${SERIF};font-size:44px;line-height:1;letter-spacing:-1px;color:${C.ink};">Transfer<span style="color:${C.orange};">AI</span> Le Journal</p>
    <p style="margin:0;padding:8px 0;border-top:1px solid ${C.ink};border-bottom:3px solid ${C.ink};${small}color:${C.ink};">${caption[0] ?? ""}${caption[1] ? ` &nbsp;·&nbsp; <span style="color:${C.orange};">${caption[1]}</span>` : ""}</p>`, "24px 32px 0");
};

const renderFrontPage = (front: Element) => {
  const intro = [...front.querySelectorAll(":scope > div > *")].map((child) => block(child)).join("");
  const menu = front.querySelector(".issue-menu");
  const items = menu
    ? [...menu.querySelectorAll("a")].map((link) => {
        const number = link.querySelector("span")?.textContent?.trim() ?? "";
        const label = link.textContent?.replace(number, "").trim() ?? "";
        return `<tr><td width="28" style="padding:7px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:11px;color:${C.orange};">${escapeHtml(number)}</td><td style="padding:7px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:13px;color:${C.ink};">${escapeHtml(label)}</td></tr>`;
      })
    : [];
  const menuTitle = menu?.querySelector("p")?.textContent?.trim() ?? "Dans cette édition";
  return section(`${intro}${items.length ? `<p style="${kickerStyle(C.muted)}margin-top:22px;">${escapeHtml(menuTitle)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items.join("")}</table>` : ""}`);
};

const renderEditorial = (editorial: Element) => {
  const image = editorial.querySelector(".founder-photo img");
  const name = editorial.querySelector(".founder-photo figcaption")?.childNodes[0]?.textContent?.trim() ?? "Marius AYORO";
  const role = editorial.querySelector(".founder-photo figcaption span")?.textContent?.trim() ?? "Fondateur de TransferAI";
  const prose = editorial.querySelector(".editorial-prose");
  const parts = prose ? [...prose.children] : [];
  const kicker = parts.filter((node) => node.classList.contains("ta-kicker")).map((node) => block(node)).join("");
  const title = parts.find((node) => node.tagName === "H2");
  const paragraphs = parts
    .filter((node) => node.tagName === "P" && !node.classList.contains("ta-kicker") && !node.classList.contains("ta-signature"))
    .map((node) => `<p style="margin:0 0 14px;font-family:${SERIF};font-size:16px;line-height:1.75;color:${C.ink};">${inline(node)}</p>`)
    .join("");
  const photo = image
    ? `<img src="${image.getAttribute("src")}" width="96" height="116" alt="${escapeHtml(image.getAttribute("alt") ?? name)}" style="display:block;width:96px;height:116px;object-fit:cover;border:0;border-bottom:3px solid ${C.orange};">`
    : "";
  return section(`
    ${kicker}
    ${title ? `<h2 style="${h2Style(30)}">${inline(title)}</h2>` : ""}
    ${paragraphs}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;"><tr>
      <td valign="middle" width="96" style="padding-right:14px;">${photo}</td>
      <td valign="middle" style="font-family:${SANS};font-size:14px;line-height:1.5;font-weight:bold;color:${C.green};">${escapeHtml(name)}<br><span style="font-size:12px;font-weight:normal;color:${C.muted};">${escapeHtml(role)}</span></td>
    </tr></table>`);
};

const renderFeature = (feature: Element) => {
  const lead = feature.querySelector(".ta-lead");
  const fieldCase = feature.querySelector(".field-case");
  return section(`${lead ? block(lead) : ""}${fieldCase ? box(block(fieldCase), C.tint, `border-left:3px solid ${C.green};`) : ""}`);
};

const renderSolutions = (solutions: Element) => {
  const head = [...solutions.children].filter((child) => !child.classList.contains("solutions-grid")).map((child) => block(child)).join("");
  const items = [...solutions.querySelectorAll(".ta-solution")]
    .map((item, index) => `<tr><td valign="top" width="48" style="padding:14px 0 6px;border-top:2px solid ${C.orange};font-family:${SERIF};font-size:30px;line-height:1;color:${C.orange};">0${index + 1}</td><td valign="top" style="padding:14px 0 6px;border-top:2px solid ${C.orange};font-family:${SANS};font-size:14px;line-height:1.7;color:${C.ink};">${inline(item.querySelector("p") ?? item)}</td></tr>`)
    .join("");
  return section(`${head}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items}</table>`);
};

const renderGovernance = (governance: Element) => {
  const banner = governance.querySelector(".governance-banner");
  const bannerContent = banner ? [...(banner.querySelector(":scope > div")?.children ?? [])].map((child) => (child.tagName === "H2" ? `<h2 style="${h2Style(28, C.cream)}margin:0;">${inline(child)}</h2>` : block(child, { onDark: true }))).join("") : "";
  const rest = [...governance.children]
    .filter((child) => child !== banner)
    .map((child) => {
      if (child.classList.contains("governance-briefs")) {
        return [...child.children].map((brief) => `<div style="padding:4px 0 2px;border-top:1px solid ${C.line};">${block(brief)}</div>`).join("");
      }
      return block(child);
    })
    .join("");
  return `<tr><td bgcolor="${C.green}" class="px" style="padding:28px 32px;background:${C.green};">${bannerContent}</td></tr>${section(rest, "22px 32px 28px")}`;
};

export type JournalEmailMeta = { title: string; subject: string; preheader: string };

export const renderJournalEmail = (bodyHtml: string, meta: JournalEmailMeta) => {
  const { document } = new JSDOM(`<body>${bodyHtml}</body>`).window;
  const rows: Row[] = [];
  const header = document.querySelector(".newspaper-header");
  if (header) rows.push(renderHeader(header));

  const content = document.querySelector(".ta-content");
  for (const element of content ? [...content.children] : []) {
    const cls = element.classList;
    if (cls.contains("front-page")) rows.push(renderFrontPage(element));
    else if (cls.contains("ta-editorial")) rows.push(rule(C.ink), renderEditorial(element));
    else if (cls.contains("feature-layout")) rows.push(rule(C.ink), renderFeature(element));
    else if (element.querySelector(".solutions-grid")) rows.push(rule(), renderSolutions(element));
    else if (cls.contains("prompt-section")) rows.push(section(box(block(element), C.tint, `border:1px solid #d5d5bc;`), "8px 32px"));
    else if (cls.contains("ta-governance")) rows.push(renderGovernance(element));
    else if (cls.contains("ta-sources")) rows.push(rule(), section([...element.children].map((child) => `<p style="${captionStyle}">${inline(child)}</p>`).join(""), "18px 32px 8px"));
    else rows.push(rule(), section(block(element)));
  }

  const footer = document.querySelector(".ta-foot");
  if (footer) {
    const unsubscribe = `<p style="margin:10px 0 0;font-family:${SANS};font-size:11px;line-height:1.6;color:${C.muted};">Vous recevez cet email car vous êtes inscrit à la newsletter TransferAI Africa. <a href="${UNSUBSCRIBE_PLACEHOLDER}" style="color:${C.muted};text-decoration:underline;">Se désabonner</a></p>`;
    rows.push(section(`<div style="border-top:3px double ${C.ink};padding-top:16px;">${[...footer.children].map((child) => `<p style="margin:0 0 6px;font-family:${SANS};font-size:11px;line-height:1.6;color:${C.muted};">${inline(child, C.ink)}</p>`).join("")}${unsubscribe}</div>`, "8px 32px 28px"));
  }

  return `<!doctype html>
<html lang="fr-CI" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(meta.subject)}</title>
<style>
  @media only screen and (max-width:620px) {
    .px { padding-left:18px !important; padding-right:18px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(meta.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page};">
<tr><td align="center" style="padding:20px 8px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.paper}" style="width:100%;max-width:600px;background:${C.paper};border:1px solid #d5d7cc;">
${rows.join("\n")}
</table>
</td></tr>
</table>
</body>
</html>
`;
};
