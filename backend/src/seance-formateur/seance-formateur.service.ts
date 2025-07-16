// src/seance-formateur/seance-formateur.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SeanceFormateurService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, formateurId: number) {
    const { title, startTime, session2Id } = data;

    const seance = await this.prisma.seanceFormateur.create({
      data: {
        title,
        startTime: new Date(startTime),
        session2Id: Number(session2Id),
        formateurId,
      },
    });

    return { message: 'Séance créée ✅', seanceId: seance.id };
  }

  async findAll() {
    return this.prisma.seanceFormateur.findMany({
      include: {
        formateur: true,
        session2: {
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
        session2: {
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
        session2: {
          include: { program: true },
        },
      },
    });
  }

  async remove(id: number) {
    await this.prisma.seanceFormateur.delete({ where: { id } });
    return { message: 'Séance supprimée 🗑️' };
  }

  async getSession2Details(session2Id: number) {
    return this.prisma.session2.findUnique({
      where: { id: session2Id },
      include: {
        program: true,
        session2Modules: {
          include: {
            module: true,
            courses: {
              include: {
                course: true,
                contenus: { include: { contenu: true } },
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

 

  async removeMedia(id: number) {
    return this.prisma.seanceMedia.delete({ where: { id } });
  }
  // seance-formateur.service.ts
async getMediaForSeance(seanceId: number) {
  return this.prisma.seanceMedia.findMany({ where: { seanceId } });
}
// Get all séances for a specific session2Id
async findBySession2(session2Id: number) {
  return this.prisma.seanceFormateur.findMany({
    where: { session2Id },
    include: {
      formateur: true,
      session2: {
        include: { program: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}


}
