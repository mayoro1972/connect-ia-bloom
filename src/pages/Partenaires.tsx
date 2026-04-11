import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock3,
  ExternalLink,
  FileText,
  Handshake,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import logoPigier from "@/assets/logo-pigier.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { buildContactPath } from "@/lib/site-links";

const partnerNames = ["Middlesex University", "Nettelecom CI", "FDFP", "IADS", "SNDI", "Pigier CI"];
const partnerLogos = [logoMiddlesex, logoNettelecom, logoFdfp, logoIads, logoSndi, logoPigier];
const partnerColors = [
  "hsl(220 60% 50%)",
  "hsl(174 70% 42%)",
  "hsl(15 85% 57%)",
  "hsl(220 70% 30%)",
  "hsl(145 70% 35%)",
  "hsl(215 80% 25%)",
];

const pageCopy = {
  fr: {
    title: "Partenaires & référencement",
    subtitle:
      "Une page claire pour distinguer nos partenaires stratégiques, nos collaborations institutionnelles et les demandes de visibilité sur TransferAI Africa.",
    badge: "Ecosystème TransferAI",
    introBadge: "Comment nous structurons les partenariats",
    introTitle: "Deux logiques différentes, une seule exigence de qualité",
    introText:
      "Nous séparons volontairement les partenaires stratégiques des demandes de référencement visibilité. Cela protège la crédibilité de la marque, clarifie l'offre et permet aux entreprises de choisir la bonne formule.",
    introPoints: [
      "Les partenaires stratégiques renforcent la pédagogie, la crédibilité et la portée institutionnelle de l'offre.",
      "Le référencement visibilité est une offre encadrée pour les organisations qui souhaitent gagner en exposition auprès de notre audience.",
      "Chaque publication passe par une validation éditoriale avant mise en ligne.",
    ],
    trustTitle: "Partenaires stratégiques déjà présents",
    trustDesc:
      "Ces partenariats structurent l'offre académique, institutionnelle et opérationnelle de TransferAI Africa.",
    modelsTitle: "Choisir le bon format de partenariat",
    models: [
      {
        title: "Partenariat stratégique",
        desc: "Pour les universités, institutions, organismes publics ou entreprises qui souhaitent co-construire une offre, soutenir une cohorte, porter une certification ou déployer des actions communes.",
        points: [
          "Co-développement de programmes ou d'événements",
          "Visibilité institutionnelle et éditoriale",
          "Accès à des actions communes à plus forte portée",
        ],
        cta: "Parler partenariat stratégique",
        icon: Handshake,
      },
      {
        title: "Référencement visibilité",
        desc: "Pour les organisations qui veulent apparaître sur le site, bénéficier d'une vitrine crédible et toucher un public orienté compétences, innovation et transformation IA.",
        points: [
          "Logo, description, lien et présence sur la page partenaires",
          "Possibilité de mise en avant renforcée selon la formule",
          "Cadre clair sur la durée, les contenus et la validation",
        ],
        cta: "Demander un référencement",
        icon: Megaphone,
      },
    ],
    offersTitle: "Formules de référencement recommandées",
    offersDesc:
      "Proposition éditoriale et commerciale de départ. Ces montants peuvent ensuite être ajustés selon la portée, le trafic et les contreparties.",
    offers: [
      {
        title: "Essentiel",
        duration: "3 mois",
        price: "150 000 FCFA",
        features: [
          "Logo + présentation courte",
          "Lien vers le site ou la page de contact",
          "Présence standard sur la page partenaires",
        ],
      },
      {
        title: "Visibilité",
        duration: "6 mois",
        price: "250 000 FCFA",
        features: [
          "Logo + présentation enrichie",
          "Lien + secteur + proposition de valeur",
          "Positionnement renforcé sur la page",
        ],
      },
      {
        title: "Premium",
        duration: "12 mois",
        price: "420 000 FCFA",
        features: [
          "Logo + texte éditorial + lien",
          "Mise en avant prioritaire",
          "Possibilité de relais dans un contenu ou une newsletter selon validation",
        ],
      },
    ],
    frameworkTitle: "Cadre de publication",
    framework: [
      {
        title: "Délais indicatifs",
        desc: "Comptez en général 7 à 10 jours ouvrés entre la réception du dossier complet, la validation et la mise en ligne.",
        icon: Clock3,
      },
      {
        title: "Informations à fournir",
        desc: "Logo HD, nom officiel, secteur, texte court, lien web, contact, pays, proposition de valeur et objectif de la présence sur le site.",
        icon: FileText,
      },
      {
        title: "Règle éditoriale",
        desc: "Nous publions par défaut plus qu'un simple logo : une présence crédible comprend au minimum un logo, un texte court et un lien utile.",
        icon: ShieldCheck,
      },
    ],
    publishTitle: "Ce qui peut être publié",
    publishItems: [
      "Logo de l'organisation",
      "Présentation courte ou enrichie selon la formule",
      "Lien vers le site, une landing page ou un contact",
      "Secteur, pays et angle de collaboration",
      "Éventuelle bannière ou mise en avant premium selon validation",
    ],
    ctaTitle: "Préparer une demande partenaire propre",
    ctaDesc:
      "Si tu veux, la prochaine étape logique sera de brancher un vrai formulaire “Devenir partenaire / Demander un référencement” avec collecte des assets, choix de formule et validation interne.",
    primaryCta: "Lancer la demande",
    secondaryCta: "Parler à l'équipe",
  },
  en: {
    title: "Partners & listing",
    subtitle:
      "A clearer page to separate strategic partners, institutional collaborations, and paid visibility requests on TransferAI Africa.",
    badge: "TransferAI ecosystem",
    introBadge: "How we structure partnerships",
    introTitle: "Two different models, one quality standard",
    introText:
      "We intentionally separate strategic partners from visibility listing requests. This protects brand credibility, clarifies the offer, and helps organizations choose the right format.",
    introPoints: [
      "Strategic partners strengthen pedagogy, credibility, and institutional reach.",
      "Visibility listing is a framed offer for organizations that want exposure to our audience.",
      "Every publication goes through editorial validation before going live.",
    ],
    trustTitle: "Strategic partners already on board",
    trustDesc:
      "These partnerships support the academic, institutional, and operational positioning of TransferAI Africa.",
    modelsTitle: "Choose the right partnership format",
    models: [
      {
        title: "Strategic partnership",
        desc: "For universities, institutions, public organizations, or companies that want to co-build an offer, support a cohort, carry a certification, or run shared initiatives.",
        points: [
          "Co-development of programs or events",
          "Institutional and editorial visibility",
          "Access to higher-impact joint initiatives",
        ],
        cta: "Discuss strategic partnership",
        icon: Handshake,
      },
      {
        title: "Visibility listing",
        desc: "For organizations that want to appear on the site, benefit from a credible showcase, and reach an audience focused on skills, innovation, and AI transformation.",
        points: [
          "Logo, description, link, and presence on the partners page",
          "Stronger featured placement depending on the package",
          "Clear framework on duration, content, and validation",
        ],
        cta: "Request listing",
        icon: Megaphone,
      },
    ],
    offersTitle: "Recommended listing packages",
    offersDesc:
      "This is a strong starting editorial and commercial proposal. Pricing can later be adjusted based on reach, traffic, and agreed visibility.",
    offers: [
      {
        title: "Essential",
        duration: "3 months",
        price: "150,000 FCFA",
        features: [
          "Logo + short presentation",
          "Link to website or contact page",
          "Standard placement on the partners page",
        ],
      },
      {
        title: "Visibility",
        duration: "6 months",
        price: "250,000 FCFA",
        features: [
          "Logo + enriched presentation",
          "Link + sector + value proposition",
          "Enhanced positioning on the page",
        ],
      },
      {
        title: "Premium",
        duration: "12 months",
        price: "420,000 FCFA",
        features: [
          "Logo + editorial text + link",
          "Priority featured placement",
          "Optional relay in a content piece or newsletter subject to approval",
        ],
      },
    ],
    frameworkTitle: "Publishing framework",
    framework: [
      {
        title: "Indicative timeline",
        desc: "In most cases, expect 7 to 10 business days between receiving the full file, validation, and publication.",
        icon: Clock3,
      },
      {
        title: "Information required",
        desc: "HD logo, official name, sector, short text, website link, contact, country, value proposition, and objective of the listing.",
        icon: FileText,
      },
      {
        title: "Editorial rule",
        desc: "We recommend more than a logo-only presence: a credible listing should include at least a logo, a short text, and a useful link.",
        icon: ShieldCheck,
      },
    ],
    publishTitle: "What can be published",
    publishItems: [
      "Organization logo",
      "Short or enriched presentation depending on the package",
      "Link to website, landing page, or contact",
      "Sector, country, and collaboration angle",
      "Optional banner or premium feature subject to approval",
    ],
    ctaTitle: "Prepare a clean partner request",
    ctaDesc:
      "The next useful step would be to connect a dedicated “Become a partner / Request listing” form with asset collection, package selection, and internal validation.",
    primaryCta: "Start the request",
    secondaryCta: "Talk to the team",
  },
} as const;

