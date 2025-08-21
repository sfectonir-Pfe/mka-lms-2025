import { Module } from '@nestjs/common';
import { SessionFeedbackService } from './session-feedback.service';
import { SessionFeedbackController } from './session-feedback.controller';

@Module({
  controllers: [SessionFeedbackController],
  providers: [SessionFeedbackService],
})
export class SessionFeedbackModule {}
