import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { invokeContentAdmin } from "@/lib/content-admin";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

type ResourceAdminItem = {
  id: string;
  title_fr: string;
  status: string;
  category_key: string;
  published_at: string;
};

type JobAdminItem = {
  id: string;
  title: string;
  status: string;
  market_key: string;
  published_at: string;
};

const ADMIN_TOKEN_STORAGE_KEY = "transferai-admin-token";

const emptyResourceForm = {
  slug: "",
  category_key: "veille",
  sector_key: "",
  title_fr: "",
  title_en: "",
  excerpt_fr: "",
  excerpt_en: "",
  read_time_minutes: "5",
  published_at: new Date().toISOString().slice(0, 16),
  source_name: "",
  source_url: "",
  tags: "",
  status: "published",
  is_featured: false,
  is_new_manual: true,
};

const emptyJobForm = {
  slug: "",
  title: "",
  summary_fr: "",
  summary_en: "",
  market_key: "cote-divoire",
  source_name: "",
  source_url: "",
  apply_url: "",
  location_fr: "Abidjan, Côte d'Ivoire",
  location_en: "Abidjan, Côte d'Ivoire",
  work_mode: "remote",
  opportunity_type: "job",
  compensation_label: "",
  published_at: new Date().toISOString().slice(0, 16),
  status: "published",
  is_featured: false,
  is_new_manual: true,
};

