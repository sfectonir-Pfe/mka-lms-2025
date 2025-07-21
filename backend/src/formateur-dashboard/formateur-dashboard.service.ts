import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FormateurDashboardService {  // ✅ Must match import/export everywhere
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
    if (!session || sessionsMap.has(session.id)) continue;

    sessionsMap.set(session.id, {
      sessionId: session.id,
      sessionName: session.name,
      status: session.status,
      totalUsers: session.userSessions2.length,
    });
  }

  return Array.from(sessionsMap.values());
}


}
