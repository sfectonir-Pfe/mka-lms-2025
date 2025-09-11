import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { DashboardEstablishmentService } from './dashboard-establishment.service';
import { Roles } from '../auth/roles.decorator';

@Controller('dashboard-establishment')
export class DashboardEstablishmentController {
  constructor(private readonly dashboardEstablishmentService: DashboardEstablishmentService) {}


  @Roles('admin', 'createurdeformation', 'etablissement')
  @Get('my-stats')
  getMyEstablishmentStats(@Req() req: any) {
    const userId = req.user.id;
    return this.dashboardEstablishmentService.getMyEstablishmentStats(userId);
  }

  @Roles('admin', 'createurdeformation', 'etablissement')
  @Get('my-students')
  getMyEstablishmentStudents(@Req() req: any) {
    const userId = req.user.id;
    return this.dashboardEstablishmentService.getMyEstablishmentStudents(userId);
  }



  @Roles('admin', 'createurdeformation', 'etablissement')
  @Get('my-top-students')
  getMyTopStudentsByRating(@Req() req: any, @Query('limit') limit?: string) {
    const userId = req.user.id;
    const limitNumber = limit ? parseInt(limit) : 3;
    return this.dashboardEstablishmentService.getMyTopStudentsByRating(userId, limitNumber);
  }

  @Roles('admin', 'createurdeformation', 'etablissement')
  @Get('my-feedbacks')
  getMyStudentFeedbacks(@Req() req: any, @Query('studentId') studentId?: string) {
    const userId = req.user.id;
    return this.dashboardEstablishmentService.getMyStudentFeedbacks(userId, studentId ? parseInt(studentId) : undefined);
  }

  @Roles('admin', 'createurdeformation', 'etablissement')
  @Get('my-student-history/:studentId')
  getMyStudentSessionHistory(@Req() req: any, @Param('studentId') studentId: string) {
    const userId = req.user.id;
    return this.dashboardEstablishmentService.getMyStudentSessionHistory(userId, parseInt(studentId));
  }

  @Roles('admin', 'createurdeformation', 'etablissement')
  @Get('my-sessions')
  getMyEstablishmentSessions(@Req() req: any) {
    const userId = req.user.id;
    return this.dashboardEstablishmentService.getMyEstablishmentSessions(userId);
  }




}
