import { IsInt } from 'class-validator';

export class CreateProgramModuleDto {
  @IsInt()
  programId: number;

  @IsInt()
  moduleId: number;
}
