import { Controller, Get, Query } from '@nestjs/common';
import { EtudiantDashboardService } from './etudiant-dashboard.service';

@Controller('dashboard-etudiant')
export class EtudiantDashboardController {
  constructor(private readonly etudiantDashboardService: EtudiantDashboardService) {}

  @Get('joined-sessions')
  async getJoinedSessions(@Query('userId') userId: number) {
    return this.etudiantDashboardService.getJoinedSessionsByEtudiant(+userId);
  }

  @Get('joined-sessions/stats')
  async getJoinedSessionsStats(@Query('userId') userId: number) {
    return this.etudiantDashboardService.getJoinedSessionStats(+userId);
  }
}
