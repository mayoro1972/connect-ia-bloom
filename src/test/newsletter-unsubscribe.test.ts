import { beforeAll, describe, expect, it } from "vitest";

// Module Deno (Deno.env) : importé dynamiquement pour que le typage du site ne le suive pas.
type UnsubscribeModule = {
  UNSUBSCRIBE_PLACEHOLDER: string;
  unsubscribePageUrl: (email: string) => Promise<string>;
  unsubscribeHeaders: (email: string) => Promise<Record<string, string>>;
  verifyUnsubscribe: (encodedEmail: string, token: string) => Promise<string | null>;
  withUnsubscribeLink: (html: string, url: string) => string;
};
const MODULE_PATH = "../../supabase/functions/_shared/unsubscribe";
let mod: UnsubscribeModule;

beforeAll(async () => {
  // Le module tourne sous Deno en production : on simule Deno.env pour le tester sous Node.
  const env: Record<string, string> = {
    CONTENT_ADMIN_TOKEN: "test-admin-token",
    SUPABASE_URL: "https://example.supabase.co",
  };
  (globalThis as unknown as { Deno: unknown }).Deno = { env: { get: (key: string) => env[key] } };
  mod = (await import(/* @vite-ignore */ MODULE_PATH)) as UnsubscribeModule;
});

describe("liens de désabonnement", () => {
  it("signe puis vérifie l'adresse, insensible à la casse", async () => {
    const url = new URL(await mod.unsubscribePageUrl("Awa.Kone@Example.CI"));
    expect(url.origin + url.pathname).toBe("https://www.transferai.ci/desabonnement");
    const email = await mod.verifyUnsubscribe(url.searchParams.get("e") ?? "", url.searchParams.get("t") ?? "");
    expect(email).toBe("awa.kone@example.ci");
  });

  it("refuse une signature modifiée ou l'adresse d'un autre abonné", async () => {
    const url = new URL(await mod.unsubscribePageUrl("awa@example.ci"));
    const other = new URL(await mod.unsubscribePageUrl("yao@example.ci"));
    expect(await mod.verifyUnsubscribe(url.searchParams.get("e") ?? "", "0".repeat(32))).toBeNull();
    expect(await mod.verifyUnsubscribe(other.searchParams.get("e") ?? "", url.searchParams.get("t") ?? "")).toBeNull();
  });

  it("fournit les en-têtes « un clic » (RFC 8058)", async () => {
    const headers = await mod.unsubscribeHeaders("awa@example.ci");
    expect(headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(headers["List-Unsubscribe"]).toContain("https://example.supabase.co/functions/v1/newsletter-unsubscribe?e=");
  });

  it("remplace l'emplacement prévu, sinon ajoute un pied de page", () => {
    expect(mod.withUnsubscribeLink(`<a href="${mod.UNSUBSCRIBE_PLACEHOLDER}">x</a>`, "https://u")).toBe('<a href="https://u">x</a>');
    const html = mod.withUnsubscribeLink("<html><body><p>Bonjour</p></body></html>", "https://u");
    expect(html).toContain('href="https://u"');
    expect(html.indexOf("Se désabonner")).toBeLessThan(html.indexOf("</body>"));
  });
});
