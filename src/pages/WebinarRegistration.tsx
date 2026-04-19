import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { metierKeyToDomain } from "@/lib/site-links";
import { formations as formationsData } from "@/data/formations";
import { CheckCircle2, CalendarDays, Sparkles } from "lucide-react";

const sectorOptions = [
  "Diplomatie & organisations internationales",
  "Banque, finance & assurance",
  "Administration publique & ministères",
  "ONG & humanitaire",
  "Télécoms, IT & numérique",
  "Énergie, mines & industries",
  "Santé & sciences du vivant",
  "Éducation & formation",
  "Distribution, retail & e-commerce",
  "Médias & communication",
  "Transports & logistique",
  "Agriculture & agroalimentaire",
  "BTP & immobilier",
  "Conseil & services aux entreprises",
  "Autre",
];

const copy = {
  fr: {
    badge: "Webinaire gratuit",
    title: "Inscription au webinaire gratuit",
    subtitle:
      "Réservez votre place. Vous recevrez la date confirmée du prochain webinaire dans les 14 jours, ainsi que le lien de connexion.",
    sectionInfo: "Informations personnelles",
    sectionContext: "Votre contexte",
    sectionInterest: "Votre centre d'intérêt",
    fullName: "Nom complet *",
    email: "Email professionnel *",
    phone: "Téléphone / WhatsApp",
    country: "Pays",
    city: "Ville",
    organization: "Entreprise / Organisation",
    position: "Fonction",
    sector: "Secteur d'activité",
    sectorOther: "Précisez votre secteur",
    domain: "Domaine d'expertise visé",
    domainOther: "Précisez le domaine",
    formation: "Formation associée (optionnel)",
    formationOther: "Précisez la formation",
    participants: "Nombre de participants",
    language: "Langue préférée",
    motivation: "Vos attentes / objectifs (optionnel)",
    consent:
      "J'accepte que TransferAI Africa traite mes données pour organiser le webinaire et me recontacter.",
    submit: "Confirmer mon inscription",
    submitting: "Envoi…",
    success: "Inscription confirmée",
    successText:
      "Merci ! Nous vous enverrons par email la date confirmée et le lien de connexion sous 14 jours maximum.",
    backHome: "Retour à l'accueil",
    error: "Une erreur est survenue. Merci de réessayer.",
    other: "Autre",
    none: "— Sélectionner —",
    plannedDate: (date: string) => `Dates prévisionnelles : ${date} — heures à préciser (confirmation par email)`,
  },
  en: {
    badge: "Free webinar",
    title: "Free webinar registration",
    subtitle:
      "Reserve your seat. You will receive the confirmed date and access link within 14 days.",
    sectionInfo: "Personal information",
    sectionContext: "Your context",
    sectionInterest: "Your area of interest",
    fullName: "Full name *",
    email: "Professional email *",
    phone: "Phone / WhatsApp",
    country: "Country",
    city: "City",
    organization: "Company / Organisation",
    position: "Role",
    sector: "Sector",
    sectorOther: "Specify your sector",
    domain: "Target area of expertise",
    domainOther: "Specify the area",
    formation: "Linked course (optional)",
    formationOther: "Specify the course",
    participants: "Number of participants",
    language: "Preferred language",
    motivation: "Goals / expectations (optional)",
    consent:
      "I agree that TransferAI Africa processes my data to organise the webinar and contact me.",
    submit: "Confirm my registration",
    submitting: "Sending…",
    success: "Registration confirmed",
    successText:
      "Thank you! We will email you the confirmed date and access link within 14 days.",
    backHome: "Back to home",
    error: "An error occurred. Please try again.",
    other: "Other",
    none: "— Select —",
    plannedDate: (date: string) => `Tentative dates: ${date} — times to be confirmed (final confirmation by email)`,
  },
} as const;

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const WebinarRegistration = () => {
  const { language } = useLanguage();
  const lang = resolveActiveLanguage(language);
  const t = copy[lang];
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    organization: "",
    position: "",
    sector: "",
    sector_other: "",
    domain_key: params.get("domain") ?? "",
    domain_other: "",
    formation_id: params.get("formation") ?? "",
    formation_other: "",
    participants: 1,
    language: lang,
    motivation: "",
    privacy_consent: false,
    honeypot: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, language: lang }));
  }, [lang]);

  const plannedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [lang]);

  const formationsForDomain = useMemo(() => {
    if (!form.domain_key || form.domain_key === "other") return [];
    const domainLabel = metierKeyToDomain[form.domain_key];
    if (!domainLabel) return [];
    return formationsData.filter(
      (f) => f.metier.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        === domainLabel.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
    );
  }, [form.domain_key]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setError(t.error);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const formationLabel = form.formation_id && form.formation_id !== "other"
        ? formationsData.find((f) => f.id === form.formation_id)?.[lang === "fr" ? "title" : "titleEn"] ?? ""
        : "";

      const { error: rpcError } = await supabase.rpc("submit_webinar_registration", {
        full_name_input: form.full_name,
        email_input: form.email,
        phone_input: form.phone || null,
        country_input: form.country || null,
        city_input: form.city || null,
        organization_input: form.organization || null,
        position_input: form.position || null,
        sector_input: form.sector === "Autre" ? null : form.sector || null,
        sector_other_input: form.sector === "Autre" ? form.sector_other : null,
        domain_key_input: form.domain_key === "other" ? null : form.domain_key || null,
        domain_other_input: form.domain_key === "other" ? form.domain_other : null,
        formation_id_input: form.formation_id === "other" ? null : form.formation_id || null,
        formation_title_input: formationLabel || null,
        formation_other_input: form.formation_id === "other" ? form.formation_other : null,
        participants_input: form.participants,
        language_input: form.language,
        motivation_input: form.motivation || null,
        source_page_input: window.location.pathname + window.location.search,
        privacy_consent_input: form.privacy_consent,
        honeypot_input: form.honeypot,
      });
      if (rpcError) throw rpcError;

      // Envoi email d'accusé de réception (non bloquant)
      const scheduledDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      supabase.functions.invoke("webinar-notify", {
        body: {
          full_name: form.full_name,
          email: form.email,
          language: form.language,
          domain_label: form.domain_key === "other" ? form.domain_other : form.domain_key,
          formation_label: formationLabel || form.formation_other || "",
          scheduled_date: scheduledDate,
        },
      }).catch((e) => console.warn("webinar-notify failed", e));

      setDone(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader badge={t.badge} title={t.title} subtitle={t.subtitle} />

        <section className="py-14">
          <div className="container mx-auto max-w-3xl px-4 lg:px-8">
            {done ? (
              <div className="rounded-3xl border border-border bg-card p-10 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h2 className="font-heading text-2xl font-bold text-card-foreground">{t.success}</h2>
                <p className="mt-3 text-muted-foreground">{t.successText}</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  <CalendarDays size={16} /> {t.plannedDate(plannedDate)}
                </p>
                <div className="mt-8">
                  <Link to="/" className="text-sm font-semibold text-primary hover:underline">
                    {t.backHome} →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-8 rounded-3xl border border-border bg-card p-8">
                <div className="rounded-2xl bg-primary/5 p-4 text-sm text-card-foreground">
                  <p className="flex items-center gap-2 font-semibold">
                    <Sparkles size={16} className="text-primary" /> {t.plannedDate(plannedDate)}
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 font-heading text-lg font-bold text-card-foreground">{t.sectionInfo}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder={t.fullName} />
                    <Input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder={t.email} />
                    <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder={t.phone} />
                    <Input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder={t.country} />
                    <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder={t.city} />
                    <Input value={form.organization} onChange={(e) => update("organization", e.target.value)} placeholder={t.organization} />
                    <Input value={form.position} onChange={(e) => update("position", e.target.value)} placeholder={t.position} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-heading text-lg font-bold text-card-foreground">{t.sectionContext}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t.sector}</label>
                      <select className={fieldClass} value={form.sector} onChange={(e) => update("sector", e.target.value)}>
                        <option value="">{t.none}</option>
                        {sectorOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    {form.sector === "Autre" && (
                      <Input value={form.sector_other} onChange={(e) => update("sector_other", e.target.value)} placeholder={t.sectorOther} />
                    )}
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t.participants}</label>
                      <Input type="number" min={1} max={500} value={form.participants} onChange={(e) => update("participants", Math.max(1, Number(e.target.value) || 1))} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t.language}</label>
                      <select className={fieldClass} value={form.language} onChange={(e) => update("language", e.target.value as typeof form.language)}>
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-heading text-lg font-bold text-card-foreground">{t.sectionInterest}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t.domain}</label>
                      <select
                        className={fieldClass}
                        value={form.domain_key}
                        onChange={(e) => update("domain_key", e.target.value)}
                      >
                        <option value="">{t.none}</option>
                        {Object.entries(metierKeyToDomain).map(([k, label]) => (
                          <option key={k} value={k}>{label}</option>
                        ))}
                        <option value="other">{t.other}</option>
                      </select>
                    </div>
                    {form.domain_key === "other" && (
                      <Input value={form.domain_other} onChange={(e) => update("domain_other", e.target.value)} placeholder={t.domainOther} />
                    )}
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t.formation}</label>
                      <select className={fieldClass} value={form.formation_id} onChange={(e) => update("formation_id", e.target.value)}>
                        <option value="">{t.none}</option>
                        {(formationsForDomain.length > 0 ? formationsForDomain : formationsData).map((f) => (
                          <option key={f.id} value={f.id}>
                            {lang === "fr" ? f.title : f.titleEn}
                          </option>
                        ))}
                        <option value="other">{t.other}</option>
                      </select>
                    </div>
                    {form.formation_id === "other" && (
                      <Input className="md:col-span-2" value={form.formation_other} onChange={(e) => update("formation_other", e.target.value)} placeholder={t.formationOther} />
                    )}
                    <Textarea className="md:col-span-2" value={form.motivation} onChange={(e) => update("motivation", e.target.value)} placeholder={t.motivation} rows={3} />
                  </div>
                </div>

                {/* honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot}
                  onChange={(e) => update("honeypot", e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                <label className="flex items-start gap-3 text-sm text-card-foreground">
                  <input
                    type="checkbox"
                    required
                    checked={form.privacy_consent}
                    onChange={(e) => update("privacy_consent", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border accent-primary"
                  />
                  <span>{t.consent}</span>
                </label>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-gradient text-white hover:opacity-90"
                  size="lg"
                >
                  {submitting ? t.submitting : t.submit}
                </Button>
              </form>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default WebinarRegistration;
