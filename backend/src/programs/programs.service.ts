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
    return this.prisma.program.findMany({
      include: {
        sessions2: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
        buildProgram: {
          include: {
            modules: {
              include: {
                courses: {
                  include: {
                    contenus: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        published: true,
        createdAt: true,
      },
    });
    
    if (!program) {
      throw new NotFoundException('Programme non trouvé');
    }
    
    return program;
  }

  async remove(id: number) {
    return this.prisma.program.delete({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.program.update({
      where: { id },
      data,
    });
  }

  async publishProgram(id: number) {
    const program = await this.prisma.program.findUnique({ where: { id } });

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

  async linkSession2ToProgram(session2Id: number, programId: number) {
    const session2 = await this.prisma.session2.findUnique({ where: { id: session2Id } });
    if (!session2) throw new NotFoundException('Session2 non trouvée');

    const program = await this.prisma.program.findUnique({ where: { id: programId } });
    if (!program) throw new NotFoundException('Programme non trouvé');

    const updated = await this.prisma.session2.update({
      where: { id: session2Id },
      data: { programId },
    });

    return {
      message: 'Session2 liée au programme avec succès ✅',
      session2: updated,
    };
  }
  async rebuildProgram(id: number, data: any) {
  const { name, modules } = data;

  // 1. Mise à jour du nom du programme
  await this.prisma.program.update({
    where: { id },
    data: { name },
  });

  // 2. Suppression des anciennes liaisons
  await this.prisma.programModule.deleteMany({ where: { programId: id } });

  // 3. Reconstruction des relations
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

}
