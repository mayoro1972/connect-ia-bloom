import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import { formations, type Formation } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { useFormationLocale } from "@/hooks/useFormationLocale";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { resolveOutboundLanguage, sendProspectEmailNotifications } from "@/lib/prospect-emails";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { buildAbsoluteAppointmentUrl, buildContactPath } from "@/lib/site-links";

type InscriptionFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  formation: string;
  participants: string;
  message: string;
  privacyAccepted: boolean;
  botField: string;
};

const getInitialFormationId = (rawFormation: string | null) => {
  if (!rawFormation) return "";

  const matchedFormation = formations.find((formation) => formation.id === rawFormation || formation.title === rawFormation);
  return matchedFormation?.id ?? "";
};

const getFormationById = (formationId: string): Formation | undefined =>
  formations.find((formation) => formation.id === formationId);

const emptyInscriptionForm = (formationId = ""): InscriptionFormState => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  formation: formationId,
  participants: "1",
  message: "",
  privacyAccepted: false,
  botField: "",
});

const inscriptionCopy = {
  fr: {
    processTitle: "Ce qui se passe après votre demande",
    processSteps: [
      "Nous vérifions avec vous la formation choisie et votre objectif.",
      "Nous confirmons le format, les dates et le nombre de participants.",
      "Nous vous orientons si une autre formation est plus adaptée.",
      "Vous recevez une réponse sous 24h.",
    ],
    benefitsTitle: "Pourquoi passer par cette demande d'inscription",
    benefits: [
      "Être orienté vers la bonne formation avant engagement.",
      "Valider le bon niveau selon votre profil et vos besoins.",
      "Préparer une inscription individuelle ou équipe.",
      "Obtenir les modalités adaptées à votre contexte.",
    ],
    alternativeTitle: "Vous hésitez encore ?",
    alternativeText:
      "Si vous n'êtes pas encore certain de la bonne formation, nous pouvons d'abord vous orienter vers le parcours le plus adapté.",
    alternativeCta: "Parler à un expert IA",
    formTitle: "Votre demande d'inscription",
    formNote:
      "Prix sur demande, confirmation sous 24h, accompagnement possible si vous hésitez entre plusieurs formations.",
  },
  en: {
    processTitle: "What happens after your request",
    processSteps: [
      "We review the selected course with you and clarify your objective.",
      "We confirm the format, dates, and number of participants.",
      "We guide you to another course if it is a better fit.",
      "You receive a response within 24 hours.",
    ],
    benefitsTitle: "Why use this registration request",
    benefits: [
      "Get guided toward the right course before committing.",
      "Validate the right level for your profile and needs.",
      "Prepare an individual or team registration.",
      "Receive the right delivery options for your context.",
    ],
    alternativeTitle: "Still hesitating?",
    alternativeText:
      "If you are not fully sure which course is right for you, we can first guide you toward the best-fit path.",
    alternativeCta: "Speak with an AI expert",
    formTitle: "Your registration request",
    formNote:
      "Pricing available on request, confirmation within 24 hours, and guidance available if you are hesitating between several courses.",
  },
} as const;

