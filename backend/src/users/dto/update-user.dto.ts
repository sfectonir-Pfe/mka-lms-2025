import { IsOptional, IsString, MinLength, IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  // Email modifiable ? généralement non, on peut l’exclure ici

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  skills?: string[] | string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  profilePic?: string; // Optional, handled from file in controller
}
