import ScrollReveal from "@/components/ScrollReveal";
import { Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";

const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const items = language === "fr" ? fr.testimonials.items : en.testimonials.items;

  return (
    <section id="temoignages" className="py-24 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            {t("testimonials.title1")}<span className="text-gradient-coral">{t("testimonials.titleHighlight")}</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 0.12} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
              <div className="bg-card border border-border rounded-xl p-8 hover-lift relative h-full">
                <Quote size={32} className="text-primary/20 mb-4" />
                <p className="text-card-foreground leading-relaxed mb-6 text-sm">"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-gradient flex items-center justify-center font-heading font-bold text-sm" style={{ color: "hsl(0 0% 100%)" }}>
                    {item.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{item.name}</p>
                    <p className="text-muted-foreground text-xs">{item.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
