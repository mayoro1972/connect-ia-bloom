import { motion } from "framer-motion";
import { Cpu, Zap, FileDown, ArrowRight, CheckCircle, Clock, DollarSign, Cog, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";

const DeveloppementSolutionsIA = () => {
  const { t } = useLanguage();
  const solutions = t("devSolutionsIA.solutions") as any[];
  const auditSteps = t("devSolutionsIA.auditSteps") as any[];
  const whyUs = t("devSolutionsIA.whyUs") as string[];

  const solutionIcons = [Cog, BarChart3, Cpu, Zap];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("devSolutionsIA.title")} subtitle={t("devSolutionsIA.subtitle")} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Intro */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Cpu size={40} className="text-primary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{t("devSolutionsIA.introTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("devSolutionsIA.introDesc")}</p>
            </div>

            {/* Solutions */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{t("devSolutionsIA.solutionsTitle")}</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {solutions.map((s: any, i: number) => {
                const Icon = solutionIcons[i] || Cpu;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-xl p-6 hover-lift">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-card-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                    <ul className="space-y-2">
                      {(s.examples as string[]).map((ex: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" /> {ex}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Free Audit Section */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 mb-16">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FileDown size={28} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">{t("devSolutionsIA.auditTitle")}</h2>
                    <span className="text-sm font-semibold text-primary">{t("devSolutionsIA.auditBadge")}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-8">{t("devSolutionsIA.auditDesc")}</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {auditSteps.map((step: any, i: number) => (
                    <div key={i} className="bg-card rounded-xl p-4 text-center">
                      <span className="text-2xl font-bold text-primary">{i + 1}</span>
                      <h4 className="font-heading font-semibold text-sm text-card-foreground mt-2 mb-1">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-gradient font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                    {t("devSolutionsIA.auditCta")} <FileDown size={16} />
                  </Link>
                  <p className="text-xs text-muted-foreground mt-3">{t("devSolutionsIA.auditNote")}</p>
                </div>
              </div>
            </div>

            {/* Why Us */}
            <div className="bg-card border border-border rounded-2xl p-8 mb-16">
              <h2 className="font-heading text-xl font-bold text-card-foreground mb-6">{t("devSolutionsIA.whyUsTitle")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {whyUs.map((reason: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" /> {reason}
                  </div>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="grid sm:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Clock, key: "time" },
                { icon: DollarSign, key: "money" },
                { icon: Zap, key: "efficiency" },
              ].map(({ icon: Icon, key }) => (
                <div key={key} className="bg-card border border-border rounded-xl p-6 text-center hover-lift">
                  <Icon size={32} className="text-primary mx-auto mb-3" />
                  <h3 className="font-heading font-semibold text-base text-card-foreground mb-2">{t(`devSolutionsIA.values.${key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`devSolutionsIA.values.${key}.desc`)}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-indigo-gradient rounded-2xl p-8 md:p-12 text-center">
              <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "hsl(0 0% 96%)" }}>{t("devSolutionsIA.ctaTitle")}</h3>
              <p className="text-sm mb-6" style={{ color: "hsl(210 20% 70%)" }}>{t("devSolutionsIA.ctaDesc")}</p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-gradient font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                {t("devSolutionsIA.ctaCta")} <ArrowRight size={16} />
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
