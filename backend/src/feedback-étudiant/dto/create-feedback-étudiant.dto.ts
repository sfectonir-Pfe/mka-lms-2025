import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateFeedbackÉtudiantDto {
  @IsNotEmpty()
  @IsNumber()
  toStudentId: number;

  @IsNotEmpty()
  @IsString()
  groupId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsString()
  category: string; // 'collaboration', 'communication', 'participation', 'qualité_travail'

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean = false;
}
