import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Monitor, Users, Target, BookOpen, Award, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import { formations } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";

const getFormationDetails = (f: typeof formations[0]) => {
  const levelMap: Record<string, { objectives: string[]; prerequisites: string[]; modules: string[] }> = {
    "Débutant": {
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
    "Intermédiaire": {
      objectives: [
        "Approfondir vos compétences IA dans votre domaine métier",
        "Automatiser des processus complexes avec l'IA",
        "Analyser et interpréter des données avec des outils avancés",
        "Concevoir des workflows IA adaptés à votre organisation",
      ],
      prerequisites: ["Connaissances de base en IA ou formation débutant complétée", "Expérience dans le domaine métier concerné", "Ordinateur portable requis"],
      modules: [
        "Rappel et approfondissement des concepts IA",
        "Outils avancés et intégrations métier",
        "Projet pratique : cas d'entreprise réel",
        "Optimisation et bonnes pratiques",
      ],
    },
    "Avancé": {
      objectives: [
        "Devenir référent IA dans votre organisation",
        "Piloter des projets de transformation IA",
        "Évaluer et sélectionner les solutions IA adaptées",
        "Former et accompagner vos équipes sur l'IA",
      ],
      prerequisites: ["Formation intermédiaire complétée ou expérience équivalente", "Expérience significative dans le domaine métier", "Projet IA en cours ou planifié"],
      modules: [
        "Stratégie IA et vision d'ensemble",
        "Outils et plateformes IA avancés",
        "Gestion de projet IA et conduite du changement",
        "Projet final et soutenance",
      ],
    },
  };

  return levelMap[f.level] || levelMap["Débutant"];
};

const FormationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const formation = formations.find((f) => f.id === id);

  if (!formation) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-28 pb-16 text-center container mx-auto px-4">
            <h1 className="font-heading text-3xl font-bold mb-4">{t("formationDetail.notFound")}</h1>
            <Link to="/catalogue" className="text-primary hover:underline">{t("formationDetail.backToCatalogue")}</Link>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const details = getFormationDetails(formation);
  const relatedFormations = formations
    .filter((f) => f.metier === formation.metier && f.id !== formation.id)
    .slice(0, 3);

  const levelColors: Record<string, string> = {
    "Débutant": "bg-accent text-accent-foreground",
    "Intermédiaire": "bg-primary/10 text-primary",
    "Avancé": "bg-destructive/10 text-destructive",
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Header */}
        <section className="relative pt-28 pb-16 overflow-hidden bg-indigo-gradient">
          <div className="relative z-10 container mx-auto px-4 lg:px-8">
            <Link to="/catalogue" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-primary transition-colors" style={{ color: "hsl(210 20% 75%)" }}>
              <ArrowLeft size={16} /> {t("formationDetail.backToCatalogue")}
            </Link>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${levelColors[formation.level]}`}>{formation.level}</span>
              <span className="text-xs flex items-center gap-1" style={{ color: "hsl(210 20% 72%)" }}><Monitor size={14} />{formation.format}</span>
              <span className="text-xs flex items-center gap-1" style={{ color: "hsl(210 20% 72%)" }}><Clock size={14} />{formation.duration}</span>
            </div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: "hsl(0 0% 98%)" }}>
              {formation.title}
            </motion.h1>
            <p className="text-sm" style={{ color: "hsl(210 20% 72%)" }}>{formation.metier}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* Objectifs */}
                <ScrollReveal>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-3 text-card-foreground">
                      <Target size={22} className="text-primary" /> {t("formationDetail.objectives")}
                    </h2>
                    <ul className="space-y-3">
                      {details.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>

                {/* Modules */}
                <ScrollReveal delay={0.1}>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-3 text-card-foreground">
                      <BookOpen size={22} className="text-primary" /> {t("formationDetail.program")}
                    </h2>
                    <div className="space-y-4">
                      {details.modules.map((mod, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                          <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                          <span className="text-sm font-medium text-card-foreground">{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Prérequis */}
                <ScrollReveal delay={0.2}>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-3 text-card-foreground">
                      <Users size={22} className="text-primary" /> {t("formationDetail.prerequisites")}
                    </h2>
                    <ul className="space-y-2">
                      {details.prerequisites.map((pre, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {pre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>

                {/* Certification */}
                <ScrollReveal delay={0.3}>
                  <div className="bg-card border border-border rounded-xl p-8">
                    <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-3 text-card-foreground">
                      <Award size={22} className="text-primary" /> {t("formationDetail.certification")}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t("formationDetail.certificationDesc")}</p>
                  </div>
                </ScrollReveal>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                  <div className="text-3xl font-bold text-card-foreground mb-1">{formation.price}</div>
                  <p className="text-xs text-muted-foreground mb-6">{t("formationDetail.perParticipant")}</p>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("formationDetail.durationLabel")}</span><span className="font-medium text-card-foreground">{formation.duration}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("formationDetail.formatLabel")}</span><span className="font-medium text-card-foreground">{formation.format}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("formationDetail.levelLabel")}</span><span className="font-medium text-card-foreground">{formation.level}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("formationDetail.locationLabel")}</span><span className="font-medium text-card-foreground">Abidjan, CI</span></div>
                  </div>

                  <Link to={`/inscription?formation=${encodeURIComponent(formation.title)}`} className="bg-orange-gradient font-semibold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity w-full block text-center" style={{ color: "hsl(0 0% 100%)" }}>
                    {t("formationDetail.enrollCta")}
                  </Link>
                  <Link to="/contact" className="mt-3 border border-border font-medium text-sm px-5 py-3 rounded-lg hover:bg-muted transition-colors w-full block text-center text-card-foreground">
                    {t("formationDetail.quoteCta")}
                  </Link>

                  <div className="flex flex-wrap gap-1.5 mt-6">
                    {formation.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Formations - Recommendations */}
            {relatedFormations.length > 0 && (
              <div className="max-w-6xl mx-auto mt-16">
                <h2 className="font-heading text-2xl font-bold mb-6 text-card-foreground">{t("formationDetail.relatedTitle")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedFormations.map((f) => (
                    <Link key={f.id} to={`/catalogue/${f.id}`} className="bg-card border border-border rounded-xl p-5 hover-lift flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[f.level]}`}>{f.level}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} />{f.duration}</span>
                      </div>
                      <h3 className="font-heading font-semibold text-sm mb-3 text-card-foreground flex-1">{f.title}</h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-semibold text-sm text-card-foreground">{f.price}</span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1">{t("catalogue.details")} <ChevronRight size={14} /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default FormationDetailPage;
