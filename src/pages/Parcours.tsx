import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Layers, TrendingUp, Award, Clock, BookOpen } from "lucide-react";
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
        <PageHeader title={parcours.title} subtitle={parcours.subtitle} />

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <h2 className="font-heading text-2xl font-bold text-center mb-8">{parcours.howItWorks}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {parcours.steps.map((step, index) => {
                const Icon = [Layers, TrendingUp, Award][index];

                return (
                  <ScrollReveal key={step.title} delay={index * 0.1}>
                    <div className="bg-card border border-border rounded-xl p-6 text-center hover-lift">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon size={24} className="text-primary" />
                      </div>
                      <h3 className="font-heading font-bold text-lg mb-2 text-card-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
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
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">{parcours.ctaTitle}</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{parcours.ctaDesc}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to={buildContactPath("demande-renseignement")}
                className="bg-orange-gradient font-semibold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                style={{ color: "hsl(0 0% 100%)" }}
              >
                {t("nav.cta")} <ArrowRight size={16} />
              </Link>
              <Link
                to="/catalogue"
                className="border border-border font-medium text-sm px-6 py-3 rounded-lg hover:bg-muted transition-colors text-card-foreground"
              >
                {t("metiers.cta")}
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
