import { Controller, Get, Param } from '@nestjs/common';
import { DashboardEstablishmentService } from './dashboard-establishment.service';

@Controller('dashboard-establishment')
export class DashboardEstablishmentController {
  constructor(private readonly dashboardEstablishmentService: DashboardEstablishmentService) {}

  @Get('students/:establishmentName')
  getEstablishmentStudents(@Param('establishmentName') establishmentName: string) {
    return this.dashboardEstablishmentService.getEstablishmentStudents(establishmentName);
  }
  
  @Get('top-students/:establishmentName')
  getTopStudentsByRating(@Param('establishmentName') establishmentName: string) {
    return this.dashboardEstablishmentService.getTopStudentsByRating(establishmentName);
  }
}
