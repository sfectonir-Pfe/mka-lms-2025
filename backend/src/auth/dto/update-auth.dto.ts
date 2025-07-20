import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateAuthDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
