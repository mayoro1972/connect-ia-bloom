import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { invokeAdminEdgeFunction, invokeContentAdmin } from "@/lib/content-admin";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import PartnerAdminPanel from "@/components/backoffice/PartnerAdminPanel";
import AuditProspectAdminPanel, { type AuditProspectSnapshot } from "@/components/backoffice/AuditProspectAdminPanel";
import WebinarAdminPanel from "@/components/backoffice/WebinarAdminPanel";
import LiveFormatsAdminPanel from "@/components/backoffice/LiveFormatsAdminPanel";
import VendorFeedsAdminPanel from "@/components/backoffice/VendorFeedsAdminPanel";
import VideoCapsuleAdminPanel from "@/components/backoffice/VideoCapsuleAdminPanel";
import WhatsAppMessagesAdminPanel from "@/components/backoffice/WhatsAppMessagesAdminPanel";

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

type AnalyticsRow = {
  label: string;
  count: number;
};

type AnalyticsTrendRow = {
  day: string;
  pageViews: number;
  contacts: number;
  registrations: number;
};

type AnalyticsSnapshot = {
  overview: {
    totalPageViews: number;
    pageViewsLast30Days: number;
    totalContactRequests: number;
    contactRequestsLast30Days: number;
    totalRegistrationRequests: number;
    registrationRequestsLast30Days: number;
  };
  byIntent: AnalyticsRow[];
  topDomains: AnalyticsRow[];
  topFormations: AnalyticsRow[];
  topPages: AnalyticsRow[];
  trend: AnalyticsTrendRow[];
};

type EditorialFeedItem = {
  id: string;
  name: string;
  url: string;
  feed_type: string;
  country_focus: string | null;
  domain_focus: string | null;
  trust_score: number;
  is_active: boolean;
};

type EditorialSignalItem = {
  id: string;
  title: string;
  url: string;
  published_at: string | null;
  status: string;
  domain_detected: string | null;
  content_type_detected: string | null;
  priority_score: number | null;
  source_feed_id: string | null;
  review_notes: string | null;
  created_at: string;
};

type EditorialDraftItem = {
  id: string;
  slug: string;
  title_fr: string;
  sector_key: string | null;
  editorial_status: string;
  status: string;
  published_at: string;
  origin_signal_id: string | null;
  review_notes: string | null;
};

type EditorialJobItem = {
  id: string;
  job_type: string;
  provider: string;
  status: string;
  created_at: string;
  source_signal_id: string | null;
  resource_post_id: string | null;
  error_message: string | null;
};

