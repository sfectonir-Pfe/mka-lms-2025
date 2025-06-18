import { Module } from '@nestjs/common';
import { SeanceFormateurService } from './seance-formateur.service';
import { SeanceFormateurController } from './seance-formateur.controller';

@Module({
  controllers: [SeanceFormateurController],
  providers: [SeanceFormateurService],
})
export class SeanceFormateurModule {}
