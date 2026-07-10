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
  <span className="rounded bg-cyan-400/15 px-1.5 py-0.5 font-mono text-[13px] text-cyan-200">{children}</span>
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
          <p>Mme Adjoua Kouassi</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Objet</p>
          <p>Confirmation de réception de virement</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Instructions</p>
          <p>
            Merci d&apos;informer <Sensitive>Mme Adjoua Kouassi</Sensitive> que le virement de{" "}
            <Sensitive>2 500 000 FCFA</Sensitive> vers son IBAN{" "}
            <Sensitive>CI93CI0080123456789012345</Sensitive> a bien été reçu. Son{" "}
            <Sensitive>passeport n° 12AB34567</Sensitive> reste en cours de vérification. Adresse :{" "}
            <Sensitive>Cocody 2 Plateaux</Sensitive>, Abidjan. La joindre au{" "}
            <Sensitive>07 12 34 56 78</Sensitive>.
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
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
          Sous-workflow PII_Guard_Anonymisation — mode anonymize
        </div>
        <p className="text-[15px] leading-8 text-slate-300">
          Merci d&apos;informer <Token>[PERSONNE_1]</Token> que le virement de <Token>[MONTANT_1]</Token> vers son
          IBAN <Token>[IBAN_1]</Token> a bien été reçu. Son <Token>[PASSEPORT_1]</Token> reste en cours de
          vérification. <Token>[ADRESSE_1]</Token>, Abidjan. La joindre au <Token>[TELEPHONE_1]</Token>.
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
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          Réponse réelle de l&apos;API OpenAI (gpt-4o)
        </div>
        <p className="whitespace-pre-line text-[15px] leading-8 text-slate-300">
          {"Madame,\n\nJe vous écris pour vous informer que le virement d'un montant de "}
          <Token>[MONTANT_1]</Token>
          {" vers votre IBAN "}
          <Token>[IBAN_1]</Token>
          {" a bien été reçu.\n\nPar ailleurs, nous tenons à vous assurer que votre "}
          <Token>[PASSEPORT_1]</Token>
          {" est actuellement en cours de vérification.\n\nPour toute question, n'hésitez pas à nous contacter au "}
          <Token>[TELEPHONE_1]</Token>
          {".\n\nNous vous prions d'agréer, Madame, l'expression de nos salutations distinguées."}
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
              Validation requise — Confirmation de réception de virement
            </p>
          </div>
          <div className="px-4 py-4">
            <p className="text-[15px] leading-7 text-slate-300">
              Madame <Restored>Adjoua Kouassi</Restored>, <Restored>Cocody 2 Plateaux, Abidjan</Restored> — le
              virement de <Restored>2 500 000 FCFA</Restored> vers l&apos;IBAN{" "}
              <Restored>CI93CI0080123456789012345</Restored> a bien été reçu. Son passeport n°{" "}
              <Restored>12AB34567</Restored> reste en cours de vérification. Contact :{" "}
              <Restored>07 12 34 56 78</Restored>.
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
    title: "Le client reçoit le courrier final",
    render: () => (
      <div className="space-y-3">
        <div className="rounded-lg border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <p>De : courrier@transferai.ci</p>
            <p className="mt-0.5">À : a.kouassi@client-banque-test.example</p>
            <p className="mt-1.5 text-sm text-slate-200">Confirmation de réception de virement</p>
          </div>
          <div className="px-4 py-4">
            <p className="text-[15px] leading-7 text-slate-300">
              Madame <Restored>Adjoua Kouassi</Restored>, nous vous informons que le virement de{" "}
              <Restored>2 500 000 FCFA</Restored> vers votre IBAN{" "}
              <Restored>CI93CI0080123456789012345</Restored> a bien été reçu et que votre passeport n°{" "}
              <Restored>12AB34567</Restored> est en cours de vérification.
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#17324d_0%,#0b1420_40%,#060a11_100%)] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-cyan-300"
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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Courrier confidentiel généré par IA
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              Une IA qui rédige vos courriers <span className="text-cyan-300">sans jamais voir vos données sensibles</span>
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
                    <ShieldCheck className="h-4 w-4 text-cyan-300" />
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
                    <Sparkles className="h-4 w-4 text-cyan-300" />
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
                    <UserCheck className="h-4 w-4 text-cyan-300" />
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
              className="mt-3 w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200"
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
                    ? "bg-cyan-400/20 text-cyan-200"
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
