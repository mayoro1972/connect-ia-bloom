import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Award, Clock, MapPin, Monitor, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";

const CertificationPage = () => {
  const { t, language } = useLanguage();
  const trans = language === "fr" ? fr : en;

  return (
    <PageTransition><div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedLogoWatermarks />
      <Navbar />
      <PageHeader badge={t("certification.badge")} title={t("certification.title")} subtitle={t("certification.subtitle")} />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">{t("certification.objectivesTitle")}</h2>
                <div className="space-y-4">
                  {trans.certification.objectives.map((obj) => (
                    <motion.div key={obj} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-primary mt-0.5 shrink-0" />
                      <p className="text-card-foreground">{obj}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">{t("certification.programTitle")}</h2>
                <div className="space-y-3">
                  {trans.certification.modules.map((mod) => (
                    <div key={mod} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
                      <BookOpen size={18} className="text-primary shrink-0" />
                      <p className="text-sm text-card-foreground">{mod}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">{t("certification.evalTitle")}</h2>
                <div className="space-y-3">
                  {trans.certification.evalPoints.map((ep) => (
                    <div key={ep} className="flex items-start gap-3">
                      <Award size={18} className="text-coral mt-0.5 shrink-0" />
                      <p className="text-card-foreground text-sm">{ep}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border border-border rounded-xl p-8 sticky top-24">
                <p className="text-sm text-muted-foreground text-center mb-2">{t("certification.priceLabel")}</p>
                <p className="font-heading text-4xl font-bold text-center text-card-foreground mb-1">{t("certification.price")}</p>
                <p className="text-sm text-muted-foreground text-center mb-8">{t("certification.perParticipant")}</p>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: Clock, label: t("certification.duration"), value: t("certification.durationValue") },
                    { icon: Monitor, label: t("certification.format"), value: t("certification.formatValue") },
                    { icon: MapPin, label: t("certification.location"), value: t("certification.locationValue") },
                    { icon: Calendar, label: t("certification.nextSession"), value: t("certification.nextSessionValue") },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><item.icon size={16} /> {item.label}</span>
                      <span className="text-sm font-medium text-card-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <a href="/contact" className="block w-full bg-coral-gradient font-semibold py-3 rounded-lg text-center hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                  {t("certification.enrollCta")}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div></PageTransition>
  );
};

export default CertificationPage;
