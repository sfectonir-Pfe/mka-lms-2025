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

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() body: any) {
    return this.quizService.create(body);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(Number(id));
  }

  @Get('by-contenu/:contenuId')
  getQuizByContenu(@Param('contenuId') contenuId: string) {
    return this.quizService.getQuizWithQuestions(Number(contenuId));
  }

  @Patch('by-contenu/:contenuId')
  updateByContenuId(
    @Param('contenuId') contenuId: string,
    @Body() data: any,
  ) {
    return this.quizService.updateByContenuId(Number(contenuId), data);
  }

  // Image upload for question/choice media
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
}
