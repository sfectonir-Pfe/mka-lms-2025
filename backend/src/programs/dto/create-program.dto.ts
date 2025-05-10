import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramDto {
  @ApiProperty({ example: 'Web Development Bootcamp' })
  name: string;
}
