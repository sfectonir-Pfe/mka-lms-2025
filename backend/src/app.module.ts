import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProgramsModule } from './programs/programs.module';
import { ModulesModule } from './modules/modules.module';
import { CoursesModule } from './courses/courses.module';
import { MailModule } from './mail/mail.module';
import { ContenusModule } from './contenus/contenus.module';
import { ProgramModuleModule } from './program-module/program-module.module';
import { ModuleCourseModule } from './module-course/module-course.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


  @Module({
imports: [
  PrismaModule.forRoot({isGlobal:true}),
  // ServeStaticModule.forRoot({
  //   rootPath: join(__dirname, '..', '..', 'uploads'),
  //   serveRoot: '/uploads',
  // }),
  AuthModule,
  UsersModule,
  ProgramsModule,
  ModulesModule,
  CoursesModule,
  MailModule,
  ContenusModule,
  ProgramModuleModule,
  ModuleCourseModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
