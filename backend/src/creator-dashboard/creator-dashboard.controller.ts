// src/creator-dashboard/creator-dashboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CreatorDashboardService } from './creator-dashboard.service';

@Controller('creator-dashboard')
export class CreatorDashboardController {
  constructor(private readonly dashboardService: CreatorDashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getGlobalStats();
  }

  @Get('top-sessions')
  getTopSessions() {
    return this.dashboardService.getTopSessions();
  }

  @Get('inactive-sessions')
  getTopInactiveSessions() {
    return this.dashboardService.getTopInactiveSessions();
  }

  @Get('session-feedback')
  getSessionFeedback() {
    return this.dashboardService.getSessionFeedback();
  }
//   @Get('monthly-creations')
// getMonthlyCreations() {
//   return this.dashboardService.getMonthlyCreations();
// }
@Get('monthly-session-status')
getMonthlySessionStatus() {
  return this.dashboardService.getMonthlySessionStatus();
}

@Get('monthly-program-publish')
getMonthlyProgramPublish() {
  return this.dashboardService.getMonthlyProgramPublish();
}

}
