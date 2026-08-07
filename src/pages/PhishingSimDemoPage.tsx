import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  MousePointerClick,
  Send,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

const COOLDOWN_MS = 60_000;
const COOLDOWN_STORAGE_KEY = "phishing_sim_demo_last_run";

type TemplateId = "support-it" | "colis" | "facture";

type Template = {
  id: TemplateId;
  label: string;
  pillActive: string;
  pillInactive: string;
  fromLabel: string;
  subject: string;
  preview: string;
  signals: string[];
};

const templates: Template[] = [
  {
    id: "support-it",
    label: "Support IT",
    pillActive: "border-indigo-400/40 bg-indigo-400/15 text-indigo-200",
    pillInactive: "border-white/10 text-slate-400 hover:text-slate-200",
    fromLabel: "Support Informatique <simulation-phishing@transferai.ci>",
    subject: "Action requise — votre mot de passe expire aujourd'hui",
    preview:
      "Votre mot de passe expire dans moins de 2 heures. Pour éviter la suspension de votre compte, merci de le réinitialiser immédiatement en cliquant sur le lien ci-dessous.",
    signals: [
      "L'expéditeur est simulation-phishing@transferai.ci, pas votre vraie adresse IT interne.",
      "Un vrai service IT ne menace jamais une suspension de compte dans l'heure.",
      "La salutation est générique, sans votre poste ou service précis.",
    ],
  },
  {
    id: "colis",
    label: "Livraison colis",
    pillActive: "border-indigo-400/40 bg-indigo-400/15 text-indigo-200",
    pillInactive: "border-white/10 text-slate-400 hover:text-slate-200",
    fromLabel: "Service Livraison <simulation-phishing@transferai.ci>",
    subject: "Votre colis est en attente — action requise sous 24h",
    preview:
      "Un colis vous est destiné mais n'a pas pu être livré. Merci de confirmer vos coordonnées sous 24h pour éviter le retour à l'expéditeur.",
    signals: [
      "Aucun transporteur réel n'est nommé — un vrai avis cite toujours un transporteur identifiable.",
      "La pression temporelle (« sous 24h ») pousse à cliquer sans réfléchir.",
      "Un vrai transporteur ne redemande jamais vos coordonnées par email.",
    ],
  },
  {
    id: "facture",
    label: "Facture impayée",
    pillActive: "border-indigo-400/40 bg-indigo-400/15 text-indigo-200",
    pillInactive: "border-white/10 text-slate-400 hover:text-slate-200",
    fromLabel: "Service Facturation <simulation-phishing@transferai.ci>",
    subject: "Facture impayée — régularisation requise",
    preview:
      "Notre service constate un impayé sur votre compte. Merci de régulariser votre situation avant application de pénalités.",
    signals: [
      "Aucun numéro de facture ni montant précis — un vrai service référence toujours le document exact.",
      "La menace de pénalité crée une urgence artificielle typique du phishing.",
      "Le bouton d'action pousse à agir immédiatement sans vérification.",
    ],
  },
];

