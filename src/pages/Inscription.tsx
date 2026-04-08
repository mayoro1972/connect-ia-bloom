import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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

const InscriptionPage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { getTitle } = useFormationLocale();
  const [searchParams] = useSearchParams();
  const preselectedFormationId = getInitialFormationId(searchParams.get("formation"));

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
      appointmentUrl: `${window.location.origin}/prise-rdv?${new URLSearchParams({
        source: "contact-devis",
        domain: getTitle(selectedFormation),
        company: form.company.trim(),
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      }).toString()}`,
    });

    toast({
      title: t("inscription.toastTitle"),
      description: notificationError
        ? "Votre inscription a bien ete enregistree. La confirmation email sera activee des que la messagerie sera configuree."
        : t("inscription.toastDesc"),
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
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-5">
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
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default InscriptionPage;
