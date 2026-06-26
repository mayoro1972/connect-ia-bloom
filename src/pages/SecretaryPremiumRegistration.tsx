import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { formations, type Formation } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { useFormationLocale } from "@/hooks/useFormationLocale";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { resolveOutboundLanguage, sendProspectEmailNotifications } from "@/lib/prospect-emails";
import { buildAbsoluteAppointmentUrl, buildContactPath, contactDetails, directLinks } from "@/lib/site-links";
import { trackAnalyticsEvent } from "@/lib/analytics";

type PremiumFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  city: string;
  organizationType: string;
  formation: string;
  format: string;
  participants: string;
  timeline: string;
  financingMode: string;
  goals: string[];
  pains: string[];
  message: string;
  privacyAccepted: boolean;
  botField: string;
};

const SECRETARY_DOMAIN = "Assistanat & Secrétariat";
const RECOMMENDED_FORMATION_ID = "assist-10";

const goalOptions = {
  fr: [
    "Gagner du temps sur les courriers et notes",
    "Mieux préparer les réunions et comptes rendus",
    "Mieux organiser l'agenda et les relances",
    "Renforcer mon profil professionnel",
    "Former une équipe support complète",
  ],
  en: [
    "Save time on correspondence and notes",
    "Prepare meetings and summaries more effectively",
    "Organize calendars and follow-ups better",
    "Strengthen my professional profile",
    "Train a full support team",
  ],
} as const;

const painOptions = {
  fr: [
    "Trop de temps perdu sur les documents",
    "Comptes rendus longs à produire",
    "Difficulté à prioriser les tâches",
    "Relances et coordination dispersées",
    "Besoin d'un niveau plus stratégique",
  ],
  en: [
    "Too much time lost on documents",
    "Meeting summaries take too long",
    "Difficulty prioritizing tasks",
    "Follow-ups and coordination are scattered",
    "Need for a more strategic level",
  ],
} as const;

const emptyPremiumForm = (formationId = RECOMMENDED_FORMATION_ID): PremiumFormState => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  city: "",
  organizationType: "",
  formation: formationId,
  format: "",
  participants: "1",
  timeline: "",
  financingMode: "",
  goals: [],
  pains: [],
  message: "",
  privacyAccepted: false,
  botField: "",
});

