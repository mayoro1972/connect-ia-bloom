import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/i18n/LanguageContext";
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
import Contact from "./pages/Contact";
import Parcours from "./pages/Parcours";
import Inscription from "./pages/Inscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const routerBasename = import.meta.env.BASE_URL === "/"
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, "");

const AnimatedRoutes = () => {
  const location = useLocation();
  usePageView();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={routerBasename}>
            <ScrollToTop />
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
