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

const partnerNames = ["Middlesex University", "Nettelecom CI", "FDFP", "IADS", "SNDI", "Pigier CI"];
const partnerLogos = [logoMiddlesex, logoNettelecom, logoFdfp, logoIads, logoSndi, logoPigier];

const sectionCopy = {
  fr: {
    badge: "Partenaires & preuves de confiance",
    title: "Une offre portée par des partenaires crédibles",
    subtitle:
      "TransferAI Africa s'appuie sur des partenaires académiques, institutionnels, publics et entreprises pour garantir la qualité, l'ancrage marché et la portée de ses formations.",
    proofs: [
      {
        title: "Crédibilité académique",
        desc: "Des alliances qui renforcent la qualité pédagogique, les standards et la valeur perçue des programmes.",
      },
      {
        title: "Ancrage Côte d'Ivoire",
        desc: "Des partenaires présents dans l'éducation, les télécoms, l'administration publique et la formation professionnelle.",
      },
      {
        title: "Impact concret",
        desc: "Des programmes pensés pour répondre aux réalités du terrain, des entreprises et des institutions africaines.",
      },
    ],
    cta: "Voir tous nos partenaires",
  },
  en: {
    badge: "Partners & trust signals",
    title: "An offer backed by credible partners",
    subtitle:
      "TransferAI Africa relies on academic, institutional, public, and corporate partners to guarantee the quality, market relevance, and reach of its training programs.",
    proofs: [
      {
        title: "Academic credibility",
        desc: "Partnerships that strengthen pedagogy, standards, and the perceived value of the programs.",
      },
      {
        title: "Côte d'Ivoire grounding",
        desc: "Partners active in education, telecom, public administration, and professional training.",
      },
      {
        title: "Concrete impact",
        desc: "Programs designed for the realities of the field, businesses, and African institutions.",
      },
    ],
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {partnerLogos.map((logo, index) => (
                <div
                  key={partnerNames[index]}
                  className="flex min-h-[116px] items-center justify-center rounded-2xl border border-border bg-background px-4 py-5"
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
        </ScrollReveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {copy.proofs.map((proof, index) => (
            <ScrollReveal key={proof.title} delay={0.12 + index * 0.08} direction="up">
              <div className="rounded-2xl border border-border bg-card p-6 hover-lift">
                <h3 className="mb-3 font-heading text-xl font-semibold text-card-foreground">{proof.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{proof.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.28} className="mt-10 text-center">
          <Link
            to="/partenaires"
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
