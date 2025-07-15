import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, IsEnum } from 'class-validator';

export enum FeedbackType {
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement',
  COMPLAINT = 'complaint',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class CreateGeneralFeedbackDto {
  @IsEnum(FeedbackType)
  feedbackType: FeedbackType;

  @IsEnum(Priority)
  priority: Priority;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  stepsToReproduce?: string;

  @IsOptional()
  @IsString()
  expectedBehavior?: string;

  @IsOptional()
  @IsString()
  actualBehavior?: string;

  @IsOptional()
  @IsString()
  browser?: string;

  @IsOptional()
  @IsString()
  device?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsBoolean()
  allowContact?: boolean;

  @IsOptional()
  @IsNumber()
  userId?: number;
} 