import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileDown, Mail, Printer, ShieldCheck, Users, WandSparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { getDomainPreviewBySlug, getFormationsByDomain, getLocalizedDomainPreview } from "@/lib/catalogue-preview";
import { useFormationLocale } from "@/hooks/useFormationLocale";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { fixMojibake } from "@/lib/fixMojibake";

const levelCopy = {
  fr: {
    Debutant: "Acculturation et prise en main opérationnelle",
    Intermediaire: "Montée en puissance sur des cas d'usage métier concrets",
    Avance: "Déploiement, pilotage et transformation à l'échelle",
    fallback: "Montée en compétence métier guidée par des cas pratiques.",
  },
  en: {
    Debutant: "Operational onboarding and AI literacy",
    Intermediaire: "Stronger capability through concrete business use cases",
    Avance: "Deployment, governance and transformation at scale",
    fallback: "Business upskilling driven by practical use cases.",
  },
} as const;

const formatCopy = {
  fr: {
    Presentiel: "Animation immersive en atelier et cas pratiques",
    Hybride: "Mix présentiel/distanciel pour équipes multisites",
    "En ligne": "Session digitale guidée avec supports et démonstrations",
    fallback: "Animation adaptable au contexte du client.",
  },
  en: {
    Presentiel: "Immersive workshop delivery with hands-on cases",
    Hybride: "Blended delivery for distributed teams",
    "En ligne": "Guided digital session with materials and demonstrations",
    fallback: "Delivery adaptable to the client context.",
  },
} as const;

const pageCopy = {
  fr: {
    badge: "Catalogue domaine",
    notFound: "Catalogue introuvable",
    back: "Retour aux catalogues",
    backDomain: "Retour aux catalogues par domaine",
    print: "Imprimer / PDF",
    request: "Demander ce catalogue",
    summaryBadge: "Résumé catalogue",
    summaryTitle: "Ce que contient la brochure du domaine",
    audience: "Publics concernés",
    outcomes: "Résultats attendus",
    infoBadge: "Informations à faire figurer",
    positioning: "Positionnement commercial",
    positioningText:
      'Les tarifs ne sont pas affichés dans cette version du catalogue. Chaque brochure indique "Tarif communiqué sur demande" afin de qualifier le besoin, le format, le volume de participants et la modalité d\'intervention.',
    requestDomain: "Demander le catalogue de ce domaine",
    appointment: "Réserver un audit gratuit",
    detailsBadge: "Contenu détaillé du catalogue",
    detailsSuffix: "formations présentées dans ce domaine",
    exportText: "Chaque fiche peut ensuite être exportée en PDF domaine par domaine.",
    brochure: "Informations brochure",
    brochureItems: [
      "Tarif communiqué sur demande",
      "Session intra ou inter selon besoin",
      "Supports remis aux participants",
      "Attestation ou certificat selon le format retenu",
    ],
  },
  en: {
    badge: "Domain catalogue",
    notFound: "Catalogue not found",
    back: "Back to catalogues",
    backDomain: "Back to domain catalogues",
    print: "Print / PDF",
    request: "Request this catalogue",
    summaryBadge: "Catalogue summary",
    summaryTitle: "What the brochure contains",
    audience: "Target audiences",
    outcomes: "Expected outcomes",
    infoBadge: "Items included in the brochure",
    positioning: "Commercial positioning",
    positioningText:
      'Pricing is not shown in this catalogue version. Each brochure states "Pricing available on request" in order to qualify the need, format, participant volume and delivery model.',
    requestDomain: "Request this domain catalogue",
    appointment: "Book a free audit",
    detailsBadge: "Detailed catalogue content",
    detailsSuffix: "courses presented in this domain",
    exportText: "Each course sheet can later be exported as a domain-specific PDF.",
    brochure: "Brochure information",
    brochureItems: [
      "Pricing available on request",
      "In-house or open-enrollment session depending on the need",
      "Learning materials provided",
      "Attendance certificate or certification depending on the selected format",
    ],
  },
} as const;

const CatalogueDomainPreview = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const activeLanguage = resolveActiveLanguage(language);
  const copy = pageCopy[activeLanguage];
  const preview = getDomainPreviewBySlug(slug);
  const { getTitle, getDuration, getFormat, getLevel } = useFormationLocale();

  if (!preview) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-32 text-center">
            <h1 className="font-heading text-3xl font-bold text-card-foreground">{copy.notFound}</h1>
            <Link to="/catalogues-domaines" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft size={16} /> {copy.back}
            </Link>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const localizedPreview = getLocalizedDomainPreview(preview, activeLanguage);
  const formations = getFormationsByDomain(preview.domain);

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={copy.badge} title={localizedPreview.domain} subtitle={localizedPreview.headline} />

        <section className="py-12">
          <div className="container mx-auto space-y-10 px-4 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Link to="/catalogues-domaines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <ArrowLeft size={16} /> {copy.backDomain}
              </Link>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted"
                >
                  <Printer size={16} /> {copy.print}
                </button>
                <Link
                  to={`/contact?domain=${encodeURIComponent(preview.domain)}&intent=demande-catalogue`}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-5 py-2.5 text-sm font-semibold"
                  style={{ color: "hsl(0 0% 100%)" }}
                >
                  <FileDown size={16} /> {copy.request}
                </Link>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-3xl border border-border bg-card/80 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.summaryBadge}</p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{copy.summaryTitle}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{localizedPreview.summary}</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-background/80 p-5">
                    <div className="flex items-center gap-2 font-semibold text-card-foreground">
                      <Users size={16} className="text-primary" /> {copy.audience}
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {localizedPreview.audience.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-5">
                    <div className="flex items-center gap-2 font-semibold text-card-foreground">
                      <WandSparkles size={16} className="text-primary" /> {copy.outcomes}
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {localizedPreview.outcomes.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card/80 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.infoBadge}</p>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {localizedPreview.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ShieldCheck size={15} className="mt-0.5 text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-border bg-card/80 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.positioning}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.positioningText}</p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      to={`/contact?domain=${encodeURIComponent(preview.domain)}&intent=demande-catalogue`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted"
                    >
                      <Mail size={16} /> {copy.requestDomain}
                    </Link>
                    <Link
                      to={`/prise-rdv?domain=${encodeURIComponent(preview.domain)}&source=brochure`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                    >
                      {copy.appointment} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/80 p-7">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.detailsBadge}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">
                    {formations.length} {copy.detailsSuffix}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">{copy.exportText}</p>
              </div>

              <div className="mt-6 space-y-4">
                {formations.map((formation) => {
                  const level = getLevel(formation);
                  const format = getFormat(formation);
                  const levelDescription = levelCopy[activeLanguage][level as keyof (typeof levelCopy)["fr"]] ?? levelCopy[activeLanguage].fallback;
                  const formatDescription = formatCopy[activeLanguage][format as keyof (typeof formatCopy)["fr"]] ?? formatCopy[activeLanguage].fallback;

                  return (
                    <article key={formation.id} className="rounded-2xl border border-border bg-background/80 p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                              {formation.id.toUpperCase()}
                            </span>
                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{level}</span>
                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{format}</span>
                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{getDuration(formation)}</span>
                          </div>
                          <h3 className="mt-4 font-heading text-xl font-bold text-card-foreground">{getTitle(formation)}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {levelDescription} {formatDescription}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {formation.tags.map((tag) => (
                              <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                                {fixMojibake(tag)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="min-w-[220px] rounded-2xl border border-primary/15 bg-primary/5 p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.brochure}</p>
                          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            {copy.brochureItems.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CatalogueDomainPreview;