const copy = {
  fr: {
    badge: "Formulaire Premium",
    title: "Inscription premium · Formation secrétaires et assistants de direction",
    subtitle:
      "Un formulaire plus qualitatif pour préparer votre inscription, qualifier vos besoins et vous orienter vers le bon parcours dans le domaine Assistanat & Secrétariat.",
    eyebrow: "Cohorte Côte d'Ivoire",
    heroTitle: "Une inscription pensée pour convertir plus vite et mieux orienter chaque participante",
    heroText:
      "Cette page permet de capter des inscriptions individuelles ou d'équipe avec un niveau de détail suffisant pour préparer une réponse commerciale sérieuse, rapide et plus premium.",
    proofTitle: "Pourquoi ce formulaire est premium",
    proofItems: [
      "Réponse sous 24 heures ouvrées",
      "Orientation vers la formation la plus pertinente",
      "Possibilité d'inscription individuelle ou équipe",
      "Traitement prioritaire des demandes WhatsApp",
    ],
    outcomesTitle: "Ce que vous préparez ici",
    outcomes: [
      "Une demande d'inscription claire et complète",
      "Une proposition plus adaptée à votre contexte",
      "Un appel de cadrage si nécessaire",
    ],
    formTitle: "Votre demande d'inscription premium",
    formIntro:
      "Renseignez les informations essentielles. Notre équipe utilisera vos réponses pour confirmer la bonne formation, le format conseillé et la prochaine étape.",
    recommended: "Parcours recommandé",
    recommendedText:
      "La certification Assistant de Direction Augmenté est préselectionnée car c'est le parcours le plus complet pour une montée en compétence forte et visible.",
    firstName: "Prénom *",
    lastName: "Nom *",
    email: "Email professionnel *",
    phone: "Téléphone / WhatsApp *",
    company: "Entreprise / institution *",
    position: "Fonction actuelle",
    city: "Ville / pays",
    organizationType: "Type d'organisation",
    formation: "Formation souhaitée *",
    format: "Format souhaité",
    participants: "Nombre de participantes",
    timeline: "Échéance souhaitée",
    financingMode: "Mode de prise en charge",
    goals: "Vos objectifs prioritaires",
    pains: "Vos difficultés actuelles",
    message: "Précisions complémentaires",
    privacy:
      "J'accepte que mes données soient traitées uniquement pour gérer ma demande d'inscription, dans le respect de la politique de confidentialité.",
    submit: "Envoyer ma demande premium",
    submitPending: "Envoi en cours...",
    helperTitle: "Aide immédiate",
    helperText:
      "Si vous hésitez entre plusieurs parcours ou si vous souhaitez inscrire un groupe, notre équipe peut vous orienter très rapidement sur WhatsApp.",
    helperCta: "Parler sur WhatsApp",
    processTitle: "Ce qui se passe après",
    processSteps: [
      "Analyse de votre profil et de votre objectif",
      "Confirmation de la formation la plus adaptée",
      "Retour par email ou WhatsApp avec la suite",
      "Proposition de rendez-vous si nécessaire",
    ],
    toastTitle: "Demande premium enregistrée",
    toastDesc:
      "Votre demande a bien été enregistrée. Notre équipe reviendra vers vous rapidement avec la meilleure suite possible.",
    sectionChoices: {
      organizationTypes: ["Entreprise privée", "Administration publique", "École / université", "ONG / association", "Indépendant", "Autre"],
      formats: ["Présentiel", "Hybride", "En ligne", "À recommander"],
      timelines: ["Sous 7 jours", "Sous 15 jours", "Sous 30 jours", "Dans le trimestre", "À définir"],
      financingModes: ["Prise en charge personnelle", "Prise en charge entreprise", "Prise en charge institution", "À préciser"],
    },
    stats: [
      { value: "10", label: "formations du domaine" },
      { value: "24h", label: "délai de réponse visé" },
      { value: "1 à 20+", label: "participantes possibles" },
    ],
  },
  en: {
    badge: "Premium Form",
    title: "Premium registration · Secretaries and executive assistants training",
    subtitle:
      "A higher-quality form to prepare your registration, qualify your needs, and guide you toward the right Assistanat & Secrétariat pathway.",
    eyebrow: "Ivory Coast cohort",
    heroTitle: "A registration experience designed to convert faster and guide each participant better",
    heroText:
      "This page captures individual or team registrations with enough detail to prepare a serious, fast, and more premium commercial response.",
    proofTitle: "Why this form is premium",
    proofItems: [
      "Response within 24 business hours",
      "Guidance toward the most relevant course",
      "Support for individual or team registration",
      "Priority handling for WhatsApp requests",
    ],
    outcomesTitle: "What you prepare here",
    outcomes: [
      "A clear and complete registration request",
      "A proposal better adapted to your context",
      "A scoping call if needed",
    ],
    formTitle: "Your premium registration request",
    formIntro:
      "Fill in the essential details. Our team will use your answers to confirm the right course, recommended format, and best next step.",
    recommended: "Recommended path",
    recommendedText:
      "The AI-Augmented Executive Assistant Certification is preselected because it is the most complete pathway for a strong and visible skills upgrade.",
    firstName: "First name *",
    lastName: "Last name *",
    email: "Professional email *",
    phone: "Phone / WhatsApp *",
    company: "Company / institution *",
    position: "Current role",
    city: "City / country",
    organizationType: "Organization type",
    formation: "Desired course *",
    format: "Preferred format",
    participants: "Number of participants",
    timeline: "Desired timeline",
    financingMode: "Funding mode",
    goals: "Your priority goals",
    pains: "Your current difficulties",
    message: "Additional details",
    privacy:
      "I agree that my data may be processed only to manage my registration request, in accordance with the privacy policy.",
    submit: "Send my premium request",
    submitPending: "Sending...",
    helperTitle: "Immediate help",
    helperText:
      "If you are hesitating between several pathways or want to register a group, our team can guide you very quickly on WhatsApp.",
    helperCta: "Chat on WhatsApp",
    processTitle: "What happens next",
    processSteps: [
      "We review your profile and objective",
      "We confirm the most relevant course",
      "We reply by email or WhatsApp with the next step",
      "We suggest a meeting if needed",
    ],
    toastTitle: "Premium request saved",
    toastDesc:
      "Your request has been recorded successfully. Our team will follow up shortly with the best next step.",
    sectionChoices: {
      organizationTypes: ["Private company", "Public administration", "School / university", "NGO / association", "Independent", "Other"],
      formats: ["On-site", "Hybrid", "Online", "Recommend the best option"],
      timelines: ["Within 7 days", "Within 15 days", "Within 30 days", "This quarter", "To be defined"],
      financingModes: ["Self-funded", "Company-funded", "Institution-funded", "To be clarified"],
    },
    stats: [
      { value: "10", label: "domain courses" },
      { value: "24h", label: "target response time" },
      { value: "1 to 20+", label: "participants possible" },
    ],
  },
} as const;

