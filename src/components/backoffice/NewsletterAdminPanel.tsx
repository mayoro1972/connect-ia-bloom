import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { invokeAdminEdgeFunction, invokeContentAdmin } from "@/lib/content-admin";

type NewsletterIssue = {
  id: string;
  issue_date: string;
  language: string;
  status: string;
  title: string;
  subject: string;
  preheader: string | null;
  intro: string | null;
  target_domains: string[];
  highlight_title: string | null;
  highlight_summary: string | null;
  highlight_url: string | null;
  tip_title: string | null;
  tip_body: string | null;
  tool_name: string | null;
  tool_category: string | null;
  tool_summary: string | null;
  prompt_title: string | null;
  prompt_body: string | null;
  cta_label: string | null;
  cta_url: string | null;
  body_markdown: string | null;
  body_html: string | null;
  source_post_ids: string[];
  generation_source: string;
  generation_notes: string | null;
  scheduled_for: string | null;
  approved_at: string | null;
  sent_at: string | null;
  last_test_sent_at: string | null;
  recipient_count: number;
  send_count: number;
};

type NewsletterDelivery = {
  id: string;
  newsletter_issue_id: string;
  recipient_email: string;
  delivery_type: string;
  status: string;
  provider: string;
  sent_at: string | null;
  created_at: string;
  error_message: string | null;
};

type NewsletterSnapshot = {
  overview: {
    activeSubscriptions: number;
    totalIssues: number;
    draftIssues: number;
    sentIssues: number;
  };
  issues: NewsletterIssue[];
  deliveries: NewsletterDelivery[];
};

type NewsletterAdminPanelProps = {
  token: string;
  isReady: boolean;
  isBusyGlobal?: boolean;
  onStatus: (message: string | null) => void;
  onError: (message: string | null) => void;
};

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const domainOptions = [
  "IT & Transformation Digitale",
  "Finance & Fintech",
  "Agriculture & AgroTech IA",
  "Éducation & EdTech IA",
  "Santé & IA médicale",
  "Logistique & Supply Chain",
  "Énergie & Transition énergétique",
  "RH & Gestion des talents",
  "Marketing & Communication IA",
  "Droit & LegalTech IA",
  "Immobilier & Smart City",
  "Tourisme & Hospitalité",
  "Médias & Création de contenu",
];

const emptyNewsletterForm = {
  id: "",
  issue_date: new Date().toISOString().slice(0, 10),
  language: "fr",
  status: "draft",
  title: "",
  subject: "",
  preheader: "",
  intro: "",
  target_domains: [] as string[],
  highlight_title: "",
  highlight_summary: "",
  highlight_url: "",
  tip_title: "",
  tip_body: "",
  tool_name: "",
  tool_category: "",
  tool_summary: "",
  prompt_title: "",
  prompt_body: "",
  cta_label: "Découvrir les ressources TransferAI",
  cta_url: "https://www.transferai.ci/blog",
  body_markdown: "",
  generation_source: "manual",
  generation_notes: "",
  scheduled_for: "",
};

