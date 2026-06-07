import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { invokeContentAdmin } from "@/lib/content-admin";

type PostAuditPack = {
  pack_id: string;
  organization_name: string | null;
  prospect_id: string | null;
  post_audit_processed: boolean | null;
  post_audit_processed_at: string | null;
  routing_priority: string | null;
  assigned_expert_email: string | null;
  next_action_at: string | null;
  created_at: string;
};

type PostAuditFollowUp = {
  id: string;
  pack_id: string | null;
  prospect_id: string | null;
  status: string | null;
  routing_priority: string | null;
  assigned_expert_email: string | null;
  resend_brief_id: string | null;
  processed_at: string | null;
  next_action_at: string | null;
  trigger_source: string | null;
  primary_service: string | null;
  organization_name: string | null;
  decision_maker_name: string | null;
  decision_maker_role: string | null;
  target_email: string | null;
  country: string | null;
  sector_guess: string | null;
  maturity_level: string | null;
  completion_percentage: number | null;
};

type FormResponse = {
  id: string;
  pack_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_position: string | null;
  user_entity: string | null;
  completion_percentage: number | null;
  is_completed: boolean | null;
  submitted_at: string | null;
};

type PostAuditSnapshot = {
  overview: {
    totalPacks: number;
    processedPacks: number;
    pendingPacks: number;
    highPriority: number;
    totalFollowUps: number;
    completedForms: number;
  };
  packs: PostAuditPack[];
  followUps: PostAuditFollowUp[];
  formResponses: FormResponse[];
};

const priorityTone: Record<string, string> = {
  high: "bg-red-500 text-white",
  normal: "bg-sky-600 text-white",
};

const fmt = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })
    : "—";

type Props = { token: string };

