import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Compass, GraduationCap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { trackCtaClick } from "@/lib/analytics";
import { buildContactPath } from "@/lib/site-links";

const sectionCopy = {
  fr: {
    badge: "Orientation · inscription · devis",
    title: "Passez à l'action avec le bon point de contact",
    subtitle:
      "Nous avons simplifié le parcours pour transformer plus facilement les visiteurs en leads utiles : une orientation, une demande d'inscription ou un devis selon votre besoin.",
    items: [
      {
        title: "Demander une orientation",
        desc: "Pour les visiteurs qui hésitent encore entre plusieurs formations, parcours ou formats et veulent un conseil clair.",
        cta: "Être orienté",
        href: buildContactPath("demande-renseignement"),
        badge: "Le plus simple",
        icon: Compass,
      },
      {
        title: "Faire une demande d'inscription",
        desc: "Pour les personnes ou équipes qui ont déjà identifié une formation et veulent passer à l'étape suivante.",
        cta: "Commencer l'inscription",
        href: "/inscription",
        badge: "Le plus direct",
        icon: GraduationCap,
      },
      {
        title: "Demander un devis",
        desc: "Pour les entreprises, institutions ou responsables formation qui veulent un accompagnement ou un programme sur mesure.",
        cta: "Obtenir un devis",
        href: buildContactPath("contact-devis"),
        badge: "Le plus business",
        icon: BriefcaseBusiness,
      },
    ],
    note: "Réponse sous 24h, prix sur demande et accompagnement possible avant toute validation finale.",
  },
  en: {
    badge: "Guidance · registration · quote",
    title: "Take action with the right contact point",
    subtitle:
      "We simplified the path to turn more visitors into useful leads: guidance, registration request, or quote request depending on the need.",
    items: [
      {
        title: "Request guidance",
        desc: "For visitors hesitating between several courses, paths, or formats and wanting a clear recommendation.",
        cta: "Get guidance",
        href: buildContactPath("demande-renseignement"),
        badge: "Simplest",
        icon: Compass,
      },
      {
        title: "Submit a registration request",
        desc: "For individuals or teams who already identified a course and want to move to the next step.",
        cta: "Start registration",
        href: "/inscription",
        badge: "Most direct",
        icon: GraduationCap,
      },
      {
        title: "Request a quote",
        desc: "For companies, institutions, or training leaders who need support or a tailored program.",
        cta: "Get a quote",
        href: buildContactPath("contact-devis"),
        badge: "Most business-focused",
        icon: BriefcaseBusiness,
      },
    ],
    note: "Response within 24 hours, pricing available on request, and guidance available before any final validation.",
  },
} as const;

const HomeLeadSection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];

  return (
    <section className="bg-muted py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.22em] text-primary">{copy.badge}</p>
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl text-card-foreground">{copy.title}</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{copy.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {copy.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={index * 0.08} direction="up">
                <Link
                  to={item.href}
                  onClick={() =>
                    trackCtaClick({
                      ctaName: item.title,
                      ctaLocation: "home_lead_section",
                      destination: item.href,
                    })
                  }
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 hover-lift"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mb-3 font-heading text-2xl font-semibold text-card-foreground">{item.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {item.cta} <ArrowRight size={16} />
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.25} className="mt-8">
          <div className="rounded-2xl border border-border bg-card px-6 py-4 text-center text-sm text-muted-foreground">
            {copy.note}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HomeLeadSection;
