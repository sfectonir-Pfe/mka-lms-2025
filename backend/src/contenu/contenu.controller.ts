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
import { Roles } from '../auth/roles.decorator';

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

  @Roles('CreateurDeFormation', )
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    const { title, type, fileType, courseIds } = body;

    // Vérifier si un fichier a été téléchargé
    if (!file && (type === 'Cours' || type === 'Exercice')) {
      throw new Error('Un fichier est requis pour les types de contenu Cours et Exercice');
    }

    // Préparer les données pour la création du contenu
    const contentData = {
      title,
      type,
      // Toujours fournir une valeur pour fileUrl et fileType
      fileType: file ? fileType : 'PDF', // Valeur par défaut pour fileType
      fileUrl: file
        ? `http://localhost:8000/uploads/${file.filename}`
        : 'placeholder.pdf', // Valeur par défaut pour fileUrl
      courseContenus: {
        create: courseIds && courseIds !== 'undefined' && courseIds !== 'null'
          ? (() => {
              try {
                const parsedIds = JSON.parse(courseIds);
                console.log('Parsed courseIds:', parsedIds);
                return parsedIds.map((courseId: string | number) => ({
                  course: { connect: { id: typeof courseId === 'string' ? parseInt(courseId) : courseId } },
                }));
              } catch (error) {
                console.error('Error parsing courseIds:', error);
                return [];
              }
            })()
          : [],
      },
    };

    console.log('Creating content with data:', contentData);

    // Use service method to trigger notifications
    const newContenu = await this.contenusService.create({
      title,
      type,
      fileType: file ? fileType : 'PDF',
      fileUrl: file ? `http://localhost:8000/uploads/${file.filename}` : 'placeholder.pdf',
      courseIds: courseIds && courseIds !== 'undefined' && courseIds !== 'null'
        ? (() => {
            try {
              const parsedIds = JSON.parse(courseIds);
              return parsedIds.map((id: string | number) => typeof id === 'string' ? parseInt(id) : id);
            } catch (error) {
              console.error('Error parsing courseIds:', error);
              return [];
            }
          })()
        : []
    });

    return newContenu;
  }

  @Roles('CreateurDeFormation', 'Admin','etudiant','formateur','Etablissement')
  @Get()
  findAll() {
    return this.contenusService.findAll();
  }

  @Roles('CreateurDeFormation', )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contenusService.remove(+id);
  }
 
  @Roles('CreateurDeFormation','formateur')
@Patch(':id/publish')
updatePublishStatus(@Param('id') id: string, @Body() body: { published: boolean }) {
  return this.contenusService.updatePublishStatus(+id, body.published);
}



}
