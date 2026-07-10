import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  MailCheck,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

const COOLDOWN_MS = 60_000;
const COOLDOWN_STORAGE_KEY = "courrier_pii_demo_last_run";

type Step = {
  label: string;
  title: string;
  render: () => JSX.Element;
};

const Token = ({ children }: { children: string }) => (
  <span className="rounded bg-violet-400/15 px-1.5 py-0.5 font-mono text-[13px] text-violet-200">{children}</span>
);

const Restored = ({ children }: { children: string }) => (
  <span className="rounded bg-emerald-400/15 px-1 py-0.5 text-emerald-200">{children}</span>
);

const Sensitive = ({ children }: { children: string }) => (
  <span className="rounded bg-rose-400/15 px-1 py-0.5 font-semibold text-rose-200">{children}</span>
);

const steps: Step[] = [
  {
    label: "1. Demande",
    title: "La secrétaire soumet sa demande",
    render: () => (
      <div className="space-y-3 text-[15px] leading-7 text-slate-300">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Destinataire</p>
          <p>Ambassade du Royaume du Maroc à Abidjan</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Objet</p>
          <p>Confirmation de rendez-vous et accréditation</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Instructions</p>
          <p>
            Merci de rédiger un courrier confirmant à <Sensitive>M. Abdellah Benkirane</Sensitive> que sa demande a
            été validée, <Sensitive>référence diplomatique : DIP-2026-04471</Sensitive>. Il est{" "}
            <Sensitive>domicilié à la Résidence de l&apos;Ambassade</Sensitive>, Riviera Golf, Abidjan. Le joindre
            au <Sensitive>+225 07 45 12 33 89</Sensitive> ou par email{" "}
            <Sensitive>a.benkirane@diplomatie-test.example</Sensitive>.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          En rouge&nbsp;: les données sensibles réelles, saisies telles quelles par la secrétaire.
        </p>
      </div>
    ),
  },
  {
    label: "2. PII Guard",
    title: "PII Guard masque les données avant l'IA",
    render: () => (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-violet-300" />
          Sous-workflow PII_Guard_Anonymisation — mode anonymize
        </div>
        <p className="text-[15px] leading-8 text-slate-300">
          Merci de rédiger un courrier confirmant à <Token>[PERSONNE_1]</Token> que sa demande a été validée,{" "}
          <Token>[REF_DIPLOMATIQUE_1]</Token>. Il est <Token>[ADRESSE_1]</Token>, Riviera Golf, Abidjan. Le joindre
          au <Token>[TELEPHONE_1]</Token> ou par email <Token>[EMAIL_1]</Token>.
        </p>
        <p className="text-xs text-slate-500">
          C&apos;est ce texte — et uniquement celui-ci — qui part vers l&apos;API OpenAI. Aucune donnée réelle ne
          quitte jamais n8n à cette étape.
        </p>
      </div>
    ),
  },
  {
    label: "3. GPT-4o",
    title: "GPT-4o rédige le brouillon",
    render: () => (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          Réponse réelle de l&apos;API OpenAI (gpt-4o)
        </div>
        <p className="whitespace-pre-line text-[15px] leading-8 text-slate-300">
          {"Objet : Confirmation de rendez-vous et accréditation\n\nMadame, Monsieur,\n\nNous avons le plaisir de vous informer que la demande d'accréditation de "}
          <Token>[PERSONNE_1]</Token>
          {" a été validée sous la référence "}
          <Token>[REF_DIPLOMATIQUE_1]</Token>
          {". Nous vous remercions de bien vouloir confirmer votre disponibilité pour un rendez-vous à l'Ambassade afin de finaliser les formalités nécessaires.\n\nPour toute question ou information complémentaire, vous pouvez joindre "}
          <Token>[PERSONNE_1]</Token>
          {" au numéro de téléphone suivant : "}
          <Token>[TELEPHONE_1]</Token>
          {" ou par email à l'adresse "}
          <Token>[EMAIL_1]</Token>
          {".\n\nNous vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée."}
        </p>
        <p className="text-xs text-slate-500">
          Le modèle recopie les jetons tels quels — il ne les invente jamais, il ne les « devine » jamais.
        </p>
      </div>
    ),
  },
  {
    label: "4. Manager",
    title: "Le manager reçoit l'email de validation",
    render: () => (
      <div className="space-y-3">
        <div className="rounded-lg border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <p>De : courrier@transferai.ci</p>
            <p className="mt-0.5">À : marius.ayoro70@gmail.com</p>
            <p className="mt-1.5 text-sm text-slate-200">
              Validation requise — Confirmation de rendez-vous et accréditation
            </p>
          </div>
          <div className="px-4 py-4">
            <p className="text-[15px] leading-7 text-slate-300">
              Demande d&apos;accréditation de <Restored>M. Abdellah Benkirane</Restored> validée sous la{" "}
              <Restored>référence diplomatique : DIP-2026-04471</Restored>. Il est{" "}
              <Restored>domicilié à la Résidence de l&apos;Ambassade</Restored>, Riviera Golf, Abidjan. Contact :{" "}
              <Restored>+225 07 45 12 33 89</Restored> /{" "}
              <Restored>a.benkirane@diplomatie-test.example</Restored>.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Approuver
              </span>
              <span className="rounded border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-200">
                Rejeter
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          En vert&nbsp;: les données réelles, restaurées uniquement pour le manager — un humain autorisé, pas l&apos;IA.
        </p>
      </div>
    ),
  },
  {
    label: "5. Client",
    title: "L'ambassade reçoit le courrier final",
    render: () => (
      <div className="space-y-3">
        <div className="rounded-lg border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <p>De : courrier@transferai.ci</p>
            <p className="mt-0.5">À : protocole@ambassade-maroc-ci.example</p>
            <p className="mt-1.5 text-sm text-slate-200">Confirmation de rendez-vous et accréditation</p>
          </div>
          <div className="px-4 py-4">
            <p className="text-[15px] leading-7 text-slate-300">
              La demande d&apos;accréditation de <Restored>M. Abdellah Benkirane</Restored> a été validée sous la{" "}
              <Restored>référence diplomatique : DIP-2026-04471</Restored>. Merci de confirmer sa disponibilité pour
              un rendez-vous à l&apos;Ambassade.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-b-lg bg-emerald-400/10 px-4 py-2.5">
            <Check className="h-3.5 w-3.5 text-emerald-300" />
            <p className="text-xs text-emerald-200">Courrier envoyé</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Cycle complet&nbsp;: demande, IA sans PII, validation humaine, envoi — testé en direct sur l&apos;instance
          de production.
        </p>
      </div>
    ),
  },
];

