import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from '../locales/en/translation.json';
import koTranslations from '../locales/ko/translation.json';
import jaTranslations from '../locales/ja/translation.json';
import msTranslations from '../locales/ms/translation.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  ko: {
    translation: koTranslations,
  },
  ja: {
    translation: jaTranslations,
  },
  ms: {
    translation: msTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'read2rich_language',
      lookupSessionStorage: 'read2rich_language',
      caches: ['localStorage', 'sessionStorage'],
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;