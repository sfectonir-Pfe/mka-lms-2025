import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCourseDto) {
    return this.prisma.course.create({ data });
  }

  findAll() {
    return this.prisma.course.findMany();
  }

  findByModule(moduleId: number) {
    return this.prisma.course.findMany({ where: { moduleId } });
  }

  findOne(id: number) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateCourseDto) {
    return this.prisma.course.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.course.delete({ where: { id } });
  }
  
}
