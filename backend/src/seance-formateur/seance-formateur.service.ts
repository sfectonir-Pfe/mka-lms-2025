import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SeanceFormateurService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, formateurId: number) {
    const { title, startTime, buildProgramId } = data;

    const seance = await this.prisma.seanceFormateur.create({
      data: {
        title,
        startTime: new Date(startTime),
        buildProgramId: Number(buildProgramId),
        formateurId,
      },
    });

    return { message: 'Séance créée ✅', seanceId: seance.id };
  }

  async findAll() {
    return this.prisma.seanceFormateur.findMany({
      include: {
        formateur: true,
        buildProgram: {
          include: { program: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFormateur(formateurId: number) {
    return this.prisma.seanceFormateur.findMany({
      where: { formateurId },
      include: {
        buildProgram: {
          include: { program: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  async findOne(id: number) {
  return this.prisma.seanceFormateur.findUnique({
    where: { id },
    include: {
      formateur: true,
      buildProgram: {
        include: { program: true },
      },
    },
  });
}
async remove(id: number) {
  await this.prisma.seanceFormateur.delete({ where: { id } });
  return { message: 'Séance supprimée 🗑️' };
}
async getProgramDetails(buildProgramId: number) {
  return this.prisma.buildProgram.findUnique({
    where: { id: buildProgramId },
    select: {
      program: {
        select: { name: true },
      },
      seancesFormateur: {
        select: {
          id: true,
          title: true,
          startTime: true,
          formateur: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      modules: {
        select: {
          id: true,
          module: {
            select: { name: true },
          },
          courses: {
            select: {
              id: true,
              course: {
                select: { title: true },
              },
              contenus: {
                select: {
                  id: true,
                  contenu: {
                    select: {
                      title: true,
                      fileUrl: true, 
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });


}
// Dans seance-formateur.service.ts
async getProgramsByFormateur(formateurId: number) {
  // 1. Récupérer tous les buildProgramId où ce formateur a des séances
  const seances = await this.prisma.seanceFormateur.findMany({
    where: { formateurId },
    select: { buildProgramId: true },
  });

  const buildProgramIds = Array.from(new Set(seances.map((s) => s.buildProgramId)));

  // 2. Renvoyer les programmes + modules/cours/contenus liés
  return this.prisma.buildProgram.findMany({
    where: { id: { in: buildProgramIds } },
    include: {
      program: true,
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
}
async addMediaToSeance({ seanceId, type, fileUrl }) {
  return this.prisma.seanceMedia.create({
    data: { seanceId, type, fileUrl },
  });
}

async getMediaForSeance(seanceId: number) {
  return this.prisma.seanceMedia.findMany({ where: { seanceId } });
}

async removeMedia(id: number) {
  // (optionnel: supprime le fichier du disque aussi)
  return this.prisma.seanceMedia.delete({ where: { id } });
}


}
