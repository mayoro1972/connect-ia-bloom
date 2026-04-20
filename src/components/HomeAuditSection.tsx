import ScrollReveal from "@/components/ScrollReveal";
import { FileSearch, Gift, ShieldCheck, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { trackCtaClick } from "@/lib/analytics";
import { directLinks } from "@/lib/site-links";

const sectionCopy = {
  fr: {
    badge: "Audit IA gratuit",
    title: "Identifiez vos priorités IA avant d'investir",
    subtitle:
      "Pour les entreprises, directions et équipes qui veulent comprendre où l'IA peut créer de la valeur rapidement, sans engagement et avec un premier cadrage concret.",
    highlights: [
      "100% gratuit et sans engagement",
      "Pensé pour les entreprises en Côte d'Ivoire et en Afrique",
      "Accusé immédiat, puis accès au formulaire sous environ 30 minutes",
    ],
    primaryCta: "Demander le formulaire d'audit",
    secondaryCta: "Voir les services entreprises",
  },
  en: {
    badge: "Free AI audit",
    title: "Identify your AI priorities before you invest",
    subtitle:
      "For companies, leaders and teams that want to understand where AI can create value quickly, without commitment and with a concrete first framing.",
    highlights: [
      "100% free and no commitment",
      "Built for companies in Côte d'Ivoire and across Africa",
      "Immediate acknowledgement, then questionnaire access in about 30 minutes",
    ],
    primaryCta: "Request the audit questionnaire",
    secondaryCta: "View enterprise services",
  },
} as const;

const proofIcons = [Gift, ShieldCheck, TimerReset];

const HomeAuditSection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="rounded-[28px] border border-[hsl(30_90%_84%)] bg-[linear-gradient(135deg,hsl(32_100%_98%),hsl(28_60%_95%))] p-6 shadow-[0_24px_60px_-42px_rgba(249,115,22,0.35)] md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileSearch size={26} />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold uppercase tracking-[0.18em] text-primary">{copy.badge}</p>
                    <h2 className="mt-1 font-heading text-2xl font-bold text-card-foreground md:text-3xl">{copy.title}</h2>
                  </div>
                </div>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">{copy.subtitle}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={directLinks.auditForm}
                    onClick={() =>
                      trackCtaClick({
                        ctaName: copy.primaryCta,
                        ctaLocation: "home_audit_section",
                        destination: directLinks.auditForm,
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {copy.primaryCta}
                  </Link>
                  <Link
                    to="/entreprises"
                    onClick={() =>
                      trackCtaClick({
                        ctaName: copy.secondaryCta,
                        ctaLocation: "home_audit_section",
                        destination: "/entreprises",
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {copy.secondaryCta}
                  </Link>
                </div>
              </div>

              <div className="grid gap-3">
                {copy.highlights.map((item, index) => {
                  const Icon = proofIcons[index];

                  return (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-[hsl(30_50%_86%)] bg-white/70 p-4">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={18} />
                      </div>
                      <p className="text-sm leading-6 text-card-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HomeAuditSection;
