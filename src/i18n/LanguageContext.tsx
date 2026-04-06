import { createContext, useContext, useState, useCallback, useEffect, useLayoutEffect, type ReactNode } from "react";
import { fr } from "./translations/fr";
import { en } from "./translations/en";

export type Language = "fr" | "en";

type Translations = typeof fr;

const translations: Record<Language, Translations> = { fr, en };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "fr";
  }

  const storedLanguage = window.localStorage.getItem("transferai-language");
  return storedLanguage === "en" ? "en" : "fr";
};

const applyLanguageToDocument = (language: Language) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("transferai-language", language);
  }

  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.documentElement.setAttribute("data-language", language);
    document.body.setAttribute("data-language", language);
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    applyLanguageToDocument(lang);
    setLanguageState(lang);
  }, []);

  useLayoutEffect(() => {
    applyLanguageToDocument(language);
  }, [language]);

  useEffect(() => {
    applyLanguageToDocument(language);
  }, [language]);

  const t = useCallback(
    (key: string): any => {
      const keys = key.split(".");
      let value: any = translations[language];
      for (const k of keys) {
        value = value?.[k];
      }
      return value !== undefined ? value : key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
