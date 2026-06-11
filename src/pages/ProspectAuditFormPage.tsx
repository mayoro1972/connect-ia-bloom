import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Cog,
  Compass,
  GraduationCap,
  Layers3,
  LoaderCircle,
  Radar,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { auditMessagesByDomain } from "@/data/audit-offer-content";
import { isSupabaseConfigured, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import {
  buildAdaptiveAuditQuestions,
  buildDeliveryPreferenceOptions,
  buildTransferAIRecommendationSnapshot,
  buildAuditOptionGroups,
  buildPriorityWindowOptions,
  buildTransferAIServiceRecommendation,
  computeAuditCompletion,
  maturityOptions,
  resolveAuditScenarioProfile,
  type AuditContextPayload,
  type AuditLanguage,
  type TransferAIServiceKey,
} from "@/lib/prospect-audit";

type InvitationResponse = {
  invitee_name?: string | null;
  invitee_email?: string | null;
  expires_at?: string | null;
  status?: string | null;
  response_id?: string | null;
  contact_request_id?: string | null;
  pack_id?: string | null;
  sector_context?: string | null;
  access_context?: AuditContextPayload;
  draft_form_data?: Record<string, unknown>;
};

type ResolveInvitationResult = {
  invitation?: InvitationResponse;
  inviteToken?: string | null;
  error?: string;
};

const isLocalPreviewHost = () =>
  typeof window !== "undefined" &&
  ["127.0.0.1", "localhost"].includes(window.location.hostname);

const canUsePreviewPack = (packId: string) =>
  isLocalPreviewHost() && Boolean(packId.trim());

const buildLocalPreviewInvitation = (
  packId: string,
  activeLanguage: AuditLanguage,
): InvitationResponse => ({
  invitee_name: activeLanguage === "en" ? "Preview prospect" : "Prospect de démonstration",
  invitee_email: "preview@transferai.ci",
  expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  status: "preview",
  response_id: null,
  contact_request_id: null,
  pack_id: packId,
  sector_context: activeLanguage === "en" ? "Marketing & Communication" : "Marketing & Communication",
  access_context: {
    packId,
    organizationName: activeLanguage === "en" ? "Preview company" : "Entreprise de démonstration",
    organizationType: activeLanguage === "en" ? "Private company" : "Entreprise privée",
    sectorLabel: activeLanguage === "en" ? "Marketing & Communication" : "Marketing & Communication",
    maturityLevel: "emerging",
    scopingHorizon: activeLanguage === "en" ? "30 to 60 days" : "30 à 60 jours",
    prospectContext:
      activeLanguage === "en"
        ? "This local preview simulates a prospecting pack for a company that wants to accelerate campaign execution, content production, and lead qualification with AI."
        : "Cet aperçu local simule un pack de prospection pour une entreprise qui souhaite accélérer l'exécution des campagnes, la production de contenu et la qualification commerciale avec l'IA.",
    recommendedOffer:
      activeLanguage === "en"
        ? "Audit + targeted training + 90-day support"
        : "Audit + formation ciblée + accompagnement 90 jours",
    recommendedUseCase:
      activeLanguage === "en"
        ? "AI-assisted content and lead qualification"
        : "Production de contenu et qualification commerciale assistées par l'IA",
    probableQuickWins:
      activeLanguage === "en"
        ? ["Faster content cycles", "Better lead triage", "Cleaner campaign reporting"]
        : ["Cycles de contenu plus rapides", "Qualification commerciale plus fluide", "Reporting campagne plus lisible"],
    probableNeeds:
      activeLanguage === "en"
        ? ["Content workflow design", "Team adoption", "Governance guardrails"]
        : ["Structuration des workflows de contenu", "Adoption équipe", "Garde-fous de gouvernance"],
    probableConstraints:
      activeLanguage === "en"
        ? ["Brand validation", "Data confidentiality", "Tool sprawl"]
        : ["Validation de marque", "Confidentialité des données", "Multiplication des outils"],
    domainMessageKey: "marketing_communication",
  },
  draft_form_data: {
    c_nom: activeLanguage === "en" ? "Preview prospect" : "Prospect de démonstration",
    c_email: "preview@transferai.ci",
    c_entite: activeLanguage === "en" ? "Preview company" : "Entreprise de démonstration",
    c_poste: activeLanguage === "en" ? "Growth lead" : "Responsable croissance",
    audit_sector: "Marketing & Communication",
    maturity_level: "emerging",
    priority_window: activeLanguage === "en" ? "30 to 60 days" : "30 à 60 jours",
    pack_id: packId,
    prospect_context:
      activeLanguage === "en"
        ? "We want to identify the first AI workflow that can improve campaign execution without disrupting the existing team."
        : "Nous voulons identifier le premier workflow IA capable d'améliorer l'exécution des campagnes sans perturber l'équipe actuelle.",
  },
});

const trimText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const readStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => trimText(item)).filter(Boolean)
    : [];

