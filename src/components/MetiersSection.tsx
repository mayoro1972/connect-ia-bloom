import ScrollReveal from "@/components/ScrollReveal";
import {
  Briefcase,
  Users,
  Megaphone,
  Calculator,
  Scale,
  HeadphonesIcon,
  BarChart3,
  ClipboardList,
  Crown,
  Monitor,
  GraduationCap,
  Heart,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { metierKeyToCatalogueSlug } from "@/lib/site-links";

const metierKeys = [
  { key: "assistanat", icon: Briefcase },
  { key: "rh", icon: Users },
  { key: "marketing", icon: Megaphone },
  { key: "finance", icon: Calculator },
  { key: "juridique", icon: Scale },
  { key: "service", icon: HeadphonesIcon },
  { key: "data", icon: BarChart3 },
  { key: "admin", icon: ClipboardList },
  { key: "management", icon: Crown },
  { key: "it", icon: Monitor },
  { key: "formation", icon: GraduationCap },
  { key: "sante", icon: Heart },
  { key: "diplomatie", icon: Globe },
] as const;

const featuredMetierKeys = ["assistanat", "rh", "marketing", "finance", "management", "it"] as const;

const sectionCopy = {
  fr: {
    eyebrow: "Catalogue de formation · Abidjan & Afrique de l'Ouest",
    title: "Les domaines les plus demandés",
    subtitle:
      "Commencez par les domaines qui génèrent le plus d'intérêt, puis explorez l'ensemble de nos 13 expertises si vous souhaitez aller plus loin.",
    primaryCta: "Voir les 13 domaines",
    secondaryCta: "Explorer le catalogue",
    hiddenCount: "7 domaines masqués",
    formationsCount: "10 formations →",
    badges: {
      assistanat: "Très demandé",
      rh: "Très demandé",
      marketing: "En forte hausse",
      finance: "En forte hausse",
      management: "Stratégique",
      it: "Stratégique",
    },
    items: {
      assistanat: { title: "Assistanat & Secrétariat de Direction", desc: "Automatisation des tâches, gestion intelligente de l'agenda, rédaction assistée." },
      rh: { title: "Ressources Humaines", desc: "Recrutement prédictif, gestion des talents, formation personnalisée." },
      marketing: { title: "Marketing & Communication", desc: "Création de contenu, analyse d'audience, SEO automatisé." },
      finance: { title: "Finance & Comptabilité", desc: "Prévisions budgétaires, détection de fraudes, reporting automatisé." },
      juridique: { title: "Juridique & Conformité", desc: "Recherche juridique, analyse de contrats, veille réglementaire." },
      service: { title: "Service Client & Relation Client", desc: "Chatbots intelligents, analyse de sentiment, support prédictif." },
      data: { title: "Data & Analyse de Données", desc: "Visualisation, analyse prédictive, machine learning appliqué." },
      admin: { title: "Administration & Gestion", desc: "Automatisation des processus, gestion documentaire, planification." },
      management: { title: "Management & Leadership", desc: "Prise de décision data-driven, gestion d'équipe augmentée." },
      it: { title: "IT & Transformation Digitale", desc: "Intégration d'outils IA, cybersécurité, automatisation IT." },
      formation: { title: "Formation & Pédagogie", desc: "Conception pédagogique assistée, e-learning adaptatif." },
      sante: { title: "Santé & Bien-être au Travail", desc: "Prévention des risques, analyse ergonomique, suivi du bien-être." },
      diplomatie: { title: "Diplomatie & Affaires Internationales", desc: "Diplomatie digitale, analyse géopolitique, cybersécurité, négociation internationale avec l'IA." },
    },
  },
  en: {
    eyebrow: "Training catalogue · Abidjan & West Africa",
    title: "The most requested domains",
    subtitle:
      "Start with the domains attracting the most interest, then explore all 13 areas of expertise if you want to go further.",
    primaryCta: "View all 13 domains",
    secondaryCta: "Explore the catalogue",
    hiddenCount: "7 hidden domains",
    formationsCount: "10 courses →",
    badges: {
      assistanat: "Highly requested",
      rh: "Highly requested",
      marketing: "Fast growing",
      finance: "Fast growing",
      management: "Strategic",
      it: "Strategic",
    },
    items: {
      assistanat: { title: "Executive Assistants & Secretaries", desc: "Task automation, smart calendar management, AI-assisted writing." },
      rh: { title: "Human Resources", desc: "Predictive recruitment, talent management, personalized training." },
      marketing: { title: "Marketing & Communications", desc: "Content creation, audience analysis, automated SEO." },
      finance: { title: "Finance & Accounting", desc: "Budget forecasting, fraud detection, automated reporting." },
      juridique: { title: "Legal & Compliance", desc: "Legal research, contract analysis, regulatory monitoring." },
      service: { title: "Customer Service & Relations", desc: "Smart chatbots, sentiment analysis, predictive support." },
      data: { title: "Data & Analytics", desc: "Visualization, predictive analytics, applied machine learning." },
      admin: { title: "Administration & Management", desc: "Process automation, document management, planning." },
      management: { title: "Management & Leadership", desc: "Data-driven decision making, augmented team management." },
      it: { title: "IT & Digital Transformation", desc: "AI tool integration, cybersecurity, IT automation." },
      formation: { title: "Training & Education", desc: "AI-assisted instructional design, adaptive e-learning." },
      sante: { title: "Health & Workplace Wellness", desc: "Risk prevention, ergonomic analysis, wellness monitoring." },
      diplomatie: { title: "Diplomacy & International Affairs", desc: "Digital diplomacy, geopolitical analysis, cybersecurity, international negotiations with AI." },
    },
  },
} as const;

const MetiersSection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];
  const featuredItems = featuredMetierKeys.map((key) => metierKeys.find((item) => item.key === key)).filter(Boolean);

  return (
    <section id="metiers" className="bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.22em] text-primary">{copy.eyebrow}</p>
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl text-card-foreground">{copy.title}</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{copy.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((m, i) => (
            <ScrollReveal key={m.key} delay={i * 0.06} direction="up" distance={30}>
              <Link
                to={`/catalogues-domaines/${metierKeyToCatalogueSlug[m.key]}`}
                className="group block h-full cursor-pointer rounded-xl border border-border bg-card p-6 hover-lift"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent transition-all duration-300 group-hover:bg-teal-gradient">
                    <m.icon size={22} className="text-accent-foreground transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {copy.badges[m.key]}
                  </span>
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-card-foreground">
                  {copy.items[m.key].title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{copy.items[m.key].desc}</p>
                <span className="text-sm font-semibold text-coral">{copy.formationsCount}</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="mt-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalogues-domaines"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-8 py-3 font-semibold transition-all hover:scale-[1.02] hover:bg-muted"
              >
                {copy.primaryCta} →
              </Link>
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 rounded-lg bg-coral-gradient px-8 py-3 font-semibold transition-all hover:scale-[1.02] hover:opacity-90"
                style={{ color: "hsl(0 0% 100%)" }}
              >
                {copy.secondaryCta} ↗
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">{copy.hiddenCount}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MetiersSection;
