import ScrollReveal from "@/components/ScrollReveal";
import { Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";

const sectionCopy = {
  fr: {
    title1: "Des résultats qui ",
    titleHighlight: "parlent",
    items: [
      { quote: "La formation IA pour nos équipes RH a transformé notre processus de recrutement. Gain de temps de 40% sur le sourcing.", name: "Aminata Koné", role: "DRH, Banque Atlantique" },
      { quote: "Un programme de formation structuré et adapté aux réalités africaines. Nos équipes sont devenues autonomes sur les outils IA.", name: "Jean-Marc Ouattara", role: "DSI, Orange CI" },
      { quote: "L'IA a révolutionné notre création de contenu. TransferAI Africa nous a accompagnés de A à Z.", name: "Fatou Diallo", role: "Directrice Marketing, Ecobank" },
    ],
  },
  en: {
    title1: "Results that ",
    titleHighlight: "speak",
    items: [
      { quote: "The AI training for our HR teams transformed our recruitment process. 40% time saved on sourcing.", name: "Aminata Koné", role: "CHRO, Banque Atlantique" },
      { quote: "A structured training program adapted to African realities. Our teams became autonomous on AI tools.", name: "Jean-Marc Ouattara", role: "CIO, Orange CI" },
      { quote: "AI revolutionized our content creation. TransferAI Africa supported us from A to Z.", name: "Fatou Diallo", role: "Marketing Director, Ecobank" },
    ],
  },
} as const;

const TestimonialsSection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];

  return (
    <section id="temoignages" className="bg-muted py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-16 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl">
            {copy.title1}
            <span className="text-gradient-coral">{copy.titleHighlight}</span>
          </h2>
        </ScrollReveal>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {copy.items.map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 0.12} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
              <div className="relative h-full rounded-xl border border-border bg-card p-8 hover-lift">
                <Quote size={32} className="mb-4 text-primary/20" />
                <p className="mb-6 text-sm leading-relaxed text-card-foreground">"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-gradient font-heading text-sm font-bold"
                    style={{ color: "hsl(0 0% 100%)" }}
                  >
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
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
