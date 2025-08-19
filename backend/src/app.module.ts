// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';

import { UsersModule } from './users/users.module';
import { ProgramsModule } from './programs/programs.module';
import { ModulesModule } from './modules/modules.module';
import { CoursesModule } from './courses/courses.module';
import { MailModule } from './mail/mail.module';
import { ContenuModule } from './contenu/contenu.module';
import { buildProgramModule } from './buildProgram/buildProgram.module'; // keep your actual exported class name
import { QuizModule } from './quiz/quiz.module';
import { Session2Module } from './session2/session2.module';
import { SeanceFormateurModule } from './seance-formateur/seance-formateur.module';
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
import { FeedbackFormateurModule } from './feedbackformateur/feedbackformateur.module';
import { NotificationModule } from './notification/notification.module';
import { RolesGuard } from './auth/roles.guard';
import {SeanceFeedbackModule} from './seance-feedback/seance-feedback.module';
import {SessionFeedbackModule} from './session-feedback/session-feedback.module';
import { RéclamationModule } from './réclamation/réclamation.module';
import { FeedbackÉtudiantModule } from './feedback-étudiant/feedback-étudiant.module';
import { ProgramChatModule } from './program-chat/program-chat.module';





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
  ChatbotModule,
  S3Module,
  GeneralChatMessageModule, DashboardModule, CreatorDashboardModule, FormateurDashboardModule, EtudiantDashboardModule, FeedbackFormateurModule, NotificationModule,SeanceFeedbackModule,SessionFeedbackModule, RéclamationModule, FeedbackÉtudiantModule,


    // feature modules
    AuthModule,
    UsersModule,
    ProgramsModule,
    ModulesModule,
    CoursesModule,
    MailModule,
    ContenuModule,
    buildProgramModule,
    QuizModule,
    Session2Module,
    SeanceFormateurModule,
    
    ChatbotModule,
    ChatMessagesModule,
    WhiteboardModule,
    Session2ChatModule,
    GeneralChatMessageModule,
    DashboardModule,
    CreatorDashboardModule,
    FormateurDashboardModule,
    EtudiantDashboardModule,
    S3Module,
    FeedbackFormateurModule,
    NotificationModule,
    ProgramChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // // 🔒 make JWT required everywhere by default
    { provide: APP_GUARD, useClass: JwtAuthGuard },
     { provide: APP_GUARD, useClass: RolesGuard },   // then roles
  ],
})
export class AppModule {}
