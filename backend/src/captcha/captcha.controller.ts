import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CreateCaptchaDto } from './dto/create-captcha.dto';
import { UpdateCaptchaDto } from './dto/update-captcha.dto';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Post('verify')
  async verifyToken(@Body('token') token: string) {
    console.log('Received reCAPTCHA verification request with token:', token ? token.substring(0, 20) + '...' : 'undefined');

    if (!token) {
      console.log('Token is missing in the request');
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log('Validating token with Google reCAPTCHA API...');
      const isValid = await this.captchaService.validateToken(token);
      console.log('Token validation result:', isValid);

      // Pour le développement, toujours retourner success: true
      return { success: true };

      // En production, utilisez cette ligne à la place:
      // return { success: isValid };
    } catch (error) {
      console.error('Error verifying reCAPTCHA token:', error);

      // Pour le développement, retourner success: true malgré l'erreur
      console.log('Returning success: true despite error (development only)');
      return { success: true };

      // En production, utilisez ces lignes à la place:
      // throw new HttpException('Failed to verify reCAPTCHA token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



}
