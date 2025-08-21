import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';

@Injectable()
export class SessionFeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const { sessionId, userId, feedback, sessionComments, trainerComments, teamComments, suggestions, ratings, ...rest } = dto;
    
    // Validation des champs obligatoires
    if (!userId) throw new BadRequestException('userId requis');
    if (!sessionId) throw new BadRequestException('sessionId requis');
    
    // Validation des types
    if (isNaN(Number(userId))) throw new BadRequestException('userId doit être un nombre valide');
    if (isNaN(Number(sessionId))) throw new BadRequestException('sessionId doit être un nombre valide');

    // Vérification de l'existence de l'utilisateur
    let user;
    try {
      user = await this.prisma.user.findUnique({ where: { id: Number(userId) } });
      if (!user) throw new NotFoundException(`Utilisateur ${userId} introuvable`);
    } catch (error) {
      console.error('Erreur lors de la recherche utilisateur:', error);
      throw new BadRequestException('Erreur lors de la validation de l\'utilisateur');
    }

    // Handle emoji ratings from frontend
    const processedRatings = this.processFrontendRatings(ratings);
    
    // Calcul de la note moyenne avec le système pondéré
    const averageRating = this.calculateWeightedScore(processedRatings);

    // Vérification si un feedback existe déjà pour cette session et cet utilisateur
    const existingFeedback = await this.prisma.sessionFeedback.findFirst({ 
      where: { sessionId, userId }, 
      orderBy: { createdAt: 'desc' } 
    });

    if (existingFeedback) {
      // Mise à jour du feedback existant
      await this.prisma.sessionFeedback.update({
        where: { id: existingFeedback.id },
        data: {
          rating: averageRating,
          comments: rest.comments || JSON.stringify({ ratings, formData: rest }),
          userId: Number(userId)
        },
      });

      // Note: sessionFeedbackList n'existe pas, on stocke tout dans sessionFeedback
      // Les données détaillées sont dans le champ comments comme JSON
    } else {
      // Création d'un nouveau feedback
      try {
        await this.prisma.sessionFeedback.create({
          data: {
            sessionId: Number(sessionId),
            userId: Number(userId),
            rating: averageRating,
            comments: JSON.stringify({
              feedback: feedback || this.generateFeedbackMessage({ ratings, ...rest }),
              sessionComments,
              trainerComments,
              teamComments,
              suggestions,
              ratings,
              formData: rest,
              userInfo: {
                nom: user.name ?? '',
                email: user.email
              }
            })
          }
        });
      } catch (error) {
        console.error('Erreur lors de la création du feedback:', error);
        throw new BadRequestException('Erreur lors de la sauvegarde du feedback');
      }
    }

    // Nettoyage des anciens feedbacks
    await this.cleanupOldFeedbacks(sessionId);
    
    return { 
      message: 'Feedback enregistré avec succès',
      averageRating: averageRating,
    };
  }

  private generateFeedbackMessage(dto: any): string {
    const parts: string[] = [];
    
    // Ajout des évaluations
    if (dto.ratings) {
      const avg = this.calculateWeightedScore(dto.ratings);
      if (avg > 0) {
        parts.push(`Note moyenne: ${avg.toFixed(1)}/5`);
      }
    }

    // Ajout des commentaires
    if (dto.sessionComments) parts.push(`Commentaires sur la session: ${dto.sessionComments}`);
    if (dto.trainerComments) parts.push(`Commentaires sur le formateur: ${dto.trainerComments}`);
    if (dto.teamComments) parts.push(`Commentaires sur l'équipe: ${dto.teamComments}`);
    if (dto.suggestions) parts.push(`Suggestions: ${dto.suggestions}`);
    if (dto.improvementAreas) parts.push(`Zones d'amélioration: ${dto.improvementAreas}`);
    if (dto.wouldRecommend) parts.push(`Recommanderait: ${dto.wouldRecommend}`);

    return parts.join('\n\n') || 'Feedback de session soumis';
  }

  async cleanupOldFeedbacks(sessionId: number) {
    const allFeedbacks = await this.prisma.sessionFeedback.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    const latestMap = new Map<number, number>();
    allFeedbacks.forEach(fb => {
      if (fb.userId && !latestMap.has(fb.userId)) latestMap.set(fb.userId, fb.id);
    });

    const idsToDelete = allFeedbacks
      .filter(fb => fb.userId && latestMap.get(fb.userId) !== fb.id)
      .map(fb => fb.id);

    if (idsToDelete.length > 0) {
      await this.prisma.sessionFeedback.deleteMany({ 
        where: { id: { in: idsToDelete } } 
      });
    }
  }

  async getSessionFeedbacks(sessionId: number) {
    const feedbacks = await this.prisma.sessionFeedback.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    return feedbacks.map(fb => {
      let coordinates = null;
      try {
        const commentsData = JSON.parse(fb.comments || '{}');
        if (commentsData.coordinates) {
          coordinates = commentsData.coordinates;
        }
      } catch {
        // Ignore parse errors
      }

      return {
        ...fb,
        studentName: fb.user?.name || '',
        studentEmail: fb.user?.email || '',
        coordinates,
      };
    });
  }

  async getStudentFeedbacks(sessionId: number, userId: number) {
    // Récupérer les feedbacks depuis SessionFeedback uniquement
    const sessionFeedbacks = await this.prisma.sessionFeedback.findMany({
      where: { sessionId, userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    // Parser et structurer les données
    const structuredFeedbacks = sessionFeedbacks.map(fb => {
      let parsedComments = null;
      let parsedRatings = null;
      let parsedFormData = null;
      let feedback = '';
      let sessionComments = '';
      let trainerComments = '';
      let teamComments = '';
      let suggestions = '';

      try {
        if (fb.comments) {
          parsedComments = JSON.parse(fb.comments);
          if (parsedComments) {
            const data = parsedComments as any;
            feedback = data.feedback || '';
            sessionComments = data.sessionComments || '';
            trainerComments = data.trainerComments || '';
            teamComments = data.teamComments || '';
            suggestions = data.suggestions || '';
            parsedRatings = data.ratings || null;
            parsedFormData = data.formData || null;
          }
        }
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        feedback = fb.comments || '';
      }

      return {
        id: fb.id,
        sessionId: fb.sessionId,
        userId: fb.userId,
        rating: fb.rating,
        comments: feedback,
        feedback: feedback,
        sessionComments,
        trainerComments,
        teamComments,
        suggestions,
        ratings: parsedRatings,
        formData: parsedFormData,
        createdAt: fb.createdAt,
        studentName: (parsedComments as any)?.userInfo?.nom || fb.user?.name || '',
        studentEmail: (parsedComments as any)?.userInfo?.email || fb.user?.email || '',
        user: fb.user,
      };
    });

    return structuredFeedbacks;
  }

  async getSessionFeedbackList(sessionId: number) {
    const feedbacks = await this.prisma.sessionFeedback.findMany({
      where: { sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Unicité par utilisateur (le plus récent)
    const uniqueFeedbacks = new Map<number, any>();
    feedbacks.forEach(fb => {
      if (fb.userId && !uniqueFeedbacks.has(fb.userId)) {
        uniqueFeedbacks.set(fb.userId, fb);
      }
    });

    // Calcul des scores avec la méthode centralisée
    const results = [...uniqueFeedbacks.values()].map((fb: any) => {
      let ratingsData = null;
      try {
        if (fb.comments) {
          const parsedComments = JSON.parse(fb.comments);
          ratingsData = parsedComments.ratings;
        }
      } catch (error) {
        console.error('Error parsing comments for ratings:', error);
      }
      
      // Utiliser la méthode centralisée pour calculer le score
      const finalScore = this.calculateWeightedScore(ratingsData);
      
      let scoreLabel = 'Non évalué';
      let emoji = '❓';
      
      if (finalScore > 0) {
        if (finalScore >= 4.5) {
          scoreLabel = 'Exceptionnel';
          emoji = '🌟';
        } else if (finalScore >= 4.0) {
          scoreLabel = 'Excellent';
          emoji = '🤩';
        } else if (finalScore >= 3.5) {
          scoreLabel = 'Très bien';
          emoji = '😊';
        } else if (finalScore >= 3.0) {
          scoreLabel = 'Bien';
          emoji = '🙂';
        } else if (finalScore >= 2.5) {
          scoreLabel = 'Moyen';
          emoji = '😐';
        } else if (finalScore >= 2.0) {
          scoreLabel = 'Insuffisant';
          emoji = '😕';
        } else {
          scoreLabel = 'Très insuffisant';
          emoji = '😞';
        }
      }

      return {
        id: fb.id,
        userId: fb.userId,
        studentName: fb.user?.name || 'Utilisateur inconnu',
        studentEmail: fb.user?.email || 'Email non disponible',
        fullFeedback: fb.comments || '',
        averageRating: finalScore > 0 ? finalScore : null,
        scoreLabel,
        emoji,
      };
    });

    return results;
  }

  async getStats() {
    const feedbacks = await this.prisma.sessionFeedback.findMany({
      include: { user: true },
    });

    const totalFeedbacks = feedbacks.length;

    // Nouvelle logique de calcul des statistiques
    let totalScore = 0;
    let validScores = 0;

    feedbacks.forEach(fb => {
      let ratingsData = null;
      try {
        if (fb.comments) {
          const parsedComments = JSON.parse(fb.comments);
          ratingsData = parsedComments.ratings;
        }
      } catch (error) {
        console.error('Error parsing comments for ratings:', error);
      }
      
      const score = this.calculateWeightedScore(ratingsData);
      if (score > 0) {
        totalScore += score;
        validScores++;
      }
    });

    const averageRating = validScores > 0
      ? parseFloat((totalScore / validScores).toFixed(1))
      : 0;

    return {
      totalFeedbacks,
      averageRating,
      ratingDistribution: this.getScoreDistribution(feedbacks)
    };
  }

  private processFrontendRatings(ratings: any): any {
    if (!ratings || typeof ratings !== 'object') return {};

    const emojiMap: Record<string, number> = {
      '😞': 1,
      '😐': 2,
      '🙂': 3,
      '😊': 4,
      '🤩': 5
    };

    const processed: any = {};
    Object.entries(ratings).forEach(([key, value]) => {
      if (typeof value === 'string' && emojiMap[value]) {
        processed[key] = emojiMap[value];
      } else if (typeof value === 'number') {
        processed[key] = value;
      }
    });

    return processed;
  }

  private calculateWeightedScore(ratings: any): number {
    if (!ratings) return 0;

    try {
      const ratingsData = typeof ratings === 'string' ? JSON.parse(ratings) : ratings;

      if (!ratingsData || typeof ratingsData !== 'object') return 0;

      // Handle emoji ratings by converting them to numeric
      const processedRatings = this.processFrontendRatings(ratingsData);

      // Calculer la moyenne simple de toutes les réponses emoji
      const validRatings = Object.values(processedRatings)
        .filter(rating => typeof rating === 'number' && rating >= 1 && rating <= 5) as number[];

      if (validRatings.length === 0) return 0;

      const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
      const average = sum / validRatings.length;
      
      return Math.round(average * 10) / 10;
    } catch (error) {
      console.error('Erreur lors du calcul du score moyen:', error);
      return 0;
    }
  }

  private getScoreDistribution(feedbacks: any[]) {
    const distribution = {
      'Exceptionnel': 0,
      'Excellent': 0,
      'Très bien': 0,
      'Bien': 0,
      'Moyen': 0,
      'Insuffisant': 0,
      'Très insuffisant': 0
    };

    feedbacks.forEach(fb => {
      let ratingsData = null;
      try {
        if (fb.comments) {
          const parsedComments = JSON.parse(fb.comments);
          ratingsData = parsedComments.ratings;
        }
      } catch (error) {
        console.error('Error parsing comments for ratings:', error);
      }
      
      const score = this.calculateWeightedScore(ratingsData);
      if (score >= 4.5) distribution['Exceptionnel']++;
      else if (score >= 4.0) distribution['Excellent']++;
      else if (score >= 3.5) distribution['Très bien']++;
      else if (score >= 3.0) distribution['Bien']++;
      else if (score >= 2.5) distribution['Moyen']++;
      else if (score >= 2.0) distribution['Insuffisant']++;
      else if (score > 0) distribution['Très insuffisant']++;
    });

    return distribution;
  }

  async getAnalytics(range = '6months') {
    const feedbacks = await this.prisma.sessionFeedback.findMany({
      include: { user: true },
    });

    const filteredFeedbacks = this.filterByTimeRange(feedbacks, range);

    // Nouvelle logique de calcul des analytics
    let totalScore = 0;
    let validScores = 0;

    filteredFeedbacks.forEach(fb => {
      let ratingsData = null;
      try {
        if (fb.comments) {
          const parsedComments = JSON.parse(fb.comments);
          ratingsData = parsedComments.ratings;
        }
      } catch (error) {
        console.error('Error parsing comments for ratings:', error);
      }
      
      const score = this.calculateWeightedScore(ratingsData);
      if (score > 0) {
        totalScore += score;
        validScores++;
      }
    });

    return {
      averageRating: validScores > 0
        ? parseFloat((totalScore / validScores).toFixed(1))
        : 0,
      ratingDistribution: this.getScoreDistribution(filteredFeedbacks),
      timelineData: this.generateTimelineData(filteredFeedbacks, range)
    };
  }

  private filterByTimeRange(feedbacks: any[], range: string) {
    const now = new Date();
    let cutoff: Date;

    switch (range) {
      case '7days':
        cutoff = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30days':
        cutoff = new Date(now.setDate(now.getDate() - 30));
        break;
      case '3months':
        cutoff = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        cutoff = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1year':
        cutoff = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return feedbacks;
    }

    return feedbacks.filter(fb => new Date(fb.createdAt) >= cutoff);
  }

  private generateTimelineData(feedbacks: any[], range: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (range === '7days' || range === '30days') {
      const dailyData: Record<string, number> = {};
      const days = range === '7days' ? 7 : 30;
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const label = `${date.getDate()} ${months[date.getMonth()]}`;
        dailyData[label] = 0;
      }

      feedbacks.forEach(fb => {
        const date = new Date(fb.createdAt);
        const label = `${date.getDate()} ${months[date.getMonth()]}`;
        if (dailyData[label] !== undefined) dailyData[label]++;
      });

      return Object.entries(dailyData)
        .reverse()
        .map(([date, count]) => ({ date, count }));
    }

    // Par mois pour les plages plus longues
    const monthlyData: Record<string, number> = {};
    const monthCount = range === '3months' ? 3 : range === '6months' ? 6 : 12;
    
    for (let i = 0; i < monthCount; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const label = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[label] = 0;
    }

    feedbacks.forEach(fb => {
      const date = new Date(fb.createdAt);
      const label = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyData[label] !== undefined) monthlyData[label]++;
    });

    return Object.entries(monthlyData)
      .reverse()
      .map(([month, count]) => ({ month, count }));
  }
}