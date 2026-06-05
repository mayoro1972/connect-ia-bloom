import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Save, Send, ShieldCheck, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

type PackPayload = {
  organization_name?: string;
  decision_maker_name?: string;
  sector_guess?: string;
  organization_type?: string;
  tailored_audit_form?: string;
  entry_point_niche?: string;
  recommended_offer?: string;
};

type Pack = {
  pack_id: string;
  organization_name: string | null;
  target_email: string | null;
  status: string | null;
  payload: PackPayload | null;
};

type QuestionBlock = { heading: string; body: string };

function parseQuestionBlocks(text: string): QuestionBlock[] {
  const lines = text.split("\n");
  const blocks: QuestionBlock[] = [];
  let current: QuestionBlock | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const isHeading =
      /^#{1,3}\s/.test(line) ||
      /^\*\*[^*]+\*\*\s*$/.test(line) ||
      /^\d+[\.\)]\s+[A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ]/.test(line) ||
      /^[IVX]+[\.\)]\s/.test(line);

    if (isHeading) {
      if (current) blocks.push(current);
      current = {
        heading: line.replace(/^#{1,3}\s/, "").replace(/^\*\*|\*\*$/g, "").trim(),
        body: "",
      };
    } else {
      if (!current) {
        current = { heading: "", body: "" };
      }
      current.body += (current.body ? "\n" : "") + line;
    }
  }

  if (current) blocks.push(current);
  return blocks.filter((b) => b.heading || b.body);
}

function localKey(packId: string) {
  return `audit_draft_${packId}`;
}

