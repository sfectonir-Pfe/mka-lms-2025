import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
export class CreateAuthDto {}

export class LoginDto{
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
    @ApiProperty({ required: false })
    name?:string
}
