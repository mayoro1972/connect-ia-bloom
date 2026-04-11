import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { invokeAdminEdgeFunction, invokeContentAdmin } from "@/lib/content-admin";
import {
  choosePartnerOffer,
  fallbackPartnerReview,
  formatFcfa,
  getOfferByKey,
  partnerDecisionRules,
  partnerEmailTemplates,
  partnerFamilyLabels,
  partnerOffersCatalogue,
  renderPartnerRecommendationEmail,
  type PartnerDecisionRule,
  type PartnerEmailTemplatePreview,
  type PartnerOffer,
  type PartnerReviewPreview,
  type PartnerReviewStatus,
} from "@/data/partner-listing-catalogue";

type PartnerReview = PartnerReviewPreview & {
  created_at?: string;
  updated_at?: string;
};

type PartnerFollowupJob = {
  id: string;
  partner_listing_review_id: string;
  job_status: string;
  scheduled_for: string;
  sent_at: string | null;
  provider: string;
  last_error: string | null;
};

type PartnerTemplate = PartnerEmailTemplatePreview & {
  id?: string;
  is_active?: boolean;
};

type PartnerSnapshot = {
  overview: {
    totalRequests: number;
    pendingReplies: number;
    approvedReplies: number;
    sentReplies: number;
  };
  offers: PartnerOffer[];
  rules: PartnerDecisionRule[];
  templates: PartnerTemplate[];
  reviews: PartnerReview[];
  jobs: PartnerFollowupJob[];
};

