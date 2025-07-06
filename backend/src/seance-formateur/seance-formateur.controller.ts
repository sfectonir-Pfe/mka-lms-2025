// src/seance-formateur/seance-formateur.controller.ts

import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { SeanceFormateurService } from './seance-formateur.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4'];

const storage = diskStorage({
  destination: './uploads/seance-media',
  filename: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Type de fichier non supporté'), '');
    }
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

@Controller('seance-formateur')
export class SeanceFormateurController {
  constructor(private readonly service: SeanceFormateurService) {}

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const formateurId = req.user?.id || body.formateurId;
    return this.service.create(body, formateurId);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get('formateur/:id')
  async findByFormateur(@Param('id') id: string) {
    return this.service.findByFormateur(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post(':id/upload-media')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadMediaToSeance(
    @Param('id') seanceId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const { type } = body;
    if (!file) throw new Error('Aucun fichier reçu');
    return this.service.addMediaToSeance({
      seanceId: Number(seanceId),
      type,
      fileUrl: `http://localhost:8000/uploads/seance-media/${file.filename}`,
    });
  }

  
  @Delete('media/:id')
  async removeMedia(@Param('id') id: string) {
    return this.service.removeMedia(+id);
  }

  @Get('details/:session2Id')
  async getSessionDetails(@Param('session2Id') id: string) {
    return this.service.getSession2Details(+id);
  }
  // seance-formateur.controller.ts
@Get(':id/media')
async getMedia(@Param('id') id: string) {
  return this.service.getMediaForSeance(+id);
}
@Get('session/:session2Id')
async findBySession2(@Param('session2Id') id: string) {
  return this.service.findBySession2(+id);
}

}
