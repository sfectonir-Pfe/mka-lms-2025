// src/seance-formateur/seance-formateur.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FileType } from '@prisma/client';

// DTOs pour typage fort
interface CreateSeanceDto {
  title: string;
  startTime: string | Date;
  session2Id: number;
}

interface AddMediaDto {
  seanceId: number;
  type: FileType;
  fileUrl: string;
}

@Injectable()
export class SeanceFormateurService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSeanceDto, formateurId: number): Promise<{ message: string; seanceId: number }> {
    const { title, startTime, session2Id } = data;
    if (!title || !startTime || !session2Id || !formateurId) {
      throw new BadRequestException('Tous les champs sont obligatoires');
    }
    try {
      const seance = await this.prisma.seanceFormateur.create({
        data: {
          title,
          startTime: new Date(startTime),
          session2Id: Number(session2Id),
          formateurId,
        },
      });
      return { message: 'Séance créée ✅', seanceId: seance.id };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Une séance avec ces paramètres existe déjà');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Référence invalide - vérifiez que l\'utilisateur et le programme existent');
      }
      throw new BadRequestException(error.message || 'Erreur lors de la création de la séance');
    }
  }

  async findAll(): Promise<any[]> {
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

  async findByFormateur(formateurId: number): Promise<any[]> {
    if (!formateurId) throw new BadRequestException('formateurId requis');
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

  async findOne(id: number): Promise<any> {
    if (!id) throw new BadRequestException('id requis');
    const seance = await this.prisma.seanceFormateur.findUnique({
      where: { id },
      include: {
        formateur: true,
        session2: {
          include: { program: true },
        },
      },
    });
    if (!seance) throw new NotFoundException('Séance non trouvée');
    return seance;
  }

  async remove(id: number): Promise<{ message: string }> {
    if (!id) throw new BadRequestException('id requis');
    await this.prisma.seanceFormateur.delete({ where: { id } });
    return { message: 'Séance supprimée 🗑️' };
  }

  async getSession2Details(session2Id: number): Promise<any> {
    if (!session2Id) throw new BadRequestException('session2Id requis');
    const session2 = await this.prisma.session2.findUnique({
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
    if (!session2) throw new NotFoundException('Session2 non trouvée');
    return session2;
  }

  async addMediaToSeance(data: AddMediaDto): Promise<any> {
    const { seanceId, type, fileUrl } = data;
    if (!seanceId || !type || !fileUrl) {
      throw new BadRequestException('Tous les champs sont obligatoires pour le média');
    }
    return this.prisma.seanceMedia.create({
      data: { seanceId, type, fileUrl },
    });
  }

  async removeMedia(id: number): Promise<any> {
    if (!id) throw new BadRequestException('id requis');
    return this.prisma.seanceMedia.delete({ where: { id } });
  }

  async getMediaForSeance(seanceId: number): Promise<any[]> {
    if (!seanceId) throw new BadRequestException('seanceId requis');
    return this.prisma.seanceMedia.findMany({ where: { seanceId } });
  }

  async findBySession2(session2Id: number): Promise<any[]> {
    if (!session2Id) throw new BadRequestException('session2Id requis');
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

  async getProgramVisibility(seanceId: number): Promise<{ visible: boolean }> {
    if (!seanceId) throw new BadRequestException('seanceId requis');
    const seance = await this.prisma.seanceFormateur.findUnique({
      where: { id: seanceId },
      select: { programVisible: true },
    });
    if (!seance) throw new NotFoundException('Séance non trouvée');
    return { visible: seance.programVisible || false };
  }

  async setProgramVisibility(seanceId: number, visible: boolean): Promise<{ message: string; visible: boolean }> {
    if (!seanceId) throw new BadRequestException('seanceId requis');
    if (typeof visible !== 'boolean') throw new BadRequestException('visible doit être un booléen');
    
    await this.prisma.seanceFormateur.update({
      where: { id: seanceId },
      data: { programVisible: visible },
    });
    
    return { 
      message: visible ? 'Programme visible aux étudiants ✅' : 'Programme masqué aux étudiants 🔒',
      visible 
    };
  }
}
