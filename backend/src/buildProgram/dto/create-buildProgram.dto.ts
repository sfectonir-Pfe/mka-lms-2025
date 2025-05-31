import { IsArray, IsDateString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatebuildProgramContenuDto {
  @IsInt()
  contenuId: number;
}

export class CreatebuildProgramCourseDto {
  @IsInt()
  courseId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatebuildProgramContenuDto)
  contenus: CreatebuildProgramContenuDto[];
}

export class CreatebuildProgramModuleDto {
  @IsInt()
  moduleId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatebuildProgramCourseDto)
  courses: CreatebuildProgramCourseDto[];
}

export class CreatebuildProgramDto {
  @IsInt()
  programId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatebuildProgramModuleDto)
  modules: CreatebuildProgramModuleDto[];
}
