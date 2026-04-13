import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ExternalLink,
  Handshake,
  Megaphone,
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
      "Découvrez les organisations qui accompagnent TransferAI Africa et la manière de proposer votre structure pour une présence sur notre écosystème.",
    badge: "Ecosystème TransferAI",
    introBadge: "Collaborer avec TransferAI Africa",
    introTitle: "Un écosystème construit sur la crédibilité, la cohérence et l'utilité",
    introText:
      "TransferAI Africa s'appuie sur des partenaires académiques, institutionnels et entreprises pour renforcer la qualité de son offre. Nous étudions aussi les demandes de visibilité d'organisations qui souhaitent apparaître sur notre site, dans un cadre éditorial cohérent et sélectif.",
    introPoints: [
      "Nos partenaires stratégiques renforcent la pédagogie, la crédibilité et la portée institutionnelle de l'offre.",
      "Les demandes de référencement sont étudiées au cas par cas selon l'alignement avec notre audience et notre ligne éditoriale.",
      "Chaque publication est relue et validée avant mise en ligne.",
    ],
    trustTitle: "Partenaires stratégiques déjà présents",
    trustDesc:
      "Ces partenariats structurent l'offre académique, institutionnelle et opérationnelle de TransferAI Africa.",
    modelsTitle: "Choisir le bon format de partenariat",
    models: [
      {
        title: "Partenariat stratégique",
        intent: "demande-renseignement",
        desc: "Pour les universités, institutions, organismes publics ou entreprises qui souhaitent co-construire une offre, soutenir un programme, porter une certification ou déployer des actions communes.",
        points: [
          "Co-développement de programmes ou d'événements",
          "Visibilité institutionnelle et éditoriale",
          "Accès à des actions communes à plus forte portée",
        ],
        cta: "Parler partenariat stratégique",
        icon: Handshake,
      },
      {
        title: "Présence & référencement",
        intent: "demande-referencement",
        desc: "Pour les organisations qui souhaitent présenter leur activité sur TransferAI Africa, bénéficier d'une vitrine crédible et toucher une audience orientée compétences, innovation et transformation IA.",
        points: [
          "Présence possible avec logo, texte, lien et angle de présentation",
          "Étude de la meilleure forme de visibilité selon votre profil",
          "Retour par email avec les modalités après revue du dossier",
        ],
        cta: "Demander un référencement",
        icon: Megaphone,
      },
    ],
    ctaTitle: "Choisir la bonne demande",
    ctaDesc:
      "Si votre organisation souhaite être visible sur TransferAI Africa ou construire un partenariat plus structurant, choisissez directement le bon parcours. Cela nous permet de vous répondre plus clairement et plus vite.",
    primaryCta: "Demander un référencement",
    secondaryCta: "Parler partenariat stratégique",
  },
  en: {
    title: "Partners & listing",
    subtitle:
      "Discover the organizations that already support TransferAI Africa and how to submit your own organization for visibility within our ecosystem.",
    badge: "TransferAI ecosystem",
    introBadge: "Working with TransferAI Africa",
    introTitle: "An ecosystem built on credibility, relevance, and usefulness",
    introText:
      "TransferAI Africa relies on academic, institutional, and corporate partners to strengthen the quality of its offer. We also review visibility requests from organizations that wish to appear on our site, within a selective and coherent editorial framework.",
    introPoints: [
      "Strategic partners strengthen pedagogy, credibility, and institutional reach.",
      "Listing requests are reviewed case by case based on audience fit and editorial relevance.",
      "Every publication goes through editorial validation before going live.",
    ],
    trustTitle: "Strategic partners already on board",
    trustDesc:
      "These partnerships support the academic, institutional, and operational positioning of TransferAI Africa.",
    modelsTitle: "Choose the right partnership format",
    models: [
      {
        title: "Strategic partnership",
        intent: "demande-renseignement",
        desc: "For universities, institutions, public organizations, or companies that want to co-build an offer, support a program, carry a certification, or run shared initiatives.",
        points: [
          "Co-development of programs or events",
          "Institutional and editorial visibility",
          "Access to higher-impact joint initiatives",
        ],
        cta: "Discuss strategic partnership",
        icon: Handshake,
      },
      {
        title: "Visibility & listing",
        intent: "demande-referencement",
        desc: "For organizations that want to present their activity on TransferAI Africa, benefit from a credible showcase, and reach an audience focused on skills, innovation, and AI transformation.",
        points: [
          "Possible presence with logo, text, link, and positioning angle",
          "Review of the most relevant visibility format for your profile",
          "Email follow-up with proposed options after review",
        ],
        cta: "Request listing",
        icon: Megaphone,
      },
    ],
    ctaTitle: "Choose the right request",
    ctaDesc:
      "If your organization wants visibility on TransferAI Africa or a more strategic collaboration, choose the right path directly. This helps us respond faster and with better clarity.",
    primaryCta: "Request listing",
    secondaryCta: "Discuss strategic partnership",
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
                        to={model.intent === "demande-referencement" ? buildContactPath(model.intent) : buildContactPath(model.intent, model.title)}
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
                    to={buildContactPath("demande-referencement")}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {copy.primaryCta}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to={buildContactPath("demande-renseignement", "Partenariat stratégique")}
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
