import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, Sparkles, Globe, Calendar, CheckCircle2, X, Archive } from "lucide-react";
import type { LiveFormatProposal } from "@/hooks/useLiveFormatProposals";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const FN_BASE = `https://${PROJECT_ID}.supabase.co/functions/v1`;

const STATUS_FILTERS = [
  { key: "draft", label: "Brouillons IA" },
  { key: "approved", label: "Approuvés" },
  { key: "published", label: "Publiés" },
  { key: "archived", label: "Archivés" },
  { key: "rejected", label: "Rejetés" },
];

const callAdmin = async (action: string, body?: unknown, method: string = "POST") => {
  const url = new URL(`${FN_BASE}/live-formats-admin`);
  url.searchParams.set("action", action);
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Erreur back-office");
  return data;
};

const triggerFn = async (path: string) => {
  const res = await fetch(`${FN_BASE}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${path} → ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json().catch(() => ({}));
};

const LiveFormatsAdminPanel = () => {
  const [items, setItems] = useState<LiveFormatProposal[]>([]);
  const [filter, setFilter] = useState<string>("draft");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, Partial<LiveFormatProposal>>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${FN_BASE}/live-formats-admin`);
      url.searchParams.set("status", filter);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${PUBLISHABLE_KEY}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Erreur");
      setItems(data.items as LiveFormatProposal[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleAction = async (id: string, action: string) => {
    setBusy(id + ":" + action);
    setError(null);
    setInfo(null);
    try {
      const patch = editing[id] ?? {};
      await callAdmin(action, { id, ...patch });
      setEditing((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
      setInfo(`Action "${action}" effectuée`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(null);
    }
  };

  const runScrape = async () => {
    setBusy("scrape");
    setError(null);
    setInfo("Scraping Firecrawl en cours… (peut prendre 1 min)");
    try {
      const r = await triggerFn("live-formats-scrape");
      setInfo(`✅ Scraping terminé : ${r.signals_stored ?? 0} signaux collectés`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur scraping");
    } finally {
      setBusy(null);
    }
  };

  const runGenerate = async () => {
    setBusy("generate");
    setError(null);
    setInfo("Génération IA en cours… (1 à 2 min, ne fermez pas la page)");
    try {
      const r = await triggerFn("live-formats-generate");
      setInfo(`✅ ${r.proposals_stored ?? 0} propositions créées en brouillon`);
      setFilter("draft");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur génération");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
        <div>
          <h3 className="font-heading text-lg font-bold">Formats live (séminaires & webinaires)</h3>
          <p className="text-sm text-muted-foreground">
            Génération bi-mensuelle automatique (1er & 15) à partir des tendances scrappées en Côte d'Ivoire / Afrique de l'Ouest.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runScrape} disabled={!!busy} variant="outline" size="sm">
            {busy === "scrape" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Globe className="mr-2 size-4" />}
            Scraper maintenant
          </Button>
          <Button onClick={runGenerate} disabled={!!busy} size="sm">
            {busy === "generate" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
            Générer 5 propositions
          </Button>
          <Button onClick={load} variant="ghost" size="sm" disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {info && <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">{info}</div>}
      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === s.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="size-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
          Aucune proposition avec ce statut. Lancez "Générer" pour créer un nouveau cycle.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => {
            const patch = editing[it.id] ?? {};
            const titleFr = (patch.title_fr ?? it.title_fr) as string;
            const descFr = (patch.description_fr ?? it.description_fr ?? "") as string;
            const titleEn = (patch.title_en ?? it.title_en) as string;
            const descEn = (patch.description_en ?? it.description_en ?? "") as string;
            const updateField = (field: string, val: string) =>
              setEditing((p) => ({ ...p, [it.id]: { ...(p[it.id] ?? {}), [field]: val } }));

            return (
              <div key={it.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant={it.format_type === "seminar" ? "default" : "secondary"}>
                    {it.format_type === "seminar" ? "Séminaire" : "Webinaire"} #{it.rank}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="size-3" /> Cycle {it.cycle_start_date}
                  </Badge>
                  {it.trend_score != null && (
                    <Badge variant="outline">Score tendance: {Math.round(it.trend_score)}</Badge>
                  )}
                  {it.domain_key && <Badge variant="outline">{it.domain_key}</Badge>}
                  <Badge>{it.status}</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">FR — Titre</label>
                    <input
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={titleFr}
                      onChange={(e) => updateField("title_fr", e.target.value)}
                    />
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">FR — Description</label>
                    <Textarea rows={3} value={descFr} onChange={(e) => updateField("description_fr", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">EN — Title</label>
                    <input
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={titleEn}
                      onChange={(e) => updateField("title_en", e.target.value)}
                    />
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">EN — Description</label>
                    <Textarea rows={3} value={descEn} onChange={(e) => updateField("description_en", e.target.value)} />
                  </div>
                </div>

                {it.target_sectors_fr?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {it.target_sectors_fr.map((s) => (
                      <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs">{s}</span>
                    ))}
                  </div>
                )}

                {it.agenda_fr && it.agenda_fr.length > 0 && (
                  <div className="mt-3 rounded-lg bg-muted/40 p-3 text-xs">
                    <p className="mb-1 font-semibold">Programme :</p>
                    <ul className="ml-4 list-disc space-y-0.5">
                      {it.agenda_fr.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                )}

                {it.trend_justification_fr && (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
                    <span className="font-semibold">📊 Justification IA :</span> {it.trend_justification_fr}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="outline" onClick={() => handleAction(it.id, "update")} disabled={!!busy || !patch.title_fr}>
                    Enregistrer modifications
                  </Button>
                  {it.status === "draft" && (
                    <>
                      <Button size="sm" onClick={() => handleAction(it.id, "publish")} disabled={!!busy}>
                        <CheckCircle2 className="mr-1 size-3" /> Publier
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(it.id, "reject")} disabled={!!busy}>
                        <X className="mr-1 size-3" /> Rejeter
                      </Button>
                    </>
                  )}
                  {it.status === "published" && (
                    <Button size="sm" variant="outline" onClick={() => handleAction(it.id, "archive")} disabled={!!busy}>
                      <Archive className="mr-1 size-3" /> Archiver
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveFormatsAdminPanel;
