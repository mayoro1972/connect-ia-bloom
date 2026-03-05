import { useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import CatalogueDownloadModal from "@/components/CatalogueDownloadModal";
import { ArrowRight, Download } from "lucide-react";
import ctaBg from "@/assets/cta-bg.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <>
    <section id="cta" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={ctaBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(225 55% 10% / 0.88), hsl(30 80% 30% / 0.8))" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6" style={{ color: "hsl(0 0% 98%)" }}>
            {t("cta.title1")}<span className="text-gradient-orange">{t("cta.titleHighlight")}</span>{t("cta.title2")}
          </h2>
          <p className="text-lg mb-10" style={{ color: "hsl(210 20% 75%)" }}>
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="bg-orange-gradient font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105" style={{ color: "hsl(0 0% 100%)" }}>
              {t("cta.button")} <ArrowRight size={18} />
            </Link>
            <button onClick={() => setDownloadOpen(true)} className="font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 border transition-all hover:scale-105" style={{ borderColor: "hsl(0 0% 100% / 0.25)", color: "hsl(0 0% 95%)" }}>
              <Download size={18} /> {t("cta.catalogue")}
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
    <CatalogueDownloadModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </>
  );
};

export default CTASection;
