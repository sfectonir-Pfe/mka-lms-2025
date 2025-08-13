import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt } from 'class-validator';

export enum ReclamationPriority {
  HAUTE = 'HAUTE',
  MOYENNE = 'MOYENNE',
  BASSE = 'BASSE'
}

export enum ReclamationStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
  REJETE = 'REJETE'
}

export class CreateRéclamationDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(ReclamationPriority)
  @IsOptional()
  priority?: ReclamationPriority = ReclamationPriority.MOYENNE;

  @IsEnum(ReclamationStatus)
  @IsOptional()
  status?: ReclamationStatus = ReclamationStatus.EN_ATTENTE;
}
