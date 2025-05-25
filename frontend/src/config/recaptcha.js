// Configuration reCAPTCHA

// Clés reCAPTCHA (utilisez vos propres clés en production)
export const RECAPTCHA_CONFIG = {
  // Site key (publique) - visible côté client
  SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6Lc9fEYrAAAAAL7wTJ28GcxKh-EAKJB8BK4iCuOx",
  
  // Secret key (privée) - utilisée côté serveur uniquement
  // Ne jamais exposer cette clé côté client !
  SECRET_KEY: "6LdQR0MrAAAAAJyEoLEvPR8RqcrQAxoZVBbh_GS8", // Cette clé ne doit être utilisée que côté serveur
  
  // Configuration
  THEME: "light", // "light" ou "dark"
  SIZE: "normal", // "normal", "compact" ou "invisible"
  
  // URL de l'API Google reCAPTCHA
  VERIFY_URL: "https://www.google.com/recaptcha/api/siteverify"
};

// Fonction pour vérifier si reCAPTCHA est configuré
export const isRecaptchaConfigured = () => {
  return !!RECAPTCHA_CONFIG.SITE_KEY && RECAPTCHA_CONFIG.SITE_KEY !== "your-site-key-here";
};

// Fonction pour obtenir la site key
export const getRecaptchaSiteKey = () => {
  return RECAPTCHA_CONFIG.SITE_KEY;
};

// Fonction pour valider un token reCAPTCHA côté client
export const validateRecaptchaToken = (token) => {
  if (!token) {
    return {
      isValid: false,
      error: "reCAPTCHA token is required"
    };
  }
  
  if (typeof token !== "string" || token.length < 10) {
    return {
      isValid: false,
      error: "Invalid reCAPTCHA token format"
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

// Configuration pour différents environnements
export const getRecaptchaConfig = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  return {
    sitekey: RECAPTCHA_CONFIG.SITE_KEY,
    theme: RECAPTCHA_CONFIG.THEME,
    size: RECAPTCHA_CONFIG.SIZE,
    // En développement, on peut désactiver reCAPTCHA pour faciliter les tests
    disabled: isDevelopment && process.env.REACT_APP_DISABLE_RECAPTCHA === "true"
  };
};
