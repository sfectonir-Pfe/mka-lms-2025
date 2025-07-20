// src/creator-dashboard/creator-dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CreatorDashboardService {
  constructor(private prisma: PrismaService) {}

  // 1. Global stats
  async getGlobalStats() {
    const totalModules = await this.prisma.module.count();
    const totalCourses = await this.prisma.course.count();
    const totalContenus = await this.prisma.contenu.count();
    const totalPrograms = await this.prisma.program.count();
    const totalProgramsPublished = await this.prisma.program.count({ where: { published: true } });
    const totalProgramsUnpublished = await this.prisma.program.count({ where: { published: false } });
    const totalSessions = await this.prisma.session2.count();
    const totalSessionsActive = await this.prisma.session2.count({ where: { status: 'ACTIVE' } });
    const totalSessionsInactive = await this.prisma.session2.count({ where: { status: 'INACTIVE' } });

    return {
      totalModules,
      totalCourses,
      totalContenus,
      totalPrograms,
      totalProgramsPublished,
      totalProgramsUnpublished,
      totalSessions,
      totalSessionsActive,
      totalSessionsInactive,
    };
  }

  // 2. Top 3 Best Sessions (most enrolled users)
  async getTopSessions() {
    const result = await this.prisma.userSession2.groupBy({
      by: ['session2Id'],
      _count: { session2Id: true },
      orderBy: { _count: { session2Id: 'desc' } },
      take: 3,
    });

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

  // 3. Top 3 Inactive Sessions (least users)
  async getTopInactiveSessions() {
    // Find all sessions and number of enrolled users
    const sessionEnrolls = await this.prisma.userSession2.groupBy({
      by: ['session2Id'],
      _count: { session2Id: true },
      orderBy: { _count: { session2Id: 'asc' } },
      take: 3,
    });

    // Also include sessions with zero users (optional, for completeness)
    const allSessions = await this.prisma.session2.findMany({
      select: { id: true, name: true, program: { select: { name: true } } },
    });

    const enrolledSessionIds = sessionEnrolls.map((s) => s.session2Id);
    const zeroEnrollSessions = allSessions
      .filter((s) => !enrolledSessionIds.includes(s.id))
      .map((s) => ({
        sessionId: s.id,
        sessionName: s.name,
        programName: s.program?.name,
        enrolledUsers: 0,
      }));

    // Merge both and take the lowest 3
    const fullList = [
      ...sessionEnrolls.map((r) => ({
        sessionId: r.session2Id,
        sessionName: allSessions.find((s) => s.id === r.session2Id)?.name,
        programName: allSessions.find((s) => s.id === r.session2Id)?.program?.name,
        enrolledUsers: r._count.session2Id,
      })),
      ...zeroEnrollSessions,
    ]
      .sort((a, b) => a.enrolledUsers - b.enrolledUsers)
      .slice(0, 3);

    return fullList;
  }

  // 4. Feedback on each session (placeholder, will fill when feedback/rating system is ready)
  async getSessionFeedback() {
    // If you don't have feedback yet, just return null or a mock
    // Later, you can join with a feedback table
    const sessions = await this.prisma.session2.findMany({
      select: { id: true, name: true, program: { select: { name: true } } },
    });
    // Return sessions with feedback = null for now
    return sessions.map((s) => ({
      sessionId: s.id,
      sessionName: s.name,
      programName: s.program?.name,
      feedback: null, // will implement later
    }));
  }
  // Get sessions status count per month (last 12 months)
async getMonthlySessionStatus() {
  const now = new Date();
  const results: { month: string; active: number; inactive: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const actives = await this.prisma.session2.count({
      where: { status: 'ACTIVE', createdAt: { gte: start, lt: end } }
    });
    const inactives = await this.prisma.session2.count({
      where: { status: 'INACTIVE', createdAt: { gte: start, lt: end } }
    });

    results.push({
      month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
      active: actives,
      inactive: inactives,
    });
  }
  return results;
}


// Get programs publish status per month (last 12 months)
async getMonthlyProgramPublish() {
  const now = new Date();
  const results: { month: string; published: number; unpublished: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const published = await this.prisma.program.count({
      where: { published: true, createdAt: { gte: start, lt: end } }
    });
    const unpublished = await this.prisma.program.count({
      where: { published: false, createdAt: { gte: start, lt: end } }
    });

    results.push({
      month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
      published,
      unpublished,
    });
  }
  return results;
}


}