const asLocalDateTime = (value: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

const toIsoOrNull = (value: string) => {
  if (!value.trim()) {
    return null;
  }

  return new Date(value).toISOString();
};

const NewsletterPreview = ({ form }: { form: typeof emptyNewsletterForm }) => (
  <div className="rounded-[1.75rem] border border-border bg-background p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Aperçu local</p>
    <h3 className="mt-4 font-heading text-2xl font-bold text-card-foreground">
      {form.title || "Titre de l’édition newsletter"}
    </h3>
    <p className="mt-2 text-sm text-muted-foreground">
      Sujet : {form.subject || "Objet de l’email"} {form.preheader ? `· ${form.preheader}` : ""}
    </p>
    {form.target_domains.length > 0 ? (
      <div className="mt-4 flex flex-wrap gap-2">
        {form.target_domains.map((domain) => (
          <Badge key={domain} variant="secondary">{domain}</Badge>
        ))}
      </div>
    ) : null}

    <div className="mt-6 space-y-5">
      <div className="rounded-2xl border border-primary/15 bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Introduction</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {form.intro || "L’introduction de l’édition apparaîtra ici."}
        </p>
      </div>

      <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Signal à retenir</p>
        <h4 className="mt-3 text-lg font-semibold text-card-foreground">
          {form.highlight_title || "Point principal de la semaine"}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {form.highlight_summary || "Le résumé du point principal apparaîtra ici."}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Action à lancer</p>
          <h4 className="mt-3 font-semibold text-card-foreground">{form.tip_title || "Action simple cette semaine"}</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{form.tip_body || "L'action recommandée apparaîtra ici."}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Outil à tester</p>
          <h4 className="mt-3 font-semibold text-card-foreground">{form.tool_name || "Nom de l’outil"}</h4>
          <p className="mt-1 text-xs text-muted-foreground">{form.tool_category || "Copilote / Workflow / No-code / Recherche"}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{form.tool_summary || "Le résumé outil apparaîtra ici."}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Prompt métier</p>
        <h4 className="mt-3 font-semibold text-card-foreground">{form.prompt_title || "Prompt prêt à adapter"}</h4>
        <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-background p-4 text-xs leading-6 text-muted-foreground">
          {form.prompt_body || "Le prompt apparaîtra ici."}
        </pre>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Prochaine étape</p>
        <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {form.body_markdown || "La conclusion et la prochaine étape apparaîtront ici."}
        </div>
      </div>
    </div>
  </div>
);

const NewsletterAdminPanel = ({
  token,
  isReady,
  isBusyGlobal = false,
  onStatus,
  onError,
}: NewsletterAdminPanelProps) => {
  const [snapshot, setSnapshot] = useState<NewsletterSnapshot | null>(null);
  const [form, setForm] = useState(emptyNewsletterForm);
  const [testEmail, setTestEmail] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const loadSnapshot = async () => {
    if (!isReady) {
      return;
    }

    const result = await invokeContentAdmin<{ data: NewsletterSnapshot }>(token, {
      entity: "newsletter",
      action: "list",
    });

    setSnapshot(result.data ?? null);
  };

  useEffect(() => {
    loadSnapshot().catch((error: unknown) => {
      onError(error instanceof Error ? error.message : "Chargement newsletter impossible.");
    });
  }, [isReady, token]);

  const applyIssueToForm = (issue: NewsletterIssue) => {
    setForm({
      id: issue.id,
      issue_date: issue.issue_date,
      language: issue.language,
      status: issue.status,
      title: issue.title,
      subject: issue.subject,
      preheader: issue.preheader ?? "",
      intro: issue.intro ?? "",
      target_domains: issue.target_domains ?? [],
      highlight_title: issue.highlight_title ?? "",
      highlight_summary: issue.highlight_summary ?? "",
      highlight_url: issue.highlight_url ?? "",
      tip_title: issue.tip_title ?? "",
      tip_body: issue.tip_body ?? "",
      tool_name: issue.tool_name ?? "",
      tool_category: issue.tool_category ?? "",
      tool_summary: issue.tool_summary ?? "",
      prompt_title: issue.prompt_title ?? "",
      prompt_body: issue.prompt_body ?? "",
      cta_label: issue.cta_label ?? "",
      cta_url: issue.cta_url ?? "",
      body_markdown: issue.body_markdown ?? "",
      generation_source: issue.generation_source ?? "manual",
      generation_notes: issue.generation_notes ?? "",
      scheduled_for: asLocalDateTime(issue.scheduled_for),
    });
  };

  const toggleDomain = (domain: string) => {
    setForm((current) => ({
      ...current,
      target_domains: current.target_domains.includes(domain)
        ? current.target_domains.filter((item) => item !== domain)
        : [...current.target_domains, domain],
    }));
  };

  const saveIssue = async () => {
    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      const payload = {
        ...form,
        preheader: form.preheader || null,
        intro: form.intro || null,
        highlight_title: form.highlight_title || null,
        highlight_summary: form.highlight_summary || null,
        highlight_url: form.highlight_url || null,
        tip_title: form.tip_title || null,
        tip_body: form.tip_body || null,
        tool_name: form.tool_name || null,
        tool_category: form.tool_category || null,
        tool_summary: form.tool_summary || null,
        prompt_title: form.prompt_title || null,
        prompt_body: form.prompt_body || null,
        cta_label: form.cta_label || null,
        cta_url: form.cta_url || null,
        body_markdown: form.body_markdown || null,
        generation_notes: form.generation_notes || null,
        scheduled_for: toIsoOrNull(form.scheduled_for),
      };

      const result = form.id
        ? await invokeContentAdmin<{ data: NewsletterIssue }>(token, {
            entity: "newsletter",
            action: "save",
            payload,
          })
        : await invokeContentAdmin<{ data: NewsletterIssue }>(token, {
            entity: "newsletter",
            action: "create",
            payload,
          });

      if (result.data) {
        applyIssueToForm(result.data);
      }

      await loadSnapshot();
      onStatus(form.id ? "Édition newsletter mise à jour." : "Édition newsletter créée.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Enregistrement newsletter impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const generateDraft = async () => {
    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      const result = await invokeAdminEdgeFunction<{ data: { issue: NewsletterIssue; created: boolean } }>(
        token,
        "newsletter-drafter",
        {
          issue_date: form.issue_date,
          language: form.language,
          target_domains: form.target_domains,
        },
      );

      if (result.data?.issue) {
        applyIssueToForm(result.data.issue);
      }

      await loadSnapshot();
      onStatus("Brouillon newsletter IA généré avec succès.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Génération IA impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const sendTest = async () => {
    if (!form.id || !testEmail.trim()) {
      onError("Chargez une édition puis renseignez un email de test.");
      return;
    }

    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      await invokeAdminEdgeFunction(token, "newsletter-send", {
        issue_id: form.id,
        test_email: testEmail.trim(),
      });
      await loadSnapshot();
      onStatus("Email test envoyé avec succès.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Envoi test impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const sendCampaign = async (issueId: string) => {
    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      await invokeAdminEdgeFunction(token, "newsletter-send", {
        issue_id: issueId,
      });
      await loadSnapshot();
      onStatus("Campagne newsletter envoyée.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Envoi campagne impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const setIssueStatus = async (issueId: string, status: string, scheduledFor?: string) => {
    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      await invokeContentAdmin(token, {
        entity: "newsletter",
        action: "set-status",
        payload: {
          id: issueId,
          status,
          scheduled_for: scheduledFor ? toIsoOrNull(scheduledFor) : null,
        },
      });

      await loadSnapshot();
      onStatus("Statut newsletter mis à jour.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Mise à jour du statut impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const recentIssues = snapshot?.issues ?? [];
  const recentDeliveries = snapshot?.deliveries ?? [];
  const busy = isBusy || isBusyGlobal;

  const selectedDomainsLabel = useMemo(
    () => (form.target_domains.length > 0 ? form.target_domains.join(", ") : "Tous les domaines"),
    [form.target_domains],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Abonnés actifs</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot?.overview.activeSubscriptions ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Base active qui peut recevoir les éditions hebdomadaires.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Éditions</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot?.overview.totalIssues ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Brouillons, éditions validées et campagnes envoyées.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">À relire</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot?.overview.draftIssues ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Éditions en draft, review, approved ou scheduled.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Envoyées</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot?.overview.sentIssues ?? 0}</p>
          <p className="mt-2 text-sm text-muted-foreground">Historique des campagnes réellement diffusées.</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-bold text-card-foreground">Édition newsletter hebdomadaire</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                FR d’abord, ciblage par domaine, brouillon IA puis validation humaine avant envoi.
              </p>
            </div>
            <Badge variant="secondary">{selectedDomainsLabel}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <input className={fieldClass} type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
            <select className={fieldClass} value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
            <select className={fieldClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-card-foreground">Domaines ciblés</p>
            <div className="flex flex-wrap gap-3">
              {domainOptions.map((domain) => {
                const isActive = form.target_domains.includes(domain);
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => toggleDomain(domain)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-card-foreground hover:border-primary/40"
                    }`}
                  >
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>

          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre de l’édition" />
          <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Objet email" />
          <Input value={form.preheader} onChange={(e) => setForm({ ...form, preheader: e.target.value })} placeholder="Préheader" />
          <Textarea value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} placeholder="Introduction" />

          <div className="grid gap-4 md:grid-cols-2">
            <Input value={form.highlight_title} onChange={(e) => setForm({ ...form, highlight_title: e.target.value })} placeholder="Signal à retenir · titre" />
            <Input value={form.highlight_url} onChange={(e) => setForm({ ...form, highlight_url: e.target.value })} placeholder="Signal à retenir · URL source" />
          </div>
          <Textarea value={form.highlight_summary} onChange={(e) => setForm({ ...form, highlight_summary: e.target.value })} placeholder="Signal à retenir · résumé" />

          <div className="grid gap-4 md:grid-cols-2">
            <Input value={form.tip_title} onChange={(e) => setForm({ ...form, tip_title: e.target.value })} placeholder="Action à lancer · titre" />
            <Input value={form.tool_name} onChange={(e) => setForm({ ...form, tool_name: e.target.value })} placeholder="Outil à tester · nom" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Textarea value={form.tip_body} onChange={(e) => setForm({ ...form, tip_body: e.target.value })} placeholder="Action à lancer · contenu" />
            <div className="space-y-4">
              <Input value={form.tool_category} onChange={(e) => setForm({ ...form, tool_category: e.target.value })} placeholder="Outil · catégorie" />
              <Textarea value={form.tool_summary} onChange={(e) => setForm({ ...form, tool_summary: e.target.value })} placeholder="Outil · résumé concret" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input value={form.prompt_title} onChange={(e) => setForm({ ...form, prompt_title: e.target.value })} placeholder="Prompt métier · titre" />
            <Input value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="CTA · libellé" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Textarea value={form.prompt_body} onChange={(e) => setForm({ ...form, prompt_body: e.target.value })} placeholder="Prompt métier · contenu" className="min-h-[130px]" />
            <div className="space-y-4">
              <Input value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="CTA · URL" />
              <input className={fieldClass} type="datetime-local" value={form.scheduled_for} onChange={(e) => setForm({ ...form, scheduled_for: e.target.value })} />
            </div>
          </div>

          <Textarea
            value={form.body_markdown}
            onChange={(e) => setForm({ ...form, body_markdown: e.target.value })}
            placeholder="Prochaine étape / conclusion"
            className="min-h-[170px]"
          />
          <Textarea
            value={form.generation_notes}
            onChange={(e) => setForm({ ...form, generation_notes: e.target.value })}
            placeholder="Notes éditoriales / consignes"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generateDraft}
              disabled={!isReady || busy}
              className="rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Générer un brouillon IA
            </button>
            <button
              type="button"
              onClick={saveIssue}
              disabled={!isReady || busy}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground hover:border-primary/40 disabled:opacity-50"
            >
              Enregistrer l’édition
            </button>
            {form.id ? (
              <>
                <button
                  type="button"
                  onClick={() => setIssueStatus(form.id, "approved")}
                  disabled={!isReady || busy}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground hover:border-primary/40 disabled:opacity-50"
                >
                  Marquer approuvée
                </button>
                <button
                  type="button"
                  onClick={() => setIssueStatus(form.id, "scheduled", form.scheduled_for)}
                  disabled={!isReady || busy}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground hover:border-primary/40 disabled:opacity-50"
                >
                  Planifier
                </button>
              </>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm font-semibold text-card-foreground">Envoyer un test</p>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
              <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="email@test.com" />
              <button
                type="button"
                onClick={sendTest}
                disabled={!form.id || busy}
                className="rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                Envoyer le test
              </button>
            </div>
          </div>
        </div>

        <NewsletterPreview form={form} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-xl font-bold text-card-foreground">Éditions récentes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Chargez une édition, ajustez-la, approuvez-la puis lancez un test ou la campagne finale.
          </p>
          <div className="mt-4 space-y-3">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-card-foreground">{issue.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {issue.issue_date} · {issue.language.toUpperCase()} · {issue.target_domains.join(", ") || "Tous domaines"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {issue.recipient_count} destinataires · {issue.send_count} envoi(x)
                    </p>
                  </div>
                  <Badge variant="secondary">{issue.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button type="button" onClick={() => applyIssueToForm(issue)} className="text-xs font-semibold text-primary">
                    Charger
                  </button>
                  <button type="button" onClick={() => setIssueStatus(issue.id, "review")} className="text-xs font-semibold text-muted-foreground">
                    Revue
                  </button>
                  <button type="button" onClick={() => setIssueStatus(issue.id, "approved")} className="text-xs font-semibold text-primary">
                    Approuver
                  </button>
                  <button type="button" onClick={() => sendCampaign(issue.id)} className="text-xs font-semibold text-primary">
                    Envoyer
                  </button>
                  <button type="button" onClick={() => setIssueStatus(issue.id, "archived")} className="text-xs font-semibold text-destructive">
                    Archiver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-xl font-bold text-card-foreground">Dernières diffusions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Journal des tests et campagnes pour vérifier que la chaîne hebdomadaire reste propre.
          </p>
          <div className="mt-4 space-y-3">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{delivery.recipient_email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {delivery.delivery_type} · {delivery.provider} · {new Date(delivery.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{delivery.status}</Badge>
                </div>
                {delivery.error_message ? (
                  <p className="mt-3 text-xs text-destructive">{delivery.error_message}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterAdminPanel;