const buildFunctionHeaders = () => {
  const anonJwt =
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  return anonJwt
    ? {
        "Content-Type": "application/json",
        apikey: anonJwt,
        Authorization: `Bearer ${anonJwt}`,
      }
    : {
        "Content-Type": "application/json",
      };
};

const getFunctionBaseUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  return supabaseUrl ? `${supabaseUrl}/functions/v1` : "";
};

const getSessionId = (inviteToken: string) => {
  if (typeof window === "undefined") {
    return inviteToken;
  }

  const storageKey = `transferai-audit-session:${inviteToken}`;
  const existing = window.localStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  const created = crypto.randomUUID();
  window.localStorage.setItem(storageKey, created);
  return created;
};

const toggleListValue = (current: unknown, value: string) => {
  const list = readStringArray(current);
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

const transferServiceIcons: Record<TransferAIServiceKey, typeof Compass> = {
  advisory: Compass,
  automation: Cog,
  training: GraduationCap,
  watch: Radar,
  certification: BadgeCheck,
};

const ProspectAuditFormPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { language } = useLanguage();
  const activeLanguage: AuditLanguage = language === "en" ? "en" : "fr";
  const inviteTokenFromUrl = searchParams.get("invite")?.trim() || "";
  const packIdFromUrl = searchParams.get("pack_id")?.trim() || "";
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
  const [responseId, setResponseId] = useState<string | null>(null);
  const [resolvedInviteToken, setResolvedInviteToken] = useState<string>(inviteTokenFromUrl);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const dirtyCount = useRef(0);
  const activeInviteToken = inviteTokenFromUrl || resolvedInviteToken;

  useEffect(() => {
    if (inviteTokenFromUrl) {
      setResolvedInviteToken(inviteTokenFromUrl);
    }
  }, [inviteTokenFromUrl]);

  useEffect(() => {
    const loadInvitation = async () => {
      if (!inviteTokenFromUrl && !packIdFromUrl) {
        setLoadError(
          activeLanguage === "en"
            ? "Missing invite token or pack_id. Use the TransferAI access link sent for this audit."
            : "Lien incomplet. Utilisez le lien TransferAI fourni pour cet audit.",
        );
        setIsLoading(false);
        return;
      }

      if (!inviteTokenFromUrl && canUsePreviewPack(packIdFromUrl)) {
        const previewInvitation = buildLocalPreviewInvitation(packIdFromUrl, activeLanguage);
        setIsPreviewMode(true);
        setInvitation(previewInvitation);
        setResponseId(null);
        setFormData(previewInvitation.draft_form_data ?? {});
        setLoadError(null);
        setIsLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        setLoadError(supabaseUnavailableMessage);
        setIsLoading(false);
        return;
      }

      try {
        const functionBaseUrl = getFunctionBaseUrl();
        const response = await fetch(`${functionBaseUrl}/resolve-invitation`, {
          method: "POST",
          headers: buildFunctionHeaders(),
          body: JSON.stringify(
            inviteTokenFromUrl
              ? { inviteToken: inviteTokenFromUrl }
              : { packId: packIdFromUrl },
          ),
        });

        const result = (await response.json().catch(() => ({}))) as ResolveInvitationResult;

        if (!response.ok || !result?.invitation) {
          throw new Error(typeof result?.error === "string" ? result.error : "Invitation introuvable.");
        }

        const nextInvitation = result.invitation as InvitationResponse;
        const nextInviteToken =
          typeof result.inviteToken === "string" && result.inviteToken.trim()
            ? result.inviteToken.trim()
            : inviteTokenFromUrl;

        if (nextInviteToken) {
          setResolvedInviteToken(nextInviteToken);

          if (!inviteTokenFromUrl && typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            params.delete("pack_id");
            params.set("invite", nextInviteToken);
            const nextQuery = params.toString();
            const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
            window.history.replaceState({}, "", nextUrl);
          }
        }

        setIsPreviewMode(false);
        setInvitation(nextInvitation);
        setResponseId(nextInvitation.response_id ?? null);
        setFormData(nextInvitation.draft_form_data ?? {});
        setHasSubmitted(nextInvitation.status === "completed");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : activeLanguage === "en"
              ? "Unable to open this questionnaire."
              : "Impossible d'ouvrir ce questionnaire.";

        if (!inviteTokenFromUrl && canUsePreviewPack(packIdFromUrl)) {
          const previewInvitation = buildLocalPreviewInvitation(packIdFromUrl, activeLanguage);
          setIsPreviewMode(true);
          setInvitation(previewInvitation);
          setResponseId(null);
          setFormData(previewInvitation.draft_form_data ?? {});
          setLoadError(null);
          return;
        }

        setLoadError(
          message,
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadInvitation();
  }, [activeLanguage, inviteTokenFromUrl, packIdFromUrl]);

  const context = useMemo<AuditContextPayload>(() => {
    const invitationContext = invitation?.access_context ?? {};

    return {
      ...invitationContext,
      packId: trimText(invitation?.pack_id) || invitationContext.packId || trimText(formData.pack_id) || null,
      sectorLabel:
        trimText(invitation?.sector_context) ||
        invitationContext.sectorLabel ||
        trimText(formData.audit_sector) ||
        null,
      maturityLevel: invitationContext.maturityLevel || trimText(formData.maturity_level) || null,
    };
  }, [formData.audit_sector, formData.maturity_level, formData.pack_id, invitation]);

  const scenarioProfile = useMemo(
    () => resolveAuditScenarioProfile(context, activeLanguage),
    [activeLanguage, context],
  );

  const domainMessage = useMemo(
    () =>
      context.domainMessageKey
        ? auditMessagesByDomain.get(context.domainMessageKey) ?? null
        : null,
    [context.domainMessageKey],
  );

  const optionGroups = useMemo(
    () => buildAuditOptionGroups(context, domainMessage, activeLanguage),
    [activeLanguage, context, domainMessage],
  );
  const adaptiveQuestions = useMemo(
    () => buildAdaptiveAuditQuestions(context, domainMessage, activeLanguage),
    [activeLanguage, context, domainMessage],
  );
  const priorityWindowOptions = useMemo(
    () => buildPriorityWindowOptions(activeLanguage),
    [activeLanguage],
  );
  const deliveryPreferenceOptions = useMemo(
    () => buildDeliveryPreferenceOptions(context, activeLanguage),
    [activeLanguage, context],
  );
  const serviceRecommendation = useMemo(
    () => buildTransferAIServiceRecommendation(context, formData, activeLanguage),
    [activeLanguage, context, formData],
  );

  const persistResponse = async (mode: "draft" | "submit") => {
    if (isPreviewMode) {
      setSaveMessage(
        activeLanguage === "en"
          ? "Preview mode only. Saving is disabled until a real pack_id resolves through Supabase."
          : "Mode aperçu uniquement. L'enregistrement restera désactivé tant qu'un vrai pack_id n'est pas résolu via Supabase.",
      );
      return;
    }

    if (!activeInviteToken || !isSupabaseConfigured) {
      return;
    }

    const completionPercentage = mode === "submit" ? 100 : computeAuditCompletion(formData);
    const functionBaseUrl = getFunctionBaseUrl();
    const recommendationSnapshot = buildTransferAIRecommendationSnapshot(serviceRecommendation);
    const payload = {
      inviteToken: activeInviteToken,
      responseId,
      sessionId: getSessionId(activeInviteToken),
      completionPercentage,
      formData: {
        ...formData,
        c_nom: trimText(formData.c_nom) || invitation?.invitee_name || "",
        c_email: trimText(formData.c_email) || invitation?.invitee_email || "",
        c_entite: trimText(formData.c_entite) || context.organizationName || "",
        audit_sector: trimText(formData.audit_sector) || context.sectorLabel || "",
        pack_id: trimText(formData.pack_id) || context.packId || "",
        transferai_recommendation: recommendationSnapshot,
        transferai_recommendation_generated_at: new Date().toISOString(),
      },
    };

    setIsSaving(true);

    try {
      const response = await fetch(`${functionBaseUrl}/save-form-response`, {
        method: "POST",
        headers: buildFunctionHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        throw new Error(typeof result?.error === "string" ? result.error : "save_failed");
      }

      setResponseId(result.responseId ?? responseId);
      setSaveMessage(
        mode === "submit"
          ? activeLanguage === "en"
            ? "Questionnaire submitted successfully. Our team has received it."
            : "Questionnaire transmis avec succès. Notre équipe l'a bien reçu."
          : activeLanguage === "en"
            ? "Draft saved automatically."
            : "Brouillon enregistré automatiquement.",
      );
      setHasSubmitted(mode === "submit");

      if (mode === "submit") {
        toast({
          title: activeLanguage === "en" ? "Questionnaire sent" : "Questionnaire transmis",
          description:
            activeLanguage === "en"
              ? "TransferAI Africa has received your responses and can now prepare the audit review and follow-up."
              : "TransferAI Africa a bien reçu vos réponses et peut maintenant préparer la synthèse d'audit et la relance.",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : activeLanguage === "en"
            ? "Unable to save the questionnaire."
            : "Impossible d'enregistrer le questionnaire.";
      setSaveMessage(message);

      if (mode === "submit") {
        toast({
          title: activeLanguage === "en" ? "Save failed" : "Enregistrement impossible",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (dirtyCount.current === 0 || !invitation || isPreviewMode) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void persistResponse("draft");
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [formData, invitation, isPreviewMode]);

  const updateField = (key: string, value: unknown) => {
    dirtyCount.current += 1;
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const renderChecklist = (title: string, description: string, key: string, options: string[]) => (
    <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_24px_70px_-60px_rgba(16,33,61,0.28)]">
      <h3 className="font-heading text-xl font-bold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-5 grid gap-3">
        {options.map((option) => {
          const checked = readStringArray(formData[key]).includes(option);

          return (
            <label
              key={option}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                checked ? "border-primary/40 bg-primary/5" : "border-border bg-background"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => updateField(key, toggleListValue(formData[key], option))}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm leading-6 text-card-foreground">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  const renderChoiceGrid = (
    title: string,
    description: string,
    key: string,
    options: string[],
    mode: "single" | "multi",
  ) => (
    <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_24px_70px_-60px_rgba(16,33,61,0.28)]">
      <h3 className="font-heading text-xl font-bold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {options.map((option) => {
          const selected =
            mode === "single"
              ? trimText(formData[key]) === option
              : readStringArray(formData[key]).includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                updateField(
                  key,
                  mode === "single" ? option : toggleListValue(formData[key], option),
                )
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-card-foreground hover:border-primary/25"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderPromptCard = (
    eyebrow: string,
    title: string,
    prompt: string,
    placeholder: string,
    key: string,
  ) => (
    <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_24px_70px_-60px_rgba(16,33,61,0.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h3 className="mt-3 font-heading text-xl font-bold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{prompt}</p>
      <textarea
        value={trimText(formData[key])}
        onChange={(event) => updateField(key, event.target.value)}
        placeholder={placeholder}
        className="mt-5 min-h-[160px] w-full rounded-3xl border border-border bg-background px-4 py-4 text-sm leading-7 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
      />
    </div>
  );

  const completion = computeAuditCompletion(formData);

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />

        <main className="relative z-10 px-4 py-16 lg:px-8">
          <div className="container mx-auto max-w-6xl space-y-8">
            <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,33,61,0.98),rgba(20,52,101,0.94))] p-8 text-white shadow-[0_30px_90px_-60px_rgba(16,33,61,0.7)] md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                <CheckCircle2 size={14} />
                {scenarioProfile.badge}
              </div>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-5xl">
                {activeLanguage === "en" ? "Your dynamic audit questionnaire" : "Votre questionnaire d'audit dynamique"}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/82 md:text-base">{scenarioProfile.lead}</p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/75">
                {context.packId ? <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">pack_id · {context.packId}</span> : null}
                {context.sectorLabel ? <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">{context.sectorLabel}</span> : null}
                {context.organizationType ? <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">{context.organizationType}</span> : null}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/12 bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-orange-300">
                    <Clock3 size={16} />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {activeLanguage === "en" ? "Estimated time" : "Temps estimé"}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {activeLanguage === "en" ? "25 to 30 minutes" : "25 à 30 minutes"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    {activeLanguage === "en"
                      ? "Enough to capture your sector context, expected ROI, and operational constraints."
                      : "Le bon format pour capter votre contexte métier, le ROI attendu et les contraintes réelles."}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/12 bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-orange-300">
                    <Layers3 size={16} />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {activeLanguage === "en" ? "Sector-fit" : "Adaptation métier"}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {activeLanguage === "en" ? "Questions tailored to your domain" : "Questions adaptées à votre secteur"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    {activeLanguage === "en"
                      ? "The wording changes according to your pack, your industry, and your maturity level."
                      : "La formulation évolue selon votre pack, votre domaine d'activité et votre niveau de maturité."}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/12 bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-orange-300">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {activeLanguage === "en" ? "Saved as you go" : "Sauvegarde continue"}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {activeLanguage === "en" ? `${completion}% already captured` : `${completion}% déjà capturé`}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    {activeLanguage === "en"
                      ? "Your draft is saved progressively, so you can focus on the quality of the answers."
                      : "Votre brouillon s'enregistre progressivement pour vous laisser vous concentrer sur la qualité des réponses."}
                  </p>
                </div>
              </div>
            </section>

            {isLoading ? (
              <section className="rounded-[30px] border border-border bg-card p-10 text-center shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)]">
                <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {activeLanguage === "en" ? "Opening your questionnaire..." : "Ouverture de votre questionnaire..."}
                </p>
              </section>
            ) : loadError ? (
              <section className="rounded-[30px] border border-destructive/20 bg-card p-10 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)]">
                <h2 className="font-heading text-2xl font-bold text-card-foreground">
                  {activeLanguage === "en" ? "Unable to open this questionnaire" : "Impossible d'ouvrir ce questionnaire"}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{loadError}</p>
              </section>
            ) : (
              <>
                <section className="sticky top-24 z-20 rounded-[26px] border border-border bg-card/95 p-4 shadow-[0_24px_60px_-40px_rgba(16,33,61,0.35)] backdrop-blur md:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {activeLanguage === "en" ? "Questionnaire actions" : "Actions du questionnaire"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-card-foreground">
                        {isPreviewMode
                          ? activeLanguage === "en"
                            ? "This local preview shows the dynamic form experience. Save and submit are disabled here."
                            : "Cet aperçu local montre l'expérience du formulaire dynamique. L'enregistrement et la transmission sont désactivés ici."
                          : hasSubmitted
                            ? activeLanguage === "en"
                              ? "Your questionnaire has been transmitted. Our team can now prepare the audit review."
                              : "Votre questionnaire a bien été transmis. Notre équipe peut maintenant préparer la revue d'audit."
                            : activeLanguage === "en"
                              ? "You can save a draft at any time, then submit the questionnaire once complete."
                              : "Vous pouvez enregistrer un brouillon à tout moment, puis transmettre le questionnaire une fois terminé."}
                      </p>
                      {saveMessage ? <p className="mt-2 text-sm font-medium text-primary">{saveMessage}</p> : null}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => void persistResponse("draft")}
                        disabled={isSaving || isPreviewMode}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-card-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                        {activeLanguage === "en" ? "Save draft" : "Enregistrer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void persistResponse("submit")}
                        disabled={isSaving || isPreviewMode || hasSubmitted}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 size={16} />}
                        {hasSubmitted
                          ? activeLanguage === "en"
                            ? "Already sent"
                            : "Déjà transmis"
                          : activeLanguage === "en"
                            ? "Submit questionnaire"
                            : "Transmettre le questionnaire"}
                      </button>
                    </div>
                  </div>
                </section>

                {hasSubmitted ? (
                  <section className="rounded-[34px] border border-emerald-200 bg-[linear-gradient(180deg,rgba(236,253,245,1),rgba(209,250,229,0.92))] p-8 shadow-[0_24px_70px_-48px_rgba(5,150,105,0.45)] md:p-10">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                      <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
                          <CheckCircle2 size={14} />
                          {activeLanguage === "en" ? "Questionnaire sent" : "Questionnaire transmis"}
                        </div>
                        <h2 className="mt-5 font-heading text-3xl font-bold text-emerald-950 md:text-4xl">
                          {activeLanguage === "en"
                            ? "Thank you. Your audit is now in our hands."
                            : "Merci. Votre audit est maintenant entre nos mains."}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-emerald-950/85 md:text-base">
                          {activeLanguage === "en"
                            ? "TransferAI Africa has received your responses. We can now prepare a sharper audit review, a clearer discussion agenda, and the most useful next step for your organization."
                            : "TransferAI Africa a bien reçu vos réponses. Nous pouvons maintenant préparer une revue d'audit plus précise, un agenda d'échange plus clair et la suite la plus utile pour votre organisation."}
                        </p>
                      </div>

                      <div className="rounded-[28px] border border-emerald-300/70 bg-white/85 p-5 xl:max-w-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                          {activeLanguage === "en" ? "Primary recommended path" : "Parcours recommandé en priorité"}
                        </p>
                        <h3 className="mt-3 font-heading text-2xl font-bold text-emerald-950">
                          {serviceRecommendation.primary.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-emerald-950/80">
                          {serviceRecommendation.primary.outcome}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 xl:grid-cols-3">
                      <div className="rounded-[24px] border border-emerald-200 bg-white/80 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                          {activeLanguage === "en" ? "What we prepare next" : "Ce que nous préparons ensuite"}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-emerald-950/85">
                          {serviceRecommendation.nextStepDescription}
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-emerald-200 bg-white/80 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                          {activeLanguage === "en" ? "Complementary path" : "Parcours complémentaire"}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-emerald-950/85">
                          {serviceRecommendation.secondary
                            ? serviceRecommendation.secondary.title
                            : activeLanguage === "en"
                              ? "No complementary path stands out yet. We will confirm this during the review."
                              : "Aucun parcours complémentaire ne se détache encore nettement. Nous le confirmerons pendant la revue."}
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-emerald-200 bg-white/80 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                          {activeLanguage === "en" ? "What happens now" : "Ce qu'il se passe maintenant"}
                        </p>
                        <div className="mt-3 space-y-2 text-sm leading-7 text-emerald-950/85">
                          <p>{activeLanguage === "en" ? "1. We review your context and priorities." : "1. Nous relisons votre contexte et vos priorités."}</p>
                          <p>{activeLanguage === "en" ? "2. We frame the strongest audit angle." : "2. Nous cadrons l'angle d'audit le plus utile."}</p>
                          <p>{activeLanguage === "en" ? "3. We prepare the discussion and the best next step." : "3. Nous préparons l'échange et la meilleure suite."}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}

                <section className="rounded-[30px] border border-border bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)]">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {activeLanguage === "en" ? "TransferAI orientation" : "Orientation TransferAI"}
                      </p>
                      <h2 className="mt-3 font-heading text-2xl font-bold text-card-foreground">
                        {activeLanguage === "en"
                          ? "The most useful path after this audit"
                          : "La suite la plus utile après cet audit"}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {activeLanguage === "en"
                          ? "As the answers become clearer, we estimate which TransferAI service should help this prospect the most after the audit."
                          : "Au fil des réponses, nous estimons quel service TransferAI a le plus de chances d'aider ce prospect après l'audit."}
                      </p>
                    </div>

                    <div className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {serviceRecommendation.confidenceLabel}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 xl:grid-cols-2">
                    {[serviceRecommendation.primary, serviceRecommendation.secondary].filter(Boolean).map((service, index) => {
                      const profile = service!;
                      const Icon = transferServiceIcons[profile.key];
                      return (
                        <div
                          key={profile.key}
                          className={`rounded-[26px] border p-6 ${
                            index === 0
                              ? "border-primary/20 bg-primary/5"
                              : "border-border bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                                <Icon size={20} />
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                                  {index === 0
                                    ? activeLanguage === "en"
                                      ? "Primary recommendation"
                                      : "Recommandation principale"
                                    : activeLanguage === "en"
                                      ? "Complementary path"
                                      : "Parcours complémentaire"}
                                </p>
                                <h3 className="mt-2 font-heading text-xl font-bold text-card-foreground">
                                  {profile.title}
                                </h3>
                              </div>
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-7 text-muted-foreground">{profile.description}</p>
                          <p className="mt-4 rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-sm leading-7 text-card-foreground">
                            {profile.outcome}
                          </p>

                          <Link
                            to={profile.href}
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
                          >
                            {activeLanguage === "en" ? "Explore this service" : "Explorer ce service"}
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[24px] border border-border bg-background p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {activeLanguage === "en" ? "Why this path" : "Pourquoi cette orientation"}
                      </p>
                      <div className="mt-4 space-y-3">
                        {serviceRecommendation.rationale.map((item) => (
                          <div key={item} className="flex items-start gap-3 text-sm leading-7 text-card-foreground">
                            <CheckCircle2 size={16} className="mt-1 shrink-0 text-primary" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border bg-background p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {serviceRecommendation.nextStepTitle}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-card-foreground">
                        {serviceRecommendation.nextStepDescription}
                      </p>
                      <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm leading-7 text-card-foreground">
                        {activeLanguage === "en"
                          ? `If the audit is confirmed, the strongest next step would start with ${serviceRecommendation.primary.shortTitle.toLowerCase()}.`
                          : `Si l'audit est confirmé, la meilleure suite commencerait par ${serviceRecommendation.primary.shortTitle.toLowerCase()}.`}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
                  <div className="rounded-[30px] border border-border bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)]">
                    {isPreviewMode ? (
                      <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm leading-6 text-orange-950">
                        {activeLanguage === "en"
                          ? "Local preview mode: this form is rendered from a demo pack because the current pack_id does not exist in Supabase yet."
                          : "Mode aperçu local : ce formulaire est affiché depuis un pack de démonstration car le pack_id actuel n'existe pas encore dans Supabase."}
                      </div>
                    ) : null}
                    <h2 className="font-heading text-2xl font-bold text-card-foreground">{scenarioProfile.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {trimText(context.prospectContext) ||
                        (activeLanguage === "en"
                          ? "No contextual summary was attached to this pack."
                          : "Aucun résumé contextuel n'était attaché à ce pack.")}
                    </p>

                    {domainMessage ? (
                      <div className="mt-6 rounded-3xl border border-primary/15 bg-primary/5 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          {activeLanguage === "en" ? "Sector framing" : "Angle métier"}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-card-foreground">
                          {activeLanguage === "en" ? domainMessage.whyAuditMatters.en : domainMessage.whyAuditMatters.fr}
                        </p>
                        <div className="mt-4 grid gap-3">
                          {(domainMessage.auditFocus ?? []).slice(0, 3).map((item) => (
                            <div key={item.fr} className="rounded-2xl border border-primary/10 bg-white/70 px-4 py-3">
                              <p className="text-sm font-medium text-card-foreground">
                                {activeLanguage === "en" ? item.en : item.fr}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-6 grid gap-3">
                      {context.recommendedOffer ? (
                        <div className="rounded-2xl border border-border bg-background px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            {activeLanguage === "en" ? "Recommended offer" : "Offre recommandée"}
                          </p>
                          <p className="mt-2 text-sm text-card-foreground">{context.recommendedOffer}</p>
                        </div>
                      ) : null}

                      {context.recommendedUseCase ? (
                        <div className="rounded-2xl border border-border bg-background px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            {activeLanguage === "en" ? "Suggested lead use case" : "Cas d'usage de tête"}
                          </p>
                          <p className="mt-2 text-sm text-card-foreground">{context.recommendedUseCase}</p>
                        </div>
                      ) : null}

                      <div className="rounded-2xl border border-border bg-background px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                          {activeLanguage === "en" ? "How to answer well" : "Comment bien répondre"}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-card-foreground">
                          {activeLanguage === "en"
                            ? "Be concrete. We do not need polished marketing language. We need to understand the workflow, the bottlenecks, and the practical outcome you would like to unlock first."
                            : "Soyez concret. Nous n'avons pas besoin d'un discours marketing, mais de comprendre le flux métier, les points de friction et le premier résultat pratique que vous voulez débloquer."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[30px] border border-border bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          {activeLanguage === "en" ? "Data contract" : "Contrat de données"}
                        </p>
                        <h2 className="mt-3 font-heading text-2xl font-bold text-card-foreground">
                          {activeLanguage === "en" ? "Profile and scope" : "Profil et périmètre"}
                        </h2>
                      </div>

                      <div className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-card-foreground">
                        {completion}%
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <input
                        value={trimText(formData.c_nom)}
                        onChange={(event) => updateField("c_nom", event.target.value)}
                        placeholder={activeLanguage === "en" ? "Full name" : "Nom complet"}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                      />
                      <input
                        value={trimText(formData.c_email)}
                        onChange={(event) => updateField("c_email", event.target.value)}
                        placeholder={activeLanguage === "en" ? "Email" : "Adresse email"}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                      />
                      <input
                        value={trimText(formData.c_entite)}
                        onChange={(event) => updateField("c_entite", event.target.value)}
                        placeholder={activeLanguage === "en" ? "Organization" : "Organisation"}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                      />
                      <input
                        value={trimText(formData.c_poste)}
                        onChange={(event) => updateField("c_poste", event.target.value)}
                        placeholder={activeLanguage === "en" ? "Role" : "Fonction"}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                      />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input
                        value={trimText(formData.audit_sector) || trimText(context.sectorLabel)}
                        onChange={(event) => updateField("audit_sector", event.target.value)}
                        placeholder={activeLanguage === "en" ? "Sector" : "Secteur"}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                      />
                      <select
                        value={trimText(formData.maturity_level) || trimText(context.maturityLevel)}
                        onChange={(event) => updateField("maturity_level", event.target.value)}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                      >
                        <option value="">{activeLanguage === "en" ? "Select maturity" : "Choisir la maturité"}</option>
                        {maturityOptions(activeLanguage).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <select
                        value={trimText(formData.priority_window) || trimText(context.scopingHorizon)}
                        onChange={(event) => updateField("priority_window", event.target.value)}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                      >
                        <option value="">{activeLanguage === "en" ? "Target time horizon" : "Horizon prioritaire"}</option>
                        {priorityWindowOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <input
                        value={trimText(formData.audit_success_metric)}
                        onChange={(event) => updateField("audit_success_metric", event.target.value)}
                        placeholder={activeLanguage === "en" ? "Key success metric or business signal" : "Signal de réussite ou KPI clé"}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                      />
                    </div>

                    <textarea
                      value={trimText(formData.prospect_context)}
                      onChange={(event) => updateField("prospect_context", event.target.value)}
                      placeholder={
                        activeLanguage === "en"
                          ? "Describe your current context, the main friction points, and what would make this audit useful."
                          : "Décrivez votre contexte actuel, les frictions principales et ce qui rendrait cet audit utile."
                      }
                      className="mt-4 min-h-[170px] w-full rounded-3xl border border-border bg-background px-4 py-4 text-sm leading-7 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                    />
                  </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                  {adaptiveQuestions.map((question) =>
                    renderPromptCard(
                      question.eyebrow,
                      question.title,
                      question.prompt,
                      question.placeholder,
                      question.field,
                    ),
                  )}
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                  {renderChecklist(
                    activeLanguage === "en" ? "Quick wins" : "Quick wins",
                    activeLanguage === "en"
                      ? "Select the first fast-impact gains this pack should help validate."
                      : "Sélectionnez les gains rapides à confirmer en priorité pour ce pack.",
                    "selected_quick_wins",
                    optionGroups.quickWins,
                  )}
                  {renderChecklist(
                    activeLanguage === "en" ? "Use cases" : "Cas d'usage",
                    activeLanguage === "en"
                      ? "Choose the use cases that deserve concrete prioritization."
                      : "Choisissez les cas d'usage qui méritent une priorisation concrète.",
                    "selected_use_cases",
                    optionGroups.useCases,
                  )}
                  {renderChecklist(
                    activeLanguage === "en" ? "Constraints" : "Contraintes",
                    activeLanguage === "en"
                      ? "Highlight the blockers or governance points to factor into the audit."
                      : "Mettez en avant les freins ou points de gouvernance à intégrer dans l'audit.",
                    "selected_constraints",
                    optionGroups.constraints,
                  )}
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                  {renderChoiceGrid(
                    activeLanguage === "en" ? "Preferred next step" : "Suite préférée",
                    activeLanguage === "en"
                      ? "Tell us what kind of support should ideally follow this audit if the diagnosis is confirmed."
                      : "Indiquez le type de suite qui vous semblerait le plus utile si le diagnostic est confirmé.",
                    "preferred_support",
                    deliveryPreferenceOptions,
                    "multi",
                  )}
                  {renderChoiceGrid(
                    activeLanguage === "en" ? "Decision window" : "Fenêtre de décision",
                    activeLanguage === "en"
                      ? "Choose the time horizon that best matches your internal decision pace."
                      : "Choisissez l'horizon qui correspond le mieux à votre rythme de décision interne.",
                    "priority_window",
                    priorityWindowOptions,
                    "single",
                  )}
                </section>

                <section className="rounded-[30px] border border-border bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-card-foreground">
                        {activeLanguage === "en" ? "Save and prepare the follow-up" : "Enregistrer et préparer la suite"}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {activeLanguage === "en"
                          ? "Responses stay linked to the pack_id so our team can recover the history, prepare a sector-specific synthesis, and frame the right next step."
                          : "Les réponses restent rattachées au pack_id pour que l'équipe retrouve l'historique, prépare une synthèse sectorielle et cadre la bonne suite."}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        <Sparkles size={14} />
                        {activeLanguage === "en"
                          ? "This version is built to feel like a guided expert briefing"
                          : "Cette version est pensée comme un brief guidé avec un expert"}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => void persistResponse("draft")}
                        disabled={isSaving || isPreviewMode}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-card-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                        {activeLanguage === "en" ? "Save draft" : "Enregistrer le brouillon"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void persistResponse("submit")}
                        disabled={isSaving || isPreviewMode || hasSubmitted}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 size={16} />}
                        {hasSubmitted
                          ? activeLanguage === "en"
                            ? "Already sent"
                            : "Déjà transmis"
                          : activeLanguage === "en"
                            ? "Submit questionnaire"
                            : "Transmettre le questionnaire"}
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProspectAuditFormPage;
