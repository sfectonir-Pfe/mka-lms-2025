// Service pour gérer les langues et traductions
export const LanguageService = {
  // Détecter la langue du navigateur
  detectBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    const langCode = lang.split('-')[0].toLowerCase();
    
    // Langues supportées
    const supportedLanguages = ['fr', 'en', 'es', 'ar', 'tn'];
    return supportedLanguages.includes(langCode) ? langCode : 'fr';
  },

  // Messages d'interface utilisateur
  getUIMessages(language) {
    const messages = {
      fr: {
        chatTitle: "Assistant LMS",
        placeholder: "Tapez votre message...",
        send: "Envoyer",
        open: "Ouvrir le chatbot",
        close: "Fermer le chatbot"
      },
      en: {
        chatTitle: "LMS Assistant",
        placeholder: "Type your message...",
        send: "Send",
        open: "Open chatbot",
        close: "Close chatbot"
      },
      es: {
        chatTitle: "Asistente LMS",
        placeholder: "Escribe tu mensaje...",
        send: "Enviar",
        open: "Abrir chatbot",
        close: "Cerrar chatbot"
      },
      ar: {
        chatTitle: "مساعد نظام إدارة التعلم",
        placeholder: "اكتب رسالتك...",
        send: "إرسال",
        open: "فتح الشات بوت",
        close: "إغلاق الشات بوت"
      },
      tn: {
        chatTitle: "مساعد نظام التعليم",
        placeholder: "اكتب رسالتك...",
        send: "بعث",
        open: "حل الشات بوت",
        close: "سكر الشات بوت"
      }
    };

    return messages[language] || messages.fr;
  },

  // Exemples de questions selon la langue
  getExampleQuestions(language) {
    const examples = {
      fr: [
        "Combien d'utilisateurs ?",
        "Liste des cours",
        "Utilisateurs actifs",
        "Liste des programmes"
      ],
      en: [
        "How many users?",
        "List of courses",
        "Active users",
        "List of programs"
      ],
      es: [
        "¿Cuántos usuarios?",
        "Lista de cursos",
        "Usuarios activos",
        "Lista de programas"
      ],
      ar: [
        "كم عدد المستخدمين؟",
        "قائمة الدورات",
        "المستخدمون النشطون",
        "قائمة البرامج"
      ],
      tn: [
        "قداش مستخدم؟",
        "قائمة الكورسات",
        "المستخدمين النشاط",
        "قائمة البرامج"
      ]
    };

    return examples[language] || examples.fr;
  },

  // Direction du texte selon la langue
  getTextDirection(language) {
    return (language === 'ar' || language === 'tn') ? 'rtl' : 'ltr';
  },

  // Classe CSS pour l'alignement du texte
  getTextAlign(language) {
    return (language === 'ar' || language === 'tn') ? 'text-end' : 'text-start';
  }
};