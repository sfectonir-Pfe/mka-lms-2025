import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsEnum, IsNumber } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsString()
  @IsOptional()
  skills?: string;

@IsOptional()
  session2Ids?: number[];

  // ✅ add these two ↓↓↓
  @IsOptional()
  @IsNumber()
  etablissement2Id?: number;

  @IsOptional()
  @IsString()
  etablissement2Name?: string;

}