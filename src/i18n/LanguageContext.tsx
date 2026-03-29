import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
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

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

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