const PartenairesPage = () => {
  const { language } = useLanguage();
  const trans = language === "fr" ? fr : en;
  const strategicPartners = trans.partners.items;
  const copy = language === "en" ? pageCopy.en : pageCopy.fr;

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={copy.title} subtitle={copy.subtitle} badge={copy.badge} />

        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mb-10 md:mb-12 rounded-[28px] border border-border bg-card p-6 md:p-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <BadgeCheck size={14} />
                {copy.introBadge}
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <h2 className="mb-4 font-heading text-2xl font-bold text-card-foreground md:text-3xl">{copy.introTitle}</h2>
                  <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">{copy.introText}</p>
                </div>

                <div className="grid gap-3">
                  {copy.introPoints.map((item) => (
                    <div key={item} className="rounded-2xl border border-border bg-background px-4 py-3.5 md:py-4">
                      <p className="text-sm leading-7 text-card-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-16">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Building2 size={22} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.trustTitle}</h2>
                  <p className="text-sm text-muted-foreground">{copy.trustDesc}</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {strategicPartners.map((partner, i) => (
                  <ScrollReveal key={partnerNames[i]} delay={i * 0.08} direction={i % 2 === 0 ? "left" : "right"}>
                    <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 md:p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
                      <div className="mb-4 md:mb-5 flex items-start gap-3 md:gap-4">
                        <div
                          className={`flex shrink-0 items-center justify-center rounded-2xl bg-white ${
                            partnerNames[i] === "SNDI" ? "h-20 w-24 p-2.5 md:h-28 md:w-32 md:p-3" : "h-16 w-20 p-3 md:h-24 md:w-28 md:p-4"
                          }`}
                          style={{ boxShadow: `inset 0 0 0 1px ${partnerColors[i]}18` }}
                        >
                          <img
                            src={partnerLogos[i]}
                            alt={`Logo ${partnerNames[i]}`}
                            className={`max-h-full max-w-full object-contain ${partnerNames[i] === "SNDI" ? "scale-125" : ""}`}
                          />
                        </div>

                        <div className="min-w-0">
                          <span
                            className="mb-2 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold md:text-xs"
                            style={{ background: `${partnerColors[i]}15`, color: partnerColors[i] }}
                          >
                            {partner.type}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-card-foreground md:text-xl">{partnerNames[i]}</h3>
                        </div>
                      </div>

                      <p className="mb-5 text-sm leading-6 text-muted-foreground md:leading-7">{partner.description}</p>

                      <ul className="grid gap-3 sm:grid-cols-2">
                        {partner.highlights.slice(0, 4).map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-card-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: partnerColors[i] }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div className="mb-12 md:mb-16 rounded-[28px] border border-border bg-card p-6 md:p-10">
              <h2 className="mb-8 font-heading text-2xl font-bold text-card-foreground">{copy.modelsTitle}</h2>

              <div className="grid gap-6 xl:grid-cols-2">
                {copy.models.map((model, index) => {
                  const Icon = model.icon;

                  return (
                    <motion.div
                      key={model.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="flex h-full flex-col rounded-3xl border border-border bg-background p-6"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon size={22} className="text-primary" />
                      </div>

                      <h3 className="mb-3 font-heading text-xl font-bold text-card-foreground">{model.title}</h3>
                      <p className="mb-5 text-sm leading-7 text-muted-foreground">{model.desc}</p>

                      <div className="flex-1">
                        <ul className="space-y-3">
                          {model.points.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-card-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        to={buildContactPath("contact-devis", model.title)}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
                      >
                        {model.cta}
                        <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-12 md:mb-16">
              <div className="mb-6">
                <h2 className="mb-2 font-heading text-2xl font-bold text-card-foreground">{copy.offersTitle}</h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{copy.offersDesc}</p>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                {copy.offers.map((offer, index) => (
                  <motion.div
                    key={offer.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex h-full flex-col rounded-3xl border border-border bg-card p-6"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{offer.duration}</p>
                        <h3 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{offer.title}</h3>
                      </div>
                      <div className="rounded-2xl bg-primary/10 px-4 py-2 text-right">
                        <p className="text-sm font-semibold text-primary">{offer.price}</p>
                      </div>
                    </div>

                    <ul className="flex-1 space-y-3">
                      {offer.features.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-card-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-12 md:mb-16 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-border bg-card p-6 md:p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-card-foreground">{copy.frameworkTitle}</h2>

                <div className="grid gap-4">
                  {copy.framework.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="rounded-2xl border border-border bg-background p-5">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <h3 className="mb-2 font-heading text-lg font-bold text-card-foreground">{item.title}</h3>
                        <p className="text-sm leading-7 text-muted-foreground">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-border bg-card p-6 md:p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <BadgeCheck size={22} className="text-primary" />
                </div>
                <h2 className="mb-5 font-heading text-2xl font-bold text-card-foreground">{copy.publishTitle}</h2>

                <ul className="space-y-3">
                  {copy.publishItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-card-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-12 md:py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center lg:px-8">
            <ScrollReveal>
              <div className="rounded-[28px] border border-border bg-card p-6 md:p-10">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Handshake size={24} className="text-primary" />
                </div>
                <h2 className="mb-4 font-heading text-2xl font-bold text-card-foreground">{copy.ctaTitle}</h2>
                <p className="mx-auto mb-8 max-w-2xl text-sm leading-7 text-muted-foreground">{copy.ctaDesc}</p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to={buildContactPath("contact-devis", "Partenariats & referencement")}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {copy.primaryCta}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to={buildContactPath("demande-renseignement", "Partenariats")}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-background"
                  >
                    {copy.secondaryCta}
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default PartenairesPage;
