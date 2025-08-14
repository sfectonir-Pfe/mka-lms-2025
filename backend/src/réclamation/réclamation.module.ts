import { Module } from '@nestjs/common';
import { RéclamationService } from './réclamation.service';
import { RéclamationController } from './réclamation.controller';

@Module({
  controllers: [RéclamationController],
  providers: [RéclamationService],
  exports: [RéclamationService],
})
export class RéclamationModule {}
