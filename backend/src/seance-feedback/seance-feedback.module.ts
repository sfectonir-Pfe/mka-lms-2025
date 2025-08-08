import { Module } from '@nestjs/common';
import { SeanceFeedbackService } from './seance-feedback.service';
import { SeanceFeedbackController } from './seance-feedback.controller';

@Module({
  controllers: [SeanceFeedbackController],
  providers: [SeanceFeedbackService],
})
export class SeanceFeedbackModule {}
