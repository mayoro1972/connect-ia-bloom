import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { useLanguage } from "@/i18n/LanguageContext";
import SeoManager from "./components/SeoManager";
import ScrollToTop from "./components/ScrollToTop";
import { usePageView } from "./hooks/usePageView";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Partenaires from "./pages/Partenaires";
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const BlogDomainPage = lazy(() => import("./pages/BlogDomainPage"));

const EducationHub = lazy(() => import("./pages/EducationHub"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const FormationDetail = lazy(() => import("./pages/FormationDetail"));
const Certification = lazy(() => import("./pages/Certification"));
const AIToolsMatrix = lazy(() => import("./pages/AIToolsMatrix"));
const AuditIA = lazy(() => import("./pages/AuditIA"));
const ProspectRequestPage = lazy(() => import("./pages/ProspectRequestPage"));
const DemandeCataloguePage = lazy(() => import("./pages/DemandeCataloguePage"));
const ParlerExpertPage = lazy(() => import("./pages/ParlerExpertPage"));
const ProspectAuditLoginPage = lazy(() => import("./pages/ProspectAuditLoginPage"));
const Entreprises = lazy(() => import("./pages/Entreprises"));
const Evenements = lazy(() => import("./pages/Evenements"));
const APropos = lazy(() => import("./pages/APropos"));
const Parcours = lazy(() => import("./pages/Parcours"));
const Inscription = lazy(() => import("./pages/Inscription"));
const Seminaires = lazy(() => import("./pages/Seminaires"));
const Webinars = lazy(() => import("./pages/Webinars"));
const WebinarRegistration = lazy(() => import("./pages/WebinarRegistration"));
const CreateurContenuIA = lazy(() => import("./pages/CreateurContenuIA"));
const ConsultingIA = lazy(() => import("./pages/ConsultingIA"));
const DeveloppementSolutionsIA = lazy(() => import("./pages/DeveloppementSolutionsIA"));
const PreviewHub = lazy(() => import("./pages/PreviewHub"));
const CatalogueDomainPreview = lazy(() => import("./pages/CatalogueDomainPreview"));
const LeadFormsPreview = lazy(() => import("./pages/LeadFormsPreview"));
const AppointmentPreview = lazy(() => import("./pages/AppointmentPreview"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const BackOffice = lazy(() => import("./pages/BackOffice"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const routerBasename = import.meta.env.BASE_URL === "/"
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, "");

const RouteLoader = () => <div className="min-h-screen bg-background" aria-hidden="true" />;
const CHUNK_RELOAD_KEY = "transferai-chunk-reload-at";
const CHUNK_RELOAD_WINDOW_MS = 30_000;

const buildCacheBustedUrl = (currentLocation: Location) => {
  const nextUrl = new URL(currentLocation.href);
  nextUrl.searchParams.set("_reload", String(Date.now()));
  return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
};

const shouldRecoverFromChunkError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return [
    "failed to fetch dynamically imported module",
    "dynamically imported module",
    "importing a module script failed",
    "module script",
    "unexpected token '<'",
    "mime type",
  ].some((token) => message.includes(token));
};

type ChunkBoundaryState = {
  error: Error | null;
  isChunkError: boolean;
};

class ChunkErrorBoundary extends Component<{ children: ReactNode }, ChunkBoundaryState> {
  state: ChunkBoundaryState = {
    error: null,
    isChunkError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return {
      error,
      isChunkError: shouldRecoverFromChunkError(error),
    };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    if (typeof window === "undefined" || !shouldRecoverFromChunkError(error)) {
      return;
    }

    let lastReloadAt = 0;
    try {
      lastReloadAt = Number(window.sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? 0);
    } catch {
      lastReloadAt = 0;
    }
    const now = Date.now();

    if (!Number.isFinite(lastReloadAt) || now - lastReloadAt > CHUNK_RELOAD_WINDOW_MS) {
      try {
        window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
      } catch {
        // Ignore sessionStorage failures in privacy-restricted browsers.
      }
      window.location.replace(buildCacheBustedUrl(window.location));
    }
  }

  componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {
      // Ignore sessionStorage failures in privacy-restricted browsers.
    }
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    if (!this.state.isChunkError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <h1 className="font-heading text-2xl font-bold text-card-foreground">
              Une erreur d&apos;affichage est survenue
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              La page a rencontré une erreur inattendue. Rechargez-la ou revenez à l&apos;accueil si le problème persiste.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={typeof window === "undefined" ? "/" : window.location.href}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Recharger cette page
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
              >
                Retour à l&apos;accueil
              </a>
            </div>
          </div>
        </div>
      );
    }

    const retryHref =
      typeof window === "undefined" ? "/" : buildCacheBustedUrl(window.location);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-card-foreground">
            Une mise à jour du site est en cours
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Si la page ne se recharge pas automatiquement, rafraîchissez-la pour charger la version la plus récente.
          </p>
          <a
            href={retryHref}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Recharger cette page
          </a>
        </div>
      </div>
    );
  }
}

const AnimatedRoutes = () => {
  const location = useLocation();
  const { language } = useLanguage();
  usePageView();
  return (
    <ChunkErrorBoundary key={`${location.pathname}${location.search}`}>
      <Suspense fallback={<RouteLoader />}>
        <Routes location={location} key={`${language}:${location.pathname}`}>
          <Route path="/" element={<Index />} />
          <Route path="/education" element={<EducationHub />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:id" element={<FormationDetail />} />
          <Route path="/parcours" element={<Parcours />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/certification" element={<Certification />} />
          <Route path="/outils-ia" element={<AIToolsMatrix />} />
          <Route path="/audit-ia-gratuit" element={<AuditIA />} />
          <Route path="/demande-audit-gratuit" element={<ProspectRequestPage />} />
          <Route path="/acces-formulaire-audit" element={<ProspectAuditLoginPage />} />
          <Route path="/entreprises" element={<Entreprises />} />
          <Route path="/services" element={<Entreprises />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/domaine/:domainSlug" element={<BlogDomainPage />} />
          <Route path="/blog/domain/:domainSlug" element={<BlogDomainPage />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demande-catalogue" element={<DemandeCataloguePage />} />
          <Route path="/parler-expert-ia" element={<ParlerExpertPage />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/plan-du-site" element={<Sitemap />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/seminaires" element={<Seminaires />} />
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/webinaires/inscription" element={<WebinarRegistration />} />
          <Route path="/webinars/register" element={<WebinarRegistration />} />
          <Route path="/createur-contenu-ia" element={<CreateurContenuIA />} />
          <Route path="/consulting-ia" element={<ConsultingIA />} />
          <Route path="/developpement-solutions-ia" element={<DeveloppementSolutionsIA />} />
          <Route path="/catalogues-domaines" element={<PreviewHub />} />
          <Route path="/catalogues-domaines/:slug" element={<CatalogueDomainPreview />} />
          <Route path="/prise-rdv" element={<AppointmentPreview />} />
          <Route path="/preview" element={<PreviewHub />} />
          <Route path="/preview/catalogues/:slug" element={<CatalogueDomainPreview />} />
          <Route path="/preview/formulaires" element={<LeadFormsPreview />} />
          <Route path="/preview/prise-rdv" element={<AppointmentPreview />} />
          <Route path="/back-office" element={<BackOffice />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ChunkErrorBoundary>
  );
};

const AppShell = () => {
  const { language } = useLanguage();

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBasename} key={language}>
        <SeoManager />
        <ScrollToTop />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppShell />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
