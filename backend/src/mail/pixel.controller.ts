// src/mail/pixel.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('track')
export class PixelController {
  @Get('open')
  handlePixelOpen(@Query('email') email: string, @Res({ passthrough: false }) res: Response) {
    console.log(`📬 Tracking pixel triggered by: ${email}`);

    // Respond with a 1x1 transparent PNG
    const img = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
      'base64'
    );
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', img.length.toString());
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(img);
  }
}
