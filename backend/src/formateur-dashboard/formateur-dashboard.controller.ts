import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FormateurDashboardService } from './formateur-dashboard.service';

@Controller('dashboard-formateur')
export class FormateurDashboardController {
  constructor(private readonly FormateurDashboardService: FormateurDashboardService) {}

@Get('sessions')
async getAllSessions() {
  return this.FormateurDashboardService.getAllFormateurSessions();
}

}
