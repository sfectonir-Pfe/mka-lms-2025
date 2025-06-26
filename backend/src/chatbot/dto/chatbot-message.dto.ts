import { IsString, IsNotEmpty } from 'class-validator';

export class ChatbotMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}