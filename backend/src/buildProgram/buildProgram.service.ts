import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class buildProgramService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { programId, level, modules /*, startDate, endDate, imageUrl */ } = data;

    const parsedModules = JSON.parse(modules);

    const buildProgram = await this.prisma.buildProgram.create({
      data: {
        programId: Number(programId),
        level,
        // Optional future fields:
        // startDate: startDate ? new Date(startDate) : undefined,
        // endDate: endDate ? new Date(endDate) : undefined,
        // imageUrl,
      },
    });

    for (const mod of parsedModules) {
      const buildProgramModule = await this.prisma.buildProgramModule.create({
        data: {
          buildProgramId: buildProgram.id,
          moduleId: mod.moduleId,
        },
      });

      for (const course of mod.courses) {
        const buildProgramCourse = await this.prisma.buildProgramCourse.create({
          data: {
            buildProgramModuleId: buildProgramModule.id,
            courseId: course.courseId,
          },
        });

        for (const contenu of course.contenus) {
          await this.prisma.buildProgramContenu.create({
            data: {
              buildProgramCourseId: buildProgramCourse.id,
              contenuId: contenu.contenuId,
            },
          });
        }
      }
    }

    return { message: 'Program créée avec succès ✅', buildProgramId: buildProgram.id };
  }

  async findAll() {
    return this.prisma.buildProgram.findMany({
      include: {
        program: true,
        modules: {
          include: {
            module: true,
            courses: {
              include: {
                course: true,
                contenus: {
                  include: {
                    contenu: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.buildProgram.delete({
      where: { id },
    });
  }
  async update(id: number, body: any, file?: Express.Multer.File) {
  const { level, startDate, endDate, modules } = body;
  const parsedModules = typeof modules === 'string' ? JSON.parse(modules) : modules;

  // 1. Update base session data
  await this.prisma.buildProgram.update({
    where: { id },
    data: {
      level: level || "Basique",
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      imageUrl: file ? `http://localhost:8000/uploads/sessions/${file.filename}` : undefined,
    },
  });

  // 2. Remove all existing session links
  await this.prisma.buildProgramContenu.deleteMany({
    where: { buildProgramCourse: { buildProgramModule: { buildProgramId: id } } },
  });

  await this.prisma.buildProgramCourse.deleteMany({
    where: { buildProgramModule: { buildProgramId: id } },
  });

  await this.prisma.buildProgramModule.deleteMany({
    where: { buildProgramId: id },
  });

  // 3. Re-create updated structure
  for (const mod of parsedModules) {
    const buildProgramModule = await this.prisma.buildProgramModule.create({
      data: {
        buildProgramId: id,
        moduleId: mod.moduleId,
      },
    });

    for (const course of mod.courses) {
      const buildProgramCourse = await this.prisma.buildProgramCourse.create({
        data: {
          buildProgramModuleId: buildProgramModule.id,
          courseId: course.courseId,
        },
      });

      for (const contenu of course.contenus) {
        await this.prisma.buildProgramContenu.create({
          data: {
            buildProgramCourseId: buildProgramCourse.id,
            contenuId: contenu.contenuId,
          },
        });
      }
    }
  }

  return { message: "✅ Program modifiée avec succès !" };
}
async findByProgramId(programId: number) {
  return this.prisma.buildProgram.findFirst({
    where: { programId },
    include: {
      program: true,
      modules: {
        include: {
          module: true,
          courses: {
            include: {
              course: true,
              contenus: {
                include: {
                  contenu: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

}
