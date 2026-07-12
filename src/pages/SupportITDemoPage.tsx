import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

type Urgency = "normal" | "urgent" | "critique";
type Channel = "web" | "email" | "teams" | "whatsapp";

type StepKey = "ticket" | "diagnostic" | "decision" | "sla";

type TicketDecision = {
  ticket_id?: string;
  category?: string;
  confidence?: number;
  decision?: "auto_resolved" | "escalated";
  response_text?: string;
  escalated_to?: string | null;
  sla_target_minutes?: number;
  execution_ms?: number;
};

const URGENCY_OPTIONS: { value: Urgency; label: string }[] = [
  { value: "normal", label: "Normale" },
  { value: "urgent", label: "Urgente" },
  { value: "critique", label: "Critique / bloquant" },
];

const CHANNEL_OPTIONS: { value: Channel; label: string }[] = [
  { value: "web", label: "Portail web" },
  { value: "email", label: "Email" },
  { value: "teams", label: "Teams" },
  { value: "whatsapp", label: "WhatsApp" },
];

const STEP_LABELS: { key: StepKey; title: string; detail: string }[] = [
  { key: "ticket", title: "Ticket reçu", detail: "Ticket collecté et transmis au workflow n8n" },
  { key: "diagnostic", title: "Diagnostic IA", detail: "Classification GPT-4o en cours" },
  { key: "decision", title: "Réponse auto / Escalade", detail: "Décision selon le seuil de confiance" },
  { key: "sla", title: "Suivi SLA", detail: "Objectif de résolution attribué" },
];

const emptyForm = {
  fullName: "",
  email: "",
  department: "",
  subject: "",
  description: "",
  urgency: "normal" as Urgency,
  channel: "web" as Channel,
};

const SupportITDemoPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TicketDecision | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.subject.trim() || !form.description.trim() || submitting) {
      return;
    }

    setSubmitting(true);
    setResult(null);
    setErrorMessage(null);
    setActiveStep(1);

    if (!isSupabaseConfigured) {
      setErrorMessage(supabaseUnavailableMessage);
      setSubmitting(false);
      setActiveStep(0);
      return;
    }

    trackAnalyticsEvent("support_it_demo_ticket_submit", { urgency: form.urgency, channel: form.channel });

    setActiveStep(2);
    const { data, error } = await supabase.functions.invoke("it-support-demo-ticket", {
      body: {
        full_name: form.fullName,
        email: form.email,
        department: form.department,
        subject: form.subject,
        description: form.description,
        urgency: form.urgency,
        channel: form.channel,
      },
    });

    if (error || !data || data.error) {
      const message =
        (data && (data.detail || data.error)) ||
        error?.message ||
        "Le workflow n8n n'a pas répondu. Vérifie que le webhook est actif.";
      setErrorMessage(String(message));
      setSubmitting(false);
      setActiveStep(0);
      return;
    }

    setActiveStep(STEP_LABELS.length + 1);
    setResult(data as TicketDecision);
    setSubmitting(false);
  };

  const reset = () => {
    setForm(emptyForm);
    setResult(null);
    setErrorMessage(null);
    setActiveStep(0);
  };

  return (
    <div className="min-h-screen bg-[#070C14] text-[#E8EDF5]">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#6B7A99] hover:text-[#FF6B4A] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Retour au site
        </Link>

        <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-[#FF6B4A]/20 bg-[#FF6B4A]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B4A]">
          <Sparkles className="h-3 w-3" /> Démo live — Support IT Intelligent
        </div>
        <h1 className="mb-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Soumets un ticket, regarde <span className="text-[#FF6B4A]">l'IA</span> le traiter en direct
        </h1>
        <p className="mb-3 max-w-xl text-[15px] font-light leading-relaxed text-[#6B7A99]">
          Ce formulaire déclenche le vrai workflow n8n de production : classification GPT-4o, décision de résolution
          automatique ou d'escalade, notification technicien, et objectif SLA.
        </p>
        <p className="mb-12 max-w-xl text-[12px] font-medium text-[#FFD166]">
          ⚠ Un email réel sera envoyé à l'adresse renseignée ci-dessous (résolution auto ou accusé de réception).
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded border border-white/[0.07] bg-[#0D1520] p-7"
          >
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7A99]">
                  Nom complet
                </label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  placeholder="Ex : Awa Koné"
                  required
                  className="border-white/10 bg-[#111C2E] text-[#E8EDF5] placeholder:text-[#6B7A99]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7A99]">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="awa@exemple.ci"
                  required
                  className="border-white/10 bg-[#111C2E] text-[#E8EDF5] placeholder:text-[#6B7A99]"
                />
              </div>
            </div>

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7A99]">
              Département (optionnel)
            </label>
            <Input
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              placeholder="Ex : Direction Financière"
              className="mb-4 border-white/10 bg-[#111C2E] text-[#E8EDF5] placeholder:text-[#6B7A99]"
            />

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7A99]">
              Sujet du ticket
            </label>
            <Input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Ex : Impossible de me connecter au VPN"
              required
              className="mb-4 border-white/10 bg-[#111C2E] text-[#E8EDF5] placeholder:text-[#6B7A99]"
            />

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7A99]">
              Description
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Décris le problème comme le ferait un utilisateur réel..."
              required
              rows={4}
              className="mb-4 border-white/10 bg-[#111C2E] text-[#E8EDF5] placeholder:text-[#6B7A99]"
            />

            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7A99]">
                  Urgence déclarée
                </label>
                <Select
                  value={form.urgency}
                  onValueChange={(value: Urgency) => setForm((f) => ({ ...f, urgency: value }))}
                >
                  <SelectTrigger className="border-white/10 bg-[#111C2E] text-[#E8EDF5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7A99]">
                  Canal
                </label>
                <Select
                  value={form.channel}
                  onValueChange={(value: Channel) => setForm((f) => ({ ...f, channel: value }))}
                >
                  <SelectTrigger className="border-white/10 bg-[#111C2E] text-[#E8EDF5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-[#FF6B4A] text-black hover:opacity-85">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {submitting ? "Traitement en cours…" : "Soumettre le ticket"}
            </Button>

            {errorMessage ? (
              <p className="mt-4 rounded border border-[#FF4D6D]/30 bg-[#FF4D6D]/10 p-3 text-xs text-[#FF4D6D]">
                {errorMessage}
              </p>
            ) : null}

            {result ? (
              <button
                type="button"
                onClick={reset}
                className="mt-4 text-xs uppercase tracking-wider text-[#6B7A99] hover:text-[#FF6B4A]"
              >
                Soumettre un nouveau ticket
              </button>
            ) : null}
          </form>

          <div className="rounded border border-white/[0.07] bg-[#0D1520] p-7">
            <div className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7A99]">
              Workflow en temps réel
            </div>
            <div className="flex flex-col gap-3">
              {STEP_LABELS.map((step, i) => {
                const stepIndex = i + 1;
                const isDone = activeStep > stepIndex;
                const isActive = activeStep === stepIndex;
                return (
                  <div
                    key={step.key}
                    className={`flex items-start gap-3 rounded border p-3 transition-colors ${
                      isActive
                        ? "border-[#FF6B4A]/40 bg-[#FF6B4A]/5"
                        : isDone
                          ? "border-[#7CFF6B]/20 bg-[#7CFF6B]/5"
                          : "border-white/[0.05] bg-white/[0.01]"
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-[#7CFF6B]" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#FF6B4A]" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-[#6B7A99]/40" />
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#E8EDF5]">{step.title}</div>
                      <div className="text-[11px] font-light text-[#6B7A99]">{step.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {result ? (
              <div className="mt-6 space-y-3 border-t border-white/[0.07] pt-5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6B7A99]">Catégorie</span>
                  <span className="font-semibold">{result.category ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6B7A99]">Confiance IA</span>
                  <span className="font-semibold">
                    {typeof result.confidence === "number" ? `${Math.round(result.confidence * 100)}%` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6B7A99]">Décision</span>
                  <span
                    className={`font-semibold ${
                      result.decision === "auto_resolved" ? "text-[#7CFF6B]" : "text-[#FF6B35]"
                    }`}
                  >
                    {result.decision === "auto_resolved" ? "Résolu automatiquement" : "Escaladé"}
                  </span>
                </div>
                {result.escalated_to ? (
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#6B7A99]">Escaladé vers</span>
                    <span className="font-semibold">{result.escalated_to}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6B7A99]">Objectif SLA</span>
                  <span className="font-semibold">{result.sla_target_minutes ?? "—"} min</span>
                </div>
                {typeof result.execution_ms === "number" ? (
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#6B7A99]">Temps de traitement n8n</span>
                    <span className="font-semibold">{(result.execution_ms / 1000).toFixed(1)} s</span>
                  </div>
                ) : null}
                <div className="mt-3 rounded border border-white/[0.07] bg-[#111C2E] p-3 text-[12px] font-light leading-relaxed text-[#E8EDF5]">
                  {result.response_text}
                </div>
                <p className="text-[11px] font-light text-[#6B7A99]">
                  Un email a également été envoyé à {form.email || "l'adresse indiquée"}.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportITDemoPage;
