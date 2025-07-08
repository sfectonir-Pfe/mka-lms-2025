import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class ChatbotMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  userId?: number | string;

  @IsOptional()
  @IsString()
  userLanguage?: string;
}



export class ChatMemoryDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class ClearMemoryDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}