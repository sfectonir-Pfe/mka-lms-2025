import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';



@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProgramDto) {
    return this.prisma.program.create({ data });
  }

  findAll() {
    return this.prisma.program.findMany();
  }

  findOne(id: number) {
    return this.prisma.program.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateProgramDto) {
    return this.prisma.program.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.program.delete({ where: { id } });
  }
}