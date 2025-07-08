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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SeanceFormateurService } from './seance-formateur.service';

// Configure Multer for media uploads
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
   // UPLOAD IMAGE/VIDEO
  @Post(':id/upload-media')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadMediaToSeance(
    @Param('id') seanceId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    const { type } = body; // IMAGE ou VIDEO
    if (!file) throw new Error('Aucun fichier reçu');
    return this.service.addMediaToSeance({
      seanceId: Number(seanceId),
      type,
      fileUrl: `http://localhost:8000/uploads/seance-media/${file.filename}`,
    });
  }

  // GET all media for a séance
  @Get(':id/media')
  async getMediaForSeance(@Param('id') seanceId: string) {
    return this.service.getMediaForSeance(Number(seanceId));
  }

  // DELETE a media file
  @Delete('media/:mediaId')
  async removeMedia(@Param('mediaId') mediaId: string) {
    return this.service.removeMedia(Number(mediaId));
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    try {
      console.log('Received body:', body);
      const formateurId = req.user?.id || body.formateurId;
      console.log('Using formateurId:', formateurId);
      
      if (!formateurId) {
        return { error: 'formateurId is required', status: 400 };
      }
      
      // Validate required fields
      const { title, startTime, buildProgramId } = body;
      if (!title || !startTime || !buildProgramId) {
        return { 
          error: 'Missing required fields: title, startTime, buildProgramId', 
          status: 400,
          received: { title, startTime, buildProgramId }
        };
      }
      
      return await this.service.create(body, formateurId);
    } catch (error) {
      console.error('Controller error:', error);
      return { 
        error: error.message || 'Internal server error', 
        status: 500,
        details: error.stack
      };
    }
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get('debug/all')
  async debugAll() {
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
@Get('details/:buildProgramId')
async getDetails(@Param('buildProgramId') id: string) {
  return this.service.getProgramDetails(+id); 
}
// Dans seance-formateur.controller.ts
@Get('programs-by-formateur/:formateurId')
async getProgramsByFormateur(@Param('formateurId') formateurId: string) {
  return this.service.getProgramsByFormateur(+formateurId);
}

}
