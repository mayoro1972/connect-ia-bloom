import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Wrench, Laptop } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [MapPin, Wrench, Laptop];
const keys = ["local", "practical", "flexible"];

const WhyUsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="pourquoi" className="py-24 bg-indigo-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4" style={{ color: "hsl(0 0% 98%)" }}>
            {t("whyUs.title1")}<span className="text-gradient-orange">{t("whyUs.titleHighlight")}</span>{t("whyUs.title2")}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <ScrollReveal key={key} delay={i * 0.15} direction="up" className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-teal-gradient mx-auto flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-300">
                  <Icon size={28} style={{ color: "hsl(0 0% 100%)" }} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: "hsl(0 0% 98%)" }}>
                  {t(`whyUs.reasons.${key}.title`)}
                </h3>
                <p style={{ color: "hsl(210 20% 70%)" }} className="leading-relaxed">
                  {t(`whyUs.reasons.${key}.desc`)}
                </p>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
