import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoTransferAI from "@/assets/logo-transferai-nettelecom.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import GlobalSearch from "@/components/GlobalSearch";

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
      { key: "educationOverview", href: "/education" },
      { key: "formations", href: "/catalogue" },
      { key: "paths", href: "/parcours" },
      { key: "certification", href: "/certification" },
      { key: "liveFormats", href: "/seminaires" },
    ],
  },
  { key: "services", href: "/services" },
  {
    key: "resources",
    children: [
      { key: "blog", href: "/blog" },
      { key: "aiTools", href: "/outils-ia" },
      { key: "contenuIA", href: "/createur-contenu-ia" },
    ],
  },
  { key: "partners", href: "/partenaires" },
  { key: "about", href: "/a-propos" },
  { key: "contact", href: "/contact" },
];

const dropdownWidths: Record<string, string> = {
  education: "w-[320px]",
  resources: "w-[320px]",
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [desktopOpenMenu, setDesktopOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const activeLanguage = resolveActiveLanguage(language);
  const copy = activeLanguage === "fr" ? fr : en;

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return location.pathname === href;

    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const isChildActive = (children?: { href: string }[]) => children?.some((child) => isActive(child.href));

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-stone-200/90 bg-[#f7f2ea]/95 backdrop-blur-xl">
      <div className="container mx-auto flex h-[74px] items-center justify-between gap-6 px-4 lg:px-6 xl:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img
            src={logoTransferAI}
            alt="TransferAI Africa"
            className="h-9 w-auto max-w-[132px] object-contain mix-blend-multiply"
          />
          <span className="hidden font-heading text-lg font-semibold tracking-[-0.03em] text-slate-950 xl:block">
            Transfer<span className="text-[hsl(20_92%_52%)]">AI</span> Africa
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href) || isChildActive(item.children);

            if (!item.children) {
              return (
                <Link
                  key={item.key}
                  to={item.href!}
                  className={`relative inline-flex h-[74px] items-center whitespace-nowrap text-[12px] font-heading font-bold uppercase tracking-[0.14em] transition-colors ${
                    active ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {copy.nav[item.key as keyof typeof copy.nav]}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[hsl(20_92%_52%)] transition-transform duration-200 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            }

            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => setDesktopOpenMenu(item.key)}
                onMouseLeave={() => setDesktopOpenMenu((current) => (current === item.key ? null : current))}
              >
                <button
                  type="button"
                  onClick={() => setDesktopOpenMenu((current) => (current === item.key ? null : item.key))}
                  className={`relative inline-flex h-[74px] items-center gap-1 whitespace-nowrap text-[12px] font-heading font-bold uppercase tracking-[0.14em] transition-colors ${
                    active || desktopOpenMenu === item.key ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                  }`}
                  aria-expanded={desktopOpenMenu === item.key}
                >
                  {copy.nav[item.key as keyof typeof copy.nav]}
                  <ChevronDown size={14} className={`transition-transform ${desktopOpenMenu === item.key ? "rotate-180" : ""}`} />
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[hsl(20_92%_52%)] transition-transform duration-200 ${
                      active || desktopOpenMenu === item.key ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>

                {desktopOpenMenu === item.key && (
                  <div
                    className={`absolute left-1/2 top-[calc(100%-6px)] -translate-x-1/2 rounded-3xl border border-stone-200 bg-white p-3 shadow-[0_26px_80px_-34px_rgba(15,23,42,0.4)] ${dropdownWidths[item.key] ?? "w-[300px]"}`}
                  >
                      <div className="mb-2 border-b border-stone-100 px-3 pb-3">
                        <p className="text-[11px] font-heading font-bold uppercase tracking-[0.22em] text-[hsl(20_92%_52%)]">
                          {copy.nav[item.key as keyof typeof copy.nav]}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => setDesktopOpenMenu(null)}
                            className={`rounded-2xl px-4 py-3 font-heading text-[11px] font-semibold uppercase tracking-[0.18em] transition-all ${
                              isActive(child.href)
                                ? "bg-[hsl(20_92%_96%)] text-[hsl(20_92%_38%)]"
                                : "text-slate-700 hover:bg-stone-50 hover:text-slate-950"
                            }`}
                          >
                            {copy.nav[child.key as keyof typeof copy.nav]}
                          </Link>
                        ))}
                      </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <GlobalSearch />

          <div className="flex items-center rounded-full border border-stone-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-heading font-bold uppercase tracking-[0.14em] transition-colors ${
                activeLanguage === "fr" ? "bg-[hsl(20_92%_52%)] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-heading font-bold uppercase tracking-[0.14em] transition-colors ${
                activeLanguage === "en" ? "bg-[hsl(20_92%_52%)] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800 lg:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-stone-200 bg-white lg:hidden">
            <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.key}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.key ? null : item.key)}
                      className={`flex w-full items-center justify-between py-2 text-left text-sm font-heading font-semibold uppercase tracking-[0.08em] ${
                        isChildActive(item.children) ? "text-[hsl(20_92%_52%)]" : "text-slate-800"
                      }`}
                    >
                      {copy.nav[item.key as keyof typeof copy.nav]}
                      <ChevronDown size={14} className={`transition-transform ${mobileExpanded === item.key ? "rotate-180" : ""}`} />
                    </button>
                    {mobileExpanded === item.key && (
                      <div className="overflow-hidden pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={() => setIsOpen(false)}
                              className={`block py-2 text-xs font-heading font-semibold uppercase tracking-[0.08em] ${
                                isActive(child.href) ? "text-[hsl(20_92%_52%)]" : "text-slate-600"
                              }`}
                            >
                              {copy.nav[child.key as keyof typeof copy.nav]}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.key}
                    to={item.href!}
                    onClick={() => setIsOpen(false)}
                    className={`py-2 text-sm font-heading font-semibold uppercase tracking-[0.08em] ${
                      isActive(item.href) ? "text-[hsl(20_92%_52%)]" : "text-slate-800"
                    }`}
                  >
                    {copy.nav[item.key as keyof typeof copy.nav]}
                  </Link>
                ),
              )}

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("fr")}
                  className={`rounded-full px-4 py-2 text-xs font-heading font-bold uppercase tracking-[0.14em] transition-colors ${
                    activeLanguage === "fr" ? "bg-[hsl(20_92%_52%)] text-white" : "border border-stone-200 text-slate-700"
                  }`}
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`rounded-full px-4 py-2 text-xs font-heading font-bold uppercase tracking-[0.14em] transition-colors ${
                    activeLanguage === "en" ? "bg-[hsl(20_92%_52%)] text-white" : "border border-stone-200 text-slate-700"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