type EditorialSnapshot = {
  feeds: EditorialFeedItem[];
  signals: EditorialSignalItem[];
  drafts: EditorialDraftItem[];
  jobs: EditorialJobItem[];
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
  content_fr: "",
  content_en: "",
  read_time_minutes: "5",
  published_at: new Date().toISOString().slice(0, 16),
  source_name: "",
  source_url: "",
  sources_json: "",
  seo_title_fr: "",
  seo_title_en: "",
  seo_description_fr: "",
  seo_description_en: "",
  cover_image_url: "",
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

const emptyFeedForm = {
  name: "",
  url: "",
  feed_type: "rss",
  publisher: "",
  country_focus: "Côte d'Ivoire",
  region_focus: "Afrique de l'Ouest",
  domain_focus: "",
  language: "fr",
  trust_score: "70",
  notes: "",
  is_active: true,
};

const emptyManualSignalForm = {
  title: "",
  url: "",
  published_at: new Date().toISOString().slice(0, 16),
  raw_summary: "",
};

const regulatoryFeedPresets = [
  {
    label: "BCEAO",
    values: {
      name: "BCEAO",
      url: "https://www.bceao.int/fr/publications",
      feed_type: "site",
      publisher: "Banque Centrale des États de l'Afrique de l'Ouest",
      country_focus: "Côte d'Ivoire",
      region_focus: "UEMOA",
      domain_focus: "Finance & Fintech",
      language: "fr",
      trust_score: "95",
      notes: "Vérifié le 9 mai 2026 sur le site officiel BCEAO. Page utile pour publications, notes et signaux de gouvernance bancaire.",
      is_active: true,
    },
  },
  {
    label: "UEMOA",
    values: {
      name: "UEMOA",
      url: "https://www.uemoa.int/actualites",
      feed_type: "site",
      publisher: "Union Économique et Monétaire Ouest Africaine",
      country_focus: "Côte d'Ivoire",
      region_focus: "Afrique de l'Ouest",
      domain_focus: "Finance & Fintech",
      language: "fr",
      trust_score: "92",
      notes: "Vérifié le 9 mai 2026 sur le site officiel UEMOA. À suivre pour règlements régionaux, finance numérique et coordination prudentielle.",
      is_active: true,
    },
  },
  {
    label: "ARTCI / Données",
    values: {
      name: "ARTCI / données & numérique",
      url: "https://www.artci.ci/index.php/decisions",
      feed_type: "site",
      publisher: "ARTCI",
      country_focus: "Côte d'Ivoire",
      region_focus: "Afrique de l'Ouest",
      domain_focus: "Droit & LegalTech IA",
      language: "fr",
      trust_score: "90",
      notes: "Vérifié le 9 mai 2026 sur le site officiel ARTCI. Utile pour données personnelles, numérique, cybersécurité et conformité locale.",
      is_active: true,
    },
  },
];

const regulatoryTagGuide = [
  "jurisdiction:cote-divoire",
  "jurisdiction:uemoa-bceao",
  "jurisdiction:international",
  "authority:bceao",
  "authority:uemoa",
  "authority:artci",
  "theme:gouvernance-ia",
  "theme:donnees-personnelles",
  "theme:conformite-bancaire",
  "impact:high",
];

const fieldClass = "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const intentLabels: Record<string, string> = {
  "contact-devis": "Contact / devis",
  "demande-catalogue": "Demande de catalogue",
  "demande-renseignement": "Demande de renseignement",
  "demande-referencement": "Demande de référencement",
};

const formatDateLabel = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });

const BackOfficePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const requestedTab = searchParams.get("tab") ?? "resources";
  const [activeTab, setActiveTab] = useState(requestedTab);
  const [resourceForm, setResourceForm] = useState(emptyResourceForm);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [feedForm, setFeedForm] = useState(emptyFeedForm);
  const [manualSignalForm, setManualSignalForm] = useState(emptyManualSignalForm);
  const [resources, setResources] = useState<ResourceAdminItem[]>([]);
  const [jobs, setJobs] = useState<JobAdminItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [editorial, setEditorial] = useState<EditorialSnapshot | null>(null);
  const [prospects, setProspects] = useState<AuditProspectSnapshot | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? "";
    if (storedToken) {
      setTokenInput(storedToken);
    }
  }, []);

  useEffect(() => {
    setActiveTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    if (requestedTab === "newsletters") {
      navigate("/back-office/newsletters", { replace: true });
    }
  }, [navigate, requestedTab]);

  const isReady = useMemo(() => adminToken.trim().length > 0 && isSupabaseConfigured, [adminToken]);

  const loadData = async (currentToken: string) => {
    const [resourceResult, jobResult, analyticsResult, editorialResult, prospectResult] = await Promise.all([
      invokeContentAdmin<{ data: ResourceAdminItem[] }>(currentToken, { entity: "resource", action: "list" }),
      invokeContentAdmin<{ data: JobAdminItem[] }>(currentToken, { entity: "job", action: "list" }),
      invokeContentAdmin<{ data: AnalyticsSnapshot }>(currentToken, { entity: "analytics", action: "list" }),
      invokeContentAdmin<{ data: EditorialSnapshot }>(currentToken, { entity: "editorial", action: "list" }),
      invokeContentAdmin<{ data: AuditProspectSnapshot }>(currentToken, { entity: "prospects", action: "list" }),
    ]);

    setResources(resourceResult.data ?? []);
    setJobs(jobResult.data ?? []);
    setAnalytics(analyticsResult.data ?? null);
    setEditorial(editorialResult.data ?? null);
    setProspects(prospectResult.data ?? null);
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);

    loadData(adminToken)
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : "Impossible de charger les données admin.");
      })
      .finally(() => setIsBusy(false));
  }, [isReady, adminToken]);

  const clearToken = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setTokenInput("");
    setAdminToken("");
    setStatusMessage("Token admin retiré de ce navigateur.");
    setErrorMessage(null);
  };

  const persistToken = async () => {
    const nextToken = tokenInput.trim();

    if (!nextToken) {
      setErrorMessage("Saisissez d'abord un token admin.");
      return;
    }

    setIsBusy(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await loadData(nextToken);
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, nextToken);
      setAdminToken(nextToken);
      setStatusMessage("Token admin validé et enregistré localement sur ce navigateur.");
    } catch (error) {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      setAdminToken("");
      setErrorMessage(
        error instanceof Error && /unauthorized/i.test(error.message)
          ? "Token admin invalide. Vérifiez la valeur saisie."
          : error instanceof Error
            ? error.message
            : "Validation du token impossible.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const submitResource = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await invokeContentAdmin(adminToken, {
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
      await loadData(adminToken);
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
      await invokeContentAdmin(adminToken, {
        entity: "job",
        action: "create",
        payload: {
          ...jobForm,
          published_at: new Date(jobForm.published_at).toISOString(),
        },
      });

      setJobForm(emptyJobForm);
      await loadData(adminToken);
      setStatusMessage("Opportunité publiée avec succès.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Publication de l'opportunité impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const submitFeed = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await invokeContentAdmin(adminToken, {
        entity: "editorial",
        action: "create-feed",
        payload: {
          ...feedForm,
          trust_score: Number(feedForm.trust_score),
        },
      });

      setFeedForm(emptyFeedForm);
      await loadData(adminToken);
      setStatusMessage("Source de veille enregistrée avec succès.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Création du flux impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const submitManualSignal = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await invokeAdminEdgeFunction(adminToken, "content-discovery", {
        manual_signals: [
          {
            title: manualSignalForm.title,
            url: manualSignalForm.url,
            published_at: new Date(manualSignalForm.published_at).toISOString(),
            raw_summary: manualSignalForm.raw_summary,
          },
        ],
      });

      setManualSignalForm(emptyManualSignalForm);
      await loadData(adminToken);
      setStatusMessage("Signal réglementaire ajouté à la file de veille.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Ajout du signal impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const runEditorialStep = async (
    functionName: "content-discovery" | "content-classifier" | "content-drafter",
    successMessage: string,
  ) => {
    setIsBusy(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await invokeAdminEdgeFunction(adminToken, functionName, { limit: 10 });
      await loadData(adminToken);
      setStatusMessage(successMessage);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Exécution du pipeline impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const applyFeedPreset = (preset: (typeof regulatoryFeedPresets)[number]["values"]) => {
    setFeedForm(preset);
    setStatusMessage("Source réglementaire préremplie. Vérifiez l'URL réelle du flux avant enregistrement.");
    setErrorMessage(null);
  };

  const addTagToResourceForm = (tag: string) => {
    const existingTags = resourceForm.tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (existingTags.includes(tag)) {
      return;
    }

    setResourceForm({
      ...resourceForm,
      tags: [...existingTags, tag].join(", "),
    });
  };

  const setResourceStatus = async (id: string, status: string) => {
    setIsBusy(true);
    try {
      await invokeContentAdmin(adminToken, { entity: "resource", action: "set-status", payload: { id, status } });
      await loadData(adminToken);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Mise à jour impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const setJobStatus = async (id: string, status: string) => {
    setIsBusy(true);
    try {
      await invokeContentAdmin(adminToken, { entity: "job", action: "set-status", payload: { id, status } });
      await loadData(adminToken);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Mise à jour impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const setEditorialSignalStatus = async (id: string, status: string) => {
    setIsBusy(true);
    try {
      await invokeContentAdmin(adminToken, {
        entity: "editorial",
        action: "set-status",
        payload: { kind: "signal", id, status },
      });
      await loadData(adminToken);
      setStatusMessage("Signal éditorial mis à jour.");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Mise à jour du signal impossible.");
    } finally {
      setIsBusy(false);
    }
  };

  const setEditorialDraftStatus = async (
    id: string,
    status: "review" | "approved" | "published" | "archived",
    originSignalId?: string | null,
  ) => {
    setIsBusy(true);
    try {
      await invokeContentAdmin(adminToken, {
        entity: "editorial",
        action: "set-status",
        payload: {
          kind: "draft",
          id,
          status,
          origin_signal_id: originSignalId ?? null,
        },
      });
      await loadData(adminToken);
      setStatusMessage("Brouillon IA mis à jour.");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Mise à jour du brouillon impossible.");
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

        {!isReady ? (
          <section className="py-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-md">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                <h2 className="font-heading text-2xl font-bold text-card-foreground mb-2">
                  Accès restreint
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Cette zone est réservée à l'administration de TransferAI. Saisissez votre token admin pour continuer.
                </p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void persistToken();
                  }}
                  className="space-y-4"
                >
                  <Input
                    type="text"
                    value={tokenInput}
                    onChange={(event) => setTokenInput(event.target.value)}
                    placeholder="Token admin"
                    autoFocus
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={!tokenInput.trim() || !isSupabaseConfigured || isBusy}
                    className="w-full rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {isBusy ? "Vérification..." : "Se connecter"}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={clearToken}
                  className="mt-3 w-full rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Effacer le token enregistré
                </button>
                {!isSupabaseConfigured ? (
                  <p className="mt-4 text-sm text-destructive">
                    Supabase n'est pas configuré localement.
                  </p>
                ) : null}
                {errorMessage ? (
                  <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
                ) : null}
                <p className="mt-6 text-xs text-muted-foreground">
                  Le token est vérifié côté serveur. Toute tentative invalide est rejetée.
                </p>
              </div>
            </div>
          </section>
        ) : (
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="rounded-2xl border border-border bg-card p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-card-foreground">Session admin active</h2>
                <p className="text-xs text-muted-foreground">Token vérifié — toutes les actions sont tracées côté serveur.</p>
              </div>
              <button
                type="button"
                onClick={clearToken}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted"
              >
                Changer de token
              </button>
            </div>
            {statusMessage ? <p className="mb-4 text-sm text-primary">{statusMessage}</p> : null}
            {errorMessage ? <p className="mb-4 text-sm text-destructive">{errorMessage}</p> : null}

            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Link
                to="/back-office/newsletters"
                className="rounded-2xl border border-primary/20 bg-primary/5 p-5 transition hover:border-primary/40 hover:bg-primary/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Accès direct</p>
                <h2 className="mt-2 font-heading text-lg font-bold text-card-foreground">Newsletter IA</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ouvrir la page dédiée pour rédiger, tester et envoyer la newsletter sans passer par les tabs.
                </p>
              </Link>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Contenus</p>
                <h2 className="mt-2 font-heading text-lg font-bold text-card-foreground">Ressources & veille</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Publier les ressources et suivre les signaux éditoriaux depuis le back-office principal.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Prospects</p>
                <h2 className="mt-2 font-heading text-lg font-bold text-card-foreground">Suivi des demandes</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Garder les demandes et conversions à portée de main dans le même espace admin.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Opérations</p>
                <h2 className="mt-2 font-heading text-lg font-bold text-card-foreground">Pilotage global</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Centraliser les autres actions admin sans mélanger la gestion newsletter.
                </p>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(nextValue) => {
                setActiveTab(nextValue);
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set("tab", nextValue);
                setSearchParams(nextParams, { replace: true });
              }}
              className="w-full"
            >
              <TabsList className="mb-8 h-auto flex-wrap">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="prospects">Prospects Audit</TabsTrigger>
                <TabsTrigger value="resources">Ressources</TabsTrigger>
                <TabsTrigger value="editorial">Brouillons IA</TabsTrigger>
                <TabsTrigger value="partners">Partenaires IA</TabsTrigger>
                <TabsTrigger value="videos">Capsules vidéo</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="jobs">Emplois IA</TabsTrigger>
                <TabsTrigger value="webinars">Webinaires</TabsTrigger>
                <TabsTrigger value="live-formats">Formats live IA</TabsTrigger>
                <TabsTrigger value="help">Mode d'emploi</TabsTrigger>
              </TabsList>

              <TabsContent value="analytics">
                <div className="space-y-8">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Trafic global</p>
                      <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">
                        {analytics?.overview.totalPageViews ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {analytics?.overview.pageViewsLast30Days ?? 0} vues sur les 30 derniers jours.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Leads contact</p>
                      <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">
                        {analytics?.overview.totalContactRequests ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {analytics?.overview.contactRequestsLast30Days ?? 0} demandes sur les 30 derniers jours.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Inscriptions</p>
                      <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">
                        {analytics?.overview.totalRegistrationRequests ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {analytics?.overview.registrationRequestsLast30Days ?? 0} demandes sur les 30 derniers jours.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Tendance 7 jours</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Vue rapide du trafic et des conversions pour suivre l'effet des changements de contenu.
                      </p>
                      <div className="mt-6 space-y-4">
                        {(analytics?.trend ?? []).map((entry) => {
                          const maxValue = Math.max(
                            ...((analytics?.trend ?? []).flatMap((item) => [item.pageViews, item.contacts, item.registrations])),
                            1,
                          );

                          return (
                            <div key={entry.day} className="rounded-xl border border-border bg-background/70 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-card-foreground">{formatDateLabel(entry.day)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {entry.pageViews} vues · {entry.contacts} leads · {entry.registrations} inscriptions
                                </p>
                              </div>
                              <div className="mt-3 space-y-2">
                                {[
                                  { label: "Vues", value: entry.pageViews, tone: "bg-primary/80" },
                                  { label: "Leads", value: entry.contacts, tone: "bg-orange-400/90" },
                                  { label: "Inscriptions", value: entry.registrations, tone: "bg-emerald-500/90" },
                                ].map((bar) => (
                                  <div key={bar.label} className="grid grid-cols-[88px_1fr_36px] items-center gap-3 text-xs">
                                    <span className="font-medium text-muted-foreground">{bar.label}</span>
                                    <div className="h-2 rounded-full bg-muted">
                                      <div
                                        className={`h-2 rounded-full ${bar.tone}`}
                                        style={{ width: `${Math.max((bar.value / maxValue) * 100, bar.value > 0 ? 8 : 0)}%` }}
                                      />
                                    </div>
                                    <span className="text-right font-semibold text-card-foreground">{bar.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-heading text-xl font-bold text-card-foreground">Intentions les plus fréquentes</h2>
                        <div className="mt-4 space-y-3">
                          {(analytics?.byIntent ?? []).map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
                              <span className="text-card-foreground">{intentLabels[item.label] ?? item.label}</span>
                              <Badge variant="secondary">{item.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-heading text-xl font-bold text-card-foreground">Top domaines demandés</h2>
                        <div className="mt-4 space-y-3">
                          {(analytics?.topDomains ?? []).map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
                              <span className="text-card-foreground">{item.label}</span>
                              <Badge variant="secondary">{item.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8 xl:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Formations les plus demandées</h2>
                      <div className="mt-4 space-y-3">
                        {(analytics?.topFormations ?? []).map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
                            <span className="text-card-foreground">{item.label}</span>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Pages les plus vues</h2>
                      <div className="mt-4 space-y-3">
                        {(analytics?.topPages ?? []).map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
                            <span className="text-card-foreground">{item.label}</span>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="prospects">
                <AuditProspectAdminPanel snapshot={prospects} />
              </TabsContent>

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
                    <Textarea value={resourceForm.content_fr} onChange={(e) => setResourceForm({ ...resourceForm, content_fr: e.target.value })} placeholder="Contenu complet FR" className="min-h-[180px]" />
                    <Textarea value={resourceForm.content_en} onChange={(e) => setResourceForm({ ...resourceForm, content_en: e.target.value })} placeholder="Contenu complet EN" className="min-h-[180px]" />
                    <div className="grid gap-4 md:grid-cols-2">
                      <input className={fieldClass} value={resourceForm.source_name} onChange={(e) => setResourceForm({ ...resourceForm, source_name: e.target.value })} placeholder="Source" />
                      <input className={fieldClass} value={resourceForm.source_url} onChange={(e) => setResourceForm({ ...resourceForm, source_url: e.target.value })} placeholder="URL source" />
                      <input className={fieldClass} value={resourceForm.tags} onChange={(e) => setResourceForm({ ...resourceForm, tags: e.target.value })} placeholder="Tags séparés par des virgules" />
                      <input className={fieldClass} type="number" min="1" value={resourceForm.read_time_minutes} onChange={(e) => setResourceForm({ ...resourceForm, read_time_minutes: e.target.value })} placeholder="Temps de lecture" />
                    </div>
                    <div className="rounded-2xl border border-border bg-background/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Tags métier rapides</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cliquez pour injecter les tags banque/régulation directement dans le champ tags.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {regulatoryTagGuide.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => addTagToResourceForm(tag)}
                            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-card-foreground transition hover:border-primary/40 hover:text-primary"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      value={resourceForm.sources_json}
                      onChange={(e) => setResourceForm({ ...resourceForm, sources_json: e.target.value })}
                      placeholder='Sources JSON [{"label":"OpenAI","url":"https://..."}]'
                      className="min-h-[120px] font-mono text-xs"
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input value={resourceForm.seo_title_fr} onChange={(e) => setResourceForm({ ...resourceForm, seo_title_fr: e.target.value })} placeholder="SEO title FR" />
                      <Input value={resourceForm.seo_title_en} onChange={(e) => setResourceForm({ ...resourceForm, seo_title_en: e.target.value })} placeholder="SEO title EN" />
                      <Textarea value={resourceForm.seo_description_fr} onChange={(e) => setResourceForm({ ...resourceForm, seo_description_fr: e.target.value })} placeholder="SEO description FR" />
                      <Textarea value={resourceForm.seo_description_en} onChange={(e) => setResourceForm({ ...resourceForm, seo_description_en: e.target.value })} placeholder="SEO description EN" />
                      <Input value={resourceForm.cover_image_url} onChange={(e) => setResourceForm({ ...resourceForm, cover_image_url: e.target.value })} placeholder="Cover image URL" />
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

              <TabsContent value="editorial">
                <div className="space-y-8">
                  <VendorFeedsAdminPanel token={adminToken} />
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Flux suivis</p>
                      <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">
                        {editorial?.feeds.length ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">Sources actives pour nourrir la veille automatique.</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Signaux détectés</p>
                      <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">
                        {editorial?.signals.length ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">Signaux à scorer, rejeter ou convertir en brouillon.</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Brouillons IA</p>
                      <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">
                        {editorial?.drafts.length ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">Articles FR à relire avant validation ou publication.</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Jobs pipeline</p>
                      <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">
                        {editorial?.jobs.length ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">Traçabilité des étapes découverte, scoring et rédaction.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-heading text-xl font-bold text-card-foreground">Accélérateurs banque & régulation</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Préremplissez les sources prioritaires et imposez une taxonomie simple pour garder une veille propre et exploitable.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {regulatoryFeedPresets.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => applyFeedPreset(preset.values)}
                            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:border-primary/40 hover:text-primary"
                          >
                            Préremplir {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-2xl border border-border bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Taxonomie conseillée</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Glissez ces tags dans les contenus publiés ou dans vos notes éditoriales pour standardiser le classement.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {regulatoryTagGuide.map((tag) => (
                            <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Routine d'exploitation</p>
                        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                          <p>1. Ajouter le signal dès réception.</p>
                          <p>2. Classer et générer un brouillon FR.</p>
                          <p>3. Publier avec juridiction, autorité et impact.</p>
                          <p>4. Utiliser la page publique comme feed de direction ou de conformité.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8 xl:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Ajouter une source de veille</h2>
                      <p className="text-sm text-muted-foreground">
                        Renseignez les flux prioritaires Côte d'Ivoire / Afrique pour nourrir le pipeline de découverte automatique.
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input value={feedForm.name} onChange={(e) => setFeedForm({ ...feedForm, name: e.target.value })} placeholder="Nom de la source" />
                        <Input value={feedForm.publisher} onChange={(e) => setFeedForm({ ...feedForm, publisher: e.target.value })} placeholder="Publisher (optionnel)" />
                        <Input className="md:col-span-2" value={feedForm.url} onChange={(e) => setFeedForm({ ...feedForm, url: e.target.value })} placeholder="URL RSS / site / API" />
                        <select className={fieldClass} value={feedForm.feed_type} onChange={(e) => setFeedForm({ ...feedForm, feed_type: e.target.value })}>
                          <option value="rss">RSS</option>
                          <option value="site">Site</option>
                          <option value="api">API</option>
                          <option value="institution">Institution</option>
                          <option value="manual">Manuel</option>
                        </select>
                        <select className={fieldClass} value={feedForm.language} onChange={(e) => setFeedForm({ ...feedForm, language: e.target.value })}>
                          <option value="fr">FR</option>
                          <option value="en">EN</option>
                        </select>
                        <Input value={feedForm.country_focus} onChange={(e) => setFeedForm({ ...feedForm, country_focus: e.target.value })} placeholder="Focus pays" />
                        <Input value={feedForm.region_focus} onChange={(e) => setFeedForm({ ...feedForm, region_focus: e.target.value })} placeholder="Focus région" />
                        <Input value={feedForm.domain_focus} onChange={(e) => setFeedForm({ ...feedForm, domain_focus: e.target.value })} placeholder="Domaine prioritaire" />
                        <Input type="number" min="0" max="100" value={feedForm.trust_score} onChange={(e) => setFeedForm({ ...feedForm, trust_score: e.target.value })} placeholder="Trust score" />
                      </div>
                      <Textarea value={feedForm.notes} onChange={(e) => setFeedForm({ ...feedForm, notes: e.target.value })} placeholder="Notes éditoriales (facultatif)" />
                      <label className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm text-card-foreground">
                        Source active
                        <Switch checked={feedForm.is_active} onCheckedChange={(checked) => setFeedForm({ ...feedForm, is_active: checked })} />
                      </label>
                      <button type="button" onClick={submitFeed} disabled={!isReady || isBusy} className="rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                        Enregistrer la source
                      </button>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Injecter un signal réglementaire</h2>
                      <p className="text-sm text-muted-foreground">
                        Collez ici une nouvelle note BCEAO, un texte de conformité, une annonce régulateur ou un article sectoriel dès sa sortie.
                      </p>
                      <Input
                        value={manualSignalForm.title}
                        onChange={(e) => setManualSignalForm({ ...manualSignalForm, title: e.target.value })}
                        placeholder="Titre du signal"
                      />
                      <Input
                        value={manualSignalForm.url}
                        onChange={(e) => setManualSignalForm({ ...manualSignalForm, url: e.target.value })}
                        placeholder="URL source"
                      />
                      <Input
                        type="datetime-local"
                        value={manualSignalForm.published_at}
                        onChange={(e) => setManualSignalForm({ ...manualSignalForm, published_at: e.target.value })}
                      />
                      <Textarea
                        value={manualSignalForm.raw_summary}
                        onChange={(e) => setManualSignalForm({ ...manualSignalForm, raw_summary: e.target.value })}
                        placeholder="Résumé ou extrait important"
                      />
                      <button
                        type="button"
                        onClick={submitManualSignal}
                        disabled={!isReady || isBusy || !manualSignalForm.title.trim() || !manualSignalForm.url.trim()}
                        className="rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                      >
                        Ajouter à la file
                      </button>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Piloter le pipeline</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Exécutez les étapes dans l'ordre pour transformer les signaux entrants en brouillons puis en notes publiées.
                      </p>
                      <div className="mt-4 space-y-3">
                        <button
                          type="button"
                          onClick={() => runEditorialStep("content-discovery", "Collecte automatique relancée.")}
                          disabled={!isReady || isBusy}
                          className="w-full rounded-lg border border-border px-4 py-3 text-left text-sm font-semibold text-card-foreground hover:bg-muted disabled:opacity-50"
                        >
                          1. Lancer la collecte des sources
                        </button>
                        <button
                          type="button"
                          onClick={() => runEditorialStep("content-classifier", "Classification des nouveaux signaux terminée.")}
                          disabled={!isReady || isBusy}
                          className="w-full rounded-lg border border-border px-4 py-3 text-left text-sm font-semibold text-card-foreground hover:bg-muted disabled:opacity-50"
                        >
                          2. Classer les nouveaux signaux
                        </button>
                        <button
                          type="button"
                          onClick={() => runEditorialStep("content-drafter", "Brouillons réglementaires générés.")}
                          disabled={!isReady || isBusy}
                          className="w-full rounded-lg border border-border px-4 py-3 text-left text-sm font-semibold text-card-foreground hover:bg-muted disabled:opacity-50"
                        >
                          3. Générer les brouillons FR
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Sources suivies</h2>
                      <div className="mt-4 space-y-3">
                        {(editorial?.feeds ?? []).map((feed) => (
                          <div key={feed.id} className="rounded-xl border border-border p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-medium text-card-foreground">{feed.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {feed.feed_type} · {feed.domain_focus || "Tous domaines"} · {feed.country_focus || "Afrique"}
                                </p>
                              </div>
                              <Badge variant={feed.is_active ? "default" : "secondary"}>
                                {feed.is_active ? `Actif · ${feed.trust_score}` : "Inactif"}
                              </Badge>
                            </div>
                            <p className="mt-3 truncate text-xs text-muted-foreground">{feed.url}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8 xl:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Signaux détectés</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Une fois classés par les fonctions IA, ces signaux servent de base aux brouillons FR du blog.
                      </p>
                      <div className="mt-4 space-y-3">
                        {(editorial?.signals ?? []).map((signal) => (
                          <div key={signal.id} className="rounded-xl border border-border p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-card-foreground">{signal.title}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {(signal.domain_detected || "À classer")} · {(signal.content_type_detected || "veille")} · {signal.priority_score ?? "—"} / 100
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {signal.published_at ? new Date(signal.published_at).toLocaleString() : new Date(signal.created_at).toLocaleString()}
                                </p>
                              </div>
                              <Badge variant="secondary">{signal.status}</Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3">
                              <a href={signal.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary">
                                Ouvrir la source
                              </a>
                              <button type="button" onClick={() => setEditorialSignalStatus(signal.id, "new")} className="text-xs font-semibold text-muted-foreground">
                                Remettre en file
                              </button>
                              <button type="button" onClick={() => setEditorialSignalStatus(signal.id, "rejected")} className="text-xs font-semibold text-destructive">
                                Rejeter
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h2 className="font-heading text-xl font-bold text-card-foreground">Brouillons IA à relire</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        La logique éditoriale est FR d'abord. Les versions EN restent réservées aux meilleurs contenus ensuite.
                      </p>
                      <div className="mt-4 space-y-3">
                        {(editorial?.drafts ?? []).map((draft) => (
                          <div key={draft.id} className="rounded-xl border border-border p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-card-foreground">{draft.title_fr}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {draft.sector_key || "Sans domaine"} · {draft.slug}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {new Date(draft.published_at).toLocaleString()} · statut public: {draft.status}
                                </p>
                              </div>
                              <Badge variant="secondary">{draft.editorial_status}</Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3">
                              <button type="button" onClick={() => setEditorialDraftStatus(draft.id, "review", draft.origin_signal_id)} className="text-xs font-semibold text-muted-foreground">
                                Revue
                              </button>
                              <button type="button" onClick={() => setEditorialDraftStatus(draft.id, "approved", draft.origin_signal_id)} className="text-xs font-semibold text-primary">
                                Approuver
                              </button>
                              <button type="button" onClick={() => setEditorialDraftStatus(draft.id, "published", draft.origin_signal_id)} className="text-xs font-semibold text-primary">
                                Publier
                              </button>
                              <button type="button" onClick={() => setEditorialDraftStatus(draft.id, "archived", draft.origin_signal_id)} className="text-xs font-semibold text-destructive">
                                Archiver
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-xl font-bold text-card-foreground">Jobs pipeline récents</h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {(editorial?.jobs ?? []).map((job) => (
                        <div key={job.id} className="rounded-xl border border-border p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-card-foreground">{job.job_type}</p>
                            <Badge variant="secondary">{job.status}</Badge>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">{job.provider}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{new Date(job.created_at).toLocaleString()}</p>
                          {job.error_message ? <p className="mt-3 text-xs text-destructive">{job.error_message}</p> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="videos">
                <VideoCapsuleAdminPanel token={adminToken} />
              </TabsContent>

              <TabsContent value="whatsapp">
                <WhatsAppMessagesAdminPanel token={adminToken} />
              </TabsContent>

              <TabsContent value="partners">
                <PartnerAdminPanel
                  token={adminToken}
                  isReady={isReady}
                  isBusyGlobal={isBusy}
                  onStatus={setStatusMessage}
                  onError={setErrorMessage}
                />
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

              <TabsContent value="webinars">
                <WebinarAdminPanel token={adminToken} />
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
              <TabsContent value="live-formats" className="space-y-6">
                <LiveFormatsAdminPanel />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        )}
        <Footer />
      </div>
    </PageTransition>
  );
};

export default BackOfficePage;
