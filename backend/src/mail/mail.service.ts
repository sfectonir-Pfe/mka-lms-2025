import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }


  async sendPasswordResetEmail(to: string, token: string) {
    
    const resetLink = `http://Localhost:3000/ResetPasswordPage?token=${token}&email=${to} `;
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
  async sendWelcomeEmail(to: string, tempPassword: string, role: string) {
    const mailOptions = {
      from: 'LMS Platform <your-email@gmail.com>',
      to,
      subject: '🎓 Welcome to MKA Platform',
      html: `
        <h3>Welcome to the LMS!</h3>
        <p>Your account has been created successfully. Here are your login credentials:</p>
        <ul>
          <li><strong>Email:</strong> ${to}</li>
          <li><strong>Temporary Password:</strong> ${tempPassword}</li>
          <li><strong>Role:</strong> ${role}</li>
        </ul>
        <p>Please log in and change your password as soon as possible for security reasons.</p>
        <br/>
        <p>– LMS Team</p>
      `,
    };

    await this.mailerService.sendMail(mailOptions);
  }
}
  
