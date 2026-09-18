// Liens signés « Approuver / Rejeter » insérés dans les emails [TEST] de newsletter.
// Signature HMAC-SHA256 dérivée de CONTENT_ADMIN_TOKEN : aucun nouveau secret à gérer.
export type ReviewAction = "approve" | "reject";

const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.transferai.ci";
const LINK_TTL_SECONDS = 7 * 24 * 3600;

const encoder = new TextEncoder();

const hmac = async (message: string) => {
  const secret = Deno.env.get("CONTENT_ADMIN_TOKEN") ?? "";
  if (!secret) throw new Error("Missing CONTENT_ADMIN_TOKEN");
  const key = await crypto.subtle.importKey("raw", encoder.encode(`newsletter-review:${secret}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
  return Array.from(signature, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const payloadOf = (issueId: string, action: ReviewAction, exp: number) => `${issueId}.${action}.${exp}`;

export const signReviewLink = async (issueId: string, action: ReviewAction) => {
  const exp = Math.floor(Date.now() / 1000) + LINK_TTL_SECONDS;
  const sig = await hmac(payloadOf(issueId, action, exp));
  const params = new URLSearchParams({ issue: issueId, action, exp: String(exp), sig });
  return `${SITE_URL}/newsletter-validation?${params.toString()}`;
};

export const verifyReviewSignature = async (issueId: string, action: ReviewAction, exp: number, sig: string) => {
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return "expired";
  const expected = await hmac(payloadOf(issueId, action, exp));
  if (expected.length !== sig.length) return "invalid";
  let diff = 0;
  for (let index = 0; index < expected.length; index += 1) diff |= expected.charCodeAt(index) ^ sig.charCodeAt(index);
  return diff === 0 ? "ok" : "invalid";
};

export const renderReviewBanner = async (issueId: string, title: string) => {
  const [approveUrl, rejectUrl] = await Promise.all([signReviewLink(issueId, "approve"), signReviewLink(issueId, "reject")]);
  const editUrl = `${SITE_URL}/back-office/newsletters?issue=${issueId}&mode=email`;
  const button = (href: string, label: string, background: string) =>
    `<a href="${href}" style="display:inline-block;margin:4px 6px 4px 0;padding:12px 20px;border-radius:6px;background:${background};color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;">${label}</a>`;
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `
    <div style="max-width:680px;margin:0 auto 18px;padding:20px 22px;border:2px solid #b85227;border-radius:10px;background:#fff7ed;font-family:Arial,sans-serif;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#b85227;">Validation humaine requise</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.5;color:#192b27;">« ${safeTitle} » est en brouillon. Rien ne partira aux abonnés sans votre approbation.</p>
      ${button(approveUrl, "✓ Approuver", "#17674f")}${button(editUrl, "✎ Modifier", "#192b27")}${button(rejectUrl, "✕ Rejeter", "#a4262c")}
      <p style="margin:12px 0 0;font-size:12px;line-height:1.5;color:#626962;">Chaque bouton ouvre une page de confirmation sur transferai.ci. Liens valables 7 jours. Ce bandeau n'apparaît que dans les emails [TEST].</p>
    </div>`;
};
