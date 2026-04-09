import ScrollReveal from "@/components/ScrollReveal";
import { GraduationCap, BriefcaseBusiness, Award, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { trackCtaClick } from "@/lib/analytics";
import { buildContactPath } from "@/lib/site-links";

const sectionCopy = {
  fr: {
    title: "Choisissez votre point d'entrée",
    subtitle:
      "Que vous soyez professionnel, entreprise, étudiant ou talent en reconversion, nous vous aidons à trouver rapidement la bonne porte d'entrée vers l'IA.",
    items: [
      {
        title: "Je veux me former",
        desc: "Explorer les parcours, le catalogue et les formations les plus utiles pour mon métier.",
        cta: "Découvrir l'offre formation",
        href: "/education",
        icon: GraduationCap,
      },
      {
        title: "Je veux former mon équipe",
        desc: "Identifier un programme adapté à mon entreprise, mon secteur et mes objectifs de montée en compétence.",
        cta: "Parler de mon besoin",
        href: buildContactPath("contact-devis"),
        icon: BriefcaseBusiness,
      },
      {
        title: "Je veux découvrir la certification",
        desc: "Comprendre notre offre premium et voir comment elle s'applique à plusieurs métiers et domaines.",
        cta: "Voir la certification",
        href: "/certification",
        icon: Award,
      },
      {
        title: "Je veux être orienté",
        desc: "Obtenir une recommandation claire si j'hésite entre plusieurs formations, parcours ou formats.",
        cta: "Demander une orientation",
        href: buildContactPath("demande-renseignement"),
        icon: Compass,
      },
    ],
  },
  en: {
    title: "Choose your entry point",
    subtitle:
      "Whether you are a professional, company, student, or career-switching talent, we help you quickly find the right way into AI.",
    items: [
      {
        title: "I want to train",
        desc: "Explore pathways, catalogue options, and the most useful courses for my profession.",
        cta: "Explore training",
        href: "/education",
        icon: GraduationCap,
      },
      {
        title: "I want to train my team",
        desc: "Identify a program aligned with my company, sector, and upskilling goals.",
        cta: "Discuss my needs",
        href: buildContactPath("contact-devis"),
        icon: BriefcaseBusiness,
      },
      {
        title: "I want to discover the certification",
        desc: "Understand our premium offer and see how it applies across several professions and domains.",
        cta: "View certification",
        href: "/certification",
        icon: Award,
      },
      {
        title: "I want guidance",
        desc: "Get a clear recommendation if I hesitate between several courses, paths, or formats.",
        cta: "Request guidance",
        href: buildContactPath("demande-renseignement"),
        icon: Compass,
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

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
