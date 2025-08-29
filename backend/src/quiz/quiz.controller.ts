import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../auth/roles.decorator';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  @Roles('CreateurDeFormation','Admin')
  @Post()
  create(@Body() body: any) {
    return this.quizService.create(body);
  }

  @Roles('CreateurDeFormation','Admin','etudiant','formateur')
  @Get()
  findAll() {
    return this.quizService.findAll();
  }
  @Roles('CreateurDeFormation','Admin','etudiant','formateur')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(Number(id));
  }

  @Roles('CreateurDeFormation','Admin','etudiant','formateur')
  @Get('by-contenu/:contenuId')
  getQuizByContenu(@Param('contenuId') contenuId: string) {
    return this.quizService.getQuizWithQuestions(Number(contenuId));
  }

  @Roles('CreateurDeFormation','Admin')
  @Patch('by-contenu/:contenuId')
  updateByContenuId(
    @Param('contenuId') contenuId: string,
    @Body() data: any,
  ) {
    return this.quizService.updateByContenuId(Number(contenuId), data);
  }

  // Image upload for question/choice media
  @Roles('CreateurDeFormation','Admin')
  @Post('upload-question-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
      fileFilter: (req, file, cb) => {
        const ok = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.mimetype);
        cb(ok ? null : new Error('Only images are allowed'), ok);
      },
    }),
  )
  uploadQuestionImage(@UploadedFile() file: Express.Multer.File) {
    const base = process.env.APP_BASE_URL || 'http://localhost:8000';
    return { imageUrl: `${base}/uploads/${file.filename}` };
  }
// ---- Submit & results (by quizId) ----
  
  @Roles('CreateurDeFormation','Admin',)
  @Post(':id/submit')
  submitQuiz(@Param('id') quizId: string, @Body() body: any) {
    return this.quizService.submitQuiz(Number(quizId), body);
  }

  @Roles('CreateurDeFormation','Admin')
  @Get(':id/user-answers')
  getUsersByQuiz(@Param('id') quizId: string) {
    return this.quizService.getUsersByQuiz(Number(quizId));
  }

  // ---- Submit & results (by contenuId) ----
  @Roles('CreateurDeFormation','Admin')
  @Post('by-contenu/:contenuId/submit')
  submitByContenu(@Param('contenuId') contenuId: string, @Body() body: any) {
    return this.quizService.submitByContenu(Number(contenuId), body);
  }

  @Roles('CreateurDeFormation','Admin','etudiant','formateur')
  @Get('by-contenu/:contenuId/user-answers')
  getUsersByContenu(@Param('contenuId') contenuId: string) {
    return this.quizService.getUsersByContenu(Number(contenuId));
  }

  // ---- History by user ----
  @Roles('CreateurDeFormation','Admin')
  @Get('user/:userId')
  getQuizzesByUser(@Param('userId') userId: string) {
    return this.quizService.getQuizzesByUser(Number(userId));
  }
}


