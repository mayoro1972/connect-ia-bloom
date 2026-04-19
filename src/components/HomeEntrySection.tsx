import ScrollReveal from "@/components/ScrollReveal";
import { GraduationCap, BriefcaseBusiness, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { trackCtaClick } from "@/lib/analytics";

const sectionCopy = {
  fr: {
    title: "Choisissez votre point d'entrée",
    subtitle:
      "Trouvez rapidement le bon point d'entrée selon votre profil et votre besoin.",
    items: [
      {
        title: "Je veux me former",
        desc: "Recevoir le catalogue complet (130+ formations, 13 domaines) directement par email.",
        cta: "Recevoir le catalogue",
        href: "/demande-catalogue",
        icon: GraduationCap,
      },
      {
        title: "Je représente une entreprise",
        desc: "Identifier un dispositif adapté à mon équipe et à mes objectifs.",
        cta: "Voir les services entreprises",
        href: "/entreprises",
        icon: BriefcaseBusiness,
      },
      {
        title: "Je veux explorer les domaines et outils",
        desc: "Voir les spécialisations, outils IA et usages par domaine.",
        cta: "Explorer les outils IA",
        href: "/outils-ia",
        icon: Workflow,
      },
    ],
  },
  en: {
    title: "Choose your entry point",
    subtitle:
      "Find the right entry point quickly based on your profile and your need.",
    items: [
      {
        title: "I want to train",
        desc: "Receive the full catalogue (130+ courses, 13 domains) directly by email.",
        cta: "Receive the catalogue",
        href: "/demande-catalogue",
        icon: GraduationCap,
      },
      {
        title: "I represent a company",
        desc: "Identify a program aligned with my team and upskilling goals.",
        cta: "View enterprise services",
        href: "/entreprises",
        icon: BriefcaseBusiness,
      },
      {
        title: "I want to explore domains and tools",
        desc: "Review the specializations, AI tools, and use cases by domain.",
        cta: "Explore AI tools",
        href: "/outils-ia",
        icon: Workflow,
      },
    ],
  },
} as const;

const HomeEntrySection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl text-card-foreground">{copy.title}</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{copy.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {copy.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={index * 0.08} direction="up">
                <Link
                  to={item.href}
                  onClick={() =>
                    trackCtaClick({
                      ctaName: item.title,
                      ctaLocation: "home_entry_section",
                      destination: item.href,
                    })
                  }
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 hover-lift"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-orange-gradient group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-card-foreground">{item.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  <span className="text-sm font-semibold text-primary">{item.cta} →</span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeEntrySection;
