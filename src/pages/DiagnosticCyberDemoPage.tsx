import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoredAssessment, { type AssessmentConfig } from "@/components/demos/ScoredAssessment";
import { diagnosticCyberQuestions } from "@/data/diagnosticCyberQuestions";
import { trackAnalyticsEvent } from "@/lib/analytics";

const assessmentConfig: AssessmentConfig = {
  questions: diagnosticCyberQuestions,
  bands: [
    {
      minPercent: 71,
      label: "Niveau maîtrisé",
      description:
        "Les bonnes pratiques essentielles sont en place. Les prochaines étapes portent surtout sur la formalisation et le suivi dans la durée.",
      tone: "maitrise",
    },
    {
      minPercent: 41,
      label: "Niveau intermédiaire",
      description:
        "Des fondations existent mais restent inégales selon les domaines — un accompagnement ciblé permet de combler les écarts les plus critiques rapidement.",
      tone: "intermediaire",
    },
    {
      minPercent: 0,
      label: "Niveau initial",
      description:
        "Plusieurs pratiques de base restent à mettre en place. C'est le profil qui bénéficie le plus d'un accompagnement structuré à court terme.",
      tone: "initial",
    },
  ],
  accent: {
    ring: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    bar: "bg-emerald-400",
    text: "text-emerald-300",
  },
};

const DiagnosticCyberDemoPage = () => {
  useEffect(() => {
    trackAnalyticsEvent("diagnostic_cyber_demo_view");
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#123526_0%,#0c1f18_40%,#060f0c_100%)] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-emerald-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au site
          </Link>
          <Badge className="border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
            Auto-diagnostic — inspiré ISO 27001
          </Badge>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
              <ShieldAlert className="h-3.5 w-3.5" />
              Vérificateur de posture cybersécurité
            </div>

            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              Où en est <span className="text-emerald-300">votre organisation</span> sur les fondamentaux cybersécurité ?
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
              15 questions, réparties sur 7 thématiques inspirées d&apos;ISO 27001 — gouvernance, accès,
              sensibilisation, sauvegardes, incidents, sécurité physique et tiers. Réponses en 3 minutes,
              résultat immédiat avec un score par catégorie.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-1">
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="h-4 w-4 text-emerald-300" />
                    7 thématiques ISO 27001
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Politique &amp; gouvernance, contrôle d&apos;accès, sensibilisation du personnel, sauvegardes,
                  gestion des incidents, sécurité physique, tiers &amp; fournisseurs.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    Score détaillé par catégorie
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Pas seulement un score global : vous voyez immédiatement les thématiques les plus solides et
                  celles qui méritent une attention prioritaire.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-4 w-4 text-emerald-300" />
                    Auto-diagnostic, pas un audit
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Un premier repère indicatif pour prioriser les échanges avec notre équipe — pas un audit de
                  certification ISO 27001.
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <ScoredAssessment config={assessmentConfig} />
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-slate-500">
          Portail de démonstration — TransferAI Africa. Auto-évaluation déclarative, aucune information réelle
          de client n&apos;est collectée.
        </p>
      </div>
    </div>
  );
};

export default DiagnosticCyberDemoPage;
