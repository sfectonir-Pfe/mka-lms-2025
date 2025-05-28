import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProgramDto) {
    return this.prisma.program.create({ data });
  }

  async findAll() {
    return this.prisma.program.findMany();
  }

  async remove(id: number) {
    return this.prisma.program.delete({ where: { id } });
  }
  


async rebuildProgram(id: number, data: any) {
  const { name, level, modules } = data;

  // 1. Update name if provided
  await this.prisma.program.update({
    where: { id },
    data: { name },
  });

  // 2. Clean existing links
  await this.prisma.programModule.deleteMany({ where: { programId: id } });

  // 3. Rebuild all relations
  for (const mod of modules) {
    const { moduleId, courses } = mod;

    await this.prisma.programModule.create({
      data: {
        programId: id,
        moduleId,
      },
    });

    for (const course of courses) {
      const { courseId, contenus } = course;

      await this.prisma.moduleCourse.create({
        data: {
          moduleId,
          courseId,
        },
      });

      for (const contenu of contenus) {
        await this.prisma.courseContenu.create({
          data: {
            courseId,
            contenuId: contenu.contenuId,
          },
        });
      }
    }
  }

  return { message: 'Programme reconstruit avec succès ✅' };
}

async update(id: number, data: any) {
  return this.prisma.program.update({
    where: { id },
    data,
  });
}
async publishProgram(id: number) {
  const program = await this.prisma.program.findUnique({
    where: { id },
  });

  if (!program) {
    throw new NotFoundException('Programme non trouvé');
  }

  const updated = await this.prisma.program.update({
    where: { id },
    data: { published: !program.published },
  });

  return {
    message: `Programme ${updated.published ? 'publié' : 'dépublié'} avec succès ✅`,
    program: updated,
  };
}



}