import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateModuleDto) {
    // Basic input validation
    if (!data.name || !data.programId || !data.startDate || !data.endDate) {
      throw new BadRequestException('Tous les champs du module sont requis.');
    }

    return this.prisma.module.create({
      data: {
        name: data.name,
        programId: data.programId,
        startDate: new Date(data.startDate), // Safe conversion
        endDate: new Date(data.endDate),
      },
    });
  }

  findAll() {
    return this.prisma.module.findMany();
  }

  findByProgram(programId: number) {
    console.log("✅ Fetched for programId:", programId);
    return this.prisma.module.findMany({
      where: { programId },
      include: {
        courses: true,
      },
      orderBy: { id: 'asc' },
    });
  }
  
  

  findOne(id: number) {
    return this.prisma.module.findUnique({
      where: { id },
    });
  }

  update(id: number, data: UpdateModuleDto) {
    if (!data.name || !data.programId || !data.startDate || !data.endDate) {
      throw new BadRequestException('Tous les champs du module sont requis pour la mise à jour.');
    }

    return this.prisma.module.update({
      where: { id },
      data: {
        name: data.name,
        programId: data.programId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  remove(id: number) {
    return this.prisma.module.delete({
      where: { id },
    });
  }
}
