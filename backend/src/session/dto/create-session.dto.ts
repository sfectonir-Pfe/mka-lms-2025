import { IsArray, IsDateString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionContenuDto {
  @IsInt()
  contenuId: number;
}

export class CreateSessionCourseDto {
  @IsInt()
  courseId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionContenuDto)
  contenus: CreateSessionContenuDto[];
}

export class CreateSessionModuleDto {
  @IsInt()
  moduleId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionCourseDto)
  courses: CreateSessionCourseDto[];
}

export class CreateSessionDto {
  @IsInt()
  programId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionModuleDto)
  modules: CreateSessionModuleDto[];
}
