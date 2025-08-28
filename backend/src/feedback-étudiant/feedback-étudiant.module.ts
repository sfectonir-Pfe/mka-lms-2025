import { Module } from '@nestjs/common';
import { FeedbackÉtudiantService } from './feedback-étudiant.service';
import { FeedbackÉtudiantController } from './feedback-étudiant.controller';
import { PrismaModule } from 'nestjs-prisma';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [FeedbackÉtudiantController],
  providers: [FeedbackÉtudiantService],
})
export class FeedbackÉtudiantModule {}
