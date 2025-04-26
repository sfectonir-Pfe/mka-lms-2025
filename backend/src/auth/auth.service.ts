import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, loginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: loginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) {
      
      if (await bcrypt.compare(dto.password, user.password)) {
        return user;
      } else  throw new HttpException('invalid password', HttpStatus.BAD_REQUEST)
    } else {
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST)
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
