import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, MailCheck, MessageSquareMore, ShieldCheck } from "lucide-react";
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
  company: string;
  sector: string;
  city: string;
  message: string;
  wantsExpertAppointment: boolean;
  privacyAccepted: boolean;
  botField: string;
};

const emptyForm: ProspectAuditFormState = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  sector: "",
  city: "",
  message: "",
  wantsExpertAppointment: false,
  privacyAccepted: false,
  botField: "",
};

const toOptionalValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const pageCopy = {
  fr: {
    badge: "Demande d'audit IA",
    title: "Formulaire de demande d'Audit IA",
    subtitle:
      "Le prospect commence ici. Nous accusons réception immédiatement, puis nous envoyons le formulaire d'audit sous environ 30 minutes à l'adresse fournie.",
    stepsTitle: "Comment le parcours fonctionne",
    steps: [
      "Vous envoyez votre demande avec vos informations essentielles.",
      "Vous recevez immédiatement un accusé de réception par email.",
      "Le formulaire d'audit vous est envoyé environ 30 minutes plus tard.",
      "Si vous l'avez demandé, un échange avec un expert peut être organisé après réception du formulaire.",
    ],
    formTitle: "Votre demande",
    formLead:
      "Remplissez cette requête pour recevoir le formulaire d'audit. La confirmation d'échange avec un expert est obligatoire avant l'envoi.",
    expertConfirmation:
      "Je confirme que je souhaite pouvoir discuter du formulaire avec un expert après réception, avant de le remplir.",
    privacy:
      "J'accepte que mes informations soient utilisées pour traiter ma demande d'audit et les échanges associés.",
    helperTitle: "Ce que vous recevrez",
    helperItems: [
      "Un email d'accusé de réception quelques instants après l'envoi.",
      "Le lien vers le formulaire d'audit environ 30 minutes plus tard.",
      "Une orientation vers un rendez-vous si vous avez demandé un échange avec un expert.",
    ],
    submit: "Envoyer ma demande",
    submitting: "Envoi en cours...",
    successTitle: "Demande envoyée",
    successDesc:
      "Votre demande a bien été enregistrée. Un accusé de réception part immédiatement, puis le formulaire d'audit sera envoyé sous environ 30 minutes.",
    expertRequiredTitle: "Confirmation requise",
    expertRequiredDesc:
      "Le prospect doit confirmer le souhait d'échanger avec un expert avant l'envoi du formulaire.",
    privacyErrorTitle: "Consentement requis",
    privacyErrorDesc: "Merci d'accepter le traitement de vos informations avant l'envoi.",
    errorTitle: "Envoi impossible",
    errorDesc: "La demande n'a pas pu être envoyée. Vérifiez la configuration et réessayez.",
    labels: {
      fullName: "Nom complet",
      email: "Adresse email",
      phone: "Téléphone",
      company: "Entreprise / organisation",
      sector: "Secteur ou domaine",
      city: "Ville / pays",
      message: "Contexte ou besoin",
    },
  },
  en: {
    badge: "AI audit request",
    title: "AI Audit Request Form",
    subtitle:
      "The prospect starts here. We acknowledge the request immediately, then send the audit questionnaire about 30 minutes later to the provided email address.",
    stepsTitle: "How the flow works",
    steps: [
      "You submit the request with the essential details.",
      "You receive an acknowledgement email right away.",
      "The audit questionnaire is sent about 30 minutes later.",
      "If requested, a discussion with an expert can be arranged after the questionnaire is received.",
    ],
    formTitle: "Your request",
    formLead:
      "Complete this request to receive the audit questionnaire. Confirming the wish to discuss it with an expert is required before delivery.",
    expertConfirmation:
      "I confirm that I want to discuss the audit questionnaire with an expert after receiving it, before completing it.",
    privacy:
      "I agree that my information may be used to process my audit request and the related follow-up.",
    helperTitle: "What you will receive",
    helperItems: [
      "An acknowledgement email shortly after submission.",
      "The audit questionnaire link about 30 minutes later.",
      "Guidance toward a meeting if you asked to discuss the questionnaire with an expert.",
    ],
    submit: "Send my request",
    submitting: "Sending...",
    successTitle: "Request sent",
    successDesc:
      "Your request has been recorded. An acknowledgement email goes out immediately, then the audit questionnaire will be sent in about 30 minutes.",
    expertRequiredTitle: "Confirmation required",
    expertRequiredDesc:
      "The prospect must confirm the wish to discuss the questionnaire with an expert before it is sent.",
    privacyErrorTitle: "Consent required",
    privacyErrorDesc: "Please accept data processing before sending the request.",
    errorTitle: "Unable to send",
    errorDesc: "The request could not be sent. Check the configuration and try again.",
    labels: {
      fullName: "Full name",
      email: "Email address",
      phone: "Phone",
      company: "Company / organization",
      sector: "Sector or domain",
      city: "City / country",
      message: "Context or need",
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

    if (!form.wantsExpertAppointment) {
      toast({
        title: copy.expertRequiredTitle,
        description: copy.expertRequiredDesc,
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

    if (!isSupabaseConfigured) {
      toast({
        title: copy.errorTitle,
        description: supabaseUnavailableMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const activeLanguage = resolveOutboundLanguage(language);

    const { data: requestId, error } = await supabase.rpc("submit_contact_request", {
      full_name_input: form.fullName.trim(),
      email_input: form.email.trim(),
      phone_input: form.phone.trim(),
      company_input: form.company.trim(),
      sector_input: toOptionalValue(form.sector),
      city_input: toOptionalValue(form.city),
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
    });

    if (!error) {
      await sendProspectEmailNotifications({
        requestId,
        intent: "demande-audit",
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        role: form.sector.trim() || null,
        city: form.city.trim() || null,
        domain: "Audit IA gratuit",
        message: form.message.trim() || null,
        sourcePage: "/demande-audit-gratuit",
        language: activeLanguage,
        wantsExpertAppointment: form.wantsExpertAppointment,
        appointmentUrl: buildAbsoluteAppointmentUrl("demande-audit", "Audit IA gratuit", {
          company: form.company.trim(),
          fullName: form.fullName.trim(),
        }),
      });

      trackAnalyticsEvent("audit_request_submitted", {
        intent: "demande-audit",
        language: activeLanguage,
        wants_expert_appointment: form.wantsExpertAppointment,
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
          <section className="border-b border-border/50 bg-[linear-gradient(180deg,rgba(16,33,61,0.98),rgba(16,33,61,0.92))] px-4 py-20 text-white lg:px-8">
            <div className="container mx-auto grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div>
                <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                  {copy.badge}
                </p>
                <h1 className="mt-6 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-5xl">
                  {copy.title}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
                  {copy.subtitle}
                </p>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/10 p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                  {copy.stepsTitle}
                </p>
                <div className="mt-5 grid gap-3">
                  {copy.steps.map((item, index) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-sm font-semibold text-orange-200">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-white/86">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-16 lg:px-8">
            <div className="container mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] border border-border bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)] md:p-10">
                <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.formTitle}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{copy.formLead}</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      placeholder={copy.labels.fullName}
                      required
                      value={form.fullName}
                      onChange={(event) => update("fullName", event.target.value)}
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
                      placeholder={copy.labels.company}
                      required
                      value={form.company}
                      onChange={(event) => update("company", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.sector}
                      value={form.sector}
                      onChange={(event) => update("sector", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder={copy.labels.city}
                      value={form.city}
                      onChange={(event) => update("city", event.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <textarea
                    placeholder={copy.labels.message}
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
                    <span>{copy.expertConfirmation}</span>
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

              <div className="space-y-5">
                <div className="rounded-[28px] border border-border bg-card p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.helperTitle}</p>
                  <div className="mt-5 grid gap-4">
                    {copy.helperItems.map((item, index) => {
                      const Icon = index === 0 ? MailCheck : index === 1 ? Clock3 : MessageSquareMore;
                      return (
                        <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon size={18} />
                          </div>
                          <p className="text-sm leading-6 text-card-foreground">{item}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[28px] border border-border bg-card p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-card-foreground">
                        {language === "en" ? "Safe and staged flow" : "Parcours sécurisé et progressif"}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {language === "en"
                          ? "The public site no longer exposes the audit questionnaire directly. We start with a qualified request, acknowledgement, then delayed delivery of the audit form."
                          : "Le site public n'expose plus directement le questionnaire d'audit. Le parcours passe d'abord par une requête qualifiée, un accusé de réception, puis un envoi différé du formulaire."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[hsl(30_55%_82%)] bg-[linear-gradient(135deg,hsl(32_100%_98%),hsl(28_62%_95%))] p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-primary">
                      <CheckCircle2 size={20} />
                    </div>
                    <p className="text-sm leading-7 text-card-foreground">
                      {language === "en"
                        ? "Operational rule: the questionnaire should be sent by the scheduled follow-up function roughly 30 minutes after this request is saved."
                        : "Règle opérationnelle : le questionnaire doit être envoyé par la fonction de suivi planifiée environ 30 minutes après l'enregistrement de cette demande."}
                    </p>
                  </div>
                </div>
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
