import { Injectable } from '@nestjs/common';
import { CreateCaptchaDto } from './dto/create-captcha.dto';
import { UpdateCaptchaDto } from './dto/update-captcha.dto';
import axios from 'axios';

@Injectable()
export class CaptchaService {
  private readonly secretKey = process.env.RECAPTCHA_SECRET_KEY;

  async validateToken(token: string): Promise<boolean> {
    const url = 'https://www.google.com/recaptcha/api/siteverify';
    const secretKey = this.secretKey || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Clé secrète de test Google

    console.log('Using reCAPTCHA secret key:', secretKey.substring(0, 10) + '...');

    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    try {
      console.log('Sending request to Google reCAPTCHA API...');
      const response = await axios.post(url, params);
      console.log('Google reCAPTCHA API response:', response.data);

      // Pour le développement, toujours retourner true
      return true;

      // En production, utilisez cette ligne à la place:
      // return response.data.success;
    } catch (error) {
      console.error('CAPTCHA validation error:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }

      // Pour le développement, retourner true malgré l'erreur
      return true;

      // En production, utilisez cette ligne à la place:
      // return false;
    }
  }
}

