import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotFoundException, BadRequestException } from '@nestjs/common';
@Injectable()
export class Session2Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, file?: Express.Multer.File) {
    console.log('🔍 Session2 create - Received data:', data);
    console.log('🔍 Session2 create - File:', file?.filename);
    
    const { name, programId, startDate, endDate } = data;
    
    console.log('🔍 Session2 create - Extracted fields:', { name, programId, startDate, endDate });

    try {
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

      console.log('🔍 Session2 create - Program structure found:', !!programStructure);
      if (programStructure) {
        console.log('🔍 Session2 create - Modules count:', programStructure.modules?.length || 0);
      }

      if (!programStructure) {
        console.error('❌ Session2 create - No program structure found for programId:', programId);
        throw new Error("Structure du programme introuvable.");
      }

      console.log('🔍 Session2 create - Creating session2 record...');
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
      console.log('🔍 Session2 create - Session2 created with ID:', session2.id);

      console.log('🔍 Session2 create - Creating modules and courses...');
      for (const mod of programStructure.modules) {
        console.log('🔍 Session2 create - Processing module:', mod.moduleId);
        const s2mod = await this.prisma.session2Module.create({
          data: {
            session2Id: session2.id,
            moduleId: mod.moduleId,
          },
        });

        for (const course of mod.courses) {
          console.log('🔍 Session2 create - Processing course:', course.courseId);
          const s2course = await this.prisma.session2Course.create({
            data: {
              session2ModuleId: s2mod.id,
              courseId: course.courseId,
            },
          });

          for (const ct of course.contenus) {
            console.log('🔍 Session2 create - Processing contenu:', ct.contenuId);
            await this.prisma.session2Contenu.create({
              data: {
                session2CourseId: s2course.id,
                contenuId: ct.contenuId,
              },
            });
          }
        }
      }

      console.log('✅ Session2 create - Successfully created session with all structure');
      return { message: "✅ Session2 créée avec structure copiée avec succès" };
    } catch (error) {
      console.error('❌ Session2 create - Error:', error.message);
      console.error('❌ Session2 create - Stack:', error.stack);
      throw error;
    }
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
}
