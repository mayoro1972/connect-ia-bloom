import { useLanguage } from "@/i18n/LanguageContext";
import { FORMATION_PRICE_ON_REQUEST, type Formation } from "@/data/formations";
import { fixMojibake } from "@/lib/fixMojibake";

const levelTranslations: Record<string, Record<string, string>> = {
  en: { Débutant: "Beginner", Intermédiaire: "Intermediate", Avancé: "Advanced" },
  fr: { Débutant: "Débutant", Intermédiaire: "Intermédiaire", Avancé: "Avancé" },
};

const formatTranslations: Record<string, Record<string, string>> = {
  en: { Présentiel: "On-site", Hybride: "Hybrid", "En ligne": "Online" },
  fr: { Présentiel: "Présentiel", Hybride: "Hybride", "En ligne": "En ligne" },
};

export function useFormationLocale() {
  const { language, t } = useLanguage();

  return {
    getTitle: (f: Formation) => fixMojibake(language === "en" ? f.titleEn : f.title),
    getDuration: (f: Formation) => fixMojibake(language === "en" ? f.durationEn : f.duration),
    getLevel: (f: Formation) => {
      const normalizedLevel = fixMojibake(f.level);
      return levelTranslations[language]?.[normalizedLevel] ?? normalizedLevel;
    },
    getFormat: (f: Formation) => {
      const normalizedFormat = fixMojibake(f.format);
      return formatTranslations[language]?.[normalizedFormat] ?? normalizedFormat;
    },
    getPrice: (f: Formation) => {
      if (f.price === FORMATION_PRICE_ON_REQUEST) {
        return t("pricing.onRequest");
      }

      return fixMojibake(f.price);
    },
  };
}
