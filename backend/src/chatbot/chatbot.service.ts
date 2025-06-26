import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import axios from 'axios';

@Injectable()
export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  private async queryDatabase(query: string): Promise<any> {
    // Déterminer quelle table interroger en fonction de la requête
    const tables = {
      users: ['user', 'utilisateur', 'compte', 'email', 'profil'],
      programs: ['program', 'programme', 'formation', 'cours'],
      modules: ['module', 'chapitre', 'section'],
      courses: ['course', 'cours', 'leçon'],
      contenus: ['contenu', 'document', 'ressource', 'fichier'],
      quizzes: ['quiz', 'test', 'évaluation', 'question']
    };

    let results = {};
    
    // Recherche dans les utilisateurs
    if (tables.users.some(keyword => query.toLowerCase().includes(keyword))) {
      results['users'] = await this.prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true
        }
      });
    }
    
    // Recherche dans les programmes
    if (tables.programs.some(keyword => query.toLowerCase().includes(keyword))) {
      results['programs'] = await this.prisma.program.findMany({
        take: 5,
        include: {
          modules: {
            include: {
              module: true
            }
          }
        }
      });
    }
    
    // Recherche dans les modules
    if (tables.modules.some(keyword => query.toLowerCase().includes(keyword))) {
      results['modules'] = await this.prisma.module.findMany({
        take: 5,
        include: {
          courses: {
            include: {
              course: true
            }
          }
        }
      });
    }
    
    // Recherche dans les cours
    if (tables.courses.some(keyword => query.toLowerCase().includes(keyword))) {
      results['courses'] = await this.prisma.course.findMany({
        take: 5,
        include: {
          courseContenus: {
            include: {
              contenu: true
            }
          }
        }
      });
    }
    
    // Recherche dans les contenus
    if (tables.contenus.some(keyword => query.toLowerCase().includes(keyword))) {
      results['contenus'] = await this.prisma.contenu.findMany({
        take: 5,
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { type: { equals: query.toUpperCase() as any } }
          ]
        }
      });
    }
    
    // Recherche dans les quizzes
    if (tables.quizzes.some(keyword => query.toLowerCase().includes(keyword))) {
      results['quizzes'] = await this.prisma.quiz.findMany({
        take: 5,
        include: {
          questions: true
        }
      });
    }
    
    return results;
  }

  async processMessage(message: string): Promise<string> {
    try {
      // Vérifier si c'est une requête SQL
      if (message.toLowerCase().includes('select') && message.toLowerCase().includes('from')) {
        const results = await this.executeQuery(message);
        return `Résultats de la requête: ${JSON.stringify(results, null, 2)}`;
      }
      
      // 1. Extraire l'intention de la requête
      const dbResults = await this.queryDatabase(message);
      
      // 2. Appeler OpenAI pour générer une réponse basée sur les résultats de la base de données
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Tu es un assistant pour une plateforme LMS (Learning Management System). 
                       Voici les données de la base de données en réponse à la requête de l'utilisateur: 
                       ${JSON.stringify(dbResults, null, 2)}`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur lors du traitement du message:', error);
      return "Je suis désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer plus tard.";
    }
  }
  
  async executeQuery(query: string): Promise<any> {
    try {
      // Vérifier que la requête est en lecture seule (SELECT)
      if (!query.toLowerCase().trim().startsWith('select')) {
        throw new Error('Seules les requêtes SELECT sont autorisées');
      }
      
      // Exécuter la requête SQL brute
      const results = await this.prisma.$queryRawUnsafe(query);
      return results;
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la requête SQL:', error);
      return { error: error.message };
    }
  }
}