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
    title: "Choisissez le bon format pour apprendre l'IA sans vous disperser",
    subtitle:
      "TransferAI Africa vous aide a aller directement vers le bon format selon votre metier, votre niveau, votre besoin et votre rythme d'apprentissage.",
    architectureTitle: "Choisissez votre format d'entree",
    pillars: [
      {
        title: "Catalogue complet",
        desc: "Pour explorer l'ensemble de l'offre, comparer les formations par domaine, niveau et format, puis identifier rapidement les options les plus pertinentes.",
        cta: "Explorer le catalogue",
        href: "/catalogue",
        icon: BookOpen,
      },
      {
        title: "Parcours guides",
        desc: "Pour les visiteurs qui veulent être orientés selon leur métier, leur niveau ou leur objectif professionnel au lieu de naviguer seuls.",
        cta: "Voir les parcours",
        href: "/parcours",
        icon: Layers,
      },
      {
        title: "Certification",
        desc: "Pour celles et ceux qui veulent une offre premium, professionnalisante et visible sur le marché.",
        cta: "Découvrir la certification",
        href: "/certification",
        icon: Award,
      },
      {
        title: "Outils IA par domaine",
        desc: "Pour voir les outils, workflows et stacks à maîtriser selon votre fonction avant de choisir une formation.",
        cta: "Voir les outils IA",
        href: "/outils-ia",
        icon: Workflow,
      },
    ],
    statsTitle: "Ce que vous trouvez ici en un coup d'oeil",
    stats: [
      { value: `${formations.length}+`, label: "formations disponibles" },
      { value: "13", label: "domaines d'expertise" },
      { value: "3", label: "niveaux de progression" },
      { value: "1", label: "certification signature" },
    ],
    pathwaysTitle: "Le bon prochain pas dépend de votre profil",
    pathways: [
      {
        title: "Je veux voir toutes les formations",
        desc: "J'explore l'offre complète pour comparer les contenus, les formats et les domaines couverts.",
        cta: "Aller au catalogue",
        href: "/catalogue",
      },
      {
        title: "Je veux être orienté",
        desc: "Je préfère être guidé vers le bon parcours selon mon métier, mon niveau ou mon objectif.",
        cta: "Demander une orientation",
        href: buildContactPath("demande-renseignement"),
      },
      {
        title: "Je suis prêt à candidater",
        desc: "Je veux passer à l'action, déposer ma candidature et avancer vers une inscription.",
        cta: "Déposer ma candidature",
        href: "/inscription",
      },
      {
        title: "Je veux tester avant de m'engager",
        desc: "Je commence par un séminaire, un webinar ou un replay pour découvrir l'approche TransferAI Africa.",
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
    finalCtaTitle: "Passez de l'interet a l'action",
    finalCtaDesc:
      "Que vous vouliez explorer, etre guidé, rejoindre un format live ou déposer votre candidature, nous pouvons vous orienter vers le bon prochain pas.",
    finalCtaPrimary: "Deposer ma candidature",
    finalCtaSecondary: "Demander une orientation",
  },
  en: {
    badge: "Education",
    title: "Choose the right format to learn AI without getting lost",
    subtitle:
      "TransferAI Africa helps you move directly toward the right format based on your role, level, business need, and preferred learning pace.",
    architectureTitle: "Choose your entry format",
    pillars: [
      {
        title: "Full catalogue",
        desc: "Explore the full offer by domain, level and format to identify the most relevant training options.",
        cta: "Explore catalogue",
        href: "/catalogue",
        icon: BookOpen,
      },
      {
        title: "Guided paths",
        desc: "Get oriented based on your profession, level and learning objective instead of navigating alone.",
        cta: "View learning paths",
        href: "/parcours",
        icon: Layers,
      },
      {
        title: "Certification",
        desc: "For learners looking for a premium, professionalizing offer with stronger market visibility.",
        cta: "Discover certification",
        href: "/certification",
        icon: Award,
      },
      {
        title: "AI tools by domain",
        desc: "Review the tools, workflows, and stacks to master by role before choosing a training format.",
        cta: "View AI tools",
        href: "/outils-ia",
        icon: Workflow,
      },
    ],
    statsTitle: "What you can grasp at a glance",
    stats: [
      { value: `${formations.length}+`, label: "available courses" },
      { value: "13", label: "areas of expertise" },
      { value: "3", label: "progression levels" },
      { value: "1", label: "signature certification" },
    ],
    pathwaysTitle: "The right next step depends on your profile",
    pathways: [
      {
        title: "I want to see all training options",
        desc: "I want to explore the full offer and compare the available content, formats and domains.",
        cta: "Open catalogue",
        href: "/catalogue",
      },
      {
        title: "I want guidance",
        desc: "I prefer to be guided toward the right path based on my role, level or objective.",
        cta: "Request guidance",
        href: buildContactPath("demande-renseignement"),
      },
      {
        title: "I am ready to apply",
        desc: "I want to take action, submit my application and move toward registration.",
        cta: "Apply now",
        href: "/inscription",
      },
      {
        title: "I want to test before committing",
        desc: "I want to begin with a seminar, webinar or replay before committing further.",
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
    finalCtaTitle: "Move from interest to action",
    finalCtaDesc:
      "Whether you want to explore, get guided, join a live format or submit your application, we can help you choose the right next step.",
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
            <div className="mb-16 rounded-3xl border border-border bg-card p-8">
                <h2 className="font-heading text-2xl font-bold text-card-foreground mb-6">{copy.statsTitle}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {copy.stats.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border bg-background p-5">
                      <p className="font-heading text-4xl font-bold text-card-foreground">{item.value}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
            </div>

            <div className="mb-16">
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
                      className="flex h-full min-h-[332px] flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon size={22} className="text-primary" />
                      </div>
                      <h3 className="mb-3 font-heading text-xl font-bold text-card-foreground">{pillar.title}</h3>
                      <p className="mb-5 flex-1 text-sm leading-7 text-muted-foreground">{pillar.desc}</p>
                      <Link to={pillar.href} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
                        {pillar.cta} <ArrowRight size={15} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-16 rounded-3xl border border-border bg-card p-8">
              <h2 className="font-heading text-2xl font-bold text-card-foreground mb-8">{copy.pathwaysTitle}</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {copy.pathways.map((path) => (
                  <div key={path.title} className="flex h-full min-h-[280px] flex-col rounded-2xl border border-border bg-background p-5">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground">{path.title}</h3>
                    <p className="mt-2 mb-4 flex-1 text-sm leading-7 text-muted-foreground">{path.desc}</p>
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
