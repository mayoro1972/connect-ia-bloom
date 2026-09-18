// « TransferAI — Le Journal » : assemble une édition hebdomadaire et la dépose
// en brouillon dans le back-office (newsletter_issues, via content-admin).
//
//   node --experimental-strip-types scripts/newsletter-journal.ts build 2026-09-18
//   node --experimental-strip-types scripts/newsletter-journal.ts push 2026-09-18
//   node --experimental-strip-types scripts/newsletter-journal.ts review 2026-09-18
//
//   node --experimental-strip-types scripts/newsletter-journal.ts send 2026-09-18 [--confirmer]
//
// review = push + envoi test ([TEST]) aux validateurs, pour validation humaine.
// send   = envoi immédiat à tous les abonnés actifs (validateurs inclus). Sans --confirmer,
//          contrôle à blanc : affiche le nombre de destinataires et n'envoie rien.
// Une édition = docs/newsletter-premium/editions/<date>/ avec newsletter-body.html et meta.json.
// Le dépôt se fait toujours en statut "draft" : newsletter-send n'expédie que les
// éditions "approved", l'approbation reste donc manuelle dans le back-office.
import fs from "node:fs/promises";
import path from "node:path";
import { renderJournalEmail } from "./newsletter-journal-email.ts";

const root = path.resolve(import.meta.dirname, "..");
const premiumDir = path.join(root, "docs/newsletter-premium");
const journalDir = path.join(premiumDir, "editions");

const [command, date] = process.argv.slice(2);

const REVIEWERS = ["marius.ayoro70@gmail.com"];

const confirmed = process.argv.includes("--confirmer");

if (!["build", "push", "review", "send"].includes(command ?? "") || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error("Usage: node --experimental-strip-types scripts/newsletter-journal.ts <build|push|review|send> <AAAA-MM-JJ> [--confirmer]");
  process.exit(1);
}

const editionDir = path.join(journalDir, date);

type JournalMeta = {
  title: string;
  subject: string;
  preheader: string;
  intro: string;
  domain: string;
  profession: string;
  hot_topic: string;
  tool_name?: string;
  prompt_title?: string;
  prompt_body?: string;
  cta_label?: string;
  cta_url?: string;
  sources?: string[];
};

const readMeta = async (): Promise<JournalMeta> =>
  JSON.parse(await fs.readFile(path.join(editionDir, "meta.json"), "utf8"));

const formatFrenchDate = (isoDate: string) =>
  new Intl.DateTimeFormat("fr-CI", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Abidjan" })
    .format(new Date(`${isoDate}T12:00:00Z`));

const build = async () => {
  const css = await fs.readFile(path.join(premiumDir, "premium.css"), "utf8");
  // Portrait officiel intégré (version allégée de src/assets/team-marius.jpg) : la page reste
  // lisible hors ligne et dans les aperçus qui bloquent les images externes. L'email garde l'URL du site.
  const portrait = await fs.readFile(path.join(premiumDir, "marius-ayoro-portrait.jpg"));
  const body = (await fs.readFile(path.join(editionDir, "newsletter-body.html"), "utf8"))
    .replace(/src="https:\/\/www\.transferai\.ci\/assets\/team-marius-[^"]+\.jpg"/, `src="data:image/jpeg;base64,${portrait.toString("base64")}"`);
  const page = "<!doctype html>\n<html lang=\"fr-CI\"><head><meta charset=\"utf-8\">"
    + "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
    + `<title>TransferAI — Le Journal | ${formatFrenchDate(date)}</title><style>${css}</style></head><body>${body}</body></html>`;
  await fs.writeFile(path.join(editionDir, "newsletter-premium.html"), page, "utf8");
  const meta = await readMeta();
  const email = renderJournalEmail(await fs.readFile(path.join(editionDir, "newsletter-body.html"), "utf8"), meta);
  await fs.writeFile(path.join(editionDir, "newsletter-email.html"), email, "utf8");
  console.log(`Journal du ${formatFrenchDate(date)} généré : ${path.join(editionDir, "newsletter-premium.html")} (+ newsletter-email.html)`);
};

const readEnvFiles = async () => {
  const values: Record<string, string> = {};
  for (const name of [".env", ".env.local"]) {
    const content = await fs.readFile(path.join(root, name), "utf8").catch(() => "");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (match) values[match[1]] = match[2].trim();
    }
  }
  return { ...values, ...process.env } as Record<string, string | undefined>;
};

const issuePayload = (meta: JournalMeta, emailHtml: string, status: "draft" | "approved", id?: string) => ({
  ...(id ? { id } : {}),
  issue_date: date,
  language: "fr",
  status,
  approved_at: status === "approved" ? new Date().toISOString() : null,
  // Jamais avant vendredi 01:00, heure d'Abidjan (UTC+0), une fois approuvée.
  scheduled_for: `${date}T01:00:00Z`,
  title: meta.title,
  subject: meta.subject,
  preheader: meta.preheader,
  intro: meta.intro,
  // Le domaine éditorial ne filtre pas les destinataires (ligne éditoriale du 11/09/2026).
  target_domains: [],
  tool_name: meta.tool_name ?? null,
  prompt_title: meta.prompt_title ?? null,
  prompt_body: meta.prompt_body ?? null,
  cta_label: meta.cta_label ?? "Explorer les formations TransferAI",
  cta_url: meta.cta_url ?? "https://www.transferai.ci/catalogue",
  body_html: emailHtml,
  generation_source: "ai",
  generation_notes: `Journal hebdomadaire généré par Claude Code. Sujet brûlant : ${meta.hot_topic}. À relire et approuver manuellement.`,
  meta: {
    journal: true,
    template: "transferai-le-journal-premium",
    email_format: "journal-email-v1",
    domain: meta.domain,
    profession: meta.profession,
    hot_topic: meta.hot_topic,
    sources: meta.sources ?? [],
    local_path: path.relative(root, path.join(editionDir, "newsletter-premium.html")),
  },
});

