import { IsOptional, IsEnum, IsInt, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChoiceDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  isCorrect: number;
}

export class CreateQuestionDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsEnum(['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'IMAGE_CHOICE'])
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'IMAGE_CHOICE';

  @IsInt()
  score: number;

  @IsOptional()
  @IsInt()
  negativeMark?: number;

  @IsOptional()
  @IsString()
  correctText?: string; // For FILL_BLANK

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChoiceDto)
  choices: CreateChoiceDto[]; // Optional for FILL_BLANK
}

export class CreateQuizDto {
  @IsInt()
  contenuId: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  timeLimit?: number; // in seconds

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

