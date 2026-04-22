import { ArrowRight, Building2, CalendarDays, Clock, GraduationCap, Radar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";

const pageCopy = {
  fr: {
    title: "Webinaires gratuits TransferAI Côte d'Ivoire",
    subtitle:
      "En juin 2026, TransferAI lance ses activités en Côte d'Ivoire. Inscrivez-vous gratuitement pour découvrir comment l'IA peut transformer les métiers, les entreprises et les opportunités professionnelles.",
    badge: "Lancement · Juin 2026",
    introTitle: "Trois portes d'entrée pour passer de la curiosité à l'action",
    introDesc:
      "Chaque webinaire est conçu pour une audience précise, avec des exemples concrets, des prompts utiles et une orientation claire vers les prochaines étapes TransferAI.",
    formatLabel: "En ligne gratuit",
    durationLabel: "60 minutes",
    cta: "S'inscrire gratuitement",
    newsletterCta: "Recevoir la newsletter IA",
    webinars: [
      {
        badge: "Tous métiers",
        title: "IA pratique en Côte d'Ivoire : 10 usages concrets pour transformer votre métier",
        desc: "Comprendre comment l'IA peut aider les professionnels ivoiriens à gagner du temps, mieux s'organiser, produire plus vite et prendre de meilleures décisions.",
        audience: "Professionnels, étudiants, managers, assistants, entrepreneurs",
        outcomes: ["10 usages métier", "3 prompts prêts à copier", "Méthode simple pour démarrer"],
        icon: GraduationCap,
      },
      {
        badge: "Entreprises & PME",
        title: "Entreprises ivoiriennes : par où commencer avec l'intelligence artificielle ?",
        desc: "Identifier les bons cas d'usage IA, éviter les effets de mode et structurer une adoption utile pour les équipes, les clients et la performance.",
        audience: "Dirigeants, PME, RH, responsables formation, managers",
        outcomes: ["Audit IA gratuit", "Cas d'usage prioritaires", "Plan d'action court terme"],
        icon: Building2,
      },
      {
        badge: "Talents & carrières",
        title: "IA, emploi et opportunités : les compétences à développer dès 2026",
        desc: "Découvrir les compétences IA les plus utiles, les prompts à maîtriser et les opportunités d'emploi, de mission ou de reconversion à suivre.",
        audience: "Jeunes diplômés, freelances, salariés, personnes en reconversion",
        outcomes: ["Compétences IA clés", "Opportunités à surveiller", "Conseils pour se positionner"],
        icon: Users,
      },
    ],
  },
  en: {
    title: "Free TransferAI Webinars for Côte d'Ivoire",
    subtitle:
      "In June 2026, TransferAI launches its operations in Côte d'Ivoire. Register for free to discover how AI can transform professions, companies and career opportunities.",
    badge: "Launch · June 2026",
    introTitle: "Three entry points to move from curiosity to action",
    introDesc:
      "Each webinar is designed for a specific audience, with concrete examples, useful prompts and a clear next step into TransferAI.",
    formatLabel: "Free online session",
    durationLabel: "60 minutes",
    cta: "Register for free",
    newsletterCta: "Get the AI newsletter",
    webinars: [
      {
        badge: "All professions",
        title: "Practical AI in Côte d'Ivoire: 10 concrete use cases to transform your work",
        desc: "Learn how AI can help Ivorian professionals save time, organize better, produce faster and make stronger decisions.",
        audience: "Professionals, students, managers, assistants, entrepreneurs",
        outcomes: ["10 profession use cases", "3 copy-ready prompts", "A simple method to start"],
        icon: GraduationCap,
      },
      {
        badge: "Companies & SMEs",
        title: "Ivorian companies: where should you start with artificial intelligence?",
        desc: "Identify useful AI use cases, avoid hype and structure practical adoption for teams, customers and performance.",
        audience: "Executives, SMEs, HR, training leads, managers",
        outcomes: ["Free AI audit", "Priority use cases", "Short-term action plan"],
        icon: Building2,
      },
      {
        badge: "Talent & careers",
        title: "AI, jobs and opportunities: the skills to build from 2026",
        desc: "Discover the most useful AI skills, prompts to master and job, mission or career-switching opportunities worth tracking.",
        audience: "Graduates, freelancers, employees, career switchers",
        outcomes: ["Key AI skills", "Opportunities to watch", "Positioning advice"],
        icon: Users,
      },
    ],
  },
} as const;

const Webinars = () => {
  const { language } = useLanguage();
  const lang = resolveActiveLanguage(language);
  const copy = pageCopy[lang];

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={copy.badge} title={copy.title} subtitle={copy.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <h2 className="font-heading text-3xl font-bold text-card-foreground md:text-4xl">{copy.introTitle}</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">{copy.introDesc}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {copy.webinars.map((webinar) => (
                <article key={webinar.title} className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-6 shadow-sm hover-lift">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <webinar.icon size={25} />
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      {webinar.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold leading-tight text-card-foreground">{webinar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{webinar.desc}</p>

                  <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-primary" />
                      {lang === "fr" ? "Session de lancement · Juin 2026" : "Launch session · June 2026"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-primary" />
                      {copy.durationLabel} · {copy.formatLabel}
                    </span>
                    <span className="flex items-center gap-2">
                      <Radar size={14} className="text-primary" />
                      {webinar.audience}
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {lang === "fr" ? "Vous repartirez avec" : "You will leave with"}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {webinar.outcomes.map((outcome) => (
                        <li key={outcome}>• {outcome}</li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={`/webinaires/inscription?topic=${encodeURIComponent(webinar.title)}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-orange-gradient px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {copy.cta}
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-[2rem] border border-primary/10 bg-[linear-gradient(135deg,hsl(225_48%_14%),hsl(226_40%_10%))] p-8 text-center md:p-10">
              <h2 className="font-heading text-2xl font-bold text-white">
                {lang === "fr" ? "Préparez le lancement TransferAI Côte d'Ivoire" : "Prepare for the TransferAI Côte d'Ivoire launch"}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/72">
                {lang === "fr"
                  ? "Inscrivez-vous à un webinaire, puis recevez chaque semaine la veille IA utile, les prompts et les opportunités à suivre."
                  : "Register for a webinar, then receive the useful AI watch, prompts and opportunities to follow every week."}
              </p>
              <Link
                to="/blog"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                {copy.newsletterCta}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Webinars;
