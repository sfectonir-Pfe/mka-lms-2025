import { IsNotEmpty, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsInt()
  programId: number;
}
