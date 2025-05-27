import { Controller, Get, Post, Body, Patch, Param, Delete,UploadedFile, UseInterceptors} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma'; // or your local path
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './session.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './uploads/sessions',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
@Post()
@UseInterceptors(FileInterceptor('image', { storage }))
async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
  const { startDate, endDate, level, ...rest } = body;

  return this.sessionsService.create({
    ...rest,
    level: level || "Basique",
    startDate: startDate || null,
    endDate: endDate || null,
    imageUrl: file ? `http://localhost:8000/uploads/sessions/${file.filename}` : null,
  });
}

 

  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }
  @Delete(':id')
remove(@Param('id') id: string) {
  return this.sessionsService.remove(+id);
}
@Patch(':id')
@UseInterceptors(FileInterceptor('image', { storage }))
async update(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any
) {
  return this.sessionsService.update(+id, body, file);
}
@Get('program/:programId')
getByProgram(@Param('programId') programId: string) {
  return this.sessionsService.findByProgramId(+programId);
}


}