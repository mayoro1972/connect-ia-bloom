import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Download } from "lucide-react";
import ctaBg from "@/assets/cta-bg.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { trackCtaClick } from "@/lib/analytics";
import { buildContactPath } from "@/lib/site-links";

const sectionCopy = {
  fr: {
    title1: "Prêt à faire de l'",
    titleHighlight: "IA",
    title2: " ?",
    subtitle: "Choisissez le bon prochain pas : former vos équipes, découvrir les parcours ou parler à un expert IA.",
    button: "Parler à un expert IA",
    catalogue: "Demander un catalogue",
  },
  en: {
    title1: "Ready to turn ",
    titleHighlight: "AI",
    title2: "?",
    subtitle: "Choose the right next step: train your teams, explore the paths, or speak with an AI expert.",
    button: "Speak with an AI expert",
    catalogue: "Request a catalogue",
  },
} as const;

const CTASection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];

  return (
    <section id="cta" className="relative overflow-hidden py-24">
      <div className="absolute inset-0">
        <img src={ctaBg} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(225 55% 10% / 0.93), hsl(30 80% 28% / 0.86))" }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2
            className="mb-6 font-heading text-3xl font-bold leading-tight md:text-5xl"
            style={{ color: "hsl(0 0% 98%)", textShadow: "0 3px 18px rgba(15, 23, 42, 0.35)" }}
          >
            {copy.title1}
            <span className="text-gradient-orange">{copy.titleHighlight}</span>
            {copy.title2}
          </h2>
          <p
            className="mb-10 text-lg font-medium"
            style={{ color: "#F8F3EC", textShadow: "0 2px 12px rgba(15, 23, 42, 0.4)" }}
          >
            {copy.subtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={buildContactPath("demande-renseignement")}
              onClick={() =>
                trackCtaClick({
                  ctaName: copy.button,
                  ctaLocation: "home_final_cta",
                  destination: buildContactPath("demande-renseignement"),
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-8 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.14em] text-white transition-all hover:scale-105 hover:opacity-95"
            >
              {copy.button} <ArrowRight size={18} />
            </Link>
            <Link
              to="/demande-catalogue"
              onClick={() =>
                trackCtaClick({
                  ctaName: copy.catalogue,
                  ctaLocation: "home_final_cta",
                  destination: "/demande-catalogue",
                })
              }
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-8 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.14em] text-white/95 transition-all hover:scale-105 hover:bg-white/[0.08]"
            >
              <Download size={18} /> {copy.catalogue}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
