import { PartialType } from '@nestjs/swagger';
import { CreatebuildProgramDto } from './create-buildProgram.dto';

export class UpdatebuildProgramDto extends PartialType(CreatebuildProgramDto) {}
