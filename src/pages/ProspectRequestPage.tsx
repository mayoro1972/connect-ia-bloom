import { useState } from "react";
import { ArrowRight, Clock3, LockKeyhole, MessageSquareText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveOutboundLanguage, sendProspectEmailNotifications } from "@/lib/prospect-emails";
import { buildAbsoluteAppointmentUrl } from "@/lib/site-links";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

type ProspectAuditFormState = {
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  country: string;
  sector: string;
  city: string;
  message: string;
  password: string;
  confirmPassword: string;
  wantsExpertAppointment: boolean;
  privacyAccepted: boolean;
  botField: string;
};

const emptyForm: ProspectAuditFormState = {
  fullName: "",
  email: "",
  phone: "",
  profession: "",
  country: "",
  sector: "",
  city: "",
  message: "",
  password: "",
  confirmPassword: "",
  wantsExpertAppointment: false,
  privacyAccepted: false,
  botField: "",
};

const hashPassword = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const toOptionalValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const extractDigits = (value: string) => value.replace(/\D/g, "");

const normalizeAuditHoneypot = (form: ProspectAuditFormState) => {
  const trimmed = form.botField.trim();
  if (!trimmed) return null;

  const normalized = trimmed.toLowerCase();
  const autofillCandidates = [
    form.fullName,
    form.email,
    form.phone,
    form.profession,
    form.city,
    form.country,
    form.password,
    form.confirmPassword,
  ]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (autofillCandidates.includes(normalized)) {
    return null;
  }

  return trimmed;
};

const getAuditRequestErrorDescription = (message: string | null | undefined, language: "fr" | "en") => {
  switch (message) {
    case "spam_detected":
      return language === "en"
        ? "Your browser or a form-filling extension pre-filled a technical field. Please retry after clearing autofill."
        : "Votre navigateur ou une extension d'autoremplissage a rempli un champ technique. Merci de réessayer après avoir vidé l'autoremplissage.";
    case "invalid_phone":
      return language === "en"
        ? "Please enter a valid phone number with at least 8 digits."
        : "Merci de saisir un numéro de téléphone valide avec au moins 8 chiffres.";
    case "invalid_email":
      return language === "en"
        ? "Please enter a valid email address."
        : "Merci de saisir une adresse email valide.";
    case "invalid_full_name":
      return language === "en"
        ? "Please enter your full name."
        : "Merci de renseigner votre nom complet.";
    case "privacy_consent_required":
      return language === "en"
        ? "Please accept data processing before sending the request."
        : "Merci d'accepter le traitement des données avant l'envoi.";
    case "invalid_prospect_password":
      return language === "en"
        ? "The access password could not be generated correctly. Please retry."
        : "Le mot de passe d'accès n'a pas pu être généré correctement. Merci de réessayer.";
    default:
      return null;
  }
};

const sectorOptions = [
  "Assistanat & Secrétariat",
  "Ressources Humaines",
  "Marketing & Communication",
  "Finance & Comptabilité",
  "Juridique & Conformité",
  "Service client & relation client",
  "Données & Analyse",
  "Administration & Gestion",
  "Management & Leadership",
  "Systèmes d'information & Transformation digitale",
  "Formation & Pédagogie",
  "Santé, social & bien-être",
  "Diplomatie & Affaires Internationales",
  "Autres",
] as const;

