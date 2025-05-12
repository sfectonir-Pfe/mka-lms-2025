import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, loginDto, RegisterDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto'; 
import * as nodemailer from 'nodemailer';
import { MailService } from '../mail/mail.service'; 
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly mailService: MailService ) {}

  async login(dto: loginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) {
      if (await bcrypt.compare(dto.password, user.password)) {
        return user;
      } else
        throw new HttpException('invalid password', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST);
    }
  }
  
  async addUser(dto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) {
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST);
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      return await this.prisma.user.create({
        data: {
          role: dto.role,
          email: dto.email,
          password: hashedPassword,
        },
      });
    }
  }
  async register(dto: RegisterDto) {
    const { email, password, role } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
  }
  

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true
        }
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  async remove(id: number) { // Changed to number type
    return this.prisma.user.delete({
      where: { id },
    });
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
        resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 15),
      },
    });
    await this.mailService.sendPasswordResetEmail(email, token);
    

    return {
      message: 'Reset link sent',
      
    };
   
  }
   catch (error) {
     console.log(error) 
    }
};
  
  async resetPassword(token: string, oldPass: string, newPass: string, confirmPass: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);

    const isOldCorrect = await bcrypt.compare(oldPass, user.password);
    if (!isOldCorrect) throw new HttpException('Old password incorrect', HttpStatus.BAD_REQUEST);

    if (newPass !== confirmPass) throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

    const hashedNew = await bcrypt.hash(newPass, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNew,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }
}


  
