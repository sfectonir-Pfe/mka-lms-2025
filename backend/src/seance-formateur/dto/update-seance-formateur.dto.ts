import { PartialType } from '@nestjs/swagger';
import { CreateSeanceFormateurDto } from './create-seance-formateur.dto';

export class UpdateSeanceFormateurDto extends PartialType(CreateSeanceFormateurDto) {}
