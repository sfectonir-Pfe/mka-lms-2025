import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { PeriodUnit } from '@prisma/client';

export class CreateModuleDto {
  @IsString()
  name: string;

  @IsEnum(PeriodUnit)
  periodUnit: PeriodUnit;

  @IsInt()
  duration: number;

  @IsOptional()
  @IsInt()
  programId?: number;
}
