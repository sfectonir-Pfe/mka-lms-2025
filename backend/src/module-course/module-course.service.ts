import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateModuleCourseDto } from './dto/create-module-course.dto';

@Injectable()
export class ModuleCourseService {
  constructor(private readonly prisma: PrismaService) {}

  async assign(dto: CreateModuleCourseDto) {
    const exists = await this.prisma.moduleCourse.findUnique({
      where: {
        moduleId_courseId: {
          moduleId: dto.moduleId,
          courseId: dto.courseId,
        },
      },
    });

    if (exists) {
      throw new ConflictException('Course already assigned to module');
    }

    return this.prisma.moduleCourse.create({ data: dto });
  }

  findAll() {
    return this.prisma.moduleCourse.findMany({
      include: {
        module: true,
        course: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.moduleCourse.delete({ where: { id } });
  }
}
