import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Payload {
  full_name: string;
  email: string;
  language?: string;
  domain_label?: string;
  formation_label?: string;
  scheduled_date?: string; // YYYY-MM-DD (legacy)
  scheduled_date_label?: string; // Texte libre prioritaire (ex: "14 juin 2026 et 16 juin 2026")
}

const FROM = Deno.env.get("MAIL_FROM") || Deno.env.get("FROM_EMAIL") || "TransferAI Africa <contact@transferai.ci>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "contact@transferai.ci";

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY missing" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: replyTo, subject, html }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok ? { ok: true, id: data.id } : { ok: false, error: data.message || "send_failed" };
}

const fmtDate = (iso: string | undefined, lang: string) => {
  if (!iso) return "";
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso; }
};

// Accroche personnalisée déterministe à partir du centre d'intérêt déclaré (pas d'appel LLM,
// même logique que pickCasUsage() dans les workflows n8n V9 / Email2-3).
function pickTeaser(domainLabel: string | undefined, lang: string): string {
  const s = (domainLabel || "").toLowerCase();
  const fr: Array<[RegExp, string]> = [
    [/courrier/, "Rédiger un courrier professionnel en quelques minutes, avec validation humaine avant envoi."],
    [/compte.?rendu|r[ée]union/, "Transformer l'audio d'une réunion en compte-rendu structuré, avec les actions à suivre."],
    [/recherche documentaire|archive/, "Interroger vos propres documents et obtenir une réponse instantanée, en langage naturel."],
    [/assistant client|24\/7/, "Un assistant intelligent qui répond aux questions courantes de vos clients à toute heure."],
    [/traduction/, "Traduire des documents officiels bilingues rapidement, avec une qualité professionnelle."],
    [/finance|kyc|conformit/, "Accélérer l'analyse de dossiers de crédit et la veille réglementaire BCEAO-UEMOA."],
    [/marketing/, "Produire du contenu marketing adapté au marché ivoirien, sans perdre votre ton de marque."],
    [/rh|recrutement/, "Trier des candidatures et préparer des trames d'entretien, sans jamais remplacer votre jugement."],
    [/facturation|relance/, "Automatiser le suivi des factures et des relances, sans perdre en rigueur de gestion."],
  ];
  const en: Array<[RegExp, string]> = [
    [/letter/, "Draft a professional letter in minutes, with human validation before sending."],
    [/meeting|minutes/, "Turn a meeting recording into a structured summary with clear action items."],
    [/document|archive/, "Ask questions directly to your own documents and get instant answers."],
    [/customer|24\/7/, "An AI assistant that handles common customer questions around the clock."],
    [/translation/, "Translate official bilingual documents quickly, at a professional standard."],
    [/finance|kyc|complian/, "Speed up credit file review and BCEAO-UEMOA regulatory watch."],
    [/marketing/, "Produce local marketing content while keeping your brand's own tone."],
    [/hr|recruitment/, "Sort applications and prepare interview outlines, without replacing your judgment."],
    [/invoic|reminder/, "Automate invoice tracking and reminders without losing management rigor."],
  ];
  const table = lang === "en" ? en : fr;
  for (const [re, text] of table) {
    if (re.test(s)) return text;
  }
  return "";
}

