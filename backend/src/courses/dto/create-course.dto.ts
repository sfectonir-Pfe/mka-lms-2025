import { IsNotEmpty, IsEnum, IsString, IsInt } from 'class-validator';
import { CourseType } from '@prisma/client';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(CourseType)
  type: CourseType;

  @IsNotEmpty()
  @IsString()
  fileUrl: string;

  @IsNotEmpty()
  @IsInt()
  moduleId: number;
}
