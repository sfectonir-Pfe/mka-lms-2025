import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateFeedbackFormateurDto {
  @IsInt()
  formateurId: number;

  @IsInt()
  etudiantId: number;

  @IsString()
  emoji: string;

  @IsOptional()
  @IsString()
  commentaire?: string;
}
