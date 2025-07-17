import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { $Enums } from '@prisma/client';

@Injectable()
export class Session2Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, file?: Express.Multer.File) {
    const { name, programId, startDate, endDate } = data;

    const programStructure = await this.prisma.buildProgram.findFirst({
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
 async addUserToSession(session2Id: number, email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException("Utilisateur introuvable");

    const exists = await this.prisma.userSession2.findUnique({
      where: { userId_session2Id: { userId: user.id, session2Id } },
    });
    if (exists) throw new BadRequestException("Utilisateur déjà dans la session");

    await this.prisma.userSession2.create({
      data: { userId: user.id, session2Id },
    });

    return { message: "Utilisateur ajouté à la session !" };
  }
  // session2.service.ts
async getUsersForSession(session2Id: number) {
  // Assumes you have a join table: userSession2 (with userId, session2Id)
  // Adjust field names as needed!
  const assigned = await this.prisma.userSession2.findMany({
    where: { session2Id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePic: true,
          role: true,
        },
      },
    },
  });
  // Return just the users:
  return assigned.map(item => item.user);
}
// session2.service.ts

async removeUserFromSession(session2Id: number, userId: number) {
  return this.prisma.userSession2.deleteMany({
    where: {
      session2Id,
      userId,
    },
  });
}
async updateStatus(id: number, status: string) {
  if (!['ACTIVE', 'INACTIVE', 'COMPLETED', 'ARCHIVED'].includes(status)) {
    throw new BadRequestException('Invalid status');
  }
  return this.prisma.session2.update({
    where: { id },
    data: { status: { set: status as $Enums.Session2Status } }, // ✅ CORRECT!
  });
}
}
