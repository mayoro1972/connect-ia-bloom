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
import { useMonthlyDomainTrends } from "@/hooks/useMonthlyDomainTrends";

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

const fallbackFeaturedKeys = ["assistanat", "rh", "marketing"] as const;

const sectionCopy = {
  fr: {
    eyebrow: "Aperçu · 3 domaines phares sur 13",
    title: "Un aperçu des domaines phares",
    subtitle:
      "Voici 3 exemples parmi les 13 domaines couverts. Recevez le catalogue complet pour explorer toute l'offre.",
    primaryCta: "Recevoir le catalogue complet",
    secondaryCta: "Parcourir le catalogue",
    hiddenCount: "10 autres domaines dans le catalogue",
    formationsCount: "10 formations",
    sectorsLabel: "Secteurs porteurs",
    webinarCta: "S'inscrire au webinaire gratuit",
    monthlyEyebrow: (month: string) => `Tendance ${month} · 3 domaines les plus demandés`,
    badges: {
      assistanat: "Très demandé",
      rh: "Très demandé",
      marketing: "En forte hausse",
      finance: "En forte hausse",
      management: "Stratégique",
      it: "Stratégique",
    } as Record<string, string>,
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
    } as Record<string, { title: string; desc: string }>,
  },
  en: {
    eyebrow: "Preview · 3 featured domains out of 13",
    title: "A glimpse of our featured domains",
    subtitle:
      "Here are 3 examples among the 13 domains we cover. Get the full catalogue to explore the whole offer.",
    primaryCta: "Get the full catalogue",
    secondaryCta: "Browse the catalogue",
    hiddenCount: "10 more domains in the catalogue",
    formationsCount: "10 courses",
    sectorsLabel: "Top sectors",
    webinarCta: "Register for the free webinar",
    monthlyEyebrow: (month: string) => `${month} trend · 3 most in-demand domains`,
    badges: {
      assistanat: "Highly requested",
      rh: "Highly requested",
      marketing: "Fast growing",
      finance: "Fast growing",
      management: "Strategic",
      it: "Strategic",
    } as Record<string, string>,
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
    } as Record<string, { title: string; desc: string }>,
  },
} as const;

const FR_MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatTrendMonth = (iso: string, lang: "fr" | "en") => {
  const d = new Date(`${iso}T00:00:00Z`);
  const months = lang === "fr" ? FR_MONTHS : EN_MONTHS;
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const MetiersSection = () => {
  const { language } = useLanguage();
  const lang = resolveActiveLanguage(language);
  const copy = sectionCopy[lang];
  const trends = useMonthlyDomainTrends();

  // Build the list of 3 featured items: prefer dynamic monthly trends, fallback to static.
  const dynamicKeys = trends && trends.length > 0
    ? trends.sort((a, b) => a.rank - b.rank).map((t) => t.domain_key)
    : null;
  const featuredKeys = dynamicKeys ?? [...fallbackFeaturedKeys];
  const featuredItems = featuredKeys
    .map((key) => metierKeys.find((item) => item.key === key))
    .filter((item): item is (typeof metierKeys)[number] => Boolean(item));

  const monthLabel = trends && trends.length > 0 ? formatTrendMonth(trends[0].trend_month, lang) : null;
  const eyebrow = monthLabel ? copy.monthlyEyebrow(monthLabel) : copy.eyebrow;

  const trendByKey = new Map((trends ?? []).map((t) => [t.domain_key, t]));

  return (
    <section id="metiers" className="bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl text-card-foreground">{copy.title}</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{copy.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((m, i) => {
            const trend = trendByKey.get(m.key);
            const badgeLabel = trend
              ? (lang === "fr" ? trend.badge_label_fr : trend.badge_label_en)
              : (copy.badges[m.key] ?? copy.badges.assistanat);
            const sectors = trend
              ? (lang === "fr" ? trend.target_sectors_fr : trend.target_sectors_en)
              : [];
            const webinarUrl = trend?.webinar_url ?? "/webinars";

            return (
              <ScrollReveal key={m.key} delay={i * 0.06} direction="up" distance={30}>
                <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 hover-lift">
                  <Link
                    to={`/catalogues-domaines/${metierKeyToCatalogueSlug[m.key]}`}
                    className="block"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent transition-all duration-300 group-hover:bg-teal-gradient">
                        <m.icon size={22} className="text-accent-foreground transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        {badgeLabel}
                      </span>
                    </div>
                    <h3 className="mb-3 font-heading text-xl font-semibold text-card-foreground">
                      {copy.items[m.key]?.title ?? m.key}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{copy.items[m.key]?.desc ?? ""}</p>
                  </Link>

                  {sectors.length > 0 && (
                    <div className="mb-4 mt-1">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        {copy.sectorsLabel}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sectors.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                    <Link
                      to={`/catalogues-domaines/${metierKeyToCatalogueSlug[m.key]}`}
                      className="text-sm font-semibold text-coral hover:underline"
                    >
                      {copy.formationsCount} →
                    </Link>
                    <Link
                      to={webinarUrl}
                      className="inline-flex items-center gap-1 rounded-lg bg-coral-gradient px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.02] hover:opacity-90"
                      style={{ color: "hsl(0 0% 100%)" }}
                    >
                      {copy.webinarCta} ↗
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.3} className="mt-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/demande-catalogue"
                className="inline-flex items-center gap-2 rounded-lg bg-coral-gradient px-8 py-3 font-semibold transition-all hover:scale-[1.02] hover:opacity-90"
                style={{ color: "hsl(0 0% 100%)" }}
              >
                {copy.primaryCta} ↗
              </Link>
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-8 py-3 font-semibold transition-all hover:scale-[1.02] hover:bg-muted"
              >
                {copy.secondaryCta} →
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
