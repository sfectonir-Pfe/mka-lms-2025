import { IsString, IsNumber } from 'class-validator';

export class CreateFeedbackResponseDto {
  @IsString()
  response: string;

  @IsNumber()
  responderId: number;
}