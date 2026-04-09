import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, Clock3, FileText, MessageSquareText, ShieldCheck, Sparkles, Users, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { buildAppointmentMailto } from "@/lib/prospect-emails";
import { getLocalizedDomainLabel } from "@/lib/catalogue-preview";
import { useLanguage } from "@/i18n/LanguageContext";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { appointmentBookings, directLinks, type AppointmentSource } from "@/lib/site-links";
import { trackAnalyticsEvent } from "@/lib/analytics";

const appointmentCopy = {
  fr: {
    sourceLabels: {
      "demande-catalogue": "Demande de catalogue",
      "demande-renseignement": "Demande de renseignement",
      "contact-devis": "Demande de contact / devis",
      brochure: "Consultation du catalogue domaine",
    },
    pageBadge: "Prise de RDV",
    pageSubtitle: "Modèle de rendez-vous proposé après une demande de catalogue, une demande de renseignement ou une demande de devis.",
    back: "Retour aux formulaires",
    linkedRequest: "Demande associée",
    contextTitle: "Contexte du rendez-vous",
    source: "Source",
    name: "Nom",
    organization: "Organisation",
    domain: "Domaine",
    editorialModel: "Modèle éditorial",
    introTitle: "Texte d'introduction proposé",
    agenda: "Agenda suggéré",
    connectLabel: "Lien à connecter",
    connectTitle: "Calendrier de réservation",
    prospectMessage: "Message affiché au prospect",
    cta: "Choisir un créneau",
    openExternal: "Ouvrir dans Calendly",
    liveEmbed: "Réservation instantanée",
    routeLabel: "Parcours actif",
    eventType: "Type de rendez-vous",
    platform: "Plateforme",
    platformValue: "Calendly + Google Meet",
    reassuranceTitle: "Pourquoi ce format fonctionne",
    reassuranceItems: [
      "Le prospect reserve sans quitter ton univers de marque.",
      "Le type de rendez-vous reste adapte au contexte de la demande.",
      "Un lien externe reste disponible si l'embed ne charge pas.",
    ],
    eventTypeLabels: {
      "demande-catalogue": "Découverte catalogue",
      "demande-renseignement": "Qualification besoin",
      "contact-devis": "Préparation devis",
      brochure: "Suivi brochure domaine",
    },
    duration: "Durée conseillée",
    durationText: "20 à 30 minutes pour un premier cadrage, avec possibilité d'un second échange si nécessaire.",
    participants: "Participants",
    participantsText: "Décideur métier, RH, responsable formation ou sponsor projet selon le type de demande.",
    alternative: "Alternative rapide",
    alternativeText: "Un lien WhatsApp ou email peut aussi être affiché pour les prospects qui préfèrent un échange direct.",
    status: "Statut",
    statusText: "Modèle prêt à être relié au calendrier final après validation du wording et de la structure.",
    fallbackDomain: "Non précisé",
    fallbackCompany: "Organisation à préciser",
    fallbackName: "Prospect",
    variants: {
      "demande-catalogue": {
        title: "RDV de découverte catalogue",
        intro:
          "Ce rendez-vous sert à aider le prospect à sélectionner les formations les plus pertinentes dans le domaine demandé, à préciser les priorités et à préparer la suite de l'échange.",
        agenda: [
          "Comprendre le contexte métier et le public cible",
          "Identifier les formations prioritaires dans le domaine demandé",
          "Valider le format, le niveau et la temporalité souhaités",
          "Proposer la suite : devis, programme ou second échange",
        ],
        confirmation:
          "Merci pour votre intérêt. Choisissez un créneau de 20 à 30 minutes pour parcourir le catalogue avec un conseiller formation.",
      },
      "demande-renseignement": {
        title: "RDV de cadrage besoin",
        intro:
          "Ce rendez-vous est conçu pour un prospect qui sait ce qu'il veut améliorer, mais pas encore quelle formation choisir. Il permet d'orienter la demande vers le bon domaine et le bon parcours.",
        agenda: [
          "Clarifier le besoin et le résultat attendu",
          "Faire émerger le domaine ou les domaines prioritaires",
          "Recommander un premier parcours de formation",
          "Décider des prochaines étapes",
        ],
        confirmation:
          "Merci pour votre demande. Choisissez maintenant un créneau pour que nous puissions qualifier votre besoin et vous orienter vers la bonne offre.",
      },
      "contact-devis": {
        title: "RDV de préparation devis",
        intro:
          "Ce modèle de rendez-vous intervient lorsqu'un besoin est déjà structuré. L'objectif est de valider les paramètres de l'intervention pour préparer une proposition commerciale adaptée.",
        agenda: [
          "Confirmer le domaine et les formations ciblées",
          "Valider le volume de participants et la modalité d'intervention",
          "Préciser le niveau visé, les contraintes et le calendrier",
          "Préparer la proposition et les options d'accompagnement",
        ],
        confirmation:
          "Merci pour votre demande. Réservez un échange de cadrage afin que nous préparions une proposition ajustée à votre besoin.",
      },
      brochure: {
        title: "RDV après lecture de brochure",
        intro:
          "Le prospect a déjà consulté une brochure domaine. Le rendez-vous doit donc être bref, rassurant et très orienté vers la priorisation des formations et la modalité adaptée.",
        agenda: [
          "Vérifier les formations qui ont retenu l'attention",
          "Qualifier le besoin exact",
          "Valider le format et la temporalité",
          "Décider de la suite du parcours",
        ],
        confirmation: "Choisissez un créneau de cadrage pour transformer votre lecture du catalogue en plan d'action concret.",
      },
    },
  },
  en: {
    sourceLabels: {
      "demande-catalogue": "Catalogue request",
      "demande-renseignement": "Information request",
      "contact-devis": "Contact / quote request",
      brochure: "Domain catalogue review",
    },
    pageBadge: "Booking",
    pageSubtitle: "Appointment model proposed after a catalogue request, information request or quote request.",
    back: "Back to forms",
    linkedRequest: "Linked request",
    contextTitle: "Meeting context",
    source: "Source",
    name: "Name",
    organization: "Organization",
    domain: "Domain",
    editorialModel: "Editorial model",
    introTitle: "Suggested introduction text",
    agenda: "Suggested agenda",
    connectLabel: "Link to connect",
    connectTitle: "Booking calendar",
    prospectMessage: "Message shown to the prospect",
    cta: "Choose a slot",
    openExternal: "Open in Calendly",
    liveEmbed: "Instant booking",
    routeLabel: "Active journey",
    eventType: "Meeting type",
    platform: "Platform",
    platformValue: "Calendly + Google Meet",
    reassuranceTitle: "Why this format works",
    reassuranceItems: [
      "The prospect books without leaving your brand environment.",
      "The meeting type stays aligned with the request context.",
      "An external link remains available if the embed fails to load.",
    ],
    eventTypeLabels: {
      "demande-catalogue": "Catalogue discovery",
      "demande-renseignement": "Needs qualification",
      "contact-devis": "Quote preparation",
      brochure: "Domain brochure follow-up",
    },
    duration: "Recommended duration",
    durationText: "20 to 30 minutes for an initial scoping call, with a possible follow-up meeting if needed.",
    participants: "Participants",
    participantsText: "Business decision-maker, HR lead, learning manager or project sponsor depending on the request.",
    alternative: "Fast alternative",
    alternativeText: "A WhatsApp or email link can also be displayed for prospects who prefer direct contact.",
    status: "Status",
    statusText: "Model ready to be connected to the final calendar after wording and flow validation.",
    fallbackDomain: "Not specified",
    fallbackCompany: "Organization to be specified",
    fallbackName: "Prospect",
    variants: {
      "demande-catalogue": {
        title: "Catalogue discovery call",
        intro:
          "This meeting helps the prospect identify the most relevant courses in the requested domain, clarify priorities and prepare the next step in the conversation.",
        agenda: [
          "Understand the business context and target audience",
          "Identify priority courses in the requested domain",
          "Validate format, level and desired timeline",
          "Propose the next step: quote, program or follow-up call",
        ],
        confirmation:
          "Thank you for your interest. Choose a 20 to 30 minute slot to review the catalogue with a training advisor.",
      },
      "demande-renseignement": {
        title: "Needs scoping call",
        intro:
          "This meeting is designed for a prospect who knows what they want to improve but has not yet chosen the right course. It helps direct the request toward the right domain and pathway.",
        agenda: [
          "Clarify the need and expected outcome",
          "Identify the most relevant domain or domains",
          "Recommend an initial training pathway",
          "Agree on the next steps",
        ],
        confirmation:
          "Thank you for your request. Choose a time slot so we can qualify your need and guide you toward the right offer.",
      },
      "contact-devis": {
        title: "Quote preparation call",
        intro:
          "This meeting model applies when the need is already well defined. The goal is to validate delivery parameters so we can prepare the right commercial proposal.",
        agenda: [
          "Confirm the target domain and courses",
          "Validate participant volume and delivery format",
          "Clarify target level, constraints and schedule",
          "Prepare the proposal and support options",
        ],
        confirmation:
          "Thank you for your request. Book a scoping call so we can prepare a proposal tailored to your needs.",
      },
      brochure: {
        title: "Call after brochure review",
        intro:
          "The prospect has already reviewed a domain brochure. The meeting should therefore be short, reassuring and focused on prioritizing courses and the right delivery format.",
        agenda: [
          "Review the courses that stood out",
          "Qualify the exact need",
          "Validate format and timeline",
          "Decide on the next step",
        ],
        confirmation:
          "Choose a scoping slot to turn your catalogue review into a concrete action plan.",
      },
    },
  },
} as const;

