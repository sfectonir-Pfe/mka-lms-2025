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
}
