import { ArrowRight, CheckCircle2, ClipboardCheck, FileSearch, Layers3, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { auditDomainMessages, auditOfferContent } from "@/data/audit-offer-content";
import { buildContactPath, directLinks } from "@/lib/site-links";

const whyIcons = [Target, Sparkles, ClipboardCheck];
const processIcons = [FileSearch, Layers3, ClipboardCheck, ArrowRight];

const AuditIAPage = () => {
  const { language } = useLanguage();
  const activeLanguage = resolveActiveLanguage(language);
  const isFr = activeLanguage === "fr";

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />

        <main className="relative z-10">
          <section className="border-b border-border/50 bg-[linear-gradient(180deg,rgba(16,33,61,0.98),rgba(16,33,61,0.92))] px-4 py-20 text-white lg:px-8">
            <div className="container mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                  {isFr ? auditOfferContent.heroBadge.fr : auditOfferContent.heroBadge.en}
                </p>
                <h1 className="mt-6 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-5xl">
                  {isFr ? auditOfferContent.heroTitle.fr : auditOfferContent.heroTitle.en}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/80 md:text-lg">
                  {isFr ? auditOfferContent.heroLead.fr : auditOfferContent.heroLead.en}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={directLinks.auditForm}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {isFr ? "Demander le formulaire d'audit" : "Request the audit questionnaire"} <ArrowRight size={16} />
                  </a>
                  <Link
                    to={buildContactPath("demande-renseignement", isFr ? "Audit IA gratuit" : "Free AI audit")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                  >
                    {isFr ? "Parler à un expert" : "Speak with an expert"}
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                  {isFr ? "Ce que l'entreprise obtient" : "What the company gets"}
                </p>
                <div className="mt-5 grid gap-3">
                  {(isFr ? auditOfferContent.proofPoints.fr : auditOfferContent.proofPoints.en).map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-orange-300" />
                      <p className="text-sm leading-6 text-white/85">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-16 lg:px-8">
            <div className="container mx-auto">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  {isFr ? auditOfferContent.whyTitle.fr : auditOfferContent.whyTitle.en}
                </p>
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {auditOfferContent.whyItems.map((item, index) => {
                  const Icon = whyIcons[index];
                  return (
                    <article key={item.title.fr} className="rounded-[26px] border border-border bg-card p-6 shadow-[0_24px_60px_-48px_rgba(16,33,61,0.28)]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon size={22} />
                      </div>
                      <h2 className="mt-5 font-heading text-2xl font-bold text-card-foreground">
                        {isFr ? item.title.fr : item.title.en}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {isFr ? item.desc.fr : item.desc.en}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-[#fcfaf5] px-4 py-20 lg:px-8">
            <div className="container mx-auto">
              <div className="mx-auto max-w-3xl text-center">
                <p className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {isFr ? "Ce que l'entreprise reçoit" : "What the company receives"}
                </p>
                <h2 className="mt-5 font-heading text-3xl font-bold text-card-foreground md:text-4xl">
                  {isFr ? auditOfferContent.deliverablesTitle.fr : auditOfferContent.deliverablesTitle.en}
                </h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  {isFr
                    ? "Des livrables concrets et exploitables, remis à l'issue de l'audit."
                    : "Concrete, actionable deliverables handed over at the end of the audit."}
                </p>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {(isFr ? auditOfferContent.deliverables.fr : auditOfferContent.deliverables.en).map((item, index) => (
                  <article
                    key={item}
                    className="flex gap-4 rounded-[24px] border border-[hsl(30_52%_84%)] bg-white p-6 shadow-[0_24px_60px_-48px_rgba(16,33,61,0.24)]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-sm leading-7 text-card-foreground">{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 py-20 lg:px-8">
            <div className="container mx-auto">
              <div className="mx-auto max-w-3xl text-center">
                <p className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {isFr ? "Comment se déroule l'audit" : "How the audit unfolds"}
                </p>
                <h2 className="mt-5 font-heading text-3xl font-bold text-card-foreground md:text-4xl">
                  {isFr ? auditOfferContent.processTitle.fr : auditOfferContent.processTitle.en}
                </h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  {isFr
                    ? "Un parcours structuré en étapes claires, du premier échange à la remise du plan d'action."
                    : "A structured journey in clear steps, from the first exchange to the delivery of the action plan."}
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {auditOfferContent.processSteps.map((step, index) => {
                  const Icon = processIcons[index];
                  return (
                    <article
                      key={step.step}
                      className="relative flex flex-col rounded-[24px] border border-border bg-card p-6 shadow-[0_24px_60px_-48px_rgba(16,33,61,0.24)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon size={20} />
                        </div>
                        <span className="font-heading text-3xl font-bold text-primary/30">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{step.step}</p>
                      <h3 className="mt-2 font-heading text-xl font-bold text-card-foreground">
                        {isFr ? step.title.fr : step.title.en}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {isFr ? step.desc.fr : step.desc.en}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="px-4 pb-20 lg:px-8">
            <div className="container mx-auto">
              <div className="rounded-[30px] border border-[hsl(30_55%_82%)] bg-[linear-gradient(135deg,hsl(32_100%_98%),hsl(28_62%_95%))] p-8 shadow-[0_28px_80px_-56px_rgba(249,115,22,0.35)] md:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  {isFr ? auditOfferContent.ctaTitle.fr : auditOfferContent.ctaTitle.en}
                </p>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  {isFr ? auditOfferContent.ctaDesc.fr : auditOfferContent.ctaDesc.en}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href={directLinks.auditForm}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {isFr ? "Demander le formulaire d'audit" : "Request the audit questionnaire"} <ArrowRight size={16} />
                  </a>
                  <Link
                    to={buildContactPath("demande-renseignement", isFr ? "Audit IA gratuit" : "Free AI audit")}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {isFr ? "Recevoir plus d'informations" : "Request more information"}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default AuditIAPage;
