import { describe, expect, it } from "vitest";
import {
  buildAdaptiveAuditQuestions,
  buildAuditOptionGroups,
  buildDeliveryPreferenceOptions,
  buildPriorityWindowOptions,
  buildTransferAIServiceRecommendation,
  computeAuditCompletion,
  inferAuditScenario,
  resolveAuditScenarioProfile,
  type AuditContextPayload,
} from "@/lib/prospect-audit";
import {
  buildAuditAccessContextFromPack,
  buildAuditDraftFormDataFromPack,
  type ProspectAuditPackRow,
} from "../../supabase/functions/_shared/prospect-audit-context";

describe("prospect audit context", () => {
  it("keeps the enterprise-private scenario for a mature private prospect", () => {
    const context: AuditContextPayload = {
      organizationType: "entreprise-privee",
      maturityLevel: "experimentation",
      suggestedQuickWins: ["Automatiser les relances commerciales"],
      suggestedUseCases: ["Assistant support client"],
    };

    expect(inferAuditScenario(context)).toBe("private_company");
    expect(resolveAuditScenarioProfile(context, "fr").badge).toContain("entreprise");
  });

  it("detects the institutional scenario", () => {
    const context: AuditContextPayload = {
      organizationType: "institution publique",
      maturityLevel: "experimentation",
      suggestedConstraints: ["Validation interdirectionnelle"],
    };

    expect(inferAuditScenario(context)).toBe("institution");
    expect(resolveAuditScenarioProfile(context, "fr").badge).toContain("institutionnel");
  });

  it("detects the low-maturity scenario and computes progress", () => {
    const context: AuditContextPayload = {
      organizationType: "entreprise-privee",
      maturityLevel: "decouverte",
      suggestedQuickWins: ["Notes de reunion"],
      suggestedUseCases: ["Copilote interne"],
    };

    expect(inferAuditScenario(context)).toBe("low_maturity");
    expect(resolveAuditScenarioProfile(context, "fr").badge).toContain("peu mature");

    const groups = buildAuditOptionGroups(context, null, "fr");
    expect(groups.constraints.length).toBeGreaterThan(0);
    expect(buildAdaptiveAuditQuestions(context, null, "fr")).toHaveLength(4);
    expect(buildPriorityWindowOptions("fr")).toContain("30 jours");
    expect(buildDeliveryPreferenceOptions(context, "fr").length).toBeGreaterThan(0);

    expect(
      computeAuditCompletion({
        c_nom: "Prospect Test",
        c_email: "prospect@example.com",
        c_entite: "Acme",
        audit_sector: "IT",
        prospect_context: "Nous debutons.",
        maturity_level: "decouverte",
        current_workflow_snapshot: "Le traitement est manuel.",
        target_outcome: "Gagner du temps.",
        governance_watchpoints: "Validation humaine.",
        existing_tooling: "Excel et e-mail.",
        priority_window: "30 jours",
        selected_quick_wins: ["Notes de reunion"],
        selected_use_cases: ["Copilote interne"],
        selected_constraints: ["Temps limite"],
        preferred_support: ["Audit stratégique"],
      }),
    ).toBe(100);
  });

  it("builds a dynamic pack-only context without a contact request", () => {
    const pack: ProspectAuditPackRow = {
      pack_id: "pack-transferai-001",
      organization_name: "Acme Industries",
      organization_type: "entreprise-privee",
      target_email: "prospect@example.com",
      payload: {
        sector_guess: "marketing",
        recommended_use_case: "Assistant marketing",
        probable_quick_wins: ["Automatiser les briefs"],
        public_text_sanitized_excerpt: "Equipe marketing en recherche de gains rapides.",
      },
    };

    const context = buildAuditAccessContextFromPack(pack);
    const draft = buildAuditDraftFormDataFromPack(pack, context);

    expect(context.packId).toBe("pack-transferai-001");
    expect(context.contactRequestId).toBeNull();
    expect(context.organizationName).toBe("Acme Industries");
    expect(context.sectorLabel).toContain("Marketing");
    expect(draft.c_email).toBe("prospect@example.com");
    expect(draft.pack_id).toBe("pack-transferai-001");
  });

  it("recommends automation when the prospect describes a concrete workflow and quick wins", () => {
    const context: AuditContextPayload = {
      organizationType: "entreprise-privee",
      recommendedUseCase: "Automatisation du support client",
      suggestedQuickWins: ["Réduire le temps de traitement"],
    };

    const recommendation = buildTransferAIServiceRecommendation(
      context,
      {
        maturity_level: "experimentation",
        current_workflow_snapshot: "Les demandes passent par email puis sont recopiées à la main dans un tableur.",
        target_outcome: "Automatiser le tri et accélérer le traitement des demandes.",
        existing_tooling: "CRM, Excel, messagerie",
        selected_quick_wins: ["Réduire les délais de traitement"],
        selected_use_cases: ["Assistant support client"],
      },
      "fr",
    );

    expect(recommendation.primary.key).toBe("automation");
  });

  it("recommends training when the dominant need is team adoption and upskilling", () => {
    const context: AuditContextPayload = {
      organizationType: "entreprise-privee",
      maturityLevel: "decouverte",
      recommendedOffer: "Formation ciblée",
    };

    const recommendation = buildTransferAIServiceRecommendation(
      context,
      {
        maturity_level: "decouverte",
        target_outcome: "Former les équipes, améliorer l'adoption et structurer les compétences IA.",
        preferred_support: ["Formation ciblée"],
        selected_constraints: ["Temps limité pour former les équipes"],
      },
      "fr",
    );

    expect(recommendation.primary.key).toBe("training");
  });
});
