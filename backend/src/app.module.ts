import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProgramsModule } from './programs/programs.module';
import { ModulesModule } from './modules/modules.module';
import { CoursesModule } from './courses/courses.module';
import { MailModule } from './mail/mail.module';
import { ContenuModule } from './contenu/contenu.module';
import { SessionModule } from './session/session.module';
import { QuizModule } from './quiz/quiz.module';



@Module({
  imports: [PrismaModule.forRoot({isGlobal:true}), AuthModule, UsersModule, ProgramsModule, ModulesModule, MailModule, CoursesModule, ContenuModule, SessionModule, QuizModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
