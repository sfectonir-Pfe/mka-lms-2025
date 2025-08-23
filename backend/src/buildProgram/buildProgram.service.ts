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
    const buildPrograms = await this.prisma.buildProgram.findMany({
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

    const buildProgramsWithRatings = await Promise.all(
      buildPrograms.map(async (buildProgram) => {
        const sessions = await this.prisma.session2.findMany({
          where: { programId: buildProgram.programId },
        });

        let totalRating = 0;
        let totalFeedbacks = 0;

        for (const session of sessions) {
          const feedbacks = await this.prisma.sessionFeedback.findMany({
            where: { sessionId: session.id },
            select: { rating: true, comments: true },
          });

          feedbacks.forEach(fb => {
            let ratingsData = null;
            try {
              if (fb.comments) {
                const parsedComments = JSON.parse(fb.comments);
                ratingsData = parsedComments.ratings;
              }
            } catch (error) {
              console.error('Error parsing comments for ratings:', error);
            }
            
            const score = this.calculateWeightedScore(ratingsData);
            if (score > 0) {
              totalRating += score;
              totalFeedbacks++;
            }
          });
        }

        const averageRating = totalFeedbacks > 0
          ? Math.round((totalRating / totalFeedbacks) * 10) / 10
          : null;

        return {
          ...buildProgram,
          averageRating,
          sessionCount: sessions.length,
          feedbackCount: totalFeedbacks,
        };
      })
    );

    return buildProgramsWithRatings;
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
  const buildProgram = await this.prisma.buildProgram.findFirst({
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

  // if (!buildProgram) return null;
  if (!buildProgram) {
  return {
    id: null,
    programId,
    program: { id: +programId, title: "Programme inconnu" },
    modules: [],
    averageRating: null,
    sessionCount: 0,
    feedbackCount: 0,
  };
}


  const sessions = await this.prisma.session2.findMany({
    where: { programId: buildProgram.programId },
  });

  let totalRating = 0;
  let totalFeedbacks = 0;

  for (const session of sessions) {
    const feedbacks = await this.prisma.sessionFeedback.findMany({
      where: { sessionId: session.id },
      select: { rating: true, comments: true },
    });

    feedbacks.forEach(fb => {
      let ratingsData = null;
      try {
        if (fb.comments) {
          const parsedComments = JSON.parse(fb.comments);
          ratingsData = parsedComments.ratings;
        }
      } catch (error) {
        console.error('Error parsing comments for ratings:', error);
      }
      
      const score = this.calculateWeightedScore(ratingsData);
      if (score > 0) {
        totalRating += score;
        totalFeedbacks++;
      }
    });
  }

  const averageRating = totalFeedbacks > 0
    ? Math.round((totalRating / totalFeedbacks) * 10) / 10
    : null;

  return {
    ...buildProgram,
    averageRating,
    sessionCount: sessions.length,
    feedbackCount: totalFeedbacks,
  };
}

  private processFrontendRatings(ratings: any): any {
    if (!ratings || typeof ratings !== 'object') return {};

    const emojiMap: Record<string, number> = {
      '😞': 1,
      '😐': 2,
      '🙂': 3,
      '😊': 4,
      '🤩': 5
    };

    const processed: any = {};
    Object.entries(ratings).forEach(([key, value]) => {
      if (typeof value === 'string' && emojiMap[value]) {
        processed[key] = emojiMap[value];
      } else if (typeof value === 'number') {
        processed[key] = value;
      }
    });

    return processed;
  }

  private calculateWeightedScore(ratings: any): number {
    if (!ratings) return 0;

    try {
      const ratingsData = typeof ratings === 'string' ? JSON.parse(ratings) : ratings;

      if (!ratingsData || typeof ratingsData !== 'object') return 0;

      const processedRatings = this.processFrontendRatings(ratingsData);

      const validRatings = Object.values(processedRatings)
        .filter(rating => typeof rating === 'number' && rating >= 1 && rating <= 5) as number[];

      if (validRatings.length === 0) return 0;

      const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
      const average = sum / validRatings.length;
      
      return Math.round(average * 10) / 10;
    } catch (error) {
      console.error('Erreur lors du calcul du score moyen:', error);
      return 0;
    }
  }

}
