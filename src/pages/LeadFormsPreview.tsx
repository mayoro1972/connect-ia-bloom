import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, ChevronRight, FileText, Headset, Mail, Send, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { domainPreviews, getLocalizedDomainLabel } from "@/lib/catalogue-preview";
import { buildAbsoluteAppointmentUrl, contactDetails, directLinks, socialLinks } from "@/lib/site-links";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveOutboundLanguage, sendProspectEmailNotifications } from "@/lib/prospect-emails";
import { trackAnalyticsEvent } from "@/lib/analytics";

type FormIntent = "demande-catalogue" | "demande-renseignement" | "contact-devis" | "demande-referencement";
type FormState = { fullName: string; email: string; phone: string; company: string; website: string; role: string; country: string; domain: string; participants: string; format: string; timeline: string; message: string };
type FormModel = { label: string; title: string; subtitle: string; helper: string; outcome: string[]; exampleLabel: string; exampleMessage: string; exampleData: FormState };

const emptyForm: FormState = { fullName: "", email: "", phone: "", company: "", website: "", role: "", country: "", domain: "", participants: "", format: "", timeline: "", message: "" };

const intentButtons: { value: FormIntent; icon: typeof FileText }[] = [
  { value: "demande-catalogue", icon: FileText },
  { value: "demande-renseignement", icon: Headset },
  { value: "contact-devis", icon: Mail },
  { value: "demande-referencement", icon: Sparkles },
];

