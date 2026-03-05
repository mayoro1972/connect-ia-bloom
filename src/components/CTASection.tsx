import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Download } from "lucide-react";

const CTASection = () => {
  return (
    <section id="cta" className="py-24 bg-navy-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6" style={{ color: "hsl(0 0% 96%)" }}>
            Prêt à transformer vos <span className="text-gradient-gold">équipes</span> ?
          </h2>
          <p className="text-lg mb-10" style={{ color: "hsl(220 20% 65%)" }}>
            Contactez-nous pour un devis personnalisé ou téléchargez notre catalogue complet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="bg-gold-gradient font-semibold px-8 py-3.5 rounded-lg text-navy-deep inline-flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105"
            >
              Demander un devis <ArrowRight size={18} />
            </a>
            <a
              href="#"
              className="font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 border transition-all hover:scale-105"
              style={{
                borderColor: "hsl(0 0% 100% / 0.2)",
                color: "hsl(0 0% 90%)",
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
