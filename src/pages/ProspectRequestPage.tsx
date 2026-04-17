import { useState } from "react";
import { ArrowRight } from "lucide-react";
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
  username: string;
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
  username: "",
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
    badge: "Demande d'audit IA",
    title: "Demande d'Audit",
    formLead:
      "Renseignez les informations essentielles pour créer votre fiche prospect, préparer l'envoi du formulaire d'audit et sécuriser votre accès.",
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
      profession: "Profession",
      email: "Adresse email",
      phone: "Téléphone",
      city: "Ville",
      country: "Pays",
      sector: "Secteur d'activité",
      username: "Username",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      message: "Décrivez votre besoin",
    },
    placeholders: {
      sector: "Choisissez votre secteur d'activité",
      prospectType: "Choisissez votre profil",
    },
  },
  en: {
    badge: "AI audit request",
    title: "Audit Request",
    formLead: "Share the key details needed to receive your audit questionnaire.",
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
      profession: "Profession",
      email: "Email address",
      phone: "Phone",
      city: "City",
      country: "Country",
      sector: "Business sector",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm password",
      message: "Describe your need",
    },
    placeholders: {
      sector: "Choose your business sector",
      prospectType: "Choose your profile",
    },
  },
} as const;

const ProspectRequestPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const copy = language === "en" ? pageCopy.en : pageCopy.fr;
  const [form, setForm] = useState<ProspectAuditFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof ProspectAuditFormState>(key: K, value: ProspectAuditFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const inputClass =
    "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25";

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
      prospect_username_input: form.username.trim().toLowerCase(),
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
        description: copy.errorDesc,
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
            <div className="container mx-auto max-w-3xl">
              <div className="rounded-[30px] border border-border bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)] md:p-10">
                <p className="inline-flex rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {copy.badge}
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{copy.formLead}</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      placeholder={copy.labels.fullName}
                      required
                      value={form.fullName}
                      onChange={(event) => update("fullName", event.target.value)}
                      className={inputClass}
                    />
                    <select
                      required
                      value={form.prospectType}
                      onChange={(event) => update("prospectType", event.target.value)}
                      className={inputClass}
                    >
                      <option value="">{copy.placeholders.prospectType}</option>
                      {(language === "en" ? prospectTypeOptions.en : prospectTypeOptions.fr).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
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
                    <input
                      placeholder={copy.labels.username}
                      required
                      value={form.username}
                      onChange={(event) => update("username", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.password}
                      type="password"
                      required
                      value={form.password}
                      onChange={(event) => update("password", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.confirmPassword}
                      type="password"
                      required
                      value={form.confirmPassword}
                      onChange={(event) => update("confirmPassword", event.target.value)}
                      className={`${inputClass} md:col-span-2`}
                    />
                  </div>

                  <textarea
                    placeholder={copy.labels.message}
                    required
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                    className={`${inputClass} min-h-32`}
                  />

                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
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
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
