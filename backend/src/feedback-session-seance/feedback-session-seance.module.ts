// src/feedback-session-seance/feedback-session-seance.module.ts

import { Module } from '@nestjs/common';
import { FeedbackSessionSeanceController } from './feedback-session-seance.controller';
import { FeedbackSessionSeanceService } from './feedback-session-seance.service';

@Module({
  controllers: [FeedbackSessionSeanceController],
  providers: [FeedbackSessionSeanceService],
})
export class FeedbackSessionSeanceModule {}
