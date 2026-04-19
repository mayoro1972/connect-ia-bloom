import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Cog,
  Compass,
  Radar,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { directLinks } from "@/lib/site-links";

const servicesHubCopy = {
  fr: {
    title: "Des services clairs pour passer de l'idée à l'impact",
    subtitle:
      "Trois points d'entrée simples pour cadrer, déployer et faire vivre une dynamique IA utile dans votre organisation.",
    diagnosisTitle: "Choisissez votre point d'entrée",
    diagnosisDesc:
      "Commencez par le bon pilier selon votre besoin actuel, puis avancez avec un plan clair.",
    pillarsTitle: "Les 3 points d'entrée de notre offre",
    pillars: [
      {
        title: "Conseil & adoption IA",
        desc: "Pour cadrer les priorités, choisir les bons cas d'usage et préparer les équipes avant d'investir.",
        highlights: [
          "Diagnostic de maturité IA et cartographie des cas d'usage",
          "Feuille de route 30 / 60 / 90 jours",
          "Cadre d'adoption et gouvernance",
        ],
        cta: "Explorer le conseil",
        href: "/consulting-ia",
        icon: Compass,
      },
      {
        title: "Automatisation & solutions IA",
        desc: "Pour déployer des outils, assistants et workflows IA sur des besoins déjà identifiés.",
        highlights: [
          "Automatisations de processus et workflows intelligents",
          "Assistants IA, chatbots métier et outils internes",
          "Dashboards, reporting et solutions maintenables",
        ],
        cta: "Explorer les solutions",
        href: "/developpement-solutions-ia",
        icon: Cog,
      },
      {
        title: "Média, veille & opportunités",
        desc: "Pour former dans la durée, nourrir l'audience et faire circuler les nouveautés vraiment utiles.",
        highlights: [
          "Newsletter métier et signaux utiles",
          "Guides pratiques et contenus courts",
          "Opportunités et mise en relation",
        ],
        cta: "Explorer le media hub",
        href: "/createur-contenu-ia",
        icon: Radar,
      },
    ],
    pathwayTitle: "Le chemin le plus simple",
    pathway: [
      {
        title: "1. Cadrer",
        desc: "Clarifier vos objectifs et les usages IA qui comptent vraiment.",
      },
      {
        title: "2. Déployer",
        desc: "Construire les automatisations et solutions qui créent un résultat concret.",
      },
      {
        title: "3. Animer",
        desc: "Former les équipes et maintenir la dynamique dans le temps.",
      },
    ],
    outcomesTitle: "Résultats attendus",
    outcomes: [
      "Un diagnostic clair et des priorités lisibles",
      "Des automatisations et assistants utiles aux équipes",
      "Une dynamique durable grâce à la formation et aux ressources",
    ],
    ctaTitle: "Commencer par le bon service",
    ctaDesc:
      "Si votre besoin est déjà clair, allez directement au bon pilier. Sinon, commencez par un échange de cadrage.",
    ctaPrimary: "Demander un cadrage",
    ctaSecondary: "Voir le catalogue formations",
  },
  en: {
    title: "Clear services to move from idea to impact",
    subtitle:
      "Three simple entry points to frame, deploy and sustain useful AI adoption inside your organization.",
    diagnosisTitle: "Choose your entry point",
    diagnosisDesc:
      "Start with the right pillar for your current need, then move forward with a clear plan.",
    pillarsTitle: "The 3 entry points into our offer",
    pillars: [
      {
        title: "AI advisory & adoption",
        desc: "To clarify priorities, frame the right use cases and prepare teams before investing.",
        highlights: [
          "AI maturity diagnosis and opportunity mapping",
          "30 / 60 / 90-day roadmap",
          "Adoption and governance framework",
        ],
        cta: "Explore advisory",
        href: "/consulting-ia",
        icon: Compass,
      },
      {
        title: "AI automation & solutions",
        desc: "To deploy tools, assistants and AI workflows on already identified needs.",
        highlights: [
          "Process automation and intelligent workflows",
          "AI assistants, business chatbots and internal tools",
          "Dashboards, reporting and maintainable systems",
        ],
        cta: "Explore solutions",
        href: "/developpement-solutions-ia",
        icon: Cog,
      },
      {
        title: "Media, watch & opportunities",
        desc: "To train over time, grow audience and share the AI updates that actually matter.",
        highlights: [
          "Profession-focused newsletter and useful signals",
          "Practical guides and short-form content",
          "Opportunities and warm introductions",
        ],
        cta: "Explore the media hub",
        href: "/createur-contenu-ia",
        icon: Radar,
      },
    ],
    pathwayTitle: "The simplest path",
    pathway: [
      {
        title: "1. Frame",
        desc: "Clarify your goals and the AI use cases that truly matter.",
      },
      {
        title: "2. Deploy",
        desc: "Build automations and solutions that create tangible outcomes.",
      },
      {
        title: "3. Activate",
        desc: "Train teams and sustain the AI momentum over time.",
      },
    ],
    outcomesTitle: "Expected outcomes",
    outcomes: [
      "A clear diagnosis and visible priorities",
      "Useful automations and assistants for your teams",
      "Long-term momentum through training and resources",
    ],
    ctaTitle: "Start with the right service",
    ctaDesc:
      "If your need is already clear, go directly to the right pillar. If not, start with a framing conversation.",
    ctaPrimary: "Request a framing call",
    ctaSecondary: "View the training catalogue",
  },
} as const;

const pillIcons = [BrainCircuit, Cog, BellRing];

const EntreprisesPage = () => {
  const { language } = useLanguage();
  const copy = servicesHubCopy[language === "en" ? "en" : "fr"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={copy.title} subtitle={copy.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">

            <div className="mb-16 rounded-[28px] border border-border bg-card p-8 md:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <BriefcaseBusiness size={26} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{copy.pillarsTitle}</p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                {copy.pillars.map((pillar, index) => {
                  const Icon = pillar.icon;
                  const Accent = pillIcons[index] || BrainCircuit;

                  return (
                    <motion.div
                      key={pillar.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex h-full min-h-[420px] flex-col rounded-3xl border border-border bg-background p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
                    >
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                          <Icon size={22} className="text-primary" />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(20_92%_96%)] text-[hsl(20_92%_42%)]">
                          <Accent size={18} />
                        </div>
                      </div>

                      <h3 className="mb-3 font-heading text-xl font-bold text-card-foreground">{pillar.title}</h3>
                      <div className="flex-1">
                        <p className="mb-5 text-sm leading-7 text-muted-foreground">{pillar.desc}</p>

                        <ul className="space-y-3">
                          {pillar.highlights.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-card-foreground">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        to={pillar.href}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
                      >
                        {pillar.cta} <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.pathwayTitle}</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {copy.pathway.map((step) => (
                    <div key={step.title} className="rounded-2xl border border-border bg-background p-5">
                      <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground">{step.title}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.outcomesTitle}</h2>
                <div className="space-y-4">
                  {copy.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                      <p className="text-sm leading-7 text-card-foreground">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[linear-gradient(135deg,hsl(225_48%_14%),hsl(226_40%_10%))] p-5 text-center md:p-6">
              <p className="mx-auto mb-4 max-w-4xl text-sm leading-6 text-white/85 md:whitespace-nowrap">{copy.ctaDesc}</p>
              <div className="flex justify-center">
                <Link
                  to="/parler-expert-ia"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {copy.ctaPrimary} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default EntreprisesPage;