const CourrierPIIDemoPage = () => {
  const [active, setActive] = useState(0);
  const [visitorName, setVisitorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ courrier_id: string | null } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(() => {
    const stored = Number(localStorage.getItem(COOLDOWN_STORAGE_KEY) ?? "0");
    return stored + COOLDOWN_MS > Date.now() ? stored + COOLDOWN_MS : 0;
  });

  const onCooldown = cooldownUntil > Date.now();

  const handleLiveDemo = async () => {
    if (submitting || onCooldown) return;

    setSubmitting(true);
    setResult(null);
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(supabaseUnavailableMessage);
      setSubmitting(false);
      return;
    }

    trackAnalyticsEvent("courrier_pii_demo_live_submit", { has_visitor_name: Boolean(visitorName.trim()) });

    const { data, error } = await supabase.functions.invoke("courrier-automatique-pii-demo", {
      body: { visitor_name: visitorName.trim() },
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
    setResult({ courrier_id: data.courrier_id ?? null });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#2d1f47_0%,#170f28_40%,#0a0714_100%)] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-violet-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au site
          </Link>
          <Badge className="border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
            Démo live — déclenche le vrai workflow n8n
          </Badge>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Courrier confidentiel généré par IA
              </div>
              <div className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                Scénario 1 — Diplomatie
              </div>
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              Une IA qui rédige vos courriers <span className="text-violet-300">sans jamais voir vos données sensibles</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300">
              Cette page rejoue, étape par étape, un vrai cycle déjà exécuté en production&nbsp;: PII Guard masque
              les données sensibles avant tout appel à l&apos;IA générative, puis les restaure uniquement pour la
              validation humaine et l&apos;envoi final. Le parcours ci-dessous montre les textes d&apos;une exécution
              réelle — et le bouton &laquo;&nbsp;Essaie-le en direct&nbsp;&raquo; en déclenche une nouvelle, pour de
              vrai.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-4 w-4 text-violet-300" />
                    Anonymisation locale
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Détection par expressions régulières (IBAN, passeport, montant, adresse, téléphone...) — aucun
                  appel externe pour la détection elle-même.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                    IA sans PII
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  GPT-4o ne reçoit que des jetons neutres — il recopie <Token>[TYPE_n]</Token> sans jamais voir la
                  donnée réelle.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserCheck className="h-4 w-4 text-violet-300" />
                    Validation humaine
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Le manager valide le fond et la signature ; seule la secrétaire à l&apos;origine de la demande
                  déclenche l&apos;envoi réel.
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Essaie-le en direct</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Déclenche le vrai scénario Diplomatie ci-contre : anonymisation réelle, vrai appel GPT-4o, et un vrai
              email de validation envoyé au manager de la démo.
            </p>
            <Input
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Ton prénom (optionnel)"
              className="mt-4 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500"
            />
            <Button
              type="button"
              onClick={handleLiveDemo}
              disabled={submitting || onCooldown}
              className="mt-3 w-full bg-violet-300 text-slate-950 hover:bg-violet-200"
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
                  : "Lancer la démonstration réelle"}
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
                  Workflow déclenché{result.courrier_id ? ` (réf. ${result.courrier_id})` : ""}. L&apos;email de
                  validation manager part à l&apos;instant.
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
                <MailCheck className="h-3.5 w-3.5" />
                Cycle validé en conditions réelles
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-wrap gap-2">
            {steps.map((step, i) => (
              <button
                key={step.label}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  active === i
                    ? "bg-violet-400/20 text-violet-200"
                    : "border border-white/10 text-slate-400 hover:text-slate-200"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          <Card className="mt-4 border-white/10 bg-white/5 text-slate-100 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">{steps[active].title}</CardTitle>
            </CardHeader>
            <CardContent>{steps[active].render()}</CardContent>
          </Card>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100 ${
                active === 0 ? "invisible" : ""
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Précédent
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => Math.min(steps.length - 1, i + 1))}
              className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100 ${
                active === steps.length - 1 ? "invisible" : ""
              }`}
            >
              Suivant
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-slate-500">
          Portail de démonstration — TransferAI Africa. Données fictives, aucune information réelle de client.
        </p>
      </div>
    </div>
  );
};

export default CourrierPIIDemoPage;
