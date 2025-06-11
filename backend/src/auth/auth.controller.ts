import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ChangePasswordDto, ResetPassword } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBody, ApiProperty } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const result = await this.authService.login(dto);
      return { success: true, message: 'Connexion réussie', data: result };
    } catch (error) {
      throw new HttpException(
        error.message || 'Échec de la connexion',
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.authService.register(dto);
      return { success: true, message: 'Utilisateur créé', data: user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Échec de l’enregistrement',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.authService.findAll();
      return { success: true, data: users };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.authService.findOne(id);
      return { success: true, data: user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Utilisateur non trouvé',
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAuthDto: UpdateAuthDto,
  ) {
    try {
      const user = await this.authService.update(id, updateAuthDto);
      return { success: true, message: 'Utilisateur mis à jour', data: user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la mise à jour',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('users/:id')
  async remove(@Param('id') id: number) {
    try {
      const result = await this.authService.remove(id);
      return { success: true, message: 'Utilisateur supprimé', data: result };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la suppression',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('forgot-password')
  async forgot(@Body('email') email: string) {
    try {
      const result = await this.authService.forgotPassword(email);
      return { success: true, message: 'Email de réinitialisation envoyé', data: result };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la demande',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('reset-password')

  async reset(
  
    @Body() dto:ResetPassword
  ) {
    try {
      const result = await this.authService.resetPassword(dto.token,dto. newPass,dto.confirmPass);
      return { success: true, message: 'Mot de passe réinitialisé', data: result };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur de réinitialisation',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {
      const result = await this.authService.changePassword(
        changePasswordDto.email,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword
      );
      return { success: true, message: 'Mot de passe changé avec succès', data: result };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors du changement de mot de passe',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post('verify')
async verifyUser(@Body('email') email: string) {
  try {
    const result = await this.authService.verifyUser(email);
    return { success: true, message: 'Utilisateur vérifié', data: result };
  } catch (error) {
    throw new HttpException(
      error.message || 'Erreur de vérification',
      error.status || HttpStatus.BAD_REQUEST,
    );
  }
}

}
