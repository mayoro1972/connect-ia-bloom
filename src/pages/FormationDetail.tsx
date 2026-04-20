import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Monitor, Users, Target, BookOpen, Award, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import { formations } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { useFormationLocale } from "@/hooks/useFormationLocale";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { buildContactPath } from "@/lib/site-links";
import { deepFixMojibake, fixMojibake } from "@/lib/fixMojibake";

const getFormationDetails = (formation: typeof formations[0], language: string) => {
  const levelMap: Record<
    string,
    Record<string, { objectives: string[]; prerequisites: string[]; modules: string[] }>
  > = {
    Débutant: {
      fr: {
        objectives: [
          "Comprendre les fondamentaux de l'IA appliquée à votre métier",
          "Maîtriser les outils IA de base (ChatGPT, Copilot, etc.)",
          "Réaliser des cas pratiques adaptés à votre contexte professionnel",
          "Gagner en productivité grâce à l'automatisation intelligente",
        ],
        prerequisites: ["Aucun prérequis technique", "Ordinateur portable recommandé", "Curiosité et motivation"],
        modules: [
          "Introduction à l'Intelligence Artificielle",
          "Prise en main des outils IA essentiels",
          "Cas pratiques et exercices guidés",
          "Plan d'action personnalisé",
        ],
      },
      en: {
        objectives: [
          "Understand the fundamentals of AI applied to your profession",
          "Master basic AI tools (ChatGPT, Copilot, etc.)",
          "Complete practical exercises tailored to your professional context",
          "Boost productivity through intelligent automation",
        ],
        prerequisites: ["No technical prerequisites", "Laptop recommended", "Curiosity and motivation"],
        modules: [
          "Introduction to Artificial Intelligence",
          "Getting started with essential AI tools",
          "Practical cases and guided exercises",
          "Personalized action plan",
        ],
      },
    },
    Intermédiaire: {
      fr: {
        objectives: [
          "Approfondir vos compétences IA dans votre domaine métier",
          "Automatiser des processus complexes avec l'IA",
          "Analyser et interpréter des données avec des outils avancés",
          "Concevoir des workflows IA adaptés à votre organisation",
        ],
        prerequisites: [
          "Connaissances de base en IA ou formation débutant complétée",
          "Expérience dans le domaine métier concerné",
          "Ordinateur portable requis",
        ],
        modules: [
          "Rappel et approfondissement des concepts IA",
          "Outils avancés et intégrations métier",
          "Projet pratique : cas d'entreprise réel",
          "Optimisation et bonnes pratiques",
        ],
      },
      en: {
        objectives: [
          "Deepen your AI skills in your professional domain",
          "Automate complex processes with AI",
          "Analyze and interpret data with advanced tools",
          "Design AI workflows tailored to your organization",
        ],
        prerequisites: [
          "Basic AI knowledge or beginner training completed",
          "Experience in the relevant professional field",
          "Laptop required",
        ],
        modules: [
          "Review and deepening of AI concepts",
          "Advanced tools and business integrations",
          "Practical project: real business case",
          "Optimization and best practices",
        ],
      },
    },
    Avancé: {
      fr: {
        objectives: [
          "Devenir référent IA dans votre organisation",
          "Piloter des projets de transformation IA",
          "Évaluer et sélectionner les solutions IA adaptées",
          "Former et accompagner vos équipes sur l'IA",
        ],
        prerequisites: [
          "Formation intermédiaire complétée ou expérience équivalente",
          "Expérience significative dans le domaine métier",
          "Projet IA en cours ou planifié",
        ],
        modules: [
          "Stratégie IA et vision d'ensemble",
          "Outils et plateformes IA avancés",
          "Gestion de projet IA et conduite du changement",
          "Projet final et soutenance",
        ],
      },
      en: {
        objectives: [
          "Become an AI reference in your organization",
          "Lead AI transformation projects",
          "Evaluate and select appropriate AI solutions",
          "Train and support your teams on AI",
        ],
        prerequisites: [
          "Intermediate training completed or equivalent experience",
          "Significant experience in the professional field",
          "Ongoing or planned AI project",
        ],
        modules: [
          "AI strategy and big picture overview",
          "Advanced AI tools and platforms",
          "AI project management and change management",
          "Final project and presentation",
        ],
      },
    },
  };

  const normalizedLanguage = language === "en" ? "en" : "fr";

  return levelMap[formation.level]?.[normalizedLanguage] || levelMap.Débutant[normalizedLanguage];
};

