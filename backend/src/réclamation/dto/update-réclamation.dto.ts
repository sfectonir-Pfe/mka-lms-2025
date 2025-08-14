import { PartialType } from '@nestjs/swagger';
import { CreateRéclamationDto, ReclamationStatus } from './create-réclamation.dto';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateRéclamationDto extends PartialType(CreateRéclamationDto) {
  @IsString()
  @IsOptional()
  response?: string;

  @IsEnum(ReclamationStatus)
  @IsOptional()
  status?: ReclamationStatus;
}
