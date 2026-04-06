import { FileText, Target, Users, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { buildContactPath } from "@/lib/site-links";

const icons = [FileText, Target, Users, Settings];

const EntreprisesPage = () => {
  const { t, language } = useLanguage();
  const trans = language === "fr" ? fr : en;
  const solutions = trans.enterprises.solutions;

  return (
    <PageTransition><div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedLogoWatermarks />
      <Navbar />
      <PageHeader title={t("enterprises.title")} subtitle={t("enterprises.subtitle")} />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {solutions.map((s, i) => {
              const Icon = icons[i];
              return (
                <ScrollReveal key={s.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className="bg-card border border-border rounded-xl p-8 hover-lift">
                    <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-3 text-card-foreground">{s.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{s.desc}</p>
                    <ul className="space-y-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-card-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to={buildContactPath("contact-devis")} className="bg-coral-gradient font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
              {t("enterprises.cta")} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div></PageTransition>
  );
};

export default EntreprisesPage;
