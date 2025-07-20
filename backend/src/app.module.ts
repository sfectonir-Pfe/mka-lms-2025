import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { buildProgramModule } from './buildProgram/buildProgram.module';
import { QuizModule } from './quiz/quiz.module';
import { Session2Module } from './session2/session2.module';
import { SeanceFormateurModule } from './seance-formateur/seance-formateur.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { WhiteboardModule } from './whiteboard/whiteboard.module';
import { Session2ChatModule } from './session2-chat/session2-chat.module';
import { GeneralChatMessageModule } from './general-chat-message/general-chat-message.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CreatorDashboardModule } from './creator-dashboard/creator-dashboard.module';
import { FormateurDashboardModule } from './formateur-dashboard/formateur-dashboard.module';
import { EtudiantDashboardModule } from './etudiant-dashboard/etudiant-dashboard.module';
import { S3Module } from './s3/s3.module';






@Module({
imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  PrismaModule.forRoot({isGlobal:true}),
  ChatMessagesModule, 
  AuthModule, 
  UsersModule, 
  ProgramsModule, 
  ModulesModule,
  MailModule, 
  CoursesModule, 
  ContenuModule, 
  buildProgramModule, 
  QuizModule, 
  Session2Module, 
  SeanceFormateurModule, 
  WhiteboardModule, 
  Session2ChatModule,
  FeedbackModule, 
  ChatbotModule,
  S3Module,
  GeneralChatMessageModule, DashboardModule, CreatorDashboardModule, FormateurDashboardModule, EtudiantDashboardModule,
],

  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