const pageCopy = {
  fr: {
    badge: "Demande de formulaire d'audit IA",
    title: "Demandez votre formulaire d'audit",
    intro:
      "Partagez votre contexte en quelques minutes. Nous accusons réception immédiatement, puis nous vous envoyons l'accès sécurisé au formulaire multi-sectoriel.",
    formTitle: "Votre demande",
    formLead:
      "Renseignez les informations essentielles pour recevoir votre formulaire, préparer le suivi et cadrer le besoin avec notre équipe.",
    processTitle: "Ce qui va se passer",
    processSteps: [
      "Vous envoyez une demande courte adaptée au mobile.",
      "Vous recevez un accusé de réception immédiatement.",
      "Le formulaire d'audit vous est envoyé sous environ 30 minutes.",
    ],
    expertTitle: "Échange expert inclus",
    expertLead:
      "Votre demande prépare aussi un rendez-vous de cadrage pour relire le besoin, le secteur concerné et la meilleure manière d'aborder le questionnaire.",
    accessTitle: "Accès sécurisé",
    accessLead:
      "Vous utiliserez votre adresse email et le mot de passe ci-dessous pour ouvrir le formulaire quand il vous sera envoyé.",
    appointmentPreference:
      "Je confirme souhaiter un échange avec un expert TransferAI Africa avant de commencer le formulaire complet.",
    appointmentRequiredTitle: "Confirmation requise",
    appointmentRequiredDesc:
      "Merci de confirmer que vous souhaitez un échange avec notre expert avant l'ouverture du formulaire d'audit.",
    privacy:
      "J'accepte que mes informations soient utilisées pour traiter ma demande d'audit et les échanges associés.",
    submit: "Envoyer ma demande",
    submitting: "Envoi en cours...",
    successTitle: "Demande envoyée",
    successDesc:
      "Votre demande a bien été enregistrée. Un accusé de réception part immédiatement, puis l'accès sécurisé au formulaire d'audit sera envoyé sous environ 30 minutes.",
    privacyErrorTitle: "Consentement requis",
    privacyErrorDesc: "Merci d'accepter le traitement de vos informations avant l'envoi.",
    phoneErrorTitle: "Téléphone invalide",
    phoneErrorDesc: "Merci de saisir un numéro valide avec au moins 8 chiffres.",
    passwordErrorTitle: "Mot de passe invalide",
    passwordErrorDesc: "Le mot de passe doit contenir au moins 8 caractères et correspondre à la confirmation.",
    errorTitle: "Envoi impossible",
    errorDesc: "La demande n'a pas pu être envoyée. Vérifiez la configuration et réessayez.",
    labels: {
      fullName: "Nom complet",
      profession: "Profession / fonction",
      email: "Adresse email",
      phone: "Téléphone",
      city: "Ville",
      country: "Pays",
      sector: "Secteur d'activité",
      password: "Mot de passe d'accès",
      confirmPassword: "Confirmer le mot de passe",
    },
    placeholders: {
      sector: "Choisissez votre secteur d'activité",
      message:
        "Ex. : je souhaite identifier les tâches prioritaires à automatiser, clarifier les usages IA utiles à mon équipe et préparer un échange avec votre expert.",
    },
  },
  en: {
    badge: "AI audit form request",
    title: "Request your audit questionnaire",
    intro:
      "Share your context in just a few minutes. We acknowledge your request immediately, then send you secure access to the multi-sector audit questionnaire.",
    formTitle: "Your request",
    formLead:
      "Provide the key details needed to receive your questionnaire, prepare the follow-up, and scope the need with our team.",
    processTitle: "What happens next",
    processSteps: [
      "You submit a short mobile-friendly request.",
      "You receive an acknowledgement email immediately.",
      "Your audit questionnaire access is sent within about 30 minutes.",
    ],
    expertTitle: "Expert discussion included",
    expertLead:
      "Your request also prepares a scoping conversation to review the need, the relevant sector, and the best way to approach the questionnaire.",
    accessTitle: "Secure access",
    accessLead:
      "You will use your email address and the password below to open the questionnaire when it is sent to you.",
    appointmentPreference:
      "I confirm that I would like to speak with a TransferAI Africa expert before starting the full questionnaire.",
    appointmentRequiredTitle: "Confirmation required",
    appointmentRequiredDesc:
      "Please confirm that you would like to speak with our expert before opening the audit questionnaire.",
    privacy:
      "I agree that my information may be used to process my audit request and the related follow-up.",
    submit: "Send my request",
    submitting: "Sending...",
    successTitle: "Request sent",
    successDesc:
      "Your request has been recorded. An acknowledgement email goes out immediately, then secure access to the audit questionnaire will be sent in about 30 minutes.",
    privacyErrorTitle: "Consent required",
    privacyErrorDesc: "Please accept data processing before sending the request.",
    phoneErrorTitle: "Invalid phone",
    phoneErrorDesc: "Please enter a valid phone number with at least 8 digits.",
    passwordErrorTitle: "Invalid password",
    passwordErrorDesc: "The password must be at least 8 characters long and match the confirmation field.",
    errorTitle: "Unable to send",
    errorDesc: "The request could not be sent. Check the configuration and try again.",
    labels: {
      fullName: "Full name",
      profession: "Role / profession",
      email: "Email address",
      phone: "Phone",
      city: "City",
      country: "Country",
      sector: "Business sector",
      password: "Access password",
      confirmPassword: "Confirm password",
    },
    placeholders: {
      sector: "Choose your business sector",
      message:
        "Example: I want to identify priority tasks to augment, clarify the most useful AI use cases for my team, and prepare an expert discussion.",
    },
  },
} as const;

const ProspectRequestPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const copy = language === "en" ? pageCopy.en : pageCopy.fr;
  const [form, setForm] = useState<ProspectAuditFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const processIcons = [MessageSquareText, Clock3, LockKeyhole];

  const update = <K extends keyof ProspectAuditFormState>(key: K, value: ProspectAuditFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const inputClass =
    "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const activeLanguage = resolveOutboundLanguage(language);

    if (!form.wantsExpertAppointment) {
      toast({
        title: copy.appointmentRequiredTitle,
        description: copy.appointmentRequiredDesc,
        variant: "destructive",
      });
      return;
    }

    if (!form.privacyAccepted) {
      toast({
        title: copy.privacyErrorTitle,
        description: copy.privacyErrorDesc,
        variant: "destructive",
      });
      return;
    }

    if (extractDigits(form.phone).length < 8) {
      toast({
        title: copy.phoneErrorTitle,
        description: copy.phoneErrorDesc,
        variant: "destructive",
      });
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: copy.errorTitle,
        description: supabaseUnavailableMessage,
        variant: "destructive",
      });
      return;
    }

    if (form.password.length < 8 || form.password !== form.confirmPassword) {
      toast({
        title: copy.passwordErrorTitle,
        description: copy.passwordErrorDesc,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassword(form.password);

      const { data: requestId, error } = await supabase.rpc("submit_contact_request", {
        full_name_input: form.fullName.trim(),
        email_input: form.email.trim(),
        phone_input: form.phone.trim(),
        company_input: form.profession.trim(),
        profession_input: form.profession.trim(),
        prospect_type_input: null,
        sector_input: toOptionalValue(form.sector),
        city_input: toOptionalValue(form.city),
        country_input: toOptionalValue(form.country),
        participants_input: null,
        requested_formations_input: null,
        message_input: toOptionalValue(form.message),
        source_page_input: "/demande-audit-gratuit",
        language_input: activeLanguage,
        request_intent_input: "demande-audit",
        requested_domain_input: "Audit IA gratuit",
        privacy_consent_input: form.privacyAccepted,
        honeypot_input: normalizeAuditHoneypot(form),
        wants_expert_appointment_input: form.wantsExpertAppointment,
        prospect_username_input: form.email.trim().toLowerCase(),
        prospect_password_hash_input: passwordHash,
      });

      if (error) {
        toast({
          title: copy.errorTitle,
          description: getAuditRequestErrorDescription(error.message, activeLanguage) ?? copy.errorDesc,
          variant: "destructive",
        });
        return;
      }

      await sendProspectEmailNotifications({
        requestId,
        intent: "demande-audit",
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.profession.trim(),
        role: form.profession.trim() || null,
        city: [form.city.trim(), form.country.trim()].filter(Boolean).join(", ") || null,
        domain: form.sector.trim() || "Audit IA gratuit",
        message: form.message.trim() || null,
        sourcePage: "/demande-audit-gratuit",
        language: activeLanguage,
        wantsExpertAppointment: form.wantsExpertAppointment,
        appointmentUrl: buildAbsoluteAppointmentUrl("demande-audit", form.sector.trim() || "Audit IA gratuit", {
          company: form.profession.trim(),
          fullName: form.fullName.trim(),
        }),
      });

      trackAnalyticsEvent("audit_request_submitted", {
        intent: "demande-audit",
        language: activeLanguage,
        wants_expert_appointment: form.wantsExpertAppointment,
        profession: form.profession.trim() || null,
        sector: form.sector.trim() || null,
        source_page: "/demande-audit-gratuit",
      });

      toast({
        title: copy.successTitle,
        description: copy.successDesc,
      });

      setForm(emptyForm);
    } catch (error) {
      toast({
        title: copy.errorTitle,
        description:
          getAuditRequestErrorDescription(error instanceof Error ? error.message : null, activeLanguage) ?? copy.errorDesc,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />

        <main className="relative z-10">
          <section className="px-4 py-16 lg:px-8">
            <div className="container mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,33,61,0.98),rgba(20,52,101,0.94))] p-8 text-white shadow-[0_30px_90px_-60px_rgba(16,33,61,0.7)] md:p-10">
                  <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                    {copy.badge}
                  </p>
                  <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-5xl">{copy.title}</h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78 md:text-base">{copy.intro}</p>

                  <div className="mt-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">{copy.processTitle}</p>
                    <div className="mt-4 grid gap-4">
                      {copy.processSteps.map((step, index) => {
                        const Icon = processIcons[index];

                        return (
                          <div key={step} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/10 p-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
                              <Icon size={20} />
                            </div>
                            <p className="text-sm leading-6 text-white/85">{step}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-[hsl(30_52%_84%)] bg-[hsl(32_100%_98%)] p-6 shadow-[0_24px_70px_-56px_rgba(249,115,22,0.28)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{copy.expertTitle}</p>
                  <p className="mt-3 text-sm leading-7 text-card-foreground">{copy.expertLead}</p>
                </div>
              </div>

              <div className="rounded-[30px] border border-border bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)] md:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{copy.formTitle}</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{copy.formLead}</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      placeholder={copy.labels.fullName}
                      name="fullName"
                      autoComplete="name"
                      required
                      value={form.fullName}
                      onChange={(event) => update("fullName", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.profession}
                      name="organizationTitle"
                      autoComplete="organization-title"
                      required
                      value={form.profession}
                      onChange={(event) => update("profession", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.email}
                      name="email"
                      autoComplete="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.phone}
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.city}
                      name="city"
                      autoComplete="address-level2"
                      required
                      value={form.city}
                      onChange={(event) => update("city", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.country}
                      name="country"
                      autoComplete="country-name"
                      required
                      value={form.country}
                      onChange={(event) => update("country", event.target.value)}
                      className={inputClass}
                    />
                    <select
                      required
                      value={form.sector}
                      onChange={(event) => update("sector", event.target.value)}
                      className={`${inputClass} md:col-span-2`}
                    >
                      <option value="">{copy.placeholders.sector}</option>
                      {sectorOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    placeholder={copy.placeholders.message}
                    required
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                    className={`${inputClass} min-h-32`}
                  />

                  <div className="rounded-[28px] border border-border bg-muted/40 p-5">
                    <div className="flex items-start gap-3">
                      <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-semibold text-card-foreground">{copy.accessTitle}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.accessLead}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input
                        placeholder={copy.labels.password}
                        type="password"
                        name="new-password"
                        autoComplete="new-password"
                        required
                        value={form.password}
                        onChange={(event) => update("password", event.target.value)}
                        className={inputClass}
                      />
                      <input
                        placeholder={copy.labels.confirmPassword}
                        type="password"
                        name="confirm-password"
                        autoComplete="new-password"
                        required
                        value={form.confirmPassword}
                        onChange={(event) => update("confirmPassword", event.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    name="contact_website"
                    tabIndex={-1}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    className="hidden"
                    aria-hidden="true"
                    value={form.botField}
                    onChange={(event) => update("botField", event.target.value)}
                  />

                  <label className="flex items-start gap-3 rounded-3xl border border-[hsl(30_52%_84%)] bg-[hsl(32_100%_98%)] p-5 text-sm leading-7 text-card-foreground">
                    <input
                      type="checkbox"
                      checked={form.wantsExpertAppointment}
                      onChange={(event) => update("wantsExpertAppointment", event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span>{copy.appointmentPreference}</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={form.privacyAccepted}
                      onChange={(event) => update("privacyAccepted", event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span>{copy.privacy}</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? copy.submitting : copy.submit}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProspectRequestPage;
