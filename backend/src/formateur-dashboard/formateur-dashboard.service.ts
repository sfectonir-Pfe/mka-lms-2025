import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FormateurDashboardService {
  constructor(private prisma: PrismaService) {}

  async getAllFormateurSessions() {
    const seances = await this.prisma.seanceFormateur.findMany({
      include: {
        session2: {
          include: {
            userSessions2: true,
          },
        },
      },
    });

    const sessionsMap = new Map<number, any>();

    for (const seance of seances) {
      const session = seance.session2;
      if (!session) continue;

      if (!sessionsMap.has(session.id)) {
        sessionsMap.set(session.id, {
          sessionId: session.id,
          sessionName: session.name,
          status: session.status,
          totalUsers: session.userSessions2.length,
          seances: []
        });
      }

      // Add seance to the session
      sessionsMap.get(session.id).seances.push({
        seanceId: seance.id,
        title: seance.title,
        startTime: seance.startTime,
        formateurId: seance.formateurId
      });
    }

    return Array.from(sessionsMap.values());
  }

  async getFormateurFeedbacks(formateurId?: number) {
    try {
      // Get seance feedbacks where formateur ratings exist
      const feedbacks = await this.prisma.seanceFeedback.findMany({
        where: {
          AND: [
            formateurId ? { 
              seance: { 
                formateurId: formateurId 
              } 
            } : {},
            {
              OR: [
                { trainerRating: { gt: 0 } },
                { trainerClarity: { gt: 0 } },
                { trainerAvailability: { gt: 0 } },
                { trainerPedagogy: { gt: 0 } },
                { trainerInteraction: { gt: 0 } }
              ]
            }
          ]
        },
        include: {
          seance: {
            select: { id: true, title: true, formateurId: true, startTime: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Calculate statistics using trainer ratings
      const totalFeedbacks = feedbacks.length;
      
      const averageRating = totalFeedbacks > 0 
        ? (feedbacks.reduce((sum, f) => {
            const ratings = [
              f.trainerRating || 0,
              f.trainerClarity || 0, 
              f.trainerAvailability || 0,
              f.trainerPedagogy || 0,
              f.trainerInteraction || 0
            ].filter(r => r > 0);
            const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
            return sum + avgRating;
          }, 0) / totalFeedbacks).toFixed(1)
        : '0';

      // Group by seance
      const feedbacksBySeance = feedbacks.reduce((acc, feedback) => {
        const seanceId = feedback.seanceId || 0;
        const seanceKey = seanceId.toString();
        if (!acc[seanceKey]) {
          acc[seanceKey] = {
            seanceId,
            seanceTitle: feedback.seance?.title || `Séance ${seanceId}`,
            startTime: feedback.seance?.startTime,
            feedbacks: [],
            averageRating: 0,
            totalFeedbacks: 0
          };
        }
        acc[seanceKey].feedbacks.push(feedback);
        return acc;
      }, {});

      // Calculate averages per seance
      Object.values(feedbacksBySeance).forEach((seance: any) => {
        seance.totalFeedbacks = seance.feedbacks.length;
        seance.averageRating = seance.totalFeedbacks > 0
          ? (seance.feedbacks.reduce((sum, f) => {
              const ratings = [
                f.trainerRating || 0,
                f.trainerClarity || 0,
                f.trainerAvailability || 0,
                f.trainerPedagogy || 0,
                f.trainerInteraction || 0
              ].filter(r => r > 0);
              const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
              return sum + avgRating;
            }, 0) / seance.totalFeedbacks).toFixed(1)
          : '0';
      });

      // Get top 3 seances based on ratings
      const topSeances = Object.values(feedbacksBySeance)
        .filter((s: any) => parseFloat(s.averageRating) > 0)
        .sort((a: any, b: any) => {
          // Sort by average rating first, then by number of feedbacks
          if (parseFloat(b.averageRating) !== parseFloat(a.averageRating)) {
            return parseFloat(b.averageRating) - parseFloat(a.averageRating);
          }
          return b.totalFeedbacks - a.totalFeedbacks;
        })
        .slice(0, 3);

      return {
        totalFeedbacks,
        averageRating: parseFloat(averageRating),
        generalAverage: parseFloat(averageRating), // Note moyenne générale
        feedbacksBySeance: Object.values(feedbacksBySeance),
        topSeances, // Top 3 séances
        recentFeedbacks: feedbacks.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching formateur feedbacks:', error);
      return {
        totalFeedbacks: 0,
        averageRating: 0,
        generalAverage: 0,
        feedbacksBySeance: [],
        topSeances: [],
        recentFeedbacks: []
      };
    }
  }

  async getTopFormateurs() {
    try {
      // Get all formateurs with their feedbacks
      const formateurs = await this.prisma.user.findMany({
        where: { role: 'Formateur' },
        include: {
          feedbacksReceived: {
            select: { rating: true, comment: true }
          }
        }
      });

      // Calculate statistics for each formateur
      const formateurStats = formateurs.map(formateur => {
        const feedbacks = formateur.feedbacksReceived;
        const totalFeedbacks = feedbacks.length;
        const averageRating = totalFeedbacks > 0
          ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
          : 0;

        // Mock rewards/gifts data (you can implement actual rewards system later)
        const mockRewards = [
          'Certificat d\'Excellence',
          'Bon d\'achat 50€',
          'Formation gratuite',
          'Badge Formateur Expert'
        ];

        return {
          id: formateur.id,
          name: formateur.name,
          email: formateur.email,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalFeedbacks,
          feedbackPoints: Math.round(averageRating * totalFeedbacks),
          rewards: totalFeedbacks > 5 ? mockRewards.slice(0, Math.min(2, Math.floor(averageRating))) : []
        };
      });

      // Sort by feedback points (rating * count) and take top 3
      const topFormateurs = formateurStats
        .filter(f => f.totalFeedbacks > 0)
        .sort((a, b) => b.feedbackPoints - a.feedbackPoints)
        .slice(0, 3);

      return topFormateurs;
    } catch (error) {
      console.error('Error fetching top formateurs:', error);
      return [];
    }
  }
}
