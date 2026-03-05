import { motion } from "framer-motion";
import { Target, Users, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import teamCasimir from "@/assets/team-casimir.jpg";
import teamMarius from "@/assets/team-marius.jpg";
import teamSouleymane from "@/assets/team-souleymane.jpg";

const teamPhotos: Record<string, string> = {
  "Casimir Beda Kassi": teamCasimir,
  "Marius Ayoro": teamMarius,
  "Souleymane Konate": teamSouleymane,
};

const iconMap = [Target, Users, Award, Globe];

const AProposPage = () => {
  const { t, language } = useLanguage();
  const trans = language === "fr" ? fr : en;
  const stats = trans.about.stats;
  const team = trans.about.team;

  return (
    <PageTransition><div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedLogoWatermarks />
      <Navbar />
      <PageHeader title={t("about.title")} subtitle={t("about.subtitle")} />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold mb-4">{t("about.missionTitle")}</h2>
            {t("about.missionText").split("\n\n").map((para, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>
            ))}
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  {(() => { const Icon = iconMap[i]; return <Icon size={20} className="text-primary" />; })()}
                </div>
                <div>
                  <p className="font-heading font-bold text-card-foreground">{s.value} {s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <h2 className="font-heading text-2xl font-bold mb-6">{t("about.teamTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card border border-border rounded-2xl p-6 text-center flex flex-col items-center shadow-md hover-lift">
                <div className="w-40 h-40 rounded-2xl border-4 border-primary/20 shadow-lg overflow-hidden mb-4 bg-muted">
                  {teamPhotos[member.name] ? (
                    <img src={teamPhotos[member.name]} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-teal-gradient flex items-center justify-center font-heading font-bold text-3xl" style={{ color: "hsl(0 0% 100%)" }}>
                      {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-card-foreground text-base">{member.name}</h3>
                <p className="text-sm font-medium text-coral mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div></PageTransition>
  );
};

export default AProposPage;
