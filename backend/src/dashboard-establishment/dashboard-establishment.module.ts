import { Module } from '@nestjs/common';
import { DashboardEstablishmentService } from './dashboard-establishment.service';
import { DashboardEstablishmentController } from './dashboard-establishment.controller';

@Module({
  controllers: [DashboardEstablishmentController],
  providers: [DashboardEstablishmentService],
})
export class DashboardEstablishmentModule {}
