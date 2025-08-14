import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateRéclamationDto, ReclamationStatus } from './dto/create-réclamation.dto';
import { UpdateRéclamationDto } from './dto/update-réclamation.dto';

@Injectable()
export class RéclamationService {
  constructor(private prisma: PrismaService) {}

  async create(createRéclamationDto: CreateRéclamationDto) {
    return this.prisma.reclamation.create({
      data: createRéclamationDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.reclamation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const reclamation = await this.prisma.reclamation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!reclamation) {
      throw new NotFoundException(`Réclamation with ID ${id} not found`);
    }

    return reclamation;
  }

  async update(id: number, updateRéclamationDto: UpdateRéclamationDto) {
    const existingReclamation = await this.prisma.reclamation.findUnique({
      where: { id }
    });

    if (!existingReclamation) {
      throw new NotFoundException(`Réclamation with ID ${id} not found`);
    }

    const updateData: any = { ...updateRéclamationDto };
    
    // If response is being added, set responseDate
    if (updateRéclamationDto.response && !existingReclamation.response) {
      updateData.responseDate = new Date();
    }

    return this.prisma.reclamation.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const existingReclamation = await this.prisma.reclamation.findUnique({
      where: { id }
    });

    if (!existingReclamation) {
      throw new NotFoundException(`Réclamation with ID ${id} not found`);
    }

    return this.prisma.reclamation.delete({
      where: { id }
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.reclamation.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByStatus(status: string) {
    return this.prisma.reclamation.findMany({
      where: { status: status as ReclamationStatus },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
