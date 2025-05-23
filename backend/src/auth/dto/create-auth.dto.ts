import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {}

export class LoginDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'Email requis' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mot de passe requis' })
    password: string;
    
    @ApiProperty()
    @IsNotEmpty({ message: 'captcha requis' })
    captcha: string;
}

export class RegisterDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'Email requis' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mot de passe requis' })
    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Rôle requis' })
    role: Role;

    @ApiProperty({ required: false })
    name?: string;
}

export class ChangePasswordDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: 'Email requis' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mot de passe actuel requis' })
    currentPassword: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Nouveau mot de passe requis' })
    @MinLength(6, { message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' })
    newPassword: string;
}
