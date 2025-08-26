import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';


@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getSystemStats() {
    return this.dashboardService.getSystemStats();
  }

  @Get('top-sessions')
  getTopSessions() {
    return this.dashboardService.getTopSessions();
  }

  @Get('top-formateurs')
  getTopFormateurs() {
    return this.dashboardService.getTopFormateurs();
  }

  @Get('monthly-registrations')
  getMonthlyUserRegistrations() {
    return this.dashboardService.getMonthlyUserRegistrations();
  }
    @Get('session-status-stats')
  getSessionStatusStats() {
    return this.dashboardService.getSessionStatusStats();
  }

  @Get('reclamation-stats')
  getReclamationStats() {
    return this.dashboardService.getReclamationStats();
  }

// @Get('top-establishments')
// getTopEstablishments() {
//   return this.dashboardService.getTopEstablishments();
// }
@Get('formateur-activity')
getFormateurActivity() {
  return this.dashboardService.getFormateurActivity();
}
@Get('top-rated-sessions')
getTopRatedSessionsWithSeances() {
  return this.dashboardService.getTopRatedSessionsWithSeances();
}

// @Get('reclamation-stats')
// getReclamationStats() {
//   return this.dashboardService.getReclamationStats();
// }


}