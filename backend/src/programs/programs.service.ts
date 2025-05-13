import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProgramDto) {
    return this.prisma.program.create({
      data: {
        name: data.name,
      },
    });
  }

  findAll() {
    return this.prisma.program.findMany({
      include: {
        modules: {
          include: {
            module: true, // fetch actual module info
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        modules: {
          include: { module: true },
        },
      },
    });

    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async update(id: number, data: UpdateProgramDto) {
    await this.findOne(id); // ensure exists
    return this.prisma.program.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // ensure exists
    return this.prisma.program.delete({ where: { id } });
  }
}
