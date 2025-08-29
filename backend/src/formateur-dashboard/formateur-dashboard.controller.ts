import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FormateurDashboardService } from './formateur-dashboard.service';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('dashboard-formateur')
export class FormateurDashboardController {
  constructor(private readonly FormateurDashboardService: FormateurDashboardService) {}

  @Get('sessions')
  async getAllSessions() {
    return this.FormateurDashboardService.getAllFormateurSessions();
  }

  @Get('feedbacks')
  async getFormateurFeedbacks(@Query('formateurId') formateurId?: string) {
    return this.FormateurDashboardService.getFormateurFeedbacks(
      formateurId ? parseInt(formateurId) : undefined
    );
  }

  @Get('top-formateurs')
  async getTopFormateurs() {
    return this.FormateurDashboardService.getTopFormateurs();
  }
}
