import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { programId, level, modules /*, startDate, endDate, imageUrl */ } = data;

    const parsedModules = JSON.parse(modules);

    const session = await this.prisma.session.create({
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
      const sessionModule = await this.prisma.sessionModule.create({
        data: {
          sessionId: session.id,
          moduleId: mod.moduleId,
        },
      });

      for (const course of mod.courses) {
        const sessionCourse = await this.prisma.sessionCourse.create({
          data: {
            sessionModuleId: sessionModule.id,
            courseId: course.courseId,
          },
        });

        for (const contenu of course.contenus) {
          await this.prisma.sessionContenu.create({
            data: {
              sessionCourseId: sessionCourse.id,
              contenuId: contenu.contenuId,
            },
          });
        }
      }
    }

    return { message: 'Session créée avec succès ✅', sessionId: session.id };
  }

  async findAll() {
    return this.prisma.session.findMany({
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
    return this.prisma.session.delete({
      where: { id },
    });
  }
  async update(id: number, body: any, file?: Express.Multer.File) {
  const { level, startDate, endDate, modules } = body;
  const parsedModules = typeof modules === 'string' ? JSON.parse(modules) : modules;

  // 1. Update base session data
  await this.prisma.session.update({
    where: { id },
    data: {
      level: level || "Basique",
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      imageUrl: file ? `http://localhost:8000/uploads/sessions/${file.filename}` : undefined,
    },
  });

  // 2. Remove all existing session links
  await this.prisma.sessionContenu.deleteMany({
    where: { sessionCourse: { sessionModule: { sessionId: id } } },
  });

  await this.prisma.sessionCourse.deleteMany({
    where: { sessionModule: { sessionId: id } },
  });

  await this.prisma.sessionModule.deleteMany({
    where: { sessionId: id },
  });

  // 3. Re-create updated structure
  for (const mod of parsedModules) {
    const sessionModule = await this.prisma.sessionModule.create({
      data: {
        sessionId: id,
        moduleId: mod.moduleId,
      },
    });

    for (const course of mod.courses) {
      const sessionCourse = await this.prisma.sessionCourse.create({
        data: {
          sessionModuleId: sessionModule.id,
          courseId: course.courseId,
        },
      });

      for (const contenu of course.contenus) {
        await this.prisma.sessionContenu.create({
          data: {
            sessionCourseId: sessionCourse.id,
            contenuId: contenu.contenuId,
          },
        });
      }
    }
  }

  return { message: "✅ Session modifiée avec succès !" };
}
async findByProgramId(programId: number) {
  return this.prisma.session.findFirst({
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
