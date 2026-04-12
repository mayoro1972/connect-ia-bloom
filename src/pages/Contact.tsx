import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Mail, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
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
import { trackAnalyticsEvent } from "@/lib/analytics";

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

const supportedIntents = new Set([
  "demande-catalogue",
  "demande-renseignement",
  "contact-devis",
  "demande-referencement",
]);

const contactPageModel = {
  fr: {
    quickStartBadge: "Choisissez l'entrée la plus simple",
    quickStartTitle: "Parler à la bonne porte d'entrée",
    quickStartDesc:
      "Commencez par l'action la plus utile selon votre situation : réserver un audit IA gratuit, demander un devis ou nous écrire directement.",
    pathways: [
      {
        title: "Réserver un audit IA gratuit",
        desc: "Pour un premier échange de cadrage avec l'équipe et identifier les prochaines actions utiles.",
        cta: "Réserver mon audit gratuit",
        href: directLinks.appointment,
      },
      {
        title: "Demander un devis",
        desc: "Pour une formation, une session intra-entreprise ou une demande déjà suffisamment structurée.",
        cta: "Remplir le formulaire",
      },
      {
        title: "WhatsApp",
        desc: "Pour une question courte, un premier contact ou une orientation rapide.",
        cta: "Écrire sur WhatsApp",
        href: directLinks.whatsapp,
      },
    ],
    formIntroBadge: "Demande structurée",
    formIntroTitle: "Préparer une demande claire",
    formIntroDesc:
      "Renseignez d'abord l'essentiel. Les informations de contexte peuvent être ajoutées ensuite pour nous aider à préparer une réponse plus précise.",
    coreFieldsTitle: "Informations essentielles",
    optionalFieldsTitle: "Contexte complémentaire",
    optionalFieldsDesc:
      "Ajoutez ces informations si vous souhaitez une proposition plus ciblée. Elles ne sont pas obligatoires.",
    responseCardTitle: "Ce que vous obtenez ensuite",
    responsePoints: [
      "Un accusé de réception automatique",
      "Une qualification plus rapide du besoin",
      "Une réponse ou une proposition sous 24h à 48h ouvrées",
    ],
    contactCardTitle: "Contacts directs",
    helperTitle: "Pour aller plus vite",
    helperPoints: [
      "Indiquez le domaine ou la formation visée si vous le connaissez déjà",
      "Précisez le nombre estimé de participants pour une demande équipe",
      "Expliquez en une phrase le besoin principal ou le problème à résoudre",
    ],
  },
  en: {
    quickStartBadge: "Choose the simplest entry point",
    quickStartTitle: "Reach the right door first",
    quickStartDesc:
      "Start with the most useful action for your situation: book a free AI audit, request a quote, or message us directly.",
    pathways: [
      {
        title: "Book a free AI audit",
        desc: "For an initial scoping conversation with the team and a clearer next-step recommendation.",
        cta: "Book my free audit",
        href: directLinks.appointment,
      },
      {
        title: "Request a quote",
        desc: "For a training request, an in-company session, or a need that is already fairly scoped.",
        cta: "Fill the form",
      },
      {
        title: "WhatsApp",
        desc: "For a short question, a first contact, or quick orientation.",
        cta: "Write on WhatsApp",
        href: directLinks.whatsapp,
      },
    ],
    formIntroBadge: "Structured request",
    formIntroTitle: "Prepare a clear request",
    formIntroDesc:
      "Start with the essentials. You can then add more context to help us prepare a more precise response.",
    coreFieldsTitle: "Essential information",
    optionalFieldsTitle: "Additional context",
    optionalFieldsDesc:
      "Add these details if you want a more tailored proposal. They remain optional.",
    responseCardTitle: "What happens next",
    responsePoints: [
      "An automatic acknowledgement email",
      "Faster qualification of your request",
      "A response or proposal within 24 to 48 business hours",
    ],
    contactCardTitle: "Direct contacts",
    helperTitle: "To speed things up",
    helperPoints: [
      "Mention the domain or training track if you already know it",
      "Add the estimated number of participants for a team request",
      "Explain in one sentence the main need or problem to solve",
    ],
  },
} as const;