const fieldClass = "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const BackOfficePage = () => {
  const [token, setToken] = useState("");
  const [resourceForm, setResourceForm] = useState(emptyResourceForm);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [resources, setResources] = useState<ResourceAdminItem[]>([]);
  const [jobs, setJobs] = useState<JobAdminItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? "";
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const isReady = useMemo(() => token.trim().length > 0 && isSupabaseConfigured, [token]);

  const loadData = async (adminToken: string) => {
    const [resourceResult, jobResult] = await Promise.all([
      invokeContentAdmin<{ data: ResourceAdminItem[] }>(adminToken, { entity: "resource", action: "list" }),
      invokeContentAdmin<{ data: JobAdminItem[] }>(adminToken, { entity: "job", action: "list" }),
    ]);

    setResources(resourceResult.data ?? []);
    setJobs(jobResult.data ?? []);
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);

    loadData(token)
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : "Impossible de charger les données admin.");
      })
      .finally(() => setIsBusy(false));
  }, [isReady, token]);

  const persistToken = () => {
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token.trim());
    setStatusMessage("Token admin enregistré localement sur ce navigateur.");
    setErrorMessage(null);
  };

  const submitResource = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await invokeContentAdmin(token, {
        entity: "resource",
        action: "create",
        payload: {
          ...resourceForm,
          read_time_minutes: Number(resourceForm.read_time_minutes),
          published_at: new Date(resourceForm.published_at).toISOString(),
          tags: resourceForm.tags.split(",").map((item) => item.trim()).filter(Boolean),
        },
      });

      setResourceForm(emptyResourceForm);
      await loadData(token);
      setStatusMessage("Contenu publié avec succès.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Publication du contenu impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const submitJob = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await invokeContentAdmin(token, {
        entity: "job",
        action: "create",
        payload: {
          ...jobForm,
          published_at: new Date(jobForm.published_at).toISOString(),
        },
      });

      setJobForm(emptyJobForm);
      await loadData(token);
      setStatusMessage("Opportunité publiée avec succès.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Publication de l'opportunité impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const setResourceStatus = async (id: string, status: string) => {
    setIsBusy(true);
    try {
      await invokeContentAdmin(token, { entity: "resource", action: "set-status", payload: { id, status } });
      await loadData(token);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Mise à jour impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const setJobStatus = async (id: string, status: string) => {
    setIsBusy(true);
    try {
      await invokeContentAdmin(token, { entity: "job", action: "set-status", payload: { id, status } });
      await loadData(token);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Mise à jour impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader
          title="Back-office contenus & emplois"
          subtitle="Publier des ressources, alimenter les opportunités IA et piloter le flux dynamique du site."
        />

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="rounded-2xl border border-border bg-card p-6 mb-8">
              <h2 className="font-heading text-xl font-bold text-card-foreground mb-4">Accès admin</h2>
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <Input
                  type="password"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="Token admin Supabase"
                />
                <button
                  type="button"
                  onClick={persistToken}
                  className="rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Enregistrer le token
                </button>
              </div>
              {!isSupabaseConfigured ? (
                <p className="mt-3 text-sm text-destructive">Supabase n'est pas configuré localement.</p>
              ) : null}
              {statusMessage ? <p className="mt-3 text-sm text-primary">{statusMessage}</p> : null}
              {errorMessage ? <p className="mt-3 text-sm text-destructive">{errorMessage}</p> : null}
            </div>

            <Tabs defaultValue="resources" className="w-full">
              <TabsList className="mb-8 h-auto flex-wrap">
                <TabsTrigger value="resources">Ressources</TabsTrigger>
                <TabsTrigger value="jobs">Emplois IA</TabsTrigger>
                <TabsTrigger value="help">Mode d'emploi</TabsTrigger>
              </TabsList>

              <TabsContent value="resources">
                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <h2 className="font-heading text-xl font-bold text-card-foreground">Publier une ressource</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <input className={fieldClass} value={resourceForm.slug} onChange={(e) => setResourceForm({ ...resourceForm, slug: e.target.value })} placeholder="slug" />
                      <select className={fieldClass} value={resourceForm.category_key} onChange={(e) => setResourceForm({ ...resourceForm, category_key: e.target.value })}>
                        <option value="veille">Veille</option>
                        <option value="guides">Guides</option>
                        <option value="expertise-ai">Expertise & IA</option>
                        <option value="case-studies">Études de cas</option>
                      </select>
                      <input className={fieldClass} value={resourceForm.sector_key} onChange={(e) => setResourceForm({ ...resourceForm, sector_key: e.target.value })} placeholder="Secteur / domaine" />
                      <input className={fieldClass} type="datetime-local" value={resourceForm.published_at} onChange={(e) => setResourceForm({ ...resourceForm, published_at: e.target.value })} />
                    </div>
                    <Input value={resourceForm.title_fr} onChange={(e) => setResourceForm({ ...resourceForm, title_fr: e.target.value })} placeholder="Titre FR" />
                    <Input value={resourceForm.title_en} onChange={(e) => setResourceForm({ ...resourceForm, title_en: e.target.value })} placeholder="Titre EN" />
                    <Textarea value={resourceForm.excerpt_fr} onChange={(e) => setResourceForm({ ...resourceForm, excerpt_fr: e.target.value })} placeholder="Résumé FR" />
                    <Textarea value={resourceForm.excerpt_en} onChange={(e) => setResourceForm({ ...resourceForm, excerpt_en: e.target.value })} placeholder="Résumé EN" />
                    <div className="grid gap-4 md:grid-cols-2">
                      <input className={fieldClass} value={resourceForm.source_name} onChange={(e) => setResourceForm({ ...resourceForm, source_name: e.target.value })} placeholder="Source" />
                      <input className={fieldClass} value={resourceForm.source_url} onChange={(e) => setResourceForm({ ...resourceForm, source_url: e.target.value })} placeholder="URL source" />
                      <input className={fieldClass} value={resourceForm.tags} onChange={(e) => setResourceForm({ ...resourceForm, tags: e.target.value })} placeholder="Tags séparés par des virgules" />
                      <input className={fieldClass} type="number" min="1" value={resourceForm.read_time_minutes} onChange={(e) => setResourceForm({ ...resourceForm, read_time_minutes: e.target.value })} placeholder="Temps de lecture" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <select className={fieldClass} value={resourceForm.status} onChange={(e) => setResourceForm({ ...resourceForm, status: e.target.value })}>
                        <option value="published">Publié</option>
                        <option value="draft">Brouillon</option>
                        <option value="archived">Archivé</option>
                      </select>
                      <label className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm text-card-foreground">
                        Mis en avant
                        <Switch checked={resourceForm.is_featured} onCheckedChange={(checked) => setResourceForm({ ...resourceForm, is_featured: checked })} />
                      </label>
                      <label className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm text-card-foreground">
                        Nouveau
                        <Switch checked={resourceForm.is_new_manual} onCheckedChange={(checked) => setResourceForm({ ...resourceForm, is_new_manual: checked })} />
                      </label>
                    </div>
                    <button type="button" onClick={submitResource} disabled={!isReady || isBusy} className="rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                      Publier la ressource
                    </button>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-xl font-bold text-card-foreground mb-4">Dernières ressources</h2>
                    <div className="space-y-3">
                      {resources.map((resource) => (
                        <div key={resource.id} className="rounded-xl border border-border p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-card-foreground">{resource.title_fr}</p>
                              <p className="text-xs text-muted-foreground">{resource.category_key} · {new Date(resource.published_at).toLocaleString()}</p>
                            </div>
                            <Badge variant="secondary">{resource.status}</Badge>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => setResourceStatus(resource.id, "published")} className="text-xs font-semibold text-primary">Publier</button>
                            <button type="button" onClick={() => setResourceStatus(resource.id, "draft")} className="text-xs font-semibold text-muted-foreground">Brouillon</button>
                            <button type="button" onClick={() => setResourceStatus(resource.id, "archived")} className="text-xs font-semibold text-destructive">Archiver</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="jobs">
                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <h2 className="font-heading text-xl font-bold text-card-foreground">Publier une opportunité</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <input className={fieldClass} value={jobForm.slug} onChange={(e) => setJobForm({ ...jobForm, slug: e.target.value })} placeholder="slug" />
                      <input className={fieldClass} type="datetime-local" value={jobForm.published_at} onChange={(e) => setJobForm({ ...jobForm, published_at: e.target.value })} />
                    </div>
                    <Input value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="Titre de l'opportunité" />
                    <Textarea value={jobForm.summary_fr} onChange={(e) => setJobForm({ ...jobForm, summary_fr: e.target.value })} placeholder="Résumé FR" />
                    <Textarea value={jobForm.summary_en} onChange={(e) => setJobForm({ ...jobForm, summary_en: e.target.value })} placeholder="Résumé EN" />
                    <div className="grid gap-4 md:grid-cols-2">
                      <select className={fieldClass} value={jobForm.market_key} onChange={(e) => setJobForm({ ...jobForm, market_key: e.target.value })}>
                        <option value="cote-divoire">Côte d'Ivoire</option>
                        <option value="africa">Afrique</option>
                        <option value="international">International</option>
                      </select>
                      <select className={fieldClass} value={jobForm.opportunity_type} onChange={(e) => setJobForm({ ...jobForm, opportunity_type: e.target.value })}>
                        <option value="job">Emploi</option>
                        <option value="freelance">Freelance</option>
                        <option value="mission">Mission</option>
                        <option value="internship">Stage</option>
                      </select>
                      <select className={fieldClass} value={jobForm.work_mode} onChange={(e) => setJobForm({ ...jobForm, work_mode: e.target.value })}>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybride</option>
                        <option value="onsite">Présentiel</option>
                      </select>
                      <select className={fieldClass} value={jobForm.status} onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}>
                        <option value="published">Publié</option>
                        <option value="draft">Brouillon</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input value={jobForm.source_name} onChange={(e) => setJobForm({ ...jobForm, source_name: e.target.value })} placeholder="Plateforme / source" />
                      <Input value={jobForm.compensation_label} onChange={(e) => setJobForm({ ...jobForm, compensation_label: e.target.value })} placeholder="Rémunération (optionnel)" />
                      <Input value={jobForm.source_url} onChange={(e) => setJobForm({ ...jobForm, source_url: e.target.value })} placeholder="URL source" />
                      <Input value={jobForm.apply_url} onChange={(e) => setJobForm({ ...jobForm, apply_url: e.target.value })} placeholder="URL candidature" />
                      <Input value={jobForm.location_fr} onChange={(e) => setJobForm({ ...jobForm, location_fr: e.target.value })} placeholder="Localisation FR" />
                      <Input value={jobForm.location_en} onChange={(e) => setJobForm({ ...jobForm, location_en: e.target.value })} placeholder="Localisation EN" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm text-card-foreground">
                        Mis en avant
                        <Switch checked={jobForm.is_featured} onCheckedChange={(checked) => setJobForm({ ...jobForm, is_featured: checked })} />
                      </label>
                      <label className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm text-card-foreground">
                        Nouveau
                        <Switch checked={jobForm.is_new_manual} onCheckedChange={(checked) => setJobForm({ ...jobForm, is_new_manual: checked })} />
                      </label>
                    </div>
                    <button type="button" onClick={submitJob} disabled={!isReady || isBusy} className="rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                      Publier l'opportunité
                    </button>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-xl font-bold text-card-foreground mb-4">Dernières opportunités</h2>
                    <div className="space-y-3">
                      {jobs.map((job) => (
                        <div key={job.id} className="rounded-xl border border-border p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-card-foreground">{job.title}</p>
                              <p className="text-xs text-muted-foreground">{job.market_key} · {new Date(job.published_at).toLocaleString()}</p>
                            </div>
                            <Badge variant="secondary">{job.status}</Badge>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => setJobStatus(job.id, "published")} className="text-xs font-semibold text-primary">Publier</button>
                            <button type="button" onClick={() => setJobStatus(job.id, "draft")} className="text-xs font-semibold text-muted-foreground">Brouillon</button>
                            <button type="button" onClick={() => setJobStatus(job.id, "archived")} className="text-xs font-semibold text-destructive">Archiver</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="help">
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <h2 className="font-heading text-xl font-bold text-card-foreground">Comment l'utiliser</h2>
                  <p className="text-sm text-muted-foreground">1. Déployer la fonction edge `content-admin` et définir le secret `CONTENT_ADMIN_TOKEN` dans Supabase.</p>
                  <p className="text-sm text-muted-foreground">2. Ouvrir cette page, saisir le token admin puis publier des ressources et opportunités.</p>
                  <p className="text-sm text-muted-foreground">3. Les contenus publiés alimentent automatiquement `Blog & Ressources` et `Créateur de Contenu IA`.</p>
                  <p className="text-sm text-muted-foreground">4. La veille quotidienne peut ensuite utiliser cette même fonction pour injecter les nouveautés et les opportunités qualifiées.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BackOfficePage;