const detailPageCopy = {
  fr: {
    heroTagline: "Une formation pensée pour transformer rapidement vos usages métier avec l'IA.",
    audienceTitle: "Pour qui cette formation est faite",
    valueTitle: "Ce que vous allez concrètement obtenir",
    audienceByLevel: {
      Débutant: [
        "Professionnels qui commencent avec l'IA et veulent un cadre simple.",
        "Equipes qui veulent acquérir des bases utiles sans jargon technique.",
        "Profils qui veulent gagner du temps rapidement dans leur travail quotidien.",
      ],
      Intermédiaire: [
        "Professionnels qui utilisent déjà des outils IA et veulent aller plus loin.",
        "Equipes qui souhaitent structurer des usages métier plus avancés.",
        "Profils qui veulent transformer l'IA en avantage concret dans leur fonction.",
      ],
      Avancé: [
        "Managers, référents et porteurs de projets qui doivent piloter l'usage de l'IA.",
        "Profils en charge de déployer, cadrer ou faire évoluer des initiatives IA.",
        "Professionnels qui veulent devenir un point de référence sur ces sujets.",
      ],
    },
    valueByLevel: {
      Débutant: [
        "Une meilleure maîtrise des outils IA essentiels.",
        "Des méthodes directement applicables à votre métier.",
        "Des gains de temps sur les tâches répétitives.",
        "Une première autonomie d'usage dans votre quotidien professionnel.",
      ],
      Intermédiaire: [
        "Une montée en compétence plus structurée sur vos cas d'usage métier.",
        "Une meilleure capacité à automatiser, analyser et produire avec l'IA.",
        "Des usages plus avancés et mieux intégrés à vos workflows.",
        "Une meilleure valeur professionnelle sur votre poste ou votre marché.",
      ],
      Avancé: [
        "Une vision plus forte pour cadrer et piloter des usages IA.",
        "Une meilleure capacité à arbitrer, prioriser et accompagner les équipes.",
        "Des livrables et décisions plus solides grâce à l'IA.",
        "Un positionnement plus stratégique dans votre organisation.",
      ],
    },
    decisionTitle: "Pourquoi choisir cette formation",
    decisionPoints: [
      "Contenu concret, orienté métier et immédiatement applicable.",
      "Prix communiqué sur demande selon le format retenu.",
      "Réponse sous 24h après votre demande d'inscription ou de devis.",
      "Orientation possible si une autre formation vous correspond mieux.",
    ],
    sidebarNote:
      "Vous hésitez entre plusieurs formations ? Notre équipe peut vous aider à confirmer si celle-ci est bien le bon choix avant validation finale.",
    compareTitle: "Vous hésitez encore ?",
    compareText:
      "Nous pouvons vous aider à confirmer si cette formation est la plus adaptée à votre niveau, votre métier et votre objectif.",
    compareCta: "Demander une orientation",
  },
  en: {
    heroTagline: "A course designed to quickly transform how you use AI in your profession.",
    audienceTitle: "Who this course is for",
    valueTitle: "What you will concretely gain",
    audienceByLevel: {
      Débutant: [
        "Professionals starting with AI who want a simple and practical framework.",
        "Teams who want useful foundations without technical jargon.",
        "Profiles who want to save time quickly in their daily work.",
      ],
      Intermédiaire: [
        "Professionals already using AI tools who want to go further.",
        "Teams that want to structure more advanced business uses.",
        "Profiles who want to turn AI into a concrete advantage in their role.",
      ],
      Avancé: [
        "Managers, leads, and project owners who must guide AI adoption.",
        "Profiles responsible for deploying, framing, or evolving AI initiatives.",
        "Professionals who want to become a trusted reference on these topics.",
      ],
    },
    valueByLevel: {
      Débutant: [
        "A stronger command of essential AI tools.",
        "Methods you can directly apply to your profession.",
        "Time savings on repetitive tasks.",
        "A first level of working autonomy with AI.",
      ],
      Intermédiaire: [
        "A more structured skill progression on your business use cases.",
        "A stronger ability to automate, analyze, and produce with AI.",
        "More advanced uses better integrated into your workflows.",
        "Greater professional value in your role or market.",
      ],
      Avancé: [
        "A stronger perspective to frame and lead AI initiatives.",
        "A better ability to prioritize and support teams.",
        "Stronger outputs and decisions powered by AI.",
        "A more strategic positioning inside your organization.",
      ],
    },
    decisionTitle: "Why choose this course",
    decisionPoints: [
      "Concrete content, profession-focused and immediately applicable.",
      "Pricing shared on request depending on the chosen format.",
      "Response within 24 hours after your registration or quote request.",
      "Guidance available if another course is a better fit.",
    ],
    sidebarNote:
      "Hesitating between several courses? Our team can help you confirm whether this is the right choice before final validation.",
    compareTitle: "Still hesitating?",
    compareText:
      "We can help you confirm whether this course best matches your level, profession, and objective.",
    compareCta: "Request guidance",
  },
} as const;

