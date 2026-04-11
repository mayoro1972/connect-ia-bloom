export type CertificationMetaText = {
  fr: string;
  en: string;
};

export type CertificationOfferMeta = {
  price: CertificationMetaText;
  pricingNote: CertificationMetaText;
  durationValue: CertificationMetaText;
  formatValue: CertificationMetaText;
  locationValue: CertificationMetaText;
  nextSessionValue: CertificationMetaText;
  cohortNote: CertificationMetaText;
};

const text = (fr: string, en: string): CertificationMetaText => ({ fr, en });

export const baseCertificationOfferMeta: CertificationOfferMeta = {
  price: text("Prix sur demande", "Price on request"),
  pricingNote: text(
    "Tarif communiqué selon le format retenu",
    "Pricing shared according to the selected format"
  ),
  durationValue: text("5 jours (35h)", "5 days (35h)"),
  formatValue: text(
    "Présentiel / Hybride selon cohorte",
    "On-site / Hybrid depending on the cohort"
  ),
  locationValue: text("Abidjan, Côte d'Ivoire", "Abidjan, Côte d'Ivoire"),
  nextSessionValue: text("Octobre 2026", "October 2026"),
  cohortNote: text(
    "Les candidatures pour la première cohorte ouvrent avant le lancement prévu en octobre 2026.",
    "Applications for the first cohort open ahead of the planned October 2026 launch."
  ),
};

export const certificationOfferOverrides: Partial<Record<string, Partial<CertificationOfferMeta>>> = {};

export const getCertificationOfferMeta = (domainSlug?: string | null): CertificationOfferMeta => {
  const override = domainSlug ? certificationOfferOverrides[domainSlug] : undefined;

  if (!override) {
    return baseCertificationOfferMeta;
  }

  return {
    ...baseCertificationOfferMeta,
    ...override,
  };
};
