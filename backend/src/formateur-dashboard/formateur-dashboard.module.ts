import { Module } from '@nestjs/common';
import { FormateurDashboardService } from './formateur-dashboard.service';
import { FormateurDashboardController } from './formateur-dashboard.controller';

@Module({
  controllers: [FormateurDashboardController],
  providers: [FormateurDashboardService],
})
export class FormateurDashboardModule {}
