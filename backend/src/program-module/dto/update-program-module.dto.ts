import { PartialType } from '@nestjs/swagger';
import { CreateProgramModuleDto } from './create-program-module.dto';

export class UpdateProgramModuleDto extends PartialType(CreateProgramModuleDto) {}
