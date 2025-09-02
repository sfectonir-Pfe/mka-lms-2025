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

  async sendStudentFeedbackEmail(
    to: string, 
    studentName: string, 
    groupName: string,
    fromStudentName: string, 
    questionText: string,
    reaction: string,
    seanceId: string
  ) {
    // Mapper la réaction à un emoji et un texte
    const reactionMap = {
      'excellent': { emoji: '🤩', text: 'Excellent', color: '#4caf50' },
      'very_good': { emoji: '😃', text: 'Très bien', color: '#8bc34a' },
      'good': { emoji: '🙂', text: 'Bien', color: '#ff9800' },
      'average': { emoji: '😐', text: 'Moyen', color: '#ffc107' },
      'poor': { emoji: '🤨', text: 'Insuffisant', color: '#f44336' }
    };

    const reactionInfo = reactionMap[reaction] || { emoji: '❓', text: 'Non évalué', color: '#9e9e9e' };

    return this.send(to, `📝 Nouveau feedback reçu - ${groupName}`, `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">

        <!-- Header avec gradient -->
        <div style="background:linear-gradient(135deg, #2196f3 0%, #1976d2 100%);padding:30px 20px;text-align:center">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:300;letter-spacing:1px">📝 Nouveau Feedback Reçu</h1>
          <p style="color:#e3f2fd;margin:8px 0 0 0;font-size:16px;opacity:0.9">Plateforme LMS - Évaluation par les pairs</p>
        </div>

        <!-- Contenu principal -->
        <div style="padding:30px 20px">
          <div style="text-align:center;margin-bottom:25px">
            <div style="background:#e3f2fd;border-radius:50%;width:70px;height:70px;margin:0 auto 15px;display:flex;align-items:center;justify-content:center">
              <span style="font-size:32px">🎯</span>
            </div>
            <h2 style="color:#2c3e50;margin:0;font-size:22px;font-weight:600">Bonjour ${studentName} !</h2>
          </div>

          <p style="color:#5a6c7d;font-size:16px;line-height:1.6;margin-bottom:20px">
            Vous avez reçu un <strong>nouveau feedback</strong> de la part de <strong>${fromStudentName}</strong> dans le groupe <strong>${groupName}</strong>.
          </p>

          <!-- Détails du feedback -->
          <div style="background:#f8f9ff;border:1px solid #e3f2fd;border-radius:10px;padding:25px;margin:25px 0">
            <h3 style="color:#1976d2;margin:0 0 20px 0;font-size:18px;font-weight:600;text-align:center">
              📋 Détails de l'évaluation
            </h3>
            
            <!-- Question -->
            <div style="background:#ffffff;border-radius:8px;padding:20px;margin-bottom:20px;border-left:4px solid #2196f3;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
              <h4 style="color:#2c3e50;margin:0 0 15px 0;font-size:16px;font-weight:600">
                ❓ Question évaluée
              </h4>
              <p style="color:#333;font-size:15px;line-height:1.5;margin:0;">${questionText}</p>
            </div>

            <!-- Évaluation -->
            <div style="background:#ffffff;border-radius:8px;padding:20px;border-left:4px solid ${reactionInfo.color};box-shadow:0 2px 8px rgba(0,0,0,0.1)">
              <h4 style="color:#2c3e50;margin:0 0 15px 0;font-size:16px;font-weight:600">
                ⭐ Évaluation reçue
              </h4>
              <div style="display:flex;align-items:center;justify-content:center;gap:15px;">
                <span style="font-size:36px;">${reactionInfo.emoji}</span>
                <span style="background:${reactionInfo.color};color:white;padding:8px 16px;border-radius:20px;font-size:16px;font-weight:600;">
                  ${reactionInfo.text}
              </span>
              </div>
            </div>
          </div>

          <!-- Informations sur la séance -->
          <div style="background:#fff3e0;border:1px solid #ffb74d;border-radius:8px;padding:20px;margin:20px 0">
            <h4 style="color:#f57c00;margin:0 0 10px 0;font-size:16px;font-weight:600">
              📅 Informations de la séance
            </h4>
            <p style="color:#5a6c7d;font-size:14px;margin:0;line-height:1.4">
              <strong>Groupe:</strong> ${groupName}<br>
              <strong>ID Séance:</strong> ${seanceId}<br>
              <strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <!-- Message d'encouragement -->
          <div style="text-align:center;margin-top:25px;padding:20px;background:#e8f5e8;border-radius:8px;">
            <p style="color:#2e7d32;font-size:15px;margin:0;font-weight:500;">
              💡 Ce feedback vous aide à vous améliorer. Continuez vos efforts !
            </p>
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

  async sendStudentFeedbackSummaryEmail(
    to: string,
    studentName: string,
    groupName: string,
    feedbacks: any[],
    fromStudentName: string
  ) {
    console.log(`📧 sendStudentFeedbackSummaryEmail appelé avec:`, {
      to,
      studentName,
      groupName,
      feedbacksCount: feedbacks.length,
      fromStudentName
    });
    // Grouper les feedbacks par catégorie
    const feedbacksByCategory = feedbacks.reduce((acc, feedback) => {
      if (!acc[feedback.category]) {
        acc[feedback.category] = [];
      }
      acc[feedback.category].push(feedback);
      return acc;
    }, {});

    // Générer le HTML pour chaque catégorie
    const categorySections = Object.entries(feedbacksByCategory).map(([category, categoryFeedbacks]) => {
      const categoryText = this.getCategoryText(category);
      const feedbacksHtml = (categoryFeedbacks as any[]).map(feedback => {
        const ratingText = this.getRatingText(feedback.rating);
        const ratingEmoji = this.getRatingEmoji(feedback.rating);
        return `
          <div style="background:#ffffff;border-radius:8px;padding:20px;margin:15px 0;border-left:4px solid #2196f3;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span style="font-size:24px">${ratingEmoji}</span>
              <span style="background:#e3f2fd;color:#1976d2;padding:4px 12px;border-radius:12px;font-size:14px;font-weight:600">
                ${ratingText}
              </span>
            </div>
            ${feedback.comment && feedback.comment !== `Emoji: ${this.mapRatingToReaction(feedback.rating)}` ? `
              <div style="margin-top:10px;padding:10px;background:#f8f9ff;border-radius:6px;">
                <p style="margin:0;color:#333;font-size:14px;line-height:1.5">${feedback.comment}</p>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      return `
        <div style="margin-bottom:30px;">
          <h3 style="color:#1976d2;margin:0 0 15px 0;font-size:18px;font-weight:600;border-bottom:2px solid #e3f2fd;padding-bottom:8px;">
            📋 ${categoryText}
          </h3>
          ${feedbacksHtml}
        </div>
      `;
    }).join('');

    // Calculer la note moyenne globale
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : 0;
    const averageRatingText = this.getRatingText(Math.round(parseFloat(averageRating.toString())));
    const averageRatingEmoji = this.getRatingEmoji(Math.round(parseFloat(averageRating.toString())));

    return this.send(to, `📊 Récapitulatif de vos feedbacks - ${groupName}`, `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:700px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">

        <!-- Header avec gradient -->
        <div style="background:linear-gradient(135deg, #4caf50 0%, #45a049 100%);padding:40px 30px;text-align:center">
          <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:300;letter-spacing:1px">📊 Récapitulatif de vos Feedbacks</h1>
          <p style="color:#e8f5e8;margin:10px 0 0 0;font-size:16px;opacity:0.9">Plateforme LMS - Évaluation par les pairs</p>
        </div>

        <!-- Contenu principal -->
        <div style="padding:40px 30px">
          <div style="text-align:center;margin-bottom:30px">
            <div style="background:#e8f5e8;border-radius:50%;width:80px;height:80px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center">
              <span style="font-size:36px">🎯</span>
            </div>
            <h2 style="color:#2c3e50;margin:0;font-size:24px;font-weight:600">Bonjour ${studentName} !</h2>
          </div>

          <p style="color:#5a6c7d;font-size:16px;line-height:1.6;margin-bottom:25px">
            Vous avez reçu <strong>${feedbacks.length} feedback(s)</strong> de la part de <strong>${fromStudentName}</strong> dans le groupe <strong>${groupName}</strong>.
          </p>

          <!-- Note moyenne globale -->
          <div style="background:linear-gradient(135deg, #4caf50 0%, #45a049 100%);border-radius:12px;padding:25px;margin:30px 0;text-align:center;color:white;">
            <h3 style="margin:0 0 15px 0;font-size:20px;font-weight:600;opacity:0.9">⭐ Note Moyenne Globale</h3>
            <div style="font-size:48px;margin:10px 0;">${averageRatingEmoji}</div>
            <div style="font-size:24px;font-weight:600;margin-bottom:10px;">${averageRatingText}</div>
            <div style="font-size:18px;opacity:0.8;">${averageRating}/5</div>
          </div>

          <!-- Détails des feedbacks par catégorie -->
          <div style="background:#f8f9ff;border:1px solid #e3f2fd;border-radius:8px;padding:25px;margin:30px 0">
            <h3 style="color:#1976d2;margin:0 0 20px 0;font-size:20px;font-weight:600;text-align:center">
              📋 Détails de vos évaluations
            </h3>
            ${categorySections}
          </div>

          <!-- Informations sur l'évaluation par les pairs -->
          <div style="background:#fff3e0;border:1px solid #ffb74d;border-radius:8px;padding:20px;margin:25px 0">
            <h3 style="color:#e65100;margin:0 0 15px 0;font-size:16px;font-weight:600">💡 À propos de l'évaluation par les pairs :</h3>
            <ul style="color:#bf360c;margin:0;padding-left:20px;line-height:1.6">
              <li>Ces évaluations vous aident à identifier vos points forts et axes d'amélioration</li>
              <li>Elles contribuent à votre développement personnel et professionnel</li>
              <li>Utilisez ces retours pour progresser dans vos compétences</li>
              <li>La note moyenne vous donne une vue d'ensemble de votre performance</li>
            </ul>
          </div>

          <!-- Bouton d'action -->
          <div style="text-align:center;margin:35px 0">
            <a href="http://localhost:3000/dashboard"
               style="background:linear-gradient(135deg, #4caf50 0%, #45a049 100%);color:#ffffff;padding:16px 32px;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;display:inline-block;box-shadow:0 4px 15px rgba(76,175,80,0.4);transition:all 0.3s ease"
               target="_blank">
              🚀 Voir tous mes feedbacks
            </a>
          </div>

          <!-- Message d'encouragement -->
          <div style="background:#f8f9ff;border-radius:8px;padding:20px;margin:30px 0;text-align:center">
            <p style="color:#5a6c7d;margin:0;font-size:14px;line-height:1.5">
              Continuez à vous investir dans votre formation ! 
              Chaque feedback est une opportunité d'apprentissage et de croissance.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f8f9ff;padding:25px 30px;border-top:1px solid #e9ecef">
          <div style="text-align:center">
            <p style="color:#6c757d;margin:0 0 10px 0;font-size:14px">
              Questions sur vos feedbacks ?
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

  // Méthodes utilitaires pour le formatage
  private getCategoryText(category: string): string {
    const categoryMap = {
      'collaboration': 'Collaboration',
      'communication': 'Communication', 
      'participation': 'Participation',
      'qualite_travail': 'Qualité du travail'
    };
    return categoryMap[category] || category;
  }

  private getRatingText(rating: number): string {
    const ratingMap = {
      5: 'Excellent',
      4: 'Très bien',
      3: 'Bien',
      2: 'Moyen',
      1: 'À améliorer'
    };
    return ratingMap[rating] || 'Non évalué';
  }

  private getRatingEmoji(rating: number): string {
    const emojiMap = {
      5: '🤩',
      4: '😃', 
      3: '🙂',
      2: '😐',
      1: '🤨'
    };
    return emojiMap[rating] || '😐';
  }

  private mapRatingToReaction(rating: number): string {
    const mapping = {
      5: 'excellent',
      4: 'very_good',
      3: 'good',
      2: 'average',
      1: 'poor'
    };
    return mapping[rating] || 'good';
  }

  async sendFeedbackEmail(to: string, studentName: string, formateurName: string, emoji: string, emojiLabel: string, commentaire: string, seanceName?: string) {
    return this.send(to, `📝 Nouveau feedback de votre formateur - ${emoji}`, `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

        <!-- En-tête -->
        <div style="background:linear-gradient(135deg, #1976d2 0%, #1565c0 100%);padding:30px 20px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">📝 Nouveau feedback reçu</h1>
          <p style="color:#dce3ec;margin-top:8px;">Plateforme LMS</p>
        </div>

        <!-- Contenu principal -->
        <div style="padding:30px 20px;">
          <p style="font-size:16px;color:#333;margin-bottom:20px;">
            Bonjour <strong>${studentName}</strong>,<br>
            Votre formateur <strong>${formateurName}</strong> vous a envoyé un nouveau feedback !
          </p>

          <!-- Feedback details -->
          <div style="background:#f8f9fa;border-radius:8px;padding:25px;margin:25px 0;border-left:4px solid #1976d2;">
            <div style="text-align:center;margin-bottom:20px;">
              <span style="font-size:48px;display:block;margin-bottom:10px;">${emoji}</span>
              <h3 style="color:#1976d2;margin:0;font-size:18px;">${emojiLabel}</h3>
            </div>
            
            ${commentaire ? `
              <div style="background:#fff;border-radius:6px;padding:20px;margin:15px 0;border:1px solid #e0e0e0;">
                <h4 style="color:#333;margin:0 0 10px 0;font-size:16px;">💬 Commentaire du formateur :</h4>
                <p style="color:#555;margin:0;font-size:15px;line-height:1.6;font-style:italic;">
                  "${commentaire}"
                </p>
              </div>
            ` : ''}
          </div>

          ${seanceName ? `
            <div style="background:#e3f2fd;border-radius:6px;padding:15px;margin:20px 0;border-left:4px solid #2196f3;">
              <p style="margin:0;color:#1565c0;font-size:14px;">
                📚 Séance : <strong>${seanceName}</strong>
              </p>
            </div>
          ` : ''}

          <!-- Message d'encouragement -->
          <div style="background:#f3e5f5;border-radius:8px;padding:20px;margin:25px 0;text-align:center;">
            <p style="color:#7b1fa2;margin:0;font-size:15px;line-height:1.5;">
              💪 Utilisez ce feedback pour continuer à progresser dans votre formation !
            </p>
          </div>

          <!-- Bouton d'action -->
          <div style="text-align:center;margin:30px 0;">
            <a href="http://localhost:3000/dashboard"
               style="background:linear-gradient(135deg, #4caf50 0%, #45a049 100%);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:25px;font-weight:600;font-size:16px;display:inline-block;box-shadow:0 4px 15px rgba(76,175,80,0.4);transition:all 0.3s ease"
               target="_blank">
              🚀 Voir mon dashboard
            </a>
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
}

  
  
