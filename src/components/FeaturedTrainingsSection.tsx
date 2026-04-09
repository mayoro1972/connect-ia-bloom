import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { formations } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { useFormationLocale } from "@/hooks/useFormationLocale";
import { trackCtaClick } from "@/lib/analytics";

const featuredFormationIds = ["assist-01", "rh-01", "mkt-01", "mgmt-05"] as const;

const sectionCopy = {
  fr: {
    title: "Nos formations phares",
    subtitle:
      "Commencez par les formations les plus demandées, les plus utiles et les plus immédiatement applicables à votre métier.",
    cards: {
      "assist-01": {
        benefit: "Pour démarrer rapidement avec ChatGPT et gagner du temps dans l'organisation, la rédaction et la coordination.",
        cta: "Voir la formation",
      },
      "rh-01": {
        benefit: "Pour moderniser le sourcing, la sélection et les premiers usages IA dans les RH.",
        cta: "Voir la formation",
      },
      "mkt-01": {
        benefit: "Pour créer plus vite, mieux communiquer et produire du contenu plus stratégique avec l'IA.",
        cta: "Voir la formation",
      },
      "mgmt-05": {
        benefit: "Pour les dirigeants et décideurs qui veulent comprendre l'IA et cadrer une vision utile.",
        cta: "Voir la formation",
      },
    },
    premiumTitle: "Certification premium",
    premiumDesc:
      "Une offre professionnalisante pour les métiers support et de gestion, avec socle commun et spécialisation métier.",
    premiumCta: "Découvrir la certification",
    liveTitle: "Séminaires & Webinars",
    liveDesc:
      "Le bon format pour tester TransferAI Africa, découvrir un sujet rapidement et passer à l'action sans friction.",
    liveCta: "Voir les formats live",
  },
  en: {
    title: "Featured training",
    subtitle:
      "Start with the most requested, most useful, and most immediately applicable courses for your profession.",
    cards: {
      "assist-01": {
        benefit: "A fast way to start with ChatGPT and save time in organization, writing, and coordination.",
        cta: "View course",
      },
      "rh-01": {
        benefit: "To modernize sourcing, selection, and first AI use cases in HR.",
        cta: "View course",
      },
      "mkt-01": {
        benefit: "To create faster, communicate better, and produce more strategic content with AI.",
        cta: "View course",
      },
      "mgmt-05": {
        benefit: "For leaders and decision-makers who want to understand AI and frame a useful vision.",
        cta: "View course",
      },
    },
    premiumTitle: "Premium certification",
    premiumDesc:
      "A professional offer for support and management roles, with a common core and a profession-based specialization.",
    premiumCta: "Discover certification",
    liveTitle: "Seminars & webinars",
    liveDesc:
      "The right format to discover TransferAI Africa, test a topic quickly, and move into action with low friction.",
    liveCta: "View live formats",
  },
} as const;

const FeaturedTrainingsSection = () => {
  const { language } = useLanguage();
  const activeLanguage = resolveActiveLanguage(language);
  const copy = sectionCopy[activeLanguage];
  const { getTitle, getLevel, getFormat, getDuration } = useFormationLocale();
  const featuredFormations = featuredFormationIds
    .map((id) => formations.find((formation) => formation.id === id))
    .filter(Boolean);

  return (
    <section className="bg-muted py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl text-card-foreground">{copy.title}</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{copy.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredFormations.map((formation, index) => (
            <ScrollReveal key={formation.id} delay={index * 0.08} direction="up">
              <Link
                to={`/catalogue/${formation.id}`}
                onClick={() =>
                  trackCtaClick({
                    ctaName: getTitle(formation),
                    ctaLocation: "home_featured_trainings",
                    destination: `/catalogue/${formation.id}`,
                  })
                }
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 hover-lift"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {getLevel(formation)}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {getFormat(formation)}
                  </span>
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-card-foreground">{getTitle(formation)}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {copy.cards[formation.id as keyof typeof copy.cards].benefit}
                </p>
                <div className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {getDuration(formation)}
                </div>
                <span className="text-sm font-semibold text-primary">
                  {copy.cards[formation.id as keyof typeof copy.cards].cta} →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <ScrollReveal direction="up">
            <Link
              to="/certification"
              onClick={() =>
                trackCtaClick({
                  ctaName: copy.premiumTitle,
                  ctaLocation: "home_featured_trainings",
                  destination: "/certification",
                })
              }
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 hover-lift"
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{copy.premiumTitle}</p>
              <h3 className="mb-3 font-heading text-2xl font-bold text-card-foreground">
                {activeLanguage === "fr"
                  ? "Certification IA appliquée aux métiers support et de gestion"
                  : "AI certification for support and management professions"}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">{copy.premiumDesc}</p>
              <span className="text-sm font-semibold text-primary">{copy.premiumCta} →</span>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.08} direction="up">
            <Link
              to="/seminaires"
              onClick={() =>
                trackCtaClick({
                  ctaName: copy.liveTitle,
                  ctaLocation: "home_featured_trainings",
                  destination: "/seminaires",
                })
              }
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 hover-lift"
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{copy.liveTitle}</p>
              <h3 className="mb-3 font-heading text-2xl font-bold text-card-foreground">
                {activeLanguage === "fr" ? "Tester l'offre avant de s'engager" : "Test the offer before committing"}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">{copy.liveDesc}</p>
              <span className="text-sm font-semibold text-primary">{copy.liveCta} →</span>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrainingsSection;
