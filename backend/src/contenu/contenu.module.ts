import { Module } from '@nestjs/common';
import { ContenusService } from './contenu.service';
import { ContenusController } from './contenu.controller';

@Module({
  controllers: [ContenusController],
  providers: [ContenusService],
})
export class ContenuModule {}
