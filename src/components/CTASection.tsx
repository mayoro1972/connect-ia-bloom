import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Download } from "lucide-react";
import ctaBg from "@/assets/cta-bg.jpg";

const CTASection = () => {
  return (
    <section id="cta" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={ctaBg} alt="" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(225 55% 10% / 0.88), hsl(174 70% 20% / 0.85))",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6" style={{ color: "hsl(0 0% 98%)" }}>
            Prêt à transformer vos <span className="text-gradient-coral">équipes</span> ?
          </h2>
          <p className="text-lg mb-10" style={{ color: "hsl(210 20% 75%)" }}>
            Contactez-nous pour un devis personnalisé ou téléchargez notre catalogue complet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="bg-coral-gradient font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105"
              style={{ color: "hsl(0 0% 100%)" }}
            >
              Demander un devis <ArrowRight size={18} />
            </a>
            <a
              href="#"
              className="font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 border transition-all hover:scale-105"
              style={{
                borderColor: "hsl(0 0% 100% / 0.25)",
                color: "hsl(0 0% 95%)",
              }}
            >
              <Download size={18} /> Télécharger le catalogue
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
