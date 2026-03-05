import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import logoMiddlesex from "@/assets/logo-middlesex.png";
import logoNettelecom from "@/assets/logo-nettelecom.png";
import logoFdfp from "@/assets/logo-fdfp.png";
import logoIads from "@/assets/logo-iads.png";
import logoSndi from "@/assets/logo-sndi.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";

const partnerNames = ["Middlesex University", "Nettelecom CI", "FDFP", "IADS", "SNDI"];
const partnerLogos = [logoMiddlesex, logoNettelecom, logoFdfp, logoIads, logoSndi];
const partnerColors = ["hsl(220 60% 50%)", "hsl(174 70% 42%)", "hsl(15 85% 57%)", "hsl(220 70% 30%)", "hsl(145 70% 35%)"];

const PartenairesPage = () => {
  const { t, language } = useLanguage();
  const trans = language === "fr" ? fr : en;
  const partnerItems = trans.partners.items;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageHeader title={t("partners.title")} subtitle={t("partners.subtitle")} badge={t("partners.badge")} />

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="space-y-10">
              {partnerItems.map((partner, i) => (
                <ScrollReveal key={partnerNames[i]} delay={i * 0.15} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover-lift">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-72 flex flex-col items-center justify-center p-8 gap-4" style={{ background: `${partnerColors[i]}08` }}>
                        <div className={`flex items-center justify-center rounded-xl bg-white ${partnerNames[i] === "SNDI" ? "w-64 h-52 p-3" : "w-56 h-44 p-5"}`}>
                          <img src={partnerLogos[i]} alt={`Logo ${partnerNames[i]}`} className={`max-w-full max-h-full object-contain ${partnerNames[i] === "SNDI" ? "scale-150" : ""}`} />
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${partnerColors[i]}15`, color: partnerColors[i] }}>
                          {partner.type}
                        </span>
                      </div>
                      <div className="flex-1 p-8">
                        <h3 className="font-heading text-2xl font-bold text-card-foreground mb-3">{partnerNames[i]}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">{partner.description}</p>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {partner.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-sm text-card-foreground">
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: partnerColors[i] }} />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary-foreground mb-4">{t("partners.becomePartner")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">{t("partners.becomePartnerDesc")}</p>
              <a href="/contact" className="bg-coral-gradient font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ color: "hsl(0 0% 100%)" }}>
                {t("partners.contactUs")} <ExternalLink size={18} />
              </a>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default PartenairesPage;
