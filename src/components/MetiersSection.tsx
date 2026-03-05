import ScrollReveal from "@/components/ScrollReveal";
import {
  Briefcase, Users, Megaphone, Calculator, Scale, HeadphonesIcon,
  BarChart3, ClipboardList, Crown, Monitor, GraduationCap, Heart,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const metierKeys = [
  { key: "assistanat", icon: Briefcase },
  { key: "rh", icon: Users },
  { key: "marketing", icon: Megaphone },
  { key: "finance", icon: Calculator },
  { key: "juridique", icon: Scale },
  { key: "service", icon: HeadphonesIcon },
  { key: "data", icon: BarChart3 },
  { key: "admin", icon: ClipboardList },
  { key: "management", icon: Crown },
  { key: "it", icon: Monitor },
  { key: "formation", icon: GraduationCap },
  { key: "sante", icon: Heart },
];

const MetiersSection = () => {
  const { t } = useLanguage();

  return (
    <section id="metiers" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            {t("metiers.title1")}<span className="text-gradient-teal">{t("metiers.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("metiers.subtitle")}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {metierKeys.map((m, i) => (
            <ScrollReveal key={m.key} delay={i * 0.06} direction="up" distance={30}>
              <div className="group bg-card rounded-xl p-6 border border-border hover-lift cursor-pointer h-full">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-teal-gradient transition-all duration-300">
                  <m.icon size={22} className="text-accent-foreground group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-2 text-card-foreground">{t(`metiers.items.${m.key}.title`)}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{t(`metiers.items.${m.key}.desc`)}</p>
                <span className="text-sm font-semibold text-coral">10 {t("metiers.formationsCount")}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="text-center mt-12">
          <a href="#cta" className="bg-coral-gradient font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105" style={{ color: "hsl(0 0% 100%)" }}>
            {t("metiers.cta")}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MetiersSection;
