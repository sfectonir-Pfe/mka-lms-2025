import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class Session2Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, file?: Express.Multer.File) {
    const { name, programId, startDate, endDate } = data;

    const programStructure = await this.prisma.session.findFirst({
      where: { programId: Number(programId) },
      include: {
        modules: {
          include: {
            module: true,
            courses: {
              include: {
                course: true,
                contenus: {
                  include: { contenu: true },
                },
              },
            },
          },
        },
      },
    });

    if (!programStructure) {
      throw new Error("Structure du programme introuvable.");
    }

    const session2 = await this.prisma.session2.create({
      data: {
        name,
        programId: Number(programId),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        imageUrl: file
          ? `http://localhost:8000/uploads/sessions/${file.filename}`
          : undefined,
      },
    });

    for (const mod of programStructure.modules) {
      const s2mod = await this.prisma.session2Module.create({
        data: {
          session2Id: session2.id,
          moduleId: mod.moduleId,
        },
      });

      for (const course of mod.courses) {
        const s2course = await this.prisma.session2Course.create({
          data: {
            session2ModuleId: s2mod.id,
            courseId: course.courseId,
          },
        });

        for (const ct of course.contenus) {
          await this.prisma.session2Contenu.create({
            data: {
              session2CourseId: s2course.id,
              contenuId: ct.contenuId,
            },
          });
        }
      }
    }

    return { message: "✅ Session2 créée avec structure copiée avec succès" };
  }

  async remove(id: number) {
    return this.prisma.session2.delete({
      where: { id },
    });
  }
  async findAll() {
  return this.prisma.session2.findMany({
    include: {
      program: true,
      session2Modules: {
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
