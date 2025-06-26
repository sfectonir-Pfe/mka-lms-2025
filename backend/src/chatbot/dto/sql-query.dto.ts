import { IsString, IsNotEmpty } from 'class-validator';

export class SqlQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}