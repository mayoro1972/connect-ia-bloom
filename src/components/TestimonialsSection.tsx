import ScrollReveal from "@/components/ScrollReveal";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "La formation IA pour nos équipes RH a transformé notre processus de recrutement. Gain de temps de 40% sur le sourcing.",
    name: "Aminata Koné",
    role: "DRH, Banque Atlantique",
  },
  {
    quote: "Un programme de formation structuré et adapté aux réalités africaines. Nos équipes sont devenues autonomes sur les outils IA.",
    name: "Jean-Marc Ouattara",
    role: "DSI, Orange CI",
  },
  {
    quote: "L'IA a révolutionné notre création de contenu. TransferAI Africa nous a accompagnés de A à Z.",
    name: "Fatou Diallo",
    role: "Directrice Marketing, Ecobank",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="temoignages" className="py-24 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Ils nous font <span className="text-gradient-coral">confiance</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.12} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
              <div className="bg-card border border-border rounded-xl p-8 hover-lift relative h-full">
                <Quote size={32} className="text-primary/20 mb-4" />
                <p className="text-card-foreground leading-relaxed mb-6 text-sm">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-gradient flex items-center justify-center font-heading font-bold text-sm" style={{ color: "hsl(0 0% 100%)" }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
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
