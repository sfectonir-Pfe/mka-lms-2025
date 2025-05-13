import { Module } from '@nestjs/common';
import { ContenusService } from './contenus.service';
import { ContenusController } from './contenus.controller';

@Module({
  controllers: [ContenusController],
  providers: [ContenusService],
})
export class ContenusModule {}
