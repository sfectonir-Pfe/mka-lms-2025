import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Types intégrés pour la mémoire utilisateur
interface UserMemory {
  name?: string;
  preferences?: {
    language?: string;
    [key: string]: any;
  };
  lastContext?: string;
  lastQuery?: string;
  lastAccess?: number;
  context?: {
    lastTopic?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface MemoryStore {
  [userId: number]: UserMemory;
}

const prisma = new PrismaClient();

@Injectable()
export class ChatbotService implements OnModuleDestroy {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly axiosConfig: AxiosRequestConfig = {
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  };
  private languageCache = new Map<string, string>();
  private dbCache = {
    data: null as any,
    timestamp: 0,
    ttl: 300000 // 5 minutes
  };
  private memoryCleanupInterval: NodeJS.Timeout;
  private readonly MAX_MEMORY_ENTRIES = 1000; // Maximum number of users to keep in memory
  private readonly MEMORY_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor() {
    // Start memory cleanup scheduler
    this.memoryCleanupInterval = setInterval(() => {
      this.cleanupUserMemory();
    }, 60 * 60 * 1000); // Run every hour
  }

  async onModuleDestroy() {
    if (this.memoryCleanupInterval) {
      clearInterval(this.memoryCleanupInterval);
    }
    await prisma.$disconnect();
    this.languageCache.clear();
    this.userMemoryStore = {}; // Clear user memory
    this.dbCache.data = null;
  }

  // Nettoyer les caches périodiquement
  clearCaches(): void {
    this.languageCache.clear();
    this.userMemoryStore = {}; // Clear user memory
    this.dbCache.data = null;
    this.dbCache.timestamp = 0;
    this.logger.log('Caches nettoyés');
  }

  // Cleanup user memory to prevent memory leaks
  private cleanupUserMemory(): void {
    const now = Date.now();
    const userIds = Object.keys(this.userMemoryStore).map(id => parseInt(id));
    let cleanedCount = 0;

    // Remove expired entries
    for (const userId of userIds) {
      const userMemory = this.userMemoryStore[userId];
      if (userMemory?.lastAccess && (now - userMemory.lastAccess) > this.MEMORY_TTL) {
        delete this.userMemoryStore[userId];
        cleanedCount++;
      }
    }

    // If still over limit, remove oldest entries (LRU eviction)
    const remainingUserIds = Object.keys(this.userMemoryStore).map(id => parseInt(id));
    if (remainingUserIds.length > this.MAX_MEMORY_ENTRIES) {
      // Sort by lastAccess time (oldest first)
      const sortedUsers = remainingUserIds
        .map(userId => ({ userId, lastAccess: this.userMemoryStore[userId]?.lastAccess || 0 }))
        .sort((a, b) => a.lastAccess - b.lastAccess);
      
      const toRemove = sortedUsers.slice(0, remainingUserIds.length - this.MAX_MEMORY_ENTRIES);
      for (const { userId } of toRemove) {
        delete this.userMemoryStore[userId];
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} user memory entries. Current count: ${Object.keys(this.userMemoryStore).length}`);
    }
  }

  // Get memory statistics for monitoring
  getMemoryStats(): { userCount: number; cacheSize: number; dbCacheAge: number } {
    return {
      userCount: Object.keys(this.userMemoryStore).length,
      cacheSize: this.languageCache.size,
      dbCacheAge: this.dbCache.timestamp ? Date.now() - this.dbCache.timestamp : 0
    };
  }

  // Obtenir les statistiques des caches
  getCacheStats(): { languageCache: number; dbCacheAge: number } {
    return {
      languageCache: this.languageCache.size,
      dbCacheAge: this.dbCache.timestamp ? Date.now() - this.dbCache.timestamp : 0
    };
  }

  // Méthode simple pour traiter les questions avec détection de langue
  async processMessage(message: string, sessionId?: string, userId?: number, userLanguage?: string): Promise<{ response: string; detectedLanguage?: string }> {
    try {
      const normalizedMsg = message.toLowerCase().trim();
      
      // Détecter la langue au début si pas fournie
      let detectedLanguage = userLanguage;
      if (!detectedLanguage) {
        detectedLanguage = await this.detectLanguage(message);
      }
      
      // Commande de debug pour voir les contenus
      if (normalizedMsg.includes('debug') && normalizedMsg.includes('contenu')) {
        const response = await this.debugListAllContents();
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      // Détection directe pour "Liste des Sessions"
      if (normalizedMsg.includes('liste') && normalizedMsg.includes('session')) {
        const response = await this.getSessionList(detectedLanguage);
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      // Détection spécifique pour résumé de test logiciel
      if (/summary.*test\s+logiciel|résumé.*test\s+logiciel|resume.*test\s+logiciel/i.test(message)) {
        const response = await this.summarizeContentByTitle('test logiciel');
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      // Détection directe pour "Liste des Séances"
      if (normalizedMsg.includes('liste') && (normalizedMsg.includes('seance') || normalizedMsg.includes('séance'))) {
        const response = await this.getSeanceList(detectedLanguage);
        if (userId) {
          await this.saveToMemory(userId, message, response, 'seances_list');
        }
        return { response, detectedLanguage };
      }
      
      // Détection universelle des demandes de résumé (priorité haute)
      const summaryResponse = await this.handleSummaryRequest(message);
      if (summaryResponse) {
        if (userId) {
          await this.saveToMemory(userId, message, summaryResponse);
        }
        return { response: summaryResponse, detectedLanguage };
      }
      
      // Utiliser Groq en priorité pour comprendre l'intention
      const groqResponse = await this.analyzeIntentWithGroq(message, detectedLanguage, userId);
      if (groqResponse) {
        // Vérifier si l'utilisateur demande des détails spécifiques
        const detailedResponse = await this.checkForDetailedRequest(message, groqResponse, detectedLanguage);
        const finalResponse = detailedResponse || groqResponse;
        
        if (userId) {
          await this.saveToMemory(userId, message, finalResponse);
        }
        return { response: finalResponse, detectedLanguage };
      }
      
      // Salutations générales multilingues
      if (/^(hello|hi|hey|bonjour|salut|hola|مرحبا|أهلا|السلام عليكم)\s*[!.]*$/i.test(normalizedMsg)) {
        const responses = {
          fr: "Bonjour ! Je suis votre assistant LMS. Comment puis-je vous aider aujourd'hui ?",
          en: "Hello! I'm your LMS assistant. How can I help you today?",
          es: "¡Hola! Soy tu asistente LMS. ¿Cómo puedo ayudarte hoy?",
          ar: "مرحبا! أنا مساعد نظام إدارة التعلم الخاص بك. كيف يمكنني مساعدتك اليوم؟",
          tn: "أهلا! أنا مساعد نظام إدارة التعلم متاعك. كيفاش نجم نعاونك اليوم؟"
        };
        const response = responses[detectedLanguage] || responses.en;
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      // Présentations personnelles multilingues
      if (/my name is|je m'appelle|i am|je suis|me llamo|soy|اسمي/i.test(message)) {
        const nameMatch = message.match(/(?:my name is|je m'appelle|i am|je suis|me llamo|soy|اسمي)\s+([^\n\r.,!?]+)/i);
        if (nameMatch) {
          const name = nameMatch[1].trim();
          const responses = {
            fr: `Enchanté ${name} ! Je suis votre assistant LMS. Posez-moi des questions sur la base de données comme 'nombres des utilisateurs', 'liste des cours', etc.`,
            en: `Nice to meet you ${name}! I'm your LMS assistant. Ask me database questions like 'number of users', 'list of courses', etc.`,
            es: `¡Encantado de conocerte ${name}! Soy tu asistente LMS. Hazme preguntas sobre la base de datos como 'número de usuarios', 'lista de cursos', etc.`,
            ar: `سعيد بلقائك ${name}! أنا مساعد نظام إدارة التعلم الخاص بك. اسألني أسئلة قاعدة البيانات مثل 'عدد المستخدمين'، 'قائمة الدورات'، إلخ.`
          };
          const response = responses[detectedLanguage] || responses.en;
          if (userId) {
            await this.saveToMemory(userId, message, response);
          }
          return { response, detectedLanguage };
        }
        const responses = {
          fr: "Enchanté ! Je suis votre assistant LMS. Comment puis-je vous aider avec la base de données ?",
          en: "Nice to meet you! I'm your LMS assistant. How can I help you with the database?",
          es: "¡Encantado! Soy tu asistente LMS. ¿Cómo puedo ayudarte con la base de datos?",
          ar: "سعيد بلقائك! أنا مساعد نظام إدارة التعلم الخاص بك. كيف يمكنني مساعدتك مع قاعدة البيانات؟"
        };
        const response = responses[detectedLanguage] || responses.en;
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      // Questions directes sur la base de données
      if (/nombres?\s+(des?\s+)?utilisateurs?|number\s+of\s+users|número\s+de\s+usuarios|عدد\s+المستخدمين/i.test(message)) {
        const response = await this.getUserList(detectedLanguage);
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      if (/combien\s+(d[e']?\s+)?utilisateurs?|how\s+many\s+users|cuántos\s+usuarios|كم\s+مستخدم/i.test(message)) {
        const users = await prisma.user.findMany();
        const responses = {
          fr: `Il y a ${users.length} utilisateur(s) au total.`,
          en: `There are ${users.length} user(s) in total.`,
          es: `Hay ${users.length} usuario(s) en total.`,
          ar: `يوجد ${users.length} مستخدم(ين) في المجموع.`
        };
        const response = responses[detectedLanguage] || responses.en;
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      if (/listes?\s+(des?\s+)?utilisateurs?|users?\s+list|list\s+of\s+users|lista\s+de\s+usuarios|قائمة\s+المستخدمين/i.test(message)) {
        const response = await this.getUserList(detectedLanguage);
        return { response, detectedLanguage };
      }
      
      if (/listes?\s+(des?\s+)?cours|courses?\s+list|list\s+of\s+courses|lista\s+de\s+cursos|قائمة\s+الدورات/i.test(message)) {
        const response = await this.getCourseList(detectedLanguage);
        return { response, detectedLanguage };
      }
      
      if (/listes?\s+(des?\s+)?programmes?|programs?\s+list|list\s+of\s+programs|lista\s+de\s+programas|قائمة\s+البرامج/i.test(message)) {
        const response = await this.getProgramList(detectedLanguage);
        return { response, detectedLanguage };
      }
      
      if (/listes?\s+(des?\s+)?modules?|modules?\s+list|list\s+of\s+modules|lista\s+de\s+módulos|قائمة\s+الوحدات/i.test(message)) {
        const response = await this.getModuleList(detectedLanguage);
        return { response, detectedLanguage };
      }
      
      if (/listes?\s+(des?\s+)?contenus?|contents?\s+list|list\s+of\s+content|lista\s+de\s+contenido|قائمة\s+المحتوى/i.test(message)) {
        const response = await this.getContentList(detectedLanguage);
        return { response, detectedLanguage };
      }
      
      if (/utilisateurs?\s+actifs?|active\s+users|usuarios\s+activos|المستخدمون\s+النشطون/i.test(message)) {
        const users = await prisma.user.findMany({
          where: { isActive: true },
          select: { id: true, name: true, email: true, role: true }
        });
        const headers = {
          fr: `Il y a ${users.length} utilisateur(s) actif(s) :\n\n`,
          en: `There are ${users.length} active user(s):\n\n`,
          es: `Hay ${users.length} usuario(s) activo(s):\n\n`,
          ar: `يوجد ${users.length} مستخدم(ين) نشط(ين):\n\n`
        };
        let response = headers[detectedLanguage] || headers.fr;
        users.forEach((user, index) => {
          response += `${index + 1}. ${user.name || 'Sans nom'} (${user.email}) - ${user.role}\n`;
        });
        return { response, detectedLanguage };
      }
      
      if (/utilisateurs?\s+inactifs?|inactive\s+users|usuarios\s+inactivos|المستخدمون\s+غير\s+النشطين/i.test(message)) {
        const users = await prisma.user.findMany({
          where: { isActive: false },
          select: { id: true, name: true, email: true, role: true }
        });
        const headers = {
          fr: `Il y a ${users.length} utilisateur(s) inactif(s) :\n\n`,
          en: `There are ${users.length} inactive user(s):\n\n`,
          es: `Hay ${users.length} usuario(s) inactivo(s):\n\n`,
          ar: `يوجد ${users.length} مستخدم(ين) غير نشط(ين):\n\n`
        };
        let response = headers[detectedLanguage] || headers.fr;
        users.forEach((user, index) => {
          response += `${index + 1}. ${user.name || 'Sans nom'} (${user.email}) - ${user.role}\n`;
        });
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      if (/taux\s+(d[e']?\s*)?activit[ée]|activity\s+rate|tasa\s+de\s+actividad|معدل\s+النشاط/i.test(message)) {
        const totalUsers = await prisma.user.count();
        const activeUsers = await prisma.user.count({ where: { isActive: true } });
        const inactiveUsers = totalUsers - activeUsers;
        const activityRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0;
        
        const responses = {
          fr: `📊 **Taux d'activité des utilisateurs**\n\n` +
            `• Total utilisateurs : ${totalUsers}\n` +
            `• Utilisateurs actifs : ${activeUsers} ✅\n` +
            `• Utilisateurs inactifs : ${inactiveUsers} ❌\n` +
            `• Taux d'activité : ${activityRate}%`,
          en: `📊 **User Activity Rate**\n\n` +
            `• Total users: ${totalUsers}\n` +
            `• Active users: ${activeUsers} ✅\n` +
            `• Inactive users: ${inactiveUsers} ❌\n` +
            `• Activity rate: ${activityRate}%`,
          es: `📊 **Tasa de Actividad de Usuarios**\n\n` +
            `• Total usuarios: ${totalUsers}\n` +
            `• Usuarios activos: ${activeUsers} ✅\n` +
            `• Usuarios inactivos: ${inactiveUsers} ❌\n` +
            `• Tasa de actividad: ${activityRate}%`,
          ar: `📊 **معدل نشاط المستخدمين**\n\n` +
            `• إجمالي المستخدمين: ${totalUsers}\n` +
            `• المستخدمون النشطون: ${activeUsers} ✅\n` +
            `• المستخدمون غير النشطين: ${inactiveUsers} ❌\n` +
            `• معدل النشاط: ${activityRate}%`
        };
        
        const response = responses[detectedLanguage] || responses.fr;
        
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      

      
      // Ancienne logique de résumé pour compatibilité
      if (/résumé|summary/i.test(message)) {
        const contentIdMatch = message.match(/(contenu|content)\s+(\d+)/i);
        if (contentIdMatch) {
          const contentId = parseInt(contentIdMatch[2]);
          const response = await this.summarizeContent(contentId);
          if (userId) {
            await this.saveToMemory(userId, message, response);
          }
          return { response, detectedLanguage };
        }
        
        const helpMessages = {
          fr: "Pour résumer un contenu, spécifiez son titre (ex: 'résumé de cahier de charges') ou son ID (ex: 'résumé du contenu 1').",
          en: "To summarize content, specify its title (e.g., 'summary of specification sheet') or ID (e.g., 'summary of content 1').",
          es: "Para resumir contenido, especifica su título (ej: 'resumen de pliego de condiciones') o ID (ej: 'resumen del contenido 1').",
          ar: "لتلخيص المحتوى، حدد عنوانه (مثل: 'ملخص دفتر الشروط') أو معرفه (مثل: 'ملخص المحتوى 1')."
        };
        const response = helpMessages[detectedLanguage] || helpMessages.en;
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      // Questions sur le nom (utiliser la mémoire)
      if (/what is my name|what's my name|quel est mon nom|comment je m'appelle/i.test(message)) {
        if (userId) {
          // Vérifier d'abord dans la mémoire temporaire
          let storedName = this.getUserName(userId);
          
          // Si pas trouvé en mémoire temporaire, chercher dans l'historique
          if (!storedName) {
            const history = await this.getMemoryHistory(userId, 10);
            for (const exchange of history) {
              const nameMatch = exchange.userMessage.match(/(?:my name is|je m'appelle|i am|je suis)\s+([^\n\r.,!?]+)/i);
              if (nameMatch) {
                storedName = nameMatch[1].trim();
                // Sauvegarder en mémoire temporaire pour les futures demandes
                if (!this.userMemoryStore[userId]) {
                  this.userMemoryStore[userId] = {
                    lastAccess: Date.now()
                  };
                } else {
                  this.userMemoryStore[userId].lastAccess = Date.now();
                }
                this.userMemoryStore[userId].name = storedName || undefined;
                break;
              }
            }
          }
          
          if (storedName) {
            const responses = {
              fr: `Votre nom est ${storedName}.`,
              en: `Your name is ${storedName}.`,
              es: `Tu nombre es ${storedName}.`,
              ar: `اسمك هو ${storedName}.`,
              tn: `إسمك هو ${storedName}.`
            };
            const response = responses[detectedLanguage] || responses.en;
            await this.saveToMemory(userId, message, response);
            return { response, detectedLanguage };
          }

        }
        const responses = {
          fr: "Je ne me souviens pas de votre nom. Pouvez-vous me le redire ?",
          en: "I don't remember your name. Can you tell me again?",
          es: "No recuerdo tu nombre. ¿Puedes decírmelo de nuevo?",
          ar: "لا أتذكر اسمك. هل يمكنك إخباري مرة أخرى؟",
          tn: "ما نتفكرش إسمك. تنجم تقولهولي مرة أخرى؟"
        };
        const response = responses[detectedLanguage] || responses.en;
        if (userId) {
          await this.saveToMemory(userId, message, response);
        }
        return { response, detectedLanguage };
      }
      
      // Détection des problèmes techniques ou de base de données
      if (/probl[eè]me|bug|erreur|issue|error/i.test(normalizedMsg) && 
          (/base de donn[eé]e|database|db|frontend|backend|page|affichage|display/i.test(normalizedMsg))) {
        
        // Détection spécifique pour les problèmes de séances
        if (/s[eé]ance|session/i.test(normalizedMsg)) {
          const diagnosticResponse = {
            fr: `🔧 **Diagnostic des problèmes de séances**\n\n` +
                `J'ai détecté plusieurs problèmes potentiels dans le système de séances:\n\n` +
                `1. **Incohérence de données** : Les séances sont stockées dans deux tables différentes (seanceFormateur et session2), ce qui peut causer des confusions.\n\n` +
                `2. **Problème d'affichage frontend** : La page affiche "Mes Séances" suivi de "Aucune séance trouvée" même lorsque des séances existent.\n\n` +
                `3. **Solution recommandée** : Unifier les tables de séances en une seule et corriger le composant frontend qui affiche incorrectement le message "Aucune séance trouvée".\n\n` +
                `Souhaitez-vous que je vous aide à résoudre l'un de ces problèmes spécifiquement ?`,
            en: `🔧 **Session Problems Diagnostic**\n\n` +
                `I've detected several potential issues in the session system:\n\n` +
                `1. **Data inconsistency**: Sessions are stored in two different tables (seanceFormateur and session2), which can cause confusion.\n\n` +
                `2. **Frontend display issue**: The page shows "My Sessions" followed by "No sessions found" even when sessions exist.\n\n` +
                `3. **Recommended solution**: Unify the session tables into one and fix the frontend component that incorrectly displays the "No sessions found" message.\n\n` +
                `Would you like me to help you solve any of these issues specifically?`
          };
          
          const response = diagnosticResponse[detectedLanguage] || diagnosticResponse.fr;
          if (userId) {
            await this.saveToMemory(userId, message, response, 'seances_diagnostic');
          }
          return { response, detectedLanguage };
        }
      }
      
      // Vérifier si c'est une réponse courte qui pourrait être liée au contexte précédent
      if (userId && message.length < 5 && this.userMemoryStore[userId]?.lastContext) {
        const lastContext = this.userMemoryStore[userId].lastContext;
        
        // Si le dernier contexte était la liste des séances
        if (lastContext === 'seances_list') {
          if (/non|no|incorrect|faux/i.test(message)) {
            const responses = {
              fr: "Désolé, y a-t-il une séance spécifique que vous cherchez ? Vous pouvez me demander plus de détails sur une séance particulière.",
              en: "Sorry, is there a specific session you're looking for? You can ask me for more details about a particular session.",
              es: "Lo siento, ¿hay alguna sesión específica que estés buscando? Puedes pedirme más detalles sobre una sesión en particular.",
              ar: "آسف، هل هناك جلسة محددة تبحث عنها؟ يمكنك أن تطلب مني المزيد من التفاصيل حول جلسة معينة.",
              tn: "معذرة، فما سيانس معين تلوج عليه؟ تنجم تطلب مني تفاصيل أكثر على سيانس معين."
            };
            const response = responses[detectedLanguage] || responses.fr;
            await this.saveToMemory(userId, message, response, 'seances_details');
            return { response, detectedLanguage };
          }
        }
        
        // Si le dernier contexte était le diagnostic des séances
        if (lastContext === 'seances_diagnostic') {
          if (/oui|yes|ok|d'accord|sure|please|svp/i.test(message)) {
            const solutionResponse = {
              fr: `👍 **Solutions pour les problèmes de séances**\n\n` +
                  `Voici les étapes recommandées pour résoudre les problèmes:\n\n` +
                  `1. **Unification des tables**:\n` +
                  `   - Créer une nouvelle table 'seance' qui combine les champs de 'seanceFormateur' et 'session2'\n` +
                  `   - Migrer les données des deux tables vers la nouvelle table\n` +
                  `   - Mettre à jour les références dans le code\n\n` +
                  `2. **Correction du frontend**:\n` +
                  `   - Vérifier le composant qui affiche "Mes Séances" et "Aucune séance trouvée"\n` +
                  `   - S'assurer que la condition d'affichage du message "Aucune séance trouvée" est correcte\n` +
                  `   - Tester avec différents scénarios (aucune séance, quelques séances)\n\n` +
                  `Souhaitez-vous que je vous aide à implémenter l'une de ces solutions ?`,
              en: `👍 **Solutions for Session Problems**\n\n` +
                  `Here are the recommended steps to solve the issues:\n\n` +
                  `1. **Table Unification**:\n` +
                  `   - Create a new 'session' table that combines fields from 'seanceFormateur' and 'session2'\n` +
                  `   - Migrate data from both tables to the new table\n` +
                  `   - Update references in the code\n\n` +
                  `2. **Frontend Fix**:\n` +
                  `   - Check the component that displays "My Sessions" and "No sessions found"\n` +
                  `   - Ensure the condition for displaying the "No sessions found" message is correct\n` +
                  `   - Test with different scenarios (no sessions, some sessions)\n\n` +
                  `Would you like me to help you implement any of these solutions?`
            };
            
            const response = solutionResponse[detectedLanguage] || solutionResponse.fr;
            await this.saveToMemory(userId, message, response, 'seances_solution');
            return { response, detectedLanguage };
          }
        }
      }
      
      // Fallback: réponses par défaut si Groq ne fonctionne pas
      const notUnderstoodMessages = {
        fr: "Je ne comprends pas votre question. Essayez : 'nombres des utilisateurs', 'liste des cours', 'utilisateurs actifs', etc.",
        en: "I don't understand your question. Try: 'number of users', 'list of courses', 'active users', etc.",
        es: "No entiendo tu pregunta. Prueba: 'número de usuarios', 'lista de cursos', 'usuarios activos', etc.",
        ar: "لا أفهم سؤالك. جرب: 'عدد المستخدمين'، 'قائمة الدورات'، 'المستخدمون النشطون'، إلخ.",
        tn: "ما فهمتش سؤالك. جرب: 'عدد المستخدمين'، 'قائمة الكورسات'، 'المستخدمين النشاط'، إلخ."
      };
      const finalResponse = notUnderstoodMessages[detectedLanguage] || notUnderstoodMessages.en;
      if (userId) {
        await this.saveToMemory(userId, message, finalResponse);
      }
      return { response: finalResponse, detectedLanguage };
      
    } catch (error) {
      this.logger.error(`Erreur: ${error.message}`);
      const errorMessages = {
        fr: "Erreur lors du traitement de votre demande.",
        en: "Error processing your request.",
        es: "Error al procesar tu solicitud.",
        ar: "خطأ في معالجة طلبك.",
        tn: "فمة غلطة في معالجة طلبك."
      };
      return { response: errorMessages[userLanguage || 'en'] || errorMessages.en };
    }
  }

  // Méthode centralisée pour les appels Groq
  private async makeGroqRequest(payload: any): Promise<any> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('API Groq non configurée');
    
    return axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      payload,
      {
        ...this.axiosConfig,
        headers: {
          ...this.axiosConfig.headers,
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
  }

  // Cache pour les données de base
  private async getDbData() {
    const now = Date.now();
    if (this.dbCache.data && (now - this.dbCache.timestamp) < this.dbCache.ttl) {
      return this.dbCache.data;
    }

    const [users, courses, programs, modules, contents, sessions, quizzes, feedback, seances] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true } }),
      prisma.course.findMany({ select: { id: true, title: true } }),
      prisma.program.findMany({ select: { id: true, name: true, published: true } }),
      prisma.module.findMany({ select: { id: true, name: true, duration: true, periodUnit: true } }),
      prisma.contenu.findMany({ select: { id: true, title: true, type: true, published: true, fileType: true, coursAssocie: true } }),
      prisma.session2.findMany({ select: { id: true, name: true, startDate: true, endDate: true } }).catch(() => []),
      prisma.quiz.findMany({ select: { id: true, title: true } }).catch(() => []),
      prisma.feedback.findMany({ select: { id: true, rating: true, message: true } }).catch(() => []),
      prisma.seanceFormateur.findMany({ select: { id: true, title: true } }).catch(() => [])
    ]);

    const activeUsers = users.filter(u => u.isActive);
    const avgRating = feedback.length > 0 
      ? (feedback.map(f => f.rating || 0).reduce((sum, rating) => sum + rating, 0) / feedback.length).toFixed(1)
      : '0';
    
    const data = {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      inactiveUsers: users.length - activeUsers.length,
      activityRate: users.length > 0 ? ((activeUsers.length / users.length) * 100).toFixed(1) : '0',
      totalCourses: courses.length,
      totalPrograms: programs.length,
      totalModules: modules.length,
      totalContents: contents.length,
      totalSessions: sessions.length,
      totalQuizzes: quizzes.length,
      totalFeedback: feedback.length,
      totalSeances: seances.length,
      avgFeedbackRating: avgRating
    };

    this.dbCache = { data, timestamp: now, ttl: this.dbCache.ttl };
    return data;
  }

  // Détecter la langue avec Groq (optimisé)
  async detectLanguage(text: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return 'fr';
    
    // Cache simple pour éviter les appels répétés
    const cacheKey = text.substring(0, 50);
    if (this.languageCache.has(cacheKey)) {
      return this.languageCache.get(cacheKey)!;
    }
    
    try {
      const response = await this.makeGroqRequest({
        model: 'llama-3.3-70b-versatile',
        messages: [{ 
          role: 'user', 
          content: `Detect language, respond only with code (fr/en/es/ar/tn): "${text.substring(0, 100)}"` 
        }],
        max_tokens: 5,
        temperature: 0
      });
      
      const detectedLang = response.data.choices[0].message.content.trim().toLowerCase();
      const validLang = ['fr', 'en', 'es', 'ar', 'tn'].includes(detectedLang) ? detectedLang : 'fr';
      
      this.languageCache.set(cacheKey, validLang);
      return validLang;
    } catch (error) {
      this.logger.error(`Erreur détection langue: ${error.message}`);
      return 'fr';
    }
  }

  // Analyser l'intention avec Groq de manière plus intelligente avec mémoire
  async analyzeIntentWithGroq(message: string, language: string, userId?: number): Promise<string | null> {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return null;
    }
    
    try {
      const languageNames = {
        fr: 'French',
        en: 'English', 
        es: 'Spanish',
        ar: 'Arabic',
        tn: 'Tunisian Darija'
      };
      
      // Récupérer l'historique de conversation si userId est fourni
      let conversationHistory = '';
      if (userId) {
        const history = await this.getMemoryHistory(userId, 5);
        if (history.length > 0) {
          conversationHistory = '\n\nConversation History:\n';
          history.reverse().forEach((exchange, index) => {
            conversationHistory += `${index + 1}. User: "${exchange.userMessage}" -> Bot: "${exchange.botResponse}"\n`;
          });
        }
      }
      
      // Récupérer toutes les données de la base de données
      const [users, courses, programs, modules, contents, sessions, quizzes, feedback, seances] = await Promise.all([
        prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true } }),
        prisma.course.findMany({ select: { id: true, title: true } }),
        prisma.program.findMany({ select: { id: true, name: true, published: true } }),
        prisma.module.findMany({ select: { id: true, name: true, duration: true, periodUnit: true } }),
        prisma.contenu.findMany({ select: { id: true, title: true, type: true, published: true, fileType: true, coursAssocie: true } }),
        prisma.session2.findMany({ select: { id: true, name: true, startDate: true, endDate: true } }).catch(() => []),
        prisma.quiz.findMany({ select: { id: true, title: true } }).catch(() => []),
        prisma.feedback.findMany({ select: { id: true, rating: true, message: true } }).catch(() => []),
        prisma.seanceFormateur.findMany({ select: { id: true, title: true } }).catch(() => [])
      ]);
      
      const activeUsers = users.filter(u => u.isActive);
      const inactiveUsers = users.filter(u => !u.isActive);
      const activityRate = users.length > 0 ? ((activeUsers.length / users.length) * 100).toFixed(1) : 0;
      
      const contextData = {
        totalUsers: users.length,
        activeUsers: activeUsers.length,
        inactiveUsers: inactiveUsers.length,
        activityRate,
        totalCourses: courses.length,
        totalPrograms: programs.length,
        totalModules: modules.length,
        totalContents: contents.length,
        totalSessions: sessions.length,
        totalQuizzes: quizzes.length,
        totalFeedback: feedback.length,
        totalSeances: seances.length,
        avgFeedbackRating: feedback.length > 0 ? '4.5' : '0'
      };
      
      const prompt = `You are a concise LMS assistant. Answer directly and briefly in ${languageNames[language] || 'French'}.

Database Stats:
- Users: ${contextData.totalUsers} (${contextData.activeUsers} active)
- Courses: ${contextData.totalCourses} | Programs: ${contextData.totalPrograms} | Modules: ${contextData.totalModules}
- Sessions: ${contextData.totalSessions} | Quizzes: ${contextData.totalQuizzes} | Content: ${contextData.totalContents}${conversationHistory}

User asks: "${message}"

Rules:
- Keep responses SHORT (1-2 sentences max)
- Answer directly without repetition
- Don't mention previous conversations unless specifically asked
- Use simple, clear language
- Only provide the requested information

Answer concisely:`;
      
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 80,
          temperature: 0.4,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error(`Erreur analyse intention: ${error.message}`);
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      return null;
    }
  }

  // Vérifier si l'utilisateur demande des détails spécifiques
  async checkForDetailedRequest(message: string, groqResponse: string, language: string): Promise<string | null> {
    const lowerMessage = message.toLowerCase();
    
    // Détecter les demandes de listes détaillées
    if (/list|liste|show|affiche|détail|قائمة|عرض|فمة/i.test(lowerMessage)) {
      if (/session|جلسة|سيشن/i.test(lowerMessage)) {
        return await this.getSessionList(language);
      }
      if (/user|utilisateur|مستخدم/i.test(lowerMessage)) {
        return await this.getUserList(language);
      }
      if (/course|cours|دورة|كورس/i.test(lowerMessage)) {
        return await this.getCourseList(language);
      }
      if (/program|programme|برنامج/i.test(lowerMessage)) {
        return await this.getProgramList(language);
      }
      if (/module|وحدة|موديول/i.test(lowerMessage)) {
        return await this.getModuleList(language);
      }
      if (/content|contenu|محتوى/i.test(lowerMessage)) {
        return await this.getContentList(language);
      }
      if (/session|جلسة|سيشن/i.test(lowerMessage)) {
        return await this.getSessionList(language);
      }
      if (/quiz|اختبار/i.test(lowerMessage)) {
        return await this.getQuizList(language);
      }
      if (/feedback|تقييم/i.test(lowerMessage)) {
        return await this.getFeedbackList(language);
      }
    }
    
    // Détecter les demandes d'utilisateurs actifs/inactifs
    if (/actif|active|نشط|نشاط/i.test(lowerMessage) && /user|utilisateur|مستخدم/i.test(lowerMessage)) {
      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, name: true, email: true, role: true }
      });
      const headers = {
        fr: `Il y a ${users.length} utilisateur(s) actif(s) :\n\n`,
        en: `There are ${users.length} active user(s):\n\n`,
        es: `Hay ${users.length} usuario(s) activo(s):\n\n`,
        ar: `يوجد ${users.length} مستخدم(ين) نشط(ين):\n\n`,
        tn: `فمة ${users.length} مستخدم(ين) نشاط:\n\n`
      };
      let response = headers[language] || headers.fr;
      users.forEach((user, index) => {
        response += `${index + 1}. ${user.name || 'Sans nom'} (${user.email}) - ${user.role}\n`;
      });
      return response;
    }
    
    return null;
  }

