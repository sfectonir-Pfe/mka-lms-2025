import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateContenuDto } from './dto/create-contenu.dto';

@Injectable()
export class ContenusService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateContenuDto) {
    const { courseIds, ...contenuData } = data;

    console.log('Creating content with data:', contenuData);

    const created = await this.prisma.contenu.create({
      data: contenuData,
    });

    if (courseIds?.length) {
      await this.prisma.courseContenu.createMany({
        data: courseIds.map((courseId) => ({
          courseId,
          contenuId: created.id,
        })),

      });
    }


    return created;
  }
  

  findAll() {
    return this.prisma.contenu.findMany({
      include: { courseContenus: true },
    });
  }

  remove(id: number) {
    return this.prisma.contenu.delete({ where: { id } });
  }
  // async update(id: number, data: any) {
  // return this.prisma.contenu.update({
  //   where: { id },
  //   data: {
  //     title: data.title,
  //     type: data.type,
  //     fileType: data.fileType,
  //   },
  // });
 

}


