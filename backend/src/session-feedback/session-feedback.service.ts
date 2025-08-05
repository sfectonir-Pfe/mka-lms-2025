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

    // Vérification de l'existence de l'utilisateur
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Utilisateur ${userId} introuvable`);

    // Calcul de la note moyenne avec le système pondéré
    const averageRating = this.calculateWeightedScore(ratings);

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
          comments: rest.comments,
          ratings: ratings ? JSON.stringify(ratings) : null,
          formData: JSON.stringify(rest),
          user: { connect: { id: userId } }
        },
      });

      await this.prisma.sessionFeedbackList.updateMany({
        where: { sessionId, userId },
        data: {
          feedback: feedback || this.generateFeedbackMessage({ ratings, ...rest }),
          nom: user.name ?? '',
          email: user.email,
          sessionComments,
          trainerComments,
          teamComments,
          suggestions,
        },
      });
    } else {
      // Création d'un nouveau feedback
      await this.prisma.$transaction([
        this.prisma.sessionFeedback.create({
          data: {
            sessionId,
            userId,
            rating: averageRating,
            comments: rest.comments,
            ratings: ratings ? JSON.stringify(ratings) : null,
            formData: JSON.stringify(rest),
            user: { connect: { id: userId } }
          }
        }),
        this.prisma.sessionFeedbackList.create({
          data: {
            sessionId,
            userId,
            feedback: feedback || this.generateFeedbackMessage({ ratings, ...rest }),
            nom: user.name ?? '',
            email: user.email,
            sessionComments,
            trainerComments,
            teamComments,
            suggestions,
          },
        }),
      ]);
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
    const allFeedbacks = await this.prisma.sessionFeedbackList.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    const latestMap = new Map<number, number>();
    allFeedbacks.forEach(fb => {
      if (!latestMap.has(fb.userId)) latestMap.set(fb.userId, fb.id);
    });

    const idsToDelete = allFeedbacks
      .filter(fb => latestMap.get(fb.userId) !== fb.id)
      .map(fb => fb.id);

    if (idsToDelete.length > 0) {
      await this.prisma.sessionFeedbackList.deleteMany({ 
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
    // Récupérer les feedbacks détaillés depuis SessionFeedbackList
    const feedbackList = await this.prisma.sessionFeedbackList.findMany({
      where: { sessionId, userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    // Récupérer aussi les ratings depuis SessionFeedback si disponibles
    const sessionFeedbacks = await this.prisma.sessionFeedback.findMany({
      where: { sessionId, userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    // Combiner les données des deux tables
    const combinedFeedbacks = feedbackList.map(fb => {
      // Trouver le rating correspondant dans SessionFeedback
      const matchingRating = sessionFeedbacks.find(sf =>
        Math.abs(new Date(sf.createdAt).getTime() - new Date(fb.createdAt).getTime()) < 60000 // 1 minute de différence
      );

      // Parser les données JSON si disponibles
      let parsedRatings = null;
      let parsedFormData = null;

      try {
        if (matchingRating?.ratings) {
          parsedRatings = JSON.parse(matchingRating.ratings);
        }
        if (matchingRating?.formData) {
          parsedFormData = JSON.parse(matchingRating.formData);
        }
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }

      return {
        id: fb.id,
        sessionId: fb.sessionId,
        userId: fb.userId,
        rating: matchingRating?.rating || null,
        comments: fb.feedback,
        feedback: fb.feedback,
        sessionComments: fb.sessionComments,
        trainerComments: fb.trainerComments,
        teamComments: fb.teamComments,
        suggestions: fb.suggestions,
        ratings: parsedRatings, // Ratings détaillés du formulaire
        formData: parsedFormData, // Données complètes du formulaire
        createdAt: fb.createdAt,
        studentName: fb.nom || fb.user?.name || '',
        studentEmail: fb.email || fb.user?.email || '',
        user: fb.user,
      };
    });

    return combinedFeedbacks;
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

    // Nouvelle logique de calcul des scores
    const results = [...uniqueFeedbacks.values()].map((fb: any) => {
      let finalScore = 0;
      let scoreLabel = 'Non évalué';
      let emoji = '❓';

      // Nouvelle méthode de calcul basée sur un système de points pondérés
      if (fb.ratings) {
        try {
          const ratingsData = typeof fb.ratings === 'string' ? JSON.parse(fb.ratings) : fb.ratings;

          if (ratingsData && typeof ratingsData === 'object') {
            // Définir les poids pour chaque critère (total = 1.0)
            const criteriaWeights = {
              overallRating: 0.25,        // 25% - Note globale
              contentRelevance: 0.20,     // 20% - Pertinence du contenu
              learningObjectives: 0.15,   // 15% - Atteinte des objectifs
              skillImprovement: 0.15,     // 15% - Amélioration des compétences
              satisfactionLevel: 0.10,    // 10% - Satisfaction
              sessionStructure: 0.10,     // 10% - Structure
              knowledgeGain: 0.05         // 5% - Acquisition de connaissances
            };

            let totalWeightedScore = 0;
            let totalWeight = 0;

            // Calculer le score pondéré
            Object.entries(criteriaWeights).forEach(([criterion, weight]) => {
              const rating = ratingsData[criterion];
              if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
                totalWeightedScore += rating * weight;
                totalWeight += weight;
              }
            });

            // Si on a au moins 50% des critères pondérés évalués
            if (totalWeight >= 0.5) {
              finalScore = Math.round((totalWeightedScore / totalWeight) * 10) / 10;

              // Déterminer le label et l'emoji basés sur le score
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
          }
        } catch (error) {
          console.error('Erreur lors du parsing des ratings:', error);
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
      const score = this.calculateWeightedScore(fb.ratings);
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

  private calculateWeightedScore(ratings: any): number {
    if (!ratings) return 0;

    try {
      const ratingsData = typeof ratings === 'string' ? JSON.parse(ratings) : ratings;

      if (!ratingsData || typeof ratingsData !== 'object') return 0;

      // Définir les poids pour chaque critère
      const criteriaWeights = {
        overallRating: 0.25,
        contentRelevance: 0.20,
        learningObjectives: 0.15,
        skillImprovement: 0.15,
        satisfactionLevel: 0.10,
        sessionStructure: 0.10,
        knowledgeGain: 0.05
      };

      let totalWeightedScore = 0;
      let totalWeight = 0;

      Object.entries(criteriaWeights).forEach(([criterion, weight]) => {
        const rating = ratingsData[criterion];
        if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
          totalWeightedScore += rating * weight;
          totalWeight += weight;
        }
      });

      return totalWeight >= 0.5 ? Math.round((totalWeightedScore / totalWeight) * 10) / 10 : 0;
    } catch (error) {
      console.error('Erreur lors du calcul du score pondéré:', error);
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
      const score = this.calculateWeightedScore(fb.ratings);
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
      const score = this.calculateWeightedScore(fb.ratings);
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