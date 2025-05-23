import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailService } from 'src/mail/mail.service';
import { CaptchaService } from 'src/captcha/captcha.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService,MailService,CaptchaService],
})
export class AuthModule {}
