import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateContenuDto } from './dto/create-contenu.dto';
import { UpdateContenuDto } from './dto/update-contenu.dto';
import { PrismaService } from 'nestjs-prisma';
@Injectable()
export class ContenusService {
  constructor(private readonly prisma: PrismaService){}

  create(createContenuDto: CreateContenuDto) {
   return this.prisma.contenu.create({ data:createContenuDto});
  }

  findAll() {
    return this.prisma.contenu.findMany();
  }

  async findOne(id: number) {
    const contenu = await this.prisma.contenu.findUnique({ where: { id } });
    if (!contenu) throw new NotFoundException('Contenu not found');
    return contenu;
  }

  async update(id: number, dto: UpdateContenuDto) {
    await this.findOne(id); // ensures it exists
    return this.prisma.contenu.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // ensures it exists
    return this.prisma.contenu.delete({ where: { id } });
  }
}