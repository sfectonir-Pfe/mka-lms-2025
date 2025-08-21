import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class Etablissement2Service {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    console.log('Creating Etablissement2:', name);
    return this.prisma.etablissement2.create({
      data: { name },
    });
  }

  async findAll() {
    return this.prisma.etablissement2.findMany();
  }
}
