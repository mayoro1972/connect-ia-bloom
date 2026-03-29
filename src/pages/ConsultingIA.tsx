import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, CheckCircle, ArrowRight, Heart, Brain, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";

const ConsultingIA = () => {
  const { t } = useLanguage();
  const services = t("consultingIA.services") as any[];
  const process = t("consultingIA.process") as any[];
  const benefits = t("consultingIA.benefits") as any[];

  const processIcons = [Shield, Brain, Target, TrendingUp];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("consultingIA.title")} subtitle={t("consultingIA.subtitle")} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Approach */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Heart size={40} className="text-primary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{t("consultingIA.approachTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("consultingIA.approachDesc")}</p>
            </div>

            {/* Services */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{t("consultingIA.servicesTitle")}</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {services.map((s: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-xl p-6 hover-lift">
                  <h3 className="font-heading font-bold text-lg text-card-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                  <ul className="space-y-2">
                    {(s.features as string[]).map((f: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Process */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{t("consultingIA.processTitle")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {process.map((p: any, i: number) => {
                const Icon = processIcons[i] || Shield;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-xl p-6 text-center hover-lift">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary mb-2 block">{t("consultingIA.step")} {i + 1}</span>
                    <h4 className="font-heading font-semibold text-sm text-card-foreground mb-2">{p.title}</h4>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Benefits */}
            <div className="bg-card border border-border rounded-2xl p-8 mb-16">
              <h2 className="font-heading text-xl font-bold text-card-foreground mb-6">{t("consultingIA.benefitsTitle")}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.map((b: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" /> {b}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-indigo-gradient rounded-2xl p-8 md:p-12 text-center">
              <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "hsl(0 0% 96%)" }}>{t("consultingIA.ctaTitle")}</h3>
              <p className="text-sm mb-6" style={{ color: "hsl(210 20% 70%)" }}>{t("consultingIA.ctaDesc")}</p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-gradient font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                {t("consultingIA.ctaCta")} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ConsultingIA;
