import { FileType, ContenuType } from '@prisma/client';
import { IsEnum, IsInt, IsString, IsUrl } from 'class-validator';

export class CreateContenuDto {
  @IsString()
  title: string;

  @IsUrl()
  fileUrl: string;

  @IsEnum(FileType)
  fileType: FileType;

  @IsEnum(ContenuType)
  type: ContenuType;

  @IsInt()
  courseId: number;
}
