import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCourseDto) {
    return this.prisma.course.create({ data });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: {
        modules: {
          include: {
            module: {
              select: {
                name: true
              }
            }
          }
        },
        buildProgramCourses: {
          include: {
            buildProgramModule: {
              include: {
                module: {
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
    return this.prisma.course.delete({ where: { id } });
  }
 

}
