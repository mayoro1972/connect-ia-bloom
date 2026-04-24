import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import logoMiddlesex from "@/assets/logo-middlesex.png";
import logoNettelecom from "@/assets/logo-nettelecom.png";
import logoFdfp from "@/assets/logo-fdfp.png";
import logoIads from "@/assets/logo-iads.png";
import logoSndi from "@/assets/logo-sndi.png";
import logoPigier from "@/assets/logo-pigier.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { trackCtaClick } from "@/lib/analytics";

const partnerNames = ["Middlesex University", "Nettelecom CI", "FDFP", "IADS", "SNDI", "Pigier CI"];
const partnerLogos = [logoMiddlesex, logoNettelecom, logoFdfp, logoIads, logoSndi, logoPigier];

const sectionCopy = {
  fr: {
    badge: "Partenaires & preuves de confiance",
    title: "Une offre portée par des partenaires crédibles",
    subtitle:
      "Des partenaires académiques, institutionnels et entreprises qui renforcent la crédibilité de l'offre.",
    carouselIntro: "Une sélection de partenaires qui renforcent la portée académique, institutionnelle et opérationnelle de TransferAI.",
    carouselHint: "Glisser ou faire défiler",
    cta: "Voir tous nos partenaires",
  },
  en: {
    badge: "Partners & trust signals",
    title: "An offer backed by credible partners",
    subtitle:
      "Academic, institutional, public, and corporate partners that reinforce the credibility of the offer.",
    carouselIntro: "A selected group of partners that strengthens TransferAI's academic, institutional, and operational positioning.",
    carouselHint: "Drag or scroll",
    cta: "View all partners",
  },
} as const;

const HomeTrustSection = () => {
  const { language } = useLanguage();
  const copy = sectionCopy[resolveActiveLanguage(language)];

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.22em] text-primary">{copy.badge}</p>
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-5xl text-card-foreground">{copy.title}</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">{copy.subtitle}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="rounded-[28px] border border-border bg-card p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{copy.carouselIntro}</p>
              <p className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                {copy.carouselHint}
              </p>
            </div>

            <div className="-mx-2 overflow-x-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max gap-4">
                {partnerLogos.map((logo, index) => (
                  <div
                    key={partnerNames[index]}
                    className="flex min-h-[132px] w-[240px] shrink-0 items-center justify-center rounded-2xl border border-border bg-background px-6 py-6 md:w-[260px]"
                  >
                    <img
                      src={logo}
                      alt={partnerNames[index]}
                      className={`max-h-16 max-w-full object-contain ${partnerNames[index] === "SNDI" ? "scale-125" : ""}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.28} className="mt-10 text-center">
          <Link
            to="/partenaires"
            onClick={() =>
              trackCtaClick({
                ctaName: copy.cta,
                ctaLocation: "home_trust_section",
                destination: "/partenaires",
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-coral-gradient px-8 py-3 font-semibold transition-all hover:scale-105 hover:opacity-90"
            style={{ color: "hsl(0 0% 100%)" }}
          >
            {copy.cta}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HomeTrustSection;
