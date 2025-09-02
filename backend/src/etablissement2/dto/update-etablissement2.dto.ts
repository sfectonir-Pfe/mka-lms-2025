import { PartialType } from '@nestjs/swagger';
import { CreateEtablissement2Dto } from './create-etablissement2.dto';

export class UpdateEtablissement2Dto extends PartialType(CreateEtablissement2Dto) {}
