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
}
