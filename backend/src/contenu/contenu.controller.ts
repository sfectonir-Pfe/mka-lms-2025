import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ContenusService } from './contenu.service';
import { CreateContenuDto } from './dto/create-contenu.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const unique = `${Date.now()}${extname(file.originalname)}`;
    cb(null, unique);
  },
});


@Controller('contenus')
export class ContenusController {
  constructor(private readonly contenusService: ContenusService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    const payload = {
      ...body,
      fileUrl: `http://localhost:8000/uploads/${file.filename}`,
      courseIds: body.courseIds ? JSON.parse(body.courseIds) : [],
    };
    return this.contenusService.create(payload);
  }

  @Get()
  findAll() {
    return this.contenusService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contenusService.remove(+id);
  }
}
