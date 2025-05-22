import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import { appConfig } from '../config/app.config';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }


  async sendPasswordResetEmail(to: string, token: string) {
    try {
      console.log(`Préparation de l'email de réinitialisation de mot de passe pour ${to}`);

      // Construire l'URL de réinitialisation à partir de la configuration
      const resetLink = `${appConfig.urls.frontendBaseUrl}${appConfig.urls.resetPassword}?token=${token}&email=${to}`;
      console.log(`URL de réinitialisation générée: ${resetLink}`);

      const mailOptions = {
        from: appConfig.email.defaultSender,
        to: to,
        subject: 'Demande de réinitialisation de mot de passe',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #1976d2; text-align: center;">Réinitialisation de mot de passe</h2>
            <p>Vous avez demandé une réinitialisation de votre mot de passe. Voici votre code de réinitialisation :</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <p style="font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${token}</p>
            </div>
            <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${resetLink}" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Réinitialiser mon mot de passe</a>
            </div>
            <p style="color: #757575; margin-top: 20px; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />
            <p style="text-align: center; color: #757575; font-size: 14px;">– L'équipe LMS</p>
          </div>
        `,
      };

      console.log("Envoi de l'email avec les options:", {
        to: mailOptions.to,
        subject: mailOptions.subject,
        from: mailOptions.from
      });

      const result = await this.mailerService.sendMail(mailOptions);
      console.log("Email envoyé avec succès:", result);
      return result;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
      throw error;
    }
  }
  async sendWelcomeEmail(to: string, tempPassword: string, role: string) {
    try {
      console.log(`Préparation de l'email de bienvenue pour ${to} avec le mot de passe temporaire: ${tempPassword}`);

      // Construire l'URL de connexion à partir de la configuration
      const loginUrl = `${appConfig.urls.frontendBaseUrl}${appConfig.urls.login}`;
      console.log(`URL de connexion générée: ${loginUrl}`);

      const mailOptions = {
        from: appConfig.email.defaultSender,
        to,
        subject: '🎓 Bienvenue sur la plateforme LMS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #1976d2; text-align: center;">Bienvenue sur la plateforme LMS!</h2>
            <p>Votre compte a été créé avec succès. Voici vos identifiants de connexion:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Email:</strong> ${to}</p>
              <p><strong>Mot de passe temporaire:</strong> <span style="font-family:
              monospace; background-color: #e0e0e0; padding: 3px 6px; border-radius: 3px;">${tempPassword}</span></p>
              <p><strong>Rôle:</strong> ${role}</p>
            </div>
            <p style="color: #d32f2f; font-weight: bold;">Important: Veuillez vous connecter et changer votre mot de passe dès que possible pour des raisons de sécurité.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${loginUrl}" style="background-color: #1976d2;
              color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Se connecter maintenant</a>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />
            <p style="text-align: center; color: #757575; font-size: 14px;">– L'équipe LMS</p>
          </div>
        `,
      };

      console.log("Envoi de l'email avec les options:", {
        to: mailOptions.to,
        subject: mailOptions.subject,
        from: mailOptions.from
      });

      const result = await this.mailerService.sendMail(mailOptions);
      console.log("Email envoyé avec succès:", result);
      return result;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
      throw error;
    }
  }
}

