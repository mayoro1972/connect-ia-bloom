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
      local: { title: "Ancrage Côte d'Ivoire & Afrique", desc: "Une offre pensée pour les réalités locales, avec des cas d'usage adaptés aux entreprises et institutions du continent." },
      practical: { title: "Audit, gouvernance et exécution", desc: "TransferAI ne s'arrête pas à la sensibilisation : nous relions cadrage, montée en compétences, gouvernance des données sensibles et premiers usages concrets." },
      flexible: { title: "Une approche orientée résultat", desc: "L'objectif n'est pas de vendre l'IA en général, mais d'identifier les gains rapides les plus utiles à vos équipes, avec des garde-fous clairs." },
    },
  },
  en: {
    title1: "Why choose ",
    titleHighlight: "TransferAI",
    title2: " Africa?",
    reasons: {
      local: { title: "Côte d'Ivoire & Africa focus", desc: "An offer designed for local realities, with AI use cases adapted to companies and institutions across the continent." },
      practical: { title: "Audit, governance, and execution", desc: "TransferAI goes beyond awareness by connecting scoping, upskilling, sensitive data governance, and the first concrete business uses." },
      flexible: { title: "A results-oriented approach", desc: "The goal is not to sell AI in the abstract, but to identify the quickest wins that matter to your teams with clear guardrails." },
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
