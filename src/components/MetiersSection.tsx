import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Clock,
  GraduationCap,
  Radar,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";

const sectionCopy = {
  fr: {
    eyebrow: "Webinaires gratuits · Lancement Côte d'Ivoire",
    title: "Participez aux webinaires de lancement TransferAI",
    subtitle:
      "En juin 2026, TransferAI lance ses activités en Côte d'Ivoire. Réservez votre place pour comprendre comment l'IA peut transformer les métiers, les entreprises et les opportunités professionnelles.",
    secondaryCta: "Voir tous les webinaires gratuits",
    formatLabel: "En ligne gratuit",
    durationLabel: "60 minutes",
    cta: "S'inscrire gratuitement",
    webinars: [
      {
        badge: "Tous métiers",
        title: "IA pratique en Côte d'Ivoire : 10 usages concrets pour transformer votre métier",
        desc: "Un webinaire d'introduction pour aider les professionnels ivoiriens à gagner du temps, mieux s'organiser et produire plus vite avec l'IA.",
        audience: "Professionnels, étudiants, managers, assistants, entrepreneurs",
        icon: GraduationCap,
      },
      {
        badge: "Entreprises & PME",
        title: "Entreprises ivoiriennes : par où commencer avec l'intelligence artificielle ?",
        desc: "Une session pour identifier les bons cas d'usage IA, éviter les effets de mode et passer à l'action avec méthode.",
        audience: "Dirigeants, PME, RH, responsables formation, managers",
        icon: Building2,
      },
      {
        badge: "Talents & carrières",
        title: "IA, emploi et opportunités : les compétences à développer dès 2026",
        desc: "Un webinaire pour découvrir les compétences IA utiles, les prompts à maîtriser et les opportunités à suivre.",
        audience: "Jeunes diplômés, freelances, salariés, personnes en reconversion",
        icon: Users,
      },
    ],
  },
  en: {
    eyebrow: "Free webinars · Côte d'Ivoire launch",
    title: "Join TransferAI's launch webinars",
    subtitle:
      "In June 2026, TransferAI launches its operations in Côte d'Ivoire. Reserve your seat to learn how AI can transform professions, organizations and career opportunities.",
    secondaryCta: "See all free webinars",
    formatLabel: "Free online session",
    durationLabel: "60 minutes",
    cta: "Register for free",
    webinars: [
      {
        badge: "All professions",
        title: "Practical AI in Côte d'Ivoire: 10 concrete use cases to transform your work",
        desc: "An introductory webinar to help Ivorian professionals save time, organize work better and produce faster with AI.",
        audience: "Professionals, students, managers, assistants, entrepreneurs",
        icon: GraduationCap,
      },
      {
        badge: "Companies & SMEs",
        title: "Ivorian companies: where should you start with artificial intelligence?",
        desc: "A session to identify the right AI use cases, avoid hype and move forward with a clear method.",
        audience: "Executives, SMEs, HR, training leads, managers",
        icon: Building2,
      },
      {
        badge: "Talent & careers",
        title: "AI, jobs and opportunities: the skills to build from 2026",
        desc: "A webinar to discover useful AI skills, prompts to master and opportunities worth tracking.",
        audience: "Graduates, freelancers, employees, career switchers",
        icon: Users,
      },
    ],
  },
} as const;

const MetiersSection = () => {
  const { language } = useLanguage();
  const lang = resolveActiveLanguage(language);
  const copy = sectionCopy[lang];

  return (
    <section id="metiers" className="bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.22em] text-primary">{copy.eyebrow}</p>
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl text-card-foreground">{copy.title}</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{copy.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {copy.webinars.map((webinar, i) => (
            <ScrollReveal key={webinar.title} delay={i * 0.06} direction="up" distance={30}>
              <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 hover-lift">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent transition-all duration-300 group-hover:bg-teal-gradient">
                    <webinar.icon size={22} className="text-accent-foreground transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {webinar.badge}
                  </span>
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-card-foreground">{webinar.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{webinar.desc}</p>
                <div className="mb-5 grid gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} className="text-primary" />
                    {lang === "fr" ? "Session de lancement · Juin 2026" : "Launch session · June 2026"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    {copy.durationLabel} · {copy.formatLabel}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Radar size={14} className="text-primary" />
                    {webinar.audience}
                  </span>
                </div>
                <Link
                  to={`/webinaires/inscription?topic=${encodeURIComponent(webinar.title)}`}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-coral-gradient px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] hover:opacity-90"
                  style={{ color: "hsl(0 0% 100%)" }}
                >
                  {copy.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="mt-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/webinaires-gratuits"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-8 py-3 font-semibold transition-all hover:scale-[1.02] hover:bg-muted"
              >
                {copy.secondaryCta} →
              </Link>
            </div>
            
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MetiersSection;
