import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService ],
})
export class QuizModule {}
