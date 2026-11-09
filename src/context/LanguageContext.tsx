import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Language } from '@/types';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (en: string, te: string, ja?: string) => string;
  tl: (en: string, te: string, ja?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'pindivantalu_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'te' || stored === 'ja') return stored;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const toggleLanguage = useCallback(
    () => setLanguageState((prev) => {
      if (prev === 'en') return 'te';
      if (prev === 'te') return 'ja';
      return 'en';
    }),
    []
  );

  const t = useCallback((en: string, te: string, ja?: string) => {
    if (language === 'en') return en;
    if (language === 'te') return te;
    return ja ?? en;
  }, [language]);

  const tl = useCallback((en: string, te: string, ja?: string) => {
    if (language === 'ja') return ja ?? en;
    if (language === 'te') return te;
    return en;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t, tl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
