import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProgramsModule } from './programs/programs.module';
import { ModulesModule } from './modules/modules.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [PrismaModule.forRoot({isGlobal:true}), AuthModule, UsersModule, ProgramsModule, ModulesModule, CoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
