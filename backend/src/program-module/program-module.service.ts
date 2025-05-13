import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProgramModuleDto } from './dto/create-program-module.dto';

@Injectable()
export class ProgramModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async assign(dto: CreateProgramModuleDto) {
    const exists = await this.prisma.programModule.findUnique({
      where: {
        programId_moduleId: {
          programId: dto.programId,
          moduleId: dto.moduleId,
        },
      },
    });

    if (exists) {
      throw new ConflictException('Module already assigned to program');
    }

    return this.prisma.programModule.create({ data: dto });
  }

  findAll() {
    return this.prisma.programModule.findMany({
      include: {
        program: true,
        module: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.programModule.delete({ where: { id } });
  }
}
