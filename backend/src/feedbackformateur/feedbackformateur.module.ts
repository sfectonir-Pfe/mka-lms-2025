import { Module } from '@nestjs/common';
import { FeedbackFormateurService } from './feedbackformateur.service';
import { FeedbackFormateurController } from './feedbackformateur.controller';

@Module({
  controllers: [FeedbackFormateurController],
  providers: [FeedbackFormateurService],
})
export class FeedbackFormateurModule {}
