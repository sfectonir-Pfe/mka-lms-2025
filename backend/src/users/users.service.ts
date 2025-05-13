import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateByEmail(email: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (!existingUser) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { email },
      data: dto,
    });
  }
}
