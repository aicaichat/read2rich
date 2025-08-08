import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';

export type Locale = 'zh-CN' | 'en-US';

export type TranslationDict = Record<string, string>;

export interface I18nState {
  lang: Locale;
  t: (key: string, fallback?: string) => string;
  setLang: (lang: Locale) => void;
}

const I18nContext = createContext<I18nState | null>(null);

// Lazy containers for dictionaries to allow tree-shaking when expanded
import zhCN from './zh-CN';
import enUS from './en-US';

function getDict(lang: Locale): TranslationDict {
  switch (lang) {
    case 'en-US':
      return enUS;
    case 'zh-CN':
    default:
      return zhCN;
  }
}

function detectDefaultLocale(): Locale {
  const stored = typeof window !== 'undefined' ? (localStorage.getItem('app.lang') as Locale | null) : null;
  if (stored === 'zh-CN' || stored === 'en-US') return stored;
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'zh-CN';
  return nav.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(detectDefaultLocale());

  useEffect(() => {
    try {
      localStorage.setItem('app.lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const value = useMemo<I18nState>(() => ({
    lang,
    t: (key: string, fallback?: string) => {
      const dict = getDict(lang);
      return dict[key] ?? fallback ?? key;
    },
    setLang: (l: Locale) => setLangState(l),
  }), [lang]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nState {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function useT() {
  const { t } = useI18n();
  return t;
}
