import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'nestjs-prisma';
import { MailService } from 'src/mail/mail.service'; // if you use this
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';




@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret', // Use env in production!
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, PrismaService, MailService,JwtStrategy,JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
