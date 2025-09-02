import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SeanceFeedbackService } from '../seance-feedback/seance-feedback.service';
import { SessionFeedbackService } from '../session-feedback/session-feedback.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, SeanceFeedbackService, SessionFeedbackService],
})
export class DashboardModule {}
