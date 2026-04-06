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

const sectionCopy = {
  fr: {
    title1: "13 domaines d'expertise, une transformation ",
    titleHighlight: "IA",
    subtitle: "Des formations conçues pour chaque fonction de l'entreprise, adaptées aux réalités du marché africain.",
    cta: "Voir tout le catalogue",
    formationsCount: "formations →",
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
    title1: "13 areas of expertise, one ",
    titleHighlight: "AI",
    subtitle: "Courses designed for every area of expertise, tailored to the African market.",
    cta: "View full catalogue",
    formationsCount: "courses →",
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

  return (
    <section id="metiers" className="bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-16 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl">
            {copy.title1}
            <span className="text-gradient-teal">{copy.titleHighlight}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{copy.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {metierKeys.map((m, i) => (
            <ScrollReveal key={m.key} delay={i * 0.06} direction="up" distance={30}>
              <Link
                to={`/catalogues-domaines/${metierKeyToCatalogueSlug[m.key]}`}
                className="group block h-full cursor-pointer rounded-xl border border-border bg-card p-6 hover-lift"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent transition-all duration-300 group-hover:bg-teal-gradient">
                  <m.icon size={22} className="text-accent-foreground transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="mb-2 font-heading text-base font-semibold text-card-foreground">
                  {copy.items[m.key].title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{copy.items[m.key].desc}</p>
                <span className="text-sm font-semibold text-coral">10 {copy.formationsCount}</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="mt-12 text-center">
          <Link
            to="/catalogues-domaines"
            className="inline-flex items-center gap-2 rounded-lg bg-coral-gradient px-8 py-3 font-semibold transition-all hover:scale-105 hover:opacity-90"
            style={{ color: "hsl(0 0% 100%)" }}
          >
            {copy.cta}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MetiersSection;
