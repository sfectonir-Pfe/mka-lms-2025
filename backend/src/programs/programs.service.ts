import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProgramDto) {
    return this.prisma.program.create({ data });
  }

  async findAll() {
    return this.prisma.program.findMany();
  }

  async remove(id: number) {
    return this.prisma.program.delete({ where: { id } });
  }
}