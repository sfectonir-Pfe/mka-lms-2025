import { IsInt, IsString, IsOptional, IsArray, IsObject, IsNumber } from 'class-validator';

export class CreateSessionFeedbackDto {
  @IsInt()
  sessionId: number;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsString()
  sessionComments?: string;

  @IsOptional()
  @IsString()
  trainerComments?: string;

  @IsOptional()
  @IsString()
  teamComments?: string;

  @IsOptional()
  @IsString()
  suggestions?: string;

  @IsOptional()
  @IsObject()
  ratings?: any;

  @IsOptional()
  @IsString()
  sessionDuration?: string;

  @IsOptional()
  @IsString()
  wouldRecommend?: string;

  @IsOptional()
  @IsString()
  wouldAttendAgain?: string;

  @IsOptional()
  @IsArray()
  strongestAspects?: string[];

  @IsOptional()
  @IsArray()
  improvementAreas?: string[];

  @IsOptional()
  @IsString()
  overallComments?: string;

  @IsOptional()
  @IsString()
  bestAspects?: string;

  @IsOptional()
  @IsString()
  additionalTopics?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  timestamp?: string;
}
