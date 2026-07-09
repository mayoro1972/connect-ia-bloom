import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  FileSearch,
  Files,
  Loader2,
  Lock,
  MessageSquareQuote,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

type RagSource = {
  titre: string;
  url: string | null;
  similarite: number;
};

type RagResponse = {
  ok: boolean;
  question: string;
  reponse: string;
  sources: RagSource[];
  nb_sources: number;
  timestamp: string;
};

const EXAMPLE_QUESTIONS = [
  "Quels cas d'usage IA sont proposés pour les concessionnaires de service public ?",
  "Que couvre la formation TransferAI sur la recherche documentaire intelligente ?",
  "Quels livrables les participants reçoivent-ils après la formation IA appliquée ?",
  "Quels irritants métier sont cités dans le mini-catalogue CIE-SODECI ?",
];

const STEP_LABELS = [
  { title: "Question reçue", detail: "Validation de la requête et préparation de la session" },
  { title: "Recherche vectorielle", detail: "Repérage des passages les plus proches dans la base documentaire" },
  { title: "Réponse sourcée", detail: "Synthèse concise avec citation des documents retrouvés" },
];

const emptyForm = {
  userName: "",
  question: "",
};

const ACCESS_CODE_STORAGE_KEY = "rag_access_code";

const DocumentRagDemoPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<RagResponse | null>(null);
  const [accessCode, setAccessCode] = useState(
    () => sessionStorage.getItem(ACCESS_CODE_STORAGE_KEY) ?? "",
  );
  const [unlocked, setUnlocked] = useState(() => Boolean(sessionStorage.getItem(ACCESS_CODE_STORAGE_KEY)));
  const [codeInput, setCodeInput] = useState("");

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = codeInput.trim();
    if (!trimmed) {
      return;
    }
    sessionStorage.setItem(ACCESS_CODE_STORAGE_KEY, trimmed);
    setAccessCode(trimmed);
    setUnlocked(true);
    setErrorMessage(null);
  };

  const handleLock = () => {
    sessionStorage.removeItem(ACCESS_CODE_STORAGE_KEY);
    setAccessCode("");
    setCodeInput("");
    setUnlocked(false);
  };

  const canSubmit = useMemo(
    () => form.question.trim().length >= 3 && !submitting,
    [form.question, submitting],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(supabaseUnavailableMessage);
      return;
    }

    setSubmitting(true);
    setResult(null);
    setErrorMessage(null);
    setActiveStep(1);

    trackAnalyticsEvent("document_rag_demo_submit", {
      has_user_name: Boolean(form.userName.trim()),
    });

    try {
      setActiveStep(2);

      const { data, error } = await supabase.functions.invoke("document-rag-query", {
        headers: {
          "x-rag-access-token": accessCode,
        },
        body: {
          question: form.question.trim(),
          utilisateur: form.userName.trim() || "Visiteur demo",
        },
      });

      if (error || !data || data.error) {
        let errorBody: { error?: string; detail?: string } | null = data ?? null;
        const context = (error as { context?: Response })?.context;

        if (!errorBody && context && typeof context.json === "function") {
          errorBody = await context.json().catch(() => null);
        }

        if (errorBody?.error === "unauthorized") {
          handleLock();
          throw new Error("Code d'acces incorrect. Merci de le ressaisir.");
        }

        const message = errorBody?.detail || errorBody?.error || error?.message || "Le service documentaire n'a pas pu repondre.";
        throw new Error(String(message));
      }

      setActiveStep(STEP_LABELS.length + 1);
      setResult(data as RagResponse);
      trackAnalyticsEvent("document_rag_demo_success", {
        nb_sources: Number((data as RagResponse).nb_sources ?? 0),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      setErrorMessage(message);
      setActiveStep(0);
      trackAnalyticsEvent("document_rag_demo_error", { message });
    } finally {
      setSubmitting(false);
    }
  };

  const applyExampleQuestion = (question: string) => {
    setForm((current) => ({ ...current, question }));
    setResult(null);
    setErrorMessage(null);
  };

  const reset = () => {
    setForm(emptyForm);
    setResult(null);
    setErrorMessage(null);
    setActiveStep(0);
  };

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#17324d_0%,#0b1420_40%,#060a11_100%)] px-6 text-slate-100">
        <Card className="w-full max-w-md border-white/10 bg-[#0d1724]/90 text-slate-100 shadow-[0_30px_100px_-40px_rgba(34,211,238,0.45)]">
          <CardHeader>
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-200">
              <Lock className="h-3.5 w-3.5" />
              Accès réservé
            </div>
            <CardTitle className="text-2xl">RAG documentaire &mdash; usage interne</CardTitle>
            <CardDescription className="text-slate-400">
              Cette page est réservée aux collègues TransferAI. Saisis le code d&apos;accès communiqué en interne pour
              continuer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleUnlock}>
              <Input
                type="password"
                value={codeInput}
                onChange={(event) => setCodeInput(event.target.value)}
                placeholder="Code d'accès"
                autoFocus
                className="border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
              />
              {errorMessage ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {errorMessage}
                </div>
              ) : null}
              <Button type="submit" disabled={!codeInput.trim()} className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                Déverrouiller
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-200">
              Demo RAG documentaire
            </Badge>
            <Link
              to="/demo/support-it-intelligent"
              className="text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100"
            >
              Voir aussi la demo Support IT
            </Link>
            <button
              type="button"
              onClick={handleLock}
              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100"
            >
              <Lock className="h-3 w-3" />
              Verrouiller
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Questionner la base documentaire TransferAI
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              Une interface web simple pour interroger le <span className="text-cyan-300">RAG documentaire</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300">
              Cette page passe par une fonction serveur dédiée, interroge la base vectorielle documentaire, puis
              renvoie une réponse synthétique avec les sources utilisées. L&apos;objectif est de proposer un point
              d&apos;accès stable pour les collègues et les usagers, sans dépendre directement d&apos;un webhook n8n.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="h-4 w-4 text-cyan-300" />
                    Recherche ciblée
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Requête en langage naturel, récupération vectorielle et limitation du contexte pour éviter les
                  réponses trop vagues.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Files className="h-4 w-4 text-cyan-300" />
                    Sources visibles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Chaque réponse revient avec le nombre de sources utilisées, leur titre, leur lien et leur score de
                  similarité.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquareQuote className="h-4 w-4 text-cyan-300" />
                    Reponse cadrée
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Le modèle est explicitement contraint à répondre seulement à partir des documents indexés et à le
                  dire quand l&apos;information manque.
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-white/10 bg-[#0d1724]/90 text-slate-100 shadow-[0_30px_100px_-40px_rgba(34,211,238,0.45)]">
            <CardHeader>
              <CardTitle className="text-2xl">Interroger la base</CardTitle>
              <CardDescription className="text-slate-400">
                Questions recommandées : précises, métier, orientées procédure, offre, livrable ou cas d&apos;usage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Nom ou equipe
                  </label>
                  <Input
                    value={form.userName}
                    onChange={(event) => setForm((current) => ({ ...current, userName: event.target.value }))}
                    placeholder="Ex : Equipe commerciale"
                    className="border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Question documentaire
                  </label>
                  <Textarea
                    value={form.question}
                    onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
                    placeholder="Ex : Que dit le programme de formation sur la recherche documentaire intelligente ?"
                    rows={6}
                    className="border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => applyExampleQuestion(question)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-slate-300 transition-colors hover:border-cyan-300/40 hover:text-white"
                    >
                      {question}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3">
                  {STEP_LABELS.map((step, index) => {
                    const current = activeStep > index;
                    return (
                      <div
                        key={step.title}
                        className={`rounded-2xl border px-4 py-3 transition-colors ${
                          current
                            ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                            : "border-white/10 bg-white/5 text-slate-400"
                        }`}
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Etape {index + 1}
                        </div>
                        <div className="mt-1 text-sm font-semibold">{step.title}</div>
                        <div className="mt-1 text-sm leading-6">{step.detail}</div>
                      </div>
                    );
                  })}
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                  >
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
                    Lancer la recherche
                  </Button>
                  <Button type="button" variant="outline" onClick={reset} className="border-white/15 bg-transparent text-slate-100 hover:bg-white/5">
                    Reinitialiser
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-[#0d1724]/88 text-slate-100 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Réponse</CardTitle>
              <CardDescription className="text-slate-400">
                {result
                  ? `Réponse générée le ${new Date(result.timestamp).toLocaleString("fr-FR")}`
                  : "La réponse apparaîtra ici après interrogation du RAG."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">Question</div>
                    <div className="mt-2 leading-6">{result.question}</div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/35 px-5 py-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Synthese</div>
                    <div className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-slate-100">{result.reponse}</div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/20 px-5 py-10 text-center text-sm leading-7 text-slate-400">
                  Pose une question pour afficher une réponse sourcée et vérifier le comportement du workflow documentaire.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0d1724]/88 text-slate-100 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Sources retournées</CardTitle>
              <CardDescription className="text-slate-400">
                {result ? `${result.nb_sources} source(s) retenue(s) dans le contexte.` : "Les documents cités seront listés ici."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result?.sources?.length ? (
                <div className="space-y-3">
                  {result.sources.map((source, index) => (
                    <div
                      key={`${source.titre}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">{source.titre}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                            Similarite {source.similarite}%
                          </div>
                        </div>
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-cyan-200 transition-colors hover:text-cyan-100"
                          >
                            Ouvrir <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/20 px-5 py-10 text-center text-sm leading-7 text-slate-400">
                  Les titres, liens et scores de similarité s&apos;afficheront ici après une requête réussie.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentRagDemoPage;
