import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des fichiers de traduction
import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationAR from './locales/ar.json';

// Les ressources de traduction
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  ar: {
    translation: translationAR
  }
};

i18n
  // Détection automatique de la langue du navigateur
  .use(LanguageDetector)
  // Passer l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialisation de i18next
  .init({
    resources,
    fallbackLng: 'en', // Langue de secours en anglais
    debug: false, // Désactiver en production

    interpolation: {
      escapeValue: false, // Non nécessaire pour React
    },

    // Options de détection de langue
    detection: {
      order: ['localStorage', 'navigator', 'querystring', 'htmlTag'],
      lookupLocalStorage: 'userLanguage',
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: true,
      wait: true
    }
  });

export default i18n;
