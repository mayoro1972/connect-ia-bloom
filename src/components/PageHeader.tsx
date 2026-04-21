import headerBg from "@/assets/header-bg.jpg";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  showContextNavigation?: boolean;
}

const getParentPage = (pathname: string, language: "fr" | "en") => {
  const copy = {
    fr: {
      home: "Accueil",
      backHome: "Retour à l'accueil",
      catalogue: "Catalogue",
      backCatalogue: "Retour au catalogue",
      blog: "Ressources",
      backBlog: "Retour aux ressources",
      events: "Événements",
      backEvents: "Retour aux événements",
      webinars: "Webinaires",
      backWebinars: "Retour aux webinaires",
      previews: "Aperçus",
      backPreviews: "Retour aux aperçus",
    },
    en: {
      home: "Home",
      backHome: "Back to home",
      catalogue: "Catalogue",
      backCatalogue: "Back to catalogue",
      blog: "Resources",
      backBlog: "Back to resources",
      events: "Events",
      backEvents: "Back to events",
      webinars: "Webinars",
      backWebinars: "Back to webinars",
      previews: "Previews",
      backPreviews: "Back to previews",
    },
  }[language];

  if (pathname.startsWith("/catalogues-domaines")) {
    return { href: "/catalogues-domaines", label: copy.previews, backLabel: copy.backPreviews };
  }

  if (pathname.startsWith("/catalogue")) {
    return { href: "/catalogue", label: copy.catalogue, backLabel: copy.backCatalogue };
  }

  if (pathname.startsWith("/blog")) {
    return { href: "/blog", label: copy.blog, backLabel: copy.backBlog };
  }

  if (pathname.startsWith("/webinaires") || pathname.startsWith("/webinars")) {
    return { href: "/webinars", label: copy.webinars, backLabel: copy.backWebinars };
  }

  if (pathname.startsWith("/evenements")) {
    return { href: "/evenements", label: copy.events, backLabel: copy.backEvents };
  }

  if (pathname.startsWith("/preview")) {
    return { href: "/preview", label: copy.previews, backLabel: copy.backPreviews };
  }

  return { href: "/", label: copy.home, backLabel: copy.backHome };
};

const PageHeader = ({ title, subtitle, badge, showContextNavigation = true }: PageHeaderProps) => {
  const location = useLocation();
  const { language } = useLanguage();
  const activeLanguage = language === "en" ? "en" : "fr";
  const parentPage = getParentPage(location.pathname, activeLanguage);
  const homeLabel = activeLanguage === "en" ? "Home" : "Accueil";

  return (
    <section className="relative overflow-hidden pb-8 pt-20 md:pb-12 md:pt-24 lg:pb-16 lg:pt-28">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={headerBg} alt="" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(225 55% 10% / 0.85), hsl(220 50% 16% / 0.9))",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        {showContextNavigation && (
          <div className="mb-8 flex flex-col gap-3 text-sm text-white/72 md:flex-row md:items-center md:justify-between">
            <Link
              to={parentPage.href}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 font-semibold text-white transition-colors hover:border-primary/50 hover:bg-primary/15"
            >
              <ArrowLeft size={16} />
              {parentPage.backLabel}
            </Link>
            <nav aria-label="Fil d'Ariane" className="hidden items-center gap-2 md:flex">
              <Link to="/" className="transition-colors hover:text-white">
                {homeLabel}
              </Link>
              {parentPage.href !== "/" && (
                <>
                  <ChevronRight size={14} aria-hidden="true" />
                  <Link to={parentPage.href} className="transition-colors hover:text-white">
                    {parentPage.label}
                  </Link>
                </>
              )}
              <ChevronRight size={14} aria-hidden="true" />
              <span className="max-w-[16rem] truncate text-white" aria-current="page">
                {title}
              </span>
            </nav>
          </div>
        )}
        <div className="text-center">
        {badge && (
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-6"
            style={{
              borderColor: "hsl(15 85% 57% / 0.3)",
              background: "hsl(15 85% 57% / 0.1)",
              color: "hsl(15 85% 65%)",
            }}
          >
            {badge}
          </span>
        )}
        <h1
          className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold mb-3"
          style={{ color: "hsl(0 0% 98%)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sm md:text-base max-w-xl mx-auto"
            style={{ color: "hsl(210 20% 75%)" }}
          >
            {subtitle}
          </p>
        )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