const QuestionnaireAuditPage = () => {
  const [params] = useSearchParams();
  const packId = params.get("pack_id") || "";

  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<QuestionBlock[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filledCount = Object.values(answers).filter((v) => v.trim()).length;
  const progress = blocks.length > 0 ? Math.round((filledCount / blocks.length) * 100) : 0;

  // Load pack and draft
  useEffect(() => {
    if (!packId) {
      setFetchError("Aucun identifiant de pack fourni dans l'URL (paramètre pack_id manquant).");
      setLoading(false);
      return;
    }

    const draft = localStorage.getItem(localKey(packId));
    if (draft) {
      try {
        setAnswers(JSON.parse(draft));
      } catch {
        /* ignore */
      }
    }

    if (!isSupabaseConfigured) {
      setFetchError(
        "La connexion à la base de données n'est pas configurée. Vérifiez les variables d'environnement Supabase."
      );
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data, error } = await (supabase as ReturnType<typeof import("@supabase/supabase-js").createClient>)
          .from("ai_prospecting_packs")
          .select("pack_id, organization_name, target_email, status, payload")
          .eq("pack_id", packId)
          .maybeSingle();

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Ce formulaire n'existe pas ou n'est plus disponible.");

        const p = data as Pack;
        setPack(p);

        const formText = p.payload?.tailored_audit_form || "";
        setBlocks(parseQuestionBlocks(formText));
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Impossible de charger le questionnaire.");
      } finally {
        setLoading(false);
      }
    })();
  }, [packId]);

  // Auto-save draft to localStorage
  const handleChange = (index: number, value: string) => {
    const next = { ...answers, [index]: value };
    setAnswers(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(localKey(packId), JSON.stringify(next));
    }, 800);
  };

  const handleSubmit = async () => {
    if (!packId || !isSupabaseConfigured) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { error } = await (supabase as ReturnType<typeof import("@supabase/supabase-js").createClient>)
        .from("ai_prospecting_packs")
        .update({ status: "questionnaire_submitted", questionnaire_answers: answers } as never)
        .eq("pack_id", packId);

      if (error) throw new Error(error.message);
      localStorage.removeItem(localKey(packId));
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Envoi impossible. Réessayez dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };

  const orgName = pack?.organization_name || pack?.payload?.organization_name || "";
  const sector = pack?.payload?.sector_guess || pack?.payload?.entry_point_niche || "";
  const orgType = pack?.payload?.organization_type || "";

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />

        <main className="relative z-10 px-4 py-10 lg:px-8">
          <div className="container mx-auto max-w-4xl space-y-8">

            {/* Hero card */}
            <div className="rounded-[30px] bg-[#0f1f3d] px-8 py-10 text-white shadow-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-300">
                <Sparkles size={13} />
                {orgType || "Profil entreprise"}
              </div>

              <h1 className="mt-4 font-heading text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Votre questionnaire d&apos;audit dynamique
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Ce questionnaire est préparé pour prioriser les cas d&apos;usage les plus crédibles, les contraintes
                d&apos;intégration et la trajectoire 30&nbsp;/&nbsp;60&nbsp;/&nbsp;90 jours.
              </p>

              {packId && (
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    PACK_ID · {packId.toUpperCase()}
                  </span>
                  {sector && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase">
                      {sector}
                    </span>
                  )}
                  {orgType && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase">
                      {orgType}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-orange-300">
                    <Clock size={13} />
                    Temps estimé
                  </div>
                  <p className="mt-2 text-lg font-bold">25 à 30 minutes</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Le bon format pour capter votre contexte métier, le ROI attendu et les contraintes réelles.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-orange-300">
                    <Sparkles size={13} />
                    Adaptation métier
                  </div>
                  <p className="mt-2 text-lg font-bold">Questions adaptées à votre secteur</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    La formulation évolue selon votre pack, votre domaine d&apos;activité et votre niveau de maturité.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-orange-300">
                    <ShieldCheck size={13} />
                    Sauvegarde continue
                  </div>
                  <p className="mt-2 text-lg font-bold">{progress}% déjà capturé</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Votre brouillon s&apos;enregistre progressivement pour vous laisser vous concentrer sur la qualité des réponses.
                  </p>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                Chargement du questionnaire…
              </div>
            )}

            {/* Error */}
            {!loading && fetchError && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-sm text-destructive">
                <p className="font-semibold">Impossible de charger ce questionnaire</p>
                <p className="mt-1 text-muted-foreground">{fetchError}</p>
              </div>
            )}

            {/* Success */}
            {submitted && (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-10 text-center">
                <CheckCircle2 className="mx-auto mb-3 text-green-500" size={40} />
                <p className="text-lg font-bold text-card-foreground">Questionnaire transmis avec succès</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {orgName ? `Merci ${orgName}. ` : ""}Nos experts vont analyser vos réponses avant votre rendez-vous.
                </p>
              </div>
            )}

            {/* Questions */}
            {!loading && !fetchError && !submitted && blocks.length > 0 && (
              <div className="space-y-6">
                {blocks.map((block, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    {block.heading && (
                      <p className="mb-3 text-sm font-semibold text-card-foreground">{block.heading}</p>
                    )}
                    {block.body && (
                      <p className="mb-3 text-xs leading-6 text-muted-foreground whitespace-pre-line">{block.body}</p>
                    )}
                    <textarea
                      rows={3}
                      value={answers[i] || ""}
                      onChange={(e) => handleChange(i, e.target.value)}
                      placeholder="Votre réponse…"
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* No questions — fallback empty state */}
            {!loading && !fetchError && !submitted && blocks.length === 0 && pack && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                Le questionnaire personnalisé pour <strong>{orgName || packId}</strong> n&apos;est pas encore disponible.
                Revenez dans quelques instants ou contactez notre équipe.
              </div>
            )}

            {/* Actions */}
            {!loading && !fetchError && !submitted && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Actions du questionnaire
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {orgName
                    ? `Questionnaire préparé pour ${orgName}.`
                    : "Remplissez les sections ci-dessus puis transmettez vos réponses."}
                  {" "}Vos réponses permettent à nos experts de préparer un audit sur mesure.
                </p>

                {submitError && (
                  <p className="mt-3 text-xs text-destructive">{submitError}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (packId) localStorage.setItem(localKey(packId), JSON.stringify(answers));
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
                  >
                    <Save size={15} />
                    Enregistrer
                  </button>

                  <button
                    type="button"
                    disabled={submitting || !isSupabaseConfigured}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Envoi en cours…" : "Transmettre le questionnaire"}
                    {!submitting && <ArrowRight size={15} />}
                    {submitting && <Send size={15} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default QuestionnaireAuditPage;
