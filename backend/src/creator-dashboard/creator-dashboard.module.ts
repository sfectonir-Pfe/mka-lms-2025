import { Module } from '@nestjs/common';
import { CreatorDashboardService } from './creator-dashboard.service';
import { CreatorDashboardController } from './creator-dashboard.controller';

@Module({
  controllers: [CreatorDashboardController],
  providers: [CreatorDashboardService],
})
export class CreatorDashboardModule {}