type AdminResponse = { data?: Record<string, unknown> & { issues?: unknown[]; recipients?: number; sent?: number; id?: string } };
type AdminCall = (action: string, payload: Record<string, unknown>, fn?: string) => Promise<AdminResponse>;

const findJournalIssue = async (call: AdminCall) => {
  const listing = await call("list", {});
  const issues: Array<{ id: string; issue_date: string; status: string; title: string; sent_at: string | null; meta: { journal?: boolean } | null }> =
    (listing?.data?.issues ?? []) as typeof issues;
  return issues.find((issue) => issue.issue_date === date && issue.meta?.journal);
};

const sendCampaign = async (call: AdminCall, meta: JournalMeta, emailHtml: string) => {
  const issue = await findJournalIssue(call);
  if (!issue) throw new Error(`Aucune édition du Journal datée du ${date} dans le back-office : lancez d'abord « review ${date} ».`);
  if (issue.sent_at) throw new Error(`L'édition du ${date} a déjà été envoyée (${issue.sent_at}) : envoi annulé.`);

  if (!confirmed) {
    const preview = await call("send", { issue_id: issue.id, dry_run: true }, "newsletter-send");
    const count = preview?.data?.recipients ?? "?";
    console.log(`Contrôle à blanc — « ${issue.title} » (statut ${issue.status}).`);
    console.log(`Destinataires actifs : ${count}, plus ${REVIEWERS.join(", ")} inscrit(s) avant l'envoi s'il(s) ne l'est/sont pas.`);
    console.log(`Rien n'a été envoyé. Pour envoyer : ajoutez --confirmer.`);
    return issue.id;
  }

  // Les validateurs reçoivent aussi l'édition : inscription (sans effet s'ils sont déjà abonnés).
  for (const reviewer of REVIEWERS) {
    await call("subscribe", { email: reviewer, language: "fr", subscribed_domains: ["IT & Transformation Digitale"], source_page: "/newsletter-journal" }, "newsletter-subscribe");
  }
  // Dernière version de l'email (newsletter-email.html) enregistrée et approuvée avant l'envoi.
  await call("save", issuePayload(meta, emailHtml, "approved", issue.id));
  console.log(`Édition approuvée. Envoi en cours (environ 0,6 s par abonné)…`);
  const result = await call("send", { issue_id: issue.id }, "newsletter-send");
  console.log(`Envoi terminé : ${result?.data?.sent ?? "?"} email(s) envoyé(s) sur ${result?.data?.recipients ?? "?"} abonné(s).`);
  return issue.id;
};

const push = async (): Promise<string | undefined> => {
  const env = await readEnvFiles();
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const anonJwt = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const adminToken = env.CONTENT_ADMIN_TOKEN;

  if (!supabaseUrl || !anonJwt) throw new Error("VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant dans .env.");
  if (!adminToken) throw new Error("CONTENT_ADMIN_TOKEN absent : ajoutez-le dans .env.local pour déposer le brouillon.");

  const meta = await readMeta();
  // Version email (tableaux, styles en ligne) produite par `build` : envoyée telle quelle par newsletter-send.
  const emailHtml = await fs.readFile(path.join(editionDir, "newsletter-email.html"), "utf8").catch(() => {
    throw new Error(`newsletter-email.html absent : lancez d'abord « build ${date} ».`);
  });

  const call = async (action: string, payload: Record<string, unknown>, fn = "content-admin") => {
    const response = await fetch(`${supabaseUrl}/functions/v1/${fn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonJwt,
        Authorization: `Bearer ${anonJwt}`,
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(fn === "content-admin" ? { entity: "newsletter", action, payload } : payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`content-admin ${action} : HTTP ${response.status} ${JSON.stringify(data)}`);
    return data;
  };

  if (command === "send") return sendCampaign(call, meta, emailHtml);

  const listing = await call("list", {});
  const issues: Array<{ id: string; issue_date: string; status: string; meta: { journal?: boolean } | null }> =
    listing?.data?.issues ?? listing?.issues ?? [];
  const existing = issues.find((issue) => issue.issue_date === date && issue.meta?.journal);

  if (existing && existing.status !== "draft") {
    console.log(`Édition du ${date} déjà au statut "${existing.status}" dans le back-office : rien n'est modifié.`);
    return undefined;
  }

  const payload = issuePayload(meta, emailHtml, "draft", existing?.id);

  const result = await call(existing ? "save" : "create", payload);
  const id = result?.data?.id ?? result?.id ?? existing?.id;
  console.log(`Brouillon ${existing ? "mis à jour" : "créé"} dans le back-office (id ${id}), statut draft.`);

  if (command === "review" && id) {
    for (const reviewer of REVIEWERS) {
      await call("send", { issue_id: id, test_email: reviewer }, "newsletter-send");
      console.log(`Brouillon envoyé en test à ${reviewer}.`);
    }
    console.log(`Validation : https://www.transferai.ci/back-office/newsletters?issue=${id}&mode=email`);
  }
  return id;
};

if (command === "build") await build();
else await push();
