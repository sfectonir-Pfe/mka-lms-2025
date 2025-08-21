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
import { Public } from './public.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService, 
    
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
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const result = await this.authService.login(dto);
      return {
        success: true,
        message: 'Connexion réussie',
        data: {
          ...result,
          rememberMe: dto.rememberMe || false,
        }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Échec de la connexion',
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.authService.register(dto);
      return { success: true, message: 'Utilisateur créé', data: user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Échec de l\'enregistrement',
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
  @Public()
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
  @Public()
  @Post('reset-password')
  async reset(@Body() dto: ResetPassword) {
    try {
      const result = await this.authService.resetPassword(dto.token, dto.newPass, dto.confirmPass);
      return { success: true, message: 'Mot de passe réinitialisé', data: result };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur de réinitialisation',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto & { sendNotification?: boolean }) {
    try {
      const result = await this.authService.changePassword(
        changePasswordDto.email,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword,
        changePasswordDto.sendNotification
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
      // No JWT invalidation yet; just a placeholder
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
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Public()
  @Post('send-email-code')
  sendEmailCode(@Body('email') email: string) {
    return this.authService.sendEmailVerificationCode(email);
  }
  @Public()
  @Post('verify-email-code')
  async verifyEmailCode(
    @Body('email') email: string,
    @Body('code') code: string
  ) {
    const { user } = await this.authService.verifyEmailCode(email, code);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);  // <-- sign directly

    return {
      success: true,
      message: 'Email verified successfully',
      data: { access_token, user },
    };
  }
}
  

