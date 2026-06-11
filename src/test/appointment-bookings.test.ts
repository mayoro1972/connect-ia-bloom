import { describe, expect, it } from "vitest";
import { appointmentBookings, buildAppointmentPath, buildPackAwareAuditAccessPath, directLinks } from "@/lib/site-links";

describe("appointment booking routing", () => {
  it("maps each journey to the expected Calendly link", () => {
    const sharedBookingLink = "https://calendly.com/marius-ayoro70/devis-quote-preparation-call";

    expect(appointmentBookings["demande-catalogue"]).toBe(
      sharedBookingLink,
    );
    expect(appointmentBookings["demande-renseignement"]).toBe(
      sharedBookingLink,
    );
    expect(appointmentBookings["contact-devis"]).toBe(
      sharedBookingLink,
    );
    expect(appointmentBookings["demande-audit"]).toBe(
      sharedBookingLink,
    );
    expect(appointmentBookings.brochure).toBe(sharedBookingLink);
  });

  it("builds the appointment path with the right source and optional domain", () => {
    expect(buildAppointmentPath("demande-catalogue")).toBe("/prise-rdv?source=demande-catalogue");
    expect(buildAppointmentPath("contact-devis", "Finance & Comptabilite")).toBe(
      "/prise-rdv?source=contact-devis&domain=Finance+%26+Comptabilite",
    );
  });

  it("routes the audit form through the dynamic questionnaire path", () => {
    expect(directLinks.auditForm).toBe("/demande-audit-gratuit");
    expect(directLinks.auditQuestionnaire).toBe("/questionnaire-audit");
  });

  it("builds a pack-aware secure access path when a pack_id is present", () => {
    expect(buildPackAwareAuditAccessPath()).toBe("/acces-formulaire-audit");
    expect(buildPackAwareAuditAccessPath("pack-transferai-001")).toBe(
      "/acces-formulaire-audit?pack_id=pack-transferai-001",
    );
  });
});
