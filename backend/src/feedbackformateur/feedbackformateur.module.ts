import { Module } from '@nestjs/common';
import { FeedbackFormateurService } from './feedbackformateur.service';
import { FeedbackFormateurController } from './feedbackformateur.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [FeedbackFormateurController],
  providers: [FeedbackFormateurService],
})
export class FeedbackFormateurModule {}
