import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { FileType, ContenuType } from '@prisma/client';

export class CreateContenuDto {
  @IsString()
  title: string;

  @IsString()
  fileUrl: string;

  @IsEnum(FileType)
  fileType: FileType;

  @IsEnum(ContenuType)
  type: ContenuType;

  @IsArray()
  @IsOptional()
  courseIds?: number[];
}
