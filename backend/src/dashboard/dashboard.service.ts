import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '@prisma/client';
import { Session2Status } from '@prisma/client';
import { SeanceFeedbackService } from '../seance-feedback/seance-feedback.service';
import { SessionFeedbackService } from '../session-feedback/session-feedback.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private seanceFeedbackService: SeanceFeedbackService,
    private sessionFeedbackService: SessionFeedbackService
  ) {}

  
    // 1. Global system statistics
   async getSystemStats() {
    // Total users and breakdowns
    const totalUsers = await this.prisma.user.count();
    const totalStudents = await this.prisma.user.count({ where: { role: 'Etudiant' } });
    const totalFormateurs = await this.prisma.user.count({ where: { role: 'Formateur' } });
    const totalCreators = await this.prisma.user.count({ where: { role: 'CreateurDeFormation' } });
    const totalEstablishments = await this.prisma.user.count({ where: { role: 'Etablissement' } });
  
    // Programs
    const totalPrograms = await this.prisma.program.count();
    const totalProgramsPublished = await this.prisma.program.count({ where: { published: true } });
    const totalProgramsUnpublished = await this.prisma.program.count({ where: { published: false } });
  
    // Sessions by status (active, inactive, completed, archived)
    const totalSessions = await this.prisma.session2.count();
    const activeSessions = await this.prisma.session2.count({ where: { status: 'ACTIVE' } });
    const inactiveSessions = await this.prisma.session2.count({ where: { status: 'INACTIVE' } });
    const completedSessions = await this.prisma.session2.count({ where: { status: 'COMPLETED' } });
    const archivedSessions = await this.prisma.session2.count({ where: { status: 'ARCHIVED' } });
  
    return {
      totalUsers,
      totalStudents,
      totalFormateurs,
      totalCreators,
      totalEstablishments,
      totalPrograms,
      totalProgramsPublished,
      totalProgramsUnpublished,
      totalSessions,
      activeSessions,
      inactiveSessions,
      completedSessions,
      archivedSessions,
    };
  }
    // 2. Top 3 sessions (most enrolled users)
    async getTopSessions() {
      const result = await this.prisma.userSession2.groupBy({
        by: ['session2Id'],
        _count: { session2Id: true },
        orderBy: { _count: { session2Id: 'desc' } },
        take: 3,
      });
  
      // Fetch session and program names
      const sessions = await Promise.all(
        result.map(async (r) => {
          const session = await this.prisma.session2.findUnique({
            where: { id: r.session2Id },
            select: {
              id: true,
              name: true,
              program: { select: { name: true } },
            },
          });
          return {
            sessionId: r.session2Id,
            sessionName: session?.name,
            programName: session?.program?.name,
            enrolledUsers: r._count.session2Id,
          };
        })
      );
  
      return sessions;
    }
  
    // 3. Top 3 formateurs (placeholder for now)
    async getTopFormateurs() {
      const formateurs = await this.prisma.formateur.findMany({
        take: 3,
        include: { User: { select: { name: true, profilePic: true } } },
      });
      // Placeholder: No ratings yet
      return formateurs.map(f => ({
        formateurId: f.id,
        name: f.User?.name,
        profilePic: f.User?.profilePic,
        averageRating: null, // Will fill when feedback system is ready
      }));
    }
  
    // 4. Monthly user registrations (last 12 months, by role)
   async getMonthlyUserRegistrations() {
    const now = new Date();
    const registrations: {
      month: string;
      total: number;
      students: number;
      formateurs: number;
      creators: number;
      establishments: number;
    }[] = [];
  
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
  
      const countByRole = async (role: Role) =>
        this.prisma.user.count({
          where: {
            role,
            createdAt: { gte: start, lt: end },
          },
        });
  
      registrations.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        total: await this.prisma.user.count({ where: { createdAt: { gte: start, lt: end } } }),
        students: await countByRole(Role.Etudiant),
        formateurs: await countByRole(Role.Formateur),
        creators: await countByRole(Role.CreateurDeFormation),
        establishments: await countByRole(Role.Etablissement),
      });
    }
    return registrations;
  }
  async getFormateurActivity() {
    // Get all formateurs with their user info
    const formateurs = await this.prisma.formateur.findMany({
      include: { User: { select: { id: true, name: true, profilePic: true } } },
    });
  
    // For each formateur, count the sessions they animated & the students they trained
    const stats = await Promise.all(
      formateurs.map(async (f) => {
        // Number of sessions (SeanceFormateur)
        const sessionCount = await this.prisma.seanceFormateur.count({
          where: { formateurId: f.userId },
        });
  
        // Number of unique students trained (from UserSession2 linked to session2 of seances by this formateur)
        // This is optional/advanced, skip if you want only session counts!
        const seances = await this.prisma.seanceFormateur.findMany({
          where: { formateurId: f.userId },
          select: { session2Id: true },
        });
        const session2Ids = seances.map(s => s.session2Id);
  
        // Get all users enrolled in those sessions (UserSession2)
        const uniqueStudents = session2Ids.length
          ? await this.prisma.userSession2.findMany({
              where: { session2Id: { in: session2Ids } },
              select: { userId: true },
              distinct: ['userId'],
            })
          : [];
  
        return {
          formateurId: f.id,
          userId: f.userId,
          name: f.User?.name,
          profilePic: f.User?.profilePic,
          sessionCount,
          studentsCount: uniqueStudents.length,
        };
      })
    );
  
    // Sort most to least active
    stats.sort((a, b) => b.sessionCount - a.sessionCount);
  
    return stats;
  }
  // async getTopEstablishments() {
  //   // Get all establishments with their user info
  //   const establishments = await this.prisma.etablissement.findMany({
  //     include: { User: { select: { id: true, name: true, profilePic: true } } },
  //   });
  
  //   const stats = await Promise.all(
  //     establishments.map(async (e) => {
  //       // Number of students attached to establishment (optional: adapt as needed)
  //       const studentsCount = await this.prisma.etudiant.count({
  //         where: { NameEtablissement: e.User?.name },
  //       });
  
  //       // Number of programs created (if there’s a relation, else skip)
  //       // Let's say the "User" is the creator (if not, skip)
  //       // const programsCount = await this.prisma.program.count({ where: { creatorId: e.userId } });
  
  //       return {
  //         etablissementId: e.id,
  //         userId: e.userId,
  //         name: e.User?.name,
  //         profilePic: e.User?.profilePic,
  //         studentsCount,
  //         // programsCount,
  //         // Add more metrics if you want!
  //       };
  //     })
  //   );
  
  //   // Sort by students/programs as you wish
  //   stats.sort((a, b) => b.studentsCount - a.studentsCount);
  
  //   return stats;
  // }

  async getSessionStatusStats() {
    // Get all counts by status
    const statuses: Session2Status[] = ['ACTIVE', 'INACTIVE', 'COMPLETED', 'ARCHIVED'];
    const counts: Record<string, number> = {};

    for (const s of statuses) {
      counts[s.toLowerCase()] = await this.prisma.session2.count({ where: { status: s } });
    }

    const total = await this.prisma.session2.count();
    return { ...counts, total };
  }

  // Top 3 sessions by average feedback rating
  // Top 3 sessions based on average feedback rating, with their top 3 seances
  async getTopRatedSessionsWithSeances() {
  // Get sessions with basic info and program
  const sessions = await this.prisma.session2.findMany({
    include: {
      program: {
        select: { name: true }
      }
    },
  });

  // Get session feedbacks separately
  const sessionFeedbacks = await this.prisma.sessionFeedback.findMany({
    where: {
      sessionId: { in: sessions.map(s => s.id) }
    },
    select: {
      sessionId: true,
      rating: true
    }
  });

  // Get seances with their feedbacks
  const seances = await this.prisma.seanceFormateur.findMany({
    where: {
      session2Id: { in: sessions.map(s => s.id) }
    }
  });

  // Get seance feedbacks separately
  const seanceFeedbacks = await this.prisma.seanceFeedback.findMany({
    where: {
      seanceId: { in: seances.map(s => s.id) }
    },
    select: {
      seanceId: true,
      sessionRating: true
    }
  });

  const sessionWithRatings = sessions.map((session) => {
    // Get feedbacks for this session
    const sessionRatings = sessionFeedbacks
      .filter(f => f.sessionId === session.id)
      .map(f => f.rating)
      .filter(r => typeof r === 'number');

    const sessionAverage =
      sessionRatings.length > 0
        ? parseFloat(
            (sessionRatings.reduce((a, b) => a + b, 0) / sessionRatings.length).toFixed(2)
          )
        : 0;

    // Get seances for this session
    const sessionSeances = seances.filter(s => s.session2Id === session.id);
    
    const topSeances = sessionSeances.map((seance) => {
      const ratings = seanceFeedbacks
        .filter(f => f.seanceId === seance.id)
        .map(f => f.sessionRating)
        .filter(r => typeof r === 'number');

      const avg =
        ratings.length > 0
          ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
          : null;

      return {
        id: seance.id,
        title: seance.title,
        startTime: seance.startTime,
        averageRating: avg,
      };
    })
      .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
      .slice(0, 3);

    return {
      id: session.id,
      name: session.name,
      startDate: session.startDate,
      endDate: session.endDate,
      averageRating: sessionAverage,
      programName: session.program?.name || null,
      topSeances,
    };
  });

  return sessionWithRatings
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);
  }

  // Get reclamation statistics for dashboard
  async getReclamationStats() {
    const totalReclamations = await this.prisma.reclamation.count();
    
    // Count by status
    const enAttente = await this.prisma.reclamation.count({ where: { status: 'EN_ATTENTE' } });
    const enCours = await this.prisma.reclamation.count({ where: { status: 'EN_COURS' } });
    const resolu = await this.prisma.reclamation.count({ where: { status: 'RESOLU' } });
    const rejete = await this.prisma.reclamation.count({ where: { status: 'REJETE' } });

    // Count by priority
    const haute = await this.prisma.reclamation.count({ where: { priority: 'HAUTE' } });
    const moyenne = await this.prisma.reclamation.count({ where: { priority: 'MOYENNE' } });
    const basse = await this.prisma.reclamation.count({ where: { priority: 'BASSE' } });

    // Recent reclamations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentReclamations = await this.prisma.reclamation.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    });

    // Get latest 5 reclamations for quick overview
    const latestReclamations = await this.prisma.reclamation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        category: true,
        userName: true,
        userEmail: true,
        createdAt: true,
      }
    });

    return {
      totalReclamations,
      statusBreakdown: {
        enAttente,
        enCours,
        resolu,
        rejete,
      },
      priorityBreakdown: {
        haute,
        moyenne,
        basse,
      },
      recentReclamations,
      latestReclamations,
    };
  }
  
}