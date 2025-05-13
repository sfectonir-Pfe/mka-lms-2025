import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateModuleDto) {
    // Step 1: Create module only
    const module = await this.prisma.module.create({
      data: {
        name: data.name,
        periodUnit: data.periodUnit,
        duration: data.duration,
      },
    });

    // Step 2 (optional): link to program via ProgramModule
    if (data.programId) {
      await this.prisma.programModule.create({
        data: {
          programId: data.programId,
          moduleId: module.id,
        },
      });
    }

    return module;
  }

  findAll() {
    return this.prisma.module.findMany({
      include: { programs: true, courses: true },
    });
  }

  async findByProgram(programId: number) {
    const linked = await this.prisma.programModule.findMany({
      where: { programId },
      include: { module: true },
    });

    return linked.map((pm) => pm.module);
  }

  async findOne(id: number) {
    const mod = await this.prisma.module.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async update(id: number, data: UpdateModuleDto) {
    await this.findOne(id); // ensure exists

    return this.prisma.module.update({
      where: { id },
      data: {
        name: data.name,
        periodUnit: data.periodUnit,
        duration: data.duration,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.module.delete({ where: { id } });
  }
}
