import { useEffect, useMemo, useState } from "react";
import { invokeContentAdmin } from "@/lib/content-admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Registration = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  organization: string | null;
  position: string | null;
  sector: string | null;
  sector_other: string | null;
  domain_key: string | null;
  domain_other: string | null;
  formation_id: string | null;
  formation_title: string | null;
  formation_other: string | null;
  participants: number;
  language: string;
  motivation: string | null;
  scheduled_date: string;
  status: string;
  admin_notes: string | null;
  date_confirmed_at: string | null;
};

type Snapshot = {
  overview: {
    total: number;
    received: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  registrations: Registration[];
};

const STATUSES = [
  { key: "all", label: "Tous" },
  { key: "received", label: "Reçus" },
  { key: "date_confirmed", label: "Date confirmée" },
  { key: "completed", label: "Réalisés" },
  { key: "cancelled", label: "Annulés" },
];

const exportCsv = (rows: Registration[]) => {
  const headers = [
    "Date inscription", "Nom", "Email", "Téléphone", "Pays", "Ville",
    "Organisation", "Fonction", "Secteur", "Domaine", "Formation",
    "Participants", "Langue", "Motivation", "Date prévue", "Statut", "Notes",
  ];
  const escape = (v: unknown) => {
    const s = (v ?? "").toString().replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const lines = [headers.join(";")];
  rows.forEach((r) => {
    lines.push([
      new Date(r.created_at).toLocaleString("fr-FR"),
      r.full_name, r.email, r.phone ?? "", r.country ?? "", r.city ?? "",
      r.organization ?? "", r.position ?? "",
      r.sector ?? r.sector_other ?? "",
      r.domain_key ?? r.domain_other ?? "",
      r.formation_title ?? r.formation_other ?? "",
      r.participants, r.language, r.motivation ?? "",
      r.scheduled_date, r.status, r.admin_notes ?? "",
    ].map(escape).join(";"));
  });
  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `webinar-inscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const WebinarAdminPanel = ({ token }: { token: string }) => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await invokeContentAdmin<{ data: Snapshot }>(token, {
        entity: "webinars",
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
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateRow = async (id: string, patch: Partial<Registration>) => {
    try {
      await invokeContentAdmin(token, {
        entity: "webinars",
        action: "update",
        payload: { id, ...patch },
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible.");
    }
  };

  const allDomains = useMemo(() => {
    const set = new Set<string>();
    snapshot?.registrations.forEach((r) => {
      if (r.domain_key) set.add(r.domain_key);
    });
    return Array.from(set).sort();
  }, [snapshot]);

  const filtered = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.registrations.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (domainFilter !== "all" && r.domain_key !== domainFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const blob = `${r.full_name} ${r.email} ${r.organization ?? ""} ${r.formation_title ?? ""} ${r.sector ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [snapshot, statusFilter, domainFilter, search]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        {[
          { label: "Total", value: snapshot?.overview.total ?? 0 },
          { label: "Reçus", value: snapshot?.overview.received ?? 0 },
          { label: "Date confirmée", value: snapshot?.overview.confirmed ?? 0 },
          { label: "Réalisés", value: snapshot?.overview.completed ?? 0 },
          { label: "Annulés", value: snapshot?.overview.cancelled ?? 0 },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{s.label}</p>
            <p className="mt-2 font-heading text-2xl font-bold text-card-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher (nom, email, organisation…)"
          className="max-w-sm"
        />
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
        >
          <option value="all">Tous domaines</option>
          {allDomains.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          {loading ? "Chargement…" : "Rafraîchir"}
        </Button>
        <Button onClick={() => exportCsv(filtered)} size="sm" disabled={filtered.length === 0}>
          Exporter CSV ({filtered.length})
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Inscrit</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Domaine / Formation</th>
              <th className="p-3">Date prévue</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border align-top">
                <td className="p-3">
                  <div className="font-semibold text-card-foreground">{r.full_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.organization ?? "—"}{r.position ? ` · ${r.position}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {[r.city, r.country].filter(Boolean).join(", ") || "—"}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("fr-FR")}
                  </div>
                </td>
                <td className="p-3 text-xs">
                  <div>{r.email}</div>
                  {r.phone && <div className="text-muted-foreground">{r.phone}</div>}
                  <div className="text-muted-foreground">{r.sector ?? r.sector_other ?? "—"}</div>
                </td>
                <td className="p-3 text-xs">
                  <div className="font-medium text-card-foreground">
                    {r.domain_key ?? r.domain_other ?? "—"}
                  </div>
                  <div className="text-muted-foreground">
                    {r.formation_title ?? r.formation_other ?? "—"}
                  </div>
                  <div className="text-muted-foreground">{r.participants} participant(s) · {r.language.toUpperCase()}</div>
                </td>
                <td className="p-3">
                  <Input
                    type="date"
                    value={r.scheduled_date}
                    onChange={(e) => updateRow(r.id, { scheduled_date: e.target.value })}
                    className="w-36"
                  />
                </td>
                <td className="p-3">
                  <select
                    className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                    value={r.status}
                    onChange={(e) => updateRow(r.id, { status: e.target.value })}
                  >
                    <option value="received">Reçu</option>
                    <option value="date_confirmed">Date confirmée</option>
                    <option value="completed">Réalisé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </td>
                <td className="p-3 text-xs">
                  <a
                    href={`mailto:${r.email}?subject=${encodeURIComponent("Webinaire TransferAI Africa")}`}
                    className="text-primary hover:underline"
                  >
                    Email
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                  Aucune inscription pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WebinarAdminPanel;
