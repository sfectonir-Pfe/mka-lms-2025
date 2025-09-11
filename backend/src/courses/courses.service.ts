import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { PrismaService } from 'nestjs-prisma';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification-gateway';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(data: CreateCourseDto) {
    // 1. Create the course
    const course = await this.prisma.course.create({ data });

    // 2. Fetch only admin users
    const users = await this.prisma.user.findMany({
      where: { role: 'Admin' }
    });

    // 3. For each user, create and emit notification
    for (const user of users) {
      const notification = await this.notificationService.createNotification({
        userId: user.id,
        type: 'info',
        message: `Nouveau cours ajouté: ${course.title} (${new Date().toLocaleDateString()})`,
      });
      // createNotification already sends real-time notification
    }

    return course;
  }

  findAll() {
    return this.prisma.course.findMany({
      include: {
        modules: {
          include: {
            module: {
              select: { name: true }
            }
          }
        },
        buildProgramCourses: {
          include: {
            buildProgramModule: {
              include: {
                module: { select: { name: true } }
              }
            }
          }
        }
      }
    });
  }

  remove(id: number) {
    return this.prisma.course.delete({ where: { id } });
  }
}
