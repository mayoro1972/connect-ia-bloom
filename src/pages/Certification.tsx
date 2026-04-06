import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Award, Clock, MapPin, Monitor, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { deepFixMojibake } from "@/lib/fixMojibake";

const CertificationPage = () => {
  const { language } = useLanguage();
  const trans = deepFixMojibake(language === "fr" ? fr : en);
  const content = trans.certification;

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={content.badge} title={content.title} subtitle={content.subtitle} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="space-y-12 lg:col-span-2">
                <div>
                  <h2 className="mb-6 font-heading text-2xl font-bold">{content.objectivesTitle}</h2>
                  <div className="space-y-4">
                    {content.objectives.map((objective) => (
                      <motion.div key={objective} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-start gap-3">
                        <CheckCircle size={20} className="mt-0.5 shrink-0 text-primary" />
                        <p className="text-card-foreground">{objective}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-6 font-heading text-2xl font-bold">{content.programTitle}</h2>
                  <div className="space-y-3">
                    {content.modules.map((module) => (
                      <div key={module} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                        <BookOpen size={18} className="shrink-0 text-primary" />
                        <p className="text-sm text-card-foreground">{module}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-6 font-heading text-2xl font-bold">{content.evalTitle}</h2>
                  <div className="space-y-3">
                    {content.evalPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <Award size={18} className="mt-0.5 shrink-0 text-coral" />
                        <p className="text-sm text-card-foreground">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="sticky top-24 rounded-xl border border-border bg-card p-8">
                  <p className="mb-2 text-center text-sm text-muted-foreground">{content.priceLabel}</p>
                  <p className="mb-1 text-center font-heading text-4xl font-bold text-card-foreground">{content.price}</p>
                  <p className="mb-8 text-center text-sm text-muted-foreground">{content.perParticipant}</p>

                  <div className="mb-8 space-y-4">
                    {[
                      { icon: Clock, label: content.duration, value: content.durationValue },
                      { icon: Monitor, label: content.format, value: content.formatValue },
                      { icon: MapPin, label: content.location, value: content.locationValue },
                      { icon: Calendar, label: content.nextSession, value: content.nextSessionValue },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <item.icon size={16} /> {item.label}
                        </span>
                        <span className="text-sm font-medium text-card-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/inscription?formation=assist-10"
                    className="block w-full rounded-lg bg-coral-gradient py-3 text-center font-semibold transition-opacity hover:opacity-90"
                    style={{ color: "hsl(0 0% 100%)" }}
                  >
                    {content.enrollCta}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CertificationPage;
