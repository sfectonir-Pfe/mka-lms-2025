import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { FileType, ContenuType } from '@prisma/client';

export class CreateContenuDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsEnum(FileType)
  @IsOptional()
  fileType?: FileType;

  @IsEnum(ContenuType)
  type: ContenuType;

  @IsArray()
  @IsOptional()
  courseIds?: number[];
}
