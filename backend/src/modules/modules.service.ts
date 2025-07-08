import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateModuleDto } from './dto/create-module.dto';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateModuleDto) {
    return this.prisma.module.create({ data });
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