const levelColors: Record<string, string> = {
  Débutant: "bg-accent text-accent-foreground",
  Intermédiaire: "bg-primary/10 text-primary",
  Avancé: "bg-destructive/10 text-destructive",
};

const FormationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { getTitle, getDuration, getLevel, getFormat, getPrice } = useFormationLocale();
  const formation = formations.find((item) => item.id === id);
  const locationLabel = language === "fr" ? "Abidjan, Côte d'Ivoire" : "Abidjan, Ivory Coast";

  if (!formation) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-28 pb-16 text-center container mx-auto px-4">
            <h1 className="font-heading text-3xl font-bold mb-4">{t("formationDetail.notFound")}</h1>
            <Link to="/catalogue" className="text-primary hover:underline">
              {t("formationDetail.backToCatalogue")}
            </Link>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const details = deepFixMojibake(getFormationDetails(formation, language));
  const copy = detailPageCopy[language === "en" ? "en" : "fr"];
  const formationLevel = fixMojibake(formation.level);
  const audienceList = copy.audienceByLevel[formationLevel] || copy.audienceByLevel.Débutant;
  const valueList = copy.valueByLevel[formationLevel] || copy.valueByLevel.Débutant;
  const relatedFormations = formations
    .filter((item) => item.metier === formation.metier && item.id !== formation.id)
    .slice(0, 3);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />

        <section className="relative pt-28 pb-16 overflow-hidden bg-indigo-gradient">
          <div className="relative z-10 container mx-auto px-4 lg:px-8">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 text-sm mb-6 hover:text-primary transition-colors"
              style={{ color: "hsl(210 20% 75%)" }}
            >
              <ArrowLeft size={16} /> {t("formationDetail.backToCatalogue")}
            </Link>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${levelColors[fixMojibake(formation.level)]}`}>
                {getLevel(formation)}
              </span>
              <span className="text-xs flex items-center gap-1" style={{ color: "hsl(210 20% 72%)" }}>
                <Monitor size={14} />
                {getFormat(formation)}
              </span>
              <span className="text-xs flex items-center gap-1" style={{ color: "hsl(210 20% 72%)" }}>
                <Clock size={14} />
                {getDuration(formation)}
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: "hsl(0 0% 98%)" }}
            >
              {getTitle(formation)}
            </motion.h1>
            <p className="text-base md:text-lg max-w-3xl mb-4" style={{ color: "hsl(210 20% 80%)" }}>
              {copy.heroTagline}
            </p>
            <p className="text-sm" style={{ color: "hsl(210 20% 72%)" }}>
              {t(`catalogue.domains.${fixMojibake(formation.metier)}`) || fixMojibake(formation.metier)}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
              <div className="lg:col-span-2 space-y-10">
                <ScrollReveal>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-xl p-8">
                      <h2 className="font-heading text-xl font-bold mb-5 text-card-foreground">{copy.audienceTitle}</h2>
                      <ul className="space-y-3">
                        {audienceList.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-8">
                      <h2 className="font-heading text-xl font-bold mb-5 text-card-foreground">{copy.valueTitle}</h2>
                      <ul className="space-y-3">
                        {valueList.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-3 text-card-foreground">
                      <Target size={22} className="text-primary" /> {t("formationDetail.objectives")}
                    </h2>
                    <ul className="space-y-3">
                      {details.objectives.map((objective, index) => (
                        <li key={objective} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                            {index + 1}
                          </span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-3 text-card-foreground">
                      <BookOpen size={22} className="text-primary" /> {t("formationDetail.program")}
                    </h2>
                    <div className="space-y-4">
                      {details.modules.map((module, index) => (
                        <div key={module} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                          <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-card-foreground">{module}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-3 text-card-foreground">
                      <Users size={22} className="text-primary" /> {t("formationDetail.prerequisites")}
                    </h2>
                    <ul className="space-y-2">
                      {details.prerequisites.map((prerequisite) => (
                        <li key={prerequisite} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {prerequisite}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-3 text-card-foreground">
                      <Award size={22} className="text-primary" /> {t("formationDetail.certification")}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t("formationDetail.certificationDesc")}</p>
                  </div>
                </ScrollReveal>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                  <div className="text-2xl font-bold text-card-foreground leading-tight mb-1">{getPrice(formation)}</div>
                  <p className="text-xs text-muted-foreground mb-6">{t("pricing.note")}</p>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("formationDetail.durationLabel")}</span>
                      <span className="font-medium text-card-foreground">{getDuration(formation)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("formationDetail.formatLabel")}</span>
                      <span className="font-medium text-card-foreground">{getFormat(formation)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("formationDetail.levelLabel")}</span>
                      <span className="font-medium text-card-foreground">{getLevel(formation)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("formationDetail.locationLabel")}</span>
                      <span className="font-medium text-card-foreground">{locationLabel}</span>
                    </div>
                  </div>

                  <Link
                    to={`/inscription?formation=${encodeURIComponent(formation.id)}`}
                    className="bg-orange-gradient font-semibold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity w-full block text-center"
                    style={{ color: "hsl(0 0% 100%)" }}
                  >
                    {t("formationDetail.enrollCta")}
                  </Link>
                  <Link
                    to={buildContactPath("contact-devis")}
                    className="mt-3 border border-border font-medium text-sm px-5 py-3 rounded-lg hover:bg-muted transition-colors w-full block text-center text-card-foreground"
                  >
                    {t("formationDetail.quoteCta")}
                  </Link>

                  <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
                    <h3 className="font-semibold text-sm text-card-foreground mb-3">{copy.decisionTitle}</h3>
                    <ul className="space-y-2">
                      {copy.decisionPoints.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.sidebarNote}</p>

                  <div className="flex flex-wrap gap-1.5 mt-6">
                    {formation.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {fixMojibake(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {relatedFormations.length > 0 && (
              <div className="max-w-6xl mx-auto mt-16">
                <h2 className="font-heading text-2xl font-bold mb-6 text-card-foreground">{t("formationDetail.relatedTitle")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedFormations.map((relatedFormation) => (
                    <Link
                      key={relatedFormation.id}
                      to={`/catalogue/${relatedFormation.id}`}
                      className="bg-card border border-border rounded-xl p-5 hover-lift flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            levelColors[fixMojibake(relatedFormation.level)]
                          }`}
                        >
                          {getLevel(relatedFormation)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {getDuration(relatedFormation)}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-sm mb-3 text-card-foreground flex-1">
                        {getTitle(relatedFormation)}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-semibold text-sm text-card-foreground">{getPrice(relatedFormation)}</span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1">
                          {t("catalogue.details")} <ChevronRight size={14} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="max-w-6xl mx-auto mt-16">
              <div className="bg-card border border-border rounded-xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-2xl">
                  <h2 className="font-heading text-2xl font-bold text-card-foreground mb-3">{copy.compareTitle}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{copy.compareText}</p>
                </div>
                <Link
                  to={buildContactPath("demande-renseignement")}
                  className="border border-border font-medium text-sm px-5 py-3 rounded-lg hover:bg-muted transition-colors text-center text-card-foreground whitespace-nowrap"
                >
                  {copy.compareCta}
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

export default FormationDetailPage;
