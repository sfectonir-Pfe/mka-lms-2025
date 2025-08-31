// src/modules/modules.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification-gateway'; // path as needed

@Injectable()
export class ModulesService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(dto: any) {
    // 1. Create the module as usual
    const module = await this.prisma.module.create({ data: dto });

    // 2. Fetch only admin users
    const users = await this.prisma.user.findMany({
      where: { role: 'Admin' }
    });

    // 3. For each user, create notification and emit socket event
    for (const user of users) {
  const notification = await this.notificationService.createNotification({
    userId: user.id,
    type: 'info',
    message: `Nouveau module ajouté: ${module.name} (${new Date().toLocaleDateString()})`,
  });
  // createNotification already sends real-time notification
}

    return module;
  }





  findAll() {
    return this.prisma.module.findMany({
      include: {
        programs: {
          include: {
            program: {
              select: {
                name: true
              }
            }
          }
        },
        buildProgramModules: {
          include: {
            buildProgram: {
              include: {
                program: {
                  select: {
                    name: true
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
    return this.prisma.module.delete({ where: { id } });
  }
  

}