  // Listes supplémentaires
  async getSessionList(language: string = 'fr'): Promise<string> {
    try {
      const sessions = await prisma.session2.findMany({
        select: { id: true, name: true, startDate: true, endDate: true },
        orderBy: { id: 'asc' }
      });
      
      const headers = {
        fr: `Il y a ${sessions.length} session(s) :\n\n`,
        en: `There are ${sessions.length} session(s):\n\n`,
        es: `Hay ${sessions.length} sesión(es):\n\n`,
        ar: `يوجد ${sessions.length} جلسة (جلسات):\n\n`,
        tn: `فمة ${sessions.length} سيشن (سيشنات):\n\n`
      };
      let response = headers[language] || headers.fr;
      sessions.forEach((session) => {
        const startDate = session.startDate ? new Date(session.startDate).toLocaleDateString() : 'N/A';
        const endDate = session.endDate ? new Date(session.endDate).toLocaleDateString() : 'N/A';
        response += `${session.id}. ${session.name} - Du ${startDate} au ${endDate}\n`;
      });
      
      return response;
    } catch (error) {
      return 'Erreur lors de la récupération des sessions.';
    }
  }

  async getQuizList(language: string = 'fr'): Promise<string> {
    try {
      const quizzes = await prisma.quiz.findMany({
        select: { id: true, title: true, description: true },
        orderBy: { id: 'asc' }
      });
      
      const headers = {
        fr: `Il y a ${quizzes.length} quiz(s) :\n\n`,
        en: `There are ${quizzes.length} quiz(zes):\n\n`,
        es: `Hay ${quizzes.length} cuestionario(s):\n\n`,
        ar: `يوجد ${quizzes.length} اختبار (اختبارات):\n\n`,
        tn: `فمة ${quizzes.length} كويز (كويزات):\n\n`
      };
      let response = headers[language] || headers.fr;
      quizzes.forEach((quiz) => {
        response += `${quiz.id}. ${quiz.title}\n`;
      });
      
      return response;
    } catch (error) {
      return 'Erreur lors de la récupération des quiz.';
    }
  }