const toggleArrayValue = (source: string[], value: string) =>
  source.includes(value) ? source.filter((item) => item !== value) : [...source, value];

const normalizeFormationFromQuery = (rawFormation: string | null, available: Formation[]) => {
  if (!rawFormation) return RECOMMENDED_FORMATION_ID;

  const matched = available.find((formation) => formation.id === rawFormation || formation.title === rawFormation);
  return matched?.id ?? RECOMMENDED_FORMATION_ID;
};

const buildStructuredMessage = (form: PremiumFormState, language: "fr" | "en") => {
  const labels = language === "fr"
    ? {
        city: "Ville / pays",
        organizationType: "Type d'organisation",
        format: "Format souhaité",
        timeline: "Échéance souhaitée",
        financingMode: "Prise en charge",
        goals: "Objectifs",
        pains: "Difficultés actuelles",
        note: "Message libre",
      }
    : {
        city: "City / country",
        organizationType: "Organization type",
        format: "Preferred format",
        timeline: "Desired timeline",
        financingMode: "Funding mode",
        goals: "Goals",
        pains: "Current difficulties",
        note: "Free message",
      };

  const sections = [
    `${labels.city}: ${form.city || "-"}`,
    `${labels.organizationType}: ${form.organizationType || "-"}`,
    `${labels.format}: ${form.format || "-"}`,
    `${labels.timeline}: ${form.timeline || "-"}`,
    `${labels.financingMode}: ${form.financingMode || "-"}`,
    `${labels.goals}: ${form.goals.length > 0 ? form.goals.join(", ") : "-"}`,
    `${labels.pains}: ${form.pains.length > 0 ? form.pains.join(", ") : "-"}`,
    `${labels.note}: ${form.message.trim() || "-"}`,
  ];

  return sections.join("\n");
};

