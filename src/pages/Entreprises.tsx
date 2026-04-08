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
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath } from "@/lib/site-links";

const servicesHubCopy = {
  fr: {
    title: "Des services IA clairs pour passer de l'idée à l'impact",
    subtitle:
      "Nous avons structuré notre offre en 3 piliers simples pour aider chaque entreprise à trouver rapidement le bon point d'entrée : cadrer, déployer ou animer sa dynamique IA.",
    diagnosisTitle: "Choisissez le bon pilier selon votre situation",
    diagnosisDesc:
      "Cette page n'est pas là pour vous présenter une architecture interne. Elle sert à vous aider à identifier rapidement le bon service selon votre niveau de maturité, votre besoin actuel et le résultat que vous attendez.",
    pillarsTitle: "Les 3 points d'entrée de notre offre",
    pillars: [
      {
        title: "Conseil & adoption IA",
        desc: "Pour les entreprises qui veulent clarifier leurs priorités, cadrer leurs cas d'usage et préparer les équipes avant d'investir.",
        highlights: [
          "Le bon choix si vous ne savez pas encore par où commencer",
          "Diagnostic de maturité IA et cartographie des cas d'usage",
          "Feuille de route 30 / 60 / 90 jours",
          "Cadre d'adoption, gouvernance et conduite du changement",
        ],
        cta: "Explorer le conseil",
        href: "/consulting-ia",
        icon: Compass,
      },
      {
        title: "Automatisation & solutions IA",
        desc: "Pour les entreprises qui ont déjà identifié des besoins concrets et veulent déployer des outils, assistants ou workflows IA.",
        highlights: [
          "Le bon choix si vous avez des tâches répétitives à automatiser",
          "Automatisations de processus et workflows intelligents",
          "Assistants IA, chatbots métier et outils internes",
          "Dashboards, reporting et solutions maintenables",
        ],
        cta: "Explorer les solutions",
        href: "/developpement-solutions-ia",
        icon: Cog,
      },
      {
        title: "Media, veille & opportunités",
        desc: "Pour les organisations qui veulent former dans la durée, nourrir leur audience, suivre les nouveautés utiles et ouvrir des débouchés.",
        highlights: [
          "Le bon choix si vous voulez former, communiquer et rester à jour",
          "Newsletter métier, veille IA Afrique & Côte d'Ivoire",
          "Guides pratiques, contenus courts et ressources utiles",
          "Rubrique emploi, opportunités et mise en relation",
        ],
        cta: "Explorer le media hub",
        href: "/createur-contenu-ia",
        icon: Radar,
      },
    ],
    pathwayTitle: "Le parcours le plus efficace pour une entreprise",
    pathway: [
      {
        title: "1. Cadrer",
        desc: "Comprendre votre situation, vos objectifs et les usages IA vraiment utiles à votre organisation.",
      },
      {
        title: "2. Prioriser",
        desc: "Identifier les quick wins, arbitrer les priorités et sécuriser les conditions d'adoption.",
      },
      {
        title: "3. Déployer",
        desc: "Construire les automatisations, assistants et solutions qui créent un résultat concret.",
      },
      {
        title: "4. Animer",
        desc: "Former, nourrir les équipes, publier la veille et maintenir la dynamique IA dans le temps.",
      },
    ],
    audiencesTitle: "Si vous vous reconnaissez ici, voici votre bon point d'entrée",
    audiences: [
      "Nous ne savons pas par où commencer : Conseil & adoption IA",
      "Nous avons des tâches répétitives à automatiser : Automatisation & solutions IA",
      "Nous voulons former, communiquer et rester à jour : Media, veille & opportunités",
      "Nous voulons éviter les projets IA flous ou redondants : commencer par un cadrage",
    ],
    outcomesTitle: "Ce que vous obtenez concrètement",
    outcomes: [
      "Un diagnostic clair, une feuille de route et des cas d'usage priorisés",
      "Des automatisations, assistants IA et workflows utiles à vos équipes",
      "Une newsletter métier, une veille utile et des ressources activables",
      "Un parcours commercial plus simple entre découverte, décision et prise de contact",
    ],
    ctaTitle: "Commencer par le bon service",
    ctaDesc:
      "Si votre besoin est déjà clair, accédez directement au bon pilier. Sinon, nous pouvons commencer par un échange de cadrage pour vous orienter.",
    ctaPrimary: "Demander un cadrage",
    ctaSecondary: "Voir le catalogue formations",
  },
  en: {
    title: "Clear AI services to move from idea to impact",
    subtitle:
      "We structured the offer into 3 simple pillars to help every organization quickly find the right entry point: frame, deploy or activate its AI momentum.",
    diagnosisTitle: "Choose the right pillar for your situation",
    diagnosisDesc:
      "This page is not here to explain our internal architecture. It is here to help you quickly identify the right service based on your maturity, your current need and the result you want to buy.",
    pillarsTitle: "The 3 entry points into our offer",
    pillars: [
      {
        title: "AI advisory & adoption",
        desc: "For organizations that need to clarify priorities, frame use cases and prepare teams before investing.",
        highlights: [
          "The right choice if you do not yet know where to start",
          "AI maturity diagnosis and opportunity mapping",
          "30 / 60 / 90-day roadmap",
          "Adoption, governance and change management framework",
        ],
        cta: "Explore advisory",
        href: "/consulting-ia",
        icon: Compass,
      },
      {
        title: "AI automation & solutions",
        desc: "For organizations that already identified concrete needs and want to deploy tools, assistants or AI workflows.",
        highlights: [
          "The right choice if you have repetitive tasks to automate",
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
        desc: "For organizations that want to train over time, grow audience, follow useful AI updates and open opportunities.",
        highlights: [
          "The right choice if you want to train, communicate and stay current",
          "Profession-focused newsletter and Africa AI watch",
          "Practical guides, short-form content and useful resources",
          "Jobs section, opportunities and warm introductions",
        ],
        cta: "Explore the media hub",
        href: "/createur-contenu-ia",
        icon: Radar,
      },
    ],
    pathwayTitle: "The most effective path for an organization",
    pathway: [
      {
        title: "1. Frame",
        desc: "Understand your situation, your objectives and the AI use cases that truly matter to your organization.",
      },
      {
        title: "2. Prioritize",
        desc: "Identify quick wins, arbitrate priorities and secure adoption conditions.",
      },
      {
        title: "3. Deploy",
        desc: "Build automations, assistants and solutions that create tangible outcomes.",
      },
      {
        title: "4. Activate",
        desc: "Train teams, feed the watch, publish content and sustain the AI momentum over time.",
      },
    ],
    audiencesTitle: "If you recognize yourself here, this is your right entry point",
    audiences: [
      "We do not know where to start: AI advisory & adoption",
      "We have repetitive tasks to automate: AI automation & solutions",
      "We want to train, communicate and stay current: Media, watch & opportunities",
      "We want to avoid vague or overlapping AI projects: start with framing",
    ],
    outcomesTitle: "What you get in concrete terms",
    outcomes: [
      "A clear diagnosis, a roadmap and prioritized use cases",
      "Useful automations, AI assistants and workflows for your teams",
      "A profession-focused newsletter, useful watch and actionable resources",
      "A simpler commercial path from discovery to decision and contact",
    ],
    ctaTitle: "Start with the right service",
    ctaDesc:
      "If your need is already clear, go directly to the right pillar. If not, we can begin with a framing conversation to orient your project.",
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
            <div className="mx-auto mb-16 max-w-4xl text-center">
              <Sparkles size={42} className="mx-auto mb-4 text-primary" />
              <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">{copy.diagnosisTitle}</h2>
              <p className="text-base leading-relaxed text-muted-foreground">{copy.diagnosisDesc}</p>
            </div>

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
                      className="rounded-3xl border border-border bg-background p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
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
                      <p className="mb-5 text-sm leading-7 text-muted-foreground">{pillar.desc}</p>

                      <ul className="space-y-3">
                        {pillar.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-card-foreground">
                            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>

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
                <div className="grid gap-4 sm:grid-cols-2">
                  {copy.pathway.map((step) => (
                    <div key={step.title} className="rounded-2xl border border-border bg-background p-5">
                      <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground">{step.title}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.audiencesTitle}</h2>
                <div className="space-y-4">
                  {copy.audiences.map((audience) => (
                    <div key={audience} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                      <Users size={18} className="mt-0.5 shrink-0 text-primary" />
                      <p className="text-sm text-card-foreground">{audience}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-16 rounded-3xl border border-border bg-card p-8">
              <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.outcomesTitle}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {copy.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-sm leading-7 text-card-foreground">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-[linear-gradient(135deg,hsl(225_48%_14%),hsl(226_40%_10%))] p-8 text-center md:p-12">
              <h3 className="mb-4 font-heading text-3xl font-bold text-white">{copy.ctaTitle}</h3>
              <p className="mx-auto mb-8 max-w-3xl text-sm leading-7 text-white/75">{copy.ctaDesc}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to={buildContactPath("contact-devis")}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {copy.ctaPrimary} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/catalogue"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
                >
                  {copy.ctaSecondary}
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
