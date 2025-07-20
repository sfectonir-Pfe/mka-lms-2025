import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { MailService } from './mail.service';
import { PrismaService } from 'nestjs-prisma'; // or wherever you have Prisma setup
import * as crypto from 'crypto';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService, // Inject Prisma to interact with users
  ) {}

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');

    // Store token + expiration (optional: add resetToken + resetTokenExpiry in your user model)
    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 120), //time
      },
    });

    await this.mailService.sendPasswordResetEmail(email, token);

    return { message: 'Reset email sent' };
  }

  @Post('test-password-change-email')
  async testPasswordChangeEmail(@Body() body: { email: string, ipAddress?: string }) {
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
        body.email,
        timestamp,
        body.ipAddress || '192.168.1.100'
      );

      return {
        success: true,
        message: 'Password change confirmation email sent successfully',
        details: {
          email: body.email,
          timestamp,
          ipAddress: body.ipAddress || '192.168.1.100'
        }
      };
    } catch (error) {
      throw new NotFoundException(`Failed to send email: ${error.message}`);
    }
  }

  @Post('test-password-reset-v2')
  async testPasswordResetV2(@Body() body: { email: string }) {
    try {
      // Générer un token de test
      const token = crypto.randomBytes(32).toString('hex');

      await this.mailService.sendPasswordResetEmailV2(
        body.email,
        token
      );

      return {
        success: true,
        message: 'New password reset email (V2) sent successfully',
        details: {
          email: body.email,
          token: token.substring(0, 8) + '...', // Afficher seulement les premiers caractères pour la sécurité
          template: 'Version 2 - Design moderne avec gradient'
        }
      };
    } catch (error) {
      throw new NotFoundException(`Failed to send email: ${error.message}`);
    }
  }
}