type PartnerAdminPanelProps = {
  token: string;
  isReady: boolean;
  isBusyGlobal?: boolean;
  onStatus: (message: string | null) => void;
  onError: (message: string | null) => void;
};

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const fallbackSnapshot: PartnerSnapshot = {
  overview: {
    totalRequests: 1,
    pendingReplies: 1,
    approvedReplies: 0,
    sentReplies: 0,
  },
  offers: partnerOffersCatalogue,
  rules: partnerDecisionRules,
  templates: partnerEmailTemplates,
  reviews: [
    {
      ...fallbackPartnerReview,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  jobs: [],
};

const emptyReviewForm = {
  id: "",
  prospect_name: "",
  prospect_email: "",
  company: "",
  website: "",
  role: "",
  city: "",
  sector_activity: "",
  requested_visibility_type: "",
  requested_timeline: "",
  request_message: "",
  review_status: "received" as PartnerReviewStatus,
  ai_score: "",
  ai_recommendation: "",
  recommended_offer_key: "",
  recommended_duration_months: "",
  recommended_price_fcfa: "",
  response_due_at: "",
  response_email_subject: "",
  response_email_body_fr: "",
  admin_notes: "",
};

const formatDateTimeInput = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

const toIsoOrNull = (value: string) => (value.trim() ? new Date(value).toISOString() : null);
const isUuid = (value?: string | null) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const statusOptions: PartnerReviewStatus[] = [
  "received",
  "needs_info",
  "scored",
  "review",
  "approved",
  "scheduled",
  "sent",
  "rejected",
  "archived",
];

const PartnerAdminPanel = ({
  token,
  isReady,
  isBusyGlobal = false,
  onStatus,
  onError,
}: PartnerAdminPanelProps) => {
  const { toast } = useToast();
  const [snapshot, setSnapshot] = useState<PartnerSnapshot>(fallbackSnapshot);
  const [form, setForm] = useState(emptyReviewForm);
  const [isBusy, setIsBusy] = useState(false);
  const [usesFallback, setUsesFallback] = useState(true);

  const loadSnapshot = async () => {
    if (!isReady) {
      setSnapshot(fallbackSnapshot);
      setUsesFallback(true);
      return;
    }

    try {
      const result = await invokeContentAdmin<{ data: PartnerSnapshot }>(token, {
        entity: "partners",
        action: "list",
      });

      if (result.data) {
        const nextReviews = result.data.reviews ?? [];

        setSnapshot({
          ...result.data,
          offers: result.data.offers?.length ? result.data.offers : partnerOffersCatalogue,
          rules: result.data.rules?.length ? result.data.rules : partnerDecisionRules,
          templates: result.data.templates?.length ? result.data.templates : partnerEmailTemplates,
          reviews: nextReviews,
          jobs: result.data.jobs ?? [],
        });
        setUsesFallback(false);
        return;
      }
    } catch {
      setUsesFallback(true);
      setSnapshot(fallbackSnapshot);
    }
  };

  useEffect(() => {
    loadSnapshot().catch((error: unknown) => {
      onError(error instanceof Error ? error.message : "Chargement partenaires impossible.");
    });
  }, [isReady, token]);

  useEffect(() => {
    if (!form.id && snapshot.reviews[0]) {
      applyReviewToForm(snapshot.reviews[0]);
    }
    if (!usesFallback && snapshot.reviews.length === 0) {
      setForm(emptyReviewForm);
    }
  }, [snapshot, usesFallback]);

  const applyReviewToForm = (review: PartnerReview) => {
    setForm({
      id: review.id,
      prospect_name: review.prospect_name ?? "",
      prospect_email: review.prospect_email ?? "",
      company: review.company ?? "",
      website: review.website ?? "",
      role: review.role ?? "",
      city: review.city ?? "",
      sector_activity: review.sector_activity ?? "",
      requested_visibility_type: review.requested_visibility_type ?? "",
      requested_timeline: review.requested_timeline ?? "",
      request_message: review.request_message ?? "",
      review_status: (review.review_status as PartnerReviewStatus) ?? "received",
      ai_score: review.ai_score?.toString() ?? "",
      ai_recommendation: review.ai_recommendation ?? "",
      recommended_offer_key: review.recommended_offer_key ?? "",
      recommended_duration_months: review.recommended_duration_months?.toString() ?? "",
      recommended_price_fcfa: review.recommended_price_fcfa?.toString() ?? "",
      response_due_at: formatDateTimeInput(review.response_due_at),
      response_email_subject: review.response_email_subject ?? "",
      response_email_body_fr: review.response_email_body_fr ?? "",
      admin_notes: review.admin_notes ?? "",
    });
  };

  const selectedOffer = useMemo(
    () => getOfferByKey(form.recommended_offer_key) ?? null,
    [form.recommended_offer_key],
  );
  const hasRemoteReviewSelected = isUuid(form.id);
  const hasRecipient = form.prospect_email.trim().length > 0;
  const hasReplyBody = form.response_email_body_fr.trim().length > 0;
  const canSendReply = hasRemoteReviewSelected && hasRecipient && hasReplyBody;

  const localSaveReview = () => {
    const nextReview: PartnerReview = {
      id: form.id || "local-partner-review",
      prospect_name: form.prospect_name,
      prospect_email: form.prospect_email,
      company: form.company,
      website: form.website || null,
      role: form.role || null,
      city: form.city || null,
      sector_activity: form.sector_activity || null,
      requested_visibility_type: form.requested_visibility_type || null,
      requested_timeline: form.requested_timeline || null,
      request_message: form.request_message || null,
      review_status: form.review_status,
      ai_score: form.ai_score ? Number(form.ai_score) : null,
      ai_recommendation: form.ai_recommendation || null,
      recommended_offer_key: form.recommended_offer_key || null,
      recommended_duration_months: form.recommended_duration_months ? Number(form.recommended_duration_months) : null,
      recommended_price_fcfa: form.recommended_price_fcfa ? Number(form.recommended_price_fcfa) : null,
      response_due_at: toIsoOrNull(form.response_due_at),
      response_email_subject: form.response_email_subject || null,
      response_email_body_fr: form.response_email_body_fr || null,
      admin_notes: form.admin_notes || null,
      created_at: snapshot.reviews.find((review) => review.id === form.id)?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSnapshot((current) => {
      const existing = current.reviews.some((review) => review.id === nextReview.id);
      const reviews = existing
        ? current.reviews.map((review) => (review.id === nextReview.id ? nextReview : review))
        : [nextReview, ...current.reviews];

      return {
        ...current,
        reviews,
        overview: {
          totalRequests: reviews.length,
          pendingReplies: reviews.filter((review) =>
            ["received", "needs_info", "scored", "review"].includes(review.review_status),
          ).length,
          approvedReplies: reviews.filter((review) =>
            ["approved", "scheduled"].includes(review.review_status),
          ).length,
          sentReplies: reviews.filter((review) => review.review_status === "sent").length,
        },
      };
    });
  };

  const applyLocalRecommendation = () => {
    const recommendedOffer = choosePartnerOffer({
      sector_activity: form.sector_activity,
      requested_visibility_type: form.requested_visibility_type,
      requested_timeline: form.requested_timeline,
      website: form.website,
      request_message: form.request_message,
    });

    setForm((current) => ({
      ...current,
      ai_score: "72",
      ai_recommendation: recommendedOffer.offer_family,
      recommended_offer_key: recommendedOffer.offer_key,
      recommended_duration_months: recommendedOffer.duration_months.toString(),
      recommended_price_fcfa: recommendedOffer.price_fcfa.toString(),
      review_status: "review",
      response_email_subject: "Suite à votre demande de référencement sur TransferAI Africa",
      response_email_body_fr: renderPartnerRecommendationEmail({
        ...fallbackPartnerReview,
        ...current,
        prospect_name: current.prospect_name || fallbackPartnerReview.prospect_name,
        sector_activity: current.sector_activity || fallbackPartnerReview.sector_activity,
        recommended_offer_key: recommendedOffer.offer_key,
        recommended_duration_months: recommendedOffer.duration_months,
        recommended_price_fcfa: recommendedOffer.price_fcfa,
      }),
    }));
  };

  const saveReview = async () => {
    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      const payload = {
        kind: "review",
        id: form.id,
        prospect_name: form.prospect_name,
        prospect_email: form.prospect_email,
        company: form.company,
        website: form.website || null,
        role: form.role || null,
        city: form.city || null,
        sector_activity: form.sector_activity || null,
        requested_visibility_type: form.requested_visibility_type || null,
        requested_timeline: form.requested_timeline || null,
        request_message: form.request_message || null,
        review_status: form.review_status,
        ai_score: form.ai_score ? Number(form.ai_score) : null,
        ai_recommendation: form.ai_recommendation || null,
        recommended_offer_key: form.recommended_offer_key || null,
        recommended_duration_months: form.recommended_duration_months ? Number(form.recommended_duration_months) : null,
        recommended_price_fcfa: form.recommended_price_fcfa ? Number(form.recommended_price_fcfa) : null,
        response_due_at: toIsoOrNull(form.response_due_at),
        response_email_subject: form.response_email_subject || null,
        response_email_body_fr: form.response_email_body_fr || null,
        admin_notes: form.admin_notes || null,
      };

      if (usesFallback || !isReady) {
        localSaveReview();
        onStatus("Prévisualisation locale mise à jour. La sauvegarde Supabase s’activera après déploiement.");
        toast({
          title: "Revue enregistrée",
          description: "La prévisualisation locale a bien été mise à jour.",
        });
        return;
      }

      if (!hasRemoteReviewSelected) {
        throw new Error("Sélectionnez d’abord une demande partenaire réelle avant d’enregistrer la revue.");
      }

      await invokeContentAdmin(token, {
        entity: "partners",
        action: "save",
        payload,
      });

      await loadSnapshot();
      onStatus("Revue partenaire enregistrée.");
      toast({
        title: "Revue enregistrée",
        description: "Les modifications du dossier partenaire ont bien été sauvegardées.",
      });
    } catch (error) {
      onError(error instanceof Error ? error.message : "Enregistrement partenaire impossible.");
      toast({
        title: "Enregistrement impossible",
        description: error instanceof Error ? error.message : "La revue partenaire n'a pas pu être enregistrée.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const generateDraft = async () => {
    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      if (usesFallback || !isReady) {
        applyLocalRecommendation();

        onStatus("Brouillon IA local généré pour la preview.");
        toast({
          title: "Recommandation générée",
          description: "Le brouillon IA local a bien été préparé.",
        });
        return;
      }

      if (!hasRemoteReviewSelected) {
        throw new Error("Aucun dossier partenaire réel n’est sélectionné. Soumettez une demande publique ou choisissez un dossier existant.");
      }

      const result = await invokeAdminEdgeFunction<{ data: { review: PartnerReview } }>(
        token,
        "partner-review-drafter",
        {
          review_id: form.id,
        },
      );

      if (result.data?.review) {
        applyReviewToForm(result.data.review);
      }

      await loadSnapshot();
      onStatus("Recommandation partenaire générée.");
      toast({
        title: "Recommandation générée",
        description: "La proposition IA et l’email de réponse sont prêts à être relus.",
      });
    } catch (error) {
      applyLocalRecommendation();
      onError(error instanceof Error ? error.message : "Génération partenaire impossible.");
      toast({
        title: "Brouillon local généré",
        description: error instanceof Error
          ? `La fonction distante a échoué (${error.message}), mais une recommandation locale exploitable a été préparée.`
          : "La fonction distante a échoué, mais une recommandation locale exploitable a été préparée.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const approveReview = async () => {
    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      if (usesFallback || !isReady) {
        setForm((current) => ({ ...current, review_status: "approved" }));
        localSaveReview();
        onStatus("Revue marquée approuvée en preview locale.");
        toast({
          title: "Revue approuvée",
          description: "Le dossier est maintenant marqué comme prêt à envoyer.",
        });
        return;
      }

      if (!hasRemoteReviewSelected) {
        throw new Error("Sélectionnez d’abord une demande partenaire réelle avant de l’approuver.");
      }

      await invokeContentAdmin(token, {
        entity: "partners",
        action: "set-status",
        payload: {
          id: form.id,
          status: "approved",
        },
      });

      await loadSnapshot();
      onStatus("Revue partenaire approuvée.");
      toast({
        title: "Revue approuvée",
        description: "Le dossier partenaire est prêt pour l’envoi de la réponse.",
      });
    } catch (error) {
      onError(error instanceof Error ? error.message : "Validation partenaire impossible.");
      toast({
        title: "Validation impossible",
        description: error instanceof Error ? error.message : "Le dossier n'a pas pu être approuvé.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const sendReply = async () => {
    setIsBusy(true);
    onStatus(null);
    onError(null);

    try {
      if (usesFallback || !isReady) {
        onStatus("Preview locale prête. L’envoi réel sera disponible après déploiement de la fonction Supabase.");
        toast({
          title: "Mode preview",
          description: "L’envoi réel n’est pas disponible dans la prévisualisation locale seule.",
        });
        return;
      }

      if (!hasRemoteReviewSelected) {
        throw new Error("Sélectionnez d’abord une demande partenaire réelle avant d’envoyer une réponse.");
      }

      if (!hasRecipient || !hasReplyBody) {
        throw new Error("Générez ou rédigez d’abord une réponse email complète avant l’envoi.");
      }

      const result = await invokeAdminEdgeFunction<{ data?: { review?: PartnerReview; recipient?: string } }>(token, "partner-followup-send", {
        review_id: form.id,
      });

      if (result.data?.review) {
        applyReviewToForm(result.data.review);
      }

      await loadSnapshot();
      onStatus("Email partenaire envoyé.");
      toast({
        title: "Réponse envoyée",
        description: result.data?.recipient
          ? `L’email partenaire a bien été envoyé à ${result.data.recipient}.`
          : "L’email partenaire a bien été envoyé.",
      });
    } catch (error) {
      onError(error instanceof Error ? error.message : "Envoi partenaire impossible.");
      toast({
        title: "Envoi impossible",
        description: error instanceof Error ? error.message : "La réponse partenaire n'a pas pu être envoyée.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      {usesFallback ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground">
          Prévisualisation locale active : le panneau affiche déjà la grille officielle, les règles IA et un cas réel simulé.
          Les actions de sauvegarde et d’envoi passeront en mode connecté après déploiement Supabase.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Demandes reçues</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot.overview.totalRequests}</p>
          <p className="mt-2 text-sm text-muted-foreground">Dossiers partenaires à instruire ou à relancer.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Réponses à préparer</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot.overview.pendingReplies}</p>
          <p className="mt-2 text-sm text-muted-foreground">Demandes encore en réception, scoring ou revue.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Prêtes à envoyer</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot.overview.approvedReplies}</p>
          <p className="mt-2 text-sm text-muted-foreground">Réponses validées côté équipe avant envoi au prospect.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Emails envoyés</p>
          <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{snapshot.overview.sentReplies}</p>
          <p className="mt-2 text-sm text-muted-foreground">Historique des réponses finales déjà parties.</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl font-bold text-card-foreground">Grille officielle des formules</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Référentiel de recommandations utilisé par l’équipe et par la logique IA pour répondre proprement aux demandes partenaires.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {snapshot.offers.map((offer) => (
                <div key={offer.offer_key} className="rounded-2xl border border-border bg-background p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-card-foreground">{partnerFamilyLabels[offer.offer_family]}</p>
                    <Badge variant="secondary">{offer.duration_months} mois</Badge>
                  </div>
                  <p className="mt-3 text-lg font-bold text-card-foreground">{formatFcfa(offer.price_fcfa)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{offer.summary_fr}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {offer.deliverables_fr.map((item) => (
                      <Badge key={`${offer.offer_key}-${item}`} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl font-bold text-card-foreground">Règles de décision IA</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pondérations éditoriales proposées pour orienter un dossier vers Référencement, Visibilité ou Premium.
            </p>
            <div className="mt-5 space-y-3">
              {snapshot.rules.map((rule) => (
                <div key={rule.label} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-card-foreground">{rule.label}</p>
                    <Badge variant="secondary">{rule.weight} pts</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl font-bold text-card-foreground">Templates email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Base éditoriale automatique pour demander des compléments ou proposer une formule adaptée au prospect.
            </p>
            <div className="mt-5 space-y-4">
              {snapshot.templates.map((template) => (
                <div key={`${template.template_key}-${template.language}`} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-card-foreground">{template.template_key}</p>
                    <Badge variant="secondary">{template.language.toUpperCase()}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-medium text-card-foreground">{template.subject_template}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {template.body_template}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl font-bold text-card-foreground">Revue partenaire</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sélectionnez un dossier, générez une recommandation IA, ajustez l’email puis validez l’envoi.
            </p>

            <div className="mt-5 space-y-3">
              {snapshot.reviews.length > 0 ? snapshot.reviews.map((review) => (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => applyReviewToForm(review)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    form.id === review.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-card-foreground">{review.company}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {review.prospect_name} · {review.sector_activity || "Secteur à préciser"}
                      </p>
                    </div>
                    <Badge variant="secondary">{review.review_status}</Badge>
                  </div>
                </button>
              )) : (
                <div className="rounded-xl border border-dashed border-border bg-background p-5 text-sm text-muted-foreground">
                  Aucune demande partenaire réelle n’est encore remontée depuis le formulaire public. Quand une nouvelle demande arrive, elle apparaîtra ici pour revue, recommandation IA et envoi.
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input value={form.prospect_name} onChange={(e) => setForm({ ...form, prospect_name: e.target.value })} placeholder="Nom du prospect" />
                <Input value={form.prospect_email} onChange={(e) => setForm({ ...form, prospect_email: e.target.value })} placeholder="Email prospect" />
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Organisation" />
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Site web" />
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Fonction" />
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ville / pays" />
                <Input value={form.sector_activity} onChange={(e) => setForm({ ...form, sector_activity: e.target.value })} placeholder="Secteur / activité" />
                <Input value={form.requested_timeline} onChange={(e) => setForm({ ...form, requested_timeline: e.target.value })} placeholder="Délai souhaité" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <select className={fieldClass} value={form.requested_visibility_type} onChange={(e) => setForm({ ...form, requested_visibility_type: e.target.value })}>
                  <option value="">Type de présence souhaité</option>
                  <option value="presence-standard">Présence standard</option>
                  <option value="presence-renforcee">Présence renforcée</option>
                  <option value="collaboration-editoriale">Collaboration éditoriale</option>
                  <option value="a-recommander">À recommander</option>
                </select>
                <select className={fieldClass} value={form.review_status} onChange={(e) => setForm({ ...form, review_status: e.target.value as PartnerReviewStatus })}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <Textarea value={form.request_message} onChange={(e) => setForm({ ...form, request_message: e.target.value })} placeholder="Message du prospect" className="min-h-[120px]" />

              <div className="grid gap-4 md:grid-cols-2">
                <Input value={form.ai_score} onChange={(e) => setForm({ ...form, ai_score: e.target.value })} placeholder="Score IA / 100" />
                <Input value={form.ai_recommendation} onChange={(e) => setForm({ ...form, ai_recommendation: e.target.value })} placeholder="Recommandation IA" />
                <select className={fieldClass} value={form.recommended_offer_key} onChange={(e) => {
                  const nextOffer = getOfferByKey(e.target.value);
                  setForm({
                    ...form,
                    recommended_offer_key: e.target.value,
                    recommended_duration_months: nextOffer ? nextOffer.duration_months.toString() : form.recommended_duration_months,
                    recommended_price_fcfa: nextOffer ? nextOffer.price_fcfa.toString() : form.recommended_price_fcfa,
                  });
                }}>
                  <option value="">Formule recommandée</option>
                  {snapshot.offers.map((offer) => (
                    <option key={offer.offer_key} value={offer.offer_key}>
                      {partnerFamilyLabels[offer.offer_family]} · {offer.duration_months} mois
                    </option>
                  ))}
                </select>
                <Input value={form.response_due_at} type="datetime-local" onChange={(e) => setForm({ ...form, response_due_at: e.target.value })} placeholder="Réponse attendue" />
              </div>

              {selectedOffer ? (
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Formule actuellement recommandée</p>
                  <p className="mt-3 font-semibold text-card-foreground">
                    {partnerFamilyLabels[selectedOffer.offer_family]} · {selectedOffer.duration_months} mois
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatFcfa(selectedOffer.price_fcfa)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedOffer.deliverables_fr.map((item) => (
                      <Badge key={item} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <Input value={form.response_email_subject} onChange={(e) => setForm({ ...form, response_email_subject: e.target.value })} placeholder="Objet email automatique" />
              <Textarea value={form.response_email_body_fr} onChange={(e) => setForm({ ...form, response_email_body_fr: e.target.value })} placeholder="Corps FR de l’email automatique" className="min-h-[260px]" />
              <Textarea value={form.admin_notes} onChange={(e) => setForm({ ...form, admin_notes: e.target.value })} placeholder="Notes admin / consignes" className="min-h-[120px]" />

              {!canSendReply ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Pour envoyer la réponse, sélectionnez un dossier réel puis générez ou rédigez un email complet.
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={generateDraft} disabled={isBusy || isBusyGlobal} className="rounded-lg bg-orange-gradient px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                  Générer la recommandation IA
                </button>
                <button type="button" onClick={saveReview} disabled={isBusy || isBusyGlobal} className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground hover:bg-muted disabled:opacity-50">
                  Enregistrer la revue
                </button>
                <button type="button" onClick={approveReview} disabled={isBusy || isBusyGlobal} className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground hover:bg-muted disabled:opacity-50">
                  Marquer approuvée
                </button>
                <button type="button" onClick={sendReply} disabled={isBusy || isBusyGlobal || !canSendReply} className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground hover:bg-muted disabled:opacity-50">
                  {isBusy ? "Traitement en cours..." : "Envoyer la réponse"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Aperçu email</p>
            <h3 className="mt-3 text-xl font-bold text-card-foreground">
              {form.response_email_subject || "Objet de la réponse partenaire"}
            </h3>
            <div className="mt-5 whitespace-pre-wrap rounded-2xl border border-border bg-background p-5 text-sm leading-7 text-muted-foreground">
              {form.response_email_body_fr || "Le corps de la réponse automatique apparaîtra ici après génération ou édition manuelle."}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl font-bold text-card-foreground">Journal d’envoi</h2>
            <div className="mt-4 space-y-3">
              {snapshot.jobs.length > 0 ? snapshot.jobs.map((job) => (
                <div key={job.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-card-foreground">{job.provider}</p>
                    <Badge variant="secondary">{job.job_status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Prévu : {new Date(job.scheduled_for).toLocaleString("fr-FR")}
                  </p>
                  {job.last_error ? (
                    <p className="mt-2 text-sm text-destructive">{job.last_error}</p>
                  ) : null}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">
                  Les envois apparaîtront ici après activation de la fonction `partner-followup-send`.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerAdminPanel;
