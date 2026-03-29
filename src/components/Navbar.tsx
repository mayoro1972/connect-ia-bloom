import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logoTransferAI from "@/assets/logo-academie-ia-afrique.png";
import aiToolsBanner from "@/assets/ai-tools-banner.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

interface NavItem {
  key: string;
  href?: string;
  children?: { key: string; href: string }[];
}

const navItems: NavItem[] = [
  { key: "home", href: "/" },
  {
    key: "education",
    children: [
      { key: "formations", href: "/catalogue" },
      { key: "certification", href: "/certification" },
      { key: "seminaires", href: "/seminaires" },
      { key: "webinars", href: "/webinars" },
      { key: "enterprises", href: "/entreprises" },
    ],
  },
  { key: "contenuIA", href: "/createur-contenu-ia" },
  { key: "consultingIA", href: "/consulting-ia" },
  { key: "devSolutionsIA", href: "/developpement-solutions-ia" },
  { key: "events", href: "/evenements" },
  { key: "blog", href: "/blog" },
  { key: "partners", href: "/partenaires" },
  { key: "about", href: "/a-propos" },
  { key: "contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href?: string) => href && location.pathname === href;
  const isChildActive = (children?: { href: string }[]) =>
    children?.some((c) => location.pathname === c.href);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b" style={{ background: "hsl(225 55% 10% / 0.92)", borderColor: "hsl(30 90% 50% / 0.15)" }}>
      {/* Animated AI tools banner */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute inset-0 flex" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ width: "200%" }}>
          <img src={aiToolsBanner} alt="" className="h-full w-1/2 object-cover" style={{ opacity: 0.18 }} />
          <img src={aiToolsBanner} alt="" className="h-full w-1/2 object-cover" style={{ opacity: 0.18 }} />
        </motion.div>
        <motion.div className="absolute inset-0 flex" animate={{ x: ["-50%", "0%"] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} style={{ width: "200%" }}>
          <img src={aiToolsBanner} alt="" className="h-full w-1/2 object-cover" style={{ opacity: 0.1, transform: "scaleX(-1)" }} />
          <img src={aiToolsBanner} alt="" className="h-full w-1/2 object-cover" style={{ opacity: 0.1, transform: "scaleX(-1)" }} />
        </motion.div>
      </div>

      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8 relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoTransferAI} alt="TransferAI Africa" className="h-10 w-10 rounded-lg object-contain" />
          <span className="font-heading font-semibold tracking-tight" style={{ color: "hsl(0 0% 96%)" }}>
            Transfer<span className="text-gradient-orange">AI</span> Africa
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-5" ref={dropdownRef}>
          {navItems.map((item) =>
            item.children ? (
              <div key={item.key} className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === item.key ? null : item.key)}
                  className={`text-sm transition-colors font-medium flex items-center gap-1 ${isChildActive(item.children) ? "text-primary" : ""}`}
                  style={!isChildActive(item.children) ? { color: "hsl(210 20% 72%)" } : undefined}
                >
                  {t(`nav.${item.key}`)}
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen === item.key ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen === item.key && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 mt-2 w-56 rounded-xl border shadow-xl overflow-hidden"
                      style={{ background: "hsl(225 55% 12%)", borderColor: "hsl(30 90% 50% / 0.15)" }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setDropdownOpen(null)}
                          className={`block px-4 py-3 text-sm font-medium transition-colors hover:bg-primary/10 ${isActive(child.href) ? "text-primary bg-primary/5" : ""}`}
                          style={!isActive(child.href) ? { color: "hsl(210 20% 72%)" } : undefined}
                        >
                          {t(`nav.${child.key}`)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.key}
                to={item.href!}
                className={`text-sm transition-colors font-medium ${isActive(item.href) ? "text-primary" : ""}`}
                style={!isActive(item.href) ? { color: "hsl(210 20% 72%)" } : undefined}
              >
                {t(`nav.${item.key}`)}
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: "hsl(0 0% 100% / 0.15)" }}>
            <button onClick={() => setLanguage("fr")} className={`text-xs font-bold px-3 py-1.5 transition-colors ${language === "fr" ? "bg-primary text-primary-foreground" : "hover:bg-white/10"}`} style={language !== "fr" ? { color: "hsl(210 20% 70%)" } : undefined}>FR</button>
            <button onClick={() => setLanguage("en")} className={`text-xs font-bold px-3 py-1.5 transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "hover:bg-white/10"}`} style={language !== "en" ? { color: "hsl(210 20% 70%)" } : undefined}>EN</button>
          </div>
          <Link to="/contact" className="bg-orange-gradient font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
            {t("nav.cta")}
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden" style={{ color: "hsl(0 0% 96%)" }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t" style={{ background: "hsl(225 55% 10%)", borderColor: "hsl(30 90% 50% / 0.1)" }}>
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.key}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.key ? null : item.key)}
                      className={`w-full text-left text-sm py-2 font-medium flex items-center justify-between ${isChildActive(item.children) ? "text-primary" : ""}`}
                      style={!isChildActive(item.children) ? { color: "hsl(210 20% 72%)" } : undefined}
                    >
                      {t(`nav.${item.key}`)}
                      <ChevronDown size={14} className={`transition-transform ${mobileExpanded === item.key ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileExpanded === item.key && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={() => setIsOpen(false)}
                              className={`block text-sm py-2 font-medium ${isActive(child.href) ? "text-primary" : ""}`}
                              style={!isActive(child.href) ? { color: "hsl(210 20% 60%)" } : undefined}
                            >
                              {t(`nav.${child.key}`)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.key}
                    to={item.href!}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm py-2 font-medium ${isActive(item.href) ? "text-primary" : ""}`}
                    style={!isActive(item.href) ? { color: "hsl(210 20% 72%)" } : undefined}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                )
              )}
              <div className="flex items-center gap-2 py-2">
                <button onClick={() => setLanguage("fr")} className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${language === "fr" ? "bg-primary text-primary-foreground" : "border"}`} style={language !== "fr" ? { color: "hsl(210 20% 70%)", borderColor: "hsl(0 0% 100% / 0.15)" } : undefined}>FR</button>
                <button onClick={() => setLanguage("en")} className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "border"}`} style={language !== "en" ? { color: "hsl(210 20% 70%)", borderColor: "hsl(0 0% 100% / 0.15)" } : undefined}>EN</button>
              </div>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="bg-orange-gradient font-semibold text-sm px-5 py-2.5 rounded-lg text-center mt-2" style={{ color: "hsl(0 0% 100%)" }}>
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
