import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [PrismaModule.forRoot({isGlobal:true}), AuthModule, UsersModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
