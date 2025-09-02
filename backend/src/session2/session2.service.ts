import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { $Enums } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class Session2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(data: any, file?: Express.Multer.File) {
    const { name, programId, startDate, endDate } = data;

    const programStructure = await this.prisma.buildProgram.findFirst({
      where: { programId: Number(programId) },
      include: {
        modules: {
          include: {
            module: true,
            courses: {
              include: {
                course: true,
                contenus: {
                  include: { contenu: true },
                },
              },
            },
          },
        },
      },
    });

    if (!programStructure) {
      throw new Error('Structure du programme introuvable.');
    }

    const session2 = await this.prisma.session2.create({
      data: {
        name,
        programId: Number(programId),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        imageUrl: file
          ? `http://localhost:8000/uploads/sessions/${file.filename}`
          : undefined,
      },
    });

    for (const mod of programStructure.modules) {
      const s2mod = await this.prisma.session2Module.create({
        data: {
          session2Id: session2.id,
          moduleId: mod.moduleId,
        },
      });

      for (const course of mod.courses) {
        const s2course = await this.prisma.session2Course.create({
          data: {
            session2ModuleId: s2mod.id,
            courseId: course.courseId,
          },
        });

        for (const ct of course.contenus) {
          await this.prisma.session2Contenu.create({
            data: {
              session2CourseId: s2course.id,
              contenuId: ct.contenuId,
            },
          });
        }
      }
    }

    return {
      message: '✅ Session2 créée avec structure copiée avec succès',
    };
  }

  async remove(id: number) {
    return this.prisma.session2.delete({ where: { id } });
  }

  async findAll() {
    const sessions = await this.prisma.session2.findMany({
      include: {
        program: true,
        session2Modules: {
          include: {
            module: true,
            courses: {
              include: {
                course: true,
                contenus: {
                  include: { contenu: true },
                },
              },
            },
          },
        },
      },
    });

    const sessionsWithFeedback = await Promise.all(
      sessions.map(async (session) => {
        const feedbacks = await this.prisma.sessionFeedback.findMany({
          where: { sessionId: session.id },
          select: { rating: true, comments: true },
        });

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
          ? Math.round((totalScore / validScores) * 10) / 10
          : null;

        return {
          ...session,
          averageRating,
          feedbackCount: feedbacks.length,
        };
      })
    );

    return sessionsWithFeedback;
  }

  async addUserToSession(session2Id: number, email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const exists = await this.prisma.userSession2.findUnique({
      where: { userId_session2Id: { userId: user.id, session2Id } },
    });
    if (exists)
      throw new BadRequestException('Utilisateur déjà dans la session');

    await this.prisma.userSession2.create({
      data: { userId: user.id, session2Id },
    });

    return { message: 'Utilisateur ajouté à la session !' };
  }

  async getUsersForSession(session2Id: number) {
    const assigned = await this.prisma.userSession2.findMany({
      where: { session2Id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
            role: true,
          },
        },
      },
    });
    return assigned.map((item) => item.user);
  }

  async removeUserFromSession(session2Id: number, userId: number) {
    return this.prisma.userSession2.deleteMany({
      where: { session2Id, userId },
    });
  }

  async updateStatus(id: number, status: string) {
    if (
      !['ACTIVE', 'INACTIVE', 'COMPLETED', 'ARCHIVED'].includes(status)
    ) {
      throw new BadRequestException('Invalid status');
    }

    // Récupérer les informations de la session avant la mise à jour
    const session = await this.prisma.session2.findUnique({
      where: { id },
      include: {
        program: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Mettre à jour le statut
    const updatedSession = await this.prisma.session2.update({
      where: { id },
      data: { status: { set: status as $Enums.Session2Status } },
    });

    // Si la session devient ACTIVE, envoyer des emails aux utilisateurs
    if (status === 'ACTIVE') {
      try {
        await this.sendSessionActivationEmails(id, session);
        console.log(`✅ Emails de notification envoyés pour la session ${id} (${session.name})`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'envoi des emails pour la session ${id}:`, error);
        // Ne pas faire échouer la mise à jour si l'envoi d'emails échoue
      }
    }

    return updatedSession;
  }

  private async sendSessionActivationEmails(sessionId: number, session: any) {
    // Récupérer tous les utilisateurs de la session
    const userSessions = await this.prisma.userSession2.findMany({
      where: { session2Id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (userSessions.length === 0) {
      console.log(`ℹ️ Aucun utilisateur trouvé pour la session ${sessionId}`);
      return;
    }

    // Formater les dates
    const startDate = session.startDate ? new Date(session.startDate).toLocaleDateString('fr-FR') : 'Non définie';
    const endDate = session.endDate ? new Date(session.endDate).toLocaleDateString('fr-FR') : 'Non définie';

    // Envoyer un email à chaque utilisateur
    const emailPromises = userSessions.map(async (userSession) => {
      const user = userSession.user;
      if (!user.email) {
        console.warn(`⚠️ Utilisateur ${user.id} n'a pas d'email configuré`);
        return;
      }

      try {
        await this.mailService.sendSessionActivatedEmail(
          user.email,
          user.name || 'Utilisateur',
          session.name,
          startDate,
          endDate
        );
        console.log(`✅ Email envoyé à ${user.email} pour la session ${session.name}`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'envoi d'email à ${user.email}:`, error);
      }
    });

    await Promise.allSettled(emailPromises);
  }

  async getSessionById(id: number) {
    const session = await this.prisma.session2.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    if (!session) {
      throw new NotFoundException(`Session with id ${id} not found`);
    }
    return session;
  }

  async findSeancesWithAvgFeedback(sessionId: number) {
    const seances = await this.prisma.seanceFormateur.findMany({
      where: { session2Id: sessionId },
    });

    const seancesWithFeedback = await Promise.all(
      seances.map(async (seance) => {
        const feedbacks = await this.prisma.seanceFeedback.findMany({
          where: { seanceId: seance.id },
          select: {
            sessionRating: true,
            contentQuality: true,
            sessionDuration: true,
            sessionOrganization: true,
            objectivesAchieved: true,
            trainerRating: true,
            trainerClarity: true,
            trainerAvailability: true,
            trainerPedagogy: true,
            trainerInteraction: true,
            teamRating: true,
            teamCollaboration: true,
            teamParticipation: true,
            teamCommunication: true,
          },
        });

        const perFeedbackAverages: number[] = feedbacks
          .map((fb) => {
            const values = [
              fb.sessionRating,
              fb.contentQuality,
              fb.sessionDuration,
              fb.sessionOrganization,
              fb.objectivesAchieved,
              fb.trainerRating,
              fb.trainerClarity,
              fb.trainerAvailability,
              fb.trainerPedagogy,
              fb.trainerInteraction,
              fb.teamRating,
              fb.teamCollaboration,
              fb.teamParticipation,
              fb.teamCommunication,
            ].filter((v): v is number => typeof v === 'number' && Number.isFinite(v));

            if (values.length === 0) return null;
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            return avg;
          })
          .filter((v): v is number => typeof v === 'number');

        const averageRating =
          perFeedbackAverages.length > 0
            ? Math.round(
                (perFeedbackAverages.reduce((a, b) => a + b, 0) / perFeedbackAverages.length) * 10
              ) / 10
            : null;

        return {
          ...seance,
          averageFeedbackScore: averageRating,
          feedbackCount: perFeedbackAverages.length,
        };
      })
    );

    return seancesWithFeedback;
  }

  async getAverageSessionFeedback(sessionId: number) {
    const feedbacks = await this.prisma.sessionFeedback.findMany({
      where: { sessionId },
      select: { rating: true, comments: true },
    });

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

    const average = validScores > 0
      ? Math.round((totalScore / validScores) * 10) / 10
      : 0;

    return { average, count: validScores };
  }

  async getSessionFeedbackList(sessionId: number) {
    const feedbacks = await this.prisma.sessionFeedback.findMany({
      where: { sessionId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return feedbacks.map((feedback) => {
      let ratingsData = null;
      try {
        if (feedback.comments) {
          const parsedComments = JSON.parse(feedback.comments);
          ratingsData = parsedComments.ratings;
        }
      } catch (error) {
        console.error('Error parsing comments for ratings:', error);
      }
      
      const averageRating = this.calculateWeightedScore(ratingsData);

      return {
        id: feedback.id,
        studentName: feedback.user?.name || 'Utilisateur inconnu',
        studentEmail: feedback.user?.email || '',
        averageRating: averageRating > 0 ? averageRating : null,
      };
    });
  }

  async getSessionFeedbackOverview(sessionId: number) {
    const feedbackList = await this.getSessionFeedbackList(sessionId);
    
    return {
      sessionFeedbackList: feedbackList,
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

      const processedRatings = this.processFrontendRatings(ratingsData);

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
  async findOne(id: number) {
  return this.prisma.session2.findUnique({
    where: { id },
    include: {
      program: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
// new add
async getSessionsForUser(userId: number) {
  const userSessions = await this.prisma.userSession2.findMany({
    where: { userId },
    include: {
      session2: {
        include: {
          program: true,
          session2Modules: {
            include: {
              module: true,
              courses: {
                include: {
                  course: true,
                  contenus: {
                    include: { contenu: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  // Add feedback information to each session
  const sessionsWithFeedback = await Promise.all(
    userSessions.map(async (userSession) => {
      const session = userSession.session2;
      const feedbacks = await this.prisma.sessionFeedback.findMany({
        where: { sessionId: session.id },
        select: { rating: true, comments: true },
      });

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
        ? Math.round((totalScore / validScores) * 10) / 10
        : null;

      return {
        ...userSession,
        session2: {
          ...session,
          averageRating,
          feedbackCount: feedbacks.length,
        }
      };
    })
  );

  return sessionsWithFeedback;
}

}
