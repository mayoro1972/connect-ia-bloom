import { motion } from "framer-motion";
import { Cpu, Zap, FileDown, ArrowRight, CheckCircle, Clock, DollarSign, Cog, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath, directLinks } from "@/lib/site-links";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import { deepFixMojibake } from "@/lib/fixMojibake";

const DeveloppementSolutionsIA = () => {
  const { language } = useLanguage();
  const trans = deepFixMojibake(language === "fr" ? fr : en);
  const content = trans.devSolutionsIA;

  const solutions = content.solutions as Array<{ title: string; desc: string; examples: string[] }>;
  const auditSteps = content.auditSteps as Array<{ title: string; desc: string }>;
  const whyUs = content.whyUs as string[];
  const solutionIcons = [Cog, BarChart3, Cpu, Zap];

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={content.title} subtitle={content.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <Cpu size={40} className="mx-auto mb-4 text-primary" />
              <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">{content.introTitle}</h2>
              <p className="leading-relaxed text-muted-foreground">{content.introDesc}</p>
            </div>

            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground">{content.solutionsTitle}</h2>
            <div className="mb-16 grid gap-6 md:grid-cols-2">
              {solutions.map((solution, i) => {
                const Icon = solutionIcons[i] || Cpu;
                return (
                  <motion.div
                    key={solution.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-border bg-card p-6 hover-lift"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-card-foreground">{solution.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{solution.desc}</p>
                    <ul className="space-y-2">
                      {solution.examples.map((example) => (
                        <li key={example} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle size={14} className="mt-0.5 shrink-0 text-primary" /> {example}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            <div className="mb-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-12">
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                    <FileDown size={28} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">{content.auditTitle}</h2>
                    <span className="text-sm font-semibold text-primary">{content.auditBadge}</span>
                  </div>
                </div>
                <p className="mb-8 text-muted-foreground">{content.auditDesc}</p>

                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {auditSteps.map((step, i) => (
                    <div key={step.title} className="rounded-xl bg-card p-4 text-center">
                      <span className="text-2xl font-bold text-primary">{i + 1}</span>
                      <h4 className="mt-2 mb-1 font-heading text-sm font-semibold text-card-foreground">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="flex justify-center">
                    <a
                      href={directLinks.auditForm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-8 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
                    >
                      <FileDown size={16} />
                      {language === "fr" ? "Ouvrir le formulaire d'audit" : "Open the audit form"}
                    </a>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{content.auditNote}</p>
                </div>
              </div>
            </div>

            <div className="mb-16 rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-6 font-heading text-xl font-bold text-card-foreground">{content.whyUsTitle}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {whyUs.map((reason) => (
                  <div key={reason} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="mt-0.5 shrink-0 text-primary" /> {reason}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16 grid gap-6 sm:grid-cols-3">
              {[
                { icon: Clock, key: "time" as const },
                { icon: DollarSign, key: "money" as const },
                { icon: Zap, key: "efficiency" as const },
              ].map(({ icon: Icon, key }) => (
                <div key={key} className="rounded-xl border border-border bg-card p-6 text-center hover-lift">
                  <Icon size={32} className="mx-auto mb-3 text-primary" />
                  <h3 className="mb-2 font-heading text-base font-semibold text-card-foreground">{content.values[key].title}</h3>
                  <p className="text-sm text-muted-foreground">{content.values[key].desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-indigo-gradient p-8 text-center md:p-12">
              <h3 className="mb-4 font-heading text-2xl font-bold" style={{ color: "hsl(0 0% 96%)" }}>
                {content.ctaTitle}
              </h3>
              <p className="mb-6 text-sm" style={{ color: "hsl(210 20% 70%)" }}>
                {content.ctaDesc}
              </p>
              <Link
                to="/contact?intent=brief-solution-ia"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-gradient px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ color: "hsl(0 0% 100%)" }}
              >
                {content.ctaCta} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default DeveloppementSolutionsIA;
