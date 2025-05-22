import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'nestjs-prisma';



@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { programId, startDate, endDate, modules, imageUrl } = data;

    const parsedModules = JSON.parse(modules);

    const session = await this.prisma.session.create({
      data: {
        programId: Number(programId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl, // saved from multer
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
