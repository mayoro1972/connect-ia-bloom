import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Layers, TrendingUp, Award, Clock, BookOpen, CheckCircle2, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import { formations } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { useFormationLocale } from "@/hooks/useFormationLocale";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { buildContactPath } from "@/lib/site-links";
import { fixMojibake } from "@/lib/fixMojibake";

const levelIcons = {
  Débutant: Layers,
  Intermédiaire: TrendingUp,
  Avancé: Award,
};

const ParcoursPage = () => {
  const { t, language } = useLanguage();
  const { getTitle, getDuration, getPrice } = useFormationLocale();
  const trans = language === "fr" ? fr : en;
  const parcours = trans.parcours;
  const pageCopy = language === "fr"
    ? {
        title: "Des parcours guidés pour progresser en IA",
        subtitle:
          "Choisissez une trajectoire claire selon votre métier, votre niveau et votre objectif.",
        reassuranceTitle: "Pourquoi choisir un parcours",
        reassurancePoints: [
          "Vous progressez dans un ordre clair.",
          "Vous évitez les formations prises au hasard.",
          "Vous construisez des compétences cohérentes pour votre métier.",
          "Vous gagnez du temps dans votre montée en compétence.",
        ],
        howItWorks: "Comment fonctionne un parcours",
        steps: [
          {
            title: "Partir de votre niveau réel",
            desc: "Commencer au bon niveau pour éviter les bases inutiles ou les contenus trop avancés.",
          },
          {
            title: "Avancer dans le bon ordre",
            desc: "Chaque étape renforce la précédente pour créer une progression simple et cohérente.",
          },
          {
            title: "Renforcer vos usages métier",
            desc: "L'objectif est de mieux travailler, mieux décider et mieux produire dans votre fonction.",
          },
        ],
        pathsTitle: "Choisissez votre parcours par domaine",
        pathsDesc:
          "Chaque parcours regroupe des formations pensées pour un usage métier concret, du socle aux usages plus avancés.",
        outcomesTitle: "Ce qu'un parcours vous apporte réellement",
        outcomes: [
          "Une montée en compétence plus rapide",
          "Une meilleure compréhension des outils IA utiles",
          "Une progression cohérente dans votre métier",
          "Une capacité plus forte à appliquer l'IA au quotidien",
        ],
        ctaTitle: "Besoin d'aide pour choisir ?",
        ctaDesc:
          "Nous pouvons vous aider à identifier le bon parcours selon votre métier, votre niveau et votre objectif.",
        primaryCta: "Demander une orientation",
        secondaryCta: "Voir tout le catalogue",
      }
    : {
        title: "Guided paths to grow in AI",
        subtitle:
          "Choose a clear trajectory based on your role, level and objective.",
        reassuranceTitle: "Why choose a path",
        reassurancePoints: [
          "You progress in a clear order.",
          "You avoid taking training in the wrong sequence.",
          "You build coherent skills for your role.",
          "You save time in your upskilling journey.",
        ],
        howItWorks: "How a path works",
        steps: [
          {
            title: "Start from your real level",
            desc: "Start at the right level to avoid unnecessary basics or content that is too advanced too early.",
          },
          {
            title: "Move forward in the right order",
            desc: "Each step reinforces the previous one so your progression stays simple and coherent.",
          },
          {
            title: "Strengthen role-based use cases",
            desc: "The goal is to work better, decide better and produce better in your role.",
          },
        ],
        pathsTitle: "Choose your path by domain",
        pathsDesc:
          "Each path brings together training designed for a concrete professional use case, from fundamentals to more advanced use.",
        outcomesTitle: "What a path really gives you",
        outcomes: [
          "Faster upskilling",
          "A better grasp of useful AI tools",
          "A coherent progression in your role",
          "A stronger ability to apply AI in daily work",
        ],
        ctaTitle: "Need help choosing?",
        ctaDesc:
          "We can help you identify the right learning path based on your role, level and objective.",
        primaryCta: "Request guidance",
        secondaryCta: "View full catalogue",
      };

  const metierParcours = parcours.paths.map((path) => {
    const metierFormations = formations.filter((formation) => fixMojibake(formation.metier) === path.metierKey);

    return {
      ...path,
      levels: [
        {
          level: "Débutant" as const,
          formations: metierFormations.filter((formation) => formation.level === "Débutant"),
        },
        {
          level: "Intermédiaire" as const,
          formations: metierFormations.filter((formation) => formation.level === "Intermédiaire"),
        },
        {
          level: "Avancé" as const,
          formations: metierFormations.filter((formation) => formation.level === "Avancé"),
        },
      ],
    };
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={pageCopy.title} subtitle={pageCopy.subtitle} badge="Parcours" />

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              <div className="bg-card border border-border rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 size={22} className="text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{pageCopy.reassuranceTitle}</h2>
                </div>
                <div className="space-y-4">
                  {pageCopy.reassurancePoints.map((point) => (
                    <div key={point} className="rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Compass size={22} className="text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{pageCopy.howItWorks}</h2>
                </div>
                <div className="space-y-4">
                  {pageCopy.steps.map((step, index) => {
                    const Icon = [Layers, TrendingUp, Award][index];

                    return (
                      <div key={step.title} className="rounded-2xl border border-border bg-background p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-base text-card-foreground mb-1">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="max-w-3xl mb-10">
              <h2 className="font-heading text-3xl font-bold text-card-foreground mb-3">{pageCopy.pathsTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{pageCopy.pathsDesc}</p>
            </div>
            <div className="space-y-12">
              {metierParcours.map((path, pathIndex) => (
                <ScrollReveal key={path.title} delay={pathIndex * 0.05}>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-card-foreground">{path.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{path.desc}</p>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                        <BookOpen size={14} />
                        {path.levels.reduce((total, levelGroup) => total + levelGroup.formations.length, 0)} {t("parcours.coursesLabel")}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {path.levels.map((levelGroup) => {
                        if (levelGroup.formations.length === 0) {
                          return null;
                        }

                        const Icon = levelIcons[levelGroup.level];

                        return (
                          <div key={levelGroup.level}>
                            <div className="flex items-center gap-2 mb-3">
                              <Icon size={16} className="text-primary" />
                              <span className="font-semibold text-sm text-card-foreground">
                                {t(`parcours.levels.${levelGroup.level}`) || levelGroup.level}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({levelGroup.formations.length} {t("parcours.coursesLabel")})
                              </span>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {levelGroup.formations.slice(0, 3).map((formation) => (
                                <Link
                                  key={formation.id}
                                  to={`/catalogue/${formation.id}`}
                                  className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors group"
                                >
                                  <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                                    {getTitle(formation)}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {getDuration(formation)}
                                    </span>
                                    <span>{getPrice(formation)}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6">
                      <Link
                        to={buildContactPath("demande-renseignement")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
                      >
                        {language === "fr" ? "Être orienté sur ce parcours" : "Get guidance for this path"} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl mb-12">
            <div className="bg-card border border-border rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-bold text-card-foreground mb-6">{pageCopy.outcomesTitle}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pageCopy.outcomes.map((outcome) => (
                  <div key={outcome} className="rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
                    {outcome}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">{pageCopy.ctaTitle}</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{pageCopy.ctaDesc}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to={buildContactPath("demande-renseignement")}
                className="bg-orange-gradient font-semibold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                style={{ color: "hsl(0 0% 100%)" }}
              >
                {pageCopy.primaryCta} <ArrowRight size={16} />
              </Link>
              <Link
                to="/catalogue"
                className="border border-border font-medium text-sm px-6 py-3 rounded-lg hover:bg-muted transition-colors text-card-foreground"
              >
                {pageCopy.secondaryCta}
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ParcoursPage;
