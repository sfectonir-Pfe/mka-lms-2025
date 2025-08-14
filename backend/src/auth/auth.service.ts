import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly mailService: MailService) {}

  async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);
  if (!isPasswordValid) {
    throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
  }

  // ✅ Vérification : bloquer si non vérifié sauf si Admin
 if (!user.isVerified && user.role.toLowerCase() !== 'admin') {
  console.log('🧠 Forcing verification for:', user.email, 'Role:', user.role);
  const { password, resetToken, resetTokenExpiry, ...safeUser } = user;
  return { ...safeUser, needsVerification: true };
}

const { password, resetToken, resetTokenExpiry, ...safeUser } = user;
return { ...safeUser, needsVerification: false }; // Always include this

}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        name: dto.name,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        location: true,
        about: true,
        skills: true,
        profilePic: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        location: true,
        about: true,
        skills: true,
        profilePic: true,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: number, updateData: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        location: true,
        about: true,
        skills: true,
        profilePic: true,
      },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.prisma.$transaction(async (tx) => {
      // 1) Relations m:n et tables de liaison
      await tx.userSession2.deleteMany({ where: { userId: id } });

      // 2) Entités dépendantes obligatoires → delete
      await tx.notification.deleteMany({ where: { userId: id } });
      await tx.reclamation.deleteMany({ where: { userId: id } });
      await tx.feedbackList.deleteMany({ where: { userId: id } });
      await tx.resetToken.deleteMany({ where: { userId: id } });
      await tx.formateur.deleteMany({ where: { userId: id } });
      await tx.etudiant.deleteMany({ where: { userId: id } });
      await tx.createur_De_Formation.deleteMany({ where: { userId: id } });
      await tx.admin.deleteMany({ where: { userId: id } });
      await tx.etablissement.deleteMany({ where: { userId: id } });

      // 3) Entités avec FK optionnelle → set NULL
      await tx.feedback.updateMany({ where: { userId: id }, data: { userId: null } });
      await tx.seanceFeedback.updateMany({ where: { userId: id }, data: { userId: null } });
      await tx.sessionFeedback.updateMany({ where: { userId: id }, data: { userId: null } });
      await tx.chatMemory.updateMany({ where: { userId: id }, data: { userId: null } });

      await tx.chatMessage.updateMany({ where: { senderId: id }, data: { senderId: null } });
      await tx.session2ChatMessage.updateMany({ where: { senderId: id }, data: { senderId: null } });
      await tx.generalChatMessage.updateMany({ where: { senderId: id }, data: { senderId: null } });
      await tx.whiteboardAction.updateMany({ where: { createdById: id }, data: { createdById: null } });

      // 4) FeedbackFormateur: studentId (requis) → delete, autres FK → null
      await tx.feedbackFormateur.deleteMany({ where: { studentId: id } });
      await tx.feedbackFormateur.updateMany({ where: { formateurId: id }, data: { formateurId: null } });
      await tx.feedbackFormateur.updateMany({ where: { userId: id }, data: { userId: null } });

      // 5) Enfin supprimer l'utilisateur
      await tx.user.delete({ where: { id } });
    });
    return { id };
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        location: true,
        about: true,
        skills: true,
        profilePic: true,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        location: true,
        about: true,
        skills: true,
        profilePic: true,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

      const token = crypto.randomBytes(32).toString('hex');
      await this.prisma.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        },
      });

      await this.mailService.sendPasswordResetEmail(email, token);
      return { message: 'Reset link sent' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetPassword(token: string, newPass: string, confirmPass: string, ipAddress?: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);

    if (newPass !== confirmPass)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

    const hashedNew = await bcrypt.hash(newPass, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNew,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Send password change confirmation email
    try {
      const timestamp = new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      await this.mailService.sendPasswordChangeConfirmationEmail(
        user.email,
        timestamp,
        ipAddress
      );
      console.log('Password change confirmation email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send password change confirmation email:', emailError);
      // Don't throw error here - password reset was successful, email is just a notification
    }

    return { message: 'Password reset successful' };
  }

  async changePassword(email: string, currentPassword: string, newPassword: string, sendNotification?: boolean) {
    // Validation des entrées
    if (!email || !currentPassword || !newPassword) {
      throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
    }

    if (newPassword.length < 6) {
      throw new HttpException('New password must be at least 6 characters long', HttpStatus.BAD_REQUEST);
    }

    // Recherche de l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Vérifier que le mot de passe actuel est correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Current password is incorrect', HttpStatus.BAD_REQUEST);
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (currentPassword === newPassword) {
      throw new HttpException('New password must be different from current password', HttpStatus.BAD_REQUEST);
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    // Envoyer email de notification si demandé
    if (sendNotification) {
      try {
        const timestamp = new Date().toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        await this.mailService.sendPasswordChangeConfirmationEmail(
          user.email,
          timestamp
        );
        console.log('Password change confirmation email sent to:', user.email);
      } catch (emailError) {
        console.error('Failed to send password change confirmation email:', emailError);
        // Don't throw error here - password change was successful, email is just a notification
      }
    }

    return { message: 'Password changed successfully' };
  }
  async verifyUser(email: string) {
  if (!email || typeof email !== 'string') {
    throw new Error('Email invalide');
  }

  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Utilisateur introuvable');
  if (user.isVerified) return { message: 'Déjà vérifié', user };

  const updated = await this.prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      needsVerification: false, // ✅ add this
    },
  });

  return { message: 'Utilisateur vérifié avec succès', user: updated };
  
  }}