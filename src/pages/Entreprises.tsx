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
    title: "Services IA pour entreprises",
    subtitle:
      "Une architecture claire en 3 piliers pour cadrer vos priorités, déployer les bons systèmes IA et animer votre montée en compétences sans doublons ni confusion.",
    diagnosisTitle: "Une offre plus lisible, plus crédible et plus simple à acheter",
    diagnosisDesc:
      "Nous avons restructuré nos services pour supprimer les chevauchements entre conseil, déploiement et contenu. Le résultat : un parcours plus compréhensible pour les décideurs, une meilleure lisibilité commerciale et une navigation plus naturelle pour les visiteurs.",
    pillarsTitle: "Une architecture de services en 3 piliers",
    pillars: [
      {
        title: "Conseil & adoption IA",
        desc: "Le bon choix si vous devez clarifier vos priorités, cadrer vos cas d'usage, aligner les décideurs et préparer vos équipes avant d'investir.",
        highlights: [
          "Diagnostic de maturité IA",
          "Feuille de route d'adoption",
          "Gouvernance et conduite du changement",
          "Veille executive sectorielle",
        ],
        cta: "Explorer le conseil",
        href: "/consulting-ia",
        icon: Compass,
      },
      {
        title: "Automatisation & solutions IA",
        desc: "Le bon choix si vous avez déjà des cas d'usage prioritaires et voulez transformer des besoins métiers en outils déployables et maintenables.",
        highlights: [
          "Automatisation des processus",
          "Assistants et chatbots métier",
          "Dashboards et reporting intelligents",
          "Systèmes de génération de contenu",
        ],
        cta: "Explorer les solutions",
        href: "/developpement-solutions-ia",
        icon: Cog,
      },
      {
        title: "Media, veille & opportunités",
        desc: "Le bon choix pour former dans le quotidien, capter l'audience, nourrir la newsletter, publier la veille IA et ouvrir des débouchés emploi.",
        highlights: [
          "Newsletter métier hebdomadaire",
          "Veille IA Afrique & Côte d'Ivoire",
          "Guides pratiques et contenus courts",
          "Rubrique emploi et mise en relation",
        ],
        cta: "Explorer le media hub",
        href: "/createur-contenu-ia",
        icon: Radar,
      },
    ],
    pathwayTitle: "Le parcours recommandé pour un client entreprise",
    pathway: [
      {
        title: "1. Cadrer",
        desc: "Comprendre vos objectifs, arbitrer les priorités et choisir les bons cas d'usage.",
      },
      {
        title: "2. Prioriser",
        desc: "Sélectionner des quick wins, valider la gouvernance et sécuriser l'adoption.",
      },
      {
        title: "3. Déployer",
        desc: "Construire les automatisations, assistants et tableaux de bord réellement utiles.",
      },
      {
        title: "4. Animer",
        desc: "Former, nourrir les équipes, publier la veille et maintenir la dynamique IA.",
      },
    ],
    audiencesTitle: "Pour qui cette architecture est pensée",
    audiences: [
      "Directions générales et comités de pilotage",
      "DSI, transformation digitale et innovation",
      "RH, opérations, marketing et fonctions support",
      "Organisations qui veulent éviter les projets IA flous ou redondants",
    ],
    outcomesTitle: "Ce que cette refonte change concrètement",
    outcomes: [
      "Une navigation plus simple : vue d'ensemble puis approfondissement par pilier",
      "Une promesse plus crédible : chaque page répond à un besoin distinct",
      "Moins de répétition entre audit, stratégie, déploiement et veille",
      "Un meilleur parcours commercial : découverte, conviction, prise de contact",
    ],
    ctaTitle: "Commencer par une vue d'ensemble ou aller directement au bon pilier",
    ctaDesc:
      "Si vous savez déjà où se situe votre besoin, accédez directement à la bonne offre. Sinon, nous pouvons commencer par un échange de cadrage.",
    ctaPrimary: "Demander un cadrage",
    ctaSecondary: "Voir le catalogue formations",
  },
  en: {
    title: "AI services for organizations",
    subtitle:
      "A clear 3-pillar architecture to frame priorities, deploy the right AI systems and support upskilling without overlap or confusion.",
    diagnosisTitle: "A sharper, more credible and easier-to-buy offer",
    diagnosisDesc:
      "We restructured the services layer to remove overlap between advisory, deployment and content. The result is a clearer commercial story, easier navigation and a more natural path for decision-makers.",
    pillarsTitle: "A 3-pillar service architecture",
    pillars: [
      {
        title: "AI advisory & adoption",
        desc: "The right choice when you need to clarify priorities, frame use cases, align leadership and prepare teams before investing.",
        highlights: [
          "AI maturity diagnosis",
          "Adoption roadmap",
          "Governance and change management",
          "Executive sector watch",
        ],
        cta: "Explore advisory",
        href: "/consulting-ia",
        icon: Compass,
      },
      {
        title: "AI automation & solutions",
        desc: "The right choice when you already have priority use cases and need to turn business needs into deployable, maintainable systems.",
        highlights: [
          "Process automation",
          "Business assistants and chatbots",
          "Smart dashboards and reporting",
          "Content generation systems",
        ],
        cta: "Explore solutions",
        href: "/developpement-solutions-ia",
        icon: Cog,
      },
      {
        title: "Media, watch & opportunities",
        desc: "The right choice to train through day-to-day content, grow audience, power the newsletter, publish AI watch content and open career paths.",
        highlights: [
          "Weekly profession-focused newsletter",
          "Africa & Côte d'Ivoire AI watch",
          "Practical guides and short-form content",
          "Jobs and warm introductions section",
        ],
        cta: "Explore the media hub",
        href: "/createur-contenu-ia",
        icon: Radar,
      },
    ],
    pathwayTitle: "Recommended path for enterprise clients",
    pathway: [
      {
        title: "1. Frame",
        desc: "Understand objectives, arbitrate priorities and select the right use cases.",
      },
      {
        title: "2. Prioritize",
        desc: "Choose quick wins, validate governance and secure adoption conditions.",
      },
      {
        title: "3. Deploy",
        desc: "Build automations, assistants and reporting systems that actually help teams.",
      },
      {
        title: "4. Activate",
        desc: "Train teams, feed the watch, publish content and sustain momentum.",
      },
    ],
    audiencesTitle: "Who this architecture is designed for",
    audiences: [
      "Executive teams and steering committees",
      "CIO, digital transformation and innovation leaders",
      "HR, operations, marketing and support functions",
      "Organizations that want to avoid vague or overlapping AI projects",
    ],
    outcomesTitle: "What this redesign changes in practice",
    outcomes: [
      "Simpler navigation: overview first, then pillar-level deep dives",
      "More credible positioning: each page answers a distinct need",
      "Less overlap between audit, strategy, deployment and watch work",
      "A better commercial path from discovery to contact",
    ],
    ctaTitle: "Start from the overview or jump straight to the right pillar",
    ctaDesc:
      "If you already know where your need sits, go directly to the right offer. If not, we can start with a framing conversation.",
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