const AppointmentPreview = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const copy = appointmentCopy[language];
  const source = (searchParams.get("source") as AppointmentSource | null) ?? "demande-catalogue";
  const rawDomain = searchParams.get("domain") ?? "";
  const domain = rawDomain ? getLocalizedDomainLabel(rawDomain, language) : copy.fallbackDomain;
  const company = searchParams.get("company") ?? copy.fallbackCompany;
  const fullName = searchParams.get("fullName") ?? copy.fallbackName;
  const currentCopy = copy.variants[source as keyof typeof copy.variants] ?? copy.variants["demande-catalogue"];
  const calendlyUrl = appointmentBookings[source] ?? directLinks.calendlyBooking;
  const currentEventType = copy.eventTypeLabels[source as keyof typeof copy.eventTypeLabels] ?? copy.eventTypeLabels["demande-catalogue"];
  const fallbackAppointmentMailto = buildAppointmentMailto({
    source: copy.sourceLabels[source as keyof typeof copy.sourceLabels] ?? source,
    domain,
    company,
    fullName,
    language,
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={copy.pageBadge} title={currentCopy.title} subtitle={copy.pageSubtitle} />

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 space-y-8">
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft size={16} /> {copy.back}
            </Link>

            <div className="grid gap-3 lg:grid-cols-4">
              <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.routeLabel}</p>
                <p className="mt-3 font-heading text-xl font-bold text-card-foreground">{copy.sourceLabels[source as keyof typeof copy.sourceLabels] ?? source}</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.eventType}</p>
                <p className="mt-3 font-heading text-xl font-bold text-card-foreground">{currentEventType}</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.duration}</p>
                <p className="mt-3 font-heading text-xl font-bold text-card-foreground">30 min</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.platform}</p>
                <p className="mt-3 font-heading text-xl font-bold text-card-foreground">{copy.platformValue}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card/80 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.linkedRequest}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{copy.contextTitle}</h2>
                  <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-card-foreground">{copy.source}:</span> {copy.sourceLabels[source as keyof typeof copy.sourceLabels] ?? source}</p>
                    <p><span className="font-semibold text-card-foreground">{copy.name}:</span> {fullName}</p>
                    <p><span className="font-semibold text-card-foreground">{copy.organization}:</span> {company}</p>
                    <p><span className="font-semibold text-card-foreground">{copy.domain}:</span> {domain}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card/80 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.editorialModel}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{copy.introTitle}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{currentCopy.intro}</p>
                </div>

                <div className="rounded-3xl border border-border bg-card/80 p-6">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 size={18} />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">{copy.agenda}</p>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {currentCopy.agenda.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-border bg-card/80 p-6">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck size={18} />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">{copy.reassuranceTitle}</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {copy.reassuranceItems.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                        <Sparkles size={15} className="mt-0.5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-primary/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,247,237,0.95)_100%)] p-7 shadow-[0_24px_90px_-38px_rgba(15,23,42,0.35)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-background p-3 text-primary shadow-sm">
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.connectLabel}</p>
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.connectTitle}</h2>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-dashed border-primary/30 bg-background/80 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                      <Video size={13} /> {copy.liveEmbed}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-card-foreground">
                      <FileText size={13} className="text-primary" /> {currentEventType}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 font-semibold text-card-foreground">
                    <FileText size={16} className="text-primary" /> {copy.prospectMessage}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{currentCopy.confirmation}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackAnalyticsEvent("appointment_booking_started", {
                          source,
                          domain,
                          company,
                          location: "appointment_primary_cta",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-5 py-2.5 text-sm font-semibold opacity-90"
                      style={{ color: "hsl(0 0% 100%)" }}
                    >
                      <CalendarDays size={16} /> {copy.cta}
                    </a>
                    <a
                      href={fallbackAppointmentMailto}
                      onClick={() =>
                        trackAnalyticsEvent("appointment_fallback_clicked", {
                          source,
                          domain,
                          company,
                          location: "appointment_mailto_fallback",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-card-foreground hover:bg-muted"
                    >
                      <MessageSquareText size={14} className="text-primary" /> {copy.alternative}
                    </a>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-border bg-background/90 p-3 shadow-inner">
                  <CalendlyEmbed url={calendlyUrl} className="w-full" />
                  <div className="flex justify-end px-2 pb-2 pt-4">
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackAnalyticsEvent("appointment_booking_started", {
                          source,
                          domain,
                          company,
                          location: "appointment_embed_footer_cta",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted"
                    >
                      <ArrowUpRight size={14} /> {copy.openExternal}
                    </a>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-background/80 p-5">
                    <div className="flex items-center gap-2 font-semibold text-card-foreground">
                      <Clock3 size={16} className="text-primary" /> {copy.duration}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{copy.durationText}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-5">
                    <div className="flex items-center gap-2 font-semibold text-card-foreground">
                      <Users size={16} className="text-primary" /> {copy.participants}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{copy.participantsText}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-5">
                    <div className="flex items-center gap-2 font-semibold text-card-foreground">
                      <MessageSquareText size={16} className="text-primary" /> {copy.alternative}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{copy.alternativeText}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-5">
                    <div className="flex items-center gap-2 font-semibold text-card-foreground">
                      <CheckCircle2 size={16} className="text-primary" /> {copy.status}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{copy.statusText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default AppointmentPreview;
