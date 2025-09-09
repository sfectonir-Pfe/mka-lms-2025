import { Controller, Get, Post, Body, Patch, Param, Delete,UploadedFile, UseInterceptors} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma'; // or your local path
import { CreatebuildProgramDto } from './dto/create-buildProgram.dto';
import { UpdatebuildProgramDto } from './dto/update-buildProgram.dto';
import { buildProgramService } from './buildProgram.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../auth/roles.decorator';

const storage = diskStorage({
  destination: './uploads/sessions',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('buildProgram')
export class buildProgramController {
  constructor(private readonly buildProgramService: buildProgramService) {}
@Roles('createurdeformation',)
@Post()
@UseInterceptors(FileInterceptor('image', { storage }))
async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
  const { startDate, endDate, level, ...rest } = body;

  return this.buildProgramService.create({
    ...rest,
    level: level || "Basique",
    startDate: startDate || null,
    endDate: endDate || null,
    imageUrl: file ? `http://localhost:8000/uploads/sessions/${file.filename}` : null,
  });
}

 
@Roles('createurdeformation', 'admin', 'etudiant','formateur','Etablissement' )
  @Get()
  findAll() {
    return this.buildProgramService.findAll();
  }
@Roles('createurdeformation', )
  @Delete(':id')
remove(@Param('id') id: string) {
  return this.buildProgramService.remove(+id);
}
@Roles('createurdeformation', )
@Patch(':id')
@UseInterceptors(FileInterceptor('image', { storage }))
async update(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any
) {
  return this.buildProgramService.update(+id, body, file);
}
@Roles('createurdeformation', 'admin', 'etudiant','formateur','Etablissement' )
@Get('program/:programId')
getByProgram(@Param('programId') programId: string) {
  return this.buildProgramService.findByProgramId(+programId);
}


}