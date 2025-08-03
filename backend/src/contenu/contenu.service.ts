

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateContenuDto } from './dto/create-contenu.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification-gateway';

@Injectable()
export class ContenusService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(data: CreateContenuDto) {
    const { courseIds, ...contenuData } = data;

    const created = await this.prisma.contenu.create({
      data: contenuData,
    });

    if (courseIds?.length) {
      await this.prisma.courseContenu.createMany({
        data: courseIds.map((courseId) => ({
          courseId,
          contenuId: created.id,
        })),
      });
    }

    // 🔔 Notify all users
    const users = await this.prisma.user.findMany();
    for (const user of users) {
      const notification = await this.notificationService.createNotification({
        userId: user.id,
        type: 'info',
        message: `Nouveau contenu ajouté : ${created.title} (${new Date().toLocaleDateString()})`,
        link: null,
      });
      this.notificationGateway.sendRealTimeNotification(user.id, notification);
    }

    return created;
  }

  

  findAll() {
    return this.prisma.contenu.findMany({
      include: {
        courseContenus: {
          include: {
            course: {
              select: {
                title: true
              }
            }
          }
        },
        buildProgramContenus: {
          include: {
            buildProgramCourse: {
              include: {
                course: {
                  select: {
                    title: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  remove(id: number) {
    return this.prisma.contenu.delete({ where: { id } });
  }
  // async update(id: number, data: any) {
  // return this.prisma.contenu.update({
  //   where: { id },
  //   data: {
  //     title: data.title,
  //     type: data.type,
  //     fileType: data.fileType,
  //   },
  // });
 // contenu.service.ts
 async updatePublishStatus(id: number, published: boolean) {
  return this.prisma.contenu.update({
    where: { id },
    data: { published },
  });
}

async publishContenu(id: number) {
  const contenu = await this.prisma.contenu.findUnique({
    where: { id },
  });

  if (!contenu) {
    throw new NotFoundException('Contenu non trouvé');
  }

  const updated = await this.prisma.contenu.update({
    where: { id },
    data: { published: !contenu.published },
  });

  return {
    message: `Contenu ${updated.published ? 'publié' : 'dépublié'} avec succès ✅`,
    contenu: updated,
  };
}




}


