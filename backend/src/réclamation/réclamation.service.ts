import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateRéclamationDto, ReclamationStatus } from './dto/create-réclamation.dto';
import { UpdateRéclamationDto } from './dto/update-réclamation.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class RéclamationService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

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

    if (!existingReclamation) {
      throw new NotFoundException(`Réclamation with ID ${id} not found`);
    }

    const updateData: any = { ...updateRéclamationDto };
    
    // If response is being added, set responseDate
    if (updateRéclamationDto.response && !existingReclamation.response) {
      updateData.responseDate = new Date();
    }

    // Check if status is being changed to RESOLU
    const isStatusChangedToResolved = 
      updateRéclamationDto.status === ReclamationStatus.RESOLU && 
      existingReclamation.status !== ReclamationStatus.RESOLU;

    console.log(`🔍 Vérification du changement de statut pour la réclamation ${id}:`);
    console.log(`   - Ancien statut: ${existingReclamation.status}`);
    console.log(`   - Nouveau statut: ${updateRéclamationDto.status}`);
    console.log(`   - Changement vers RESOLU: ${isStatusChangedToResolved}`);

    const updatedReclamation = await this.prisma.reclamation.update({
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

    console.log(`📧 Informations utilisateur pour l'email:`);
    console.log(`   - Email: ${updatedReclamation.user?.email}`);
    console.log(`   - Nom: ${updatedReclamation.user?.name}`);
    console.log(`   - Sujet: ${updatedReclamation.subject}`);
    console.log(`   - Réponse: ${updatedReclamation.response}`);

    // Send email notification if status changed to RESOLU
    if (isStatusChangedToResolved && updatedReclamation.user?.email && updatedReclamation.user?.name) {
      console.log(`🚀 Tentative d'envoi d'email de résolution...`);
      try {
        await this.mailService.sendReclamationResolvedEmail(
          updatedReclamation.user.email,
          updatedReclamation.user.name,
          updatedReclamation.subject,
          updatedReclamation.response ? updatedReclamation.response : undefined
        );
        console.log(`✅ Email de résolution envoyé avec succès à ${updatedReclamation.user.email} pour la réclamation ${id}`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'envoi de l'email de résolution pour la réclamation ${id}:`, error);
        console.error(`   - Détails de l'erreur:`, error.message);
        console.error(`   - Stack trace:`, error.stack);
        // Ne pas faire échouer la mise à jour si l'email ne peut pas être envoyé
      }
    } else {
      console.log(`⚠️ Conditions non remplies pour l'envoi d'email:`);
      console.log(`   - Changement vers RESOLU: ${isStatusChangedToResolved}`);
      console.log(`   - Email utilisateur: ${!!updatedReclamation.user?.email}`);
      console.log(`   - Nom utilisateur: ${!!updatedReclamation.user?.name}`);
    }

    return updatedReclamation;
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
