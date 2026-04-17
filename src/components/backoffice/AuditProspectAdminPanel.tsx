import { Badge } from "@/components/ui/badge";

export type AuditProspectItem = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  prospect_type: string | null;
  profession: string | null;
  city: string | null;
  country: string | null;
  sector: string | null;
  wants_expert_appointment: boolean;
  audit_followup_status: string | null;
  audit_followup_scheduled_at: string | null;
  audit_followup_sent_at: string | null;
  audit_followup_error: string | null;
  prospect_username: string | null;
  prospect_portal_status: string;
  last_portal_login_at: string | null;
};

export type AuditProspectEmailLog = {
  id: string;
  contact_request_id: string | null;
  recipient_email: string;
  delivery_type: string;
  status: string;
  subject: string | null;
  sent_at: string | null;
  error_message: string | null;
};

export type AuditProspectSnapshot = {
  overview: {
    totalRequests: number;
    pendingFollowups: number;
    sentFollowups: number;
    failedFollowups: number;
    requestedAppointments: number;
    activePortals: number;
  };
  requests: AuditProspectItem[];
  deliveries: AuditProspectEmailLog[];
};

const statusTone: Record<string, string> = {
  pending: "secondary",
  sent: "default",
  failed: "destructive",
  active: "default",
  disabled: "outline",
} as const;

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Non envoyé";

const ProspectStatusBadge = ({ value, fallback }: { value?: string | null; fallback?: string }) => {
  const label = value || fallback || "non défini";
  const variant = (statusTone[value ?? ""] as "default" | "secondary" | "destructive" | "outline" | undefined) ?? "outline";

  return <Badge variant={variant}>{label}</Badge>;
};

const deliveryLabels: Record<string, string> = {
  internal_notification: "Notification interne",
  acknowledgement: "Accusé de réception",
  audit_explainer: "Email explicatif secteur",
  qualified_response: "Réponse qualifiée",
  audit_form_access: "Accès au formulaire d'audit",
};

type Props = {
  snapshot: AuditProspectSnapshot | null;
};

const AuditProspectAdminPanel = ({ snapshot }: Props) => {
  const deliveriesByRequest = new Map<string, AuditProspectEmailLog[]>();

  for (const delivery of snapshot?.deliveries ?? []) {
    const key = delivery.contact_request_id ?? "unknown";
    const current = deliveriesByRequest.get(key) ?? [];
    current.push(delivery);
    deliveriesByRequest.set(key, current);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Demandes reçues</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot?.overview.totalRequests ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Demandes d'accès au formulaire d'audit enregistrées.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Suivis 30 min</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot?.overview.pendingFollowups ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Demandes encore en attente d'envoi du lien d'accès.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Accès activés</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot?.overview.activePortals ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Prospects disposant d'identifiants actifs pour le portail.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-card-foreground">Demandes prospect audit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Vue administrateur du pipeline: création de compte prospect, accusé de réception, email explicatif et accès sécurisé au formulaire d'audit.
        </p>

        <div className="mt-6 space-y-4">
          {(snapshot?.requests ?? []).map((request) => {
            const deliveries = deliveriesByRequest.get(request.id) ?? [];

            return (
              <div key={request.id} className="rounded-2xl border border-border bg-background/70 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-card-foreground">{request.full_name}</p>
                      <ProspectStatusBadge value={request.audit_followup_status} fallback="suivi non planifié" />
                      <ProspectStatusBadge value={request.prospect_portal_status} fallback="portail" />
                      {request.wants_expert_appointment ? <Badge variant="secondary">RDV demandé</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.email} · {request.phone}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.prospect_type || "Qualification non précisée"} · {request.profession || "Profession non précisée"} · {[request.city, request.country].filter(Boolean).join(", ") || "Localisation non précisée"}
                    </p>
                    <p className="mt-1 text-sm text-card-foreground">{request.sector || "Secteur non précisé"}</p>
                  </div>

                  <div className="grid gap-2 text-sm text-muted-foreground xl:min-w-[280px]">
                    <p>Demande: {formatDateTime(request.created_at)}</p>
                    <p>Suivi prévu: {formatDateTime(request.audit_followup_scheduled_at)}</p>
                    <p>Suivi envoyé: {formatDateTime(request.audit_followup_sent_at)}</p>
                    <p>Username: {request.prospect_username || "Non défini"}</p>
                    <p>Dernière connexion: {formatDateTime(request.last_portal_login_at)}</p>
                    {request.audit_followup_error ? <p className="text-destructive">Erreur: {request.audit_followup_error}</p> : null}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-card-foreground">Historique emails</p>
                  <div className="mt-3 space-y-3">
                    {deliveries.length > 0 ? (
                      deliveries.map((delivery) => (
                        <div key={delivery.id} className="flex flex-col gap-2 rounded-xl border border-border px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-medium text-card-foreground">{deliveryLabels[delivery.delivery_type] ?? delivery.delivery_type}</p>
                            <p className="text-muted-foreground">{delivery.subject || "Sujet non enregistré"}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={delivery.status === "failed" ? "destructive" : "secondary"}>{delivery.status}</Badge>
                            <span className="text-muted-foreground">{formatDateTime(delivery.sent_at)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun log email enregistré pour cette demande.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuditProspectAdminPanel;
