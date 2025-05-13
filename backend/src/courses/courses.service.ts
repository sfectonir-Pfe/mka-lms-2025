import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto) {
    // Step 1: create course
    const course = await this.prisma.course.create({
      data: {
        title: data.title,
      },
    });

    // Step 2: link to module via ModuleCourse
    if (data.moduleId) {
      await this.prisma.moduleCourse.create({
        data: {
          courseId: course.id,
          moduleId: data.moduleId,
        },
      });
    }

    return course;
  }

  findAll() {
    return this.prisma.course.findMany({
      include: { modules: true, contenus: true },
    });
  }

  async findByModule(moduleId: number) {
    const links = await this.prisma.moduleCourse.findMany({
      where: { moduleId },
      include: { course: true },
    });

    return links.map((mc) => mc.course);
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { contenus: true },
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: number, dto: UpdateCourseDto) {
    await this.findOne(id);

    return this.prisma.course.update({
      where: { id },
      data: {
        title: dto.title,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.course.delete({ where: { id } });
  }
}
