// src/etudiant-dashboard/etudiant-dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Session2Status } from '@prisma/client';



@Injectable()
export class EtudiantDashboardService {
  constructor(private prisma: PrismaService) {}

  // Get all joined sessions for a user, with session info + status string
  async getJoinedSessionsByEtudiant(userId: number) {
    // Fetch UserSession2 for the user, with session2 info
    const joined = await this.prisma.userSession2.findMany({
      where: { userId },
      include: {
        session2: true,
      },
    });

    // Status logic: terminée / en cours / à venir
    const now = new Date();
    const sessions = joined.map((j) => {
      let statut = "en cours";
      if (j.session2.endDate && now > j.session2.endDate) statut = "terminée";
      else if (j.session2.startDate && now < j.session2.startDate) statut = "à venir";

      return {
        sessionId: j.session2.id,
        sessionName: j.session2.name,
        startDate: j.session2.startDate,
        endDate: j.session2.endDate,
        status: j.session2.status, // ACTIVE, COMPLETED, etc.
        statut, // terminée, en cours, à venir
      };
    });

    return sessions;
  }

  // For stats card: count of joined sessions per status
  async getJoinedSessionStats(userId: number) {
    const sessions = await this.getJoinedSessionsByEtudiant(userId);
    return {
      total: sessions.length,
      terminee: sessions.filter((s) => s.statut === "terminée").length,
      encours: sessions.filter((s) => s.statut === "en cours").length,
      avenir: sessions.filter((s) => s.statut === "à venir").length,
    };
  }
}
