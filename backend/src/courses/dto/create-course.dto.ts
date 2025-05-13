import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  moduleId?: number; // used for ModuleCourse link
}
