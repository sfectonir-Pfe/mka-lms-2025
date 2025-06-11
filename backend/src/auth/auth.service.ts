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

    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    // Check if user is active
    if (user.isActive === false) {
      throw new HttpException('Account is deactivated. Please contact an administrator.', HttpStatus.FORBIDDEN);
    }

    // Remove sensitive information before returning
    const { password, resetToken, resetTokenExpiry, ...safeUser } = user;
    return safeUser;
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

    await this.prisma.user.delete({ where: { id } });
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

  async changePassword(email: string, currentPassword: string, newPassword: string) {
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

    return { message: 'Password changed successfully' };
  }
}