import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsIn(['message-new', 'info', 'warning', 'success', 'error'])
  type: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  link?: string | null;
}
