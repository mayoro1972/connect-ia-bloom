import { motion } from "framer-motion";
import { Calendar, Clock, Globe, Play, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath } from "@/lib/site-links";

const Webinars = () => {
  const { t } = useLanguage();
  const upcoming = t("webinars.upcoming") as any[];
  const replays = t("webinars.replays") as any[];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("webinars.title")} subtitle={t("webinars.subtitle")} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Upcoming */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
              <Globe size={24} className="text-primary" /> {t("webinars.upcomingTitle")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {upcoming.map((w: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-xl p-6 hover-lift flex flex-col">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent text-accent-foreground self-start mb-3">{w.audience}</span>
                  <h3 className="font-heading font-bold text-base text-card-foreground mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{w.desc}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {w.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {w.time}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm font-semibold text-primary">{w.price}</span>
                    <Link to={buildContactPath("demande-renseignement")} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                      {t("webinars.register")} <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Replays */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
              <Play size={24} className="text-primary" /> {t("webinars.replaysTitle")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {replays.map((r: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-6 hover-lift">
                  <h3 className="font-heading font-semibold text-base text-card-foreground mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{r.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users size={12} /> {r.viewers}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {r.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-indigo-gradient rounded-2xl p-8 md:p-12 text-center">
              <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "hsl(0 0% 96%)" }}>{t("webinars.ctaTitle")}</h3>
              <p className="text-sm mb-6" style={{ color: "hsl(210 20% 70%)" }}>{t("webinars.ctaDesc")}</p>
              <Link to={buildContactPath("demande-renseignement")} className="inline-block bg-orange-gradient font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                {t("webinars.ctaCta")}
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Webinars;
