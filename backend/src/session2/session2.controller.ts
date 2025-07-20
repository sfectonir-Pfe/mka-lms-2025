import {
  Controller, Get, Post, Body, Param, Delete, UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Session2Service } from './session2.service';
import { Patch, } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

const storage = diskStorage({
  destination: './uploads/sessions',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('session2')
export class Session2Controller {
  constructor(
    private readonly service: Session2Service,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    try {
      console.log('🔍 Session2 controller - Received request body:', body);
      const result = await this.service.create(body, file);
      console.log('✅ Session2 controller - Success:', result);
      return result;
    } catch (error) {
      console.error('❌ Session2 controller - Error:', error.message);
      console.error('❌ Session2 controller - Stack:', error.stack);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('simple')
  findAllSimple() {
    return this.prisma.session2.findMany({
      select: { id: true, name: true, createdAt: true }
    });
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
  // GET /session2/:session2Id/users
@Get(':session2Id/users')
async getSessionUsers(@Param('session2Id') session2Id: string) {
  return this.service.getUsersForSession(Number(session2Id));
}
// In your session2.controller.ts
@Delete(':session2Id/remove-user/:userId')
async removeUserFromSession(
  @Param('session2Id') session2Id: string,
  @Param('userId') userId: string
) {
  return this.service.removeUserFromSession(Number(session2Id), Number(userId));
}


// ...inside Session2Controller
@Patch(':id/status')
async updateStatus(
  @Param('id') id: string,
  @Body('status') status: string
) {
  return this.service.updateStatus(Number(id), status);
}

}
