import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";

const Seminaires = () => {
  const { t } = useLanguage();
  const seminaires = t("seminaires.items") as any[];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("seminaires.title")} subtitle={t("seminaires.subtitle")} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Upcoming Seminaires */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{t("seminaires.upcoming")}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {seminaires.map((sem: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-xl p-6 hover-lift"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">{sem.audience}</span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-card-foreground mb-2">{sem.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{sem.desc}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {sem.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {sem.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {sem.duration}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {sem.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-semibold text-card-foreground">{sem.price}</span>
                      <Link to="/contact" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
                        {t("seminaires.register")} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-indigo-gradient rounded-2xl p-8 md:p-12 text-center">
              <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "hsl(0 0% 96%)" }}>{t("seminaires.ctaTitle")}</h3>
              <p className="text-sm mb-6" style={{ color: "hsl(210 20% 70%)" }}>{t("seminaires.ctaDesc")}</p>
              <Link to="/contact" className="inline-block bg-orange-gradient font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                {t("seminaires.ctaCta")}
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Seminaires;
