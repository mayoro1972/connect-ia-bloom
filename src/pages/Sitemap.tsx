import { Link } from "react-router-dom";
import { Compass, ExternalLink, FolderTree, GraduationCap, Newspaper, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { directLinks, socialLinks } from "@/lib/site-links";

const sitemapCopy = {
  fr: {
    badge: "Plan du site",
    title: "Trouvez rapidement la bonne page",
    subtitle:
      "Ce plan du site rassemble les accès les plus utiles pour découvrir l'offre, demander un audit, trouver une formation ou contacter l'équipe.",
    recommendationTitle: "Le chemin le plus simple",
    recommendationText:
      "Pour une navigation fluide, gardez le plan du site dans le footer et utilisez-le comme point de repère secondaire. Il reste visible sans surcharger le menu principal.",
    sections: [
      {
        title: "Commencer",
        icon: Compass,
        links: [
          { label: "Accueil", to: "/" },
          { label: "Audit IA gratuit", to: "/audit-ia-gratuit" },
          { label: "Parler à un expert IA", to: "/parler-expert-ia" },
          { label: "Page Entreprises", to: "/entreprises" },
        ],
      },
      {
        title: "Se former",
        icon: GraduationCap,
        links: [
          { label: "Vue d'ensemble", to: "/education" },
          { label: "Catalogue", to: "/catalogue" },
          { label: "Catalogues par domaine", to: "/catalogues-domaines" },
          { label: "Parcours", to: "/parcours" },
          { label: "Certification", to: "/certification" },
          { label: "Inscription", to: "/inscription" },
        ],
      },
      {
        title: "Ressources",
        icon: Newspaper,
        links: [
          { label: "Blog", to: "/blog" },
          { label: "Outils IA", to: "/outils-ia" },
          { label: "Média, veille & opportunités", to: "/createur-contenu-ia" },
          { label: "Événements", to: "/evenements" },
        ],
      },
      {
        title: "Entreprise & services",
        icon: Users,
        links: [
          { label: "Services entreprises", to: "/entreprises" },
          { label: "Conseil & adoption", to: "/consulting-ia" },
          { label: "Automatisation & solutions", to: "/developpement-solutions-ia" },
          { label: "Partenaires & référencement", to: "/partenaires" },
          { label: "Contact", to: "/contact" },
        ],
      },
    ],
    quickLinksTitle: "Accès directs",
    quickLinks: [
      { label: "Email", href: directLinks.email },
      { label: "WhatsApp", href: directLinks.whatsapp },
      { label: "Google Maps", href: directLinks.map },
      { label: "Prendre rendez-vous", to: "/prise-rdv" },
    ],
    socialTitle: "Réseaux & communauté",
    menuAdviceTitle: "Conseil menu",
    menuAdvice:
      "La meilleure place pour ce plan du site est dans le footer, puis éventuellement dans la rubrique À propos si vous souhaitez un second accès. Je déconseille de l'ajouter comme onglet principal dans la navbar, qui doit rester courte.",
  },
  en: {
    badge: "Sitemap",
    title: "Find the right page faster",
    subtitle:
      "This sitemap brings together the most useful entry points to explore the offer, request an audit, find training, or contact the team.",
    recommendationTitle: "The simplest navigation logic",
    recommendationText:
      "For smoother navigation, keep the sitemap in the footer and use it as a secondary orientation layer. It stays visible without overcrowding the main menu.",
    sections: [
      {
        title: "Get started",
        icon: Compass,
        links: [
          { label: "Home", to: "/" },
          { label: "Free AI audit", to: "/audit-ia-gratuit" },
          { label: "Speak with an AI expert", to: "/parler-expert-ia" },
          { label: "Enterprise page", to: "/entreprises" },
        ],
      },
      {
        title: "Learn",
        icon: GraduationCap,
        links: [
          { label: "Overview", to: "/education" },
          { label: "Catalogue", to: "/catalogue" },
          { label: "Domain catalogues", to: "/catalogues-domaines" },
          { label: "Paths", to: "/parcours" },
          { label: "Certification", to: "/certification" },
          { label: "Apply", to: "/inscription" },
        ],
      },
      {
        title: "Resources",
        icon: Newspaper,
        links: [
          { label: "Blog", to: "/blog" },
          { label: "AI tools", to: "/outils-ia" },
          { label: "Media, insights & opportunities", to: "/createur-contenu-ia" },
          { label: "Events", to: "/evenements" },
        ],
      },
      {
        title: "Business & services",
        icon: Users,
        links: [
          { label: "Enterprise services", to: "/entreprises" },
          { label: "Advisory & adoption", to: "/consulting-ia" },
          { label: "Automation & solutions", to: "/developpement-solutions-ia" },
          { label: "Partners & listing", to: "/partenaires" },
          { label: "Contact", to: "/contact" },
        ],
      },
    ],
    quickLinksTitle: "Direct links",
    quickLinks: [
      { label: "Email", href: directLinks.email },
      { label: "WhatsApp", href: directLinks.whatsapp },
      { label: "Google Maps", href: directLinks.map },
      { label: "Book a meeting", to: "/prise-rdv" },
    ],
    socialTitle: "Social & community",
    menuAdviceTitle: "Menu recommendation",
    menuAdvice:
      "The best location for the sitemap is the footer, with an optional secondary access under About if needed. I do not recommend adding it as a primary navbar item because the top navigation should stay compact.",
  },
} as const;

const SitemapPage = () => {
  const { language } = useLanguage();
  const copy = sitemapCopy[language === "en" ? "en" : "fr"];

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={copy.title} subtitle={copy.subtitle} badge={copy.badge} />

        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mb-10 rounded-[28px] border border-border bg-card p-6 md:p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <FolderTree size={14} />
                {copy.recommendationTitle}
              </div>
              <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
                {copy.recommendationText}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {copy.sections.map((section) => {
                const Icon = section.icon;

                return (
                  <div key={section.title} className="rounded-[28px] border border-border bg-card p-6 md:p-8">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon size={22} className="text-primary" />
                      </div>
                      <h2 className="font-heading text-2xl font-bold text-card-foreground">{section.title}</h2>
                    </div>

                    <div className="grid gap-3">
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          to={link.to}
                          className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-border bg-card p-6 md:p-8">
                <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.quickLinksTitle}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {copy.quickLinks.map((link) =>
                    "to" in link ? (
                      <Link
                        key={link.label}
                        to={link.to}
                        className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {link.label}
                        <ExternalLink size={14} />
                      </a>
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-border bg-card p-6 md:p-8">
                <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.socialTitle}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {link.label}
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{copy.menuAdviceTitle}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.menuAdvice}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default SitemapPage;
