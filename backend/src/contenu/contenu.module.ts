import { Module } from '@nestjs/common';
import { ContenusService } from './contenu.service';
import { ContenusController } from './contenu.controller';
import { PrismaService } from 'nestjs-prisma';
@Module({
  controllers: [ContenusController],
  providers: [ContenusService, PrismaService],
})
export class ContenuModule {}
