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

const EducationHub = lazy(() => import("./pages/EducationHub"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const FormationDetail = lazy(() => import("./pages/FormationDetail"));
const Certification = lazy(() => import("./pages/Certification"));
const Entreprises = lazy(() => import("./pages/Entreprises"));
const Partenaires = lazy(() => import("./pages/Partenaires"));
const Evenements = lazy(() => import("./pages/Evenements"));
const APropos = lazy(() => import("./pages/APropos"));
const Parcours = lazy(() => import("./pages/Parcours"));
const Inscription = lazy(() => import("./pages/Inscription"));
const Seminaires = lazy(() => import("./pages/Seminaires"));
const Webinars = lazy(() => import("./pages/Webinars"));
const CreateurContenuIA = lazy(() => import("./pages/CreateurContenuIA"));
const ConsultingIA = lazy(() => import("./pages/ConsultingIA"));
const DeveloppementSolutionsIA = lazy(() => import("./pages/DeveloppementSolutionsIA"));
const PreviewHub = lazy(() => import("./pages/PreviewHub"));
const CatalogueDomainPreview = lazy(() => import("./pages/CatalogueDomainPreview"));
const LeadFormsPreview = lazy(() => import("./pages/LeadFormsPreview"));
const AppointmentPreview = lazy(() => import("./pages/AppointmentPreview"));
const Privacy = lazy(() => import("./pages/Privacy"));
const BackOffice = lazy(() => import("./pages/BackOffice"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const routerBasename = import.meta.env.BASE_URL === "/"
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, "");

const RouteLoader = () => <div className="min-h-screen bg-background" aria-hidden="true" />;
const CHUNK_RELOAD_KEY = "transferai-chunk-reload-at";
const CHUNK_RELOAD_WINDOW_MS = 30_000;

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

class ChunkErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
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
      window.location.reload();
    }
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-card-foreground">
            Une mise a jour du site est en cours
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Si la page ne se recharge pas automatiquement, rafraichissez-la pour charger la version la plus recente.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Revenir a l'accueil
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
    <ChunkErrorBoundary key={location.pathname}>
      <Suspense fallback={<RouteLoader />}>
        <Routes location={location} key={`${language}:${location.pathname}`}>
          <Route path="/" element={<Index />} />
          <Route path="/education" element={<EducationHub />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:id" element={<FormationDetail />} />
          <Route path="/parcours" element={<Parcours />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/certification" element={<Certification />} />
          <Route path="/entreprises" element={<Entreprises />} />
          <Route path="/services" element={<Entreprises />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<LeadFormsPreview />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/seminaires" element={<Seminaires />} />
          <Route path="/webinars" element={<Webinars />} />
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
