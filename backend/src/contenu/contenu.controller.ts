import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,Patch,
} from '@nestjs/common';
import { ContenusService } from './contenu.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from 'nestjs-prisma';

const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.mp4', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Type de fichier non supporté'), '');
    }
    const unique = `${Date.now()}${ext}`;
    cb(null, unique);
  },
});


@Controller('contenus')
export class ContenusController {
  constructor(
    private readonly contenusService: ContenusService,
    private readonly prisma: PrismaService // ✅ Injected properly
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    const { title, type, fileType, courseIds } = body;

    const newContenu = await this.prisma.contenu.create({
      data: {
        title,
        type,
        fileType: file ? fileType : null,
        fileUrl: file ? `http://localhost:8000/uploads/${file.filename}` : null,
        courseContenus: {
          create: courseIds
            ? JSON.parse(courseIds).map((courseId) => ({
                course: { connect: { id: courseId } },
              }))
            : [],
        },
      },
    });

    return newContenu;
  }

  @Get()
  findAll() {
    return this.contenusService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contenusService.remove(+id);
  }
 
@Patch(':id/publish')
updatePublishStatus(@Param('id') id: string, @Body() body: { published: boolean }) {
  return this.contenusService.updatePublishStatus(+id, body.published);
}



}
