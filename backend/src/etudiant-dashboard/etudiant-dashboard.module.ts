import { Module } from '@nestjs/common';
import { EtudiantDashboardService } from './etudiant-dashboard.service';
import { EtudiantDashboardController } from './etudiant-dashboard.controller';

@Module({
  controllers: [EtudiantDashboardController],
  providers: [EtudiantDashboardService],
})
export class EtudiantDashboardModule {}
