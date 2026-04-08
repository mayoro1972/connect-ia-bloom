import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/i18n/LanguageContext";
import { fr } from "@/i18n/translations/fr";
import { en } from "@/i18n/translations/en";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { contactDetails, directLinks } from "@/lib/site-links";
import { resolveOutboundLanguage, sendProspectEmailNotifications } from "@/lib/prospect-emails";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  city: string;
  participants: string;
  formations: string;
  message: string;
  privacyAccepted: boolean;
  botField: string;
};

const emptyForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  sector: "",
  city: "",
  participants: "",
  formations: "",
  message: "",
  privacyAccepted: false,
  botField: "",
};

const toOptionalValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const ContactPage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const trans = language === "fr" ? fr : en;
  const sectors = trans.contact.sectors;

  const [form, setForm] = useState<ContactFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const activeLanguage = resolveOutboundLanguage(language);

    if (!form.privacyAccepted) {
      toast({
        title: t("contact.toastErrorTitle"),
        description: t("contact.privacyConsentError"),
        variant: "destructive",
      });
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: t("contact.toastErrorTitle"),
        description: supabaseUnavailableMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.rpc("submit_contact_request", {
      full_name_input: form.name.trim(),
      email_input: form.email.trim(),
      phone_input: form.phone.trim(),
      company_input: form.company.trim(),
      sector_input: toOptionalValue(form.sector),
      city_input: toOptionalValue(form.city),
      participants_input: form.participants.trim() || null,
      requested_formations_input: toOptionalValue(form.formations),
      message_input: toOptionalValue(form.message),
      source_page_input: "/contact",
      language_input: activeLanguage,
      request_intent_input: "contact-devis",
      requested_domain_input: null,
      privacy_consent_input: form.privacyAccepted,
      honeypot_input: form.botField.trim() || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: t("contact.toastErrorTitle"),
        description: t("contact.toastErrorDesc"),
        variant: "destructive",
      });
      return;
    }

    const participantsCount = (() => {
      const parsed = Number.parseInt(form.participants, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    })();

    const { error: notificationError } = await sendProspectEmailNotifications({
      intent: "contact-devis",
      fullName: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      role: form.sector.trim() || null,
      city: form.city.trim() || null,
      domain: form.formations.trim() || null,
      participants: participantsCount,
      message: form.message.trim() || null,
      sourcePage: "/contact",
      language: activeLanguage,
      appointmentUrl: `${window.location.origin}/prise-rdv?${new URLSearchParams({
        source: "contact-devis",
        domain: form.formations.trim(),
        company: form.company.trim(),
        fullName: form.name.trim(),
      }).toString()}`,
    });

    toast({
      title: t("contact.toastTitle"),
      description: notificationError
        ? "Votre demande a bien ete enregistree. L'accuse de reception email sera active des que la messagerie sera configuree."
        : t("contact.toastDesc"),
    });
    setForm(emptyForm);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={t("contact.title")} subtitle={t("contact.subtitle")} />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
              <div className="lg:col-span-2">
                <h2 className="font-heading text-2xl font-bold mb-6">{t("contact.formTitle")}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input placeholder={t("contact.name")} required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
                    <input placeholder={t("contact.email")} type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input placeholder={t("contact.phone")} required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                    <input placeholder={t("contact.company")} required value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <select value={form.sector} onChange={(e) => update("sector", e.target.value)} className={inputClass}>
                      <option value="">{t("contact.sector")}</option>
                      {sectors.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                    <input placeholder={t("contact.city")} value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="number" min="1" placeholder={t("contact.participants")} value={form.participants} onChange={(e) => update("participants", e.target.value)} className={inputClass} />
                    <input placeholder={t("contact.formations")} value={form.formations} onChange={(e) => update("formations", e.target.value)} className={inputClass} />
                  </div>
                  <textarea placeholder={t("contact.message")} rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass + " resize-none"} />
                  <input tabIndex={-1} autoComplete="off" value={form.botField} onChange={(e) => update("botField", e.target.value)} className="hidden" aria-hidden="true" />
                  <label className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={form.privacyAccepted}
                      onChange={(e) => update("privacyAccepted", e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span>
                      {t("contact.privacyConsent")}{" "}
                      <a href="/confidentialite" className="font-semibold text-primary underline-offset-4 hover:underline">
                        {t("contact.privacyLink")}
                      </a>
                      .
                    </span>
                  </label>
                  <button type="submit" disabled={isSubmitting} className="bg-coral-gradient font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-70" style={{ color: "hsl(0 0% 100%)" }}>
                    {isSubmitting ? t("contact.submitPending") : t("contact.submit")}
                  </button>
                </form>
              </div>

              <div className="space-y-5">
                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-heading font-semibold mb-4">{t("contact.coordTitle")}</h3>
                  <div className="space-y-3 text-sm">
                    <a href={directLinks.phone} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                      <Phone size={16} /> {contactDetails.phoneDisplay}
                    </a>
                    <a href={directLinks.email} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                      <Mail size={16} /> {contactDetails.email}
                    </a>
                    <a href={directLinks.map} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                      <MapPin size={16} /> {contactDetails.addressShort}
                    </a>
                  </div>
                </motion.div>

                <motion.a href={directLinks.whatsapp} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover-lift block">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <MessageCircle size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{t("contact.whatsapp")}</p>
                    <p className="text-xs text-muted-foreground">{contactDetails.whatsappDisplay}</p>
                  </div>
                </motion.a>

                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                    <Calendar size={18} /> {t("contact.appointmentTitle")}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{t("contact.appointmentDesc")}</p>
                  <a href={directLinks.appointment} className="w-full bg-teal-gradient font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity block text-center" style={{ color: "hsl(0 0% 100%)" }}>
                    {t("contact.appointmentCta")}
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
