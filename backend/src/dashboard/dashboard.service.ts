import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '@prisma/client';
import { Session2Status } from '@prisma/client';


@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

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
async getSessionStatusStats() {
  // Get all counts by status
  const statuses: Session2Status[] = ['ACTIVE', 'INACTIVE', 'COMPLETED', 'ARCHIVED'];
  const counts: Record<string, number> = {}; // <-- ADD THIS LINE

  for (const s of statuses) {
    counts[s.toLowerCase()] = await this.prisma.session2.count({ where: { status: s } });
  }

  const total = await this.prisma.session2.count();
  return { ...counts, total };
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

}