const models = {
  fr: {
    page: {
      badge: "Demandes & contact", title: "Demande d'information, de devis ou de référencement", subtitle: "Choisissez le bon modèle selon votre besoin.", recommended: "Parcours recommandé",
      recommendedText: "1. Le visiteur choisit le bon modèle. 2. Il renseigne son besoin. 3. La demande mène vers la bonne suite : réponse email, orientation ou audit IA gratuit.",
      selected: "Modèle sélectionné", fullName: "Nom complet *", email: "Email professionnel *", phone: "Téléphone / WhatsApp *", company: "Entreprise / institution *", website: "Site web", role: "Fonction / rôle", country: "Pays / ville",
      domain: "Domaine demandé", participants: "Nombre de participants estimé", format: "Format souhaité", listingFormat: "Type de présence souhaité", timeline: "Échéance / période souhaitée", consentTitle: "Consentement requis",
      consentDesc: "Merci d'accepter la politique de confidentialité avant d'envoyer votre demande.", consentText: "J'accepte que mes données soient traitées uniquement pour répondre à ma demande, dans le respect de la", privacy: "politique de confidentialité",
      load: "Charger l'exemple", sending: "Envoi en cours...", success: "Demande envoyée", successDesc: "Votre demande a bien été enregistrée. Vous pouvez maintenant choisir un rendez-vous de cadrage.", successPending: "Votre demande a bien été enregistrée. L'email de confirmation sera activé une fois la messagerie finalisée.",
      error: "Envoi impossible", errorDesc: "Votre demande n'a pas pu être enregistrée. Merci de réessayer dans un instant.", exampleTitle: "Message suggéré", receives: "Ce que reçoit le prospect",
      receivesItems: ["Un accusé de réception clair et rassurant.", "Une réponse contextualisée selon le domaine et le besoin exprimé.", "Une orientation claire vers l'audit IA gratuit si un échange est utile."],
      attached: "Suite recommandée", attachedText: "Une fois le formulaire validé, le prospect peut poursuivre avec un audit IA gratuit pour cadrer la suite.", preview: "Réserver un audit IA gratuit",
      contacts: "Contacts directs", whatsapp: "Assistant IA WhatsApp", submit: { "demande-catalogue": "Recevoir le catalogue", "demande-renseignement": "Envoyer la demande", "contact-devis": "Envoyer la demande", "demande-referencement": "Envoyer la demande de référencement" },
      formats: ["Présentiel", "Hybride", "En ligne", "À définir"],
      listingFormats: ["Présence standard", "Présence renforcée", "Collaboration éditoriale", "À recommander"],
    },
    forms: {
      "demande-catalogue": { label: "Demande de catalogue", title: "Recevoir le catalogue d'un domaine", subtitle: "Brochure du domaine demandé, sans prix affichés.", helper: "Idéal pour comparer les formations avant d'aborder la question du budget.", outcome: ["Envoi du catalogue choisi", "Sélection plus rapide", "Proposition de rendez-vous"], exampleLabel: "Exemple concret", exampleMessage: "Bonjour, nous souhaitons recevoir le catalogue du domaine Ressources Humaines afin d'identifier les formations les plus adaptées à notre équipe.", exampleData: { ...emptyForm, fullName: "Aminata Kone", email: "aminata.kone@entreprise.ci", phone: "+225 07 00 00 00 00", company: "Nova Talent Côte d'Ivoire", role: "Responsable développement RH", country: "Abidjan, Côte d'Ivoire", domain: "Ressources Humaines", participants: "8", format: "hybride", timeline: "Sous 30 jours", message: "Bonjour, nous souhaitons recevoir le catalogue du domaine Ressources Humaines afin d'identifier les formations les plus adaptées à notre équipe." } },
      "demande-renseignement": { label: "Demande de renseignement", title: "Être orienté vers la bonne formation", subtitle: "Recueillir le contexte pour recommander le bon domaine.", helper: "Parfait si le besoin métier est clair mais pas encore la formation.", outcome: ["Orientation vers le bon domaine", "2 à 3 formations pertinentes", "Qualification avant échange"], exampleLabel: "Exemple concret", exampleMessage: "Nous voulons former notre équipe marketing à l'usage de l'IA pour la création de contenu.", exampleData: { ...emptyForm, fullName: "Lina Mensah", email: "l.mensah@brandworks.africa", phone: "+233 24 000 0000", company: "BrandWorks Africa", role: "Marketing Manager", country: "Accra, Ghana", domain: "Marketing & Communication", participants: "6", format: "presentiel", timeline: "Dans le trimestre", message: "Nous voulons former notre équipe marketing à l'usage de l'IA pour la création de contenu." } },
      "contact-devis": { label: "Contact / devis", title: "Recevoir une proposition sur mesure", subtitle: "Préparer une offre adaptée au format, au volume et au niveau souhaités.", helper: "À utiliser quand le besoin est déjà assez structuré.", outcome: ["Qualification commerciale", "Préparation d'une offre", "Invitation à un rendez-vous"], exampleLabel: "Exemple concret", exampleMessage: "Merci de nous adresser une proposition pour une session intra-entreprise sur le domaine Finance & Comptabilité.", exampleData: { ...emptyForm, fullName: "Jean-Marc Bamba", email: "jm.bamba@finaxis-group.com", phone: "+225 05 00 00 00 00", company: "Finaxis Group", role: "Directeur Administratif et Financier", country: "Abidjan, Côte d'Ivoire", domain: "Finance & Comptabilité", participants: "12", format: "presentiel", timeline: "Avant fin de mois", message: "Merci de nous adresser une proposition pour une session intra-entreprise sur le domaine Finance & Comptabilité." } },
      "demande-referencement": { label: "Référencement partenaire", title: "Demander une présence sur TransferAI Africa", subtitle: "Présentez votre organisation pour une étude éditoriale et commerciale de référencement ou de mise en avant.", helper: "Parfait pour les entreprises, écoles, cabinets, médias ou structures qui souhaitent gagner en visibilité auprès de notre audience.", outcome: ["Étude du dossier et de la cohérence éditoriale", "Retour par email avec les modalités possibles", "Validation puis proposition de mise en ligne"], exampleLabel: "Exemple concret", exampleMessage: "Bonjour, nous souhaitons étudier une présence de notre organisation sur votre page partenaires. Merci de nous indiquer les modalités possibles après revue de notre activité.", exampleData: { ...emptyForm, fullName: "Awa Traore", email: "awa.traore@africadigitalhub.com", phone: "+225 07 00 00 00 01", company: "Africa Digital Hub", website: "https://africadigitalhub.com", role: "Responsable partenariats", country: "Abidjan, Côte d'Ivoire", domain: "Innovation & Transformation Digitale", timeline: "Publication souhaitée au prochain trimestre", message: "Bonjour, nous souhaitons étudier une présence de notre organisation sur votre page partenaires. Merci de nous indiquer les modalités possibles après revue de notre activité." } },
    },
  },
  en: {
    page: {
      badge: "Requests & contact", title: "Information, quote, or listing request", subtitle: "Choose the right model depending on the need.", recommended: "Recommended flow",
      recommendedText: "1. The visitor selects the right model. 2. They describe their need. 3. The request leads to the right next step: email reply, guidance, or a free AI audit.",
      selected: "Selected model", fullName: "Full name *", email: "Professional email *", phone: "Phone / WhatsApp *", company: "Company / institution *", website: "Website", role: "Role / position", country: "Country / city",
      domain: "Requested domain", participants: "Estimated participants", format: "Preferred format", listingFormat: "Preferred visibility type", timeline: "Target timeline", consentTitle: "Consent required",
      consentDesc: "Please accept the privacy policy before sending your request.", consentText: "I agree that my data may be processed only to answer my request, in accordance with the", privacy: "privacy policy",
      load: "Load sample", sending: "Sending...", success: "Request sent", successDesc: "Your request has been saved. You can now choose a scoping meeting slot.", successPending: "Your request has been saved. The confirmation email will be activated once messaging is fully configured.",
      error: "Unable to send", errorDesc: "Your request could not be saved. Please try again in a moment.", exampleTitle: "Suggested message", receives: "What the prospect receives",
      receivesItems: ["A clear acknowledgement.", "A contextualized response based on the domain and expressed need.", "A clear direction toward the free AI audit when a conversation is useful."],
      attached: "Recommended next step", attachedText: "Once the form is validated, the prospect can continue with a free AI audit to clarify next steps.", preview: "Book a free AI audit",
      contacts: "Direct contacts", whatsapp: "AI WhatsApp assistant", submit: { "demande-catalogue": "Receive catalogue", "demande-renseignement": "Send request", "contact-devis": "Send request", "demande-referencement": "Send listing request" },
      formats: ["On-site", "Hybrid", "Online", "To be defined"],
      listingFormats: ["Standard presence", "Enhanced presence", "Editorial collaboration", "Recommend the best option"],
    },
    forms: {
      "demande-catalogue": { label: "Catalogue request", title: "Receive a domain catalogue", subtitle: "Request the brochure for a selected domain with no visible pricing.", helper: "Ideal for comparing courses before discussing budget.", outcome: ["Catalogue delivery", "Faster prioritization", "Meeting proposal"], exampleLabel: "Sample use case", exampleMessage: "Hello, we would like to receive the Human Resources catalogue to identify the most relevant courses for our team.", exampleData: { ...emptyForm, fullName: "Aminata Kone", email: "aminata.kone@entreprise.ci", phone: "+225 07 00 00 00 00", company: "Nova Talent Cote d'Ivoire", role: "HR Development Manager", country: "Abidjan, Ivory Coast", domain: "Ressources Humaines", participants: "8", format: "hybride", timeline: "Within 30 days", message: "Hello, we would like to receive the Human Resources catalogue to identify the most relevant courses for our team." } },
      "demande-renseignement": { label: "Information request", title: "Be guided to the right training", subtitle: "Collect context and constraints in order to recommend the right domain.", helper: "Perfect when the business need is clear but the exact course is not.", outcome: ["Guidance to the right domain", "2 to 3 relevant courses", "Qualification before a conversation"], exampleLabel: "Sample use case", exampleMessage: "We want to train our marketing team on AI for content creation.", exampleData: { ...emptyForm, fullName: "Lina Mensah", email: "l.mensah@brandworks.africa", phone: "+233 24 000 0000", company: "BrandWorks Africa", role: "Marketing Manager", country: "Accra, Ghana", domain: "Marketing & Communication", participants: "6", format: "presentiel", timeline: "This quarter", message: "We want to train our marketing team on AI for content creation." } },
      "contact-devis": { label: "Contact / quote", title: "Receive a tailored proposal", subtitle: "Prepare an offer aligned with the requested format, volume and level.", helper: "Use this when the need is already fairly structured.", outcome: ["Commercial qualification", "Offer preparation", "Invitation to a meeting"], exampleLabel: "Sample use case", exampleMessage: "Please send us a proposal for an in-house session in the Finance & Accounting domain.", exampleData: { ...emptyForm, fullName: "Jean-Marc Bamba", email: "jm.bamba@finaxis-group.com", phone: "+225 05 00 00 00 00", company: "Finaxis Group", role: "Chief Financial Officer", country: "Abidjan, Ivory Coast", domain: "Finance & Comptabilite", participants: "12", format: "presentiel", timeline: "Before month end", message: "Please send us a proposal for an in-house session in the Finance & Accounting domain." } },
      "demande-referencement": { label: "Partner listing", title: "Request visibility on TransferAI Africa", subtitle: "Introduce your organization for an editorial and commercial review of a listing or featured presence.", helper: "Best for companies, schools, firms, media brands, or organizations that want visibility with our audience.", outcome: ["Review of fit and editorial relevance", "Email feedback with possible visibility options", "Validation followed by publication proposal"], exampleLabel: "Sample use case", exampleMessage: "Hello, we would like to explore a presence for our organization on your partners page. Please share the available options after reviewing our activity.", exampleData: { ...emptyForm, fullName: "Awa Traore", email: "awa.traore@africadigitalhub.com", phone: "+225 07 00 00 00 01", company: "Africa Digital Hub", website: "https://africadigitalhub.com", role: "Partnerships manager", country: "Abidjan, Ivory Coast", domain: "Innovation & Digital Transformation", timeline: "Preferred publication next quarter", message: "Hello, we would like to explore a presence for our organization on your partners page. Please share the available options after reviewing our activity." } },
    },
  },
} as const;

