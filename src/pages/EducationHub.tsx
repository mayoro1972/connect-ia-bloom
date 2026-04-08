import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Layers,
  Sparkles,
  Users,
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
    title: "Formez-vous a l'IA avec des parcours concrets, utiles et accessibles",
    subtitle:
      "Que vous soyez professionnel, manager, entrepreneur, etudiant ou en reconversion, TransferAI Africa vous aide a choisir la bonne formation IA selon votre metier, votre niveau et vos objectifs.",
    diagnosisTitle: "Une offre de formation pensée pour les réalités du terrain",
    diagnosisPoints: [
      "Nos formations sont conçues pour être utiles dans le travail quotidien, pas pour ajouter du jargon inutile.",
      "Chaque parcours est pensé pour aider l'apprenant à comprendre, pratiquer et appliquer rapidement l'IA.",
      "Les contenus s'appuient sur des cas d'usage concrets liés à la Côte d'Ivoire, à l'Afrique francophone et aux métiers support.",
      "L'objectif n'est pas seulement d'apprendre l'IA, mais de mieux travailler, mieux décider et mieux se positionner sur le marché.",
    ],
    cleanupTitle: "Ce que vous pouvez réellement obtenir",
    cleanupPoints: [
      "Une meilleure maîtrise des outils IA utiles dans votre métier",
      "Des méthodes concrètes pour gagner du temps et automatiser certaines tâches",
      "Une capacité à rédiger, synthétiser, analyser et produire plus efficacement",
      "Une montée en compétence visible, valorisable et directement applicable",
    ],
    architectureTitle: "Comment choisir la bonne formation",
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
        title: "Formats live",
        desc: "Pour commencer par un séminaire, un webinar ou un replay avant de s'engager sur une formation plus structurée.",
        cta: "Voir les formats live",
        href: "/seminaires",
        icon: CalendarDays,
      },
    ],
    commercialTitle: "Nos formats de formation",
    commercialCards: [
      {
        title: "Formations catalogue",
        desc: "Des formations ciblées pour monter rapidement en compétence sur un sujet, un métier ou un usage IA précis.",
      },
      {
        title: "Parcours progressifs",
        desc: "Des chemins d'apprentissage structurés pour accompagner une progression claire, du niveau débutant au niveau plus avancé.",
      },
      {
        title: "Formats live & certification",
        desc: "Des séminaires, webinars, replays et une certification professionnelle pour accélérer l'apprentissage et renforcer la crédibilité du profil.",
      },
    ],
    whyItConvertsTitle: "Pourquoi choisir TransferAI Africa",
    whyItConverts: [
      "Une pédagogie orientée pratique, résultats et application immédiate",
      "Des contenus pensés pour l'Afrique, la Côte d'Ivoire et les réalités du terrain",
      "Des cas d'usage dans 13 domaines d'expertise",
      "Une approche simple, claire et professionnelle pour rassurer les apprenants",
      "Un pont entre formation, veille, certification et opportunités",
    ],
    statsTitle: "Ce que le visiteur doit comprendre en 10 secondes",
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
    title: "Train in AI through concrete, useful and accessible learning paths",
    subtitle:
      "Whether you are a working professional, manager, entrepreneur, student or career switcher, TransferAI Africa helps you choose the right AI training path based on your role, level and goals.",
    diagnosisTitle: "A training offer built for real-world use",
    diagnosisPoints: [
      "Our training is designed to be useful in day-to-day work, not to add more unnecessary jargon.",
      "Each learning path is built to help learners understand, practice and apply AI quickly.",
      "The content is grounded in concrete use cases relevant to Côte d'Ivoire, francophone Africa and support functions.",
      "The goal is not only to learn AI, but to work better, decide better and position yourself better on the market.",
    ],
    cleanupTitle: "What you can actually gain",
    cleanupPoints: [
      "A stronger command of AI tools that are relevant to your role",
      "Practical methods to save time and automate selected tasks",
      "The ability to write, summarize, analyze and produce work more efficiently",
      "Visible, valuable skills that can be applied immediately",
    ],
    architectureTitle: "How to choose the right training path",
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
        title: "Live formats",
        desc: "Start with a seminar, webinar or replay before committing to a more structured training path.",
        cta: "View live formats",
        href: "/seminaires",
        icon: CalendarDays,
      },
    ],
    commercialTitle: "Our training formats",
    commercialCards: [
      {
        title: "Catalogue training",
        desc: "Focused training programs to build capability quickly on a topic, profession or specific AI use case.",
      },
      {
        title: "Progressive paths",
        desc: "Structured learning journeys that support a clear progression from beginner level to more advanced capability.",
      },
      {
        title: "Live formats & certification",
        desc: "Seminars, webinars, replays and one professional certification to accelerate learning and strengthen profile credibility.",
      },
    ],
    whyItConvertsTitle: "Why choose TransferAI Africa",
    whyItConverts: [
      "A teaching approach focused on practice, outcomes and immediate application",
      "Content designed for Africa, Côte d'Ivoire and real operational contexts",
      "Use cases across 13 areas of expertise",
      "A simple, clear and professional learning experience",
      "A bridge between training, watch content, certification and opportunities",
    ],
    statsTitle: "What visitors should understand in 10 seconds",
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
            <div className="grid gap-10 xl:grid-cols-[1fr_0.95fr] mb-16">
              <div className="rounded-3xl border border-border bg-card p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles size={24} className="text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.diagnosisTitle}</h2>
                </div>
                <div className="space-y-4">
                  {copy.diagnosisPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                      <p className="text-sm leading-7 text-card-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-8">
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
            </div>

            <div className="mb-16 rounded-3xl border border-border bg-card p-8">
              <h2 className="font-heading text-2xl font-bold text-card-foreground mb-6">{copy.cleanupTitle}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {copy.cleanupPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-sm leading-7 text-card-foreground">{item}</p>
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
                      className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon size={22} className="text-primary" />
                      </div>
                      <h3 className="mb-3 font-heading text-xl font-bold text-card-foreground">{pillar.title}</h3>
                      <p className="mb-5 text-sm leading-7 text-muted-foreground">{pillar.desc}</p>
                      <Link to={pillar.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
                        {pillar.cta} <ArrowRight size={15} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="font-heading text-2xl font-bold text-card-foreground mb-6">{copy.commercialTitle}</h2>
                <div className="space-y-4">
                  {copy.commercialCards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-border bg-background p-5">
                      <h3 className="font-heading text-lg font-semibold text-card-foreground">{card.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="font-heading text-2xl font-bold text-card-foreground mb-6">{copy.whyItConvertsTitle}</h2>
                <div className="space-y-4">
                  {copy.whyItConverts.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                      <GraduationCap size={18} className="mt-0.5 shrink-0 text-primary" />
                      <p className="text-sm leading-7 text-card-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-16 rounded-3xl border border-border bg-card p-8">
              <h2 className="font-heading text-2xl font-bold text-card-foreground mb-8">{copy.pathwaysTitle}</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {copy.pathways.map((path) => (
                  <div key={path.title} className="rounded-2xl border border-border bg-background p-5">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground">{path.title}</h3>
                    <p className="mt-2 mb-4 text-sm leading-7 text-muted-foreground">{path.desc}</p>
                    <Link to={path.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
                      {path.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16 rounded-3xl border border-border bg-card p-8">
              <h2 className="font-heading text-2xl font-bold text-card-foreground mb-6">{copy.audienceTitle}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {copy.audiences.map((audience) => (
                  <div key={audience} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5">
                    <Users size={18} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-sm leading-7 text-card-foreground">{audience}</p>
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
