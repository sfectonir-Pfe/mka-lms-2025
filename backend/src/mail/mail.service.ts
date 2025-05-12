import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }


  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://yourapp.com/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
      <p><p> your  code is ${token} </p>
      <a href="${resetLink}">Reset Password</a>
      </p>`,
    };

    await this.mailerService.sendMail(mailOptions);
  }
  
}