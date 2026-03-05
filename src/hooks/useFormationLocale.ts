import { useLanguage } from "@/i18n/LanguageContext";
import type { Formation } from "@/data/formations";

const levelTranslations: Record<string, Record<string, string>> = {
  en: { "Débutant": "Beginner", "Intermédiaire": "Intermediate", "Avancé": "Advanced" },
  fr: { "Débutant": "Débutant", "Intermédiaire": "Intermédiaire", "Avancé": "Avancé" },
};

const formatTranslations: Record<string, Record<string, string>> = {
  en: { "Présentiel": "On-site", "Hybride": "Hybrid", "En ligne": "Online" },
  fr: { "Présentiel": "Présentiel", "Hybride": "Hybride", "En ligne": "En ligne" },
};

export function useFormationLocale() {
  const { language } = useLanguage();

  return {
    getTitle: (f: Formation) => language === "en" ? f.titleEn : f.title,
    getDuration: (f: Formation) => language === "en" ? f.durationEn : f.duration,
    getLevel: (f: Formation) => levelTranslations[language]?.[f.level] ?? f.level,
    getFormat: (f: Formation) => formatTranslations[language]?.[f.format] ?? f.format,
  };
}