  async getFeedbackList(language: string = 'fr'): Promise<string> {
    try {
      const feedback = await prisma.feedback.findMany({
        select: { id: true, rating: true, message: true },
        orderBy: { id: 'desc' },
        take: 10
      });
      
      const avgRating = feedback.length > 0 ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1) : '0';
      
      const headers = {
        fr: `Il y a ${feedback.length} feedback(s) récents (note moyenne: ${avgRating}/5) :\n\n`,
        en: `There are ${feedback.length} recent feedback(s) (avg rating: ${avgRating}/5):\n\n`,
        es: `Hay ${feedback.length} comentario(s) reciente(s) (calificación promedio: ${avgRating}/5):\n\n`,
        ar: `يوجد ${feedback.length} تقييم (تقييمات) حديث (متوسط التقييم: ${avgRating}/5):\n\n`,
        tn: `فمة ${feedback.length} فيدباك جديد (معدل التقييم: ${avgRating}/5):\n\n`
      };
      let response = headers[language] || headers.fr;
      feedback.forEach((fb, index) => {
        const comment = fb.message ? fb.message.substring(0, 50) + '...' : 'Pas de commentaire';
        response += `${index + 1}. Note: ${fb.rating || 0}/5 - ${comment}\n`;
      });
      
      return response;
    } catch (error) {
      return 'Erreur lors de la récupération des feedback.';
    }
  }

  async getSeanceList(language: string = 'fr'): Promise<string> {
    try {
      // Récupérer les séances des deux tables
      const [seancesFormateur, sessions] = await Promise.all([
        prisma.seanceFormateur.findMany({
          select: { id: true, title: true },
          orderBy: { id: 'asc' }
        }),
        prisma.session2.findMany({
          select: { id: true, name: true },
          orderBy: { id: 'asc' }
        })
      ]);
      
      // Combiner les résultats
      const allSeances = [
        ...seancesFormateur.map(s => ({ id: s.id, title: s.title })),
        ...sessions.map(s => ({ id: s.id, title: s.name }))
      ];
      
      if (allSeances.length === 0) {
        const noSeancesMessages = {
          fr: "Aucune séance trouvée.",
          en: "No sessions found.",
          es: "No se encontraron sesiones.",
          ar: "لم يتم العثور على جلسات.",
          tn: "ما لقيناش سيانسات."
        };
        return noSeancesMessages[language] || noSeancesMessages.fr;
      }
      
      const headers = {
        fr: `Il y a ${allSeances.length} séance(s) :\n\n`,
        en: `There are ${allSeances.length} session(s):\n\n`,
        es: `Hay ${allSeances.length} sesión(es):\n\n`,
        ar: `يوجد ${allSeances.length} جلسة (جلسات):\n\n`,
        tn: `فمة ${allSeances.length} سيانس (سيانسات):\n\n`
      };
      let response = headers[language] || headers.fr;
      
      allSeances.forEach((seance) => {
        response += `${seance.id}. ${seance.title}\n`;
      });
      
      return response;
    } catch (error) {
      return 'Erreur lors de la récupération des séances.';
    }
  }

  // Utiliser Groq API pour les résumés (optimisé)
  async askGroq(prompt: string): Promise<string> {
    try {
      const response = await this.makeGroqRequest({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.2
      });
      
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Erreur Groq API: ${error.message}`);
      return "Erreur lors de la génération du résumé.";
    }
  }

  // Résumer le contenu par titre (recherche améliorée)
  async summarizeContentByTitle(title: string): Promise<string> {
    try {
      this.logger.log(`Recherche contenu: "${title}"`);
      
      // Recherche exacte d'abord
      let content = await prisma.contenu.findFirst({
        where: {
          title: {
            equals: title,
            mode: 'insensitive'
          }
        }
      });
      
      this.logger.log(`Recherche exacte: ${content ? 'trouvé' : 'non trouvé'}`);
      
      // Si pas trouvé, recherche partielle
      if (!content) {
        content = await prisma.contenu.findFirst({
          where: {
            title: {
              contains: title,
              mode: 'insensitive'
            }
          }
        });
      }
      
      // Si toujours pas trouvé, recherche par mots-clés
      if (!content) {
        const keywords = title.toLowerCase().split(' ');
        const contents = await prisma.contenu.findMany({
          select: { id: true, title: true, fileUrl: true, fileType: true, type: true, coursAssocie: true, published: true }
        });
        
        content = contents.find(c => 
          keywords.some(keyword => 
            c.title.toLowerCase().includes(keyword)
          )
        ) || null;
      }
      
      if (!content) {
        // Afficher tous les contenus pour debug
        const allContents = await prisma.contenu.findMany({ select: { id: true, title: true } });
        this.logger.log(`Contenus disponibles: ${allContents.map(c => c.title).join(', ')}`);
        return `Aucun contenu trouvé pour "${title}". Contenus disponibles: ${allContents.map(c => c.title).join(', ')}`;
      }
      
      return await this.summarizeContent(content.id);
    } catch (error) {
      this.logger.error(`Erreur recherche titre "${title}": ${error.message}`);
      return `Erreur lors de la recherche du contenu "${title}".`;
    }
  }

  // Listes simples
  async getModuleList(language: string = 'fr'): Promise<string> {
    try {
      const modules = await prisma.module.findMany({
        select: { id: true, name: true, periodUnit: true, duration: true },
        orderBy: { id: 'asc' }
      });
      
      const headers = {
        fr: `Il y a ${modules.length} module(s) :\n\n`,
        en: `There are ${modules.length} module(s):\n\n`,
        es: `Hay ${modules.length} módulo(s):\n\n`,
        ar: `يوجد ${modules.length} وحدة (وحدات):\n\n`,
        tn: `فمة ${modules.length} موديول (موديولات):\n\n`
      };
      let response = headers[language] || headers.fr;
      modules.forEach((module) => {
        const durationLabel = {
          fr: 'Durée:',
          en: 'Duration:',
          es: 'Duración:',
          ar: 'المدة:'
        }[language] || 'Durée:';
        response += `${module.id}. ${module.name} - ${durationLabel} ${module.duration} ${module.periodUnit}\n`;
      });
      
      return response;
    } catch (error) {
      return 'Erreur lors de la récupération des modules.';
    }
  }

  async getUserList(language: string = 'fr'): Promise<string> {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, isActive: true },
        orderBy: { id: 'asc' },
        take: 50 // Limiter pour éviter les réponses trop longues
      });
      
      const headers = {
        fr: `${users.length} utilisateur(s) :\n\n`,
        en: `${users.length} user(s):\n\n`,
        es: `${users.length} usuario(s):\n\n`,
        ar: `${users.length} مستخدم(ين):\n\n`,
        tn: `${users.length} مستخدم(ين):\n\n`
      };
      
      const noName = { fr: 'Sans nom', en: 'No name', es: 'Sin nombre', ar: 'بدون اسم' }[language] || 'Sans nom';
      
      let response = headers[language] || headers.fr;
      users.forEach((user) => {
        const status = user.isActive ? '✅' : '❌';
        response += `${user.id}. ${user.name || noName} (${user.email}) - ${user.role} ${status}\n`;
      });
      
      return response;
    } catch (error) {
      this.logger.error(`Erreur getUserList: ${error.message}`);
      return 'Erreur lors de la récupération des utilisateurs.';
    }
  }

  async getProgramList(language: string = 'fr'): Promise<string> {
    try {
      const programs = await prisma.program.findMany({
        include: {
          modules: {
            include: {
              module: {
                include: {
                  courses: {
                    include: {
                      course: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { id: 'asc' }
      });
      
      const headers = {
        fr: `Il y a ${programs.length} programme(s) :\n\n`,
        en: `There are ${programs.length} program(s):\n\n`,
        es: `Hay ${programs.length} programa(s):\n\n`,
        ar: `يوجد ${programs.length} برنامج (برامج):\n\n`,
        tn: `فمة ${programs.length} برنامج (برامج):\n\n`
      };
      let response = headers[language] || headers.fr;
      programs.forEach((program) => {
        const publishedLabel = {
          fr: program.published ? ' [Publié]' : ' [Brouillon]',
          en: program.published ? ' [Published]' : ' [Draft]',
          es: program.published ? ' [Publicado]' : ' [Borrador]',
          ar: program.published ? ' [منشور]' : ' [مسودة]'
        }[language] || (program.published ? ' [Publié]' : ' [Brouillon]');
        response += `${program.id}. ${program.name}${publishedLabel}\n`;

        // List modules and their courses
        program.modules.forEach(pm => {
          response += `   - Module: ${pm.module.name}\n`;
          pm.module.courses.forEach(mc => {
            response += `      • Cours associé: ${mc.course.title}\n`;
          });
        });
      });
      
      return response;
    } catch (error) {
      return 'Erreur lors de la récupération des programmes.';
    }
  }

  async getCourseList(language: string = 'fr'): Promise<string> {
    try {
      const courses = await prisma.course.findMany({
        select: { id: true, title: true },
        orderBy: { id: 'asc' }
      });
      
      const headers = {
        fr: `Il y a ${courses.length} cours :\n\n`,
        en: `There are ${courses.length} course(s):\n\n`,
        es: `Hay ${courses.length} curso(s):\n\n`,
        ar: `يوجد ${courses.length} دورة (دورات):\n\n`,
        tn: `فمة ${courses.length} كورس (كورسات):\n\n`
      };
      let response = headers[language] || headers.fr;
      courses.forEach((course) => {
        response += `${course.id}. ${course.title}\n`;
      });
      
      return response;
    } catch (error) {
      return 'Erreur lors de la récupération des cours.';
    }
  }

  async getContentList(language: string = 'fr'): Promise<string> {
    try {
      // Get all programs with their modules and courses to find content associations
      const programs = await prisma.program.findMany({
        include: {
          modules: {
            include: {
              module: {
                include: {
                  courses: {
                    include: {
                      course: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      // Get all contents
      const contents = await prisma.contenu.findMany({
        select: { id: true, title: true, coursAssocie: true },
        orderBy: { id: 'asc' }
      });
      
      // Create a map of course associations from programs
      const courseMap = new Map();
      programs.forEach(program => {
        program.modules.forEach(pm => {
          pm.module.courses.forEach(mc => {
            courseMap.set(mc.course.title, mc.course.title);
          });
        });
      });
      
      const headers = {
        fr: `Il y a ${contents.length} contenu(s) :\n\n`,
        en: `There are ${contents.length} content(s):\n\n`,
        es: `Hay ${contents.length} contenido(s):\n\n`,
        ar: `يوجد ${contents.length} محتوى (محتويات):\n\n`,
        tn: `فمة ${contents.length} محتوى (محتويات):\n\n`
      };
      let response = headers[language] || headers.fr;
      contents.forEach((content) => {
        const courseInfo = content.coursAssocie ? ` - Cours associé: ${content.coursAssocie}` : '';
        response += `${content.id}. ${content.title}${courseInfo}\n`;
      });
      
      return response;
    } catch (error) {
      return 'Erreur lors de la récupération des contenus.';
    }
  }

  // Cette méthode est maintenant un alias de getSeanceList pour éviter les duplications
  async getSeancesList(language: string = 'fr'): Promise<string> {
    return this.getSeanceList(language);
  }

  // Interface pour les extracteurs de contenu
  private contentExtractors = {
    PDF: async (filePath: string, content: any): Promise<{extractedContent: string, additionalInfo: string}> => {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        return {
          extractedContent: pdfData.text.substring(0, 3000),
          additionalInfo: `Pages: ${pdfData.numpages}`
        };
      } catch (error) {
        throw new Error(`Erreur lors de la lecture du PDF "${content.title}".`);
      }
    },
    
    WORD: async (filePath: string, content: any): Promise<{extractedContent: string, additionalInfo: string}> => {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        
        if (!result.value || result.value.trim().length === 0) {
          throw new Error('Contenu vide ou illisible');
        }
        
        const wordCount = result.value.split(/\s+/).filter(word => word.length > 0).length;
        
        return {
          extractedContent: result.value.substring(0, 3000),
          additionalInfo: `Mots: ${wordCount}`
        };
      } catch (error) {
        console.error(`Erreur lecture Word ${content.title}:`, error.message);
        throw new Error(`Impossible de lire le document Word "${content.title}": ${error.message}`);
      }
    },
    
    EXCEL: async (filePath: string, content: any): Promise<{extractedContent: string, additionalInfo: string}> => {
      try {
        const workbook = XLSX.readFile(filePath);
        const sheetNames = workbook.SheetNames;
        let excelContent = '';
        sheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          excelContent += `Feuille: ${sheetName}\n`;
          jsonData.slice(0, 10).forEach((row: any[]) => {
            if (row.length > 0) {
              excelContent += row.join(' | ') + '\n';
            }
          });
        });
        return {
          extractedContent: excelContent.substring(0, 3000),
          additionalInfo: `Feuilles: ${sheetNames.length}`
        };
      } catch (error) {
        return {
          extractedContent: `Fichier Excel: ${content.title}`,
          additionalInfo: `Format: Fichier Excel (lecture impossible)`
        };
      }
    },
    
    IMAGE: (filePath: string, content: any): {extractedContent: string, additionalInfo: string} => ({
      extractedContent: `Image éducative: ${content.title}`,
      additionalInfo: `Type d'image: Contenu visuel éducatif`
    }),
    
    VIDEO: (filePath: string, content: any): {extractedContent: string, additionalInfo: string} => ({
      extractedContent: `Vidéo éducative: ${content.title}`,
      additionalInfo: `Type de vidéo: Contenu audiovisuel éducatif`
    }),
    
    PPT: (filePath: string, content: any): {extractedContent: string, additionalInfo: string} => ({
      extractedContent: `Présentation PowerPoint: ${content.title}`,
      additionalInfo: `Format: Présentation PowerPoint`
    }),
    
    DEFAULT: (filePath: string, content: any): {extractedContent: string, additionalInfo: string} => ({
      extractedContent: `Contenu éducatif: ${content.title}`,
      additionalInfo: `Format: ${content.fileType || 'Inconnu'}`
    })
  };

  // Icônes pour les différents types de fichiers
  private fileIcons = {
    PDF: '📄',
    IMAGE: '🖼️',
    VIDEO: '🎥',
    WORD: '📄',
    EXCEL: '📈',
    PPT: '📊',
    DEFAULT: '📁'
  };

  // Rechercher et résumer du contenu par titre ou mots-clés
  async findAndSummarizeContent(searchTerm: string): Promise<string> {
    try {
      const contents = await prisma.contenu.findMany({
        where: {
          title: { contains: searchTerm, mode: 'insensitive' }
        },
        select: { id: true, title: true, type: true, fileType: true, published: true },
        take: 5
      });

      if (contents.length === 0) {
        return `Aucun contenu trouvé pour "${searchTerm}". Essayez avec d'autres mots-clés.`;
      }

      if (contents.length === 1) {
        return await this.summarizeContent(contents[0].id);
      }

      // Plusieurs résultats trouvés
      let response = `📚 **${contents.length} contenus trouvés pour "${searchTerm}":**\n\n`;
      for (const content of contents) {
        const icon = this.fileIcons[content.fileType as keyof typeof this.fileIcons] || this.fileIcons.DEFAULT;
        const status = content.published ? '✅' : '📝';
        response += `${icon} **${content.title}** (${content.type}) ${status}\n`;
      }
      response += `\n💡 Précisez le titre exact pour obtenir un résumé détaillé.`;
      return response;

    } catch (error) {
      this.logger.error(`Erreur recherche contenu "${searchTerm}": ${error.message}`);
      return 'Erreur lors de la recherche.';
    }
  }

  // Résumer le contenu de tous types de fichiers (optimisé)
  async summarizeContent(contentId: number): Promise<string> {
    try {
      const content = await prisma.contenu.findUnique({
        where: { id: contentId },
        select: { id: true, title: true, type: true, published: true, fileUrl: true, fileType: true }
      });
      
      if (!content) {
        return `Contenu ID ${contentId} introuvable.`;
      }
      
      const icon = this.fileIcons[content.fileType as keyof typeof this.fileIcons] || this.fileIcons.DEFAULT;
      const status = content.published ? 'Publié ✅' : 'Brouillon 📝';
      
      if (!content.fileUrl) {
        const prompt = this.buildEducationalPrompt(content.title, content.type);
        const summary = await this.askGroq(prompt);
        return `${icon} **${content.title}**\n\n${summary}\n\n---\n${content.type} | ${status}`;
      }
      
      const fileName = content.fileUrl.split('/').pop();
      if (!fileName) return 'Nom de fichier invalide.';
      
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      if (!fs.existsSync(filePath)) {
        return `Fichier manquant: ${content.title}`;
      }
      
      const fileType = content.fileType as keyof typeof this.contentExtractors || 'DEFAULT';
      const extractor = this.contentExtractors[fileType] || this.contentExtractors.DEFAULT;
      
      this.logger.log(`Extraction contenu ${content.fileType} pour: ${content.title}`);
      const { extractedContent, additionalInfo } = await extractor(filePath, content);
      this.logger.log(`Contenu extrait (${extractedContent.length} caractères): ${extractedContent.substring(0, 100)}...`);
      
      const hasContent = extractedContent.length > 50 && !extractedContent.includes('Document Word:') && !extractedContent.includes('Fichier Excel:') && !extractedContent.includes('Image éducative:');
      const prompt = hasContent 
        ? this.buildStructuredSummaryPrompt(content.title, content.fileType || 'UNKNOWN', extractedContent)
        : this.buildEducationalPrompt(content.title, content.type, undefined, content.fileType || undefined);
      
      const summary = await this.askGroq(prompt);
      
      return `${icon} **${content.title}**\n\n${summary}\n\n---\n${content.type} | ${content.fileType} | ${additionalInfo} | ${status}`;
      
    } catch (error) {
      this.logger.error(`Erreur résumé ${contentId}: ${error.message}`);
      return 'Erreur génération résumé.';
    }
  }

  // Construire un prompt pour résumé structuré de contenu éducatif
  private buildStructuredSummaryPrompt(title: string, fileType: string, content: string): string {
    return `Analysez ce document et créez un résumé ULTRA-CONCIS et structuré.

Contenu du document:
${content.substring(0, 4000)}

Créez un résumé suivant cette structure EXACTE:

### **🎯 Objectif Principal**
Créer une plateforme fullstack de formation modulaire permettant de diffuser des formations à travers des établissements (B2B) pour atteindre un maximum d'étudiants (B2C).

### **👥 Acteurs Clés**
- **Créateur de formation** : Conçoit le contenu
- **Formateur** : anime et évalue
- **Administrateur** : planifie et supervise  
- **Établissement** : achète et inscrit
- **Étudiant** : participe et évalue

### **📚 Structure Hiérarchique**
\`\`\`
Programme → Niveau → Module → Séance
Session (occurrence pour un groupe donné)
\`\`\`

### **⚡ Fonctionnalités Essentielles**

**1. Gestion des Programmes**
- Création par le créateur de contenu
- Organisation en niveaux/modules avec durées

**2. Gestion des Sessions** 
- Ouverture par l'administrateur
- Affectation formateur/programme/établissement
- Inscription étudiants

**3. Évaluations Croisées (par séance)**
- **Formateur évalue** : Présence, Implication (1-5), Compréhension (1-5)
- **Étudiant évalue** : Clarté (1-5), Pédagogie (1-5), Gestion temps (1-5)
- Commentaires et évaluation anonyme par pairs

### **🚀 Vision Long Terme**
Devenir la référence en formation digitale avec un modèle B2B2C standardisé et scalable.

Règles CRITIQUES:
- Utilisez cette structure EXACTE mais adaptez le contenu au document analysé
- Soyez ULTRA-CONCIS : maximum 1 ligne par point
- Utilisez des emojis et du markdown
- Concentrez-vous sur l'ESSENTIEL uniquement
- Adaptez les sections selon le contenu réel du document`;
  }

  // Construire un prompt pour contenu éducatif sans fichier
  private buildEducationalPrompt(title: string, type: string, description?: string, fileType?: string): string {
    const baseInfo = description ? `Description: ${description}\n` : '';
    const typeInfo = fileType ? ` (${fileType})` : '';
    
    return `Créez un résumé éducatif pour "${title}" (${type}${typeInfo}).

${baseInfo}

Format de réponse:
**📋 ${title}**

**🎯 Objectif**
[Quel est le but de ce contenu éducatif?]

**📖 Contenu principal**
• [Élément clé 1]
• [Élément clé 2]
• [Élément clé 3]

**🎓 Compétences développées**
• [Compétence 1]
• [Compétence 2]

**💼 Utilisation pratique**
[Comment appliquer ces connaissances?]

Soyez concis, pratique et utilisez un langage accessible.`;
  }

  // Méthode principale pour traiter les demandes de résumé
  async handleSummaryRequest(message: string): Promise<string | null> {
    this.logger.log(`Vérification demande résumé: "${message}"`);
    
    // Patterns pour détecter les demandes de résumé
    const summaryPatterns = [
      /(?:faire un |fais un |fais-moi un )?r[ée]sum[ée] (?:de |du |d'|des? )(.+)/i,
      /(?:r[ée]sumer? |summarize )(.+)/i,
      /(?:qu'est-ce que |c'est quoi )(.+)/i,
      /(?:summary of |summary for )(.+)/i,
      /(?:i want a summary of |give me a summary of )(.+)/i,
      /(?:cahier de charges|cahier des charges)/i
    ];

    for (const pattern of summaryPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        const searchTerm = match[1].trim();
        this.logger.log(`Terme de recherche détecté: "${searchTerm}"`);
        return await this.findAndSummarizeContent(searchTerm);
      }
      // Special case for direct "cahier de charges" mention
      if (pattern.test(message) && /cahier de charges/i.test(message)) {
        this.logger.log('Détection directe: cahier de charges');
        return await this.findAndSummarizeContent('cahier de charges');
      }
    }

    this.logger.log('Aucun pattern de résumé détecté');
    return null; // Pas une demande de résumé
  }

  // Méthode de debug pour lister tous les contenus
  async debugListAllContents(): Promise<string> {
    try {
      const contents = await prisma.contenu.findMany({
        select: { id: true, title: true, type: true, published: true },
        orderBy: { id: 'asc' }
      });
      
      let response = `🔍 **Debug - ${contents.length} contenus dans la base:**\n\n`;
      contents.forEach((content, index) => {
        const status = content.published ? '✅' : '📝';
        response += `${index + 1}. ID:${content.id} - "${content.title}" (${content.type}) ${status}\n`;
      });
      
      return response;
    } catch (error) {
      return `Erreur debug: ${error.message}`;
    }
  }

  // Récupérer l'historique d'un utilisateur
  async getMemoryHistory(userId: number, limit: number = 5): Promise<any[]> {
    return prisma.chatMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // Effacer la mémoire d'un utilisateur
  async clearMemory(userId: number): Promise<boolean> {
    const res = await prisma.chatMemory.deleteMany({
      where: { userId }
    });
    return res.count > 0;
  }

  // Mémoire temporaire pour stocker les informations utilisateur et le contexte de conversation
  private userMemoryStore: MemoryStore = {};

  // Vérifier si le message contient une présentation
  private extractUserName(message: string): string | null {
    // Patterns pour détecter les présentations
    const patterns = [
      /(?:je m'appelle|mon nom est|je suis) ([\w\s-]+)/i,
      /my name is ([\w\s-]+)/i,
      /i am ([\w\s-]+)/i,
      /call me ([\w\s-]+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        // Nettoyer et retourner le nom
        return match[1].trim().replace(/[.!?]$/, '');
      }
    }

    return null;
  }

  // Vérifier si le message demande le nom de l'utilisateur
  private isAskingForName(message: string): boolean {
    const patterns = [
      /quel est mon nom/i,
      /comment je m'appelle/i,
      /tu connais mon nom/i,
      /what is my name/i,
      /do you know my name/i,
      /what am i called/i
    ];
    
    return patterns.some(pattern => pattern.test(message));
  }

  // Récupérer le nom de l'utilisateur
  getUserName(userId: number): string | null {
    const userMemory = this.userMemoryStore[userId];
    if (userMemory) {
      // Update last access time
      userMemory.lastAccess = Date.now();
    }
    return userMemory?.name || null;
  }

  // Sauvegarder un échange dans la mémoire d'un utilisateur (optimisé)
  async saveToMemory(userId: number, userMessage: string, botResponse: string, context?: string): Promise<void> {
    if (!userId || !userMessage || !botResponse) return;
    
    try {
      // Vérification rapide de l'existence de l'utilisateur (cache possible)
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true }
      });
      
      if (!userExists) return;
      
      // Initialiser la mémoire utilisateur
      if (!this.userMemoryStore[userId]) {
        this.userMemoryStore[userId] = {
          lastAccess: Date.now()
        };
      } else {
        // Update last access time
        this.userMemoryStore[userId].lastAccess = Date.now();
      }
      
      // Extraire et sauvegarder le nom
      const userName = this.extractUserName(userMessage);
      if (userName) {
        this.userMemoryStore[userId].name = userName;
      }
      
      // Sauvegarder le contexte
      if (context) {
        this.userMemoryStore[userId].lastContext = context;
      }
      this.userMemoryStore[userId].lastQuery = userMessage;
      
      // Limiter la taille des messages pour éviter les entrées trop longues
      const truncatedUserMessage = userMessage.length > 500 ? userMessage.substring(0, 500) + '...' : userMessage;
      const truncatedBotResponse = botResponse.length > 1000 ? botResponse.substring(0, 1000) + '...' : botResponse;
      
      // Store user message
      await prisma.chatMemory.create({
        data: {
          userId,
          sessionId: `user_${userId}_${Date.now()}`,
          role: 'user',
          userMessage: truncatedUserMessage,
          content: truncatedUserMessage, // or whatever you want for 'content'
        }
      });
      // Store bot response
      await prisma.chatMemory.create({
        data: {
          userId,
          sessionId: `user_${userId}_${Date.now()}`,
          role: 'bot',
          userMessage: truncatedBotResponse,
          content: truncatedBotResponse, // or whatever you want for 'content'
        }
      });
      
      // Nettoyer l'historique ancien (garder seulement les 20 derniers)
      await this.cleanOldMemory(userId);
      
    } catch (error) {
      this.logger.error(`Erreur sauvegarde mémoire userId ${userId}: ${error.message}`);
    }
  }

  // Nettoyer l'ancien historique pour éviter l'accumulation
  private async cleanOldMemory(userId: number): Promise<void> {
    try {
      const oldMemories = await prisma.chatMemory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 20, // Garder les 20 plus récents
        select: { id: true }
      });
      
      if (oldMemories.length > 0) {
        await prisma.chatMemory.deleteMany({
          where: {
            id: { in: oldMemories.map(m => m.id) }
          }
        });
      }
    } catch (error) {
      this.logger.error(`Erreur nettoyage mémoire: ${error.message}`);
    }
  }
}