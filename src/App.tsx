import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { useLanguage } from "@/i18n/LanguageContext";
import SeoManager from "./components/SeoManager";
import ScrollToTop from "./components/ScrollToTop";
import { usePageView } from "./hooks/usePageView";
import Index from "./pages/Index";

const EducationHub = lazy(() => import("./pages/EducationHub"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const FormationDetail = lazy(() => import("./pages/FormationDetail"));
const Certification = lazy(() => import("./pages/Certification"));
const Entreprises = lazy(() => import("./pages/Entreprises"));
const Partenaires = lazy(() => import("./pages/Partenaires"));
const Evenements = lazy(() => import("./pages/Evenements"));
const APropos = lazy(() => import("./pages/APropos"));
const Blog = lazy(() => import("./pages/Blog"));
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

const AnimatedRoutes = () => {
  const location = useLocation();
  const { language } = useLanguage();
  usePageView();
  return (
    <Suspense fallback={<RouteLoader />}>
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    </Suspense>
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
