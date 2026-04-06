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
      local: { title: "Expertise Locale", desc: "Des formateurs qui comprennent les défis et opportunités du marché africain." },
      practical: { title: "Approche Pratique", desc: "80% de pratique, des cas d'usage réels issus d'entreprises africaines." },
      flexible: { title: "Formats Flexibles", desc: "Présentiel, hybride ou en ligne. Nous nous adaptons à vos contraintes." },
    },
  },
  en: {
    title1: "Why choose ",
    titleHighlight: "TransferAI",
    title2: " Africa?",
    reasons: {
      local: { title: "Local Expertise", desc: "Trainers who understand the challenges and opportunities of the African market." },
      practical: { title: "Hands-On Approach", desc: "80% practical work, real use cases from African businesses." },
      flexible: { title: "Flexible Formats", desc: "On-site, hybrid or online. We adapt to your constraints." },
    },
  },
} as const;

const WhyUsSection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];

  return (
    <section id="pourquoi" className="bg-indigo-gradient py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-16 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl" style={{ color: "hsl(0 0% 98%)" }}>
            {copy.title1}
            <span className="text-gradient-orange">{copy.titleHighlight}</span>
            {copy.title2}
          </h2>
        </ScrollReveal>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <ScrollReveal key={key} delay={i * 0.15} direction="up" className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-gradient transition-transform duration-300 hover:scale-110">
                  <Icon size={28} style={{ color: "hsl(0 0% 100%)" }} />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold" style={{ color: "hsl(0 0% 98%)" }}>
                  {copy.reasons[key].title}
                </h3>
                <p className="leading-relaxed" style={{ color: "hsl(210 20% 70%)" }}>
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
