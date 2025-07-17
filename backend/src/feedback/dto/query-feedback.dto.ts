import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFeedbackDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  senderId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  receiverId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}