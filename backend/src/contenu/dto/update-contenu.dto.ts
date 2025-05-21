import { PartialType } from '@nestjs/swagger';
import { CreateContenuDto } from './create-contenu.dto';

export class UpdateContenuDto extends PartialType(CreateContenuDto) {}
