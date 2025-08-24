import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  private async send(to: string, subject: string, html: string) {
    try {
      const response = await this.mailerService.sendMail({
        from: 'LMS Platform <majdlabidi666@gmail.com>',
        to,
        subject,
        html,
      });
      console.log("Email sent successfully:", response)
      return response;
    } catch (error) {
      console.error("Failed to send email:", error);
      // Ne pas échouer complètement si l'email ne peut pas être envoyé
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `http://localhost:3000/ResetPasswordPage?token=${token}&email=${encodeURIComponent(to)}`;
  return this.send(to, '🔐 Réinitialisation de mot de passe - Plateforme LMS', `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <!-- En-tête -->
      <div style="background:#1976d2;padding:30px 20px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">🔐 Réinitialisation de mot de passe</h1>
        <p style="color:#dce3ec;margin-top:8px;">Plateforme LMS</p>
      </div>

      <!-- Contenu -->
      <div style="padding:30px 20px;">
        <p style="font-size:16px;color:#333;">Bonjour,</p>
        <p style="font-size:16px;color:#333;line-height:1.5;">
          Nous avons reçu une demande de réinitialisation de votre mot de passe.<br>
          
        </p>

       

        <p style="font-size:15px;color:#333;margin-bottom:30px;">
          Vous pouvez également cliquer sur le bouton ci-dessous pour procéder directement :
        </p>

        <div style="text-align:center;">
          <a href="${resetLink}" target="_blank"
             style="background:#1976d2;color:#fff;text-decoration:none;padding:12px 30px;border-radius:30px;font-weight:bold;font-size:16px;display:inline-block;">
            🔁 Réinitialiser mon mot de passe
          </a>
        </div>

        <div style="margin-top:30px;padding:15px;background:#fff3cd;border-left:4px solid #ffc107;border-radius:6px;">
          <p style="margin:0;font-size:14px;color:#856404;">
            ⚠️ Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.
          </p>
        </div>
      </div>

      <!-- Pied de page -->
      <div style="background:#f8f9fa;padding:20px;text-align:center;font-size:13px;color:#666;border-top:1px solid #e0e0e0;">
        <p style="margin:0;">Besoin d’aide ? Contactez-nous à <a href="mailto:tunirdigital@gmail.com" style="color:#1976d2;text-decoration:none;">tunirdigital@gmail.com</a></p>
        <p style="margin:8px 0 0 0;">© 2025 Plateforme LMS</p>
      </div>

    </div>
  `);
}

  async sendWelcomeEmail(to: string, tempPassword: string, role: string) {
    return this.send(to, '🎓 Bienvenue sur la plateforme LMS', `
      <div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:5px">
        <h2 style="color:#1976d2;text-align:center">Bienvenue sur la plateforme LMS!</h2>
        <p>Votre compte a été créé avec succès. Voici vos identifiants de connexion :</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0">
          <p><strong>Email:</strong> ${to}</p>
          <p><strong>Mot de passe temporaire:</strong> <span style="font-family:monospace;background:#e0e0e0;padding:3px 6px;border-radius:3px">${tempPassword}</span></p>
          <p><strong>Rôle:</strong> ${role}</p>
        </div>
        <p style="color:#666;font-size:14px;margin:15px 0">
          Cliquez sur le bouton ci-dessous pour vous connecter à la plateforme avec vos identifiants :
        </p>
        <div style="text-align:center;margin-top:30px">
          <a href="http://localhost:3000/login?forceLogout=true&email=${encodeURIComponent(to)}"
             style="background:#1976d2;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;font-weight:bold"
             target="_blank">
            Se connecter
          </a>
        </div>


      </div>
    `);
  }

  async sendSessionActivatedEmail(to: string, userName: string, sessionName: string, sessionStartDate: string, sessionEndDate: string) {
    return this.send(to, '🚀 Session Activée - Plateforme LMS', `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

        <!-- En-tête -->
        <div style="background:linear-gradient(135deg, #1976d2, #42a5f5);padding:30px 20px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">🚀 Session Activée</h1>
          <p style="color:#dce3ec;margin-top:8px;">Plateforme LMS</p>
        </div>

        <!-- Contenu -->
        <div style="padding:30px 20px;">
          <p style="font-size:16px;color:#333;">Bonjour <strong>${userName}</strong>,</p>
          
          <div style="background:#e3f2fd;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #1976d2;">
            <h2 style="color:#1976d2;margin-top:0;font-size:20px;">🎓 Session: ${sessionName}</h2>
            <p style="font-size:16px;color:#333;margin:10px 0;">
              <strong>Votre session a été activée !</strong>
            </p>
            <p style="font-size:15px;color:#555;margin:5px 0;">
              📅 <strong>Période:</strong> ${sessionStartDate} - ${sessionEndDate}
            </p>
          </div>

          <p style="font-size:16px;color:#333;line-height:1.6;">
            Vous pouvez maintenant accéder à tous les contenus et ressources de cette session. 
            Connectez-vous à la plateforme pour commencer votre apprentissage !
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a href="http://localhost:3000/login" target="_blank"
               style="background:#1976d2;color:#fff;text-decoration:none;padding:15px 35px;border-radius:30px;font-weight:bold;font-size:16px;display:inline-block;box-shadow:0 4px 12px rgba(25,118,210,0.3);">
              🎯 Accéder à la session
            </a>
          </div>

          <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:20px 0;">
            <h3 style="color:#1976d2;margin-top:0;font-size:16px;">💡 Que faire maintenant ?</h3>
            <ul style="color:#555;line-height:1.6;">
              <li>Consultez les modules et cours disponibles</li>
              <li>Participez aux séances programmées</li>
              <li>Interagissez avec les formateurs et autres participants</li>
              <li>Suivez votre progression</li>
            </ul>
          </div>
        </div>

        <!-- Pied de page -->
        <div style="background:#f8f9fa;padding:20px;text-align:center;font-size:13px;color:#666;border-top:1px solid #e0e0e0;">
          <p style="margin:0;">Besoin d'aide ? Contactez-nous à <a href="mailto:tunirdigital@gmail.com" style="color:#1976d2;text-decoration:none;">tunirdigital@gmail.com</a></p>
          <p style="margin:8px 0 0 0;">© 2025 Plateforme LMS</p>
        </div>

      </div>
    `);
  }

  async sendPasswordChangeConfirmationEmail(to: string, timestamp: string, ipAddress?: string) {
    const loginLink = `http://localhost:3000/login`;
    return this.send(to, '🔒 Confirmation de changement de mot de passe', `
      <div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:5px">
        <h2 style="color:#1976d2;text-align:center">Mot de passe modifié avec succès</h2>

        <div style="background:#e8f5e8;border:1px solid #4caf50;border-radius:5px;padding:15px;margin:20px 0">
          <p style="color:#2e7d32;margin:0;font-weight:bold">✅ Votre mot de passe a été modifié avec succès</p>
        </div>

        <p>Votre mot de passe a été réinitialisé et modifié avec succès sur la plateforme LMS.</p>

        <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0">
          <h3 style="color:#333;margin-top:0">Détails de la modification :</h3>
          <p><strong>Date et heure :</strong> ${timestamp}</p>
          ${ipAddress ? `<p><strong>Adresse IP :</strong> ${ipAddress}</p>` : ''}
          <p><strong>Action :</strong> Réinitialisation de mot de passe</p>
        </div>

        <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:5px;padding:15px;margin:20px 0">
          <h3 style="color:#856404;margin-top:0">⚠️ Important - Sécurité</h3>
          <p style="color:#856404;margin:0">
            Si vous n'avez pas effectué cette modification, votre compte pourrait être compromis.
            Veuillez immédiatement :
          </p>
          <ul style="color:#856404;margin:10px 0">
            <li>Vous connecter et changer votre mot de passe</li>
            <li>Vérifier vos informations de compte</li>
            <li>Contacter notre support technique</li>
          </ul>
        </div>

        <div style="text-align:center;margin-top:30px">
          <a href="${loginLink}"
             style="background:#1976d2;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;font-weight:bold"
             target="_blank">
            Se connecter à la plateforme
          </a>
        </div>

        <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e0e0e0;color:#666;font-size:12px">
          <p>Si vous avez des questions ou des préoccupations concernant la sécurité de votre compte,
          contactez notre équipe de support à <strong>tunirdigital@gmail.com</strong></p>
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    `);
  }

  async sendPasswordResetEmailV2(to: string, token: string) {
    const resetLink = `http://localhost:3000/ResetPasswordPage?token=${token}&email=${to}`;
    return this.send(to, '🔐 Nouvelle demande de réinitialisation - Plateforme LMS', `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:650px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">

        <!-- Header avec gradient -->
        <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:40px 30px;text-align:center">
          <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:300;letter-spacing:1px">🔐 Réinitialisation</h1>
          <p style="color:#e8f0fe;margin:10px 0 0 0;font-size:16px;opacity:0.9">Plateforme LMS</p>
        </div>

        <!-- Contenu principal -->
        <div style="padding:40px 30px">
          <div style="text-align:center;margin-bottom:30px">
            <div style="background:#f8f9ff;border-radius:50%;width:80px;height:80px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center">
              <span style="font-size:36px">🔑</span>
            </div>
            <h2 style="color:#2c3e50;margin:0;font-size:24px;font-weight:600">Demande de réinitialisation reçue</h2>
          </div>

          <p style="color:#5a6c7d;font-size:16px;line-height:1.6;margin-bottom:25px;text-align:center">
            Nous avons reçu une demande de réinitialisation de votre mot de passe.
            Utilisez le code sécurisé ci-dessous pour créer un nouveau mot de passe.
          </p>

          <!-- Code de réinitialisation avec style moderne -->
          <div style="background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);border-radius:12px;padding:25px;margin:30px 0;text-align:center;position:relative">
            <div style="background:rgba(255,255,255,0.2);border-radius:8px;padding:20px;backdrop-filter:blur(10px)">
              <p style="color:#ffffff;margin:0 0 10px 0;font-size:14px;font-weight:500;letter-spacing:1px">CODE DE RÉINITIALISATION</p>
              <div style="background:#ffffff;border-radius:8px;padding:15px;margin:10px 0">
                <p style="font-family:'Courier New',monospace;font-size:20px;font-weight:bold;color:#2c3e50;margin:0;letter-spacing:3px;word-break:break-all">${token}</p>
              </div>
              <p style="color:#ffffff;margin:10px 0 0 0;font-size:12px;opacity:0.9">⏰ Valide pendant 2 heures</p>
            </div>
          </div>

          <!-- Bouton d'action principal -->
          <div style="text-align:center;margin:35px 0">
            <a href="${resetLink}"
               style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#ffffff;padding:16px 32px;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;display:inline-block;box-shadow:0 4px 15px rgba(102,126,234,0.4);transition:all 0.3s ease"
               target="_blank">
              🚀 Réinitialiser mon mot de passe
            </a>
          </div>

          <!-- Instructions supplémentaires -->
          <div style="background:#f8f9ff;border-left:4px solid #667eea;padding:20px;margin:30px 0;border-radius:0 8px 8px 0">
            <h3 style="color:#667eea;margin:0 0 15px 0;font-size:16px;font-weight:600">📋 Instructions :</h3>
            <ol style="color:#5a6c7d;margin:0;padding-left:20px;line-height:1.6">
              <li>Cliquez sur le bouton ci-dessus ou copiez le code</li>
              <li>Vous serez redirigé vers la page de réinitialisation</li>
              <li>Saisissez votre nouveau mot de passe (minimum 6 caractères)</li>
              <li>Confirmez votre nouveau mot de passe</li>
            </ol>
          </div>

          <!-- Avertissement de sécurité -->
          <div style="background:#fff3cd;border:1px solid #ffeaa7;border-radius:8px;padding:20px;margin:25px 0">
            <div style="display:flex;align-items:flex-start">
              <span style="font-size:20px;margin-right:12px">⚠️</span>
              <div>
                <h4 style="color:#d68910;margin:0 0 10px 0;font-size:16px">Sécurité importante</h4>
                <p style="color:#856404;margin:0;font-size:14px;line-height:1.5">
                  Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                  Votre mot de passe actuel reste inchangé et sécurisé.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f8f9ff;padding:25px 30px;border-top:1px solid #e9ecef">
          <div style="text-align:center">
            <p style="color:#6c757d;margin:0 0 10px 0;font-size:14px">
              Besoin d'aide ? Contactez notre support
            </p>
            <p style="margin:0">
              <a href="mailto:tunirdigital@gmail.com" style="color:#667eea;text-decoration:none;font-weight:600">
                📧 tunirdigital@gmail.com
              </a>
            </p>
          </div>
          <div style="text-align:center;margin-top:20px;padding-top:20px;border-top:1px solid #e9ecef">
            <p style="color:#adb5bd;margin:0;font-size:12px">
              © 2025 Plateforme LMS - Cet email a été envoyé automatiquement
            </p>
          </div>
        </div>
      </div>
    `);
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

  async sendReclamationResolvedEmail(to: string, userName: string, reclamationSubject: string, response?: string) {
    return this.send(to, '✅ Votre réclamation a été résolue - Plateforme LMS', `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:650px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">

        <!-- Header avec gradient -->
        <div style="background:linear-gradient(135deg, #4caf50 0%, #45a049 100%);padding:40px 30px;text-align:center">
          <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:300;letter-spacing:1px">✅ Réclamation Résolue</h1>
          <p style="color:#e8f5e8;margin:10px 0 0 0;font-size:16px;opacity:0.9">Plateforme LMS</p>
        </div>

        <!-- Contenu principal -->
        <div style="padding:40px 30px">
          <div style="text-align:center;margin-bottom:30px">
            <div style="background:#f1f8e9;border-radius:50%;width:80px;height:80px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center">
              <span style="font-size:36px">🎉</span>
            </div>
            <h2 style="color:#2c3e50;margin:0;font-size:24px;font-weight:600">Bonne nouvelle !</h2>
          </div>

          <p style="color:#5a6c7d;font-size:16px;line-height:1.6;margin-bottom:25px">
            Bonjour <strong>${userName}</strong>,
          </p>

          <div style="background:#e8f5e8;border-left:4px solid #4caf50;padding:20px;margin:30px 0;border-radius:0 8px 8px 0">
            <h3 style="color:#2e7d32;margin:0 0 15px 0;font-size:18px;font-weight:600">✅ Votre réclamation a été résolue</h3>
            <p style="color:#2e7d32;margin:0;font-size:16px;line-height:1.6">
              Nous avons le plaisir de vous informer que votre réclamation concernant 
              <strong>"${reclamationSubject}"</strong> a été traitée et résolue avec succès.
            </p>
          </div>

          ${response ? `
          <!-- Réponse de l'équipe -->
          <div style="background:#f8f9ff;border:1px solid #e3f2fd;border-radius:8px;padding:25px;margin:30px 0">
            <h3 style="color:#1976d2;margin:0 0 15px 0;font-size:16px;font-weight:600">📝 Réponse de notre équipe :</h3>
            <div style="background:#ffffff;border-radius:6px;padding:20px;border-left:4px solid #1976d2">
              <p style="color:#333;margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${response}</p>
            </div>
          </div>
          ` : ''}

          <!-- Actions recommandées -->
          <div style="background:#fff3e0;border:1px solid #ffb74d;border-radius:8px;padding:20px;margin:25px 0">
            <h3 style="color:#e65100;margin:0 0 15px 0;font-size:16px;font-weight:600">💡 Prochaines étapes :</h3>
            <ul style="color:#bf360c;margin:0;padding-left:20px;line-height:1.6">
              <li>Connectez-vous à votre espace personnel pour vérifier les modifications</li>
              <li>Si vous avez d'autres questions, n'hésitez pas à nous contacter</li>
              <li>Votre satisfaction est importante pour nous</li>
            </ul>
          </div>

          <!-- Bouton d'action -->
          <div style="text-align:center;margin:35px 0">
            <a href="http://localhost:3000/dashboard"
               style="background:linear-gradient(135deg, #4caf50 0%, #45a049 100%);color:#ffffff;padding:16px 32px;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;display:inline-block;box-shadow:0 4px 15px rgba(76,175,80,0.4);transition:all 0.3s ease"
               target="_blank">
              🚀 Accéder à mon espace
            </a>
          </div>

          <!-- Message de satisfaction -->
          <div style="background:#f8f9ff;border-radius:8px;padding:20px;margin:30px 0;text-align:center">
            <p style="color:#5a6c7d;margin:0;font-size:14px;line-height:1.5">
              Nous espérons que cette résolution répond à vos attentes. 
              Votre feedback nous aide à améliorer continuellement notre service.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f8f9ff;padding:25px 30px;border-top:1px solid #e9ecef">
          <div style="text-align:center">
            <p style="color:#6c757d;margin:0 0 10px 0;font-size:14px">
              Besoin d'aide supplémentaire ?
            </p>
            <p style="margin:0">
              <a href="mailto:tunirdigital@gmail.com" style="color:#4caf50;text-decoration:none;font-weight:600">
                📧 tunirdigital@gmail.com
              </a>
            </p>
          </div>
          <div style="text-align:center;margin-top:20px;padding-top:20px;border-top:1px solid #e9ecef">
            <p style="color:#adb5bd;margin:0;font-size:12px">
              © 2025 Plateforme LMS - Cet email a été envoyé automatiquement
            </p>
          </div>
        </div>
      </div>
    `);
  }
}

  
  
