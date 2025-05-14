import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(email: string) {
    console.log('📩 Email reçu dans getByEmail:', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateByEmail(email: string, dto: any, file?: Express.Multer.File) {
    // ✅ Parse skills from string if needed
    if (dto.skills && typeof dto.skills === 'string') {
      try {
        dto.skills = JSON.parse(dto.skills);
      } catch (e) {
        console.error('❌ Failed to parse skills:', e);
        dto.skills = [];
      }
    }

    const updateData: any = {
      name: dto.name,
      phone: dto.phone,
      location: dto.location,
      about: dto.about,
      skills: dto.skills,
    };

    if (file) {
      updateData.profilePic = `/uploads/${file.filename}`;
    }

    return this.prisma.user.update({
      where: { email },
      data: updateData,
    });
  }
}
