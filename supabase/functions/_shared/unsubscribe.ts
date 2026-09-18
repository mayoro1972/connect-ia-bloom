// Liens de désabonnement personnels (un par destinataire), sans expiration.
// Signature HMAC-SHA256 de l'adresse ; clé NEWSLETTER_UNSUBSCRIBE_SECRET, ou à défaut dérivée
// de CONTENT_ADMIN_TOKEN (changer ce jeton invalide les anciens liens).
const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") ?? "https://www.transferai.ci";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const CONTACT_EMAIL = "contact@transferai.ci";

export const UNSUBSCRIBE_PLACEHOLDER = "%%UNSUBSCRIBE_URL%%";

const encoder = new TextEncoder();

const toBase64Url = (value: string) =>
  btoa(String.fromCharCode(...encoder.encode(value))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const fromBase64Url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return new TextDecoder().decode(Uint8Array.from(atob(padded), (char) => char.charCodeAt(0)));
};

const sign = async (email: string) => {
  const secret = Deno.env.get("NEWSLETTER_UNSUBSCRIBE_SECRET") || `newsletter-unsubscribe:${Deno.env.get("CONTENT_ADMIN_TOKEN") ?? ""}`;
  if (secret.endsWith(":")) throw new Error("Missing unsubscribe secret");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(email.trim().toLowerCase())));
  return Array.from(signature.slice(0, 16), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const params = async (email: string) => {
  const normalized = email.trim().toLowerCase();
  return new URLSearchParams({ e: toBase64Url(normalized), t: await sign(normalized) }).toString();
};

/** Page de confirmation sur le site (lien visible dans l'email). */
export const unsubscribePageUrl = async (email: string) => `${SITE_URL}/desabonnement?${await params(email)}`;

/** Point d'entrée « un clic » (RFC 8058) appelé directement par Gmail, Apple Mail, etc. */
export const unsubscribeOneClickUrl = async (email: string) => `${SUPABASE_URL}/functions/v1/newsletter-unsubscribe?${await params(email)}`;

export const unsubscribeHeaders = async (email: string) => ({
  "List-Unsubscribe": `<${await unsubscribeOneClickUrl(email)}>, <mailto:${CONTACT_EMAIL}?subject=D%C3%A9sabonnement%20newsletter>`,
  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
});

/** Vérifie un lien ; renvoie l'adresse normalisée si la signature est valide. */
export const verifyUnsubscribe = async (encodedEmail: string, token: string) => {
  let email = "";
  try {
    email = fromBase64Url(encodedEmail).trim().toLowerCase();
  } catch {
    return null;
  }
  if (!email.includes("@") || !token) return null;
  const expected = await sign(email);
  if (expected.length !== token.length) return null;
  let diff = 0;
  for (let index = 0; index < expected.length; index += 1) diff |= expected.charCodeAt(index) ^ token.charCodeAt(index);
  return diff === 0 ? email : null;
};

const footer = (url: string) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:16px 12px 28px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#626962;">
      Vous recevez cet email car vous êtes inscrit à la newsletter TransferAI Africa.<br>
      <a href="${url}" style="color:#626962;text-decoration:underline;">Se désabonner</a> · <a href="mailto:${CONTACT_EMAIL}" style="color:#626962;text-decoration:underline;">${CONTACT_EMAIL}</a>
    </td></tr>
  </table>`;

/** Insère le lien personnel : à l'emplacement prévu s'il existe, sinon en pied d'email. */
export const withUnsubscribeLink = (html: string, url: string) => {
  if (html.includes(UNSUBSCRIBE_PLACEHOLDER)) return html.split(UNSUBSCRIBE_PLACEHOLDER).join(url);
  return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${footer(url)}</body>`) : `${html}${footer(url)}`;
};
