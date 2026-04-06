import { motion } from "framer-motion";
import { Youtube, Music2, FileText, Mail, Mic, ArrowRight, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildContactPath } from "@/lib/site-links";

const channels = [
  { icon: Youtube, color: "text-[#FF0000]", bg: "bg-[#FF0000]/10" },
  { icon: Music2, color: "text-[#ff0050]", bg: "bg-[#ff0050]/10" },
  { icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  { icon: Mail, color: "text-[hsl(174,70%,42%)]", bg: "bg-[hsl(174,70%,42%)]/10" },
  { icon: Mic, color: "text-[hsl(145,65%,42%)]", bg: "bg-[hsl(145,65%,42%)]/10" },
];

const CreateurContenuIA = () => {
  const { t } = useLanguage();
  const channelItems = t("contenuIA.channels") as any[];
  const audiences = t("contenuIA.audiences") as any[];
  const recentContent = t("contenuIA.recentContent") as any[];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("contenuIA.title")} subtitle={t("contenuIA.subtitle")} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Mission */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Sparkles size={40} className="text-primary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{t("contenuIA.missionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("contenuIA.missionDesc")}</p>
            </div>

            {/* Channels */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{t("contenuIA.channelsTitle")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {channelItems.map((ch: any, i: number) => {
                const cfg = channels[i] || channels[0];
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-xl p-6 hover-lift">
                    <div className={`w-12 h-12 rounded-xl ${cfg.bg} flex items-center justify-center mb-4`}>
                      <cfg.icon size={24} className={cfg.color} />
                    </div>
                    <h3 className="font-heading font-bold text-base text-card-foreground mb-2">{ch.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{ch.desc}</p>
                    <span className="text-xs text-muted-foreground">{ch.frequency}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Target Audiences */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
              <Users size={24} className="text-primary" /> {t("contenuIA.audiencesTitle")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {audiences.map((a: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-5 text-center hover-lift">
                  <h4 className="font-heading font-semibold text-sm text-card-foreground mb-1">{a.title}</h4>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Content */}
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{t("contenuIA.recentTitle")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {recentContent.map((c: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-5 hover-lift">
                  <span className="text-xs font-bold text-primary mb-2 block">{c.type}</span>
                  <h3 className="font-heading font-semibold text-sm text-card-foreground mb-2">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-indigo-gradient rounded-2xl p-8 md:p-12 text-center">
              <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "hsl(0 0% 96%)" }}>{t("contenuIA.ctaTitle")}</h3>
              <p className="text-sm mb-6" style={{ color: "hsl(210 20% 70%)" }}>{t("contenuIA.ctaDesc")}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://www.youtube.com/@transferai-africa" target="_blank" rel="noopener noreferrer" className="bg-orange-gradient font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                  {t("contenuIA.ctaSubscribe")}
                </a>
                <Link to={buildContactPath("contact-devis", "Marketing & Communication")} className="border font-semibold text-sm px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors" style={{ color: "hsl(0 0% 96%)", borderColor: "hsl(0 0% 100% / 0.2)" }}>
                  {t("contenuIA.ctaContact")}
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CreateurContenuIA;
