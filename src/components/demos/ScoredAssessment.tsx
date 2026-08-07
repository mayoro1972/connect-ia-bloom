import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

export type AssessmentOption = {
  label: string;
  points: number;
};

export type AssessmentQuestion = {
  id: string;
  category: string;
  text: string;
  helper?: string;
  options: AssessmentOption[];
};

export type AssessmentBand = {
  minPercent: number;
  label: string;
  description: string;
  tone: "initial" | "intermediaire" | "maitrise";
};

export type AssessmentConfig = {
  questions: AssessmentQuestion[];
  bands: AssessmentBand[];
  accent?: {
    ring: string;
    bar: string;
    text: string;
  };
};

const DEFAULT_ACCENT = {
  ring: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
  bar: "bg-emerald-400",
  text: "text-emerald-300",
};

const toneBadgeClass: Record<AssessmentBand["tone"], string> = {
  initial: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  intermediaire: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  maitrise: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
};

function computeScores(
  questions: AssessmentQuestion[],
  answers: Record<string, number>,
) {
  const maxPointsByQuestion = new Map(
    questions.map((q) => [q.id, Math.max(...q.options.map((o) => o.points))]),
  );

  const totalMax = questions.reduce((sum, q) => sum + (maxPointsByQuestion.get(q.id) ?? 0), 0);
  const totalScore = questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const overallPercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  const byCategory = new Map<string, { max: number; score: number }>();
  for (const q of questions) {
    const entry = byCategory.get(q.category) ?? { max: 0, score: 0 };
    entry.max += maxPointsByQuestion.get(q.id) ?? 0;
    entry.score += answers[q.id] ?? 0;
    byCategory.set(q.category, entry);
  }

  const categoryBreakdown = Array.from(byCategory.entries()).map(([category, { max, score }]) => ({
    category,
    percent: max > 0 ? Math.round((score / max) * 100) : 0,
  }));

  return { overallPercent, categoryBreakdown };
}

const ScoredAssessment = ({ config }: { config: AssessmentConfig }) => {
  const { questions, bands } = config;
  const accent = config.accent ?? DEFAULT_ACCENT;

  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const question = questions[active];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);
  const isLast = active === questions.length - 1;

  const selectOption = (points: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: points }));
  };

  const goNext = () => {
    if (isLast) {
      setShowResults(true);
      return;
    }
    setActive((i) => Math.min(questions.length - 1, i + 1));
  };

  const goPrev = () => {
    setActive((i) => Math.max(0, i - 1));
  };

  const restart = () => {
    setAnswers({});
    setActive(0);
    setShowResults(false);
  };

  const { overallPercent, categoryBreakdown } = useMemo(
    () => computeScores(questions, answers),
    [questions, answers],
  );

  const band = useMemo(() => {
    const sorted = [...bands].sort((a, b) => b.minPercent - a.minPercent);
    return sorted.find((b) => overallPercent >= b.minPercent) ?? sorted[sorted.length - 1];
  }, [bands, overallPercent]);

  if (showResults) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Votre résultat</p>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${toneBadgeClass[band.tone]}`}>
            {band.label}
          </span>
        </div>

        <div className="mt-4 flex items-end gap-3">
          <p className="text-5xl font-extrabold tracking-tight text-white">{overallPercent}%</p>
          <p className="mb-1.5 text-sm text-slate-400">de maturité globale</p>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{band.description}</p>

        <div className="mt-6 space-y-3">
          {categoryBreakdown.map((c) => (
            <div key={c.category}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{c.category}</span>
                <span>{c.percent}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${accent.bar}`}
                  style={{ width: `${c.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Auto-diagnostic indicatif inspiré des thématiques ISO 27001 — ne constitue pas un audit de
          certification.
        </p>

        <button
          type="button"
          onClick={restart}
          className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Recommencer le diagnostic
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="uppercase tracking-[0.18em] text-slate-500">{question.category}</span>
        <span>
          Question {active + 1} / {questions.length}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${accent.bar} transition-all`} style={{ width: `${progressPercent}%` }} />
      </div>

      <p className="mt-6 text-lg font-semibold leading-7 text-white">{question.text}</p>
      {question.helper ? <p className="mt-1.5 text-sm text-slate-400">{question.helper}</p> : null}

      <div className="mt-5 flex flex-col gap-2">
        {question.options.map((option) => {
          const isSelected = answers[question.id] === option.points;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => selectOption(option.points)}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                isSelected ? accent.ring : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              {option.label}
              {isSelected ? <CheckCircle2 className="h-4 w-4" /> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={goPrev}
          className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100 ${
            active === 0 ? "invisible" : ""
          }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Précédent
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={answers[question.id] === undefined}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isLast ? "Voir mon résultat" : "Suivant"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ScoredAssessment;
