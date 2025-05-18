import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly mailService: MailService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { email: dto.email, password: hashedPassword, role: dto.role },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }

  async findOne(id: number) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      location: true,
      profilePic: true,
      about: true,
      skills: true,
    },
  });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  return user;
}


  async update(id: number, dto: UpdateAuthDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        about: dto.about,
        phone: dto.phone,
        location: dto.location,
        skills: dto.skills,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 15),
      },
    });

    await this.mailService.sendPasswordResetEmail(email, token);
    return { message: 'Reset link sent' };
  }

  async resetPassword(token: string, oldPass: string, newPass: string, confirmPass: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    if (!(await bcrypt.compare(oldPass, user.password))) throw new HttpException('Old password incorrect', HttpStatus.BAD_REQUEST);
    if (newPass !== confirmPass) throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

    const hashedNew = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNew, resetToken: null, resetTokenExpiry: null },
    });

    return { message: 'Password reset successful' };
  }
 

}