const InscriptionPage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { getTitle } = useFormationLocale();
  const [searchParams] = useSearchParams();
  const preselectedFormationId = getInitialFormationId(searchParams.get("formation"));
  const copy = inscriptionCopy[language === "en" ? "en" : "fr"];

  const [form, setForm] = useState<InscriptionFormState>(() => emptyInscriptionForm(preselectedFormationId));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeLanguage = resolveOutboundLanguage(language);

    const selectedFormation = getFormationById(form.formation);
    if (!selectedFormation) {
      toast({
        title: t("inscription.toastErrorTitle"),
        description: t("inscription.toastErrorDesc"),
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

    const participants = Number.parseInt(form.participants, 10);
    if (!form.privacyAccepted) {
      setIsSubmitting(false);
      toast({
        title: t("inscription.toastErrorTitle"),
        description: t("inscription.privacyConsentError"),
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.rpc("submit_registration_request", {
      first_name_input: form.firstName.trim(),
      last_name_input: form.lastName.trim(),
      email_input: form.email.trim(),
      phone_input: form.phone.trim(),
      company_input: form.company.trim(),
      position_input: form.position.trim() || null,
      formation_id_input: selectedFormation.id,
      formation_title_input: getTitle(selectedFormation),
      participants_input: Number.isFinite(participants) && participants > 0 ? participants : 1,
      message_input: form.message.trim() || null,
      source_page_input: "/inscription",
      language_input: activeLanguage,
      privacy_consent_input: form.privacyAccepted,
      honeypot_input: form.botField.trim() || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: t("inscription.toastErrorTitle"),
        description: t("inscription.toastErrorDesc"),
        variant: "destructive",
      });
      return;
    }

    const { error: notificationError } = await sendProspectEmailNotifications({
      intent: "inscription",
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      role: form.position.trim() || null,
      formationTitle: getTitle(selectedFormation),
      participants: Number.isFinite(participants) && participants > 0 ? participants : 1,
      message: form.message.trim() || null,
      sourcePage: "/inscription",
      language: activeLanguage,
      appointmentUrl: buildAbsoluteAppointmentUrl("contact-devis", getTitle(selectedFormation), {
        company: form.company.trim(),
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      }),
    });

    toast({
      title: t("inscription.toastTitle"),
      description: notificationError
        ? "Votre inscription a bien ete enregistree. La confirmation email sera activee des que la messagerie sera configuree."
        : t("inscription.toastDesc"),
    });
    trackAnalyticsEvent("registration_request_submitted", {
      formation_id: selectedFormation.id,
      formation_title: getTitle(selectedFormation),
      participants: Number.isFinite(participants) && participants > 0 ? participants : 1,
    });
    setForm(emptyInscriptionForm());
  };

  const update = <K extends keyof InscriptionFormState>(key: K, value: InscriptionFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("inscription.title")} subtitle={t("inscription.subtitle")} />

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Clock3 size={22} />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.processTitle}</h2>
                  </div>
                  <ul className="space-y-3">
                    {copy.processSteps.map((step) => (
                      <li key={step} className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-xl p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <ShieldCheck size={22} />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.benefitsTitle}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {copy.benefits.map((benefit) => (
                      <div key={benefit} className="rounded-lg border border-border bg-background px-4 py-4 text-sm text-muted-foreground">
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-gradient rounded-xl p-7 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                      <Sparkles size={22} />
                    </div>
                    <h2 className="font-heading text-2xl font-bold">{copy.alternativeTitle}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-white/80 mb-5">{copy.alternativeText}</p>
                  <a
                    href={buildContactPath("demande-renseignement")}
                    className="inline-flex items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    {copy.alternativeCta}
                  </a>
                </div>
              </div>

              <div className="lg:sticky lg:top-24">
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-5">
                  <div className="border-b border-border pb-5">
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{copy.formTitle}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.formNote}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.firstName")}</label>
                      <input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.lastName")}</label>
                      <input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.email")}</label>
                      <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.phone")}</label>
                      <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.company")}</label>
                      <input required value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.position")}</label>
                      <input value={form.position} onChange={(e) => update("position", e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.formation")}</label>
                    <select required value={form.formation} onChange={(e) => update("formation", e.target.value)} className={inputClass}>
                      <option value="">{t("inscription.selectFormation")}</option>
                      {formations.map((f) => <option key={f.id} value={f.id}>{getTitle(f)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.participants")}</label>
                    <input type="number" min="1" value={form.participants} onChange={(e) => update("participants", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">{t("inscription.message")}</label>
                    <textarea rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass + " resize-none"} />
                  </div>
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.botField}
                    onChange={(e) => update("botField", e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <label className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={form.privacyAccepted}
                      onChange={(e) => update("privacyAccepted", e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span>
                      {t("inscription.privacyConsent")}{" "}
                      <a href="/confidentialite" className="font-semibold text-primary underline-offset-4 hover:underline">
                        {t("inscription.privacyLink")}
                      </a>
                      .
                    </span>
                  </label>
                  <button type="submit" disabled={isSubmitting} className="bg-orange-gradient font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity w-full disabled:cursor-not-allowed disabled:opacity-70" style={{ color: "hsl(0 0% 100%)" }}>
                    {isSubmitting ? t("inscription.submitPending") : t("inscription.submit")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default InscriptionPage;
