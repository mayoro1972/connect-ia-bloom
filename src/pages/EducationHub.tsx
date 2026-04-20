import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Layers,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { formations } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath } from "@/lib/site-links";

const educationCopy = {
  fr: {
    badge: "Education",
    title: "Choisissez le bon format pour apprendre l'IA",
    subtitle:
      "Allez directement vers le bon format selon votre métier, votre niveau et votre objectif.",
    architectureTitle: "Vos 4 points d'entrée",
    pillars: [
      {
        title: "Catalogue complet",
        desc: "Explorer toute l'offre et comparer rapidement les formations.",
        cta: "Explorer le catalogue",
        href: "/catalogue",
        icon: BookOpen,
      },
      {
        title: "Parcours guides",
        desc: "Être guidé vers le bon parcours selon son profil.",
        cta: "Voir les parcours",
        href: "/parcours",
        icon: Layers,
      },
      {
        title: "Certification",
        desc: "Choisir l'offre premium la plus structurante.",
        cta: "Découvrir la certification",
        href: "/certification",
        icon: Award,
      },
      {
        title: "Outils IA par domaine",
        desc: "Voir les outils et workflows utiles avant de choisir.",
        cta: "Voir les outils IA",
        href: "/outils-ia",
        icon: Workflow,
      },
    ],
    statsTitle: "En bref",
    stats: [
      { value: `${formations.length}+`, label: "formations disponibles" },
      { value: "13", label: "domaines d'expertise" },
      { value: "3", label: "niveaux de progression" },
      { value: "1", label: "certification signature" },
    ],
    pathwaysTitle: "Choisissez votre prochain pas",
    pathways: [
      {
        title: "Je veux voir toutes les formations",
        desc: "Comparer l'offre complète par domaine, niveau et format.",
        cta: "Aller au catalogue",
        href: "/catalogue",
      },
      {
        title: "Je veux être orienté",
        desc: "Recevoir une recommandation claire selon mon profil.",
        cta: "Demander une orientation",
        href: "/contact",
      },
      {
        title: "Je suis prêt à candidater",
        desc: "Passer à l'action et avancer vers l'inscription.",
        cta: "Déposer ma candidature",
        href: "/inscription",
      },
      {
        title: "Je veux tester avant de m'engager",
        desc: "Commencer par un séminaire, webinar ou replay.",
        cta: "Voir les formats live",
        href: "/seminaires",
      },
    ],
    audienceTitle: "Pour qui sont faites nos formations",
    audiences: [
      "Professionnels en activité qui veulent gagner du temps, mieux produire et mieux s'organiser",
      "Managers et dirigeants qui veulent comprendre l'IA sans jargon technique",
      "Entrepreneurs qui veulent vendre, communiquer et automatiser plus efficacement",
      "Étudiants, jeunes diplômés et profils en reconversion qui veulent renforcer leur employabilité",
    ],
    finalCtaTitle: "Passez à l'action",
    finalCtaDesc:
      "Nous pouvons vous orienter vers le bon format ou vous aider à candidater rapidement.",
    finalCtaPrimary: "Déposer ma candidature",
    finalCtaSecondary: "Demander une orientation",
  },
  en: {
    badge: "Education",
    title: "Choose the right format to learn AI",
    subtitle:
      "Move directly toward the right format based on your role, level, and learning objective.",
    architectureTitle: "Your 4 entry points",
    pillars: [
      {
        title: "Full catalogue",
        desc: "Explore the full offer and compare training options quickly.",
        cta: "Explore catalogue",
        href: "/catalogue",
        icon: BookOpen,
      },
      {
        title: "Guided paths",
        desc: "Get guided toward the right path for your profile.",
        cta: "View learning paths",
        href: "/parcours",
        icon: Layers,
      },
      {
        title: "Certification",
        desc: "Choose the most structured premium offer.",
        cta: "Discover certification",
        href: "/certification",
        icon: Award,
      },
      {
        title: "AI tools by domain",
        desc: "Review useful tools and workflows before choosing.",
        cta: "View AI tools",
        href: "/outils-ia",
        icon: Workflow,
      },
    ],
    statsTitle: "At a glance",
    stats: [
      { value: `${formations.length}+`, label: "available courses" },
      { value: "13", label: "areas of expertise" },
      { value: "3", label: "progression levels" },
      { value: "1", label: "signature certification" },
    ],
    pathwaysTitle: "Choose your next step",
    pathways: [
      {
        title: "I want to see all training options",
        desc: "Compare the full offer by domain, level, and format.",
        cta: "Open catalogue",
        href: "/catalogue",
      },
      {
        title: "I want guidance",
        desc: "Receive a clear recommendation based on my profile.",
        cta: "Request guidance",
        href: "/contact",
      },
      {
        title: "I am ready to apply",
        desc: "Take action and move toward registration.",
        cta: "Apply now",
        href: "/inscription",
      },
      {
        title: "I want to test before committing",
        desc: "Start with a seminar, webinar, or replay.",
        cta: "View live formats",
        href: "/seminaires",
      },
    ],
    audienceTitle: "Who our training is for",
    audiences: [
      "Working professionals who want to save time, produce better and get organized",
      "Managers and executives who want to understand AI without technical jargon",
      "Entrepreneurs who want to sell, communicate and automate more effectively",
      "Students, recent graduates and career switchers who want to improve employability",
    ],
    finalCtaTitle: "Take the next step",
    finalCtaDesc:
      "We can guide you toward the right format or help you apply quickly.",
    finalCtaPrimary: "Apply now",
    finalCtaSecondary: "Request guidance",
  },
} as const;

const EducationHub = () => {
  const { language } = useLanguage();
  const copy = educationCopy[language === "en" ? "en" : "fr"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 rounded-3xl border border-border bg-card p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.statsTitle}</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {copy.stats.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border bg-background p-4">
                      <p className="font-heading text-3xl font-bold text-card-foreground">{item.value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
            </div>

            <div className="mb-14">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-8">{copy.architectureTitle}</h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {copy.pillars.map((pillar, index) => {
                  const Icon = pillar.icon;
                  return (
                    <motion.div
                      key={pillar.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="flex h-full min-h-[280px] flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon size={22} className="text-primary" />
                      </div>
                      <h3 className="mb-3 font-heading text-xl font-bold text-card-foreground">{pillar.title}</h3>
                      <p className="mb-5 flex-1 text-sm leading-6 text-muted-foreground">{pillar.desc}</p>
                      <Link to={pillar.href} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
                        {pillar.cta} <ArrowRight size={15} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-14 rounded-3xl border border-border bg-card p-8">
              <h2 className="font-heading text-2xl font-bold text-card-foreground mb-8">{copy.pathwaysTitle}</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {copy.pathways.map((path) => (
                  <div key={path.title} className="flex h-full min-h-[230px] flex-col rounded-2xl border border-border bg-background p-5">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground">{path.title}</h3>
                    <p className="mt-2 mb-4 flex-1 text-sm leading-6 text-muted-foreground">{path.desc}</p>
                    <Link to={path.href} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
                      {path.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-[linear-gradient(135deg,hsl(225_48%_14%),hsl(226_40%_10%))] p-8 text-center md:p-12">
              <h3 className="mb-4 font-heading text-3xl font-bold text-white">{copy.finalCtaTitle}</h3>
              <p className="mx-auto mb-8 max-w-3xl text-sm leading-7 text-white/75">{copy.finalCtaDesc}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {copy.finalCtaPrimary} <ArrowRight size={16} />
                </Link>
                <Link
                  to={buildContactPath("demande-renseignement")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
                >
                  {copy.finalCtaSecondary}
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

export default EducationHub;
