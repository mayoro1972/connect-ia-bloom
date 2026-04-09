import type { Language } from "@/i18n/LanguageContext";

const isLanguage = (value: string | null | undefined): value is Language => value === "fr" || value === "en";

export const resolveActiveLanguage = (fallback: Language): Language => {
  if (typeof document !== "undefined") {
    const docLanguage = document.documentElement.getAttribute("data-language") ?? document.documentElement.lang;
    const bodyLanguage = document.body?.getAttribute("data-language");

    if (isLanguage(docLanguage)) {
      return docLanguage;
    }

    if (isLanguage(bodyLanguage)) {
      return bodyLanguage;
    }
  }

  if (typeof window !== "undefined") {
    try {
      const storedLanguage = window.localStorage.getItem("transferai-language");

      if (isLanguage(storedLanguage)) {
        return storedLanguage;
      }
    } catch {
      return fallback;
    }
  }

  return fallback;
};