const SecretaryPremiumRegistrationPage = () => {
  const { language, t } = useLanguage();
  const activeLanguage = language === "en" ? "en" : "fr";
  const ui = copy[activeLanguage];
  const { getTitle, getDuration, getFormat, getLevel } = useFormationLocale();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const secretaryFormations = useMemo(
    () => formations.filter((formation) => formation.metier === SECRETARY_DOMAIN),
    [],
  );

  const [form, setForm] = useState<PremiumFormState>(() =>
    emptyPremiumForm(normalizeFormationFromQuery(searchParams.get("formation"), secretaryFormations)),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedFormation = secretaryFormations.find((formation) => formation.id === form.formation) ?? secretaryFormations[0];

  const recommendedFormation = secretaryFormations.find((formation) => formation.id === RECOMMENDED_FORMATION_ID) ?? secretaryFormations[0];

  const update = <K extends keyof PremiumFormState>(key: K, value: PremiumFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleGoal = (value: string) => update("goals", toggleArrayValue(form.goals, value));
  const togglePain = (value: string) => update("pains", toggleArrayValue(form.pains, value));

  const inputClass =
    "w-full rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/25";
  const chipClass = (isActive: boolean) =>
    `rounded-full border px-3 py-2 text-sm transition-colors ${
      isActive
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-card-foreground hover:border-primary/40 hover:bg-primary/5"
    }`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFormation) {
      toast({
        title: activeLanguage === "fr" ? "Formation introuvable" : "Course not found",
        description: activeLanguage === "fr" ? "Merci de sélectionner une formation valide." : "Please select a valid course.",
        variant: "destructive",
      });
      return;
    }

    if (!form.privacyAccepted) {
      toast({
        title: t("inscription.toastErrorTitle"),
        description: t("inscription.privacyConsentError"),
        variant: "destructive",
      });
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: t("inscription.toastErrorTitle"),
        description: supabaseUnavailableMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const outboundLanguage = resolveOutboundLanguage(language);
    const participants = Number.parseInt(form.participants, 10);
    const normalizedParticipants = Number.isFinite(participants) && participants > 0 ? participants : 1;
    const messagePayload = buildStructuredMessage(form, activeLanguage);

    const { error } = await supabase.rpc("submit_registration_request", {
      first_name_input: form.firstName.trim(),
      last_name_input: form.lastName.trim(),
      email_input: form.email.trim(),
      phone_input: form.phone.trim(),
      company_input: form.company.trim(),
      position_input: form.position.trim() || null,
      formation_id_input: selectedFormation.id,
      formation_title_input: getTitle(selectedFormation),
      participants_input: normalizedParticipants,
      message_input: messagePayload,
      source_page_input: "/inscription/secretariat",
      language_input: outboundLanguage,
      privacy_consent_input: form.privacyAccepted,
      honeypot_input: form.botField.trim() || null,
    });

    if (!error) {
      await sendProspectEmailNotifications({
        intent: "inscription",
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        role: form.position.trim() || null,
        formationTitle: getTitle(selectedFormation),
        participants: normalizedParticipants,
        message: messagePayload,
        sourcePage: "/inscription/secretariat",
        language: outboundLanguage,
        appointmentUrl: buildAbsoluteAppointmentUrl("contact-devis", getTitle(selectedFormation), {
          company: form.company.trim(),
          fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        }),
      });

      toast({
        title: ui.toastTitle,
        description: ui.toastDesc,
      });

      trackAnalyticsEvent("premium_secretariat_registration_submitted", {
        formation_id: selectedFormation.id,
        formation_title: getTitle(selectedFormation),
        participants: normalizedParticipants,
      });

      setForm(emptyPremiumForm(RECOMMENDED_FORMATION_ID));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    toast({
      title: t("inscription.toastErrorTitle"),
      description: t("inscription.toastErrorDesc"),
      variant: "destructive",
    });
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />

        <section className="relative overflow-hidden pb-10 pt-24 md:pb-14 md:pt-28">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(225_44%_11%/0.96),hsl(202_46%_14%/0.94),hsl(26_84%_33%/0.88))]" />
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_20%),radial-gradient(circle_at_80%_15%,rgba(255,190,92,0.24),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(84,189,179,0.24),transparent_20%)]" />
          <div className="relative z-10 container mx-auto px-4 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                  <Sparkles size={14} />
                  {ui.badge}
                </span>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(35_95%_70%)]">{ui.eyebrow}</p>
                <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-white md:text-5xl">
                  {ui.heroTitle}
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-white/78 md:text-base">
                  {ui.heroText}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {ui.stats.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white">
                      <p className="font-heading text-2xl font-bold">{item.value}</p>
                      <p className="text-xs uppercase tracking-[0.14em] text-white/65">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card rounded-[2rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{ui.recommended}</p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{getTitle(recommendedFormation)}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{ui.recommendedText}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{activeLanguage === "fr" ? "Niveau" : "Level"}</p>
                    <p className="mt-1 text-sm font-semibold text-card-foreground">{getLevel(recommendedFormation)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{activeLanguage === "fr" ? "Format" : "Format"}</p>
                    <p className="mt-1 text-sm font-semibold text-card-foreground">{getFormat(recommendedFormation)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{activeLanguage === "fr" ? "Durée" : "Duration"}</p>
                    <p className="mt-1 text-sm font-semibold text-card-foreground">{getDuration(recommendedFormation)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-6">
                <div className="surface-card rounded-[1.75rem] p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <BadgeCheck size={22} />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{ui.proofTitle}</h2>
                  </div>
                  <div className="mt-5 space-y-3">
                    {ui.proofItems.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card rounded-[1.75rem] p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700">
                      <Clock3 size={22} />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{ui.processTitle}</h2>
                  </div>
                  <ol className="mt-5 space-y-3">
                    {ui.processSteps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-bold text-primary shadow-sm">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-[1.75rem] bg-indigo-gradient p-7 text-white shadow-[0_26px_60px_-32px_rgba(15,23,42,0.55)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <MessageSquareQuote size={22} />
                    </div>
                    <h2 className="font-heading text-2xl font-bold">{ui.helperTitle}</h2>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/78">{ui.helperText}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={directLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
                    >
                      {ui.helperCta}
                    </a>
                    <a
                      href={buildContactPath("demande-renseignement", "Assistanat & Secrétariat")}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/12"
                    >
                      {activeLanguage === "fr" ? "Être orienté d'abord" : "Get guidance first"}
                    </a>
                  </div>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/78">
                    {contactDetails.phoneDisplay} · {contactDetails.email}
                  </div>
                </div>
              </div>

              <div className="surface-card rounded-[2rem] p-6 md:p-8">
                <div className="mb-6 border-b border-border pb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{ui.badge}</p>
                  <h2 className="mt-2 font-heading text-3xl font-bold text-card-foreground">{ui.formTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{ui.formIntro}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.firstName}</label>
                      <input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.lastName}</label>
                      <input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.email}</label>
                      <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.phone}</label>
                      <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.company}</label>
                      <input required value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.position}</label>
                      <input value={form.position} onChange={(e) => update("position", e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.city}</label>
                      <input value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.organizationType}</label>
                      <select value={form.organizationType} onChange={(e) => update("organizationType", e.target.value)} className={inputClass}>
                        <option value="">{activeLanguage === "fr" ? "Sélectionner" : "Select"}</option>
                        {ui.sectionChoices.organizationTypes.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.formation}</label>
                      <select required value={form.formation} onChange={(e) => update("formation", e.target.value)} className={inputClass}>
                        {secretaryFormations.map((formation) => (
                          <option key={formation.id} value={formation.id}>
                            {getTitle(formation)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.format}</label>
                      <select value={form.format} onChange={(e) => update("format", e.target.value)} className={inputClass}>
                        <option value="">{activeLanguage === "fr" ? "Sélectionner" : "Select"}</option>
                        {ui.sectionChoices.formats.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.participants}</label>
                      <input min="1" type="number" value={form.participants} onChange={(e) => update("participants", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.timeline}</label>
                      <select value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={inputClass}>
                        <option value="">{activeLanguage === "fr" ? "Sélectionner" : "Select"}</option>
                        {ui.sectionChoices.timelines.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.financingMode}</label>
                      <select value={form.financingMode} onChange={(e) => update("financingMode", e.target.value)} className={inputClass}>
                        <option value="">{activeLanguage === "fr" ? "Sélectionner" : "Select"}</option>
                        {ui.sectionChoices.financingModes.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-card-foreground">{ui.goals}</label>
                    <div className="flex flex-wrap gap-2">
                      {goalOptions[activeLanguage].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleGoal(item)}
                          className={chipClass(form.goals.includes(item))}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-card-foreground">{ui.pains}</label>
                    <div className="flex flex-wrap gap-2">
                      {painOptions[activeLanguage].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => togglePain(item)}
                          className={chipClass(form.pains.includes(item))}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-card-foreground">{ui.message}</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className={`${inputClass} resize-none`}
                      placeholder={activeLanguage === "fr" ? "Exemple : je souhaite une formule groupe pour 6 assistantes." : "Example: I would like a group format for 6 assistants."}
                    />
                  </div>

                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.botField}
                    onChange={(e) => update("botField", e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="rounded-2xl border border-border bg-background px-4 py-4 text-sm text-muted-foreground">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.privacyAccepted}
                        onChange={(e) => update("privacyAccepted", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                      />
                      <span>
                        {ui.privacy}{" "}
                        <a href="/confidentialite" className="font-semibold text-primary underline-offset-4 hover:underline">
                          {activeLanguage === "fr" ? "Voir la politique" : "View policy"}
                        </a>
                        .
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-gradient px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <ShieldCheck size={18} />
                    {isSubmitting ? ui.submitPending : ui.submit}
                  </button>
                </form>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-background px-4 py-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Users size={18} />
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">{ui.outcomes[0]}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background px-4 py-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700">
                      <BriefcaseBusiness size={18} />
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">{ui.outcomes[1]}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background px-4 py-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-500/10 text-[hsl(13_83%_46%)]">
                      <CalendarClock size={18} />
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">{ui.outcomes[2]}</p>
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

export default SecretaryPremiumRegistrationPage;
