import {
  Controller, Get, Post, Body, Param, Delete, UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Session2Service } from './session2.service';

const storage = diskStorage({
  destination: './uploads/sessions',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('session2')
export class Session2Controller {
  constructor(private readonly service: Session2Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    return this.service.create(body, file);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
  @Post(':session2Id/add-user')
  async addUserToSession(
    @Param('session2Id') session2Id: string,
    @Body('email') email: string,
  ) {
    return this.service.addUserToSession(Number(session2Id), email);
  }
}
