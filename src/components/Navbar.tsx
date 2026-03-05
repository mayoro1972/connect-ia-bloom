import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logoTransferAI from "@/assets/logo-academie-ia-afrique.png";
import { useLanguage } from "@/i18n/LanguageContext";

const navKeys = [
  { key: "home", href: "/" },
  { key: "catalogue", href: "/catalogue" },
  { key: "parcours", href: "/parcours" },
  { key: "certification", href: "/certification" },
  { key: "enterprises", href: "/entreprises" },
  { key: "partners", href: "/partenaires" },
  { key: "events", href: "/evenements" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/a-propos" },
  { key: "contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = navKeys.map((n) => ({ label: t(`nav.${n.key}`), href: n.href }));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b" style={{ background: "hsl(225 55% 10% / 0.92)", borderColor: "hsl(30 90% 50% / 0.15)" }}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoTransferAI} alt="TransferAI Africa" className="h-10 w-10 rounded-lg object-contain" />
          <span className="font-heading font-semibold tracking-tight" style={{ color: "hsl(0 0% 96%)" }}>
            Transfer<span className="text-gradient-orange">AI</span> Africa
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm transition-colors font-medium ${
                location.pathname === link.href ? "text-primary" : ""
              }`}
              style={location.pathname !== link.href ? { color: "hsl(210 20% 72%)" } : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-primary/50"
            style={{ color: "hsl(210 20% 80%)", borderColor: "hsl(0 0% 100% / 0.15)" }}
          >
            <Globe size={14} />
            {language === "fr" ? "EN" : "FR"}
          </button>
          <Link
            to="/contact"
            className="bg-orange-gradient font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            style={{ color: "hsl(0 0% 100%)" }}
          >
            {t("nav.cta")}
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden" style={{ color: "hsl(0 0% 96%)" }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t"
            style={{ background: "hsl(225 55% 10%)", borderColor: "hsl(30 90% 50% / 0.1)" }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm py-2 font-medium ${
                    location.pathname === link.href ? "text-primary" : ""
                  }`}
                  style={location.pathname !== link.href ? { color: "hsl(210 20% 72%)" } : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setLanguage(language === "fr" ? "en" : "fr"); }}
                className="flex items-center gap-2 text-sm py-2 font-medium"
                style={{ color: "hsl(210 20% 80%)" }}
              >
                <Globe size={14} />
                {language === "fr" ? "Switch to English" : "Passer en Français"}
              </button>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-orange-gradient font-semibold text-sm px-5 py-2.5 rounded-lg text-center mt-2"
                style={{ color: "hsl(0 0% 100%)" }}
              >
                {t("nav.cta")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