const firstName = (fullName: string) => (fullName || "").trim().split(/\s+/)[0] || fullName;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const p: Payload = await req.json();
    if (!p.email || !p.full_name) {
      return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400, headers: corsHeaders });
    }
    const lang = (p.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
    // Priorité au libellé texte envoyé par le formulaire (dates fixes), sinon fallback sur la date ISO
    const dateLabel = p.scheduled_date_label?.trim() || fmtDate(p.scheduled_date, lang);

    const subjectUser = lang === "en"
      ? "Your free webinar registration has been received"
      : "Votre inscription au webinaire gratuit a bien été reçue";

    const prenom = firstName(p.full_name);
    const teaser = pickTeaser(p.domain_label, lang);

    const htmlUser = lang === "en" ? `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#10263F;color:#ffffff;padding:24px 28px;border-radius:12px 12px 0 0;text-align:center">
          <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.75;margin-bottom:6px">TransferAI Africa · NettelecomCI AI Hub</div>
          <div style="font-size:22px;font-weight:700">Your free webinar seat is confirmed 🎉</div>
        </div>
        <div style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px;padding:28px;background:#ffffff">
          <p>Hello ${prenom},</p>
          <p>Thank you for registering for our free webinar <strong>"Practical AI in Côte d'Ivoire: 10 concrete use cases to transform your work"</strong>${dateLabel ? `, planned for <strong>${dateLabel}</strong>` : ""}.</p>
          ${teaser ? `<div style="background:#FFF4EC;border-left:4px solid #E76F1D;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0">
            <p style="margin:0;font-size:12px;font-weight:700;color:#B85C1E;text-transform:uppercase;letter-spacing:.04em">What you told us you're interested in</p>
            <p style="margin:6px 0 0;font-size:14px">${teaser}</p>
          </div>` : ""}
          <h3 style="color:#10263F;font-size:15px;margin:24px 0 10px">What to expect in 60 minutes</h3>
          <ul style="padding-left:18px;line-height:1.8;font-size:14px;margin:0">
            <li>10 concrete use cases, demoed live (letters, meeting notes, document search, customer support, and more)</li>
            <li>3 copy-ready prompts to start using the next day</li>
            <li>A simple method to spot your own AI priorities</li>
          </ul>
          <h3 style="color:#10263F;font-size:15px;margin:24px 0 10px">Why TransferAI</h3>
          <table style="width:100%;font-size:13px;border-collapse:collapse">
            <tr><td style="padding:4px 8px 4px 0;white-space:nowrap">🎯</td><td style="padding:4px 0">Tailored diagnosis, never a generic solution</td></tr>
            <tr><td style="padding:4px 8px 4px 0;white-space:nowrap">🌍</td><td style="padding:4px 0">13 international experts, locally rooted via NettelecomCI</td></tr>
            <tr><td style="padding:4px 8px 4px 0;white-space:nowrap">🔒</td><td style="padding:4px 0">Data governance and protection built in from day one</td></tr>
          </table>
          <div style="background:#F3F6FB;border-radius:10px;padding:16px 18px;margin:24px 0;font-size:13px">
            <strong>📅 What happens next:</strong>
            <ul style="padding-left:18px;margin:8px 0 0;line-height:1.7">
              <li>2 days before: email with the connection link</li>
              <li>The day before: final confirmation + full program attached</li>
            </ul>
          </div>
          <p style="font-size:13px;color:#555">This session is also a first step toward our training <strong>"AI at the Office"</strong>, to go further into hands-on practice — with no obligation to join.</p>
          <p style="margin-top:28px">See you soon,<br/><strong>The TransferAI Africa team</strong></p>
          <hr/><p style="font-size:12px;color:#666">contact@transferai.ci · <a href="https://www.transferai.ci" style="color:#666">www.transferai.ci</a></p>
        </div>
      </div>` : `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#10263F;color:#ffffff;padding:24px 28px;border-radius:12px 12px 0 0;text-align:center">
          <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.75;margin-bottom:6px">TransferAI Africa · Hub IA de NettelecomCI</div>
          <div style="font-size:22px;font-weight:700">Votre place au webinaire gratuit est confirmée 🎉</div>
        </div>
        <div style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px;padding:28px;background:#ffffff">
          <p>Bonjour ${prenom},</p>
          <p>Merci pour votre inscription au webinaire gratuit <strong>« IA pratique en Côte d'Ivoire : 10 usages concrets pour transformer votre métier »</strong>${dateLabel ? `, prévu le <strong>${dateLabel}</strong>` : ""}.</p>
          ${teaser ? `<div style="background:#FFF4EC;border-left:4px solid #E76F1D;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0">
            <p style="margin:0;font-size:12px;font-weight:700;color:#B85C1E;text-transform:uppercase;letter-spacing:.04em">Ce que vous nous avez dit vouloir découvrir</p>
            <p style="margin:6px 0 0;font-size:14px">${teaser}</p>
          </div>` : ""}
          <h3 style="color:#10263F;font-size:15px;margin:24px 0 10px">Ce qui vous attend en 60 minutes</h3>
          <ul style="padding-left:18px;line-height:1.8;font-size:14px;margin:0">
            <li>10 usages concrets, démontrés en direct (courrier, comptes-rendus, recherche documentaire, service client, et plus)</li>
            <li>3 prompts prêts à copier pour démarrer dès le lendemain</li>
            <li>Une méthode simple pour identifier vos propres priorités IA</li>
          </ul>
          <h3 style="color:#10263F;font-size:15px;margin:24px 0 10px">Pourquoi TransferAI</h3>
          <table style="width:100%;font-size:13px;border-collapse:collapse">
            <tr><td style="padding:4px 8px 4px 0;white-space:nowrap">🎯</td><td style="padding:4px 0">Diagnostic sur mesure, jamais de solution générique</td></tr>
            <tr><td style="padding:4px 8px 4px 0;white-space:nowrap">🌍</td><td style="padding:4px 0">13 experts internationaux, ancrés localement via NettelecomCI</td></tr>
            <tr><td style="padding:4px 8px 4px 0;white-space:nowrap">🔒</td><td style="padding:4px 0">Gouvernance et protection des données intégrées dès le départ</td></tr>
          </table>
          <div style="background:#F3F6FB;border-radius:10px;padding:16px 18px;margin:24px 0;font-size:13px">
            <strong>📅 Prochaines étapes :</strong>
            <ul style="padding-left:18px;margin:8px 0 0;line-height:1.7">
              <li>2 jours avant : email avec le lien de connexion</li>
              <li>La veille : confirmation finale + programme complet en pièce jointe</li>
            </ul>
          </div>
          <p style="font-size:13px;color:#555">Cette session est aussi une première porte d'entrée vers la formation <strong>« L'IA au Bureau »</strong>, pour aller plus loin dans la mise en pratique — sans obligation d'y participer.</p>
          <p style="margin-top:28px">À très bientôt,<br/><strong>L'équipe TransferAI Africa</strong></p>
          <hr/><p style="font-size:12px;color:#666">contact@transferai.ci · <a href="https://www.transferai.ci" style="color:#666">www.transferai.ci</a></p>
        </div>
      </div>`;

    const userRes = await sendEmail(p.email, subjectUser, htmlUser);

    // Notif admin instantanée
    const htmlAdmin = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h3>Nouvelle inscription webinaire</h3>
        <ul>
          <li><strong>Nom :</strong> ${p.full_name}</li>
          <li><strong>Email :</strong> ${p.email}</li>
          <li><strong>Domaine :</strong> ${p.domain_label || "—"}</li>
          <li><strong>Formation :</strong> ${p.formation_label || "—"}</li>
          <li><strong>Langue :</strong> ${lang.toUpperCase()}</li>
          <li><strong>Date prévue :</strong> ${dateLabel || "—"}</li>
        </ul>
        <p style="font-size:13px;color:#555">Le lien de connexion sera envoyé automatiquement au participant 1 jour avant le webinaire.</p>
      </div>`;
    await sendEmail(ADMIN_EMAIL, `[Webinaire] Nouvelle inscription — ${p.full_name}`, htmlAdmin, p.email);

    return new Response(JSON.stringify({ ok: true, user: userRes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
