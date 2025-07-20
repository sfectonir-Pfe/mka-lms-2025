import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { PixelController } from './pixel.controller'; // ✅ Don't forget to create this file

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'majdlabidi666@gmail.com',
          pass: 'ycig zjlq oesp rgqq',
        },
      },
      defaults: {
        from: '"Mon App" <votre.email@gmail.com>',
      },
    }),
  ],
  controllers: [PixelController], // ✅ Added here
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
