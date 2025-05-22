export const appConfig = {
  // URLs de l'application
  urls: {
    // URL de base du frontend
    frontendBaseUrl: process.env.FRONTEND_BASE_URL || 'http://localhost:3000',
    
    // URLs spécifiques
    login: '/', // Page de connexion (racine de l'application)
    resetPassword: '/ResetPasswordPage', // Page de réinitialisation de mot de passe
  },
  
  // Configuration des emails
  email: {
    // Expéditeur par défaut
    defaultSender: 'LMS Platform <tunirdigital@gmail.com>',
  },
};
