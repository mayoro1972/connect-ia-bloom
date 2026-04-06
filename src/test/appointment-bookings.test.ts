import { describe, expect, it } from "vitest";
import { appointmentBookings, buildAppointmentPath } from "@/lib/site-links";

describe("appointment booking routing", () => {
  it("maps each journey to the expected Calendly link", () => {
    expect(appointmentBookings["demande-catalogue"]).toBe(
      "https://calendly.com/marius-ayoro70/catalogue-discovery-call",
    );
    expect(appointmentBookings["demande-renseignement"]).toBe(
      "https://calendly.com/marius-ayoro70/needs-qualification-call",
    );
    expect(appointmentBookings["contact-devis"]).toBe(
      "https://calendly.com/marius-ayoro70/devis-quote-preparation-call",
    );
    expect(appointmentBookings.brochure).toBe(
      "https://calendly.com/marius-ayoro70/catalogue-discovery-call",
    );
  });

  it("builds the appointment path with the right source and optional domain", () => {
    expect(buildAppointmentPath("demande-catalogue")).toBe("/prise-rdv?source=demande-catalogue");
    expect(buildAppointmentPath("contact-devis", "Finance & Comptabilite")).toBe(
      "/prise-rdv?source=contact-devis&domain=Finance+%26+Comptabilite",
    );
  });
});
