import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar }
};

// Detect preferred language (localStorage → browser → fallback)
const savedLanguage = (typeof window !== 'undefined' && localStorage.getItem('i18nextLng'))
  || (typeof navigator !== 'undefined' && navigator.language && navigator.language.split('-')[0])
  || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;