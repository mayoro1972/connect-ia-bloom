import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Wrench, Laptop } from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    title: "Expertise Locale",
    desc: "Des formateurs qui comprennent les défis et opportunités du marché africain.",
  },
  {
    icon: Wrench,
    title: "Approche Pratique",
    desc: "80% de pratique, des cas d'usage réels issus d'entreprises africaines.",
  },
  {
    icon: Laptop,
    title: "Formats Flexibles",
    desc: "Présentiel, hybride ou en ligne. Nous nous adaptons à vos contraintes.",
  },
];

const WhyUsSection = () => {
  return (
    <section id="pourquoi" className="py-24 bg-navy-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4" style={{ color: "hsl(0 0% 96%)" }}>
            Pourquoi choisir l'Académie IA <span className="text-gradient-gold">Afrique</span> ?
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reasons.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.15} direction="up" className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-300">
                <r.icon size={28} className="text-navy-deep" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: "hsl(0 0% 96%)" }}>
                {r.title}
              </h3>
              <p style={{ color: "hsl(220 20% 65%)" }} className="leading-relaxed">
                {r.desc}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
