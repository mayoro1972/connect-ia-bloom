import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
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
  prospectType: string;
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
  prospectType: "",
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

const sectorOptions = [
  "Assistanat & Secrétariat",
  "Ressources Humaines",
  "Marketing & Communication",
  "Finance & Comptabilité",
  "Juridique & Conformité",
  "Service Client",
  "Data & Analyse",
  "Administration & Gestion",
  "Management & Leadership",
  "IT & Transformation Digitale",
  "Formation & Pédagogie",
  "Santé & Bien-être",
  "Diplomatie & Affaires Internationales",
  "Autres",
] as const;

const prospectTypeOptions = {
  fr: ["Entreprise", "Indépendant", "Particulier", "Institution", "ONG / Association"],
  en: ["Company", "Independent", "Individual", "Institution", "NGO / Association"],
} as const;

const pageCopy = {
  fr: {
    badge: "Demande de formulaire d'audit IA",
    title: "",
    formLead:
      "Renseignez les informations essentielles pour recevoir votre formulaire, préparer le suivi et cadrer le besoin avec notre équipe.",
    secureTitle: "Accès sécurisé",
    secureLead:
      "Votre adresse email servira d'identifiant sécurisé. Définissez uniquement le mot de passe qui vous permettra d'ouvrir le formulaire lorsqu'il vous sera envoyé.",
    appointmentPreference:
      "Je souhaite un rendez-vous pour discuter de la fiche d'audit avant de la remplir.",
    privacy:
      "J'accepte que mes informations soient utilisées pour traiter ma demande d'audit et les échanges associés.",
    submit: "Envoyer ma demande",
    submitting: "Envoi en cours...",
    successTitle: "Demande envoyée",
    successDesc:
      "Votre demande a bien été enregistrée. Un accusé de réception part immédiatement, puis le formulaire d'audit sera envoyé sous environ 30 minutes.",
    privacyErrorTitle: "Consentement requis",
    privacyErrorDesc: "Merci d'accepter le traitement de vos informations avant l'envoi.",
    passwordErrorTitle: "Mot de passe invalide",
    passwordErrorDesc: "Le mot de passe doit contenir au moins 8 caractères et correspondre à la confirmation.",
    errorTitle: "Envoi impossible",
    errorDesc: "La demande n'a pas pu être envoyée. Vérifiez la configuration et réessayez.",
    labels: {
      fullName: "Nom complet",
      prospectType: "Qualification du prospect",
      profession: "Profession / Fonction",
      email: "Adresse email",
      phone: "Téléphone",
      city: "Ville",
      country: "Pays",
      sector: "Secteur d'activité",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      message: "Décrivez votre besoin",
    },
    placeholders: {
      sector: "Choisissez votre secteur d'activité",
      prospectType: "Choisissez votre profil",
      message:
        "Ex. : nous voulons identifier les tâches répétitives, réduire le temps de traitement des demandes, mieux structurer le reporting et préparer un premier plan d'action IA adapté à notre secteur.",
    },
  },
  en: {
    badge: "AI audit form request",
    title: "",
    formLead: "Share the essential details needed to receive your questionnaire and prepare the follow-up.",
    secureTitle: "Secure access",
    secureLead:
      "Your email address will serve as your secure login. You only need to create the password that will let you open the questionnaire when it is sent to you.",
    appointmentPreference:
      "I would like to schedule a meeting to discuss the audit questionnaire before filling it in.",
    privacy:
      "I agree that my information may be used to process my audit request and the related follow-up.",
    submit: "Send my request",
    submitting: "Sending...",
    successTitle: "Request sent",
    successDesc:
      "Your request has been recorded. An acknowledgement email goes out immediately, then the audit questionnaire will be sent in about 30 minutes.",
    privacyErrorTitle: "Consent required",
    privacyErrorDesc: "Please accept data processing before sending the request.",
    passwordErrorTitle: "Invalid password",
    passwordErrorDesc: "The password must be at least 8 characters long and match the confirmation field.",
    errorTitle: "Unable to send",
    errorDesc: "The request could not be sent. Check the configuration and try again.",
    labels: {
      fullName: "Full name",
      prospectType: "Prospect type",
      profession: "Profession / Role",
      email: "Email address",
      phone: "Phone",
      city: "City",
      country: "Country",
      sector: "Business sector",
      password: "Password",
      confirmPassword: "Confirm password",
      message: "Describe your need",
    },
    placeholders: {
      sector: "Choose your business sector",
      prospectType: "Choose your profile",
      message:
        "Example: we want to identify repetitive tasks, reduce request processing time, improve reporting, and define a first AI action plan adapted to our sector.",
    },
  },
} as const;

const ProspectRequestPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const copy = language === "en" ? pageCopy.en : pageCopy.fr;
  const [form, setForm] = useState<ProspectAuditFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const update = <K extends keyof ProspectAuditFormState>(key: K, value: ProspectAuditFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const inputClass =
    "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25";

  const resolveSubmissionError = (message?: string | null) => {
    if (!message) {
      return copy.errorDesc;
    }

    if (message.includes("submit_contact_request")) {
      return language === "en"
        ? "The public database configuration for this form is not synchronized yet. Please try again once the latest backend update is deployed."
        : "La configuration publique de la base pour ce formulaire n'est pas encore synchronisée. Merci de réessayer après déploiement de la dernière mise à jour backend.";
    }

    if (message.includes("invalid_phone")) {
      return language === "en"
        ? "Please enter a valid phone number with at least 8 digits."
        : "Merci de renseigner un numéro de téléphone valide avec au moins 8 chiffres.";
    }

    if (message.includes("invalid_email")) {
      return language === "en" ? "Please enter a valid email address." : "Merci de renseigner une adresse email valide.";
    }

    if (message.includes("contact_requests_prospect_username_idx") || message.includes("duplicate key value")) {
      return language === "en"
        ? "An audit request already exists for this email address. Please wait a few moments and try again; the latest update will reuse the existing prospect account."
        : "Une demande d'audit existe déjà pour cette adresse email. Merci de patienter quelques instants puis de réessayer ; la dernière mise à jour réutilise désormais le compte prospect existant.";
    }

    return message;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.privacyAccepted) {
      toast({
        title: copy.privacyErrorTitle,
        description: copy.privacyErrorDesc,
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
    const activeLanguage = resolveOutboundLanguage(language);
    const passwordHash = await hashPassword(form.password);

    const { data: requestId, error } = await supabase.rpc("submit_contact_request", {
      full_name_input: form.fullName.trim(),
      email_input: form.email.trim(),
      phone_input: form.phone.trim(),
      company_input: form.profession.trim(),
      profession_input: form.profession.trim(),
      prospect_type_input: toOptionalValue(form.prospectType),
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
      honeypot_input: form.botField.trim() || null,
      wants_expert_appointment_input: form.wantsExpertAppointment,
      prospect_username_input: form.email.trim().toLowerCase(),
      prospect_password_hash_input: passwordHash,
    });

    if (!error) {
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
        prospect_type: form.prospectType || null,
        sector: form.sector.trim() || null,
        source_page: "/demande-audit-gratuit",
      });

      toast({
        title: copy.successTitle,
        description: copy.successDesc,
      });

      setForm(emptyForm);
    } else {
      toast({
        title: copy.errorTitle,
        description: resolveSubmissionError(error.message),
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />

        <main className="relative z-10">
          <section className="px-4 py-16 lg:px-8">
            <div className="container mx-auto max-w-5xl">
              <div className="rounded-[34px] border border-[hsl(32_46%_84%)] bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)] md:p-10">
                <p className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {copy.badge}
                </p>
                <p className="mt-5 max-w-3xl text-[1.05rem] leading-9 text-muted-foreground">{copy.formLead}</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      placeholder={copy.labels.fullName}
                      required
                      value={form.fullName}
                      onChange={(event) => update("fullName", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.profession}
                      required
                      value={form.profession}
                      onChange={(event) => update("profession", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.email}
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.phone}
                      required
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.city}
                      required
                      value={form.city}
                      onChange={(event) => update("city", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.country}
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
                    className={`${inputClass} min-h-40`}
                  />

                  <div className="rounded-[30px] border border-[hsl(32_46%_84%)] bg-[hsl(32_100%_98%)] p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                        <LockKeyhole className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-2xl font-semibold text-card-foreground">{copy.secureTitle}</p>
                        <p className="mt-3 max-w-2xl text-[1.02rem] leading-8 text-muted-foreground">
                          {copy.secureLead}
                        </p>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          <div className="relative">
                            <input
                              placeholder={copy.labels.password}
                              type={isPasswordVisible ? "text" : "password"}
                              required
                              value={form.password}
                              onChange={(event) => update("password", event.target.value)}
                              className={`${inputClass} pr-12`}
                            />
                            <button
                              type="button"
                              aria-label={isPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                              onClick={() => setIsPasswordVisible((current) => !current)}
                              className="absolute inset-y-0 right-4 flex items-center text-muted-foreground transition-colors hover:text-card-foreground"
                            >
                              {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              placeholder={copy.labels.confirmPassword}
                              type={isConfirmPasswordVisible ? "text" : "password"}
                              required
                              value={form.confirmPassword}
                              onChange={(event) => update("confirmPassword", event.target.value)}
                              className={`${inputClass} pr-12`}
                            />
                            <button
                              type="button"
                              aria-label={
                                isConfirmPasswordVisible ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"
                              }
                              onClick={() => setIsConfirmPasswordVisible((current) => !current)}
                              className="absolute inset-y-0 right-4 flex items-center text-muted-foreground transition-colors hover:text-card-foreground"
                            >
                              {isConfirmPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    value={form.botField}
                    onChange={(event) => update("botField", event.target.value)}
                  />

                  <label className="flex items-start gap-3 rounded-3xl border border-[hsl(30_52%_84%)] bg-[hsl(32_100%_98%)] p-5 text-sm leading-8 text-card-foreground">
                    <input
                      type="checkbox"
                      checked={form.wantsExpertAppointment}
                      onChange={(event) => update("wantsExpertAppointment", event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span>{copy.appointmentPreference}</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm leading-8 text-muted-foreground">
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
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-8 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? copy.submitting : copy.submit}
                    <ArrowRight size={18} />
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