const PostAuditPipelineAdminPanel = ({ token }: Props) => {
  const [snapshot, setSnapshot] = useState<PostAuditSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"follow-ups" | "forms" | "packs">("follow-ups");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invokeContentAdmin<{ data: PostAuditSnapshot }>(token, {
        entity: "post-audit",
        action: "list",
      });
      setSnapshot(result.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const ov = snapshot?.overview;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-card-foreground">Pipeline Post-Audit V6</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivi temps réel des prospects ayant complété le formulaire d'audit IA (≥ 80 %).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Formulaires ≥ 80 %", value: ov?.completedForms ?? 0, tone: "text-primary" },
          { label: "Packs traités V6", value: ov?.processedPacks ?? 0, tone: "text-emerald-600" },
          { label: "En attente", value: ov?.pendingPacks ?? 0, tone: "text-amber-600" },
          { label: "Priorité haute", value: ov?.highPriority ?? 0, tone: "text-red-500" },
          { label: "Follow-ups envoyés", value: ov?.totalFollowUps ?? 0, tone: "text-sky-600" },
          { label: "Total packs", value: ov?.totalPacks ?? 0, tone: "text-muted-foreground" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{kpi.label}</p>
            <p className={`mt-2 font-heading text-3xl font-bold ${kpi.tone}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Nav secondaire */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {(["follow-ups", "forms", "packs"] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setActiveView(view)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              activeView === view
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-card-foreground"
            }`}
          >
            {view === "follow-ups" ? "Briefs envoyés" : view === "forms" ? "Formulaires complétés" : "Tous les packs"}
          </button>
        ))}
      </div>

      {/* Vue : Follow-ups */}
      {activeView === "follow-ups" ? (
        <div className="space-y-3">
          {(snapshot?.followUps ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun follow-up enregistré.</p>
          ) : null}
          {(snapshot?.followUps ?? []).map((fu) => (
            <div key={fu.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-semibold text-card-foreground">
                    {fu.organization_name ?? "—"}
                    {fu.decision_maker_name ? (
                      <span className="ml-2 font-normal text-muted-foreground text-sm">· {fu.decision_maker_name}</span>
                    ) : null}
                    {fu.decision_maker_role ? (
                      <span className="ml-1 text-xs text-muted-foreground">({fu.decision_maker_role})</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fu.target_email ?? "—"} · {fu.country ?? "—"} · {fu.sector_guess ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maturité : <span className="font-medium text-card-foreground">{fu.maturity_level ?? "—"}</span>
                    {" · "}Complétion : <span className="font-medium text-card-foreground">{fu.completion_percentage ?? "—"} %</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {fu.routing_priority ? (
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityTone[fu.routing_priority] ?? "bg-secondary text-secondary-foreground"}`}>
                      {fu.routing_priority === "high" ? "PRIORITÉ HAUTE" : "Normal"}
                    </span>
                  ) : null}
                  <Badge variant="secondary">{fu.status ?? "—"}</Badge>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-xs">
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-semibold text-muted-foreground uppercase tracking-wide">Service recommandé</p>
                  <p className="mt-1 font-medium text-card-foreground">{fu.primary_service ?? "—"}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-semibold text-muted-foreground uppercase tracking-wide">Expert assigné</p>
                  <p className="mt-1 font-medium text-card-foreground break-all">{fu.assigned_expert_email ?? "—"}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-semibold text-muted-foreground uppercase tracking-wide">Traité le</p>
                  <p className="mt-1 font-medium text-card-foreground">{fmt(fu.processed_at)}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <p className="font-semibold text-muted-foreground uppercase tracking-wide">Prochaine action</p>
                  <p className="mt-1 font-medium text-card-foreground">{fmt(fu.next_action_at)}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>Pack : <code className="text-xs bg-muted px-1 rounded">{fu.pack_id ?? "—"}</code></span>
                {fu.resend_brief_id ? (
                  <span>Brief Resend : <code className="text-xs bg-muted px-1 rounded">{fu.resend_brief_id}</code></span>
                ) : null}
                <span>Source : {fu.trigger_source ?? "—"}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Vue : Formulaires complétés */}
      {activeView === "forms" ? (
        <div className="space-y-3">
          {(snapshot?.formResponses ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun formulaire ≥ 80 % trouvé.</p>
          ) : null}
          {(snapshot?.formResponses ?? []).map((fr) => (
            <div key={fr.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-card-foreground">
                    {fr.user_name ?? "—"}
                    {fr.user_position ? <span className="ml-2 text-sm font-normal text-muted-foreground">· {fr.user_position}</span> : null}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {fr.user_entity ?? "—"} · {fr.user_email ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Soumis le {fmt(fr.submitted_at)}
                    {" · "}Pack : <code className="text-xs bg-muted px-1 rounded">{fr.pack_id ?? "sans pack"}</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600">
                    {fr.completion_percentage ?? 0} %
                  </div>
                  <Badge variant={fr.is_completed ? "default" : "secondary"}>
                    {fr.is_completed ? "Complété" : "Partiel"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Vue : Tous les packs */}
      {activeView === "packs" ? (
        <div className="space-y-3">
          {(snapshot?.packs ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun pack trouvé.</p>
          ) : null}
          {(snapshot?.packs ?? []).map((pack) => (
            <div key={pack.pack_id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-card-foreground">{pack.organization_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Prospect : {pack.prospect_id ?? "—"}
                    {" · "}Expert : {pack.assigned_expert_email ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Traité le {fmt(pack.post_audit_processed_at)}
                    {" · "}Next action : {fmt(pack.next_action_at)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <code className="text-xs bg-muted px-1 rounded">{pack.pack_id}</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {pack.routing_priority ? (
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityTone[pack.routing_priority] ?? "bg-secondary text-secondary-foreground"}`}>
                      {pack.routing_priority === "high" ? "HIGH" : "Normal"}
                    </span>
                  ) : null}
                  <Badge variant={pack.post_audit_processed ? "default" : "secondary"}>
                    {pack.post_audit_processed ? "Traité V6" : "Non traité"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PostAuditPipelineAdminPanel;
