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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ChangePasswordDto, ResetPassword } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }
  
  @Post('verify')
  async verifyAccount(@Body() body: { email: string }) {
    try {
      const user = await this.authService.getUserByEmail(body.email);
      return { 
        success: true, 
        message: 'Compte vérifié avec succès', 
        data: { user } 
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la vérification du compte',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      console.log('Login request received:', {
        email: dto.email,
        rememberMe: dto.rememberMe,

      });



      // Authentifier l'utilisateur
      const result = await this.authService.login(dto);

      // Ajouter une information sur rememberMe dans la réponse
      return {
        success: true,
        message: 'Connexion réussie',
        data: {
          ...result,
          rememberMe: dto.rememberMe || false,
          // Ajouter un access_token fictif pour le moment (à remplacer par un vrai JWT plus tard)
          access_token: `temp_token_${Date.now()}_${dto.rememberMe ? 'long' : 'short'}`
        }
      };
    } catch (error) {
      console.error('Login error:', error);
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
  


  @Post('logout')
  async logout(@Body() body?: any) {
    try {
      console.log('Logout request received');

      // Pour le moment, le logout est simple car nous n'utilisons pas de JWT
      // Dans une vraie application avec JWT, on invaliderait le token ici

      return {
        success: true,
        message: 'Déconnexion réussie',
        data: {
          loggedOut: true,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new HttpException(
        error.message || 'Erreur lors de la déconnexion',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('update-user')
async updateUser(@Body() body: { email: string }) {
  try {
    const result = await this.authService.verifyUser(body.email);
    return { success: true, message: 'Utilisateur mis à jour', data: result };
  } catch (error) {
    throw new HttpException(
      error.message || 'Erreur lors de la mise à jour',
      error.status || HttpStatus.BAD_REQUEST
    );
  }
}

}