const LeadFormsPreview = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedDomain = searchParams.get("domain") ?? "";
  const requestedIntent = (searchParams.get("intent") as FormIntent | null) ?? "contact-devis";
  const [activeIntent, setActiveIntent] = useState<FormIntent>(requestedIntent);
  const [form, setForm] = useState<FormState>({ ...emptyForm, domain: requestedIntent === "demande-referencement" ? "" : requestedDomain });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [botField, setBotField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = models[language];
  const activeModel = copy.forms[activeIntent];
  const isReferencingIntent = activeIntent === "demande-referencement";
  const domainPlaceholder = isReferencingIntent
    ? language === "fr"
      ? "Secteur / activité"
      : "Sector / activity"
    : copy.page.domain;

  useEffect(() => {
    setActiveIntent(requestedIntent);
    setForm((current) => ({
      ...current,
      domain: requestedIntent === "demande-referencement" ? current.domain : requestedDomain || current.domain,
    }));
  }, [requestedDomain, requestedIntent]);

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const loadExample = () =>
    setForm({
      ...activeModel.exampleData,
      domain: requestedIntent === "demande-referencement" ? activeModel.exampleData.domain : requestedDomain || activeModel.exampleData.domain,
    });
  const participantsCount = useMemo(() => { const parsed = Number.parseInt(form.participants, 10); return Number.isFinite(parsed) && parsed > 0 ? parsed : null; }, [form.participants]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!privacyAccepted) return toast({ title: copy.page.consentTitle, description: copy.page.consentDesc, variant: "destructive" });
    if (!isSupabaseConfigured) {
      return toast({ title: copy.page.error, description: supabaseUnavailableMessage, variant: "destructive" });
    }
    const activeLanguage = resolveOutboundLanguage(language);
    setIsSubmitting(true);
    const effectiveDomain = isReferencingIntent
      ? form.domain.trim() || null
      : form.domain.trim() || requestedDomain || null;
    let error: { message?: string } | null = null;
    let requestId: string | null = null;

    if (isReferencingIntent) {
      const listingResult = await (supabase as any).rpc("submit_partner_listing_request", {
        full_name_input: form.fullName.trim(),
        email_input: form.email.trim(),
        phone_input: form.phone.trim(),
        company_input: form.company.trim(),
        website_input: form.website.trim() || null,
        role_input: form.role.trim() || null,
        city_input: form.country.trim() || null,
        sector_activity_input: effectiveDomain,
        requested_visibility_type_input: form.format.trim() || null,
        timeline_input: form.timeline.trim() || null,
        message_input: form.message.trim() || null,
        source_page_input: "/contact",
        language_input: activeLanguage,
        privacy_consent_input: privacyAccepted,
        honeypot_input: botField.trim() || null,
      });

      if (listingResult?.error) {
        const fallbackResult = await supabase.rpc("submit_contact_request", {
          full_name_input: form.fullName.trim(),
          email_input: form.email.trim(),
          phone_input: form.phone.trim(),
          company_input: form.company.trim(),
          sector_input: form.role.trim() || null,
          city_input: form.country.trim() || null,
          participants_input: null,
          requested_formations_input: effectiveDomain,
          message_input: form.message.trim() || null,
          source_page_input: "/contact",
          language_input: activeLanguage,
          request_intent_input: activeIntent,
          requested_domain_input: effectiveDomain,
          privacy_consent_input: privacyAccepted,
          honeypot_input: botField.trim() || null,
        });

        requestId = fallbackResult.data ?? null;
        error = fallbackResult.error;
      }
    } else {
      const defaultResult = await supabase.rpc("submit_contact_request", {
        full_name_input: form.fullName.trim(),
        email_input: form.email.trim(),
        phone_input: form.phone.trim(),
        company_input: form.company.trim(),
        sector_input: form.role.trim() || null,
        city_input: form.country.trim() || null,
        participants_input: participantsCount,
        requested_formations_input: effectiveDomain,
        message_input: form.message.trim() || null,
        source_page_input: "/contact",
        language_input: activeLanguage,
        request_intent_input: activeIntent,
        requested_domain_input: effectiveDomain,
        privacy_consent_input: privacyAccepted,
        honeypot_input: botField.trim() || null,
      });

      requestId = defaultResult.data ?? null;
      error = defaultResult.error;
    }

    setIsSubmitting(false);
    if (error) return toast({ title: copy.page.error, description: copy.page.errorDesc, variant: "destructive" });
    const appointmentUrl = isReferencingIntent
      ? null
      : buildAbsoluteAppointmentUrl(activeIntent, form.domain || requestedDomain, {
          company: form.company,
          fullName: form.fullName,
        });
    const { error: notificationError } = await sendProspectEmailNotifications({ requestId, intent: activeIntent, fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(), company: form.company.trim(), website: form.website.trim() || null, role: form.role.trim() || null, city: form.country.trim() || null, domain: effectiveDomain, participants: isReferencingIntent ? null : participantsCount, format: isReferencingIntent ? null : form.format.trim() || null, timeline: form.timeline.trim() || null, message: form.message.trim() || null, sourcePage: "/contact", language: activeLanguage, appointmentUrl });
    const successDescription = notificationError
      ? copy.page.successPending
      : isReferencingIntent
        ? language === "fr"
          ? "Votre demande de référencement a bien été transmise. Notre équipe reviendra vers vous par email après étude du dossier."
          : "Your listing request has been submitted successfully. Our team will reply by email after reviewing your file."
        : copy.page.successDesc;
    toast({ title: copy.page.success, description: successDescription });
    trackAnalyticsEvent("lead_request_submitted", {
      request_intent: activeIntent,
      requested_domain: effectiveDomain,
      participants: participantsCount ?? undefined,
    });
    setForm({ ...emptyForm, domain: isReferencingIntent ? "" : requestedDomain });
    if (!isReferencingIntent && appointmentUrl) {
      navigate(appointmentUrl.replace(window.location.origin, ""));
    }
  };

  const inputClass = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={copy.page.badge} title={copy.page.title} subtitle={copy.page.subtitle} />
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 space-y-8">
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.page.recommended}</p>
              <div className="mt-3 text-sm text-muted-foreground">
                <p>{copy.page.recommendedText}</p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-border bg-card/80 p-6">
                <div className="flex flex-wrap gap-3">
                  {intentButtons.map((item) => { const Icon = item.icon; const isActive = activeIntent === item.value; return <button key={item.value} type="button" onClick={() => setActiveIntent(item.value)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-primary text-primary-foreground" : "border border-border bg-background text-card-foreground hover:bg-muted"}`}><Icon size={15} /> {copy.forms[item.value].label}</button>; })}
                </div>
                <div className="mt-6 rounded-3xl border border-border bg-background/80 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.page.selected}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{activeModel.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{activeModel.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-card-foreground">{activeModel.helper}</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">{activeModel.outcome.map((item) => <div key={item} className="rounded-2xl border border-border bg-card/80 p-4 text-sm text-muted-foreground">{item}</div>)}</div>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2"><input required placeholder={copy.page.fullName} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} /><input required type="email" placeholder={copy.page.email} value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} /></div>
                  <div className="grid gap-4 md:grid-cols-2"><input required placeholder={copy.page.phone} value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} /><input required placeholder={copy.page.company} value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} /></div>
                  <div className="grid gap-4 md:grid-cols-2"><input placeholder={copy.page.website} value={form.website} onChange={(e) => update("website", e.target.value)} className={inputClass} /><input placeholder={copy.page.role} value={form.role} onChange={(e) => update("role", e.target.value)} className={inputClass} /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input placeholder={copy.page.country} value={form.country} onChange={(e) => update("country", e.target.value)} className={inputClass} />
                    {isReferencingIntent ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-card-foreground">{domainPlaceholder}</p>
                        <input
                          placeholder={domainPlaceholder}
                          value={form.domain}
                          onChange={(e) => update("domain", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    ) : (
                      <select value={form.domain} onChange={(e) => update("domain", e.target.value)} className={inputClass}><option value="">{domainPlaceholder}</option>{domainPreviews.map((item) => <option key={item.slug} value={item.domain}>{getLocalizedDomainLabel(item.domain, language)}</option>)}</select>
                    )}
                  </div>
                  {!isReferencingIntent ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2"><input placeholder={copy.page.participants} value={form.participants} onChange={(e) => update("participants", e.target.value)} className={inputClass} /><select value={form.format} onChange={(e) => update("format", e.target.value)} className={inputClass}><option value="">{copy.page.format}</option><option value="presentiel">{copy.page.formats[0]}</option><option value="hybride">{copy.page.formats[1]}</option><option value="distanciel">{copy.page.formats[2]}</option><option value="a-definir">{copy.page.formats[3]}</option></select></div>
                      <input placeholder={copy.page.timeline} value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={inputClass} />
                    </>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <select value={form.format} onChange={(e) => update("format", e.target.value)} className={inputClass}>
                        <option value="">{copy.page.listingFormat}</option>
                        <option value="presence-standard">{copy.page.listingFormats[0]}</option>
                        <option value="presence-renforcee">{copy.page.listingFormats[1]}</option>
                        <option value="collaboration-editoriale">{copy.page.listingFormats[2]}</option>
                        <option value="a-recommander">{copy.page.listingFormats[3]}</option>
                      </select>
                      <input placeholder={copy.page.timeline} value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={inputClass} />
                    </div>
                  )}
                  <textarea rows={6} placeholder={activeModel.exampleMessage} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputClass} min-h-[180px] resize-y`} />
                  <input tabIndex={-1} autoComplete="off" value={botField} onChange={(e) => setBotField(e.target.value)} className="hidden" aria-hidden="true" />
                  <label className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground"><input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" /><span>{copy.page.consentText} <Link to="/confidentialite" className="font-semibold text-primary underline-offset-4 hover:underline">{copy.page.privacy}</Link>.</span></label>
                  <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={loadExample} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-semibold text-card-foreground hover:bg-muted"><Sparkles size={16} /> {copy.page.load}</button><button type="submit" disabled={isSubmitting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-gradient px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70" style={{ color: "hsl(0 0% 100%)" }}><Send size={16} /> {isSubmitting ? copy.page.sending : copy.page.submit[activeIntent]}</button></div>
                </form>
              </div>
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card/80 p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{activeModel.exampleLabel}</p><h2 className="mt-2 font-heading text-2xl font-bold text-card-foreground">{copy.page.exampleTitle}</h2><p className="mt-4 rounded-2xl border border-border bg-background/80 p-5 text-sm leading-relaxed text-muted-foreground">{activeModel.exampleMessage}</p></div>
                <div className="rounded-3xl border border-border bg-card/80 p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.page.receives}</p><ul className="mt-4 space-y-3 text-sm text-muted-foreground">{copy.page.receivesItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
                {!isReferencingIntent ? (
                  <div className="rounded-3xl border border-border bg-card/80 p-6"><div className="flex items-center gap-2 text-primary"><CalendarDays size={18} /><p className="text-xs font-semibold uppercase tracking-[0.16em]">{copy.page.attached}</p></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy.page.attachedText}</p><Link to={`/prise-rdv?source=${activeIntent}&domain=${encodeURIComponent(form.domain || requestedDomain)}`} className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted">{copy.page.preview} <ChevronRight size={14} /></Link></div>
                ) : null}
                <div className="rounded-3xl border border-border bg-card/80 p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.page.contacts}</p><div className="mt-4 space-y-3"><a href={directLinks.phone} className="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-card-foreground hover:bg-muted"><span>{contactDetails.phoneDisplay}</span><ChevronRight size={14} className="text-primary" /></a><a href={directLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-card-foreground hover:bg-muted"><span>{copy.page.whatsapp} {contactDetails.whatsappDisplay}</span><ChevronRight size={14} className="text-primary" /></a><a href={directLinks.email} className="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-card-foreground hover:bg-muted"><span>{contactDetails.email}</span><ChevronRight size={14} className="text-primary" /></a><a href={directLinks.map} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-card-foreground hover:bg-muted"><span>{contactDetails.addressShort}</span><ChevronRight size={14} className="text-primary" /></a></div><div className="mt-5 flex flex-wrap gap-2">{socialLinks.filter((item) => ["LinkedIn", "YouTube", "Facebook", "Instagram"].includes(item.label)).map((item) => <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary">{item.label}</a>)}</div></div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default LeadFormsPreview;
