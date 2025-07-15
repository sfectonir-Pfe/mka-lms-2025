import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSeanceFeedbackDto {
  @IsInt()
  seanceId: number;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsInt()
  sessionRating: number;

  @IsInt()
  contentQuality: number;

  @IsString()
  sessionDuration: string;

  @IsInt()
  sessionOrganization: number;

  @IsInt()
  objectivesAchieved: number;

  @IsInt()
  trainerRating: number;

  @IsInt()
  trainerClarity: number;

  @IsInt()
  trainerAvailability: number;

  @IsInt()
  trainerPedagogy: number;

  @IsInt()
  trainerInteraction: number;

  @IsInt()
  teamRating: number;

  @IsInt()
  teamCollaboration: number;

  @IsInt()
  teamParticipation: number;

  @IsInt()
  teamCommunication: number;

  @IsString()
  @IsOptional()
  sessionComments?: string;

  @IsString()
  @IsOptional()
  trainerComments?: string;

  @IsString()
  @IsOptional()
  teamComments?: string;

  @IsString()
  @IsOptional()
  suggestions?: string;

  @IsString()
  @IsOptional()
  wouldRecommend?: string;

  @IsString()
  @IsOptional()
  improvementAreas?: string;
} 