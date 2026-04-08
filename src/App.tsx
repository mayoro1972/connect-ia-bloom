import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { useLanguage } from "@/i18n/LanguageContext";
import ScrollToTop from "./components/ScrollToTop";
import { usePageView } from "./hooks/usePageView";
import Index from "./pages/Index";
import Catalogue from "./pages/Catalogue";
import FormationDetail from "./pages/FormationDetail";
import Certification from "./pages/Certification";
import Entreprises from "./pages/Entreprises";
import Partenaires from "./pages/Partenaires";
import Evenements from "./pages/Evenements";
import APropos from "./pages/APropos";
import Blog from "./pages/Blog";
import Parcours from "./pages/Parcours";
import Inscription from "./pages/Inscription";
import Seminaires from "./pages/Seminaires";
import Webinars from "./pages/Webinars";
import CreateurContenuIA from "./pages/CreateurContenuIA";
import ConsultingIA from "./pages/ConsultingIA";
import DeveloppementSolutionsIA from "./pages/DeveloppementSolutionsIA";
import PreviewHub from "./pages/PreviewHub";
import CatalogueDomainPreview from "./pages/CatalogueDomainPreview";
import LeadFormsPreview from "./pages/LeadFormsPreview";
import AppointmentPreview from "./pages/AppointmentPreview";
import Privacy from "./pages/Privacy";
import BackOffice from "./pages/BackOffice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const routerBasename = import.meta.env.BASE_URL === "/"
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, "");

const AnimatedRoutes = () => {
  const location = useLocation();
  const { language } = useLanguage();
  usePageView();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={`${language}:${location.pathname}`}>
        <Route path="/" element={<Index />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/catalogue/:id" element={<FormationDetail />} />
        <Route path="/parcours" element={<Parcours />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/certification" element={<Certification />} />
        <Route path="/entreprises" element={<Entreprises />} />
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
  );
};

const AppShell = () => {
  const { language } = useLanguage();

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBasename} key={language}>
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
