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
    badge: "Education IA",
    title: "Choisir la bonne formation IA devient simple",
    subtitle:
      "Une architecture claire pour découvrir les formations, choisir un parcours, rejoindre un format live et passer rapidement à l'inscription.",
    diagnosisTitle: "Diagnostic de l'onglet Education",
    diagnosisPoints: [
      "Le visiteur hésite entre catalogues, catalogue, parcours, séminaires et webinars sans savoir par où commencer.",
      "Le catalogue et les catalogues par domaine se concurrencent au lieu de jouer des rôles distincts.",
      "Les formats live sont séparés alors qu'ils répondent à la même intention : découvrir et s'inscrire rapidement.",
      "La promesse commerciale n'est pas assez explicite sur le résultat métier, le niveau et la prochaine étape.",
    ],
    cleanupTitle: "Nettoyage des doublons",
    cleanupPoints: [
      "Le menu principal ne garde que 4 portes d'entrée : catalogue, parcours, certification et formats live.",
      "Les catalogues par domaine sortent du menu principal et deviennent un outil de qualification après exploration d'un domaine.",
      "Les séminaires et les webinars sont regroupés sous une logique unique : formats live.",
      "Chaque rubrique doit mener soit à une candidature, soit à une demande d'orientation, soit à une inscription.",
    ],
    architectureTitle: "Nouvelle architecture recommandée",
    pillars: [
      {
        title: "Catalogue des formations",
        desc: "Pour les visiteurs qui veulent explorer l'offre complète, filtrer par domaine, niveau ou format, puis comparer rapidement les options.",
        cta: "Explorer le catalogue",
        href: "/catalogue",
        icon: BookOpen,
      },
      {
        title: "Parcours recommandés",
        desc: "Pour les visiteurs qui veulent être guidés selon leur niveau ou leur métier au lieu de comparer des dizaines de formations.",
        cta: "Voir les parcours",
        href: "/parcours",
        icon: Layers,
      },
      {
        title: "Certification signature",
        desc: "Pour les profils qui cherchent une offre premium, un positionnement fort et une inscription à forte valeur perçue.",
        cta: "Découvrir la certification",
        href: "/certification",
        icon: Award,
      },
      {
        title: "Formats live",
        desc: "Pour les prospects qui veulent un format court, événementiel ou découverte avant de s'engager sur une formation plus complète.",
        cta: "Voir les formats live",
        href: "/seminaires",
        icon: CalendarDays,
      },
    ],
    commercialTitle: "La proposition commerciale que je recommande",
    commercialCards: [
      {
        title: "Promesse principale",
        desc: "Apprendre l'IA par métier, avec des cas concrets pour l'Afrique francophone et une application immédiate dans le travail quotidien.",
      },
      {
        title: "Promesse de conversion",
        desc: "Aider chaque visiteur à trouver rapidement la bonne porte d'entrée : explorer, être orienté, rejoindre un format live ou déposer sa candidature.",
      },
      {
        title: "Promesse premium",
        desc: "Mettre en avant une certification signature et quelques formations phares comme produits d'appel à forte crédibilité.",
      },
    ],
    whyItConvertsTitle: "Ce qui attirera plus de candidatures et d'inscriptions",
    whyItConverts: [
      "Une navigation orientée décision, pas orientée inventaire",
      "Des CTA visibles vers la candidature, l'inscription et la prise de contact",
      "Des parcours métier qui rassurent les débutants et accélèrent le choix",
      "Des formats live qui servent d'entrée basse friction avant l'achat d'une formation",
      "Une page Education qui vend le bénéfice, pas seulement la liste des rubriques",
    ],
    statsTitle: "Ce que le visiteur doit comprendre en 10 secondes",
    stats: [
      { value: `${formations.length}+`, label: "formations disponibles" },
      { value: "13", label: "domaines d'expertise" },
      { value: "3", label: "niveaux de progression" },
      { value: "1", label: "certification signature" },
    ],
    pathwaysTitle: "Les 4 chemins d'entrée les plus efficaces",
    pathways: [
      {
        title: "Je découvre l'offre",
        desc: "Je veux voir toutes les formations et filtrer rapidement.",
        cta: "Aller au catalogue",
        href: "/catalogue",
      },
      {
        title: "Je veux être orienté",
        desc: "Je préfère un parcours recommandé selon mon niveau ou mon métier.",
        cta: "Voir les parcours",
        href: "/parcours",
      },
      {
        title: "Je cherche une offre premium",
        desc: "Je veux une certification forte, visible et professionnalisante.",
        cta: "Voir la certification",
        href: "/certification",
      },
      {
        title: "Je veux tester avant de m'engager",
        desc: "Je préfère commencer par un séminaire ou un webinar.",
        cta: "Voir les formats live",
        href: "/seminaires",
      },
    ],
    audienceTitle: "Publics à cibler plus clairement",
    audiences: [
      "Professionnels en activité qui veulent gagner du temps avec l'IA",
      "Managers et dirigeants qui veulent monter en compétence sans jargon technique",
      "Jeunes diplômés et talents en reconversion",
      "Entreprises qui veulent former plusieurs collaborateurs par métier",
    ],
    finalCtaTitle: "Le meilleur chemin commercial pour l'Education",
    finalCtaDesc:
      "Education doit devenir la partie la plus simple à acheter du site : une vue d'ensemble très claire, des portes d'entrée adaptées à chaque profil, une candidature simple et des inscriptions visibles sans effort.",
    finalCtaPrimary: "Deposer ma candidature",
    finalCtaSecondary: "Demander une orientation",
  },
  en: {
    badge: "AI Education",
    title: "Choosing the right AI training should feel simple",
    subtitle:
      "A clearer architecture to discover the offer, choose the right path, join a live format and move quickly to registration.",
    diagnosisTitle: "Diagnosis of the Education section",
    diagnosisPoints: [
      "Visitors have to choose between domain catalogues, catalogue, paths, seminars and webinars without a clear starting point.",
      "The full catalogue and domain catalogues overlap instead of playing distinct roles.",
      "Live formats are split apart even though they answer the same intent: discover and register quickly.",
      "The commercial promise is not explicit enough about business outcomes, learner level and next step.",
    ],
    cleanupTitle: "How to remove overlap",
    cleanupPoints: [
      "Keep only 4 entry points in the main menu: catalogue, paths, certification and live formats.",
      "Move domain catalogues out of the primary navigation and use them later as qualified lead tools.",
      "Bring seminars and webinars together under one clear promise: live formats.",
      "Each section should lead to either an application, an orientation request or a direct registration path.",
    ],
    architectureTitle: "Recommended new architecture",
    pillars: [
      {
        title: "Training catalogue",
        desc: "For visitors who want to explore the full offer, filter by domain and browse the available training topics.",
        cta: "Explore catalogue",
        href: "/catalogue",
        icon: BookOpen,
      },
      {
        title: "Recommended paths",
        desc: "For visitors who want guidance by level or profession instead of comparing dozens of courses on their own.",
        cta: "View learning paths",
        href: "/parcours",
        icon: Layers,
      },
      {
        title: "Signature certification",
        desc: "For learners looking for a premium offer, a stronger positioning and a higher-perceived-value enrollment path.",
        cta: "Discover certification",
        href: "/certification",
        icon: Award,
      },
      {
        title: "Live formats",
        desc: "For prospects who want a shorter discovery-led format before committing to a more complete training journey.",
        cta: "View live formats",
        href: "/seminaires",
        icon: CalendarDays,
      },
    ],
    commercialTitle: "The commercial proposal I recommend",
    commercialCards: [
      {
        title: "Core promise",
        desc: "Learn AI by profession, with concrete use cases for francophone Africa and immediate application in day-to-day work.",
      },
      {
        title: "Conversion promise",
        desc: "Help every visitor find the right next step quickly: explore, get guided, join a live format or apply.",
      },
      {
        title: "Premium promise",
        desc: "Highlight one signature certification and a few flagship programs as high-credibility lead products.",
      },
    ],
    whyItConvertsTitle: "What will drive more applications and registrations",
    whyItConverts: [
      "Decision-oriented navigation instead of inventory-driven navigation",
      "Clear CTAs toward application, registration and contact",
      "Profession-based paths that reassure beginners and accelerate choice",
      "Live formats that work as low-friction entry products before fuller training",
      "An Education page that sells outcomes, not just a list of sections",
    ],
    statsTitle: "What visitors should understand in 10 seconds",
    stats: [
      { value: `${formations.length}+`, label: "available courses" },
      { value: "13", label: "areas of expertise" },
      { value: "3", label: "progression levels" },
      { value: "1", label: "signature certification" },
    ],
    pathwaysTitle: "The 4 most effective entry paths",
    pathways: [
      {
        title: "I want to explore the offer",
        desc: "I want to browse all courses and filter quickly.",
        cta: "Open catalogue",
        href: "/catalogue",
      },
      {
        title: "I want guidance",
        desc: "I prefer a recommended path based on my level or profession.",
        cta: "View learning paths",
        href: "/parcours",
      },
      {
        title: "I want a premium offer",
        desc: "I am looking for a strong, professional certification path.",
        cta: "View certification",
        href: "/certification",
      },
      {
        title: "I want to test before committing",
        desc: "I prefer to start with a seminar or webinar.",
        cta: "View live formats",
        href: "/seminaires",
      },
    ],
    audienceTitle: "Audiences to target more clearly",
    audiences: [
      "Working professionals who want to save time with AI",
      "Managers and executives who want upskilling without technical jargon",
      "Recent graduates and career switchers",
      "Organizations training multiple collaborators by function",
    ],
    finalCtaTitle: "The strongest commercial path for Education",
    finalCtaDesc:
      "Education should become the easiest part of the site to buy from: one clear overview, distinct entry points by profile, a simple application path and visible registrations with minimal friction.",
    finalCtaPrimary: "Apply now",
    finalCtaSecondary: "Request orientation",
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
