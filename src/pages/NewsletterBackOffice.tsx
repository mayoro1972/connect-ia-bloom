import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import NewsletterAdminPanel from "@/components/backoffice/NewsletterAdminPanel";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { invokeContentAdmin } from "@/lib/content-admin";

const ADMIN_TOKEN_STORAGE_KEY = "transferai-admin-token";
const LOCAL_NEWSLETTER_PREVIEWS = [
  {
    id: "transferai-newsletter-premium-2026-09-11",
    title: "TransferAI — Le Journal · 11 septembre 2026",
    description:
      "Éducation & EdTech IA : des solutions concrètes pour les formateurs africains, l’éditorial de Marius AYORO et un dossier gouvernance, souveraineté des données et ARTCI.",
    href: "/previews/transferai-newsletter-premium-2026-09-11.html",
    badge: "Nouvelle édition",
  },
  {
    id: "transferai-newsletter-premium-2026-07-10",
    title: "Newsletter premium TransferAI",
    description:
      "Brouillon éditorial premium en français professionnel avec le webinar du 18 juillet 2026, les formations à venir, le partenariat Pigier et la veille IA.",
    href: "/previews/transferai-newsletter-premium-2026-07-10.html",
    badge: "Archives",
  },
];

const NewsletterBackOfficePage = () => {
  const [searchParams] = useSearchParams();
  const [tokenInput, setTokenInput] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const initialIssueId = searchParams.get("issue");
  const initialPreviewMode = searchParams.get("mode") === "editorial" ? "editorial" : "email";

  useEffect(() => {
    const storedToken = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? "";
    if (storedToken) {
      setTokenInput(storedToken);
    }
  }, []);

  const isReady = useMemo(() => adminToken.trim().length > 0 && isSupabaseConfigured, [adminToken]);

  const loadNewsletterData = async (currentToken: string) => {
    await invokeContentAdmin(currentToken, { entity: "newsletter", action: "list" });
  };

  const clearToken = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setTokenInput("");
    setAdminToken("");
    setStatusMessage("Token admin retiré de ce navigateur.");
    setErrorMessage(null);
  };

  const persistToken = async () => {
    const nextToken = tokenInput.trim();

    if (!nextToken) {
      setErrorMessage("Saisissez d'abord un token admin.");
      return;
    }

    setIsBusy(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await loadNewsletterData(nextToken);
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, nextToken);
      setAdminToken(nextToken);
      setStatusMessage("Token admin validé et enregistré localement sur ce navigateur.");
    } catch (error) {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      setAdminToken("");
      setErrorMessage(
        error instanceof Error && /unauthorized/i.test(error.message)
          ? "Token admin invalide. Vérifiez la valeur saisie."
          : error instanceof Error
            ? error.message
            : "Validation du token impossible.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader
          title="Newsletter IA"
          subtitle="Gérer les éditions, générer les brouillons et envoyer les tests depuis une page dédiée."
        />

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="rounded-2xl border border-border bg-card p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-card-foreground">Accès newsletter</h2>
                <p className="text-xs text-muted-foreground">La gestion newsletter est désormais accessible via une page dédiée.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/back-office"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted"
                >
                  Retour au back-office
                </Link>
                <Badge variant="secondary">Newsletter IA</Badge>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-orange-200/70 bg-orange-50/80 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Le Journal TransferAI</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">Découvrez la newsletter au format journal</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Retrouvez l’édition premium complète, avec l’éditorial du fondateur, les solutions métier et le dossier Données & souveraineté.
                    Les éditions précédentes restent disponibles dans les archives ci-dessous.
                  </p>
                </div>
                <Badge className="bg-white text-orange-700 hover:bg-white">Aperçu disponible</Badge>
              </div>

              <div className="mt-6 grid gap-4">
                {LOCAL_NEWSLETTER_PREVIEWS.map((preview) => (
                  <div
                    key={preview.id}
                    className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm ring-1 ring-orange-100"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-lg font-bold text-slate-900">{preview.title}</h3>
                          <Badge variant="secondary">{preview.badge}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{preview.description}</p>
                      </div>
                      <a
                        href={preview.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Lire l’édition
                      </a>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{preview.href}</p>
                  </div>
                ))}
              </div>
            </div>

            {!isReady ? (
              <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
                <h2 className="mb-2 font-heading text-2xl font-bold text-card-foreground">Accès restreint</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Cette zone est réservée à l'administration de TransferAI. Saisissez votre token admin pour continuer.
                </p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void persistToken();
                  }}
                  className="space-y-4"
                >
                  <Input
                    type="text"
                    value={tokenInput}
                    onChange={(event) => setTokenInput(event.target.value)}
                    placeholder="Token admin"
                    autoFocus
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={!tokenInput.trim() || !isSupabaseConfigured || isBusy}
                    className="w-full rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {isBusy ? "Vérification..." : "Se connecter"}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={clearToken}
                  className="mt-3 w-full rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Effacer le token enregistré
                </button>
                {!isSupabaseConfigured ? (
                  <p className="mt-4 text-sm text-destructive">Supabase n'est pas configuré localement.</p>
                ) : null}
                {errorMessage ? <p className="mt-4 text-sm text-destructive">{errorMessage}</p> : null}
                <p className="mt-6 text-xs text-muted-foreground">
                  Le token est vérifié côté serveur. Toute tentative invalide est rejetée.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {statusMessage ? <p className="text-sm text-primary">{statusMessage}</p> : null}
                {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
                <NewsletterAdminPanel
                  token={adminToken}
                  isReady={isReady}
                  isBusyGlobal={isBusy}
                  initialIssueId={initialIssueId}
                  initialPreviewMode={initialPreviewMode}
                  onStatus={setStatusMessage}
                  onError={setErrorMessage}
                />
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default NewsletterBackOfficePage;
