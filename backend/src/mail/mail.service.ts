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
  async sendEmailVerificationCode(to: string, code: string) {
  const mailOptions = {
    from: 'MKA LMS <your-email@gmail.com>',
    to,
    subject: 'Code de vérification',
    html: `
      <h3>Code de vérification</h3>
      <p>Voici votre code : <strong>${code}</strong></p>
      <p>Ce code est valable pendant 5 minutes.</p>
    `,
  };
  await this.mailerService.sendMail(mailOptions);
}
  async sendWelcomeEmailverification(to: string, tempPassword: string, role: string) {
const trackingPixel = `<img src="https://0de3-196-177-86-16.ngrok-free.app/track/open?email=${encodeURIComponent(to)}" width="1" height="1" style="display:none;" />`;

    await this.mailerService.sendMail({
      to,
      subject: '🎉 Bienvenue sur la plateforme',
      html: `
        <h3>Bienvenue sur notre plateforme !</h3>
        <p>Votre compte a été créé avec succès. Voici vos informations de connexion :</p>
        <ul>
          <li><strong>Mot de passe temporaire :</strong> ${tempPassword}</li>
          <li><strong>Rôle :</strong> ${role}</li>
        </ul>
        <p>Merci de vous connecter et de changer votre mot de passe dès que possible.</p>
        ${trackingPixel}
        <br/>
        <p>– Équipe LMS</p>
      `,
    });
  }
}

  
  
