import { Module } from '@nestjs/common';
import { FeedbackÉtudiantService } from './feedback-étudiant.service';
import { FeedbackÉtudiantController } from './feedback-étudiant.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [FeedbackÉtudiantController],
  providers: [FeedbackÉtudiantService],
})
export class FeedbackÉtudiantModule {}