const ContactPage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const trans = language === "fr" ? fr : en;
  const sectors = trans.contact.sectors;
  const pageModel = contactPageModel[language === "en" ? "en" : "fr"];
  const requestedDomain = searchParams.get("domain") ?? "";
  const requestedIntent = searchParams.get("intent") ?? "contact-devis";
  const resolvedIntent = supportedIntents.has(requestedIntent) ? requestedIntent : "contact-devis";

  const [form, setForm] = useState<ContactFormState>({
    ...emptyForm,
    formations: requestedDomain,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      formations: current.formations || requestedDomain,
    }));
  }, [requestedDomain]);

  const resolvedIntroTitle =
    requestedIntent === "demande-catalogue"
      ? language === "en"
        ? "Request a domain catalogue"
        : "Demander un catalogue de domaine"
      : requestedIntent === "demande-renseignement"
        ? language === "en"
          ? "Clarify your need"
          : "Clarifier votre besoin"
        : pageModel.formIntroTitle;

  const resolvedIntroDesc =
    requestedIntent === "demande-catalogue"
      ? language === "en"
        ? "Use this form to receive the right catalogue and give us just enough context to guide you well."
        : "Utilisez ce formulaire pour recevoir le bon catalogue et nous donner juste assez de contexte pour bien vous orienter."
      : requestedIntent === "demande-renseignement"
        ? language === "en"
        ? "Use this form if your need is clear but you would like help choosing the right domain, pathway, or format."
          : "Utilisez ce formulaire si votre besoin est clair mais que vous souhaitez être aidé pour choisir le bon domaine, le bon parcours ou le bon format."
        : pageModel.formIntroDesc;

  const resolvedSubmitLabel =
    requestedIntent === "demande-catalogue"
      ? language === "en"
        ? "Send my catalogue request"
        : "Envoyer ma demande de Catalogue"
      : t("contact.submit");

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

    const { data: requestId, error } = await supabase.rpc("submit_contact_request", {
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
      request_intent_input: resolvedIntent,
      requested_domain_input: toOptionalValue(form.formations || requestedDomain),
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
      requestId,
      intent: resolvedIntent,
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
        source: resolvedIntent,
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

    trackAnalyticsEvent("lead_request_submitted", {
      intent: resolvedIntent,
      language: activeLanguage,
      requested_domain: form.formations.trim() || null,
      participants: participantsCount,
      source_page: "/contact",
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
            <div className="mx-auto mb-12 max-w-6xl rounded-[28px] border border-border bg-card p-8 md:p-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Sparkles size={14} />
                {pageModel.quickStartBadge}
              </div>
              <div className="mb-8 max-w-3xl">
                <h2 className="mb-3 font-heading text-2xl font-bold text-card-foreground md:text-3xl">{pageModel.quickStartTitle}</h2>
                <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">{pageModel.quickStartDesc}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {pageModel.pathways.map((pathway, index) => (
                  <motion.div
                    key={pathway.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex h-full flex-col rounded-3xl border border-border bg-background p-6"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {index === 0 ? <Calendar size={20} /> : index === 1 ? <Mail size={20} /> : <MessageCircle size={20} />}
                    </div>
                    <h3 className="mb-3 font-heading text-xl font-bold text-card-foreground">{pathway.title}</h3>
                    <p className="mb-6 flex-1 text-sm leading-7 text-muted-foreground">{pathway.desc}</p>
                    {pathway.href ? (
                      <a
                        href={pathway.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                      >
                        {pathway.cta}
                        <ArrowRight size={15} />
                      </a>
                    ) : (
                      <a href="#contact-form" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80">
                        {pathway.cta}
                        <ArrowRight size={15} />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-10 max-w-6xl mx-auto">
              <div id="contact-form" className="rounded-[28px] border border-border bg-card p-8 md:p-10">
                <div className="mb-6">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <Mail size={14} />
                    {pageModel.formIntroBadge}
                  </div>
                  <h2 className="mb-3 font-heading text-2xl font-bold text-card-foreground">{resolvedIntroTitle}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{resolvedIntroDesc}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="rounded-3xl border border-border bg-background p-5 md:p-6">
                    <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">{pageModel.coreFieldsTitle}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input placeholder={t("contact.name")} required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
                      <input placeholder={t("contact.email")} type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                      <input placeholder={t("contact.phone")} required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                      <input placeholder={t("contact.company")} required value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
                      <input placeholder={t("contact.formations")} value={form.formations} onChange={(e) => update("formations", e.target.value)} className={inputClass + " sm:col-span-2"} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-background p-5 md:p-6">
                    <div className="mb-4">
                      <h3 className="font-heading text-lg font-semibold text-card-foreground">{pageModel.optionalFieldsTitle}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{pageModel.optionalFieldsDesc}</p>
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
                      <input type="number" min="1" placeholder={t("contact.participants")} value={form.participants} onChange={(e) => update("participants", e.target.value)} className={inputClass} />
                      <div className="hidden sm:block" />
                      <textarea placeholder={t("contact.message")} rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass + " resize-none sm:col-span-2"} />
                    </div>
                  </div>

                  <input tabIndex={-1} autoComplete="off" value={form.botField} onChange={(e) => update("botField", e.target.value)} className="hidden" aria-hidden="true" />
                  <label className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
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
                  <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-coral-gradient px-6 py-3 font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70" style={{ color: "hsl(0 0% 100%)" }}>
                    {isSubmitting ? t("contact.submitPending") : resolvedSubmitLabel}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>

              <div className="space-y-5">
                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">{pageModel.responseCardTitle}</h3>
                  <div className="space-y-3">
                    {pageModel.responsePoints.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">{pageModel.contactCardTitle}</h3>
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

                <motion.a href={directLinks.whatsapp} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-3xl border border-border bg-card p-6 flex items-center gap-4 hover-lift block">
                  <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
                    <MessageCircle size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{t("contact.whatsapp")}</p>
                    <p className="text-xs text-muted-foreground">{contactDetails.whatsappDisplay}</p>
                  </div>
                </motion.a>

                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">{pageModel.helperTitle}</h3>
                  <div className="space-y-3">
                    {pageModel.helperPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
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
