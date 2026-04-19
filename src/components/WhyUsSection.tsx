import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Wrench, Laptop } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";

const icons = [MapPin, Wrench, Laptop];
const keys = ["local", "practical", "flexible"] as const;

const sectionCopy = {
  fr: {
    title1: "Pourquoi choisir ",
    titleHighlight: "TransferAI",
    title2: " Africa ?",
    reasons: {
      local: { title: "Ancrage Côte d'Ivoire & Afrique", desc: "Une offre pensée pour les réalités locales, portée par la diaspora et orientée vers l'impact sur le continent." },
      practical: { title: "Formation utile et appliquée", desc: "Des cas concrets, des outils directement mobilisables et une pédagogie tournée vers le résultat métier." },
      flexible: { title: "Des parcours pour particuliers et entreprises", desc: "Catalogue, parcours, certification, formats live et formation d'équipes : chacun peut trouver le bon niveau d'entrée." },
    },
  },
  en: {
    title1: "Why choose ",
    titleHighlight: "TransferAI",
    title2: " Africa?",
    reasons: {
      local: { title: "Côte d'Ivoire & Africa focus", desc: "An offer designed for local realities, powered by the diaspora and focused on tangible impact across the continent." },
      practical: { title: "Useful, applied training", desc: "Concrete use cases, directly usable tools, and a pedagogy focused on professional outcomes." },
      flexible: { title: "Paths for individuals and companies", desc: "Catalogue, guided paths, certification, live formats, and team training so everyone can find the right entry point." },
    },
  },
} as const;

const WhyUsSection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];

  return (
    <section id="pourquoi" className="bg-indigo-gradient py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-8 text-center md:mb-10">
          <h2 className="font-heading text-2xl font-bold md:text-4xl" style={{ color: "hsl(0 0% 98%)" }}>
            {copy.title1}
            <span className="text-gradient-orange">{copy.titleHighlight}</span>
            {copy.title2}
          </h2>
        </ScrollReveal>

        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <ScrollReveal key={key} delay={i * 0.15} direction="up" className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-gradient transition-transform duration-300 hover:scale-110">
                  <Icon size={22} style={{ color: "hsl(0 0% 100%)" }} />
                </div>
                <h3 className="mb-2 font-heading text-base font-semibold md:text-lg" style={{ color: "hsl(0 0% 98%)" }}>
                  {copy.reasons[key].title}
                </h3>
                <p className="text-sm leading-6" style={{ color: "hsl(210 20% 70%)" }}>
                  {copy.reasons[key].desc}
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
