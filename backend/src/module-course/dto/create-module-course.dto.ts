import { IsInt } from 'class-validator';

export class CreateModuleCourseDto {
  @IsInt()
  moduleId: number;

  @IsInt()
  courseId: number;
}
