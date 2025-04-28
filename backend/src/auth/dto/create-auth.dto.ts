import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
export class CreateAuthDto {}

export class loginDto{
    @ApiProperty()
    email:string
    @ApiProperty()
    password:string
}
export class RegisterDto{
    @ApiProperty()
    email:string
    @ApiProperty()
    password:string
    @ApiProperty()
    role:Role
}