const PhishingSimDemoPage = () => {
  const [templateId, setTemplateId] = useState<TemplateId>("support-it");
  const template = templates.find((t) => t.id === templateId) ?? templates[0];
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ submission_id: string | null } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(() => {
    const stored = Number(localStorage.getItem(COOLDOWN_STORAGE_KEY) ?? "0");
    return stored + COOLDOWN_MS > Date.now() ? stored + COOLDOWN_MS : 0;
  });

  const onCooldown = cooldownUntil > Date.now();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail.trim());

  const changeTemplate = (id: TemplateId) => {
    setTemplateId(id);
    setResult(null);
    setErrorMessage(null);
  };

  const handleLaunch = async () => {
    if (submitting || onCooldown || !emailValid) return;

    setSubmitting(true);
    setResult(null);
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(supabaseUnavailableMessage);
      setSubmitting(false);
      return;
    }

    trackAnalyticsEvent("phishing_sim_demo_live_submit", {
      has_visitor_name: Boolean(visitorName.trim()),
      template: templateId,
    });

    const { data, error } = await supabase.functions.invoke("phishing-sim-demo", {
      body: { visitor_name: visitorName.trim(), visitor_email: visitorEmail.trim(), template: templateId },
    });

    if (error || !data || data.error) {
      const message =
        (data && (data.detail || data.error)) ||
        error?.message ||
        "Le workflow n8n n'a pas répondu. Réessaie dans quelques instants.";
      setErrorMessage(String(message));
      setSubmitting(false);
      return;
    }

    const now = Date.now();
    localStorage.setItem(COOLDOWN_STORAGE_KEY, String(now));
    setCooldownUntil(now + COOLDOWN_MS);
    setResult({ submission_id: data.submission_id ?? null });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e2158_0%,#141636_40%,#0a0b1f_100%)] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-indigo-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au site
          </Link>
          <Badge className="border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
            Démo live — vrai email envoyé
          </Badge>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-200">
              <ShieldAlert className="h-3.5 w-3.5" />
              Simulateur de phishing
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              Testez vos réflexes face à un <span className="text-indigo-300">email de phishing simulé</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300">
              Reçois un vrai email de simulation sur ta propre adresse, clique sur le lien comme tu le ferais
              spontanément, et découvre instantanément les signaux d&apos;alerte que tu aurais dû repérer.
              Choisis un scénario ci-dessous.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => changeTemplate(t.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    templateId === t.id ? t.pillActive : t.pillInactive
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail className="h-4 w-4 text-indigo-300" />
                    Vrai email, contenu fictif
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  L&apos;email part depuis transferai.ci — jamais d&apos;usurpation d&apos;une vraie marque
                  tierce, uniquement des scénarios génériques.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MousePointerClick className="h-4 w-4 text-indigo-300" />
                    Révélation instantanée
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Le clic sur le lien ouvre immédiatement une page pédagogique listant les signaux d&apos;alerte
                  du message que tu viens de recevoir.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-4 w-4 text-indigo-300" />
                    Auto-déclenché uniquement
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Le simulateur n&apos;envoie qu&apos;à l&apos;adresse que tu saisis toi-même — jamais à une
                  liste de tiers sans leur consentement.
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 rounded-lg border border-white/10 bg-white/5">
              <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
                <p>De : {template.fromLabel}</p>
                <p className="mt-0.5">À : (ton adresse email)</p>
                <p className="mt-1.5 text-sm text-slate-200">{template.subject}</p>
              </div>
              <div className="px-4 py-4">
                <p className="text-[15px] leading-7 text-slate-300">{template.preview}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Essaie-le en direct</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Déclenche le scénario <strong>{template.label}</strong> pour de vrai : un email part sur
              l&apos;adresse ci-dessous, avec un vrai lien de suivi.
            </p>
            <Input
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Ton prénom (optionnel)"
              className="mt-4 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500"
            />
            <Input
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
              placeholder="ton.email@exemple.com"
              type="email"
              className="mt-2 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500"
            />
            <p className="mt-2 text-xs text-slate-500">
              L&apos;email est envoyé uniquement à l&apos;adresse saisie ci-dessus — jamais à un tiers.
            </p>
            <Button
              type="button"
              onClick={handleLaunch}
              disabled={submitting || onCooldown || !emailValid}
              className="mt-3 w-full bg-indigo-300 text-slate-950 hover:bg-indigo-200"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {submitting
                ? "Envoi en cours…"
                : onCooldown
                  ? "Patiente un instant avant de relancer"
                  : `Recevoir la simulation — ${template.label}`}
            </Button>

            {errorMessage ? (
              <p className="mt-3 rounded border border-rose-400/30 bg-rose-400/5 p-2.5 text-xs text-rose-200">
                {errorMessage}
              </p>
            ) : null}

            {result ? (
              <div className="mt-3 flex items-start gap-2 rounded border border-emerald-400/30 bg-emerald-400/5 p-2.5 text-xs text-emerald-200">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <div>
                  Email envoyé. Vérifie ta boîte de réception (et tes spams) dans quelques instants, puis
                  clique sur le lien pour voir la révélation pédagogique.
                </div>
              </div>
            ) : null}

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Signaux d&apos;alerte de ce scénario
              </p>
              <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-400">
                {template.signals.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-slate-500">
          Portail de démonstration — TransferAI Africa. Simulation auto-déclenchée, aucune donnée réelle de
          client n&apos;est collectée.
        </p>
      </div>
    </div>
  );
};

export default PhishingSimDemoPage;
