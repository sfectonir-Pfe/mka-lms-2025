import { IsString, IsOptional, IsNumber, IsArray, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  senderId?: number;

  @IsOptional()
  @IsNumber()
  receiverId?: number;
}